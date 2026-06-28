"use strict";

const assert = require("assert");

global.window = {};
require("../data/index.js");
for (const id of window.CHEATSHEET_FILES) require(`../data/${id}.js`);
require("../product-core.js");
const fs = require("fs");
const path = require("path");
for (const filename of fs.readdirSync(path.join(__dirname, "..", "enrichments"))
  .filter((name) => name.endsWith(".js")).sort()) {
  require(`../enrichments/${filename}`);
}
require("../usage-examples.js");

window.CHEATSHEET_BUILD_FULL_ENRICHMENTS(window.CHEATSHEET_DATA);
assert.deepStrictEqual(
  window.CHEATSHEET_ENRICHMENT_WARNINGS || [],
  [],
  "all curated enrichments must use stable item IDs"
);

let itemCount = 0;
let exampleCount = 0;
const sourceCounts = { official: 0, "quasi-official": 0, manual: 0, "ai-derived": 0 };
const authorshipCounts = { official: 0, editorial: 0, generated: 0 };
const evidenceCounts = {
  "first-party": 0,
  "authoritative-community": 0,
  community: 0,
  none: 0,
};
const reviewedByTool = {};
const evidenceByTool = {};
const EXAMPLE_UI_TEXT_FIELDS = ["description", "scenario", "goal", "expected", "prerequisites", "caveat", "warning"];

function containsCjk(value) {
  return /[\u3400-\u9fff]/.test(String(value || ""));
}

for (const [toolId, tool] of Object.entries(window.CHEATSHEET_DATA)) {
  for (const item of tool.items) {
    assert(/^[a-zA-Z0-9_-]{4,64}$/.test(item.id), `${toolId} ${item.cmd}: stable id required`);
    assert(
      ["verified", "partial", "unverified"].includes(item.evidenceStatus),
      `${toolId} ${item.cmd}: evidenceStatus required`
    );
    if (item.evidenceStatus === "verified") {
      const claims = new Set((item.evidenceRefs || []).flatMap((ref) => ref.claims));
      assert(claims.has("existence") && claims.has("semantics"), `${toolId} ${item.cmd}: verified claims incomplete`);
      assert(item.evidenceRefs.every((ref) => ref.locator && ref.checkedAt), `${toolId} ${item.cmd}: verified locator required`);
    }
    const enrichment = window.CHEATSHEET_ENRICHMENTS[toolId][
      `${item.cmd}\0${item.context || ""}`
    ];
    assert(enrichment, `${toolId} ${item.cmd}: missing enrichment`);
    assert(enrichment.keywords.length >= 3, `${toolId} ${item.cmd}: missing keywords`);
    assert(enrichment.examples.length >= 1, `${toolId} ${item.cmd}: missing examples`);
    for (const example of enrichment.examples) {
      assert(sourceCounts[example.sourceType] !== undefined, `${toolId} ${item.cmd}: bad source`);
      assert(["official", "editorial", "generated"].includes(example.authorship));
      assert(["first-party", "authoritative-community", "community", "none"].includes(example.evidenceTier));
      assert(["verbatim", "adapted", "scenario-derived"].includes(example.adaptation));
      assert(
        !/^(示例用途|操作场景)：/.test(example.description),
        `${toolId} ${item.cmd}: description must not use stiff label prefix`
      );
      for (const field of EXAMPLE_UI_TEXT_FIELDS) {
        if (example[field] !== undefined) {
          assert(
            containsCjk(example[field]),
            `${toolId} ${item.cmd}: ${field} must be Chinese UI text`
          );
        }
      }
      // 防回归：派生 value 不得把占位符类型名当成真实参数泄漏（如 /effort 级别）。
      // 仅查裸 token（去掉引号串与括号补注），句子型操作描述里粘连的 CJK 不算泄漏。
      if (example.generated === true) {
        const bare = example.value.replace(/["'][^"']*["']/g, "").replace(/（[^）]*）/g, "");
        assert(
          !/(?:^|\s)(级别|条件|名称|路径|模型|命令|问题|会话|目标|描述|指令|文件名|模式|提示)(?=\s|$)/.test(bare),
          `${toolId} ${item.cmd}: value leaks CJK placeholder type-name -> ${example.value}`
        );
      }
      if (example.riskLevels?.length) {
        assert(example.warning, `${toolId} ${item.cmd}: risky example requires warning`);
        assert(
          /预览|备份|确认|检查|隔离|git status|git diff|只读/.test(example.caveat || ""),
          `${toolId} ${item.cmd}: risky example requires a safer preview or backup step`
        );
      }
      if (example.evidenceTier !== "none") {
        assert(example.sourceIds?.length, `${toolId} ${item.cmd}: evidenced example requires sourceIds`);
        const sourceTiers = new Set(example.sourceIds.map((sourceId) =>
          tool.meta.sources.find((source) => source.id === sourceId)?.evidenceTier
        ));
        assert(
          sourceTiers.has(example.evidenceTier),
          `${toolId} ${item.cmd}: evidenceTier must match sourceIds`
        );
        evidenceByTool[toolId] = (evidenceByTool[toolId] || 0) + 1;
      }
      if (example.authorship === "official") {
        assert.strictEqual(example.adaptation, "verbatim");
        assert.strictEqual(example.evidenceTier, "first-party");
        assert(example.sourceIds?.length);
        assert(/^https:\/\/\S+$/.test(example.sourceUrl || ""));
      }
      sourceCounts[example.sourceType] += 1;
      authorshipCounts[example.authorship] += 1;
      evidenceCounts[example.evidenceTier] += 1;
      if (example.authorship !== "generated") {
        reviewedByTool[toolId] = (reviewedByTool[toolId] || 0) + 1;
      }
      exampleCount += 1;
    }
    itemCount += 1;
  }
}

