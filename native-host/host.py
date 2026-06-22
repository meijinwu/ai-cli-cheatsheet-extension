#!/usr/bin/env python3
"""Native Messaging host for safe, schema-validated cheatsheet updates."""

import atexit
import datetime
import glob
import hashlib
import http.client
import json
import os
import re
import secrets
import shutil
import signal
import ssl
import struct
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.error
import urllib.request

# Track the active claude subprocess so it can be cleaned up if host.py is killed.
_active_proc = None


def _kill_active_proc():
    global _active_proc
    proc = _active_proc
    if proc is not None and proc.poll() is None:
        try:
            proc.kill()
            proc.wait(timeout=5)
        except (OSError, subprocess.TimeoutExpired):
            pass


atexit.register(_kill_active_proc)


def _sigterm_handler(signum, frame):
    _kill_active_proc()
    sys.exit(0)


signal.signal(signal.SIGTERM, _sigterm_handler)


HOST_ACTIONS = {
    "ping",
    "add_tool",
    "preview_update",
    "apply_update",
    "discard_update",
    "remove_tool",
}
TOOL_ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")
VALID_CATEGORIES = {"shortcut", "slash", "flag"}
RESERVED_TOOL_IDS = {"index"}
MAX_MESSAGE_BYTES = 1024 * 1024
MAX_ITEMS = 2000
MAX_FIELD_LENGTH = 4000
MIN_KEYWORDS = 3
MAX_KEYWORDS = 8
MAX_EXAMPLES = 3
DANGEROUS_EXAMPLE_RE = re.compile(
    r"(?:\brm(?:\s|$)|\bdd\s+(?:if|of|bs|count|conv|status|seek|skip)=|\b(?:reset\s+--hard|push\s+--force|kill\s+-9|chmod|chown|restart|shutdown|reboot|halt|poweroff|mkfs)\b|--(?:delete|yolo)\b|dangerously-bypass\b|:\(\)\s*\{\s*:)|(^|\s)>(?!>)",
    re.IGNORECASE,
)
POSSIBLE_SECRET_RE = re.compile(
    r"api[_-]?key|secret|token\s*[=:]\s*[a-z0-9_-]{12,}", re.IGNORECASE
)
# 镜像 shared/validation-rules.json，由 tests/test_validation_consistency.js 防漂移。
SOURCE_TIERS = {"official", "quasi-official", "community"}
EXAMPLE_SOURCE_TYPES = {"official", "quasi-official", "manual", "ai-derived"}
SOURCE_KINDS = {
    "local-help", "official-doc", "official-repository", "release-notes",
    "authoritative-reference", "community",
}
AUTHORSHIPS = {"official", "editorial", "generated"}
EVIDENCE_TIERS = {"first-party", "authoritative-community", "community", "none"}
ADAPTATIONS = {"verbatim", "adapted", "scenario-derived"}
EVIDENCE_STATUSES = {"verified", "partial", "unverified"}
EVIDENCE_CLAIMS = {"existence", "semantics", "platform", "example"}
UPDATE_POLICIES = {"version-driven", "release-driven", "manual-only"}

# Only tools with a useful local version command belong here. Stable keymaps and
# long-lived command references intentionally have no executable probe.
TOOL_VERSION_COMMANDS = {
    "claude-code": (("claude", "--version"),),
    "codex": (("codex", "--version"),),
    "gemini-cli": (("gemini", "--version"),),
    "openclaw": (("openclaw", "--version"),),
    "opencode": (("opencode", "--version"),),
}


