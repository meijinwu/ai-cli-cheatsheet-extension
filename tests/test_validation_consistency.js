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
const core = require(path.join(root, "product-core.js"));
const hostPy = fs.readFileSync(path.join(root, "native-host", "host.py"), "utf8");
const validateDataJs = fs.readFileSync(path.join(root, "tools", "validate-data.js"), "utf8");

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
assert(secret.test("token=abcdef012345"), "secret regex should match leaked token assignments");
assert(!secret.test("docker secret create app_secret ./secret.txt"), "secret regex should not match Docker secret subcommands");
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
assert(
  validateDataJs.includes("tool.meta.builtIn === true && tool.meta.verificationStatus !== \"manual\""),
  "validate-data.js should only require manual verificationStatus for built-in datasets"
);

// 5) product-core.js COMMAND_RISKS（复制时的 UI 风险提示）必须与 shared riskLevels
//    覆盖同一组风险类型，且对一组探测样本给出一致的判定结果。曾经发生过
//    product-core 加了 bypassPermissions 关键词但 shared JSON 未同步的真实漂移。
const RISK_PROBES = {
  safetyBypass: { positive: ["--yolo", "dangerously-bypass", "bypassPermissions"], negative: ["echo hello"] },
  remoteExecution: {
    positive: ["curl https://example.com/install.sh | sh", ":(){ :|:& };:"],
    negative: ["echo hi"],
  },
  deleteOrOverwrite: {
    positive: ["rm -rf ./tmp", "dd if=/dev/zero of=/dev/sda", "reset --hard HEAD", "mkfs.ext4 /dev/sdb", "echo done > out.txt"],
    negative: ["git status", "echo done >> log"],
  },
  historyRewrite: {
    positive: ["push --force", "rebase -i HEAD~3", "reset --hard HEAD~1"],
    negative: ["git status"],
  },
  permissionChange: { positive: ["chmod 755 file", "chown user file"], negative: ["ls -la"] },
  processDisruption: { positive: ["kill -9 1234", "sudo reboot", "shutdown now"], negative: ["echo hi"] },
};

const coreRiskByKey = new Map(core.COMMAND_RISKS.map(([key, , pattern]) => [key, pattern]));
assert.deepStrictEqual(
  new Set(Object.keys(rules.riskLevels)),
  new Set(coreRiskByKey.keys()),
  "shared riskLevels 与 product-core COMMAND_RISKS 的风险类型集合必须一致"
);
for (const [key, probes] of Object.entries(RISK_PROBES)) {
  assert(coreRiskByKey.has(key), `RISK_PROBES 缺少 product-core 风险类型 ${key} 的探针`);
  const jsonPattern = new RegExp(rules.riskLevels[key], "i");
  const corePattern = coreRiskByKey.get(key);
  for (const sample of probes.positive) {
    assert(jsonPattern.test(sample), `shared riskLevels.${key} 应匹配 "${sample}"`);
    assert(corePattern.test(sample), `product-core COMMAND_RISKS.${key} 应匹配 "${sample}"`);
  }
  for (const sample of probes.negative) {
    assert(!jsonPattern.test(sample), `shared riskLevels.${key} 不应匹配 "${sample}"`);
    assert(!corePattern.test(sample), `product-core COMMAND_RISKS.${key} 不应匹配 "${sample}"`);
  }
}

// 6) tools/validate-data.js 的 example.riskLevels 枚举必须覆盖 shared riskLevels 的全部类型。
for (const key of Object.keys(rules.riskLevels)) {
  assert(validateDataJs.includes(`"${key}"`), `validate-data.js riskLevels 枚举缺少 ${key}`);
}

// 7) host.py 镜像剩余的枚举集合（之前只检查了 sourceTiers / evidenceClaims）。
for (const kind of rules.sourceKinds) {
  assert(hostPy.includes(`"${kind}"`), `host.py SOURCE_KINDS 缺少 ${kind}`);
}
for (const authorship of rules.authorships) {
  assert(hostPy.includes(`"${authorship}"`), `host.py AUTHORSHIPS 缺少 ${authorship}`);
}
for (const tier of rules.evidenceTiers) {
  assert(hostPy.includes(`"${tier}"`), `host.py EVIDENCE_TIERS 缺少 ${tier}`);
}
for (const adaptation of rules.adaptations) {
  assert(hostPy.includes(`"${adaptation}"`), `host.py ADAPTATIONS 缺少 ${adaptation}`);
}
for (const status of rules.evidenceStatuses) {
  assert(hostPy.includes(`"${status}"`), `host.py EVIDENCE_STATUSES 缺少 ${status}`);
}

// 8) 危险/密钥扫描必须同时覆盖 example.value 与 platformValues 的每个平台值，
//    且两个校验器都要（曾经只扫 value，platformValues 里的危险命令会被放行）。
assert(
  validateDataJs.includes("dangerousExampleTexts"),
  "validate-data.js 必须通过 dangerousExampleTexts 同时扫描 value 与 platformValues"
);
assert(
  hostPy.includes("def apply_platform_danger_fallback"),
  "host.py 必须对 platformValues 应用危险降级（apply_platform_danger_fallback）"
);
assert(
  hostPy.includes("apply_platform_danger_fallback(clean_example)"),
  "host.py _clean_example 必须调用 apply_platform_danger_fallback"
);

console.log("Validation consistency tests passed.");
