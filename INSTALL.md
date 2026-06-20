# AI CLI 速查表 — 浏览器插件安装说明

一个本地运行、不联网、不收集数据的速查插件，覆盖 Claude Code / Codex CLI / Gemini CLI / Antigravity CLI 的命令和快捷键中英对照。

## 安装步骤（Chrome / Edge 通用，约1分钟）

1. 解压你下载的 `ai-cli-cheatsheet-extension` 文件夹，放在电脑上一个固定位置（比如 `文档/插件/`），**不要放在会被清理的临时文件夹或下载目录**，否则插件以后会失效。
2. 打开 Chrome，地址栏输入 `chrome://extensions/` 并回车（Edge 则是 `edge://extensions/`）。
3. 打开页面右上角的 **"开发者模式"** 开关。
4. 点击 **"加载已解压的扩展程序"**（Edge 是"加载解压缩的扩展"）。
5. 选择刚才解压出来的文件夹（包含 `manifest.json` 的那一层），点击"选择文件夹"。
6. 插件出现在列表里，浏览器右上角工具栏会出现一个深色终端图标。

如果工具栏没显示图标：点击工具栏的拼图/扩展图标（puzzle icon），找到"AI CLI 速查表"，点旁边的图钉将它固定显示。

## 使用方法

- 点击工具栏图标 → 弹出搜索面板
- 顶部输入框：支持按命令、英文说明、**中文意思**搜索（比如搜"压缩"能同时找到几个工具里压缩上下文的命令）
- 下方筛选标签：可按工具（Claude Code / Codex CLI / Gemini CLI / Antigravity CLI）或类型（快捷键 / 命令 / 参数）过滤
- 完全离线运行，不会请求任何网络，搜索记录只存在你本机浏览器里

## 关于数据准确性

- Claude Code / Codex CLI / Gemini CLI 三家内容来自官方文档（code.claude.com、developers.openai.com/codex、geminicli.com），整理于 2026年6月，逐字核对过官方页面。
- **Antigravity CLI 是轻量版**：它是2026年5月才发布的全新产品，命令体系还在快速变化（某个版本只有34个命令），这部分内容基于官方公告和第三方实测文章整理，没有逐字核对官方完整文档，请多留意更新。
- CLI 更新很快，命令以你本机运行 `/help` 的实际输出为准。
- **重要**：根据 Google 官方公告，Gemini CLI 的免费层/Google One/Pro/Ultra 个人用户已被引导转向 Antigravity CLI（2026年6月18日生效），企业/Google Cloud付费许可证用户不受影响。

## 🔄 自动新增/更新功能（可选，需要额外安装一步）

插件里有"➕ 新增工具"和"🔄 更新已有"两个模式：

- **新增工具**：输入一个还没收录的工具名（比如 `OpenCode` 或 `IntelliJ IDEA`），点"查询并写入"，它会在后台调用你电脑上已安装的 **Claude Code**，自动判断这个工具是命令行类还是图形界面类，去查官方文档，生成数据文件，**并自动把它接入插件界面**（不需要你手动改任何代码），完成后这个工具会出现在筛选列表里
- **更新已有**：输入一个已经收录的工具名，点"查询并写入"，它会检查官方文档是否有变化，刷新对应的数据

**这个功能默认是关闭的**，因为它需要一次性的额外安装步骤（让浏览器知道怎么联系你电脑上的程序）。如果你不装这一步，按钮点了会提示"连接本地更新程序失败"，不影响插件本身的查询功能正常使用。

### 安装步骤（一次性，约2分钟）

**前提条件**：
- 已安装 Claude Code（终端运行 `claude --version` 能看到版本号）
- 已经按上面的步骤把这个插件加载进了 Chrome，并拿到了它的扩展 ID

**拿扩展 ID**：打开 `chrome://extensions/`，开发者模式打开后，这个插件卡片上会显示一行 ID，是一串32位字母，比如 `abcdefghijklmnopabcdefghijklmnop`，复制它。

**运行安装脚本**：
```bash
cd 插件解压出来的文件夹路径/native-host
chmod +x install.sh
./install.sh
```
脚本会检测环境，并提示你粘贴刚才复制的扩展 ID，跑完后会提示安装成功。

**完全重启 Chrome**（在菜单里选"退出"，不是关窗口，再重新打开），这一步是必须的，否则浏览器不会重新读取新注册的配置。

### 使用方法

1. 点插件图标打开面板
2. 选择"➕ 新增工具"或"🔄 更新已有"
3. 在输入框填工具名，比如 `OpenCode` 或 `IntelliJ IDEA`
4. 点"查询并写入"
5. 等待1-3分钟（后台在调用 Claude Code 查文档并返回结构化数据，过程中可以关闭面板）
6. 数据发生变化时插件会自动重新加载；稍后重新打开面板即可

