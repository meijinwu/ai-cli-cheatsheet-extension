# 数据结构说明（给以后加新工具用，Claude Code 自动新增/更新时遵循）

每个工具一个文件，例如 `claude-code.js`、`codex.js`、`gemini-cli.js`、`antigravity-cli.js`。

## 新增一个工具时（插件里"➕ 新增工具"模式会自动走这个流程）

1. 创建 `data/<tool-id>.js`，id 用小写英文+短横线，比如 `opencode`、`intellij-idea`
2. 把 meta 填好（见下方格式）——颜色、徽章、圆点界面会自动套用，不需要手动改任何 CSS
3. 把 items 数组填好该工具的命令/快捷键数据
4. 自动流程会更新 `data/index.js`。手动新增时，也要把工具 ID 加入该索引；不要修改 `popup.html`。

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
  id: "稳定条目ID",                         // 可选；自动流程会生成，更新时必须保留
  cat: "shortcut" | "slash" | "flag",  // 类型：快捷键 / 斜杠命令 / 启动参数
  cmd: "实际命令或快捷键文本",
  en: "英文官方说明（简短）",
  zh: "中文说明（讲清楚用途，不是字面翻译）",
  context: "编辑器 / 集成终端",            // 可选；相同 cmd 在不同场景出现时必填
  keywords: ["替换", "批量替换"],          // 用户常用语义词，3 到 8 个（仓库提交数据必填，见“校验契约”）
  examples: [                              // 可选；最多 3 个
    {
      value: "sed 's/旧文本/新文本/g' file.txt",
      description: "把输出中的所有“旧文本”替换为“新文本”",
      copyable: true,                       // 可选，默认 true
      warning: "先去掉 -i 预览结果",        // 可选
      riskLevels: ["deleteOrOverwrite"],     // 可选；高风险示例由构建器自动补充并强制不可复制
      sourceType: "ai-derived",             // 必填：official / quasi-official / manual / ai-derived
      sourceUrl: "https://example.com/docs", // 可选；能定位具体官方页面时填写（quasi-official 必填且须为白名单域名）
      platforms: ["mac", "linux"],          // 可选
      platformValues: {                     // 可选；平台专属示例
        mac: "sed -i '' 's/旧/新/g' file.txt",
        linux: "sed -i 's/旧/新/g' file.txt"
      }
    }
  ],
  platforms: ["mac", "windows", "linux"],  // 可选；条目适用平台
  platformCmds: {                          // 可选；平台专属命令或快捷键
    mac: "Cmd+P",
    windows: "Ctrl+P",
    linux: "Ctrl+P"
  }
}
```

meta：
```js
{
  id: "claude-code",        // 唯一标识，不能和别的工具重复，必须和文件名一致
  name: "Claude Code",       // 显示名
  color: "#d97757",          // 主题色（十六进制），界面自动套用，挑一个和已有工具明显不同的颜色
  source: "官方文档 docs.claude.com，整理于 2026-06",  // 数据来源+时间，如果是非官方/未逐字核对/IDE类工具的子集，要明确写清楚限制
  sourceUrl: "https://docs.example.com/reference",     // 官方来源，必须是 HTTPS
  sourceTier: "official",                              // 可选：official / quasi-official / community，省略按 official 处理
  updatedAt: "2026-06-20",                             // 最后核对日期，YYYY-MM-DD
  coverage: "完整命令列表 / macOS 默认键位常用子集",    // 数据覆盖范围
  platforms: ["mac", "windows", "linux"],               // 覆盖平台
  builtIn: false,                                       // 内置数据为 true，自动新增为 false
  verificationStatus: "web-assisted",                   // 可选：web-assisted / model-knowledge / manual
  order: 1,                  // 可选，控制在列表里的显示顺序，数字小的排前面，省略则按字母顺序排在最后
}
```

## 来源信任分级（sourceTier / sourceType=quasi-official）

官方文档有时滞后或维护不及时。为在不牺牲可信度的前提下保持数据新鲜，来源分三档：

- **official**：厂商自有文档（git-scm.com、docs.claude.com 等）。`meta.sourceTier` 省略时按此处理。
- **quasi-official（类官方）**：可信第三方权威参考。`meta.sourceTier` 或 example 的 `sourceType` 为该值时，对应 `sourceUrl` 的**主机名必须命中白名单**，否则校验失败。白名单与上下限一样统一声明在 `shared/validation-rules.json` 的 `quasiOfficialDomains`，由 `tests/test_validation_consistency.js` 防止 host.py 漂移。当前白名单：tldr.sh、man7.org、ss64.com、manpages.debian.org、developer.mozilla.org、wiki.archlinux.org。
- **community**：其余社区来源，UI 标注"社区"，不强制白名单。

新增白名单域名时，先改 `shared/validation-rules.json`，host.py 的 `QUASI_OFFICIAL_DOMAINS` 会被一致性测试要求同步。插件 UI（源卡片、行内徽章、管理页）会按档位显示"官方/类官方/社区"。

## 校验契约（生成端宽松，仓库端严格）

`keywords` 与 `examples` 在两条链路上有意采用不同强度，这是设计而非 bug：

- **生成端（`native-host/host.py`，宽松）**：`keywords`/`examples` 缺失不报错，仅由 `build_quality_warnings` 产生质量警告。目的是不因模型偶发漏填而中断整次生成；用户可在预览里看到覆盖告警。
- **仓库端（`tools/validate-data.js`，严格）**：提交进仓库的数据，每条目都**必须**带合法的 `keywords`（3..8）与 `examples`（1..3）。CI 会对全量数据执行，缺失即失败。

两侧的数量上下限与危险/密钥正则保持一致，统一声明在 `shared/validation-rules.json`，并由 `tests/test_validation_consistency.js` 防止漂移。改任一侧规则前先更新该 JSON。

含义：本地用 host.py 生成的工具即使个别条目缺 examples 也能正常使用（仅少了示例），但若要回贡献到仓库，需补齐到满足仓库端严格校验。

## 给自动化流程（Native Messaging + claude -p）的额外要求

- 新增模式：先判断是 CLI 类还是 IDE 类，按上面对应的规则处理
- 更新模式：保留原有未变化的条目，不要整份重写丢失细节
- 新增工具应为所有条目提供 keywords 和 examples。CLI 提供可执行命令，IDE 提供操作场景
- examples 覆盖不足不会阻止写入，但会产生质量警告；结构错误仍会拒绝
- 官方明确提供的示例标记 official，人工整理标记 manual，基于语义推导标记 ai-derived
- manual / official 示例必须显式填写能定位到具体行为的 sourceUrl；不得用工具首页自动兜底
- 重点精选条目应提供稳定 `item.id`，富化文件使用 `id:<item.id>` 关联；旧 cmd/context 键仅用于兼容
- 严禁编造没有查到的命令或快捷键；查不到就如实少收录，不要为了凑数量编内容
- Claude 只返回结构化 JSON；Native Host 校验后负责生成 JS 和原子写入
- `meta.id` 必须与文件名一致；同一 `cat + cmd + context` 不能重复
- 完成后用一句话总结：创建/更新了什么文件、收录了多少条、属于哪一类
