# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指引。

## 这是什么

一个 Chrome/Edge（Manifest V3）速查表扩展（"AI CLI 速查表"），覆盖 AI CLI、编辑器与开发工具；外加一个 **Python 本机消息（native messaging）桥接程序**，通过调用 Claude Code 或 Anthropic 兼容 API 来生成/更新速查数据。产品界面与大部分注释为中文。

两个运行时，刻意解耦：
- **浏览器侧（JavaScript，无构建步骤）**：`popup.*`、`background.js`、`product-core.js`、`usage-examples.js`，以及生成的 `data/*.js`。所有基础查询都是纯本地 JS —— 不联网。
- **本机 Host（`native-host/host.py`，仅用标准库的 Python 3）**：只有可选的「新增工具 / 检查更新」流程才会通过 Chrome Native Messaging 调用它。

仓库**没有 `package.json`、没有打包器、没有 lint 配置** —— 扩展直接加载源文件，CI 仅用 `node --check` 做语法检查。

## 常用命令

在仓库根目录执行。以 CI（`.github/workflows/ci.yml`）为准。

```bash
# JS 语法检查（无编译器/打包器）
node --check popup.js popup-state.js popup-render.js popup-toast.js popup-dialogs.js popup-loader.js popup-tasks.js pinyin-initials.js background.js product-core.js usage-examples.js
find data enrichments -name '*.js' -print0 | xargs -0 -n1 node --check

# 数据 + JS 测试套件（每个测试文件是独立脚本——整文件运行，没有单测运行器）
node tools/validate-data.js              # 静态校验每个已提交的 data/*.js
node tests/test_validation_consistency.js
node tests/test_product_core.js
node tests/test_usage_examples.js
node tests/test_popup_ux.js
node tests/test_background.js

# 本机 Host 测试（CI 用 unittest；本地也有带 pytest 的 .venv）
python3 -m unittest discover -s tests -v
.venv/bin/python -m pytest tests/test_host.py -q

# 单个 Host 测试
python3 -m unittest tests.test_host.HostApiTests.test_raises_on_truncation -v
.venv/bin/python -m pytest "tests/test_host.py::HostApiTests::test_raises_on_truncation" -q

# 可选：联网复核来源 URL/重定向/页面标题
node tools/verify-source-urls.js
```

## 部署本机 Host（关键、不显而易见）

`native-host/install.sh`（macOS/Linux）/ `install.ps1`（Windows）会把 `host.py` **拷贝**到
`~/Library/Application Support/aicli-cheatsheet/host.py`，并注册一个 `run.sh` 包装脚本作为 Chrome 的
native-messaging 目标。**改了仓库里的 `host.py` 在重新部署前不会生效：**

```bash
printf 'Y\n' | bash native-host/install.sh   # 「仅更新 host.py」路径；保留 credentials.env
```

重新部署后需完全退出并重开浏览器。安装副本通过 `AICLI_PROJECT_DIR`（在生成的 `run.sh` 里设置）从仓库解析
`data/` 和 `shared/`，因此它**直接把数据读写回仓库工作区**。安装副本在包装脚本指定的解释器下运行（macOS 上常是系统
`/usr/bin/python3`），所以 `host.py` 要保持仅用标准库且兼容 Python 3.9。

## 架构

### 数据是生成的，不是手写的
每个工具是一个 `data/<id>.js` 文件，给 `window.CHEATSHEET_DATA["<id>"]` 赋值；`data/index.js`
（`window.CHEATSHEET_FILES`）是 popup 加载哪些文件的唯一索引。这两个文件都由 `host.py` 自动生成。Schema 见
`data/SCHEMA.md`；来源出处登记在 `shared/source-registry.json`。

### 新增/更新流水线（`background.js` → `host.py`）
1. popup 发送 Native Messaging 请求；`host.py` 按 `action` 分发（`ping`、`add_tool`、
   `preview_update`、`apply_update`、`discard_update`、`remove_tool`）。
2. 生成优先走直连 Anthropic 兼容 API（`_call_api_direct`，环境变量：`ANTHROPIC_BASE_URL`、
   `ANTHROPIC_AUTH_TOKEN`/`ANTHROPIC_API_KEY`、`ANTHROPIC_MODEL`）；没有 token 时回退到
   `claude -p`（`_call_claude_cli`）。
3. 模型先返回筛选过的来源清单，再返回结构化条目；`validate_dataset()` 校验 schema、证据、去重和稳定 ID。
   更新返回**差异预览**，先写入待处理文件，确认后复核旧文件哈希再原子写入。

### 校验逻辑镜像在两处 —— 必须同步
- `native-host/host.py` 的 `validate_dataset()`（Python）把关生成。
- `tools/validate-data.js`（JS）把关已提交数据（CI）。
- `tests/test_validation_consistency.js` 以 `shared/validation-rules.json` 为基准防止两者漂移（漂移会让 CI 挂）。

改某条校验规则或共享枚举时，**两个校验器都要改**（外加 `data/SCHEMA.md`）。

### 搜索核心是共用的
`product-core.js` 暴露排序/同义词/平台命令逻辑，被 `popup.js` 和 `tests/test_product_core.js` 共用。它索引
command、zh、en、keywords、context、`shell` 子字段和 examples —— 所以要让内容可被搜到，关键是把合适的词放进
`keywords` 和 `shell.*`。

### Shell 是特殊的聚合工具
与普通工具不同，"Shell" 是分批生成的（`SHELL_BATCHES`、`run_shell_aggregate_query`），范围限定为解释器/终端
环境本体（sh/POSIX、bash、zsh）。外部 CLI（grep/git/docker/npm/claude…）刻意不收进 Shell，它们属于其它工具
（如 GNU/Linux CLI、Git），只能作为某个 Shell 条目的关联 `keywords` 出现。聚合路径刻意做了容错：单次调用被截断时
缩小批次并重试，个别不合规条目会被丢弃，空批次会被跳过（带质量提示）而不是让整个新增失败。

## 约定 / 注意事项

- **不要提交生成的用户数据。** 新增工具会把一个模型生成的 `data/<id>.js`
  （`verificationStatus: model-knowledge`/`web-assisted`）写进仓库，并追加到 `data/index.js`。
  `tools/validate-data.js` 要求已提交数据是 `verificationStatus: "manual"`，所以提交生成文件会让 CI 挂。提交源码
  改动时要排除这类 `data/*.js` 以及对应的 `data/index.js` 改动（用显式 `git add` 指定文件，不要 `git add -A`）。
- **手动改数据**必须遵循 `data/SCHEMA.md`，新增工具要更新 `data/index.js`，并通过 `node tools/validate-data.js`。
- **工作流**：不要直接提交到 `main` —— 先开分支，用 `gh` 提 PR，用 merge commit 合并。提交信息用
  Conventional Commits（`feat:`、`fix:`、`refactor:`、`docs:`、`test:`、`chore:`）。
- `enrichments/` 存放按稳定 `item.id` 关联的人工核验示例；`usage-examples.js` 派生出 popup 消费的公共示例/风险富化。