const expectedReviewedMinimums = {
  "claude-code": 10,
  codex: 11,
  "gemini-cli": 9,
  openclaw: 9,
  opencode: 10,
  git: 14,
  cursor: 10,
  idea: 10,
  typora: 10,
  "vs-code": 10,
};
for (const [toolId, minimum] of Object.entries(expectedReviewedMinimums)) {
  assert(
    (reviewedByTool[toolId] || 0) >= minimum,
    `${toolId}: expected at least ${minimum} explicitly sourced reviewed examples`
  );
}
assert(sourceCounts["ai-derived"] > 0, "the long tail should still receive AI-derived examples");
assert(sourceCounts.official > 0, "first-party links should not be mislabeled as manual");
assert(sourceCounts["quasi-official"] > 0, "explicit authoritative-community examples must survive normalization");
assert(authorshipCounts.editorial > 0, "curated scenarios must remain editorial");
assert(authorshipCounts.generated > 0, "template-derived long-tail examples must remain generated");
assert(evidenceCounts["first-party"] > 0, "first-party evidence must be represented independently");

function exampleFor(toolId, command, context = "") {
  return window.CHEATSHEET_ENRICHMENTS[toolId][`${command}\0${context}`].examples[0];
}

assert.strictEqual(exampleFor("linux", "kill -9").value, "kill -9 12345");
assert.strictEqual(exampleFor("linux", "kill -9").copyable, false);
assert(exampleFor("linux", "kill -9").warning);
assert.strictEqual(exampleFor("linux", "tar -czf").value, "tar -czf archive.tar.gz example-dir");
assert.strictEqual(exampleFor("linux", "|").value, 'cat app.log | grep "ERROR"');
assert.strictEqual(exampleFor("linux", ">").value, 'echo "example" > output.txt');
assert.strictEqual(exampleFor("linux", "Ctrl+R", "shell-builtin-readline").copyable, false);
assert.strictEqual(exampleFor("linux", "bg", "shell-builtin").copyable, false);
assert.strictEqual(exampleFor("antigravity-cli", "/quit 或 /exit").value, "/quit");
assert.strictEqual(exampleFor("antigravity-cli", "AGENTS.md（项目根目录）").copyable, false);
assert.strictEqual(exampleFor("antigravity-cli", ".agents/skills/<名称>.md").value, "查看或编辑 .agents/skills/lint.md");
assert.strictEqual(exampleFor("antigravity-cli", "首次启动自动检测迁移").copyable, false);
assert.strictEqual(exampleFor("claude-code", "/btw <问题>").value, '/btw "检查当前改动"');
assert.strictEqual(exampleFor("codex", "--model, -m <模型>").value, "codex --model gpt-5.5");
assert.strictEqual(exampleFor("cursor", "@Folders", "Chat/Composer").value, "@Folders src/components");
assert.strictEqual(exampleFor("openclaw", "/verbose on|off|full").value, "/verbose on");
assert.strictEqual(exampleFor("openclaw", "/reset [soft [message]]").value, '/reset soft "重新开始"');
assert.strictEqual(exampleFor("git", "branch -d", "branch").value, "git branch -d feature/old");

