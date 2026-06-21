// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["antigravity-cli"] = {
  "meta": {
    "id": "antigravity-cli",
    "name": "Antigravity CLI",
    "color": "#9b6bdf",
    "source": "⚠️轻量版：官方公告+第三方实测整理，2026-06（非逐字核对官方文档，命令仍在快速变化中）",
    "sourceUrl": "https://developers.googleblog.com/",
    "updatedAt": "2026-06-20",
    "contentCheckedAt": "2026-06-20",
    "sourceCheckedAt": "2026-06-21",
    "updatePolicy": "manual-only",
    "coverage": "官方公告与实测整理的常用子集，非完整官方清单",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "builtIn": true,
    "order": 4,
    "sources": [
      {
        "id": "antigravity-announcement",
        "title": "Transitioning Gemini CLI to Antigravity CLI",
        "url": "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
        "kind": "official-doc",
        "maintainer": "Google",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
        "pageTitle": "Transitioning Gemini CLI to Antigravity CLI",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "release-notes"
        ]
      }
    ]
  },
  "items": [
    {
      "cat": "flag",
      "cmd": "agy",
      "en": "Launch interactive TUI",
      "zh": "启动交互式终端界面（是 Gemini CLI 的官方继任者，命令从 gemini 换成了 agy）",
      "id": "9214a76c9e068280",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "antigravity-announcement",
          "claims": [
            "existence"
          ],
          "locator": "官方迁移公告中的 Antigravity CLI 产品入口",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "agy --model \"模型名\"",
      "en": "Set model at launch",
      "zh": "启动时指定模型，例如 Gemini 3.5 Flash / Gemini 3.1 Pro / Claude Sonnet / Claude Opus / GPT-OSS 120B（视套餐）",
      "id": "e441243d9d431615",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "agy -p / --print",
      "en": "Non-interactive one-shot",
      "zh": "非交互单次执行模式",
      "id": "c078911b531fbdc3",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "agy --version",
      "en": "Check version (safe)",
      "zh": "安全的非交互版本检查（agy version 在无真实终端时可能失败）",
      "id": "5636b05b72aaa4bd",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "agy changelog",
      "en": "View version changelog",
      "zh": "查看不同版本之间的更新日志（外部命令，不是会话内斜杠命令）",
      "id": "9b136471f526853b",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "agy models",
      "en": "List available models",
      "zh": "列出当前可用的模型（外部命令）",
      "id": "9b27426fc91ec116",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-help",
      "cat": "flag",
      "cmd": "agy help",
      "en": "Show wrapper commands",
      "zh": "显示外层shell命令（区别于会话内的斜杠命令）",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-update",
      "cat": "flag",
      "cmd": "agy install / agy update",
      "en": "Install or update agy",
      "zh": "安装或更新 agy 本体",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "agy plugin",
      "en": "Manage plugins",
      "zh": "管理插件（Antigravity plugins，相当于 Gemini CLI 的 Extensions）",
      "id": "9be18c1d0997b079",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/help 或 ?",
      "en": "Show help (3 tabs)",
      "zh": "显示帮助，含 general/commands/shortcuts 三个标签页，用Tab键切换浏览",
      "id": "936faf0ac514a58d",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/quit 或 /exit",
      "en": "Exit the session",
      "zh": "退出会话（也可以按两次 Ctrl+D）",
      "id": "a9108b8b30a59731",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-config",
      "cat": "slash",
      "cmd": "/config 或 /settings",
      "en": "Open configuration",
      "zh": "打开配置设置（对应 Gemini CLI 的 /settings）",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/model",
      "en": "Switch model mid-session",
      "zh": "会话中切换模型",
      "id": "186d0438d19ceaed",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/diff",
      "en": "Inspect modified files",
      "zh": "查看已修改文件的diff",
      "id": "06b5d0ad28912284",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/rewind 或 /undo",
      "en": "Roll back conversation",
      "zh": "把对话历史回退到之前的消息（对应Gemini CLI的/rewind）",
      "id": "f91dba3ba4d2fe4f",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-fork",
      "cat": "slash",
      "cmd": "/fork",
      "en": "Explore alt approach",
      "zh": "分叉当前对话，探索不同方案而不丢失当前线程（Gemini CLI无直接对应）",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/resume",
      "en": "Reopen previous logs",
      "zh": "恢复之前的会话记录；关闭时会打印恢复指定会话所需的命令",
      "id": "0d74170ed385e88f",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-agents",
      "cat": "slash",
      "cmd": "/agents",
      "en": "Open Agent Manager panel",
      "zh": "打开代理管理面板，查看活跃和已完成的后台子代理状态、所在步骤",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/tasks",
      "en": "Shell execution logs",
      "zh": "查看shell执行日志（对应Gemini CLI的/shells或/bashes）",
      "id": "b92851888ae6e97f",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/skills",
      "en": "Browse loaded skills",
      "zh": "浏览已加载的Agent Skills",
      "id": "efe357f11d134986",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-mcp",
      "cat": "slash",
      "cmd": "/mcp",
      "en": "Manage MCP servers",
      "zh": "管理Model Context Protocol服务",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/hooks",
      "en": "Inspect active hooks",
      "zh": "查看激活的pre-flight和post-format生命周期钩子",
      "id": "b3f8fa1798375e84",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/permissions",
      "en": "Manage permission rules",
      "zh": "为三层配置分别添加/编辑/删除权限规则（1.0.5版本新增，可直接在CLI内操作）",
      "id": "24a611d3af704936",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/fast",
      "en": "Skip plan, execute directly",
      "zh": "跳过规划阶段直接执行，适合快速反馈循环（Gemini CLI无直接对应）",
      "id": "dd96c8aa5687bdf8",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-artifacts",
      "cat": "slash",
      "cmd": "/artifacts",
      "en": "Manage implementation plan",
      "zh": "管理实施计划（对应Gemini CLI的/plan）",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/task",
      "en": "Task status",
      "zh": "查看长任务运行状态",
      "id": "824e159056955065",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/btw",
      "en": "Side question",
      "zh": "插入一个侧向提问，不污染主对话线程",
      "id": "913657d3f97019c3",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "slash",
      "cmd": "/export",
      "en": "Push to desktop GUI",
      "zh": "把当前问题推送到Antigravity 2.0桌面应用，查看更丰富的diff和图谱视图",
      "id": "2521b944c0a2dfcd",
      "evidenceStatus": "unverified"
    },
    {
      "id": "agy-usage",
      "cat": "slash",
      "cmd": "/usage",
      "en": "Offline developer manual",
      "zh": "离线开发手册（Gemini CLI无直接对应）",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+D（连按两次）",
      "en": "Exit / close TUI",
      "zh": "关闭TUI，恢复原本的shell会话",
      "id": "b6dfa800ff744ae4",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "shortcut",
      "cmd": "y",
      "en": "Confirm proposed command",
      "zh": "确认代理提议要执行的命令",
      "id": "6e9b652918909f1a",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+K",
      "en": "Fast-approve pending action",
      "zh": "有子代理操作待批准出现在提示框上方时，快速通过",
      "id": "14f28d03955a6ad9",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+R",
      "en": "Open Artifact Review panel",
      "zh": "打开工件审查面板；即使在回答待处理问题或权限确认时也能打开，并保留当前进度",
      "id": "14a14ae5536aeb44",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "shortcut",
      "cmd": "@路径 或 @目录 或 @**/*.ts",
      "en": "Pull file/glob into context",
      "zh": "把文件、整个目录或glob匹配的文件拉入对话上下文，无需手动粘贴",
      "id": "6f757422f51052b0",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "AGENTS.md（项目根目录）",
      "en": "Plain-English project instructions",
      "zh": "项目级指令文件，内容会被预置到该目录下处理的每条提示前面（类似CLAUDE.md/GEMINI.md）",
      "id": "15106faa8e640bdf",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": ".agents/skills/<名称>.md",
      "en": "Define a custom skill",
      "zh": "定义一个可复用的自定义技能，文件名即对应斜杠命令名，如 lint.md → /lint",
      "id": "af7c1a929a572da0",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "~/.gemini/antigravity-cli/skills/",
      "en": "Global skills location",
      "zh": "全局技能存放位置",
      "id": "7e4331d861b7b067",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "~/.gemini/antigravity-cli/settings.json",
      "en": "Main settings file",
      "zh": "主要设置文件（注意路径仍在.gemini目录下的子目录，不是全新独立路径）",
      "id": "de71b9a330f4f520",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "~/.gemini/antigravity-cli/keybindings.json",
      "en": "Custom keybindings",
      "zh": "自定义按键绑定文件",
      "id": "4f0d4824fc36702e",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "~/.gemini/antigravity-cli/log/cli-*.log",
      "en": "Log files",
      "zh": "日志文件位置，排查问题第一个该看的地方",
      "id": "cdb9cdb921f21c4b",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "~/.gemini/antigravity-cli/cache/projects.json",
      "en": "Workspace-project mapping",
      "zh": "工作区到项目的映射缓存",
      "id": "e002f9c2df435163",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "首次启动自动检测迁移",
      "en": "Auto-detects legacy Gemini CLI profile",
      "zh": "agy首次启动会检测本机是否有旧版Gemini CLI配置，并提示选择要迁移哪些资产（技能、MCP配置等）",
      "id": "ea9d447021000b4d",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "安装命令（macOS/Linux）",
      "en": "curl install script",
      "zh": "curl -fsSL https://antigravity.google/cli/install.sh | bash",
      "id": "3459535a8fe20604",
      "evidenceStatus": "unverified"
    },
    {
      "cat": "flag",
      "cmd": "安装命令（Windows PowerShell）",
      "en": "irm install script",
      "zh": "irm https://antigravity.google/cli/install.ps1 | iex",
      "id": "101f6e4e0132508a",
      "evidenceStatus": "unverified"
    }
  ]
};
