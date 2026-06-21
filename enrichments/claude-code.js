(function registerClaudeCodeEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  const commandsUrl = "https://code.claude.com/docs/en/commands";
  modules["claude-code"] = {
    "id:claude-status": { examples: [{ value: "/status", description: "显示版本、模型、账号和连接状态", sourceUrl: commandsUrl }] },
    "id:claude-mcp": { examples: [{ value: "/mcp", description: "管理 MCP 服务连接和 OAuth 认证", sourceUrl: commandsUrl }] },
    "id:claude-agents": { examples: [{ value: "/agents", description: "查看和管理子代理配置", sourceUrl: commandsUrl }] },
    "id:claude-diff": { examples: [{ value: "/diff", description: "交互式查看未提交改动和每轮对话产生的 diff", sourceUrl: commandsUrl }] },
    "id:claude-cost": { examples: [{ value: "/cost", description: "查看本次会话的花费和 token 用量", sourceUrl: commandsUrl }] },
    "id:claude-config": { examples: [{ value: "/config", description: "打开设置界面调整主题、模型等偏好", sourceUrl: commandsUrl }] },
    "id:claude-memory": { examples: [{ value: "/memory", description: "编辑 CLAUDE.md 记忆文件，管理自动记忆条目", sourceUrl: commandsUrl }] },
    "id:claude-code-review": { examples: [
      { value: "/code-review", description: "审查当前 diff 的正确性问题", sourceUrl: commandsUrl },
      { value: "/code-review --fix", description: "审查并直接应用可修复项", sourceUrl: commandsUrl },
    ] },
    "id:claude-rewind": { examples: [{ value: "/rewind", description: "把代码和对话回退到之前的检查点", sourceUrl: commandsUrl }] },
    "id:claude-add-dir": { examples: [{ value: "/add-dir ../shared-lib", description: "为当前会话添加额外可访问的工作目录", sourceUrl: commandsUrl }] },
  };
}(typeof window !== "undefined" ? window : globalThis));
