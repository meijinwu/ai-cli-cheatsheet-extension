# AI CLI 速查表

一个本地运行、不联网、不收集数据的浏览器插件，覆盖主流 AI CLI 工具的命令和快捷键中英文对照速查。

支持工具（内置）：
- **Claude Code** — Anthropic 官方 CLI
- **Codex CLI** — OpenAI Codex CLI
- **Gemini CLI** — Google Gemini CLI
- **Antigravity CLI** — 轻量 AI CLI（2026年5月发布）
- **OpenCode** — 开源 AI coding agent
- **IntelliJ IDEA** — JetBrains 系 IDE 常用快捷键

支持通过内置的「新增工具」功能，调用本机 Claude Code 自动查询官方文档并接入任意工具。

## 截图

![插件截图](https://raw.githubusercontent.com/wumj/ai-cli-cheatsheet-extension/main/icons/icon128.png)

## 功能

- 🔍 **即时搜索** — 支持命令名、英文说明、中文意思三路搜索（如搜"压缩"能同时匹配多个工具）
- 🏷️ **筛选标签** — 按工具或类型（快捷键 / 命令 / 参数）过滤
- ➕ **新增工具** — 输入工具名，自动调用 Claude Code 查询官方文档并写入，完成后即时刷新
- 🔄 **更新已有** — 检查官方文档变更，刷新已收录工具的数据
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
| 顶部搜索框 | 输入命令名、英文或中文关键词 |
| 工具标签 | 点击过滤到某个工具 |
| 类型标签 | 按快捷键 / 斜杠命令 / 参数筛选 |
| ➕ 新增工具 | 输入工具名（支持缩写，如 IDEA、vscode），点「查询并写入」，等待完成后自动刷新 |
| 🔄 更新已有 | 输入已收录工具名，刷新最新文档内容 |

## 数据说明

- Claude Code、Codex CLI、Gemini CLI 内容来自官方文档，整理于 2026 年 6 月
- Antigravity CLI 为2026年5月新发布产品，命令仍在快速迭代，本表基于官方公告整理，请以实际 `/help` 输出为准
- IntelliJ IDEA 快捷键仅收录 macOS 默认键位常用子集
- CLI 更新频繁，建议定期使用「更新已有」刷新

## 技术架构

```
popup.html / popup.js     浏览器弹窗 UI
data/*.js                 各工具数据（由 Claude Code 自动生成和维护）
native-host/
  host.py                 Native Messaging host，接收浏览器请求，调用 claude -p
  install.sh              一次性安装脚本
```

新增工具时，插件通过 Chrome Native Messaging API 调用本机 `claude -p`，Claude Code 自动搜索官方文档、生成 `data/<tool-id>.js`，并插入 `popup.html` 的 script 引用，完成后自动重载插件。

## 贡献

欢迎 PR：
- 修正数据错误或补充遗漏的命令
- 新增工具的数据文件（参考 `data/SCHEMA.md`）
- UI 改进或功能增强

## License

[MIT](LICENSE)
