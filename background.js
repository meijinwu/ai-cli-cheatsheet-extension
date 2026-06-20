'use strict';

// background.js — service worker bridge between popup and native messaging host.
// Keeps the native process alive even when the popup is closed.

const NATIVE_HOST = 'com.aicli.cheatsheet_updater';

let nativePort = null;
let taskActive = false;

// Safety-net keepalive: an alarm fires every minute while a task is running.
// An open connectNative Port already prevents SW termination in most Chrome versions,
// but the alarm guards against edge cases and future Chrome changes.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepalive') {
    chrome.storage.session.get('_ka').catch(() => {});
  }
});

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

    const { tool, display_name, mode } = msg;
    const validTool = typeof tool === 'string'
      && tool.length <= 64
      && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool);
    const validName = typeof display_name === 'string'
      && display_name.trim().length > 0
      && display_name.trim().length <= 100;
    if (!validTool || !validName || !['add', 'update', 'remove'].includes(mode)) {
      sendResponse({ ok: false, error: '任务参数无效。' });
      return false;
    }
    taskActive = true;
    startKeepalive();
    setSessionStatus({ running: true, tool, display_name, mode, startedAt: Date.now() });

    // Ack immediately so popup can update its UI without waiting for the task
    sendResponse({ ok: true, queued: true });

    nativePort = chrome.runtime.connectNative(NATIVE_HOST);

    nativePort.onMessage.addListener((response) => {
      taskActive = false;
      stopKeepalive();
      nativePort.disconnect();
      nativePort = null;
      setSessionStatus({ running: false, result: response, finishedAt: Date.now() });
      broadcastCompletion(response);
    });

    nativePort.onDisconnect.addListener(() => {
      if (!taskActive) return; // already handled via onMessage
      taskActive = false;
      stopKeepalive();
      nativePort = null;
      const errMsg = chrome.runtime.lastError?.message
        ?? '连接本地更新程序失败。请确认已运行安装脚本并完全重启浏览器。';
      const response = { ok: false, error: errMsg };
      setSessionStatus({ running: false, result: response, finishedAt: Date.now() });
      broadcastCompletion(response);
    });

    nativePort.postMessage({ action: 'update_tool', tool, display_name, mode });
    return false;
  }
});
