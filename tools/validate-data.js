#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const context = { window: {} };
vm.createContext(context);

function fail(message) {
  throw new Error(message);
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
