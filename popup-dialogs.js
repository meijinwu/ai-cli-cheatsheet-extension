"use strict";

(function initPopupDialogs(globalScope) {
  // 对话框内 Tab 焦点循环，onboarding 与 riskDialog 共用。
  function trapDialogFocus(documentLike, dialog, event) {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("button, input, select, [tabindex]:not([tabindex='-1'])")]
      .filter((element) => !element.disabled && !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && documentLike.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && documentLike.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }

  // 高风险复制确认对话框。
  // deps: { document, core, render, showToast, confirmFallback }
  function createRiskDialog(deps) {
    const doc = deps.document;
    let pendingRiskResolve = null;

    function riskDialogElement() {
      return typeof doc.getElementById === "function" ? doc.getElementById("riskDialog") : null;
    }

    function closeRiskDialog(confirmed) {
      const dialog = riskDialogElement();
      if (dialog) dialog.classList.remove("show");
      if (pendingRiskResolve) pendingRiskResolve(Boolean(confirmed));
      pendingRiskResolve = null;
    }

    function confirmRiskCopy(value, risk) {
      if (!risk.requiresConfirmation) return Promise.resolve(true);
      const dialog = riskDialogElement();
      if (pendingRiskResolve) {
        // 已有未决的风险确认：第二次复制请求直接按"未确认"处理，
        // 前一个 Promise 仍由用户在对话框里的操作决议，不会永久挂起。
        if (dialog) deps.showToast("请先处理当前的风险确认");
        return Promise.resolve(false);
      }
      if (!dialog) {
        return Promise.resolve(deps.confirmFallback(`这是高风险命令：${risk.warning}\n\n${value}\n\n确定要复制吗？`));
      }
      doc.getElementById("riskSummary").textContent = `风险类型：${risk.labels.join("、") || risk.warning || "高风险操作"}`;
      doc.getElementById("riskCommand").textContent = value;
      const details = deps.core.commandRiskDetails(risk);
      doc.getElementById("riskDetails").innerHTML = (details.length ? details : ["复制前请确认命令、路径、目标环境和当前上下文。"])
        .map((detail) => `<li>${deps.render.escapeHtml(detail)}</li>`)
        .join("");
      dialog.classList.add("show");
      doc.getElementById("riskCancel").focus();
      return new Promise((resolve) => {
        pendingRiskResolve = resolve;
      });
    }

    function bindRiskDialog() {
      doc.getElementById("riskCancel").addEventListener("click", () => closeRiskDialog(false));
      doc.getElementById("riskConfirm").addEventListener("click", () => closeRiskDialog(true));
      doc.getElementById("riskDialog").addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeRiskDialog(false);
          event.preventDefault();
          return;
        }
        trapDialogFocus(doc, event.currentTarget, event);
      });
    }

    return { confirmRiskCopy, closeRiskDialog, bindRiskDialog };
  }

  // 首次使用引导浮层。状态（enabledTools/platform）留在 popup.js，经 getter/setter 注入。
  // deps: { document, state, render, getAllData, getEnabledTools, setEnabledTools,
  //         getPlatform, setPlatform, storageSet, onSaved, onSkipped }
  function createOnboarding(deps) {
    const doc = deps.document;
    let onboardingReturnFocus = null;

    function renderOnboardChoices() {
      doc.getElementById("onboardPlatform").value = deps.getPlatform();
      doc.getElementById("onboardTools").innerHTML = deps.render.renderOnboardChoices(
        deps.getAllData(),
        deps.state.getToolIds(deps.getAllData()),
        deps.getEnabledTools()
      );
    }

    function showOnboarding(force = false) {
      onboardingReturnFocus = doc.activeElement;
      renderOnboardChoices();
      doc.getElementById("onboarding").classList.add("show");
      if (force) doc.getElementById("onboarding").dataset.forced = "true";
      doc.querySelector(".onboard-card").focus();
    }

    function hideOnboarding({ focusSearch = false } = {}) {
      doc.getElementById("onboarding").classList.remove("show");
      delete doc.getElementById("onboarding").dataset.forced;
      const target = focusSearch ? doc.getElementById("search") : onboardingReturnFocus;
      if (target?.isConnected) target.focus();
      onboardingReturnFocus = null;
    }

    function bindOnboarding() {
      doc.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", () => {
        const preset = button.dataset.preset;
        const selected = preset === "all"
          ? new Set(deps.state.getToolIds(deps.getAllData()))
          : new Set(deps.state.TOOL_PRESETS[preset] || []);
        doc.querySelectorAll("#onboardTools input").forEach((input) => {
          input.checked = selected.has(input.value);
        });
      }));
      doc.getElementById("saveOnboarding").addEventListener("click", async () => {
        const selected = [...doc.querySelectorAll("#onboardTools input:checked")].map((input) => input.value);
        deps.setEnabledTools(new Set(selected.length ? selected : deps.state.getToolIds(deps.getAllData())));
        deps.setPlatform(doc.getElementById("onboardPlatform").value);
        await deps.storageSet({ enabledTools: [...deps.getEnabledTools()], platform: deps.getPlatform(), onboarded: true });
        hideOnboarding({ focusSearch: true });
        deps.onSaved();
      });
      doc.getElementById("skipOnboarding").addEventListener("click", async () => {
        deps.setEnabledTools(new Set(deps.state.getToolIds(deps.getAllData())));
        await deps.storageSet({ enabledTools: [...deps.getEnabledTools()], platform: deps.getPlatform(), onboarded: true });
        hideOnboarding({ focusSearch: true });
        deps.onSkipped();
      });
      doc.getElementById("onboarding").addEventListener("keydown", (event) => {
        const dialog = event.currentTarget;
        if (event.key === "Escape") {
          if (dialog.dataset.forced === "true") hideOnboarding();
          else doc.getElementById("skipOnboarding").click();
          event.preventDefault();
          return;
        }
        trapDialogFocus(doc, dialog, event);
      });
    }

    return { renderOnboardChoices, showOnboarding, hideOnboarding, bindOnboarding };
  }

  const api = { trapDialogFocus, createRiskDialog, createOnboarding };

  globalScope.CHEATSHEET_POPUP_DIALOGS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
