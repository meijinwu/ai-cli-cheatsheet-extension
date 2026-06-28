"use strict";

const CORE = window.CHEATSHEET_CORE;
const STATE = window.CHEATSHEET_POPUP_STATE;
const RENDER = window.CHEATSHEET_POPUP_RENDER;

let activeTool = "all";
let activeCat = null;
let activeShellFilter = null;
let favourites = new Set();
let recents = [];
let enabledTools = new Set();
let dismissedRecommendations = new Set();
let platform = STATE.detectPlatform();
let webVerify = false;
let recommendationQuery = "";
let activeRecommendationCategory = "all";
let showDismissedRecommendations = false;
let addingRecommendation = null;
let recommendationBatchOffset = 0;
let aiRecommendations = [];
const RECOMMENDATION_BATCH_SIZE = 6;
const AI_SUGGEST_COUNT = 8;
let pendingUpdate = null;
let currentTaskMode = null;
let expandedTools = new Set();
let expandedExamples = new Set();
let enrichmentIndex = new Map();
let entryIndex = { entries: [], byKey: new Map(), validKeys: new Set() };
let searchLimit = STATE.SEARCH_INITIAL_LIMIT;
let lastAutoExpandedQuery = "";
let onboardingReturnFocus = null;
let toastTimer = null;
let pendingRiskResolve = null;

function getAllData() {
  return window.CHEATSHEET_DATA || {};
}

function storageGet(keys) {
  return STATE.storageGet(chrome, keys);
}

function storageSet(values) {
  return STATE.storageSet(chrome, values);
}

function storageSessionGet(keys) {
  return new Promise((resolve) => {
    try {
      chrome.storage.session.get(keys, (result) => resolve(result || {}));
    } catch (_error) {
      resolve({});
    }
  });
}

function storageSessionSet(values) {
  try {
    return chrome.storage.session.set(values);
  } catch (_error) {
    return Promise.resolve();
  }
}

function currentState() {
  return {
    activeTool,
    activeCat,
    activeShellFilter,
    favourites,
    recents,
    enabledTools,
    platform,
    expandedTools,
    expandedExamples,
    searchLimit,
  };
}

function resetResultLimits() {
  expandedTools = new Set();
  searchLimit = STATE.SEARCH_INITIAL_LIMIT;
}

function rebuildEntryIndex() {
  entryIndex = STATE.createEntryIndex(getAllData(), enrichmentIndex);
}

function setStatus(text, kind = "") {
  const status = document.getElementById("manageStatus");
  status.textContent = text;
  status.className = text ? `status show ${kind}` : "status";
}

const setManageButtonsDisabled = window.CHEATSHEET_POPUP_TASKS.createButtonDisabler(
  document,
  "#manageView button:not(#closeManage)",
  "#manageView button"
);

const taskController = window.CHEATSHEET_POPUP_TASKS.createTaskController({
  chrome,
  setStatus,
  setManageButtonsDisabled,
  storageSet,
  renderPending,
  getCurrentTaskMode: () => currentTaskMode,
  setCurrentTaskMode: (mode) => { currentTaskMode = mode; },
  setPendingUpdate: (value) => { pendingUpdate = value; },
  afterFinish: (mode, response) => {
    if (mode === "suggest_tools" && response?.ok && Array.isArray(response.suggestions)) {
      mergeAiSuggestions(response.suggestions);
    }
    if (addingRecommendation) {
      addingRecommendation = null;
      if (document.getElementById("manageView").classList.contains("active")) renderManage();
    }
  },
});

function manageIsActive() {
  return document.getElementById("manageView").classList.contains("active");
}

async function mergeAiSuggestions(suggestions) {
  const seen = new Set(aiRecommendations.map((item) => item.tool));
  const installed = getAllData();
  const additions = suggestions.filter((item) =>
    item && typeof item.tool === "string" && !seen.has(item.tool) && !installed[item.tool]
  );
  if (additions.length) {
    aiRecommendations = [...aiRecommendations, ...additions];
    await storageSessionSet({ aiRecommendations });
  }
  if (manageIsActive()) renderManage();
}

