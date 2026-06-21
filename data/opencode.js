// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["opencode"] = {
  "meta": {
    "id": "opencode",
    "name": "OpenCode",
    "color": "#e8445a",
    "source": "官方文档 opencode.ai/docs，整理于 2026-06",
    "sourceUrl": "https://opencode.ai/docs/",
    "updatedAt": "2026-06-20",
    "coverage": "官方 TUI、CLI 与快捷键文档",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "builtIn": true,
    "order": 5,
    "sources": [
      {
        "id": "opencode-tui",
        "title": "OpenCode TUI reference",
        "url": "https://opencode.ai/docs/tui/",
        "kind": "official-doc",
        "maintainer": "OpenCode",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://opencode.ai/docs/tui/",
        "pageTitle": "OpenCode TUI reference",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "opencode-keybinds",
        "title": "OpenCode keybinds",
        "url": "https://opencode.ai/docs/keybinds/",
        "kind": "official-doc",
        "maintainer": "OpenCode",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://opencode.ai/docs/keybinds/",
        "pageTitle": "OpenCode keybinds",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics"
        ]
      },
      {
        "id": "opencode-cli",
        "title": "OpenCode CLI reference",
        "url": "https://opencode.ai/docs/cli/",
        "kind": "official-doc",
        "maintainer": "OpenCode",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://opencode.ai/docs/cli/",
        "pageTitle": "OpenCode CLI reference",
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
      "cat": "shortcut",
      "cmd": "ctrl+x（Leader 键）",
      "en": "Leader key prefix",
      "zh": "大多数功能快捷键的前缀，可在 tui.json 中自定义",
      "id": "4ae90f4c7622f8d2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x（Leader 键））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+c / ctrl+d",
      "en": "Clear input or exit",
      "zh": "输入框有内容时清空；输入框为空时退出",
      "id": "1cf5e663a5b9e138",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+c / ctrl+d）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc",
      "en": "Interrupt running session",
      "zh": "中断当前正在运行的生成或会话",
      "id": "3ce7f1745c0843a6",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 Esc）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+p",
      "en": "Open command palette",
      "zh": "打开命令面板，快速搜索所有命令",
      "id": "b48c5de5bf07235a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+p）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x n",
      "en": "New session",
      "zh": "开启新会话（等同于 /new）",
      "id": "12a4e410f73f8bea",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x n）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x l",
      "en": "Session list",
      "zh": "列出所有历史会话并切换（等同于 /sessions）",
      "id": "149a349d8b8a8d85",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x l）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x c",
      "en": "Compact session",
      "zh": "压缩当前会话上下文以释放 token（等同于 /compact）",
      "id": "c0ccb4c8015fed18",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x c）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x u",
      "en": "Undo last message",
      "zh": "撤销最后一条消息并恢复相关文件变更（等同于 /undo，需 Git 仓库）",
      "id": "60c3a03dd38cea88",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x u）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x r",
      "en": "Redo undone message",
      "zh": "重做已撤销的消息（等同于 /redo，仅在 /undo 后可用）",
      "id": "bfe55466ec220729",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x r）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x g",
      "en": "Session timeline",
      "zh": "查看当前会话的时间线",
      "id": "9576eddbb24bc4c8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x g）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x x",
      "en": "Export session",
      "zh": "将当前会话导出为 Markdown 并用编辑器打开（等同于 /export）",
      "id": "c43d616c284fb2eb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x x）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+r",
      "en": "Rename session",
      "zh": "重命名当前会话",
      "id": "30c1c0bd1b21076b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+r）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x b",
      "en": "Toggle sidebar",
      "zh": "显示/隐藏侧边栏",
      "id": "b11547b2179f2237",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x b）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x s",
      "en": "Status view",
      "zh": "查看当前状态信息",
      "id": "3bbd17846f9e17af",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x s）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x h",
      "en": "Toggle conceal",
      "zh": "切换隐藏/显示消息中的敏感内容",
      "id": "e123d0e6044f45e8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x h）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x y",
      "en": "Copy messages",
      "zh": "复制当前消息内容",
      "id": "528baa79ac8e90db",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x y）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x e",
      "en": "Open external editor",
      "zh": "用系统 $EDITOR 打开编辑器撰写提示（等同于 /editor）",
      "id": "c30cdc8654e0bf90",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x e）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x q",
      "en": "Quit",
      "zh": "退出 OpenCode（等同于 /exit）",
      "id": "d68be154b8b284d8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x q）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x m",
      "en": "Model list",
      "zh": "列出可用模型并切换（等同于 /models）",
      "id": "6a6532f136e629ad",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x m）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+a（非输入框内）",
      "en": "Open provider list",
      "zh": "打开模型提供商列表（在输入框内此键为跳到行首）",
      "id": "51b197f293977a2c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+a（非输入框内））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "f2",
      "en": "Cycle recent models",
      "zh": "在最近使用的模型间循环切换",
      "id": "e90d85b11b97b5ba",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 f2）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "shift+f2",
      "en": "Cycle recent models (reverse)",
      "zh": "反向循环切换最近使用的模型",
      "id": "c0071b71065471bf",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 shift+f2）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+t",
      "en": "Cycle model variant",
      "zh": "在模型推理强度变体（reasoning effort）间循环切换",
      "id": "d19c4f8ac88d7038",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+t）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x a",
      "en": "Agent list",
      "zh": "列出可用 Agent 并切换",
      "id": "316c86edb0531b7e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x a）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Tab",
      "en": "Next agent",
      "zh": "切换到下一个 Agent",
      "id": "5824436a4a802acf",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 Tab）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Shift+Tab",
      "en": "Previous agent",
      "zh": "切换到上一个 Agent",
      "id": "240ab4d319d4d386",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 Shift+Tab）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+x t",
      "en": "Theme list",
      "zh": "列出主题并切换（等同于 /themes）",
      "id": "f553fb05831b941d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+x t）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "PageUp / ctrl+alt+b",
      "en": "Scroll messages up (page)",
      "zh": "消息列表向上翻一页",
      "id": "ada69cc7d119ba3f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 PageUp / ctrl+alt+b）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "PageDown / ctrl+alt+f",
      "en": "Scroll messages down (page)",
      "zh": "消息列表向下翻一页",
      "id": "8368d8122aea4328",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 PageDown / ctrl+alt+f）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+alt+u",
      "en": "Scroll messages up (half page)",
      "zh": "消息列表向上翻半页",
      "id": "9970a4e4dacac8f6",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+alt+u）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+alt+d",
      "en": "Scroll messages down (half page)",
      "zh": "消息列表向下翻半页",
      "id": "854f62d25b01906c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+alt+d）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+alt+y / ctrl+alt+e",
      "en": "Scroll messages one line",
      "zh": "消息列表逐行向上（y）/向下（e）滚动",
      "id": "0aa66f92f5641959",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+alt+y / ctrl+alt+e）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+g / Home",
      "en": "Jump to first message",
      "zh": "跳转到第一条消息",
      "id": "b8c4a5041e15875c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+g / Home）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+alt+g / End",
      "en": "Jump to last message",
      "zh": "跳转到最后一条消息",
      "id": "c57aa1a07e472e3d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+alt+g / End）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Shift+Enter / ctrl+j",
      "en": "Newline (don't submit)",
      "zh": "换行不发送（ctrl+j 在任何终端均可用）",
      "id": "e90369e66a429479",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 Shift+Enter / ctrl+j）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+v",
      "en": "Paste",
      "zh": "粘贴剪贴板内容到输入框",
      "id": "aea5581255a15c9d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+v）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+a（输入框内）",
      "en": "Move to line start",
      "zh": "光标跳到当前行行首（全局视图中此键为打开提供商列表）",
      "id": "ec3cf3ccde292ee5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+a（输入框内））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+e",
      "en": "Move to line end",
      "zh": "光标跳到当前行行尾",
      "id": "eae0b746fe181c1b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+e）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+k",
      "en": "Delete to line end",
      "zh": "删除从光标到行尾的内容",
      "id": "ad84fb7eebfc097e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+k）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+u",
      "en": "Delete to line start",
      "zh": "删除从光标到行首的内容",
      "id": "260ed6e5f69a07c0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+u）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "ctrl+w / ctrl+backspace",
      "en": "Delete word backward",
      "zh": "向前删除一个单词",
      "id": "c5b2a74d9f1744fb",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 ctrl+w / ctrl+backspace）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "alt+d",
      "en": "Delete word forward",
      "zh": "向后删除一个单词",
      "id": "904d53ab364dd01c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 alt+d）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "alt+f / alt+right",
      "en": "Move word forward",
      "zh": "光标向后移动一个单词",
      "id": "424d55e61844bb85",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 alt+f / alt+right）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "alt+b / alt+left",
      "en": "Move word backward",
      "zh": "光标向前移动一个单词",
      "id": "b6298a35156af81e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 alt+b / alt+left）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "@（输入中）",
      "en": "File reference",
      "zh": "模糊搜索并引用文件，文件内容自动加入上下文",
      "id": "35fa9b77ba8ea7de",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 @（输入中））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "!（输入中）",
      "en": "Run shell command",
      "zh": "执行 shell 命令并将输出加入对话",
      "id": "48ac353b2925174e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 !（输入中））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "/（输入中）",
      "en": "Slash command",
      "zh": "触发斜杠命令补全菜单",
      "id": "09cf47eae714ccbe",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-keybinds",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/keybinds/（页面内检索 /（输入中））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/new",
      "en": "Start new session",
      "zh": "开启新会话（别名 /clear）",
      "id": "bbdef6839d8b634d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /new）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/sessions",
      "en": "List and switch sessions",
      "zh": "列出所有历史会话并切换（别名 /resume /continue）",
      "id": "b73891070fc3e862",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /sessions）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/undo",
      "en": "Undo last message",
      "zh": "撤销最后一条消息并恢复相关文件变更（需要 Git 仓库）",
      "id": "8dc0a4a63ab72090",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /undo）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/redo",
      "en": "Redo undone message",
      "zh": "重做已撤销的消息（仅在 /undo 后可用）",
      "id": "fbea0378820e6074",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /redo）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/compact",
      "en": "Compact session context",
      "zh": "压缩当前会话上下文释放 token（别名 /summarize）",
      "id": "24c6e93d5df8e6b7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /compact）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-init",
      "cat": "slash",
      "cmd": "/init",
      "en": "Create/update AGENTS.md",
      "zh": "引导创建或更新项目的 AGENTS.md 文件",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /init）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/models",
      "en": "List available models",
      "zh": "列出所有已配置提供商的可用模型",
      "id": "d83a296afac5d1b6",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /models）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/themes",
      "en": "List and switch themes",
      "zh": "列出可用主题并切换",
      "id": "2bbb164a243972bd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /themes）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-share",
      "cat": "slash",
      "cmd": "/share",
      "en": "Share current session",
      "zh": "生成可分享的会话链接",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /share）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/unshare",
      "en": "Unshare session",
      "zh": "取消分享当前会话",
      "id": "5425d925235752f1",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /unshare）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/export",
      "en": "Export session to Markdown",
      "zh": "将当前会话导出为 Markdown 文件并用编辑器打开",
      "id": "9058643e35106a3d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /export）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/editor",
      "en": "Open external editor",
      "zh": "用系统 $EDITOR 打开编辑器撰写提示",
      "id": "e981f3605f403a15",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /editor）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/connect",
      "en": "Add AI provider",
      "zh": "交互式添加 AI 提供商及其 API Key",
      "id": "77fd10ba6ecfb6b9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /connect）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/details",
      "en": "Toggle tool details",
      "zh": "切换显示/隐藏工具调用的详细信息",
      "id": "dc922bbfc655f6ca",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /details）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/thinking",
      "en": "Toggle thinking display",
      "zh": "切换是否显示模型的 thinking/reasoning 内容（不影响能力开关）",
      "id": "35a01e183621e300",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /thinking）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-help",
      "cat": "slash",
      "cmd": "/help",
      "en": "Show help dialog",
      "zh": "显示帮助对话框",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /help）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/exit",
      "en": "Exit OpenCode",
      "zh": "退出 OpenCode（别名 /quit /q）",
      "id": "cc7417b4d1de54a0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-tui",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/tui/（页面内检索 /exit）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-launch",
      "cat": "flag",
      "cmd": "opencode",
      "en": "Start TUI in current directory",
      "zh": "在当前目录启动交互式终端界面",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode [path]",
      "en": "Start TUI in specific directory",
      "zh": "在指定目录启动 TUI",
      "id": "d000d10fcf9cc7cc",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode [path]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode run \"[prompt]\"",
      "en": "Non-interactive one-shot run",
      "zh": "非交互式执行一次性提示，适合脚本自动化",
      "id": "c957bff9c4115d34",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run \"[prompt]\"）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode run -m [provider/model]",
      "en": "Run with specific model",
      "zh": "指定模型运行（如 -m anthropic/claude-opus-4-8）",
      "id": "89592c78df3af08a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run -m [provider/model]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-run-continue",
      "cat": "flag",
      "cmd": "opencode run -c",
      "en": "Continue last session",
      "zh": "在非交互模式下继续上次会话（--continue）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run -c）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode run -s [sessionID]",
      "en": "Continue specific session",
      "zh": "在非交互模式下继续指定会话（--session）",
      "id": "d8518800b9f81a08",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run -s [sessionID]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode run --attach [url]",
      "en": "Attach to running server",
      "zh": "连接到已运行的 opencode serve 实例执行命令（复用 MCP 冷启动）",
      "id": "b9424d536569adf0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run --attach [url]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode run --share",
      "en": "Auto-share session",
      "zh": "运行结束后自动生成分享链接",
      "id": "4e9a8eb2ba69a01a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run --share）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode run -f [file]",
      "en": "Attach file to message",
      "zh": "将文件内容附加到提示消息（--file，可多次使用）",
      "id": "7e5c15fbeb6c176c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode run -f [file]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-serve",
      "cat": "flag",
      "cmd": "opencode serve",
      "en": "Start headless API server",
      "zh": "启动无界面 HTTP API 服务器，供外部程序调用",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode serve）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode web",
      "en": "Start server with web UI",
      "zh": "启动带 Web 界面的服务器并打开浏览器",
      "id": "22544590baef21ee",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode web）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode attach [url]",
      "en": "Attach TUI to remote server",
      "zh": "将本地 TUI 连接到远程 opencode serve 服务器",
      "id": "cd0f67ecb51d6a82",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode attach [url]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-models",
      "cat": "flag",
      "cmd": "opencode models",
      "en": "List all models",
      "zh": "列出所有已配置提供商的可用模型",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode models）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode models --refresh",
      "en": "Refresh models cache",
      "zh": "从 models.dev 刷新模型列表缓存",
      "id": "1f59ee906d561a3e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode models --refresh）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-auth-login",
      "cat": "flag",
      "cmd": "opencode auth login",
      "en": "Add provider credentials",
      "zh": "交互式添加 AI 提供商的 API Key",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode auth login）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode auth list",
      "en": "List authenticated providers",
      "zh": "列出所有已认证的提供商（别名 auth ls）",
      "id": "69e16f9aacfd4706",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode auth list）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode auth logout",
      "en": "Remove provider credentials",
      "zh": "删除指定提供商的认证信息",
      "id": "05c32b6f272d7b3d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode auth logout）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode mcp add",
      "en": "Add MCP server",
      "zh": "交互式添加 MCP 服务器配置",
      "id": "a1bbed9e74a38434",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode mcp add）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode mcp list",
      "en": "List MCP servers",
      "zh": "列出所有已配置的 MCP 服务器及其连接状态",
      "id": "0198328773f89045",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode mcp list）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode mcp auth [name]",
      "en": "Authenticate OAuth MCP server",
      "zh": "对支持 OAuth 的 MCP 服务器进行认证",
      "id": "b68e3c4144d1eba3",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode mcp auth [name]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode agent create",
      "en": "Create custom agent",
      "zh": "交互式创建自定义 Agent（配置权限和系统提示）",
      "id": "edabfbe5b533ccdc",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode agent create）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode agent list",
      "en": "List agents",
      "zh": "列出所有可用 Agent",
      "id": "8e1418caaf29be2c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode agent list）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-session-list",
      "cat": "flag",
      "cmd": "opencode session list",
      "en": "List all sessions",
      "zh": "列出所有历史会话",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode session list）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode session delete [id]",
      "en": "Delete a session",
      "zh": "删除指定会话",
      "id": "1c77eb33485764a2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode session delete [id]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode stats",
      "en": "Show usage statistics",
      "zh": "查看 token 用量和费用统计，支持按项目/模型/天数筛选",
      "id": "55c9c7ac7c30244e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode stats）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode export [sessionID]",
      "en": "Export session as JSON",
      "zh": "将会话数据导出为 JSON 文件",
      "id": "0122dc14b3c6ef7b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode export [sessionID]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode import [file/url]",
      "en": "Import session",
      "zh": "从本地 JSON 文件或分享链接导入会话",
      "id": "3f7b5fafb6b2601f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode import [file/url]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode plugin [module]",
      "en": "Install plugin",
      "zh": "安装插件并更新配置（别名 opencode plug）",
      "id": "ee4a4602d1d60c6e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode plugin [module]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode pr [number]",
      "en": "Checkout PR and run",
      "zh": "拉取并切换到指定 GitHub PR 分支，然后启动 OpenCode",
      "id": "115631255cba62f1",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode pr [number]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode upgrade",
      "en": "Upgrade to latest version",
      "zh": "升级 OpenCode 到最新版本",
      "id": "e0023039871b27d4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode upgrade）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "opencode uninstall",
      "en": "Uninstall OpenCode",
      "zh": "卸载 OpenCode 并移除相关文件（支持 --keep-config 等选项）",
      "id": "f962cc14534033e4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 opencode uninstall）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--version / -v",
      "en": "Print version number",
      "zh": "显示当前版本号",
      "id": "20d4f5b665fa9c5d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --version / -v）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--help / -h",
      "en": "Show help",
      "zh": "显示帮助信息",
      "id": "c68ed0c19e1ce42b",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --help / -h）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "opencode-model-flag",
      "cat": "flag",
      "cmd": "--model / -m [provider/model]",
      "en": "Specify model",
      "zh": "启动时指定使用的模型（格式：provider/model）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --model / -m [provider/model]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--agent [name]",
      "en": "Specify agent",
      "zh": "启动时指定要使用的 Agent",
      "id": "678e1b7014b20f8c",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --agent [name]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--pure",
      "en": "Run without external plugins",
      "zh": "禁用所有外部插件启动",
      "id": "77588b5db85f14dd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --pure）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--log-level [level]",
      "en": "Set log level",
      "zh": "设置日志级别（DEBUG / INFO / WARN / ERROR）",
      "id": "0be92f81d91506a5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --log-level [level]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "--print-logs",
      "en": "Print logs to stderr",
      "zh": "将日志输出到 stderr，便于调试",
      "id": "d5dccdad95e507a2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "opencode-cli",
          "claims": [
            "existence"
          ],
          "locator": "https://opencode.ai/docs/cli/（页面内检索 --print-logs）",
          "checkedAt": "2026-06-21"
        }
      ]
    }
  ]
};