def load_source_registry():
    registry_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "shared",
        "source-registry.json",
    )
    with open(registry_path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    entries = payload.get("entries")
    if not isinstance(entries, list) or not entries:
        raise RuntimeError("shared/source-registry.json 缺少 entries")
    return entries


SOURCE_REGISTRY = load_source_registry()
SOURCE_REGISTRY_BY_ID = {entry["id"]: entry for entry in SOURCE_REGISTRY}
AUTHORITATIVE_SOURCE_PREFIXES = tuple(
    prefix
    for entry in SOURCE_REGISTRY
    if entry.get("kind") == "authoritative-reference"
    for prefix in entry.get("urlPrefixes", [])
)
OFFICIAL_REPOSITORY_PREFIXES = tuple(
    prefix
    for entry in SOURCE_REGISTRY
    if entry.get("kind") == "official-repository"
    for prefix in entry.get("urlPrefixes", [])
)
QUASI_OFFICIAL_DOMAINS = tuple(sorted({
    urllib.parse.urlparse(prefix).hostname.removeprefix("www.")
    for prefix in AUTHORITATIVE_SOURCE_PREFIXES
    if urllib.parse.urlparse(prefix).hostname
}))


def host_in_quasi_official_whitelist(url):
    """类官方来源的 sourceUrl 主机名必须命中白名单，否则视为不可信。"""
    if not url:
        return False
    try:
        host = urllib.parse.urlparse(url).hostname or ""
    except ValueError:
        return False
    host = host.lower()
    return any(host == domain or host.endswith(f".{domain}") for domain in QUASI_OFFICIAL_DOMAINS)


def url_matches_prefixes(url, prefixes):
    return bool(url) and any(url == prefix.rstrip("/") or url.startswith(prefix) for prefix in prefixes)


def matching_registry_entry(tool_id, registry_id, kind, url):
    entry = SOURCE_REGISTRY_BY_ID.get(registry_id)
    if not entry or tool_id not in entry.get("toolIds", []) or entry.get("kind") != kind:
        return None
    if kind == "local-help":
        return entry
    return entry if url_matches_prefixes(url, entry.get("urlPrefixes", [])) else None


def validate_source_ids(value, field, known_ids):
    if value is None:
        return []
    if not isinstance(value, list) or not value:
        raise ValidationError(f"{field} 必须是非空数组")
    clean = []
    for index, source_id in enumerate(value):
        source_id = checked_text(source_id, f"{field}[{index}]")
        if source_id not in known_ids:
            raise ValidationError(f"{field}[{index}] 引用了不存在的来源：{source_id}")
        if source_id not in clean:
            clean.append(source_id)
    return clean


def validate_evidence_refs(value, field, known_ids, source_by_id):
    if value is None:
        return []
    if not isinstance(value, list) or not value:
        raise ValidationError(f"{field} 必须是非空数组")
    clean = []
    seen = set()
    for index, ref in enumerate(value):
        if not isinstance(ref, dict):
            raise ValidationError(f"{field}[{index}] 必须是对象")
        ref_field = f"{field}[{index}]"
        source_id = checked_text(ref.get("sourceId"), f"{ref_field}.sourceId")
        if source_id not in known_ids:
            raise ValidationError(f"{ref_field}.sourceId 引用了不存在的来源：{source_id}")
        claims = ref.get("claims")
        if not isinstance(claims, list) or not claims:
            raise ValidationError(f"{ref_field}.claims 必须是非空数组")
        clean_claims = []
        for claim in claims:
            if claim not in EVIDENCE_CLAIMS:
                raise ValidationError(f"{ref_field}.claims 包含非法断言：{claim}")
            if claim not in clean_claims:
                clean_claims.append(claim)
        source = source_by_id[source_id]
        if source.get("evidenceTier") == "community" and any(
            claim in {"existence", "semantics"} for claim in clean_claims
        ):
            raise ValidationError(f"{ref_field} 的社区来源不能证明命令存在性或语义")
        locator = checked_text(ref.get("locator"), f"{ref_field}.locator")
        checked_at = checked_text(ref.get("checkedAt"), f"{ref_field}.checkedAt")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", checked_at):
            raise ValidationError(f"{ref_field}.checkedAt 必须是 YYYY-MM-DD")
        key = (source_id, tuple(clean_claims), locator)
        if key in seen:
            continue
        seen.add(key)
        clean.append({
            "sourceId": source_id,
            "claims": clean_claims,
            "locator": locator,
            "checkedAt": checked_at,
        })
    return clean


def evidence_status_for(refs):
    if not refs:
        return "unverified"
    claims = {claim for ref in refs for claim in ref.get("claims", [])}
    if {"existence", "semantics"}.issubset(claims):
        return "verified"
    return "partial"


def _version_key(path):
    version = next(
        (
            part for part in reversed(os.path.normpath(path).split(os.sep))
            if re.fullmatch(r"v?\d+(?:[.-]\d+)*(?:[-.][0-9A-Za-z]+)*", part)
        ),
        "0",
    )
    return tuple(
        (0, int(part)) if part.isdigit() else (1, part)
        for part in re.split(r"[.-]", version.lstrip("v"))
    )


def executable_search_dirs(platform=None, env=None, home=None):
    """Return deterministic executable directories without starting a login shell."""
    platform = platform or sys.platform
    env = env or os.environ
    home = os.path.expanduser(home or "~")
    directories = []

    def add(path):
        if not path:
            return
        expanded = os.path.expandvars(os.path.expanduser(path))
        normalized = os.path.normpath(expanded)
        if normalized not in directories:
            directories.append(normalized)

    path_separator = ";" if platform == "win32" else os.pathsep
    for path in (env.get("PATH") or "").split(path_separator):
        add(path)
    for path in (env.get("AICLI_EXTRA_PATH") or "").split(path_separator):
        add(path)

    if platform == "win32":
        appdata = env.get("APPDATA", "")
        localappdata = env.get("LOCALAPPDATA", "")
        program_files = env.get("ProgramFiles", r"C:\Program Files")
        add(env.get("NVM_SYMLINK"))
        add(env.get("NVM_HOME"))
        add(env.get("FNM_MULTISHELL_PATH"))
        add(env.get("PNPM_HOME"))
        add(os.path.join(env.get("VOLTA_HOME", ""), "bin") if env.get("VOLTA_HOME") else "")
        add(os.path.join(appdata, "npm") if appdata else "")
        add(os.path.join(localappdata, "Programs", "nodejs") if localappdata else "")
        add(os.path.join(localappdata, "Volta", "bin") if localappdata else "")
        add(os.path.join(home, "scoop", "shims"))
        add(os.path.join(program_files, "nodejs"))
    else:
        add(env.get("NVM_BIN"))
        add(env.get("FNM_MULTISHELL_PATH"))
        add(env.get("PNPM_HOME"))
        add(os.path.join(env.get("VOLTA_HOME", ""), "bin") if env.get("VOLTA_HOME") else "")
        add(os.path.join(env.get("ASDF_DATA_DIR", ""), "shims") if env.get("ASDF_DATA_DIR") else "")
        add(os.path.join(env.get("npm_config_prefix", ""), "bin") if env.get("npm_config_prefix") else "")
        for path in (
            os.path.join(home, ".local", "bin"),
            os.path.join(home, ".npm-global", "bin"),
            os.path.join(home, ".cargo", "bin"),
            os.path.join(home, ".bun", "bin"),
            os.path.join(home, ".opencode", "bin"),
            os.path.join(home, ".local", "share", "pnpm"),
            os.path.join(home, ".volta", "bin"),
            os.path.join(home, ".asdf", "shims"),
            os.path.join(home, ".local", "share", "fnm", "aliases", "default", "bin"),
            "/opt/homebrew/bin",
            "/usr/local/bin",
            "/usr/bin",
            "/bin",
        ):
            add(path)

        versioned_patterns = (
            os.path.join(env.get("NVM_DIR", os.path.join(home, ".nvm")), "versions", "node", "*", "bin"),
            os.path.join(home, ".nvm", "versions", "node", "*", "bin"),
            os.path.join(env.get("FNM_DIR", os.path.join(home, ".fnm")), "node-versions", "*", "installation", "bin"),
            os.path.join(home, ".fnm", "node-versions", "*", "installation", "bin"),
            os.path.join(home, ".local", "share", "fnm", "node-versions", "*", "installation", "bin"),
        )
        for pattern in versioned_patterns:
            for path in sorted(glob.glob(pattern), key=_version_key, reverse=True):
                add(path)
        fnm_default = os.path.join(home, ".fnm", "aliases", "default", "bin")
        if os.path.isdir(fnm_default):
            add(fnm_default)
    return directories


def find_executable(name, platform=None, env=None, home=None):
    search_path = os.pathsep.join(executable_search_dirs(platform, env, home))
    names = [name]
    if (platform or sys.platform) == "win32" and not os.path.splitext(name)[1]:
        names.extend([f"{name}.cmd", f"{name}.exe", f"{name}.bat"])
    for candidate in names:
        found = shutil.which(candidate, path=search_path)
        if found:
            return found
    return None


def subprocess_environment(*, allow_web=True):
    env = dict(os.environ)
    env["PATH"] = os.pathsep.join(executable_search_dirs(env=env))
    if allow_web:
        env.pop("CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS", None)
    return env


def reports_missing_node_runtime(text):
    return bool(re.search(
        r"(?:env: node:|['\"]?node(?:\.exe)?['\"]? (?:is not recognized|not found)|cannot find .*node)",
        str(text or ""),
        re.IGNORECASE,
    ))


CLAUDE_BIN = find_executable("claude")
PROJECT_DIR = os.path.realpath(
    os.environ.get("AICLI_PROJECT_DIR")
    or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
DATA_DIR = os.path.realpath(os.path.join(PROJECT_DIR, "data"))
DATA_INDEX = os.path.join(DATA_DIR, "index.js")
PENDING_DIR = os.path.realpath(os.path.join(PROJECT_DIR, ".aicli-pending"))


class ValidationError(ValueError):
    """Raised when a native message or generated dataset is invalid."""


def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        return None
    length = struct.unpack("<I", raw_length)[0]
    if length > MAX_MESSAGE_BYTES:
        raise ValidationError("请求过大")
    payload = sys.stdin.buffer.read(length)
    if len(payload) != length:
        raise ValidationError("请求数据不完整")
    try:
        return json.loads(payload.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValidationError("请求不是有效 JSON") from exc


def send_message(obj):
    encoded = json.dumps(obj, ensure_ascii=False).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def validate_tool_id(tool_id):
    if not isinstance(tool_id, str):
        raise ValidationError("工具 ID 必须是字符串")
    tool_id = tool_id.strip()
    if len(tool_id) > 64 or not TOOL_ID_RE.fullmatch(tool_id):
        raise ValidationError("工具 ID 只能包含小写字母、数字和单个短横线，且最长 64 个字符")
    if tool_id in RESERVED_TOOL_IDS:
        raise ValidationError(f"工具 ID「{tool_id}」是保留名称")
    return tool_id


def tool_data_path(tool_id):
    tool_id = validate_tool_id(tool_id)
    real_data_dir = os.path.realpath(DATA_DIR)
    path = os.path.realpath(os.path.join(real_data_dir, f"{tool_id}.js"))
    if os.path.dirname(path) != real_data_dir:
        raise ValidationError("非法的数据文件路径")
    return path


def validate_request(message):
    if not isinstance(message, dict):
        raise ValidationError("请求必须是 JSON 对象")
    action = message.get("action")
    if action not in HOST_ACTIONS:
        raise ValidationError(f"未知的 action: {action}")
    if action == "ping":
        return {"action": "ping"}

    if action in {"apply_update", "discard_update"}:
        token = message.get("token", "")
        if not isinstance(token, str) or not re.fullmatch(r"[a-f0-9]{32}", token):
            raise ValidationError("待处理更新 token 无效")
        return {
            "action": action,
            "token": token,
            "confirm_risk": action == "apply_update" and message.get("confirm_risk") is True,
        }

    tool_id = validate_tool_id(message.get("tool", ""))
    display_name = message.get("display_name", tool_id)
    if not isinstance(display_name, str) or not display_name.strip():
        raise ValidationError("工具名称不能为空")
    display_name = display_name.strip()
    if len(display_name) > 100:
        raise ValidationError("工具名称最长 100 个字符")
    return {
        "action": action,
        "tool": tool_id,
        "display_name": display_name,
        "prefer_web": bool(message.get("prefer_web")),
        "deep_check": bool(message.get("deep_check")),
    }


def atomic_write(path, content):
    """Atomically replace a UTF-8 text file in its destination directory."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fd, temp_path = tempfile.mkstemp(prefix=".aicli-", dir=os.path.dirname(path), text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_path, path)
    except Exception:
        try:
            os.unlink(temp_path)
        except OSError:
            pass
        raise


def list_tool_ids():
    if not os.path.isdir(DATA_DIR):
        return []
    return sorted(
        filename[:-3]
        for filename in os.listdir(DATA_DIR)
        if filename.endswith(".js")
        and filename != "index.js"
        and TOOL_ID_RE.fullmatch(filename[:-3])
    )


def write_data_index(tool_ids=None):
    tool_ids = list_tool_ids() if tool_ids is None else sorted(set(tool_ids))
    for tool_id in tool_ids:
        validate_tool_id(tool_id)
    content = (
        "// Auto-generated by native-host/host.py. Keep this as the single data-file index.\n"
        f"window.CHEATSHEET_FILES = {json.dumps(tool_ids, ensure_ascii=False, indent=2)};\n"
    )
    atomic_write(DATA_INDEX, content)


def checked_text(value, field, *, required=True):
    if value is None and not required:
        return None
    if not isinstance(value, str) or (required and not value.strip()):
        raise ValidationError(f"{field} 必须是非空字符串")
    value = value.strip()
    if len(value) > MAX_FIELD_LENGTH:
        raise ValidationError(f"{field} 过长")
    return value


def stable_item_id(tool_id, item):
    seed = "\0".join(
        [
            tool_id,
            item["cat"],
            item.get("context", ""),
            item["en"].casefold(),
        ]
    )
    return hashlib.sha256(seed.encode("utf-8")).hexdigest()[:16]


def validate_dataset(payload, expected_tool_id, require_structured_source=True):
    if not isinstance(payload, dict):
        raise ValidationError("Claude 返回的数据必须是 JSON 对象")
    meta = payload.get("meta")
    items = payload.get("items")
    if not isinstance(meta, dict) or not isinstance(items, list):
        raise ValidationError("数据必须包含 meta 对象和 items 数组")
    if len(items) > MAX_ITEMS:
        raise ValidationError(f"条目数量不能超过 {MAX_ITEMS}")

    meta_id = validate_tool_id(meta.get("id", ""))
    if meta_id != expected_tool_id:
        raise ValidationError(f"meta.id 必须等于文件 ID：{expected_tool_id}")
    clean_meta = {
        "id": meta_id,
        "name": checked_text(meta.get("name"), "meta.name"),
        "color": checked_text(meta.get("color"), "meta.color"),
        "source": checked_text(meta.get("source"), "meta.source"),
        "builtIn": bool(meta.get("builtIn", False)),
    }
    verification_status = meta.get("verificationStatus")
    if verification_status is not None:
        if verification_status not in {"web-assisted", "model-knowledge", "manual"}:
            raise ValidationError("meta.verificationStatus 非法")
        clean_meta["verificationStatus"] = verification_status
    update_policy = meta.get("updatePolicy")
    if update_policy is not None:
        if update_policy not in UPDATE_POLICIES:
            raise ValidationError("meta.updatePolicy 非法")
        clean_meta["updatePolicy"] = update_policy
    verified_version = checked_text(
        meta.get("verifiedVersion"), "meta.verifiedVersion", required=False
    )
    if verified_version:
        clean_meta["verifiedVersion"] = verified_version
    for date_field in ("contentCheckedAt", "sourceCheckedAt"):
        date_value = checked_text(meta.get(date_field), f"meta.{date_field}", required=False)
        if date_value:
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date_value):
                raise ValidationError(f"meta.{date_field} 必须是 YYYY-MM-DD")
            clean_meta[date_field] = date_value
    source_tier = meta.get("sourceTier")
    if source_tier is not None and source_tier not in SOURCE_TIERS:
        raise ValidationError("meta.sourceTier 非法")
    source_url = checked_text(meta.get("sourceUrl"), "meta.sourceUrl", required=False)
    updated_at = checked_text(meta.get("updatedAt"), "meta.updatedAt", required=False)
    coverage = checked_text(meta.get("coverage"), "meta.coverage", required=False)
    platforms = meta.get("platforms")
    if require_structured_source and (
        not coverage
        or not meta.get("updatePolicy")
        or not meta.get("contentCheckedAt")
        or not meta.get("sourceCheckedAt")
        or (not source_url and not meta.get("sources"))
    ):
        raise ValidationError(
            "新生成的数据必须包含 meta.sources、meta.updatePolicy、"
            "meta.contentCheckedAt、meta.sourceCheckedAt 和 meta.coverage"
        )
    if source_url:
        if not re.fullmatch(r"https://[^\s]+", source_url):
            raise ValidationError("meta.sourceUrl 必须是 HTTPS URL")
        clean_meta["sourceUrl"] = source_url
    if source_tier is not None:
        if source_tier == "quasi-official" and not host_in_quasi_official_whitelist(source_url):
            raise ValidationError("meta.sourceTier 为 quasi-official 时，sourceUrl 主机名必须在白名单内")
        clean_meta["sourceTier"] = source_tier
    if updated_at:
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", updated_at):
            raise ValidationError("meta.updatedAt 必须是 YYYY-MM-DD")
        clean_meta["updatedAt"] = updated_at
    if coverage:
        clean_meta["coverage"] = coverage
    if platforms is not None:
        if (
            not isinstance(platforms, list)
            or not platforms
            or any(platform not in {"mac", "windows", "linux"} for platform in platforms)
        ):
            raise ValidationError("meta.platforms 只能包含 mac、windows、linux")
        clean_meta["platforms"] = list(dict.fromkeys(platforms))
    if not COLOR_RE.fullmatch(clean_meta["color"]):
        raise ValidationError("meta.color 必须是 #RRGGBB 格式")
    order = meta.get("order")
    if order is not None:
        if not isinstance(order, int) or isinstance(order, bool) or not 0 <= order <= 9999:
            raise ValidationError("meta.order 必须是 0 到 9999 的整数")
        clean_meta["order"] = order

    raw_sources = meta.get("sources")
    # 旧数据兼容：从单一来源字段合成一条来源。新生成提示只允许输出 sources[]。
    if raw_sources is None and source_url:
        legacy_tier = source_tier or "official"
        raw_sources = [{
            "id": "primary",
            "title": clean_meta["source"],
            "url": source_url,
            "kind": "official-doc" if legacy_tier == "official" else (
                "authoritative-reference" if legacy_tier == "quasi-official" else "community"
            ),
            "maintainer": urllib.parse.urlparse(source_url).hostname or "未标注",
            "evidenceTier": "first-party" if legacy_tier == "official" else (
                "authoritative-community" if legacy_tier == "quasi-official" else "community"
            ),
            "lastVerifiedAt": updated_at or "",
            "purposes": ["command-existence", "option-semantics", "examples"],
        }]
    if not isinstance(raw_sources, list) or not raw_sources:
        if require_structured_source:
            raise ValidationError("新生成的数据必须包含非空 meta.sources")
        raw_sources = []
    clean_sources = []
    source_ids = set()
    for source_index, source in enumerate(raw_sources):
        if not isinstance(source, dict):
            raise ValidationError(f"meta.sources[{source_index}] 必须是对象")
        field = f"meta.sources[{source_index}]"
        source_id = checked_text(source.get("id"), f"{field}.id")
        registry_id = checked_text(
            source.get("registryId"), f"{field}.registryId", required=False
        ) or source_id
        if not re.fullmatch(r"[a-zA-Z0-9_-]{2,64}", source_id):
            raise ValidationError(f"{field}.id 非法")
        if source_id in source_ids:
            raise ValidationError(f"meta.sources 存在重复 id：{source_id}")
        source_ids.add(source_id)
        kind = checked_text(source.get("kind"), f"{field}.kind")
        evidence_tier = checked_text(source.get("evidenceTier"), f"{field}.evidenceTier")
        if kind not in SOURCE_KINDS:
            raise ValidationError(f"{field}.kind 非法")
        if evidence_tier not in EVIDENCE_TIERS - {"none"}:
            raise ValidationError(f"{field}.evidenceTier 非法")
        url = checked_text(source.get("url"), f"{field}.url", required=kind != "local-help")
        if url and not re.fullmatch(r"https://[^\s]+", url):
            raise ValidationError(f"{field}.url 必须是 HTTPS URL")
        if kind in {"official-repository", "authoritative-reference"} and not matching_registry_entry(
            expected_tool_id, registry_id, kind, url
        ):
            raise ValidationError(f"{field} 不匹配来源登记中的工具、类型或 URL 范围")
        if kind in {"local-help", "official-doc", "release-notes"} and registry_id in SOURCE_REGISTRY_BY_ID:
            if not matching_registry_entry(expected_tool_id, registry_id, kind, url):
                raise ValidationError(f"{field} 不匹配来源登记中的工具、类型或 URL 范围")
        if kind in {"local-help", "official-doc", "official-repository", "release-notes"}:
            if evidence_tier != "first-party":
                raise ValidationError(f"{field} 的 evidenceTier 必须为 first-party")
        if kind == "authoritative-reference" and evidence_tier != "authoritative-community":
            raise ValidationError(f"{field} 的 evidenceTier 必须为 authoritative-community")
        verified_at = checked_text(
            source.get("lastVerifiedAt"), f"{field}.lastVerifiedAt", required=False
        )
        if verified_at and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", verified_at):
            raise ValidationError(f"{field}.lastVerifiedAt 必须是 YYYY-MM-DD")
        purposes = source.get("purposes")
        if not isinstance(purposes, list) or not purposes or any(
            not isinstance(purpose, str) or not purpose.strip() for purpose in purposes
        ):
            raise ValidationError(f"{field}.purposes 必须是非空字符串数组")
        clean_source = {
            "id": source_id,
            "title": checked_text(source.get("title"), f"{field}.title"),
            "kind": kind,
            "maintainer": checked_text(source.get("maintainer"), f"{field}.maintainer"),
            "evidenceTier": evidence_tier,
            "purposes": list(dict.fromkeys(purpose.strip() for purpose in purposes)),
        }
        resolved_url = checked_text(
            source.get("resolvedUrl"), f"{field}.resolvedUrl", required=False
        ) or (url if not require_structured_source else None)
        page_title = checked_text(
            source.get("pageTitle"), f"{field}.pageTitle", required=False
        ) or (clean_source["title"] if not require_structured_source else None)
        checked_at = checked_text(
            source.get("checkedAt"), f"{field}.checkedAt", required=False
        ) or (verified_at if not require_structured_source else None)
        if require_structured_source and kind != "local-help" and not all(
            [resolved_url, page_title, checked_at]
        ):
            raise ValidationError(
                f"{field} 必须包含 resolvedUrl、pageTitle 和 checkedAt"
            )
        if resolved_url:
            if not re.fullmatch(r"https://[^\s]+", resolved_url):
                raise ValidationError(f"{field}.resolvedUrl 必须是 HTTPS URL")
            if url and not url_matches_prefixes(resolved_url, [url.rstrip("/")]):
                raise ValidationError(f"{field}.resolvedUrl 不在声明 URL 范围内")
            clean_source["resolvedUrl"] = resolved_url
        if page_title:
            clean_source["pageTitle"] = page_title
        if checked_at:
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", checked_at):
                raise ValidationError(f"{field}.checkedAt 必须是 YYYY-MM-DD")
            clean_source["checkedAt"] = checked_at
        if registry_id != source_id:
            clean_source["registryId"] = registry_id
        if url:
            clean_source["url"] = url
        if verified_at:
            clean_source["lastVerifiedAt"] = verified_at
        version = checked_text(source.get("version"), f"{field}.version", required=False)
        if version:
            clean_source["version"] = version
        clean_sources.append(clean_source)
    if clean_sources:
        clean_meta["sources"] = clean_sources
    source_by_id = {source["id"]: source for source in clean_sources}
    raw_references = meta.get("references")
    if raw_references is not None:
        if not isinstance(raw_references, list):
            raise ValidationError("meta.references 必须是数组")
        clean_references = []
        for ref_index, reference in enumerate(raw_references):
            if not isinstance(reference, dict):
                raise ValidationError(f"meta.references[{ref_index}] 必须是对象")
            registry_id = reference.get("registryId") or reference.get("id")
            entry = SOURCE_REGISTRY_BY_ID.get(registry_id)
            if not entry or expected_tool_id not in entry.get("toolIds", []):
                raise ValidationError(f"meta.references[{ref_index}] 不匹配来源登记")
            url = checked_text(
                reference.get("url"), f"meta.references[{ref_index}].url"
            )
            if not url_matches_prefixes(url, entry.get("urlPrefixes", [])):
                raise ValidationError(f"meta.references[{ref_index}].url 超出登记范围")
            clean_references.append({
                key: value for key, value in reference.items()
                if key in {
                    "id", "registryId", "title", "url", "kind", "maintainer",
                    "evidenceTier", "lastVerifiedAt", "resolvedUrl", "pageTitle",
                    "checkedAt", "purposes",
                }
            })
        if clean_references:
            clean_meta["references"] = clean_references

    clean_items = []
    duplicate_keys = set()
    item_ids = set()
    dropped = 0
    for index, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValidationError(f"items[{index}] 必须是对象")
        category = item.get("cat")
        if category not in VALID_CATEGORIES:
            raise ValidationError(f"items[{index}].cat 非法")
        clean_item = {
            "cat": category,
            "cmd": checked_text(item.get("cmd"), f"items[{index}].cmd"),
            "en": checked_text(item.get("en"), f"items[{index}].en"),
            "zh": checked_text(item.get("zh"), f"items[{index}].zh"),
        }
        context = checked_text(item.get("context"), f"items[{index}].context", required=False)
        if context:
            clean_item["context"] = context
        raw_refs = item.get("evidenceRefs")
        if raw_refs is None and not require_structured_source:
            raw_source_ids = validate_source_ids(
                item.get("sourceIds"), f"items[{index}].sourceIds", source_ids
            )
            raw_refs = [{
                "sourceId": source_id,
                "claims": ["existence"],
                "locator": source_by_id[source_id].get("url", source_id),
                "checkedAt": source_by_id[source_id].get("lastVerifiedAt", updated_at),
            } for source_id in raw_source_ids] or None
        evidence_refs = validate_evidence_refs(
            raw_refs, f"items[{index}].evidenceRefs", source_ids, source_by_id
        )
        if evidence_refs:
            clean_item["evidenceRefs"] = evidence_refs
        evidence_status = evidence_status_for(evidence_refs)
        supplied_status = item.get("evidenceStatus")
        if supplied_status is not None and supplied_status != evidence_status:
            raise ValidationError(
                f"items[{index}].evidenceStatus 应由 evidenceRefs 推导为 {evidence_status}"
            )
        clean_item["evidenceStatus"] = evidence_status
        keywords = item.get("keywords")
        if keywords is not None:
            if (
                not isinstance(keywords, list)
                or not MIN_KEYWORDS <= len(keywords) <= MAX_KEYWORDS
            ):
                raise ValidationError(
                    f"items[{index}].keywords 必须包含 {MIN_KEYWORDS} 到 {MAX_KEYWORDS} 个字符串"
                )
            clean_keywords = []
            for keyword_index, keyword in enumerate(keywords):
                keyword = checked_text(keyword, f"items[{index}].keywords[{keyword_index}]")
                if keyword not in clean_keywords:
                    clean_keywords.append(keyword)
            if clean_keywords:
                clean_item["keywords"] = clean_keywords
        examples = item.get("examples")
        if examples is not None:
            if not isinstance(examples, list) or not examples or len(examples) > MAX_EXAMPLES:
                raise ValidationError(f"items[{index}].examples 必须包含 1 到 {MAX_EXAMPLES} 个示例")
            clean_examples = []
            for example_index, example in enumerate(examples):
                if not isinstance(example, dict):
                    raise ValidationError(f"items[{index}].examples[{example_index}] 必须是对象")
                clean_example = {
                    "value": checked_text(
                        example.get("value"), f"items[{index}].examples[{example_index}].value"
                    ),
                    "description": checked_text(
                        example.get("description"),
                        f"items[{index}].examples[{example_index}].description",
                    ),
                    "copyable": example.get("copyable", True),
                }
                if not isinstance(clean_example["copyable"], bool):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}].copyable 必须是布尔值"
                    )
                legacy_source_type = example.get("sourceType")
                if legacy_source_type is not None and legacy_source_type not in EXAMPLE_SOURCE_TYPES:
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}].sourceType 非法"
                    )
                example_source_url = checked_text(
                    example.get("sourceUrl"),
                    f"items[{index}].examples[{example_index}].sourceUrl",
                    required=False,
                )
                if example_source_url:
                    if not re.fullmatch(r"https://[^\s]+", example_source_url):
                        raise ValidationError(
                            f"items[{index}].examples[{example_index}].sourceUrl 必须是 HTTPS URL"
                        )
                    clean_example["sourceUrl"] = example_source_url
                if (
                    legacy_source_type == "quasi-official"
                    and example_source_url
                    and not host_in_quasi_official_whitelist(example_source_url)
                ):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}].sourceType 为 quasi-official 时，"
                        "sourceUrl 主机名必须在白名单内"
                    )
                authorship = example.get("authorship")
                if require_structured_source and any(
                    example.get(field) is None
                    for field in ("authorship", "evidenceTier", "adaptation")
                ):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}] 新数据必须显式填写 "
                        "authorship、evidenceTier 和 adaptation"
                    )
                if authorship is None:
                    authorship = (
                        "generated" if legacy_source_type == "ai-derived" else "editorial"
                    )
                evidence_tier = example.get("evidenceTier")
                if evidence_tier is None:
                    evidence_tier = {
                        "official": "first-party",
                        "quasi-official": "authoritative-community",
                        "manual": "community" if example_source_url else "none",
                        "ai-derived": "none",
                    }.get(legacy_source_type, "none")
                adaptation = example.get("adaptation")
                if adaptation is None:
                    adaptation = (
                        "verbatim" if authorship == "official" else
                        "scenario-derived" if authorship == "generated" else "adapted"
                    )
                if authorship not in AUTHORSHIPS:
                    raise ValidationError(f"items[{index}].examples[{example_index}].authorship 非法")
                if evidence_tier not in EVIDENCE_TIERS:
                    raise ValidationError(f"items[{index}].examples[{example_index}].evidenceTier 非法")
                if adaptation not in ADAPTATIONS:
                    raise ValidationError(f"items[{index}].examples[{example_index}].adaptation 非法")
                clean_example.update({
                    "authorship": authorship,
                    "evidenceTier": evidence_tier,
                    "adaptation": adaptation,
                    # sourceType 仅为旧版读取兼容，不再作为作者或证据的事实来源。
                    "sourceType": legacy_source_type or (
                        "official" if evidence_tier == "first-party" else
                        "quasi-official" if evidence_tier == "authoritative-community" else
                        "ai-derived" if authorship == "generated" else "manual"
                    ),
                })
                example_source_ids = validate_source_ids(
                    example.get("sourceIds"),
                    f"items[{index}].examples[{example_index}].sourceIds",
                    source_ids,
                )
                if example_source_ids:
                    clean_example["sourceIds"] = example_source_ids
                if evidence_tier in {"first-party", "authoritative-community", "community"}:
                    if not example_source_ids:
                        raise ValidationError(
                            f"items[{index}].examples[{example_index}] 声明 {evidence_tier} "
                            "证据时必须提供 sourceIds"
                        )
                    referenced_tiers = {
                        source_by_id[source_id].get("evidenceTier")
                        for source_id in example_source_ids
                    }
                    if evidence_tier not in referenced_tiers:
                        raise ValidationError(
                            f"items[{index}].examples[{example_index}] 的 evidenceTier "
                            "与 sourceIds 引用来源不一致"
                        )
                if authorship == "official" and (
                    adaptation != "verbatim"
                    or evidence_tier != "first-party"
                    or not example_source_ids
                    or not example_source_url
                ):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}] 官方原例必须是 verbatim，"
                        "并提供第一方 sourceIds 和具体 sourceUrl"
                    )
                if clean_example["sourceType"] == "official" and example_source_url:
                    referenced = [
                        source_by_id[source_id] for source_id in example_source_ids
                        if source_id in source_by_id
                    ] or [
                        source for source in clean_sources
                        if source.get("evidenceTier") == "first-party"
                    ]
                    example_host = urllib.parse.urlparse(example_source_url).hostname
                    if referenced and not any(
                        source.get("kind") == "local-help"
                        or urllib.parse.urlparse(source.get("url", "")).hostname == example_host
                        or url_matches_prefixes(example_source_url, OFFICIAL_REPOSITORY_PREFIXES)
                        for source in referenced
                    ):
                        raise ValidationError(
                            f"items[{index}].examples[{example_index}] 的 official URL 不是第一方来源"
                        )
                for optional_field in ("scenario", "goal", "expected", "prerequisites", "caveat"):
                    optional_value = checked_text(
                        example.get(optional_field),
                        f"items[{index}].examples[{example_index}].{optional_field}",
                        required=False,
                    )
                    if optional_value:
                        clean_example[optional_field] = optional_value
                warning = checked_text(
                    example.get("warning"),
                    f"items[{index}].examples[{example_index}].warning",
                    required=False,
                )
                if warning:
                    clean_example["warning"] = warning
                if DANGEROUS_EXAMPLE_RE.search(clean_example["value"]) and not warning:
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}] 危险操作必须包含 warning"
                    )
                if POSSIBLE_SECRET_RE.search(clean_example["value"]):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}] 疑似包含密钥"
                    )
                example_platforms = example.get("platforms")
                if example_platforms is not None:
                    if (
                        not isinstance(example_platforms, list)
                        or not example_platforms
                        or any(
                            example_platform not in {"mac", "windows", "linux"}
                            for example_platform in example_platforms
                        )
                    ):
                        raise ValidationError(
                            f"items[{index}].examples[{example_index}].platforms 非法"
                        )
                    clean_example["platforms"] = list(dict.fromkeys(example_platforms))
                platform_values = example.get("platformValues")
                if platform_values is not None:
                    if not isinstance(platform_values, dict) or not platform_values:
                        raise ValidationError(
                            f"items[{index}].examples[{example_index}].platformValues 必须是非空对象"
                        )
                    clean_values = {}
                    for example_platform, value in platform_values.items():
                        if example_platform not in {"mac", "windows", "linux"}:
                            raise ValidationError(
                                f"items[{index}].examples[{example_index}].platformValues 平台非法"
                            )
                        clean_values[example_platform] = checked_text(
                            value,
                            f"items[{index}].examples[{example_index}].platformValues.{example_platform}",
                        )
                    clean_example["platformValues"] = clean_values
                clean_examples.append(clean_example)
            clean_item["examples"] = clean_examples
        item_platforms = item.get("platforms")
        if item_platforms is not None:
            if (
                not isinstance(item_platforms, list)
                or not item_platforms
                or any(platform not in {"mac", "windows", "linux"} for platform in item_platforms)
            ):
                raise ValidationError(f"items[{index}].platforms 非法")
            clean_item["platforms"] = list(dict.fromkeys(item_platforms))
        platform_cmds = item.get("platformCmds")
        if platform_cmds is not None:
            if not isinstance(platform_cmds, dict) or not platform_cmds:
                raise ValidationError(f"items[{index}].platformCmds 必须是非空对象")
            clean_platform_cmds = {}
            for platform, command in platform_cmds.items():
                if platform not in {"mac", "windows", "linux"}:
                    raise ValidationError(f"items[{index}].platformCmds 平台非法")
                clean_platform_cmds[platform] = checked_text(
                    command, f"items[{index}].platformCmds.{platform}"
                )
            clean_item["platformCmds"] = clean_platform_cmds
        duplicate_key = (category, clean_item["cmd"].casefold(), (context or "").casefold())
        if duplicate_key in duplicate_keys:
            dropped += 1
            continue
        duplicate_keys.add(duplicate_key)

        item_id = item.get("id")
        generated_id = item_id is None
        if not generated_id:
            item_id = checked_text(item_id, f"items[{index}].id")
            if not re.fullmatch(r"[a-zA-Z0-9_-]{4,64}", item_id):
                raise ValidationError(f"items[{index}].id 格式非法")
        else:
            item_id = stable_item_id(expected_tool_id, clean_item)
        if item_id in item_ids:
            if generated_id:
                item_id = hashlib.sha256(
                    f"{item_id}\0{clean_item['cmd']}".encode("utf-8")
                ).hexdigest()[:16]
            if item_id in item_ids:
                dropped += 1
                continue
        item_ids.add(item_id)
        clean_item["id"] = item_id
        clean_items.append(clean_item)

    if not clean_items:
        raise ValidationError("items 不能为空")
    summary = checked_text(payload.get("summary", ""), "summary", required=False) or ""
    if dropped > 0:
        summary = (summary + f"（已自动去重 {dropped} 条）").strip()
    dataset = {
        "meta": clean_meta,
        "items": clean_items,
        "summary": summary,
    }
    source_conflicts = payload.get("sourceConflicts", [])
    if source_conflicts:
        if not isinstance(source_conflicts, list) or any(
            not isinstance(conflict, str) or not conflict.strip() for conflict in source_conflicts
        ):
            raise ValidationError("sourceConflicts 必须是字符串数组")
        dataset["sourceConflicts"] = list(dict.fromkeys(
            conflict.strip() for conflict in source_conflicts
        ))
    dataset["qualityWarnings"] = build_quality_warnings(dataset)
    return dataset


def build_quality_warnings(dataset, previous_dataset=None):
    items = dataset.get("items", [])
    covered = sum(1 for item in items if item.get("examples"))
    keyword_covered = sum(1 for item in items if item.get("keywords"))
    expected = len(items)
    warnings = []
    if covered < expected:
        warnings.append(f"示例覆盖不足：当前 {covered} 条，目标 {expected} 条")
    if keyword_covered < expected:
        warnings.append(f"语义关键词覆盖不足：当前 {keyword_covered} 条，目标 {expected} 条")
    evidenced = sum(1 for item in items if item.get("evidenceRefs"))
    if evidenced < expected:
        warnings.append(f"逐条证据覆盖不足：当前 {evidenced} 条，目标 {expected} 条")
    partial = sum(1 for item in items if item.get("evidenceStatus") == "partial")
    unverified_items = sum(1 for item in items if item.get("evidenceStatus") == "unverified")
    if partial:
        warnings.append(f"部分核验条目：{partial} 条")
    if unverified_items:
        warnings.append(f"未核验条目：{unverified_items} 条")
    examples = [
        example for item in items for example in (item.get("examples") or [])
    ]
    scenario_complete = sum(
        1 for example in examples
        if example.get("scenario") and example.get("goal") and example.get("expected")
    )
    if examples and scenario_complete < len(examples):
        warnings.append(
            f"场景案例结构不足：完整 {scenario_complete}/{len(examples)}"
        )
    unverified = sum(
        1 for example in examples if example.get("evidenceTier", "none") == "none"
    )
    if unverified:
        warnings.append(f"未独立核验案例：{unverified} 条")
    repetitive = sum(
        1 for item in items for example in (item.get("examples") or [])
        if example.get("description", "").strip() == item.get("zh", "").strip()
    )
    if repetitive:
        warnings.append(f"案例说明与条目释义重复：{repetitive} 条")
    conflicts = dataset.get("sourceConflicts") or []
    if conflicts:
        warnings.append(f"来源冲突待核对：{len(conflicts)} 项")
    if previous_dataset is not None:
        previous_covered = sum(1 for item in previous_dataset.get("items", []) if item.get("examples"))
        if covered < previous_covered:
            warnings.append(f"示例覆盖从 {previous_covered} 条降至 {covered} 条")
    return warnings


def render_data_file(dataset):
    tool_id = dataset["meta"]["id"]
    serializable = {"meta": dataset["meta"], "items": dataset["items"]}
    if dataset.get("sourceConflicts"):
        serializable["sourceConflicts"] = dataset["sourceConflicts"]
    return (
        "// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.\n"
        "window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};\n"
        f"window.CHEATSHEET_DATA[{json.dumps(tool_id)}] = "
        f"{json.dumps(serializable, ensure_ascii=False, indent=2)};\n"
    )


def extract_json_output(stdout):
    """Accept Claude's JSON output wrapper, a direct object, or a fenced JSON object."""
    text = stdout.strip()
    if not text:
        raise ValidationError("Claude 没有返回内容")
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            text = match.group(1)
        else:
            start, end = text.find("{"), text.rfind("}")
            if start < 0 or end <= start:
                preview = text[:300].replace("\n", " ")
                raise ValidationError(f"Claude 没有返回有效 JSON，实际输出：{preview}")
            text = text[start : end + 1]
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as exc:
            preview = text[:300].replace("\n", " ")
            raise ValidationError(f"Claude 返回的 JSON 无法解析：{preview}") from exc

    if isinstance(parsed, dict) and "result" in parsed and not {"meta", "items"} <= parsed.keys():
        result = parsed["result"]
        if isinstance(result, str):
            return extract_json_output(result)
        parsed = result
    return parsed


def build_source_discovery_prompt(tool_id, display_name, mode, web_enabled):
    registry = [
        entry for entry in SOURCE_REGISTRY
        if tool_id in entry.get("toolIds", [])
    ]
    network_rule = (
        "你可以联网逐个打开并核对 URL。"
        if web_enabled else
        "你不能联网；不要提出无法确认的第三方 URL，只保留高度确信的第一方资料。"
    )
    return f"""
你正在为「{display_name}」（工具 ID：{tool_id}）执行{('新增' if mode == 'add' else '更新')}前的来源发现。
{network_rule}
只输出 JSON 对象，不要 Markdown。格式：
{{
  "sources": [{{
    "id": "稳定短 ID",
    "title": "页面或本机帮助名称",
    "url": "HTTPS URL；local-help 可省略",
    "kind": "local-help|official-doc|official-repository|release-notes|authoritative-reference|community",
    "maintainer": "维护组织",
    "evidenceTier": "first-party|authoritative-community|community",
    "lastVerifiedAt": "YYYY-MM-DD",
    "version": "可选；适用版本",
    "purposes": ["command-existence|option-semantics|examples|release-notes|cross-check"]
  }}],
  "conflicts": ["来源之间发现的冲突；没有则空数组"],
  "notes": ["采用或拒绝候选来源的理由"]
}}

来源优先级：当前版本本机 --help 或 /help；官方文档；官方仓库与 Release/Changelog；
已登记权威第三方；普通社区仅可作为线索。
tldr 只适合实用案例，不能单独证明新参数存在。托管平台不能整体授信。
GitHub 仅认可已登记的厂商仓库。精确登记范围如下：
{json.dumps(registry, ensure_ascii=False)}
不得编造 URL。找不到可靠来源时返回较少来源，并在 notes 说明。
""".strip()


def build_prompt(
    tool_id, display_name, mode, web_enabled, discovered_sources=None, update_context=None
):
    current_text = ""
    data_path = tool_data_path(tool_id)
    if mode == "update":
        if not os.path.exists(data_path):
            raise ValidationError(f"找不到 data/{tool_id}.js")
        with open(data_path, "r", encoding="utf-8") as handle:
            current_text = handle.read()

    operation = "新增" if mode == "add" else "更新"
    existing = ", ".join(list_tool_ids()) or "（无）"
    current_section = (
        "当前数据文件如下，请基于它更新：\n" + current_text
        if current_text
        else ""
    )
    update_signal_section = ""
    if update_context:
        update_signal_section = (
            "\n本次更新由实际变化信号触发：\n"
            f"- 更新策略：{update_context.get('policy')}\n"
            f"- 信号类型：{update_context.get('signalType')}\n"
            f"- 当前版本或发布标识：{update_context.get('marker')}\n"
            "只修改被该版本实际影响的命令、参数、快捷键和证据。"
            "若发布内容未改变命令界面，保持 items 不变，仅更新核验版本元数据；"
            "不要因页面排版、发布日期或措辞变化重写条目。\n"
        )
    whitelist = "、".join(QUASI_OFFICIAL_DOMAINS)
    # 来源策略随是否联网而变：只有联网路径能可靠核对第三方页面，因此只有它能产出
    # quasi-official；离线（纯模型知识）路径禁止类官方，避免编造看似合法的白名单 URL。
    if web_enabled:
        source_policy = (
            "来源优先级：官方文档优先。当官方文档缺失、滞后或不完整时，"
            f"可联网核对，并从可信第三方白名单（{whitelist}）补齐缺口，"
            "把这些条目或示例标为 quasi-official，其 sourceUrl 必须是你实际确认存在的白名单域名下页面。"
            "永不编造命令或 URL；查不到就如实少收录。"
        )
        tier_rule = (
            "meta.sourceTier：以厂商自有文档为主填 official；主要依据白名单可信第三方填 quasi-official"
            "（sourceUrl 必须是白名单域名下确实存在的页面）；其余社区来源填 community。"
        )
    else:
        source_policy = (
            "来源优先级：你当前没有联网，只能依据训练知识整理。"
            "禁止使用 quasi-official 标签，禁止编造任何 URL。"
            "只用 official（你高度确信的官方页面）、manual 或 ai-derived；"
            "官方页面拿不准就省略 sourceUrl 或少收录，宁缺毋滥。"
        )
        tier_rule = (
            "meta.sourceTier：只能填 official 或 community，禁止 quasi-official"
            "（离线无法核实第三方来源）。"
        )
    upgrade_note = (
        "更新时，若官方文档现已补全此前用 quasi-official 补充的条目，可将其 sourceType/sourceTier "
        "升级回 official；官方仍缺失的则保留 quasi-official。"
        if mode == "update"
        else ""
    )
    discovered_section = json.dumps(
        discovered_sources or {"sources": [], "conflicts": [], "notes": []},
        ensure_ascii=False,
        indent=2,
    )
    return f"""
你正在为浏览器扩展{operation}「{display_name}」的数据。先使用下方已经完成的来源发现结果，再生成内容。
确保命令准确、宁可少收录也不要编造；没有逐条证据的候选默认不要写入 items。
只输出一个 JSON 对象，不要 Markdown，不要解释，不要任何前缀文字。

目标工具 ID：{tool_id}
已有工具 ID：{existing}

JSON 格式：
{{
  "meta": {{
    "id": "{tool_id}",
    "name": "官方完整名称",
    "color": "#RRGGBB",
    "source": "官方来源与整理日期",
    "sourceUrl": "https://官方文档地址",
    "sourceTier": "official|quasi-official|community",
    "updatePolicy": "version-driven | release-driven | manual-only",
    "verifiedVersion": "可选；已核验的产品版本或发布标识",
    "contentCheckedAt": "YYYY-MM-DD",
    "sourceCheckedAt": "YYYY-MM-DD",
    "coverage": "完整命令列表或常用子集说明",
    "sources": [{{
      "id": "稳定来源ID",
      "title": "来源名称",
      "url": "HTTPS URL；local-help 可省略",
      "kind": "local-help|official-doc|official-repository|release-notes|authoritative-reference|community",
      "maintainer": "维护组织",
      "evidenceTier": "first-party|authoritative-community|community",
      "lastVerifiedAt": "YYYY-MM-DD",
      "resolvedUrl": "打开并跟随重定向后的最终 HTTPS URL",
      "pageTitle": "实际页面标题",
      "checkedAt": "YYYY-MM-DD",
      "version": "可选版本",
      "purposes": ["command-existence|option-semantics|examples|release-notes|cross-check"]
    }}],
    "platforms": ["mac", "windows", "linux"],
    "builtIn": false,
    "order": 999
  }},
  "items": [
    {{
      "id": "可选；已有条目应保留原 ID",
      "cat": "shortcut|slash|flag",
      "cmd": "实际命令或快捷键",
      "en": "简短英文说明",
      "zh": "清晰中文说明",
      "context": "可选；相同 cmd 在不同场景出现时必须填写",
      "keywords": ["3到8个用户常用用途词"],
      "evidenceStatus": "verified|partial|unverified",
      "evidenceRefs": [{{
        "sourceId": "来源ID",
        "claims": ["existence|semantics|platform|example"],
        "locator": "命令专页、章节锚点或本机帮助命令",
        "checkedAt": "YYYY-MM-DD"
      }}],
      "examples": [
        {{
          "scenario": "用户在什么情况下需要它",
          "goal": "要解决的具体问题",
          "value": "具体命令、Markdown输入或操作步骤",
          "description": "自然说明为什么这样用，避免重复命令释义",
          "expected": "执行后应看到什么",
          "prerequisites": "可选；执行前提",
          "caveat": "可选；版本、平台或易混淆点",
          "copyable": true,
          "warning": "可选；危险操作或注意事项",
          "sourceType": "可选旧字段；official|quasi-official|manual|ai-derived",
          "sourceUrl": "可选；具体示例来源的HTTPS地址",
          "sourceIds": ["支持这个案例的来源ID"],
          "authorship": "official|editorial|generated",
          "evidenceTier": "first-party|authoritative-community|community|none",
          "adaptation": "verbatim|adapted|scenario-derived",
          "platforms": ["可选；mac/windows/linux"],
          "platformValues": {{"mac": "可选的平台专属示例"}}
        }}
      ],
      "platforms": ["可选；mac/windows/linux"],
      "platformCmds": {{"mac": "可选的平台专属命令"}}
    }}
  ],
  "sourceConflicts": ["来源之间仍未解决的冲突；没有则空数组"],
  "summary": "一句话说明数据变化"
}}

要求：
1. {source_policy}
2. 按功能区覆盖核心能力，不设凑数目标。CLI 应覆盖交互命令、重要子命令及关键选项；IDE 只收录默认快捷键的实用子集，并明确平台和限制。
3. flag 类条目的 cmd 写成「子命令 + 选项」的完整形式（例如 git commit -m、git log --oneline），并用 context 标注所属子命令。
4. 同一 cat、cmd、context 组合不得重复。
5. 更新时保留仍有效的条目及其 id，只修改确有变化的内容。{upgrade_note}
6. 所有字符串必须是有效 JSON 字符串。
7. sources、updatePolicy、contentCheckedAt、sourceCheckedAt、coverage 必须填写；updatedAt 仅为旧数据兼容字段，新数据可省略。网页来源必须记录 resolvedUrl、pageTitle、checkedAt。每个 item 必须提供 evidenceRefs，evidenceStatus 由系统根据 claims 自动推导，不要臆测；平台快捷键应尽量使用 platformCmds 表达。
8. verified 必须同时有 existence 与 semantics 断言且 locator 可具体定位；只有宽泛首页或只确认命令存在时只能是 partial；无证据为 unverified。
9. 每个条目都必须提供 keywords 和 examples；每条最多 3 个示例。
10. updatePolicy 按实际变化方式选择：可读取本机版本的动态 CLI 用 version-driven；有明确官方 Release/Changelog 但无可靠本机版本的工具用 release-driven；稳定快捷键、键位表和基础命令参考用 manual-only。不得因为核验日期较早选择更激进的策略。
11. CLI 示例必须是完整可执行命令；IDE/快捷键示例写具体操作场景并设 copyable=false；案例应包含 scenario、goal、expected，说明何时用、结果是什么以及不要与什么混淆。
12. 更新时保留已有 keywords 和 examples，并为所有新增条目补充关键词和示例。
13. 官方明确示例标记 official；人工整理标记 manual；根据命令语义推导的标记 ai-derived；可信第三方补充按上面第 1 条的来源优先级处理。
13. {tier_rule}
14. authorship 表示谁写的案例，evidenceTier 表示证据强度，adaptation 表示是否改写，三者不得混为一个 sourceType。新数据必须显式填写这三个字段；sourceType 仅用于旧版兼容。
15. first-party、authoritative-community、community 案例证据必须提供 sourceIds，且等级与所引用来源一致。official 作者只允许 verbatim 官方原例，并提供第一方 sourceIds 和具体 sourceUrl。
15. 高风险命令必须提供 warning，并在 description 或 caveat 中给出预览、备份或更安全替代方案。

来源发现结果：
{discovered_section}

{current_section}
{update_signal_section}
""".strip()


def _has_api_token():
    """是否配置了直连 API 的 token。有 token 走无联网的 API 路径，没有则走可联网的 claude 子进程。"""
    return bool(os.environ.get("ANTHROPIC_AUTH_TOKEN") or os.environ.get("ANTHROPIC_API_KEY"))


def _demote_quasi_official(dataset):
    """离线（model-knowledge）产物即使带了 quasi-official 也降级：无联网无法核实第三方来源。

    meta.sourceTier quasi-official → community；example.sourceType quasi-official → ai-derived
    并去掉其未经核实的 sourceUrl。返回同一个对象（就地清洗后由调用方写盘）。
    """
    meta = dataset.get("meta")
    removed_ids = set()
    if isinstance(meta, dict) and meta.get("sourceTier") == "quasi-official":
        meta["sourceTier"] = "community"
    if isinstance(meta, dict):
        safe_sources = []
        for source in meta.get("sources", []) or []:
            if source.get("evidenceTier") == "authoritative-community":
                removed_ids.add(source.get("id"))
                continue
            safe_sources.append(source)
        if "sources" in meta:
            meta["sources"] = safe_sources
    for item in dataset.get("items", []):
        # 离线模型知识不能形成可复核的命令证据；保留内容候选，但状态必须为未核验。
        item.pop("evidenceRefs", None)
        item.pop("sourceIds", None)
        item["evidenceStatus"] = "unverified"
        for example in item.get("examples", []) or []:
            if isinstance(example, dict) and example.get("sourceType") == "quasi-official":
                authorship = example.get("authorship") or "editorial"
                example["sourceType"] = (
                    "ai-derived" if authorship == "generated" else "manual"
                )
                example.pop("sourceUrl", None)
                example["authorship"] = authorship
                example["evidenceTier"] = "none"
                example["adaptation"] = example.get("adaptation") or (
                    "scenario-derived" if authorship == "generated" else "adapted"
                )
            if removed_ids:
                example["sourceIds"] = [
                    source_id for source_id in example.get("sourceIds", [])
                    if source_id not in removed_ids
                ]
    return dataset


def _call_api_direct(prompt):
    """直接调用 Anthropic 兼容 API（仅用标准库），绕过 claude -p 的技能/计划模式。

    复用环境变量：ANTHROPIC_BASE_URL、ANTHROPIC_AUTH_TOKEN/ANTHROPIC_API_KEY、ANTHROPIC_MODEL。
    没有 token 时返回 None，让调用方回退到 claude 子进程。
    """
    token = os.environ.get("ANTHROPIC_AUTH_TOKEN") or os.environ.get("ANTHROPIC_API_KEY")
    if not token:
        return None

    base_url = os.environ.get("ANTHROPIC_BASE_URL", "https://api.anthropic.com").rstrip("/")
    model = (
        os.environ.get("ANTHROPIC_MODEL")
        or os.environ.get("ANTHROPIC_DEFAULT_SONNET_MODEL")
        or "claude-sonnet-4-6"
    )
    parsed = urllib.parse.urlparse(base_url)
    if parsed.scheme != "https" or not parsed.netloc:
        raise ValidationError(f"ANTHROPIC_BASE_URL 非法：{base_url}")
    path = (parsed.path.rstrip("/") + "/v1/messages") if parsed.path.rstrip("/") else "/v1/messages"

    payload = json.dumps({
        "model": model,
        "max_tokens": 16384,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    conn = http.client.HTTPSConnection(
        parsed.netloc, context=ssl.create_default_context(), timeout=900
    )
    try:
        conn.request("POST", path, body=payload, headers={
            "x-api-key": token,
            "authorization": f"Bearer {token}",
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        })
        resp = conn.getresponse()
        body = resp.read().decode("utf-8")
        if resp.status != 200:
            raise ValidationError(f"API 错误 {resp.status}：{body[:500]}")
        data = json.loads(body)
        if data.get("stop_reason") == "max_tokens":
            raise ValidationError(
                "生成内容过长被截断（已达 max_tokens 上限），请重试或拆分该工具的命令范围"
            )
        parts = data.get("content", [])
        text = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
        if not text.strip():
            raise ValidationError(f"API 未返回文本内容：{body[:500]}")
        return text
    except ValidationError:
        raise
    except (OSError, ssl.SSLError, json.JSONDecodeError, KeyError) as exc:
        raise ValidationError(f"API 调用失败：{exc}") from exc
    finally:
        conn.close()


def _call_claude_cli(prompt, prefer_web=False):
    if not CLAUDE_BIN:
        if prefer_web:
            raise ValidationError(
                "联网核对需要 Claude Code，请先安装后重试，或取消勾选用快速模式。"
            )
        raise ValidationError(
            "找不到 claude 命令，请安装 Claude Code 后重新运行 native-host 安装脚本"
        )

    # Native Messaging hosts inherit a minimal browser environment. Build a
    # process-local PATH so npm-installed CLIs can still locate their Node runtime.
    env = subprocess_environment(allow_web=True)
    global _active_proc
    try:
        _active_proc = subprocess.Popen(
            [
                CLAUDE_BIN,
                "-p",
                prompt,
                "--permission-mode",
                "default",
                "--output-format",
                "json",
            ],
            cwd=PROJECT_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env,
        )
        try:
            stdout, stderr = _active_proc.communicate(timeout=900)
        except subprocess.TimeoutExpired:
            _active_proc.kill()
            _active_proc.communicate()
            raise ValidationError("执行超时（超过 15 分钟）")
        returncode = _active_proc.returncode
    except OSError as exc:
        raise ValidationError(f"启动 Claude Code 失败：{exc}") from exc
    finally:
        _active_proc = None

    if returncode != 0:
        error = stderr.strip()[:2000] or "claude 命令执行失败"
        if reports_missing_node_runtime(error):
            raise ValidationError(
                "已找到 Claude Code，但它需要的 Node.js 运行时不可用。"
                "请安装 Node.js，或重新运行 native-host 安装脚本刷新运行路径。"
            )
        raise ValidationError(error)

    return extract_json_output(stdout)


def _run_generation_prompt(prompt, use_api, prefer_web=False):
    if use_api:
        api_text = _call_api_direct(prompt)
        if api_text is not None:
            return extract_json_output(api_text)
    return _call_claude_cli(prompt, prefer_web)


def has_definitively_missing_sources(sources):
    """Return True only for stable not-found responses, not transient network errors."""
    for source in sources:
        url = source.get("resolvedUrl") or source.get("url")
        if source.get("kind") == "local-help" or not url:
            continue
        request = urllib.request.Request(
            url,
            method="HEAD",
            headers={"User-Agent": "ai-cli-cheatsheet-extension"},
        )
        try:
            with urllib.request.urlopen(request, timeout=8):
                pass
        except urllib.error.HTTPError as exc:
            if exc.code in {404, 410}:
                return True
        except (OSError, urllib.error.URLError):
            # Offline, rate-limited and temporary failures must not cause a noisy
            # source rediscovery. The content pass can still report a conflict.
            continue
    return False


def run_claude_query(
    tool_id, display_name, mode, prefer_web=False, update_context=None, deep_check=False
):
    if mode == "add" and os.path.exists(tool_data_path(tool_id)):
        raise ValidationError(f"data/{tool_id}.js 已存在，请使用更新模式")

    use_api = _has_api_token() and not prefer_web
    web_enabled = not use_api
    discovered = None
    current = None
    if mode == "update" and not deep_check:
        current = load_existing_dataset(tool_id)
        current_sources = current.get("meta", {}).get("sources") or []
        if current_sources and not has_definitively_missing_sources(current_sources):
            discovered = {
                "sources": current_sources,
                "conflicts": [],
                "notes": ["复用现有已登记来源；仅在深度核验时重新发现来源。"],
            }
    if discovered is None:
        discovery_prompt = build_source_discovery_prompt(
            tool_id, display_name, mode, web_enabled
        )
        discovered = _run_generation_prompt(discovery_prompt, use_api, prefer_web)
        if not isinstance(discovered, dict) or not isinstance(discovered.get("sources"), list):
            raise ValidationError("来源发现阶段没有返回合法的 sources 数组")

    content_prompt = build_prompt(
        tool_id,
        display_name,
        mode,
        web_enabled,
        discovered_sources=discovered,
        update_context=update_context,
    )
    raw = _run_generation_prompt(content_prompt, use_api, prefer_web)
    if use_api:
        raw = _demote_quasi_official(raw)
    if not isinstance(raw, dict) or not isinstance(raw.get("meta"), dict):
        raise ValidationError("生成结果缺少 meta 对象")
    if mode == "update" and current is None:
        current = load_existing_dataset(tool_id)
    today = datetime.date.today().isoformat()
    raw["meta"]["contentCheckedAt"] = today
    raw["meta"]["sourceCheckedAt"] = today
    raw["meta"]["updatePolicy"] = (
        update_context.get("policy") if update_context else
        (current or {}).get("meta", {}).get("updatePolicy") or
        raw["meta"].get("updatePolicy") or
        "release-driven"
    )
    if update_context:
        raw["meta"]["verifiedVersion"] = update_context["marker"]
    elif current and current.get("meta", {}).get("verifiedVersion"):
        raw["meta"]["verifiedVersion"] = current["meta"]["verifiedVersion"]
    dataset = validate_dataset(raw, tool_id)
    dataset["meta"]["verificationStatus"] = (
        "model-knowledge" if use_api else "web-assisted"
    )
    return dataset


def normalize_version_marker(value):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    if not text:
        return None
    match = re.search(r"\bv?(\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?)\b", text)
    return match.group(1) if match else text[:100]


def find_tool_binary(name):
    return find_executable(name)


def detect_local_version(tool_id):
    for command in TOOL_VERSION_COMMANDS.get(tool_id, ()):
        executable = find_tool_binary(command[0])
        if not executable:
            continue
        try:
            result = subprocess.run(
                [executable, *command[1:]],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
                env=subprocess_environment(allow_web=False),
            )
        except (OSError, subprocess.TimeoutExpired):
            continue
        output = (result.stdout or result.stderr or "").strip()
        if result.returncode != 0 and reports_missing_node_runtime(output):
            raise ValidationError(
                f"已找到 {command[0]}，但它需要的 Node.js 运行时不可用。"
                "请安装 Node.js，或重新运行 native-host 安装脚本刷新运行路径。"
            )
        marker = normalize_version_marker(output)
        if result.returncode == 0 and marker:
            return {
                "policy": "version-driven",
                "signalType": "local-version",
                "marker": marker,
                "detail": f"{command[0]} --version",
            }
    return None


def github_repository_slug(dataset):
    candidates = [
        *(dataset.get("meta", {}).get("references") or []),
        *(dataset.get("meta", {}).get("sources") or []),
    ]
    for source in candidates:
        if source.get("kind") != "official-repository":
            continue
        match = re.match(
            r"https://github\.com/([^/]+)/([^/#?]+)", source.get("url", "")
        )
        if match:
            return f"{match.group(1)}/{match.group(2).removesuffix('.git')}"
    return None


def detect_official_release(dataset):
    slug = github_repository_slug(dataset)
    if not slug:
        return None
    request = urllib.request.Request(
        f"https://api.github.com/repos/{slug}/releases/latest",
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "ai-cli-cheatsheet-extension",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (OSError, urllib.error.URLError, json.JSONDecodeError):
        return None
    marker = normalize_version_marker(payload.get("tag_name") or payload.get("name"))
    if not marker:
        return None
    return {
        "policy": dataset.get("meta", {}).get("updatePolicy") or "release-driven",
        "signalType": "official-release",
        "marker": marker,
        "detail": f"GitHub Release {slug}",
    }


def detect_update_signal(tool_id, dataset):
    policy = dataset.get("meta", {}).get("updatePolicy")
    if policy == "version-driven":
        return detect_local_version(tool_id) or detect_official_release(dataset)
    if policy == "release-driven":
        return detect_official_release(dataset)
    return None


def file_sha256(path):
    if not os.path.exists(path):
        return None
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def pending_path(token):
    if not isinstance(token, str) or not re.fullmatch(r"[a-f0-9]{32}", token):
        raise ValidationError("待处理更新 token 无效")
    real_pending_dir = os.path.realpath(PENDING_DIR)
    os.makedirs(real_pending_dir, exist_ok=True)
    path = os.path.realpath(os.path.join(real_pending_dir, f"{token}.json"))
    if os.path.dirname(path) != real_pending_dir:
        raise ValidationError("非法的待处理更新路径")
    return path


def item_signature(item):
    return {
        key: item.get(key)
        for key in (
            "cat", "cmd", "en", "zh", "context", "keywords", "examples",
            "evidenceRefs", "evidenceStatus", "platforms", "platformCmds",
        )
        if key in item
    }


def source_signature(source):
    return {
        key: value for key, value in source.items()
        if key not in {"checkedAt", "lastVerifiedAt"}
    }


def meaningful_meta_value(key, value):
    if key in {"sources", "references"}:
        return [source_signature(source) for source in (value or [])]
    return value


def preserve_existing_enrichment(old_dataset, new_dataset):
    old_items = {item.get("id"): item for item in old_dataset.get("items", []) if item.get("id")}
    for item in new_dataset.get("items", []):
        old_item = old_items.get(item.get("id"))
        if not old_item:
            continue
        if old_item.get("keywords") and not item.get("keywords"):
            item["keywords"] = old_item["keywords"]
        old_examples = old_item.get("examples") or []
        new_examples = item.get("examples") or []
        old_has_reviewed = any(
            example.get("evidenceTier") in {"first-party", "authoritative-community"}
            or example.get("sourceType") in {"official", "quasi-official", "manual"}
            for example in old_examples
        )
        if old_examples and (not new_examples or old_has_reviewed):
            item["examples"] = old_examples
    new_dataset["qualityWarnings"] = build_quality_warnings(new_dataset, old_dataset)
    return new_dataset


def build_dataset_diff(old_dataset, new_dataset):
    old_items = {item["id"]: item for item in old_dataset.get("items", []) if item.get("id")}
    new_items = {item["id"]: item for item in new_dataset.get("items", []) if item.get("id")}
    added = [new_items[item_id] for item_id in new_items.keys() - old_items.keys()]
    removed = [old_items[item_id] for item_id in old_items.keys() - new_items.keys()]
    modified = [
        {"before": old_items[item_id], "after": new_items[item_id]}
        for item_id in new_items.keys() & old_items.keys()
        if item_signature(old_items[item_id]) != item_signature(new_items[item_id])
    ]
    ignored_meta_fields = {"updatedAt", "contentCheckedAt", "sourceCheckedAt", "source"}
    old_meta = old_dataset.get("meta", {})
    new_meta = new_dataset.get("meta", {})
    meta_changes = {}
    for key in set(old_meta) | set(new_meta):
        if key in ignored_meta_fields:
            continue
        before = old_meta.get(key)
        after = new_meta.get(key)
        if meaningful_meta_value(key, before) != meaningful_meta_value(key, after):
            meta_changes[key] = {"before": before, "after": after}
    old_count = len(old_dataset.get("items", []))
    new_count = len(new_dataset.get("items", []))
    removed_count = len(removed)
    risks = []
    if old_count and (removed_count >= 10 or removed_count / old_count >= 0.25):
        risks.append(f"删除 {removed_count} 条，占原数据的 {removed_count / old_count:.0%}")
    if old_count and new_count < old_count * 0.7:
        risks.append(f"总条目从 {old_count} 降至 {new_count}，降幅超过 30%")
    old_host = urllib.parse.urlparse(old_dataset.get("meta", {}).get("sourceUrl", "")).hostname
    new_host = urllib.parse.urlparse(new_dataset.get("meta", {}).get("sourceUrl", "")).hostname
    if old_host and new_host and old_host != new_host:
        risks.append(f"官方来源域名从 {old_host} 变为 {new_host}")
    if old_dataset.get("meta", {}).get("builtIn") != new_dataset.get("meta", {}).get("builtIn"):
        risks.append("内置工具标记发生变化")

    old_sources = {
        source["id"]: source for source in old_dataset.get("meta", {}).get("sources", [])
    }
    new_sources = {
        source["id"]: source for source in new_dataset.get("meta", {}).get("sources", [])
    }
    added_sources = [new_sources[source_id] for source_id in new_sources.keys() - old_sources.keys()]
    removed_sources = [old_sources[source_id] for source_id in old_sources.keys() - new_sources.keys()]
    modified_sources = [
        {"before": old_sources[source_id], "after": new_sources[source_id]}
        for source_id in old_sources.keys() & new_sources.keys()
        if source_signature(old_sources[source_id]) != source_signature(new_sources[source_id])
    ]
    for source in added_sources:
        if source.get("kind") in {"authoritative-reference", "community", "official-repository"}:
            risks.append(f"新增需确认来源：{source.get('title')}（{source.get('kind')}）")
    if removed_sources:
        risks.append(f"移除 {len(removed_sources)} 个已有来源")

    evidence_rank = {
        "none": 0, "community": 1, "authoritative-community": 2, "first-party": 3
    }
    status_rank = {"unverified": 0, "partial": 1, "verified": 2}
    old_statuses = {
        item["id"]: status_rank.get(item.get("evidenceStatus", "unverified"), 0)
        for item in old_dataset.get("items", []) if item.get("id")
    }
    status_downgrades = [
        item["id"] for item in new_dataset.get("items", [])
        if item.get("id") in old_statuses
        and status_rank.get(item.get("evidenceStatus", "unverified"), 0) < old_statuses[item["id"]]
    ]
    if status_downgrades:
        risks.append(f"{len(status_downgrades)} 个条目的核验状态下降")
    evidence_ref_changes = []
    locator_losses = []
    for item_id in new_items.keys() & old_items.keys():
        old_refs = old_items[item_id].get("evidenceRefs") or []
        new_refs = new_items[item_id].get("evidenceRefs") or []
        if old_refs != new_refs:
            evidence_ref_changes.append(item_id)
        old_locators = {ref.get("locator") for ref in old_refs if ref.get("locator")}
        new_locators = {ref.get("locator") for ref in new_refs if ref.get("locator")}
        if old_locators - new_locators:
            locator_losses.append(item_id)
    if locator_losses:
        risks.append(f"{len(locator_losses)} 个条目的证据定位被移除")
    old_evidence = {
        item["id"]: max(
            [evidence_rank.get(example.get("evidenceTier", "none"), 0)
             for example in item.get("examples", [])] or [0]
        )
        for item in old_dataset.get("items", []) if item.get("id")
    }
    evidence_downgrades = [
        item["id"] for item in new_dataset.get("items", [])
        if item.get("id") in old_evidence and max(
            [evidence_rank.get(example.get("evidenceTier", "none"), 0)
             for example in item.get("examples", [])] or [0]
        ) < old_evidence[item["id"]]
    ]
    if evidence_downgrades:
        risks.append(f"{len(evidence_downgrades)} 个条目的案例证据等级下降")
    source_conflicts = new_dataset.get("sourceConflicts") or []
    if source_conflicts:
        risks.append(f"存在 {len(source_conflicts)} 项来源冲突")

    def summarize(items):
        return [
            {"id": item.get("id"), "cmd": item.get("cmd"), "zh": item.get("zh")}
            for item in items[:12]
        ]

    return {
        "counts": {
            "added": len(added),
            "modified": len(modified),
            "removed": len(removed),
            "meta": len(meta_changes),
        },
        "added": summarize(added),
        "modified": [
            {
                "id": change["after"].get("id"),
                "before": change["before"].get("cmd"),
                "after": change["after"].get("cmd"),
                "zh": change["after"].get("zh"),
            }
            for change in modified[:12]
        ],
        "removed": summarize(removed),
        "metaChanges": meta_changes,
        "sourceChanges": {
            "added": added_sources,
            "removed": removed_sources,
            "modified": modified_sources,
            "conflicts": source_conflicts,
            "evidenceDowngrades": evidence_downgrades,
            "statusDowngrades": status_downgrades,
            "evidenceRefChanges": evidence_ref_changes,
            "locatorLosses": locator_losses,
        },
        "risks": risks,
    }


def load_existing_dataset(tool_id):
    data_path = tool_data_path(tool_id)
    if not os.path.exists(data_path):
        raise ValidationError(f"找不到 data/{tool_id}.js")
    try:
        with open(data_path, "r", encoding="utf-8") as handle:
            content = handle.read()
    except OSError as exc:
        raise ValidationError(f"无法读取 data/{tool_id}.js：{exc}") from exc
    return validate_dataset(
        parse_data_file(content, tool_id),
        tool_id,
        require_structured_source=False,
    )


def parse_data_file(content, expected_tool_id):
    """Parse the repository's JSON-in-JS wrapper without executing JavaScript."""
    expected_tool_id = validate_tool_id(expected_tool_id)
    header = (
        "// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.\n"
        "window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};\n"
        "window.CHEATSHEET_DATA["
    )
    if not isinstance(content, str) or not content.startswith(header):
        raise ValidationError("数据文件格式无效：缺少受支持的固定文件头")

    cursor = len(header)
    decoder = json.JSONDecoder()
    try:
        declared_tool_id, cursor = decoder.raw_decode(content, cursor)
    except json.JSONDecodeError as exc:
        raise ValidationError("数据文件格式无效：工具 ID 不是合法 JSON 字符串") from exc
    if declared_tool_id != expected_tool_id:
        raise ValidationError(
            f"数据文件工具 ID 不匹配：应为 {expected_tool_id}，实际为 {declared_tool_id}"
        )
    assignment = "] = "
    if content[cursor:cursor + len(assignment)] != assignment:
        raise ValidationError("数据文件格式无效：缺少数据赋值语句")
    cursor += len(assignment)
    try:
        dataset, cursor = decoder.raw_decode(content, cursor)
    except json.JSONDecodeError as exc:
        raise ValidationError("数据文件格式无效：数据 JSON 不完整或非法") from exc
    if not isinstance(dataset, dict):
        raise ValidationError("数据文件格式无效：数据必须是 JSON 对象")
    if content[cursor:] not in {";", ";\n"}:
        raise ValidationError("数据文件格式无效：JSON 后存在不允许的附加内容")
    return dataset


def add_tool(tool_id, display_name, prefer_web=False):
    if os.path.exists(tool_data_path(tool_id)):
        raise ValidationError(f"data/{tool_id}.js 已存在，请使用更新模式")
    dataset = run_claude_query(tool_id, display_name, "add", prefer_web)
    data_path = tool_data_path(tool_id)
    new_content = render_data_file(dataset)
    atomic_write(data_path, new_content)
    try:
        write_data_index()
    except Exception:
        os.unlink(data_path)
        raise
    return {
        "ok": True,
        "changed": True,
        "output": dataset["summary"] or f"已校验 {len(dataset['items'])} 条数据",
        "qualityWarnings": dataset.get("qualityWarnings", []),
    }


def preview_update(tool_id, display_name, prefer_web=False, deep_check=False):
    old_dataset = load_existing_dataset(tool_id)
    policy = old_dataset.get("meta", {}).get("updatePolicy")
    signal = None
    if not deep_check and policy == "manual-only":
        return {
            "ok": True,
            "changed": False,
            "output": "该工具使用稳定资料策略，不按时间检查。需要时可使用“强制深度检查”。",
        }
    if not deep_check and policy in {"version-driven", "release-driven"}:
        signal = detect_update_signal(tool_id, old_dataset)
        if not signal:
            return {
                "ok": True,
                "changed": False,
                "output": "未找到可用的本机版本或官方发布信号；未调用模型。需要时可使用“强制深度检查”。",
            }
        if normalize_version_marker(old_dataset["meta"].get("verifiedVersion")) == signal["marker"]:
            return {
                "ok": True,
                "changed": False,
                "output": f"当前为 {signal['marker']}，与已核验版本一致，无需更新。",
                "updateSignal": signal,
            }
    new_dataset = run_claude_query(
        tool_id,
        display_name,
        "update",
        True if (signal or deep_check) else prefer_web,
        update_context=signal,
        deep_check=deep_check,
    )
    new_dataset["meta"]["builtIn"] = old_dataset["meta"].get("builtIn", False)
    if policy:
        new_dataset["meta"]["updatePolicy"] = policy
    new_dataset = preserve_existing_enrichment(old_dataset, new_dataset)
    diff = build_dataset_diff(old_dataset, new_dataset)
    diff["qualityWarnings"] = new_dataset.get("qualityWarnings", [])
    changed = any(diff["counts"].values())
    if not changed:
        return {
            "ok": True,
            "changed": False,
            "diff": diff,
            "qualityWarnings": new_dataset.get("qualityWarnings", []),
            "updateSignal": signal,
            "output": (
                f"已核对 {signal['marker']}，命令集没有变化"
                if signal else "数据没有变化"
            ),
        }
    token = secrets.token_hex(16)
    payload = {
        "token": token,
        "toolId": tool_id,
        "oldHash": file_sha256(tool_data_path(tool_id)),
        "dataset": new_dataset,
        "diff": diff,
    }
    atomic_write(pending_path(token), json.dumps(payload, ensure_ascii=False, indent=2))
    return {
        "ok": True,
        "changed": True,
        "pendingToken": token,
        "toolId": tool_id,
        "diff": diff,
        "qualityWarnings": new_dataset.get("qualityWarnings", []),
        "updateSignal": signal,
        "output": new_dataset["summary"] or (
            f"检测到 {signal['marker']}，发现可用更新" if signal else "发现可用更新"
        ),
    }


def load_pending(token):
    path = pending_path(token)
    if not os.path.exists(path):
        raise ValidationError("待处理更新不存在或已过期")
    try:
        with open(path, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValidationError("待处理更新无法读取") from exc
    if payload.get("token") != token:
        raise ValidationError("待处理更新 token 不匹配")
    return path, payload


def apply_update(token, confirm_risk=False):
    path, payload = load_pending(token)
    data_path = tool_data_path(payload["toolId"])
    if file_sha256(data_path) != payload.get("oldHash"):
        raise ValidationError("原数据已发生变化，请重新检查更新")
    dataset = validate_dataset(payload.get("dataset"), payload["toolId"])
    if payload.get("diff", {}).get("risks") and not confirm_risk:
        raise ValidationError("该更新包含高风险变化，请核对并确认后再应用")
    atomic_write(data_path, render_data_file(dataset))
    os.unlink(path)
    return {
        "ok": True,
        "changed": True,
        "output": "更新已应用",
        "toolId": payload["toolId"],
        "qualityWarnings": dataset.get("qualityWarnings", []),
    }


def discard_update(token):
    path, payload = load_pending(token)
    os.unlink(path)
    return {"ok": True, "changed": False, "output": "已放弃本次更新", "toolId": payload["toolId"]}


def remove_tool(tool_id):
    data_path = tool_data_path(tool_id)
    if not os.path.exists(data_path):
        raise ValidationError(f"找不到 data/{tool_id}.js")
    with open(data_path, "r", encoding="utf-8") as handle:
        old_content = handle.read()
    if re.search(r"""["']?builtIn["']?\s*:\s*true\b""", old_content):
        raise ValidationError("内置工具不可删除，可以在管理页隐藏")
    os.unlink(data_path)
    try:
        write_data_index()
    except Exception:
        atomic_write(data_path, old_content)
        raise
    return {
        "ok": True,
        "changed": True,
        "output": f"已移除 data/{tool_id}.js 并更新数据索引",
    }


def handle_message(message):
    request = validate_request(message)
    if request["action"] == "ping":
        return {"ok": True, "pong": True}
    if request["action"] == "add_tool":
        return add_tool(request["tool"], request["display_name"], request.get("prefer_web", False))
    if request["action"] == "preview_update":
        return preview_update(
            request["tool"],
            request["display_name"],
            request.get("prefer_web", False),
            request.get("deep_check", False),
        )
    if request["action"] == "apply_update":
        return apply_update(request["token"], request["confirm_risk"])
    if request["action"] == "discard_update":
        return discard_update(request["token"])
    if request["action"] == "remove_tool":
        return remove_tool(request["tool"])
    raise ValidationError(f"未知的 action: {request['action']}")


def main():
    try:
        message = read_message()
        if message is None:
            return
        send_message(handle_message(message))
    except ValidationError as exc:
        send_message({"ok": False, "error": str(exc)})
    except Exception as exc:  # Native hosts must always return a protocol response.
        send_message({"ok": False, "error": f"本地更新程序异常：{exc}"})


if __name__ == "__main__":
    main()
