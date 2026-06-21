#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");

const rules = require(path.join(root, "shared", "validation-rules.json"));
const sourceRegistry = require(path.join(root, "shared", "source-registry.json"));
const { min: MIN_KEYWORDS, max: MAX_KEYWORDS } = rules.keywords;
const MAX_EXAMPLES = rules.examples.max;
const DANGEROUS_EXAMPLE_RE = new RegExp(rules.dangerousExample.source, rules.dangerousExample.flags);
const POSSIBLE_SECRET_RE = new RegExp(rules.possibleSecret.source, rules.possibleSecret.flags);
const SOURCE_TIERS = rules.sourceTiers;
const QUASI_OFFICIAL_DOMAINS = rules.quasiOfficialDomains;
const SOURCE_KINDS = rules.sourceKinds;
const AUTHORSHIPS = rules.authorships;
const EVIDENCE_TIERS = rules.evidenceTiers;
const ADAPTATIONS = rules.adaptations;
const AUTHORITATIVE_SOURCE_PREFIXES = rules.authoritativeSourcePrefixes;
const OFFICIAL_REPOSITORY_PREFIXES = rules.officialRepositoryPrefixes;
const EXAMPLE_SOURCE_TYPES = ["official", "quasi-official", "manual", "ai-derived"];

const context = { window: {} };
vm.createContext(context);

function fail(message) {
  throw new Error(message);
}

// 类官方来源（tier / sourceType = quasi-official）的 sourceUrl 主机名必须命中白名单，
// 防止把任意第三方页面冒充成可信参考。空 URL 由各调用点单独处理。
function hostInQuasiOfficialWhitelist(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return QUASI_OFFICIAL_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function matchesPrefix(url, prefixes) {
  return typeof url === "string"
    && prefixes.some((prefix) => url === prefix.replace(/\/$/, "") || url.startsWith(prefix));
}

function sameSourceHost(left, right) {
  try {
    return new URL(left).hostname.replace(/^www\./, "") === new URL(right).hostname.replace(/^www\./, "");
  } catch {
    return false;
  }
}

for (const entry of sourceRegistry.entries || []) {
  if (!entry.id || !Array.isArray(entry.urlPrefixes) || !entry.urlPrefixes.length
    || !entry.maintainer || !Array.isArray(entry.toolIds) || !entry.toolIds.length
    || !Array.isArray(entry.purposes) || !entry.purposes.length
    || !EVIDENCE_TIERS.includes(entry.evidenceTier)
    || !/^\d{4}-\d{2}-\d{2}$/.test(entry.lastVerifiedAt || "")) {
    fail(`source registry entry invalid: ${entry.id || "(missing id)"}`);
  }
  for (const prefix of entry.urlPrefixes) {
    if (!/^https:\/\/\S+$/.test(prefix)) fail(`source registry URL invalid: ${prefix}`);
  }
}

vm.runInContext(fs.readFileSync(path.join(dataDir, "index.js"), "utf8"), context, {
  filename: "data/index.js",
});

const popupHtml = fs.readFileSync(path.join(root, "popup.html"), "utf8");
if (!popupHtml.includes('<script src="data/index.js"></script>')) {
  fail("popup.html must load data/index.js");
}
if (/<script src="data\/(?!index\.js)[^"]+\.js"><\/script>/.test(popupHtml)) {
  fail("popup.html must not contain direct tool data script tags");
}

const files = context.window.CHEATSHEET_FILES;
if (!Array.isArray(files) || files.length === 0) fail("data/index.js must define a non-empty array");
if (new Set(files).size !== files.length) fail("data/index.js contains duplicate tool IDs");

const diskIds = fs.readdirSync(dataDir)
  .filter((name) => name.endsWith(".js") && name !== "index.js")
  .map((name) => name.slice(0, -3))
  .sort();
const indexIds = [...files].sort();
if (JSON.stringify(diskIds) !== JSON.stringify(indexIds)) {
  fail(`data/index.js mismatch: disk=${diskIds.join(",")} index=${indexIds.join(",")}`);
}

for (const id of files) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(`invalid tool ID: ${id}`);
  if (id === "index") fail("index is a reserved tool ID");
  const filename = path.join(dataDir, `${id}.js`);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

