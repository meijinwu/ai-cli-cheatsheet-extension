'use strict';

// background.js — service worker bridge between popup and native messaging host.
// Keeps the native process alive even when the popup is closed.

const NATIVE_HOST = 'com.aicli.cheatsheet_updater';

// Watchdog: the native host has its own 900s CLI timeout; 20 minutes leaves
// headroom for that plus retries. Uses alarms (not setTimeout) so the deadline
// survives service-worker recycling.
const TASK_TIMEOUT_MINUTES = 20;
const TASK_TIMEOUT_ERROR = `任务超过 ${TASK_TIMEOUT_MINUTES} 分钟无响应，已自动终止。可直接重试；若反复出现，请重新运行 native-host 安装脚本并完全重启浏览器。`;

let nativePort = null;
let taskActive = false;

// Safety-net keepalive: an alarm fires every minute while a task is running.
// An open connectNative Port already prevents SW termination in most Chrome versions,
// but the alarm guards against edge cases and future Chrome changes.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepalive') {
    chrome.storage.session.get('_ka').catch(() => {});
    return;
  }
  if (alarm.name === 'taskTimeout') {
    // taskActive lives in the SW instance; after a SW restart it is false even
    // though the task is still recorded in session storage, so consult both.
    const wasActive = taskActive;
    chrome.storage.session.get(['taskStatus'])
      .then((res) => handleTaskTimeout(wasActive, res.taskStatus))
      .catch(() => handleTaskTimeout(wasActive, null));
  }
});

function handleTaskTimeout(wasActive, status) {
  if (!wasActive && !status?.running) return; // stale alarm; task already finished
  taskActive = false;
  stopKeepalive();
  if (nativePort) {
    try { nativePort.disconnect(); } catch (_e) { /* port already gone */ }
    nativePort = null;
  }
  const response = { ok: false, error: TASK_TIMEOUT_ERROR };
  setSessionStatus({ running: false, result: response, mode: status?.mode, finishedAt: Date.now() });
  broadcastCompletion(response);
}

function startKeepalive() {
  chrome.alarms.create('keepalive', { periodInMinutes: 1 });
}

function stopKeepalive() {
  chrome.alarms.clear('keepalive');
}

function setSessionStatus(status) {
  chrome.storage.session.set({ taskStatus: status }).catch(() => {});
}

function broadcastCompletion(response) {
  chrome.runtime.sendMessage({ action: 'taskComplete', response }).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'ping') {
    sendResponse({ ok: true });
    return false;
  }

  if (msg.action === 'getTaskStatus') {
    chrome.storage.session.get(['taskStatus'])
      .then((res) => sendResponse(res.taskStatus ?? { running: false }))
      .catch(() => sendResponse({ running: false }));
    return true; // async
  }

  if (msg.action === 'startTask') {
    if (taskActive) {
      sendResponse({ ok: false, error: '已有任务正在运行，请等待完成后再试。' });
      return false;
    }

    const { tool, display_name, mode, token, confirm_risk, prefer_web, deep_check, platform, count, exclude, enabled, collected } = msg;
    const tokenMode = ['apply_update', 'discard_update'].includes(mode);
    const suggestMode = mode === 'suggest_tools';
    const validToken = typeof token === 'string' && /^[a-f0-9]{32}$/.test(token);
    const validTool = typeof tool === 'string'
      && tool.length <= 64
      && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool);
    const validName = typeof display_name === 'string'
      && display_name.trim().length > 0
      && display_name.trim().length <= 100;
    const validPlatform = ['mac', 'windows', 'linux'].includes(platform);
    const validCount = Number.isInteger(count) && count >= 1 && count <= 12;
    const validMode = ['add_tool', 'preview_update', 'apply_update', 'discard_update', 'remove_tool', 'suggest_tools']
      .includes(mode);
    const TOOL_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const safeExclude = Array.isArray(exclude)
      ? exclude.filter((id) => typeof id === 'string' && TOOL_ID_RE.test(id)).slice(0, 200)
      : [];
    const safeToolContext = (items) => Array.isArray(items)
      ? items.filter((item) => item
        && typeof item.id === 'string'
        && TOOL_ID_RE.test(item.id)
        && typeof item.name === 'string'
        && item.name.trim().length > 0
        && item.name.trim().length <= 80)
        .slice(0, 80)
        .map((item) => ({ id: item.id, name: item.name.trim() }))
      : [];
    let paramsValid;
    if (suggestMode) paramsValid = validPlatform && validCount;
    else if (tokenMode) paramsValid = validToken;
    else paramsValid = validTool && validName;
    if (!validMode || !paramsValid) {
      sendResponse({ ok: false, error: '任务参数无效，请关闭并重新打开弹窗后重试；若反复出现，请更新扩展或反馈问题。' });
      return false;
    }
    taskActive = true;
    startKeepalive();
    chrome.alarms.create('taskTimeout', { delayInMinutes: TASK_TIMEOUT_MINUTES });
    setSessionStatus({ running: true, tool, display_name, mode, token, startedAt: Date.now() });

    // Ack immediately so popup can update its UI without waiting for the task
    sendResponse({ ok: true, queued: true });

    nativePort = chrome.runtime.connectNative(NATIVE_HOST);

    nativePort.onMessage.addListener((response) => {
      taskActive = false;
      stopKeepalive();
      chrome.alarms.clear('taskTimeout');
      nativePort.disconnect();
      nativePort = null;
      setSessionStatus({ running: false, result: response, mode, finishedAt: Date.now() });
      broadcastCompletion(response);
    });

    nativePort.onDisconnect.addListener(() => {
      if (!taskActive) return; // already handled via onMessage
      taskActive = false;
      stopKeepalive();
      chrome.alarms.clear('taskTimeout');
      nativePort = null;
      const errMsg = chrome.runtime.lastError?.message
        ?? '连接本地更新程序失败。请确认已运行安装脚本并完全重启浏览器。';
      const response = { ok: false, error: errMsg };
      setSessionStatus({ running: false, result: response, mode, finishedAt: Date.now() });
      broadcastCompletion(response);
    });

    nativePort.postMessage({
      action: mode,
      tool,
      display_name,
      token,
      confirm_risk: confirm_risk === true,
      prefer_web: prefer_web === true,
      deep_check: deep_check === true,
      platform,
      count,
      exclude: safeExclude,
      enabled: safeToolContext(enabled),
      collected: safeToolContext(collected),
    });
    return false;
  }
});
