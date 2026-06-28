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
    "contentCheckedAt": "2026-06-28",
    "sourceCheckedAt": "2026-06-28",
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
        "checkedAt": "2025-04-08",
        "url": "https://iterm2.com/documentation.html",
        "lastVerifiedAt": "2025-04-08"
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
      "evidenceStatus": "unverified",
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
      "id": "iterm2-new-tab"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+W",
      "en": "Close Current Tab/Pane",
      "zh": "关闭当前标签页或窗格",
      "context": "tab or split pane",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-close-tab"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+[",
      "en": "Previous Tab",
      "zh": "上一个标签页",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-previous-tab"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+]",
      "en": "Next Tab",
      "zh": "下一个标签页",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-next-tab"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+D",
      "en": "Split Vertically",
      "zh": "垂直分割窗格",
      "context": "session pane",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-split-vertical"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Shift+D",
      "en": "Split Horizontally",
      "zh": "水平分割窗格",
      "context": "session pane",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-split-horizontal"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+]",
      "en": "Next Pane",
      "zh": "下一个窗格",
      "context": "split panes",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-next-pane"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+[",
      "en": "Previous Pane",
      "zh": "上一个窗格",
      "context": "split panes",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-previous-pane"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+Enter",
      "en": "Toggle Full Screen",
      "zh": "切换全屏模式",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-toggle-fullscreen"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+F",
      "en": "Find",
      "zh": "查找",
      "context": "search within terminal buffer",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-find"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+K",
      "en": "Clear Buffer",
      "zh": "清除当前会话缓冲区",
      "context": "terminal scrollback",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-clear-buffer"
    },
    {
      "cat": "shortcut",
      "cmd": "Cmd+,",
      "en": "Open Preferences",
      "zh": "打开偏好设置",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-preferences"
    },
    {
      "cat": "slash",
      "cmd": "imgcat",
      "en": "Display an image inline",
      "zh": "在终端内显示图片",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-imgcat"
    },
    {
      "cat": "slash",
      "cmd": "imgls",
      "en": "List directory with image previews",
      "zh": "以缩略图形式列出目录中的图片",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-imgls"
    },
    {
      "cat": "slash",
      "cmd": "it2copy",
      "en": "Copy stdin to clipboard",
      "zh": "将标准输入内容复制到剪贴板",
      "evidenceStatus": "unverified",
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
      "id": "iterm2-it2copy"
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
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "想为特定任务把当前终端外观切换到预先定义的配置文件。",
          "goal": "把活动会话切换到指定名称的配置文件。",
          "expected": "终端的颜色、字体和其他设置立即更新为该配置文件的样式。",
          "prerequisites": "需要 iTerm2 Shell Integration，并至少已有一个命名配置文件。",
          "platforms": [
            "mac"
          ]
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
      "en": "Check Shell Integration status",
      "zh": "检查 Shell Integration 是否正确安装",
      "evidenceStatus": "unverified",
      "keywords": [
        "shell-integration",
        "check",
        "diagnostic",
        "verify"
      ],
      "examples": [
        {
          "value": "it2check",
          "description": "输出诊断信息，说明当前会话中的 Shell Integration 是否已正确安装并正常工作；成功时返回退出码 0。",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "怀疑当前会话没有正确加载 iTerm2 Shell Integration。",
          "goal": "验证当前 Shell 会话中的集成功能是否处于可用状态。",
          "expected": "输出类似 'Shell integration is working.' 的提示，或显示相应错误信息。",
          "platforms": [
            "mac"
          ]
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "iterm2-it2check"
    }
  ]
};
