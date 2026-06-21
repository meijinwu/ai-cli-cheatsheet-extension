import importlib.util
import json
import os
import pathlib
import tempfile
import types
import unittest
from unittest import mock


ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("native_host", ROOT / "native-host" / "host.py")
host = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(host)


def valid_dataset(tool_id="sample"):
    return {
        "meta": {
            "id": tool_id,
            "name": "Sample Tool",
            "color": "#123ABC",
            "source": "Official docs, 2026-06",
            "sourceUrl": "https://example.com/docs",
            "sources": [{
                "id": "official-docs",
                "title": "Sample Tool documentation",
                "url": "https://example.com/docs",
                "kind": "official-doc",
                "maintainer": "Sample Vendor",
                "evidenceTier": "first-party",
                "lastVerifiedAt": "2026-06-20",
                "resolvedUrl": "https://example.com/docs",
                "pageTitle": "Sample Tool documentation",
                "checkedAt": "2026-06-20",
                "purposes": ["command-existence", "option-semantics", "examples"],
            }],
            "updatedAt": "2026-06-20",
            "coverage": "Complete command list",
            "platforms": ["mac", "windows", "linux"],
            "order": 9,
        },
        "items": [
            {
                "cat": "shortcut",
                "cmd": "Ctrl+K",
                "en": "Open command",
                "zh": "打开命令",
                "evidenceRefs": [{
                    "sourceId": "official-docs",
                    "claims": ["existence", "semantics"],
                    "locator": "https://example.com/docs#ctrl-k",
                    "checkedAt": "2026-06-20",
                }],
                "evidenceStatus": "verified",
            }
        ],
        "summary": "updated",
    }


