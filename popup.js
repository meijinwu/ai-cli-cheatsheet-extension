// popup.js — 读取 window.CHEATSHEET_DATA（由 data/*.js 注入），渲染可搜索/可筛选的列表

const CAT_LABEL = { shortcut: "⌨ 快捷键", slash: "/ 命令", flag: "--flag" };
const FAV_KEY = "favourites";

let activeTool = "all";
let activeCat = null;
let favourites = new Set();

// ── 图标 SVG ────────────────────────────────────────────────────────────────────

const COPY_SVG = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="4" width="8" height="10" rx="1.2"/><path d="M3 12V2.5A.5.5 0 013.5 2H11"/></svg>`;
const COPY_OK  = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="2,8 6,12 14,4"/></svg>`;
const FAV_OFF  = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 13.2L2.6 8.5C1.4 7.4 1.4 5.6 2.5 4.5c1-1 2.7-1.1 3.9-.2L8 5.8l1.6-1.5c1.2-.9 2.9-.8 3.9.2 1.1 1.1 1.1 2.9-.1 4L8 13.2z"/></svg>`;
const FAV_ON   = `<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M8 13.2L2.6 8.5C1.4 7.4 1.4 5.6 2.5 4.5c1-1 2.7-1.1 3.9-.2L8 5.8l1.6-1.5c1.2-.9 2.9-.8 3.9.2 1.1 1.1 1.1 2.9-.1 4L8 13.2z"/></svg>`;

// ── 收藏 ─────────────────────────────────────────────────────────────────────────

function loadFavourites(cb) {
  if (chrome?.storage?.local) {
    chrome.storage.local.get([FAV_KEY], (res) => {
      favourites = new Set(res[FAV_KEY] || []);
      cb();
    });
  } else {
    cb();
  }
}

function saveFavourites() {
  if (chrome?.storage?.local) {
    chrome.storage.local.set({ [FAV_KEY]: [...favourites] });
  }
}

function favKey(toolId, cmd) {
  return `${toolId}::${cmd}`;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function itemId(toolId, item) {
  return item.id || hashString(
    `${toolId}\0${item.cat}\0${item.context || ""}\0${String(item.en).toLowerCase()}`
  );
}

function itemFavKey(toolId, item) {
  return favKey(toolId, itemId(toolId, item));
}

function migrateFavourites() {
  let changed = false;
  const data = getAllData();
  Object.entries(data).forEach(([toolId, tool]) => {
    (tool.items || []).forEach((item) => {
      const legacyKey = favKey(toolId, item.cmd);
      if (favourites.has(legacyKey)) {
        favourites.delete(legacyKey);
        favourites.add(itemFavKey(toolId, item));
        changed = true;
      }
    });
  });
  if (changed) saveFavourites();
}

// ── 数据访问 ──────────────────────────────────────────────────────────────────────

function getAllData() {
  return window.CHEATSHEET_DATA || {};
}

function getToolIds() {
  const data = getAllData();
  return Object.keys(data).sort((a, b) => {
    const oa = data[a].meta?.order ?? 999;
    const ob = data[b].meta?.order ?? 999;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });
}

// ── 工具函数 ──────────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toToolId(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function setUpdateStatus(text, kind) {
  const el = document.getElementById("updateStatus");
  el.textContent = text;
  el.className = text ? "show" + (kind ? " " + kind : "") : "";
}

function setSearch(val) {
  const el = document.getElementById("search");
  el.value = val;
  if (chrome?.storage?.local) chrome.storage.local.set({ lastQuery: val });
}

// ── 更新面板 ──────────────────────────────────────────────────────────────────────

let updateMode = "add";

function currentButtonLabel() {
  return {
    add: "查询并写入",
    update: "检查并更新",
    remove: "确认移除",
  }[updateMode] || "执行";
}

function resetUpdateButton() {
  const btn = document.getElementById("updateBtn");
  btn.disabled = false;
  btn.textContent = currentButtonLabel();
}

function handleTaskResult(response) {
  resetUpdateButton();
  if (!response) {
    setUpdateStatus("没有收到任何响应，本地程序可能异常退出了。", "err");
    return;
  }
  if (response.ok) {
    const reloadText = response.changed
      ? "\n\n正在重新加载插件，稍后重新打开面板即可看到变化。"
      : "\n\n数据没有变化，无需重新加载。";
    setUpdateStatus("✅ 完成！\n\n" + (response.output || "（没有详细输出）") + reloadText, "ok");
    if (response.changed) setTimeout(() => chrome.runtime.reload(), 1500);
  } else {
    setUpdateStatus("❌ 失败：" + (response.error || "未知错误"), "err");
  }
}

