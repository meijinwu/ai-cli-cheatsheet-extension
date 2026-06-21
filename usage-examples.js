(function initUsageExamples(globalScope) {
  "use strict";

  const SOURCE_TYPES = new Set(["official", "manual", "ai-derived"]);
  const RISK_PATTERNS = {
    deleteOrOverwrite: /(?:\brm(?:\s|$)|\breset\s+--hard\b|--delete\b)|(^|\s)>(?!>)/i,
    permissionChange: /\b(chmod|chown)\b/i,
    historyRewrite: /\b(reset\s+--hard|push\s+--force|rebase\s+-i)\b/i,
    safetyBypass: /(?:--yolo|dangerously-bypass)\b/i,
    processDisruption: /\b(kill\s+-9|restart)\b/i,
  };
  const RISK_WARNINGS = {
    deleteOrOverwrite: "此操作可能删除或覆盖数据，请先确认目标并做好备份",
    permissionChange: "此操作会改变文件权限或所有者，请确认目标和权限值",
    historyRewrite: "此操作会重写提交历史，请确认分支状态和协作影响",
    safetyBypass: "此操作会绕过安全保护，仅限受控隔离环境使用",
    processDisruption: "此操作会强制终止或重启进程，可能中断正在进行的工作",
  };
  const KEYWORD_RULES = [
    [["搜索", "查找", "find", "search", "grep"], ["搜索", "查找", "定位"]],
    [["替换", "replace", "substitute", "sed"], ["替换", "取代", "文本替换"]],
    [["删除", "移除", "remove", "delete", "rm "], ["删除", "移除", "清理"]],
    [["创建", "新建", "create", "init", "mkdir"], ["创建", "新建", "初始化"]],
    [["复制", "copy", "clone", "cp "], ["复制", "克隆", "拷贝"]],
    [["移动", "重命名", "move", "rename", "mv "], ["移动", "重命名", "改名"]],
    [["显示", "查看", "list", "show", "status"], ["查看", "显示", "状态"]],
    [["配置", "设置", "config", "settings"], ["配置", "设置", "偏好"]],
    [["模型", "model"], ["模型", "切换模型", "模型选择"]],
    [["会话", "session", "resume"], ["会话", "恢复会话", "历史会话"]],
    [["压缩", "compact", "compress"], ["压缩", "精简上下文", "节省上下文"]],
    [["格式", "format"], ["格式化", "代码格式", "排版"]],
    [["帮助", "help", "docs"], ["帮助", "说明", "文档"]],
  ];

  function cleanSyntax(value) {
    return String(value || "")
      .replace(/（[^）]*别名[^）]*）/g, "")
      .replace(/（或[^）]+）/g, "")
      .replace(/\s+或\s+.+$/, "")
      .replace(/\s+\/\s*.+$/, "")
      .replace(/,\s+-\w\b/g, "")
      .replace(/\[soft \[message\]\]/gi, 'soft "重新开始"')
      .replace(/\[([^\]]+)\]/g, (_match, label) => {
        const normalized = label.toLowerCase();
        if (/^-/.test(label.trim())) return label.trim();
        if (normalized.includes("|")) {
          // 区分「字面选项列表」(list|reload→取字面首词) 与「形参占位符」(级别|auto、条件|clear→走值映射)，
          // 避免把类型名当成真实参数泄漏（如 /effort 级别）。
          const first = normalized.split("|")[0].trim();
          const isParam = /级别|level|条件|目标|goal|名称|name|title|路径|path|file|模型|model|会话|session|值|value|命令|command|问题|prompt|描述|提示|任务|指令|编号|number|url/.test(first);
          return isParam ? cleanSyntax(`[${first}]`) : first;
        }
        if (/pr/.test(normalized)) return "123";
        if (/url|链接/.test(normalized)) return "https://example.com";
        if (/number|编号|序号/.test(normalized)) return "123";
        if (/commit|hash|提交/.test(normalized)) return "abc1234";
        if (/路径|path|file/.test(normalized)) return "src/app.js";
        if (/模型|model/.test(normalized)) return "model-name";
        if (/会话|session|id/.test(normalized)) return "session-id";
        if (/条件|目标/.test(normalized)) return '"完成登录重构"';
        if (/级别|level/.test(normalized)) return "medium";
        if (/命令|command/.test(normalized)) return "git status";
        if (/提示|任务|指令|prompt|问题|question|描述|报告/.test(normalized)) return "检查当前改动";
        if (/文件名/.test(normalized)) return "session.md";
        if (/名称|name|title/.test(normalized)) return "sample-name";
        if (/key=value/.test(normalized)) return "theme=dark";
        if (/^n$/i.test(normalized)) return "1";
        if (/copy|verbose|last/.test(normalized)) return normalized.split("|")[0];
        return "sample-value";
      })
      .replace(/<([^>]+)>/g, (_match, label) => {
        // 形参占位符（尖括号）取首个候选，但仍要走值映射，避免落成类型名本身（如 <level|default>→level）。
        if (label.includes("|")) return cleanSyntax(`<${label.split("|")[0]}>`);
        if (/^-/.test(label.trim())) return label.trim();
        if (/commit|hash|提交/i.test(label)) return "abc1234";
        if (/url|链接/i.test(label)) return "https://example.com";
        if (/number|编号|序号/i.test(label)) return "123";
        if (/command/i.test(label)) return "git status";
        if (/file|path|路径/i.test(label)) return "src/app.js";
        if (/level|级别/i.test(label)) return "medium";
        if (/value|值/i.test(label)) return "sample-value";
        if (/text|question|message|input|问题|任务|目标|指令/i.test(label)) return '"检查当前改动"';
        if (/recipient/i.test(label)) return "user@example.com";
        if (/channel/i.test(label)) return "stable";
        if (/code/i.test(label)) return "123456";
        if (/plugin/i.test(label)) return "example-plugin";
        if (/name|title|名称/i.test(label)) return "sample-name";
        if (/shell/i.test(label)) return "zsh";
        if (/模式/i.test(label)) return "workspace-write";
        if (/模型/i.test(label)) return "gpt-5.5";
        return "sample-value";
      })
      .replace(/\b([a-z][\w-]*)\|[\w|#-]+\b/gi, "$1")
      .trim();
  }

  function commandPrefix(toolId, command) {
    if (toolId === "git" && !/^git\b/.test(command)) return `git ${command}`;
    const cliNames = {
      codex: "codex",
      "claude-code": "claude",
      "gemini-cli": "gemini",
      opencode: "opencode",
      openclaw: "openclaw",
    };
    if (/^-{1,2}[\w-]+/.test(command) && cliNames[toolId]) return `${cliNames[toolId]} ${command}`;
    return command;
  }

  function completeCommonCommand(toolId, value) {
    if (toolId === "linux") {
      const completeValues = {
        cd: "cd ./example-dir",
        mkdir: "mkdir example-dir",
        "mkdir -p": "mkdir -p parent/example-dir",
        cp: "cp source.txt copy.txt",
        "cp -r": "cp -r source-dir copy-dir",
        mv: "mv old-name new-name",
        rm: "rm ./example.tmp",
        touch: "touch notes.txt",
        cat: "cat README.md",
        less: "less app.log",
        head: "head README.md",
        tail: "tail app.log",
        chmod: "chmod 644 notes.txt",
        "chmod 755": "chmod 755 scripts/deploy.sh",
        chown: "chown user:group notes.txt",
        kill: "kill 12345",
        "kill -9": "kill -9 12345",
        grep: 'grep "TODO" README.md',
        "grep -i": 'grep -i "error" app.log',
        find: 'find . -name "*.js"',
        sort: "sort names.txt",
        uniq: "uniq sorted-names.txt",
        wc: "wc README.md",
        diff: "diff old.txt new.txt",
        curl: "curl https://example.com",
        wget: "wget https://example.com/archive.zip",
        tar: "tar -tf archive.tar",
        "tar -czf": "tar -czf archive.tar.gz example-dir",
        "|": 'cat app.log | grep "ERROR"',
        ">": 'echo "example" > output.txt',
        ">>": 'echo "next line" >> output.txt',
        ssh: "ssh user@example.com",
        scp: "scp file.txt user@example.com:/tmp/",
        ping: "ping example.com",
        "ln -s": "ln -s target.txt shortcut.txt",
        which: "which node",
      };
      return completeValues[value] || value;
    }

    if (toolId === "git") {
      const completeValues = {
        "git reset <file>": "git reset src/app.js",
        "git rm": "git rm obsolete.txt",
        "git rm --cached": "git rm --cached .env",
        "git mv": "git mv old-name.js new-name.js",
        "git branch -d": "git branch -d feature/old",
        "git checkout": "git checkout main",
        "git checkout -b": "git checkout -b feature/search",
        "git checkout -- <file>": "git checkout -- src/app.js",
        "git switch": "git switch main",
        "git merge": "git merge feature/search",
        "git merge --no-ff": "git merge --no-ff feature/search",
        "git rebase": "git rebase main",
        "git rebase -i": "git rebase -i HEAD~3",
        "git cherry-pick": "git cherry-pick abc1234",
        "git stash drop": "git stash drop stash@{0}",
        "git remote add": "git remote add origin https://github.com/example/project.git",
        "git remote remove": "git remote remove upstream",
        "git push -u": "git push -u origin feature/search",
        "git push --force": "git push --force origin feature/search",
        "git log --author": 'git log --author="Alice"',
        "git show <commit>": "git show abc1234",
        "git tag": "git tag v1.0.0",
        "git tag -a": 'git tag -a v1.0.0 -m "Release v1.0.0"',
        "git tag -d": "git tag -d v1.0.0",
        "git blame": "git blame src/app.js",
        "git blame -L": "git blame -L 10,30 src/app.js",
        "git config": "git config user.name",
        "git config --global": 'git config --global user.name "Alice"',
        "git bisect": "git bisect start",
        "git grep": 'git grep "TODO"',
      };
      return completeValues[value] || value;
    }

    const completeValues = {
      "@Folders": "@Folders src/components",
      "@Web": "@Web 查询当前浏览器兼容性",
      "@Git": "@Git 最近一次提交修改了什么？",
      "@Docs": "@Docs https://example.com/docs",
      "@Chat": "@Chat 总结上一次讨论的决定",
      "@Definitions": "@Definitions UserService",
    };
    return completeValues[value] || value;
  }

  function isKeyboardOperation(item) {
    return item.cat === "shortcut"
      || /^(?:Cmd|Ctrl|Alt|Option|Shift|Enter|Esc|Tab|F\d+|PageUp|PageDown|Up|Down)\b/i.test(item.cmd)
      || /(?:^|\s)(?:Cmd|Ctrl|Alt|Option|Shift)\+/i.test(item.cmd);
  }

  function isReferenceEntry(item) {
    return /(?:^|\/)(?:AGENTS\.md|[^/\s]+\.(?:md|json|toml|yaml|yml))(?:（.*）)?$/i.test(item.cmd)
      || /^~\//.test(item.cmd)
      || /^\.[\w-]+\//.test(item.cmd);
  }

  function isDescriptiveEntry(item) {
    if (["|", ">", ">>"].includes(item.cmd)) return false;
    return !/^(?:\/|--?|[\w.-]+(?:\s|$)|[@?!])/.test(item.cmd)
      || /^(?:首次启动|安装命令)/.test(item.cmd);
  }

  function operationValue(item) {
    if (isReferenceEntry(item)) {
      return `查看或编辑 ${item.cmd.replace("<名称>", "lint")}`;
    }
    if (item.cmd.startsWith("@路径")) return "输入 @src/app.js，把示例文件加入当前对话上下文";
    if (item.cmd === "首次启动自动检测迁移") return "首次启动 agy，按界面提示选择要迁移的 Gemini CLI 配置";
    if (/^安装命令/.test(item.cmd)) return item.zh;
    if (item.cmd === "bg") return "先按 Ctrl+Z 挂起任务，再输入 bg 让任务在后台继续运行";
    if (item.cmd === "fg") return "输入 fg，把最近的后台任务切回前台";
    return `按 ${item.cmd}${item.context ? `（${item.context}）` : ""}`;
  }

  // ASCII 触发词要求前置词边界，避免词内误匹配（'cp ' 命中 'mcp'、'rm ' 命中 'confirm'、
  // 'init' 命中 'definitions'）注入错误的搜索同义词；中文触发词仍按子串匹配。
  function triggerHit(haystack, trigger) {
    const token = trigger.trim();
    if (/^[\x00-\x7F]+$/.test(token)) {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(?:^|[^a-z0-9])${escaped}`, "i").test(haystack);
    }
    return haystack.includes(trigger);
  }

  function classifyRisk(value) {
    return Object.keys(RISK_PATTERNS).filter((level) => RISK_PATTERNS[level].test(String(value || "")));
  }

  function deriveKeywords(item) {
    const haystack = `${item.cmd} ${item.zh} ${item.en} ${item.context || ""}`.toLowerCase();
    const keywords = [];
    KEYWORD_RULES.forEach(([triggers, values]) => {
      if (triggers.some((trigger) => triggerHit(haystack, trigger))) keywords.push(...values);
    });
    const fallback = [
      item.zh,
      item.en,
      String(item.cmd).split(/\s+/)[0],
    ].filter(Boolean);
    return [...new Set([...keywords, ...fallback])].slice(0, 8);
  }

  // 仅当 context 提供 zh 未含的场景信息时才折叠进描述；纯基础命令 token（如 git 的
  // reset/branch）不算场景，跳过。CJK 与含分隔符的 context（如「编辑器」「Chat/Composer」）保留。
  function deriveDescription(item) {
    const zh = String(item.zh || "").trim();
    const context = String(item.context || "").trim();
    const isBaseToken = /^[\w.-]+$/.test(context);
    if (!context || isBaseToken || zh.includes(context)) return zh;
    return `${context}：${zh}`;
  }

  function deriveExample(toolId, tool, item) {
    const syntax = completeCommonCommand(toolId, commandPrefix(toolId, cleanSyntax(item.cmd)));
    const isOperation = isKeyboardOperation(item) || isReferenceEntry(item)
      || isDescriptiveEntry(item)
      || (toolId === "linux" && ["bg", "fg"].includes(item.cmd));
    const risks = classifyRisk(syntax);
    const unresolved = /[\[\]<>]|模型名|(?:\s+或\s+)|\|/.test(syntax);
    const value = isOperation ? operationValue(item) : syntax;
    const platformValues = item.platformCmds
      ? Object.fromEntries(Object.entries(item.platformCmds).map(([platform, platformCommand]) => [
        platform,
        isOperation
          ? `按 ${platformCommand}${item.context ? `（${item.context}）` : ""}`
          : completeCommonCommand(toolId, commandPrefix(toolId, cleanSyntax(platformCommand))),
      ]))
      : null;
    return {
      value,
      description: deriveDescription(item),
      generated: true,
      copyable: !isOperation && !unresolved && !risks.length,
      sourceType: "ai-derived",
      ...(risks.length ? { warning: RISK_WARNINGS[risks[0]], riskLevels: risks } : {}),
      ...(Array.isArray(item.platforms) ? { platforms: item.platforms } : {}),
      ...(platformValues ? { platformValues } : {}),
    };
  }

  function normalizeCuratedExample(example) {
    const risks = classifyRisk(example.value);
    const sourceType = SOURCE_TYPES.has(example.sourceType)
      ? example.sourceType
      : example.sourceUrl ? "manual" : "ai-derived";
    return {
      ...example,
      sourceType,
      ...(risks.length ? {
        copyable: false,
        warning: example.warning || RISK_WARNINGS[risks[0]],
        riskLevels: risks,
      } : {}),
    };
  }

  globalScope.CHEATSHEET_ENRICHMENTS = {
    "antigravity-cli": {
      'agy -p / --print': { examples: [{ value: 'agy -p "解释这个项目的目录结构"', description: "非交互执行一次任务并把结果输出到终端" }] },
      'agy --model "模型名"': { examples: [{ value: 'agy --model "Gemini 3.1 Pro"', description: "使用指定模型启动交互会话" }] },
      "/model": { examples: [{ value: "/model", description: "在当前会话中打开模型选择界面" }] },
      "/diff": { examples: [{ value: "/diff", description: "查看代理在工作区中产生的文件改动" }] },
      "/rewind 或 /undo": { examples: [{ value: "/rewind", description: "选择较早的消息并回退会话状态" }] },
      "/resume": { examples: [{ value: "/resume", description: "打开历史会话列表并恢复一次会话" }] },
      "agy": { examples: [{ value: "agy", description: "在当前目录启动 Antigravity 交互式终端界面" }] },
      "agy models": { examples: [{ value: "agy models", description: "列出当前账号和套餐可使用的模型" }] },
      "/permissions": { examples: [{ value: "/permissions", description: "查看和编辑当前作用域的工具权限规则" }] },
      "/fast": { examples: [{ value: "/fast", description: "跳过规划阶段直接执行，适合范围明确的小任务", warning: "复杂任务建议保留规划阶段" }] },
    },
    "claude-code": {
      "/compact [指令]": { examples: [{ value: "/compact 保留当前实现决策和未完成任务", description: "按指定重点压缩上下文，释放可用上下文空间" }] },
      "/model [模型]": { examples: [{ value: "/model", description: "打开模型选择器并调整当前会话模型" }] },
      "/resume [会话]": { examples: [{ value: "/resume", description: "打开会话选择器；也可以在后面填写会话名称或 ID" }] },
      "/plan [描述]": { examples: [{ value: "/plan 重构登录模块并补充测试", description: "带着具体目标进入计划模式" }] },
      "/review [PR]": { examples: [{ value: "/review 123", description: "审查编号为 123 的 Pull Request" }] },
      "!（行首）": { examples: [{ value: "!git status", description: "在会话中执行 shell 命令，并把输出加入上下文" }] },
      "/init": { examples: [{ value: "/init", description: "分析当前项目并生成 CLAUDE.md 初稿" }] },
      "/context [all]": { examples: [{ value: "/context all", description: "查看完整上下文占用及可优化内容" }] },
      "/tasks": { examples: [{ value: "/tasks", description: "查看并管理当前会话中的后台任务" }] },
      "/permissions": { examples: [{ value: "/permissions", description: "管理工具的允许、询问和拒绝规则" }] },
      "/clear [名称]": { examples: [{ value: "/clear", description: "开启新对话并清空上下文，项目记忆仍会保留" }] },
      "/branch [名称]": { examples: [{ value: "/branch experiment-auth", description: "在当前节点创建名为 experiment-auth 的对话分支，独立尝试新方向" }] },
      "/effort [级别|auto]": { examples: [
        { value: "/effort high", description: "把推理强度调到 high，处理复杂重构或难调的 bug 时更细致", sourceUrl: "https://code.claude.com/docs/en/interactive-mode" },
        { value: "/effort low", description: "简单问答或小改动时降到 low，响应更快、更省上下文", sourceUrl: "https://code.claude.com/docs/en/interactive-mode" },
        { value: "/effort auto", description: "交给 Claude 按任务复杂度自动选择推理强度", sourceUrl: "https://code.claude.com/docs/en/interactive-mode" },
      ] },
      "/fast [on|off]": { examples: [
        { value: "/fast on", description: "为支持的 Opus 模型开启低延迟响应；速度更快，但 token 单价更高，能力与质量不变", sourceUrl: "https://code.claude.com/docs/en/fast-mode" },
        { value: "/fast off", description: "关闭低延迟模式，恢复标准响应速度和标准 token 价格", sourceUrl: "https://code.claude.com/docs/en/fast-mode" },
      ] },
      "/goal [条件|clear]": { examples: [
        { value: "/goal 通过所有单元测试再停止", description: "设定一个跨多轮持续追踪的目标，直到条件满足", sourceUrl: "https://code.claude.com/docs/en/interactive-mode" },
        { value: "/goal clear", description: "清除当前目标，停止跨轮追踪", sourceUrl: "https://code.claude.com/docs/en/interactive-mode" },
      ] },
    },
    "codex": {
      "/model": { examples: [{ value: "/model", description: "打开当前会话的模型与推理强度选择器" }] },
      "/plan [提示]": { examples: [{ value: "/plan 为缓存模块设计迁移方案", description: "携带初始目标进入只读计划模式" }] },
      "/review": { examples: [{ value: "/review", description: "审查当前工作区改动并指出正确性和测试问题" }] },
      "/resume": { examples: [{ value: "/resume", description: "从已保存的会话列表中选择并恢复" }] },
      'codex exec "任务"（别名 codex e）': { examples: [{ value: 'codex exec "运行测试并解释失败原因"', description: "非交互执行一次任务，适合脚本或 CI 使用" }] },
      "codex exec --json": { examples: [{ value: 'codex exec --json "检查依赖安全问题"', description: "以 JSON 事件流输出执行过程，便于程序处理" }] },
      "@（前缀）": { examples: [{ value: "@src/auth.ts 检查这个文件的权限处理", description: "搜索并把工作区文件加入当前提示词" }] },
      "!（前缀）": { examples: [{ value: "!git diff --stat", description: "在当前审批与沙盒规则下执行本地命令" }] },
      "/init": { examples: [{ value: "/init", description: "在当前目录生成项目级 AGENTS.md 说明文件" }] },
      "/skills": { examples: [{ value: "/skills", description: "浏览当前可用技能并选择一个使用" }] },
      "--profile, -p <名称>": { examples: [{ value: "codex --profile work", description: "加载 config.toml 中名为 work 的配置档案后启动" }] },
      "/fast [on|off|status]": { examples: [
        { value: "/fast on", description: "开启当前模型的快速服务层，响应更快（仅部分模型支持）", sourceUrl: "https://developers.openai.com/codex/cli/" },
        { value: "/fast status", description: "查看快速服务层当前是否已启用", sourceUrl: "https://developers.openai.com/codex/cli/" },
        { value: "/fast off", description: "关闭快速服务层，回到标准服务", sourceUrl: "https://developers.openai.com/codex/cli/" },
      ] },
      "/raw [on|off]": { examples: [
        { value: "/raw on", description: "开启原始回滚模式，查看未经渲染的模型输出（同 Alt+R）", sourceUrl: "https://developers.openai.com/codex/cli/" },
        { value: "/raw off", description: "关闭原始模式，恢复正常渲染显示", sourceUrl: "https://developers.openai.com/codex/cli/" },
      ] },
      "codex resume [--last|--all]": { examples: [
        { value: "codex resume", description: "打开会话选择器，从当前目录的历史会话中挑一个恢复", sourceUrl: "https://developers.openai.com/codex/cli/" },
        { value: "codex resume --last", description: "直接恢复最近一次会话，跳过选择器", sourceUrl: "https://developers.openai.com/codex/cli/" },
        { value: "codex resume --all", description: "跨所有目录搜索历史会话后再选择恢复", sourceUrl: "https://developers.openai.com/codex/cli/" },
      ] },
    },
    "cursor": {
      "Cmd+I": { examples: [{ value: "选中要修改的代码后按 Cmd/Ctrl+I，输入“提取为可复用函数”", description: "让 Agent 基于当前上下文直接修改代码", copyable: false }] },
      "Cmd+L": { examples: [{ value: "按 Cmd/Ctrl+L 后询问“这个函数为什么会重复请求？”", description: "在 AI Chat 中分析当前代码", copyable: false }] },
      "Cmd+K\u0000编辑器": { examples: [{ value: "选中一段代码，按 Cmd/Ctrl+K，输入“增加参数校验”", description: "对选中代码进行行内 AI 编辑", copyable: false }] },
      "Cmd+K\u0000终端": { examples: [{ value: "在终端按 Cmd/Ctrl+K，输入“查找占用 3000 端口的进程”", description: "根据自然语言生成终端命令", copyable: false }] },
      "Cmd+Shift+L": { examples: [{ value: "选中关键代码后按 Cmd/Ctrl+Shift+L，再到 Chat 中提问", description: "把选中代码加入 AI 对话上下文", copyable: false }] },
      "Cmd+Enter\u0000Chat/Composer": { examples: [{ value: "输入问题后按 Cmd/Ctrl+Enter", description: "提交问题并搜索整个代码库作为上下文", copyable: false }] },
      "Tab\u0000Cursor Tab": { examples: [{ value: "出现灰色代码补全时按 Tab", description: "接受当前整行或整块 Cursor Tab 建议", copyable: false }] },
      "Cmd+Shift+P": { examples: [{ value: "按 Cmd/Ctrl+Shift+P，输入命令名称", description: "打开命令面板并执行编辑器动作", copyable: false }] },
      "@Files\u0000Chat/Composer": { examples: [{ value: "@Files src/api.ts", description: "在 Chat 或 Composer 中引用指定文件", copyable: false }] },
      "@Codebase\u0000Chat/Composer": { examples: [{ value: "@Codebase 登录状态在哪里保存？", description: "让 AI 在整个代码库中搜索相关实现", copyable: false }] },
    },
    "gemini-cli": {
      "/compress": { examples: [{ value: "/compress", description: "压缩当前对话上下文，适合长会话继续工作" }] },
      "/model [manage|set]": { examples: [{ value: "/model set", description: "进入模型设置流程并选择当前使用的模型" }] },
      "/resume": { examples: [{ value: "/resume", description: "浏览并恢复之前保存的会话" }] },
      "/memory [show|refresh|list]": { examples: [{ value: "/memory show", description: "查看当前从 GEMINI.md 加载的记忆内容" }] },
      "@路径": { examples: [{ value: "@src/auth.ts 解释登录流程", description: "把指定文件内容加入当前提示词" }] },
      "!命令": { examples: [{ value: "!git status", description: "执行本地 shell 命令并显示结果" }] },
      "/help（别名/?）": { examples: [{ value: "/help", description: "显示当前版本支持的命令和快捷键" }] },
      "/settings": { examples: [{ value: "/settings", description: "打开带校验和说明的设置编辑器" }] },
      "/stats [session|model|tools]": { examples: [{ value: "/stats model", description: "查看当前会话按模型统计的用量信息" }] },
      "/tools [desc|nodesc]": { examples: [{ value: "/tools desc", description: "列出可用工具并显示完整描述" }] },
      "/agents [list|reload|enable|disable|config]": { examples: [
        { value: "/agents list", description: "列出当前可用的本地与远程子代理", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/agents enable", description: "启用某个子代理，使其参与任务", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/agents config", description: "查看或调整子代理的配置", sourceUrl: "https://geminicli.com/docs/" },
      ] },
      "/commands [list|reload]": { examples: [
        { value: "/commands list", description: "列出从 .toml 文件加载的自定义命令", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/commands reload", description: "改动 .toml 后重新加载自定义命令，无需重启", sourceUrl: "https://geminicli.com/docs/" },
      ] },
      "/extensions [install|list|update|...]": { examples: [
        { value: "/extensions list", description: "列出已安装的扩展及其启用状态", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/extensions install", description: "安装一个新扩展", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/extensions update", description: "把已安装扩展更新到最新版本", sourceUrl: "https://geminicli.com/docs/" },
      ] },
      "/hooks [enable|disable|list]": { examples: [
        { value: "/hooks list", description: "列出已注册的生命周期事件钩子", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/hooks enable", description: "启用钩子，让它在对应事件时触发", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/hooks disable", description: "临时停用钩子，但保留其配置", sourceUrl: "https://geminicli.com/docs/" },
      ] },
      "/ide [enable|disable|install|status]": { examples: [
        { value: "/ide status", description: "查看当前 IDE 集成是否已连接", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/ide install", description: "安装 IDE 伴随插件以启用深度集成", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/ide enable", description: "启用 IDE 集成，共享编辑器上下文", sourceUrl: "https://geminicli.com/docs/" },
      ] },
      "/mcp [list|auth|reload|schema]": { examples: [
        { value: "/mcp list", description: "列出已配置的 MCP 服务器及连接状态", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/mcp auth", description: "对需要 OAuth 的 MCP 服务器发起认证", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/mcp reload", description: "修改配置后重新加载 MCP 服务器", sourceUrl: "https://geminicli.com/docs/" },
      ] },
      "/skills [enable|disable|list|reload]": { examples: [
        { value: "/skills list", description: "列出可用的 Agent Skills", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/skills enable", description: "启用某个技能，按需提供专业能力", sourceUrl: "https://geminicli.com/docs/" },
        { value: "/skills reload", description: "改动技能定义后重新加载", sourceUrl: "https://geminicli.com/docs/" },
      ] },
    },
    "git": {
      "clone": { examples: [{ value: "git clone https://github.com/example/project.git", description: "把远程仓库克隆到当前目录" }] },
      "add": { examples: [{ value: "git add src/app.js", description: "把指定文件的改动加入暂存区" }] },
      "commit -m\u0000commit": { examples: [{ value: 'git commit -m "fix: handle empty input"', description: "使用一条提交说明创建提交" }] },
      "reset --soft HEAD~1\u0000reset": { examples: [{ value: "git reset --soft HEAD~1", description: "撤销最近一次提交，但保留改动在暂存区" }] },
      "switch -c\u0000switch": { examples: [{ value: "git switch -c feature/search", description: "创建并切换到 feature/search 分支" }] },
      "push --force-with-lease\u0000push": { examples: [{ value: "git push --force-with-lease origin feature/search", description: "在远端分支未被他人更新时安全地强制推送", warning: "会重写远端历史，推送前确认分支和协作状态" }] },
      "status -s\u0000status": { examples: [{ value: "git status -s", description: "用两列简短状态码查看工作区和暂存区改动" }] },
      "diff --staged\u0000diff": { examples: [{ value: "git diff --staged", description: "查看已经加入暂存区、即将提交的改动" }] },
      "commit --amend\u0000commit": { examples: [{ value: "git commit --amend", description: "修改最近一次提交的内容或提交说明", warning: "已推送的提交修改后会改变提交历史" }] },
      "stash pop\u0000stash": { examples: [{ value: "git stash pop", description: "恢复最近一次暂存的工作区改动并删除该 stash" }] },
      "init": { examples: [{ value: "git init", description: "在当前目录创建一个新的 Git 仓库，开始版本管理", sourceUrl: "https://git-scm.com/docs/git-init" }] },
      "status": { examples: [{ value: "git status", description: "查看哪些文件被修改、已暂存或未跟踪——最常用的状态总览", sourceUrl: "https://git-scm.com/docs/git-status" }] },
      "diff": { examples: [{ value: "git diff", description: "查看工作区里尚未暂存的改动", sourceUrl: "https://git-scm.com/docs/git-diff" }] },
      "log --oneline\u0000log": { examples: [{ value: "git log --oneline", description: "用一行一条的紧凑格式快速浏览提交历史", sourceUrl: "https://git-scm.com/docs/git-log" }] },
      "log --graph\u0000log": { examples: [{ value: "git log --oneline --graph --all", description: "用 ASCII 图形看清分支分叉与合并的走向", sourceUrl: "https://git-scm.com/docs/git-log" }] },
      "branch": { examples: [
        { value: "git branch", description: "列出本地分支，当前分支前带 * 标记", sourceUrl: "https://git-scm.com/docs/git-branch" },
        { value: "git branch feature/login", description: "基于当前提交创建新分支，但不切换过去", sourceUrl: "https://git-scm.com/docs/git-branch" },
      ] },
      "checkout -b\u0000checkout": { examples: [{ value: "git checkout -b feature/login", description: "创建 feature/login 分支并立即切换过去", sourceUrl: "https://git-scm.com/docs/git-checkout" }] },
      "merge": { examples: [{ value: "git merge feature/login", description: "把 feature/login 的提交合并进当前分支", sourceUrl: "https://git-scm.com/docs/git-merge" }] },
      "rebase -i\u0000rebase": { examples: [{ value: "git rebase -i HEAD~3", description: "交互式整理最近 3 个提交：合并、改信息或调顺序", warning: "会重写提交历史，已推送的提交需谨慎", sourceUrl: "https://git-scm.com/docs/git-rebase" }] },
      "pull": { examples: [{ value: "git pull", description: "从远程拉取最新提交并合并到当前分支", sourceUrl: "https://git-scm.com/docs/git-pull" }] },
      "push -u\u0000push": { examples: [{ value: "git push -u origin feature/login", description: "首次推送新分支并建立上游跟踪，之后可直接 git push", sourceUrl: "https://git-scm.com/docs/git-push" }] },
      "stash": { examples: [
        { value: "git stash", description: "把当前未提交的改动临时收起，回到干净的工作区", sourceUrl: "https://git-scm.com/docs/git-stash" },
        { value: "git stash push -m \"调试登录\"", description: "收起改动并加一句备注，便于以后辨认", sourceUrl: "https://git-scm.com/docs/git-stash" },
      ] },
      "reset --hard\u0000reset": { examples: [{ value: "git reset --hard HEAD", description: "丢弃所有未提交改动，把工作区强制还原到上次提交", warning: "未提交的改动会永久丢失，执行前务必确认", sourceUrl: "https://git-scm.com/docs/git-reset" }] },
      "cherry-pick": { examples: [{ value: "git cherry-pick abc1234", description: "把指定提交的改动单独摘取到当前分支", sourceUrl: "https://git-scm.com/docs/git-cherry-pick" }] },
    },
    "idea": {
      "Double Shift": { examples: [{ value: "连续按两次 Shift，输入类名、文件名或动作名称", description: "从一个入口搜索整个项目和 IDE 功能", copyable: false }] },
      "Cmd+Shift+A": { examples: [{ value: "按 Cmd+Shift+A（Win/Linux 为 Ctrl+Shift+A），输入“Reformat Code”", description: "搜索并执行 IDE 动作", copyable: false }] },
      "Cmd+B": { examples: [{ value: "把光标放在方法调用上，按 Cmd/Ctrl+B", description: "跳转到方法或变量的声明位置", copyable: false }] },
      "Alt+F7": { examples: [{ value: "把光标放在符号上按 Alt+F7", description: "查找该符号在整个项目中的使用位置", copyable: false }] },
      "Shift+F6": { examples: [{ value: "选中变量或方法名后按 Shift+F6，输入新名称", description: "安全重命名并同步更新所有引用", copyable: false }] },
      "Cmd+Alt+L": { examples: [{ value: "选中代码后按 Cmd+Alt+L（Win/Linux 为 Ctrl+Alt+L）", description: "按项目代码风格格式化选区", copyable: false }] },
      "Alt+Enter": { examples: [{ value: "把光标放在报错位置，按 Alt+Enter", description: "查看可用的导入、修复和代码转换建议", copyable: false }] },
      "Cmd+O": { examples: [{ value: "按 Cmd+O（Win/Linux 为 Ctrl+N），输入类名", description: "按名称快速跳转到类", copyable: false }] },
      "Cmd+F": { examples: [{ value: "按 Cmd/Ctrl+F，输入要查找的文本", description: "在当前文件中查找匹配内容", copyable: false }] },
      "Cmd+Shift+F": { examples: [{ value: "按 Cmd+Shift+F（Win/Linux 为 Ctrl+Shift+F），输入关键词", description: "在整个项目中查找字符串", copyable: false }] },
    },
    "linux": {
      "rm -rf": { examples: [{ value: "rm -rf ./build-temp", description: "递归删除示例临时目录且不再确认", warning: "不可恢复；执行前先用 ls 检查目标路径" }] },
      "grep -r": { examples: [{ value: "grep -r \"TODO\" ./src", description: "递归查找 src 目录中包含 TODO 的行" }] },
      "find . -name": { examples: [{ value: "find . -name \"*.log\"", description: "从当前目录递归查找所有 .log 文件" }] },
      "tar -xzf": { examples: [{ value: "tar -xzf archive.tar.gz", description: "把 gzip 压缩的 tar 归档解压到当前目录" }] },
      "sed": {
        keywords: ["替换", "取代", "文本替换", "批量替换", "正则替换"],
        examples: [
          { value: "sed 's/旧文本/新文本/g' file.txt", description: "预览把每行所有“旧文本”替换为“新文本”的结果" },
          {
            value: "sed -i 's/旧文本/新文本/g' file.txt",
            description: "直接修改文件中的匹配文本",
            warning: "先运行不带 -i 的命令预览结果，并备份重要文件",
            platformValues: {
              mac: "sed -i '' 's/旧文本/新文本/g' file.txt",
              linux: "sed -i 's/旧文本/新文本/g' file.txt",
            },
          },
        ],
      },
      "awk": { examples: [{ value: "awk '{print $1}' access.log", description: "输出 access.log 每一行的第一列" }] },
      "tail -f": { examples: [{ value: "tail -f app.log", description: "持续显示 app.log 新追加的日志内容" }] },
      "chmod +x": { examples: [{ value: "chmod +x scripts/deploy.sh", description: "为部署脚本添加可执行权限", warning: "会修改文件权限，请确认目标脚本可信且路径正确" }] },
      "ps aux": { examples: [{ value: "ps aux | grep node", description: "列出进程并筛选包含 node 的进程" }] },
      "curl": { examples: [{ value: "curl -i https://example.com/health", description: "请求健康检查接口并显示响应头" }] },
      "ls -la": { examples: [{ value: "ls -la", description: "长格式列出当前目录所有文件（含隐藏文件），查看权限、大小和修改时间" }] },
      "cd": { examples: [{ value: "cd ~/projects/app", description: "切换当前工作目录到指定路径" }] },
      "cp -r": { examples: [{ value: "cp -r src-dir backup-dir", description: "递归复制整个目录及其内容到新位置" }] },
      "mv": { examples: [{ value: "mv old.txt new.txt", description: "重命名文件，或把文件移动到别的目录" }] },
      "rm": { examples: [{ value: "rm temp.log", description: "删除指定文件", warning: "删除后不可恢复，执行前确认文件路径" }] },
      "cat": { examples: [{ value: "cat README.md", description: "把文件内容一次性输出到终端" }] },
      "less": { examples: [{ value: "less app.log", description: "分页浏览大文件，支持上下翻页和 / 搜索" }] },
      "tail": { examples: [{ value: "tail -n 50 app.log", description: "查看文件末尾若干行，常用于看最新日志" }] },
      "head": { examples: [{ value: "head -n 20 README.md", description: "查看文件开头若干行" }] },
      "chmod": { examples: [{ value: "chmod 644 notes.txt", description: "设置文件权限（644 = 所有者读写、其他人只读）", warning: "会改变文件访问权限，确认数值与目标文件正确" }] },
      "find": { examples: [{ value: "find . -name \"*.log\"", description: "从当前目录递归查找匹配名字的文件" }] },
      "df -h": { examples: [{ value: "df -h", description: "以人类可读单位查看各磁盘分区的空间使用情况" }] },
      "du -sh": { examples: [{ value: "du -sh ./node_modules", description: "汇总查看某个目录占用的磁盘空间" }] },
      "tar": { examples: [{ value: "tar -czf backup.tar.gz ./src", description: "把目录打包成 .tar.gz 压缩归档" }] },
      "ssh": { examples: [{ value: "ssh user@example.com", description: "登录到远程主机的命令行" }] },
    },
    "openclaw": {
      "/new [model]": { examples: [{ value: "/new", description: "归档当前会话并开始一个全新会话" }] },
      "/compact [instructions]": { examples: [{ value: "/compact 保留部署步骤和未解决问题", description: "按指定重点压缩当前会话上下文" }] },
      "/model [name|#|status]": { examples: [{ value: "/model status", description: "查看当前会话正在使用的模型" }] },
      "/context [list|detail|map|json]": { examples: [{ value: "/context detail", description: "查看当前上下文的详细组成" }] },
      "/usage off|tokens|full|cost": { examples: [{ value: "/usage cost", description: "在回复底部显示费用信息" }] },
      "/restart": { examples: [{ value: "/restart", description: "重启 OpenClaw 服务", warning: "会短暂中断当前服务连接" }] },
      "/status": { examples: [{ value: "/status", description: "查看 Gateway 运行时间、插件健康和当前状态" }] },
      "/bash <command>": { examples: [{ value: "/bash git status", description: "在宿主机执行 shell 命令" }] },
      "openclaw doctor": { examples: [{ value: "openclaw doctor", description: "检查配置、运行迁移并修复可识别问题", warning: "可能修改本地配置，执行前建议备份" }] },
      "openclaw gateway status": { examples: [{ value: "openclaw gateway status", description: "检查 Gateway 守护进程和 RPC 是否可达" }] },
      "/name <title>": { examples: [{ value: "/name 登录重构", description: "把当前会话命名为「登录重构」，便于以后检索" }] },
      "/skill <name> [input]": { examples: [{ value: "/skill commit-helper 生成本次提交信息", description: "按名称调用 commit-helper 技能并传入输入" }] },
      "openclaw config set <path> <value>": { examples: [{ value: "openclaw config set model.default gpt-5.5", description: "把 openclaw.json 中 model.default 设为 gpt-5.5" }] },
      "openclaw config get <path>": { examples: [{ value: "openclaw config get model.default", description: "按路径读取 openclaw.json 中 model.default 的当前值", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" }] },
      "/fast [on|off|default]": { examples: [
        { value: "/fast on", description: "开启快速模式，provider 映射为高优先级推理", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
        { value: "/fast default", description: "恢复到 provider 的默认推理优先级", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
        { value: "/fast off", description: "关闭快速模式", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
      ] },
      "/tools [compact|verbose]": { examples: [
        { value: "/tools compact", description: "以精简列表显示当前代理可用的工具", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
        { value: "/tools verbose", description: "显示每个工具的完整描述与参数", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
      ] },
      "/goal [status|start|pause|resume|complete|block|clear]": { examples: [
        { value: "/goal start 完成登录页重构并补测试", description: "为当前会话设定一个持久追踪的目标", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
        { value: "/goal status", description: "查看当前目标及完成进度", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
        { value: "/goal clear", description: "清除目标，停止追踪", sourceUrl: "https://docs.openclaw.ai/tools/slash-commands" },
      ] },
    },
    "opencode": {
      "/new": { examples: [{ value: "/new", description: "清空当前上下文并开始新会话" }] },
      "/compact": { examples: [{ value: "/compact", description: "压缩当前会话上下文以释放 token" }] },
      "/undo": { examples: [{ value: "/undo", description: "撤销最后一条消息以及相关文件改动", warning: "需要在 Git 仓库中使用" }] },
      "/sessions": { examples: [{ value: "/sessions", description: "列出历史会话并切换到其中一个" }] },
      'opencode run "[prompt]"': { examples: [{ value: 'opencode run "检查测试失败的原因"', description: "非交互执行一次任务并输出结果" }] },
      "opencode run -m [provider/model]": { examples: [{ value: 'opencode run -m anthropic/claude-sonnet "总结改动"', description: "指定 provider/model 执行一次任务" }] },
      "/models": { examples: [{ value: "/models", description: "列出所有已配置提供商的可用模型" }] },
      "/editor": { examples: [{ value: "/editor", description: "使用系统 EDITOR 编写较长的提示词" }] },
      "/export": { examples: [{ value: "/export", description: "将当前会话导出为 Markdown 并用编辑器打开" }] },
      "opencode stats": { examples: [{ value: "opencode stats --days 7", description: "查看最近 7 天的 token 用量和费用统计" }] },
      "opencode mcp auth [name]": { examples: [{ value: "opencode mcp auth github", description: "对名为 github 的 OAuth MCP 服务器发起认证" }] },
      "opencode plugin [module]": { examples: [{ value: "opencode plugin @opencode/git", description: "安装 @opencode/git 插件并更新配置" }] },
      "--agent [name]": { examples: [{ value: "opencode --agent build", description: "以 build agent 启动一次会话" }] },
    },
    "typora": {
      "Cmd+1": { examples: [{ value: "# 一级标题", description: "Markdown 一级标题的输入形式" }] },
      "Cmd+B": { examples: [{ value: "**重要内容**", description: "Markdown 加粗文本的输入形式" }] },
      "Cmd+K": { examples: [{ value: "[项目主页](https://example.com)", description: "Markdown 超链接的输入形式" }] },
      "Cmd+Option+T": { examples: [{ value: "| 名称 | 状态 |\n| --- | --- |\n| 示例 | 完成 |", description: "一个两列表格的 Markdown 输入" }] },
      "Cmd+Option+C": { examples: [{ value: "```js\nconsole.log('hello');\n```", description: "带语言标记的 JavaScript 代码块" }] },
      "Cmd+/": { examples: [{ value: "按 Cmd+/（Win/Linux 为 Ctrl+/）", description: "在所见即所得和 Markdown 源代码模式之间切换", copyable: false }] },
      "Cmd+Option+U": { examples: [{ value: "- 第一项\n- 第二项", description: "Markdown 无序列表的输入形式" }] },
      "Cmd+Shift+`": { examples: [{ value: "`npm test`", description: "Markdown 行内代码的输入形式" }] },
      "Cmd+Ctrl+I": { examples: [{ value: "![替代文字](./images/example.png)", description: "Markdown 图片的输入形式" }] },
      "Cmd+Shift+V": { examples: [{ value: "按 Cmd+Shift+V（Win/Linux 为 Ctrl+Shift+V）", description: "粘贴为纯文本，避免带入原格式", copyable: false }] },
    },
    "vs-code": {
      "Cmd+Shift+P": { examples: [{ value: "按 Cmd+Shift+P（Win/Linux 为 Ctrl+Shift+P），输入“Format Document”", description: "搜索并执行编辑器命令", copyable: false }] },
      "Cmd+P": { examples: [{ value: "按 Cmd/Ctrl+P，输入文件名的一部分", description: "按名称快速打开项目文件", copyable: false }] },
      "Option+Down": { examples: [{ value: "把光标放在一行上，按 Option+Down（Win/Linux 为 Alt+Down）", description: "把当前行向下移动", copyable: false }] },
      "Shift+Option+Down": { examples: [{ value: "按 Shift+Option+Down（Win/Linux 为 Shift+Alt+Down）", description: "复制当前行并插入到下一行", copyable: false }] },
      "Cmd+D": { examples: [{ value: "选中一个变量名后连续按 Cmd/Ctrl+D", description: "逐个选中后续同名文本，便于同时编辑", copyable: false }] },
      "Shift+Cmd+F": { examples: [{ value: "按 Shift+Cmd+F（Win/Linux 为 Ctrl+Shift+F），输入关键词", description: "在整个工作区跨文件搜索", copyable: false }] },
      "Cmd+K Cmd+S": { examples: [{ value: "按 Cmd+K 后再按 Cmd+S（Win/Linux 为 Ctrl+K Ctrl+S）", description: "打开键盘快捷方式设置页面", copyable: false }] },
      "Shift+Cmd+K": { examples: [{ value: "把光标放在要删除的行，按 Shift+Cmd+K（Win/Linux 为 Ctrl+Shift+K）", description: "删除当前整行", copyable: false }] },
      "Cmd+F": { examples: [{ value: "按 Cmd/Ctrl+F，输入要查找的文本", description: "在当前文件中查找匹配内容", copyable: false }] },
      "Option+Cmd+F": { examples: [{ value: "按 Option+Cmd+F（Win/Linux 为 Ctrl+H），填写查找和替换内容", description: "在当前文件中执行查找替换", copyable: false }] },
    },
  };

  const enrichmentModules = globalScope.CHEATSHEET_ENRICHMENT_MODULES || {};

  globalScope.CHEATSHEET_BUILD_FULL_ENRICHMENTS = function buildFullEnrichments(data) {
    const legacyWarnings = [];
    Object.entries(data || {}).forEach(([toolId, tool]) => {
      const enrichments = globalScope.CHEATSHEET_ENRICHMENTS[toolId] || {};
      const byLookup = new Map(Object.entries(enrichments));
      const byStableId = new Map(Object.entries(enrichmentModules[toolId] || {}));
      tool.items.forEach((item) => {
        const lookup = `${item.cmd}\0${item.context || ""}`;
        const legacyLookup = item.cmd;
        const stableLookup = item.id ? `id:${item.id}` : "";
        const stableEnrichment = byStableId.get(stableLookup);
        const exactLegacyEnrichment = byLookup.get(lookup);
        const commandLegacyEnrichment = byLookup.get(legacyLookup);
        const existing = stableEnrichment
          || exactLegacyEnrichment
          || commandLegacyEnrichment
          || {};
        if (item.id && !stableEnrichment && (exactLegacyEnrichment || commandLegacyEnrichment)) {
          legacyWarnings.push(`${toolId}:${item.id} still uses cmd/context enrichment lookup`);
        }
        const examples = (existing.examples || item.examples || [deriveExample(toolId, tool, item)])
          .map(normalizeCuratedExample);
        const keywords = existing.keywords || item.keywords || deriveKeywords(item);
        byLookup.set(lookup, { ...existing, keywords, examples });
        if (lookup !== legacyLookup && byLookup.get(legacyLookup) === existing) byLookup.delete(legacyLookup);
        if (stableLookup) byStableId.delete(stableLookup);
      });
      if (byStableId.size) {
        throw new Error(`${toolId}: enrichment references unknown item ids: ${[...byStableId.keys()].join(", ")}`);
      }
      globalScope.CHEATSHEET_ENRICHMENTS[toolId] = Object.fromEntries(byLookup);
    });
    globalScope.CHEATSHEET_ENRICHMENT_WARNINGS = legacyWarnings;
    return globalScope.CHEATSHEET_ENRICHMENTS;
  };

  globalScope.CHEATSHEET_ENRICHMENT_TEST_API = { triggerHit, classifyRisk };
}(typeof window !== "undefined" ? window : globalThis));
