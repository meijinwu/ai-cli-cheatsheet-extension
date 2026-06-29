"use strict";

(function initPopupRender(globalScope) {
  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function highlightHtml(core, value, query) {
    const text = String(value ?? "");
    const tokens = core.splitQuery(query).flat().filter((term) => term.length >= 2);
    if (!tokens.length) return escapeHtml(text);
    const escaped = [...new Set(tokens)]
      .sort((a, b) => b.length - a.length)
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    return text.split(regex).map((part, index) =>
      index % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)
    ).join("");
  }

  function normalizedSources(meta) {
    if (Array.isArray(meta.sources) && meta.sources.length) return meta.sources;
    if (!meta.sourceUrl) return [];
    const tier = meta.sourceTier || "official";
    return [{
      id: "primary",
      title: meta.source,
      url: meta.sourceUrl,
      kind: tier === "official" ? "official-doc" : tier === "quasi-official" ? "authoritative-reference" : "community",
      maintainer: new URL(meta.sourceUrl).hostname,
      evidenceTier: tier === "official" ? "first-party" : tier === "quasi-official" ? "authoritative-community" : "community",
      lastVerifiedAt: meta.updatedAt,
    }];
  }

  function evidenceLabel(tier, kind = "") {
    if (kind === "local-help") return "本机帮助确认";
    if (kind === "official-repository") return "官方仓库确认";
    if (tier === "first-party") return "官方确认";
    if (tier === "authoritative-community") return "权威社区补充";
    if (tier === "community") return "社区参考";
    return "未独立核验";
  }

  function sourceTierLabel(sourceTier) {
    if (sourceTier === "quasi-official") return "类官方";
    if (sourceTier === "community") return "社区";
    return "官方";
  }

  function exampleProvenanceLabel(example) {
    if (example.authorship === "official" && example.adaptation === "verbatim") return "官方原例";
    if (example.evidenceTier === "first-party") return "基于官方资料改写";
    if (example.evidenceTier === "authoritative-community") return "权威社区补充";
    if (example.authorship === "editorial") return "编辑整理场景";
    return "自动生成";
  }

  function exampleEvidenceUrl(example, sources) {
    if (example.sourceUrl) return example.sourceUrl;
    const sourceId = (example.sourceIds || [])[0];
    return sources.find((source) => source.id === sourceId)?.url || "";
  }

  const EVIDENCE_TOOLTIP = {
    verified: "命令的存在性与语义都有可核验来源支撑",
    partial: "仅其中一项声明（存在性或语义）有来源支撑",
    unverified: "暂无可复核的独立来源",
  };

  function evidenceTooltip(status) {
    return EVIDENCE_TOOLTIP[status] || EVIDENCE_TOOLTIP.unverified;
  }

  function tierTooltip(tier) {
    if (tier === "quasi-official") return "来源为类官方/权威社区资料，而非官方一手文档";
    if (tier === "community") return "来源为社区整理，可靠性相对较低";
    return "来源为官方一手文档";
  }

  function exampleProvenanceTooltip(example) {
    const tier = {
      "first-party": "有官方一手出处",
      "authoritative-community": "有权威社区出处",
      community: "社区出处",
      none: "无独立出处",
    }[example.evidenceTier] || "无独立出处";
    return `${exampleProvenanceLabel(example)}：${tier}`;
  }

  function itemEvidence(entry) {
    if (entry.item.evidenceStatus === "verified") return "已核验";
    if (entry.item.evidenceStatus === "partial") return "部分核验";
    return "未核验";
  }

  function placeholderHtml(html) {
    return html.replace(/(&lt;[^<]{1,48}?&gt;|\$\{?[A-Z_][A-Z0-9_]{1,}\}?|\b[A-Z_][A-Z0-9_]{2,}\b)/g, (match) =>
      `<span class="placeholder">${match}</span>`
    );
  }

  function commandExampleHtml(core, value, query) {
    return placeholderHtml(highlightHtml(core, value, query));
  }

  function commandEvidenceHtml(item, sources) {
    const refs = item.evidenceRefs || [];
    if (!refs.length) return `<div class="command-evidence">命令证据：未提供可复核定位</div>`;
    return `<div class="command-evidence">命令证据：${refs.map((ref) => {
      const source = sources.find((candidate) => candidate.id === ref.sourceId);
      const claims = ref.claims.map((claim) => ({
        existence: "存在性", semantics: "语义", platform: "平台", example: "案例",
      })[claim] || claim).join("、");
      const label = `${source?.title || ref.sourceId} · ${claims} · ${ref.locator}`;
      return source?.url
        ? `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
        : escapeHtml(label);
    }).join("<br>")}</div>`;
  }

  function renderFilters(data, helpers, state) {
    const quickItems = [
      ["all", "全部"],
      ["recent", "🕘 最近"],
      ["favourites", "⭐ 收藏"],
      ...helpers.visibleToolIds(data, state.enabledTools).map((id) => [id, data[id].meta.name]),
    ];
    const quickHtml = quickItems.map(([id, label]) =>
      `<button class="chip ${state.activeTool === id ? "active" : ""}" data-tool="${id}">${escapeHtml(label)}</button>`
    ).join("");
    const categoryHtml = Object.entries(helpers.CAT_LABEL).map(([id, label]) =>
      `<button class="chip ${state.activeCat === id ? "active" : ""}" data-cat="${id}">${label}</button>`
    ).join("") + `<button id="clearFilters" class="chip filter-clear">清除筛选</button>`;
    const shellHtml = state.activeTool === "shell" && data.shell
      ? [
        `<button class="chip ${state.activeShellFilter ? "" : "active"}" data-shell-filter="">全部 Shell</button>`,
        ...helpers.SHELL_FILTERS.map((filter) =>
          `<button class="chip ${state.activeShellFilter === filter.key ? "active" : ""}" data-shell-filter="${escapeHtml(filter.key)}">${escapeHtml(filter.label)}</button>`
        ),
      ].join("")
      : "";
    return { quickHtml, categoryHtml, shellHtml };
  }

  function renderRow(entry, query, ctx, includeBadge = false) {
    const { data, core, platform, expandedExamples, favourites, helpers } = ctx;
    const tool = data[entry.toolId];
    const sources = normalizedSources(tool.meta);
    const key = `${entry.toolId}::${entry.itemId}`;
    const examples = (entry.item.examples || []).map((example, index) => ({
      ...example,
      index,
      platformInfo: core.getPlatformExample(example, platform),
    })).filter((example) => !example.platformInfo.unsupported);
    const examplesOpen = expandedExamples.has(key);
    const commandRisk = core.classifyCommandRisk(entry.displayCmd, examples);
    const note = entry.platformInfo.unsupported ? "当前平台不可用" : entry.platformInfo.usedFallback ? "通用写法" : "";
    const matchReason = query.trim() && entry.matchReason
      ? `<span class="match-reason">${entry.matchReason.field === "examples" ? "匹配用法" : `主要匹配${escapeHtml(entry.matchReason.label)}`}：${highlightHtml(core, entry.matchReason.term, query)}</span>`
      : "";
    const summaryExample = examples[0];
    const summary = query.trim() && !examplesOpen && summaryExample
      ? `<span class="example-summary">常用：${highlightHtml(core, summaryExample.platformInfo.value, query)} · ${highlightHtml(core, summaryExample.description, query)}</span>`
      : "";
    const evidenceStatus = entry.item.evidenceStatus || "unverified";
    const tierTag = tool.meta.sourceTier && tool.meta.sourceTier !== "official"
      ? `<span class="trust-tag tier" title="${escapeHtml(tierTooltip(tool.meta.sourceTier))}">${escapeHtml(sourceTierLabel(tool.meta.sourceTier))}</span>`
      : "";
    const tags = [
      note ? `<span class="trust-tag">${escapeHtml(note)}</span>` : "",
      ...helpers.shellTags(entry.item).map((label) => `<span class="trust-tag shell-tag">${escapeHtml(label)}</span>`),
      commandRisk.requiresConfirmation ? `<span class="trust-tag risk" title="${escapeHtml(commandRisk.warning)}">高风险</span>` : "",
      tierTag,
      examplesOpen ? `<span class="trust-tag tier evidence-${escapeHtml(evidenceStatus)}" title="${escapeHtml(evidenceTooltip(evidenceStatus))}">${escapeHtml(itemEvidence(entry))}</span>` : "",
    ].join("");
    const examplesId = `examples-${entry.toolId}-${entry.itemId}`;
    const examplesHtml = examplesOpen ? `<div class="examples">${entry.item.en ? `<div class="en">${highlightHtml(core, entry.item.en, query)}</div>` : ""}${examples.map((example, exampleIndex) => `
    <div class="example">
      ${exampleIndex === 0 ? `<span class="example-badge">推荐用法</span>` : ""}
      <div class="example-value">${commandExampleHtml(core, example.platformInfo.value, query)}</div>
      <div class="example-desc">${highlightHtml(core, example.description, query)}</div>
      ${example.scenario ? `<div class="example-context">场景：${escapeHtml(example.scenario)}</div>` : ""}
      ${example.goal ? `<div class="example-context">目标：${escapeHtml(example.goal)}</div>` : ""}
      ${example.expected ? `<div class="example-context">结果：${escapeHtml(example.expected)}</div>` : ""}
      ${example.prerequisites ? `<div class="example-context">前提：${escapeHtml(example.prerequisites)}</div>` : ""}
      ${example.caveat ? `<div class="example-context">注意：${escapeHtml(example.caveat)}</div>` : ""}
      <div class="example-source" title="${escapeHtml(exampleProvenanceTooltip(example))}">${escapeHtml(exampleProvenanceLabel(example))}${exampleEvidenceUrl(example, sources) ? ` · <a class="example-doc" href="${escapeHtml(exampleEvidenceUrl(example, sources))}" target="_blank" rel="noopener noreferrer">证据</a>` : ""}</div>
      ${example.warning ? `<div class="example-warning">⚠ ${escapeHtml(example.warning)}</div>` : ""}
      ${example.copyable !== false ? `<button class="act example-copy" data-example="${example.index}" title="复制此用法" aria-label="复制此用法">复制</button>` : ""}
    </div>`).join("")}${commandEvidenceHtml(entry.item, sources)}</div>` : "";
    return `<article class="entry-wrap" data-tool="${entry.toolId}" data-item="${entry.itemId}">
    <div class="row"><button class="row-main" data-copy-command ${entry.platformInfo.unsupported ? "disabled" : ""} aria-label="${entry.platformInfo.unsupported ? "当前平台不可用" : `复制命令 ${escapeHtml(entry.displayCmd)}`}">
    <span class="cmd"><span class="dot" style="background:${escapeHtml(tool.meta.color)}"></span>${highlightHtml(core, entry.displayCmd, query)}
      ${includeBadge ? `<span class="context">${escapeHtml(tool.meta.name)}</span>` : ""}
      ${entry.item.context ? `<span class="context">${escapeHtml(entry.item.context)}</span>` : ""}
      ${tags}
    </span>
    <span class="zh">${highlightHtml(core, entry.item.zh, query)}</span>
    ${matchReason}${summary}</button>
    <div class="row-actions"><button class="act copy-btn" data-copy-command ${entry.platformInfo.unsupported ? "disabled" : ""} title="${entry.platformInfo.unsupported ? "当前平台不可用" : "复制命令"}" aria-label="${entry.platformInfo.unsupported ? "当前平台不可用" : "复制命令"}">复制</button><button class="act fav-btn ${favourites.has(key) ? "fav-active" : ""}" title="${favourites.has(key) ? "取消收藏" : "收藏"}" aria-label="${favourites.has(key) ? "取消收藏" : "收藏"}">${favourites.has(key) ? "♥" : "♡"}</button></div>
    </div>
    ${examples.length ? `<button class="usage-toggle" aria-expanded="${examplesOpen}" aria-controls="${examplesId}" data-usage>${examplesOpen ? "收起用法" : `查看用法 ${examples.length}`}</button>` : ""}
    ${examplesOpen ? `<div id="${examplesId}">${examplesHtml}</div>` : ""}
  </article>`;
  }

  function renderManageToolToggles(data, toolIds, state) {
    return toolIds.map((toolId) =>
      `<label class="tool-choice"><input type="checkbox" data-enabled="${toolId}" ${state.enabledTools.has(toolId) ? "checked" : ""}> ${escapeHtml(data[toolId].meta.name)}</label>`
    ).join("");
  }

  // 仅接受 https 链接，避免 javascript: 等协议注入。
  function safeHttpsUrl(value) {
    const url = String(value || "").trim();
    return /^https:\/\//i.test(url) ? url : "";
  }

  function renderRecommendationCategories(result) {
    const chips = result.categories.map((category) =>
      `<button class="chip ${result.activeCategory === category.key ? "active" : ""}" data-recommend-category="${escapeHtml(category.key)}">${escapeHtml(category.label)} ${category.count}</button>`
    ).join("");
    // 分批浏览态（全部 + 非搜索）显示「换一批」；勾「显示已忽略」时并存「全部恢复」。
    // 聚焦态（搜索 / 选具体分类）显示「全部忽略/恢复」。
    if (result.batched) {
      const shuffle = result.batch && result.batch.canShuffle
        ? `<button class="chip filter-clear" data-recommend-shuffle>换一批 ↻</button>`
        : "";
      let restore = "";
      if (result.showDismissed) {
        const restorable = result.groups.flatMap((group) => group.items).filter((item) => item.dismissed).length;
        if (restorable) restore = `<button class="chip filter-clear" data-recommend-bulk="restore">全部恢复 ${restorable}</button>`;
      }
      return chips + shuffle + restore;
    }
    const visible = result.groups.flatMap((group) => group.items);
    let bulk = "";
    if (result.showDismissed) {
      const restorable = visible.filter((item) => item.dismissed).length;
      if (restorable) bulk = `<button class="chip filter-clear" data-recommend-bulk="restore">全部恢复 ${restorable}</button>`;
    } else if (visible.length) {
      bulk = `<button class="chip filter-clear" data-recommend-bulk="dismiss">全部忽略 ${visible.length}</button>`;
    }
    return chips + bulk;
  }

  function recommendCardActions(item, webVerify) {
    if (item.adding) {
      return `<button class="text-btn" disabled>添加中…</button>`;
    }
    const homepage = safeHttpsUrl(item.homepage);
    const learn = homepage
      ? `<a class="text-btn" href="${escapeHtml(homepage)}" target="_blank" rel="noopener noreferrer">了解</a>`
      : "";
    const toggle = item.dismissed
      ? `<button class="text-btn" data-recommend-restore="${escapeHtml(item.tool)}" data-recommend-label="${escapeHtml(item.displayName)}">恢复</button>`
      : `<button class="text-btn" data-recommend-dismiss="${escapeHtml(item.tool)}" data-recommend-label="${escapeHtml(item.displayName)}">忽略</button>`;
    const addLabel = webVerify ? "新增 · 联网" : "新增";
    const add = `<button class="text-btn" data-recommend-tool="${escapeHtml(item.tool)}" data-recommend-name="${escapeHtml(item.displayName)}">${addLabel}</button>`;
    return `${learn}${toggle}${add}`;
  }

  function recommendCard(item, webVerify) {
    return `<div class="recommend-card ${item.dismissed ? "is-dismissed" : ""} ${item.adding ? "is-adding" : ""}">
      <div class="recommend-head">
        <div><div class="recommend-name">${escapeHtml(item.displayName)}${item.source === "ai" ? `<span class="recommend-ai">AI</span>` : ""}</div><div class="recommend-cat">${escapeHtml(item.category)}</div></div>
        <div class="recommend-actions">${recommendCardActions(item, webVerify)}</div>
      </div>
      ${item.explainReasons && item.explainReasons.length
        ? item.explainReasons.map((reason) => `<div class="recommend-related">${escapeHtml(reason)}</div>`).join("")
        : item.relatedTo && item.relatedTo.length ? `<div class="recommend-related">因为你已添加 ${escapeHtml(item.relatedTo.join("、"))}</div>` : ""}
      <div class="meta">${escapeHtml(item.reason)}</div>
      <div class="recommend-tags">${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}${item.preferWeb && !webVerify ? `<span class="recommend-web-hint">建议联网</span>` : ""}</div>
    </div>`;
  }

  function renderRecommendedTools(result) {
    if (!result.totalAvailable) {
      return `<div class="meta">当前平台的常用推荐都已收录。也可以在下方手动输入工具名称。</div>`;
    }
    if (!result.totalVisible) {
      return `<div class="meta">${result.query || result.activeCategory !== "all" ? "当前筛选没有匹配的推荐。" : "当前平台的推荐都已忽略。"}可以调整筛选、显示已忽略项，或在下方手动输入工具名称。</div>`;
    }
    const webVerify = result.webVerify === true;
    if (result.batched && result.batch) {
      return result.batch.items.map((item) => recommendCard(item, webVerify)).join("");
    }
    return result.groups.map((group) => `<section class="recommend-group">
      <div class="recommend-group-title">${escapeHtml(group.label)} <span>${group.items.length}</span></div>
      ${group.items.map((item) => recommendCard(item, webVerify)).join("")}
    </section>`).join("");
  }

  function sourceCard(toolId, data, helpers) {
    const meta = data[toolId].meta;
    const sources = normalizedSources(meta);
    const sourceEntry = (source) => `<div class="source-entry">
    <span>${escapeHtml(evidenceLabel(source.evidenceTier, source.kind))} · ${escapeHtml(source.title || source.id)} · ${escapeHtml(source.maintainer || "维护者未标注")}${source.lastVerifiedAt ? ` · ${escapeHtml(source.lastVerifiedAt)}` : ""}</span>
    ${source.url ? ` <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">打开 ↗</a>` : ""}
  </div>`;
    const primarySources = sources.slice(0, 6);
    const remainingSources = sources.slice(6);
    const references = Array.isArray(meta.references) ? meta.references : [];
    return `<div class="source-card" id="source-${toolId}">
    <div>${escapeHtml(meta.coverage || meta.source)}</div>
    <div>${escapeHtml(helpers.updateStatusLabel(meta))} · 内容核验：${escapeHtml(meta.contentCheckedAt || meta.updatedAt || "未标注")} · 来源检查：${escapeHtml(meta.sourceCheckedAt || "未标注")} · 平台：${escapeHtml((meta.platforms || []).join(" / ") || "未标注")}</div>
    <div class="source-list">${primarySources.map(sourceEntry).join("") || "<div>尚未登记可核验来源</div>"}
      ${remainingSources.length ? `<details><summary>查看其余 ${remainingSources.length} 个来源</summary>${remainingSources.map(sourceEntry).join("")}</details>` : ""}
      ${references.length ? `<details><summary>背景参考 ${references.length} 个（不证明具体命令）</summary>${references.map(sourceEntry).join("")}</details>` : ""}
    </div>
  </div>`;
  }

  // 搜索无结果时，从未收录的推荐池里按查询匹配，给出「添加到速查表」的引导（改动 2）。
  // 与管理面板保持一致：尊重已忽略项、并纳入 AI 现荐。
  function findUninstalledSuggestions(query, ctx, limit = 2) {
    if (!ctx || !ctx.helpers || typeof ctx.helpers.filterRecommendedTools !== "function") return [];
    const result = ctx.helpers.filterRecommendedTools(ctx.data || {}, ctx.platform, {
      query,
      dismissedRecommendations: ctx.dismissedRecommendations,
      extraRecommendations: ctx.aiRecommendations,
    });
    return result.groups.flatMap((group) => group.items).slice(0, limit);
  }

  function renderUninstalledSuggestions(query, ctx) {
    const items = findUninstalledSuggestions(query, ctx);
    if (!items.length) return "";
    const cards = items.map((item) => {
      const homepage = safeHttpsUrl(item.homepage);
      const learn = homepage ? ` <a class="suggest-learn" href="${escapeHtml(homepage)}" target="_blank" rel="noopener noreferrer">了解 ↗</a>` : "";
      return `<div class="suggest-add-item">
        <button class="text-btn primary" data-suggest-add-tool="${escapeHtml(item.tool)}" data-suggest-add-name="${escapeHtml(item.displayName)}">添加 ${escapeHtml(item.displayName)}</button>${learn}
        <div class="suggest-add-reason">${escapeHtml(item.reason || "")}</div>
      </div>`;
    }).join("");
    return `<div class="suggest-add"><div class="suggest-add-title">速查表还没收录，要加进来吗？</div>${cards}</div>`;
  }

  function renderResults(entries, query, state, ctx) {
    if (!entries.length) {
      const hasFilter = Boolean(state.activeCat) || !["all", "recent", "favourites"].includes(state.activeTool);
      const emptyMessage = state.activeTool === "recent"
        ? "还没有最近复制的命令，复制任意命令后会出现在这里"
        : state.activeTool === "favourites"
          ? "还没有收藏的命令，点条目右侧的 ♡ 即可收藏"
          : ctx.core.emptySearchHint(query, { hasFilter });
      const suggestHtml = query.trim() && !hasFilter && state.activeTool !== "recent" && state.activeTool !== "favourites"
        ? renderUninstalledSuggestions(query, ctx)
        : "";
      return suggestHtml + `<div class="empty">${escapeHtml(emptyMessage)}</div>`;
    }

    if (query.trim() || state.activeTool === "recent" || state.activeTool === "favourites") {
      const visible = entries.slice(0, state.searchLimit);
      return visible.map((entry) => renderRow(entry, query, ctx, true)).join("")
        + (entries.length > visible.length ? `<button class="text-btn more-btn" data-more-results>继续显示（剩余 ${entries.length - visible.length} 条）</button>` : "");
    }

    const grouped = new Map();
    entries.forEach((entry) => {
      if (!grouped.has(entry.toolId)) grouped.set(entry.toolId, []);
      grouped.get(entry.toolId).push(entry);
    });
    return [...grouped].map(([toolId, rows]) => {
      const tool = ctx.data[toolId];
      const visible = state.expandedTools.has(toolId) ? rows : rows.slice(0, ctx.helpers.GROUP_INITIAL_LIMIT);
      const more = rows.length > visible.length
        ? `<button class="text-btn more-btn" data-expand="${toolId}">展开剩余 ${rows.length - visible.length} 条</button>`
        : "";
      return `<section><div class="section-title"><span class="badge" style="background:${escapeHtml(tool.meta.color)}">${escapeHtml(tool.meta.name)}</span><span class="count">${rows.length} 条</span><button class="source-toggle" data-source="${toolId}" aria-expanded="false" aria-controls="source-${toolId}">来源与核验状态 ▾</button></div>${sourceCard(toolId, ctx.data, ctx.helpers)}${visible.map((entry) => renderRow(entry, query, ctx)).join("")}${more}</section>`;
    }).join("");
  }

  function countBarHtml(entries, query, state, helpers, core, filterLabel, relaxed) {
    const synonyms = query.trim() ? core.expandedSynonyms(query).slice(0, 4) : [];
    return [
      `共 ${entries.length} 条结果`,
      relaxed ? '<span class="relaxed-note">已放宽为任一关键词匹配</span>' : "",
      filterLabel ? `筛选：${escapeHtml(filterLabel)}` : "",
      synonyms.length ? `同义词：${escapeHtml(synonyms.join("、"))}` : "",
      state.platform === "mac" ? "macOS" : state.platform === "windows" ? "Windows" : "Linux",
    ].filter(Boolean).join(" · ");
  }

  function renderManageTools(data, toolIds, state, helpers, entryIndex) {
    return toolIds.map((toolId) => {
      const meta = data[toolId].meta;
      const canDelete = !meta.builtIn;
      const policy = helpers.updatePolicy(meta);
      const sources = normalizedSources(meta);
      const evidenceCounts = { verified: 0, partial: 0, unverified: 0 };
      data[toolId].items.forEach((item) => {
        evidenceCounts[item.evidenceStatus || "unverified"] += 1;
      });
      const verification = meta.verificationStatus === "web-assisted"
        ? "联网辅助整理"
        : meta.verificationStatus === "model-knowledge"
          ? "模型知识整理"
          : meta.verificationStatus === "manual"
            ? "人工维护"
            : "整理方式未标注";
      const exampleItems = entryIndex.entries
        .filter((entry) => entry.toolId === toolId)
        .map((entry) => entry.item)
        .filter((item) => item.examples?.length);
      const authorshipCounts = { official: 0, editorial: 0, generated: 0 };
      const evidenceCountsForExamples = {
        "first-party": 0,
        "authoritative-community": 0,
        community: 0,
        none: 0,
      };
      exampleItems.forEach((item) => item.examples.forEach((example) => {
        if (authorshipCounts[example.authorship] !== undefined) authorshipCounts[example.authorship] += 1;
        if (evidenceCountsForExamples[example.evidenceTier] !== undefined) {
          evidenceCountsForExamples[example.evidenceTier] += 1;
        }
      }));
      return `<div class="tool-card"><div class="tool-title"><input type="checkbox" data-enabled="${toolId}" ${state.enabledTools.has(toolId) ? "checked" : ""}><label>${escapeHtml(meta.name)}</label></div>
      <div class="meta">${escapeHtml(meta.coverage || meta.source)}<br>来源 ${sources.length} 个 · ${escapeHtml(helpers.updateStatusLabel(meta))} · 数据整理方式：<span class="verify">${escapeHtml(verification)}</span></div>
      <details class="stats-detail"><summary>数据质量明细</summary>
        <div class="meta">条目核验：已核验 ${evidenceCounts.verified} / 部分核验 ${evidenceCounts.partial} / 未核验 ${evidenceCounts.unverified}</div>
        <div class="meta">用法覆盖：${exampleItems.length}/${data[toolId].items.length}</div>
        <div class="meta">案例编写：官方原例 ${authorshipCounts.official} / 编辑整理 ${authorshipCounts.editorial} / 自动生成 ${authorshipCounts.generated}</div>
        <div class="meta">案例证据：第一方 ${evidenceCountsForExamples["first-party"]} / 权威社区 ${evidenceCountsForExamples["authoritative-community"]} / 普通社区 ${evidenceCountsForExamples.community} / 无独立证据 ${evidenceCountsForExamples.none}</div>
      </details>
      ${policy === "manual-only" ? "" : `<div class="tool-actions"><button class="text-btn" data-update="${toolId}">${escapeHtml(helpers.updateActionLabel(meta))}</button></div>`}
      <details class="advanced-actions"><summary>高级操作</summary>
        <div class="meta">强制深度检查会联网重新发现来源并调用模型，耗时更长且会计入模型用量。</div>
        <div class="tool-actions"><button class="text-btn" data-deep-update="${toolId}">重新核验资料</button>${canDelete ? `<button class="text-btn danger" data-remove="${toolId}">删除</button>` : `<span class="meta">内置工具可隐藏，不可删除</span>`}</div>
      </details></div>`;
    }).join("");
  }

  function renderPending(pendingUpdate, data) {
    if (!pendingUpdate?.pendingToken) return { hidden: true, html: "", risks: [] };
    const counts = pendingUpdate.diff?.counts || {};
    const risks = pendingUpdate.diff?.risks || [];
    const qualityWarnings = pendingUpdate.qualityWarnings || pendingUpdate.diff?.qualityWarnings || [];
    const sourceChanges = pendingUpdate.diff?.sourceChanges || {};
    const detailRows = [
      ...(pendingUpdate.updateSignal?.marker ? [`版本信号：${pendingUpdate.updateSignal.marker}（${pendingUpdate.updateSignal.detail || pendingUpdate.updateSignal.signalType}）`] : []),
      ...(pendingUpdate.diff?.added || []).map((item) => `＋ ${item.cmd} · ${item.zh}`),
      ...(pendingUpdate.diff?.modified || []).map((item) => `≈ ${item.before} → ${item.after}`),
      ...(pendingUpdate.diff?.removed || []).map((item) => `－ ${item.cmd} · ${item.zh}`),
      ...(sourceChanges.added || []).map((source) => `＋ 来源：${source.title || source.id}`),
      ...(sourceChanges.removed || []).map((source) => `－ 来源：${source.title || source.id}`),
      ...(sourceChanges.conflicts || []).map((conflict) => `⚠ 来源冲突：${conflict}`),
      ...((sourceChanges.statusDowngrades || []).length ? [`⚠ ${sourceChanges.statusDowngrades.length} 个条目的核验状态下降`] : []),
      ...((sourceChanges.evidenceRefChanges || []).length ? [`≈ ${sourceChanges.evidenceRefChanges.length} 个条目的证据断言发生变化`] : []),
      ...((sourceChanges.locatorLosses || []).length ? [`⚠ ${sourceChanges.locatorLosses.length} 个条目的证据定位被移除`] : []),
    ];
    return {
      hidden: false,
      risks,
      html: `<h2>发现 ${escapeHtml(data[pendingUpdate.toolId]?.meta.name || pendingUpdate.toolId)} 更新</h2>
    <div class="diff-summary"><div class="diff-stat"><strong>${counts.added || 0}</strong>新增</div><div class="diff-stat"><strong>${counts.modified || 0}</strong>修改</div><div class="diff-stat"><strong>${counts.removed || 0}</strong>删除</div><div class="diff-stat"><strong>${counts.meta || 0}</strong>元数据</div></div>
    <div class="diff-list">${detailRows.length ? detailRows.map((row) => `<div>${escapeHtml(row)}</div>`).join("") : "<div>仅来源或更新时间发生变化</div>"}</div>
    ${qualityWarnings.length ? `<div class="quality-warning">${qualityWarnings.map(escapeHtml).join("<br>")}</div>` : ""}
    ${risks.length ? `<label class="warning">${risks.map(escapeHtml).join("<br>")}<br><input id="confirmRisk" type="checkbox"> 我已核对上述高风险变化</label>` : ""}
    <div class="diff-actions"><button id="applyPending" class="text-btn primary" ${risks.length ? "disabled" : ""}>应用更新</button><button id="discardPending" class="text-btn">放弃</button></div>`,
    };
  }

  function renderOnboardChoices(data, toolIds, enabledTools) {
    return toolIds.map((toolId) =>
      `<label class="tool-choice"><input type="checkbox" value="${toolId}" ${enabledTools.has(toolId) ? "checked" : ""}> ${escapeHtml(data[toolId].meta.name)}</label>`
    ).join("");
  }

  const api = {
    escapeHtml,
    highlightHtml,
    normalizedSources,
    evidenceLabel,
    exampleProvenanceLabel,
    commandEvidenceHtml,
    commandExampleHtml,
    renderFilters,
    renderRow,
    renderResults,
    renderManageToolToggles,
    safeHttpsUrl,
    renderRecommendationCategories,
    renderRecommendedTools,
    countBarHtml,
    renderManageTools,
    renderPending,
    renderOnboardChoices,
  };

  globalScope.CHEATSHEET_POPUP_RENDER = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
