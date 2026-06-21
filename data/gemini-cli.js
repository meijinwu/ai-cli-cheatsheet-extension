// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["gemini-cli"] = {
  "meta": {
    "id": "gemini-cli",
    "name": "Gemini CLI",
    "color": "#4c8bf5",
    "source": "官方文档 geminicli.com，整理于 2026-06（⚠️免费层即将被Antigravity CLI取代，详见官方公告）",
    "sourceUrl": "https://geminicli.com/docs/",
    "updatedAt": "2026-06-20",
    "contentCheckedAt": "2026-06-20",
    "sourceCheckedAt": "2026-06-21",
    "updatePolicy": "version-driven",
    "coverage": "官方交互快捷键与斜杠命令；产品状态可能变化",
    "platforms": [
      "mac",
      "windows",
      "linux"
    ],
    "builtIn": true,
    "order": 3,
    "sources": [
      {
        "id": "gemini-commands",
        "title": "Gemini CLI command reference",
        "url": "https://geminicli.com/docs/reference/commands/",
        "kind": "official-doc",
        "maintainer": "Google",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://geminicli.com/docs/reference/commands/",
        "pageTitle": "Gemini CLI command reference",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "gemini-keyboard",
        "title": "Gemini CLI keyboard shortcuts",
        "url": "https://geminicli.com/docs/reference/keyboard-shortcuts/",
        "kind": "official-doc",
        "maintainer": "Google",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://geminicli.com/docs/reference/keyboard-shortcuts/",
        "pageTitle": "Gemini CLI keyboard shortcuts",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics"
        ]
      }
    ],
    "references": [
      {
        "id": "gemini-cli-reference",
        "title": "Gemini CLI cheatsheet",
        "url": "https://geminicli.com/docs/cli/cli-reference/",
        "kind": "official-doc",
        "maintainer": "Google",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://geminicli.com/docs/cli/cli-reference/",
        "pageTitle": "Gemini CLI cheatsheet",
        "checkedAt": "2026-06-21",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ]
      },
      {
        "id": "google-gemini-cli-repository",
        "title": "Gemini CLI official repository",
        "url": "https://github.com/google-gemini/gemini-cli",
        "kind": "official-repository",
        "maintainer": "Google",
        "evidenceTier": "first-party",
        "lastVerifiedAt": "2026-06-21",
        "resolvedUrl": "https://github.com/google-gemini/gemini-cli",
        "pageTitle": "Gemini CLI official repository",
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
      "cmd": "Enter",
      "en": "Confirm / submit",
      "zh": "确认选择或发送消息",
      "id": "b7aa99d8561fa281",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Enter）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc / Ctrl+[",
      "en": "Cancel / dismiss",
      "zh": "取消对话框或当前焦点",
      "id": "bd74a8ad67251f0a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Esc / Ctrl+[）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+C",
      "en": "Cancel request / quit",
      "zh": "取消当前请求；输入框为空时退出CLI",
      "id": "6a1754753dca7cc7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+C）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+D",
      "en": "Exit when input empty",
      "zh": "输入框为空时退出CLI",
      "id": "88f0a2101976b196",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+D）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+A / Home",
      "en": "Move to line start",
      "zh": "光标移到行首",
      "id": "76c5d933eb02ccbf",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+A / Home）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+E / End",
      "en": "Move to line end",
      "zh": "光标移到行末",
      "id": "0fad22be6255bcff",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+E / End）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Left/Right / Alt+B/F",
      "en": "Move by word",
      "zh": "按单词左右移动光标",
      "id": "36aa3d242bac7ef4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+Left/Right / Alt+B/F）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+K",
      "en": "Delete to line end",
      "zh": "删除光标到行末",
      "id": "8195095967b515f2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+K）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+U",
      "en": "Delete to line start",
      "zh": "删除光标到行首",
      "id": "40022bd2383ac182",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+U）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+W / Alt+Backspace",
      "en": "Delete previous word",
      "zh": "删除前一个单词",
      "id": "862087e773ae931f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+W / Alt+Backspace）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Alt+D / Ctrl+Delete",
      "en": "Delete next word",
      "zh": "删除后一个单词",
      "id": "8c754651fcd2ef1a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Alt+D / Ctrl+Delete）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Z / Cmd+Z / Alt+Z",
      "en": "Undo",
      "zh": "撤销输入框内最近一次编辑",
      "id": "44cefd10df2319a6",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+Z / Cmd+Z / Alt+Z）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Shift+Z / Shift+Cmd+Z",
      "en": "Redo",
      "zh": "重做被撤销的编辑",
      "id": "e74b558f9b3d7565",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+Shift+Z / Shift+Cmd+Z）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Shift+Up/Down",
      "en": "Scroll content",
      "zh": "上下滚动内容",
      "id": "5f5ed37902a6c8d9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Shift+Up/Down）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Page Up/Down",
      "en": "Scroll by page",
      "zh": "按页滚动",
      "id": "26882f41aa7fbb65",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Page Up/Down）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+P / Ctrl+N",
      "en": "Previous/next history",
      "zh": "显示历史中的上一条/下一条",
      "id": "a517ec15440560d7",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+P / Ctrl+N）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+R",
      "en": "Reverse search history",
      "zh": "反向搜索历史记录",
      "id": "e99b73b7ac6ff088",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+R）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Tab（任务运行时）",
      "en": "Queue message",
      "zh": "把当前输入排队，等当前任务结束后处理",
      "id": "1e91a253957735c9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Tab（任务运行时））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Enter / Alt+Enter / Shift+Enter / Ctrl+J",
      "en": "Newline without submit",
      "zh": "换行不发送（多种按键组合都可以）",
      "id": "dfc9ebc77d4a9932",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+Enter / Alt+Enter / Shift+Enter / Ctrl+J）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+G / Ctrl+Shift+G",
      "en": "Open external editor",
      "zh": "在外部编辑器中打开当前提示词或计划",
      "id": "ce9118a01050c0db",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+G / Ctrl+Shift+G）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+V / Cmd+V / Alt+V",
      "en": "Paste from clipboard",
      "zh": "从剪贴板粘贴",
      "id": "c03e18aeab350c64",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+V / Cmd+V / Alt+V）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "\\ + Enter（行末）",
      "en": "Newline in single-line mode",
      "zh": "单行模式下换行而不退出该模式",
      "id": "99fe70ce25dc1962",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 \\ + Enter（行末））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "F12",
      "en": "Toggle debug console",
      "zh": "切换调试控制台，查看详细错误信息",
      "id": "4199917c377794ae",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 F12）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+T",
      "en": "Toggle full TODO list",
      "zh": "显示/隐藏完整任务清单",
      "id": "e229b3866277a7cc",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+T）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "F4",
      "en": "Show IDE context detail",
      "zh": "显示IDE上下文详情",
      "id": "acf50e83d03489b0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 F4）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Alt+M",
      "en": "Toggle Markdown rendering",
      "zh": "切换Markdown渲染显示",
      "id": "b91275747af82d0d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Alt+M）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+S",
      "en": "Toggle mouse mode",
      "zh": "切换鼠标模式（滚动和点击）",
      "id": "47cca6ed54cc0c56",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+S）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Y",
      "en": "Toggle YOLO mode",
      "zh": "切换YOLO模式（工具调用全自动批准）",
      "id": "79c4325b9959e098",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+Y）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Shift+Tab",
      "en": "Cycle approval modes",
      "zh": "循环切换审批模式：default → auto_edit → plan（只读）",
      "id": "b7044dad7c1e183a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Shift+Tab）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+O",
      "en": "Expand/collapse paste or output",
      "zh": "展开/折叠粘贴占位内容或长输出",
      "id": "9ba5882068e6b108",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+O）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+L",
      "en": "Clear screen and redraw",
      "zh": "清空终端屏幕并重绘UI",
      "id": "e7fbe5a1c5615ddc",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+L）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "R / Shift+R",
      "en": "Restart application",
      "zh": "重启应用",
      "id": "bf9dbfa7d20370d9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 R / Shift+R）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Z（应用层）",
      "en": "Suspend CLI to background",
      "zh": "挂起CLI并放到后台",
      "id": "e7e855e9e9a023d6",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+Z（应用层））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Space（按住）",
      "en": "Push-to-talk voice mode",
      "zh": "按住进行语音输入",
      "id": "baff9afa5c6f7bd3",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Space（按住））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "? （空提示符下）",
      "en": "Toggle shortcuts panel",
      "zh": "显示/隐藏快捷键速查面板",
      "id": "4506aa9886aa1602",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 ? （空提示符下））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Tab + Tab（输入中）",
      "en": "Toggle minimal/full UI",
      "zh": "在精简和完整UI细节间切换",
      "id": "20488a9bb1ae9123",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Tab + Tab（输入中））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Esc Esc（快速两次）",
      "en": "Clear input / rewind",
      "zh": "清空非空输入框；为空时浏览并回退历史交互",
      "id": "babe22d5d8f4d510",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Esc Esc（快速两次））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+X（计划展示时）",
      "en": "Open plan in external editor",
      "zh": "在外部编辑器中协作编辑/评论实施计划",
      "id": "f6b6ab4b7d7063dd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+X（计划展示时））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+B",
      "en": "Toggle background shell",
      "zh": "切换当前后台shell的可见性",
      "id": "3ee61c5579cc59ef",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+B）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+K（后台shell列表）",
      "en": "Kill active background shell",
      "zh": "终止当前激活的后台shell",
      "id": "f4c19e68f93b5f31",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 Ctrl+K（后台shell列表））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/about",
      "en": "Show version info",
      "zh": "显示版本信息，提交issue时附上",
      "id": "e95fdb68d95969cc",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /about）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/agents [list|reload|enable|disable|config]",
      "en": "Manage subagents",
      "zh": "管理本地和远程子代理",
      "id": "341bd529b0f6a6e8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /agents [list|reload|enable|disable|config]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/auth",
      "en": "Change auth method",
      "zh": "打开对话框切换认证方式",
      "id": "a4a9011d4e23f7e9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /auth）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/bug",
      "en": "File a GitHub issue",
      "zh": "提交Gemini CLI的issue报告",
      "id": "a6e50b5d62de7b8f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /bug）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-chat",
      "cat": "slash",
      "cmd": "/chat（/resume别名）",
      "en": "Session browser & checkpoints",
      "zh": "浏览历史会话和手动检查点（功能同/resume）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /chat（/resume别名））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-clear",
      "cat": "slash",
      "cmd": "/clear",
      "en": "Clear terminal screen",
      "zh": "清空终端屏幕和可见历史（快捷键 Ctrl+L）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /clear）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/commands [list|reload]",
      "en": "Manage custom commands",
      "zh": "管理从.toml文件加载的自定义命令",
      "id": "24f41f74a75c7c34",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /commands [list|reload]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/compress",
      "en": "Summarize chat context",
      "zh": "用摘要替换整个对话上下文，节省后续token",
      "id": "caf5f35e5809a0ea",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /compress）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-copy",
      "cat": "slash",
      "cmd": "/copy",
      "en": "Copy last output",
      "zh": "复制最近一次输出到剪贴板（需要系统剪贴板工具）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /copy）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/directory add|show（别名/dir）",
      "en": "Manage workspace directories",
      "zh": "管理多目录工作区支持",
      "id": "120c6fb8ab427d66",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /directory add|show（别名/dir））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/docs",
      "en": "Open documentation",
      "zh": "在浏览器中打开官方文档",
      "id": "f9f7c6e731e2b9da",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /docs）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-editor",
      "cat": "slash",
      "cmd": "/editor",
      "en": "Select supported editor",
      "zh": "打开对话框选择支持的编辑器",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /editor）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/extensions [install|list|update|...]",
      "en": "Manage extensions",
      "zh": "管理扩展（安装/列出/更新/启用禁用）",
      "id": "8e5b35d88fb2c6c3",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /extensions [install|list|update|...]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/help（别名/?）",
      "en": "Show help",
      "zh": "显示帮助信息和可用命令",
      "id": "257de0c49ddd37bd",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /help（别名/?））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/hooks [enable|disable|list]",
      "en": "Manage hooks",
      "zh": "管理生命周期事件钩子",
      "id": "ca56153155d4bad0",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /hooks [enable|disable|list]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/ide [enable|disable|install|status]",
      "en": "Manage IDE integration",
      "zh": "管理IDE集成状态",
      "id": "d5a97a70a319062e",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /ide [enable|disable|install|status]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-init",
      "cat": "slash",
      "cmd": "/init",
      "en": "Generate GEMINI.md",
      "zh": "分析当前目录生成定制化的项目说明文件",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /init）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/mcp [list|auth|reload|schema]",
      "en": "Manage MCP servers",
      "zh": "管理已配置的MCP服务器",
      "id": "7e1b35f37ba36037",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /mcp [list|auth|reload|schema]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/memory [show|refresh|list]",
      "en": "Manage hierarchical memory",
      "zh": "管理从GEMINI.md加载的层级记忆",
      "id": "0747ca7a77a6bc97",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /memory [show|refresh|list]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/model [manage|set]",
      "en": "Manage model config",
      "zh": "配置或设置使用的模型",
      "id": "ff5d79bf2b78fa19",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /model [manage|set]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/permissions trust",
      "en": "Manage folder trust",
      "zh": "管理目录信任设置",
      "id": "06a4ec92030116f8",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /permissions trust）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/plan [copy]",
      "en": "Switch to Plan Mode",
      "zh": "切换到只读计划模式，查看已生成的计划",
      "id": "ec6b052ae3f87624",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /plan [copy]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/policies list",
      "en": "List active policies",
      "zh": "按模式列出所有激活的策略",
      "id": "f409731fc097c2c2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /policies list）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/privacy",
      "en": "Privacy notice & consent",
      "zh": "显示隐私声明并选择数据收集同意",
      "id": "d13d05dc06307777",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /privacy）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/quit --delete（别名/exit）",
      "en": "Exit and optionally wipe history",
      "zh": "退出CLI，加--delete可同时永久删除本次会话记录",
      "id": "026fadf5fde6300a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /quit --delete（别名/exit））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-restore",
      "cat": "slash",
      "cmd": "/restore [tool_call_id]",
      "en": "Restore files before a tool ran",
      "zh": "把项目文件恢复到某次工具执行前的状态",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /restore [tool_call_id]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-rewind",
      "cat": "slash",
      "cmd": "/rewind",
      "en": "Navigate back through history",
      "zh": "回溯对话历史，可选回退聊天和/或代码改动（快捷键Esc Esc）",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /rewind）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/resume",
      "en": "Browse/resume sessions",
      "zh": "浏览并恢复历史会话，管理手动检查点",
      "id": "7f2b456e09f16cd5",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /resume）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/settings",
      "en": "Open settings editor",
      "zh": "打开设置编辑器，带校验和引导",
      "id": "feba3bde7df3e178",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /settings）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/shells（别名/bashes）",
      "en": "Toggle background shells view",
      "zh": "查看和管理后台运行的长进程",
      "id": "1bebeaaaafdd2a3f",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /shells（别名/bashes））",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/setup-github",
      "en": "Set up GitHub Actions",
      "zh": "配置GitHub Actions进行issue分类和PR审查",
      "id": "fdac694565130d50",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /setup-github）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/skills [enable|disable|list|reload]",
      "en": "Manage Agent Skills",
      "zh": "管理提供按需专业能力的Agent Skills",
      "id": "8e962d8d25d95a3d",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /skills [enable|disable|list|reload]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/stats [session|model|tools]",
      "en": "Show usage statistics",
      "zh": "显示会话/模型/工具维度的使用统计",
      "id": "629d065b3549b4e9",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /stats [session|model|tools]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/terminal-setup",
      "en": "Configure multiline keybindings",
      "zh": "为VS Code/Cursor/Windsurf配置多行输入按键",
      "id": "f30b89a8fbce37d4",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /terminal-setup）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-theme",
      "cat": "slash",
      "cmd": "/theme",
      "en": "Change visual theme",
      "zh": "切换界面视觉主题",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /theme）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/tools [desc|nodesc]",
      "en": "List available tools",
      "zh": "列出当前可用工具，desc显示完整描述",
      "id": "66597ed89b719f59",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /tools [desc|nodesc]）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "/upgrade",
      "en": "Upgrade tier",
      "zh": "打开升级页面提升用量限额（仅Google登录可用）",
      "id": "7e369aa7b01e2be2",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /upgrade）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "id": "gemini-vim",
      "cat": "slash",
      "cmd": "/vim",
      "en": "Toggle vim mode",
      "zh": "切换Vim风格的导航和编辑模式",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-commands",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/commands/（页面内检索 /vim）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "@路径",
      "en": "Inject file/dir content",
      "zh": "把指定文件或目录内容注入当前提示词（支持git感知过滤）",
      "id": "a7e1d5e3264e49ca",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 @路径）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "!命令",
      "en": "Execute shell command",
      "zh": "用bash(Linux/macOS)或powershell(Windows)执行命令",
      "id": "1d674a307a676e58",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 !命令）",
          "checkedAt": "2026-06-21"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "!（单独输入）",
      "en": "Toggle shell mode",
      "zh": "切换Shell模式，之后输入的文本直接当作shell命令解释",
      "id": "3010a79cc6eda64a",
      "evidenceStatus": "partial",
      "evidenceRefs": [
        {
          "sourceId": "gemini-keyboard",
          "claims": [
            "existence"
          ],
          "locator": "https://geminicli.com/docs/reference/keyboard-shortcuts/（页面内检索 !（单独输入））",
          "checkedAt": "2026-06-21"
        }
      ]
    }
  ]
};