function requestAiSuggestions() {
  const exclude = [...new Set([
    ...STATE.getToolIds(getAllData()),
    ...STATE.TOOL_RECOMMENDATIONS.map((item) => item.tool),
    ...dismissedRecommendations,
    ...aiRecommendations.map((item) => item.tool),
  ])];
  taskController.runTask("suggest_tools", { platform, count: AI_SUGGEST_COUNT, exclude });
}

function hideToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("show");
  if (toastTimer) clearTimeout(toastTimer);
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function showUndoToast(text, onUndo) {
  const toast = document.getElementById("toast");
  toast.textContent = "";
  const label = document.createElement("span");
  label.textContent = text;
  const undo = document.createElement("button");
  undo.type = "button";
  undo.className = "toast-undo";
  undo.textContent = "撤销";
  undo.addEventListener("click", () => {
    hideToast();
    onUndo();
  });
  toast.append(label, undo);
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4000);
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

function closeRiskDialog(confirmed) {
  const dialog = typeof document.getElementById === "function" ? document.getElementById("riskDialog") : null;
  if (dialog) dialog.classList.remove("show");
  if (pendingRiskResolve) pendingRiskResolve(Boolean(confirmed));
  pendingRiskResolve = null;
}

function confirmRiskCopy(value, risk) {
  if (!risk.requiresConfirmation) return Promise.resolve(true);
  const dialog = typeof document.getElementById === "function" ? document.getElementById("riskDialog") : null;
  if (!dialog) {
    return Promise.resolve(confirm(`这是高风险命令：${risk.warning}\n\n${value}\n\n确定要复制吗？`));
  }
  document.getElementById("riskSummary").textContent = `风险类型：${risk.labels.join("、") || risk.warning || "高风险操作"}`;
  document.getElementById("riskCommand").textContent = value;
  const details = CORE.commandRiskDetails(risk);
  document.getElementById("riskDetails").innerHTML = (details.length ? details : ["复制前请确认命令、路径、目标环境和当前上下文。"])
    .map((detail) => `<li>${RENDER.escapeHtml(detail)}</li>`)
    .join("");
  dialog.classList.add("show");
  document.getElementById("riskCancel").focus();
  return new Promise((resolve) => {
    pendingRiskResolve = resolve;
  });
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
  const html = RENDER.renderFilters(getAllData(), STATE, currentState());
  const quick = document.getElementById("quickFilters");
  quick.innerHTML = html.quickHtml;
  quick.querySelectorAll("[data-tool]").forEach((button) => button.addEventListener("click", () => {
    activeTool = button.dataset.tool;
    if (activeTool !== "shell") activeShellFilter = null;
    resetResultLimits();
    renderFilters();
    render();
  }));

  const categories = document.getElementById("categoryFilters");
  categories.innerHTML = html.categoryHtml;
  categories.querySelectorAll("[data-cat]").forEach((button) => button.addEventListener("click", () => {
    activeCat = activeCat === button.dataset.cat ? null : button.dataset.cat;
    resetResultLimits();
    renderFilters();
    render();
  }));
  document.getElementById("clearFilters").addEventListener("click", () => {
    activeTool = "all";
    activeCat = null;
    activeShellFilter = null;
    resetResultLimits();
    document.getElementById("search").value = "";
    storageSet({ lastQuery: "" });
    renderFilters();
    render();
  });

  const shellFilters = document.getElementById("shellFilters");
  shellFilters.innerHTML = html.shellHtml;
  shellFilters.querySelectorAll("[data-shell-filter]").forEach((button) => button.addEventListener("click", () => {
    activeShellFilter = button.dataset.shellFilter || null;
    resetResultLimits();
    renderFilters();
    render();
  }));
}

function rankVisibleEntries(query) {
  const state = currentState();
  const entries = STATE.collectEntries(entryIndex, getAllData(), CORE, state);
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
  return { entries: ranked, relaxed };
}

