#!/usr/bin/env python3
"""Native Messaging host for safe, schema-validated cheatsheet updates."""

import atexit
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
    r"(?:\brm(?:\s|$)|\b(?:reset\s+--hard|push\s+--force|kill\s+-9|chmod|chown|restart)\b|--(?:delete|yolo)\b|dangerously-bypass\b)|(^|\s)>(?!>)",
    re.IGNORECASE,
)
POSSIBLE_SECRET_RE = re.compile(
    r"api[_-]?key|secret|token\s*[=:]\s*[a-z0-9_-]{12,}", re.IGNORECASE
)
# 镜像 shared/validation-rules.json，由 tests/test_validation_consistency.js 防漂移。
SOURCE_TIERS = {"official", "quasi-official", "community"}
EXAMPLE_SOURCE_TYPES = {"official", "quasi-official", "manual", "ai-derived"}
QUASI_OFFICIAL_DOMAINS = (
    "tldr.sh",
    "man7.org",
    "ss64.com",
    "manpages.debian.org",
    "developer.mozilla.org",
    "wiki.archlinux.org",
    "devhints.io",
    "cheat.sh",
    "readthedocs.io",
)


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


def find_claude_binary():
    """Find the Claude CLI binary on macOS, Linux, or Windows."""
    for name in ("claude", "claude.cmd"):
        result = shutil.which(name)
        if result:
            return result

    if sys.platform == "win32":
        appdata = os.environ.get("APPDATA", "")
        candidates = [
            os.path.join(appdata, "npm", "claude.cmd"),
            os.path.join(appdata, "npm", "claude"),
            r"C:\Program Files\nodejs\claude.cmd",
        ]
    else:
        candidates = [
            os.path.expanduser("~/.local/bin/claude"),
            os.path.expanduser("~/.npm-global/bin/claude"),
            "/usr/local/bin/claude",
            "/opt/homebrew/bin/claude",
            "/usr/bin/claude",
        ]
    for path in candidates:
        if os.path.isfile(path) and os.access(path, os.X_OK):
            return path
    return None


CLAUDE_BIN = find_claude_binary()
NODE_BIN = shutil.which("node")
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
    source_tier = meta.get("sourceTier")
    if source_tier is not None and source_tier not in SOURCE_TIERS:
        raise ValidationError("meta.sourceTier 非法")
    source_url = checked_text(meta.get("sourceUrl"), "meta.sourceUrl", required=False)
    updated_at = checked_text(meta.get("updatedAt"), "meta.updatedAt", required=False)
    coverage = checked_text(meta.get("coverage"), "meta.coverage", required=False)
    platforms = meta.get("platforms")
    if require_structured_source and not all([source_url, updated_at, coverage]):
        raise ValidationError("新生成的数据必须包含 meta.sourceUrl、meta.updatedAt 和 meta.coverage")
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
                    "sourceType": example.get("sourceType", "ai-derived"),
                }
                if not isinstance(clean_example["copyable"], bool):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}].copyable 必须是布尔值"
                    )
                if clean_example["sourceType"] not in EXAMPLE_SOURCE_TYPES:
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
                if clean_example["sourceType"] == "quasi-official" and not host_in_quasi_official_whitelist(
                    example_source_url
                ):
                    raise ValidationError(
                        f"items[{index}].examples[{example_index}].sourceType 为 quasi-official 时，"
                        "sourceUrl 主机名必须在白名单内"
                    )
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
    if previous_dataset is not None:
        previous_covered = sum(1 for item in previous_dataset.get("items", []) if item.get("examples"))
        if covered < previous_covered:
            warnings.append(f"示例覆盖从 {previous_covered} 条降至 {covered} 条")
    return warnings


def render_data_file(dataset):
    tool_id = dataset["meta"]["id"]
    serializable = {"meta": dataset["meta"], "items": dataset["items"]}
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