const claudeFast = window.CHEATSHEET_ENRICHMENTS["claude-code"]["/fast [on|off]\0"].examples;
assert(claudeFast.every((example) => example.sourceUrl === "https://code.claude.com/docs/en/fast-mode"));
assert(claudeFast.every((example) => !example.description.includes("跳过规划")));
assert(
  !window.CHEATSHEET_DATA["claude-code"].items.some((item) => item.cat === "slash" && item.cmd === "/vim"),
  "Claude Code must not expose removed /vim command"
);

const yolo = exampleFor("codex", "--yolo / --dangerously-bypass-approvals-and-sandbox");
assert.strictEqual(yolo.copyable, false);
assert(yolo.warning);
assert(yolo.riskLevels.includes("safetyBypass"));
assert.strictEqual(yolo.sourceUrl, "https://developers.openai.com/codex/cli/reference");

const resetHard = exampleFor("git", "reset --hard", "reset");
assert.strictEqual(resetHard.copyable, false);
assert(resetHard.riskLevels.includes("historyRewrite"));

const testApi = window.CHEATSHEET_ENRICHMENT_TEST_API;
assert.strictEqual(testApi.triggerHit("mcp tools", "cp "), false);
assert.strictEqual(testApi.triggerHit("confirm action", "rm "), false);
assert.strictEqual(testApi.triggerHit("@definitions symbol", "init"), false);
assert.strictEqual(testApi.triggerHit("models list", "model"), true);
assert.strictEqual(testApi.triggerHit("configure settings", "config"), true);

window.CHEATSHEET_ENRICHMENTS["source-policy-test"] = {
  command: { examples: [{ value: "command", description: "没有精确来源的人工整理" }] },
};
window.CHEATSHEET_BUILD_FULL_ENRICHMENTS({
  "source-policy-test": {
    meta: { sourceUrl: "https://example.com/tool-home" },
    items: [{ cat: "flag", cmd: "command", en: "Command", zh: "命令" }],
  },
});
const sourcePolicyExample = window.CHEATSHEET_ENRICHMENTS["source-policy-test"]["command\0"].examples[0];
assert.strictEqual(sourcePolicyExample.sourceType, "manual");
assert.strictEqual(sourcePolicyExample.authorship, "editorial");
assert.strictEqual(sourcePolicyExample.evidenceTier, "none");
assert.strictEqual(sourcePolicyExample.sourceUrl, undefined);

for (const toolId of ["cursor", "idea", "typora", "vs-code"]) {
  const examples = Object.values(window.CHEATSHEET_ENRICHMENTS[toolId])
    .flatMap((enrichment) => enrichment.examples);
  assert.strictEqual(
    examples.filter((example) => example.authorship === "editorial").length,
    10,
    `${toolId}: selected scenarios must remain editorial`
  );
  assert.strictEqual(
    examples.filter((example) => example.evidenceTier === "first-party").length,
    10,
    `${toolId}: selected scenarios must bind first-party evidence`
  );
  assert(
    examples.some((example) => example.authorship === "generated"),
    `${toolId}: long-tail fallback must remain generated`
  );
}

for (const toolId of ["claude-code", "codex", "git", "linux"]) {
  const scenarioRich = Object.values(window.CHEATSHEET_ENRICHMENTS[toolId])
    .flatMap((enrichment) => enrichment.examples)
    .filter((example) => example.scenario && example.goal && example.expected);
  assert(
    scenarioRich.length >= 10,
    `${toolId}: expected at least 10 high-frequency scenario-rich examples`
  );
}

console.log(`Usage example tests passed: ${itemCount} items, ${exampleCount} examples.`);