function render() {
  const query = document.getElementById("search").value;
  const { entries, relaxed } = rankVisibleEntries(query);
  const normalizedQuery = CORE.normalizeText(query);
  if ((query.trim() || activeTool === "recent" || activeTool === "favourites")
    && normalizedQuery && normalizedQuery !== lastAutoExpandedQuery) {
    if (CORE.normalizeText(entries[0]?.displayCmd) === normalizedQuery) {
      expandedExamples.add(`${entries[0].toolId}::${entries[0].itemId}`);
    }
    lastAutoExpandedQuery = normalizedQuery;
  } else if (!normalizedQuery) {
    lastAutoExpandedQuery = "";
  }

  const filterLabel = STATE.activeFilterLabel(getAllData(), currentState());
  document.getElementById("countBar").innerHTML = RENDER.countBarHtml(
    entries,
    query,
    currentState(),
    STATE,
    CORE,
    filterLabel,
    relaxed
  );
  document.getElementById("main").innerHTML = RENDER.renderResults(entries, query, currentState(), {
    data: getAllData(),
    core: CORE,
    platform,
    expandedExamples,
    favourites,
    helpers: STATE,
  });
  updateManageBadge();
}

function bindHomeEvents() {
  const debouncedRender = STATE.debounce(render, STATE.SEARCH_DEBOUNCE_MS);
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
  document.getElementById("main").addEventListener("click", handleMainClick);
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

async function handleMainClick(event) {
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
    searchLimit += STATE.SEARCH_INITIAL_LIMIT;
    render();
    return;
  }
  const entryWrap = event.target.closest(".entry-wrap");
  if (!entryWrap) return;
  const entry = STATE.findEntry(entryIndex, entryWrap.dataset.tool, entryWrap.dataset.item);
  if (!entry) return;
  const key = `${entry.toolId}::${entry.itemId}`;
  const exampleButton = event.target.closest("[data-example]");
  if (exampleButton) {
    const example = entry.item.examples?.[Number(exampleButton.dataset.example)];
    if (!example) return;
    const value = CORE.getPlatformExample(example, platform).value;
    const risk = CORE.classifyCommandRisk(value, [example]);
    if (!await confirmRiskCopy(value, risk)) return;
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
    const command = platformInfo.command;
    const risk = CORE.classifyCommandRisk(command, entry.item.examples || []);
    if (!await confirmRiskCopy(command, risk)) return;
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
}

function renderManage() {
  document.getElementById("platformSelect").value = platform;
  const webToggle = document.getElementById("webVerifyToggle");
  webToggle.checked = webVerify;
  webToggle.onchange = () => {
    webVerify = webToggle.checked;
    storageSet({ webVerify });
    renderManage();
  };
  const toggles = document.getElementById("manageToolToggles");
  toggles.innerHTML = RENDER.renderManageToolToggles(getAllData(), STATE.getToolIds(getAllData()), currentState());
  toggles.querySelectorAll("[data-enabled]").forEach((checkbox) => checkbox.addEventListener("change", async () => {
    checkbox.checked ? enabledTools.add(checkbox.dataset.enabled) : enabledTools.delete(checkbox.dataset.enabled);
    await storageSet({ enabledTools: [...enabledTools] });
    if (activeTool !== "all" && !enabledTools.has(activeTool)) activeTool = "all";
    renderFilters();
    render();
    renderManage();
  }));

  const recommended = document.getElementById("recommendedTools");
  const recommendSearch = document.getElementById("recommendSearch");
  const showDismissed = document.getElementById("showDismissedRecommendations");
  if (recommendSearch.value !== recommendationQuery) recommendSearch.value = recommendationQuery;
  showDismissed.checked = showDismissedRecommendations;
  const recommendationResult = STATE.filterRecommendedTools(getAllData(), platform, {
    query: recommendationQuery,
    category: activeRecommendationCategory,
    dismissedRecommendations,
    showDismissed: showDismissedRecommendations,
    collectedToolIds: new Set(STATE.getToolIds(getAllData())),
    addingTool: addingRecommendation,
    webVerify,
    batchSize: RECOMMENDATION_BATCH_SIZE,
    batchOffset: recommendationBatchOffset,
    extraRecommendations: aiRecommendations,
  });
  const categoriesEl = document.getElementById("recommendCategories");
  categoriesEl.innerHTML = RENDER.renderRecommendationCategories(recommendationResult);
  categoriesEl.querySelectorAll("[data-recommend-category]").forEach((button) => button.addEventListener("click", () => {
    activeRecommendationCategory = button.dataset.recommendCategory;
    recommendationBatchOffset = 0;
    renderManage();
  }));
  const bulkButton = categoriesEl.querySelector("[data-recommend-bulk]");
  if (bulkButton) bulkButton.addEventListener("click", () => bulkRecommendation(bulkButton.dataset.recommendBulk, recommendationResult));
  const shuffleButton = categoriesEl.querySelector("[data-recommend-shuffle]");
  if (shuffleButton) shuffleButton.addEventListener("click", () => {
    recommendationBatchOffset += RECOMMENDATION_BATCH_SIZE;
    renderManage();
  });
  recommended.innerHTML = RENDER.renderRecommendedTools(recommendationResult);
  recommended.querySelectorAll("[data-recommend-tool]").forEach((button) => button.addEventListener("click", () => {
    addingRecommendation = button.dataset.recommendTool;
    renderManage();
    if (!startAddTool(button.dataset.recommendName, webVerify)) {
      addingRecommendation = null;
      renderManage();
    }
  }));
  recommended.querySelectorAll("[data-recommend-dismiss]").forEach((button) => button.addEventListener("click", () =>
    dismissRecommendation(button.dataset.recommendDismiss, button.dataset.recommendLabel)));
  recommended.querySelectorAll("[data-recommend-restore]").forEach((button) => button.addEventListener("click", async () => {
    dismissedRecommendations.delete(button.dataset.recommendRestore);
    await storageSet({ dismissedRecommendations: [...dismissedRecommendations] });
    renderManage();
  }));

  const tools = document.getElementById("manageTools");
  tools.innerHTML = RENDER.renderManageTools(getAllData(), STATE.getToolIds(getAllData()), currentState(), STATE, entryIndex);
  tools.querySelectorAll("[data-enabled]").forEach((checkbox) => checkbox.addEventListener("change", async () => {
    checkbox.checked ? enabledTools.add(checkbox.dataset.enabled) : enabledTools.delete(checkbox.dataset.enabled);
    await storageSet({ enabledTools: [...enabledTools] });
    if (activeTool !== "all" && !enabledTools.has(activeTool)) activeTool = "all";
    renderFilters();
    render();
    renderManage();
  }));
  tools.querySelectorAll("[data-update]").forEach((button) => button.addEventListener("click", () => {
    const toolId = button.dataset.update;
    taskController.runTask("preview_update", {
      tool: toolId,
      display_name: getAllData()[toolId].meta.name,
      prefer_web: true,
    });
  }));
  tools.querySelectorAll("[data-deep-update]").forEach((button) => button.addEventListener("click", () => {
    const toolId = button.dataset.deepUpdate;
    if (!confirm("强制深度检查会重新发现来源并调用模型，可能需要数分钟。继续吗？")) return;
    taskController.runTask("preview_update", {
      tool: toolId,
      display_name: getAllData()[toolId].meta.name,
      prefer_web: true,
      deep_check: true,
    });
  }));
  tools.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
    const toolId = button.dataset.remove;
    if (confirm(`确定删除 ${getAllData()[toolId].meta.name}？此操作会删除本地数据文件。`)) {
      taskController.runTask("remove_tool", { tool: toolId, display_name: getAllData()[toolId].meta.name });
    }
  }));
  renderPending();
  updateManageBadge();
}

