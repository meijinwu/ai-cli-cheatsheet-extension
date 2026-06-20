"use strict";

const CORE = window.CHEATSHEET_CORE;
const STORAGE_KEYS = ["favourites", "recentCopies", "enabledTools", "platform", "onboarded", "lastQuery", "pendingUpdate"];
const CAT_LABEL = { shortcut: "⌨ 快捷键", slash: "/ 命令", flag: "--flag" };
const BUILTIN_IDS = new Set(["claude-code", "codex", "gemini-cli", "antigravity-cli", "opencode", "idea", "vs-code"]);

let activeTool = "all";
let activeCat = null;
let favourites = new Set();
let recents = [];
let enabledTools = new Set();
let platform = detectPlatform();
let pendingUpdate = null;
let currentTaskMode = null;

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

function getAllData() {
  return window.CHEATSHEET_DATA || {};
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
    ...visibleToolIds().map((id) => [id, getAllData()[id].meta.name]),
  ];
  quick.innerHTML = quickItems.map(([id, label]) => `<button class="chip ${activeTool === id ? "active" : ""}" data-tool="${id}">${escapeHtml(label)}</button>`).join("");
  quick.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => {
    activeTool = button.dataset.tool;
    renderFilters();
    render();
  }));

  const categories = document.getElementById("categoryFilters");
  categories.innerHTML = Object.entries(CAT_LABEL).map(([id, label]) =>
    `<button class="chip ${activeCat === id ? "active" : ""}" data-cat="${id}">${label}</button>`
  ).join("") + `<button id="clearFilters" class="chip filter-clear">清除筛选</button>`;
  categories.querySelectorAll("[data-cat]").forEach((button) => button.addEventListener("click", () => {
    activeCat = activeCat === button.dataset.cat ? null : button.dataset.cat;
    renderFilters();
    render();
  }));
  document.getElementById("clearFilters").addEventListener("click", () => {
    activeTool = "all";
    activeCat = null;
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
      entries.push({ toolId, itemId: itemId(toolId, item), item, displayCmd: platformInfo.command, platformInfo });
    });
  });
  return entries;
}

function renderRow(entry, includeBadge = false) {
  const tool = getAllData()[entry.toolId];
  const key = `${entry.toolId}::${entry.itemId}`;
  const note = entry.platformInfo.unsupported ? "当前平台未覆盖" : entry.platformInfo.usedFallback ? "使用通用写法" : "";
  return `<div class="row" tabindex="0" data-tool="${entry.toolId}" data-item="${entry.itemId}">
    <div class="cmd"><span class="dot" style="background:${escapeHtml(tool.meta.color)}"></span>${escapeHtml(entry.displayCmd)}
      ${includeBadge ? `<span class="context">${escapeHtml(tool.meta.name)}</span>` : ""}
      ${entry.item.context ? `<span class="context">${escapeHtml(entry.item.context)}</span>` : ""}
      ${note ? `<span class="platform-note">${note}</span>` : ""}
    </div>
    <div class="zh">${escapeHtml(entry.item.zh)}</div><div class="en">${escapeHtml(entry.item.en)}</div>
    <div class="row-actions"><button class="act copy-btn" title="复制命令">⧉</button><button class="act fav-btn ${favourites.has(key) ? "fav-active" : ""}" title="收藏">${favourites.has(key) ? "♥" : "♡"}</button></div>
  </div>`;
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
  if (activeTool === "recent" && !query.trim()) ranked.sort((a, b) =>
    (recentOrder.get(`${a.toolId}::${a.itemId}`) ?? 99) - (recentOrder.get(`${b.toolId}::${b.itemId}`) ?? 99)
  );
  entries = ranked;
  document.getElementById("countBar").textContent = `共 ${entries.length} 条结果 · ${platform === "mac" ? "macOS" : platform === "windows" ? "Windows" : "Linux"}`;

  if (!entries.length) {
    main.innerHTML = `<div class="empty">${activeTool === "recent" ? "还没有最近复制的命令" : activeTool === "favourites" ? "还没有收藏的命令" : "没有匹配结果，试试用途词，例如“清空”“模型”“历史”"}</div>`;
    return;
  }

  if (query.trim() || activeTool === "recent" || activeTool === "favourites") {
    main.innerHTML = entries.map((entry) => renderRow(entry, true)).join("");
  } else {
    const grouped = new Map();
    entries.forEach((entry) => {
      if (!grouped.has(entry.toolId)) grouped.set(entry.toolId, []);
      grouped.get(entry.toolId).push(entry);
    });
    main.innerHTML = [...grouped].map(([toolId, rows]) => {
      const tool = getAllData()[toolId];
      return `<section><div class="section-title"><span class="badge" style="background:${escapeHtml(tool.meta.color)}">${escapeHtml(tool.meta.name)}</span><span class="count">${rows.length} 条</span><button class="source-toggle" data-source="${toolId}">来源与更新时间 ▾</button></div>${sourceCard(toolId)}${rows.map((entry) => renderRow(entry)).join("")}</section>`;
    }).join("");
  }
}

