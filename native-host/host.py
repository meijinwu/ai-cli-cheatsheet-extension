#!/usr/bin/env python3
"""Native Messaging host for safe, schema-validated cheatsheet updates."""

import hashlib
import json
import os
import re
import secrets
import shutil
import struct
import subprocess
import sys
import tempfile


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
        return {"action": action, "token": token}

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
            raise ValidationError(
                f"重复条目：{clean_item['cmd']}；同一快捷键用于不同场景时必须填写不同 context"
            )
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
                raise ValidationError(f"重复条目 ID：{item_id}")
        item_ids.add(item_id)
        clean_item["id"] = item_id
        clean_items.append(clean_item)

    if not clean_items:
        raise ValidationError("items 不能为空")
    return {
        "meta": clean_meta,
        "items": clean_items,
        "summary": checked_text(payload.get("summary", ""), "summary", required=False) or "",
    }


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
        match = re.search(r"```(?:json)?\s*(\{.*\})\s*```", text, re.DOTALL)
        if not match:
            start, end = text.find("{"), text.rfind("}")
            if start < 0 or end <= start:
                raise ValidationError("Claude 没有返回有效 JSON")
            text = text[start : end + 1]
        else:
            text = match.group(1)
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError as exc:
            raise ValidationError("Claude 返回的 JSON 无法解析") from exc

    if isinstance(parsed, dict) and "result" in parsed and not {"meta", "items"} <= parsed.keys():
        result = parsed["result"]
        if isinstance(result, str):
            return extract_json_output(result)
        parsed = result
    return parsed


def build_prompt(tool_id, display_name, mode):
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
    return f"""
你正在为浏览器扩展{operation}「{display_name}」的数据。请查询并核对官方文档。
你不能编辑或创建任何文件。最终只输出一个 JSON 对象，不要 Markdown，不要解释。

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
      "platforms": ["可选；mac/windows/linux"],
      "platformCmds": {{"mac": "可选的平台专属命令"}}
    }}
  ],
  "summary": "一句话说明数据变化"
}}

要求：
1. 只收录官方资料能够确认的内容，禁止编造。
2. CLI 工具可包含 shortcut、slash、flag；IDE 类工具只收录默认快捷键常用子集并在 source 标明平台和限制。
3. 同一 cat、cmd、context 组合不得重复。
4. 更新时保留仍有效的条目及其 id，只修改确有变化的内容。
5. 所有字符串必须是有效 JSON 字符串。
6. sourceUrl、updatedAt、coverage 必须填写；平台快捷键应尽量使用 platformCmds 表达。

{current_section}
""".strip()


def run_claude_query(tool_id, display_name, mode):
    if mode == "add" and os.path.exists(tool_data_path(tool_id)):
        raise ValidationError(f"data/{tool_id}.js 已存在，请使用更新模式")
    if not CLAUDE_BIN:
        raise ValidationError(
            "找不到 claude 命令，请安装 Claude Code 后重新运行 native-host 安装脚本"
        )

    prompt = build_prompt(tool_id, display_name, mode)
    try:
        result = subprocess.run(
            [
                CLAUDE_BIN,
                "-p",
                prompt,
                "--permission-mode",
                "plan",
                "--output-format",
                "json",
            ],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True,
            timeout=900,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise ValidationError("执行超时（超过 15 分钟）") from exc
    except OSError as exc:
        raise ValidationError(f"启动 Claude Code 失败：{exc}") from exc

    if result.returncode != 0:
        error = result.stderr.strip()[:2000] or "claude 命令执行失败"
        raise ValidationError(error)

    return validate_dataset(extract_json_output(result.stdout), tool_id)


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
        for key in ("cat", "cmd", "en", "zh", "context", "platforms", "platformCmds")
        if key in item
    }


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


def add_tool(tool_id, display_name):
    if os.path.exists(tool_data_path(tool_id)):
        raise ValidationError(f"data/{tool_id}.js 已存在，请使用更新模式")
    dataset = run_claude_query(tool_id, display_name, "add")
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
    }


def preview_update(tool_id, display_name):
    old_dataset = load_existing_dataset(tool_id)
    new_dataset = run_claude_query(tool_id, display_name, "update")
    diff = build_dataset_diff(old_dataset, new_dataset)
    changed = any(diff["counts"].values())
    if not changed:
        return {"ok": True, "changed": False, "diff": diff, "output": "数据没有变化"}
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


def apply_update(token):
    path, payload = load_pending(token)
    data_path = tool_data_path(payload["toolId"])
    if file_sha256(data_path) != payload.get("oldHash"):
        raise ValidationError("原数据已发生变化，请重新检查更新")
    dataset = validate_dataset(payload.get("dataset"), payload["toolId"])
    atomic_write(data_path, render_data_file(dataset))
    os.unlink(path)
    return {"ok": True, "changed": True, "output": "更新已应用", "toolId": payload["toolId"]}


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
        return add_tool(request["tool"], request["display_name"])
    if request["action"] == "preview_update":
        return preview_update(request["tool"], request["display_name"])
    if request["action"] == "apply_update":
        return apply_update(request["token"])
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
