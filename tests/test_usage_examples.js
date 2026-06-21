"use strict";

const assert = require("assert");

global.window = {};
require("../data/index.js");
for (const id of window.CHEATSHEET_FILES) require(`../data/${id}.js`);
require("../usage-examples.js");

window.CHEATSHEET_BUILD_FULL_ENRICHMENTS(window.CHEATSHEET_DATA);

let itemCount = 0;
let exampleCount = 0;
const sourceCounts = { official: 0, manual: 0, "ai-derived": 0 };

for (const [toolId, tool] of Object.entries(window.CHEATSHEET_DATA)) {
  for (const item of tool.items) {
    const enrichment = window.CHEATSHEET_ENRICHMENTS[toolId][
      `${item.cmd}\0${item.context || ""}`
    ];
    assert(enrichment, `${toolId} ${item.cmd}: missing enrichment`);
    assert(enrichment.keywords.length >= 3, `${toolId} ${item.cmd}: missing keywords`);
    assert(enrichment.examples.length >= 1, `${toolId} ${item.cmd}: missing examples`);
    for (const example of enrichment.examples) {
      assert(sourceCounts[example.sourceType] !== undefined, `${toolId} ${item.cmd}: bad source`);
      assert(
        !/^(示例用途|操作场景)：/.test(example.description),
        `${toolId} ${item.cmd}: description must not use stiff label prefix`
      );
      sourceCounts[example.sourceType] += 1;
      exampleCount += 1;
    }
    itemCount += 1;
  }
}

assert.strictEqual(itemCount, 874);
assert(sourceCounts.manual >= 120, "curated examples should remain manual");
assert(sourceCounts["ai-derived"] > 700, "remaining entries should receive AI-derived examples");

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

console.log(`Usage example tests passed: ${itemCount} items, ${exampleCount} examples.`);
