(function registerGeminiCliEnrichments(globalScope) {
  "use strict";
  const modules = globalScope.CHEATSHEET_ENRICHMENT_MODULES ||= {};
  const commandsUrl = "https://geminicli.com/docs/reference/commands/";
  modules["gemini-cli"] = {
    "id:gemini-clear": { examples: [{ value: "/clear", description: "清空终端屏幕和可见历史（快捷键 Ctrl+L）", sourceUrl: commandsUrl }] },
    "id:gemini-chat": { examples: [{ value: "/chat", description: "浏览历史会话和手动检查点并恢复", sourceUrl: commandsUrl }] },
    "id:gemini-copy": { examples: [{ value: "/copy", description: "把最近一次输出复制到剪贴板", sourceUrl: commandsUrl }] },
    "id:gemini-editor": { examples: [{ value: "/editor", description: "选择用于编写长提示的外部编辑器", sourceUrl: commandsUrl }] },
    "id:gemini-init": { examples: [{ value: "/init", description: "分析当前目录，生成定制化的项目说明文件", sourceUrl: commandsUrl }] },
    "id:gemini-restore": { examples: [{ value: "/restore", description: "把项目文件恢复到某次工具执行前的状态", sourceUrl: commandsUrl }] },
    "id:gemini-rewind": { examples: [{ value: "/rewind", description: "回溯对话，可选择回退聊天和/或代码改动（Esc Esc）", sourceUrl: commandsUrl }] },
    "id:gemini-vim": { examples: [{ value: "/vim", description: "切换 Vim 风格的导航和编辑模式", sourceUrl: commandsUrl }] },
    "id:gemini-theme": { examples: [{ value: "/theme", description: "切换界面视觉主题", sourceUrl: commandsUrl }] },
  };
}(typeof window !== "undefined" ? window : globalThis));
