# AI CLI 速查表

一个面向 Chrome / Edge 的本地速查扩展，用于查询 AI CLI、编辑器和常用开发工具的命令、参数与快捷键。

当前包含 **12 个工具、888 条数据**，每条均提供语义关键词、用法示例和明确核验状态，并支持平台适配、收藏、最近使用和工具筛选。基础查询完全在浏览器本地完成，不上传搜索词或使用记录；只有可选的“新增工具 / 检查更新”功能会调用本机 Claude Code 或配置的 Anthropic 兼容 API。

## 支持内容

| 分类 | 工具 |
|------|------|
| AI CLI | Claude Code、Codex CLI、Gemini CLI、Antigravity CLI、OpenCode、OpenClaw |
| 编辑器与写作工具 | Cursor、Visual Studio Code、IntelliJ IDEA、Typora |
| 通用开发工具 | Git、Linux 常用命令 |

数据覆盖范围因工具而异：CLI 通常包含交互命令、启动参数和快捷键；IDE 类工具主要收录默认键位下的常用快捷键。

## 主要功能

- **相关性搜索**：多关键词优先同时命中，支持常见中英文同义词、工具名搜索和结果高亮。
- **平台适配**：自动识别 macOS、Windows 或 Linux，优先显示对应平台的命令与快捷键。
- **工具与类型筛选**：已启用工具完整换行展示，可按快捷键、命令或参数筛选。
- **最近与收藏**：保存最近 20 条复制记录，并快速访问收藏条目。
- **本地偏好**：保存平台、启用工具、搜索词、收藏和最近使用记录。
- **可选数据维护**：通过 Native Messaging 调用本机更新程序，新增工具或检查已有数据。
- **证据化更新**：先发现来源再生成内容；应用前展示条目、来源、证据等级和冲突变化，来源新增、移除或证据降级时要求再次确认。
- **全量用法示例**：874 条数据全部提供用法；人工整理与 AI 推导内容会明确标注来源。

## 快速安装

### 1. 下载到固定目录

macOS / Linux：

```bash
git clone https://github.com/meijinwu/ai-cli-cheatsheet-extension.git ~/workspace/ai-cli-cheatsheet-extension
```

Windows：

```powershell
git clone https://github.com/meijinwu/ai-cli-cheatsheet-extension.git C:\workspace\ai-cli-cheatsheet-extension
```

不要把扩展放在 Downloads、临时目录或可能被清理的位置。

### 2. 加载扩展

1. 打开 `chrome://extensions/`，Edge 使用 `edge://extensions/`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择包含 `manifest.json` 的项目根目录。
5. 将“AI CLI 速查表”固定到浏览器工具栏。

到这里即可使用全部本地查询功能。新增和更新工具需要额外安装本地桥接，参见 [完整安装与故障排查](INSTALL.md)。

## 快速使用

| 操作 | 效果 |
|------|------|
| 输入中文、英文或命令 | 跨工具搜索并按相关性排序 |
| `/` 或 `Cmd/Ctrl+K` | 聚焦搜索框 |
| `Esc` | 清空搜索或退出搜索框 |
| 点击结果行 | 复制当前平台对应的命令 |
| 点击“用法” | 展开具体命令、操作场景和注意事项 |
| `↑` / `↓`，然后 `Enter` | 键盘选择并复制结果 |
| 最近 / 收藏 | 查看最近复制或收藏的条目 |
| 工具与类型标签 | 限定工具、快捷键、命令或参数 |
| 管理 | 切换平台、启用工具、查看来源、按版本检查更新或新增工具 |

## 数据可信度与安全边界

