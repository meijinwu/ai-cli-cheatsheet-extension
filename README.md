# AI CLI 速查表

一个本地运行、不联网、不收集数据的浏览器插件，覆盖主流 AI CLI 工具的命令和快捷键中英文对照速查。

支持工具（内置）：
- **Claude Code** — Anthropic 官方 CLI
- **Codex CLI** — OpenAI Codex CLI
- **Gemini CLI** — Google Gemini CLI
- **Antigravity CLI** — 轻量 AI CLI（2026年5月发布）
- **OpenCode** — 开源 AI coding agent
- **IntelliJ IDEA** — JetBrains 系 IDE 常用快捷键

支持通过管理页调用本机 Claude Code 新增工具，并在确认差异后更新已有数据。

## 截图

![插件截图](https://raw.githubusercontent.com/wumj/ai-cli-cheatsheet-extension/main/icons/icon128.png)

## 功能

- 🔍 **相关性搜索** — 多关键词优先同时命中，支持同义词、工具名搜索和命中高亮
- 🕘 **最近与收藏** — 保存最近 20 条复制记录，并把常用条目优先展示
- 🧰 **工具偏好** — 首次引导选择常用工具，管理页可随时隐藏或恢复
- 💻 **平台适配** — 自动识别 macOS / Windows / Linux，优先显示对应平台命令
- ➕ **新增工具** — 在管理页调用 Claude Code 查询官方文档并接入
- 🔄 **安全更新** — 先展示差异；大量删除、条目骤减或来源域名变化时强制二次确认
- ✅ **来源状态** — 区分联网辅助、模型知识生成和未标注数据，并提示长期未核对的数据
- 🔒 **完全离线** — 搜索数据本地存储，不请求任何网络（新增/更新工具时除外）

## 安装

### 1. 加载插件

**macOS / Linux**

1. 把本仓库 clone 到一个**固定位置**（不要放 Downloads，避免 macOS 安全限制）：
   ```bash
   git clone https://github.com/wumj/ai-cli-cheatsheet-extension.git ~/workspace/ai-cli-cheatsheet-extension
   ```

**Windows**

1. Clone 到任意固定位置（避免桌面 / 下载，路径不要含中文或空格）：
   ```powershell
   git clone https://github.com/wumj/ai-cli-cheatsheet-extension.git C:\workspace\ai-cli-cheatsheet-extension
   ```

---

2. 打开 Chrome，访问 `chrome://extensions/`（Edge 为 `edge://extensions/`）
3. 打开右上角「开发者模式」
4. 点「加载已解压的扩展程序」，选择刚 clone 的文件夹
5. 工具栏出现终端图标即安装成功

> 如果图标不显示：点工具栏拼图图标 → 找「AI CLI 速查表」→ 点旁边的图钉固定

### 2. 启用「新增工具 / 更新已有」功能（可选）

此功能需要本机安装 [Claude Code](https://claude.ai/code)：

```bash
npm install -g @anthropic-ai/claude-code
```

然后运行一次性安装脚本：

**macOS / Linux**
```bash
cd ~/workspace/ai-cli-cheatsheet-extension
bash native-host/install.sh
```

**Windows**（在 PowerShell 中运行）
```powershell
cd C:\workspace\ai-cli-cheatsheet-extension
powershell -ExecutionPolicy Bypass -File native-host\install.ps1
```

脚本会：
- 询问你的 Claude 调用方式（官方 / DeepSeek / 自定义 API）
- 询问扩展 ID（在 chrome://extensions 开发者模式下可见）
- 自动完成所有配置，无需手动编辑任何文件

安装后完全重启浏览器，「查询并写入」按钮即可使用。

## 使用

| 操作 | 说明 |
|------|------|
| 顶部搜索框 | 输入命令、英文或中文关键词，跨工具按相关性排序 |
| `/` 或 `Cmd/Ctrl+K` | 聚焦搜索框；`Esc` 清空搜索 |
| 点击结果行 | 复制当前平台对应的命令 |
| 最近 / 收藏 | 快速回到近期复制或收藏的条目 |
| 工具与类型标签 | 按工具、快捷键、斜杠命令或参数筛选 |
| 管理 | 切换平台、隐藏/恢复工具、查看来源、新增工具或检查更新 |
| 检查更新 | 先生成差异预览，再选择应用或放弃 |

## 数据说明

- Claude Code、Codex CLI、Gemini CLI 内容来自官方文档，整理于 2026 年 6 月
- Antigravity CLI 为2026年5月新发布产品，命令仍在快速迭代，本表基于官方公告整理，请以实际 `/help` 输出为准
- IntelliJ IDEA 快捷键仅收录 macOS 默认键位常用子集
- CLI 更新频繁，建议定期使用「更新已有」刷新

## 技术架构

```
popup.html / popup.js     浏览器弹窗 UI
data/*.js                 各工具数据（由 Claude Code 自动生成和维护）
data/index.js             唯一的数据文件索引
native-host/
  host.py                 调用 claude -p，校验结构化 JSON 后原子写入数据
  install.sh              一次性安装脚本
```

新增或更新工具时，插件通过 Chrome Native Messaging API 调用本机 `claude -p`。Claude Code 只返回结构化 JSON，Native Host 校验 ID、来源、字段、重复项和写入路径。更新候选先暂存并计算差异，用户确认后再校验旧文件哈希并原子替换。Claude Code 不直接编辑仓库文件。

## 开发检查

```bash
node tools/validate-data.js
node tests/test_product_core.js
python3 -m unittest discover -s tests -v
```

GitHub Actions 会同时执行 JavaScript 语法检查、数据 schema 校验和 Native Host 单元测试。

## 贡献

欢迎 PR：
- 修正数据错误或补充遗漏的命令
- 新增工具的数据文件（参考 `data/SCHEMA.md`）
- UI 改进或功能增强

## License

[MIT](LICENSE)
