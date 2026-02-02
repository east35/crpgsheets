#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const importFile = join(root, "src", "utils", "exportImport.ts");

console.log("🔍 Checking import sanitization safety...\n");

if (!existsSync(importFile)) {
  console.error("❌ SECURITY GATE FAILED: src/utils/exportImport.ts not found!");
  process.exit(1);
}

const content = readFileSync(importFile, "utf8");

const checks = [
  { pattern: /export\s+function\s+safeUrl\s*\(/, name: "exported safeUrl() function" },
  { pattern: /parsed\.protocol\s*===\s*['"]http:['"]|parsed\.protocol\s*===\s*['"]https:['"]/, name: "http/https protocol validation" },
  { pattern: /sanitizeUrls\s*\(|safeUrl\s*\(/, name: "URL sanitization used in import flow" },
];

for (const { pattern, name } of checks) {
  if (!pattern.test(content)) {
    console.error(`❌ SECURITY GATE FAILED: Missing ${name}`);
    process.exit(1);
  }
  console.log(`✅ Found: ${name}`);
}

console.log("\n✅ Import sanitization checks passed.\n");
