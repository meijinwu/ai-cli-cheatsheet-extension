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

console.log("Popup UX contract tests passed.");
