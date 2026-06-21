#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const registry = require(path.join(root, "shared", "source-registry.json"));
const registryById = new Map(registry.entries.map((entry) => [entry.id, entry]));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(dataDir, "index.js"), "utf8"), context);
for (const toolId of context.window.CHEATSHEET_FILES) {
  vm.runInContext(fs.readFileSync(path.join(dataDir, `${toolId}.js`), "utf8"), context);
}

function stableId(toolId, item) {
  const seed = [toolId, item.cat, item.context || "", item.en.toLowerCase()].join("\0");
  return crypto.createHash("sha256").update(seed).digest("hex").slice(0, 16);
}

function sourceFromRegistry(registryId, overrides = {}) {
  const entry = registryById.get(registryId);
  if (!entry) throw new Error(`Unknown registry source: ${registryId}`);
  return {
    id: overrides.id || entry.id,
    ...(overrides.id && overrides.id !== entry.id ? { registryId: entry.id } : {}),
    title: overrides.title || entry.title,
    url: overrides.url || entry.canonicalUrl,
    kind: overrides.kind || entry.kind,
    maintainer: entry.maintainer,
    evidenceTier: entry.evidenceTier,
    lastVerifiedAt: entry.lastVerifiedAt,
    resolvedUrl: overrides.url || entry.canonicalUrl,
    pageTitle: overrides.title || entry.title,
    checkedAt: entry.lastVerifiedAt,
    purposes: overrides.purposes || entry.purposes,
  };
}

const toolSourceIds = {
  "antigravity-cli": ["antigravity-announcement"],
  "claude-code": ["claude-interactive", "claude-commands", "claude-cli-reference", "anthropic-claude-code-repository"],
  codex: ["codex-slash-commands", "codex-cli-reference", "codex-features", "openai-codex-repository"],
  cursor: ["cursor-shortcuts"],
  "gemini-cli": ["gemini-commands", "gemini-keyboard", "gemini-cli-reference", "google-gemini-cli-repository"],
  idea: ["idea-macos-keymap"],
  openclaw: ["openclaw-slash", "openclaw-cli"],
  opencode: ["opencode-tui", "opencode-keybinds", "opencode-cli"],
  typora: ["typora-shortcuts"],
  "vs-code": ["vscode-keybindings"],
};

const linuxGNU = new Set([
  "ls", "pwd", "mkdir", "cp", "mv", "rm", "touch", "cat", "head", "tail",
  "chmod", "chown", "sort", "uniq", "wc", "df", "du", "ln",
]);
const linuxMan7 = new Set(["ps", "kill", "top", "grep", "find", "diff", "free", "ping"]);
const linuxUnverified = new Set(["cd", "|", ">", ">>", "history", "Ctrl+R", "Ctrl+C", "Ctrl+Z", "bg", "fg"]);

function gitRoot(item) {
  const value = item.cmd.replace(/^git\s+/, "").trim();
  const rootCommand = value.split(/\s+/)[0].replace(/[^\w-].*$/, "");
  return rootCommand || "git";
}

