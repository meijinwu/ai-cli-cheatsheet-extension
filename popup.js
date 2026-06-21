"use strict";

const CORE = window.CHEATSHEET_CORE;
const STORAGE_KEYS = ["favourites", "recentCopies", "enabledTools", "platform", "onboarded", "lastQuery", "pendingUpdate", "lastQualityWarnings"];
const CAT_LABEL = { shortcut: "⌨ 快捷键", slash: "› 命令", flag: "⚑ 参数/选项" };
const GROUP_INITIAL_LIMIT = 20;
const SEARCH_INITIAL_LIMIT = 100;
const SEARCH_DEBOUNCE_MS = 120;
const STALE_DAYS = 180;
const TOOL_PRESETS = {
  ai: ["claude-code", "codex", "gemini-cli", "antigravity-cli", "opencode", "openclaw"],
  editors: ["cursor", "vs-code", "idea", "typora"],
  terminal: ["git", "linux"],
};

let activeTool = "all";
let activeCat = null;
let favourites = new Set();
let recents = [];
let enabledTools = new Set();
let platform = detectPlatform();
let pendingUpdate = null;
let currentTaskMode = null;
let _taskTimer = null;
let expandedTools = new Set();
let expandedExamples = new Set();
let enrichmentIndex = new Map();
let searchLimit = SEARCH_INITIAL_LIMIT;
let lastAutoExpandedQuery = "";
let onboardingReturnFocus = null;
let toastTimer = null;

function detectPlatform() {
  const value = navigator.userAgentData?.platform || navigator.platform || "";
  if (/win/i.test(value)) return "windows";
  if (/linux/i.test(value)) return "linux";
  return "mac";
}

function storageGet(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function storageSet(values) {
  return chrome.storage.local.set(values);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { timer = null; fn(...args); }, delay);
  };
}

function highlightHtml(value, query) {
  const text = String(value ?? "");
  const tokens = CORE.splitQuery(query).flat().filter((term) => term.length >= 2);
  if (!tokens.length) return escapeHtml(text);
  const escaped = [...new Set(tokens)]
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(regex).map((part, index) =>
    index % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)
  ).join("");
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(successMessage);
    return true;
  } catch (_error) {
    showToast("复制失败，请检查浏览器剪贴板权限");
    return false;
  }
}

function resetResultLimits() {
  expandedTools = new Set();
  searchLimit = SEARCH_INITIAL_LIMIT;
}

function freshnessLabel(updatedAt) {
  const timestamp = Date.parse(`${updatedAt || ""}T00:00:00Z`);
  if (!Number.isFinite(timestamp)) return "更新时间未知";
  const days = Math.floor((Date.now() - timestamp) / 86400000);
  return days > 180 ? `⚠ 已 ${days} 天未核对` : `${Math.max(0, days)} 天前核对`;
}

function freshnessDays(updatedAt) {
  const timestamp = Date.parse(`${updatedAt || ""}T00:00:00Z`);
  return Number.isFinite(timestamp) ? Math.max(0, Math.floor((Date.now() - timestamp) / 86400000)) : Infinity;
}

function riskFor(command, examples) {
  return CORE.classifyCommandRisk(command, examples);
}

function confirmRiskCopy(value, risk) {
  if (!risk.requiresConfirmation) return true;
  return confirm(`这是高风险命令：${risk.warning}\n\n${value}\n\n确定要复制吗？`);
}

function getAllData() {
  return window.CHEATSHEET_DATA || {};
}

// 构建 toolId\0cmd\0context -> enrichment 的索引，不改写共享数据。
// 富化在读取时通过 enrichItem 以副本形式叠加（见不可变原则）。
function buildEnrichmentIndex() {
  window.CHEATSHEET_BUILD_FULL_ENRICHMENTS?.(getAllData());
  const index = new Map();
  Object.entries(window.CHEATSHEET_ENRICHMENTS || {}).forEach(([toolId, enrichments]) => {
    Object.entries(enrichments).forEach(([lookup, enrichment]) => {
      const [cmd, context = ""] = lookup.split("\0");
      index.set(`${toolId}\0${cmd}\0${context}`, enrichment);
    });
  });
  enrichmentIndex = index;
}

// 返回叠加了 keywords/examples 的条目副本；无需叠加时原样返回（避免多余复制）。
function enrichItem(toolId, item) {
  if (item.keywords && item.examples) return item;
  const enrichment = enrichmentIndex.get(`${toolId}\0${item.cmd}\0${item.context || ""}`);
  if (!enrichment) return item;
  const enriched = { ...item };
  if (!enriched.keywords && enrichment.keywords) enriched.keywords = enrichment.keywords;
  if (!enriched.examples && enrichment.examples) enriched.examples = enrichment.examples;
  return enriched;
}

