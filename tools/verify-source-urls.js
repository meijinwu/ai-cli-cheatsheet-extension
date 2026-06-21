#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, "data", "index.js"), "utf8"), context);
for (const toolId of context.window.CHEATSHEET_FILES) {
  vm.runInContext(fs.readFileSync(path.join(root, "data", `${toolId}.js`), "utf8"), context);
}

const sources = [];
for (const [toolId, tool] of Object.entries(context.window.CHEATSHEET_DATA)) {
  for (const source of [...(tool.meta.sources || []), ...(tool.meta.references || [])]) {
    if (source.kind !== "local-help") sources.push({ toolId, source });
  }
}

function normalizeUrl(value) {
  const parsed = new URL(value);
  parsed.hash = "";
  return parsed.href.replace(/\/$/, "");
}

async function verify({ toolId, source }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "ai-cli-cheatsheet-source-verifier/1.0" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const finalUrl = normalizeUrl(response.url);
    const declaredUrl = normalizeUrl(source.resolvedUrl);
    if (finalUrl !== declaredUrl) {
      throw new Error(`redirect drift: declared ${declaredUrl}, actual ${finalUrl}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const html = await response.text();
      const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
        ?.replace(/\s+/g, " ").trim();
      if (!title) throw new Error("page title missing");
      const expectedTokens = String(source.pageTitle || "")
        .toLowerCase().match(/[a-z0-9][a-z0-9-]{2,}/g) || [];
      if (expectedTokens.length && !expectedTokens.some((token) =>
        title.toLowerCase().includes(token)
      )) {
        throw new Error(`page title drift: declared "${source.pageTitle}", actual "${title}"`);
      }
    }
    return `${toolId}:${source.id} OK`;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const failures = [];
  const pending = [...sources];
  const workers = Array.from({ length: 4 }, async () => {
    while (pending.length) {
      const candidate = pending.shift();
      try {
        console.log(await verify(candidate));
      } catch (error) {
        failures.push(`${candidate.toolId}:${candidate.source.id} ${error.message}`);
      }
    }
  });
  await Promise.all(workers);
  if (failures.length) {
    console.error(`Source verification failed (${failures.length}):\n${failures.join("\n")}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
