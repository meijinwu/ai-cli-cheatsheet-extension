// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["iterm2"] = {
  "meta": {
    "id": "iterm2",
    "name": "iTerm2",
    "color": "#EBBF00",
    "source": "Official iTerm2 documentation, local help, and release notes, 2025-04-08",
    "builtIn": false,
    "updatePolicy": "manual-only",
    "contentCheckedAt": "2026-07-02",
    "sourceCheckedAt": "2026-07-02",
    "sourceUrl": "https://iterm2.com/documentation.html",
    "sourceTier": "official",
    "coverage": "Core keyboard shortcuts, menus, and Shell Integration commands commonly used in iTerm2.",
    "platforms": [
      "mac"
    ],
    "order": 999,
    "sources": [
      {
        "id": "iterm2-docs",
        "title": "iTerm2 Documentation",
        "kind": "official-doc",
        "maintainer": "iTerm2 project",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples",
          "cross-check"
        ],
        "resolvedUrl": "https://iterm2.com/documentation.html",
        "pageTitle": "Documentation - iTerm2 - macOS Terminal Replacement",
        "checkedAt": "2026-07-02",
        "url": "https://iterm2.com/documentation.html",
        "lastVerifiedAt": "2026-07-02"
      },
      {
        "id": "iterm2-local-help",
        "title": "iTerm2 Help",
        "kind": "local-help",
        "maintainer": "iTerm2 project",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics"
        ]
      }
    ],
    "verificationStatus": "manual"
  },
  "items": [
    {
      "cat": "shortcut",
      "cmd": "Cmd+T",
      "en": "New Tab",
      "zh": "新建标签页",
      "evidenceStatus": "verified",
      "keywords": [
        "tab",
        "new",
        "session",
        "terminal"
      ],
      "examples": [
        {
          "value": "Cmd+T",
          "description": "使用默认配置新建一个标签页；新标签页位于同一窗口中，并会立即成为当前活动标签。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "需要在同一个窗口中开启一个新的 Shell 会话。",
          "goal": "不新建窗口，直接打开一个新标签页。",
          "expected": "新的空白标签页出现在现有标签页右侧，并获得焦点。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+T"
      },
      "id": "iterm2-new-tab",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Shell > New Window/Tab",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Shell > New Tab（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+W",
      "en": "Close Current Tab/Pane",
      "zh": "关闭当前标签页或窗格",
      "context": "tab or split pane",
      "evidenceStatus": "verified",
      "keywords": [
        "close",
        "tab",
        "pane",
        "terminate"
      ],
      "examples": [
        {
          "value": "Cmd+W",
          "description": "关闭当前标签页；如果窗口只有一个标签页则关闭窗口。若焦点在分屏窗格且还有其他窗格，则只关闭当前窗格。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "完成当前标签页或分屏窗格中的工作，需要清理界面。",
          "goal": "关闭当前获得焦点的标签页或窗格。",
          "expected": "当前标签页或窗格消失，焦点移动到剩余的标签页或窗格。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+W"
      },
      "id": "iterm2-close-tab",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Shell > Close",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Shell > Close（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+[",
      "en": "Previous Tab",
      "zh": "上一个标签页",
      "evidenceStatus": "partial",
      "keywords": [
        "tab",
        "previous",
        "switch",
        "navigate"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+[",
          "description": "切换到上一个标签页。标签页按从左到右排序；当前在第一个标签页时会循环到最后一个。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "已经打开多个标签页，需要按顺序切换到左侧标签页。",
          "goal": "激活当前标签页左侧的相邻标签页。",
          "expected": "左侧标签页变为活动状态，标题栏高亮显示新选中的标签页。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+["
      },
      "id": "iterm2-previous-tab",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Window > Select Previous Tab（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+]",
      "en": "Next Tab",
      "zh": "下一个标签页",
      "evidenceStatus": "partial",
      "keywords": [
        "tab",
        "next",
        "switch",
        "navigate"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+]",
          "description": "切换到下一个标签页。标签页按从左到右排序；当前在最后一个标签页时会循环到第一个。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "已经打开多个标签页，需要切换到右侧标签页。",
          "goal": "激活当前标签页右侧的相邻标签页。",
          "expected": "右侧标签页变为活动状态。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+]"
      },
      "id": "iterm2-next-tab",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Window > Select Next Tab（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+D",
      "en": "Split Vertically",
      "zh": "垂直分割窗格",
      "context": "session pane",
      "evidenceStatus": "verified",
      "keywords": [
        "split",
        "pane",
        "vertical",
        "side-by-side"
      ],
      "examples": [
        {
          "value": "Cmd+D",
          "description": "将当前会话垂直分成左右两个窗格，每个窗格运行独立的 Shell；新窗格位于右侧并使用相同配置。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "需要在同一标签页中一边监控日志，一边编辑配置文件。",
          "goal": "在当前会话右侧创建一个新窗格。",
          "expected": "当前会话缩到左半边，右半边出现新的 Shell 会话。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+D"
      },
      "id": "iterm2-split-vertical",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Shell > Split Vertically/Horizontally",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Shell > Split Vertically with Current Profile（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+D",
      "en": "Split Horizontally",
      "zh": "水平分割窗格",
      "context": "session pane",
      "evidenceStatus": "verified",
      "keywords": [
        "split",
        "pane",
        "horizontal",
        "top-bottom"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+D",
          "description": "将当前会话水平分成上下两个窗格，每个窗格运行独立的 Shell；新窗格位于当前窗格下方。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "想在上方窗格运行服务，在下方窗格执行临时命令。",
          "goal": "在当前会话下方创建一个新窗格。",
          "expected": "会话分成上下两个窗格，下半部分打开新的 Shell。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+D"
      },
      "id": "iterm2-split-horizontal",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Shell > Split Vertically/Horizontally",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Shell > Split Horizontally with Current Profile（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+]",
      "en": "Next Pane",
      "zh": "下一个窗格",
      "context": "split panes",
      "evidenceStatus": "partial",
      "keywords": [
        "pane",
        "next",
        "focus",
        "navigate"
      ],
      "examples": [
        {
          "value": "Cmd+]",
          "description": "按从左到右、从上到下的顺序切换到下一个窗格，同时保持当前标签页不变。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "打开了多个分屏窗格，需要按顺序移动键盘焦点。",
          "goal": "将输入焦点切换到下一个相邻窗格。",
          "expected": "光标移动到下一个窗格，标题栏更新为当前活动会话。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+]"
      },
      "id": "iterm2-next-pane",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Window > Select Split Pane > Next Pane（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+[",
      "en": "Previous Pane",
      "zh": "上一个窗格",
      "context": "split panes",
      "evidenceStatus": "partial",
      "keywords": [
        "pane",
        "previous",
        "focus",
        "navigate"
      ],
      "examples": [
        {
          "value": "Cmd+[",
          "description": "切换到上一个窗格，适合在两个窗格之间来回切换。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "正在多个窗格中编辑文件，需要回到前一个窗格。",
          "goal": "把焦点切回当前窗格之前的那个窗格。",
          "expected": "之前获得焦点的窗格重新变为活动状态。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+["
      },
      "id": "iterm2-previous-pane",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Window > Select Split Pane > Previous Pane（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Enter",
      "en": "Toggle Full Screen",
      "zh": "切换全屏模式",
      "evidenceStatus": "verified",
      "keywords": [
        "fullscreen",
        "maximize",
        "window",
        "focus"
      ],
      "examples": [
        {
          "value": "Cmd+Enter",
          "description": "在窗口模式和全屏模式之间切换。全屏时 iTerm2 会占用独立 Space，并隐藏菜单栏。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "需要一个占满屏幕、减少干扰的终端工作区。",
          "goal": "进入或退出 macOS 原生全屏模式。",
          "expected": "窗口扩展到整个屏幕并隐藏菜单栏；再次按快捷键会恢复到原来的窗口大小。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Enter"
      },
      "id": "iterm2-toggle-fullscreen",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · View > Toggle Full Screen",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 View > Toggle Full Screen（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+F",
      "en": "Find",
      "zh": "查找",
      "context": "search within terminal buffer",
      "evidenceStatus": "verified",
      "keywords": [
        "search",
        "find",
        "buffer",
        "text"
      ],
      "examples": [
        {
          "value": "Cmd+F",
          "description": "在窗口底部打开 iTerm2 查找栏；输入搜索词后可用 Return、Cmd+G 或 Cmd+Shift+G 跳转匹配项。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "终端输出很长，需要定位某个错误字符串。",
          "goal": "打开查找栏并搜索回滚缓冲区中的文本。",
          "expected": "查找栏出现，输入时匹配文本会在终端中高亮。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+F"
      },
      "id": "iterm2-find",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Edit > Find",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Edit > Find > Find...（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+K",
      "en": "Clear Buffer",
      "zh": "清除当前会话缓冲区",
      "context": "terminal scrollback",
      "evidenceStatus": "partial",
      "keywords": [
        "clear",
        "scrollback",
        "buffer",
        "reset"
      ],
      "examples": [
        {
          "value": "Cmd+K",
          "description": "清空当前窗格的可见内容和完整回滚缓冲区；不同于 `clear`，它也会移除可向上滚动查看的历史输出。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "终端里堆积了大量历史输出，需要恢复干净视图。",
          "goal": "清除当前会话的可见文本和回滚历史。",
          "expected": "窗格变为空白，提示符出现在顶部；向上滚动也看不到旧输出。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+K"
      },
      "id": "iterm2-clear-buffer",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Edit > Clear Buffer（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+,",
      "en": "Open Preferences",
      "zh": "打开偏好设置",
      "evidenceStatus": "partial",
      "keywords": [
        "preferences",
        "settings",
        "profiles",
        "configure"
      ],
      "examples": [
        {
          "value": "Cmd+,",
          "description": "打开 Preferences 窗口，可修改 Profiles、Keys、Appearance 等配置，并可在终端会话中边测试边调整。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "需要调整 iTerm2 外观、按键绑定或配置文件设置。",
          "goal": "打开 Preferences 窗口。",
          "expected": "Preferences 窗口出现，可以在各设置标签页之间切换。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+,"
      },
      "id": "iterm2-preferences",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 iTerm2 > Settings...（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "imgcat",
      "en": "Display an image inline",
      "zh": "在终端内显示图片",
      "evidenceStatus": "verified",
      "keywords": [
        "image",
        "inline",
        "display",
        "shell-integration",
        "media"
      ],
      "examples": [
        {
          "value": "imgcat photo.png",
          "description": "直接在终端中渲染指定图片文件，支持 PNG、JPEG、GIF 等格式；需要安装 iTerm2 Shell Integration。",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "有一个图片文件，想不离开终端就快速预览。",
          "goal": "在 iTerm2 会话中以内联方式显示图片。",
          "expected": "图片以内联形式出现在终端输出中。",
          "prerequisites": "需要安装 iTerm2 Shell Integration，并在当前 Shell 中加载。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "iterm2-imgcat",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · imgcat",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "imgls",
      "en": "List directory with image previews",
      "zh": "以缩略图形式列出目录中的图片",
      "evidenceStatus": "verified",
      "keywords": [
        "image",
        "thumbnail",
        "list",
        "directory",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "imgls",
          "description": "列出图片文件并显示小型内联缩略图，类似面向图片的 `ls`，但会带可视预览；需要 Shell Integration。",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "需要快速查看目录里有哪些图片。",
          "goal": "以可视化列表展示目录中的图片文件。",
          "expected": "图片缩略图以内联方式显示在文件名旁边。",
          "prerequisites": "需要安装 iTerm2 Shell Integration。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "iterm2-imgls",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · imgls",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "it2copy",
      "en": "Copy stdin to clipboard",
      "zh": "将标准输入内容复制到剪贴板",
      "evidenceStatus": "verified",
      "keywords": [
        "clipboard",
        "copy",
        "pipe",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "cat /etc/hosts | it2copy",
          "description": "从标准输入读取数据并复制到 macOS 剪贴板，同时会去掉末尾换行；需要 Shell Integration。",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "想把命令输出复制到剪贴板，而不想用鼠标手动选择文本。",
          "goal": "通过管道把命令输出写入系统剪贴板。",
          "expected": "内容被静默复制到剪贴板，终端不会额外输出文本。",
          "prerequisites": "需要安装 iTerm2 Shell Integration。",
          "caveat": "建议使用 `command | it2copy` 处理文本输出，避免把大量二进制内容写入剪贴板。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "iterm2-it2copy",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · it2copy",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "slash",
      "cmd": "it2profile",
      "en": "Switch iTerm2 profile",
      "zh": "切换 iTerm2 会话配置文件",
      "evidenceStatus": "unverified",
      "keywords": [
        "profile",
        "switch",
        "theme",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "it2profile \"Dark Background\"",
          "description": "将当前会话切换到指定名称的配置文件；该配置文件必须已存在于 iTerm2 Preferences > Profiles 中，并需要 Shell Integration。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "想为特定任务把当前终端外观切换到预先定义的配置文件。",
          "goal": "把活动会话切换到指定名称的配置文件。",
          "expected": "终端的颜色、字体和其他设置立即更新为该配置文件的样式。",
          "prerequisites": "需要 iTerm2 Shell Integration，并至少已有一个命名配置文件。",
          "platforms": [
            "mac"
          ],
          "caveat": "该工具随 Shell Integration 一起分发，但未收录进官方 utilities 文档页；用法以本机 `it2profile -h` 输出为准。"
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "iterm2-it2profile"
    },
    {
      "cat": "slash",
      "cmd": "it2check",
      "en": "Check whether the terminal is iTerm2",
      "zh": "检查当前终端是否为 iTerm2",
      "evidenceStatus": "verified",
      "keywords": [
        "iterm2",
        "check",
        "detect",
        "terminal",
        "script"
      ],
      "examples": [
        {
          "value": "it2check",
          "description": "检查当前终端模拟器是否为 iTerm2；是则以退出码 0 结束，适合在脚本里守卫仅 iTerm2 可用的功能。",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "脚本想在使用 imgcat 等 iTerm2 专属功能前先确认运行环境。",
          "goal": "判断当前终端是否为 iTerm2。",
          "expected": "在 iTerm2 中运行时退出码为 0；在其他终端中为非 0。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "iterm2-it2check",
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · it2check",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+N",
      "en": "New Window",
      "zh": "新建窗口",
      "evidenceStatus": "verified",
      "keywords": [
        "window",
        "new",
        "session",
        "open"
      ],
      "examples": [
        {
          "value": "Cmd+N",
          "description": "使用默认配置新建一个独立窗口；与 Cmd+T 不同，新会话拥有自己的窗口而不是并入当前窗口的标签页。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "需要一个和当前工作区分开的独立终端窗口。",
          "goal": "打开一个新的 iTerm2 窗口。",
          "expected": "新的窗口出现并获得焦点，包含一个默认配置的会话。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+N"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Shell > New Window/Tab",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Shell > New Window（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-new-window"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+O",
      "en": "Open Quickly",
      "zh": "快速打开会话搜索",
      "evidenceStatus": "verified",
      "keywords": [
        "session",
        "search",
        "switch",
        "quickly",
        "navigate"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+O",
          "description": "打开 Open Quickly 面板，输入关键字即可按名称、目录、命令等模糊搜索并跳转到任意会话，也能新建会话或切换配置。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "开了很多标签页和窗格，记不清目标会话在哪里。",
          "goal": "用模糊搜索直接跳到想要的会话。",
          "expected": "输入关键字后出现匹配的会话列表，回车即切换过去。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+O"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · View > Open Quickly（页面注明快捷键 Cmd-Shift-O）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-open-quickly"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+H",
      "en": "Open Paste History",
      "zh": "打开粘贴历史",
      "evidenceStatus": "verified",
      "keywords": [
        "paste",
        "history",
        "clipboard",
        "recall"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+H",
          "description": "打开粘贴历史窗口，展示最近复制或粘贴过的最多 20 条内容，可搜索并选择重新粘贴。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "刚刚复制了别的内容，还想找回前几次复制过的文本。",
          "goal": "从历史记录中挑一条重新粘贴。",
          "expected": "弹出可搜索的历史列表，回车把选中内容粘贴到当前会话。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+H"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · Edit > Open Paste History",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Edit > Paste Special > Open Paste History...（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-paste-history"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+Enter",
      "en": "Maximize Active Pane",
      "zh": "最大化当前窗格",
      "evidenceStatus": "verified",
      "keywords": [
        "pane",
        "maximize",
        "zoom",
        "split",
        "toggle"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+Enter",
          "description": "在分屏布局中临时把当前窗格放大到占满整个标签页，再按一次恢复原布局；放大期间其他窗格保持运行。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "分屏太多导致当前窗格太小，想临时专注于一个窗格。",
          "goal": "把当前窗格放大到整个标签页。",
          "expected": "当前窗格占满标签页并有视觉提示；再次按快捷键恢复分屏布局。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+Enter"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · View > Maximize Active Pane",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 View > Maximize Active Pane（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-maximize-pane",
      "context": "split panes"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+/",
      "en": "Find Cursor",
      "zh": "定位光标位置",
      "evidenceStatus": "verified",
      "keywords": [
        "cursor",
        "locate",
        "highlight",
        "find"
      ],
      "examples": [
        {
          "value": "Cmd+/",
          "description": "以高亮动画标出当前光标位置，适合在大屏幕或长输出后快速找回光标。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "输出滚动之后一眼找不到光标在哪。",
          "goal": "让 iTerm2 高亮显示光标位置。",
          "expected": "光标周围出现聚光灯式高亮，随后自动消失。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+/"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · View > Find Cursor",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 View > Find Cursor（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-find-cursor"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Option+B",
      "en": "Start Instant Replay",
      "zh": "开启即时回放",
      "evidenceStatus": "verified",
      "keywords": [
        "replay",
        "history",
        "screen",
        "timeline",
        "playback"
      ],
      "examples": [
        {
          "value": "Cmd+Option+B",
          "description": "进入即时回放模式，可沿时间轴回看屏幕在过去任意时刻的内容，适合找回被全屏程序刷掉的输出；按 Esc 退出。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "vim 或 top 等全屏程序刷掉了之前的重要输出。",
          "goal": "回看屏幕此前某一时刻的内容。",
          "expected": "窗口底部出现时间轴，可用方向键前后回放屏幕内容。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Option+B"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-menu-items.html · View > Start Instant Replay",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 View > Start Instant Replay（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-instant-replay"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+G",
      "en": "Find Next",
      "zh": "查找下一个匹配",
      "evidenceStatus": "partial",
      "keywords": [
        "search",
        "find",
        "next",
        "match"
      ],
      "examples": [
        {
          "value": "Cmd+G",
          "description": "跳转到查找栏当前搜索词的下一个匹配项；配合 Cmd+Shift+G 反向跳转。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用 Cmd+F 搜索后需要在多个匹配之间移动。",
          "goal": "跳到下一个匹配位置。",
          "expected": "视图滚动到下一个匹配项并高亮。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+G"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Edit > Find > Find Next（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-find-next",
      "context": "find bar"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+1..Cmd+9",
      "en": "Select Tab by Number",
      "zh": "按编号切换标签页",
      "evidenceStatus": "partial",
      "keywords": [
        "tab",
        "number",
        "switch",
        "jump"
      ],
      "examples": [
        {
          "value": "Cmd+1..Cmd+9",
          "description": "直接跳转到第 N 个标签页（Cmd+1 到 Cmd+9），比连续按上一个/下一个更快。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "固定布局下想直接跳到某个已知位置的标签页。",
          "goal": "一键切换到指定编号的标签页。",
          "expected": "对应编号的标签页立即变为活动状态。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+1..Cmd+9"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Window > 标签页列表（每个标签页显示 ⌘1…⌘9）（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-select-tab-number"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Option+Arrow",
      "en": "Select Pane by Direction",
      "zh": "按方向切换窗格",
      "evidenceStatus": "partial",
      "keywords": [
        "pane",
        "direction",
        "arrow",
        "navigate",
        "split"
      ],
      "examples": [
        {
          "value": "Cmd+Option+Arrow",
          "description": "用 Cmd+Option+方向键把焦点移到指定方向的相邻窗格，比顺序切换（Cmd+[ / Cmd+]）更直观。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "复杂分屏布局中想直接移动到左边或下面的窗格。",
          "goal": "按空间方向切换活动窗格。",
          "expected": "对应方向的窗格获得焦点。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Option+Arrow"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-local-help",
          "claims": [
            "existence"
          ],
          "locator": "iTerm2 应用菜单 Window > Select Split Pane > Select Pane Above/Below/Left/Right（默认快捷键随菜单项显示）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-select-pane-arrows",
      "context": "split panes"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+Up/Down",
      "en": "Navigate Marks",
      "zh": "在命令标记间跳转",
      "evidenceStatus": "verified",
      "keywords": [
        "mark",
        "prompt",
        "navigate",
        "shell-integration",
        "jump"
      ],
      "examples": [
        {
          "value": "Cmd+Shift+Up/Down",
          "description": "在 Shell Integration 自动记录的命令提示符标记（marks）之间上下跳转，快速回到之前某条命令的输出开头。",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "scenario": "长输出翻页太慢，想直接跳回上一条命令的位置。",
          "goal": "在历史命令的起始位置之间跳转。",
          "expected": "视图直接滚动到上一条/下一条命令的提示符处。",
          "platforms": [
            "mac"
          ],
          "sourceIds": [
            "iterm2-docs"
          ],
          "prerequisites": "需要安装 iTerm2 Shell Integration。"
        }
      ],
      "platforms": [
        "mac"
      ],
      "platformCmds": {
        "mac": "Cmd+Shift+Up/Down"
      },
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-shell-integration.html · How it works > Marks（原文：You can navigate marks with Cmd-Shift-Up and Down-arrow keys.）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-navigate-marks"
    },
    {
      "cat": "slash",
      "cmd": "curl -L https://iterm2.com/shell_integration/install_shell_integration.sh | bash",
      "en": "Install Shell Integration",
      "zh": "安装 Shell Integration",
      "evidenceStatus": "verified",
      "keywords": [
        "shell-integration",
        "install",
        "setup",
        "marks",
        "utilities"
      ],
      "examples": [
        {
          "value": "curl -L https://iterm2.com/shell_integration/install_shell_integration.sh | bash",
          "description": "下载并执行官方安装脚本，为当前 Shell 启用 marks 导航、命令历史、imgcat 等集成能力；也可以改用菜单 iTerm2 > Install Shell Integration 离线安装。",
          "copyable": true,
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "刚装好 iTerm2，想启用 marks、命令历史等集成功能。",
          "goal": "为当前用户的 Shell 安装 iTerm2 Shell Integration。",
          "expected": "脚本写入 ~/.iterm2_shell_integration.<shell> 并修改 Shell 启动文件；重开会话后生效。",
          "platforms": [
            "mac"
          ],
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "caveat": "执行前建议先打开 URL 检查脚本内容，或改用 iTerm2 > Install Shell Integration 菜单的 Internet-Free Install。",
          "warning": "该命令会从网络下载脚本并直接执行，还会修改 Shell 启动文件。",
          "riskLevels": [
            "remoteExecution"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · curl -L https://iterm2.com/shell_integration/install_shell_integration.sh | bash",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-install-shell-integration"
    },
    {
      "cat": "slash",
      "cmd": "it2dl",
      "en": "Download file from remote host",
      "zh": "从远程主机下载文件",
      "evidenceStatus": "verified",
      "keywords": [
        "download",
        "ssh",
        "remote",
        "transfer",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "it2dl build.log",
          "description": "把远程机器上的文件下载到本机 Downloads 目录；在 ssh 会话里运行即可，无需另开 scp。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "正在 ssh 到远程服务器，想把一份日志拿回本机。",
          "goal": "把远程文件传回本地。",
          "expected": "文件出现在本机的下载目录中。",
          "platforms": [
            "mac"
          ],
          "prerequisites": "本机与远程主机都需要安装 iTerm2 Shell Integration。"
        }
      ],
      "platforms": [
        "mac"
      ],
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · it2dl",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-it2dl"
    },
    {
      "cat": "slash",
      "cmd": "it2ul",
      "en": "Upload file to remote host",
      "zh": "上传文件到远程主机",
      "evidenceStatus": "verified",
      "keywords": [
        "upload",
        "ssh",
        "remote",
        "transfer",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "it2ul deploy.tar.gz",
          "description": "把本机文件上传到当前 ssh 会话所在的远程目录；上传过程走 iTerm2 的会话通道，无需额外配置。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "正在 ssh 到远程服务器，需要把本机一个压缩包传上去。",
          "goal": "把本地文件上传到远程当前目录。",
          "expected": "弹出文件选择器或直接上传指定文件，远程目录出现该文件。",
          "platforms": [
            "mac"
          ],
          "prerequisites": "本机与远程主机都需要安装 iTerm2 Shell Integration。"
        }
      ],
      "platforms": [
        "mac"
      ],
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · it2ul",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-it2ul"
    },
    {
      "cat": "slash",
      "cmd": "it2setcolor",
      "en": "Change session colors",
      "zh": "调整当前会话配色",
      "evidenceStatus": "verified",
      "keywords": [
        "color",
        "theme",
        "preset",
        "appearance",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "it2setcolor preset 'Solarized Dark'",
          "description": "在命令行里直接调整当前会话的配色，可切换到已安装的配色预设，也能单独修改前景色/背景色等。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "想在进入生产环境的 ssh 会话时把终端换成醒目的配色。",
          "goal": "把当前会话切换到指定配色预设。",
          "expected": "终端配色立即变为该预设，不影响其他会话。",
          "platforms": [
            "mac"
          ],
          "prerequisites": "需要安装 iTerm2 Shell Integration；预设名须已存在于设置中。"
        }
      ],
      "platforms": [
        "mac"
      ],
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · it2setcolor",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-it2setcolor"
    },
    {
      "cat": "slash",
      "cmd": "it2attention",
      "en": "Request attention",
      "zh": "请求注意（弹跳 Dock 或烟花提醒）",
      "evidenceStatus": "verified",
      "keywords": [
        "attention",
        "notify",
        "dock",
        "alert",
        "shell-integration"
      ],
      "examples": [
        {
          "value": "sleep 300; it2attention fireworks",
          "description": "长任务结束后请求注意：可让 Dock 图标弹跳或在光标处放烟花动画，把你从别的窗口拉回来。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "跑一个几分钟的任务，切去别的应用时怕错过完成时刻。",
          "goal": "任务结束时得到显眼提醒。",
          "expected": "任务完成后 Dock 图标弹跳或出现烟花动画。",
          "platforms": [
            "mac"
          ],
          "prerequisites": "需要安装 iTerm2 Shell Integration。"
        }
      ],
      "platforms": [
        "mac"
      ],
      "evidenceRefs": [
        {
          "sourceId": "iterm2-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://iterm2.com/documentation-utilities.html · it2attention",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "iterm2-it2attention"
    }
  ]
};
