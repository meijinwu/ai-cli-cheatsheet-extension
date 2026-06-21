(function registerOpenClawEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  const slashUrl = "https://docs.openclaw.ai/tools/slash-commands";
  const cliUrl = "https://docs.openclaw.ai/cli";
  modules.openclaw = {
    "id:e935e9217127827f": { examples: [{ value: "/stop", description: "中止当前正在执行的运行", sourceUrl: slashUrl }] },
    "id:af6d7ce1c0b55201": { examples: [
      { value: "/think high", description: "调高思考级别，处理复杂任务时推理更充分", sourceUrl: slashUrl },
      { value: "/think default", description: "恢复到默认思考级别", sourceUrl: slashUrl },
    ] },
    "id:5abcc13ae9dec5fe": { examples: [{ value: "/commands", description: "显示所有可用命令目录", sourceUrl: slashUrl }] },
    "id:3b834956d114d227": { examples: [{ value: "/whoami", description: "显示当前发送者身份标识", sourceUrl: slashUrl }] },
    "id:e27b16de672d521d": { examples: [{ value: "openclaw status", description: "快速显示系统、Gateway、代理和配置摘要", sourceUrl: cliUrl }] },
    "id:8b7ae1910db15d50": { examples: [{ value: "openclaw update", description: "更新 OpenClaw 到最新版本并重启 Gateway", sourceUrl: cliUrl }] },
    "id:6d73b494e4028e03": { examples: [{ value: "openclaw logs --follow", description: "实时跟踪最新日志输出", sourceUrl: cliUrl }] },
    "id:bbfc5c0be878f745": { examples: [{ value: "openclaw dashboard", description: "在浏览器中打开 Control UI 控制台", sourceUrl: cliUrl }] },
    "id:a64d286059d510a6": { examples: [{ value: "openclaw configure", description: "进入交互式配置向导", sourceUrl: cliUrl }] },
  };
}(typeof window !== "undefined" ? window : globalThis));
