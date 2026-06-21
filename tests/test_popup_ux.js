"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "popup.html"), "utf8");
const script = fs.readFileSync(path.join(root, "popup.js"), "utf8");

assert(!html.includes('id="toolSelect"'), "tool filters should remain directly visible");
assert(html.includes('id="categoryFilters" class="filters"'), "category filters should remain directly visible");
assert(script.includes("...visibleToolIds().map"), "enabled tools should remain available as top-level filter chips");
assert(html.includes('aria-labelledby="onboardTitle"'), "onboarding dialog needs an accessible name");
assert(html.includes('data-preset="ai"') && html.includes('data-preset="terminal"'), "onboarding presets are required");
assert(script.includes('class="row-main"'), "result primary action must be a semantic button");
assert(script.includes("confirmRiskCopy(command, risk)"), "risky command copies must require confirmation");
assert(script.includes("复制失败，请检查浏览器剪贴板权限"), "clipboard failures need visible feedback");
assert(script.includes("platformInfo.unsupported ? \"disabled\""), "unsupported platform commands must be disabled");
assert(script.includes("主要匹配"), "search results must explain their primary match");
assert(script.includes("example-summary"), "search results must surface a usage summary");
assert(script.includes("event.key !== \"Tab\""), "onboarding must trap keyboard focus");
assert(script.includes("focusSearch: true"), "finishing onboarding must restore focus to search");
assert(script.includes("官方仓库确认") && script.includes("本机帮助确认"), "source evidence labels are required");
assert(script.includes("exampleProvenanceLabel"), "example authorship and evidence must be rendered separately");
assert(script.includes("sourceChanges.conflicts"), "update preview must display source conflicts");
assert(script.includes("已核验") && script.includes("部分核验") && script.includes("未核验"), "all item evidence states must be visible");
assert(script.includes("条目核验："), "management view must summarize evidence states");
assert(script.includes("查看其余") && script.includes("<details>"), "long source lists must remain compact");
assert(script.includes("commandEvidenceHtml"), "command evidence must render separately from example provenance");
assert(script.includes("命令证据：") && script.includes("exampleProvenanceLabel"), "command and example evidence labels must stay distinct");
assert(script.includes("evidenceRefChanges") && script.includes("locatorLosses"), "update preview must report evidence assertion and locator changes");
assert(!script.includes("STALE_DAYS"), "stable data must not become stale solely because time passed");
assert(!script.includes("资料较旧"), "the UI must not show age-based stale warnings");
assert(script.includes("updatePolicy") && script.includes("manual-only"), "tool-specific update policies must drive the UI");
assert(script.includes("data-deep-update"), "stable tools need an explicit advanced re-verification action");
assert(script.includes("检查版本更新") && script.includes("检查发布变化"), "dynamic update actions must describe their actual signal");
assert(script.includes("prefer_web: true"), "version-triggered updates must use source-backed web verification");

console.log("Popup UX contract tests passed.");
