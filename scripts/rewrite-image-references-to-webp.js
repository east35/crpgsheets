#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Where images live
const IMAGE_ROOTS = ["public", "src"];

// Where references live
const REWRITE_ROOTS = ["src", "public", "index.html"];

function walk(dir) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = fs.statSync(full);
    if (st.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

function isTextFile(p) {
  return /\.(ts|tsx|js|jsx|css|scss|sass|html|json|md)$/i.test(p) || path.basename(p) === "index.html";
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toRepoRelative(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

// 1) Find all existing .webp files
const webps = new Set();

for (const root of IMAGE_ROOTS) {
  for (const f of walk(root)) {
    if (f.toLowerCase().endsWith(".webp")) {
      webps.add(toRepoRelative(f));
    }
  }
}

// 2) Build replacement map: foo.png -> foo.webp, foo.jpg -> foo.webp
const replacements = [];
for (const webp of webps) {
  replacements.push(
    { from: webp.replace(/\.webp$/i, ".png"), to: webp },
    { from: webp.replace(/\.webp$/i, ".jpg"), to: webp },
    { from: webp.replace(/\.webp$/i, ".jpeg"), to: webp },
  );
}

if (!replacements.length) {
  console.log("No .webp files found. Nothing to rewrite.");
  process.exit(0);
}

let filesTouched = 0;

// 3) Rewrite references
for (const root of REWRITE_ROOTS) {
  const fullRoot = path.join(ROOT, root);
  const targets =
    fs.existsSync(fullRoot) && fs.statSync(fullRoot).isDirectory()
      ? walk(fullRoot)
      : fs.existsSync(fullRoot)
      ? [fullRoot]
      : [];

  for (const file of targets) {
    if (!isTextFile(file)) continue;

    let content = fs.readFileSync(file, "utf8");
    let changed = false;

    for (const { from, to } of replacements) {
      const variants = [
        from,
        "./" + from,
        "/" + from,
      ];

      for (const v of variants) {
        const re = new RegExp(escapeRegExp(v), "g");
        if (re.test(content)) {
          content = content.replace(re, v.replace(from, to));
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(file, content, "utf8");
      filesTouched++;
    }
  }
}

console.log(`Updated image references in ${filesTouched} file(s).`);
