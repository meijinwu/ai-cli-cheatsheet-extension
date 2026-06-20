# 数据结构说明（给以后加新工具用，Claude Code 自动新增/更新时遵循）

每个工具一个文件，例如 `claude-code.js`、`codex.js`、`gemini-cli.js`、`antigravity-cli.js`。

## 新增一个工具时（插件里"➕ 新增工具"模式会自动走这个流程）

1. 创建 `data/<tool-id>.js`，id 用小写英文+短横线，比如 `opencode`、`intellij-idea`
2. 把 meta 填好（见下方格式）——颜色、徽章、圆点界面会自动套用，不需要手动改任何 CSS
3. 把 items 数组填好该工具的命令/快捷键数据
4. **不需要**手动改 `popup.html` 或 `popup.js`：popup.js 会自动扫描所有已加载的数据文件，
   只要 `popup.html` 里有一行 `<script src="data/<tool-id>.js"></script>`，新工具就会自动出现在筛选列表里。
   这一行脚本引用，native-host/host.py 会在确认数据文件创建成功后自动检查并插入，不需要手动操作。

## 两类工具，处理方式不同

**CLI / 终端类工具**（有统一的 `/help` 或 `--help` 入口，官方文档列出完整命令清单，比如 Claude Code、Codex CLI、OpenCode）：
- 三个 cat 都可能用到：shortcut（按键）、slash（斜杠命令）、flag（启动参数）
- 尽量收录完整，可以逐条核对官方文档

**IDE / 图形界面类工具**（比如 IntelliJ IDEA、VS Code、Sublime Text）：
- 没有统一查询入口，快捷键因操作系统（Mac/Win/Linux）和键位方案（默认/Vim/Emacs）不同而不同
- 去查官方文档里的"默认键位映射"页面（常见关键词：Keymap、Keyboard Shortcuts、Default Keymap）
- 只用 `cat: "shortcut"`，没有 slash/flag 这两类
- 默认收录 macOS 键位为主；如果 Windows/Linux 明显不同，在 zh 字段里用括号注明，比如：
  `zh: "全局搜索（Win/Linux 为 Ctrl+Shift+A）"`
- **必须在 meta.source 里写清楚**这是默认键位下的常用子集，不是完整列表，比如：
  `source: "官方文档 xxx，整理于 2026-06（⚠️仅收录macOS默认键位常用子集，完整列表请查官方Keymap文档）"`

## 数据格式

每条数据：
```js
{
  cat: "shortcut" | "slash" | "flag",  // 类型：快捷键 / 斜杠命令 / 启动参数
  cmd: "实际命令或快捷键文本",
  en: "英文官方说明（简短）",
  zh: "中文说明（讲清楚用途，不是字面翻译）"
}
```

meta：
```js
{
  id: "claude-code",        // 唯一标识，不能和别的工具重复，必须和文件名一致
  name: "Claude Code",       // 显示名
  color: "#d97757",          // 主题色（十六进制），界面自动套用，挑一个和已有工具明显不同的颜色
  source: "官方文档 docs.claude.com，整理于 2026-06",  // 数据来源+时间，如果是非官方/未逐字核对/IDE类工具的子集，要明确写清楚限制
  order: 1,                  // 可选，控制在列表里的显示顺序，数字小的排前面，省略则按字母顺序排在最后
}
```

## 给自动化流程（Native Messaging + claude -p）的额外要求

- 新增模式：先判断是 CLI 类还是 IDE 类，按上面对应的规则处理
- 更新模式：保留原有未变化的条目，不要整份重写丢失细节
- 严禁编造没有查到的命令或快捷键；查不到就如实少收录，不要为了凑数量编内容
- 完成后用一句话总结：创建/更新了什么文件、收录了多少条、属于哪一类
