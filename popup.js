"use strict";

const CORE = window.CHEATSHEET_CORE;
const STORAGE_KEYS = ["favourites", "recentCopies", "enabledTools", "platform", "onboarded", "lastQuery", "pendingUpdate", "lastQualityWarnings", "webVerify"];
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
  terminal: ["git", "linux"],
};

let activeTool = "all";
let activeCat = null;
let favourites = new Set();
let recents = [];
let enabledTools = new Set();
let platform = detectPlatform();
let webVerify = false;
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

// 来源信任档位：缺省按官方处理，向后兼容历史数据。
function sourceTierLabel(sourceTier) {
  if (sourceTier === "quasi-official") return "类官方";
  if (sourceTier === "community") return "社区";
  return "官方";
}

function normalizedSources(meta) {
  if (Array.isArray(meta.sources) && meta.sources.length) return meta.sources;
  if (!meta.sourceUrl) return [];
  const tier = meta.sourceTier || "official";
  return [{
    id: "primary",
    title: meta.source,
    url: meta.sourceUrl,
    kind: tier === "official" ? "official-doc" : tier === "quasi-official" ? "authoritative-reference" : "community",
    maintainer: new URL(meta.sourceUrl).hostname,
    evidenceTier: tier === "official" ? "first-party" : tier === "quasi-official" ? "authoritative-community" : "community",
    lastVerifiedAt: meta.updatedAt,
  }];
}

function evidenceLabel(tier, kind = "") {
  if (kind === "local-help") return "本机帮助确认";
  if (kind === "official-repository") return "官方仓库确认";
  if (tier === "first-party") return "官方确认";
  if (tier === "authoritative-community") return "权威社区补充";
  if (tier === "community") return "社区参考";
  return "未独立核验";
}

function exampleProvenanceLabel(example) {
  if (example.authorship === "official" && example.adaptation === "verbatim") return "官方原例";
  if (example.evidenceTier === "first-party") return "基于官方资料改写";
  if (example.evidenceTier === "authoritative-community") return "权威社区补充";
  if (example.authorship === "editorial") return "编辑整理场景";
  return "自动生成";
}

function exampleEvidenceUrl(example, sources) {
  if (example.sourceUrl) return example.sourceUrl;
  const sourceId = (example.sourceIds || [])[0];
  return sources.find((source) => source.id === sourceId)?.url || "";
}

function itemEvidence(entry) {
  if (entry.item.evidenceStatus === "verified") return "已核验";
  if (entry.item.evidenceStatus === "partial") return "部分核验";
  return "未核验";
}

// 信任标签的悬浮解释，避免“类官方/部分核验”等术语对用户成为黑话。
const EVIDENCE_TOOLTIP = {
  verified: "命令的存在性与语义都有可核验来源支撑",
  partial: "仅其中一项声明（存在性或语义）有来源支撑",
  unverified: "暂无可复核的独立来源",
};

function evidenceTooltip(status) {
  return EVIDENCE_TOOLTIP[status] || EVIDENCE_TOOLTIP.unverified;
}

function tierTooltip(tier) {
  if (tier === "quasi-official") return "来源为类官方/权威社区资料，而非官方一手文档";
  if (tier === "community") return "来源为社区整理，可靠性相对较低";
  return "来源为官方一手文档";
}

