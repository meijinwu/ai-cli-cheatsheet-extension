// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["cursor"] = {
  "meta": {
    "id": "cursor",
    "name": "Cursor",
    "color": "#8B5CF6",
    "source": "官方文档 docs.cursor.com/ide/reference/keyboard-shortcuts，整理于 2026-06（⚠️ 仅收录 macOS 默认键位 Cursor AI 功能常用子集；文档站为客户端渲染，快捷键基于产品行为与训练数据核对）",
    "builtIn": false,
    "sourceUrl": "https://docs.cursor.com/ide/reference/keyboard-shortcuts",
    "updatedAt": "2026-06-20",
    "contentCheckedAt": "2026-06-20",
    "sourceCheckedAt": "2026-06-21",
    "updatePolicy": "manual-only",
    "coverage": "macOS 默认键位 Cursor AI 功能常用子集，Windows/Linux 差异见条目 platformCmds",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "order": 8,
    "sources": [
      {
        "id": "cursor-shortcuts",
        "title": "Cursor Docs",
        "url": "https://cursor.com/docs",
        "kind": "official-doc",
        "maintainer": "Cursor",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://cursor.com/docs",
        "pageTitle": "Cursor Docs",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics"
        ]
      }
    ]
  },
  "items": [
    {
      "cat": "shortcut",
      "cmd": "Cmd+I",
      "en": "Open Composer / Agent",
      "zh": "打开 Composer（Agent 模式），可让 AI 直接编写和修改代码（Win/Linux 为 Ctrl+I）",
      "platformCmds": {
        "mac": "Cmd+I",
        "windows": "Ctrl+I",
        "linux": "Ctrl+I"
      },
      "id": "8ff2cda22ea7f208",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+I）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+L",
      "en": "Open AI Chat",
      "zh": "打开 AI 对话面板（Win/Linux 为 Ctrl+L）",
      "platformCmds": {
        "mac": "Cmd+L",
        "windows": "Ctrl+L",
        "linux": "Ctrl+L"
      },
      "id": "8a3401e170d3a97e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+L）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+K",
      "en": "Open Inline AI Edit",
      "zh": "在编辑器中打开行内 AI 编辑栏，输入指令让 AI 修改选中代码（Win/Linux 为 Ctrl+K）",
      "context": "编辑器",
      "platformCmds": {
        "mac": "Cmd+K",
        "windows": "Ctrl+K",
        "linux": "Ctrl+K"
      },
      "id": "ac8177dbfb88fc54",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+K）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+K",
      "en": "Open Terminal AI Command",
      "zh": "在终端中打开 AI 命令输入栏，用自然语言生成终端命令（Win/Linux 为 Ctrl+K）",
      "context": "终端",
      "platformCmds": {
        "mac": "Cmd+K",
        "windows": "Ctrl+K",
        "linux": "Ctrl+K"
      },
      "id": "5743ebc7c497754a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+K）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+L",
      "en": "Add Selection to Chat",
      "zh": "将当前选中代码添加到 AI Chat 上下文中（Win/Linux 为 Ctrl+Shift+L）",
      "platformCmds": {
        "mac": "Cmd+Shift+L",
        "windows": "Ctrl+Shift+L",
        "linux": "Ctrl+Shift+L"
      },
      "id": "e86466bd23691cc8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Shift+L）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+I",
      "en": "Open Agent with Full Context",
      "zh": "以当前文件完整上下文打开 Agent（Win/Linux 为 Ctrl+Shift+I）",
      "platformCmds": {
        "mac": "Cmd+Shift+I",
        "windows": "Ctrl+Shift+I",
        "linux": "Ctrl+Shift+I"
      },
      "id": "dd119793e31485e8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Shift+I）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Enter",
      "en": "Submit with Codebase Search",
      "zh": "提交消息并搜索整个代码库作为上下文（Win/Linux 为 Ctrl+Enter）",
      "context": "Chat/Composer",
      "platformCmds": {
        "mac": "Cmd+Enter",
        "windows": "Ctrl+Enter",
        "linux": "Ctrl+Enter"
      },
      "id": "023a6020a0d0428b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Enter）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+Enter",
      "en": "Submit Without Codebase Search",
      "zh": "提交消息但不搜索代码库，仅使用当前上下文（Win/Linux 为 Ctrl+Shift+Enter）",
      "context": "Chat/Composer",
      "platformCmds": {
        "mac": "Cmd+Shift+Enter",
        "windows": "Ctrl+Shift+Enter",
        "linux": "Ctrl+Shift+Enter"
      },
      "id": "c656c0150f68fc84",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Shift+Enter）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Backspace",
      "en": "Cancel AI Response",
      "zh": "取消当前正在生成的 AI 回复（Win/Linux 为 Ctrl+Backspace）",
      "context": "Chat/Composer",
      "platformCmds": {
        "mac": "Cmd+Backspace",
        "windows": "Ctrl+Backspace",
        "linux": "Ctrl+Backspace"
      },
      "id": "35a1467c6b6e5316",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Backspace）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+J",
      "en": "Open Cursor Settings",
      "zh": "打开 Cursor 设置面板（Win/Linux 为 Ctrl+Shift+J）",
      "platformCmds": {
        "mac": "Cmd+Shift+J",
        "windows": "Ctrl+Shift+J",
        "linux": "Ctrl+Shift+J"
      },
      "id": "7fc91ce6772943c0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Shift+J）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Tab",
      "en": "Accept Cursor Tab Suggestion",
      "zh": "接受 Cursor Tab 的整行/整块代码补全建议（所有平台相同）",
      "context": "Cursor Tab",
      "id": "269732e21e794743",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Tab）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc",
      "en": "Dismiss Cursor Tab Suggestion",
      "zh": "拒绝/关闭 Cursor Tab 的代码补全建议（所有平台相同）",
      "context": "Cursor Tab",
      "id": "c0919cfab1bb3bc7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Esc）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Right",
      "en": "Accept Next Word",
      "zh": "逐词接受 Cursor Tab 代码建议的下一个词（Win/Linux 为 Ctrl+右箭头）",
      "context": "Cursor Tab",
      "platformCmds": {
        "mac": "Cmd+Right",
        "windows": "Ctrl+Right",
        "linux": "Ctrl+Right"
      },
      "id": "be08a175582dd384",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Right）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Option+Backspace",
      "en": "Reject Word by Word",
      "zh": "逐词拒绝 Cursor Tab 代码建议（Win/Linux 为 Ctrl+Backspace）",
      "context": "Cursor Tab",
      "platformCmds": {
        "mac": "Option+Backspace",
        "windows": "Ctrl+Backspace",
        "linux": "Ctrl+Backspace"
      },
      "id": "07f6c79962bea87f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Option+Backspace）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+P",
      "en": "Show Command Palette",
      "zh": "打开命令面板（Win/Linux 为 Ctrl+Shift+P）",
      "platformCmds": {
        "mac": "Cmd+Shift+P",
        "windows": "Ctrl+Shift+P",
        "linux": "Ctrl+Shift+P"
      },
      "id": "7970689048e3c5af",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+Shift+P）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+P",
      "en": "Quick File Open",
      "zh": "按名称快速打开文件（Win/Linux 为 Ctrl+P）",
      "platformCmds": {
        "mac": "Cmd+P",
        "windows": "Ctrl+P",
        "linux": "Ctrl+P"
      },
      "id": "b307c56b96c36a78",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+P）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+W",
      "en": "Close Current Tab",
      "zh": "关闭当前编辑器标签页（Win/Linux 为 Ctrl+W）",
      "platformCmds": {
        "mac": "Cmd+W",
        "windows": "Ctrl+W",
        "linux": "Ctrl+W"
      },
      "id": "593e75031ca8145a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+W）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+B",
      "en": "Toggle Sidebar",
      "zh": "切换侧边栏显示/隐藏（Win/Linux 为 Ctrl+B）",
      "platformCmds": {
        "mac": "Cmd+B",
        "windows": "Ctrl+B",
        "linux": "Ctrl+B"
      },
      "id": "54b8e968d8bc92e9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+B）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+J",
      "en": "Toggle Bottom Panel",
      "zh": "切换底部面板（终端/输出/问题）显示/隐藏（Win/Linux 为 Ctrl+J）",
      "platformCmds": {
        "mac": "Cmd+J",
        "windows": "Ctrl+J",
        "linux": "Ctrl+J"
      },
      "id": "6c2b6e114b811c5c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Cmd+J）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+`",
      "en": "Toggle Terminal",
      "zh": "切换集成终端显示/隐藏（所有平台相同，macOS 使用 Ctrl 而非 Cmd）",
      "platformCmds": {
        "mac": "Ctrl+`",
        "windows": "Ctrl+`",
        "linux": "Ctrl+`"
      },
      "id": "46ed23f3675ebc37",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 Ctrl+`）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Files",
      "en": "Reference files as context",
      "zh": "在 Chat/Composer 中引用指定文件作为 AI 上下文",
      "context": "Chat/Composer",
      "id": "89aacdb4b19fd234",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Files）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Folders",
      "en": "Reference folders as context",
      "zh": "在 Chat/Composer 中引用指定文件夹及其内容作为 AI 上下文",
      "context": "Chat/Composer",
      "id": "5b060591a6ed447e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Folders）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Web",
      "en": "Search the web for context",
      "zh": "在 Chat/Composer 中让 AI 搜索互联网获取最新信息作为上下文",
      "context": "Chat/Composer",
      "id": "8e57e4efabb7760d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Web）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Git",
      "en": "Reference git history and changes",
      "zh": "在 Chat/Composer 中引用 Git 提交历史和变更作为 AI 上下文",
      "context": "Chat/Composer",
      "id": "6b6156509180238d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Git）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Docs",
      "en": "Reference documentation sources",
      "zh": "在 Chat/Composer 中引用文档源（可添加第三方文档 URL）作为 AI 上下文",
      "context": "Chat/Composer",
      "id": "0d1aba561344300c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Docs）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Codebase",
      "en": "Search entire codebase for context",
      "zh": "在 Chat/Composer 中让 AI 搜索整个代码库作为上下文",
      "context": "Chat/Composer",
      "id": "9d8c54e3fec1f911",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Codebase）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Chat",
      "en": "Reference chat history",
      "zh": "在 Chat/Composer 中引用历史对话内容作为 AI 上下文",
      "context": "Chat/Composer",
      "id": "0e72e96e905147b4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Chat）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "@Definitions",
      "en": "Reference symbol definitions",
      "zh": "在 Chat/Composer 中引用代码符号（函数/类/类型）定义作为 AI 上下文",
      "context": "Chat/Composer",
      "id": "324e0b652fe86f1a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "cursor-shortcuts",
          "claims": [
            "existence"
          ],
          "locator": "官方快捷键页（页面内检索 @Definitions）",
          "checkedAt": "2026-06-21"
        }
      ]
    }
  ]
};
