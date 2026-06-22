# AI CLI 速查表：完整安装与故障排查

本文档说明浏览器扩展的完整安装流程，以及可选的“新增工具 / 检查更新”功能。

当前扩展包含 Claude Code、Codex CLI、Gemini CLI、Antigravity CLI、OpenCode、OpenClaw、Cursor、Visual Studio Code、IntelliJ IDEA、Typora、Git 和 Linux 常用命令，共 12 个工具、874 条数据。

## 1. 安装浏览器扩展

### 放到固定目录

扩展以“加载已解压的扩展程序”方式运行，目录移动或被清理后会失效。不要放在 Downloads、桌面临时目录或云盘临时同步目录。

可以直接克隆仓库：

macOS / Linux：

```bash
git clone https://github.com/meijinwu/ai-cli-cheatsheet-extension.git ~/workspace/ai-cli-cheatsheet-extension
```

Windows：

```powershell
git clone https://github.com/meijinwu/ai-cli-cheatsheet-extension.git C:\workspace\ai-cli-cheatsheet-extension
```

也可以下载 ZIP，解压到固定目录。

### 加载到 Chrome / Edge

1. Chrome 打开 `chrome://extensions/`，Edge 打开 `edge://extensions/`。
2. 开启右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择包含 `manifest.json` 的项目根目录。
5. 在浏览器扩展菜单中固定“AI CLI 速查表”。

基础查询到这里即可使用，不需要安装额外程序，也不会请求网络。

## 2. 基础使用

- 输入命令、中文用途或英文说明进行跨工具搜索。
- 使用工具标签和“快捷键 / 命令 / 参数”标签筛选。
- 点击结果行复制当前平台对应的命令。
- 点击“用法”展开高频示例、操作场景和注意事项。
- 使用“最近”和“收藏”快速访问常用条目。
- 在“管理”页切换平台、启用或隐藏工具，并查看数据来源。

快捷键：

| 快捷键 | 功能 |
|--------|------|
| `/` 或 `Cmd/Ctrl+K` | 聚焦搜索框 |
| `Esc` | 清空搜索或退出搜索框 |
| `↑` / `↓` | 在结果之间移动 |
| `Enter` | 复制当前结果 |

## 3. 启用新增与更新功能

该功能通过 Chrome Native Messaging 调用本机更新程序。它不是基础查询的必要条件。

### 调用方式

安装脚本支持以下配置：

- 使用本机 Claude Code。
- 使用安装脚本配置的 Anthropic 官方或兼容 API。

模型调用可能访问网络，并会计入对应 Claude 账号或 API 的正常用量。

### 前置条件

- 已经加载浏览器扩展。
- 已取得扩展 ID：在 `chrome://extensions/` 或 `edge://extensions/` 的扩展卡片中查看。
- 如果使用 Claude Code，终端运行 `claude --version` 应能正常返回。
- Native Host 本身只依赖 Python 3；读取数据和生成差异不需要 Node.js。通过 npm 安装的 CLI 仍需要其 Node.js 运行时。

安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

### macOS / Linux

在项目根目录运行：

```bash
bash native-host/install.sh
```

安装脚本会询问调用方式和扩展 ID，并注册 Native Messaging Host。它会把检测到的
系统、npm、nvm、fnm、Volta、asdf 等可执行目录写入 Host 的进程级 PATH，不修改系统 PATH。

### Windows

在 PowerShell 中运行：

```powershell
powershell -ExecutionPolicy Bypass -File native-host\install.ps1
```

Windows 安装脚本会同时识别系统 Node、`APPDATA\npm`、nvm-windows、Volta 和 Scoop。

### 重启浏览器

安装完成后必须从浏览器菜单完全退出 Chrome / Edge，再重新打开。只关闭窗口通常不会重新加载 Native Messaging 配置。

## 4. 新增或更新工具

### 新增工具

1. 打开扩展并进入“管理”。
2. 在“新增工具”中输入工具名称。
3. 点击“查询并新增”。
4. 等待任务完成；关闭弹窗不会中断后台任务。
5. 数据写入成功后扩展会重新加载。

新增工具会尝试为全部条目生成语义关键词和用法示例。覆盖不足不会阻止新增，但管理页会显示质量警告，建议重新生成或人工补充。

### 检查更新

1. 动态 CLI 在“管理”的工具列表中点击“检查版本更新”；程序会优先比较本机安装版本，未安装时再尝试官方 Release。
2. 版本或发布标识未变化时会直接结束，不调用模型。
3. 稳定快捷键和基础命令不会按日期提示过期；如确需复核，在“高级操作”中点击“重新核验资料”。
4. 检测到实际变化后会使用联网 Claude Code 核对官方资料，再展示新增、修改、删除、版本和证据差异。
5. 选择“应用更新”或“放弃”。
6. 如果出现大量删除、条目明显减少或来源域名变化，必须勾选风险确认后才能应用。