function exampleProvenanceTooltip(example) {
  const tier = {
    "first-party": "有官方一手出处",
    "authoritative-community": "有权威社区出处",
    community: "社区出处",
    none: "无独立出处",
  }[example.evidenceTier] || "无独立出处";
  return `${exampleProvenanceLabel(example)}：${tier}`;
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

function commandEvidenceHtml(item, sources) {
  const refs = item.evidenceRefs || [];
  if (!refs.length) return `<div class="command-evidence">命令证据：未提供可复核定位</div>`;
  return `<div class="command-evidence">命令证据：${refs.map((ref) => {
    const source = sources.find((candidate) => candidate.id === ref.sourceId);
    const claims = ref.claims.map((claim) => ({
      existence: "存在性", semantics: "语义", platform: "平台", example: "案例",
    })[claim] || claim).join("、");
    const label = `${source?.title || ref.sourceId} · ${claims} · ${ref.locator}`;
    return source?.url
      ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
      : escapeHtml(label);
  }).join("<br>")}</div>`;
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

function shellLabel(kind, value) {
  return SHELL_FILTER_LABELS[kind]?.[value] || value;
}

// Shell sub-dimensions (layer/family/portability/topic) surface as per-item row
// tags and via search only — they are intentionally not exposed as filter chips,
// which would flatten four overlapping axes into a cluttered, duplicate-prone row.
function shellTags(item) {
  if (!item.shell) return [];
  return [
    shellLabel("layer", item.shell.layer),
    item.shell.family,
    shellLabel("portability", item.shell.portability),
    shellLabel("topic", item.shell.topic),
  ].filter(Boolean);
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
    ...visibleToolIds().map((id) => [id, getAllData()[id].meta.name]),
  ];
  quick.innerHTML = quickItems.map(([id, label]) => `<button class="chip ${activeTool === id ? "active" : ""}" data-tool="${id}">${escapeHtml(label)}</button>`).join("");
  quick.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => {
    activeTool = button.dataset.tool;
    resetResultLimits();
    renderFilters();
    render();
  }));

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
    activeCat = null;
    resetResultLimits();
    document.getElementById("search").value = "";
    storageSet({ lastQuery: "" });
    renderFilters();
    render();
  });
}

