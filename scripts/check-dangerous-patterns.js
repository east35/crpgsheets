#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, "src");

const BANNED = [
  { regex: /dangerouslySetInnerHTML/g, name: "dangerouslySetInnerHTML" },
  { regex: /\.innerHTML\s*=/g, name: ".innerHTML =" },
  { regex: /\beval\s*\(/g, name: "eval(" },
  { regex: /new\s+Function\s*\(/g, name: "new Function(" },
];

const EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);

function scanFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const out = [];

  for (const { regex, name } of BANNED) {
    for (let i = 0; i < lines.length; i++) {
      regex.lastIndex = 0;
      if (regex.test(lines[i])) out.push({ file: filePath, line: i + 1, pattern: name });
    }
  }
  return out;
}

function scanDir(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry !== "node_modules" && !entry.startsWith(".")) out = out.concat(scanDir(full));
    } else if (st.isFile() && EXT.has(extname(entry))) {
      out = out.concat(scanFile(full));
    }
  }
  return out;
}

console.log("🔍 Scanning src/ for dangerous patterns...\n");
const violations = scanDir(srcDir);

if (violations.length) {
  console.error("❌ SECURITY GATE FAILED: Dangerous patterns found!\n");
  for (const v of violations) {
    const rel = v.file.replace(root + "/", "");
    console.error(`  ${rel}:${v.line} - ${v.pattern}`);
  }
  console.error(`\nTotal: ${violations.length} violation(s)\n`);
  process.exit(1);
}

console.log("✅ No dangerous patterns found.\n");
