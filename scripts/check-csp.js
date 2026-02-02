#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const netlifyToml = join(root, "netlify.toml");

console.log("🔍 Checking CSP configuration in netlify.toml...\n");

if (!existsSync(netlifyToml)) {
  console.error("❌ SECURITY GATE FAILED: netlify.toml not found!");
  process.exit(1);
}

const content = readFileSync(netlifyToml, "utf8");
const match = content.match(/Content-Security-Policy\s*=\s*"([^"]+)"/i);

if (!match) {
  console.error("❌ SECURITY GATE FAILED: Content-Security-Policy header not found!");
  process.exit(1);
}

const csp = match[1];
const violations = [];

if (/script-src[^;]*'unsafe-inline'/i.test(csp)) violations.push("script-src contains unsafe-inline");
if (/script-src[^;]*'unsafe-eval'/i.test(csp)) violations.push("script-src contains unsafe-eval");
if (/script-src\s+\*/i.test(csp)) violations.push("script-src contains wildcard *");
if (/default-src\s+\*/i.test(csp)) violations.push("default-src contains wildcard *");

if (!/default-src\s+/i.test(csp)) violations.push("missing default-src");
if (!/script-src\s+/i.test(csp)) violations.push("missing script-src");

if (violations.length) {
  console.error("❌ SECURITY GATE FAILED: CSP is too permissive or missing directives:\n");
  for (const v of violations) console.error("  - " + v);
  process.exit(1);
}

console.log("✅ CSP checks passed.\n");
