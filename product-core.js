(function initProductCore(globalScope) {
  "use strict";

  const SYNONYM_GROUPS = [
    ["清空", "清除", "重置", "clear", "reset"],
    ["退出", "关闭", "结束", "quit", "exit", "close"],
    ["继续", "恢复", "续接", "resume", "continue"],
    ["撤销", "回滚", "还原", "undo", "rollback", "revert"],
    ["压缩", "精简", "摘要", "compact", "compress", "summarize"],
    ["模型", "切换模型", "换模型", "选择模型", "model", "switch model", "select model"],
    ["权限", "审批", "批准", "忽略权限", "跳过权限", "permission", "approval", "bypass permissions"],
    ["帮助", "说明", "help", "docs", "documentation"],
    ["配置", "设置", "偏好", "打开配置", "config", "settings", "preferences"],
    ["历史", "记录", "清历史", "清除历史", "history", "recent"],
    ["搜索", "查找", "寻找", "search", "find"],
    ["复制", "拷贝", "copy"],
    ["删除", "移除", "remove", "delete"],
    ["更新", "升级", "刷新", "update", "upgrade", "refresh"],
    ["替换", "取代", "replace", "substitute"],
    ["补全", "自动补全", "completion", "autocomplete"],
    ["日志", "查看日志", "调试日志", "log", "logs", "debug"],
  ];

  // 评分分层：精确 > 前缀 > 包含 > 中文 > 英文 > 上下文 > 工具名 > 分类，
  // 以及多词命中与收藏/最近的加成。改这些数值即改变排序权重。
  const SCORE = {
    EXACT: 1000,
    PREFIX: 800,
    CONTAINS: 650,
    ZH: 460,
    KEYWORDS: 520,
    EN: 330,
    CONTEXT: 300,
    TOOL_NAME: 180,
    EXAMPLES: 260,
    CATEGORY: 140,
    MULTI_TERM_BONUS: 75,
    FAVOURITE_BONUS: 35,
    FAVOURITE_EMPTY_QUERY: 30,
    RECENT_BONUS_MAX: 30,
    RECENT_BONUS_MIN: 5,
    RECENT_EMPTY_QUERY_WINDOW: 20,
    // 使用频率加成：按累计复制次数对数增长（收益递减），与“最近次序”互补。
    USAGE_BONUS_MAX: 40,
    USAGE_BONUS_FACTOR: 12,
  };

  /**
   * 把累计使用次数换算为一个收益递减的加成（单次使用不加成）。
   * @param {number} [count]
   * @returns {number}
   */
  function usageBonus(count) {
    if (!Number.isFinite(count) || count <= 1) return 0;
    return Math.min(SCORE.USAGE_BONUS_MAX, Math.round(SCORE.USAGE_BONUS_FACTOR * Math.log(count)));
  }

  // 归一化是搜索热路径中最频繁的操作（每次按键 × 每条目 × 每字段），
  // 缓存按原始字符串去重，缓存键集合受数据集字段数限制，有界。
  const normalizeCache = new Map();
  const compactCache = new Map();

  /**
   * NFKC 归一化、转小写、统一连字符与空白。
   * @param {unknown} value
   * @returns {string}
   */
  function normalizeText(value) {
    const raw = String(value || "");
    const cached = normalizeCache.get(raw);
    if (cached !== undefined) return cached;
    const result = raw
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[‐‑‒–—_]+/g, "-")
      .replace(/\s+/g, " ")
      .trim();
    normalizeCache.set(raw, result);
    return result;
  }

  /**
   * 在归一化基础上去掉所有空白与连字符，用于紧凑匹配。
   * @param {unknown} value
   * @returns {string}
   */
  function compactText(value) {
    const raw = String(value || "");
    const cached = compactCache.get(raw);
    if (cached !== undefined) return cached;
    const result = normalizeText(raw).replace(/[\s-]+/g, "");
    compactCache.set(raw, result);
    return result;
  }

  function matchTypeInValue(value, term) {
    const normalized = normalizeText(value);
    const compact = compactText(value);
    const normalizedTerm = normalizeText(term);
    const termCompact = compactText(term);
    if (!termCompact) return "";
    if (normalized === normalizedTerm || compact === termCompact) return "exact";
    if (/^[a-z0-9]{1,3}$/.test(termCompact)) {
      const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, "i").test(normalized)
        ? "contains"
        : "";
    }
    if (normalized.startsWith(normalizedTerm) || compact.startsWith(termCompact)) return "prefix";
    if (normalized.includes(normalizedTerm) || compact.includes(termCompact)) return "contains";
    return "";
  }

  function expandQuery(query) {
    const normalized = normalizeText(query);
    if (!normalized) return [];
    const terms = new Set([normalized]);
    const compact = compactText(normalized);
    SYNONYM_GROUPS.forEach((group) => {
      if (group.some((term) => {
        const normalizedTerm = normalizeText(term);
        return normalized.includes(normalizedTerm)
          || compact.includes(compactText(normalizedTerm));
      })) {
        group.forEach((term) => terms.add(normalizeText(term)));
      }
    });
    return [...terms];
  }

  function splitQuery(query) {
    const normalized = normalizeText(query);
    if (!normalized) return [];
    return normalized.split(/\s+/).filter(Boolean).map(expandQuery);
  }

  /**
   * 列出查询经同义词扩展后额外纳入的检索词（不含用户原始输入的词），
   * 供界面解释“为什么这些结果会出现”。
   * @param {string} query
   * @returns {string[]}
   */
  function expandedSynonyms(query) {
    const typed = normalizeText(query).split(/\s+/).filter(Boolean);
    const typedCompact = new Set(typed.map(compactText));
    const extras = [];
    const seen = new Set();
    typed.forEach((token) => {
      expandQuery(token).forEach((term) => {
        const compact = compactText(term);
        if (typedCompact.has(compact) || seen.has(compact)) return;
        seen.add(compact);
        extras.push(term);
      });
    });
    return extras;
  }

  /**
   * 为“无结果”状态生成结合查询的引导文案，而非千篇一律的提示。
   * @param {string} query
   * @param {{ hasFilter?: boolean }} [options]
   * @returns {string}
   */
  function emptySearchHint(query, options = {}) {
    const raw = String(query || "").trim();
    if (!raw) return "输入命令、中文用途或英文说明开始搜索";
    if (options.hasFilter) return "当前筛选下没有结果，试试点“清除筛选”或切换工具";
    const tokens = raw.split(/\s+/).filter(Boolean);
    if (tokens.length > 1) return `没有同时命中「${raw}」的结果，试试只保留一个关键词`;
    if (/^[a-z0-9+\-]{7,}$/i.test(raw)) return `没有匹配「${raw}」，可能是拼写问题，或改用中文用途词`;
    if (raw.length > 8) return `「${raw}」太具体了，试试更短的关键词`;
    return "没有匹配结果，试试用途词，例如“清空”“模型”“历史”";
  }

  function includesTerm(value, terms) {
    return terms.some((term) => Boolean(matchTypeInValue(value, term)));
  }

  const MATCH_FIELDS = [
    ["command", "命令", (item, options) => options.displayCmd || item.cmd],
    ["zh", "中文说明", (item) => item.zh],
    ["en", "英文说明", (item) => item.en],
    ["keywords", "关键词", (item) => (item.keywords || []).join(" ")],
    ["context", "使用场景", (item) => item.context],
    ["shell", "Shell 层次", (item) => item.shell ? [
      item.shell.layer,
      item.shell.family,
      item.shell.portability,
      item.shell.topic,
    ].join(" ") : ""],
    ["toolName", "工具", (_item, options) => options.toolName],
    ["examples", "用法", (item) => (item.examples || []).flatMap((example) => [
      example.value,
      example.description,
      ...Object.values(example.platformValues || {}),
    ]).join(" ")],
    ["category", "分类", (_item, options) => options.categoryLabel],
  ];

  /**
   * 解释查询主要命中了哪个字段。用于界面说明排序原因，不参与评分。
   * @returns {{ field: string, term: string, value: string, label: string, matchType: string } | null}
   */
  function explainMatch(item, query, options = {}) {
    const groups = splitQuery(query);
    if (!groups.length) return null;
    for (const [field, label, getValue] of MATCH_FIELDS) {
      const value = String(getValue(item, options) || "");
      for (const terms of groups) {
        for (const term of terms) {
          const matchType = matchTypeInValue(value, term);
          if (matchType) return { field, term, value, label, matchType };
        }
      }
    }
    return null;
  }

  const COMMAND_RISKS = [
    ["safetyBypass", "绕过安全保护", /(?:--yolo|dangerously-bypass|bypassPermissions)/i],
    ["remoteExecution", "会执行下载的远程脚本", /\b(?:curl|wget)\b[^|\n]*\|\s*(?:sudo\s+)?(?:ba)?sh\b|:\(\)\s*\{\s*:/i],
    ["deleteOrOverwrite", "可能删除或覆盖数据", /(?:\brm(?:\s|$)|\bdd\s+(?:if|of|bs|count|conv|status|seek|skip)=|\b(?:reset\s+--hard|mkfs)\b|--delete\b|(^|\s)>(?!>))/i],
    ["historyRewrite", "可能重写提交历史", /\b(?:push\s+--force|rebase\s+-i|reset\s+--hard)\b/i],
    ["permissionChange", "会修改文件权限", /\b(?:chmod|chown)\b/i],
    ["processDisruption", "可能中断正在运行的服务", /\b(?:kill\s+-9|restart|shutdown|reboot|halt|poweroff)\b/i],
  ];

  /**
   * 识别命令及示例中的高风险操作。
   * @returns {{ types: string[], labels: string[], warning: string, requiresConfirmation: boolean }}
   */
  function classifyCommandRisk(command, examples = []) {
    const text = [
      command,
      ...(Array.isArray(examples) ? examples.flatMap((example) => [
        example?.value,
        example?.warning,
        ...Object.values(example?.platformValues || {}),
      ]) : []),
    ].filter(Boolean).join(" ");
    const matched = COMMAND_RISKS.filter(([, , pattern]) => pattern.test(text));
    const labels = [...new Set(matched.map(([, label]) => label))];
    return {
      types: [...new Set(matched.map(([type]) => type))],
      labels,
      warning: labels.join("；"),
      requiresConfirmation: matched.length > 0,
    };
  }

  const RISK_DETAILS = {
    safetyBypass: "会绕过工具内置安全保护，复制前确认你信任当前仓库和提示内容。",
    remoteExecution: "会把远程下载内容直接交给 shell 执行，复制前确认 URL、来源和脚本内容。",
    deleteOrOverwrite: "可能删除或覆盖文件、目录或磁盘数据，复制前确认路径、通配符和重定向目标。",
    historyRewrite: "可能重写 Git 提交历史，复制前确认分支、远端协作状态和备份方案。",
    permissionChange: "会修改文件权限或所有者，复制前确认目标路径和权限范围。",
    processDisruption: "可能中断服务或关闭系统，复制前确认进程、主机和当前任务状态。",
  };

  function commandRiskDetails(risk) {
    return (risk?.types || []).map((type) => RISK_DETAILS[type]).filter(Boolean);
  }

  function scoreTermGroup(item, terms, options = {}) {
    const cmd = normalizeText(options.displayCmd || item.cmd);
    const cmdCompact = compactText(options.displayCmd || item.cmd);
    const examples = (item.examples || []).flatMap((example) => [
      example.value,
      example.description,
      ...Object.values(example.platformValues || {}),
    ]).join(" ");
    let score = -1;

    terms.forEach((term) => {
      const termCompact = compactText(term);
      if (cmd === term || cmdCompact === termCompact) score = Math.max(score, SCORE.EXACT);
      else if (matchTypeInValue(options.displayCmd || item.cmd, term) === "prefix") score = Math.max(score, SCORE.PREFIX);
      else if (matchTypeInValue(options.displayCmd || item.cmd, term) === "contains") score = Math.max(score, SCORE.CONTAINS);
      else if (matchTypeInValue(item.zh, term)) score = Math.max(score, SCORE.ZH);
      else if (matchTypeInValue(item.en, term)) score = Math.max(score, SCORE.EN);
      else if (matchTypeInValue((item.keywords || []).join(" "), term)) score = Math.max(score, SCORE.KEYWORDS);
      else if (matchTypeInValue(item.context, term)) score = Math.max(score, SCORE.CONTEXT);
      else if (matchTypeInValue(item.shell ? Object.values(item.shell).join(" ") : "", term)) score = Math.max(score, SCORE.CONTEXT);
      else if (matchTypeInValue(options.toolName, term)) score = Math.max(score, SCORE.TOOL_NAME);
      else if (matchTypeInValue(examples, term)) score = Math.max(score, SCORE.EXAMPLES);
      else if (matchTypeInValue(options.categoryLabel, term)) score = Math.max(score, SCORE.CATEGORY);
    });
    return score;
  }

  /**
   * 计算条目对查询的相关度分数。所有查询词默认需全部命中（matchMode "any" 时任一命中即可）。
   * @param {Record<string, any>} item 数据条目（cmd/en/zh/context 等）
   * @param {string} query 用户查询
   * @param {{ displayCmd?: string, toolName?: string, categoryLabel?: string,
   *           isFavourite?: boolean, recentRank?: number, usageCount?: number,
   *           matchMode?: "any" }} [options]
   * @returns {number} 分数（>=0 命中，-1 未命中）
   */
  function scoreItem(item, query, options = {}) {
    const groups = splitQuery(query);
    if (!groups.length) {
      const favouriteBonus = options.isFavourite ? SCORE.FAVOURITE_EMPTY_QUERY : 0;
      const recentBonus = Math.max(
        0,
        SCORE.RECENT_EMPTY_QUERY_WINDOW - (options.recentRank ?? SCORE.RECENT_EMPTY_QUERY_WINDOW)
      );
      return favouriteBonus + recentBonus + usageBonus(options.usageCount);
    }

    const scores = groups.map((terms) => scoreTermGroup(item, terms, options));
    const matched = scores.filter((score) => score >= 0);
    if (options.matchMode !== "any" && matched.length !== groups.length) return -1;
    if (!matched.length) return -1;
    let score = matched.reduce((total, value) => total + value, 0);
    if (matched.length === groups.length && groups.length > 1) score += groups.length * SCORE.MULTI_TERM_BONUS;
    if (options.isFavourite) score += SCORE.FAVOURITE_BONUS;
    if (Number.isInteger(options.recentRank)) {
      score += Math.max(SCORE.RECENT_BONUS_MIN, SCORE.RECENT_BONUS_MAX - options.recentRank);
    }
    score += usageBonus(options.usageCount);
    return score;
  }

  /**
   * 解析条目在指定平台下应展示的命令，并标记是否走了通用回退或当前平台未覆盖。
   * @param {{ cmd: string, platformCmds?: Record<string, string>, platforms?: string[] }} item
   * @param {string} platform "mac" | "windows" | "linux"（其余值回退为 "mac"）
   * @returns {{ command: string, usedFallback: boolean, unsupported: boolean }}
   */
  function getPlatformCommand(item, platform) {
    const normalizedPlatform = ["mac", "windows", "linux"].includes(platform) ? platform : "mac";
    const platformCmds = item.platformCmds || {};
    const supported = Array.isArray(item.platforms) ? item.platforms : [];
    return {
      command: platformCmds[normalizedPlatform] || item.cmd,
      usedFallback: Boolean(Object.keys(platformCmds).length && !platformCmds[normalizedPlatform]),
      unsupported: Boolean(supported.length && !supported.includes(normalizedPlatform)),
    };
  }

  /**
   * 解析示例在指定平台下应展示的内容。
   * @param {{ value: string, platformValues?: Record<string, string>, platforms?: string[] }} example
   * @param {string} platform
   * @returns {{ value: string, unsupported: boolean }}
   */
  function getPlatformExample(example, platform) {
    const normalizedPlatform = ["mac", "windows", "linux"].includes(platform) ? platform : "mac";
    const platformValues = example.platformValues || {};
    const supported = Array.isArray(example.platforms) ? example.platforms : [];
    return {
      value: platformValues[normalizedPlatform] || example.value,
      unsupported: Boolean(supported.length && !supported.includes(normalizedPlatform)),
    };
  }

  /**
   * 将一次复制记录置顶、去重并累加使用次数，返回新的最近列表（不可变）。
   * @param {Array<{ toolId: string, itemId: string, copiedAt?: number, count?: number }>} recents
   * @param {{ toolId: string, itemId: string, copiedAt?: number }} entry
   * @param {number} [limit]
   * @returns {Array<object>}
   */
  function updateRecent(recents, entry, limit = 20) {
    const key = `${entry.toolId}::${entry.itemId}`;
    const list = Array.isArray(recents) ? recents : [];
    const existing = list.find((item) => `${item.toolId}::${item.itemId}` === key);
    const filtered = list.filter((item) => `${item.toolId}::${item.itemId}` !== key);
    // 老数据无 count 视为已用 1 次，再次复制累加（向后兼容，无需迁移）。
    const priorCount = existing ? (existing.count || 1) : 0;
    return [{ ...entry, copiedAt: entry.copiedAt || Date.now(), count: priorCount + 1 }, ...filtered].slice(0, limit);
  }

  /**
   * 对候选条目按相关度评分、过滤未命中项并排序（命中分高者在前，同分按原始顺序）。
   * @param {Array<{ toolId: string, itemId: string, item: object, displayCmd?: string,
   *           toolName?: string, categoryLabel?: string }>} items
   * @param {string} query
   * @param {{ favourites?: Set<string>, recents?: Array<object>, matchMode?: "any" }} [options]
   * @returns {Array<object>} 带 score 与 originalIndex 的已排序条目
   */
  function rankItems(items, query, options = {}) {
    const recentMap = new Map(
      (options.recents || []).map((item, index) => [`${item.toolId}::${item.itemId}`, index])
    );
    const usageMap = new Map(
      (options.recents || []).map((item) => [`${item.toolId}::${item.itemId}`, item.count || 1])
    );
    return items
      .map((entry, originalIndex) => {
        const key = `${entry.toolId}::${entry.itemId}`;
        const score = scoreItem(entry.item, query, {
          displayCmd: entry.displayCmd,
          toolName: entry.toolName,
          categoryLabel: entry.categoryLabel,
          isFavourite: options.favourites?.has(key),
          recentRank: recentMap.get(key),
          usageCount: usageMap.get(key),
          matchMode: options.matchMode,
        });
        const matchReason = score >= 0 && query.trim()
          ? explainMatch(entry.item, query, {
            displayCmd: entry.displayCmd,
            toolName: entry.toolName,
            categoryLabel: entry.categoryLabel,
          })
          : null;
        return { ...entry, score, originalIndex, matchReason };
      })
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);
  }

  const api = {
    SYNONYM_GROUPS,
    COMMAND_RISKS,
    normalizeText,
    matchTypeInValue,
    expandQuery,
    expandedSynonyms,
    emptySearchHint,
    splitQuery,
    scoreItem,
    explainMatch,
    classifyCommandRisk,
    commandRiskDetails,
    getPlatformCommand,
    getPlatformExample,
    updateRecent,
    rankItems,
    includesTerm,
  };

  globalScope.CHEATSHEET_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
