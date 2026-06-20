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

// 归一化记忆化：同一输入多次调用结果稳定，且与未缓存的等价形式一致。
assert.strictEqual(core.normalizeText("  Clear  Conversation  "), "clear conversation");
assert.strictEqual(core.normalizeText("Cmd_K"), "cmd-k");
assert.strictEqual(
  core.normalizeText("/Clear"),
  core.normalizeText("/Clear"),
  "Repeated normalization must be stable"
);

// 评分分层关系锁定：精确 > 前缀 > 包含；命令命中 > 中文 > 英文 > 上下文。
const tierItem = { cat: "slash", cmd: "/clear", en: "Clear conversation", zh: "清空对话", context: "会话" };
assert(core.scoreItem(tierItem, "/clear") > core.scoreItem(tierItem, "/cle"), "exact > prefix");
assert(core.scoreItem(tierItem, "/cle") > core.scoreItem(tierItem, "lear"), "prefix > contains");
assert(core.scoreItem(tierItem, "对话") > core.scoreItem(tierItem, "conversation"), "zh > en");
assert(core.scoreItem(tierItem, "conversation") > core.scoreItem(tierItem, "会话"), "en > context");

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
