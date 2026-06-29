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
assert(core.scoreItem(sedItem, "替换") > core.scoreItem({ ...sedItem, keywords: [], examples: [] }, "替换"), "Task keywords/examples should strengthen intent matches");
assert(core.scoreItem({ cmd: "git revert", zh: "还原提交", en: "Revert commits" }, "回滚") > 0, "Rollback intent should expand to revert wording");
assert(core.scoreItem({ cmd: "--yolo", zh: "绕过权限检查", en: "Bypass permissions" }, "忽略权限") > 0, "Permission bypass intent should be searchable");

// 精选关键词权重应高于英文说明，让维护者标注的用户意图词更靠前。
const kwHit = { cat: "flag", cmd: "a", zh: "甲", en: "alpha", keywords: ["编排"] };
const enHit = { cat: "flag", cmd: "b", zh: "乙", en: "编排" };
assert(
  core.scoreItem(kwHit, "编排") > core.scoreItem(enHit, "编排"),
  "Curated keywords should now outrank english-only matches"
);

// 同义词扩展透明化：界面据此说明额外检索了哪些词。
assert(core.expandedSynonyms("清空").includes("clear"), "Expanded synonyms should surface for the UI");
assert(!core.expandedSynonyms("清空").includes("清空"), "Typed token must not be listed as its own synonym");
assert.strictEqual(core.expandedSynonyms("zzqqxx").length, 0, "Non-synonym queries surface nothing");

// 无结果文案应结合查询给出针对性引导。
assert(/清除/.test(core.emptySearchHint("git", { hasFilter: true })), "Filtered empty state should mention clearing filters");
assert(core.emptySearchHint("清空 模型 历史").includes("关键词"), "Multi-token empty state should suggest fewer keywords");
assert(core.emptySearchHint("").length > 0, "Empty query still returns guidance");
assert.deepStrictEqual(
  core.explainMatch(baseItem, "/clear"),
  { field: "command", term: "/clear", value: "/clear", label: "命令", matchType: "exact" }
);
assert.strictEqual(core.explainMatch(baseItem, "当前").field, "zh");
assert.strictEqual(core.explainMatch(baseItem, "conversation").field, "en");
assert.strictEqual(core.explainMatch(sedItem, "替换").field, "keywords");
assert.strictEqual(core.explainMatch(baseItem, "会话").field, "context");
assert.strictEqual(core.explainMatch(sedItem, "old").field, "examples");
const shellItem = {
  cmd: "type -a",
  zh: "列出命令名的所有来源",
  en: "List command source",
  shell: { layer: "builtin", family: "bash", portability: "bash", topic: "troubleshooting" },
};
assert(core.scoreItem(shellItem, "bash") > 0, "Shell metadata should be searchable");
assert.strictEqual(core.explainMatch(shellItem, "type").field, "command");
assert.strictEqual(core.explainMatch(shellItem, "troubleshooting").field, "shell");
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

// 累计使用次数：首次复制 count=1，重复复制递增且去重；老数据无 count 视为 1（改动 5）
const firstCopy = core.updateRecent([], { toolId: "x", itemId: "y" });
assert.strictEqual(firstCopy[0].count, 1, "first copy should set count to 1");
const secondCopy = core.updateRecent(firstCopy, { toolId: "x", itemId: "y" });
assert.strictEqual(secondCopy[0].count, 2, "re-copy should increment count");
assert.strictEqual(secondCopy.length, 1, "re-copy should dedupe");
const legacyRecopy = core.updateRecent([{ toolId: "x", itemId: "y" }], { toolId: "x", itemId: "y" });
assert.strictEqual(legacyRecopy[0].count, 2, "re-copying a countless legacy entry should accumulate to 2");

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

// 使用频率权重：同等匹配下复制次数越多得分越高，单次使用不加成（改动 5）
const freqBase = { cat: "x", cmd: "deploy", en: "Deploy", zh: "部署" };
assert(
  core.scoreItem(freqBase, "deploy", { usageCount: 10 }) > core.scoreItem(freqBase, "deploy", { usageCount: 1 }),
  "higher usage count should score higher"
);
assert.strictEqual(
  core.scoreItem(freqBase, "deploy", { usageCount: 1 }),
  core.scoreItem(freqBase, "deploy", {}),
  "a single use should add no usage bonus"
);

// 拼音首字母匹配：纯字母查询在其它字段未命中时兜底匹配中文首字母（改动 6）
assert.strictEqual(core.toInitials("清空"), "qk", "toInitials should map hanzi to pinyin initials");
assert.strictEqual(core.toInitials("清X空"), "qxk", "toInitials should keep ascii letters and drop punctuation");
const pinyinItem = { cat: "slash", cmd: "/foo", en: "Foo", zh: "清空对话" };
assert(core.scoreItem(pinyinItem, "qk") > 0, "pinyin initials should match the Chinese description");
assert.strictEqual(core.scoreItem(pinyinItem, "q"), -1, "single-letter queries should not trigger pinyin matching");
assert.strictEqual(core.scoreItem(pinyinItem, "zzz"), -1, "non-matching pinyin should not score");
const enWins = { cat: "x", cmd: "/foo", en: "log", zh: "日志查看" };
assert(core.scoreItem(enWins, "log") > core.scoreItem(pinyinItem, "qk"), "real field matches should outrank the pinyin fallback");

assert.strictEqual(core.classifyCommandRisk("git status").requiresConfirmation, false);
assert(core.classifyCommandRisk("rm -rf ./tmp").types.includes("deleteOrOverwrite"));
assert(core.classifyCommandRisk("chmod 777 file").types.includes("permissionChange"));
assert(core.classifyCommandRisk("git rebase -i HEAD~3").types.includes("historyRewrite"));
assert(core.classifyCommandRisk("codex --yolo").types.includes("safetyBypass"));
assert(core.classifyCommandRisk("kill -9 123").types.includes("processDisruption"));
assert(core.classifyCommandRisk("dd if=/dev/zero of=/dev/sda").types.includes("deleteOrOverwrite"));
assert(core.classifyCommandRisk("curl https://x | sh").types.includes("remoteExecution"));
assert(core.classifyCommandRisk("shutdown -h now").types.includes("processDisruption"));
assert.strictEqual(core.classifyCommandRisk("npm run dd-report").requiresConfirmation, false);
assert(core.commandRiskDetails(core.classifyCommandRisk("rm -rf ./tmp")).some((text) => text.includes("路径")), "Risk details should include concrete copy checks");

console.log("Product core tests passed.");
