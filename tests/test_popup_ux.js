"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "popup.html"), "utf8");
const core = require("../product-core.js");
const state = require("../popup-state.js");
const render = require("../popup-render.js");

assert(!html.includes('id="toolSelect"'), "tool filters should remain directly visible");
assert(html.includes('id="categoryFilters" class="filters"'), "category filters should remain directly visible");
assert(html.includes('id="shellFilters"'), "Shell-specific filters should have a dedicated container");
assert(html.includes("Git / Linux / Shell"), "terminal onboarding preset should expose Shell");
assert(html.includes(":focus-visible"), "interactive controls need visible keyboard focus");
assert(html.includes("prefers-reduced-motion"), "motion must respect the reduced-motion preference");
assert(
  html.includes('<script src="popup-state.js"></script>')
    && html.includes('<script src="popup-render.js"></script>')
    && html.includes('<script src="popup-tasks.js"></script>')
    && html.indexOf('popup-state.js') < html.indexOf('popup.js'),
  "popup modules must load before popup.js"
);

const data = {
  alpha: {
    meta: {
      id: "alpha",
      name: "Alpha",
      color: "#336699",
      builtIn: true,
      source: "Alpha docs",
      sources: [{
        id: "alpha-docs",
        title: "Alpha Docs",
        kind: "official-repository",
        maintainer: "Alpha",
        evidenceTier: "first-party",
        url: "https://example.com/alpha",
      }],
      updatePolicy: "version-driven",
      coverage: "Alpha coverage",
      platforms: ["mac", "windows"],
    },
    items: [
      {
        id: "open-item",
        cat: "shortcut",
        cmd: "Cmd+P",
        platformCmds: { windows: "Ctrl+P" },
        en: "Open file",
        zh: "打开文件",
        evidenceStatus: "verified",
        evidenceRefs: [{ sourceId: "alpha-docs", claims: ["existence", "semantics"], locator: "README" }],
      },
      {
        id: "danger-item",
        cat: "slash",
        cmd: "rm -rf ./tmp",
        en: "Remove temporary files",
        zh: "删除临时文件",
        evidenceStatus: "partial",
        examples: [{
          value: "rm -rf ./tmp",
          description: "删除临时目录",
          warning: "会删除文件",
          authorship: "editorial",
          evidenceTier: "none",
          adaptation: "scenario-derived",
        }],
      },
    ],
  },
  beta: {
    meta: {
      id: "beta",
      name: "Beta",
      color: "#663399",
      builtIn: true,
      source: "Beta docs",
      sources: [],
      updatePolicy: "manual-only",
    },
    items: [{
      id: "linux-only",
      cat: "flag",
      cmd: "Ctrl+L",
      platforms: ["linux"],
      en: "Clear terminal",
      zh: "清空终端",
      evidenceStatus: "unverified",
    }],
  },
  shell: {
    meta: {
      id: "shell",
      name: "Shell",
      color: "#1E1E1E",
      builtIn: true,
      source: "Shell docs",
      sources: [],
      updatePolicy: "manual-only",
    },
    items: [
      {
        id: "posix-cd",
        cat: "slash",
        cmd: "cd",
        en: "Change directory",
        zh: "切换目录",
        shell: { layer: "builtin", family: "posix-sh", portability: "posix", topic: "builtins" },
        evidenceStatus: "unverified",
      },
      {
        id: "bash-complete",
        cat: "slash",
        cmd: "complete",
        en: "Define completion rules",
        zh: "定义补全规则",
        shell: { layer: "builtin", family: "bash", portability: "bash", topic: "completion" },
        evidenceStatus: "unverified",
      },
    ],
  },
};

const enrichmentIndex = state.buildEnrichmentIndex(data, {
  alpha: {
    "Cmd+P\0": {
      keywords: ["文件"],
      examples: [{
        value: "Cmd+P",
        description: "打开文件列表",
        authorship: "editorial",
        evidenceTier: "first-party",
        adaptation: "adapted",
        sourceIds: ["alpha-docs"],
      }],
    },
  },
});
const entryIndex = state.createEntryIndex(data, enrichmentIndex);

const baseState = {
  activeTool: "all",
  activeCat: null,
  activeShellFilter: null,
  enabledTools: new Set(["alpha", "beta", "shell"]),
  favourites: new Set(["alpha::danger-item"]),
  recents: [
    { toolId: "alpha", itemId: "danger-item" },
    { toolId: "alpha", itemId: "open-item" },
  ],
  platform: "windows",
  expandedTools: new Set(),
  expandedExamples: new Set(),
  searchLimit: 100,
};