class HostValidationTests(unittest.TestCase):
    def test_rejects_path_traversal_and_unknown_mode(self):
        with self.assertRaises(host.ValidationError):
            host.validate_tool_id("../secret")
        with self.assertRaises(host.ValidationError):
            host.validate_tool_id("index")
        with self.assertRaises(host.ValidationError):
            host.validate_request(
                {"action": "update_tool", "tool": "safe", "display_name": "Safe", "mode": "write"}
            )

    def test_dataset_assigns_command_independent_id(self):
        first = host.validate_dataset(valid_dataset(), "sample")
        changed = valid_dataset()
        changed["items"][0]["cmd"] = "Ctrl+Shift+K"
        second = host.validate_dataset(changed, "sample")
        self.assertEqual(first["items"][0]["id"], second["items"][0]["id"])

    def test_duplicate_commands_are_deduplicated(self):
        payload = valid_dataset()
        payload["items"].append(dict(payload["items"][0], en="Other action"))
        # 同 cat/cmd/context 的重复条目被静默跳过，仅保留第一条
        deduped = host.validate_dataset(payload, "sample")
        self.assertEqual(len(deduped["items"]), 1)
        # 填上不同的 context 后两条都保留
        payload["items"][0]["context"] = "editor"
        payload["items"][1]["context"] = "terminal"
        both = host.validate_dataset(payload, "sample")
        self.assertEqual(len(both["items"]), 2)

    def test_extracts_claude_json_wrapper(self):
        wrapper = json.dumps({"result": json.dumps(valid_dataset())})
        self.assertEqual(host.extract_json_output(wrapper)["meta"]["id"], "sample")

    def test_validates_keywords_examples_and_quality_warning(self):
        payload = valid_dataset()
        payload["items"][0].update({
            "keywords": ["命令面板", "打开命令", "快捷操作"],
            "examples": [{
                "value": "Ctrl+K",
                "description": "打开命令面板",
                "copyable": False,
                "sourceType": "ai-derived",
                "sourceIds": ["official-docs"],
                "authorship": "editorial",
                "evidenceTier": "first-party",
                "adaptation": "adapted",
                "scenario": "需要快速打开命令入口时",
                "goal": "打开命令面板",
                "expected": "命令面板显示可用操作",
                "platformValues": {"mac": "Cmd+K", "windows": "Ctrl+K"},
            }],
        })
        dataset = host.validate_dataset(payload, "sample")
        self.assertEqual(
            dataset["items"][0]["keywords"], ["命令面板", "打开命令", "快捷操作"]
        )
        self.assertEqual(dataset["items"][0]["examples"][0]["platformValues"]["mac"], "Cmd+K")
        self.assertEqual(dataset["items"][0]["examples"][0]["sourceType"], "ai-derived")
        self.assertFalse(dataset["qualityWarnings"])

    def test_rejects_invalid_example_structure(self):
        payload = valid_dataset()
        payload["items"][0]["examples"] = [{"value": "", "description": "空命令"}]
        with self.assertRaisesRegex(host.ValidationError, "value"):
            host.validate_dataset(payload, "sample")

    def test_verified_requires_locator_and_both_core_claims(self):
        missing_locator = valid_dataset()
        missing_locator["items"][0]["evidenceRefs"][0]["locator"] = ""
        with self.assertRaisesRegex(host.ValidationError, "locator"):
            host.validate_dataset(missing_locator, "sample")

        missing_semantics = valid_dataset()
        missing_semantics["items"][0]["evidenceRefs"][0]["claims"] = ["existence"]
        with self.assertRaisesRegex(host.ValidationError, "推导为 partial"):
            host.validate_dataset(missing_semantics, "sample")

    def test_broad_or_single_claim_evidence_is_partial(self):
        payload = valid_dataset()
        payload["items"][0]["evidenceRefs"][0].update({
            "claims": ["existence"],
            "locator": "https://example.com/docs（页面内检索 Ctrl+K）",
        })
        payload["items"][0]["evidenceStatus"] = "partial"
        dataset = host.validate_dataset(payload, "sample")
        self.assertEqual(dataset["items"][0]["evidenceStatus"], "partial")

    def test_community_source_cannot_prove_command_semantics(self):
        payload = valid_dataset()
        payload["meta"]["sources"][0].update({
            "kind": "community",
            "evidenceTier": "community",
        })
        with self.assertRaisesRegex(host.ValidationError, "社区来源不能证明"):
            host.validate_dataset(payload, "sample")

    def test_rejects_unregistered_readthedocs_authoritative_source(self):
        payload = valid_dataset()
        payload["meta"]["sources"][0].update({
            "url": "https://unknown-project.readthedocs.io/en/latest/",
            "kind": "authoritative-reference",
            "evidenceTier": "authoritative-community",
        })
        with self.assertRaisesRegex(host.ValidationError, "来源登记"):
            host.validate_dataset(payload, "sample")

    def test_web_source_requires_resolved_url_title_and_check_date(self):
        for field in ("resolvedUrl", "pageTitle", "checkedAt"):
            payload = valid_dataset()
            payload["meta"]["sources"][0].pop(field)
            with self.subTest(field=field), self.assertRaisesRegex(
                host.ValidationError, "resolvedUrl、pageTitle 和 checkedAt"
            ):
                host.validate_dataset(payload, "sample")

    def test_accepts_registered_official_repository(self):
        payload = valid_dataset("codex")
        payload["meta"]["sources"][0].update({
            "id": "codex-repo",
            "registryId": "openai-codex-repository",
            "url": "https://github.com/openai/codex/releases",
            "kind": "official-repository",
            "resolvedUrl": "https://github.com/openai/codex/releases",
            "pageTitle": "Releases · openai/codex",
            "checkedAt": "2026-06-21",
        })
        payload["items"][0]["evidenceRefs"][0].update({
            "sourceId": "codex-repo",
            "locator": "https://github.com/openai/codex/releases",
        })
        dataset = host.validate_dataset(payload, "codex")
        self.assertEqual(dataset["meta"]["sources"][0]["kind"], "official-repository")

    def test_warns_when_example_coverage_is_low(self):
        payload = valid_dataset()
        payload["items"] = [
            dict(payload["items"][0], cmd=f"Ctrl+{index}", en=f"Command {index}")
            for index in range(6)
        ]
        dataset = host.validate_dataset(payload, "sample")
        self.assertIn("示例覆盖不足", dataset["qualityWarnings"][0])

    def test_rejects_dangerous_example_without_warning(self):
        payload = valid_dataset()
        payload["items"][0].update({
            "keywords": ["删除", "清理", "目录"],
            "examples": [{
                "value": "rm -rf ./example",
                "description": "删除目录",
                "sourceType": "ai-derived",
            }],
        })
        with self.assertRaisesRegex(host.ValidationError, "必须包含 warning"):
            host.validate_dataset(payload, "sample")


class HostFileTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.data_dir = pathlib.Path(self.temp.name) / "data"
        self.data_dir.mkdir()
        self.pending_dir = pathlib.Path(self.temp.name) / ".aicli-pending"
        self.patchers = [
            mock.patch.object(host, "DATA_DIR", str(self.data_dir)),
            mock.patch.object(host, "DATA_INDEX", str(self.data_dir / "index.js")),
            mock.patch.object(host, "PENDING_DIR", str(self.pending_dir)),
        ]
        for patcher in self.patchers:
            patcher.start()

    def tearDown(self):
        for patcher in reversed(self.patchers):
            patcher.stop()
        self.temp.cleanup()

    def test_atomic_write_preserves_old_file_when_replace_fails(self):
        target = self.data_dir / "sample.js"
        target.write_text("old", encoding="utf-8")
        with mock.patch.object(host.os, "replace", side_effect=OSError("failed")):
            with self.assertRaises(OSError):
                host.atomic_write(str(target), "new")
        self.assertEqual(target.read_text(encoding="utf-8"), "old")

    def test_remove_updates_index(self):
        (self.data_dir / "sample.js").write_text("sample", encoding="utf-8")
        (self.data_dir / "other.js").write_text("other", encoding="utf-8")
        result = host.remove_tool("sample")
        self.assertTrue(result["changed"])
        self.assertFalse((self.data_dir / "sample.js").exists())
        self.assertIn('"other"', (self.data_dir / "index.js").read_text(encoding="utf-8"))

    def test_remove_rolls_back_when_index_write_fails(self):
        target = self.data_dir / "sample.js"
        target.write_text("sample", encoding="utf-8")
        with mock.patch.object(host, "write_data_index", side_effect=OSError("failed")):
            with self.assertRaises(OSError):
                host.remove_tool("sample")
        self.assertEqual(target.read_text(encoding="utf-8"), "sample")

    def test_remove_rejects_builtin_tool(self):
        dataset = valid_dataset()
        dataset["meta"]["builtIn"] = True
        target = self.data_dir / "sample.js"
        target.write_text(host.render_data_file(dataset), encoding="utf-8")
        with self.assertRaisesRegex(host.ValidationError, "内置工具不可删除"):
            host.remove_tool("sample")
        self.assertTrue(target.exists())

    def test_add_uses_read_only_claude_and_writes_validated_files(self):
        discovery = {"sources": valid_dataset()["meta"]["sources"], "conflicts": [], "notes": []}
        stdout = json.dumps({"result": json.dumps(valid_dataset())})
        mock_proc = mock.MagicMock()
        mock_proc.communicate.side_effect = [
            (json.dumps({"result": json.dumps(discovery)}), ""),
            (stdout, ""),
        ]
        mock_proc.returncode = 0
        # 强制 _call_api_direct 返回 None，走 claude 子进程回退路径（不依赖 CI 是否设置 token）
        with mock.patch.object(host, "_call_api_direct", return_value=None), mock.patch.object(
            host, "CLAUDE_BIN", "/usr/bin/claude"
        ), mock.patch.object(host, "PROJECT_DIR", self.temp.name), mock.patch.object(
            host.subprocess, "Popen", return_value=mock_proc
        ) as popen:
            result = host.add_tool("sample", "Sample Tool")
        self.assertTrue(result["changed"])
        command = popen.call_args.args[0]
        self.assertIn("default", command)
        self.assertNotIn("plan", command)
        self.assertNotIn("acceptEdits", command)
        self.assertTrue((self.data_dir / "sample.js").exists())
        self.assertTrue((self.data_dir / "index.js").exists())

    def test_timeout_does_not_create_files(self):
        mock_proc = mock.MagicMock()
        mock_proc.communicate.side_effect = [
            host.subprocess.TimeoutExpired("claude", 900),
            ("", ""),
        ]
        with mock.patch.object(host, "_call_api_direct", return_value=None), mock.patch.object(
            host, "CLAUDE_BIN", "/usr/bin/claude"
        ), mock.patch.object(host, "PROJECT_DIR", self.temp.name), mock.patch.object(
            host.subprocess, "Popen", return_value=mock_proc
        ):
            with self.assertRaisesRegex(host.ValidationError, "超时"):
                host.add_tool("sample", "Sample Tool")
        self.assertFalse((self.data_dir / "sample.js").exists())

    def test_invalid_claude_output_does_not_create_files(self):
        mock_proc = mock.MagicMock()
        mock_proc.communicate.return_value = ("not json", "")
        mock_proc.returncode = 0
        with mock.patch.object(host, "_call_api_direct", return_value=None), mock.patch.object(
            host, "CLAUDE_BIN", "/usr/bin/claude"
        ), mock.patch.object(host, "PROJECT_DIR", self.temp.name), mock.patch.object(
            host.subprocess, "Popen", return_value=mock_proc
        ):
            with self.assertRaisesRegex(host.ValidationError, "JSON"):
                host.add_tool("sample", "Sample Tool")
        self.assertFalse((self.data_dir / "sample.js").exists())

    def test_prefer_web_forces_claude_even_with_token(self):
        # 勾选"联网核对"时即使有 token 也走 claude -p 联网路径，不调用直连 API。
        stdout = json.dumps({"result": json.dumps(valid_dataset())})
        discovery = {"sources": valid_dataset()["meta"]["sources"], "conflicts": [], "notes": []}
        mock_proc = mock.MagicMock()
        mock_proc.communicate.side_effect = [
            (json.dumps({"result": json.dumps(discovery)}), ""),
            (stdout, ""),
        ]
        mock_proc.returncode = 0
        api = mock.MagicMock()
        with mock.patch.object(host, "_has_api_token", return_value=True), mock.patch.object(
            host, "_call_api_direct", api
        ), mock.patch.object(host, "CLAUDE_BIN", "/usr/bin/claude"), mock.patch.object(
            host, "PROJECT_DIR", self.temp.name
        ), mock.patch.object(host.subprocess, "Popen", return_value=mock_proc):
            dataset = host.run_claude_query("sample", "Sample Tool", "add", prefer_web=True)
        api.assert_not_called()
        self.assertEqual(dataset["meta"]["verificationStatus"], "web-assisted")

    def test_token_without_prefer_web_uses_offline_api(self):
        # 不勾选时有 token 走直连 API 离线路径，不启动 claude 子进程。
        popen = mock.MagicMock()
        discovery = {"sources": valid_dataset()["meta"]["sources"], "conflicts": [], "notes": []}
        with mock.patch.object(host, "_has_api_token", return_value=True), mock.patch.object(
            host, "_call_api_direct", side_effect=[
                json.dumps(discovery), json.dumps(valid_dataset())
            ]
        ), mock.patch.object(host.subprocess, "Popen", popen):
            dataset = host.run_claude_query("sample", "Sample Tool", "add", prefer_web=False)
        popen.assert_not_called()
        self.assertEqual(dataset["meta"]["verificationStatus"], "model-knowledge")

    def test_prefer_web_without_claude_reports_clear_error(self):
        with mock.patch.object(host, "_has_api_token", return_value=True), mock.patch.object(
            host, "CLAUDE_BIN", None
        ):
            with self.assertRaisesRegex(host.ValidationError, "联网核对需要 Claude Code"):
                host.run_claude_query("sample", "Sample Tool", "add", prefer_web=True)

    def test_preview_apply_and_discard_update(self):
        old_dataset = valid_dataset()
        old_dataset["items"][0]["id"] = "stable-item"
        target = self.data_dir / "sample.js"
        target.write_text(host.render_data_file(old_dataset), encoding="utf-8")
        new_dataset = valid_dataset()
        new_dataset["items"][0].update(
            {"id": "stable-item", "cmd": "Ctrl+Shift+K", "zh": "打开新命令"}
        )
        new_dataset["items"].append(
            {
                "id": "new-item",
                "cat": "slash",
                "cmd": "/new",
                "en": "New command",
                "zh": "新命令",
                "evidenceStatus": "unverified",
            }
        )
        with mock.patch.object(
            host, "run_claude_query", return_value=host.validate_dataset(new_dataset, "sample")
        ):
            preview = host.preview_update("sample", "Sample Tool")
        self.assertTrue(preview["changed"])
        self.assertEqual(preview["diff"]["counts"]["added"], 1)
        self.assertEqual(preview["diff"]["counts"]["modified"], 1)
        applied = host.apply_update(preview["pendingToken"])
        self.assertTrue(applied["changed"])
        self.assertIn("Ctrl+Shift+K", target.read_text(encoding="utf-8"))

        with mock.patch.object(
            host, "run_claude_query", return_value=host.validate_dataset(old_dataset, "sample")
        ):
            second_preview = host.preview_update("sample", "Sample Tool")
        discarded = host.discard_update(second_preview["pendingToken"])
        self.assertFalse(discarded["changed"])

    def test_preview_matches_legacy_items_without_ids(self):
        old_dataset = valid_dataset()
        target = self.data_dir / "sample.js"
        target.write_text(host.render_data_file(old_dataset), encoding="utf-8")
        normalized_old = host.validate_dataset(old_dataset, "sample", require_structured_source=False)
        new_dataset = valid_dataset()
        new_dataset["items"][0].update(
            {"id": normalized_old["items"][0]["id"], "zh": "修改后的说明"}
        )
        with mock.patch.object(
            host, "run_claude_query", return_value=host.validate_dataset(new_dataset, "sample")
        ):
            preview = host.preview_update("sample", "Sample Tool")
        self.assertEqual(preview["diff"]["counts"]["added"], 0)
        self.assertEqual(preview["diff"]["counts"]["removed"], 0)
        self.assertEqual(preview["diff"]["counts"]["modified"], 1)

    def test_preview_preserves_existing_examples(self):
        old_dataset = valid_dataset()
        old_dataset["items"][0].update({
            "id": "stable-item",
            "keywords": ["命令面板", "打开命令", "快捷操作"],
            "examples": [{
                "value": "Ctrl+K",
                "description": "打开命令",
                "copyable": False,
                "sourceType": "manual",
            }],
        })
        target = self.data_dir / "sample.js"
        target.write_text(host.render_data_file(old_dataset), encoding="utf-8")
        new_dataset = valid_dataset()
        new_dataset["items"][0]["id"] = "stable-item"
        new_dataset["items"][0]["zh"] = "打开命令面板"
        with mock.patch.object(
            host, "run_claude_query", return_value=host.validate_dataset(new_dataset, "sample")
        ):
            preview = host.preview_update("sample", "Sample Tool")
        _, pending = host.load_pending(preview["pendingToken"])
        item = pending["dataset"]["items"][0]
        self.assertEqual(item["keywords"], ["命令面板", "打开命令", "快捷操作"])
        self.assertEqual(item["examples"][0]["value"], "Ctrl+K")
        self.assertEqual(item["examples"][0]["sourceType"], "manual")

    def test_apply_rejects_changed_source_file(self):
        old_dataset = valid_dataset()
        old_dataset["items"][0]["id"] = "stable-item"
        target = self.data_dir / "sample.js"
        target.write_text(host.render_data_file(old_dataset), encoding="utf-8")
        new_dataset = valid_dataset()
        new_dataset["items"][0].update({"id": "stable-item", "cmd": "Ctrl+Shift+K"})
        with mock.patch.object(
            host, "run_claude_query", return_value=host.validate_dataset(new_dataset, "sample")
        ):
            preview = host.preview_update("sample", "Sample Tool")
        target.write_text("externally changed", encoding="utf-8")
        with self.assertRaisesRegex(host.ValidationError, "重新检查更新"):
            host.apply_update(preview["pendingToken"])

    def test_high_risk_update_requires_explicit_confirmation(self):
        old_dataset = valid_dataset()
        old_dataset["items"] = [
            {
                "id": f"item-{index}",
                "cat": "slash",
                "cmd": f"/cmd-{index}",
                "en": f"Command {index}",
                "zh": f"命令 {index}",
            }
            for index in range(12)
        ]
        target = self.data_dir / "sample.js"
        target.write_text(host.render_data_file(old_dataset), encoding="utf-8")
        new_dataset = valid_dataset()
        new_dataset["items"][0]["id"] = "item-0"
        with mock.patch.object(
            host, "run_claude_query", return_value=host.validate_dataset(new_dataset, "sample")
        ):
            preview = host.preview_update("sample", "Sample Tool")
        self.assertTrue(preview["diff"]["risks"])
        with self.assertRaisesRegex(host.ValidationError, "高风险变化"):
            host.apply_update(preview["pendingToken"])
        applied = host.apply_update(preview["pendingToken"], confirm_risk=True)
        self.assertTrue(applied["changed"])


