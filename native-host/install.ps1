# install.ps1 — Windows 一次性安装脚本，把 native-host 部署并注册进浏览器。
# 用法：在 PowerShell 里运行（右键 → 用 PowerShell 运行，或 powershell -ExecutionPolicy Bypass -File install.ps1）

$ErrorActionPreference = "Stop"

$ScriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir
$HostName   = "com.aicli.cheatsheet_updater"
$InstallDir = Join-Path $env:APPDATA "aicli-cheatsheet"

Write-Host ""
Write-Host "=== AI CLI 速查表 — 本地更新桥接 安装程序 (Windows) ===" -ForegroundColor Cyan
Write-Host ""

# ── 1. 检查 Python 3 ────────────────────────────────────────────────────────────

$PythonExe = $null
foreach ($cmd in @("python3", "python")) {
    try {
        $ver = & $cmd --version 2>&1
        if ($ver -match "Python 3\.") {
            $PythonExe = (Get-Command $cmd -ErrorAction Stop).Source
            Write-Host "✅ Python: $ver  ($PythonExe)" -ForegroundColor Green
            break
        }
    } catch {}
}
if (-not $PythonExe) {
    Write-Host "❌ 没找到 Python 3，请先安装：https://python.org/downloads" -ForegroundColor Red
    Write-Host "   安装时勾选「Add Python to PATH」，然后重新运行本脚本。"
    exit 1
}

# ── 2. 检查运行路径与可选 CLI ──────────────────────────────────────────────────

$RuntimeDirs = [System.Collections.Generic.List[string]]::new()
function Add-RuntimeDir([string]$Path) {
    if ($Path -and (Test-Path -LiteralPath $Path) -and -not $RuntimeDirs.Contains($Path)) {
        $RuntimeDirs.Add($Path)
    }
}
foreach ($cmd in @("node", "claude", "codex", "gemini", "opencode", "openclaw")) {
    try {
        Add-RuntimeDir (Split-Path -Parent (Get-Command $cmd -ErrorAction Stop).Source)
    } catch {}
}
foreach ($dir in @(
    $env:NVM_SYMLINK,
    $env:NVM_HOME,
    $env:FNM_MULTISHELL_PATH,
    $env:PNPM_HOME,
    $(if ($env:VOLTA_HOME) { Join-Path $env:VOLTA_HOME "bin" }),
    (Join-Path $env:APPDATA "npm"),
    (Join-Path $env:LOCALAPPDATA "Programs\nodejs"),
    (Join-Path $env:LOCALAPPDATA "Volta\bin"),
    (Join-Path $HOME "scoop\shims"),
    (Join-Path $HOME ".bun\bin"),
    (Join-Path $env:ProgramFiles "nodejs")
)) { Add-RuntimeDir $dir }
$RuntimePath = $RuntimeDirs -join ";"

function Find-InRuntime([string[]]$Names) {
    foreach ($dir in $RuntimeDirs) {
        foreach ($name in $Names) {
            $candidate = Join-Path $dir $name
            if (Test-Path -LiteralPath $candidate) { return $candidate }
        }
    }
    return $null
}
$NodeExe = Find-InRuntime @("node.exe", "node.cmd", "node")
$ClaudeExe = Find-InRuntime @("claude.cmd", "claude.exe", "claude")
if ($NodeExe) {
    Write-Host "✅ node: $(& $NodeExe --version)  ($NodeExe)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  未检测到 Node.js；数据读取不需要 Node，仅 npm 安装的 CLI 运行时可能需要。" -ForegroundColor Yellow
}
if (-not $ClaudeExe) {
    Write-Host "⚠️  没找到 claude 命令。" -ForegroundColor Yellow
    Write-Host "   本功能需要 Claude Code CLI：npm install -g @anthropic-ai/claude-code"
    Write-Host "   安装好后重新运行本脚本，或先继续完成安装。"
} else {
    Write-Host "✅ claude: $ClaudeExe" -ForegroundColor Green
}

# ── 3. 部署文件 ─────────────────────────────────────────────────────────────────

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Copy-Item (Join-Path $ScriptDir "host.py") (Join-Path $InstallDir "host.py") -Force
Write-Host "✅ host.py 已复制到：$InstallDir" -ForegroundColor Green

