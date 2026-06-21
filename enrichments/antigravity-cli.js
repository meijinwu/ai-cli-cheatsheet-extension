(function registerAntigravityEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  modules["antigravity-cli"] = {
    "id:agy-help": { examples: [{ value: "agy help", description: "显示外层 shell 命令（区别于会话内的斜杠命令）", sourceType: "ai-derived" }] },
    "id:agy-update": { examples: [{ value: "agy update", description: "安装或更新 agy 本体到最新版本", sourceType: "ai-derived" }] },
    "id:agy-config": { examples: [{ value: "/config", description: "打开配置设置界面", sourceType: "ai-derived" }] },
    "id:agy-fork": { examples: [{ value: "/fork", description: "分叉当前对话，探索不同方案而不丢失当前线程", sourceType: "ai-derived" }] },
    "id:agy-agents": { examples: [{ value: "/agents", description: "打开代理管理面板，查看后台子代理的状态和进度", sourceType: "ai-derived" }] },
    "id:agy-mcp": { examples: [{ value: "/mcp", description: "管理 Model Context Protocol 服务", sourceType: "ai-derived" }] },
    "id:agy-artifacts": { examples: [{ value: "/artifacts", description: "管理实施计划（对应 Gemini CLI 的 /plan）", sourceType: "ai-derived" }] },
    "id:agy-usage": { examples: [{ value: "/usage", description: "打开离线开发手册", sourceType: "ai-derived" }] },
  };
}(typeof window !== "undefined" ? window : globalThis));
