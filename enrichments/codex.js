(function registerCodexEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  const slashUrl = "https://developers.openai.com/codex/cli/slash-commands";
  const referenceUrl = "https://developers.openai.com/codex/cli/reference";
  modules.codex = {
    "id:codex-status": { examples: [{ value: "/status", description: "查看当前模型、审批策略、可写目录和 token 用量", sourceUrl: slashUrl }] },
    "id:codex-compact": { examples: [{ value: "/compact", description: "总结对话历史，释放被占用的上下文空间", sourceUrl: slashUrl }] },
    "id:codex-diff": { examples: [{ value: "/diff", description: "查看已暂存、未暂存和未跟踪文件的全部改动", sourceUrl: slashUrl }] },
    "id:codex-clear": { examples: [{ value: "/clear", description: "清空终端并开始一段全新对话", sourceUrl: slashUrl }] },
    "id:codex-new": { examples: [{ value: "/new", description: "在同一 CLI 会话里开新对话，但不清屏（区别于 /clear）", sourceUrl: slashUrl }] },
    "id:codex-mcp": { examples: [
      { value: "/mcp", description: "列出已配置的 MCP 工具", sourceUrl: slashUrl },
      { value: "/mcp verbose", description: "额外显示每个 MCP 服务器的连接详情", sourceUrl: slashUrl },
    ] },
    "id:codex-mention": { examples: [{ value: "/mention src/auth.ts", description: "把指定文件附加进当前对话上下文", sourceUrl: slashUrl }] },
    "id:codex-permissions": { examples: [{ value: "/permissions", description: "调整审批策略（Auto / Read Only / Full Access）", sourceUrl: slashUrl }] },
    "id:codex-model": { examples: [{ value: "codex --model gpt-5.5", description: "用指定模型启动，覆盖配置里的默认模型", sourceUrl: referenceUrl }] },
    "id:codex-sandbox": { examples: [{ value: "codex --sandbox workspace-write", description: "以指定沙盒策略启动：read-only / workspace-write / danger-full-access", sourceUrl: referenceUrl }] },
    "id:codex-yolo": { examples: [{ value: "codex --yolo", description: "完全跳过审批和沙盒直接执行", warning: "会授予完全的文件和命令权限，仅限受控隔离环境使用", copyable: false, sourceUrl: referenceUrl }] },
  };
}(typeof window !== "undefined" ? window : globalThis));