class HostApiTests(unittest.TestCase):
    def _fake_conn(self, status, body):
        conn = mock.MagicMock()
        resp = mock.MagicMock()
        resp.status = status
        resp.read.return_value = body.encode("utf-8")
        conn.getresponse.return_value = resp
        return conn

    def test_returns_none_without_token(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            self.assertIsNone(host._call_api_direct("prompt"))

    def test_success_returns_text_and_uses_base_url(self):
        body = json.dumps(
            {"stop_reason": "end_turn", "content": [{"type": "text", "text": '{"ok": true}'}]}
        )
        conn = self._fake_conn(200, body)
        env = {
            "ANTHROPIC_AUTH_TOKEN": "tok-123",
            "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
            "ANTHROPIC_MODEL": "deepseek-v4-pro",
        }
        with mock.patch.dict(os.environ, env, clear=True), mock.patch.object(
            host.http.client, "HTTPSConnection", return_value=conn
        ) as conn_cls:
            text = host._call_api_direct("prompt")
        self.assertEqual(text, '{"ok": true}')
        self.assertEqual(conn_cls.call_args.args[0], "api.deepseek.com")
        method, path = conn.request.call_args.args[0], conn.request.call_args.args[1]
        self.assertEqual(method, "POST")
        self.assertTrue(path.endswith("/v1/messages"))
        self.assertIn("/anthropic/", path)
        self.assertEqual(conn.request.call_args.kwargs["headers"]["x-api-key"], "tok-123")

    def test_raises_on_truncation(self):
        body = json.dumps(
            {"stop_reason": "max_tokens", "content": [{"type": "text", "text": "{partial"}]}
        )
        conn = self._fake_conn(200, body)
        env = {"ANTHROPIC_AUTH_TOKEN": "tok", "ANTHROPIC_BASE_URL": "https://api.anthropic.com"}
        with mock.patch.dict(os.environ, env, clear=True), mock.patch.object(
            host.http.client, "HTTPSConnection", return_value=conn
        ):
            with self.assertRaisesRegex(host.ValidationError, "截断"):
                host._call_api_direct("prompt")

    def test_raises_on_http_error(self):
        conn = self._fake_conn(401, '{"error":"unauthorized"}')
        env = {"ANTHROPIC_API_KEY": "tok", "ANTHROPIC_BASE_URL": "https://api.anthropic.com"}
        with mock.patch.dict(os.environ, env, clear=True), mock.patch.object(
            host.http.client, "HTTPSConnection", return_value=conn
        ):
            with self.assertRaisesRegex(host.ValidationError, "API 错误"):
                host._call_api_direct("prompt")


class HostDiffEnrichmentTests(unittest.TestCase):
    def _with_id(self, item_id="i1"):
        dataset = valid_dataset()
        dataset["items"][0]["id"] = item_id
        return dataset

    def test_diff_flags_source_domain_change(self):
        old = self._with_id()
        new = self._with_id()
        new["meta"]["sourceUrl"] = "https://other-host.example.org/docs"
        diff = host.build_dataset_diff(old, new)
        self.assertTrue(any("域名" in risk for risk in diff["risks"]))

    def test_diff_flags_builtin_toggle(self):
        old = self._with_id()
        old["meta"]["builtIn"] = False
        new = self._with_id()
        new["meta"]["builtIn"] = True
        diff = host.build_dataset_diff(old, new)
        self.assertTrue(any("内置工具标记" in risk for risk in diff["risks"]))

    def test_diff_clean_update_has_no_risks(self):
        old = self._with_id()
        new = self._with_id()
        new["items"][0]["zh"] = "打开命令面板"
        diff = host.build_dataset_diff(old, new)
        self.assertEqual(diff["risks"], [])
        self.assertEqual(diff["counts"]["modified"], 1)

    def test_diff_flags_new_repository_and_source_conflict(self):
        old_payload = valid_dataset("codex")
        old_payload["items"][0]["id"] = "item-1"
        old = host.validate_dataset(old_payload, "codex")
        new_payload = valid_dataset("codex")
        new_payload["items"][0]["id"] = "item-1"
        new_payload["meta"]["sources"].append({
            "id": "codex-repo",
            "registryId": "openai-codex-repository",
            "title": "Codex repository",
            "url": "https://github.com/openai/codex/releases",
            "kind": "official-repository",
            "maintainer": "OpenAI",
            "evidenceTier": "first-party",
            "lastVerifiedAt": "2026-06-21",
            "resolvedUrl": "https://github.com/openai/codex/releases",
            "pageTitle": "Releases · openai/codex",
            "checkedAt": "2026-06-21",
            "purposes": ["release-notes"],
        })
        new_payload["sourceConflicts"] = ["官方文档与 Release 的命令状态不同"]
        new = host.validate_dataset(new_payload, "codex")
        diff = host.build_dataset_diff(old, new)
        self.assertEqual(len(diff["sourceChanges"]["added"]), 1)
        self.assertEqual(len(diff["sourceChanges"]["conflicts"]), 1)
        self.assertTrue(any("新增需确认来源" in risk for risk in diff["risks"]))

    def test_diff_flags_item_evidence_status_downgrade(self):
        old = self._with_id("item-1")
        new = self._with_id("item-1")
        new["items"][0].pop("evidenceRefs")
        new["items"][0]["evidenceStatus"] = "unverified"
        diff = host.build_dataset_diff(old, new)
        self.assertEqual(diff["sourceChanges"]["statusDowngrades"], ["item-1"])
        self.assertEqual(diff["sourceChanges"]["evidenceRefChanges"], ["item-1"])
        self.assertEqual(diff["sourceChanges"]["locatorLosses"], ["item-1"])
        self.assertTrue(any("核验状态下降" in risk for risk in diff["risks"]))

    def test_quality_warning_flags_keyword_gap(self):
        warnings = host.build_quality_warnings(valid_dataset())
        self.assertTrue(any("语义关键词覆盖不足" in warning for warning in warnings))

    def test_quality_warning_flags_example_regression(self):
        previous = valid_dataset()
        previous["items"][0]["examples"] = [
            {"value": "Ctrl+K", "description": "打开命令", "sourceType": "manual"}
        ]
        current = valid_dataset()  # 当前条目无 examples，覆盖率从 1 降至 0
        warnings = host.build_quality_warnings(current, previous)
        self.assertTrue(any("降至" in warning for warning in warnings))

    def test_preserve_keeps_reviewed_examples_over_new(self):
        old = self._with_id()
        old["items"][0]["keywords"] = ["命令面板", "打开命令", "快捷操作"]
        old["items"][0]["examples"] = [
            {"value": "old", "description": "旧示例", "sourceType": "manual"}
        ]
        new = self._with_id()
        new["items"][0]["examples"] = [
            {"value": "new", "description": "新示例", "sourceType": "ai-derived"}
        ]
        # new 缺 keywords
        merged = host.preserve_existing_enrichment(old, new)
        # 已人工审核(manual)的旧示例优先于新生成的 ai-derived
        self.assertEqual(merged["items"][0]["examples"][0]["value"], "old")
        # 旧 keywords 在新数据缺失时被保留
        self.assertEqual(merged["items"][0]["keywords"], ["命令面板", "打开命令", "快捷操作"])


class HostSourceTierGenerationTests(unittest.TestCase):
    def test_prompt_web_enabled_allows_quasi_official_with_whitelist(self):
        prompt = host.build_prompt("sample", "Sample", "add", web_enabled=True)
        self.assertIn("quasi-official", prompt)
        self.assertIn("官方文档优先", prompt)
        # 白名单动态注入：每个域名都应出现在 prompt 中
        for domain in host.QUASI_OFFICIAL_DOMAINS:
            self.assertIn(domain, prompt)
        self.assertIn("每个 item 必须提供 evidenceRefs", prompt)
        self.assertNotIn("目标 50 条以上", prompt)

    def test_source_discovery_prompt_precedes_content_generation(self):
        prompt = host.build_source_discovery_prompt(
            "codex", "Codex CLI", "update", web_enabled=True
        )
        self.assertIn("来源发现", prompt)
        self.assertIn("official-repository", prompt)
        self.assertIn("tldr 只适合实用案例", prompt)
        self.assertIn("https://github.com/openai/codex", prompt)

    def test_prompt_offline_forbids_quasi_official(self):
        prompt = host.build_prompt("sample", "Sample", "add", web_enabled=False)
        self.assertIn("禁止使用 quasi-official", prompt)
        self.assertIn("没有联网", prompt)

    def test_demote_quasi_official_downgrades_meta_and_examples(self):
        dataset = {
            "meta": {"sourceTier": "quasi-official"},
            "items": [{
                "evidenceRefs": [{
                    "sourceId": "docs",
                    "claims": ["existence", "semantics"],
                    "locator": "https://example.com/docs#x",
                    "checkedAt": "2026-06-21",
                }],
                "evidenceStatus": "verified",
                "examples": [
                    {"value": "x", "description": "d", "sourceType": "quasi-official",
                     "sourceUrl": "https://man7.org/x"},
                    {"value": "y", "description": "d", "sourceType": "official",
                     "sourceUrl": "https://official.example/y"},
                ],
            }],
        }
        host._demote_quasi_official(dataset)
        self.assertEqual(dataset["meta"]["sourceTier"], "community")
        self.assertNotIn("evidenceRefs", dataset["items"][0])
        self.assertEqual(dataset["items"][0]["evidenceStatus"], "unverified")
        examples = dataset["items"][0]["examples"]
        # 类官方示例降为 ai-derived 并去掉未核实的 URL
        self.assertEqual(examples[0]["sourceType"], "ai-derived")
        self.assertNotIn("sourceUrl", examples[0])
        # 非类官方示例不受影响
        self.assertEqual(examples[1]["sourceType"], "official")
        self.assertEqual(examples[1]["sourceUrl"], "https://official.example/y")

    def test_demote_leaves_official_tier_untouched(self):
        dataset = {"meta": {"sourceTier": "official"}, "items": []}
        host._demote_quasi_official(dataset)
        self.assertEqual(dataset["meta"]["sourceTier"], "official")

    def test_rejects_invalid_example_platform_values(self):
        payload = valid_dataset()
        payload["items"][0].update({
            "keywords": ["a", "b", "c"],
            "examples": [{
                "value": "cmd",
                "description": "示例",
                "sourceType": "ai-derived",
                "platformValues": {"solaris": "cmd"},
            }],
        })
        with self.assertRaisesRegex(host.ValidationError, "平台非法"):
            host.validate_dataset(payload, "sample")

    def test_lenient_contract_accepts_missing_keywords_and_examples(self):
        # 锁定“生成端宽松”契约：缺 keywords/examples 不报错，但两项都产生覆盖告警。
        # 与仓库端 validate-data.js 的严格必填刻意不同（见 data/SCHEMA.md 校验契约）。
        dataset = host.validate_dataset(valid_dataset(), "sample")
        self.assertNotIn("keywords", dataset["items"][0])
        self.assertNotIn("examples", dataset["items"][0])
        self.assertTrue(any("示例覆盖不足" in warning for warning in dataset["qualityWarnings"]))
        self.assertTrue(any("语义关键词覆盖不足" in warning for warning in dataset["qualityWarnings"]))

    def test_id_collisions_recover_with_command_hash(self):
        # 同 cat/en、无 context 但 cmd 不同：稳定 ID 会碰撞，应通过追加 cmd 重哈希恢复唯一
        payload = valid_dataset()
        payload["items"] = [
            {
                "cat": "slash",
                "cmd": f"/cmd-{index}",
                "en": "Run",
                "zh": f"运行 {index}",
                "evidenceStatus": "unverified",
            }
            for index in range(3)
        ]
        dataset = host.validate_dataset(payload, "sample")
        ids = [item["id"] for item in dataset["items"]]
        self.assertEqual(len(dataset["items"]), 3)
        self.assertEqual(len(set(ids)), 3, "碰撞条目应重哈希为唯一 ID")


if __name__ == "__main__":
    unittest.main()