const filters = render.renderFilters(data, state, { ...baseState, activeTool: "alpha", activeCat: "shortcut" });
assert(filters.quickHtml.includes('data-tool="alpha"') && filters.quickHtml.includes("active"), "active tool chip should render");
assert(filters.categoryHtml.includes('data-cat="shortcut"') && filters.categoryHtml.includes("active"), "active category chip should render");

const shellFilters = render.renderFilters(data, state, { ...baseState, activeTool: "shell", activeShellFilter: "topic:completion" });
assert(shellFilters.shellHtml.includes('data-shell-filter="topic:completion"'), "Shell facet chips should render for Shell tool");
assert(shellFilters.shellHtml.includes("补全") && shellFilters.shellHtml.includes("active"), "active Shell facet should be visible");

const platformEntries = state.collectEntries(entryIndex, data, core, baseState);
const openEntry = platformEntries.find((entry) => entry.itemId === "open-item");
const linuxOnly = platformEntries.find((entry) => entry.itemId === "linux-only");
assert.strictEqual(openEntry.displayCmd, "Ctrl+P", "platform command should refresh for Windows");
assert.strictEqual(linuxOnly.platformInfo.unsupported, true, "unsupported platform state should be carried into render entries");

const recentEntries = state.collectEntries(entryIndex, data, core, { ...baseState, activeTool: "recent", platform: "mac" });
const rankedRecent = core.rankItems(recentEntries, "", { favourites: baseState.favourites, recents: baseState.recents })
  .sort((a, b) => baseState.recents.findIndex((item) => item.itemId === a.itemId) - baseState.recents.findIndex((item) => item.itemId === b.itemId));
assert.deepStrictEqual(rankedRecent.map((entry) => entry.itemId), ["danger-item", "open-item"], "recent order should survive filtering and ranking");

const shellCompletionEntries = state.collectEntries(entryIndex, data, core, {
  ...baseState,
  activeTool: "shell",
  activeShellFilter: "topic:completion",
});
assert.deepStrictEqual(shellCompletionEntries.map((entry) => entry.itemId), ["bash-complete"], "Shell facet should filter entries by shell metadata");
assert.strictEqual(
  state.activeFilterLabel(data, { ...baseState, activeTool: "shell", activeShellFilter: "topic:completion" }),
  "Shell ＋ 补全",
  "Shell facet should appear in the active filter label"
);

const explainedOpenEntry = core.rankItems([openEntry], "文件", { favourites: baseState.favourites, recents: baseState.recents })[0];
const rowHtml = render.renderRow(explainedOpenEntry, "文件", {
  data,
  core,
  platform: "windows",
  expandedExamples: new Set(["alpha::open-item"]),
  favourites: baseState.favourites,
  helpers: state,
}, true);
assert(rowHtml.includes("主要匹配") && rowHtml.includes("命令证据："), "row render should include match and command evidence");
assert(rowHtml.includes("基于官方资料改写"), "example provenance should render with usage examples");
assert(rowHtml.includes("推荐用法"), "expanded examples should identify the primary recommended usage");
assert(rowHtml.includes("copy-btn"), "rows should expose an explicit copy action");
const collapsedRowHtml = render.renderRow(explainedOpenEntry, "文件", {
  data,
  core,
  platform: "windows",
  expandedExamples: new Set(),
  favourites: baseState.favourites,
  helpers: state,
}, true);
assert(!collapsedRowHtml.includes("命令证据："), "collapsed rows should not expose detailed evidence text");
assert(!collapsedRowHtml.includes("Open file"), "collapsed rows should keep English detail out of the primary scan path");
assert(render.commandExampleHtml(core, "git checkout <branch>", "").includes("placeholder"), "usage examples should mark replaceable placeholders");
assert(
  render.renderResults([explainedOpenEntry], "", baseState, {
    data,
    core,
    platform: "windows",
    expandedExamples: new Set(),
    favourites: baseState.favourites,
    helpers: state,
  }).includes("官方仓库确认"),
  "source evidence labels should render in source cards"
);

const pending = render.renderPending({
  pendingToken: "0123456789abcdef0123456789abcdef",
  toolId: "alpha",
  diff: {
    counts: { added: 1, modified: 2, removed: 3, meta: 1 },
    risks: ["删除高风险命令"],
    sourceChanges: {
      conflicts: ["来源 A 与 B 冲突"],
      statusDowngrades: [{ item: "x" }],
      evidenceRefChanges: [{ item: "y" }],
      locatorLosses: [{ item: "z" }],
    },
  },
}, data);
assert(!pending.hidden, "pending update should render when token exists");
assert(pending.html.includes("disabled"), "risky pending updates should disable apply by default");
assert(pending.html.includes("来源冲突") && pending.html.includes("核验状态下降") && pending.html.includes("证据定位被移除"), "pending source risks should be visible");

