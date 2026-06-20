// popup.js — 读取 window.CHEATSHEET_DATA（由 data/*.js 注入），渲染可搜索/可筛选的列表

const CAT_LABEL = { shortcut: "⌨ 快捷键", slash: "/ 命令", flag: "--flag" };
const NATIVE_HOST_NAME = "com.aicli.cheatsheet_updater";
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
  el.className = "show" + (kind ? " " + kind : "");
}

function setSearch(val) {
  const el = document.getElementById("search");
  el.value = val;
  if (chrome?.storage?.local) chrome.storage.local.set({ lastQuery: val });
}

// ── 更新面板 ──────────────────────────────────────────────────────────────────────

let updateMode = "add";

function setupUpdateButton() {
  const btn = document.getElementById("updateBtn");
  const input = document.getElementById("updateTool");
  const modeBtns = document.querySelectorAll(".mode-btn");

  modeBtns.forEach((mb) => {
    mb.addEventListener("click", () => {
      modeBtns.forEach((b) => b.classList.remove("active"));
      mb.classList.add("active");
      updateMode = mb.dataset.mode;
      input.placeholder =
        updateMode === "add" ? "工具名，如 OpenCode / IntelliJ IDEA" : "已收录的工具名，如 Claude Code";
    });
  });

  btn.addEventListener("click", () => {
    const displayName = input.value.trim();
    if (!displayName) {
      setUpdateStatus("请先输入工具名称", "err");
      return;
    }
    if (!chrome?.runtime?.sendNativeMessage) {
      setUpdateStatus("当前浏览器环境不支持 Native Messaging，无法使用此功能。", "err");
      return;
    }

    const toolId = toToolId(displayName);

    if (updateMode === "update" && !getAllData()[toolId]) {
      setUpdateStatus(
        `没有在已收录列表里找到「${displayName}」，如果是想新增这个工具，请切换到"➕ 新增工具"模式。`,
        "err"
      );
      return;
    }

    btn.disabled = true;
    btn.textContent = updateMode === "add" ? "正在查询新工具…（最长15分钟）" : "正在检查更新…（请稍候）";
    setUpdateStatus("已发送请求给本机 Claude Code，正在后台处理，请耐心等待…", null);

    chrome.runtime.sendNativeMessage(
      NATIVE_HOST_NAME,
      { action: "update_tool", tool: toolId, display_name: displayName, mode: updateMode },
      (response) => {
        btn.disabled = false;
        btn.textContent = "查询并写入";

        if (chrome.runtime.lastError) {
          setUpdateStatus(
            "连接本地更新程序失败：" +
              chrome.runtime.lastError.message +
              "\n\n请确认已运行过 native-host/install.sh（macOS/Linux）或 install.ps1（Windows）安装脚本，并完全重启过浏览器。",
            "err"
          );
          return;
        }
        if (!response) {
          setUpdateStatus("没有收到任何响应，本地程序可能异常退出了。", "err");
          return;
        }
        if (response.ok) {
          setUpdateStatus(
            "✅ 完成！\n\n" +
              (response.output || "（没有详细输出）") +
              "\n\n正在自动重新加载插件，稍后重新打开面板即可看到新工具。",
            "ok"
          );
          setTimeout(() => chrome.runtime.reload(), 1500);
        } else {
          setUpdateStatus("❌ 失败：" + (response.error || "未知错误"), "err");
        }
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
    return (it.cmd + " " + it.en + " " + it.zh).toLowerCase().includes(q);
  }

  function renderBlock(id, rows) {
    if (rows.length === 0) return;
    visibleTotal += rows.length;
    const tool = data[id];
    const color = tool?.meta?.color || "#888";
    const block = document.createElement("div");
    block.className = "tool-block";

    const rowsHtml = rows.map((r) => {
      const fk = favKey(id, r.cmd);
      const isFav = favourites.has(fk);
      return `
        <div class="row" tabindex="0">
          <div class="cmd"><span class="dot" style="background:${color}"></span>${escapeHtml(r.cmd)}</div>
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
        (it) => favourites.has(favKey(id, it.cmd)) && (!activeCat || it.cat === activeCat) && itemMatchesQuery(it)
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

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  setupUpdateButton();

  loadFavourites(() => {
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
});