async function dismissRecommendation(tool, label) {
  if (!tool) return;
  dismissedRecommendations.add(tool);
  await storageSet({ dismissedRecommendations: [...dismissedRecommendations] });
  renderManage();
  showUndoToast(`已忽略 ${label || tool}`, async () => {
    dismissedRecommendations.delete(tool);
    await storageSet({ dismissedRecommendations: [...dismissedRecommendations] });
    renderManage();
  });
}

async function bulkRecommendation(action, result) {
  const restore = action === "restore";
  const tools = result.groups
    .flatMap((group) => group.items)
    .filter((item) => (restore ? item.dismissed : !item.dismissed))
    .map((item) => item.tool);
  if (!tools.length) return;
  tools.forEach((tool) => restore ? dismissedRecommendations.delete(tool) : dismissedRecommendations.add(tool));
  await storageSet({ dismissedRecommendations: [...dismissedRecommendations] });
  renderManage();
  if (restore) return;
  showUndoToast(`已忽略 ${tools.length} 个推荐`, async () => {
    tools.forEach((tool) => dismissedRecommendations.delete(tool));
    await storageSet({ dismissedRecommendations: [...dismissedRecommendations] });
    renderManage();
  });
}

function updateManageBadge() {
  const button = document.getElementById("openManage");
  if (!button) return;
  const count = STATE.countRecommendations(getAllData(), platform, dismissedRecommendations, aiRecommendations);
  button.textContent = count ? `⚙ 管理 · ${count}` : "⚙ 管理";
  button.title = count ? `管理工具和数据（${count} 个推荐可添加）` : "管理工具和数据";
}

