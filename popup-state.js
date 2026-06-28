"use strict";

(function initPopupState(globalScope) {
  const STORAGE_KEYS = ["favourites", "recentCopies", "enabledTools", "platform", "onboarded", "lastQuery", "pendingUpdate", "lastQualityWarnings", "webVerify", "dismissedRecommendations"];
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
    { key: "package-manager", label: "包管理器" },
    { key: "cloud-native", label: "容器/云原生" },
    { key: "language-toolchain", label: "语言工具链" },
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
    return [item.tool, item.displayName, item.category, item.reason, ...(item.tags || [])]
      .join(" ")
      .toLowerCase();
  }

  function sortRecommendations(items) {
    return [...items].sort((a, b) =>
      (a.priority ?? 999) - (b.priority ?? 999) || a.displayName.localeCompare(b.displayName)
    );
  }

  function recommendedTools(data, currentPlatform) {
    return sortRecommendations(TOOL_RECOMMENDATIONS.filter((item) =>
      item.platforms.includes(currentPlatform) && !data[item.tool]
    ));
  }

  function filterRecommendedTools(data, currentPlatform, options = {}) {
    const dismissed = options.dismissedRecommendations || new Set();
    const query = String(options.query || "").trim().toLowerCase();
    const activeCategory = options.category || "all";
    const showDismissed = options.showDismissed === true;
    const available = recommendedTools(data, currentPlatform).map((item) => ({
      ...item,
      dismissed: dismissed.has(item.tool),
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
        items: sortRecommendations(visible.filter((item) => item.categoryKey === category.key)),
      }))
      .filter((group) => group.items.length);
    const categories = RECOMMENDATION_CATEGORIES.map((category) => ({
      ...category,
      count: category.key === "all"
        ? afterQuery.length
        : afterQuery.filter((item) => item.categoryKey === category.key).length,
    }));
    return {
      query,
      activeCategory,
      showDismissed,
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
    filterRecommendedTools,
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