### 数据来源状态

- **生成时允许联网辅助**：通过 Claude Code 生成，运行时允许其使用可用的联网能力。
- **模型知识生成，待人工核验**：通过兼容 API 直接生成，不能视为已在线逐条核验。
- **来源状态未标注**：历史或人工维护数据尚未添加生成方式。

无论来源状态如何，应用更新前都应检查来源 URL 和差异内容。

## 5. 限制与安全机制

- 模型只返回结构化数据，不能直接修改仓库文件。
- Native Host 会校验工具 ID、字段、来源 URL、平台、重复项和目标路径。
- 更新候选先保存到临时文件，确认应用时会再次检查原文件哈希。
- 文件通过原子替换写入，写入失败时保留旧数据。
- 内置工具不可删除，但可以在管理页隐藏。
- 一次只能运行一个新增或更新任务。
- 复杂工具可能需要数分钟，Native Host 的单次模型调用超时为 15 分钟。
- IDE 类工具没有统一的 `/help` 输出，通常只能维护默认键位下的常用子集。
- CLI、IDE 和快捷键会持续变化，最终应以工具当前版本的官方文档或本机帮助输出为准。

## 6. 手动新增数据

未安装 Native Host 时可以手动维护：

1. 按照 [data/SCHEMA.md](data/SCHEMA.md) 创建 `data/<tool-id>.js`。
2. 将工具 ID 加入 `data/index.js`。
3. 运行：

   ```bash
   node tools/validate-data.js
   node tests/test_product_core.js
   python3 -m unittest discover -s tests -v
   ```

4. 在浏览器扩展管理页重新加载扩展。

## 7. 常见问题

### 提示“连接本地更新程序失败”

依次检查：

1. 是否运行过对应系统的安装脚本。
2. 安装时填写的扩展 ID 是否与当前扩展一致。
3. 是否完全退出并重启浏览器。
4. 是否移动过项目目录；移动后需要重新加载扩展并重新安装 Native Host。

macOS / Linux 可以重新运行：

```bash
bash native-host/install.sh
```

Windows 可以重新运行：

```powershell
powershell -ExecutionPolicy Bypass -File native-host\install.ps1
```

### 更新仓库后，Native Host 仍是旧版本

重新运行对应安装脚本。选择“仅更新”时也会刷新 CLI 和 Node 的运行路径，然后必须完全退出并重启浏览器。
安装脚本会把 `host.py` 复制到系统安装目录，浏览器调用的是该副本。

### 提示目标 CLI 缺少 Node.js 运行时

数据读取本身不再需要 Node。这个提示表示已找到 Claude Code、Codex 等 CLI，但该 CLI
是通过 npm 安装的，启动时找不到 Node.js。安装 Node.js 后重新运行安装脚本以刷新路径，
再完全退出并重启浏览器。

### 扩展 ID 变化

从不同目录重新加载扩展时，扩展 ID 可能变化。重新运行安装脚本并填写新的 ID。

### 更换 Claude 或 API 配置

重新运行安装脚本，选择新的调用方式。脚本会重新生成运行配置。

### Windows 不允许运行 PowerShell 脚本

可以只对本次安装绕过策略：

```powershell
powershell -ExecutionPolicy Bypass -File native-host\install.ps1
```

也可以为当前用户启用本地脚本：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### macOS 在 Downloads 目录中出现权限错误

将项目移动到 `~/workspace/` 或 `~/Documents/` 等固定目录，在浏览器中重新加载，并重新运行安装脚本。

### 任务长时间没有完成

复杂 IDE 或命令数量较多的工具可能需要数分钟。超过 15 分钟会被终止并返回超时错误。可以重试，或根据 [数据 Schema](data/SCHEMA.md) 手动维护。

### 更新预览已经失效

如果生成预览后数据文件又被修改，Host 会拒绝应用旧预览。重新点击“检查更新”生成新的候选即可。

## 8. 隐私说明

基础查询不包含网络请求。搜索词、收藏、最近 20 条复制记录、平台和启用工具偏好保存在浏览器本地存储中。

启用新增或更新功能后，Native Host 会把工具名称、现有工具数据和生成要求发送给所配置的 Claude Code 或 Anthropic 兼容 API。数据处理方式和费用取决于用户自己的模型配置，项目不会通过额外服务器中转这些请求。

返回 [README](README.md)。