function evidenceFor(toolId, item, metaSources) {
  const partial = (sourceId, locator) => ({
    evidenceRefs: [{
      sourceId,
      claims: ["existence"],
      locator,
      checkedAt: "2026-06-21",
    }],
    evidenceStatus: "partial",
  });
  const verified = (sourceId, locator) => ({
    evidenceRefs: [{
      sourceId,
      claims: ["existence", "semantics"],
      locator,
      checkedAt: "2026-06-21",
    }],
    evidenceStatus: "verified",
  });
  if (toolId === "antigravity-cli") {
    return item.cmd === "agy"
      ? partial("antigravity-announcement", "官方迁移公告中的 Antigravity CLI 产品入口")
      : { evidenceStatus: "unverified" };
  }
  if (toolId === "claude-code") {
    const sourceId = item.cat === "shortcut" ? "claude-interactive"
      : item.cat === "slash" ? "claude-commands" : "claude-cli-reference";
    return partial(sourceId, `${registryById.get(sourceId).canonicalUrl}（页面内检索 ${item.cmd}）`);
  }
  if (toolId === "codex") {
    const sourceId = item.cat === "slash" ? "codex-slash-commands"
      : item.cat === "flag" ? "codex-cli-reference" : "codex-features";
    return partial(sourceId, `${registryById.get(sourceId).canonicalUrl}（页面内检索 ${item.cmd}）`);
  }
  if (toolId === "gemini-cli") {
    const sourceId = item.cat === "shortcut" ? "gemini-keyboard"
      : item.cat === "slash" ? "gemini-commands" : "gemini-cli-reference";
    return partial(sourceId, `${registryById.get(sourceId).canonicalUrl}（页面内检索 ${item.cmd}）`);
  }
  if (toolId === "opencode") {
    const sourceId = item.cat === "shortcut" ? "opencode-keybinds"
      : item.cat === "slash" ? "opencode-tui" : "opencode-cli";
    return partial(sourceId, `${registryById.get(sourceId).canonicalUrl}（页面内检索 ${item.cmd}）`);
  }
  if (toolId === "openclaw") {
    const sourceId = item.cat === "slash" ? "openclaw-slash" : "openclaw-cli";
    return partial(sourceId, `${registryById.get(sourceId).canonicalUrl}（页面内检索 ${item.cmd}）`);
  }
  if (toolId === "git") {
    const command = gitRoot(item);
    const sourceId = `git-${command}`;
    if (!metaSources.some((source) => source.id === sourceId)) {
      metaSources.push(sourceFromRegistry("git-docs", {
        id: sourceId,
        title: command === "git" ? "Git reference" : `git-${command} documentation`,
        url: command === "git" ? "https://git-scm.com/docs/git" : `https://git-scm.com/docs/git-${command}`,
      }));
    }
    return verified(sourceId, metaSources.find((source) => source.id === sourceId).url);
  }
  if (toolId === "linux") {
    const command = item.cmd.split(/\s+/)[0];
    if (linuxUnverified.has(item.cmd) || linuxUnverified.has(command)) {
      return { evidenceStatus: "unverified" };
    }
    if (linuxGNU.has(command)) {
      return partial("gnu-manuals", `GNU manuals（检索 ${item.cmd}）`);
    }
    if (linuxMan7.has(command)) {
      const sourceId = `linux-${command}-man`;
      const section = command === "ping" ? "man8" : "man1";
      if (!metaSources.some((source) => source.id === sourceId)) {
        const sectionNumber = command === "ping" ? "8" : "1";
        metaSources.push(sourceFromRegistry("linux-man7", {
          id: sourceId,
          title: `${command}(${sectionNumber}) manual page`,
          url: `https://man7.org/linux/man-pages/${section}/${command}.${sectionNumber}.html`,
        }));
      }
      return partial(sourceId, metaSources.find((source) => source.id === sourceId).url);
    }
    return { evidenceStatus: "unverified" };
  }
  if (toolId === "cursor") return partial("cursor-shortcuts", `官方快捷键页（页面内检索 ${item.cmd}）`);
  if (toolId === "idea") return partial("idea-macos-keymap", `官方 macOS Keymap（页面内检索 ${item.en}）`);
  if (toolId === "typora") return partial("typora-shortcuts", `官方 Shortcut Keys（页面内检索 ${item.en}）`);
  if (toolId === "vs-code") return partial("vscode-keybindings", `官方 Default Keyboard Shortcuts（页面内检索 ${item.en}）`);
  return { evidenceStatus: "unverified" };
}

