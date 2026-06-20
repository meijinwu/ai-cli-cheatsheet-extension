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

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[‐‑‒–—_]+/g, "-")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compactText(value) {
    return normalizeText(value).replace(/[\s-]+/g, "");
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

  function includesTerm(value, terms) {
    const normalized = normalizeText(value);
    const compact = compactText(value);
    return terms.some((term) => normalized.includes(term) || compact.includes(compactText(term)));
  }

  function scoreItem(item, query, options = {}) {
    const terms = expandQuery(query);
    if (!terms.length) {
      return (options.isFavourite ? 30 : 0) + Math.max(0, 20 - (options.recentRank ?? 20));
    }

    const cmd = normalizeText(options.displayCmd || item.cmd);
    const cmdCompact = compactText(options.displayCmd || item.cmd);
    const zh = normalizeText(item.zh);
    const en = normalizeText(item.en);
    const context = normalizeText(item.context);
    let score = -1;

    terms.forEach((term) => {
      const termCompact = compactText(term);
      if (cmd === term || cmdCompact === termCompact) score = Math.max(score, 1000);
      else if (cmd.startsWith(term) || cmdCompact.startsWith(termCompact)) score = Math.max(score, 800);
      else if (cmd.includes(term) || cmdCompact.includes(termCompact)) score = Math.max(score, 650);
      else if (zh.includes(term) || compactText(zh).includes(termCompact)) score = Math.max(score, 460);
      else if (en.includes(term) || compactText(en).includes(termCompact)) score = Math.max(score, 330);
      else if (context.includes(term) || compactText(context).includes(termCompact)) score = Math.max(score, 220);
    });

    if (score < 0) return -1;
    if (options.isFavourite) score += 35;
    if (Number.isInteger(options.recentRank)) score += Math.max(5, 30 - options.recentRank);
    return score;
  }

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

  function updateRecent(recents, entry, limit = 20) {
    const key = `${entry.toolId}::${entry.itemId}`;
    const filtered = (Array.isArray(recents) ? recents : [])
      .filter((item) => `${item.toolId}::${item.itemId}` !== key);
    return [{ ...entry, copiedAt: entry.copiedAt || Date.now() }, ...filtered].slice(0, limit);
  }

  function rankItems(items, query, options = {}) {
    const recentMap = new Map(
      (options.recents || []).map((item, index) => [`${item.toolId}::${item.itemId}`, index])
    );
    return items
      .map((entry, originalIndex) => {
        const key = `${entry.toolId}::${entry.itemId}`;
        const score = scoreItem(entry.item, query, {
          displayCmd: entry.displayCmd,
          isFavourite: options.favourites?.has(key),
          recentRank: recentMap.get(key),
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
    scoreItem,
    getPlatformCommand,
    updateRecent,
    rankItems,
    includesTerm,
  };

  globalScope.CHEATSHEET_CORE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