- 每个工具可登记多个来源，条目和案例可精确引用证据；管理页会区分本机帮助、官方文档、官方仓库、权威社区和未独立核验内容。
- 条目的“已核验”要求同时具备命令存在性、行为语义和具体定位证据；宽泛页面或仅确认存在性的内容显示为“部分核验”。
- `web-assisted` 表示生成时允许 Claude Code 使用联网能力，不代表每条数据都已人工逐项核验。
- `model-knowledge` 表示通过兼容 API 基于模型知识生成，应在应用前重点核对官方来源。
- 用法会分别标记“官方原例”“基于官方资料改写”“编辑整理场景”“自动生成”；案例作者与证据等级分开记录。
- 更新候选必须通过字段、ID、重复项、URL、平台和写入路径校验。
- 更新先写入临时候选文件，确认后再次校验原文件哈希并原子替换。
- 基础查询不请求网络。动态 CLI 会先比较本机版本，版本未变时不会调用模型；新增、检测到版本变化或主动深度核验时才可能产生模型用量。
- IDE 默认快捷键、Git/Linux 基础命令等稳定资料不会因核验日期较早被标记为过期；需要时可在管理页高级操作中主动重新核验。
- 动态 CLI 遇到差异时以当前安装版本的 `--help`、`/help` 和工具官方文档为准。

## 可选：新增或更新工具

此功能需要：

- 本机已安装 Claude Code，或安装脚本中配置了 Anthropic 兼容 API。
- 已运行 Native Host 安装脚本。
- 安装后完全退出并重新打开浏览器。

macOS / Linux：

```bash
bash native-host/install.sh
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File native-host\install.ps1
```

详细配置、使用限制和常见错误参见 [INSTALL.md](INSTALL.md)。

## 项目架构

```text
popup.html / popup.js       弹窗界面、筛选、复制和本地偏好
product-core.js             搜索排序、同义词和平台命令逻辑
data/*.js                   各工具数据
data/index.js               数据文件索引
usage-examples.js           公共示例派生、风险分类与兼容富化
enrichments/                按工具拆分、以稳定 item.id 关联的人工核验示例
shared/source-registry.json  内置工具来源、URL 范围与适用工具的单一登记表
background.js               弹窗与 Native Host 的任务桥接
native-host/host.py         模型调用、数据校验、差异计算和原子写入
tools/validate-data.js      数据文件静态校验
tools/migrate-built-in-evidence.js  可重复运行的内置数据证据迁移脚本
tools/verify-source-urls.js  联网检查来源最终 URL、HTTP 状态和页面标题
tests/                      搜索核心与 Native Host 单元测试
```

新增或更新工具时：

1. 扩展通过 Chrome Native Messaging 启动本机 Host。
2. Host 优先使用已配置的 Anthropic 兼容 API；未配置 Token 时回退到 `claude -p`。
3. 模型先返回经过筛选的来源清单，再依据这些来源生成结构化数据，不直接编辑仓库。
4. Host 校验来源登记、逐条证据和案例结构并生成数据文件；更新操作先返回差异预览。
5. 用户确认后，Host 校验旧文件哈希并原子写入。

## 手动维护数据

未启用 Native Host 时，也可以手动增加或修正数据：

1. 按照 [数据 Schema](data/SCHEMA.md) 创建或修改 `data/<tool-id>.js`。
2. 新增工具时同步更新 `data/index.js`。
3. 运行数据校验和测试。
4. 在扩展管理页重新加载扩展。

## 开发验证

需要 Node.js 和 Python 3：

```bash
node --check popup.js
node --check background.js
node --check product-core.js
node tools/validate-data.js
node tests/test_product_core.js
node tests/test_usage_examples.js
node tests/test_popup_ux.js
python3 -m unittest discover -s tests -v
```

需要联网复核来源重定向与页面标题时，额外运行：

```bash
node tools/verify-source-urls.js
```

GitHub Actions 会执行 JavaScript 语法检查、数据 Schema 校验和 Native Host 单元测试。

## 贡献

欢迎提交 Issue 或 Pull Request：

- 修正错误命令、翻译或平台快捷键。
- 补充遗漏条目或新增工具数据。
- 改进搜索、交互、安装流程或测试。

提交数据改动前请阅读 [data/SCHEMA.md](data/SCHEMA.md)，并尽量提供官方来源。

## 浏览器与系统

- 浏览器：Chrome、Edge，以及兼容 Manifest V3 与 Chrome Native Messaging 的 Chromium 浏览器。
- 系统：macOS、Windows、Linux。
- 基础查询不依赖 Native Host；新增和更新功能需要相应系统的安装脚本支持。

## License

[MIT](LICENSE)
