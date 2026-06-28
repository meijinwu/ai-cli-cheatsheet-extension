// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["shell"] = {
  "meta": {
    "id": "shell",
    "name": "Shell",
    "color": "#1E1E1E",
    "source": "Shell 聚合来源分批整理，整理于 2026-06-25",
    "builtIn": false,
    "updatePolicy": "manual-only",
    "verifiedVersion": "POSIX.1-2024 / bash 5.2",
    "contentCheckedAt": "2026-06-25",
    "sourceCheckedAt": "2026-06-25",
    "sourceUrl": "https://www.gnu.org/software/bash/manual/",
    "sourceTier": "official",
    "coverage": "终端命令解释与脚本环境：sh/POSIX、bash、zsh 的内置命令、关键字、快捷键、配置文件、环境变量、PATH、alias、函数、补全、历史命令、脚本语法与排错。外部 CLI 工具（Git、Docker、npm、Claude Code 等）不归入 Shell，仅作关联标签。",
    "platforms": [
      "mac",
      "linux"
    ],
    "order": 999,
    "sources": [
      {
        "id": "posix-shell-utilities",
        "title": "POSIX Shell Command Language and Utilities",
        "kind": "official-doc",
        "maintainer": "The Open Group",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics",
          "cross-check"
        ],
        "resolvedUrl": "https://pubs.opengroup.org/onlinepubs/9799919799/utilities/contents.html",
        "pageTitle": "POSIX Shell Command Language and Utilities",
        "checkedAt": "2026-06-25",
        "url": "https://pubs.opengroup.org/onlinepubs/9799919799/utilities/contents.html",
        "lastVerifiedAt": "2026-06-24"
      },
      {
        "id": "gnu-bash-manual",
        "title": "GNU Bash Reference Manual",
        "kind": "official-doc",
        "maintainer": "GNU Project",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ],
        "resolvedUrl": "https://www.gnu.org/software/bash/manual/",
        "pageTitle": "GNU Bash Reference Manual",
        "checkedAt": "2026-06-25",
        "url": "https://www.gnu.org/software/bash/manual/",
        "lastVerifiedAt": "2026-06-24"
      },
      {
        "id": "zsh-manual",
        "title": "Zsh Documentation",
        "kind": "official-doc",
        "maintainer": "Zsh project",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ],
        "resolvedUrl": "https://zsh.sourceforge.io/Doc/",
        "pageTitle": "Zsh Documentation",
        "checkedAt": "2026-06-25",
        "url": "https://zsh.sourceforge.io/Doc/",
        "lastVerifiedAt": "2026-06-24"
      }
    ],
    "verificationStatus": "manual"
  },
  "items": [
    {
      "cat": "slash",
      "cmd": "cd",
      "en": "Change the current directory",
      "zh": "切换当前工作目录",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "目录",
        "切换",
        "cd",
        "终端",
        "POSIX",
        "工作目录"
      ],
      "examples": [
        {
          "value": "cd /tmp",
          "description": "使用绝对路径切换到 /tmp 目录，支持相对路径或 cd - 返回上一个目录",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "需要在文件系统中移动",
          "goal": "将当前工作目录切换到 /tmp",
          "expected": "当前目录变为 /tmp，提示符可能发生变化",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-cd"
    },
    {
      "cat": "slash",
      "cmd": "pwd",
      "en": "Print working directory",
      "zh": "打印当前工作目录",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "pwd",
        "当前目录",
        "工作目录",
        "POSIX",
        "终端"
      ],
      "examples": [
        {
          "value": "pwd",
          "description": "pwd 输出从根目录开始的绝对路径，常用于脚本中保存当前目录以便返回",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "脚本或交互中需要确认当前路径",
          "goal": "输出当前工作目录的完整路径",
          "expected": "输出当前路径，例如 /home/user/projects",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-pwd"
    },
    {
      "cat": "slash",
      "cmd": "echo",
      "en": "Print arguments to standard output",
      "zh": "将参数打印到标准输出",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "echo",
        "输出",
        "打印",
        "POSIX",
        "终端",
        "脚本"
      ],
      "examples": [
        {
          "value": "echo 'Hello, World'",
          "description": "echo 默认在末尾追加换行；使用 -n 可抑制换行，但 -n 并非 POSIX 保证",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "需要在终端显示信息或调试变量",
          "goal": "输出字符串 Hello, World",
          "expected": "输出 Hello, World 并换行",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-echo"
    },
    {
      "cat": "slash",
      "cmd": "printf",
      "en": "Format and print arguments",
      "zh": "格式化输出字符串",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "printf",
        "格式化输出",
        "打印",
        "POSIX",
        "脚本"
      ],
      "examples": [
        {
          "value": "printf 'Name: %-10s Age: %02d\\n' 'Alice' 7",
          "description": "printf 与 C 语言 printf 类似，支持 %s、%d、%f 等格式说明符，相比 echo 更可靠",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "需要精确控制输出格式，如对齐或填充",
          "goal": "格式化输出姓名和年龄",
          "expected": "输出格式化后的文本：Name: Alice      Age: 07",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-printf"
    },
    {
      "cat": "slash",
      "cmd": "read",
      "en": "Read a line from standard input into a variable",
      "zh": "从标准输入读取一行到变量",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "read",
        "输入",
        "变量",
        "交互",
        "POSIX",
        "脚本"
      ],
      "examples": [
        {
          "value": "printf 'Enter your name: '; read name; echo \"Hello, $name\"",
          "description": "POSIX 标准 read 不支持 -p 提示，因此先用 printf 显示提示，再读取。read 可读取多个变量。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "脚本需要用户交互输入",
          "goal": "读取用户输入的名字并存入变量 name",
          "expected": "先显示提示 Enter your name:，输入 Alice 后输出 Hello, Alice",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-read"
    },
    {
      "cat": "slash",
      "cmd": "test",
      "en": "Evaluate conditional expression",
      "zh": "条件测试命令",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "test",
        "条件",
        "判断",
        "文件测试",
        "字符串",
        "POSIX"
      ],
      "examples": [
        {
          "value": "test -f /etc/passwd && echo 'passwd exists'",
          "description": "test 命令返回 0 表示条件为真，常用于 if 语句和 &&/|| 控制流",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "检查文件是否存在且为普通文件",
          "goal": "若 /etc/passwd 存在则输出信息",
          "expected": "若文件存在则输出 passwd exists",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-test"
    },
    {
      "cat": "slash",
      "cmd": "[",
      "en": "Alternative form of test command",
      "zh": "条件测试命令（方括号形式）",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "[",
        "test",
        "条件",
        "判断",
        "POSIX",
        "脚本"
      ],
      "examples": [
        {
          "value": "[ -d /tmp ] && echo '/tmp is a directory'",
          "description": "[ 是 test 的同义词，但必须用 ] 结束。注意 [ 和 ] 前后必须有空格。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "if 语句中需要更具可读性的条件判断",
          "goal": "检查目录 /tmp 是否存在",
          "expected": "若 /tmp 是目录则输出 /tmp is a directory",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-bracket"
    },
    {
      "cat": "slash",
      "cmd": ":",
      "en": "Null command that always returns success",
      "zh": "空命令，始终返回成功",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        ":",
        "空命令",
        "占位",
        "无限循环",
        "POSIX"
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-colon"
    },
    {
      "cat": "slash",
      "cmd": "true",
      "en": "Return a true (success) exit status",
      "zh": "返回真（成功退出状态）",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "true",
        "成功",
        "退出码",
        "POSIX"
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-true"
    },
    {
      "cat": "slash",
      "cmd": "false",
      "en": "Return a false (failure) exit status",
      "zh": "返回假（失败退出状态）",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "false",
        "失败",
        "退出码",
        "POSIX"
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-false"
    },
    {
      "cat": "slash",
      "cmd": "exit",
      "en": "Exit the shell with an optional status",
      "zh": "退出 shell，可带退出状态码",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "exit",
        "退出",
        "退出码",
        "POSIX",
        "脚本"
      ],
      "examples": [
        {
          "value": "exit 0",
          "description": "exit 后跟 0-255 之间的整数，默认使用上一条命令的退出状态。exit 在子 shell 中只退出当前子 shell。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "脚本执行完毕或需要提前终止，并报告状态",
          "goal": "以状态码 0 退出，表示成功",
          "expected": "当前 shell 或脚本终止",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-exit"
    },
    {
      "cat": "slash",
      "cmd": "return",
      "en": "Return from a function or sourced script",
      "zh": "从函数或 source 脚本返回",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "return",
        "函数返回",
        "sourced",
        "POSIX",
        "脚本"
      ],
      "examples": [
        {
          "value": "myfunc() { test -f \"$1\" && return 0; return 1; }",
          "description": "return 只能在函数或 source 脚本中使用，顶层脚本会报错。可带数值返回码。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "自定义函数需要返回特定退出码",
          "goal": "在函数中返回 1 表示失败",
          "expected": "函数退出，不影响外层",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-return"
    },
    {
      "cat": "slash",
      "cmd": "shift",
      "en": "Shift positional parameters left",
      "zh": "左移位置参数",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "shift",
        "位置参数",
        "参数",
        "POSIX",
        "脚本",
        "选项"
      ],
      "examples": [
        {
          "value": "shift",
          "description": "无参数时默认左移 1 位；也可指定 shift N，但 POSIX 只保证 shift 和 shift 1 行为一致。$# 会相应减少。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "逐项处理脚本参数，依次移除已处理的参数",
          "goal": "将参数左移一位，丢弃 $1",
          "expected": "$2 变为新的 $1，依次类推",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-shift"
    },
    {
      "cat": "slash",
      "cmd": "eval",
      "en": "Execute arguments as a shell command",
      "zh": "将参数作为 shell 命令执行",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "eval",
        "动态命令",
        "执行",
        "危险",
        "POSIX",
        "脚本"
      ],
      "examples": [
        {
          "value": "cmd=\"ls -l\"; eval $cmd",
          "description": "eval 将参数拼接成一条命令并交由 shell 再次解析，务必确保输入不会导致命令注入",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "需要根据变量构造并执行命令",
          "goal": "将变量内容作为命令执行",
          "expected": "列出当前目录详细信息",
          "warning": "eval 会执行任意 shell 代码，切勿对未经验证的字符串使用 eval，以避免命令注入",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-eval"
    },
    {
      "cat": "slash",
      "cmd": "exec",
      "en": "Replace the shell with a given command",
      "zh": "用指定命令替换当前 shell 进程",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "exec",
        "替换进程",
        "文件描述符",
        "重定向",
        "危险",
        "POSIX"
      ],
      "examples": [
        {
          "value": "exec less /etc/passwd",
          "description": "exec 会用 less 替换当前 shell 进程；less 退出后终端会直接关闭，适用于会话包装或资源释放",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "希望用另一个程序接管当前终端",
          "goal": "用 less 浏览文件后不再回到 shell",
          "expected": "进入 less 界面，退出后终端关闭",
          "warning": "exec 会替换当前 shell 进程，执行后原 shell 不复存在。若只是想执行命令并返回，请不要加 exec。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-exec"
    },
    {
      "cat": "slash",
      "cmd": "getopts",
      "en": "Parse positional parameters for options",
      "zh": "解析位置参数中的选项",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "getopts",
        "参数解析",
        "选项",
        "脚本",
        "POSIX"
      ],
      "examples": [
        {
          "value": "while getopts 'ab:' opt; do\n  case $opt in\n    a) echo 'Option A'; ;;\n    b) echo \"Option B: $OPTARG\"; ;;\n    *) echo 'Invalid'; ;;\n  esac\ndone\ntest $OPTIND -eq 1 || shift $((OPTIND - 1))",
          "description": "getopts 按 POSIX 规范解析，OPTARG 保存选项参数，OPTIND 指向下一个待处理的参数",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "编写脚本时需要处理 -a 或 -b <arg> 之类的选项",
          "goal": "解析命令行选项 -a 和 -b value",
          "expected": "对于 -a -b foo，将依次输出 'Option A' 和 'Option B: foo'，剩余参数前移",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-getopts"
    },
    {
      "cat": "slash",
      "cmd": "umask",
      "en": "Set or display the file mode creation mask",
      "zh": "设置或显示文件创建权限掩码",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "umask",
        "权限",
        "掩码",
        "文件创建",
        "POSIX"
      ],
      "examples": [
        {
          "value": "umask 022",
          "description": "umask 指定八进制掩码，新文件默认权限为 666 减去掩码，新目录为 777 减去掩码。常用 022（组和其他用户只有读和执行）或 077（仅所有者可读写执行）。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities",
            "gnu-bash-manual"
          ],
          "scenario": "需要确保新创建文件或文件夹的权限符合安全要求",
          "goal": "将默认权限掩码设置为 022，新文件权限变为 755 减去掩码",
          "expected": "此后在 shell 中创建的文件将继承受限权限",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "posix-umask"
    },
    {
      "cat": "flag",
      "cmd": "type -a",
      "en": "Display all locations of a command (alias, builtin, file)",
      "zh": "显示命令的所有位置（别名、内置、文件）",
      "context": "type",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "命令来源",
        "别名遮蔽",
        "调试",
        "bash内置命令",
        "type"
      ],
      "examples": [
        {
          "value": "type -a ls",
          "description": "显示所有名为 ls 的命令，包括别名、shell 函数、内置命令及外部可执行文件",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户想知道执行命令时实际调用的是哪个版本",
          "goal": "列出所有匹配的命令路径",
          "expected": "输出类似 ls is aliased to (ls --color=auto) 以及 /bin/ls 等",
          "prerequisites": "无"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-type"
    },
    {
      "cat": "flag",
      "cmd": "command -v",
      "en": "Display the command that would be executed, bypassing aliases",
      "zh": "显示将被执行的命令（绕过别名）",
      "context": "command",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "命令查找",
        "别名绕过",
        "command",
        "which替代"
      ],
      "examples": [
        {
          "value": "command -v git",
          "description": "如果存在则输出 git 的完整路径（如 /usr/bin/git），否则无输出并返回非零状态",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "检查某个命令是否可用，同时不想受到别名干扰",
          "goal": "打印命令对应的外部可执行文件路径",
          "expected": "/usr/bin/git 或类似路径，若不存在则无输出"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-command"
    },
    {
      "cat": "flag",
      "cmd": "hash -r",
      "en": "Forget all remembered command locations",
      "zh": "清除已记忆的命令位置哈希表",
      "context": "hash",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "哈希表",
        "路径缓存",
        "重置",
        "hash"
      ],
      "examples": [
        {
          "value": "hash -r",
          "description": "清空 bash 的命令路径哈希表，确保后续命令查找从文件系统重新解析",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "移动或重新安装了一个可执行文件，但 shell 仍使用旧的缓存路径",
          "goal": "让 shell 忘记缓存的路径，下次执行时重新搜索 PATH",
          "expected": "无输出，但之后执行命令时会重新查找",
          "warning": "没有破坏性，但可能导致大量命令首次执行稍慢"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-hash"
    },
    {
      "cat": "flag",
      "cmd": "help -m",
      "en": "Display help for builtin commands in pseudo-manpage format",
      "zh": "以伪 man 页格式显示内置命令帮助",
      "context": "help",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "帮助",
        "手册",
        "help",
        "内置命令文档"
      ],
      "examples": [
        {
          "value": "help -m declare",
          "description": "以类似 man 的格式输出 declare 内置命令的说明",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "想查看 declare 命令的详细帮助，但 man declare 可能给出的是程序员的声明",
          "goal": "以格式化的方式阅读内置命令的文档",
          "expected": "以 NAME, SYNOPSIS, DESCRIPTION 等 section 显示的帮助文本"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-help"
    },
    {
      "cat": "flag",
      "cmd": "builtin",
      "en": "Run a shell builtin, bypassing shell functions",
      "zh": "执行内置命令，即使被同名函数覆盖",
      "context": "builtin",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "绕过函数",
        "内置命令",
        "builtin",
        "函数遮蔽"
      ],
      "examples": [
        {
          "value": "builtin cd /tmp",
          "description": "绕过名为 cd 的 shell 函数，执行真正改变目录的内置命令",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户定义了与内置命令同名的 shell 函数（比如包装 cd 的函数），但仍需原始内置功能",
          "goal": "直接调用 bash 内置的 cd，而不是包装函数",
          "expected": "当前目录变为 /tmp，不会陷入函数递归"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-builtin"
    },
    {
      "cat": "flag",
      "cmd": "enable -n",
      "en": "Disable a shell builtin, forcing the use of an external command",
      "zh": "禁用内置命令，强制使用外部程序",
      "context": "enable",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "禁用内置",
        "外部程序",
        "enable"
      ],
      "examples": [
        {
          "value": "enable -n echo",
          "description": "关闭 echo 的内置支持，后续执行 echo 将调用 PATH 中的外部程序（如 /bin/echo）",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "需要测试外部版本的 echo 或 kill，或者内置版本有问题",
          "goal": "让 shell 忽略内置版本的 echo",
          "expected": "再次执行 echo 时使用系统提供的 echo，行为可能略有差异"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-enable"
    },
    {
      "cat": "flag",
      "cmd": "declare -p",
      "en": "Display the attributes and values of variables",
      "zh": "显示变量的属性和值",
      "context": "declare",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "变量声明",
        "declare",
        "调试变量",
        "变量属性"
      ],
      "examples": [
        {
          "value": "declare -p HOME",
          "description": "以 declare 命令的形式输出变量的属性和值，可用于重新定义",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "脚本中想快速查看某个变量是否被标记为只读或整数等属性",
          "goal": "展示变量 HOME 的声明细节",
          "expected": "输出类似 declare -- HOME=\"/home/user\" 的行"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-declare"
    },
    {
      "cat": "flag",
      "cmd": "local -i",
      "en": "Declare a local integer variable",
      "zh": "声明局部整数变量",
      "context": "local",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "局部变量",
        "整数",
        "函数",
        "local"
      ],
      "examples": [
        {
          "value": "local -i count=0",
          "description": "声明一个局部整数变量 count，赋值会被解释为算术运算，作用域仅限于当前函数",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "在 bash 函数内部需要一个只在本函数内有效的计数器",
          "goal": "创建一个局部整数变量并初始化为零",
          "expected": "变量 count 在函数退出后消失，不会污染全局环境"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-local"
    },
    {
      "cat": "flag",
      "cmd": "let",
      "en": "Perform arithmetic evaluation",
      "zh": "算术求值",
      "context": "let",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "算术",
        "计算",
        "let",
        "数学运算"
      ],
      "examples": [
        {
          "value": "let x=5+3; echo $x",
          "description": "let 对后面的表达式进行算术求值，支持赋值和 C 风格的运算符",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "需要在脚本中进行简单的整数运算而不调用 expr 或 $((...))",
          "goal": "计算 5+3 并将结果赋给变量 x",
          "expected": "输出 8"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-let"
    },
    {
      "cat": "flag",
      "cmd": "mapfile -t",
      "en": "Read lines from a file into an array, stripping trailing newlines",
      "zh": "从文件读取每一行到数组，去除换行符",
      "context": "mapfile",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "读取文件",
        "数组",
        "mapfile",
        "readarray"
      ],
      "examples": [
        {
          "value": "mapfile -t lines < /etc/hosts",
          "description": "mapfile 从标准输入读取各行到数组变量，-t 选项去除每行末尾的换行符",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "需要将文件每一行存入 shell 数组以便逐行处理",
          "goal": "将 /etc/hosts 的所有行读入数组 lines",
          "expected": "数组 lines 的每个元素对应文件的一行，无尾部 \\n",
          "warning": "注意重定向符号，避免意外清空文件"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-mapfile"
    },
    {
      "cat": "flag",
      "cmd": "compgen -c",
      "en": "List all available commands for completion",
      "zh": "列出所有可补全的命令",
      "context": "compgen",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "补全",
        "命令列表",
        "compgen",
        "完成"
      ],
      "examples": [
        {
          "value": "compgen -c | grep ^git",
          "description": "compgen -c 生成所有可用命令（内置、别名、外部）的列表，配合 grep 筛选",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "想知道所有以 git 开头的可执行命令有哪些（用于自定义补全或检查）",
          "goal": "列出所有以 git 开头的命令",
          "expected": "输出如 git, git-shell, git-credential-xxx 等"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-compgen"
    },
    {
      "cat": "flag",
      "cmd": "complete -F",
      "en": "Specify a function to generate completions for a command",
      "zh": "指定补全函数为命令生成补全项",
      "context": "complete",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "自定义补全",
        "complete",
        "补全函数",
        "compgen"
      ],
      "examples": [
        {
          "value": "complete -F _my_completion mycmd",
          "description": "当用户按 Tab 补全 mycmd 参数时，bash 调用 _my_completion 函数生成候选列表",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "为自定义命令 mycmd 设置动态补全功能",
          "goal": "将函数 _my_completion 绑定为 mycmd 的补全生成器",
          "expected": "后续输入 mycmd 后按 Tab 将触发自定义补全逻辑"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-complete"
    },
    {
      "cat": "flag",
      "cmd": "bind -p",
      "en": "Display all Readline key bindings",
      "zh": "显示所有 Readline 键绑定",
      "context": "bind",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "键绑定",
        "快捷键",
        "bind",
        "Readline"
      ],
      "examples": [
        {
          "value": "bind -p | grep reverse-search-history",
          "description": "bind -p 以可重新读取的格式列出所有 Readline 函数绑定，管道筛选逆向搜索相关项",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "检查 Ctrl-R 被绑定到哪个功能，或者想在脚本中查看当前所有绑定",
          "goal": "显示所有已配置的键绑定",
          "expected": "输出类似 \"\\C-r\": reverse-search-history 的行"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-bind"
    },
    {
      "cat": "flag",
      "cmd": "shopt -s",
      "en": "Enable a shell option",
      "zh": "启用 Shell 选项",
      "context": "shopt",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "shell选项",
        "shopt",
        "bash特性",
        "globstar"
      ],
      "examples": [
        {
          "value": "shopt -s globstar",
          "description": "开启 globstar 后，** 将匹配所有层级目录，方便递归遍历文件",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "想在 bash 中使用 ** 递归匹配所有子目录的文件",
          "goal": "启用 globstar 选项以支持 ** 通配符",
          "expected": "之后 ls **/*.txt 将列出当前目录及所有子目录下的 txt 文件"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-shopt"
    },
    {
      "cat": "flag",
      "cmd": "caller 0",
      "en": "Print the current subroutine call trace",
      "zh": "打印当前子调用栈信息",
      "context": "caller",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "调用栈",
        "调试",
        "caller",
        "堆栈跟踪"
      ],
      "examples": [
        {
          "value": "caller 0",
          "description": "参数 0 表示当前调用帧，输出调用者的行号和源文件名；数字越大回溯更深",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "在嵌套函数中出错了，想知道谁调用了当前函数",
          "goal": "查看当前函数的调用来源（行号和文件名）",
          "expected": "输出如 10 main_script.sh（表示在 main_script.sh 第 10 行调用）"
        }
      ],
      "platforms": [
        "mac",
        "linux",
        "windows"
      ],
      "id": "bash-builtin-caller"
    },
    {
      "cat": "flag",
      "cmd": "autoload",
      "en": "Mark a function for autoloading",
      "zh": "将函数标记为自动加载",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "autoload",
        "自动加载",
        "zsh函数",
        "函数自动加载",
        "autoload -Uz"
      ],
      "examples": [
        {
          "value": "autoload -Uz compinit && compinit",
          "description": "autoload 告诉 zsh compinit 是一个可自动加载的函数，-U 禁止别名展开，-z 使用 zsh 样式。然后在第一次调用 compinit 时从 fpath 加载并执行。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户想在使用补全功能前自动加载 compinit 函数",
          "goal": "自动加载并初始化补全系统",
          "expected": "如果 fpath 中有 compinit，将加载并初始化补全，无错误输出。",
          "prerequisites": "确保 fpath 包含含有 compinit 函数的目录"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-autoload"
    },
    {
      "cat": "flag",
      "cmd": "setopt",
      "en": "Set shell options",
      "zh": "设置 shell 选项",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "setopt",
        "shell选项",
        "zsh选项",
        "内置命令",
        "autocd"
      ],
      "examples": [
        {
          "value": "setopt autocd",
          "description": "设置 autocd 选项后，直接输入目录路径就会像使用了 cd 命令一样切换过去。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户希望输入目录路径时自动切换到该目录，而不必输入 cd",
          "goal": "启用自动切换目录功能",
          "expected": "当前工作目录变为输入的路径。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-setopt"
    },
    {
      "cat": "flag",
      "cmd": "unsetopt",
      "en": "Unset shell options",
      "zh": "取消 shell 选项",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "unsetopt",
        "shell选项",
        "zsh选项",
        "内置命令",
        "禁用选项"
      ],
      "examples": [
        {
          "value": "unsetopt autocd",
          "description": "关闭 autocd 选项，直接输入目录名称将不再自动执行 cd，只会提示命令未找到。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户之前启用了 autocd，现在想恢复到需要输入 cd 才能切换目录的默认行为",
          "goal": "关闭自动切换目录选项",
          "expected": "当前行为恢复为必须显式使用 cd 命令。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-unsetopt"
    },
    {
      "cat": "flag",
      "cmd": "zstyle",
      "en": "Define and query styles for completion and other contexts",
      "zh": "定义和查询补全等上下文样式",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zstyle",
        "zsh样式",
        "补全配置",
        "补全菜单",
        "样式系统"
      ],
      "examples": [
        {
          "value": "zstyle ':completion:*' menu select",
          "description": "这条 zstyle 设置让补全系统在多个候选时显示菜单，并允许使用方向键或 Tab 选择，而不是直接插入第一个匹配项。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户想要补全菜单可用方向键选择，而不是直接自动补全第一个候选项",
          "goal": "启用补全菜单选择模式",
          "expected": "补全时出现可导航的菜单。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-zstyle"
    },
    {
      "cat": "flag",
      "cmd": "whence",
      "en": "Show how a command would be interpreted",
      "zh": "显示命令的解释方式",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "whence",
        "命令来源",
        "命令解释",
        "zsh type",
        "内置替换"
      ],
      "examples": [
        {
          "value": "whence -v ls",
          "description": "whence -v 会输出 ls 是外部命令并显示完整路径，如果是函数或别名也会标明。这与 bash 的 type -a 类似，但 whence 是 zsh 原生命令。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户不确定 ls 命令是外部程序、内置命令还是别名，想查看详细解释",
          "goal": "了解 ls 的类型和位置",
          "expected": "输出类似 'ls is /bin/ls' 的信息。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-whence"
    },
    {
      "cat": "flag",
      "cmd": "where",
      "en": "Show all occurrences of a command in the PATH and functions",
      "zh": "显示命令的所有出现位置",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "where",
        "查找命令",
        "zsh路径",
        "命令定位",
        "所有位置"
      ],
      "examples": [
        {
          "value": "where python",
          "description": "where 类似于 whence -ca，列出 PATH 中所有匹配的可执行文件位置，以及同名的函数、别名等。适合排查命令遮蔽问题。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户想找出系统上所有名为 python 的可执行文件，按 PATH 顺序排列",
          "goal": "列出 python 命令的所有候选路径",
          "expected": "输出类似 /usr/local/bin/python\n/usr/bin/python 的多行列表。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-where"
    },
    {
      "cat": "flag",
      "cmd": "typeset",
      "en": "Set or display variable attributes and values",
      "zh": "设置或显示变量属性和值",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "typeset",
        "declare",
        "数组",
        "关联数组",
        "变量属性",
        "zsh变量"
      ],
      "examples": [
        {
          "value": "typeset -A user_ids",
          "description": "zsh 的 typeset -A 创建关联数组（类似字典），之后可用 user_ids[key]=value 赋值。bash 的 declare -A 也能创建关联数组，但语法略有不同。typeset 在 zsh 中功能更丰富，支持 -H、-M 等选项。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户需要存储键值对数据，例如用户名到 ID 的映射",
          "goal": "声明一个关联数组",
          "expected": "无输出，但变量 user_ids 已声明为关联数组。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-typeset"
    },
    {
      "cat": "flag",
      "cmd": "print",
      "en": "Print arguments with special formatting capabilities",
      "zh": "以特殊格式输出参数",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "print",
        "zsh输出",
        "格式化打印",
        "-l选项",
        "echo替代"
      ],
      "examples": [
        {
          "value": "print -l one two three",
          "description": "print 是 zsh 内置的输出命令，-l 让每个参数各占一行。比 echo 更灵活，例如 -n 不换行、-P 展开提示符转义。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户想逐行输出多个字符串，而不是用空格分隔",
          "goal": "多行打印列表",
          "expected": "输出：\none\ntwo\nthree"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-print"
    },
    {
      "cat": "flag",
      "cmd": "vared",
      "en": "Edit a variable interactively using line editor",
      "zh": "交互式编辑变量值",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "vared",
        "编辑变量",
        "zsh交互",
        "PATH编辑",
        "交互式"
      ],
      "examples": [
        {
          "value": "vared PATH",
          "description": "运行命令后，当前 PATH 值会出现在行编辑区域，用户可以像编辑普通命令行一样使用快捷键修改，按回车保存。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户想快速修改 PATH 环境变量，但不能一下子拼出完整长字符串",
          "goal": "在命令行编辑器中修改 PATH 的值",
          "expected": "编辑完成后 PATH 更新为修改后的值。",
          "caveat": "修改会立即生效，影响当前 shell 会话。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-vared"
    },
    {
      "cat": "flag",
      "cmd": "zmodload",
      "en": "Load and manage Zsh modules",
      "zh": "加载和管理 Zsh 模块",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zmodload",
        "模块",
        "zsh/datetime",
        "zsh/zutil",
        "加载模块"
      ],
      "examples": [
        {
          "value": "zmodload zsh/datetime",
          "description": "执行后，当前 shell 获得 zsh/datetime 模块提供的特性，如 $EPOCHSECONDS、strftime 等。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户想在脚本中获得高精度当前时间，需要 datetime 模块提供的 $EPOCHREALTIME",
          "goal": "加载 zsh/datetime 模块",
          "expected": "无错误输出，模块命令可用。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-zmodload"
    },
    {
      "cat": "flag",
      "cmd": "functions",
      "en": "Display or define shell functions",
      "zh": "显示或定义 shell 函数",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "builtins"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "functions",
        "函数定义",
        "zsh函数",
        "显示函数",
        "函数列表"
      ],
      "examples": [
        {
          "value": "functions ll",
          "description": "不带参数时列出所有函数名；带上函数名则显示其定义。与 bash 的 declare -f 类似，但 functions 能区分函数和变量，并提供更多格式化选项。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "none",
          "adaptation": "scenario-derived",
          "sourceType": "manual",
          "scenario": "用户忘记了自己之前定义的某个函数的准确内容，想快速查看",
          "goal": "查看名为 ll 的函数定义",
          "expected": "输出 ll() {\n\tls -lh \"$@\"\n} 之类的函数体。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-functions"
    },
    {
      "cat": "flag",
      "cmd": "name() { commands; }",
      "en": "Define a POSIX-compatible shell function",
      "zh": "定义 POSIX 兼容的 Shell 函数",
      "shell": {
        "layer": "syntax",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "scripting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "shell函数",
        "定义函数",
        "POSIX sh",
        "函数体",
        "命名函数",
        "脚本编程",
        "sh函数"
      ],
      "examples": [
        {
          "value": "greet() { echo \"Hello, $1\"; }\ngreet \"World\"",
          "description": "使用 POSIX 兼容语法定义函数 greet，接收一个参数并输出问候语。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "用户想在脚本中封装一段重复逻辑",
          "goal": "定义一个名为 greet 的函数打印问候",
          "expected": "输出 \"Hello, World\"",
          "prerequisites": "在 sh 或 bash 等 POSIX 兼容 shell 中运行",
          "caveat": "函数体需要用 { } 包围，且 } 前的最后一个命令必须以分号或换行结束。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "posix-func-def"
    },
    {
      "cat": "flag",
      "cmd": "function name { commands; }",
      "en": "Define a function using the 'function' reserved word (bash)",
      "zh": "使用 function 关键字定义函数（仅 bash）",
      "context": "bash function definition",
      "shell": {
        "layer": "syntax",
        "family": "bash",
        "portability": "bash",
        "topic": "scripting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "bash函数",
        "function关键字",
        "定义函数",
        "bash脚本",
        "函数体"
      ],
      "examples": [
        {
          "value": "function hello { echo \"Hello from function\"; }\nhello",
          "description": "使用 function 关键字清晰表明函数定义，{} 内为函数体。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "在 bash 脚本中定义函数以保持兼容性",
          "goal": "使用 function 关键字定义函数",
          "expected": "输出 Hello from function",
          "caveat": "该语法仅在 bash/zsh 中有效，POSIX sh 不支持 function 关键字。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "bash-func-keyword"
    },
    {
      "cat": "flag",
      "cmd": "function name { commands; }",
      "en": "Define a function using the 'function' keyword (zsh)",
      "zh": "使用 function 关键字定义函数（zsh）",
      "context": "zsh function definition",
      "shell": {
        "layer": "syntax",
        "family": "zsh",
        "portability": "zsh",
        "topic": "scripting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zsh函数",
        "function关键字",
        "定义函数",
        "zsh脚本"
      ],
      "examples": [
        {
          "value": "function repeat_message { for i in {1..3}; do echo \"$@\"; done }\nrepeat_message Hi",
          "description": "zsh 同样支持 function 关键字，使函数定义明确，适用于需要与 bash 脚本保持一致的情况。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "在 zsh 脚本或交互式中用 function 关键字定义函数",
          "goal": "使用 zsh 的 function 语法定义类型函数",
          "expected": "输出 Hi 三次",
          "caveat": "该语法在 zsh 中完全可用，但若追求纯 POSIX 兼容应使用 name() 形式。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "zsh-func-keyword"
    },
    {
      "cat": "flag",
      "cmd": "local [option] [name[=value] ...]",
      "en": "Declare local variables visible only within a function (bash)",
      "zh": "在函数内声明局部变量（仅 bash）",
      "context": "bash function",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "scripting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "local变量",
        "局部变量",
        "bash函数",
        "变量作用域",
        "bash内置"
      ],
      "examples": [
        {
          "value": "myfunc() { local tmp=\"value\"; echo $tmp; }\ntmp=\"global\"\nmyfunc\necho $tmp",
          "description": "local 声明 tmp 仅在 myfunc 内有效，不影响函数外部的同名变量。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "在函数内定义变量，避免与全局变量冲突",
          "goal": "在函数内使用局部变量存储临时结果",
          "expected": "先输出 \"value\"，后输出 \"global\"",
          "caveat": "local 不是 POSIX 标准，在 sh 中不可用；变量赋值紧跟在 local 后必须用空格分隔，如 local var=val 是合法的。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "bash-local"
    },
    {
      "cat": "flag",
      "cmd": "local [ -A ] [ -a ] [ name[=value] ... ]",
      "en": "Declare local variables within a function (zsh)",
      "zh": "在函数内声明局部变量（zsh）",
      "context": "zsh function",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "scripting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zsh local",
        "局部变量",
        "zsh函数",
        "变量作用域"
      ],
      "examples": [
        {
          "value": "myfunc() { local -A map; map[key]=\"value\"; echo ${map[key]}; }\nmyfunc",
          "description": "使用 local -A 声明关联数组 map，仅在函数内有效。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "zsh 函数内定义局部数组或关联数组",
          "goal": "声明一个局部关联数组避免污染全局",
          "expected": "输出 value",
          "caveat": "local 是 zsh 的内置，与 bash 的 local 兼容但支持更多类型标志如 -A。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "zsh-local"
    },
    {
      "cat": "flag",
      "cmd": "alias [name[=value] ...]",
      "en": "Define or display aliases",
      "zh": "定义或显示命令别名",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "environment"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "alias",
        "别名",
        "定义别名",
        "命令别名",
        "shell快捷方式"
      ],
      "examples": [
        {
          "value": "alias g='grep --color=auto'\ng 'pattern' file",
          "description": "使用 alias 定义别名，之后输入 g 即等效于 grep --color=auto。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "为常用命令设置快捷键",
          "goal": "将 grep --color=auto 设为 g",
          "expected": "高亮匹配的行",
          "caveat": "别名仅当前 shell 有效，需写入 ~/.bashrc 或 ~/.zshrc 持久化。别名不能使用位置参数，需要参数时考虑使用函数。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "posix-alias"
    },
    {
      "cat": "flag",
      "cmd": "unalias [-a] name ...",
      "en": "Remove alias definitions",
      "zh": "移除命令别名",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "environment"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "unalias",
        "移除别名",
        "取消别名",
        "命令别名管理",
        "shell环境"
      ],
      "examples": [
        {
          "value": "unalias ll",
          "description": "使用 unalias 移除别名 ll。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "移除某个不再需要的别名，或恢复默认命令",
          "goal": "删除名为 ll 的别名",
          "expected": "后续执行 ll 将恢复为系统默认（若未定义则为 command not found）",
          "caveat": "使用 unalias -a 会删除所有别名，谨慎操作。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "posix-unalias"
    },
    {
      "cat": "flag",
      "cmd": ". file [arguments]",
      "en": "Read and execute commands from file in the current shell environment",
      "zh": "在当前 Shell 环境中读取并执行文件中的命令",
      "context": "load functions and configurations",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "scripting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "source命令",
        "点命令",
        "加载文件",
        "环境脚本",
        "函数库"
      ],
      "examples": [
        {
          "value": ". ./functions.sh",
          "description": "使用 . 命令在当前 shell 中执行指定脚本，使得其中定义的函数和变量留在当前环境。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "manual",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "将函数定义放在单独文件中，在主脚本中加载它们",
          "goal": "加载 functions.sh 使其中的函数在当前 shell 中可用",
          "expected": "functions.sh 中的函数定义生效",
          "caveat": ". 会修改当前 shell 环境，注意脚本的副作用。",
          "platforms": [
            "mac",
            "linux",
            "windows"
          ]
        }
      ],
      "id": "posix-source"
    },
    {
      "cat": "flag",
      "cmd": "fg",
      "en": "Bring job to foreground",
      "zh": "将指定作业调至前台运行",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "作业控制",
        "前台任务",
        "fg命令",
        "bash",
        "zsh",
        "Ctrl+Z"
      ],
      "examples": [
        {
          "value": "fg %1",
          "description": "%1 引用作业号为 1 的作业；不带参数时 fg 默认恢复最近被挂起或后台的作业",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "后台任务需要用户输入或想要观察输出时",
          "goal": "将作业号为 1 的后台任务切换到前台运行",
          "expected": "作业回到前台，终端显示该命令的输出，直到任务结束或再次挂起",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "9f72d802481e6123"
    },
    {
      "cat": "flag",
      "cmd": "bg",
      "en": "Resume suspended job in background",
      "zh": "在后台继续运行被挂起的作业",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "作业控制",
        "后台任务",
        "bg命令",
        "bash",
        "zsh"
      ],
      "examples": [
        {
          "value": "bg",
          "description": "不带参数默认操作最近挂起的作业；也可以指定作业号如 bg %2",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "当用户使用 Ctrl+Z 挂起一个前台任务后，想让它继续在后台运行",
          "goal": "将刚被挂起的作业 bg 到后台",
          "expected": "作业在后台继续运行，终端打印类似 [1]+ command &",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "a0fea5659995fe20"
    },
    {
      "cat": "flag",
      "cmd": "wait",
      "en": "Wait for job completion",
      "zh": "等待作业完成，返回其退出状态",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "作业控制",
        "wait命令",
        "异步任务",
        "bash",
        "zsh",
        "退出状态"
      ],
      "examples": [
        {
          "value": "wait",
          "description": "不带参数时等待所有子进程；可指定进程 ID 或作业 ID（%1）等待特定任务",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "脚本中启动了多个后台任务，需要等待所有任务完成再继续",
          "goal": "等待所有后台作业完毕",
          "expected": "命令阻塞直到所有后台作业完成，返回最后一个进程的退出码",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "eab85ba371a77a11"
    },
    {
      "cat": "flag",
      "cmd": "disown",
      "en": "Remove jobs from shell's job table",
      "zh": "从 Shell 作业表中移除指定作业，使其不再受 SIGHUP 信号影响",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "作业控制",
        "disown命令",
        "nohup替代",
        "SIGHUP",
        "bash",
        "zsh"
      ],
      "examples": [
        {
          "value": "disown %1",
          "description": "disown 移除作业后，进程仍在运行，但 Shell 不再跟踪；搭配 nohup 可更可靠地防止终端 HUP",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "启动了一个长时间运行的后台命令，但退出 Shell 时不想让该任务被终止",
          "goal": "将作业号为 1 的任务从作业表中移除，使其在 Shell 退出后继续运行",
          "expected": "作业不再出现在 jobs 列表中，Shell 可安全退出",
          "caveat": "disown 只针对当前 Shell 作业表；如果直接 exit，作业继续运行但仍可能因终端关闭收到 HUP，建议结合 nohup 或 setsid 使用",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "1a9020d51556ccfd"
    },
    {
      "cat": "flag",
      "cmd": "suspend",
      "en": "Suspend shell execution",
      "zh": "挂起当前 Shell（等效于 Ctrl+Z），返回父 Shell",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "挂起shell",
        "suspend命令",
        "作业控制",
        "bash",
        "zsh",
        "Ctrl+Z"
      ],
      "examples": [
        {
          "value": "suspend",
          "description": "内置命令 suspend 将当前 Shell 挂起（类似终端 Ctrl+Z）；在父 Shell 中用 fg 可恢复",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "在嵌套的 subshell 中，想要临时挂起当前 Shell 回到父 Shell 进行操作",
          "goal": "挂起当前 Shell 并返回父进程",
          "expected": "当前 Shell 被暂停，终端返回到启动它的 Shell",
          "caveat": "如果 Shell 是一个登录 Shell，suspend 通常不起作用（bash 会拒绝）；此时可尝试用 exec 替换 Shell 后使用",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "f729c340fc6ad829"
    },
    {
      "cat": "flag",
      "cmd": "kill",
      "en": "Send a signal to a job or process",
      "zh": "向作业或进程发送信号",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "信号",
        "kill命令",
        "终止进程",
        "SIGTERM",
        "SIGKILL",
        "作业控制"
      ],
      "examples": [
        {
          "value": "kill %1",
          "description": "使用作业引用 %1 发送 SIGTERM（默认）；若进程不响应，可用 kill -9 %1 发送 SIGKILL 强制终止",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "后台任务无响应，需要强制终止",
          "goal": "终止作业号为 1 的任务",
          "expected": "作业被终止，jobs 输出不再包含该作业",
          "warning": "发送 SIGKILL（-9）会立即终止进程，可能导致数据丢失；请先尝试 SIGTERM（默认）或 SIGINT",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "8915ded220bd1495"
    },
    {
      "cat": "flag",
      "cmd": "trap",
      "en": "Specify actions for signals or events",
      "zh": "捕获信号，并在信号到达时执行指定命令",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "信号处理",
        "trap命令",
        "EXIT",
        "SIGINT",
        "清理",
        "脚本"
      ],
      "examples": [
        {
          "value": "trap 'rm -f \"$TMPFILE\"' EXIT",
          "description": "当脚本退出时（无论正常还是收到信号），自动删除临时文件；也可捕获 INT TERM 等特定信号",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "脚本在执行过程中可能被用户 Ctrl+C 中断，需要在退出前清理临时文件",
          "goal": "为 EXIT 信号设置清理函数",
          "expected": "脚本退出时自动执行 rm 命令，临时文件被删除",
          "caveat": "启用前先确认 $TMPFILE 指向正确的临时文件，避免误删；trap 设置的 EXIT 陷阱在信号导致退出时也执行，但不会在调用 exit 后又被信号中断时重复执行；注意引号嵌套",
          "warning": "这是高风险操作，执行前请确认目标、先备份或先使用预览/ dry-run 方式验证。",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "e9256858d1dbdf32"
    },
    {
      "cat": "flag",
      "cmd": "&",
      "en": "Run command in background",
      "zh": "将命令置于后台执行，终端立即返回提示符",
      "shell": {
        "layer": "syntax",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "后台运行",
        "&符号",
        "异步执行",
        "bash",
        "zsh",
        "作业控制"
      ],
      "examples": [
        {
          "value": "sleep 60 &",
          "description": "在命令末尾添加 & 使其在后台运行；Shell 会输出作业号和进程 ID，并立即返回提示符",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "要启动一个耗时脚本或长时间运行的程序，同时继续使用终端",
          "goal": "在后台运行 sleep 命令",
          "expected": "终端显示 [1] 12345 然后返回 $ 提示符，用户可以继续输入其他命令",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "abb1567b9fe7ea3e"
    },
    {
      "cat": "shortcut",
      "cmd": "Ctrl+Z",
      "en": "Suspend the foreground job",
      "zh": "挂起当前前台作业，发送 SIGTSTP 信号",
      "shell": {
        "layer": "shortcut",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "jobs"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "挂起",
        "Ctrl+Z",
        "SIGTSTP",
        "bash",
        "zsh",
        "作业控制"
      ],
      "examples": [
        {
          "value": "在命令运行时按下 Ctrl+Z",
          "description": "终端驱动发送 SIGTSTP，Shell 将作业挂起并显示 Stopped 消息；之后可用 bg 或 fg 恢复",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "正在运行一个命令，需要临时暂停它以便执行其他操作",
          "goal": "暂停当前前台命令",
          "expected": "终端打印 [1]+ Stopped command，返回 Shell 提示符",
          "platforms": [
            "linux",
            "mac"
          ]
        }
      ],
      "platforms": [
        "linux",
        "mac"
      ],
      "id": "3999a131cd65c45a"
    },
    {
      "cat": "flag",
      "cmd": "complete -F function command",
      "en": "Define a completion function for a command",
      "zh": "为命令定义补全函数",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "补全",
        "complete",
        "函数补全",
        "bash补全",
        "可编程补全",
        "命令补全",
        "自动补全"
      ],
      "examples": [
        {
          "value": "complete -F _mycmd_completions mycmd",
          "description": "定义补全函数 _mycmd_completions，在其中使用 COMP_WORDS 和 COMP_CWORD 来提供上下文补全。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "为自定义命令 mycmd 添加补全，按参数补全不同的子命令",
          "goal": "让用户输入 mycmd 后按 Tab 能补全子命令 start/stop/restart",
          "expected": "输入 mycmd 后按 Tab，显示 start stop restart",
          "prerequisites": "需先定义补全函数 _mycmd_completions",
          "caveat": "补全函数需在脚本中预先定义并正确返回 COMPREPLY 数组",
          "platforms": [
            "linux",
            "mac",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "bash-complete-f"
    },
    {
      "cat": "flag",
      "cmd": "complete -o default command",
      "en": "Fall back to default completion after the custom function",
      "zh": "在自定义补全后回退到默认补全",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "补全",
        "complete",
        "默认补全",
        "bash补全",
        "回退",
        "可编程补全"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "bash-complete-o-default"
    },
    {
      "cat": "flag",
      "cmd": "compgen -W 'words'",
      "en": "Generate completion candidates from a word list",
      "zh": "从单词列表生成补全候选",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "compgen",
        "生成补全",
        "bash补全",
        "单词列表",
        "补全候选"
      ],
      "examples": [
        {
          "value": "compgen -W \"apple banana cherry\" a",
          "description": "列出给定单词列表中匹配前缀 'a' 的单词，此处应返回 'apple'。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "测试补全单词列表，查看以 'a' 开头的匹配项",
          "goal": "确认 compgen 返回正确的补全候选",
          "expected": "输出匹配前缀的候选 apple",
          "platforms": [
            "linux",
            "mac",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "bash-compgen-w"
    },
    {
      "cat": "flag",
      "cmd": "compopt -o nospace",
      "en": "Don't append a space after a successful completion",
      "zh": "补全后不追加空格",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "compopt",
        "nospace",
        "bash补全",
        "空格",
        "补全后缀"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "bash-compopt-o-nospace"
    },
    {
      "cat": "flag",
      "cmd": "shopt -s show-all-if-ambiguous",
      "en": "Show all matches on first Tab press without ringing bell",
      "zh": "在第一次按 Tab 时显示所有匹配项而不会响铃",
      "shell": {
        "layer": "config",
        "family": "bash",
        "portability": "bash",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "shopt",
        "show-all-if-ambiguous",
        "bash补全",
        "显示所有匹配",
        "Tab补全"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "bash-shopt-show-all-if-ambiguous"
    },
    {
      "cat": "shortcut",
      "cmd": "Tab",
      "en": "Trigger completion of current word",
      "zh": "触发当前单词补全",
      "context": "bash readline",
      "shell": {
        "layer": "shortcut",
        "family": "bash",
        "portability": "bash",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "Tab",
        "补全",
        "自动补全",
        "bash快捷键",
        "补全键"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "bash-tab-complete"
    },
    {
      "cat": "flag",
      "cmd": "compdef _function command",
      "en": "Associate a completion function with a command",
      "zh": "为命令关联补全函数",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "compdef",
        "补全函数",
        "zsh补全",
        "命令补全"
      ],
      "examples": [
        {
          "value": "compdef _git g",
          "description": "将 git 的补全函数 _git 直接关联到别名 g，避免重复编写补全逻辑。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "为命令别名 g 重用 git 的补全规则",
          "goal": "让 g 命令拥有和 git 相同的补全体验",
          "expected": "输入 g 后按 Tab 能显示 git 子命令",
          "prerequisites": "需确保 git 的补全函数已加载",
          "platforms": [
            "linux",
            "mac",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "zsh-compdef"
    },
    {
      "cat": "flag",
      "cmd": "zstyle ':completion:*' menu select",
      "en": "Enable menu selection for completions",
      "zh": "启用补全菜单选择",
      "shell": {
        "layer": "config",
        "family": "zsh",
        "portability": "zsh",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zstyle",
        "菜单补全",
        "zsh补全",
        "menu select",
        "交互补全"
      ],
      "examples": [
        {
          "value": "zstyle ':completion:*' menu select",
          "description": "设置在补全列表中可以用箭头键移动高亮，按回车选择当前高亮项。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "当补全有多个选项时，希望用方向键在菜单中直接选择",
          "goal": "避免手动输入数字选择，提高补全效率",
          "expected": "补全时出现可导航的菜单，按 Tab 可循环下一匹配",
          "prerequisites": "需先初始化补全系统 (compinit)",
          "platforms": [
            "linux",
            "mac",
            "windows"
          ]
        }
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "zsh-zstyle-menu-select"
    },
    {
      "cat": "flag",
      "cmd": "zstyle ':completion:*:descriptions' format '%d'",
      "en": "Set the format of completion group descriptions",
      "zh": "设置补全分组的描述格式",
      "shell": {
        "layer": "config",
        "family": "zsh",
        "portability": "zsh",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zstyle",
        "描述格式",
        "zsh补全",
        "format",
        "补全分组"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "zsh-zstyle-descriptions-format"
    },
    {
      "cat": "flag",
      "cmd": "setopt menu_complete",
      "en": "Automatically insert the first match and cycle through on subsequent Tab presses",
      "zh": "自动插入首个匹配项，并按 Tab 循环切换",
      "shell": {
        "layer": "config",
        "family": "zsh",
        "portability": "zsh",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "setopt",
        "menu_complete",
        "zsh补全",
        "循环补全",
        "Tab"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "zsh-setopt-menu-complete"
    },
    {
      "cat": "shortcut",
      "cmd": "Tab",
      "en": "Trigger expand-or-complete (completions or expansions)",
      "zh": "触发补全或展开",
      "context": "zsh zle",
      "shell": {
        "layer": "shortcut",
        "family": "zsh",
        "portability": "zsh",
        "topic": "completion"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "Tab",
        "zsh补全",
        "expand-or-complete",
        "快捷键"
      ],
      "platforms": [
        "mac",
        "windows",
        "linux"
      ],
      "id": "zsh-tab-expand-or-complete"
    },
    {
      "cat": "flag",
      "cmd": "bash --login",
      "en": "Start bash as a login shell",
      "zh": "以登录 shell 方式启动 bash，强制读取 ~/.bash_profile（或后备文件），适合测试登录脚本或获取完整登录环境。",
      "shell": {
        "layer": "config",
        "family": "bash",
        "portability": "bash",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "bash",
        "登录 shell",
        "启动参数",
        "测试配置文件",
        "--login"
      ],
      "examples": [
        {
          "value": "bash --login",
          "description": "启动一个新的登录 shell，执行完整的登录初始化。完成后可 exit 返回。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "测试 ~/.bash_profile 修改是否生效",
          "goal": "在保持当前会话的同时，以登录 shell 运行一个子 shell 验证配置",
          "expected": "新 shell 提示符可看出不同，且环境变量/别名按配置加载。",
          "warning": "若 .bash_profile 有错误，可能导致启动中断；先备份。",
          "platforms": [
            "mac",
            "linux"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "bash-login-opt"
    },
    {
      "cat": "flag",
      "cmd": "zsh -l",
      "en": "Start zsh as a login shell",
      "zh": "以登录 shell 方式启动 zsh，强制读取 ~/.zprofile、~/.zshrc 等登录配置文件。",
      "shell": {
        "layer": "config",
        "family": "zsh",
        "portability": "zsh",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "zsh",
        "登录 shell",
        "启动参数",
        "测试",
        "-l"
      ],
      "examples": [
        {
          "value": "zsh -l",
          "description": "启动一个登录 zsh 子进程，自动执行 ~/.zprofile、~/.zshrc 等文件。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "调试 zsh 登录初始化文件",
          "goal": "在不退出当前会话的情况下检验 ~/.zprofile 的正确性",
          "expected": "新 shell 出现，环境按登录配置加载。",
          "warning": "如果启动文件有语法错误，子 shell 可能中止，先备份。",
          "platforms": [
            "mac",
            "linux"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "zsh-login-opt"
    },
    {
      "cat": "flag",
      "cmd": "set -e",
      "en": "Exit immediately if a command exits with a non-zero status",
      "zh": "错误立即退出（任何命令返回非零即退出脚本）",
      "context": "set builtin",
      "shell": {
        "layer": "option",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "set -e",
        "errexit",
        "错误退出",
        "脚本安全",
        "退出码",
        "调试"
      ],
      "examples": [
        {
          "value": "#!/bin/bash\nset -e\nfalse\necho 'This will not run'",
          "description": "启用 set -e 后，false 返回非零状态，脚本立即退出，echo 行不会执行",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "脚本中某步可能失败，需要失败时立即停止执行，避免后续操作基于错误状态继续运行",
          "goal": "演示 set -e 让脚本在错误时终止",
          "expected": "脚本在 false 后立即退出，无输出",
          "caveat": "管道中仅最右侧命令的状态影响 set -e，需配合 set -o pipefail 才能感知管道中任意命令失败"
        }
      ],
      "id": "set-e"
    },
    {
      "cat": "flag",
      "cmd": "set -u",
      "en": "Treat unset variables as an error when substituting",
      "zh": "使用未定义变量时报错退出",
      "context": "set builtin",
      "shell": {
        "layer": "option",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "set -u",
        "nounset",
        "未定义变量",
        "变量错误",
        "脚本调试",
        "安全"
      ],
      "examples": [
        {
          "value": "set -u\nrm -rf /${MYDIR}",
          "description": "若 MYDIR 未定义，set -u 将阻止 rm 使用空字符串，避免意外删除根目录",
          "copyable": false,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "脚本中拼写错误的变量名可能导致难以查找的 bug，希望引用未定义变量时立即暴露问题",
          "goal": "检测脚本中未定义的变量引用",
          "expected": "执行报错 'MYDIR: unbound variable'，脚本退出",
          "warning": "切勿直接复制运行该示例；它演示了未定义变量保护，实际使用时确保变量已正确定义"
        }
      ],
      "id": "set-u"
    },
    {
      "cat": "flag",
      "cmd": "set -x",
      "en": "Print commands and their arguments as they are executed",
      "zh": "执行时打印命令及其参数（调试模式）",
      "context": "set builtin",
      "shell": {
        "layer": "option",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "set -x",
        "xtrace",
        "调试",
        "命令追踪",
        "脚本排错",
        "执行跟踪"
      ],
      "examples": [
        {
          "value": "set -x\nVAR=$(date)\necho \"$VAR\"",
          "description": "set -x 会在执行前打印每条命令及其展开后的参数行，前面带 + 号",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "脚本运行结果不符合预期，需要逐步查看每条命令的执行过程",
          "goal": "在脚本中开启命令跟踪以排查逻辑错误",
          "expected": "终端输出以 + 开头的命令执行记录，显示赋值和 echo 的执行过程"
        }
      ],
      "id": "set-x"
    },
    {
      "cat": "flag",
      "cmd": "shopt -s globstar",
      "en": "Enable recursive globbing with ** (Bash)",
      "zh": "启用 ** 递归通配符（Bash）",
      "context": "shopt builtin",
      "shell": {
        "layer": "option",
        "family": "bash",
        "portability": "bash",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "globstar",
        "**",
        "递归通配",
        "shopt",
        "bash 通配符",
        "文件搜索"
      ],
      "examples": [
        {
          "value": "shopt -s globstar\nls **/*.txt",
          "description": "globstar 启用后，** 可跨越多级目录，匹配所有子目录下的 .txt 文件",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户需要递归查找当前目录及子目录下所有 .txt 文件，不想使用 find",
          "goal": "利用 ** 递归匹配所有目录",
          "expected": "列出所有子目录下的 .txt 文件"
        }
      ],
      "id": "shopt-globstar"
    },
    {
      "cat": "flag",
      "cmd": "shopt -s autocd",
      "en": "Execute directory names as if cd was used (Bash)",
      "zh": "输入目录名自动切换（Bash）",
      "context": "shopt builtin",
      "shell": {
        "layer": "option",
        "family": "bash",
        "portability": "bash",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "autocd",
        "目录切换",
        "shopt",
        "bash",
        "快速导航",
        "cd"
      ],
      "examples": [
        {
          "value": "shopt -s autocd\n/tmp\npwd",
          "description": "启用 autocd 后，直接在 shell 键入 /tmp 等同于 cd /tmp",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户经常切换目录，希望直接输入路径而省略 cd 命令",
          "goal": "启用 autocd，实现输入目录名直接进入",
          "expected": "当前目录变为 /tmp",
          "caveat": "仅当输入为目录名且无重名命令时才触发，若存在同名命令则执行命令而非切换目录"
        }
      ],
      "id": "shopt-autocd"
    },
    {
      "cat": "flag",
      "cmd": "shopt -s histappend",
      "en": "Append history to the history file rather than overwriting (Bash)",
      "zh": "追加历史记录而非覆盖文件（Bash）",
      "context": "shopt builtin",
      "shell": {
        "layer": "option",
        "family": "bash",
        "portability": "bash",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "histappend",
        "历史追加",
        "历史文件",
        "bash 历史",
        "shopt",
        "多 shell"
      ],
      "examples": [
        {
          "value": "shopt -s histappend",
          "description": "默认 bash 退出时覆盖历史文件；开启 histappend 后，每次退出将本次会话历史追加到文件末尾",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户同时打开多个终端，退出 shell 时发现只有最后一个退出的会话历史被保存，之前的历史丢失",
          "goal": "设置历史追加模式，避免多会话历史相互覆盖",
          "expected": "所有并行会话的命令历史都保留在 HISTFILE 中"
        }
      ],
      "id": "shopt-histappend"
    },
    {
      "cat": "flag",
      "cmd": "shopt -s extglob",
      "en": "Enable extended pattern matching features (Bash)",
      "zh": "启用扩展模式匹配（Bash）",
      "context": "shopt builtin",
      "shell": {
        "layer": "option",
        "family": "bash",
        "portability": "bash",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "extglob",
        "扩展通配",
        "模式匹配",
        "shopt",
        "bash",
        "通配符"
      ],
      "examples": [
        {
          "value": "shopt -s extglob\nls *.@(jpg|png)",
          "description": "extglob 启用后，@(jpg|png) 匹配 .jpg 或 .png 文件",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户需要匹配多种不连续的扩展名，例如一次列出 .jpg 和 .png 文件",
          "goal": "使用 @(pattern) 匹配精确扩展名集合",
          "expected": "列出当前目录下所有 .jpg 和 .png 文件"
        }
      ],
      "id": "shopt-extglob"
    },
    {
      "cat": "flag",
      "cmd": "setopt autocd",
      "en": "Change directory by typing directory name (Zsh)",
      "zh": "输入目录名直接切换（Zsh）",
      "context": "setopt builtin",
      "shell": {
        "layer": "option",
        "family": "zsh",
        "portability": "zsh",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "autocd",
        "目录切换",
        "setopt",
        "zsh",
        "导航",
        "cd"
      ],
      "examples": [
        {
          "value": "setopt autocd\n/tmp\npwd",
          "description": "启用 autocd 后，输入绝对或相对目录路径即自动切换",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "使用 zsh 经常性切换目录，希望直接键入路径无需 cd 前缀",
          "goal": "开启 autocd 选项简化导航",
          "expected": "当前目录变为 /tmp",
          "caveat": "若存在同名可执行命令，则优先执行命令而非 cd"
        }
      ],
      "id": "zsh-setopt-autocd"
    },
    {
      "cat": "flag",
      "cmd": "setopt append_history",
      "en": "Append history to the history file rather than overwriting (Zsh)",
      "zh": "追加历史记录而非覆盖文件（Zsh）",
      "context": "setopt builtin",
      "shell": {
        "layer": "option",
        "family": "zsh",
        "portability": "zsh",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "append_history",
        "历史追加",
        "zsh 历史",
        "setopt",
        "多会话",
        "HISTFILE"
      ],
      "examples": [
        {
          "value": "setopt append_history",
          "description": "默认 zsh 可能覆盖历史文件；启用 append_history 后每个会话退出时追加其历史",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "多个 zsh 会话并行工作，希望每个会话的历史都完整保留而不被最后退出的覆盖",
          "goal": "开启历史追加模式保护命令行历史",
          "expected": "HISTFILE 包含所有会话的命令记录"
        }
      ],
      "id": "zsh-setopt-appendhistory"
    },
    {
      "cat": "flag",
      "cmd": "setopt extendedglob",
      "en": "Enable extended globbing patterns (#, ^, ~) in Zsh",
      "zh": "启用扩展通配（#、^ 等，Zsh）",
      "context": "setopt builtin",
      "shell": {
        "layer": "option",
        "family": "zsh",
        "portability": "zsh",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "extendedglob",
        "扩展通配",
        "zsh 通配",
        "setopt",
        "模式匹配",
        "^排除"
      ],
      "examples": [
        {
          "value": "setopt extendedglob\nls *.txt~*backup*",
          "description": "extendedglob 启用后，pattern~exclusion 表示匹配 pattern 但不匹配 exclusion 的文件",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "用户想列出除备份文件以外的所有 .txt 文件，需要排除模式",
          "goal": "使用 ^ 排除特定模式",
          "expected": "列出所有 .txt 文件，但不含文件名中包含 backup 的条目"
        }
      ],
      "id": "zsh-setopt-extendedglob"
    },
    {
      "cat": "flag",
      "cmd": "setopt share_history",
      "en": "Share history between all shells in real-time (Zsh)",
      "zh": "所有 Shell 实例实时共享历史记录（Zsh）",
      "context": "setopt builtin",
      "shell": {
        "layer": "option",
        "family": "zsh",
        "portability": "zsh",
        "topic": "config"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "share_history",
        "历史共享",
        "zsh 多会话",
        "实时历史",
        "setopt",
        "协作"
      ],
      "examples": [
        {
          "value": "setopt share_history",
          "description": "share_history 让所有 zsh 会话共享同一历史文件，新命令实时追加，其他会话可立即通过上下箭头访问",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "zsh-manual"
          ],
          "scenario": "用户打开多个 zsh 终端工作，希望在一个终端键入的命令立即出现在所有其他终端的历史中",
          "goal": "启用实时历史共享，方便跨终端操作",
          "expected": "在一个终端输入的命令，另外的终端按上箭头即可看到"
        }
      ],
      "id": "zsh-setopt-sharehistory"
    },
    {
      "cat": "flag",
      "cmd": "type -a",
      "en": "Display all locations of a command (aliases, functions, builtins, external files)",
      "zh": "显示命令的所有位置（别名、函数、内建命令、外部文件）",
      "context": "bash command lookup",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "type",
        "命令来源",
        "命令位置",
        "别名",
        "bash",
        "排查",
        "shell内建"
      ],
      "examples": [
        {
          "value": "type -a echo",
          "description": "type -a 会列出同名别名、函数、内建命令和外部文件的全路径，帮助排查命令覆盖问题。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "用户怀疑命令被别名或函数覆盖，想查看完整定义",
          "goal": "列出所有同名命令的变体",
          "expected": "输出类似 'echo is a shell builtin' 和 'echo is /bin/echo'"
        }
      ],
      "id": "shell-type-a-bash"
    },
    {
      "cat": "flag",
      "cmd": "command -v",
      "en": "Display the definition of a command (suitable for scripting)",
      "zh": "显示命令的定义（适合脚本中使用）",
      "context": "bash command lookup",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "command",
        "查找命令",
        "脚本",
        "bash",
        "排查",
        "which替代"
      ],
      "examples": [
        {
          "value": "command -v grep",
          "description": "command -v 会输出可用于执行的命令字符串，如果命令是别名则输出别名定义，否则输出文件路径。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "在脚本中检查一个命令是否存在，并希望获得统一的输出",
          "goal": "安全地获取命令路径或别名定义，不产生额外输出",
          "expected": "输出 'alias grep=...' 或 '/usr/bin/grep'"
        }
      ],
      "id": "shell-command-v-bash"
    },
    {
      "cat": "flag",
      "cmd": "hash -r",
      "en": "Clear the command hash table, forcing a PATH re-scan",
      "zh": "清除命令哈希表，强制重新搜索 PATH",
      "context": "bash command hash table",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "hash",
        "哈希表",
        "PATH",
        "命令缓存",
        "bash",
        "排查"
      ],
      "id": "shell-hash-r-bash"
    },
    {
      "cat": "flag",
      "cmd": "type -a",
      "en": "Display all locations of a command (zsh version)",
      "zh": "显示命令的所有位置（zsh 版）",
      "context": "zsh command lookup",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "type",
        "zsh",
        "命令来源",
        "命令位置",
        "排查"
      ],
      "id": "shell-type-a-zsh"
    },
    {
      "cat": "flag",
      "cmd": "whence -v",
      "en": "Display verbose command definition (similar to type)",
      "zh": "显示命令的详细定义（类似 type）",
      "context": "zsh command lookup",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "whence",
        "命令来源",
        "zsh",
        "排查",
        "详细"
      ],
      "id": "shell-whence-v-zsh"
    },
    {
      "cat": "flag",
      "cmd": "hash -r",
      "en": "Clear the command hash table (zsh)",
      "zh": "清除命令哈希表（zsh）",
      "context": "zsh command hash table",
      "shell": {
        "layer": "builtin",
        "family": "zsh",
        "portability": "zsh",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "hash",
        "zsh",
        "哈希表",
        "PATH",
        "命令缓存",
        "排查"
      ],
      "id": "shell-hash-r-zsh"
    },
    {
      "cat": "flag",
      "cmd": "set -x",
      "en": "Enable execution tracing; print each command and its arguments before execution",
      "zh": "启用命令跟踪，执行前打印每个命令及其展开后的参数",
      "context": "debug tracing",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "set -x",
        "调试",
        "跟踪",
        "xtrace",
        "脚本排错",
        "shell"
      ],
      "examples": [
        {
          "value": "#!/bin/sh\nset -x\necho \"Debug mode on\"\nls\nset +x",
          "description": "set -x 会使得 shell 在执行每个命令前，将命令及其展开后的参数输出到 stderr（通常以 + 开头）；set +x 关闭跟踪。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "需要了解脚本每一步执行了什么命令及其参数，用于定位错误",
          "goal": "开启命令跟踪模式",
          "expected": "终端输出以 '+' 开头的命令行，然后输出命令的实际结果"
        }
      ],
      "id": "shell-set-x"
    },
    {
      "cat": "flag",
      "cmd": "set -e",
      "en": "Exit immediately if a command exits with a non-zero status",
      "zh": "当命令以非零状态退出时立即退出脚本",
      "context": "exit on error",
      "shell": {
        "layer": "builtin",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "set -e",
        "错误退出",
        "errexit",
        "脚本安全",
        "陷阱",
        "shell"
      ],
      "examples": [
        {
          "value": "set -e; false; echo \"This line will never be printed\"",
          "description": "set -e 会使脚本中任何非零退出的命令（除特殊上下文外）立即终止。注意管道中的失败通常被忽略，除非同时使用 set -o pipefail。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "编写脚本时希望任何命令失败都立即停止，避免错误被传播",
          "goal": "启用错误时自动退出",
          "expected": "脚本在 false 之后退出，不会输出 echo 的内容",
          "caveat": "管道左侧命令失败不一定会触发退出；建议搭配 set -o pipefail。"
        }
      ],
      "id": "shell-set-e"
    },
    {
      "cat": "flag",
      "cmd": "set -o pipefail",
      "en": "Pipeline returns the status of the last command that failed, instead of the last command",
      "zh": "管道中任何命令失败则整条管道失败（在 set -e 脚本中防止管道错误被忽略）",
      "context": "pipe exit behavior",
      "shell": {
        "layer": "builtin",
        "family": "bash",
        "portability": "bash",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "pipefail",
        "管道失败",
        "set -e",
        "脚本安全",
        "bash",
        "脚本排错"
      ],
      "examples": [
        {
          "value": "set -eo pipefail; false | true; echo \"This will not be printed\"",
          "description": "默认情况下 set -e 只看管道最后一个命令的退出码；pipefail 让管道以失败命令的退出码作为整体退出码，使 set -e 能正确捕获管道内的失败。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "gnu-bash-manual"
          ],
          "scenario": "set -e 下希望管道中任何命令失败都立即终止脚本",
          "goal": "使管道错误能够被 set -e 捕获",
          "expected": "脚本不会打印 echo 的内容"
        }
      ],
      "id": "shell-pipefail"
    },
    {
      "cat": "shortcut",
      "cmd": "\\command",
      "en": "Bypass an alias by prefixing the command with a backslash",
      "zh": "在命令前加反斜杠临时绕过别名",
      "context": "bypass alias",
      "shell": {
        "layer": "syntax",
        "family": "posix-sh",
        "portability": "posix",
        "topic": "troubleshooting"
      },
      "evidenceStatus": "unverified",
      "keywords": [
        "别名绕过",
        "反斜杠",
        "命令遮蔽",
        "排查",
        "原始命令"
      ],
      "examples": [
        {
          "value": "\\ls",
          "description": "命令前加反斜杠会阻止别名替换，直接运行 PATH 中最先找到的同名命令。",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "scenario-derived",
          "sourceType": "official",
          "sourceIds": [
            "posix-shell-utilities"
          ],
          "scenario": "用户定义了 ls 别名，但偶尔想运行原生的 ls",
          "goal": "临时跳过别名",
          "expected": "执行未经过别名包装的原始 ls 命令"
        }
      ],
      "id": "shell-bypass-alias"
    }
  ]
};
