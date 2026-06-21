"use strict";

// 防漂移：shared/validation-rules.json 是校验规则的单一来源。
// validate-data.js 直接消费它；host.py 必须镜像同样的正则与数量上下限。
// 本测试断言 host.py 与 JSON 保持一致，任一侧改动而未同步会让 CI 失败。

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rules = require(path.join(root, "shared", "validation-rules.json"));
const hostPy = fs.readFileSync(path.join(root, "native-host", "host.py"), "utf8");

// 1) JSON 正则可编译且行为正确（基本健全性）。
const dangerous = new RegExp(rules.dangerousExample.source, rules.dangerousExample.flags);
const secret = new RegExp(rules.possibleSecret.source, rules.possibleSecret.flags);
assert(dangerous.test("rm -rf ./tmp"), "dangerous regex should match rm -rf");
assert(!dangerous.test("git status"), "dangerous regex should not match safe command");
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

// 4) host.py 镜像同样的来源信任档位与类官方白名单域名。
for (const tier of rules.sourceTiers) {
  assert(hostPy.includes(`"${tier}"`), `host.py SOURCE_TIERS 缺少档位 ${tier}`);
}
for (const domain of rules.quasiOfficialDomains) {
  assert(hostPy.includes(`"${domain}"`), `host.py QUASI_OFFICIAL_DOMAINS 缺少域名 ${domain}`);
}

console.log("Validation consistency tests passed.");
