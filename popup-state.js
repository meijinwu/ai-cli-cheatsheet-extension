"use strict";

(function initPopupState(globalScope) {
  const STORAGE_KEYS = ["favourites", "recentCopies", "enabledTools", "platform", "onboarded", "lastQuery", "pendingUpdate", "lastQualityWarnings", "webVerify", "dismissedRecommendations", "aiRecommendations"];
  const CAT_LABEL = { shortcut: "⌨ 快捷键", slash: "› 命令", flag: "⚑ 参数/选项" };
  const SHELL_FILTER_LABELS = {
    layer: {
      syntax: "语法",
      keyword: "关键字",
      builtin: "内置命令",
      option: "选项",
      shortcut: "快捷键",
      config: "配置",
    },
    portability: {
      posix: "POSIX",
      bash: "Bash",
      zsh: "Zsh",
      "cross-platform": "跨平台",
    },
    topic: {
      builtins: "内置",
      syntax: "语法",
      shortcuts: "快捷键",
      config: "配置",
      environment: "环境变量",
      history: "历史",
      completion: "补全",
      scripting: "脚本",
      jobs: "作业",
      troubleshooting: "排错",
    },
  };
  const GROUP_INITIAL_LIMIT = 20;
  const SEARCH_INITIAL_LIMIT = 100;
  const SEARCH_DEBOUNCE_MS = 120;
  const TOOL_PRESETS = {
    ai: ["claude-code", "codex", "gemini-cli", "antigravity-cli", "opencode", "openclaw"],
    editors: ["cursor", "vs-code", "idea", "typora"],
    terminal: ["git", "linux", "shell"],
  };
  const RECOMMENDATION_CATEGORIES = [
    { key: "all", label: "全部" },
    { key: "terminal", label: "终端" },
    { key: "cli-utility", label: "命令行增强" },
    { key: "package-manager", label: "包管理器" },
    { key: "language-toolchain", label: "语言工具链" },
    { key: "cloud-native", label: "容器/云原生" },
    { key: "dev-env", label: "开发环境" },
  ];
  const TOOL_RECOMMENDATIONS = [
    {
      tool: "ghostty",
      displayName: "Ghostty",
      platforms: ["mac", "linux"],
      category: "终端模拟器",
      categoryKey: "terminal",
      priority: 10,
      reason: "现代 GPU 终端，适合常用快捷键、配置和会话操作速查。",
      tags: ["terminal", "config", "shortcuts"],
      useCases: ["终端", "配置", "快捷键", "会话"],
      homepage: "https://ghostty.org",
      related: ["iterm2", "shell"],
      preferWeb: true,
    },
    {
      tool: "warp",
      displayName: "Warp",
      platforms: ["mac"],
      category: "AI 终端",
      categoryKey: "terminal",
      priority: 20,
      reason: "交互式终端和 AI 工作流常用，适合补充命令面板与快捷键。",
      tags: ["terminal", "ai", "workflow"],
      useCases: ["AI 工作流", "终端", "命令面板", "快捷键"],
      homepage: "https://www.warp.dev",
      related: ["iterm2", "shell"],
      preferWeb: true,
    },
    {
      tool: "wezterm",
      displayName: "WezTerm",
      platforms: ["mac", "linux"],
      category: "终端模拟器",
      categoryKey: "terminal",
      priority: 30,
      reason: "跨平台终端，配置、窗格、标签页和快捷键值得整理。",
      tags: ["terminal", "cross-platform", "config"],
      homepage: "https://wezterm.org",
      related: ["iterm2", "shell"],
      preferWeb: true,
    },
    {
      tool: "alacritty",
      displayName: "Alacritty",
      platforms: ["mac", "linux"],
      category: "终端模拟器",
      categoryKey: "terminal",
      priority: 40,
      reason: "轻量终端，适合整理配置文件、快捷键和常用启动方式。",
      tags: ["terminal", "config"],
      homepage: "https://alacritty.org",
      related: ["iterm2", "shell"],
      preferWeb: true,
    },
    {
      tool: "ripgrep",
      displayName: "ripgrep",
      platforms: ["mac", "windows", "linux"],
      category: "命令行增强",
      categoryKey: "cli-utility",
      priority: 100,
      reason: "极快的代码搜索（rg），正则、过滤和忽略规则常用，替代 grep。",
      tags: ["search", "grep", "cli-utility"],
      useCases: ["搜索文件", "代码搜索", "正则", "grep 替代"],
      homepage: "https://github.com/BurntSushi/ripgrep",
      related: ["linux"],
      preferWeb: true,
    },
    {
      tool: "fzf",
      displayName: "fzf",
      platforms: ["mac", "windows", "linux"],
      category: "命令行增强",
      categoryKey: "cli-utility",
      priority: 110,
      reason: "模糊查找器，命令历史、文件和管道筛选的常用快捷集成。",
      tags: ["fuzzy", "search", "cli-utility"],
      useCases: ["搜索文件", "历史命令", "交互筛选", "Shell 集成"],
      homepage: "https://github.com/junegunn/fzf",
      related: ["shell"],
      preferWeb: true,
    },
    {
      tool: "bat",
      displayName: "bat",
      platforms: ["mac", "linux"],
      category: "命令行增强",
      categoryKey: "cli-utility",
      priority: 120,
      reason: "带语法高亮和分页的 cat 替代，参数、主题和分页常用。",
      tags: ["cat", "syntax", "cli-utility"],
      homepage: "https://github.com/sharkdp/bat",
      related: ["linux"],
      preferWeb: true,
    },
    {
      tool: "eza",
      displayName: "eza",
      platforms: ["mac", "linux"],
      category: "命令行增强",
      categoryKey: "cli-utility",
      priority: 130,
      reason: "现代 ls 替代（原 exa），图标、树形和 Git 状态参数常用。",
      tags: ["ls", "cli-utility"],
      homepage: "https://github.com/eza-community/eza",
      related: ["linux"],
      preferWeb: true,
    },
    {
      tool: "zoxide",
      displayName: "zoxide",
      platforms: ["mac", "windows", "linux"],
      category: "命令行增强",
      categoryKey: "cli-utility",
      priority: 140,
      reason: "智能目录跳转（z），频率排序和 shell 集成命令值得速查。",
      tags: ["navigation", "shell", "cli-utility"],
      homepage: "https://github.com/ajeetdsouza/zoxide",
      related: ["shell"],
      preferWeb: true,
    },
    {
      tool: "homebrew",
      displayName: "Homebrew",
      platforms: ["mac"],
      category: "包管理器",
      categoryKey: "package-manager",
      priority: 50,
      reason: "macOS 最常见开发工具安装入口，常用安装、搜索、更新命令集中。",
      tags: ["package-manager", "mac"],
      homepage: "https://brew.sh",
      preferWeb: true,
    },
    {
      tool: "uv",
      displayName: "uv",
      platforms: ["mac", "linux"],
      category: "Python 工具链",
      categoryKey: "language-toolchain",
      priority: 80,
      reason: "Python 项目、虚拟环境和依赖管理命令更新快，适合单独收录。",
      tags: ["python", "package-manager"],
      useCases: ["版本管理", "依赖管理", "虚拟环境", "Python"],
      homepage: "https://docs.astral.sh/uv/",
      related: ["git"],
      preferWeb: true,
    },
    {
      tool: "pnpm",
      displayName: "pnpm",
      platforms: ["mac", "windows", "linux"],
      category: "Node 工具链",
      categoryKey: "language-toolchain",
      priority: 90,
      reason: "包管理、workspace 和脚本命令常用，和 npm/yarn 易混淆。",
      tags: ["node", "package-manager"],
      useCases: ["版本管理", "依赖管理", "workspace", "Node"],
      homepage: "https://pnpm.io",
      related: ["git", "vs-code"],
      preferWeb: true,
    },
    {
      tool: "bun",
      displayName: "Bun",
      platforms: ["mac", "linux"],
      category: "JavaScript 运行时",
      categoryKey: "language-toolchain",
      priority: 92,
      reason: "一体化 JS 运行时与包管理，run/install/test 命令值得速查。",
      tags: ["javascript", "runtime", "package-manager"],
      homepage: "https://bun.sh",
      related: ["git", "vs-code"],
      preferWeb: true,
    },
    {
      tool: "deno",
      displayName: "Deno",
      platforms: ["mac", "windows", "linux"],
      category: "JavaScript 运行时",
      categoryKey: "language-toolchain",
      priority: 94,
      reason: "安全的 TS/JS 运行时，权限标志、任务和兼容选项适合速查。",
      tags: ["typescript", "javascript", "runtime"],
      homepage: "https://deno.com",
      related: ["git", "vs-code"],
      preferWeb: true,
    },
    {
      tool: "mise",
      displayName: "mise",
      platforms: ["mac", "linux"],
      category: "运行时版本管理",
      categoryKey: "language-toolchain",
      priority: 96,
      reason: "多语言运行时与环境管理（原 rtx），install/use/env 命令常用。",
      tags: ["version-manager", "dev-env"],
      useCases: ["版本管理", "运行时管理", "环境变量", "多语言"],
      homepage: "https://mise.jdx.dev",
      related: ["shell", "git"],
      preferWeb: true,
    },
    {
      tool: "docker",
      displayName: "Docker",
      platforms: ["mac", "windows", "linux"],
      category: "容器工具",
      categoryKey: "cloud-native",
      priority: 60,
      reason: "镜像、容器、日志、网络和 Compose 操作查询频率高。",
      tags: ["container", "devops"],
      useCases: ["容器", "镜像", "Compose", "日志"],
      homepage: "https://docs.docker.com",
      preferWeb: true,
    },
    {
      tool: "kubectl",
      displayName: "kubectl",
      platforms: ["mac", "windows", "linux"],
      category: "Kubernetes",
      categoryKey: "cloud-native",
      priority: 70,
      reason: "集群排查、资源查看和上下文切换命令复杂，适合速查。",
      tags: ["kubernetes", "devops"],
      useCases: ["容器", "Kubernetes", "集群排查", "上下文切换"],
      homepage: "https://kubernetes.io/docs/reference/kubectl/",
      related: ["docker"],
      preferWeb: true,
    },
    {
      tool: "helm",
      displayName: "Helm",
      platforms: ["mac", "windows", "linux"],
      category: "Kubernetes",
      categoryKey: "cloud-native",
      priority: 75,
      reason: "Kubernetes 包管理，Chart、release 和 values 操作适合速查。",
      tags: ["kubernetes", "devops", "package-manager"],
      useCases: ["容器", "Kubernetes", "Chart", "release"],
      homepage: "https://helm.sh",
      related: ["kubectl", "docker"],
      preferWeb: true,
    },
    {
      tool: "tmux",
      displayName: "tmux",
      platforms: ["mac", "linux"],
      category: "终端复用",
      categoryKey: "dev-env",
      priority: 150,
      reason: "终端复用器，会话、窗口、窗格和前缀键操作复杂，适合速查。",
      tags: ["multiplexer", "session", "dev-env"],
      homepage: "https://github.com/tmux/tmux",
      related: ["shell"],
      preferWeb: true,
    },
    {
      tool: "starship",
      displayName: "Starship",
      platforms: ["mac", "windows", "linux"],
      category: "Shell 提示符",
      categoryKey: "dev-env",
      priority: 160,
      reason: "跨 shell 提示符，模块、配置和图标设置值得整理。",
      tags: ["prompt", "shell", "config"],
      homepage: "https://starship.rs",
      related: ["shell"],
      preferWeb: true,
    },
    {
      tool: "lazygit",
      displayName: "lazygit",
      platforms: ["mac", "windows", "linux"],
      category: "Git 工具",
      categoryKey: "dev-env",
      priority: 170,
      reason: "Git 终端 UI，分支、暂存、变基和快捷键操作适合速查。",
      tags: ["git", "tui", "dev-env"],
      homepage: "https://github.com/jesseduffield/lazygit",
      related: ["git"],
      preferWeb: true,
    },
    {
      tool: "neovim",
      displayName: "Neovim",
      platforms: ["mac", "windows", "linux"],
      category: "编辑器",
      categoryKey: "dev-env",
      priority: 180,
      reason: "可扩展的 Vim 衍生编辑器，模式、快捷键和 Lua 配置值得整理。",
      tags: ["editor", "vim", "dev-env"],
      homepage: "https://neovim.io",
      related: ["vs-code", "git"],
      preferWeb: true,
    },
    {
      tool: "windows-terminal",
      displayName: "Windows Terminal",
      platforms: ["windows"],
      category: "终端模拟器",
      categoryKey: "terminal",
      priority: 10,
      reason: "Windows 默认现代终端，配置、窗格、标签页和命令面板常用。",
      tags: ["terminal", "windows", "shortcuts"],
      homepage: "https://learn.microsoft.com/windows/terminal/",
      related: ["shell"],
      preferWeb: true,
    },
    {
      tool: "powershell",
      displayName: "PowerShell",
      platforms: ["windows"],
      category: "Shell",
      categoryKey: "terminal",
      priority: 20,
      reason: "Windows 常用自动化 Shell，管道、对象和常用 cmdlet 需要速查。",
      tags: ["shell", "windows", "scripting"],
      homepage: "https://learn.microsoft.com/powershell/",
      related: ["shell"],
      preferWeb: true,
    },
    {
      tool: "wsl",
      displayName: "WSL",
      platforms: ["windows"],
      category: "开发环境",
      categoryKey: "dev-env",
      priority: 30,
      reason: "Windows 上管理 Linux 发行版、路径和集成终端的常用入口。",
      tags: ["windows", "linux", "dev-env"],
      homepage: "https://learn.microsoft.com/windows/wsl/",
      related: ["linux", "shell"],
      preferWeb: true,
    },
  ];
  const SHELL_FILTERS = [
    { key: "portability:posix", field: "portability", value: "posix", label: "POSIX" },
    { key: "portability:bash", field: "portability", value: "bash", label: "Bash" },
    { key: "portability:zsh", field: "portability", value: "zsh", label: "Zsh" },
    { key: "layer:builtin", field: "layer", value: "builtin", label: "内置命令" },
    { key: "layer:syntax", field: "layer", value: "syntax", label: "语法" },
    { key: "layer:option", field: "layer", value: "option", label: "选项" },
    { key: "topic:scripting", field: "topic", value: "scripting", label: "脚本" },
    { key: "topic:completion", field: "topic", value: "completion", label: "补全" },
    { key: "topic:config", field: "topic", value: "config", label: "配置" },
    { key: "topic:jobs", field: "topic", value: "jobs", label: "作业" },
    { key: "topic:troubleshooting", field: "topic", value: "troubleshooting", label: "排错" },
  ];
  const OVERBROAD_ADD_TOOL_NAMES = new Set([
    "cli",
    "command-line",
    "commandline",
    "shell",
    "terminal",
    "命令行",
    "终端",
  ]);
  const SHELL_ADD_TOOL_NAMES = new Set(["shell", "terminal", "command-line", "commandline", "命令行", "终端"]);

  function detectPlatform(navigatorLike = globalScope.navigator || {}) {
    const value = navigatorLike.userAgentData?.platform || navigatorLike.platform || "";
    if (/win/i.test(value)) return "windows";
    if (/linux/i.test(value)) return "linux";
    return "mac";
  }

  function storageGet(chromeApi, keys) {
    return new Promise((resolve) => chromeApi.storage.local.get(keys, resolve));
  }

  function storageSet(chromeApi, values) {
    return chromeApi.storage.local.set(values);
  }

  function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => { timer = null; fn(...args); }, delay);
    };
  }

  function getToolIds(data) {
    return Object.keys(data).sort((a, b) =>
      (data[a].meta?.order ?? 999) - (data[b].meta?.order ?? 999) || a.localeCompare(b)
    );
  }

  function visibleToolIds(data, enabledTools) {
    return getToolIds(data).filter((id) => enabledTools.has(id));
  }

  function recommendationText(item) {
    return [item.tool, item.displayName, item.category, item.reason, ...(item.tags || []), ...(item.useCases || [])]
      .join(" ")
      .toLowerCase();
  }

  function sortRecommendations(items) {
    return [...items].sort((a, b) =>
      (a.priority ?? 999) - (b.priority ?? 999) || a.displayName.localeCompare(b.displayName)
    );
  }

  function toolName(data, toolId) {
    return data[toolId]?.meta?.name || toolId;
  }

  // 常见基础工具（不在推荐池里）到推荐类目的映射，用于「类目亲和度」信号。
  const BASE_TOOL_CATEGORY = {
    shell: "terminal",
    iterm2: "terminal",
    git: "dev-env",
    linux: "cli-utility",
    "vs-code": "dev-env",
    idea: "dev-env",
    cursor: "dev-env",
    typora: "dev-env",
  };
  // 类目亲和度加成：每个同类目活跃信号 +8，封顶 24（低于显式 related 命中，避免淹没强信号）。
  const CATEGORY_AFFINITY_PER = 8;
  const CATEGORY_AFFINITY_CAP = 24;

  function recommendationCategoryOf(toolId) {
    const rec = TOOL_RECOMMENDATIONS.find((item) => item.tool === toolId);
    return rec ? rec.categoryKey : (BASE_TOOL_CATEGORY[toolId] || null);
  }

  function recommendationCategoryLabel(categoryKey) {
    const category = RECOMMENDATION_CATEGORIES.find((entry) => entry.key === categoryKey);
    return category ? category.label : "";
  }

  function recommendationSignalContext(data, options = {}) {
    const enabledToolIds = options.enabledToolIds instanceof Set ? options.enabledToolIds : new Set(options.enabledToolIds || []);
    const favouriteTools = new Set();
    const recentTools = new Set();
    const favourites = options.favourites instanceof Set ? options.favourites : new Set(options.favourites || []);
    favourites.forEach((key) => {
      const toolId = String(key).split("::")[0];
      if (toolId) favouriteTools.add(toolId);
    });
    (Array.isArray(options.recents) ? options.recents : []).forEach((item) => {
      if (item && typeof item.toolId === "string") recentTools.add(item.toolId);
    });
    // 类目亲和度只看用户的活跃信号（启用/收藏/最近），不含「已收录」——后者近乎全集，无区分度。
    const categoryAffinity = new Map();
    new Set([...enabledToolIds, ...favouriteTools, ...recentTools]).forEach((toolId) => {
      const key = recommendationCategoryOf(toolId);
      if (key) categoryAffinity.set(key, (categoryAffinity.get(key) || 0) + 1);
    });
    return { enabledToolIds, favouriteTools, recentTools, categoryAffinity };
  }

  function recommendationSignals(item, data, context) {
    const relatedIds = Array.isArray(item.related) ? item.related : [];
    const relatedEnabled = relatedIds.filter((id) => context.enabledToolIds.has(id));
    const relatedRecent = relatedIds.filter((id) => context.recentTools.has(id));
    const relatedFavourite = relatedIds.filter((id) => context.favouriteTools.has(id));
    const relatedCollected = relatedIds.filter((id) => data[id]);
    const signalIds = [...new Set([...relatedRecent, ...relatedFavourite, ...relatedEnabled, ...relatedCollected])];
    const affinityCount = context.categoryAffinity?.get(item.categoryKey) || 0;
    const categoryBonus = Math.min(CATEGORY_AFFINITY_CAP, affinityCount * CATEGORY_AFFINITY_PER);
    const reasons = [];
    if (relatedRecent.length) reasons.push(`因为你最近用过 ${relatedRecent.map((id) => toolName(data, id)).join("、")}`);
    if (relatedFavourite.length) reasons.push(`因为你收藏了 ${relatedFavourite.map((id) => toolName(data, id)).join("、")}`);
    if (relatedEnabled.length) reasons.push(`因为你启用了 ${relatedEnabled.map((id) => toolName(data, id)).join("、")}`);
    if (!reasons.length && signalIds.length) reasons.push(`因为你已添加 ${signalIds.map((id) => toolName(data, id)).join("、")}`);
    if (!reasons.length && categoryBonus > 0) {
      const label = recommendationCategoryLabel(item.categoryKey);
      if (label) reasons.push(`因为你常关注「${label}」类工具`);
    }
    return {
      relatedTo: signalIds.map((id) => toolName(data, id)),
      explainReasons: reasons,
      relevanceScore: (relatedRecent.length * 60) + (relatedFavourite.length * 50) + (relatedEnabled.length * 30) + (relatedCollected.length * 20) + categoryBonus,
    };
  }

  // 相关推荐（用户使用信号）优先，其余按 priority 排序。
  function sortRecommendationsByRelevance(items) {
    return [...items].sort((a, b) =>
      ((b.relevanceScore || 0) - (a.relevanceScore || 0))
      || ((b.relatedTo?.length ? 1 : 0) - (a.relatedTo?.length ? 1 : 0))
      || (a.priority ?? 999) - (b.priority ?? 999)
      || a.displayName.localeCompare(b.displayName)
    );
  }

  function recommendationRelatedNames(item, data, collectedToolIds) {
    if (!Array.isArray(item.related) || !collectedToolIds || !collectedToolIds.size) return [];
    return item.related
      .filter((id) => collectedToolIds.has(id))
      .map((id) => data[id]?.meta?.name || id);
  }

  // 剔除过期的 AI 建议（持久化到 local storage 后按 generatedAt 与 TTL 过滤）。
  // ttl 为 0 时不按时间过滤，仅保留结构合法（有 tool 字段）的项；无 generatedAt 的旧项保留。
  function pruneExpiredAiSuggestions(list, now = Date.now(), ttl = 0) {
    if (!Array.isArray(list)) return [];
    return list.filter((item) =>
      item && typeof item.tool === "string"
      && (!ttl || !item.generatedAt || (now - item.generatedAt) < ttl)
    );
  }

  // 把额外推荐（如 AI 现荐）并入静态精选池，按 tool id 去重（静态优先）。
  function mergeRecommendationPool(extra) {
    const pool = [...TOOL_RECOMMENDATIONS];
    const seen = new Set(TOOL_RECOMMENDATIONS.map((item) => item.tool));
    if (Array.isArray(extra)) {
      for (const item of extra) {
        if (item && typeof item.tool === "string" && !seen.has(item.tool)) {
          seen.add(item.tool);
          pool.push(item);
        }
      }
    }
    return pool;
  }

  function recommendedTools(data, currentPlatform, extra = []) {
    return sortRecommendations(mergeRecommendationPool(extra).filter((item) =>
      Array.isArray(item.platforms) && item.platforms.includes(currentPlatform) && !data[item.tool]
    ));
  }

  function countRecommendations(data, currentPlatform, dismissed = new Set(), extra = []) {
    return recommendedTools(data, currentPlatform, extra).filter((item) => !dismissed.has(item.tool)).length;
  }

  // 「换一批」最多钉住的个性化命中条数，其余批次额度留给中性长尾轮换。
  const PINNED_RECOMMENDATION_MAX = 3;

  // 默认浏览态（全部分类 + 无搜索 + 不看已忽略）下，从相关性排序后的列表里切出一批：
  // 钉住个性化命中头部（relevanceScore>0，至多 PINNED_RECOMMENDATION_MAX 条），
  // 只对中性长尾做环形轮换，避免「换一批」把最相关的推荐也转走。
  function sliceRecommendationBatch(items, batchSize, batchOffset) {
    const total = items.length;
    if (!total) return { items: [], total: 0, offset: 0, pinned: 0, canShuffle: false };
    const personalizedCount = items.filter((item) => (item.relevanceScore || 0) > 0).length;
    const pinnedCount = Math.min(PINNED_RECOMMENDATION_MAX, batchSize, personalizedCount);
    const pinned = items.slice(0, pinnedCount);
    const tail = items.slice(pinnedCount);
    const tailTotal = tail.length;
    const tailSlots = Math.max(0, Math.min(batchSize, total) - pinnedCount);
    const tailBatch = [];
    let start = 0;
    if (tailSlots > 0 && tailTotal > 0) {
      const size = Math.min(tailSlots, tailTotal);
      start = (((batchOffset % tailTotal) + tailTotal) % tailTotal);
      for (let i = 0; i < size; i++) tailBatch.push(tail[(start + i) % tailTotal]);
    }
    return {
      items: [...pinned, ...tailBatch],
      total,
      offset: start,
      pinned: pinnedCount,
      canShuffle: tailSlots > 0 && tailTotal > tailSlots,
    };
  }

  function filterRecommendedTools(data, currentPlatform, options = {}) {
    const dismissed = options.dismissedRecommendations || new Set();
    const collectedToolIds = options.collectedToolIds || new Set();
    const addingTool = options.addingTool || null;
    const webVerify = options.webVerify === true;
    const batchSize = Number(options.batchSize) || 0;
    const batchOffset = Number(options.batchOffset) || 0;
    const extraRecommendations = options.extraRecommendations || [];
    const query = String(options.query || "").trim().toLowerCase();
    const activeCategory = options.category || "all";
    const showDismissed = options.showDismissed === true;
    const signalContext = recommendationSignalContext(data, options);
    const available = recommendedTools(data, currentPlatform, extraRecommendations).map((item) => ({
      ...item,
      dismissed: dismissed.has(item.tool),
      adding: addingTool === item.tool,
      ...recommendationSignals(item, data, signalContext),
    })).map((item) => ({
      ...item,
      relatedTo: item.relatedTo.length ? item.relatedTo : recommendationRelatedNames(item, data, collectedToolIds),
    }));
    const afterDismissed = available.filter((item) => showDismissed || !item.dismissed);
    const afterQuery = query
      ? afterDismissed.filter((item) => recommendationText(item).includes(query))
      : afterDismissed;
    const visible = afterQuery.filter((item) => activeCategory === "all" || item.categoryKey === activeCategory);
    const groups = RECOMMENDATION_CATEGORIES
      .filter((category) => category.key !== "all")
      .map((category) => ({
        key: category.key,
        label: category.label,
        items: sortRecommendationsByRelevance(visible.filter((item) => item.categoryKey === category.key)),
      }))
      .filter((group) => group.items.length);
    const categories = RECOMMENDATION_CATEGORIES.map((category) => ({
      ...category,
      count: category.key === "all"
        ? afterQuery.length
        : afterQuery.filter((item) => item.categoryKey === category.key).length,
    }));
    const batched = batchSize > 0 && activeCategory === "all" && !query;
    const batch = batched
      ? sliceRecommendationBatch(sortRecommendationsByRelevance(visible), batchSize, batchOffset)
      : null;
    return {
      query,
      activeCategory,
      showDismissed,
      webVerify,
      addingTool,
      batched,
      batch,
      totalAvailable: available.length,
      totalVisible: visible.length,
      categories,
      groups,
    };
  }

  function itemId(toolId, item) {
    if (item.id) return item.id;
    let hash = 2166136261;
    const value = `${toolId}\0${item.cat}\0${item.context || ""}\0${String(item.en).toLowerCase()}`;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function entryKey(toolId, item) {
    return `${toolId}::${itemId(toolId, item)}`;
  }

  function buildEnrichmentIndex(data, enrichments = {}, buildFullEnrichments) {
    buildFullEnrichments?.(data);
    const index = new Map();
    Object.entries(enrichments || {}).forEach(([toolId, toolEnrichments]) => {
      Object.entries(toolEnrichments).forEach(([lookup, enrichment]) => {
        const [cmd, context = ""] = lookup.split("\0");
        index.set(`${toolId}\0${cmd}\0${context}`, enrichment);
      });
    });
    return index;
  }

  function enrichItem(enrichmentIndex, toolId, item) {
    if (item.keywords && item.examples) return item;
    const enrichment = enrichmentIndex.get(`${toolId}\0${item.cmd}\0${item.context || ""}`);
    if (!enrichment) return item;
    const enriched = { ...item };
    if (!enriched.keywords && enrichment.keywords) enriched.keywords = enrichment.keywords;
    if (!enriched.examples && enrichment.examples) enriched.examples = enrichment.examples;
    return enriched;
  }

  function createEntryIndex(data, enrichmentIndex) {
    const entries = [];
    const byKey = new Map();
    const validKeys = new Set();
    getToolIds(data).forEach((toolId) => {
      const tool = data[toolId];
      (tool?.items || []).forEach((rawItem) => {
        const id = itemId(toolId, rawItem);
        const key = `${toolId}::${id}`;
        const entry = {
          toolId,
          itemId: id,
          key,
          rawItem,
          item: enrichItem(enrichmentIndex, toolId, rawItem),
          toolName: tool.meta.name,
          categoryLabel: CAT_LABEL[rawItem.cat],
        };
        entries.push(entry);
        byKey.set(key, entry);
        validKeys.add(key);
      });
    });
    return { entries, byKey, validKeys };
  }

  function collectEntries(entryIndex, data, core, state) {
    const ids = state.activeTool === "all" || state.activeTool === "recent" || state.activeTool === "favourites"
      ? new Set(visibleToolIds(data, state.enabledTools))
      : new Set([state.activeTool].filter((id) => state.enabledTools.has(id)));
    const recentKeys = new Set(state.recents.map((item) => `${item.toolId}::${item.itemId}`));
    return entryIndex.entries.flatMap((base) => {
      if (!ids.has(base.toolId)) return [];
      if (state.activeCat && base.rawItem.cat !== state.activeCat) return [];
      if (state.activeShellFilter && base.toolId === "shell") {
        const filter = SHELL_FILTERS.find((candidate) => candidate.key === state.activeShellFilter);
        if (filter && base.rawItem.shell?.[filter.field] !== filter.value) return [];
      }
      if (state.activeTool === "recent" && !recentKeys.has(base.key)) return [];
      if (state.activeTool === "favourites" && !state.favourites.has(base.key)) return [];
      const platformInfo = core.getPlatformCommand(base.item, state.platform);
      return [{
        ...base,
        displayCmd: platformInfo.command,
        platformInfo,
      }];
    });
  }

  function findEntry(entryIndex, toolId, itemIdValue) {
    const entry = entryIndex.byKey.get(`${toolId}::${itemIdValue}`);
    return entry ? { toolId, itemId: itemIdValue, item: entry.item } : null;
  }

  function migrateFavourites(data, favourites) {
    const next = new Set(favourites);
    let changed = false;
    Object.entries(data).forEach(([toolId, tool]) => {
      tool.items.forEach((item) => {
        const legacy = `${toolId}::${item.cmd}`;
        if (next.has(legacy)) {
          next.delete(legacy);
          next.add(entryKey(toolId, item));
          changed = true;
        }
      });
    });
    return { favourites: next, changed };
  }

  function pruneRecents(entryIndex, recents) {
    return (Array.isArray(recents) ? recents : [])
      .filter((item) => entryIndex.validKeys.has(`${item.toolId}::${item.itemId}`))
      .slice(0, 20);
  }

  function activeFilterLabel(data, state) {
    const parts = [];
    if (state.activeTool === "recent") parts.push("最近");
    else if (state.activeTool === "favourites") parts.push("收藏");
    else if (state.activeTool !== "all" && data[state.activeTool]) parts.push(data[state.activeTool].meta.name);
    if (state.activeCat) parts.push(CAT_LABEL[state.activeCat]);
    const shellFilter = SHELL_FILTERS.find((filter) => filter.key === state.activeShellFilter);
    if (shellFilter) parts.push(shellFilter.label);
    return parts.join(" ＋ ");
  }

  function shellLabel(kind, value) {
    return SHELL_FILTER_LABELS[kind]?.[value] || value;
  }

  function shellTags(item) {
    if (!item.shell) return [];
    return [
      shellLabel("layer", item.shell.layer),
      item.shell.family,
      shellLabel("portability", item.shell.portability),
      shellLabel("topic", item.shell.topic),
    ].filter(Boolean);
  }

  function updatePolicy(meta) {
    if (["version-driven", "release-driven", "manual-only"].includes(meta.updatePolicy)) {
      return meta.updatePolicy;
    }
    return "release-driven";
  }

  function updateStatusLabel(meta) {
    const policy = updatePolicy(meta);
    if (meta.verifiedVersion) return `已核验至版本 ${meta.verifiedVersion}`;
    if (policy === "manual-only") return "默认键位或稳定命令参考";
    if (policy === "version-driven") return "尚未记录核验版本";
    return "按官方发布信号检查";
  }

  function updateActionLabel(meta) {
    return updatePolicy(meta) === "release-driven" ? "检查发布变化" : "检查版本更新";
  }

  function overbroadAddToolHint(displayName, toolId) {
    const normalizedName = displayName.toLowerCase().replace(/[\s_]+/g, "-");
    if (toolId === "shell" || SHELL_ADD_TOOL_NAMES.has(normalizedName)) return "";
    if (!OVERBROAD_ADD_TOOL_NAMES.has(normalizedName) && !OVERBROAD_ADD_TOOL_NAMES.has(toolId)) {
      return "";
    }
    return "这个名称范围过大，容易生成内容过长被截断。请拆分为具体工具或命令集，例如 Bash、Zsh、PowerShell、GNU Coreutils 或 findutils。";
  }

  function normalizeAddTool(displayName) {
    const normalizedName = displayName.toLowerCase().replace(/[\s_]+/g, "-");
    const tool = normalizedName.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (tool === "shell" || SHELL_ADD_TOOL_NAMES.has(normalizedName)) {
      return { tool: "shell", displayName: "Shell" };
    }
    return { tool, displayName };
  }

  const api = {
    STORAGE_KEYS,
    CAT_LABEL,
    GROUP_INITIAL_LIMIT,
    SEARCH_INITIAL_LIMIT,
    SEARCH_DEBOUNCE_MS,
    TOOL_PRESETS,
    RECOMMENDATION_CATEGORIES,
    TOOL_RECOMMENDATIONS,
    SHELL_FILTERS,
    detectPlatform,
    storageGet,
    storageSet,
    debounce,
    getToolIds,
    visibleToolIds,
    recommendedTools,
    countRecommendations,
    filterRecommendedTools,
    pruneExpiredAiSuggestions,
    itemId,
    entryKey,
    buildEnrichmentIndex,
    enrichItem,
    createEntryIndex,
    collectEntries,
    findEntry,
    migrateFavourites,
    pruneRecents,
    activeFilterLabel,
    shellTags,
    updatePolicy,
    updateStatusLabel,
    updateActionLabel,
    overbroadAddToolHint,
    normalizeAddTool,
  };

  globalScope.CHEATSHEET_POPUP_STATE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
