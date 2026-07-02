"use strict";

(function initPopupLoader(globalScope) {
  // 数据文件只经 data/index.js 声明的 CHEATSHEET_FILES 清单按 ID 注入；
  // ID 白名单校验防止拼出目录穿越或非数据脚本路径。
  function loadCheatsheetData(documentLike, files) {
    const list = Array.isArray(files) ? files : [];
    return Promise.all(list.map((toolId) => new Promise((resolve, reject) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toolId)) return reject(new Error(`非法数据文件 ID：${toolId}`));
      const script = documentLike.createElement("script");
      script.src = `data/${toolId}.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`加载 data/${toolId}.js 失败`));
      documentLike.head.appendChild(script);
    })));
  }

  const api = { loadCheatsheetData };

  globalScope.CHEATSHEET_POPUP_LOADER = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