// 用于结果计数栏：把当前生效的工具筛选与分类筛选组合成可读标签，
// 让用户看到工具与分类筛选是“叠加”关系。
function activeFilterLabel() {
  const data = getAllData();
  const parts = [];
  if (activeTool === "recent") parts.push("最近");
  else if (activeTool === "favourites") parts.push("收藏");
  else if (activeTool !== "all" && data[activeTool]) parts.push(data[activeTool].meta.name);
  if (activeCat) parts.push(CAT_LABEL[activeCat]);
  return parts.join(" ＋ ");
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
  const sources = normalizedSources(tool.meta);
  const key = `${entry.toolId}::${entry.itemId}`;
  const examples = (entry.item.examples || []).map((example, index) => ({
    ...example,
    index,
    platformInfo: CORE.getPlatformExample(example, platform),
  })).filter((example) => !example.platformInfo.unsupported);
  const examplesOpen = expandedExamples.has(key);
  const commandRisk = riskFor(entry.displayCmd, examples);
  const note = entry.platformInfo.unsupported ? "当前平台不可用" : entry.platformInfo.usedFallback ? "通用写法" : "";
  const matchReason = query.trim() && entry.matchReason
    ? `<span class="match-reason">主要匹配${escapeHtml(entry.matchReason.label)}：${highlightHtml(entry.matchReason.term, query)}</span>`
    : "";
  const summaryExample = examples[0];
  const summary = query.trim() && !examplesOpen && summaryExample
    ? `<span class="example-summary">常用：${highlightHtml(summaryExample.platformInfo.value, query)} · ${highlightHtml(summaryExample.description, query)}</span>`
    : "";
  const evidenceStatus = entry.item.evidenceStatus || "unverified";
  const tierTag = tool.meta.sourceTier && tool.meta.sourceTier !== "official"
    ? `<span class="trust-tag tier" title="${escapeHtml(tierTooltip(tool.meta.sourceTier))}">${escapeHtml(sourceTierLabel(tool.meta.sourceTier))}</span>`
    : "";
  const tags = [
    note ? `<span class="trust-tag">${escapeHtml(note)}</span>` : "",
    ...shellTags(entry.item).map((label) => `<span class="trust-tag shell-tag">${escapeHtml(label)}</span>`),
    commandRisk.requiresConfirmation ? `<span class="trust-tag risk" title="${escapeHtml(commandRisk.warning)}">高风险</span>` : "",
    tierTag,
    `<span class="trust-tag tier evidence-${escapeHtml(evidenceStatus)}" title="${escapeHtml(evidenceTooltip(evidenceStatus))}">${escapeHtml(itemEvidence(entry))}</span>`,
  ].join("");
  const examplesId = `examples-${entry.toolId}-${entry.itemId}`;
  const examplesHtml = examplesOpen ? `<div class="examples">${commandEvidenceHtml(entry.item, sources)}${examples.map((example) => `
    <div class="example">
      <div class="example-value">${highlightHtml(example.platformInfo.value, query)}</div>
      <div class="example-desc">${highlightHtml(example.description, query)}</div>
      ${example.scenario ? `<div class="example-context">场景：${escapeHtml(example.scenario)}</div>` : ""}
      ${example.goal ? `<div class="example-context">目标：${escapeHtml(example.goal)}</div>` : ""}
      ${example.expected ? `<div class="example-context">结果：${escapeHtml(example.expected)}</div>` : ""}
      ${example.prerequisites ? `<div class="example-context">前提：${escapeHtml(example.prerequisites)}</div>` : ""}
      ${example.caveat ? `<div class="example-context">注意：${escapeHtml(example.caveat)}</div>` : ""}
      <div class="example-source" title="${escapeHtml(exampleProvenanceTooltip(example))}">${escapeHtml(exampleProvenanceLabel(example))}${exampleEvidenceUrl(example, sources) ? ` · <a class="example-doc" href="${escapeHtml(exampleEvidenceUrl(example, sources))}" target="_blank" rel="noopener noreferrer">证据</a>` : ""}</div>
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
  const sources = normalizedSources(meta);
  const sourceEntry = (source) => `<div class="source-entry">
    <span>${escapeHtml(evidenceLabel(source.evidenceTier, source.kind))} · ${escapeHtml(source.title || source.id)} · ${escapeHtml(source.maintainer || "维护者未标注")}${source.lastVerifiedAt ? ` · ${escapeHtml(source.lastVerifiedAt)}` : ""}</span>
    ${source.url ? ` <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">打开 ↗</a>` : ""}
  </div>`;
  const primarySources = sources.slice(0, 6);
  const remainingSources = sources.slice(6);
  const references = Array.isArray(meta.references) ? meta.references : [];
  return `<div class="source-card" id="source-${toolId}">
    <div>${escapeHtml(meta.coverage || meta.source)}</div>
    <div>${escapeHtml(updateStatusLabel(meta))} · 内容核验：${escapeHtml(meta.contentCheckedAt || meta.updatedAt || "未标注")} · 来源检查：${escapeHtml(meta.sourceCheckedAt || "未标注")} · 平台：${escapeHtml((meta.platforms || []).join(" / ") || "未标注")}</div>
    <div class="source-list">${primarySources.map(sourceEntry).join("") || "<div>尚未登记可核验来源</div>"}
      ${remainingSources.length ? `<details><summary>查看其余 ${remainingSources.length} 个来源</summary>${remainingSources.map(sourceEntry).join("")}</details>` : ""}
      ${references.length ? `<details><summary>背景参考 ${references.length} 个（不证明具体命令）</summary>${references.map(sourceEntry).join("")}</details>` : ""}
    </div>
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
  const filterLabel = activeFilterLabel();
  const synonyms = query.trim() ? CORE.expandedSynonyms(query).slice(0, 4) : [];
  const countSegments = [
    `共 ${entries.length} 条结果`,
    relaxed ? '<span class="relaxed-note">已放宽为任一关键词匹配</span>' : "",
    filterLabel ? `筛选：${escapeHtml(filterLabel)}` : "",
    synonyms.length ? `同义词：${escapeHtml(synonyms.join("、"))}` : "",
    platform === "mac" ? "macOS" : platform === "windows" ? "Windows" : "Linux",
  ].filter(Boolean);
  document.getElementById("countBar").innerHTML = countSegments.join(" · ");

  if (!entries.length) {
    const hasFilter = Boolean(activeCat) || !["all", "recent", "favourites"].includes(activeTool);
    const emptyMessage = activeTool === "recent"
      ? "还没有最近复制的命令，复制任意命令后会出现在这里"
      : activeTool === "favourites"
        ? "还没有收藏的命令，点条目右侧的 ♡ 即可收藏"
        : CORE.emptySearchHint(query, { hasFilter });
    main.innerHTML = `<div class="empty">${escapeHtml(emptyMessage)}</div>`;
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
      return `<section><div class="section-title"><span class="badge" style="background:${escapeHtml(tool.meta.color)}">${escapeHtml(tool.meta.name)}</span><span class="count">${rows.length} 条</span><button class="source-toggle" data-source="${toolId}" aria-expanded="false" aria-controls="source-${toolId}">来源与核验状态 ▾</button></div>${sourceCard(toolId)}${visible.map((entry) => renderRow(entry, query)).join("")}${more}</section>`;
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
  const webToggle = document.getElementById("webVerifyToggle");
  webToggle.checked = webVerify;
  webToggle.onchange = () => {
    webVerify = webToggle.checked;
    storageSet({ webVerify });
  };
  const tools = document.getElementById("manageTools");
  tools.innerHTML = getToolIds().map((toolId) => {
    const meta = getAllData()[toolId].meta;
    const canDelete = !meta.builtIn;
    const policy = updatePolicy(meta);
    const sources = normalizedSources(meta);
    const evidenceCounts = { verified: 0, partial: 0, unverified: 0 };
    getAllData()[toolId].items.forEach((item) => {
      evidenceCounts[item.evidenceStatus || "unverified"] += 1;
    });
    const verification = meta.verificationStatus === "web-assisted"
      ? "联网辅助整理"
      : meta.verificationStatus === "model-knowledge"
        ? "模型知识整理"
        : meta.verificationStatus === "manual"
          ? "人工维护"
          : "整理方式未标注";
    const exampleItems = (getAllData()[toolId].items || [])
      .map((item) => enrichItem(toolId, item))
      .filter((item) => item.examples?.length);
    const authorshipCounts = { official: 0, editorial: 0, generated: 0 };
    const evidenceCountsForExamples = {
      "first-party": 0,
      "authoritative-community": 0,
      community: 0,
      none: 0,
    };
    exampleItems.forEach((item) => item.examples.forEach((example) => {
      if (authorshipCounts[example.authorship] !== undefined) authorshipCounts[example.authorship] += 1;
      if (evidenceCountsForExamples[example.evidenceTier] !== undefined) {
        evidenceCountsForExamples[example.evidenceTier] += 1;
      }
    }));
    return `<div class="tool-card"><div class="tool-title"><input type="checkbox" data-enabled="${toolId}" ${enabledTools.has(toolId) ? "checked" : ""}><label>${escapeHtml(meta.name)}</label></div>
      <div class="meta">${escapeHtml(meta.coverage || meta.source)}<br>来源 ${sources.length} 个 · ${escapeHtml(updateStatusLabel(meta))} · 数据整理方式：<span class="verify">${escapeHtml(verification)}</span></div>
      <details class="stats-detail"><summary>数据质量明细</summary>
        <div class="meta">条目核验：已核验 ${evidenceCounts.verified} / 部分核验 ${evidenceCounts.partial} / 未核验 ${evidenceCounts.unverified}</div>
        <div class="meta">用法覆盖：${exampleItems.length}/${getAllData()[toolId].items.length}</div>
        <div class="meta">案例编写：官方原例 ${authorshipCounts.official} / 编辑整理 ${authorshipCounts.editorial} / 自动生成 ${authorshipCounts.generated}</div>
        <div class="meta">案例证据：第一方 ${evidenceCountsForExamples["first-party"]} / 权威社区 ${evidenceCountsForExamples["authoritative-community"]} / 普通社区 ${evidenceCountsForExamples.community} / 无独立证据 ${evidenceCountsForExamples.none}</div>
      </details>
      ${policy === "manual-only" ? "" : `<div class="tool-actions"><button class="text-btn" data-update="${toolId}">${escapeHtml(updateActionLabel(meta))}</button></div>`}
      <details class="advanced-actions"><summary>高级操作</summary>
        <div class="meta">强制深度检查会联网重新发现来源并调用模型，耗时更长且会计入模型用量。</div>
        <div class="tool-actions"><button class="text-btn" data-deep-update="${toolId}">重新核验资料</button>${canDelete ? `<button class="text-btn danger" data-remove="${toolId}">删除</button>` : `<span class="meta">内置工具可隐藏，不可删除</span>`}</div>
      </details></div>`;
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
    runTask("preview_update", {
      tool: toolId,
      display_name: getAllData()[toolId].meta.name,
      prefer_web: true,
    });
  }));
  tools.querySelectorAll("[data-deep-update]").forEach((button) => button.addEventListener("click", () => {
    const toolId = button.dataset.deepUpdate;
    if (!confirm("强制深度检查会重新发现来源并调用模型，可能需要数分钟。继续吗？")) return;
    runTask("preview_update", {
      tool: toolId,
      display_name: getAllData()[toolId].meta.name,
      prefer_web: true,
      deep_check: true,
    });
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
  const sourceChanges = pendingUpdate.diff?.sourceChanges || {};
  const detailRows = [
    ...(pendingUpdate.updateSignal?.marker ? [`版本信号：${pendingUpdate.updateSignal.marker}（${pendingUpdate.updateSignal.detail || pendingUpdate.updateSignal.signalType}）`] : []),
    ...(pendingUpdate.diff?.added || []).map((item) => `＋ ${item.cmd} · ${item.zh}`),
    ...(pendingUpdate.diff?.modified || []).map((item) => `≈ ${item.before} → ${item.after}`),
    ...(pendingUpdate.diff?.removed || []).map((item) => `－ ${item.cmd} · ${item.zh}`),
    ...(sourceChanges.added || []).map((source) => `＋ 来源：${source.title || source.id}`),
    ...(sourceChanges.removed || []).map((source) => `－ 来源：${source.title || source.id}`),
    ...(sourceChanges.conflicts || []).map((conflict) => `⚠ 来源冲突：${conflict}`),
    ...((sourceChanges.statusDowngrades || []).length ? [`⚠ ${sourceChanges.statusDowngrades.length} 个条目的核验状态下降`] : []),
    ...((sourceChanges.evidenceRefChanges || []).length ? [`≈ ${sourceChanges.evidenceRefChanges.length} 个条目的证据断言发生变化`] : []),
    ...((sourceChanges.locatorLosses || []).length ? [`⚠ ${sourceChanges.locatorLosses.length} 个条目的证据定位被移除`] : []),
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

function taskBaseMsg(mode, payload = {}) {
  if (mode === "preview_update") return "正在检查实际版本变化；如需生成预览会继续核对资料，关闭面板不会中断";
  if (mode === "add_tool" && payload.tool === "shell") return "正在分批生成 Shell 聚合数据，关闭面板不会中断";
  if (mode === "add_tool") return "正在整理并生成工具数据，关闭面板不会中断";
  return "正在执行，请稍候";
}

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

function startTaskTimer(mode, startedAt, payload = {}) {
  if (_taskTimer) clearInterval(_taskTimer);
  const base = taskBaseMsg(mode, payload);
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
  startTaskTimer(mode, Date.now(), payload);
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
    const normalized = normalizeAddTool(displayName);
    const { tool } = normalized;
    if (!tool) return setStatus("工具名称需要包含英文字母或数字", "err");
    const scopeHint = overbroadAddToolHint(displayName, tool);
    if (scopeHint) return setStatus(scopeHint, "err");
    if (getAllData()[tool]) return setStatus("该工具已收录，请使用检查更新", "err");
    runTask("add_tool", { tool, display_name: normalized.displayName, prefer_web: webVerify });
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
  document.getElementById("main").innerHTML = `<div class="empty loading">正在加载速查表…</div>`;
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
  webVerify = stored.webVerify === true;
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