function setupUpdateButton() {
  const btn = document.getElementById("updateBtn");
  const input = document.getElementById("updateTool");
  const existingSelect = document.getElementById("existingTool");
  const modeBtns = document.querySelectorAll(".mode-btn");

  // Listen for task completion broadcast from background service worker
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "taskComplete") handleTaskResult(msg.response);
  });

  const HINTS = {
    add:    "新增模式：从零查询该工具并加入列表。",
    update: "更新模式：刷新已收录工具的最新内容。",
    remove: "移除模式：删除数据文件并从筛选列表中移除。⚠️ 内置工具删除后需手动恢复。",
  };
  const PLACEHOLDERS = {
    add:    "工具名，如 OpenCode / IntelliJ IDEA",
    update: "已收录的工具名，如 Claude Code",
    remove: "已收录的工具名，如 OpenCode",
  };
  existingSelect.innerHTML = getToolIds()
    .map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(getAllData()[id].meta.name)}</option>`)
    .join("");

  modeBtns.forEach((mb) => {
    mb.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      mb.classList.add("active");
      updateMode = mb.dataset.mode;
      input.placeholder = PLACEHOLDERS[updateMode] ?? PLACEHOLDERS.add;
      document.getElementById("updateHint").textContent = HINTS[updateMode] ?? "";
      input.hidden = updateMode !== "add";
      existingSelect.hidden = updateMode === "add";
      btn.textContent = currentButtonLabel();
      setUpdateStatus("", null);
    });
  });

  btn.addEventListener("click", () => {
    const selectedId = existingSelect.value;
    const displayName = updateMode === "add"
      ? input.value.trim()
      : getAllData()[selectedId]?.meta?.name || "";
    if (!displayName || (updateMode !== "add" && !selectedId)) {
      setUpdateStatus("请先输入工具名称", "err");
      return;
    }

    const toolId = updateMode === "add" ? toToolId(displayName) : selectedId;

    if (updateMode === "add") {
      const normalizedName = displayName.toLocaleLowerCase();
      const duplicate = getToolIds().find((id) => {
        const metaName = getAllData()[id]?.meta?.name || "";
        return id === toolId || metaName.toLocaleLowerCase() === normalizedName;
      });
      if (duplicate) {
        setUpdateStatus(`「${displayName}」已收录，请切换到“更新已有”模式。`, "err");
        return;
      }
    }

    const RUNNING_LABELS = {
      add:    "正在查询新工具…（最长15分钟）",
      update: "正在检查更新…（请稍候）",
      remove: "正在移除…",
    };
    const RUNNING_HINTS = {
      add:    "已发送给后台 Claude Code，关闭此面板不会中断任务，可稍后重新打开查看结果…",
      update: "已发送给后台 Claude Code，关闭此面板不会中断任务，可稍后重新打开查看结果…",
      remove: "正在删除文件并更新 popup.html，请稍候…",
    };
    btn.disabled = true;
    btn.textContent = RUNNING_LABELS[updateMode] ?? "执行中…";
    setUpdateStatus(RUNNING_HINTS[updateMode] ?? "", null);

    chrome.runtime.sendMessage(
      { action: "startTask", tool: toolId, display_name: displayName, mode: updateMode },
      (response) => {
        if (chrome.runtime.lastError) {
          resetUpdateButton();
          setUpdateStatus(
            "连接后台服务失败：" + chrome.runtime.lastError.message + "\n请重新加载插件后重试。",
            "err"
          );
          return;
        }
        if (!response?.ok) {
          resetUpdateButton();
          setUpdateStatus("❌ " + (response?.error ?? "启动失败"), "err");
        }
        // ok + queued: stay in "running" state, result arrives via taskComplete message
      }
    );
  });
}

// ── 筛选标签 ──────────────────────────────────────────────────────────────────────

function renderFilters() {
  const data = getAllData();
  const filters = document.getElementById("filters");

  // 工具标签
  const toolChips = [`<div class="chip active" data-tool="all">全部</div>`];
  getToolIds().forEach((id) => {
    const meta = data[id]?.meta;
    if (!meta) return;
    toolChips.push(
      `<div class="chip" data-tool="${id}" data-color="${escapeHtml(meta.color || '#888')}">${escapeHtml(meta.name)}</div>`
    );
  });
  toolChips.push(`<div class="chip" data-tool="favourites">⭐ 收藏</div>`);

  // 类型标签
  const catChips = Object.entries(CAT_LABEL)
    .map(([cat, label]) => `<div class="chip" data-cat="${cat}">${label}</div>`)
    .join("");

  filters.innerHTML = toolChips.join("") + catChips;

  function applyChipColor(chip) {
    if (chip.classList.contains("active") && chip.dataset.color) {
      chip.style.background = chip.dataset.color;
      chip.style.borderColor = chip.dataset.color;
    } else {
      chip.style.background = "";
      chip.style.borderColor = "";
    }
  }
  filters.querySelectorAll(".chip[data-tool]").forEach(applyChipColor);

  filters.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.tool !== undefined) {
        filters.querySelectorAll("[data-tool]").forEach((c) => {
          c.classList.remove("active");
          applyChipColor(c);
        });
        chip.classList.add("active");
        applyChipColor(chip);
        activeTool = chip.dataset.tool;
        // 切换工具标签时清空搜索框，避免「有查询词却没结果」的困惑
        if (activeTool !== "all") setSearch("");
      } else if (chip.dataset.cat) {
        const wasActive = chip.classList.contains("active");
        filters.querySelectorAll("[data-cat]").forEach((c) => c.classList.remove("active"));
        activeCat = wasActive ? null : chip.dataset.cat;
        if (!wasActive) chip.classList.add("active");
      }
      render();
    });
  });
}

// ── 渲染列表 ──────────────────────────────────────────────────────────────────────

function render() {
  const data = getAllData();
  const main = document.getElementById("main");
  const q = document.getElementById("search").value.trim().toLowerCase();
  main.innerHTML = "";

  let visibleTotal = 0;

  function itemMatchesQuery(it) {
    if (!q) return true;
    return (it.cmd + " " + it.en + " " + it.zh + " " + (it.context || "")).toLowerCase().includes(q);
  }

  function renderBlock(id, rows) {
    if (rows.length === 0) return;
    visibleTotal += rows.length;
    const tool = data[id];
    const color = tool?.meta?.color || "#888";
    const block = document.createElement("div");
    block.className = "tool-block";

    const rowsHtml = rows.map((r) => {
      const fk = itemFavKey(id, r);
      const isFav = favourites.has(fk);
      return `
        <div class="row" tabindex="0">
          <div class="cmd"><span class="dot" style="background:${color}"></span>${escapeHtml(r.cmd)}${r.context ? `<span class="context">${escapeHtml(r.context)}</span>` : ""}</div>
          <div class="zh">${escapeHtml(r.zh)}</div>
          <div class="en">${escapeHtml(r.en)}</div>
          <div class="row-actions">
            <button class="act-btn copy-btn" data-cmd="${escapeHtml(r.cmd)}" title="复制命令">${COPY_SVG}</button>
            <button class="act-btn fav-btn ${isFav ? 'fav-active' : ''}" data-fav="${escapeHtml(fk)}" title="${isFav ? '取消收藏' : '收藏'}">${isFav ? FAV_ON : FAV_OFF}</button>
          </div>
        </div>`;
    }).join("");

    block.innerHTML = `
      <div class="tool-header">
        <span class="badge" style="background:${color}">${escapeHtml(tool?.meta?.name || id)}</span>
        <span class="cnt">${rows.length} 条</span>
      </div>
      ${rowsHtml}`;
    main.appendChild(block);
  }

  if (activeTool === "favourites") {
    // 跨所有工具展示收藏项
    getToolIds().forEach((id) => {
      const tool = data[id];
      if (!tool?.items) return;
      const rows = tool.items.filter(
        (it) => favourites.has(itemFavKey(id, it)) && (!activeCat || it.cat === activeCat) && itemMatchesQuery(it)
      );
      renderBlock(id, rows);
    });
  } else {
    const toolIds = activeTool === "all" ? getToolIds() : [activeTool];
    toolIds.forEach((id) => {
      const tool = data[id];
      if (!tool?.items) return;
      const rows = tool.items.filter(
        (it) => (!activeCat || it.cat === activeCat) && itemMatchesQuery(it)
      );
      renderBlock(id, rows);
    });
  }

  if (visibleTotal === 0) {
    const msg = activeTool === "favourites"
      ? "还没有收藏的命令，hover 任意命令点 ♥ 收藏"
      : "没有匹配的结果，换个关键词试试 🔍";
    main.innerHTML = `<div class="empty">${msg}</div>`;
  }
  document.getElementById("countBar").textContent = `共 ${visibleTotal} 条结果`;
}

// ── 复制 & 收藏（事件委托） ────────────────────────────────────────────────────────

document.getElementById("main").addEventListener("click", (e) => {
  const copyBtn = e.target.closest(".copy-btn");
  if (copyBtn) {
    const cmd = copyBtn.dataset.cmd;
    navigator.clipboard.writeText(cmd).then(() => {
      copyBtn.classList.add("copied");
      copyBtn.innerHTML = COPY_OK;
      copyBtn.title = "已复制";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.innerHTML = COPY_SVG;
        copyBtn.title = "复制命令";
      }, 1200);
    }).catch(() => {});
    return;
  }

  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const fk = favBtn.dataset.fav;
    if (favourites.has(fk)) {
      favourites.delete(fk);
      favBtn.classList.remove("fav-active");
      favBtn.innerHTML = FAV_OFF;
      favBtn.title = "收藏";
    } else {
      favourites.add(fk);
      favBtn.classList.add("fav-active");
      favBtn.innerHTML = FAV_ON;
      favBtn.title = "取消收藏";
    }
    saveFavourites();
  }
});

// ── 键盘导航 ───────────────────────────────────────────────────────────────────────

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    const firstRow = document.querySelector("#main .row");
    if (firstRow) { firstRow.focus(); e.preventDefault(); }
  }
});

document.getElementById("main").addEventListener("keydown", (e) => {
  const rows = [...document.querySelectorAll("#main .row")];
  const idx = rows.indexOf(document.activeElement);
  if (idx === -1) return;

  if (e.key === "ArrowDown") {
    if (idx < rows.length - 1) rows[idx + 1].focus();
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    if (idx > 0) rows[idx - 1].focus();
    else document.getElementById("search").focus();
    e.preventDefault();
  } else if (e.key === "Enter") {
    rows[idx].querySelector(".copy-btn")?.click();
    e.preventDefault();
  } else if (e.key === "f" || e.key === "F") {
    rows[idx].querySelector(".fav-btn")?.click();
    e.preventDefault();
  } else if (e.key === "Escape") {
    document.getElementById("search").focus();
    e.preventDefault();
  }
});

// ── 初始化 ────────────────────────────────────────────────────────────────────────

document.getElementById("search").addEventListener("input", render);

function loadCheatsheetData() {
  const files = Array.isArray(window.CHEATSHEET_FILES) ? window.CHEATSHEET_FILES : [];
  return Promise.all(files.map((toolId) => new Promise((resolve, reject) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toolId)) {
      reject(new Error(`非法数据文件 ID：${toolId}`));
      return;
    }
    const script = document.createElement("script");
    script.src = `data/${toolId}.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`加载 data/${toolId}.js 失败`));
    document.head.appendChild(script);
  })));
}

