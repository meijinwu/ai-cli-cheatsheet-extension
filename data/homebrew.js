// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["homebrew"] = {
  "meta": {
    "id": "homebrew",
    "name": "Homebrew",
    "color": "#FBB040",
    "source": "Homebrew Documentation (docs.brew.sh/Manpage) and local `brew help` output; verified 2026-07-02",
    "builtIn": false,
    "updatePolicy": "version-driven",
    "verifiedVersion": "5.1.14",
    "contentCheckedAt": "2026-07-02",
    "sourceCheckedAt": "2026-07-02",
    "sourceUrl": "https://docs.brew.sh",
    "sourceTier": "official",
    "coverage": "核心命令与常用选项：install/uninstall/search/info/list/update/upgrade/outdated/pin/unpin/cleanup/doctor/config/services/tap/bundle/autoremove/deps/uses/leaves/link/reinstall 等，以及 --cask、--dry-run、--desc、--zap、--tree、--installed 等关键选项",
    "platforms": [
      "mac",
      "linux"
    ],
    "order": 999,
    "sources": [
      {
        "id": "brew-help",
        "title": "`brew --help` output",
        "kind": "local-help",
        "maintainer": "Homebrew",
        "evidenceTier": "first-party",
        "purposes": [
          "command-existence",
          "option-semantics",
          "examples"
        ],
        "lastVerifiedAt": "2026-07-02",
        "version": "5.1.14"
      },
      {
        "id": "brew-docs",
        "title": "Homebrew Documentation",
        "kind": "official-doc",
        "maintainer": "Homebrew",
        "evidenceTier": "first-party",
        "purposes": [
          "option-semantics",
          "examples",
          "cross-check"
        ],
        "resolvedUrl": "https://docs.brew.sh/",
        "pageTitle": "Homebrew Documentation",
        "checkedAt": "2026-07-02",
        "url": "https://docs.brew.sh",
        "lastVerifiedAt": "2026-07-02"
      }
    ],
    "verificationStatus": "manual"
  },
  "items": [
    {
      "cat": "flag",
      "cmd": "brew install",
      "en": "Install a formula or cask",
      "zh": "安装软件包（formula）或 cask",
      "evidenceStatus": "verified",
      "keywords": [
        "install",
        "package",
        "formula",
        "cask",
        "homebrew"
      ],
      "examples": [
        {
          "value": "brew install wget",
          "description": "从 Homebrew 仓库获取 wget 的 formula，下载并安装最新版本（若存在预编译 bottle 则直接使用）",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "用户需要安装 wget 命令行下载工具",
          "goal": "安装 wget",
          "expected": "wget 安装到 /usr/local/bin（或 Homebrew 前缀），可直接运行 wget"
        },
        {
          "value": "brew install git node",
          "description": "在一条命令中列出多个 formula，依次安装",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "安装多个包，例如 git 和 node",
          "goal": "一次性安装 git 和 node",
          "expected": "git 和 node 均已安装并可在 PATH 中调用"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-install",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · install",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help install（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew install --cask",
      "en": "Install a GUI application via cask",
      "zh": "安装图形界面应用（cask）",
      "context": "install",
      "evidenceStatus": "verified",
      "keywords": [
        "install",
        "cask",
        "gui",
        "application",
        "homebrew"
      ],
      "examples": [
        {
          "value": "brew install --cask google-chrome",
          "description": "指定 --cask 选项安装 GUI 应用，cask 会将其放置到 /Applications 目录",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "用户要在 macOS 上安装 Google Chrome 浏览器",
          "goal": "安装 Chrome cask",
          "expected": "Google Chrome 出现在 /Applications 中，可从启动台打开"
        }
      ],
      "platforms": [
        "mac"
      ],
      "id": "brew-install-cask",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · install --cask",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help install（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew install --dry-run",
      "en": "Show what would be installed without actually installing",
      "zh": "模拟安装，显示将执行的操作但不实际安装",
      "context": "install",
      "evidenceStatus": "verified",
      "keywords": [
        "install",
        "dry-run",
        "simulate",
        "preview"
      ],
      "examples": [
        {
          "value": "brew install --dry-run wget",
          "description": "列出将要安装的包及其依赖，但不进行实际下载和安装",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "不确定安装 wget 会引入哪些依赖，想提前查看",
          "goal": "预览安装影响",
          "expected": "终端输出一系列将要安装的 formula 列表，不改变系统"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-install-dry-run",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · install --dry-run",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help install（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew uninstall",
      "en": "Uninstall a formula or cask",
      "zh": "卸载软件包或 cask",
      "evidenceStatus": "verified",
      "keywords": [
        "uninstall",
        "remove",
        "delete",
        "package"
      ],
      "examples": [
        {
          "value": "brew uninstall wget",
          "description": "移除 wget 可执行文件及相关关联文件，并提示是否删除未使用的依赖",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "不再需要 wget，要彻底移除",
          "goal": "卸载 wget",
          "expected": "wget 被移除，终端可能提示 orphan 依赖可用 brew autoremove 清理"
        },
        {
          "value": "brew uninstall node python",
          "description": "一次指定多个 formula 卸载",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "同时卸载多个包",
          "goal": "卸载 node 和 python",
          "expected": "node 和 python 均被移除"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-uninstall",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · uninstall",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help uninstall（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew search",
      "en": "Search for formulas and casks",
      "zh": "搜索可用的软件包或 cask",
      "evidenceStatus": "verified",
      "keywords": [
        "search",
        "find",
        "package",
        "formula",
        "cask"
      ],
      "examples": [
        {
          "value": "brew search python",
          "description": "列出名称中包含 python 的所有 formula 和 cask",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想知道是否有 python 相关的包",
          "goal": "查找 python 相关的 formula",
          "expected": "打印一系列名称，如 python@3.9, python@3.10 等"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-search",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · search",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help search（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew search --desc",
      "en": "Search descriptions in addition to names",
      "zh": "同时搜索包描述信息",
      "context": "search",
      "evidenceStatus": "verified",
      "keywords": [
        "search",
        "description",
        "find",
        "package"
      ],
      "examples": [
        {
          "value": "brew search --desc json",
          "description": "在 formula 和 cask 的名称与描述中匹配 json",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想找处理 JSON 的工具，但不记得确切名称",
          "goal": "搜索描述中包含 JSON 的包",
          "expected": "返回名称或描述包含 json 的包列表，如 jq、jsonpp 等"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-search-desc",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · search --desc",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help search（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew info",
      "en": "Display information about a formula or cask",
      "zh": "查看软件包的详细信息",
      "evidenceStatus": "verified",
      "keywords": [
        "info",
        "details",
        "package",
        "formula",
        "cask"
      ],
      "examples": [
        {
          "value": "brew info wget",
          "description": "显示 wget 的安装状态、上游 URL、依赖、版本等",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "安装前想查看 wget 的版本、依赖和描述",
          "goal": "查看 wget 的详细信息",
          "expected": "输出包括稳定版版本、头部版本、是否有 bottle、安装大小等"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-info",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · info",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help info（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew list",
      "en": "List installed formulas and casks",
      "zh": "列出已安装的软件包",
      "evidenceStatus": "verified",
      "keywords": [
        "list",
        "installed",
        "packages",
        "formula"
      ],
      "examples": [
        {
          "value": "brew list",
          "description": "打印已安装 formula 的名称，每个一行",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想看看系统上通过 Homebrew 安装了哪些软件",
          "goal": "列出所有已安装的 formula",
          "expected": "输出包括 git, node, wget 等已装包"
        },
        {
          "value": "brew list git",
          "description": "显示 git 包包含的二进制、手册页等文件列表",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "需要知道某个特定包安装了哪些文件",
          "goal": "列出 git 安装的所有文件路径",
          "expected": "列出 git 相关的可执行文件、补全脚本等路径"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-list",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · list",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help list（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew update",
      "en": "Fetch the newest version of Homebrew and all formulae",
      "zh": "更新 Homebrew 自身以及所有 formula 的元数据",
      "evidenceStatus": "verified",
      "keywords": [
        "update",
        "metabata",
        "sync",
        "homebrew"
      ],
      "examples": [
        {
          "value": "brew update",
          "description": "从远端拉取 Homebrew 核心仓库和已添加 tap 的变更，不升级软件本身",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "在安装新软件或升级前，同步最新的仓库信息",
          "goal": "更新 Homebrew 仓库索引",
          "expected": "输出 updated 的 tap 列表，可能提示哪些 tap 有更新"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-update",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · update",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help update（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew upgrade",
      "en": "Upgrade outdated formulas and casks",
      "zh": "升级过时的软件包和 cask",
      "evidenceStatus": "verified",
      "keywords": [
        "upgrade",
        "update",
        "packages",
        "outdated"
      ],
      "examples": [
        {
          "value": "brew upgrade",
          "description": "检查所有已安装 formula，如果存在更新版本则进行安装",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "更新所有已过时的包到最新版本",
          "goal": "批量升级所有 formula",
          "expected": "依次下载并安装每个包的最新版，可能包含编译或 bottle"
        },
        {
          "value": "brew upgrade git",
          "description": "指定包名，只升级该包及其依赖（如果有需要）",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "只想升级 git 这一个包",
          "goal": "仅升级 git",
          "expected": "git 升级到最新版本，其他包保持不变"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-upgrade",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · upgrade",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help upgrade（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew outdated",
      "en": "List formulas and casks that have an updated version available",
      "zh": "列出所有有更新版本的软件包",
      "evidenceStatus": "verified",
      "keywords": [
        "outdated",
        "check",
        "update",
        "versions"
      ],
      "examples": [
        {
          "value": "brew outdated",
          "description": "对比本地安装版本与远程最新版本，列出过时包",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "在决定是否升级前，先检查哪些包可以更新",
          "goal": "查看可更新的软件列表",
          "expected": "输出过时包的名称，如 git (2.39.0) < 2.40.0"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-outdated",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · outdated",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help outdated（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew pin",
      "en": "Pin a formula to prevent it from being upgraded",
      "zh": "固定版本，防止某软件包被升级",
      "evidenceStatus": "verified",
      "keywords": [
        "pin",
        "hold",
        "version",
        "freeze"
      ],
      "examples": [
        {
          "value": "brew pin node@14",
          "description": "将 node@14 标记为固定，后续 brew upgrade 会跳过它",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "某个项目依赖 Node.js 14，不希望在全局升级时意外升到 16",
          "goal": "固定 node@14 版本",
          "expected": "执行后无直接输出；下次 brew upgrade 时该包不会被更新"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-pin",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · pin",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help pin（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew unpin",
      "en": "Unpin a formula to allow upgrades again",
      "zh": "取消固定，允许再次升级",
      "evidenceStatus": "verified",
      "keywords": [
        "unpin",
        "release",
        "version",
        "upgrade"
      ],
      "examples": [
        {
          "value": "brew unpin node@14",
          "description": "移除固定标记，下次 brew upgrade 将包含该包",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "Node.js 项目升级到 16 后，可以让 node@14 正常升级",
          "goal": "解除对 node@14 的固定",
          "expected": "命令无输出，但之后 brew outdated 会重新显示该包（如有更新）"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-unpin",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · unpin",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help unpin（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew cleanup",
      "en": "Remove old versions of installed formulas and clean caches",
      "zh": "移除旧版本软件包并清理缓存文件",
      "evidenceStatus": "verified",
      "keywords": [
        "clean",
        "remove",
        "old",
        "cache",
        "space"
      ],
      "examples": [
        {
          "value": "brew cleanup",
          "description": "删除已安装 formula 的旧版本以及下载的 bottle/cache 文件",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "磁盘空间不足，想清理 Homebrew 留存的旧版本和下载缓存",
          "goal": "清理所有旧版本和缓存",
          "expected": "Terminal 输出移除的旧版本信息，并提示释放了多少空间"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-cleanup",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · cleanup",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help cleanup（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew cleanup --dry-run",
      "en": "Show what would be removed without actually deleting",
      "zh": "模拟清理，显示要删除的文件而不真正执行",
      "context": "cleanup",
      "evidenceStatus": "verified",
      "keywords": [
        "cleanup",
        "dry-run",
        "preview",
        "simulate"
      ],
      "examples": [
        {
          "value": "brew cleanup --dry-run",
          "description": "列出所有将被移除的旧版本和缓存文件路径，但不进行实际删除",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "不确定清理会删除多少数据，想先预览",
          "goal": "查看将被清理的文件列表",
          "expected": "打印出将删除的文件路径和总大小"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-cleanup-dry-run",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · cleanup --dry-run",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help cleanup（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew doctor",
      "en": "Check your Homebrew installation for potential problems",
      "zh": "检查 Homebrew 安装是否存在问题",
      "evidenceStatus": "verified",
      "keywords": [
        "doctor",
        "diagnose",
        "troubleshoot",
        "check"
      ],
      "examples": [
        {
          "value": "brew doctor",
          "description": "运行一系列检查，报告可能的问题并给出修复建议",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "brew 命令执行异常或安装后提示权限警告",
          "goal": "诊断 Homebrew 配置和环境",
          "expected": "可能输出 warnings，如权限问题、Xcode 缺失等，如果没有问题会显示 Your system is ready to brew."
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-doctor",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · doctor",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help doctor（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew config",
      "en": "Display Homebrew and system configuration",
      "zh": "显示 Homebrew 和系统配置信息",
      "evidenceStatus": "verified",
      "keywords": [
        "config",
        "settings",
        "environment",
        "debug"
      ],
      "examples": [
        {
          "value": "brew config",
          "description": "打印 HOMEBREW_PREFIX, HOMEBREW_REPOSITORY, 编译器, macOS版本等信息",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "需要了解 Homebrew 的前缀路径或使用的 Ruby 版本",
          "goal": "查看 Homebrew 当前配置",
          "expected": "输出环境变量和系统信息，可用于上报问题"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-config",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · config",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help config（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew --version",
      "en": "Print the version number of Homebrew",
      "zh": "显示 Homebrew 版本号",
      "evidenceStatus": "verified",
      "keywords": [
        "version",
        "release",
        "homebrew"
      ],
      "examples": [
        {
          "value": "brew --version",
          "description": "输出 Homebrew 当前版本号，如 Homebrew 4.2.0",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "确认当前安装的 Homebrew 版本，以便报告 bug 或确认是否支持某个特性",
          "goal": "检查 Homebrew 版本",
          "expected": "终端显示一行类似 Homebrew 4.2.0 的版本信息"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-version",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · --version",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew --version（本机 Homebrew 5.1.14 实际执行）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew --help",
      "en": "Show help for brew commands",
      "zh": "显示 brew 命令帮助信息",
      "evidenceStatus": "verified",
      "keywords": [
        "help",
        "usage",
        "documentation",
        "commands"
      ],
      "examples": [
        {
          "value": "brew --help",
          "description": "打印 brew 支持的所有子命令和常用选项摘要",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help"
          ],
          "scenario": "忘记某个子命令的用法，想查看概览",
          "goal": "获取全部命令列表",
          "expected": "输出包括 install, uninstall, search 等命令的简要说明"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "id": "brew-help",
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · help",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help help（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ]
    },
    {
      "cat": "flag",
      "cmd": "brew services",
      "en": "Manage background services",
      "zh": "管理后台服务（启动/停止/开机自启）",
      "evidenceStatus": "verified",
      "keywords": [
        "services",
        "daemon",
        "start",
        "stop",
        "launchd"
      ],
      "examples": [
        {
          "value": "brew services list",
          "description": "列出所有由 Homebrew 管理的后台服务及其运行状态（started/stopped/error）",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想确认 postgresql、redis 等服务是否在运行。",
          "goal": "查看全部服务状态。",
          "expected": "输出服务名、状态、用户和配置文件路径的表格"
        },
        {
          "value": "brew services start postgresql@16",
          "description": "启动服务并注册为登录时自动启动（macOS 用 launchd，Linux 用 systemd）",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "本地开发需要一个常驻的 PostgreSQL。",
          "goal": "启动 postgresql@16 并设置自启。",
          "expected": "服务开始运行，`brew services list` 显示 started"
        },
        {
          "value": "brew services stop postgresql@16",
          "description": "停止服务并取消开机自启",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "暂时不需要数据库服务，想释放资源。",
          "goal": "停止 postgresql@16。",
          "expected": "服务停止，状态变为 stopped（none）"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · services",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help services（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-services"
    },
    {
      "cat": "flag",
      "cmd": "brew tap",
      "en": "Add a formula repository",
      "zh": "添加第三方软件仓库（tap）",
      "evidenceStatus": "verified",
      "keywords": [
        "tap",
        "repository",
        "third-party",
        "source"
      ],
      "examples": [
        {
          "value": "brew tap hashicorp/tap",
          "description": "添加 GitHub 上的第三方 tap（形如 user/repo，对应 github.com/user/homebrew-repo），之后即可安装其中的 formula",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "要安装的工具不在官方仓库，而在厂商自己的 tap 里。",
          "goal": "添加 hashicorp/tap 仓库。",
          "expected": "tap 被克隆到本地，`brew install hashicorp/tap/terraform` 可用"
        },
        {
          "value": "brew tap",
          "description": "不带参数时列出当前已添加的所有 tap",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想检查本机添加过哪些第三方仓库。",
          "goal": "列出全部 tap。",
          "expected": "输出已 tap 的仓库列表"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · tap",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help tap（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-tap"
    },
    {
      "cat": "flag",
      "cmd": "brew untap",
      "en": "Remove a tapped repository",
      "zh": "移除已添加的 tap 仓库",
      "evidenceStatus": "verified",
      "keywords": [
        "untap",
        "remove",
        "repository",
        "cleanup"
      ],
      "examples": [
        {
          "value": "brew untap hashicorp/tap",
          "description": "移除之前添加的 tap；如果仍有来自该 tap 的已安装 formula，会给出提示",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "不再使用某个第三方仓库，想保持 tap 列表干净。",
          "goal": "移除 hashicorp/tap。",
          "expected": "该 tap 从本地删除，`brew tap` 不再列出它"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · untap",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help untap（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-untap"
    },
    {
      "cat": "flag",
      "cmd": "brew bundle",
      "en": "Install or dump packages from a Brewfile",
      "zh": "用 Brewfile 批量安装/导出软件包",
      "evidenceStatus": "verified",
      "keywords": [
        "bundle",
        "brewfile",
        "backup",
        "batch",
        "migrate"
      ],
      "examples": [
        {
          "value": "brew bundle dump --file=~/Brewfile",
          "description": "把当前安装的所有 formula、cask、tap 导出为一个 Brewfile 清单，可用于备份或迁移到新机器",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "换新电脑前想记录现在装过的全部软件。",
          "goal": "导出安装清单到 ~/Brewfile。",
          "expected": "生成包含 tap/brew/cask 条目的 Brewfile 文本文件"
        },
        {
          "value": "brew bundle install --file=~/Brewfile",
          "description": "按 Brewfile 清单批量安装其中列出的所有软件包，已安装的会跳过",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "在新机器上按备份清单一次性恢复所有软件。",
          "goal": "按 Brewfile 批量安装。",
          "expected": "清单中缺失的 formula/cask 被依次安装"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · bundle",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help bundle（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-bundle"
    },
    {
      "cat": "flag",
      "cmd": "brew autoremove",
      "en": "Remove unneeded dependencies",
      "zh": "卸载不再被依赖的软件包",
      "evidenceStatus": "verified",
      "keywords": [
        "autoremove",
        "dependencies",
        "cleanup",
        "orphan"
      ],
      "examples": [
        {
          "value": "brew autoremove --dry-run",
          "description": "先预览将被卸载的孤儿依赖（仅作为依赖安装、现已无人依赖的 formula），确认无误后再去掉 --dry-run 实际执行",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "卸载过一些软件后想清理它们残留的依赖。",
          "goal": "找出并移除孤儿依赖。",
          "expected": "列出将被卸载的 formula；去掉 --dry-run 后实际卸载",
          "caveat": "建议先用 --dry-run 检查清单，避免误删自己直接使用但未显式安装的工具。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · autoremove",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help autoremove（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-autoremove"
    },
    {
      "cat": "flag",
      "cmd": "brew deps",
      "en": "Show dependencies for a formula",
      "zh": "查看软件包的依赖",
      "evidenceStatus": "verified",
      "keywords": [
        "deps",
        "dependencies",
        "tree",
        "requirement"
      ],
      "examples": [
        {
          "value": "brew deps --tree ffmpeg",
          "description": "以树状结构展示 ffmpeg 的完整依赖层级，直观看到间接依赖",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "安装 ffmpeg 前想了解它会连带装多少东西。",
          "goal": "查看 ffmpeg 的依赖树。",
          "expected": "输出缩进树形的依赖列表"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · deps --tree",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help deps（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-deps"
    },
    {
      "cat": "flag",
      "cmd": "brew uses",
      "en": "Show packages that depend on a formula",
      "zh": "查看哪些软件包依赖指定 formula",
      "evidenceStatus": "verified",
      "keywords": [
        "uses",
        "reverse",
        "dependencies",
        "depend"
      ],
      "examples": [
        {
          "value": "brew uses --installed openssl@3",
          "description": "列出已安装的包中依赖 openssl@3 的有哪些；卸载底层库之前先用它确认影响面",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想卸载 openssl@3，但不确定会不会破坏其他软件。",
          "goal": "查看 openssl@3 的已安装反向依赖。",
          "expected": "输出依赖它的已安装 formula 列表"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · uses --installed",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help uses（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-uses"
    },
    {
      "cat": "flag",
      "cmd": "brew leaves",
      "en": "List top-level installed formulae",
      "zh": "列出非依赖的顶层软件包",
      "evidenceStatus": "verified",
      "keywords": [
        "leaves",
        "top-level",
        "installed",
        "list"
      ],
      "examples": [
        {
          "value": "brew leaves",
          "description": "只列出你主动安装、且不是其他包依赖的 formula，是整理和精简安装清单的起点",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想回顾自己到底主动装过哪些工具。",
          "goal": "列出顶层安装的 formula。",
          "expected": "输出不被任何已安装包依赖的 formula 名单"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · leaves",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help leaves（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-leaves"
    },
    {
      "cat": "flag",
      "cmd": "brew link",
      "en": "Symlink a formula into the prefix",
      "zh": "把 formula 链接进 Homebrew 前缀",
      "evidenceStatus": "verified",
      "keywords": [
        "link",
        "symlink",
        "path",
        "activate"
      ],
      "examples": [
        {
          "value": "brew link python@3.12",
          "description": "为该 formula 的可执行文件、库等在 Homebrew 前缀（如 /opt/homebrew/bin）建立符号链接，使其进入 PATH",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "装了 keg-only 版本或此前 unlink 过，现在想让它可直接调用。",
          "goal": "把 python@3.12 链接进 PATH。",
          "expected": "python3.12 等命令出现在 Homebrew bin 目录",
          "caveat": "遇到链接冲突时先用 `brew link --dry-run` 检查将要覆盖的文件，再决定是否加 --overwrite。"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · link",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help link（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-link"
    },
    {
      "cat": "flag",
      "cmd": "brew unlink",
      "en": "Remove symlinks for a formula",
      "zh": "临时移除 formula 的链接",
      "evidenceStatus": "verified",
      "keywords": [
        "unlink",
        "symlink",
        "switch",
        "version"
      ],
      "examples": [
        {
          "value": "brew unlink node",
          "description": "移除该 formula 在前缀里的符号链接但保留安装本体；常用于在多个版本之间切换",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想临时改用另一个版本的 node。",
          "goal": "把当前 node 从 PATH 中摘除。",
          "expected": "node 命令不再指向该 formula；`brew link` 可随时恢复"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · unlink",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help unlink（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-unlink"
    },
    {
      "cat": "flag",
      "cmd": "brew reinstall",
      "en": "Uninstall then install again",
      "zh": "重装软件包（先卸载再安装）",
      "evidenceStatus": "verified",
      "keywords": [
        "reinstall",
        "repair",
        "rebuild",
        "fix"
      ],
      "examples": [
        {
          "value": "brew reinstall wget",
          "description": "按当前版本把 formula 卸载后重新安装，常用于修复损坏的安装或应用新的编译选项",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "某个工具运行异常，怀疑安装文件损坏。",
          "goal": "重装 wget。",
          "expected": "wget 被重新安装为同一版本，文件恢复完整"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · reinstall",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help reinstall（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-reinstall"
    },
    {
      "cat": "flag",
      "cmd": "brew --prefix",
      "en": "Print Homebrew install prefix",
      "zh": "显示 Homebrew 安装前缀路径",
      "evidenceStatus": "verified",
      "keywords": [
        "prefix",
        "path",
        "location",
        "directory"
      ],
      "examples": [
        {
          "value": "brew --prefix openssl@3",
          "description": "输出指定 formula 的安装路径；不带参数时输出 Homebrew 本身的前缀（Apple Silicon 为 /opt/homebrew）。常用于配置编译环境变量",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "编译项目时需要引用 openssl 的头文件和库路径。",
          "goal": "取得 openssl@3 的安装路径。",
          "expected": "输出类似 /opt/homebrew/opt/openssl@3 的路径"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · --prefix",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help --prefix（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-prefix"
    },
    {
      "cat": "flag",
      "cmd": "brew home",
      "en": "Open a formula's homepage",
      "zh": "打开软件包官网",
      "evidenceStatus": "verified",
      "keywords": [
        "home",
        "homepage",
        "website",
        "docs"
      ],
      "examples": [
        {
          "value": "brew home jq",
          "description": "在默认浏览器中打开该 formula 或 cask 的官方主页，方便查文档",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "想看某个工具的官方文档和用法说明。",
          "goal": "打开 jq 的官网。",
          "expected": "浏览器打开 jq 的项目主页"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · home",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help home（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-home"
    },
    {
      "cat": "flag",
      "cmd": "brew uninstall --zap",
      "en": "Uninstall a cask and all its files",
      "zh": "深度卸载 cask 及其所有相关文件",
      "evidenceStatus": "verified",
      "keywords": [
        "zap",
        "uninstall",
        "purge",
        "leftover",
        "cask"
      ],
      "examples": [
        {
          "value": "brew uninstall --cask --zap some-app",
          "description": "卸载 cask 的同时按其 zap 清单删除偏好设置、缓存、日志等所有相关文件，相当于彻底清除",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "彻底移除一个不再使用的应用，不留配置残余。",
          "goal": "深度卸载该应用。",
          "expected": "应用本体与 zap 清单列出的配置/缓存文件都被删除",
          "caveat": "执行前先用 `brew info --cask some-app` 检查其 zap 清单，确认没有要保留的数据。",
          "warning": "会删除应用的全部相关数据（偏好设置、缓存、可能包含用户数据），且不可恢复。",
          "riskLevels": [
            "deleteOrOverwrite"
          ]
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · uninstall --zap",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help uninstall（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-uninstall-zap"
    },
    {
      "cat": "flag",
      "cmd": "brew analytics",
      "en": "Control anonymous analytics",
      "zh": "查看或关闭匿名使用统计",
      "evidenceStatus": "verified",
      "keywords": [
        "analytics",
        "privacy",
        "telemetry",
        "opt-out"
      ],
      "examples": [
        {
          "value": "brew analytics off",
          "description": "关闭 Homebrew 的匿名使用数据收集；`brew analytics` 不带参数可查看当前状态",
          "copyable": true,
          "authorship": "editorial",
          "evidenceTier": "first-party",
          "adaptation": "adapted",
          "sourceType": "official",
          "sourceIds": [
            "brew-help",
            "brew-docs"
          ],
          "scenario": "不希望本机的安装行为被匿名统计上报。",
          "goal": "关闭 analytics。",
          "expected": "统计被关闭，`brew analytics` 显示 disabled"
        }
      ],
      "platforms": [
        "mac",
        "linux"
      ],
      "evidenceRefs": [
        {
          "sourceId": "brew-docs",
          "claims": [
            "existence",
            "semantics"
          ],
          "locator": "https://docs.brew.sh/Manpage · analytics",
          "checkedAt": "2026-07-02"
        },
        {
          "sourceId": "brew-help",
          "claims": [
            "existence"
          ],
          "locator": "brew help analytics（本机 Homebrew 5.1.14）",
          "checkedAt": "2026-07-02"
        }
      ],
      "id": "brew-analytics"
    }
  ]
};
