(function initProductCore(globalScope) {
  "use strict";

  const SYNONYM_GROUPS = [
    ["清空", "清除", "重置", "clear", "reset"],
    ["退出", "关闭", "结束", "quit", "exit", "close"],
    ["继续", "恢复", "续接", "resume", "continue"],
    ["压缩", "精简", "摘要", "compact", "compress", "summarize"],
    ["模型", "切换模型", "model", "switch model"],
    ["权限", "审批", "批准", "permission", "approval"],
    ["帮助", "说明", "help", "docs", "documentation"],
    ["配置", "设置", "偏好", "config", "settings", "preferences"],
    ["历史", "记录", "history", "recent"],
    ["搜索", "查找", "寻找", "search", "find"],
    ["复制", "拷贝", "copy"],
    ["删除", "移除", "remove", "delete"],
    ["更新", "升级", "刷新", "update", "upgrade", "refresh"],
  ];

  // 评分分层：精确 > 前缀 > 包含 > 中文 > 英文 > 上下文 > 工具名 > 分类，
  // 以及多词命中与收藏/最近的加成。改这些数值即改变排序权重。
  const SCORE = {
    EXACT: 1000,
    PREFIX: 800,
    CONTAINS: 650,
    ZH: 460,
    EN: 330,
    CONTEXT: 220,
    TOOL_NAME: 180,
    CATEGORY: 140,
    MULTI_TERM_BONUS: 75,
    FAVOURITE_BONUS: 35,
    FAVOURITE_EMPTY_QUERY: 30,
    RECENT_BONUS_MAX: 30,
    RECENT_BONUS_MIN: 5,
    RECENT_EMPTY_QUERY_WINDOW: 20,
  };

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

  function includesTerm(value, terms) {
    const normalized = normalizeText(value);
    const compact = compactText(value);
    return terms.some((term) => normalized.includes(term) || compact.includes(compactText(term)));
  }

  function scoreTermGroup(item, terms, options = {}) {
    const cmd = normalizeText(options.displayCmd || item.cmd);
    const cmdCompact = compactText(options.displayCmd || item.cmd);
    const zh = normalizeText(item.zh);
    const en = normalizeText(item.en);
    const context = normalizeText(item.context);
    const toolName = normalizeText(options.toolName);
    const categoryLabel = normalizeText(options.categoryLabel);
    let score = -1;

    terms.forEach((term) => {
      const termCompact = compactText(term);
      if (cmd === term || cmdCompact === termCompact) score = Math.max(score, SCORE.EXACT);
      else if (cmd.startsWith(term) || cmdCompact.startsWith(termCompact)) score = Math.max(score, SCORE.PREFIX);
      else if (cmd.includes(term) || cmdCompact.includes(termCompact)) score = Math.max(score, SCORE.CONTAINS);
      else if (zh.includes(term) || compactText(zh).includes(termCompact)) score = Math.max(score, SCORE.ZH);
      else if (en.includes(term) || compactText(en).includes(termCompact)) score = Math.max(score, SCORE.EN);
      else if (context.includes(term) || compactText(context).includes(termCompact)) score = Math.max(score, SCORE.CONTEXT);
      else if (toolName.includes(term) || compactText(toolName).includes(termCompact)) score = Math.max(score, SCORE.TOOL_NAME);
      else if (categoryLabel.includes(term) || compactText(categoryLabel).includes(termCompact)) score = Math.max(score, SCORE.CATEGORY);
    });
    return score;
  }

  /**
   * 计算条目对查询的相关度分数。所有查询词默认需全部命中（matchMode "any" 时任一命中即可）。
   * @param {Record<string, any>} item 数据条目（cmd/en/zh/context 等）
   * @param {string} query 用户查询
   * @param {{ displayCmd?: string, toolName?: string, categoryLabel?: string,
   *           isFavourite?: boolean, recentRank?: number, matchMode?: "any" }} [options]
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
      return favouriteBonus + recentBonus;
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
   * 将一次复制记录置顶并去重，返回新的最近列表（不可变）。
   * @param {Array<{ toolId: string, itemId: string, copiedAt?: number }>} recents
   * @param {{ toolId: string, itemId: string, copiedAt?: number }} entry
   * @param {number} [limit]
   * @returns {Array<object>}
   */
  function updateRecent(recents, entry, limit = 20) {
    const key = `${entry.toolId}::${entry.itemId}`;
    const filtered = (Array.isArray(recents) ? recents : [])
      .filter((item) => `${item.toolId}::${item.itemId}` !== key);
    return [{ ...entry, copiedAt: entry.copiedAt || Date.now() }, ...filtered].slice(0, limit);
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
    return items
      .map((entry, originalIndex) => {
        const key = `${entry.toolId}::${entry.itemId}`;
        const score = scoreItem(entry.item, query, {
          displayCmd: entry.displayCmd,
          toolName: entry.toolName,
          categoryLabel: entry.categoryLabel,
          isFavourite: options.favourites?.has(key),
          recentRank: recentMap.get(key),
          matchMode: options.matchMode,
        });
        return { ...entry, score, originalIndex };
      })
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);
  }

  const api = {
    SYNONYM_GROUPS,
    normalizeText,
    expandQuery,
    splitQuery,
    scoreItem,
    getPlatformCommand,
    updateRecent,
    rankItems,
    includesTerm,
  };

  globalScope.CHEATSHEET_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