for (const [toolId, tool] of Object.entries(context.window.CHEATSHEET_DATA)) {
  const metaSources = (toolSourceIds[toolId] || []).map((sourceId) => sourceFromRegistry(sourceId));
  if (toolId === "git") metaSources.push(sourceFromRegistry("git-docs"));
  if (toolId === "linux") {
    metaSources.push(sourceFromRegistry("gnu-manuals"), sourceFromRegistry("linux-man7"));
  }
  const seenIds = new Set();
  tool.items = tool.items.map((item) => {
    let id = item.id || stableId(toolId, item);
    if (seenIds.has(id)) {
      id = crypto.createHash("sha256").update(`${id}\0${item.cmd}`).digest("hex").slice(0, 16);
    }
    seenIds.add(id);
    const evidence = evidenceFor(toolId, item, metaSources);
    const { sourceIds: _legacySourceIds, evidenceRefs: _oldRefs, ...rest } = item;
    return { ...rest, id, ...evidence };
  });
  const usedSourceIds = new Set(tool.items.flatMap((item) =>
    (item.evidenceRefs || []).map((ref) => ref.sourceId)
  ));
  tool.meta.sources = metaSources.filter((source) => usedSourceIds.has(source.id));
  const backgroundReferences = metaSources.filter((source) => !usedSourceIds.has(source.id));
  if (backgroundReferences.length) tool.meta.references = backgroundReferences;
  else delete tool.meta.references;
  const serializable = { meta: tool.meta, items: tool.items };
  const content = [
    "// Generated from validated structured data. Manual edits must follow data/SCHEMA.md.",
    "window.CHEATSHEET_DATA = window.CHEATSHEET_DATA || {};",
    `window.CHEATSHEET_DATA[${JSON.stringify(toolId)}] = ${JSON.stringify(serializable, null, 2)};`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dataDir, `${toolId}.js`), content);
}

// Convert every curated cmd/context enrichment into a stable ID module. Existing ID modules win.
const enrichmentContext = { window: { CHEATSHEET_DATA: context.window.CHEATSHEET_DATA } };
vm.createContext(enrichmentContext);
for (const filename of fs.readdirSync(path.join(root, "enrichments")).filter(
  (name) => name.endsWith(".js") && name !== "z-migrated-curated.js"
)) {
  vm.runInContext(fs.readFileSync(path.join(root, "enrichments", filename), "utf8"), enrichmentContext);
}
vm.runInContext(fs.readFileSync(path.join(root, "usage-examples.js"), "utf8"), enrichmentContext);
const stableModules = enrichmentContext.window.CHEATSHEET_ENRICHMENT_MODULES || {};
const legacy = enrichmentContext.window.CHEATSHEET_ENRICHMENTS || {};
const migrated = {};
for (const [toolId, entries] of Object.entries(legacy)) {
  migrated[toolId] = {};
  for (const [lookup, enrichment] of Object.entries(entries)) {
    const [cmd, itemContext = ""] = lookup.split("\0");
    const exactItem = context.window.CHEATSHEET_DATA[toolId].items.find(
      (candidate) => candidate.cmd === cmd && (candidate.context || "") === itemContext
    );
    const item = exactItem || context.window.CHEATSHEET_DATA[toolId].items.find(
      (candidate) => candidate.cmd === cmd
    );
    if (!item) throw new Error(`Missing enrichment target: ${toolId} ${lookup}`);
    const stableKey = `id:${item.id}`;
    if (!stableModules[toolId]?.[stableKey]) migrated[toolId][stableKey] = enrichment;
  }
}
const migratedSource = `(function registerMigratedEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  const migrated = ${JSON.stringify(migrated, null, 2)};
  Object.entries(migrated).forEach(([toolId, entries]) => {
    modules[toolId] = { ...(modules[toolId] || {}), ...entries };
  });
}(typeof window !== "undefined" ? window : globalThis));
`;
fs.writeFileSync(path.join(root, "enrichments", "z-migrated-curated.js"), migratedSource);

console.log(`Migrated ${Object.keys(context.window.CHEATSHEET_DATA).length} tools.`);
