// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["openclaw"] = {
  "meta": {
    "id": "openclaw",
    "name": "OpenClaw",
    "color": "#e55934",
    "source": "Official docs docs.openclaw.ai + GitHub README openclaw/openclaw, curated 2026-06",
    "builtIn": false,
    "sourceUrl": "https://docs.openclaw.ai/tools/slash-commands",
    "updatedAt": "2026-06-20",
    "contentCheckedAt": "2026-06-20",
    "sourceCheckedAt": "2026-06-21",
    "updatePolicy": "version-driven",
    "coverage": "常用聊天斜杠命令与 CLI 子命令子集",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "order": 999,
    "sources": [
      {
        "id": "openclaw-slash",
        "title": "OpenClaw slash commands",
        "url": "https://docs.openclaw.ai/tools/slash-commands",
        "kind": "official-doc",
        "maintainer": "OpenClaw",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://docs.openclaw.ai/tools/slash-commands",
        "pageTitle": "OpenClaw slash commands",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "openclaw-cli",
        "title": "OpenClaw CLI reference",
        "url": "https://docs.openclaw.ai/cli",
        "kind": "official-doc",
        "maintainer": "OpenClaw",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://docs.openclaw.ai/cli",
        "pageTitle": "OpenClaw CLI reference",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      }
    ]
  },
  "items": [
    {
      "cat": "slash",
      "cmd": "/new [model]",
      "en": "Archive current session and start a fresh one",
      "zh": "归档当前会话并开始新会话（可选切换模型）",
      "id": "fbb67b7da30ad0b9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /new [model]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/reset [soft [message]]",
      "en": "Reset current session in place",
      "zh": "就地重置当前会话（soft 保留对话记录）",
      "id": "5a2cc73776eb8375",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /reset [soft [message]]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/name <title>",
      "en": "Name or rename the current session",
      "zh": "命名或重命名当前会话",
      "id": "f4cef846aacdd257",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /name <title>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/compact [instructions]",
      "en": "Compact the session context",
      "zh": "压缩会话上下文以节省 token",
      "id": "4de151f193665748",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /compact [instructions]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/stop",
      "en": "Abort the current run",
      "zh": "中止当前正在执行的运行",
      "id": "e935e9217127827f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /stop）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/think <level|default>",
      "en": "Set the thinking level",
      "zh": "设置思考级别（也可用 /thinking 或 /t）",
      "id": "af6d7ce1c0b55201",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /think <level|default>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/verbose on|off|full",
      "en": "Toggle verbose output",
      "zh": "切换详细输出模式（也可用 /v）",
      "id": "73217f74b2e157ee",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /verbose on|off|full）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/fast [on|off|default]",
      "en": "Toggle fast mode",
      "zh": "切换快速模式（provider 映射为高优先级推理）",
      "id": "d42c008b96ed3378",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /fast [on|off|default]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/model [name|#|status]",
      "en": "Show or set the model",
      "zh": "查看或切换当前会话模型",
      "id": "5711ecd96a7fbf50",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /model [name|#|status]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/status",
      "en": "Show execution/runtime status and uptime",
      "zh": "显示运行状态、Gateway 已运行时间、插件健康",
      "id": "626e8b1b8d02a81f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /status）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/help",
      "en": "Show the short help summary",
      "zh": "显示简短帮助摘要",
      "id": "fde4557b6bec8f07",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /help）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/commands",
      "en": "Show the generated command catalog",
      "zh": "显示所有可用命令目录",
      "id": "5abcc13ae9dec5fe",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /commands）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/tools [compact|verbose]",
      "en": "Show what the current agent can use",
      "zh": "显示当前代理可用的全部工具",
      "id": "adf27b2485f22917",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /tools [compact|verbose]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/usage off|tokens|full|cost",
      "en": "Control per-response usage footer",
      "zh": "控制每次回复后显示的用量信息",
      "id": "379f0ac8c7bb0032",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /usage off|tokens|full|cost）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/whoami",
      "en": "Show your sender id",
      "zh": "显示当前发送者身份标识（也可用 /id）",
      "id": "3b834956d114d227",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /whoami）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/context [list|detail|map|json]",
      "en": "Explain how context is assembled",
      "zh": "展示当前会话上下文组装详情",
      "id": "f5aa1833ac320abb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /context [list|detail|map|json]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/restart",
      "en": "Restart OpenClaw",
      "zh": "重启 OpenClaw 服务",
      "id": "327c9a6aff9a5e1a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /restart）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/activation mention|always",
      "en": "Set group activation mode",
      "zh": "设置群组激活模式（被 @ 唤醒或始终响应）",
      "id": "3d118c2c6225077b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /activation mention|always）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/bash <command>",
      "en": "Run a host shell command",
      "zh": "执行宿主机 shell 命令（也可用 ! 前缀）",
      "id": "f4ea834023a363bb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /bash <command>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/skill <name> [input]",
      "en": "Run a skill by name",
      "zh": "按名称调用已安装的技能",
      "id": "febbc2fc35ffadef",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /skill <name> [input]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/subagents list|log|info",
      "en": "Inspect sub-agent runs for current session",
      "zh": "查看当前会话的子代理执行记录",
      "id": "daa90ae4f71af979",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /subagents list|log|info）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/goal [status|start|pause|resume|complete|block|clear]",
      "en": "Manage durable goal for current session",
      "zh": "管理当前会话的持久化目标",
      "id": "7b374797e49c51d4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /goal [status|start|pause|resume|complete|block|clear]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/tasks",
      "en": "List active/recent background tasks",
      "zh": "列出当前会话的活动/近期后台任务",
      "id": "09f7dac593ed2a20",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /tasks）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/btw <question>",
      "en": "Ask a side question without changing session context",
      "zh": "在不影响会话上下文的情况下提一个旁路问题",
      "id": "84ff82e6fd5b0c4a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-slash",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/tools/slash-commands（页面内检索 /btw <question>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw onboard --install-daemon",
      "en": "Interactive setup wizard + install daemon",
      "zh": "交互式初始化向导并安装守护进程（推荐首次安装）",
      "id": "035172efc3256895",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw onboard --install-daemon）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw gateway status",
      "en": "Show Gateway daemon and RPC reachability",
      "zh": "查看 Gateway 守护进程运行状态和 RPC 可达性",
      "id": "4f4ab1642ae9639b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw gateway status）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw gateway restart",
      "en": "Restart the Gateway daemon",
      "zh": "重启 Gateway 守护进程",
      "id": "85c77914045bc98f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw gateway restart）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw status",
      "en": "Fast local summary of OS, gateway, agents, config",
      "zh": "快速显示系统、Gateway、代理和配置摘要",
      "id": "e27b16de672d521d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw status）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw status --all",
      "en": "Full read-only diagnosis report with log tail",
      "zh": "输出完整只读诊断报告（含脱敏日志尾部）",
      "id": "f4e9cc3ba2efb218",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw status --all）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw doctor",
      "en": "Repair/migrate config + health checks",
      "zh": "修复/迁移配置并运行健康检查",
      "id": "b8859b6ce868ca29",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw doctor）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw update",
      "en": "Update OpenClaw to latest version",
      "zh": "更新 OpenClaw 到最新版本并重启 Gateway",
      "id": "8b7ae1910db15d50",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw update）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw update --channel stable|beta|dev",
      "en": "Switch release channel (stable/beta/dev)",
      "zh": "切换发布通道（stable/beta/dev）",
      "id": "019cfe58f7a9c345",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw update --channel stable|beta|dev）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw dashboard",
      "en": "Open Control UI in browser",
      "zh": "在浏览器中打开 Control UI 控制台",
      "id": "bbfc5c0be878f745",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw dashboard）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw logs --follow",
      "en": "Tail the latest log",
      "zh": "实时跟踪最新日志输出",
      "id": "6d73b494e4028e03",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw logs --follow）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw health --json",
      "en": "Gateway snapshot in JSON format",
      "zh": "以 JSON 格式获取 Gateway 完整快照",
      "id": "a24ea5ce052c4a06",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw health --json）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw config get <path>",
      "en": "Read a config value by path",
      "zh": "按路径读取 openclaw.json 中的配置值",
      "id": "6abe2d5ff2cde5e4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw config get <path>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw config set <path> <value>",
      "en": "Set a config value by path",
      "zh": "按路径设置 openclaw.json 中的配置值",
      "id": "c8e54a8ed187b5d7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw config set <path> <value>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw configure",
      "en": "Interactive config wizard",
      "zh": "交互式配置向导",
      "id": "a64d286059d510a6",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw configure）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw agent --message <text> --thinking <level>",
      "en": "Talk to the assistant from CLI",
      "zh": "从命令行向助手发送消息（可选指定思考等级）",
      "id": "69c4d0c88ccbec48",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw agent --message <text> --thinking <level>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw message send --target <recipient> --message <text>",
      "en": "Send a message via connected channel",
      "zh": "通过已连接的消息通道发送消息",
      "id": "c6181b867bf98367",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw message send --target <recipient> --message <text>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw channels status --probe",
      "en": "Live per-channel transport state + probe",
      "zh": "实时查看各通道传输状态及探活结果",
      "id": "0e45039c4e080a2b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw channels status --probe）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw pairing approve <channel> <code>",
      "en": "Approve a DM pairing code",
      "zh": "批准直接消息配对码以授权发送者",
      "id": "71aa0aec60600d67",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw pairing approve <channel> <code>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw plugins install <plugin>",
      "en": "Install a plugin by package name",
      "zh": "按包名安装插件",
      "id": "bebd60539eebde6b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw plugins install <plugin>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "openclaw security audit",
      "en": "Audit security and DM policies",
      "zh": "审查安全配置和 DM 策略",
      "id": "73fdd4a4ca08fd3c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "openclaw-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://docs.openclaw.ai/cli（页面内检索 openclaw security audit）",
          "checkedAt": "2026-06-21"
        }
      ]
    }
  ]
};
