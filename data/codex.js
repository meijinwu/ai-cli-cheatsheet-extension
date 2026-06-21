// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["codex"] = {
  "meta": {
    "id": "codex",
    "name": "Codex CLI",
    "color": "#74aa9c",
    "source": "官方文档 developers.openai.com/codex，整理于 2026-06",
    "sourceUrl": "https://developers.openai.com/codex/cli/",
    "updatedAt": "2026-06-20",
    "contentCheckedAt": "2026-06-20",
    "sourceCheckedAt": "2026-06-21",
    "updatePolicy": "version-driven",
    "coverage": "官方 CLI 快捷键、斜杠命令与启动参数",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "builtIn": true,
    "order": 2,
    "sources": [
      {
        "id": "codex-slash-commands",
        "title": "Codex CLI slash commands",
        "url": "https://developers.openai.com/codex/cli/slash-commands",
        "kind": "official-doc",
        "maintainer": "OpenAI",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://developers.openai.com/codex/cli/slash-commands",
        "pageTitle": "Codex CLI slash commands",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "codex-cli-reference",
        "title": "Codex CLI command-line options",
        "url": "https://developers.openai.com/codex/cli/reference",
        "kind": "official-doc",
        "maintainer": "OpenAI",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://developers.openai.com/codex/cli/reference",
        "pageTitle": "Codex CLI command-line options",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "codex-features",
        "title": "Codex CLI features",
        "url": "https://developers.openai.com/codex/cli/features",
        "kind": "official-doc",
        "maintainer": "OpenAI",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://developers.openai.com/codex/cli/features",
        "pageTitle": "Codex CLI features",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      }
    ],
    "references": [
      {
        "id": "openai-codex-repository",
        "title": "Codex official repository",
        "url": "https://github.com/openai/codex",
        "kind": "official-repository",
        "maintainer": "OpenAI",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://github.com/openai/codex",
        "pageTitle": "Codex official repository",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "release-notes",
          "examples"
        ]
      }
    ]
  },
  "items": [
    {
      "cat": "shortcut",
      "cmd": "Ctrl+C",
      "en": "Cancel / exit on empty input",
      "zh": "取消当前操作；输入框为空时退出会话",
      "id": "fca0a3acc71696b0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+C）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+D",
      "en": "Exit (EOF)",
      "zh": "退出 Codex",
      "id": "349e17cb450062a2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+D）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+L",
      "en": "Clear terminal",
      "zh": "清空终端屏幕",
      "id": "ac51b3d0fe380177",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+L）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+G",
      "en": "Open external editor",
      "zh": "打开外部编辑器（$VISUAL 或 $EDITOR）编写长提示词",
      "id": "bcfcef8602902513",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+G）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+O",
      "en": "Copy latest response",
      "zh": "复制最近一次完成的回复内容到剪贴板",
      "id": "e449a4dae4130e3e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+O）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+R",
      "en": "Search prompt history",
      "zh": "搜索历史提示词，Enter接受匹配，Esc取消",
      "id": "34edfceaa8f0430f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+R）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+T",
      "en": "Open transcript",
      "zh": "打开transcript详情视图",
      "id": "df102634a906f0fd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Ctrl+T）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Alt+R",
      "en": "Toggle raw scrollback",
      "zh": "切换原始回滚模式，让终端选取/复制文本更直接",
      "id": "7464af88c4b2fe89",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Alt+R）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Enter（任务运行中）",
      "en": "Inject new instructions",
      "zh": "任务执行过程中按 Enter 向当前轮次插入新指令",
      "id": "eb8116078132e454",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Enter（任务运行中））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Tab（任务运行中）",
      "en": "Queue follow-up for next turn",
      "zh": "把后续输入（包括斜杠命令、! 命令）排队到下一轮处理",
      "id": "272f2c528b8f7b2b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Tab（任务运行中））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc Esc（输入框为空时）",
      "en": "Edit previous message",
      "zh": "连按两次编辑上一条消息；继续按可回溯更早消息，按 Enter 从那里分叉",
      "id": "c367f4a91a05b3c5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Esc Esc（输入框为空时））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Up / Down",
      "en": "Navigate draft history",
      "zh": "在草稿历史中导航，恢复之前的草稿文本和图片",
      "id": "b0bb38d3a2af5a17",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 Up / Down）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "@（前缀）",
      "en": "Fuzzy file search",
      "zh": "模糊搜索工作区文件，Tab/Enter插入路径",
      "id": "d0ab7f9c8fbe5354",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 @（前缀））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "!（前缀）",
      "en": "Run local shell command",
      "zh": "执行本地shell命令，遵循当前审批和沙盒设置",
      "id": "8027705783b45e04",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-features",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/features（页面内检索 !（前缀））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/model",
      "en": "Set active model",
      "zh": "选择当前激活的模型（及推理强度，如模型支持）",
      "id": "991d78879f421558",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /model）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/fast [on|off|status]",
      "en": "Toggle Fast service tier",
      "zh": "开关当前模型的快速服务层（仅部分模型支持）",
      "id": "7ae646e013acc23a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /fast [on|off|status]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/personality",
      "en": "Set communication style",
      "zh": "设置沟通风格：friendly / pragmatic / none",
      "id": "3cb27677112d7cbc",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /personality）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/plan [提示]",
      "en": "Switch to plan mode",
      "zh": "切换到计划模式（只读探索），可附带初始规划提示",
      "id": "a73e406dd79475b7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /plan [提示]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/goal <目标>",
      "en": "Set/view/pause a task goal",
      "zh": "设置、查看、暂停或清除一个持续追踪的任务目标",
      "id": "28e7f23dd5e08813",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /goal <目标>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/experimental",
      "en": "Toggle experimental features",
      "zh": "开关实验性功能（如 Apps、Smart Approvals）",
      "id": "31f562b9b21a78f5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /experimental）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/approve",
      "en": "Retry a denied action once",
      "zh": "重试一次被自动审查拒绝的操作",
      "id": "d7f2c65a4330aa2c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /approve）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/memories",
      "en": "Configure memory use",
      "zh": "配置是否使用已有记忆、是否生成新记忆",
      "id": "d3ddced4c42939f7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /memories）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/skills",
      "en": "Browse and use skills",
      "zh": "浏览并选择适用的技能",
      "id": "30d30d0db9d3be09",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /skills）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/hooks",
      "en": "View lifecycle hooks",
      "zh": "查看当前会话加载的生命周期 hook 配置",
      "id": "3aa0f347f17ee51b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /hooks）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/feedback",
      "en": "Send logs to maintainers",
      "zh": "向维护者提交诊断日志反馈",
      "id": "6678a3ebaf269c31",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /feedback）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/init",
      "en": "Generate AGENTS.md",
      "zh": "在当前目录生成 AGENTS.md 项目说明文件",
      "id": "794dc7571018f8f4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /init）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/logout",
      "en": "Sign out",
      "zh": "清除本地登录凭据",
      "id": "a2c696bc743fae6f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /logout）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-mcp",
      "cat": "slash",
      "cmd": "/mcp [verbose]",
      "en": "List MCP tools",
      "zh": "列出已配置的 MCP 工具，加 verbose 显示服务器详情",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /mcp [verbose]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-mention",
      "cat": "slash",
      "cmd": "/mention <路径>",
      "en": "Attach a file",
      "zh": "把指定文件附加到对话中",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /mention <路径>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/ps",
      "en": "Check background terminals",
      "zh": "查看后台终端列表及其最近输出",
      "id": "e19a36ada7debbb7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /ps）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/stop",
      "en": "Stop background terminals",
      "zh": "停止所有后台终端（别名 /clean）",
      "id": "0d9cf91841c5fd8e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /stop）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/fork",
      "en": "Fork conversation to new thread",
      "zh": "把当前对话克隆到新线程，原对话保持不变",
      "id": "64d560132fa342e2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /fork）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/side（或/btw）",
      "en": "Start ephemeral side chat",
      "zh": "开启临时侧对话，专注追问而不打断主线",
      "id": "91e66d0cbc20ff11",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /side（或/btw））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/raw [on|off]",
      "en": "Toggle raw scrollback mode",
      "zh": "切换原始回滚模式（同 Alt+R）",
      "id": "97584e83906a2146",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /raw [on|off]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/resume",
      "en": "Resume a saved conversation",
      "zh": "从已保存的会话列表中选择并恢复",
      "id": "8358e9a120935b74",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /resume）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-new",
      "cat": "slash",
      "cmd": "/new",
      "en": "Start new chat in same session",
      "zh": "在同一CLI会话里开启新对话（不清屏，区别于/clear）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /new）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/quit /exit",
      "en": "Exit the CLI",
      "zh": "退出命令行（保存好工作再用）",
      "id": "6ef527b2b556e11a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /quit /exit）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/review",
      "en": "Review working tree",
      "zh": "对工作区改动进行审查，聚焦行为变更和缺失测试",
      "id": "777ac1b05cc78ea2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /review）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-status",
      "cat": "slash",
      "cmd": "/status",
      "en": "Inspect session config",
      "zh": "显示当前模型、审批策略、可写目录、token用量",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /status）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/debug-config",
      "en": "Inspect config layers",
      "zh": "打印配置分层加载诊断信息，调试优先级问题",
      "id": "2a33a57ee155bc4c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /debug-config）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/statusline",
      "en": "Configure footer items",
      "zh": "自定义底部状态栏显示项并排序",
      "id": "1b14ca59176a7183",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /statusline）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/title",
      "en": "Configure terminal title",
      "zh": "自定义终端窗口/标签标题显示项",
      "id": "00c0391174b315e5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /title）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/theme",
      "en": "Choose syntax theme",
      "zh": "选择代码高亮主题",
      "id": "feaa2cfa4df1a04f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /theme）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/keymap",
      "en": "Remap TUI shortcuts",
      "zh": "查看并自定义TUI快捷键绑定，持久化到config.toml",
      "id": "5e46f4d811ea6282",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /keymap）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/ps /stop",
      "en": "Background terminal control",
      "zh": "查看/停止后台终端任务",
      "id": "52cf7296fccc3c3d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /ps /stop）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-compact",
      "cat": "slash",
      "cmd": "/compact",
      "en": "Summarize to free tokens",
      "zh": "总结对话历史，释放上下文空间",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /compact）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-diff",
      "cat": "slash",
      "cmd": "/diff",
      "en": "Show Git diff",
      "zh": "显示已暂存、未暂存及未跟踪文件的改动",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /diff）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-permissions",
      "cat": "slash",
      "cmd": "/permissions",
      "en": "Update approval policy",
      "zh": "调整审批策略，如 Auto/Read Only/Full Access",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /permissions）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/ide",
      "en": "Include IDE context",
      "zh": "把当前打开文件、选区等IDE上下文带入下一条提示",
      "id": "5b62e463b51b8960",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /ide）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/vim",
      "en": "Toggle Vim mode",
      "zh": "切换输入框的Vim编辑模式",
      "id": "4c98e4affc22dc62",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /vim）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/sandbox-add-read-dir",
      "en": "Grant sandbox read access (Win)",
      "zh": "（仅Windows）为沙盒额外授予某目录的读权限",
      "id": "5d6f25ea079a1f1d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /sandbox-add-read-dir）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/agent",
      "en": "Switch agent thread",
      "zh": "切换到其他已派生的代理线程查看或继续",
      "id": "f217d9f499cc12c8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /agent）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/apps",
      "en": "Browse connector apps",
      "zh": "浏览已连接的应用，插入为 $app-slug 引用",
      "id": "79baf685d65cfd1f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /apps）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/plugins",
      "en": "Browse plugins",
      "zh": "浏览已安装和可发现的插件，管理启用状态",
      "id": "7c330bf5567864ca",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /plugins）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-clear",
      "cat": "slash",
      "cmd": "/clear",
      "en": "Clear terminal & new chat",
      "zh": "清空终端并开始全新对话（区别于/new）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /clear）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/archive",
      "en": "Archive session and exit",
      "zh": "归档当前会话并退出，可用 codex unarchive 恢复",
      "id": "e0a3146b47eff8a7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /archive）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/copy",
      "en": "Copy latest response",
      "zh": "复制最近一次完成的回复（同 Ctrl+O）",
      "id": "b6d2b4c5320ab58f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-slash-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/slash-commands（页面内检索 /copy）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex exec \"任务\"（别名 codex e）",
      "en": "Non-interactive run",
      "zh": "非交互式跑一次任务，结果输出到 stdout",
      "id": "033fb3b9573847ec",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex exec \"任务\"（别名 codex e））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex exec --json",
      "en": "JSON event stream",
      "zh": "以换行分隔JSON事件流输出，便于脚本解析",
      "id": "346eb9c976be999e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex exec --json）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex exec resume --last",
      "en": "Resume last exec session",
      "zh": "恢复当前目录最近一次非交互会话并继续",
      "id": "83bd17bc4be0ed51",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex exec resume --last）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex resume [--last|--all]",
      "en": "Resume interactive session",
      "zh": "恢复交互式会话，--last跳过选择器，--all跨目录搜索",
      "id": "0eac1f66ddbbeb8c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex resume [--last|--all]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex fork [--last]",
      "en": "Fork a previous session",
      "zh": "把之前的会话分叉到新线程",
      "id": "98fc6527daaba6ec",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex fork [--last]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex apply <任务ID>",
      "en": "Apply cloud task diff",
      "zh": "把云端任务生成的diff应用到本地仓库",
      "id": "9bdaa27797bb5e0c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex apply <任务ID>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex login / logout",
      "en": "Manage authentication",
      "zh": "登录/登出（支持OAuth、设备码、API key管道输入）",
      "id": "87002d09fc40555f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex login / logout）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex mcp add/list/remove",
      "en": "Manage MCP servers",
      "zh": "添加/列出/删除MCP服务配置",
      "id": "5c7956b103d65163",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex mcp add/list/remove）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex mcp-server",
      "en": "Run Codex as MCP server",
      "zh": "把Codex自身作为MCP服务运行，供其他工具调用",
      "id": "eccb1fc79a26dd8f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex mcp-server）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex sandbox",
      "en": "Run command in sandbox",
      "zh": "用Codex内部沙盒策略运行任意命令",
      "id": "83ea7ebefd20f690",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex sandbox）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex completion <shell>",
      "en": "Generate shell completions",
      "zh": "生成bash/zsh/fish/powershell的自动补全脚本",
      "id": "fc193ba9019770bd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex completion <shell>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex features list/enable/disable",
      "en": "Manage feature flags",
      "zh": "列出/开启/关闭特性开关，持久化到config.toml",
      "id": "78d3e3fee9b34fa3",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex features list/enable/disable）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex cloud / codex cloud exec",
      "en": "Browse/run cloud tasks",
      "zh": "浏览或直接提交Codex Cloud云端任务",
      "id": "80cd1edef30d330b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex cloud / codex cloud exec）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex app",
      "en": "Launch desktop app",
      "zh": "启动Codex桌面应用（macOS/Windows）",
      "id": "8503e8439f3bbcf9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex app）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex app-server --listen",
      "en": "Run app server",
      "zh": "启动app server供远程TUI连接",
      "id": "b9d4e2c2732bbb32",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex app-server --listen）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "codex --remote ws://host:port",
      "en": "Connect to remote app-server",
      "zh": "把交互式TUI连接到远程app server",
      "id": "5ef12368b4ff7498",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 codex --remote ws://host:port）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-model",
      "cat": "flag",
      "cmd": "--model, -m <模型>",
      "en": "Override model",
      "zh": "覆盖配置里设定的模型，例如 gpt-5.5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --model, -m <模型>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--image, -i <路径>",
      "en": "Attach image(s)",
      "zh": "附加一张或多张图片到初始提示，逗号分隔",
      "id": "afb0547eed55e85a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --image, -i <路径>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--cd, -C <路径>",
      "en": "Set working directory",
      "zh": "设置代理开始处理前的工作目录",
      "id": "e99a0a24c7150e5f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --cd, -C <路径>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--add-dir <路径>",
      "en": "Grant extra writable dir",
      "zh": "额外授予某目录的写权限（可重复传入）",
      "id": "68ecdb161618a233",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --add-dir <路径>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-sandbox",
      "cat": "flag",
      "cmd": "--sandbox, -s <模式>",
      "en": "Sandbox policy",
      "zh": "沙盒策略：read-only / workspace-write / danger-full-access",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --sandbox, -s <模式>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--ask-for-approval, -a <模式>",
      "en": "Approval policy",
      "zh": "审批策略：untrusted / on-request / never",
      "id": "3966a67e6ce9e954",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --ask-for-approval, -a <模式>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--full-auto",
      "en": "Auto-approve in sandbox (deprecated)",
      "zh": "已弃用，建议用 --sandbox workspace-write 代替",
      "id": "fb8e10106ff2b6d7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --full-auto）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "codex-yolo",
      "cat": "flag",
      "cmd": "--yolo / --dangerously-bypass-approvals-and-sandbox",
      "en": "Bypass all safety",
      "zh": "完全跳过审批和沙盒，仅在受控隔离环境中使用",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --yolo / --dangerously-bypass-approvals-and-sandbox）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--oss",
      "en": "Use local OSS model",
      "zh": "使用本地开源模型（需要Ollama在运行）",
      "id": "1c97d587215a591e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --oss）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--profile, -p <名称>",
      "en": "Load named config profile",
      "zh": "加载config.toml中预设的命名配置档案",
      "id": "2fae693af8e40fed",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --profile, -p <名称>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--config, -c key=value",
      "en": "Inline config override",
      "zh": "内联覆盖某个配置值",
      "id": "ee6a9519832576fa",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --config, -c key=value）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--search",
      "en": "Enable live web search",
      "zh": "启用实时网络搜索（默认是缓存索引结果）",
      "id": "93e89ca9a895bbe9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --search）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--enable / --disable <feature>",
      "en": "Toggle feature flag",
      "zh": "强制开启/关闭某个特性开关",
      "id": "9ef056a1e0a99b6f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "codex-cli-reference",
          "claims": [
            "existence"
          ],
          "locator": "https://developers.openai.com/codex/cli/reference（页面内检索 --enable / --disable <feature>）",
          "checkedAt": "2026-06-21"
        }
      ]
    }
  ]
};