function findEntry(toolId, itemIdValue) {
  const item = getAllData()[toolId]?.items.find((candidate) => itemId(toolId, candidate) === itemIdValue);
  return item ? { toolId, itemId: itemIdValue, item } : null;
}

function bindHomeEvents() {
  document.getElementById("search").addEventListener("input", (event) => {
    storageSet({ lastQuery: event.target.value });
    render();
  });
  document.getElementById("clearSearch").addEventListener("click", () => {
    document.getElementById("search").value = "";
    storageSet({ lastQuery: "" });
    render();
  });
  document.getElementById("openManage").addEventListener("click", () => showView("manage"));
  document.getElementById("closeManage").addEventListener("click", () => showView("home"));
  document.getElementById("main").addEventListener("click", async (event) => {
    const sourceButton = event.target.closest("[data-source]");
    if (sourceButton) {
      document.getElementById(`source-${sourceButton.dataset.source}`)?.classList.toggle("show");
      return;
    }
    const row = event.target.closest(".row");
    if (!row) return;
    const entry = findEntry(row.dataset.tool, row.dataset.item);
    if (!entry) return;
    const key = `${entry.toolId}::${entry.itemId}`;
    if (event.target.closest(".copy-btn")) {
      const copyButton = event.target.closest(".copy-btn");
      const command = CORE.getPlatformCommand(entry.item, platform).command;
      await navigator.clipboard.writeText(command);
      recents = CORE.updateRecent(recents, { toolId: entry.toolId, itemId: entry.itemId, command }, 20);
      await storageSet({ recentCopies: recents });
      copyButton.textContent = "✓";
      setTimeout(() => {
        if (copyButton.isConnected) copyButton.textContent = "⧉";
      }, 1000);
      return;
    }
    if (event.target.closest(".fav-btn")) {
      favourites.has(key) ? favourites.delete(key) : favourites.add(key);
      await storageSet({ favourites: [...favourites] });
      render();
    }
  });
  document.getElementById("main").addEventListener("keydown", (event) => {
    const rows = [...document.querySelectorAll("#main .row")];
    const index = rows.indexOf(document.activeElement);
    if (index < 0) return;
    if (event.key === "ArrowDown" && index < rows.length - 1) rows[index + 1].focus();
    else if (event.key === "ArrowUp" && index > 0) rows[index - 1].focus();
    else if (event.key === "Enter") rows[index].querySelector(".copy-btn")?.click();
    else return;
    event.preventDefault();
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
    const canDelete = !meta.builtIn && !BUILTIN_IDS.has(toolId);
    return `<div class="tool-card"><div class="tool-title"><input type="checkbox" data-enabled="${toolId}" ${enabledTools.has(toolId) ? "checked" : ""}><label>${escapeHtml(meta.name)}</label></div>
      <div class="meta">${escapeHtml(meta.coverage || meta.source)}<br>更新：${escapeHtml(meta.updatedAt || "未标注")}${meta.sourceUrl ? ` · <a href="${escapeHtml(meta.sourceUrl)}" target="_blank">官方来源</a>` : ""}</div>
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
  const detailRows = [
    ...(pendingUpdate.diff?.added || []).map((item) => `＋ ${item.cmd} · ${item.zh}`),
    ...(pendingUpdate.diff?.modified || []).map((item) => `≈ ${item.before} → ${item.after}`),
    ...(pendingUpdate.diff?.removed || []).map((item) => `－ ${item.cmd} · ${item.zh}`),
  ];
  panel.hidden = false;
  panel.innerHTML = `<h2>发现 ${escapeHtml(getAllData()[pendingUpdate.toolId]?.meta.name || pendingUpdate.toolId)} 更新</h2>
    <div class="diff-summary"><div class="diff-stat"><strong>${counts.added || 0}</strong>新增</div><div class="diff-stat"><strong>${counts.modified || 0}</strong>修改</div><div class="diff-stat"><strong>${counts.removed || 0}</strong>删除</div><div class="diff-stat"><strong>${counts.meta || 0}</strong>元数据</div></div>
    <div class="diff-list">${detailRows.length ? detailRows.map((row) => `<div>${escapeHtml(row)}</div>`).join("") : "<div>仅来源或更新时间发生变化</div>"}</div>
    <div class="diff-actions"><button id="applyPending" class="text-btn primary">应用更新</button><button id="discardPending" class="text-btn">放弃</button></div>`;
  document.getElementById("applyPending").addEventListener("click", () => runTask("apply_update", { token: pendingUpdate.pendingToken }));
  document.getElementById("discardPending").addEventListener("click", () => runTask("discard_update", { token: pendingUpdate.pendingToken }));
}

function runTask(mode, payload) {
  currentTaskMode = mode;
  setStatus(mode === "preview_update" ? "正在查询官方文档并生成更新预览，关闭面板不会中断…" : "正在执行，请稍候…");
  document.querySelectorAll("#manageView button").forEach((button) => { button.disabled = true; });
  chrome.runtime.sendMessage({ action: "startTask", mode, ...payload }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      finishTask({ ok: false, error: chrome.runtime.lastError?.message || response?.error || "启动失败" }, mode);
    }
  });
}

async function finishTask(response, mode = currentTaskMode) {
  document.querySelectorAll("#manageView button").forEach((button) => { button.disabled = false; });
  if (!response?.ok) {
    setStatus(`❌ ${response?.error || "未知错误"}`, "err");
    return;
  }
  if (mode === "preview_update" && response.pendingToken) {
    pendingUpdate = response;
    await storageSet({ pendingUpdate });
    setStatus(response.output || "发现可用更新", "ok");
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
  setStatus(`✅ ${response.output || "完成"}${response.changed ? "\n正在重新加载扩展…" : ""}`, "ok");
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
  renderOnboardChoices();
  document.getElementById("onboarding").classList.add("show");
  if (force) document.getElementById("onboarding").dataset.forced = "true";
}

function hideOnboarding() {
  document.getElementById("onboarding").classList.remove("show");
  delete document.getElementById("onboarding").dataset.forced;
}

function bindOnboarding() {
  document.getElementById("saveOnboarding").addEventListener("click", async () => {
    const selected = [...document.querySelectorAll("#onboardTools input:checked")].map((input) => input.value);
    enabledTools = new Set(selected.length ? selected : getToolIds());
    platform = document.getElementById("onboardPlatform").value;
    await storageSet({ enabledTools: [...enabledTools], platform, onboarded: true });
    hideOnboarding();
    renderFilters();
    render();
    renderManage();
  });
  document.getElementById("skipOnboarding").addEventListener("click", async () => {
    enabledTools = new Set(getToolIds());
    await storageSet({ enabledTools: [...enabledTools], platform, onboarded: true });
    hideOnboarding();
    renderFilters();
    render();
  });
}

async function initialize() {
  try {
    await loadCheatsheetData();
  } catch (error) {
    document.getElementById("main").innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
    return;
  }
  const stored = await storageGet(STORAGE_KEYS);
  favourites = new Set(stored.favourites || []);
  recents = stored.recentCopies || [];
  platform = stored.platform || platform;
  enabledTools = new Set(Array.isArray(stored.enabledTools) ? stored.enabledTools.filter((id) => getAllData()[id]) : getToolIds());
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

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "taskComplete") finishTask(message.response);
  });
  chrome.runtime.sendMessage({ action: "getTaskStatus" }, (status) => {
    if (chrome.runtime.lastError || !status) return;
    if (status.running) {
      currentTaskMode = status.mode;
      setStatus("任务正在后台运行，关闭面板不会中断。");
      document.querySelectorAll("#manageView button").forEach((button) => { button.disabled = true; });
    } else if (status.result && status.finishedAt && Date.now() - status.finishedAt < 120000) {
      currentTaskMode = status.mode;
      finishTask(status.result, status.mode);
      chrome.storage.session.set({ taskStatus: { running: false } });
    }
  });
  if (!stored.onboarded) showOnboarding();
}

document.addEventListener("DOMContentLoaded", initialize);
