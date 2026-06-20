"use strict";

const assert = require("assert");
const core = require("../product-core.js");

const baseItem = {
  cat: "slash",
  cmd: "/clear",
  en: "Clear conversation",
  zh: "清空当前对话",
  context: "会话",
};

assert(core.scoreItem(baseItem, "/clear") > core.scoreItem(baseItem, "clear"));
assert(core.scoreItem(baseItem, "重置") > 0, "Chinese synonym should match clear/reset");
assert(core.scoreItem(baseItem, "会话") > 0, "Context should be searchable");
assert(core.scoreItem(baseItem, "清空 会话") > 0, "All query tokens should match");
assert.strictEqual(core.scoreItem(baseItem, "清空 模型"), -1, "Missing query tokens should reject by default");
assert(core.scoreItem(baseItem, "清空 模型", { matchMode: "any" }) > 0, "Relaxed search should match any token");
assert(core.scoreItem(baseItem, "codex", { toolName: "Codex CLI" }) > 0, "Tool name should be searchable");
const sedItem = {
  cat: "flag",
  cmd: "sed",
  en: "Transform text",
  zh: "转换文本",
  keywords: ["文本替换", "批量替换"],
  examples: [{ value: "sed 's/old/new/g' file.txt", description: "替换文本" }],
};
assert(core.scoreItem(sedItem, "替换") > 0, "Keywords should support user intent");
assert(core.scoreItem(sedItem, "取代") > 0, "Replace synonyms should expand");
assert(core.scoreItem(sedItem, "转换") > 0, "Original wording should still match");
assert.strictEqual(
  core.scoreItem({ ...baseItem, zh: "转换文件格式" }, "替换"),
  -1,
  "Replace should not be a global synonym for transform"
);
assert(core.scoreItem(sedItem, "old") > 0, "Example content should be searchable");

const platform = core.getPlatformCommand({
  cmd: "Cmd+P",
  platformCmds: { windows: "Ctrl+P", linux: "Ctrl+P" },
}, "windows");
assert.strictEqual(platform.command, "Ctrl+P");
assert.strictEqual(platform.usedFallback, false);
assert.strictEqual(core.getPlatformExample({
  value: "sed -i 's/a/b/g' file",
  platformValues: { mac: "sed -i '' 's/a/b/g' file" },
}, "mac").value, "sed -i '' 's/a/b/g' file");

const recent = core.updateRecent(
  [{ toolId: "codex", itemId: "old", copiedAt: 1 }],
  { toolId: "codex", itemId: "new", copiedAt: 2 },
  2
);
assert.deepStrictEqual(recent.map((item) => item.itemId), ["new", "old"]);

const ranked = core.rankItems([
  { toolId: "a", itemId: "1", item: baseItem, displayCmd: "/clear" },
  {
    toolId: "b",
    itemId: "2",
    item: { cat: "slash", cmd: "/other", en: "Other", zh: "清空缓存" },
    displayCmd: "/other",
  },
], "clear", { favourites: new Set(), recents: [] });
assert.strictEqual(ranked[0].itemId, "1");

console.log("Product core tests passed.");
