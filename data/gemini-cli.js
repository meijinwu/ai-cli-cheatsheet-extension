// 数据来源：geminicli.com/docs/reference/*（官方文档），整理于 2026-06
// 重要提示：官方公告免费层/Google One用户的 Gemini CLI 将于 2026-06-18 被 Antigravity CLI 取代，
// 以下内容可能仅适用于付费层用户，免费用户请关注官方公告确认当前状态。
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["gemini-cli"] = {
  meta: {
    id: "gemini-cli",
    name: "Gemini CLI",
    color: "#4c8bf5",
    source: "官方文档 geminicli.com，整理于 2026-06（⚠️免费层即将被Antigravity CLI取代，详见官方公告）",
    sourceUrl: "https://geminicli.com/docs/",
    updatedAt: "2026-06-20",
    coverage: "官方交互快捷键与斜杠命令；产品状态可能变化",
    platforms: ["mac", "windows", "linux"],
    builtIn: true,
    order: 3
  },
  items: [
    // ===== 基础控制 =====
    {cat:"shortcut", cmd:"Enter", en:"Confirm / submit", zh:"确认选择或发送消息"},
    {cat:"shortcut", cmd:"Esc / Ctrl+[", en:"Cancel / dismiss", zh:"取消对话框或当前焦点"},
    {cat:"shortcut", cmd:"Ctrl+C", en:"Cancel request / quit", zh:"取消当前请求；输入框为空时退出CLI"},
    {cat:"shortcut", cmd:"Ctrl+D", en:"Exit when input empty", zh:"输入框为空时退出CLI"},

    // ===== 光标移动 =====
    {cat:"shortcut", cmd:"Ctrl+A / Home", en:"Move to line start", zh:"光标移到行首"},
    {cat:"shortcut", cmd:"Ctrl+E / End", en:"Move to line end", zh:"光标移到行末"},
    {cat:"shortcut", cmd:"Ctrl+Left/Right / Alt+B/F", en:"Move by word", zh:"按单词左右移动光标"},

    // ===== 编辑 =====
    {cat:"shortcut", cmd:"Ctrl+K", en:"Delete to line end", zh:"删除光标到行末"},
    {cat:"shortcut", cmd:"Ctrl+U", en:"Delete to line start", zh:"删除光标到行首"},
    {cat:"shortcut", cmd:"Ctrl+W / Alt+Backspace", en:"Delete previous word", zh:"删除前一个单词"},
    {cat:"shortcut", cmd:"Alt+D / Ctrl+Delete", en:"Delete next word", zh:"删除后一个单词"},
    {cat:"shortcut", cmd:"Ctrl+Z / Cmd+Z / Alt+Z", en:"Undo", zh:"撤销输入框内最近一次编辑"},
    {cat:"shortcut", cmd:"Ctrl+Shift+Z / Shift+Cmd+Z", en:"Redo", zh:"重做被撤销的编辑"},

    // ===== 滚动 =====
    {cat:"shortcut", cmd:"Shift+Up/Down", en:"Scroll content", zh:"上下滚动内容"},
    {cat:"shortcut", cmd:"Page Up/Down", en:"Scroll by page", zh:"按页滚动"},

    // ===== 历史与搜索 =====
    {cat:"shortcut", cmd:"Ctrl+P / Ctrl+N", en:"Previous/next history", zh:"显示历史中的上一条/下一条"},
    {cat:"shortcut", cmd:"Ctrl+R", en:"Reverse search history", zh:"反向搜索历史记录"},

    // ===== 输入与提交 =====
    {cat:"shortcut", cmd:"Tab（任务运行时）", en:"Queue message", zh:"把当前输入排队，等当前任务结束后处理"},
    {cat:"shortcut", cmd:"Ctrl+Enter / Alt+Enter / Shift+Enter / Ctrl+J", en:"Newline without submit", zh:"换行不发送（多种按键组合都可以）"},
    {cat:"shortcut", cmd:"Ctrl+G / Ctrl+Shift+G", en:"Open external editor", zh:"在外部编辑器中打开当前提示词或计划"},
    {cat:"shortcut", cmd:"Ctrl+V / Cmd+V / Alt+V", en:"Paste from clipboard", zh:"从剪贴板粘贴"},
    {cat:"shortcut", cmd:"\\ + Enter（行末）", en:"Newline in single-line mode", zh:"单行模式下换行而不退出该模式"},

    // ===== 应用层控制 =====
    {cat:"shortcut", cmd:"F12", en:"Toggle debug console", zh:"切换调试控制台，查看详细错误信息"},
    {cat:"shortcut", cmd:"Ctrl+T", en:"Toggle full TODO list", zh:"显示/隐藏完整任务清单"},
    {cat:"shortcut", cmd:"F4", en:"Show IDE context detail", zh:"显示IDE上下文详情"},
    {cat:"shortcut", cmd:"Alt+M", en:"Toggle Markdown rendering", zh:"切换Markdown渲染显示"},
    {cat:"shortcut", cmd:"Ctrl+S", en:"Toggle mouse mode", zh:"切换鼠标模式（滚动和点击）"},
    {cat:"shortcut", cmd:"Ctrl+Y", en:"Toggle YOLO mode", zh:"切换YOLO模式（工具调用全自动批准）"},
    {cat:"shortcut", cmd:"Shift+Tab", en:"Cycle approval modes", zh:"循环切换审批模式：default → auto_edit → plan（只读）"},
    {cat:"shortcut", cmd:"Ctrl+O", en:"Expand/collapse paste or output", zh:"展开/折叠粘贴占位内容或长输出"},
    {cat:"shortcut", cmd:"Ctrl+L", en:"Clear screen and redraw", zh:"清空终端屏幕并重绘UI"},
    {cat:"shortcut", cmd:"R / Shift+R", en:"Restart application", zh:"重启应用"},
    {cat:"shortcut", cmd:"Ctrl+Z（应用层）", en:"Suspend CLI to background", zh:"挂起CLI并放到后台"},
    {cat:"shortcut", cmd:"Space（按住）", en:"Push-to-talk voice mode", zh:"按住进行语音输入"},
    {cat:"shortcut", cmd:"? （空提示符下）", en:"Toggle shortcuts panel", zh:"显示/隐藏快捷键速查面板"},
    {cat:"shortcut", cmd:"Tab + Tab（输入中）", en:"Toggle minimal/full UI", zh:"在精简和完整UI细节间切换"},
    {cat:"shortcut", cmd:"Esc Esc（快速两次）", en:"Clear input / rewind", zh:"清空非空输入框；为空时浏览并回退历史交互"},
    {cat:"shortcut", cmd:"Ctrl+X（计划展示时）", en:"Open plan in external editor", zh:"在外部编辑器中协作编辑/评论实施计划"},

    // ===== 后台 Shell 控制 =====
    {cat:"shortcut", cmd:"Ctrl+B", en:"Toggle background shell", zh:"切换当前后台shell的可见性"},
    {cat:"shortcut", cmd:"Ctrl+K（后台shell列表）", en:"Kill active background shell", zh:"终止当前激活的后台shell"},

    // ===== 斜杠命令（官方文档全量）=====
    {cat:"slash", cmd:"/about", en:"Show version info", zh:"显示版本信息，提交issue时附上"},
    {cat:"slash", cmd:"/agents [list|reload|enable|disable|config]", en:"Manage subagents", zh:"管理本地和远程子代理"},
    {cat:"slash", cmd:"/auth", en:"Change auth method", zh:"打开对话框切换认证方式"},
    {cat:"slash", cmd:"/bug", en:"File a GitHub issue", zh:"提交Gemini CLI的issue报告"},
    {cat:"slash", cmd:"/chat（/resume别名）", en:"Session browser & checkpoints", zh:"浏览历史会话和手动检查点（功能同/resume）"},
    {cat:"slash", cmd:"/clear", en:"Clear terminal screen", zh:"清空终端屏幕和可见历史（快捷键 Ctrl+L）"},
    {cat:"slash", cmd:"/commands [list|reload]", en:"Manage custom commands", zh:"管理从.toml文件加载的自定义命令"},
    {cat:"slash", cmd:"/compress", en:"Summarize chat context", zh:"用摘要替换整个对话上下文，节省后续token"},
    {cat:"slash", cmd:"/copy", en:"Copy last output", zh:"复制最近一次输出到剪贴板（需要系统剪贴板工具）"},
    {cat:"slash", cmd:"/directory add|show（别名/dir）", en:"Manage workspace directories", zh:"管理多目录工作区支持"},
    {cat:"slash", cmd:"/docs", en:"Open documentation", zh:"在浏览器中打开官方文档"},
    {cat:"slash", cmd:"/editor", en:"Select supported editor", zh:"打开对话框选择支持的编辑器"},
    {cat:"slash", cmd:"/extensions [install|list|update|...]", en:"Manage extensions", zh:"管理扩展（安装/列出/更新/启用禁用）"},
    {cat:"slash", cmd:"/help（别名/?）", en:"Show help", zh:"显示帮助信息和可用命令"},
    {cat:"slash", cmd:"/hooks [enable|disable|list]", en:"Manage hooks", zh:"管理生命周期事件钩子"},
    {cat:"slash", cmd:"/ide [enable|disable|install|status]", en:"Manage IDE integration", zh:"管理IDE集成状态"},
    {cat:"slash", cmd:"/init", en:"Generate GEMINI.md", zh:"分析当前目录生成定制化的项目说明文件"},
    {cat:"slash", cmd:"/mcp [list|auth|reload|schema]", en:"Manage MCP servers", zh:"管理已配置的MCP服务器"},
    {cat:"slash", cmd:"/memory [show|refresh|list]", en:"Manage hierarchical memory", zh:"管理从GEMINI.md加载的层级记忆"},
    {cat:"slash", cmd:"/model [manage|set]", en:"Manage model config", zh:"配置或设置使用的模型"},
    {cat:"slash", cmd:"/permissions trust", en:"Manage folder trust", zh:"管理目录信任设置"},
    {cat:"slash", cmd:"/plan [copy]", en:"Switch to Plan Mode", zh:"切换到只读计划模式，查看已生成的计划"},
    {cat:"slash", cmd:"/policies list", en:"List active policies", zh:"按模式列出所有激活的策略"},
    {cat:"slash", cmd:"/privacy", en:"Privacy notice & consent", zh:"显示隐私声明并选择数据收集同意"},
    {cat:"slash", cmd:"/quit --delete（别名/exit）", en:"Exit and optionally wipe history", zh:"退出CLI，加--delete可同时永久删除本次会话记录"},
    {cat:"slash", cmd:"/restore [tool_call_id]", en:"Restore files before a tool ran", zh:"把项目文件恢复到某次工具执行前的状态"},
    {cat:"slash", cmd:"/rewind", en:"Navigate back through history", zh:"回溯对话历史，可选回退聊天和/或代码改动（快捷键Esc Esc）"},
    {cat:"slash", cmd:"/resume", en:"Browse/resume sessions", zh:"浏览并恢复历史会话，管理手动检查点"},
    {cat:"slash", cmd:"/settings", en:"Open settings editor", zh:"打开设置编辑器，带校验和引导"},
    {cat:"slash", cmd:"/shells（别名/bashes）", en:"Toggle background shells view", zh:"查看和管理后台运行的长进程"},
    {cat:"slash", cmd:"/setup-github", en:"Set up GitHub Actions", zh:"配置GitHub Actions进行issue分类和PR审查"},
    {cat:"slash", cmd:"/skills [enable|disable|list|reload]", en:"Manage Agent Skills", zh:"管理提供按需专业能力的Agent Skills"},
    {cat:"slash", cmd:"/stats [session|model|tools]", en:"Show usage statistics", zh:"显示会话/模型/工具维度的使用统计"},
    {cat:"slash", cmd:"/terminal-setup", en:"Configure multiline keybindings", zh:"为VS Code/Cursor/Windsurf配置多行输入按键"},
    {cat:"slash", cmd:"/theme", en:"Change visual theme", zh:"切换界面视觉主题"},
    {cat:"slash", cmd:"/tools [desc|nodesc]", en:"List available tools", zh:"列出当前可用工具，desc显示完整描述"},
    {cat:"slash", cmd:"/upgrade", en:"Upgrade tier", zh:"打开升级页面提升用量限额（仅Google登录可用）"},
    {cat:"slash", cmd:"/vim", en:"Toggle vim mode", zh:"切换Vim风格的导航和编辑模式"},

    // ===== @ 和 ! 特殊用法 =====
    {cat:"shortcut", cmd:"@路径", en:"Inject file/dir content", zh:"把指定文件或目录内容注入当前提示词（支持git感知过滤）"},
    {cat:"shortcut", cmd:"!命令", en:"Execute shell command", zh:"用bash(Linux/macOS)或powershell(Windows)执行命令"},
    {cat:"shortcut", cmd:"!（单独输入）", en:"Toggle shell mode", zh:"切换Shell模式，之后输入的文本直接当作shell命令解释"},
  ]
};
