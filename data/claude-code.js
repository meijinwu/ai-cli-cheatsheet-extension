// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["claude-code"] = {
  "meta": {
    "id": "claude-code",
    "name": "Claude Code",
    "color": "#d97757",
    "source": "官方文档 code.claude.com，整理于 2026-06",
    "sourceUrl": "https://code.claude.com/docs/en/interactive-mode",
    "updatedAt": "2026-06-20",
    "coverage": "官方交互快捷键与斜杠命令",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "builtIn": true,
    "order": 1,
    "sources": [
      {
        "id": "claude-interactive",
        "title": "Claude Code interactive mode",
        "url": "https://code.claude.com/docs/en/interactive-mode",
        "kind": "official-doc",
        "maintainer": "Anthropic",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://code.claude.com/docs/en/interactive-mode",
        "pageTitle": "Claude Code interactive mode",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "claude-commands",
        "title": "Claude Code commands",
        "url": "https://code.claude.com/docs/en/commands",
        "kind": "official-doc",
        "maintainer": "Anthropic",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://code.claude.com/docs/en/commands",
        "pageTitle": "Claude Code commands",
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
        "id": "claude-cli-reference",
        "title": "Claude Code CLI reference",
        "url": "https://code.claude.com/docs/en/cli-reference",
        "kind": "official-doc",
        "maintainer": "Anthropic",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://code.claude.com/docs/en/cli-reference",
        "pageTitle": "Claude Code CLI reference",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "anthropic-claude-code-repository",
        "title": "Claude Code official repository",
        "url": "https://github.com/anthropics/claude-code",
        "kind": "official-repository",
        "maintainer": "Anthropic",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://github.com/anthropics/claude-code",
        "pageTitle": "Claude Code official repository",
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
      "en": "Interrupt, or clear input",
      "zh": "中断当前操作；如果没有操作在运行，第一次按清空输入框，再按一次退出",
      "id": "70d49506ce01638c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+C）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+X Ctrl+K",
      "en": "Stop background subagents",
      "zh": "停止本会话所有后台子代理；3秒内连按两次确认",
      "id": "3394eb4461b20b17",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+X Ctrl+K）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+D",
      "en": "Exit session",
      "zh": "退出 Claude Code 会话",
      "id": "7de2b8233558dfce",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+D）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+G",
      "en": "Open in external editor",
      "zh": "用默认文本编辑器打开当前输入内容进行编辑",
      "id": "6b69b7ca34cb73a1",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+G）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+L",
      "en": "Redraw screen",
      "zh": "强制重绘终端屏幕（保留输入和对话历史），用于修复显示错乱",
      "id": "678f1ee797f6dfef",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+L）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+O",
      "en": "Toggle transcript viewer",
      "zh": "切换显示详细的工具调用记录（也会展开 MCP 调用细节）",
      "id": "17ffba3ab67e89dd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+O）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+R",
      "en": "Reverse search history",
      "zh": "反向搜索历史命令",
      "id": "4f93d094ee495dfa",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+R）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+V / Cmd+V / Alt+V",
      "en": "Paste image from clipboard",
      "zh": "从剪贴板粘贴图片，插入一个 [Image #N] 标记",
      "id": "dfbeb66782ad6a26",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+V / Cmd+V / Alt+V）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+B",
      "en": "Background running tasks",
      "zh": "把正在运行的命令/代理移到后台（tmux 用户需按两次）",
      "id": "69fa830f89078375",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+B）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+T",
      "en": "Toggle task list",
      "zh": "显示或隐藏终端状态区的任务列表",
      "id": "ffe62543c453561f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+T）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc",
      "en": "Interrupt Claude",
      "zh": "中断当前回复或工具调用，方便你改变方向（已完成的工作会保留）",
      "id": "aeaa62a11f0c5d43",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Esc）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc Esc",
      "en": "Clear draft / rewind",
      "zh": "输入框有内容时清空草稿（存入历史可用上箭头召回）；输入框为空时打开倒回菜单恢复到之前的状态",
      "id": "29144bf122f27f47",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Esc Esc）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Shift+Tab",
      "en": "Cycle permission modes",
      "zh": "循环切换权限模式：default → acceptEdits → plan → 其他已启用模式",
      "id": "35cf4ca8e279ba3d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Shift+Tab）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Option+P (Mac) / Alt+P",
      "en": "Switch model",
      "zh": "切换模型，不会清空当前输入内容",
      "id": "0d266870b09df1c4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Option+P (Mac) / Alt+P）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Option+T (Mac) / Alt+T",
      "en": "Toggle extended thinking",
      "zh": "开关扩展思考模式",
      "id": "725c9cf7bb294223",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Option+T (Mac) / Alt+T）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Option+O (Mac) / Alt+O",
      "en": "Toggle fast mode",
      "zh": "开关快速模式",
      "id": "01e30a6d954bdf2d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Option+O (Mac) / Alt+O）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Up/Down 或 Ctrl+P/Ctrl+N",
      "en": "Navigate history",
      "zh": "移动光标或在命令历史中导航（多行输入时先移动光标，到顶/底后再导航历史）",
      "id": "1786f344c4c6b7df",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Up/Down 或 Ctrl+P/Ctrl+N）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+A",
      "en": "Move to line start",
      "zh": "光标移到当前行开头",
      "id": "6e3243e8918eaa54",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+A）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+E",
      "en": "Move to line end",
      "zh": "光标移到当前行末尾",
      "id": "3bf45d6f595487c5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+E）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+K",
      "en": "Delete to end of line",
      "zh": "删除到行末（删除内容可粘贴）",
      "id": "2748f54eb401b8b4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+K）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+U",
      "en": "Delete to line start",
      "zh": "删除到行首（删除内容可粘贴）",
      "id": "6708aef43eec038f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+U）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+W",
      "en": "Delete previous word",
      "zh": "删除前一个单词",
      "id": "0f12ea447b98443e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+W）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Y",
      "en": "Paste deleted text",
      "zh": "粘贴之前用 Ctrl+K/U/W 删除的文本",
      "id": "6ade6da455dfb221",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+Y）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Alt+Y（粘贴后）",
      "en": "Cycle paste history",
      "zh": "粘贴后循环切换历史删除内容",
      "id": "2db9e59ba744575a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Alt+Y（粘贴后））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Alt+B / Alt+F",
      "en": "Move by word",
      "zh": "按单词左右移动光标",
      "id": "c2a3ef574b20bc28",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Alt+B / Alt+F）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "\\ + Enter",
      "en": "Newline (works everywhere)",
      "zh": "换行不发送，所有终端都支持",
      "id": "ab90710b3295d82c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 \\ + Enter）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+J",
      "en": "Newline (universal)",
      "zh": "换行不发送，任何终端无需配置",
      "id": "cc748a2b66f1f8b0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Ctrl+J）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Shift+Enter",
      "en": "Newline (most terminals)",
      "zh": "换行不发送，多数终端原生支持，VS Code 等需运行 /terminal-setup",
      "id": "35f2f25582a343e0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 Shift+Enter）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "/（行首）",
      "en": "Command or skill",
      "zh": "触发命令或技能菜单",
      "id": "6a7b9b72090ef4e8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 /（行首））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "!（行首）",
      "en": "Shell mode",
      "zh": "直接执行 shell 命令，并把输出加入对话上下文",
      "id": "d7127ca559ac589f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 !（行首））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "@",
      "en": "File path mention",
      "zh": "触发文件路径自动补全",
      "id": "ee02827aa6e13540",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 @）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "?（transcript内）",
      "en": "Toggle shortcut help",
      "zh": "切换快捷键帮助面板（需全屏渲染模式）",
      "id": "9a0a17e8ed55d172",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 ?（transcript内））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "{ / }（transcript内）",
      "en": "Jump between prompts",
      "zh": "跳转到上/下一条用户提问",
      "id": "04c141a13f02bfcf",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 { / }（transcript内））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "q / Ctrl+C / Esc",
      "en": "Exit transcript view",
      "zh": "退出 transcript 详情视图",
      "id": "c3c8751a6332da5c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 q / Ctrl+C / Esc）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/init",
      "en": "Generate starter CLAUDE.md",
      "zh": "生成项目说明文件 CLAUDE.md 初稿",
      "id": "b4368fb4bea77e35",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /init）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-memory",
      "cat": "slash",
      "cmd": "/memory",
      "en": "Edit CLAUDE.md",
      "zh": "编辑 CLAUDE.md 记忆文件，管理自动记忆条目",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /memory）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-mcp",
      "cat": "slash",
      "cmd": "/mcp",
      "en": "Manage MCP servers",
      "zh": "管理 MCP 服务连接和 OAuth 认证",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /mcp）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-agents",
      "cat": "slash",
      "cmd": "/agents",
      "en": "Manage subagents",
      "zh": "管理子代理配置",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /agents）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/permissions",
      "en": "Manage tool permissions",
      "zh": "管理工具的允许/询问/拒绝规则",
      "id": "ba1da527cfe5b31b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /permissions）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/plan [描述]",
      "en": "Enter plan mode",
      "zh": "直接进入计划模式，可附带任务描述",
      "id": "400dab7510bea568",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /plan [描述]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/model [模型]",
      "en": "Switch model",
      "zh": "切换 AI 模型并设为默认；支持方向键调整推理强度",
      "id": "1949f76d956983bb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /model [模型]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/effort [级别|auto]",
      "en": "Set reasoning effort",
      "zh": "设置推理强度：low/medium/high/xhigh/max/ultracode",
      "id": "756bfa047d64719e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /effort [级别|auto]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/context [all]",
      "en": "Visualize context usage",
      "zh": "用色块图显示上下文占用情况和优化建议",
      "id": "c2a72afc10dc3897",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /context [all]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/compact [指令]",
      "en": "Summarize to free context",
      "zh": "总结对话以释放上下文空间，可附带聚焦指令",
      "id": "776b9cb01c53263d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /compact [指令]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/btw <问题>",
      "en": "Quick side question",
      "zh": "快速侧问，不计入对话历史，不打断主线任务",
      "id": "889bde562046ee89",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /btw <问题>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/tasks",
      "en": "View background tasks",
      "zh": "查看和管理所有后台运行的任务（别名 /bashes）",
      "id": "b4b4f087262d7cfb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /tasks）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/background [提示]",
      "en": "Detach as background agent",
      "zh": "把当前会话转为后台代理运行，释放终端",
      "id": "2ca7a9474f75c2fd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /background [提示]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/batch <指令>",
      "en": "Parallel multi-unit changes",
      "zh": "把大改动拆解成多个独立单元，各开 worktree 并行处理",
      "id": "cd24292cd9e058eb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /batch <指令>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-diff",
      "cat": "slash",
      "cmd": "/diff",
      "en": "Interactive diff viewer",
      "zh": "交互式查看未提交改动和每轮对话产生的 diff",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /diff）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-code-review",
      "cat": "slash",
      "cmd": "/code-review [级别] [--fix]",
      "en": "Review diff for bugs",
      "zh": "审查当前 diff 的正确性问题，--fix 可直接应用修复",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /code-review [级别] [--fix]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/review [PR]",
      "en": "Review a pull request",
      "zh": "本地审查指定的 PR",
      "id": "9b8c8d522860e2f2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /review [PR]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/security-review",
      "en": "Security vulnerability scan",
      "zh": "分析当前分支改动的安全漏洞（注入、鉴权、数据泄露等）",
      "id": "8b94886fd52cc331",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /security-review）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/clear [名称]",
      "en": "Start fresh conversation",
      "zh": "开启新对话，清空上下文（保留项目记忆）；别名 /reset /new",
      "id": "edf7046c0cc9e85b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /clear [名称]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/resume [会话]",
      "en": "Resume a conversation",
      "zh": "按 ID 或名称恢复某次对话，或打开选择器；别名 /continue",
      "id": "f99f88519066cc37",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /resume [会话]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/branch [名称]",
      "en": "Branch the conversation",
      "zh": "在当前节点创建对话分支，可独立尝试不同方向",
      "id": "66e267eff4163728",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /branch [名称]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/fork <指令>",
      "en": "Spawn forked subagent",
      "zh": "派生一个继承完整对话的后台子代理去处理指定任务",
      "id": "cbf6062661fed939",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /fork <指令>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-rewind",
      "cat": "slash",
      "cmd": "/rewind",
      "en": "Rewind code/conversation",
      "zh": "将代码和对话回退到之前的检查点；别名 /checkpoint /undo",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /rewind）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/doctor",
      "en": "Diagnose installation",
      "zh": "诊断 Claude Code 安装和设置问题",
      "id": "bac09e656e874594",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /doctor）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/debug [描述]",
      "en": "Enable debug logging",
      "zh": "开启调试日志并排查问题",
      "id": "edb31051868b9e34",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /debug [描述]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/feedback [报告]",
      "en": "Submit feedback / report bug",
      "zh": "提交反馈或漏洞报告；别名 /bug /share",
      "id": "911b7593a5fccb3c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /feedback [报告]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-cost",
      "cat": "slash",
      "cmd": "/cost",
      "en": "Show usage/cost",
      "zh": "查看会话花费和用量；/usage 的别名",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /cost）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-status",
      "cat": "slash",
      "cmd": "/status",
      "en": "Show version/model/account",
      "zh": "显示版本、模型、账号和连接状态",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /status）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-config",
      "cat": "slash",
      "cmd": "/config [key=value]",
      "en": "Open settings UI",
      "zh": "打开设置界面调整主题、模型等；也可直接传参设置；别名 /settings",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /config [key=value]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/theme",
      "en": "Change color theme",
      "zh": "切换配色主题（含自动跟随终端、色盲友好主题）",
      "id": "2464d0497c800985",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /theme）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/keybindings",
      "en": "Open keybindings file",
      "zh": "打开按键绑定自定义文件",
      "id": "f3a25ea84f2f4398",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /keybindings）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/copy [N]",
      "en": "Copy last response",
      "zh": "复制最近一条（或倒数第N条）回复到剪贴板",
      "id": "91f0f90761f1e4c3",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /copy [N]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/export [文件名]",
      "en": "Export conversation as text",
      "zh": "把当前对话导出为纯文本文件",
      "id": "9f2286d3ef48cb21",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /export [文件名]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/skills",
      "en": "List available skills",
      "zh": "列出可用技能，按 t 可按 token 量排序",
      "id": "f46edbeeaf4ef025",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /skills）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/hooks",
      "en": "View hook configurations",
      "zh": "查看工具事件的 hook 配置",
      "id": "75507d338884a169",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /hooks）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/ide",
      "en": "Manage IDE integration",
      "zh": "管理 IDE 集成状态",
      "id": "91c6398439622d6c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /ide）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "claude-add-dir",
      "cat": "slash",
      "cmd": "/add-dir <路径>",
      "en": "Add working directory",
      "zh": "为当前会话添加额外可访问的工作目录",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /add-dir <路径>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/cd <路径>",
      "en": "Move session to new dir",
      "zh": "把当前会话切换到新的工作目录",
      "id": "0e32040631518a0b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /cd <路径>）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/fast [on|off]",
      "en": "Toggle fast mode",
      "zh": "为支持的 Opus 模型切换低延迟响应；速度更快但 token 单价更高，能力与质量不变",
      "id": "7e160c1c19714033",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /fast [on|off]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/goal [条件|clear]",
      "en": "Set a persistent goal",
      "zh": "设定一个跨多轮持续追踪的目标，直到条件满足",
      "id": "c1f1bc2fdc781f4b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /goal [条件|clear]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/teleport",
      "en": "Pull web session to terminal",
      "zh": "把网页端 Claude Code 会话拉取到本地终端继续",
      "id": "608323119ca7d4de",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /teleport）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/remote-control",
      "en": "Enable remote control",
      "zh": "让本地会话可被 claude.ai 远程控制；别名 /rc",
      "id": "76b7f3578fab1ece",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /remote-control）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/desktop",
      "en": "Continue in Desktop app",
      "zh": "在 Claude Code 桌面应用中继续当前会话；别名 /app",
      "id": "128e9a3b0b554820",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /desktop）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/help",
      "en": "Show help",
      "zh": "显示帮助和可用命令列表",
      "id": "9c49bd9d3d899a20",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /help）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/exit",
      "en": "Exit the CLI",
      "zh": "退出命令行；别名 /quit",
      "id": "a1b67363fbc36911",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/commands（页面内检索 /exit）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "i / a / I / A（Vim模式）",
      "en": "Insert variants",
      "zh": "Vim模式：分别在光标前/后/行首/行尾进入插入模式",
      "id": "c4de7dc8d9808843",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 i / a / I / A（Vim模式））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "dd / yy / p（Vim模式）",
      "en": "Delete/yank/paste line",
      "zh": "Vim模式：删除/复制/粘贴整行",
      "id": "2879bb29a3c61f8c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 dd / yy / p（Vim模式））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "/（Vim NORMAL模式）",
      "en": "History search",
      "zh": "Vim普通模式下 / 等价于 Ctrl+R 历史搜索",
      "id": "d9508cd1ce96e2cd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "claude-interactive",
          "claims": [
            "existence"
          ],
          "locator": "https://code.claude.com/docs/en/interactive-mode（页面内检索 /（Vim NORMAL模式））",
          "checkedAt": "2026-06-21"
        }
      ]
    }
  ]
};
