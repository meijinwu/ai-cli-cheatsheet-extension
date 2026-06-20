#!/usr/bin/env python3
"""
Native Messaging host: bridge between the browser extension and local Claude Code.
Chrome launches this script on demand, processes one request, then exits.
Protocol: 4-byte little-endian length prefix + UTF-8 JSON on stdin/stdout.
"""
import sys
import json
import struct
import subprocess
import os
import re


def find_claude_binary():
    """Find the claude CLI binary on macOS, Linux, or Windows."""
    import shutil

    # shutil.which respects PATH and handles .cmd/.exe extensions on Windows
    for name in ("claude", "claude.cmd"):
        result = shutil.which(name)
        if result:
            return result

    # Fallback: common install locations not always in PATH
    is_windows = sys.platform == "win32"
    if is_windows:
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
    for p in candidates:
        if os.path.isfile(p) and os.access(p, os.X_OK):
            return p
    return None


CLAUDE_BIN = find_claude_binary()

# AICLI_PROJECT_DIR is set by run.sh so host.py works from any install location.
PROJECT_DIR = (
    os.environ.get("AICLI_PROJECT_DIR")
    or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
DATA_DIR = os.path.join(PROJECT_DIR, "data")
POPUP_HTML = os.path.join(PROJECT_DIR, "popup.html")


def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    length = struct.unpack("<I", raw_length)[0]
    try:
        return json.loads(sys.stdin.buffer.read(length).decode("utf-8", errors="replace"))
    except json.JSONDecodeError:
        send_message({"ok": False, "error": "Invalid JSON in request"})
        sys.exit(1)


def send_message(obj):
    encoded = json.dumps(obj).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def ensure_script_tag(tool_id):
    """Insert <script src="data/<tool_id>.js"> into popup.html if not already present."""
    import fcntl as _fcntl  # noqa: PLC0415 — imported here to keep Windows compat simpler
    tag = f'<script src="data/{tool_id}.js"></script>'
    with open(POPUP_HTML, "r+", encoding="utf-8") as f:
        if sys.platform != "win32":
            _fcntl.flock(f, _fcntl.LOCK_EX)
        html = f.read()
        if tag in html:
            if sys.platform != "win32":
                _fcntl.flock(f, _fcntl.LOCK_UN)
            return False
    pattern = re.compile(r'<script src="data/[^"]+\.js"></script>\s*\n')
    matches = list(pattern.finditer(html))
    if matches:
        pos = matches[-1].end()
        new_html = html[:pos] + tag + "\n" + html[pos:]
    else:
        new_html = html.replace(
            '<script src="popup.js"></script>',
            tag + '\n<script src="popup.js"></script>',
        )
    with open(POPUP_HTML, "w", encoding="utf-8") as fw:
        fw.write(new_html)
    return True


def existing_tools():
    """List already-bundled tool IDs to avoid color collisions in the prompt."""
    if not os.path.isdir(DATA_DIR):
        return []
    try:
        return sorted(f[:-3] for f in os.listdir(DATA_DIR) if f.endswith(".js"))
    except OSError:
        return []


def run_claude_task(tool_id, tool_display_name, mode):
    existing = existing_tools()

    if mode == "add":
        prompt = (
            f"我要在这个速查插件里新增一个工具，用户输入的名称是「{tool_display_name}」。"
            f"请先识别这是哪个工具的完整官方名称（例如 IDEA→IntelliJ IDEA，vscode→VS Code），"
            f"用完整名称搜索官方文档，id 用 \"{tool_id}\"。\n"
            f"当前已有的工具文件：{', '.join(existing) if existing else '（还没有任何工具）'}。\n\n"
            f"请你：\n"
            f"1. 判断该工具是不是命令行/终端类工具（有统一的 /help 或 --help 入口、官方文档有完整命令清单）。\n"
            f"   - 如果是（如 OpenCode、Codex CLI），按 data/SCHEMA.md 格式搜索官方文档，"
            f"创建 data/{tool_id}.js，收录完整的快捷键(shortcut)、命令(slash)、启动参数(flag)。\n"
            f"   - 如果不是（如 IntelliJ IDEA、VS Code 等图形界面工具），"
            f"搜索官方文档里的默认快捷键列表（Keymap / Keyboard Shortcuts），"
            f"以 macOS 默认键位为主收录常用快捷键，Windows/Linux 差异在 zh 字段括号内注明，"
            f"cat 字段全部用 shortcut，meta.source 里注明\"仅收录 macOS 默认键位常用子集\"。\n"
            f"2. meta.color 选一个和已有工具明显不同的十六进制颜色。\n"
            f"3. 严禁编造没有查到的命令或快捷键，查不到就如实少收录，不要为了凑数量编内容。\n"
            f"4. 完成后用一句话总结：创建了什么文件、收录了多少条、CLI 还是 IDE 类型。"
        )
    else:
        prompt = (
            f"请检查 {tool_display_name} 的官方文档是否有更新的命令、快捷键或参数说明。"
            f"按照 data/SCHEMA.md 的格式，更新 data/{tool_id}.js（保留原有未变化的条目，不要整份重写）。"
            f"严禁编造没有查到的命令，查不到就如实跳过。"
            f"完成后用一句话总结你做了什么改动。"
        )

    if not CLAUDE_BIN:
        return {
            "ok": False,
            "error": (
                "找不到 claude 命令，请确认 Claude Code 已安装"
                "（npm install -g @anthropic-ai/claude-code）。"
                "安装后重新运行 native-host/install.sh。"
            ),
        }

    try:
        result = subprocess.run(
            [CLAUDE_BIN, "-p", prompt, "--permission-mode", "acceptEdits"],
            cwd=PROJECT_DIR,
            capture_output=True,
            text=True,
            timeout=900,
        )
        if result.returncode != 0:
            return {"ok": False, "error": result.stderr.strip()[:2000] or "claude 命令执行失败"}
        claude_summary = result.stdout.strip()[:4000]
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "执行超时（超过15分钟），请稍后再试或在终端手动运行 claude"}
    except Exception as e:
        return {"ok": False, "error": f"未知错误：{e}"}

    note = ""
    if mode == "add":
        data_file = os.path.join(DATA_DIR, f"{tool_id}.js")
        if not os.path.exists(data_file):
            return {
                "ok": False,
                "error": f"Claude 没有成功创建 data/{tool_id}.js。Claude 输出：\n{claude_summary}",
            }
        inserted = ensure_script_tag(tool_id)
        note = "\n\n（已自动补上 popup.html 引用）" if inserted else "\n\n（popup.html 引用已存在）"

    return {"ok": True, "output": claude_summary + note}


def main():
    message = read_message()
    if not isinstance(message, dict) or "action" not in message:
        send_message({"ok": False, "error": "Invalid message: missing 'action' field"})
        return
    action = message.get("action")

    if action == "ping":
        send_message({"ok": True, "pong": True})
        return

    if action == "update_tool":
        tool_id = message.get("tool", "").strip()
        display_name = message.get("display_name", tool_id).strip()
        mode = message.get("mode", "update").strip()
        if not tool_id:
            send_message({"ok": False, "error": "没有指定工具名称"})
            return
        send_message(run_claude_task(tool_id, display_name, mode))
        return

    send_message({"ok": False, "error": f"未知的 action: {action}"})


if __name__ == "__main__":
    main()
