// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.
window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};
window.CHEATSHEET_DATA["homebrew"] = {
  "meta": {
    "id": "homebrew",
    "name": "Homebrew",
    "color": "#FBB040",
    "source": "Homebrew Documentation, GitHub repository, releases, and local help; compiled 2025-04-12",
    "builtIn": false,
    "updatePolicy": "version-driven",
    "verifiedVersion": "4.2.0",
    "contentCheckedAt": "2026-06-29",
    "sourceCheckedAt": "2026-06-29",
    "sourceUrl": "https://docs.brew.sh",
    "sourceTier": "official",
    "coverage": "核心命令与常用选项：install, uninstall, search, info, list, update, upgrade, outdated, pin, unpin, cleanup, doctor, config, --version, --help 以及部分关键选项如 --cask, --dry-run, --desc",
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
        "lastVerifiedAt": "2025-04-12",
        "version": "current"
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
        "checkedAt": "2025-04-12",
        "url": "https://docs.brew.sh",
        "lastVerifiedAt": "2025-04-12"
      }
    ],
    "verificationStatus": "model-knowledge"
  },
  "items": [
    {
      "cat": "flag",
      "cmd": "brew install",
      "en": "Install a formula or cask",
      "zh": "安装软件包（formula）或 cask",
      "evidenceStatus": "unverified",
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
      "id": "brew-install"
    },
    {
      "cat": "flag",
      "cmd": "brew install --cask",
      "en": "Install a GUI application via cask",
      "zh": "安装图形界面应用（cask）",
      "context": "install",
      "evidenceStatus": "unverified",
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
      "id": "brew-install-cask"
    },
    {
      "cat": "flag",
      "cmd": "brew install --dry-run",
      "en": "Show what would be installed without actually installing",
      "zh": "模拟安装，显示将执行的操作但不实际安装",
      "context": "install",
      "evidenceStatus": "unverified",
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
      "id": "brew-install-dry-run"
    },
    {
      "cat": "flag",
      "cmd": "brew uninstall",
      "en": "Uninstall a formula or cask",
      "zh": "卸载软件包或 cask",
      "evidenceStatus": "unverified",
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
      "id": "brew-uninstall"
    },
    {
      "cat": "flag",
      "cmd": "brew search",
      "en": "Search for formulas and casks",
      "zh": "搜索可用的软件包或 cask",
      "evidenceStatus": "unverified",
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
      "id": "brew-search"
    },
    {
      "cat": "flag",
      "cmd": "brew search --desc",
      "en": "Search descriptions in addition to names",
      "zh": "同时搜索包描述信息",
      "context": "search",
      "evidenceStatus": "unverified",
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
      "id": "brew-search-desc"
    },
    {
      "cat": "flag",
      "cmd": "brew info",
      "en": "Display information about a formula or cask",
      "zh": "查看软件包的详细信息",
      "evidenceStatus": "unverified",
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
      "id": "brew-info"
    },
    {
      "cat": "flag",
      "cmd": "brew list",
      "en": "List installed formulas and casks",
      "zh": "列出已安装的软件包",
      "evidenceStatus": "unverified",
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
      "id": "brew-list"
    },
    {
      "cat": "flag",
      "cmd": "brew update",
      "en": "Fetch the newest version of Homebrew and all formulae",
      "zh": "更新 Homebrew 自身以及所有 formula 的元数据",
      "evidenceStatus": "unverified",
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
      "id": "brew-update"
    },
    {
      "cat": "flag",
      "cmd": "brew upgrade",
      "en": "Upgrade outdated formulas and casks",
      "zh": "升级过时的软件包和 cask",
      "evidenceStatus": "unverified",
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
      "id": "brew-upgrade"
    },
    {
      "cat": "flag",
      "cmd": "brew outdated",
      "en": "List formulas and casks that have an updated version available",
      "zh": "列出所有有更新版本的软件包",
      "evidenceStatus": "unverified",
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
      "id": "brew-outdated"
    },
    {
      "cat": "flag",
      "cmd": "brew pin",
      "en": "Pin a formula to prevent it from being upgraded",
      "zh": "固定版本，防止某软件包被升级",
      "evidenceStatus": "unverified",
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
      "id": "brew-pin"
    },
    {
      "cat": "flag",
      "cmd": "brew unpin",
      "en": "Unpin a formula to allow upgrades again",
      "zh": "取消固定，允许再次升级",
      "evidenceStatus": "unverified",
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
      "id": "brew-unpin"
    },
    {
      "cat": "flag",
      "cmd": "brew cleanup",
      "en": "Remove old versions of installed formulas and clean caches",
      "zh": "移除旧版本软件包并清理缓存文件",
      "evidenceStatus": "unverified",
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
      "id": "brew-cleanup"
    },
    {
      "cat": "flag",
      "cmd": "brew cleanup --dry-run",
      "en": "Show what would be removed without actually deleting",
      "zh": "模拟清理，显示要删除的文件而不真正执行",
      "context": "cleanup",
      "evidenceStatus": "unverified",
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
      "id": "brew-cleanup-dry-run"
    },
    {
      "cat": "flag",
      "cmd": "brew doctor",
      "en": "Check your Homebrew installation for potential problems",
      "zh": "检查 Homebrew 安装是否存在问题",
      "evidenceStatus": "unverified",
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
      "id": "brew-doctor"
    },
    {
      "cat": "flag",
      "cmd": "brew config",
      "en": "Display Homebrew and system configuration",
      "zh": "显示 Homebrew 和系统配置信息",
      "evidenceStatus": "unverified",
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
      "id": "brew-config"
    },
    {
      "cat": "flag",
      "cmd": "brew --version",
      "en": "Print the version number of Homebrew",
      "zh": "显示 Homebrew 版本号",
      "evidenceStatus": "unverified",
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
      "id": "brew-version"
    },
    {
      "cat": "flag",
      "cmd": "brew --help",
      "en": "Show help for brew commands",
      "zh": "显示 brew 命令帮助信息",
      "evidenceStatus": "unverified",
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
      "id": "brew-help"
    }
  ]
};