$RunBat = Join-Path $InstallDir "run.bat"
if (Test-Path -LiteralPath $RunBat) {
    $UpdateOnly = Read-Host "检测到已有安装。仅更新 host.py 并刷新运行路径，保留现有 API 配置？[Y/n]"
    if ([string]::IsNullOrEmpty($UpdateOnly) -or $UpdateOnly -match "^[Yy]$") {
        $ExistingLines = @(Get-Content -LiteralPath $RunBat | Where-Object {
            $_ -notlike 'set "AICLI_EXTRA_PATH=*' -and
            $_ -notlike 'set "PATH=%AICLI_EXTRA_PATH%*'
        })
        $LaunchIndex = -1
        for ($i = 0; $i -lt $ExistingLines.Count; $i++) {
            if ($ExistingLines[$i] -match 'host\.py') { $LaunchIndex = $i; break }
        }
        if ($LaunchIndex -lt 0) { throw "现有 run.bat 格式无效，找不到 host.py 启动行" }
        $NewLines = @()
        if ($LaunchIndex -gt 0) { $NewLines += $ExistingLines[0..($LaunchIndex - 1)] }
        $NewLines += "set `"AICLI_EXTRA_PATH=$RuntimePath`""
        $NewLines += 'set "PATH=%AICLI_EXTRA_PATH%;%SystemRoot%\System32;%SystemRoot%"'
        $NewLines += $ExistingLines[$LaunchIndex..($ExistingLines.Count - 1)]
        [IO.File]::WriteAllLines($RunBat, $NewLines, [Text.UTF8Encoding]::new($false))
        Write-Host "✅ host.py 与运行路径已更新。请完全退出并重启浏览器。" -ForegroundColor Green
        exit 0
    }
}

# ── 4. 配置 claude 调用方式 ─────────────────────────────────────────────────────

Write-Host ""
Write-Host "Claude Code 调用配置："
Write-Host "  [1] 使用当前系统环境（默认，继承系统 ANTHROPIC_BASE_URL 等变量）"
Write-Host "  [2] 强制走官方 Claude API（清除所有自定义变量，使用 ~/.claude/ 登录会话）"
Write-Host "  [3] 自定义（手动填写 API Base URL 和 Auth Token）"
$ApiChoice = Read-Host "请选择 [1/2/3]，直接回车默认选 1"
if ([string]::IsNullOrEmpty($ApiChoice)) { $ApiChoice = "1" }

$EnvLines = @()
if ($ApiChoice -eq "2") {
    $EnvLines = @(
        'set "ANTHROPIC_BASE_URL="',
        'set "ANTHROPIC_API_KEY="',
        'set "ANTHROPIC_AUTH_TOKEN="',
        'set "ANTHROPIC_MODEL="',
        'set "ANTHROPIC_DEFAULT_HAIKU_MODEL="',
        'set "ANTHROPIC_DEFAULT_SONNET_MODEL="',
        'set "ANTHROPIC_DEFAULT_OPUS_MODEL="',
        'set "CLAUDE_CODE_SUBAGENT_MODEL="',
        'set "CLAUDE_CODE_EFFORT_LEVEL="',
        'set "ENABLE_TOOL_SEARCH="',
        'set "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS="'
    )
} elseif ($ApiChoice -eq "3") {
    $CustomUrl   = Read-Host "ANTHROPIC_BASE_URL（如 https://api.deepseek.com/anthropic）"
    $CustomToken = Read-Host "ANTHROPIC_AUTH_TOKEN（你的 API Key）"
    $CustomModel = Read-Host "ANTHROPIC_MODEL（如 deepseek-chat，留空跳过）"
    $EnvLines = @("set `"ANTHROPIC_BASE_URL=$CustomUrl`"", "set `"ANTHROPIC_AUTH_TOKEN=$CustomToken`"")
    if ($CustomModel) { $EnvLines += "set `"ANTHROPIC_MODEL=$CustomModel`"" }
}

# ── 5. 生成 run.bat ──────────────────────────────────────────────────────────────

$BatchLines = @(
    "@echo off",
    "rem Auto-generated by install.ps1 — re-run install.ps1 to reconfigure."
) + $EnvLines + @(
    "set `"AICLI_PROJECT_DIR=$ProjectDir`"",
    "set `"AICLI_EXTRA_PATH=$RuntimePath`"",
    'set "PATH=%AICLI_EXTRA_PATH%;%SystemRoot%\System32;%SystemRoot%"',
    "`"$PythonExe`" `"$InstallDir\host.py`" %*"
)
[IO.File]::WriteAllLines($RunBat, $BatchLines, [Text.UTF8Encoding]::new($false))
Write-Host "✅ run.bat 已生成：$RunBat" -ForegroundColor Green

# ── 6. 询问扩展 ID ───────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "需要你的浏览器扩展 ID："
Write-Host "  Chrome：打开 chrome://extensions/，开启开发者模式，找到「AI CLI 速查表」"
Write-Host "  Edge：  打开 edge://extensions/，步骤相同"
Write-Host "  卡片上会显示一串字母，如 abcdefghijklmnopabcdefghijklmnop"
$ExtensionId = Read-Host "请粘贴扩展 ID"
if ([string]::IsNullOrEmpty($ExtensionId)) {
    Write-Host "❌ 扩展 ID 不能为空，安装中止。" -ForegroundColor Red
    exit 1
}
if ($ExtensionId -notmatch '^[a-z]{32}$') {
    Write-Host "❌ 扩展 ID 格式不对（应为 32 位小写字母，如 abcdefghijklmnopabcdefghijklmnop）。" -ForegroundColor Red
    Write-Host "   请在 chrome://extensions 开发者模式下确认正确的 ID 再重新运行。"
    exit 1
}

# ── 7. 写 manifest 并注册到注册表 ───────────────────────────────────────────────

function Register-NativeHost {
    param($Browser, $RegPath)

    $ManifestPath = Join-Path $InstallDir "$HostName.$Browser.json"
    $Manifest = @{
        name            = $HostName
        description     = "AI CLI 速查表插件的本地更新桥接程序"
        path            = $RunBat
        type            = "stdio"
        allowed_origins = @("chrome-extension://$ExtensionId/")
    } | ConvertTo-Json -Depth 3
    [IO.File]::WriteAllText($ManifestPath, $Manifest, [Text.UTF8Encoding]::new($false))

    $RegKey = "$RegPath\$HostName"
    New-Item -Path $RegKey -Force | Out-Null
    Set-ItemProperty -Path $RegKey -Name "(Default)" -Value $ManifestPath
    Write-Host "✅ 已注册到 $Browser 注册表：$RegKey" -ForegroundColor Green
}

Register-NativeHost -Browser "Chrome" -RegPath "HKCU:\Software\Google\Chrome\NativeMessagingHosts"

$EdgeChoice = Read-Host "同时注册到 Edge？[y/N]"
if ($EdgeChoice -match "^[Yy]$") {
    Register-NativeHost -Browser "Edge" -RegPath "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts"
}

# ── 8. 完成 ─────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "=== 安装完成 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "请完全退出浏览器，重新打开后，插件里的「查询并写入」按钮即可使用。"
Write-Host ""
Write-Host "如需重新配置（更换 API 或更新扩展 ID），直接重新运行本脚本即可。"
