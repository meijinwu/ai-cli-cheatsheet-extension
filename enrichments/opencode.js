(function registerOpenCodeEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  const tuiUrl = "https://opencode.ai/docs/tui/";
  const cliUrl = "https://opencode.ai/docs/cli/";
  modules.opencode = {
    "id:opencode-init": { examples: [{ value: "/init", description: "引导创建或更新项目的 AGENTS.md 文件", sourceUrl: tuiUrl }] },
    "id:opencode-share": { examples: [{ value: "/share", description: "为当前会话生成可分享的链接", sourceUrl: tuiUrl }] },
    "id:opencode-help": { examples: [{ value: "/help", description: "打开帮助对话框", sourceUrl: tuiUrl }] },
    "id:opencode-launch": { examples: [{ value: "opencode", description: "在当前目录启动交互式终端界面", sourceUrl: cliUrl }] },
    "id:opencode-models": { examples: [{ value: "opencode models", description: "列出所有已配置提供商的可用模型", sourceUrl: cliUrl }] },
    "id:opencode-auth-login": { examples: [{ value: "opencode auth login", description: "交互式添加 AI 提供商的 API Key", sourceUrl: cliUrl }] },
    "id:opencode-serve": { examples: [{ value: "opencode serve", description: "启动无界面 HTTP API 服务器，供外部程序调用", sourceUrl: cliUrl }] },
    "id:opencode-run-continue": { examples: [{ value: "opencode run -c", description: "在非交互模式下继续上次会话", sourceUrl: cliUrl }] },
    "id:opencode-session-list": { examples: [{ value: "opencode session list", description: "列出所有历史会话", sourceUrl: cliUrl }] },
    "id:opencode-model-flag": { examples: [{ value: "opencode --model anthropic/claude-sonnet", description: "启动时指定 provider/model 格式的模型", sourceUrl: cliUrl }] },
  };
}(typeof window !== "undefined" ? window : globalThis));