### 关于 IDE 类工具（IntelliJ IDEA、VS Code 等）的特殊说明

这类工具和命令行工具不一样：没有统一的 `/help` 查询入口，快捷键因操作系统（Mac/Win/Linux）和键位方案（默认/Vim/Emacs）不同而不同，官方文档通常按"功能分类"而不是"全量列表"给出。

自动新增时，Claude Code 会尽量去查官方的"默认键位映射"文档，但只能收录**默认键位下的常用子集**，不是详尽完整的列表，数据来源字段里会明确标注这一点。如果你用的是非默认键位（比如 Vim 模式），可能需要自己核对调整。

### 关于这个功能的费用和限制

- 每次点击相当于在终端跑了一次 `claude -p "..."`，会计入你 Claude Code 的正常用量，和你平时直接对话使用是同一个额度，没有额外收费项
- 不支持"定时自动检查"，必须你手动点一下才会触发一次
- 如果查询的工具官网内容比较复杂或网络慢，可能超过5分钟会超时失败，可以重试或者干脆直接在终端里用 `claude` 手动查

## 以后想添加新工具（比如 OpenCode）怎么办

## 手动新增新工具（备选方案，没装自动更新功能时用）

如果你没装上面的 native-host，或者想自己控制整理过程，也可以手动来：

1. 在 `data/` 文件夹里新建一个文件，比如 `opencode.js`
2. 参照同文件夹里 `SCHEMA.md` 的格式填入命令数据
3. 在 `data/index.js` 中加入 `opencode`
4. 重新在 `chrome://extensions/` 页面点这个插件卡片上的刷新按钮即可生效，不需要重新安装

（不需要再改 `popup.js`，它会自动扫描所有已加载的数据文件。）

如果你不想自己改代码，把工具名发给我，我可以帮你生成新工具的数据文件和改好的代码。

## 常见问题排查

### 「查询并写入」点了报"连接本地更新程序失败"

按顺序检查：

1. **确认安装脚本跑过了**
   - macOS/Linux：`ls ~/Library/Application\ Support/aicli-cheatsheet/` 应能看到 `host.py` 和 `run.sh`
   - Windows：检查 `%APPDATA%\aicli-cheatsheet\` 目录下有 `host.py` 和 `run.bat`

2. **确认扩展 ID 没变**
   扩展每次从新路径重新加载后 ID 会变。重新运行安装脚本，把新 ID 填进去。

3. **确认完全重启了浏览器**
   关窗口不够，必须从菜单选"退出 Chrome / Quit"，然后重新打开。

4. **再运行一次安装脚本**
   ```bash
   bash native-host/install.sh      # macOS/Linux
   powershell -ExecutionPolicy Bypass -File native-host\install.ps1   # Windows
   ```

### 如何更新 API 配置（换 DeepSeek / 官方 Claude）

直接重新运行安装脚本，它会重新生成 `run.sh` / `run.bat`，覆盖之前的配置。

### 如何更新扩展 ID（重新加载扩展后 ID 变了）

同上，重新运行安装脚本，输入新的扩展 ID 即可。

### Windows：PowerShell 显示"不允许运行脚本"

以管理员身份打开 PowerShell，运行：
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
或者每次用：
```powershell
powershell -ExecutionPolicy Bypass -File native-host\install.ps1
```

### macOS：从 Downloads 文件夹运行时报权限错误

macOS 对 Downloads 文件夹里的脚本有额外安全限制。请把插件文件夹移到其他位置（比如 `~/workspace/` 或 `~/Documents/`），再重新在 Chrome 里加载，并重新运行安装脚本。

### 查询超时（等了很久报"执行超时"）

对于快捷键很多的 IDE 类工具（如 IntelliJ IDEA），查询可能需要 5-10 分钟。如果超时失败，可以：
1. 再点一次"查询并写入"重试
2. 或者在终端直接运行 `claude` 手动查询后，按 `data/SCHEMA.md` 的格式手动创建数据文件

---

## 隐私说明

插件本身不包含任何网络请求代码，不会上传、收集或分享任何数据。唯一存储的数据是你上次输入的搜索词（保存在浏览器本地，方便下次打开时还在），可以随时在搜索框里清空覆盖。

"自动更新"功能（如果你装了 native-host）会在本机调用 Claude Code，这部分网络请求和你平时直接使用 Claude Code 是同样的隐私和数据处理方式，不经过这个插件本身中转。
