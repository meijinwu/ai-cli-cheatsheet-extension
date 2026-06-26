"use strict";

(function initPopupTasks(globalScope) {
  const TASK_DISABLED_STATE = "taskDisabledState";

  function taskBaseMsg(mode, payload = {}) {
    if (mode === "preview_update") return "正在检查实际版本变化；如需生成预览会继续核对资料，关闭面板不会中断";
    if (mode === "add_tool" && payload.tool === "shell") return "正在分批生成 Shell 聚合数据，关闭面板不会中断";
    if (mode === "add_tool") return "正在整理并生成工具数据，关闭面板不会中断";
    return "正在执行，请稍候";
  }

  function createButtonDisabler(documentLike, disableSelector, restoreSelector = disableSelector) {
    return (disabled) => {
      const selector = disabled ? disableSelector : restoreSelector;
      documentLike.querySelectorAll(selector).forEach((button) => {
        if (disabled) {
          if (button.dataset[TASK_DISABLED_STATE] === undefined) {
            button.dataset[TASK_DISABLED_STATE] = button.disabled ? "true" : "false";
          }
          button.disabled = true;
          return;
        }
        const previous = button.dataset[TASK_DISABLED_STATE];
        if (previous === undefined) return;
        button.disabled = previous === "true";
        delete button.dataset[TASK_DISABLED_STATE];
      });
    };
  }

  function createTaskController(deps) {
    let taskTimer = null;

    function startTaskTimer(mode, startedAt, payload = {}) {
      if (taskTimer) clearInterval(taskTimer);
      const base = taskBaseMsg(mode, payload);
      taskTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        deps.setStatus(`${base}… (${elapsed}s)`);
      }, 1000);
      deps.setStatus(`${base}… (0s)`);
    }

    function stopTaskTimer() {
      if (taskTimer) {
        clearInterval(taskTimer);
        taskTimer = null;
      }
    }

    function runTask(mode, payload) {
      deps.setCurrentTaskMode(mode);
      startTaskTimer(mode, Date.now(), payload);
      deps.setManageButtonsDisabled(true);
      deps.chrome.runtime.sendMessage({ action: "startTask", mode, ...payload }, (response) => {
        if (deps.chrome.runtime.lastError || !response?.ok) {
          finishTask({ ok: false, error: deps.chrome.runtime.lastError?.message || response?.error || "启动失败" }, mode);
        }
      });
    }

    async function finishTask(response, mode = deps.getCurrentTaskMode()) {
      stopTaskTimer();
      deps.setManageButtonsDisabled(false);
      if (!response?.ok) {
        deps.setStatus(`❌ ${response?.error || "未知错误"}`, "err");
        return;
      }
      if (mode === "preview_update" && response.pendingToken) {
        deps.setPendingUpdate(response);
        await deps.storageSet({ pendingUpdate: response });
        deps.setStatus(`${response.output || "发现可用更新"}${response.qualityWarnings?.length ? `\n⚠ ${response.qualityWarnings.join("\n⚠ ")}` : ""}`, "ok");
        deps.renderPending();
        return;
      }
      if (mode === "discard_update") {
        deps.setPendingUpdate(null);
        await deps.storageSet({ pendingUpdate: null });
        deps.setStatus("已放弃本次更新");
        deps.renderPending();
        return;
      }
      if (mode === "apply_update") {
        deps.setPendingUpdate(null);
        await deps.storageSet({ pendingUpdate: null });
      }
      if (response.changed) {
        await deps.storageSet({
          lastQualityWarnings: response.qualityWarnings?.length
            ? { messages: response.qualityWarnings, createdAt: Date.now() }
            : null,
        });
      }
      deps.setStatus(`✅ ${response.output || "完成"}${response.qualityWarnings?.length ? `\n⚠ ${response.qualityWarnings.join("\n⚠ ")}` : ""}${response.changed ? "\n正在重新加载扩展…" : ""}`, "ok");
      if (response.changed) setTimeout(() => deps.chrome.runtime.reload(), 900);
    }

    return { startTaskTimer, stopTaskTimer, runTask, finishTask };
  }

  const api = { taskBaseMsg, createButtonDisabler, createTaskController };

  globalScope.CHEATSHEET_POPUP_TASKS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
