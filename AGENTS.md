# Repository Guidelines

## 项目结构与模块组织

本仓库是一个 Manifest V3 Chrome/Edge 扩展，用于查询 AI CLI、编辑器和开发工具速查数据。核心界面文件位于根目录：`popup.html`、`popup.js`、`background.js` 和 `product-core.js`。工具数据在 `data/*.js`，其中 `data/index.js` 负责加载顺序，`data/SCHEMA.md` 定义数据契约。人工整理示例在 `enrichments/`，由 `usage-examples.js` 组装。共享校验配置在 `shared/`，Native Messaging 支持在 `native-host/`，脚本在 `tools/`，测试在 `tests/`，图标在 `icons/`。

## 构建、测试与开发命令

常规校验不依赖包管理器。在仓库根目录直接运行 Node.js 和 Python 命令：

```bash
node --check popup.js
node --check background.js
node --check product-core.js
node tools/validate-data.js
node tests/test_product_core.js
node tests/test_usage_examples.js
node tests/test_popup_ux.js
python3 -m unittest discover -s tests -v
```

只有需要联网检查来源跳转、HTTP 状态和页面标题时，才运行 `node tools/verify-source-urls.js`。手动测试时，在 `chrome://extensions/` 或 `edge://extensions/` 中加载仓库根目录作为未打包扩展。

## 代码风格与命名约定

沿用现有的普通 JavaScript 风格，已有文件使用 `"use strict"` 时保持一致。JavaScript 和 JSON 使用两个空格缩进。数据集 ID 与文件名使用小写 kebab-case，例如 `data/claude-code.js`；条目 ID 使用稳定的字母、数字、下划线或连字符。浏览器 API 应集中在 UI 或后台脚本中。不要在 `popup.html` 直接添加工具数据脚本，应更新 `data/index.js`。

## 测试指南

修改搜索行为、示例富化、校验规则、弹窗交互或 Native Host 行为时，应同步新增或更新 `tests/` 中的测试。JavaScript 测试使用 Node 内置 `assert`，Python 测试使用 `unittest`。数据改动必须通过 `node tools/validate-data.js`，包括 schema、来源登记、重复项和示例覆盖检查。

## 提交与 Pull Request 规范

近期提交采用简洁的 Conventional Commits，例如 `feat: expand Shell coverage to a full interpreter reference`。提交信息使用祈使语气并说明范围，例如 `fix: correct Codex option example` 或 `test: cover popup keyboard navigation`。PR 应说明变更内容、列出已运行的校验命令、关联相关 issue；涉及可见 UI 时附截图。数据更新需说明来源质量和人工核验情况。

## 安全与配置提示

基础搜索完全在本地运行。Native Host 功能可能调用本机 Claude Code 或已配置的 Anthropic 兼容 API，因此不要提交 Token、本机路径、生成的临时候选文件或机器相关安装输出。移动仓库或扩展 ID 变化后，重新运行 `native-host/install.sh` 或 `native-host/install.ps1`。
