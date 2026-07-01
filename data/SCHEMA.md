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
  shell: {                                  // 仅 Shell 聚合工具使用；普通工具不得填写。Shell 仅含解释器与终端环境本体，外部 CLI 工具不收录
    layer: "syntax",                        // syntax / keyword / builtin / option / shortcut / config
    family: "bash",                         // 只能是 posix-sh / bash / zsh（Shell 本体）；不要用 coreutils / grep / sed 等外部工具族
    portability: "bash",                    // posix / bash / zsh / cross-platform
    topic: "scripting"                      // builtins / syntax / shortcuts / config / environment / history / completion / scripting / jobs / troubleshooting
  },
  keywords: ["替换", "批量替换"],          // 用户常用语义词，3 到 8 个（仓库提交数据必填，见“校验契约”）
  evidenceRefs: [{
    sourceId: "official-docs",
    claims: ["existence", "semantics"],      // existence / semantics / platform / example
    locator: "https://docs.example.com/cli#command",
    checkedAt: "2026-06-21"
  }],
  evidenceStatus: "verified",               // 由 evidenceRefs 自动推导
  examples: [                              // 可选；最多 3 个
    {
      scenario: "需要批量替换配置文件中的旧域名", // 面向 UI 展示，必须包含中文
      goal: "先预览替换结果，再决定是否原地修改", // 面向 UI 展示，必须包含中文
      value: "sed 's/旧文本/新文本/g' file.txt",
      description: "不加 -i 时只输出结果，适合先确认匹配范围", // 面向 UI 展示，必须包含中文
      expected: "终端显示替换后的文本，原文件保持不变", // 面向 UI 展示，必须包含中文
      prerequisites: "确认文件编码和匹配文本", // 可选；面向 UI 展示，必须包含中文
      caveat: "macOS 与 GNU sed 的 -i 参数不同", // 可选；面向 UI 展示，必须包含中文
      copyable: true,                       // 可选，默认 true
      warning: "先去掉 -i 预览结果",        // 可选；面向 UI 展示，必须包含中文
      riskLevels: ["deleteOrOverwrite"],     // 可选；高风险示例由构建器自动补充并强制不可复制
      sourceType: "ai-derived",             // 旧版兼容：official / quasi-official / manual / ai-derived
      sourceUrl: "https://example.com/docs", // 可选；能定位具体官方页面时填写（quasi-official 必填且须为白名单域名）
      sourceIds: ["official-docs"],
      authorship: "editorial",              // official / editorial / generated
      evidenceTier: "first-party",          // first-party / authoritative-community / community / none
      adaptation: "adapted",                // verbatim / adapted / scenario-derived
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
  updatedAt: "2026-06-20",                             // 旧字段，兼容历史数据
  updatePolicy: "version-driven",                      // version-driven / release-driven / manual-only
  verifiedVersion: "1.2.0",                            // 可选；内容最后核验到的产品版本或发布标识
  contentCheckedAt: "2026-06-20",                      // 内容最后核验日期，仅用于追溯
  sourceCheckedAt: "2026-06-21",                       // 来源可访问性最后检查日期
  coverage: "完整命令列表 / macOS 默认键位常用子集",    // 数据覆盖范围
  sources: [{
    id: "official-docs",
    registryId: "vendor-docs",                         // 可选；来源 ID 与登记项 ID 不同时填写
    title: "工具官方 CLI 文档",
    url: "https://docs.example.com/cli",                // local-help 可省略
    kind: "official-doc",                               // local-help / official-doc / official-repository / release-notes / authoritative-reference / community
    maintainer: "Example Inc.",
    evidenceTier: "first-party",
    lastVerifiedAt: "2026-06-21",
    resolvedUrl: "https://docs.example.com/cli",
    pageTitle: "CLI Reference",
    checkedAt: "2026-06-21",
    version: "1.2.0",                                  // 可选
    purposes: ["command-existence", "option-semantics", "examples"]
  }],
  platforms: ["mac", "windows", "linux"],               // 覆盖平台
  builtIn: false,                                       // 内置数据为 true，自动新增为 false
  verificationStatus: "web-assisted",                   // 可选：web-assisted / model-knowledge / manual
  order: 1,                  // 可选，控制在列表里的显示顺序，数字小的排前面，省略则按字母顺序排在最后
}
```

## 多来源证据与兼容

- 新增和自动更新的数据必须使用 `meta.sources[]`。命令证据使用 `evidenceRefs`，案例证据继续使用 `sourceIds`。
- `updatePolicy` 决定更新触发方式：动态 CLI 优先比较本机版本，发布驱动工具比较官方 Release，稳定快捷键和基础命令只允许手动深度核验。
- 不得根据 `contentCheckedAt` 或 `sourceCheckedAt` 的时间间隔自动判定资料过期。
- `verified` 必须同时有 `existence` 与 `semantics` 断言和具体 locator；只有宽泛页面或单项断言为 `partial`；无证据为 `unverified`。
- 网页来源记录重定向后的 `resolvedUrl`、实际 `pageTitle` 和 `checkedAt`。
- `sourceUrl/sourceTier` 保留用于读取旧数据；Native Host 会将旧字段合成来源记录。
- `authorship` 表示案例由谁编写，`evidenceTier` 表示证据强度，`adaptation` 表示是否改写。
- `sourceType` 不再参与新 UI 统计，只用于读取旧数据；新案例必须以 `authorship`、`evidenceTier`、`adaptation` 和 `sourceIds` 表达语义。
- 有证据的案例必须提供有效 `sourceIds`，且 `evidenceTier` 与引用来源一致。`official + verbatim` 仅用于带具体官方原例 URL 的逐字案例；基于官方行为编写的场景仍是 `editorial + adapted`。
- 来源优先级为：当前版本本机帮助、官方文档、官方仓库与 Release、登记权威第三方、普通社区线索。

## 来源信任分级（旧字段兼容）

官方文档有时滞后或维护不及时。为在不牺牲可信度的前提下保持数据新鲜，来源分三档：

- **official**：厂商自有文档（git-scm.com、docs.claude.com 等）。`meta.sourceTier` 省略时按此处理。
- **quasi-official（类官方）**：可信第三方权威参考。新结构必须匹配 `authoritativeSourcePrefixes` 的精确 URL 前缀。`readthedocs.io`、`github.com` 等托管平台不能按整个域名授信。
- **community**：其余社区来源，UI 标注"社区"，不强制白名单。

来源登记和 URL 范围统一维护在 `shared/source-registry.json`；`shared/validation-rules.json` 不再复制来源白名单。

## 校验契约（生成端宽松，仓库端严格）

`keywords` 与 `examples` 在两条链路上有意采用不同强度，这是设计而非 bug：

- **生成端（`native-host/host.py`，宽松）**：`keywords`/`examples` 缺失不报错，仅由 `build_quality_warnings` 产生质量警告。目的是不因模型偶发漏填而中断整次生成；用户可在预览里看到覆盖告警。
- **仓库端（`tools/validate-data.js`，严格）**：提交进仓库的数据，每条目都**必须**带合法的 `keywords`（3..8）与 `examples`（1..3）。CI 会对全量数据执行，缺失即失败。
- **示例 UI 文案语言**：`description`、`scenario`、`goal`、`expected`、`prerequisites`、`caveat`、`warning` 必须包含中文；`value`、`cmd`、`en`、URL、产品名和命令参数可以保留英文。

两侧的数量上下限与危险/密钥正则保持一致，统一声明在 `shared/validation-rules.json`，并由 `tests/test_validation_consistency.js` 防止漂移。改任一侧规则前先更新该 JSON。危险/密钥正则同时作用于 `examples[].value` 与 `examples[].platformValues` 的每个平台值：仓库端命中即要求 `warning` + `copyable: false`；生成端命中会自动降级（补 warning、禁复制、补安全预览 caveat）。

另有一条信息级一致性检查（不阻塞 CI）：示例标 `evidenceTier: "first-party"` 但父条目 `evidenceStatus` 为 `unverified` 时，`tools/validate-data.js` 会按工具输出警告计数，UI 也会给该示例的来源标签追加「（命令待核验）」。消除方式是为条目补 `evidenceRefs`，而不是调低示例的证据字段。

含义：本地用 host.py 生成的工具即使个别条目缺 examples 也能正常使用（仅少了示例），但若要回贡献到仓库，需补齐到满足仓库端严格校验。

## 给自动化流程（Native Messaging + claude -p）的额外要求

- 新增模式：先判断是 CLI 类还是 IDE 类，按上面对应的规则处理
- 更新模式：保留原有未变化的条目，不要整份重写丢失细节
- 新增工具应为所有条目提供 keywords、evidenceRefs 和 examples。CLI 提供可执行命令，IDE 提供操作场景
- examples 中面向用户展示的说明字段必须写中文；不要把官方英文说明原样放入 description、scenario、goal、expected、prerequisites、caveat 或 warning
- Shell 聚合工具必须为所有条目提供 `shell` 结构化层次字段和 keywords；普通参数表条目可以省略 examples，但核心、高频、危险、易错或平台差异参数必须提供 examples、caveat 或 warning
- examples 覆盖不足不会阻止写入，但会产生质量警告；结构错误仍会拒绝
- **按信号更新**：动态 CLI 先比较本机版本，未安装时再查询已登记官方 Release；版本未变时不调用模型。普通更新复用已登记来源，只有来源明确返回 404/410 或用户主动深度核验时重新执行来源发现。
- **两阶段生成**：新增工具和深度核验先发现、筛选并解释来源，再依据发现结果生成逐条绑定证据的内容。
- **来源优先级（新增与更新同样适用）**：本机帮助和第一方资料优先；官方缺失时才使用登记权威第三方。普通社区只能作为线索。永不编造。
- **类官方仅联网时生成**：只有可联网的 `claude -p` 路径（`web-assisted`）能产出 quasi-official；有 API token 的离线路径（`model-knowledge`）由 `host.py` 的 `_demote_quasi_official` 强制把 quasi-official 降级（meta→community、example→ai-derived 并去 URL），避免编造未经核实的白名单 URL。
- **联网核对（`prefer_web`）**：版本变化后的更新和强制深度核验固定使用联网 `claude -p`，保证能够核对官方资料；版本未变时不启动模型。管理页开关只控制新增工具是否强制联网。
- prompt 的白名单域名由 `host.py` 的 `QUASI_OFFICIAL_DOMAINS` 常量动态注入，不要在 prompt 里硬编码域名列表。
- 官方逐字原例使用 `authorship=official`；人工编写场景使用 `editorial`；模板派生长尾使用 `generated`。
- 第一方或权威社区案例证据必须绑定 `sourceIds`；只有官方逐字原例必须同时填写具体 `sourceUrl`，编辑场景不得伪装成官方原例。
- 重点精选条目应提供稳定 `item.id`，富化文件使用 `id:<item.id>` 关联；旧 cmd/context 键仅用于兼容
- 严禁编造没有查到的命令或快捷键；查不到就如实少收录，不要为了凑数量编内容
- Claude 只返回结构化 JSON；Native Host 校验后负责生成 JS 和原子写入
- `meta.id` 必须与文件名一致；同一 `cat + cmd + context` 不能重复
- 完成后用一句话总结：创建/更新了什么文件、收录了多少条、属于哪一类
