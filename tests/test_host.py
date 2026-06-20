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

    def test_duplicate_commands_require_context(self):
        payload = valid_dataset()
        payload["items"].append(dict(payload["items"][0], en="Other action"))
        with self.assertRaises(host.ValidationError):
            host.validate_dataset(payload, "sample")
        payload["items"][0]["context"] = "editor"
        payload["items"][1]["context"] = "terminal"
        host.validate_dataset(payload, "sample")

    def test_extracts_claude_json_wrapper(self):
        wrapper = json.dumps({"result": json.dumps(valid_dataset())})
        self.assertEqual(host.extract_json_output(wrapper)["meta"]["id"], "sample")


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

    def test_add_uses_read_only_claude_and_writes_validated_files(self):
        completed = types.SimpleNamespace(
            returncode=0,
            stdout=json.dumps({"result": json.dumps(valid_dataset())}),
            stderr="",
        )
        with mock.patch.object(host, "CLAUDE_BIN", "/usr/bin/claude"), mock.patch.object(
            host, "PROJECT_DIR", self.temp.name
        ), mock.patch.object(host.subprocess, "run", return_value=completed) as run:
            result = host.add_tool("sample", "Sample Tool")
        self.assertTrue(result["changed"])
        command = run.call_args.args[0]
        self.assertIn("plan", command)
        self.assertNotIn("acceptEdits", command)
        self.assertTrue((self.data_dir / "sample.js").exists())
        self.assertTrue((self.data_dir / "index.js").exists())

    def test_timeout_does_not_create_files(self):
        with mock.patch.object(host, "CLAUDE_BIN", "/usr/bin/claude"), mock.patch.object(
            host, "PROJECT_DIR", self.temp.name
        ), mock.patch.object(
            host.subprocess,
            "run",
            side_effect=host.subprocess.TimeoutExpired("claude", 900),
        ):
            with self.assertRaisesRegex(host.ValidationError, "超时"):
                host.add_tool("sample", "Sample Tool")
        self.assertFalse((self.data_dir / "sample.js").exists())

    def test_invalid_claude_output_does_not_create_files(self):
        completed = types.SimpleNamespace(returncode=0, stdout="not json", stderr="")
        with mock.patch.object(host, "CLAUDE_BIN", "/usr/bin/claude"), mock.patch.object(
            host, "PROJECT_DIR", self.temp.name
        ), mock.patch.object(host.subprocess, "run", return_value=completed):
            with self.assertRaisesRegex(host.ValidationError, "JSON"):
                host.add_tool("sample", "Sample Tool")
        self.assertFalse((self.data_dir / "sample.js").exists())

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
            {"id": "new-item", "cat": "slash", "cmd": "/new", "en": "New command", "zh": "新命令"}
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


if __name__ == "__main__":
    unittest.main()
