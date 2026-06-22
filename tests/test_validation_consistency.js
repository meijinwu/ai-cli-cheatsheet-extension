"use strict";

// 防漂移：shared/validation-rules.json 是校验规则的单一来源。
// validate-data.js 直接消费它；host.py 必须镜像同样的正则与数量上下限。
// 本测试断言 host.py 与 JSON 保持一致，任一侧改动而未同步会让 CI 失败。

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rules = require(path.join(root, "shared", "validation-rules.json"));
const registry = require(path.join(root, "shared", "source-registry.json"));
const hostPy = fs.readFileSync(path.join(root, "native-host", "host.py"), "utf8");

// 1) JSON 正则可编译且行为正确（基本健全性）。
const dangerous = new RegExp(rules.dangerousExample.source, rules.dangerousExample.flags);
const secret = new RegExp(rules.possibleSecret.source, rules.possibleSecret.flags);
assert(dangerous.test("rm -rf ./tmp"), "dangerous regex should match rm -rf");
assert(dangerous.test("dd if=/dev/zero of=/dev/sda"), "dangerous regex should match dd disk writes");
assert(dangerous.test("mkfs.ext4 /dev/sdb"), "dangerous regex should match filesystem formatting");
assert(dangerous.test(":(){ :|:& };:"), "dangerous regex should match fork bombs");
assert(!dangerous.test("git status"), "dangerous regex should not match safe command");
assert(!dangerous.test("echo done >> run.log"), "dangerous regex should not match safe append");
assert(!dangerous.test("npm run dd-report"), "dangerous regex should not match incidental dd substring");
// Legit install one-liners (curl ... | sh) must stay copyable; pipe-to-shell is a
// copy-time confirmation concern (product-core riskLevels.remoteExecution), not a
// data-validation rejection that would force the example non-copyable.
assert(!dangerous.test("curl https://example.com/install.sh | sh"), "install one-liners must not be rejected by data validation");
const remoteExec = new RegExp(rules.riskLevels.remoteExecution, "i");
assert(remoteExec.test("curl https://example.com/install.sh | sh"), "pipe-to-shell must be a copy-time risk level");
assert(secret.test("api_key=abcdef012345"), "secret regex should match leaked key");
for (const [name, source] of Object.entries(rules.riskLevels)) {
  assert.doesNotThrow(() => new RegExp(source, "i"), `risk regex should compile: ${name}`);
}

// 2) host.py 镜像同样的正则 source（host.py 用 raw string，内容应逐字符出现）。
assert(
  hostPy.includes(rules.dangerousExample.source),
  "host.py DANGEROUS_EXAMPLE_RE 与 shared/validation-rules.json 不一致"
);
assert(
  hostPy.includes(rules.possibleSecret.source),
  "host.py POSSIBLE_SECRET_RE 与 shared/validation-rules.json 不一致"
);

// 3) host.py 镜像同样的数量上下限常量。
function hostConstant(name) {
  const match = hostPy.match(new RegExp(`${name}\\s*=\\s*(\\d+)`));
  assert(match, `host.py 缺少常量 ${name}`);
  return Number(match[1]);
}
assert.strictEqual(hostConstant("MIN_KEYWORDS"), rules.keywords.min, "MIN_KEYWORDS 不一致");
assert.strictEqual(hostConstant("MAX_KEYWORDS"), rules.keywords.max, "MAX_KEYWORDS 不一致");
assert.strictEqual(hostConstant("MAX_EXAMPLES"), rules.examples.max, "MAX_EXAMPLES 不一致");

// 4) 来源枚举保持一致；URL 范围只允许来自 source-registry.json。
for (const tier of rules.sourceTiers) {
  assert(hostPy.includes(`"${tier}"`), `host.py SOURCE_TIERS 缺少档位 ${tier}`);
}
for (const claim of rules.evidenceClaims) {
  assert(hostPy.includes(`"${claim}"`), `host.py EVIDENCE_CLAIMS 缺少 ${claim}`);
}
assert(!("quasiOfficialDomains" in rules), "来源域名不得在 validation-rules.json 重复维护");
assert(!("authoritativeSourcePrefixes" in rules), "权威 URL 前缀只能来自 source registry");
assert(!("officialRepositoryPrefixes" in rules), "官方仓库前缀只能来自 source registry");
assert(hostPy.includes("load_source_registry"), "host.py 必须动态读取 source registry");
assert(registry.entries.length >= 20, "source registry should cover built-in tool sources");

console.log("Validation consistency tests passed.");
