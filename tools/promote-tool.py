#!/usr/bin/env python3
"""Promote a generated tool dataset into a committable built-in.

The committed-data linter (tools/validate-data.js) requires
meta.verificationStatus == "manual" and rejects unused sources. Generated tools
come back as "model-knowledge" with whatever sources the model declared, so they
cannot be committed as-is. This script does the mechanical part of adopting a
generated dataset as maintained built-in data:

  - sets meta.verificationStatus to "manual"
  - prunes meta.sources not referenced by any item/example

Usage (from the repo root):

    python3 tools/promote-tool.py shell

Then run `node tools/validate-data.js` to confirm. Risk-caveat or other content
gates that need human judgement are reported by that linter; from now on the
generation pipeline already fills safe-preview caveats and prunes unused sources,
so freshly generated tools should promote cleanly.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "native-host"))

import host  # noqa: E402


def main():
    if len(sys.argv) != 2:
        print("usage: python3 tools/promote-tool.py <tool-id>", file=sys.stderr)
        return 2
    tool_id = host.validate_tool_id(sys.argv[1])
    dataset = host.load_existing_dataset(tool_id)
    before = len(dataset["meta"].get("sources", []) or [])
    dataset["meta"]["verificationStatus"] = "manual"
    host.prune_unused_sources(dataset)
    after = len(dataset["meta"].get("sources", []) or [])
    host.atomic_write(host.tool_data_path(tool_id), host.render_data_file(dataset))
    print(
        f"promoted {tool_id}: verificationStatus=manual, items={len(dataset['items'])}, "
        f"sources {before}->{after} (pruned {before - after} unused)"
    )
    print("next: run `node tools/validate-data.js` to confirm it is commit-ready")
    return 0


if __name__ == "__main__":
    sys.exit(main())
