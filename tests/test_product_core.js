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

const platform = core.getPlatformCommand({
  cmd: "Cmd+P",
  platformCmds: { windows: "Ctrl+P", linux: "Ctrl+P" },
}, "windows");
assert.strictEqual(platform.command, "Ctrl+P");
assert.strictEqual(platform.usedFallback, false);

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
