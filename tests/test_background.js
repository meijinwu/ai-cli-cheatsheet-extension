"use strict";

// background.js 是 popup 与 native messaging host 之间的安全边界：
// 所有从 popup 传入的 startTask 参数都先在这里做白名单校验和清洗，
// 再转发给本地进程。这层校验此前完全没有测试覆盖（CI 只做 node --check
// 语法检查），本文件补上对校验/清洗逻辑与任务生命周期的覆盖。

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const SOURCE = fs.readFileSync(path.join(root, "background.js"), "utf8");

function flushMicrotasks() {
  return new Promise((resolve) => setImmediate(resolve));
}

function createChromeMock() {
  const state = {
    sentMessages: [],
    sessionSets: [],
    sessionGetResult: {},
    connectNativeCalls: [],
    ports: [],
  };
  const chrome = {
    alarms: {
      create() {},
      clear() {},
      onAlarm: { addListener() {} },
    },
    storage: {
      session: {
        get() { return Promise.resolve(state.sessionGetResult); },
        set(obj) { state.sessionSets.push(obj); return Promise.resolve(); },
      },
    },
    runtime: {
      lastError: null,
      sendMessage(msg) { state.sentMessages.push(msg); return Promise.resolve(); },
      connectNative(name) {
        state.connectNativeCalls.push(name);
        const port = {
          messages: [],
          disconnected: false,
          onMessage: { listener: null, addListener(fn) { port.onMessage.listener = fn; } },
          onDisconnect: { listener: null, addListener(fn) { port.onDisconnect.listener = fn; } },
          postMessage(msg) { port.messages.push(msg); },
          disconnect() { port.disconnected = true; },
        };
        state.ports.push(port);
        return port;
      },
      onMessage: { listener: null, addListener(fn) { chrome.runtime.onMessage.listener = fn; } },
    },
  };
  return { chrome, state };
}

function loadBackground() {
  const { chrome, state } = createChromeMock();
  const context = { chrome, console };
  vm.createContext(context);
  vm.runInContext(SOURCE, context, { filename: "background.js" });
  return { chrome, state };
}

function dispatch(chrome, msg) {
  let response;
  const async_ = chrome.runtime.onMessage.listener(msg, {}, (res) => { response = res; });
  // sendResponse 的对象来自 vm 沙箱的独立 realm，与本文件的内建对象原型不同，
  // deepStrictEqual 会因原型不同而判定“不相等”；先经 JSON 往返剥离 realm 差异。
  return { async_, getResponse: () => JSON.parse(JSON.stringify(response)) };
}

const VALID_TOKEN = "a".repeat(32);

