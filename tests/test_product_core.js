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
assert.deepStrictEqual(
  core.explainMatch(baseItem, "/clear"),
  { field: "command", term: "/clear", value: "/clear", label: "命令", matchType: "exact" }
);
assert.strictEqual(core.explainMatch(baseItem, "当前").field, "zh");
assert.strictEqual(core.explainMatch(baseItem, "conversation").field, "en");
assert.strictEqual(core.explainMatch(sedItem, "替换").field, "keywords");
assert.strictEqual(core.explainMatch(baseItem, "会话").field, "context");
assert.strictEqual(core.explainMatch(sedItem, "old").field, "examples");
assert.strictEqual(core.scoreItem({ cmd: "/permissions", zh: "权限", en: "Permissions" }, "rm"), -1);
assert.strictEqual(core.scoreItem({ cmd: "sed", zh: "替换", en: "Transforming text" }, "rm"), -1);
assert(core.scoreItem({ cmd: "rm -rf", zh: "删除目录", en: "Remove directory" }, "rm -rf") > 0);

const platform = core.getPlatformCommand({
  cmd: "Cmd+P",
  platformCmds: { windows: "Ctrl+P", linux: "Ctrl+P" },
}, "windows");
assert.strictEqual(platform.command, "Ctrl+P");
assert.strictEqual(platform.usedFallback, false);
assert.strictEqual(core.getPlatformCommand({
  cmd: "Windows only",
  platforms: ["windows"],
}, "mac").unsupported, true);
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
assert.strictEqual(ranked[0].matchReason.field, "command");

assert.strictEqual(core.classifyCommandRisk("git status").requiresConfirmation, false);
assert(core.classifyCommandRisk("rm -rf ./tmp").types.includes("deleteOrOverwrite"));
assert(core.classifyCommandRisk("chmod 777 file").types.includes("permissionChange"));
assert(core.classifyCommandRisk("git rebase -i HEAD~3").types.includes("historyRewrite"));
assert(core.classifyCommandRisk("codex --yolo").types.includes("safetyBypass"));
assert(core.classifyCommandRisk("kill -9 123").types.includes("processDisruption"));

console.log("Product core tests passed.");