async function initialize() {
  try {
    await loadCheatsheetData();
  } catch (error) {
    setUpdateStatus(error.message, "err");
  }
  renderFilters();
  setupUpdateButton();

  // Restore task state if the popup was closed while a task was running
  chrome.runtime.sendMessage({ action: "getTaskStatus" }, (status) => {
    if (chrome.runtime.lastError || !status) return;
    if (status.running) {
      const btn = document.getElementById("updateBtn");
      btn.disabled = true;
      btn.textContent = "正在后台执行中…";
      setUpdateStatus("任务正在后台运行中，请耐心等待。关闭此面板不会中断任务。", null);
    } else if (status.result && status.finishedAt && Date.now() - status.finishedAt < 30000) {
      handleTaskResult(status.result);
      chrome.storage.session.set({ taskStatus: { running: false } }).catch(() => {});
    }
  });

  loadFavourites(() => {
    migrateFavourites();
    if (chrome?.storage?.local) {
      chrome.storage.local.get(["lastQuery"], (res) => {
        if (res.lastQuery) document.getElementById("search").value = res.lastQuery;
        render();
      });
      document.getElementById("search").addEventListener("input", (e) => {
        chrome.storage.local.set({ lastQuery: e.target.value });
      });
    } else {
      render();
    }
  });
}

document.addEventListener("DOMContentLoaded", initialize);