function getToolIds() {
  const data = getAllData();
  return Object.keys(data).sort((a, b) => (data[a].meta?.order ?? 999) - (data[b].meta?.order ?? 999) || a.localeCompare(b));
}

function visibleToolIds() {
  return getToolIds().filter((id) => enabledTools.has(id));
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

function migrateFavourites() {
  let changed = false;
  Object.entries(getAllData()).forEach(([toolId, tool]) => {
    tool.items.forEach((item) => {
      const legacy = `${toolId}::${item.cmd}`;
      if (favourites.has(legacy)) {
        favourites.delete(legacy);
        favourites.add(entryKey(toolId, item));
        changed = true;
      }
    });
  });
  if (changed) storageSet({ favourites: [...favourites] });
}

function pruneRecents() {
  const valid = new Set();
  Object.entries(getAllData()).forEach(([toolId, tool]) => tool.items.forEach((item) => valid.add(entryKey(toolId, item))));
  const next = recents.filter((item) => valid.has(`${item.toolId}::${item.itemId}`)).slice(0, 20);
  if (next.length !== recents.length) {
    recents = next;
    storageSet({ recentCopies: recents });
  }
}

function loadCheatsheetData() {
  const files = Array.isArray(window.CHEATSHEET_FILES) ? window.CHEATSHEET_FILES : [];
  return Promise.all(files.map((toolId) => new Promise((resolve, reject) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toolId)) return reject(new Error(`非法数据文件 ID：${toolId}`));
    const script = document.createElement("script");
    script.src = `data/${toolId}.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`加载 data/${toolId}.js 失败`));
    document.head.appendChild(script);
  })));
}

function showView(name) {
  document.getElementById("homeView").classList.toggle("active", name === "home");
  document.getElementById("manageView").classList.toggle("active", name === "manage");
  if (name === "manage") renderManage();
}

function renderFilters() {
  const quick = document.getElementById("quickFilters");
  const quickItems = [
    ["all", "全部"],
    ["recent", "🕘 最近"],
    ["favourites", "⭐ 收藏"],
  ];
  quick.innerHTML = quickItems.map(([id, label]) => `<button class="chip ${activeTool === id ? "active" : ""}" data-tool="${id}">${escapeHtml(label)}</button>`).join("");
  quick.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => {
    activeTool = button.dataset.tool;
    document.getElementById("toolSelect").value = "";
    resetResultLimits();
    renderFilters();
    render();
  }));

  const toolSelect = document.getElementById("toolSelect");
  toolSelect.innerHTML = `<option value="">所有启用工具</option>${visibleToolIds().map((id) =>
    `<option value="${id}">${escapeHtml(getAllData()[id].meta.name)}</option>`
  ).join("")}`;
  toolSelect.value = ["all", "recent", "favourites"].includes(activeTool) ? "" : activeTool;

  const categories = document.getElementById("categoryFilters");
  categories.innerHTML = Object.entries(CAT_LABEL).map(([id, label]) =>
    `<button class="chip ${activeCat === id ? "active" : ""}" data-cat="${id}">${label}</button>`
  ).join("") + `<button id="clearFilters" class="chip filter-clear">清除筛选</button>`;
  categories.querySelectorAll("[data-cat]").forEach((button) => button.addEventListener("click", () => {
    activeCat = activeCat === button.dataset.cat ? null : button.dataset.cat;
    resetResultLimits();
    renderFilters();
    render();
  }));
  document.getElementById("clearFilters").addEventListener("click", () => {
    activeTool = "all";
    toolSelect.value = "";
    activeCat = null;
    resetResultLimits();
    document.getElementById("search").value = "";
    storageSet({ lastQuery: "" });
    renderFilters();
    render();
  });
}

function collectEntries() {
  const data = getAllData();
  const ids = activeTool === "all" || activeTool === "recent" || activeTool === "favourites"
    ? visibleToolIds()
    : [activeTool].filter((id) => enabledTools.has(id));
  const recentKeys = new Set(recents.map((item) => `${item.toolId}::${item.itemId}`));
  const entries = [];
  ids.forEach((toolId) => {
    (data[toolId]?.items || []).forEach((item) => {
      const key = entryKey(toolId, item);
      if (activeCat && item.cat !== activeCat) return;
      if (activeTool === "recent" && !recentKeys.has(key)) return;
      if (activeTool === "favourites" && !favourites.has(key)) return;
      const platformInfo = CORE.getPlatformCommand(item, platform);
      entries.push({
        toolId,
        itemId: itemId(toolId, item),
        item: enrichItem(toolId, item),
        displayCmd: platformInfo.command,
        platformInfo,
        toolName: data[toolId].meta.name,
        categoryLabel: CAT_LABEL[item.cat],
      });
    });
  });
  return entries;
}

function renderRow(entry, query, includeBadge = false) {
  const tool = getAllData()[entry.toolId];
  const key = `${entry.toolId}::${entry.itemId}`;
  const examples = (entry.item.examples || []).map((example, index) => ({
    ...example,
    index,
    platformInfo: CORE.getPlatformExample(example, platform),
  })).filter((example) => !example.platformInfo.unsupported);
  const examplesOpen = expandedExamples.has(key);
  const commandRisk = riskFor(entry.displayCmd, examples);
  const isStale = includeBadge && freshnessDays(tool.meta.updatedAt) > STALE_DAYS;
  const note = entry.platformInfo.unsupported ? "当前平台不可用" : entry.platformInfo.usedFallback ? "通用写法" : "";
  const matchReason = query.trim() && entry.matchReason
    ? `<span class="match-reason">主要匹配${escapeHtml(entry.matchReason.label)}：${highlightHtml(entry.matchReason.term, query)}</span>`
    : "";
  const summaryExample = examples[0];
  const summary = query.trim() && !examplesOpen && summaryExample
    ? `<span class="example-summary">常用：${highlightHtml(summaryExample.platformInfo.value, query)} · ${highlightHtml(summaryExample.description, query)}</span>`
    : "";
  const tags = [
    note ? `<span class="trust-tag">${escapeHtml(note)}</span>` : "",
    commandRisk.requiresConfirmation ? `<span class="trust-tag risk">高风险</span>` : "",
    isStale ? `<span class="trust-tag stale">资料较旧</span>` : "",
  ].join("");
  const examplesId = `examples-${entry.toolId}-${entry.itemId}`;
  const examplesHtml = examplesOpen ? `<div class="examples">${examples.map((example) => `
    <div class="example">
      <div class="example-value">${highlightHtml(example.platformInfo.value, query)}</div>
      <div class="example-desc">${highlightHtml(example.description, query)}</div>
      <div class="example-source">${example.sourceType === "official" ? "官方示例" : example.sourceType === "manual" ? "人工整理" : "AI 整理"}${example.sourceUrl ? ` · <a class="example-doc" href="${escapeHtml(example.sourceUrl)}" target="_blank" rel="noopener noreferrer">文档</a>` : ""}</div>
      ${example.warning ? `<div class="example-warning">⚠ ${escapeHtml(example.warning)}</div>` : ""}
      ${example.copyable !== false ? `<button class="act example-copy" data-example="${example.index}" title="复制此用法" aria-label="复制此用法">复制</button>` : ""}
    </div>`).join("")}</div>` : "";
  return `<article class="entry-wrap" data-tool="${entry.toolId}" data-item="${entry.itemId}">
    <div class="row"><button class="row-main" data-copy-command ${entry.platformInfo.unsupported ? "disabled" : ""} aria-label="${entry.platformInfo.unsupported ? "当前平台不可用" : `复制命令 ${escapeHtml(entry.displayCmd)}`}">
    <span class="cmd"><span class="dot" style="background:${escapeHtml(tool.meta.color)}"></span>${highlightHtml(entry.displayCmd, query)}
      ${includeBadge ? `<span class="context">${escapeHtml(tool.meta.name)}</span>` : ""}
      ${entry.item.context ? `<span class="context">${escapeHtml(entry.item.context)}</span>` : ""}
      ${tags}
    </span>
    <span class="zh">${highlightHtml(entry.item.zh, query)}</span><span class="en">${highlightHtml(entry.item.en, query)}</span>
    ${matchReason}${summary}</button>
    <div class="row-actions"><button class="act fav-btn ${favourites.has(key) ? "fav-active" : ""}" title="${favourites.has(key) ? "取消收藏" : "收藏"}" aria-label="${favourites.has(key) ? "取消收藏" : "收藏"}">${favourites.has(key) ? "♥" : "♡"}</button></div>
    </div>
    ${examples.length ? `<button class="usage-toggle" aria-expanded="${examplesOpen}" aria-controls="${examplesId}" data-usage>${examplesOpen ? "收起用法" : `查看用法 ${examples.length}`}</button>` : ""}
    ${examplesOpen ? `<div id="${examplesId}">${examplesHtml}</div>` : ""}
  </article>`;
}

function sourceCard(toolId) {
  const meta = getAllData()[toolId].meta;
  return `<div class="source-card" id="source-${toolId}">
    <div>${escapeHtml(meta.coverage || meta.source)}</div>
    <div>更新：${escapeHtml(meta.updatedAt || "未标注")} · 平台：${escapeHtml((meta.platforms || []).join(" / ") || "未标注")}</div>
    ${meta.sourceUrl ? `<a href="${escapeHtml(meta.sourceUrl)}" target="_blank">打开官方来源 ↗</a>` : ""}
  </div>`;
}

function render() {
  const main = document.getElementById("main");
  const query = document.getElementById("search").value;
  let entries = collectEntries();
  const recentOrder = new Map(recents.map((item, index) => [`${item.toolId}::${item.itemId}`, index]));
  const ranked = CORE.rankItems(entries, query, { favourites, recents });
  let relaxed = false;
  if (query.trim() && !ranked.length && CORE.splitQuery(query).length > 1) {
    ranked.push(...CORE.rankItems(entries, query, { favourites, recents, matchMode: "any" }));
    relaxed = ranked.length > 0;
  }
  if (activeTool === "recent" && !query.trim()) ranked.sort((a, b) =>
    (recentOrder.get(`${a.toolId}::${a.itemId}`) ?? 99) - (recentOrder.get(`${b.toolId}::${b.itemId}`) ?? 99)
  );
  entries = ranked;
  document.getElementById("countBar").innerHTML = `共 ${entries.length} 条结果${relaxed ? ' · <span class="relaxed-note">已放宽为任一关键词匹配</span>' : ""} · ${platform === "mac" ? "macOS" : platform === "windows" ? "Windows" : "Linux"}`;

  if (!entries.length) {
    main.innerHTML = `<div class="empty">${activeTool === "recent" ? "还没有最近复制的命令" : activeTool === "favourites" ? "还没有收藏的命令" : "没有匹配结果，试试用途词，例如“清空”“模型”“历史”"}</div>`;
    return;
  }

  if (query.trim() || activeTool === "recent" || activeTool === "favourites") {
    const normalizedQuery = CORE.normalizeText(query);
    if (normalizedQuery && normalizedQuery !== lastAutoExpandedQuery) {
      if (CORE.normalizeText(entries[0]?.displayCmd) === normalizedQuery) {
        expandedExamples.add(`${entries[0].toolId}::${entries[0].itemId}`);
      }
      lastAutoExpandedQuery = normalizedQuery;
    } else if (!normalizedQuery) {
      lastAutoExpandedQuery = "";
    }
    const visible = entries.slice(0, searchLimit);
    main.innerHTML = visible.map((entry) => renderRow(entry, query, true)).join("")
      + (entries.length > visible.length ? `<button class="text-btn more-btn" data-more-results>继续显示（剩余 ${entries.length - visible.length} 条）</button>` : "");
  } else {
    const grouped = new Map();
    entries.forEach((entry) => {
      if (!grouped.has(entry.toolId)) grouped.set(entry.toolId, []);
      grouped.get(entry.toolId).push(entry);
    });
    main.innerHTML = [...grouped].map(([toolId, rows]) => {
      const tool = getAllData()[toolId];
      const visible = expandedTools.has(toolId) ? rows : rows.slice(0, GROUP_INITIAL_LIMIT);
      const more = rows.length > visible.length
        ? `<button class="text-btn more-btn" data-expand="${toolId}">展开剩余 ${rows.length - visible.length} 条</button>`
        : "";
      const stale = freshnessDays(tool.meta.updatedAt) > STALE_DAYS ? `<span class="trust-tag stale">资料较旧</span>` : "";
      return `<section><div class="section-title"><span class="badge" style="background:${escapeHtml(tool.meta.color)}">${escapeHtml(tool.meta.name)}</span><span class="count">${rows.length} 条</span>${stale}<button class="source-toggle" data-source="${toolId}" aria-expanded="false" aria-controls="source-${toolId}">来源与更新时间 ▾</button></div>${sourceCard(toolId)}${visible.map((entry) => renderRow(entry, query)).join("")}${more}</section>`;
    }).join("");
  }
}

function findEntry(toolId, itemIdValue) {
  const item = getAllData()[toolId]?.items.find((candidate) => itemId(toolId, candidate) === itemIdValue);
  return item ? { toolId, itemId: itemIdValue, item: enrichItem(toolId, item) } : null;
}

function bindHomeEvents() {
  const debouncedRender = debounce(render, SEARCH_DEBOUNCE_MS);
  document.getElementById("search").addEventListener("input", (event) => {
    resetResultLimits();
    storageSet({ lastQuery: event.target.value });
    debouncedRender();
  });
  document.getElementById("clearSearch").addEventListener("click", () => {
    document.getElementById("search").value = "";
    resetResultLimits();
    storageSet({ lastQuery: "" });
    render();
  });
  document.getElementById("toolSelect").addEventListener("change", (event) => {
    activeTool = event.target.value || "all";
    resetResultLimits();
    renderFilters();
    render();
  });
  document.getElementById("filterToggle").addEventListener("click", (event) => {
    const filters = document.getElementById("categoryFilters");
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    filters.hidden = expanded;
  });
  document.getElementById("openManage").addEventListener("click", () => showView("manage"));
  document.getElementById("closeManage").addEventListener("click", () => showView("home"));
  document.getElementById("main").addEventListener("click", async (event) => {
    const sourceButton = event.target.closest("[data-source]");
    if (sourceButton) {
      const card = document.getElementById(`source-${sourceButton.dataset.source}`);
      const shown = card?.classList.toggle("show");
      sourceButton.setAttribute("aria-expanded", String(Boolean(shown)));
      return;
    }
    const expandButton = event.target.closest("[data-expand]");
    if (expandButton) {
      expandedTools.add(expandButton.dataset.expand);
      render();
      return;
    }
    if (event.target.closest("[data-more-results]")) {
      searchLimit += SEARCH_INITIAL_LIMIT;
      render();
      return;
    }
    const entryWrap = event.target.closest(".entry-wrap");
    if (!entryWrap) return;
    const entry = findEntry(entryWrap.dataset.tool, entryWrap.dataset.item);
    if (!entry) return;
    const key = `${entry.toolId}::${entry.itemId}`;
    const exampleButton = event.target.closest("[data-example]");
    if (exampleButton) {
      const example = entry.item.examples?.[Number(exampleButton.dataset.example)];
      if (!example) return;
      const value = CORE.getPlatformExample(example, platform).value;
      const risk = riskFor(value, [example]);
      if (!confirmRiskCopy(value, risk)) return;
      if (!await copyText(value, `已复制用法：${value}`)) return;
      recents = CORE.updateRecent(recents, { toolId: entry.toolId, itemId: entry.itemId, command: value }, 20);
      await storageSet({ recentCopies: recents });
      return;
    }
    if (event.target.closest("[data-usage]")) {
      expandedExamples.has(key) ? expandedExamples.delete(key) : expandedExamples.add(key);
      render();
      return;
    }
    if (event.target.closest("[data-copy-command]")) {
      const platformInfo = CORE.getPlatformCommand(entry.item, platform);
      if (platformInfo.unsupported) {
        showToast("当前平台不支持此命令");
        return;
      }
      const command = CORE.getPlatformCommand(entry.item, platform).command;
      const risk = riskFor(command, entry.item.examples || []);
      if (!confirmRiskCopy(command, risk)) return;
      if (!await copyText(command, `已复制命令：${command}`)) return;
      recents = CORE.updateRecent(recents, { toolId: entry.toolId, itemId: entry.itemId, command }, 20);
      await storageSet({ recentCopies: recents });
      return;
    }
    if (event.target.closest(".fav-btn")) {
      favourites.has(key) ? favourites.delete(key) : favourites.add(key);
      await storageSet({ favourites: [...favourites] });
      render();
    }
  });
  document.getElementById("main").addEventListener("keydown", (event) => {
    const rows = [...document.querySelectorAll("#main .row-main:not(:disabled)")];
    const index = rows.indexOf(document.activeElement);
    if (index < 0) return;
    if (event.key === "ArrowDown" && index < rows.length - 1) rows[index + 1].focus();
    else if (event.key === "ArrowUp" && index > 0) rows[index - 1].focus();
    else return;
    event.preventDefault();
  });
  document.addEventListener("keydown", (event) => {
    if (document.getElementById("onboarding").classList.contains("show")) return;
    const search = document.getElementById("search");
    const homeActive = document.getElementById("homeView").classList.contains("active");
    if (!homeActive) return;
    if ((event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"))
      && document.activeElement !== search) {
      search.focus();
      search.select();
      event.preventDefault();
    } else if (event.key === "Escape") {
      if (search.value) {
        search.value = "";
        resetResultLimits();
        storageSet({ lastQuery: "" });
        render();
      } else {
        search.blur();
      }
    }
  });
}

function setStatus(text, kind = "") {
  const status = document.getElementById("manageStatus");
  status.textContent = text;
  status.className = text ? `status show ${kind}` : "status";
}

function renderManage() {
  document.getElementById("platformSelect").value = platform;
  const tools = document.getElementById("manageTools");
  tools.innerHTML = getToolIds().map((toolId) => {
    const meta = getAllData()[toolId].meta;
    const canDelete = !meta.builtIn;
    const verification = meta.verificationStatus === "web-assisted"
      ? "生成时允许联网辅助"
      : meta.verificationStatus === "model-knowledge"
        ? "模型知识生成，待人工核验"
        : "来源状态未标注";
    const exampleItems = (getAllData()[toolId].items || [])
      .map((item) => enrichItem(toolId, item))
      .filter((item) => item.examples?.length);
    const sourceCounts = { official: 0, manual: 0, "ai-derived": 0 };
    exampleItems.forEach((item) => item.examples.forEach((example) => {
      if (sourceCounts[example.sourceType] !== undefined) sourceCounts[example.sourceType] += 1;
    }));
    return `<div class="tool-card"><div class="tool-title"><input type="checkbox" data-enabled="${toolId}" ${enabledTools.has(toolId) ? "checked" : ""}><label>${escapeHtml(meta.name)}</label></div>
      <div class="meta">${escapeHtml(meta.coverage || meta.source)}<br>更新：${escapeHtml(meta.updatedAt || "未标注")}（${escapeHtml(freshnessLabel(meta.updatedAt))}） · <span class="verify">${escapeHtml(verification)}</span>${meta.sourceUrl ? ` · <a href="${escapeHtml(meta.sourceUrl)}" target="_blank">官方来源</a>` : ""}</div>
      <div class="meta">用法覆盖：${exampleItems.length}/${getAllData()[toolId].items.length} · 官方 ${sourceCounts.official} / 人工 ${sourceCounts.manual} / AI ${sourceCounts["ai-derived"]}</div>
      <div class="tool-actions"><button class="text-btn" data-update="${toolId}">检查更新</button>${canDelete ? `<button class="text-btn danger" data-remove="${toolId}">删除</button>` : `<span class="meta">内置工具可隐藏，不可删除</span>`}</div></div>`;
  }).join("");
  tools.querySelectorAll("[data-enabled]").forEach((checkbox) => checkbox.addEventListener("change", async () => {
    checkbox.checked ? enabledTools.add(checkbox.dataset.enabled) : enabledTools.delete(checkbox.dataset.enabled);
    await storageSet({ enabledTools: [...enabledTools] });
    if (activeTool !== "all" && !enabledTools.has(activeTool)) activeTool = "all";
    renderFilters();
    render();
  }));
  tools.querySelectorAll("[data-update]").forEach((button) => button.addEventListener("click", () => {
    const toolId = button.dataset.update;
    runTask("preview_update", { tool: toolId, display_name: getAllData()[toolId].meta.name });
  }));
  tools.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
    const toolId = button.dataset.remove;
    if (confirm(`确定删除 ${getAllData()[toolId].meta.name}？此操作会删除本地数据文件。`)) {
      runTask("remove_tool", { tool: toolId, display_name: getAllData()[toolId].meta.name });
    }
  }));
  renderPending();
}

function renderPending() {
  const panel = document.getElementById("pendingPanel");
  if (!pendingUpdate?.pendingToken) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }
  const counts = pendingUpdate.diff?.counts || {};
  const risks = pendingUpdate.diff?.risks || [];
  const qualityWarnings = pendingUpdate.qualityWarnings || pendingUpdate.diff?.qualityWarnings || [];
  const detailRows = [
    ...(pendingUpdate.diff?.added || []).map((item) => `＋ ${item.cmd} · ${item.zh}`),
    ...(pendingUpdate.diff?.modified || []).map((item) => `≈ ${item.before} → ${item.after}`),
    ...(pendingUpdate.diff?.removed || []).map((item) => `－ ${item.cmd} · ${item.zh}`),
  ];
  panel.hidden = false;
  panel.innerHTML = `<h2>发现 ${escapeHtml(getAllData()[pendingUpdate.toolId]?.meta.name || pendingUpdate.toolId)} 更新</h2>
    <div class="diff-summary"><div class="diff-stat"><strong>${counts.added || 0}</strong>新增</div><div class="diff-stat"><strong>${counts.modified || 0}</strong>修改</div><div class="diff-stat"><strong>${counts.removed || 0}</strong>删除</div><div class="diff-stat"><strong>${counts.meta || 0}</strong>元数据</div></div>
    <div class="diff-list">${detailRows.length ? detailRows.map((row) => `<div>${escapeHtml(row)}</div>`).join("") : "<div>仅来源或更新时间发生变化</div>"}</div>
    ${qualityWarnings.length ? `<div class="quality-warning">${qualityWarnings.map(escapeHtml).join("<br>")}</div>` : ""}
    ${risks.length ? `<label class="warning">${risks.map(escapeHtml).join("<br>")}<br><input id="confirmRisk" type="checkbox"> 我已核对上述高风险变化</label>` : ""}
    <div class="diff-actions"><button id="applyPending" class="text-btn primary" ${risks.length ? "disabled" : ""}>应用更新</button><button id="discardPending" class="text-btn">放弃</button></div>`;
  const confirmRisk = document.getElementById("confirmRisk");
  if (confirmRisk) confirmRisk.addEventListener("change", () => {
    document.getElementById("applyPending").disabled = !confirmRisk.checked;
  });
  document.getElementById("applyPending").addEventListener("click", () => runTask("apply_update", {
    token: pendingUpdate.pendingToken,
    confirm_risk: Boolean(confirmRisk?.checked),
  }));
  document.getElementById("discardPending").addEventListener("click", () => runTask("discard_update", { token: pendingUpdate.pendingToken }));
}

function taskBaseMsg(mode) {
  if (mode === "preview_update") return "正在整理数据并生成更新预览，关闭面板不会中断";
  if (mode === "add_tool") return "正在整理并生成工具数据，关闭面板不会中断";
  return "正在执行，请稍候";
}

function startTaskTimer(mode, startedAt) {
  if (_taskTimer) clearInterval(_taskTimer);
  const base = taskBaseMsg(mode);
  _taskTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    setStatus(`${base}… (${elapsed}s)`);
  }, 1000);
  setStatus(`${base}… (0s)`);
}

function stopTaskTimer() {
  if (_taskTimer) { clearInterval(_taskTimer); _taskTimer = null; }
}

function runTask(mode, payload) {
  currentTaskMode = mode;
  startTaskTimer(mode, Date.now());
  document.querySelectorAll("#manageView button:not(#closeManage)").forEach((button) => { button.disabled = true; });
  chrome.runtime.sendMessage({ action: "startTask", mode, ...payload }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      finishTask({ ok: false, error: chrome.runtime.lastError?.message || response?.error || "启动失败" }, mode);
    }
  });
}

async function finishTask(response, mode = currentTaskMode) {
  stopTaskTimer();
  document.querySelectorAll("#manageView button").forEach((button) => { button.disabled = false; });
  if (!response?.ok) {
    setStatus(`❌ ${response?.error || "未知错误"}`, "err");
    return;
  }
  if (mode === "preview_update" && response.pendingToken) {
    pendingUpdate = response;
    await storageSet({ pendingUpdate });
    setStatus(`${response.output || "发现可用更新"}${response.qualityWarnings?.length ? `\n⚠ ${response.qualityWarnings.join("\n⚠ ")}` : ""}`, "ok");
    renderPending();
    return;
  }
  if (mode === "discard_update") {
    pendingUpdate = null;
    await storageSet({ pendingUpdate: null });
    setStatus("已放弃本次更新");
    renderPending();
    return;
  }
  if (mode === "apply_update") {
    pendingUpdate = null;
    await storageSet({ pendingUpdate: null });
  }
  if (response.changed) {
    await storageSet({
      lastQualityWarnings: response.qualityWarnings?.length
        ? { messages: response.qualityWarnings, createdAt: Date.now() }
        : null,
    });
  }
  setStatus(`✅ ${response.output || "完成"}${response.qualityWarnings?.length ? `\n⚠ ${response.qualityWarnings.join("\n⚠ ")}` : ""}${response.changed ? "\n正在重新加载扩展…" : ""}`, "ok");
  if (response.changed) setTimeout(() => chrome.runtime.reload(), 900);
}

function bindManageEvents() {
  document.getElementById("platformSelect").addEventListener("change", async (event) => {
    platform = event.target.value;
    await storageSet({ platform });
    render();
  });
  document.getElementById("clearRecent").addEventListener("click", async () => {
    recents = [];
    await storageSet({ recentCopies: [] });
    setStatus("最近使用已清空", "ok");
    render();
  });
  document.getElementById("rerunOnboarding").addEventListener("click", () => showOnboarding(true));
  document.getElementById("addToolBtn").addEventListener("click", () => {
    const displayName = document.getElementById("addToolName").value.trim();
    if (!displayName) return setStatus("请输入工具名称", "err");
    const tool = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!tool) return setStatus("工具名称需要包含英文字母或数字", "err");
    if (getAllData()[tool]) return setStatus("该工具已收录，请使用检查更新", "err");
    runTask("add_tool", { tool, display_name: displayName });
  });
}

function renderOnboardChoices() {
  document.getElementById("onboardPlatform").value = platform;
  document.getElementById("onboardTools").innerHTML = getToolIds().map((toolId) =>
    `<label class="tool-choice"><input type="checkbox" value="${toolId}" ${enabledTools.has(toolId) ? "checked" : ""}> ${escapeHtml(getAllData()[toolId].meta.name)}</label>`
  ).join("");
}

function showOnboarding(force = false) {
  onboardingReturnFocus = document.activeElement;
  renderOnboardChoices();
  document.getElementById("onboarding").classList.add("show");
  if (force) document.getElementById("onboarding").dataset.forced = "true";
  document.querySelector(".onboard-card").focus();
}

function hideOnboarding({ focusSearch = false } = {}) {
  document.getElementById("onboarding").classList.remove("show");
  delete document.getElementById("onboarding").dataset.forced;
  const target = focusSearch ? document.getElementById("search") : onboardingReturnFocus;
  if (target?.isConnected) target.focus();
  onboardingReturnFocus = null;
}

function bindOnboarding() {
  document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => {
    const preset = button.dataset.preset;
    const selected = preset === "all" ? new Set(getToolIds()) : new Set(TOOL_PRESETS[preset] || []);
    document.querySelectorAll("#onboardTools input").forEach((input) => {
      input.checked = selected.has(input.value);
    });
  }));
  document.getElementById("saveOnboarding").addEventListener("click", async () => {
    const selected = [...document.querySelectorAll("#onboardTools input:checked")].map((input) => input.value);
    enabledTools = new Set(selected.length ? selected : getToolIds());
    platform = document.getElementById("onboardPlatform").value;
    await storageSet({ enabledTools: [...enabledTools], platform, onboarded: true });
    hideOnboarding({ focusSearch: true });
    renderFilters();
    render();
    renderManage();
  });
  document.getElementById("skipOnboarding").addEventListener("click", async () => {
    enabledTools = new Set(getToolIds());
    await storageSet({ enabledTools: [...enabledTools], platform, onboarded: true });
    hideOnboarding({ focusSearch: true });
    renderFilters();
    render();
  });
  document.getElementById("onboarding").addEventListener("keydown", (event) => {
    const dialog = event.currentTarget;
    if (event.key === "Escape") {
      if (dialog.dataset.forced === "true") hideOnboarding();
      else document.getElementById("skipOnboarding").click();
      event.preventDefault();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("button, input, select, [tabindex]:not([tabindex='-1'])")]
      .filter((element) => !element.disabled && !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  });
}

async function initialize() {
  try {
    await loadCheatsheetData();
    buildEnrichmentIndex();
  } catch (error) {
    document.getElementById("main").innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
    return;
  }
  const stored = await storageGet(STORAGE_KEYS);
  favourites = new Set(stored.favourites || []);
  recents = stored.recentCopies || [];
  platform = stored.platform || platform;
  enabledTools = new Set(Array.isArray(stored.enabledTools) ? stored.enabledTools.filter((id) => getAllData()[id]) : getToolIds());
  if (!stored.onboarded) enabledTools = new Set(TOOL_PRESETS.ai.filter((id) => getAllData()[id]));
  pendingUpdate = stored.pendingUpdate || null;
  document.getElementById("search").value = stored.lastQuery || "";
  migrateFavourites();
  pruneRecents();
  bindHomeEvents();
  bindManageEvents();
  bindOnboarding();
  renderFilters();
  render();
  renderManage();
  if (stored.lastQualityWarnings?.messages?.length
    && Date.now() - (stored.lastQualityWarnings.createdAt || 0) < 86400000) {
    setStatus(`⚠ ${stored.lastQualityWarnings.messages.join("\n⚠ ")}`, "warn");
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "taskComplete") finishTask(message.response);
  });
  chrome.runtime.sendMessage({ action: "getTaskStatus" }, (status) => {
    if (chrome.runtime.lastError || !status) return;
    if (status.running) {
      currentTaskMode = status.mode;
      startTaskTimer(status.mode, status.startedAt || Date.now());
      document.querySelectorAll("#manageView button:not(#closeManage)").forEach((button) => { button.disabled = true; });
    } else if (status.result && status.finishedAt && Date.now() - status.finishedAt < 120000) {
      currentTaskMode = status.mode;
      finishTask(status.result, status.mode);
      chrome.storage.session.set({ taskStatus: { running: false } });
    }
  });
  if (!stored.onboarded) {
    showOnboarding();
  } else {
    document.getElementById("search").focus();
  }
}

document.addEventListener("DOMContentLoaded", initialize);
