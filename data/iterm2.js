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
          "description": "Creates a new tab with the default profile; the new tab shares the same window and becomes active.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You need a fresh shell session in the same window.",
          "goal": "Open a new tab without creating a new window.",
          "expected": "A new empty tab appears to the right of existing tabs and receives focus.",
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
          "description": "Closes the active tab. If the window only has one tab, the window closes. When a split pane is focused and the pane is not the only one, it closes that pane instead of the entire tab.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You have finished working in a tab or split pane and want to clean up.",
          "goal": "Close the currently focused tab or pane.",
          "expected": "The active tab (or split pane) disappears; focus moves to the next remaining tab/pane.",
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
          "description": "Cycles focus to the previous tab. Tabs are ordered left-to-right; the shortcut wraps around to the last tab when the first tab is active.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You have multiple tabs open and need to move one tab to the left in order.",
          "goal": "Activate the tab immediately to the left of the current tab.",
          "expected": "The tab to the left becomes active; the title bar highlights the newly selected tab.",
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
          "description": "Cycles focus to the next tab. Tabs are ordered left-to-right; the shortcut wraps around to the first tab when the last tab is active.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You have multiple tabs open and need to move one tab to the right.",
          "goal": "Activate the tab immediately to the right of the current tab.",
          "expected": "The tab to the right becomes active.",
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
          "description": "Splits the active session into two vertical panes (left and right), each running an independent shell. The new pane is to the right and uses the same profile.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You need to monitor a log file while editing a configuration file in the same tab.",
          "goal": "Create a new pane to the right of the current session.",
          "expected": "The current session resizes to the left half, and a new shell session appears in the right half.",
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
          "description": "Splits the active session into two horizontal panes (top and bottom), each running an independent shell. The new pane is below the current one.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You want to run a server in the upper pane and use the lower pane for ad-hoc commands.",
          "goal": "Create a new pane below the current session.",
          "expected": "The session splits into top and bottom panes; a new shell opens in the bottom half.",
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
          "description": "Cycles focus to the next pane in a left-to-right, top-to-bottom order. Keeps the same tab active; the previously focused pane becomes inactive.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You have several split panes open and need to move keyboard focus to the next pane in order.",
          "goal": "Switch input focus to the next adjacent pane.",
          "expected": "The cursor moves to the next pane; the title bar updates to reflect the newly active session.",
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
          "description": "Cycles focus to the immediately previous pane, useful when you alternate between two panes.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You are editing files in multiple panes and need to jump back to the previous pane.",
          "goal": "Switch focus to the pane that preceded the current pane.",
          "expected": "The pane that had focus before the current pane becomes active.",
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
          "description": "Toggles between windowed and full-screen mode. In full-screen mode iTerm2 occupies a dedicated Space and hides the menu bar (can be shown by moving the pointer to the top).",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You need a distraction-free terminal workspace that occupies the entire display.",
          "goal": "Enter or exit macOS native full-screen mode.",
          "expected": "The window expands to fill the whole screen; the menu bar hides. Pressing the shortcut again returns to the previous window size.",
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
          "description": "Opens the iTerm2 find bar at the bottom of the window. Type a search string and use Return or Cmd+G / Cmd+Shift+G to navigate matches. The search is limited to the visible scrollback buffer by default.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You have a long output in the terminal and need to locate a specific error string.",
          "goal": "Open the find bar and search the scrollback buffer.",
          "expected": "A find bar appears; matched text is highlighted in the terminal as you type.",
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
          "description": "Clears the entire scrollback buffer and visible screen for the active pane. Unlike the `clear` shell command, this removes history that can be scrolled back to.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "Your terminal is cluttered with previous command output and you want a clean view.",
          "goal": "Erase all visible text and scrollback for the active session.",
          "expected": "The pane becomes blank, with the prompt appearing at the top. Scrolling up shows nothing.",
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
          "description": "Opens the Preferences window where you can modify Profiles, Keys, Appearance, and other configurations. The window can remain open while you test changes in a terminal session.",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You need to adjust iTerm2 appearance, key bindings, or profile settings.",
          "goal": "Open the Preferences window.",
          "expected": "The Preferences window appears, allowing navigation through the settings tabs.",
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
          "description": "Renders the specified image file directly in the terminal. Supports PNG, JPEG, GIF, and other formats. Requires iTerm2 Shell Integration to be installed.",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You have an image file and want to quickly preview it without leaving the terminal.",
          "goal": "Show an image inline in the iTerm2 session.",
          "expected": "The image appears inline in the terminal output.",
          "prerequisites": "iTerm2 Shell Integration must be installed and sourced in the shell.",
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
          "description": "Shows a list of image files along with small inline thumbnails. Works like `ls` for images, but with visual previews. Requires Shell Integration.",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You need to see which images are in a folder at a glance.",
          "goal": "Display a visual listing of image files in a directory.",
          "expected": "Thumbnails of images are rendered inline next to their filenames.",
          "prerequisites": "iTerm2 Shell Integration must be installed.",
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
          "description": "Takes data from standard input and puts it onto the macOS pasteboard. Any trailing newline is stripped. Shell Integration required.",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You want to copy the output of a command to the clipboard without selecting with the mouse.",
          "goal": "Pipe command output to the system clipboard.",
          "expected": "The content is silently copied to the clipboard; no terminal output appears.",
          "prerequisites": "iTerm2 Shell Integration must be installed.",
          "caveat": "Use `command | it2copy` to avoid large binary output.",
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
          "description": "Changes the current session's profile to the one with the given name. The profile must exist in iTerm2 Preferences > Profiles. Shell Integration required.",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "official",
          "evidenceTier": "first-party",
          "adaptation": "verbatim",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You want to change the current terminal's appearance to a pre-defined profile for a specific task.",
          "goal": "Switch the active session to a named profile.",
          "expected": "The terminal's colors, font, and other settings update instantly to match the profile.",
          "prerequisites": "iTerm2 Shell Integration and at least one named profile.",
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
          "description": "Outputs a diagnostic message indicating whether Shell Integration is properly installed and functioning in the current session. Returns exit code 0 on success.",
          "copyable": true,
          "sourceUrl": "https://iterm2.com/documentation-shell-integration.html",
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "iterm2-docs"
          ],
          "scenario": "You suspect that iTerm2 Shell Integration is not loaded correctly.",
          "goal": "Verify that the current shell session has the integration active.",
          "expected": "Prints something like 'Shell integration is working.' or an error message.",
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
