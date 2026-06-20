// 数据来源：官方文档 opencode.ai/docs（TUI / CLI / Keybinds 页面），整理于 2026-06
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["opencode"] = {
  meta: {
    id: "opencode",
    name: "OpenCode",
    color: "#e8445a",
    source: "官方文档 opencode.ai/docs，整理于 2026-06",
    order: 5
  },
  items: [
    // ===== 全局操作 =====
    {cat:"shortcut", cmd:"ctrl+x（Leader 键）", en:"Leader key prefix", zh:"大多数功能快捷键的前缀，可在 tui.json 中自定义"},
    {cat:"shortcut", cmd:"ctrl+c / ctrl+d", en:"Clear input or exit", zh:"输入框有内容时清空；输入框为空时退出"},
    {cat:"shortcut", cmd:"Esc", en:"Interrupt running session", zh:"中断当前正在运行的生成或会话"},
    {cat:"shortcut", cmd:"ctrl+p", en:"Open command palette", zh:"打开命令面板，快速搜索所有命令"},

    // ===== 会话操作 =====
    {cat:"shortcut", cmd:"ctrl+x n", en:"New session", zh:"开启新会话（等同于 /new）"},
    {cat:"shortcut", cmd:"ctrl+x l", en:"Session list", zh:"列出所有历史会话并切换（等同于 /sessions）"},
    {cat:"shortcut", cmd:"ctrl+x c", en:"Compact session", zh:"压缩当前会话上下文以释放 token（等同于 /compact）"},
    {cat:"shortcut", cmd:"ctrl+x u", en:"Undo last message", zh:"撤销最后一条消息并恢复相关文件变更（等同于 /undo，需 Git 仓库）"},
    {cat:"shortcut", cmd:"ctrl+x r", en:"Redo undone message", zh:"重做已撤销的消息（等同于 /redo，仅在 /undo 后可用）"},
    {cat:"shortcut", cmd:"ctrl+x g", en:"Session timeline", zh:"查看当前会话的时间线"},
    {cat:"shortcut", cmd:"ctrl+x x", en:"Export session", zh:"将当前会话导出为 Markdown 并用编辑器打开（等同于 /export）"},
    {cat:"shortcut", cmd:"ctrl+r", en:"Rename session", zh:"重命名当前会话"},

    // ===== 界面操作 =====
    {cat:"shortcut", cmd:"ctrl+x b", en:"Toggle sidebar", zh:"显示/隐藏侧边栏"},
    {cat:"shortcut", cmd:"ctrl+x s", en:"Status view", zh:"查看当前状态信息"},
    {cat:"shortcut", cmd:"ctrl+x h", en:"Toggle conceal", zh:"切换隐藏/显示消息中的敏感内容"},
    {cat:"shortcut", cmd:"ctrl+x y", en:"Copy messages", zh:"复制当前消息内容"},
    {cat:"shortcut", cmd:"ctrl+x e", en:"Open external editor", zh:"用系统 $EDITOR 打开编辑器撰写提示（等同于 /editor）"},
    {cat:"shortcut", cmd:"ctrl+x q", en:"Quit", zh:"退出 OpenCode（等同于 /exit）"},

    // ===== 模型 / Agent =====
    {cat:"shortcut", cmd:"ctrl+x m", en:"Model list", zh:"列出可用模型并切换（等同于 /models）"},
    {cat:"shortcut", cmd:"ctrl+a（非输入框内）", en:"Open provider list", zh:"打开模型提供商列表（在输入框内此键为跳到行首）"},
    {cat:"shortcut", cmd:"f2", en:"Cycle recent models", zh:"在最近使用的模型间循环切换"},
    {cat:"shortcut", cmd:"shift+f2", en:"Cycle recent models (reverse)", zh:"反向循环切换最近使用的模型"},
    {cat:"shortcut", cmd:"ctrl+t", en:"Cycle model variant", zh:"在模型推理强度变体（reasoning effort）间循环切换"},
    {cat:"shortcut", cmd:"ctrl+x a", en:"Agent list", zh:"列出可用 Agent 并切换"},
    {cat:"shortcut", cmd:"Tab", en:"Next agent", zh:"切换到下一个 Agent"},
    {cat:"shortcut", cmd:"Shift+Tab", en:"Previous agent", zh:"切换到上一个 Agent"},

    // ===== 主题 =====
    {cat:"shortcut", cmd:"ctrl+x t", en:"Theme list", zh:"列出主题并切换（等同于 /themes）"},

    // ===== 消息列表滚动 =====
    {cat:"shortcut", cmd:"PageUp / ctrl+alt+b", en:"Scroll messages up (page)", zh:"消息列表向上翻一页"},
    {cat:"shortcut", cmd:"PageDown / ctrl+alt+f", en:"Scroll messages down (page)", zh:"消息列表向下翻一页"},
    {cat:"shortcut", cmd:"ctrl+alt+u", en:"Scroll messages up (half page)", zh:"消息列表向上翻半页"},
    {cat:"shortcut", cmd:"ctrl+alt+d", en:"Scroll messages down (half page)", zh:"消息列表向下翻半页"},
    {cat:"shortcut", cmd:"ctrl+alt+y / ctrl+alt+e", en:"Scroll messages one line", zh:"消息列表逐行向上（y）/向下（e）滚动"},
    {cat:"shortcut", cmd:"ctrl+g / Home", en:"Jump to first message", zh:"跳转到第一条消息"},
    {cat:"shortcut", cmd:"ctrl+alt+g / End", en:"Jump to last message", zh:"跳转到最后一条消息"},

    // ===== 输入框编辑 =====
    {cat:"shortcut", cmd:"Shift+Enter / ctrl+j", en:"Newline (don't submit)", zh:"换行不发送（ctrl+j 在任何终端均可用）"},
    {cat:"shortcut", cmd:"ctrl+v", en:"Paste", zh:"粘贴剪贴板内容到输入框"},
    {cat:"shortcut", cmd:"ctrl+a（输入框内）", en:"Move to line start", zh:"光标跳到当前行行首（全局视图中此键为打开提供商列表）"},
    {cat:"shortcut", cmd:"ctrl+e", en:"Move to line end", zh:"光标跳到当前行行尾"},
    {cat:"shortcut", cmd:"ctrl+k", en:"Delete to line end", zh:"删除从光标到行尾的内容"},
    {cat:"shortcut", cmd:"ctrl+u", en:"Delete to line start", zh:"删除从光标到行首的内容"},
    {cat:"shortcut", cmd:"ctrl+w / ctrl+backspace", en:"Delete word backward", zh:"向前删除一个单词"},
    {cat:"shortcut", cmd:"alt+d", en:"Delete word forward", zh:"向后删除一个单词"},
    {cat:"shortcut", cmd:"alt+f / alt+right", en:"Move word forward", zh:"光标向后移动一个单词"},
    {cat:"shortcut", cmd:"alt+b / alt+left", en:"Move word backward", zh:"光标向前移动一个单词"},

    // ===== 提示输入特殊前缀 =====
    {cat:"shortcut", cmd:"@（输入中）", en:"File reference", zh:"模糊搜索并引用文件，文件内容自动加入上下文"},
    {cat:"shortcut", cmd:"!（输入中）", en:"Run shell command", zh:"执行 shell 命令并将输出加入对话"},
    {cat:"shortcut", cmd:"/（输入中）", en:"Slash command", zh:"触发斜杠命令补全菜单"},

    // ===== 内置斜杠命令 =====
    {cat:"slash", cmd:"/new", en:"Start new session", zh:"开启新会话（别名 /clear）"},
    {cat:"slash", cmd:"/sessions", en:"List and switch sessions", zh:"列出所有历史会话并切换（别名 /resume /continue）"},
    {cat:"slash", cmd:"/undo", en:"Undo last message", zh:"撤销最后一条消息并恢复相关文件变更（需要 Git 仓库）"},
    {cat:"slash", cmd:"/redo", en:"Redo undone message", zh:"重做已撤销的消息（仅在 /undo 后可用）"},
    {cat:"slash", cmd:"/compact", en:"Compact session context", zh:"压缩当前会话上下文释放 token（别名 /summarize）"},
    {cat:"slash", cmd:"/init", en:"Create/update AGENTS.md", zh:"引导创建或更新项目的 AGENTS.md 文件"},
    {cat:"slash", cmd:"/models", en:"List available models", zh:"列出所有已配置提供商的可用模型"},
    {cat:"slash", cmd:"/themes", en:"List and switch themes", zh:"列出可用主题并切换"},
    {cat:"slash", cmd:"/share", en:"Share current session", zh:"生成可分享的会话链接"},
    {cat:"slash", cmd:"/unshare", en:"Unshare session", zh:"取消分享当前会话"},
    {cat:"slash", cmd:"/export", en:"Export session to Markdown", zh:"将当前会话导出为 Markdown 文件并用编辑器打开"},
    {cat:"slash", cmd:"/editor", en:"Open external editor", zh:"用系统 $EDITOR 打开编辑器撰写提示"},
    {cat:"slash", cmd:"/connect", en:"Add AI provider", zh:"交互式添加 AI 提供商及其 API Key"},
    {cat:"slash", cmd:"/details", en:"Toggle tool details", zh:"切换显示/隐藏工具调用的详细信息"},
    {cat:"slash", cmd:"/thinking", en:"Toggle thinking display", zh:"切换是否显示模型的 thinking/reasoning 内容（不影响能力开关）"},
    {cat:"slash", cmd:"/help", en:"Show help dialog", zh:"显示帮助对话框"},
    {cat:"slash", cmd:"/exit", en:"Exit OpenCode", zh:"退出 OpenCode（别名 /quit /q）"},

    // ===== CLI 命令与启动参数 =====
    {cat:"flag", cmd:"opencode", en:"Start TUI in current directory", zh:"在当前目录启动交互式终端界面"},
    {cat:"flag", cmd:"opencode [path]", en:"Start TUI in specific directory", zh:"在指定目录启动 TUI"},
    {cat:"flag", cmd:"opencode run \"[prompt]\"", en:"Non-interactive one-shot run", zh:"非交互式执行一次性提示，适合脚本自动化"},
    {cat:"flag", cmd:"opencode run -m [provider/model]", en:"Run with specific model", zh:"指定模型运行（如 -m anthropic/claude-opus-4-8）"},
    {cat:"flag", cmd:"opencode run -c", en:"Continue last session", zh:"在非交互模式下继续上次会话（--continue）"},
    {cat:"flag", cmd:"opencode run -s [sessionID]", en:"Continue specific session", zh:"在非交互模式下继续指定会话（--session）"},
    {cat:"flag", cmd:"opencode run --attach [url]", en:"Attach to running server", zh:"连接到已运行的 opencode serve 实例执行命令（复用 MCP 冷启动）"},
    {cat:"flag", cmd:"opencode run --share", en:"Auto-share session", zh:"运行结束后自动生成分享链接"},
    {cat:"flag", cmd:"opencode run -f [file]", en:"Attach file to message", zh:"将文件内容附加到提示消息（--file，可多次使用）"},
    {cat:"flag", cmd:"opencode serve", en:"Start headless API server", zh:"启动无界面 HTTP API 服务器，供外部程序调用"},
    {cat:"flag", cmd:"opencode web", en:"Start server with web UI", zh:"启动带 Web 界面的服务器并打开浏览器"},
    {cat:"flag", cmd:"opencode attach [url]", en:"Attach TUI to remote server", zh:"将本地 TUI 连接到远程 opencode serve 服务器"},
    {cat:"flag", cmd:"opencode models", en:"List all models", zh:"列出所有已配置提供商的可用模型"},
    {cat:"flag", cmd:"opencode models --refresh", en:"Refresh models cache", zh:"从 models.dev 刷新模型列表缓存"},
    {cat:"flag", cmd:"opencode auth login", en:"Add provider credentials", zh:"交互式添加 AI 提供商的 API Key"},
    {cat:"flag", cmd:"opencode auth list", en:"List authenticated providers", zh:"列出所有已认证的提供商（别名 auth ls）"},
    {cat:"flag", cmd:"opencode auth logout", en:"Remove provider credentials", zh:"删除指定提供商的认证信息"},
    {cat:"flag", cmd:"opencode mcp add", en:"Add MCP server", zh:"交互式添加 MCP 服务器配置"},
    {cat:"flag", cmd:"opencode mcp list", en:"List MCP servers", zh:"列出所有已配置的 MCP 服务器及其连接状态"},
    {cat:"flag", cmd:"opencode mcp auth [name]", en:"Authenticate OAuth MCP server", zh:"对支持 OAuth 的 MCP 服务器进行认证"},
    {cat:"flag", cmd:"opencode agent create", en:"Create custom agent", zh:"交互式创建自定义 Agent（配置权限和系统提示）"},
    {cat:"flag", cmd:"opencode agent list", en:"List agents", zh:"列出所有可用 Agent"},
    {cat:"flag", cmd:"opencode session list", en:"List all sessions", zh:"列出所有历史会话"},
    {cat:"flag", cmd:"opencode session delete [id]", en:"Delete a session", zh:"删除指定会话"},
    {cat:"flag", cmd:"opencode stats", en:"Show usage statistics", zh:"查看 token 用量和费用统计，支持按项目/模型/天数筛选"},
    {cat:"flag", cmd:"opencode export [sessionID]", en:"Export session as JSON", zh:"将会话数据导出为 JSON 文件"},
    {cat:"flag", cmd:"opencode import [file/url]", en:"Import session", zh:"从本地 JSON 文件或分享链接导入会话"},
    {cat:"flag", cmd:"opencode plugin [module]", en:"Install plugin", zh:"安装插件并更新配置（别名 opencode plug）"},
    {cat:"flag", cmd:"opencode pr [number]", en:"Checkout PR and run", zh:"拉取并切换到指定 GitHub PR 分支，然后启动 OpenCode"},
    {cat:"flag", cmd:"opencode upgrade", en:"Upgrade to latest version", zh:"升级 OpenCode 到最新版本"},
    {cat:"flag", cmd:"opencode uninstall", en:"Uninstall OpenCode", zh:"卸载 OpenCode 并移除相关文件（支持 --keep-config 等选项）"},
    {cat:"flag", cmd:"--version / -v", en:"Print version number", zh:"显示当前版本号"},
    {cat:"flag", cmd:"--help / -h", en:"Show help", zh:"显示帮助信息"},
    {cat:"flag", cmd:"--model / -m [provider/model]", en:"Specify model", zh:"启动时指定使用的模型（格式：provider/model）"},
    {cat:"flag", cmd:"--agent [name]", en:"Specify agent", zh:"启动时指定要使用的 Agent"},
    {cat:"flag", cmd:"--pure", en:"Run without external plugins", zh:"禁用所有外部插件启动"},
    {cat:"flag", cmd:"--log-level [level]", en:"Set log level", zh:"设置日志级别（DEBUG / INFO / WARN / ERROR）"},
    {cat:"flag", cmd:"--print-logs", en:"Print logs to stderr", zh:"将日志输出到 stderr，便于调试"},
  ]
};