const data = context.window.CHEATSHEET_DATA || {};
const enrichmentFile = path.join(root, "usage-examples.js");
const enrichmentDir = path.join(root, "enrichments");
for (const filename of fs.readdirSync(enrichmentDir).filter((name) => name.endsWith(".js")).sort()) {
  const fullPath = path.join(enrichmentDir, filename);
  vm.runInContext(fs.readFileSync(fullPath, "utf8"), context, { filename: fullPath });
}
vm.runInContext(fs.readFileSync(enrichmentFile, "utf8"), context, { filename: enrichmentFile });
if (typeof context.window.CHEATSHEET_BUILD_FULL_ENRICHMENTS !== "function") {
  fail("usage-examples.js must expose CHEATSHEET_BUILD_FULL_ENRICHMENTS");
}
context.window.CHEATSHEET_BUILD_FULL_ENRICHMENTS(data);
const legacyWarnings = context.window.CHEATSHEET_ENRICHMENT_WARNINGS || [];
if (legacyWarnings.length) {
  console.warn(`Legacy enrichment lookups (${legacyWarnings.length}):\n${legacyWarnings.join("\n")}`);
}
// 把 curated 富化按 item 引用记录到旁路表，校验时按需叠加，不改写共享数据对象。
const enrichmentByItem = new WeakMap();
for (const [toolId, enrichments] of Object.entries(context.window.CHEATSHEET_ENRICHMENTS || {})) {
  if (!data[toolId]) fail(`usage-examples.js: unknown tool ${toolId}`);
  if (Object.keys(enrichments).length < 10) {
    fail(`usage-examples.js: ${toolId} must keep at least 10 curated entries`);
  }
  for (const [lookup, enrichment] of Object.entries(enrichments)) {
    const [command, itemContext = ""] = lookup.split("\0");
    const item = data[toolId].items.find((candidate) =>
      candidate.cmd === command && (candidate.context || "") === itemContext
    );
    if (!item) fail(`usage-examples.js: missing target ${toolId} ${command} (${itemContext})`);
    enrichmentByItem.set(item, enrichment);
  }
}