function addToolPayload(displayName, preferWebOverride = null) {
  if (!displayName) return { ok: false, error: "请输入工具名称" };
  const normalized = STATE.normalizeAddTool(displayName);
  const { tool } = normalized;
  if (!tool) return { ok: false, error: "工具名称需要包含英文字母或数字" };
  const scopeHint = STATE.overbroadAddToolHint(displayName, tool);
  if (scopeHint) return { ok: false, error: scopeHint };
  if (getAllData()[tool]) return { ok: false, error: "该工具已收录，请使用检查更新" };
  return {
    ok: true,
    payload: {
      tool,
      display_name: normalized.displayName,
      prefer_web: preferWebOverride === null ? webVerify : Boolean(preferWebOverride),
    },
  };
}

function startAddTool(displayName, preferWebOverride = null) {
  const result = addToolPayload(String(displayName || "").trim(), preferWebOverride);
  if (!result.ok) {
    setStatus(result.error, "err");
    return false;
  }
  taskController.runTask("add_tool", result.payload);
  return true;
}

function renderPending() {
  const panel = document.getElementById("pendingPanel");
  const pending = RENDER.renderPending(pendingUpdate, getAllData());
  panel.hidden = pending.hidden;
  panel.innerHTML = pending.html;
  if (pending.hidden) return;
  const confirmRisk = document.getElementById("confirmRisk");
  if (confirmRisk) confirmRisk.addEventListener("change", () => {
    document.getElementById("applyPending").disabled = !confirmRisk.checked;
  });
  document.getElementById("applyPending").addEventListener("click", () => taskController.runTask("apply_update", {
    token: pendingUpdate.pendingToken,
    confirm_risk: Boolean(confirmRisk?.checked),
  }));
  document.getElementById("discardPending").addEventListener("click", () => taskController.runTask("discard_update", { token: pendingUpdate.pendingToken }));
}

function bindManageEvents() {
  document.getElementById("platformSelect").addEventListener("change", async (event) => {
    platform = event.target.value;
    recommendationBatchOffset = 0;
    await storageSet({ platform });
    render();
    renderManage();
  });
  document.getElementById("clearRecent").addEventListener("click", async () => {
    recents = [];
    await storageSet({ recentCopies: [] });
    setStatus("最近使用已清空", "ok");
    render();
  });
  document.getElementById("rerunOnboarding").addEventListener("click", () => showOnboarding(true));
  document.getElementById("addToolBtn").addEventListener("click", () => {
    startAddTool(document.getElementById("addToolName").value);
  });
  document.getElementById("recommendSearch").addEventListener("input", (event) => {
    recommendationQuery = event.target.value;
    recommendationBatchOffset = 0;
    renderManage();
  });
  document.getElementById("showDismissedRecommendations").addEventListener("change", (event) => {
    showDismissedRecommendations = event.target.checked;
    recommendationBatchOffset = 0;
    renderManage();
  });
  document.getElementById("aiSuggestBtn").addEventListener("click", requestAiSuggestions);
}

function renderOnboardChoices() {
  document.getElementById("onboardPlatform").value = platform;
  document.getElementById("onboardTools").innerHTML = RENDER.renderOnboardChoices(
    getAllData(),
    STATE.getToolIds(getAllData()),
    enabledTools
  );
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
    const selected = preset === "all" ? new Set(STATE.getToolIds(getAllData())) : new Set(STATE.TOOL_PRESETS[preset] || []);
    document.querySelectorAll("#onboardTools input").forEach((input) => {
      input.checked = selected.has(input.value);
    });
  }));
  document.getElementById("saveOnboarding").addEventListener("click", async () => {
    const selected = [...document.querySelectorAll("#onboardTools input:checked")].map((input) => input.value);
    enabledTools = new Set(selected.length ? selected : STATE.getToolIds(getAllData()));
    platform = document.getElementById("onboardPlatform").value;
    await storageSet({ enabledTools: [...enabledTools], platform, onboarded: true });
    hideOnboarding({ focusSearch: true });
    renderFilters();
    render();
    renderManage();
  });
  document.getElementById("skipOnboarding").addEventListener("click", async () => {
    enabledTools = new Set(STATE.getToolIds(getAllData()));
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

function bindRiskDialog() {
  document.getElementById("riskCancel").addEventListener("click", () => closeRiskDialog(false));
  document.getElementById("riskConfirm").addEventListener("click", () => closeRiskDialog(true));
  document.getElementById("riskDialog").addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeRiskDialog(false);
      event.preventDefault();
    }
  });
}