def build_prompt(tool_id, display_name, mode, web_enabled):
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
    return f"""
你正在为浏览器扩展{operation}「{display_name}」的数据。基于你已知的官方文档与训练知识整理，确保命令准确、宁可少收录也不要编造。
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
    "updatedAt": "YYYY-MM-DD",
    "coverage": "完整命令列表或常用子集说明",
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
      "examples": [
        {{
          "value": "具体命令、Markdown输入或操作步骤",
          "description": "中文说明执行后会发生什么",
          "copyable": true,
          "warning": "可选；危险操作或注意事项",
          "sourceType": "official|quasi-official|manual|ai-derived",
          "sourceUrl": "可选；具体示例来源的HTTPS地址",
          "platforms": ["可选；mac/windows/linux"],
          "platformValues": {{"mac": "可选的平台专属示例"}}
        }}
      ],
      "platforms": ["可选；mac/windows/linux"],
      "platformCmds": {{"mac": "可选的平台专属命令"}}
    }}
  ],
  "summary": "一句话说明数据变化"
}}

要求：
1. {source_policy}
2. 尽量覆盖全面，不要只给极少量常用项。CLI 工具应收录：常用子命令（slash）以及每个重要子命令下的常用选项（flag），目标 50 条以上；IDE 类工具只收录默认快捷键常用子集并在 source 标明平台和限制。
3. flag 类条目的 cmd 写成「子命令 + 选项」的完整形式（例如 git commit -m、git log --oneline），并用 context 标注所属子命令。
4. 同一 cat、cmd、context 组合不得重复。
5. 更新时保留仍有效的条目及其 id，只修改确有变化的内容。{upgrade_note}
6. 所有字符串必须是有效 JSON 字符串。
7. sourceUrl、updatedAt、coverage 必须填写；平台快捷键应尽量使用 platformCmds 表达。
8. 每个条目都必须提供 keywords 和 examples；每条最多 3 个示例。
9. CLI 示例必须是完整可执行命令；IDE/快捷键示例写具体操作场景并设 copyable=false；Markdown 工具示例提供可复制输入。
10. 更新时保留已有 keywords 和 examples，并为所有新增条目补充关键词和示例。
11. 官方明确示例标记 official；人工整理标记 manual；根据命令语义推导的标记 ai-derived；可信第三方补充按上面第 1 条的来源优先级处理。
12. {tier_rule}

{current_section}
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
    if isinstance(meta, dict) and meta.get("sourceTier") == "quasi-official":
        meta["sourceTier"] = "community"
    for item in dataset.get("items", []):
        for example in item.get("examples", []) or []:
            if isinstance(example, dict) and example.get("sourceType") == "quasi-official":
                example["sourceType"] = "ai-derived"
                example.pop("sourceUrl", None)
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


def run_claude_query(tool_id, display_name, mode, prefer_web=False):
    if mode == "add" and os.path.exists(tool_data_path(tool_id)):
        raise ValidationError(f"data/{tool_id}.js 已存在，请使用更新模式")

    # 有 token 时默认走 API（无联网、快速）；勾选了"联网核对"(prefer_web) 则即使有 token
    # 也强制走 claude -p 联网路径，以便在官方缺口处补充并核实类官方来源。
    # web_enabled 决定 prompt 是否允许 quasi-official 补缺，与路径选择保持一致。
    use_api = _has_api_token() and not prefer_web
    web_enabled = not use_api
    prompt = build_prompt(tool_id, display_name, mode, web_enabled)

    if use_api:
        # 直接调用 API，完全绕过 claude -p 的技能/计划模式系统
        api_text = _call_api_direct(prompt)
        if api_text is not None:
            # 校验前先降级：离线无法核实第三方来源，去掉类官方标签（防御纵深，
            # 即使模型无视 prompt，也避免未核实的白名单 URL 混入或导致校验失败）。
            raw = _demote_quasi_official(extract_json_output(api_text))
            dataset = validate_dataset(raw, tool_id)
            dataset["meta"]["verificationStatus"] = "model-knowledge"
            return dataset

    if not CLAUDE_BIN:
        if prefer_web:
            raise ValidationError(
                "联网核对需要 Claude Code，请先安装后重试，或取消勾选用快速模式。"
            )
        raise ValidationError(
            "找不到 claude 命令，请安装 Claude Code 后重新运行 native-host 安装脚本"
        )

    # Allow web search so Claude can fetch official docs.
    # CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS blocks the web_search tool when set.
    env = {k: v for k, v in os.environ.items() if k != "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS"}
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
        raise ValidationError(error)

    dataset = validate_dataset(extract_json_output(stdout), tool_id)
    dataset["meta"]["verificationStatus"] = "web-assisted"
    return dataset


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
            "platforms", "platformCmds",
        )
        if key in item
    }


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
            example.get("sourceType") in {"official", "manual"} for example in old_examples
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
    meta_changes = {
        key: {"before": old_dataset.get("meta", {}).get(key), "after": new_dataset["meta"].get(key)}
        for key in new_dataset["meta"]
        if old_dataset.get("meta", {}).get(key) != new_dataset["meta"].get(key)
    }
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
        "risks": risks,
    }


def load_existing_dataset(tool_id):
    data_path = tool_data_path(tool_id)
    if not os.path.exists(data_path):
        raise ValidationError(f"找不到 data/{tool_id}.js")
    if not NODE_BIN:
        raise ValidationError("找不到 node 命令，无法读取当前数据用于差异比较")
    script = (
        "global.window={};"
        "require(process.argv[1]);"
        "const id=process.argv[2];"
        "process.stdout.write(JSON.stringify(global.window.CHEATSHEET_DATA[id]));"
    )
    try:
        result = subprocess.run(
            [NODE_BIN, "-e", script, data_path, tool_id],
            capture_output=True,
            text=True,
            timeout=15,
            check=False,
        )
        if result.returncode != 0:
            raise ValidationError(result.stderr.strip() or f"无法解析 data/{tool_id}.js")
        dataset = json.loads(result.stdout)
        return validate_dataset(dataset, tool_id, require_structured_source=False)
    except (OSError, subprocess.TimeoutExpired, json.JSONDecodeError) as exc:
        raise ValidationError(f"无法解析 data/{tool_id}.js") from exc


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


def preview_update(tool_id, display_name, prefer_web=False):
    old_dataset = load_existing_dataset(tool_id)
    new_dataset = run_claude_query(tool_id, display_name, "update", prefer_web)
    new_dataset["meta"]["builtIn"] = old_dataset["meta"].get("builtIn", False)
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
            "output": "数据没有变化",
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
        "output": new_dataset["summary"] or "发现可用更新",
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
            request["tool"], request["display_name"], request.get("prefer_web", False)
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