for (const id of files) {
  const tool = data[id];
  if (!tool || typeof tool !== "object") fail(`${id}: missing dataset`);
  if (tool.meta?.id !== id) fail(`${id}: meta.id must match filename`);
  for (const field of ["name", "source"]) {
    if (typeof tool.meta?.[field] !== "string" || !tool.meta[field].trim()) {
      fail(`${id}: invalid meta.${field}`);
    }
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(tool.meta?.color || "")) fail(`${id}: invalid color`);
  if (tool.meta.sourceUrl !== undefined && !/^https:\/\/\S+$/.test(tool.meta.sourceUrl)) {
    fail(`${id}: invalid sourceUrl`);
  }
  if (tool.meta.updatedAt !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(tool.meta.updatedAt)) {
    fail(`${id}: invalid updatedAt`);
  }
  if (tool.meta.verificationStatus !== undefined
    && !["web-assisted", "model-knowledge", "manual"].includes(tool.meta.verificationStatus)) {
    fail(`${id}: invalid verificationStatus`);
  }
  if (tool.meta.sourceTier !== undefined) {
    if (!SOURCE_TIERS.includes(tool.meta.sourceTier)) fail(`${id}: invalid sourceTier`);
    if (tool.meta.sourceTier === "quasi-official"
      && !hostInQuasiOfficialWhitelist(tool.meta.sourceUrl || "")) {
      fail(`${id}: quasi-official sourceTier requires a whitelisted sourceUrl host`);
    }
  }
  const sourceIds = new Set();
  if (tool.meta.sources !== undefined) {
    if (!Array.isArray(tool.meta.sources) || !tool.meta.sources.length) fail(`${id}: invalid sources`);
    for (const [sourceIndex, source] of tool.meta.sources.entries()) {
      if (!source || typeof source !== "object" || Array.isArray(source)) fail(`${id}: invalid source ${sourceIndex}`);
      if (!/^[a-zA-Z0-9_-]{2,64}$/.test(source.id || "") || sourceIds.has(source.id)) {
        fail(`${id}: invalid or duplicate source id ${source.id}`);
      }
      sourceIds.add(source.id);
      if (!SOURCE_KINDS.includes(source.kind)) fail(`${id}: invalid source kind ${source.kind}`);
      if (!EVIDENCE_TIERS.includes(source.evidenceTier) || source.evidenceTier === "none") {
        fail(`${id}: invalid source evidence tier`);
      }
      if (source.kind !== "local-help" && !/^https:\/\/\S+$/.test(source.url || "")) {
        fail(`${id}: source URL required`);
      }
      if (source.kind === "official-repository"
        && !matchesPrefix(source.url, OFFICIAL_REPOSITORY_PREFIXES)) {
        fail(`${id}: unregistered official repository`);
      }
      if (source.kind === "authoritative-reference"
        && !matchesPrefix(source.url, AUTHORITATIVE_SOURCE_PREFIXES)) {
        fail(`${id}: unregistered authoritative source`);
      }
      if (!Array.isArray(source.purposes) || !source.purposes.length) fail(`${id}: source purposes required`);
      if (!source.title || !source.maintainer) fail(`${id}: source title and maintainer required`);
    }
  }
  if (tool.meta.platforms !== undefined && (
    !Array.isArray(tool.meta.platforms)
    || tool.meta.platforms.some((platform) => !["mac", "windows", "linux"].includes(platform))
  )) fail(`${id}: invalid platforms`);
  if (!Array.isArray(tool.items) || tool.items.length === 0) fail(`${id}: items must not be empty`);

  const duplicateKeys = new Set();
  const itemIds = new Set();
  tool.items.forEach((item, index) => {
    if (!["shortcut", "slash", "flag"].includes(item.cat)) fail(`${id}[${index}]: invalid cat`);
    for (const field of ["cmd", "en", "zh"]) {
      if (typeof item[field] !== "string" || !item[field].trim()) {
        fail(`${id}[${index}]: invalid ${field}`);
      }
    }
    if (item.context !== undefined && (typeof item.context !== "string" || !item.context.trim())) {
      fail(`${id}[${index}]: invalid context`);
    }
    if (item.sourceIds !== undefined && (
      !Array.isArray(item.sourceIds)
      || !item.sourceIds.length
      || item.sourceIds.some((sourceId) => !sourceIds.has(sourceId))
    )) fail(`${id}[${index}]: invalid sourceIds`);
    // 有效 keywords/examples = 条目自带 优先，否则回退到 curated 富化（旁路表，不改写数据）。
    const enrichment = enrichmentByItem.get(item) || {};
    const keywords = item.keywords ?? enrichment.keywords;
    const examples = item.examples ?? enrichment.examples;
    if (keywords !== undefined) {
      if (!Array.isArray(keywords) || keywords.length < MIN_KEYWORDS || keywords.length > MAX_KEYWORDS
        || keywords.some((keyword) => typeof keyword !== "string" || !keyword.trim())) {
        fail(`${id}[${index}]: invalid keywords`);
      }
    } else fail(`${id}[${index}]: keywords required`);
    if (examples !== undefined) {
      if (!Array.isArray(examples) || examples.length === 0 || examples.length > MAX_EXAMPLES) {
        fail(`${id}[${index}]: invalid examples`);
      }
      examples.forEach((example, exampleIndex) => {
        if (!example || typeof example !== "object" || Array.isArray(example)
          || typeof example.value !== "string" || !example.value.trim()
          || typeof example.description !== "string" || !example.description.trim()) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid example`);
        }
        if (example.copyable !== undefined && typeof example.copyable !== "boolean") {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid copyable`);
        }
        if (!EXAMPLE_SOURCE_TYPES.includes(example.sourceType)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid sourceType`);
        }
        if (example.sourceUrl !== undefined && !/^https:\/\/\S+$/.test(example.sourceUrl)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid sourceUrl`);
        }
        if (example.sourceType === "quasi-official" && !hostInQuasiOfficialWhitelist(example.sourceUrl || "")) {
          fail(`${id}[${index}].examples[${exampleIndex}]: quasi-official sourceType requires a whitelisted sourceUrl host`);
        }
        if (example.sourceType === "official" && example.sourceUrl
          && !sameSourceHost(example.sourceUrl, tool.meta.sourceUrl)
          && !matchesPrefix(example.sourceUrl, OFFICIAL_REPOSITORY_PREFIXES)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: official source must be first-party`);
        }
        if (!AUTHORSHIPS.includes(example.authorship)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid authorship`);
        }
        if (!EVIDENCE_TIERS.includes(example.evidenceTier)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid evidenceTier`);
        }
        if (!ADAPTATIONS.includes(example.adaptation)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid adaptation`);
        }
        if (example.sourceIds !== undefined && (
          !Array.isArray(example.sourceIds)
          || !example.sourceIds.length
          || example.sourceIds.some((sourceId) => !sourceIds.has(sourceId))
        )) fail(`${id}[${index}].examples[${exampleIndex}]: invalid sourceIds`);
        if (example.warning !== undefined && (typeof example.warning !== "string" || !example.warning.trim())) {
          fail(`${id}[${index}].examples[${exampleIndex}]: invalid warning`);
        }
        if (example.riskLevels !== undefined && (
          !Array.isArray(example.riskLevels)
          || !example.riskLevels.length
          || example.riskLevels.some((level) =>
            !["deleteOrOverwrite", "permissionChange", "historyRewrite", "safetyBypass", "processDisruption"].includes(level))
        )) fail(`${id}[${index}].examples[${exampleIndex}]: invalid riskLevels`);
        if (example.platforms !== undefined && (
          !Array.isArray(example.platforms)
          || !example.platforms.length
          || example.platforms.some((value) => !["mac", "windows", "linux"].includes(value))
        )) fail(`${id}[${index}].examples[${exampleIndex}]: invalid platforms`);
        if (example.platformValues !== undefined) {
          if (!example.platformValues || typeof example.platformValues !== "object"
            || Array.isArray(example.platformValues) || !Object.keys(example.platformValues).length) {
            fail(`${id}[${index}].examples[${exampleIndex}]: invalid platformValues`);
          }
          for (const [examplePlatform, value] of Object.entries(example.platformValues)) {
            if (!["mac", "windows", "linux"].includes(examplePlatform)
              || typeof value !== "string" || !value.trim()) {
              fail(`${id}[${index}].examples[${exampleIndex}]: invalid platformValues.${examplePlatform}`);
            }
          }
        }
        if (DANGEROUS_EXAMPLE_RE.test(example.value) && !example.warning) {
          fail(`${id}[${index}].examples[${exampleIndex}]: dangerous example requires warning`);
        }
        if (DANGEROUS_EXAMPLE_RE.test(example.value) && example.copyable !== false) {
          fail(`${id}[${index}].examples[${exampleIndex}]: dangerous example must not be copyable`);
        }
        if (POSSIBLE_SECRET_RE.test(example.value)) {
          fail(`${id}[${index}].examples[${exampleIndex}]: possible secret`);
        }
      });
    } else fail(`${id}[${index}]: examples required`);
    if (item.platformCmds !== undefined) {
      if (!item.platformCmds || typeof item.platformCmds !== "object" || Array.isArray(item.platformCmds)) {
        fail(`${id}[${index}]: invalid platformCmds`);
      }
      for (const [platform, command] of Object.entries(item.platformCmds)) {
        if (!["mac", "windows", "linux"].includes(platform) || typeof command !== "string" || !command.trim()) {
          fail(`${id}[${index}]: invalid platformCmds.${platform}`);
        }
      }
    }
    const key = `${item.cat}\0${item.cmd.toLowerCase()}\0${(item.context || "").toLowerCase()}`;
    if (duplicateKeys.has(key)) fail(`${id}: duplicate ${item.cmd}; add distinct context values`);
    duplicateKeys.add(key);
    if (item.id !== undefined) {
      if (!/^[a-zA-Z0-9_-]{4,64}$/.test(item.id)) fail(`${id}[${index}]: invalid id`);
      if (itemIds.has(item.id)) fail(`${id}: duplicate item id ${item.id}`);
      itemIds.add(item.id);
    }
  });
}

console.log(`Validated ${files.length} tools and ${files.reduce((n, id) => n + data[id].items.length, 0)} items.`);