const taskMessages = require("../popup-tasks.js");
assert(taskMessages.taskBaseMsg("add_tool", { tool: "shell" }).includes("分批生成 Shell"), "Shell add task needs aggregate UX");

const applyButton = { disabled: true, dataset: {} };
const updateButton = { disabled: false, dataset: {} };
const closeButton = { disabled: false, dataset: {} };
const fakeDocument = {
  querySelectorAll(selector) {
    if (selector === "#manageView button:not(#closeManage)") return [applyButton, updateButton];
    if (selector === "#manageView button") return [applyButton, updateButton, closeButton];
    return [];
  },
};
const disableManageButtons = taskMessages.createButtonDisabler(
  fakeDocument,
  "#manageView button:not(#closeManage)",
  "#manageView button"
);
disableManageButtons(true);
assert.strictEqual(applyButton.disabled, true, "task start should keep already-disabled apply button disabled");
assert.strictEqual(updateButton.disabled, true, "task start should disable active management actions");
assert.strictEqual(closeButton.disabled, false, "close button should remain available");
disableManageButtons(false);
assert.strictEqual(applyButton.disabled, true, "task finish should restore previously disabled apply button");
assert.strictEqual(updateButton.disabled, false, "task finish should restore previously enabled action button");
assert.strictEqual(closeButton.disabled, false, "restore should leave untracked close button unchanged");

const statusMessages = [];
const resumedController = taskMessages.createTaskController({
  chrome: { runtime: { sendMessage() {}, reload() {}, lastError: null } },
  setStatus(text) { statusMessages.push(text); },
  setManageButtonsDisabled() {},
  storageSet() {},
  renderPending() {},
  getCurrentTaskMode() { return "add_tool"; },
  setCurrentTaskMode() {},
  setPendingUpdate() {},
});
resumedController.startTaskTimer("add_tool", Date.now(), { tool: "shell" });
resumedController.stopTaskTimer();
assert(statusMessages[0].includes("分批生成 Shell"), "resumed Shell task should keep the aggregate progress message");

const context = {
  window: {
    CHEATSHEET_CORE: core,
    CHEATSHEET_POPUP_STATE: state,
    CHEATSHEET_POPUP_RENDER: render,
    CHEATSHEET_POPUP_TASKS: taskMessages,
    CHEATSHEET_ENABLE_TEST_HOOKS: true,
  },
  document: { addEventListener() {} },
  navigator: { platform: "MacIntel" },
  chrome: {
    runtime: {
      lastError: null,
      reload() {},
      sendMessage() {},
      onMessage: { addListener() {} },
    },
    storage: {
      local: { get() {}, set() {} },
      session: { set() {} },
    },
  },
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  confirm() {
    context.confirmCalls += 1;
    return false;
  },
  confirmCalls: 0,
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "popup.js"), "utf8"), context, { filename: "popup.js" });
assert(context.window.CHEATSHEET_POPUP_TESTS, "popup test hooks should be available only when enabled");
(async () => {
  assert.strictEqual(
    await context.window.CHEATSHEET_POPUP_TESTS.confirmRiskCopy("git status", { requiresConfirmation: false }),
    true,
    "safe copies should not prompt"
  );
  assert.strictEqual(context.confirmCalls, 0, "safe copies should not call confirm");
  assert.strictEqual(
    await context.window.CHEATSHEET_POPUP_TESTS.confirmRiskCopy("rm -rf ./tmp", { requiresConfirmation: true, warning: "删除" }),
    false,
    "risky copies should respect confirm result when DOM dialog is unavailable"
  );
  assert.strictEqual(context.confirmCalls, 1, "risky fallback copies should require confirmation");

  assert(state.overbroadAddToolHint("CLI", "cli").includes("GNU Coreutils"), "overbroad tool names need split-scope guidance");
  assert.deepStrictEqual(state.normalizeAddTool("terminal"), { tool: "shell", displayName: "Shell" }, "Shell aliases should canonicalize");
  assert(state.TOOL_PRESETS.terminal.includes("shell"), "terminal preset should enable Shell by default");

  console.log("Popup UX behavior tests passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