async function initialize() {
  document.getElementById("main").innerHTML = `<div class="empty loading">正在加载速查表…</div>`;
  try {
    await loadCheatsheetData();
    enrichmentIndex = STATE.buildEnrichmentIndex(
      getAllData(),
      window.CHEATSHEET_ENRICHMENTS || {},
      window.CHEATSHEET_BUILD_FULL_ENRICHMENTS
    );
    rebuildEntryIndex();
  } catch (error) {
    document.getElementById("main").innerHTML = `<div class="empty">${RENDER.escapeHtml(error.message)}</div>`;
    return;
  }
  const stored = await storageGet(STATE.STORAGE_KEYS);
  favourites = new Set(stored.favourites || []);
  recents = stored.recentCopies || [];
  dismissedRecommendations = new Set(Array.isArray(stored.dismissedRecommendations) ? stored.dismissedRecommendations : []);
  const sessionState = await storageSessionGet(["aiRecommendations"]);
  aiRecommendations = Array.isArray(sessionState.aiRecommendations) ? sessionState.aiRecommendations : [];
  platform = stored.platform || platform;
  webVerify = stored.webVerify === true;
  enabledTools = new Set(Array.isArray(stored.enabledTools)
    ? stored.enabledTools.filter((id) => getAllData()[id])
    : STATE.getToolIds(getAllData()));
  if (!stored.onboarded) enabledTools = new Set(STATE.TOOL_PRESETS.ai.filter((id) => getAllData()[id]));
  pendingUpdate = stored.pendingUpdate || null;
  document.getElementById("search").value = stored.lastQuery || "";

  const migrated = STATE.migrateFavourites(getAllData(), favourites);
  favourites = migrated.favourites;
  if (migrated.changed) storageSet({ favourites: [...favourites] });
  const pruned = STATE.pruneRecents(entryIndex, recents);
  if (pruned.length !== recents.length) {
    recents = pruned;
    storageSet({ recentCopies: recents });
  }

  bindHomeEvents();
  bindManageEvents();
  bindOnboarding();
  bindRiskDialog();
  renderFilters();
  render();
  renderManage();
  if (stored.lastQualityWarnings?.messages?.length
    && Date.now() - (stored.lastQualityWarnings.createdAt || 0) < 86400000) {
    setStatus(`⚠ ${stored.lastQualityWarnings.messages.join("\n⚠ ")}`, "warn");
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "taskComplete") taskController.finishTask(message.response);
  });
  chrome.runtime.sendMessage({ action: "getTaskStatus" }, (status) => {
    if (chrome.runtime.lastError || !status) return;
    if (status.running) {
      currentTaskMode = status.mode;
      taskController.startTaskTimer(status.mode, status.startedAt || Date.now(), status);
      setManageButtonsDisabled(true);
    } else if (status.result && status.finishedAt && Date.now() - status.finishedAt < 120000) {
      currentTaskMode = status.mode;
      taskController.finishTask(status.result, status.mode);
      chrome.storage.session.set({ taskStatus: { running: false } });
    }
  });
  if (!stored.onboarded) {
    showOnboarding();
  } else {
    document.getElementById("search").focus();
  }
}

if (window.CHEATSHEET_ENABLE_TEST_HOOKS) {
  window.CHEATSHEET_POPUP_TESTS = {
    state: STATE,
    render: RENDER,
    tasks: window.CHEATSHEET_POPUP_TASKS,
    confirmRiskCopy,
    addToolPayload,
    rankVisibleEntries,
  };
}

document.addEventListener("DOMContentLoaded", initialize);