(async () => {
  // ping 同步响应
  {
    const { chrome } = loadBackground();
    const { async_, getResponse } = dispatch(chrome, { action: "ping" });
    assert.strictEqual(async_, false, "ping should respond synchronously");
    assert.deepStrictEqual(getResponse(), { ok: true });
  }

  // getTaskStatus 异步读取 session 存储
  {
    const { chrome, state } = loadBackground();
    state.sessionGetResult = { taskStatus: { running: true, tool: "git" } };
    const { async_, getResponse } = dispatch(chrome, { action: "getTaskStatus" });
    assert.strictEqual(async_, true, "getTaskStatus should be handled asynchronously");
    await flushMicrotasks();
    assert.deepStrictEqual(getResponse(), { running: true, tool: "git" });
  }

  // getTaskStatus 在没有存储值时回退为 running:false
  {
    const { chrome } = loadBackground();
    const { getResponse } = dispatch(chrome, { action: "getTaskStatus" });
    await flushMicrotasks();
    assert.deepStrictEqual(getResponse(), { running: false });
  }

  // startTask 参数校验：拒绝未知 mode
  {
    const { chrome, state } = loadBackground();
    const { async_, getResponse } = dispatch(chrome, {
      action: "startTask", mode: "bogus", tool: "git", display_name: "Git",
    });
    assert.strictEqual(async_, false);
    assert.deepStrictEqual(getResponse(), { ok: false, error: "任务参数无效。" });
    assert.strictEqual(state.connectNativeCalls.length, 0, "invalid mode must not reach the native host");
  }

  // startTask 参数校验：拒绝非法 tool id（大写/非法字符）
  {
    const { chrome, state } = loadBackground();
    const { getResponse } = dispatch(chrome, {
      action: "startTask", mode: "add_tool", tool: "Git", display_name: "Git",
    });
    assert.strictEqual(getResponse().ok, false);
    assert.strictEqual(state.connectNativeCalls.length, 0);
  }

  // startTask 参数校验：拒绝过长 tool id
  {
    const { chrome } = loadBackground();
    const { getResponse } = dispatch(chrome, {
      action: "startTask", mode: "add_tool", tool: "a".repeat(65), display_name: "Git",
    });
    assert.strictEqual(getResponse().ok, false, "tool id over 64 chars must be rejected");
  }

  // startTask 参数校验：拒绝空白 display_name
  {
    const { chrome } = loadBackground();
    const { getResponse } = dispatch(chrome, {
      action: "startTask", mode: "add_tool", tool: "git", display_name: "   ",
    });
    assert.strictEqual(getResponse().ok, false, "whitespace-only display_name must be rejected");
  }

  // startTask 参数校验：token 模式要求 32 位十六进制 token
  {
    const { chrome, state } = loadBackground();
    const { getResponse } = dispatch(chrome, {
      action: "startTask", mode: "apply_update", token: "not-a-token",
    });
    assert.strictEqual(getResponse().ok, false);
    assert.strictEqual(state.connectNativeCalls.length, 0);
  }
  {
    const { chrome, state } = loadBackground();
    const { getResponse } = dispatch(chrome, {
      action: "startTask", mode: "apply_update", token: VALID_TOKEN, confirm_risk: true,
    });
    assert.strictEqual(getResponse().ok, true, "valid 32-hex token should be accepted");
    assert.strictEqual(state.connectNativeCalls.length, 1);
  }

  // startTask 参数校验：suggest_tools 模式要求合法 platform/count
  {
    const { chrome } = loadBackground();
    assert.strictEqual(
      dispatch(chrome, { action: "startTask", mode: "suggest_tools", platform: "android", count: 5 }).getResponse().ok,
      false,
      "unknown platform must be rejected"
    );
  }
  {
    const { chrome } = loadBackground();
    assert.strictEqual(
      dispatch(chrome, { action: "startTask", mode: "suggest_tools", platform: "mac", count: 13 }).getResponse().ok,
      false,
      "count above the 12 cap must be rejected"
    );
  }
  {
    const { chrome } = loadBackground();
    assert.strictEqual(
      dispatch(chrome, { action: "startTask", mode: "suggest_tools", platform: "mac", count: 0 }).getResponse().ok,
      false,
      "count below 1 must be rejected"
    );
  }
  {
    const { chrome, state } = loadBackground();
    const { getResponse } = dispatch(chrome, { action: "startTask", mode: "suggest_tools", platform: "mac", count: 5 });
    assert.strictEqual(getResponse().ok, true);
    assert.strictEqual(state.connectNativeCalls.length, 1);
  }

  // startTask 清洗 exclude / enabled / collected，过滤非法条目而非整体拒绝
  {
    const { chrome, state } = loadBackground();
    const { getResponse } = dispatch(chrome, {
      action: "startTask",
      mode: "add_tool",
      tool: "git",
      display_name: "Git",
      exclude: ["good-tool", "Bad_ID", 42, "another-good"],
      enabled: [
        { id: "good-tool", name: "Good Tool" },
        { id: "BadID", name: "x" },
        { id: "ok-tool", name: "" },
        { id: "ok2", name: "  Trimmed  " },
        { id: "too-long-name", name: "x".repeat(81) },
      ],
      collected: [{ id: "collected-1", name: "Collected" }],
    });
    assert.strictEqual(getResponse().ok, true);
    const posted = JSON.parse(JSON.stringify(state.ports[0].messages[0]));
    assert.deepStrictEqual(posted.exclude, ["good-tool", "another-good"], "exclude should drop ids that fail TOOL_ID_RE");
    assert.deepStrictEqual(
      posted.enabled,
      [{ id: "good-tool", name: "Good Tool" }, { id: "ok2", name: "Trimmed" }],
      "enabled should drop invalid ids, empty names, and over-length names, and trim surviving names"
    );
    assert.deepStrictEqual(posted.collected, [{ id: "collected-1", name: "Collected" }]);
  }

  // startTask 把非布尔值的 confirm_risk/prefer_web/deep_check 收窄为 false
  {
    const { chrome, state } = loadBackground();
    dispatch(chrome, {
      action: "startTask", mode: "add_tool", tool: "git", display_name: "Git",
      confirm_risk: "true", prefer_web: 1, deep_check: undefined,
    });
    const posted = state.ports[0].messages[0];
    assert.strictEqual(posted.confirm_risk, false, "non-boolean confirm_risk must not be coerced to true");
    assert.strictEqual(posted.prefer_web, false);
    assert.strictEqual(posted.deep_check, false);
  }

  // startTask 并发守卫：任务进行中拒绝第二个请求，完成后恢复可用
  {
    const { chrome, state } = loadBackground();
    const first = dispatch(chrome, { action: "startTask", mode: "add_tool", tool: "git", display_name: "Git" });
    assert.strictEqual(first.getResponse().ok, true);
    assert.strictEqual(state.connectNativeCalls.length, 1);

    const second = dispatch(chrome, { action: "startTask", mode: "add_tool", tool: "git", display_name: "Git" });
    assert.deepStrictEqual(second.getResponse(), { ok: false, error: "已有任务正在运行，请等待完成后再试。" });
    assert.strictEqual(state.connectNativeCalls.length, 1, "a running task must not open a second native connection");

    const port = state.ports[0];
    port.onMessage.listener({ ok: true, output: "done" });
    assert.strictEqual(port.disconnected, true, "completion should disconnect the native port");
    assert.strictEqual(
      state.sentMessages.some((m) => m.action === "taskComplete" && m.response.ok === true),
      true,
      "completion should broadcast taskComplete"
    );

    const third = dispatch(chrome, { action: "startTask", mode: "add_tool", tool: "git", display_name: "Git" });
    assert.strictEqual(third.getResponse().ok, true, "task slot should be free again after completion");
    assert.strictEqual(state.connectNativeCalls.length, 2);
  }

  // startTask 断开连接（未收到 onMessage）走错误分支，并清空 taskActive
  {
    const { chrome, state } = loadBackground();
    dispatch(chrome, { action: "startTask", mode: "add_tool", tool: "git", display_name: "Git" });
    chrome.runtime.lastError = { message: "native host disconnected" };
    state.ports[0].onDisconnect.listener();
    assert.strictEqual(
      state.sentMessages.some((m) => m.action === "taskComplete" && m.response.error === "native host disconnected"),
      true,
      "disconnect without a prior message should broadcast the lastError reason"
    );
    chrome.runtime.lastError = null;

    const sentBefore = state.sentMessages.length;
    state.ports[0].onDisconnect.listener();
    assert.strictEqual(state.sentMessages.length, sentBefore, "a second disconnect after completion must be a no-op");

    const retry = dispatch(chrome, { action: "startTask", mode: "add_tool", tool: "git", display_name: "Git" });
    assert.strictEqual(retry.getResponse().ok, true, "task slot should be free again after disconnect handling");
  }

  console.log("Background message handler tests passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
