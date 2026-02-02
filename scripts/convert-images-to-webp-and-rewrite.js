#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

// Where images live (add folders if you have them)
const IMAGE_ROOTS = ["public", "src"];

// Where code/refs live (add folders if you have them)
const REWRITE_ROOTS = ["src", "public", "index.html"];

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const MAX_WIDTH = 4096;       // still prevents accidental huge images; set higher if desired
const WEBP_QUALITY = 82;

const DRY_RUN = process.argv.includes("--dry-run");
const KEEP_ORIGINALS = process.argv.includes("--keep-originals");

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
  const rel = path.relative(ROOT, p);
  return rel.split(path.sep).join("/");
}

// Replace: exact path, and same path with leading ./ or /
function replaceAll(content, fromPath, toPath) {
  const variants = [
    { from: fromPath, to: toPath },
    { from: "./" + fromPath, to: "./" + toPath },
    { from: "/" + fromPath, to: "/" + toPath },
  ];

  let changed = false;
  for (const v of variants) {
    const re = new RegExp(escapeRegExp(v.from), "g");
    const next = content.replace(re, v.to);
    if (next !== content) changed = true;
    content = next;
  }
  return { content, changed };
}

async function convertToWebp(inFile) {
  const ext = path.extname(inFile).toLowerCase();
  if (!EXTENSIONS.has(ext)) return null;

  // Skip already-webp references
  const outFile = inFile.replace(/\.(png|jpe?g)$/i, ".webp");
  if (fs.existsSync(outFile)) {
    // If webp already exists, optionally delete original so repo is consistent
    if (!KEEP_ORIGINALS && !DRY_RUN) {
      fs.unlinkSync(inFile);
    }
    return { inFile, outFile };
  }

  const img = sharp(inFile);
  const meta = await img.metadata();

  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (!DRY_RUN) {
    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outFile);
    if (!KEEP_ORIGINALS) fs.unlinkSync(inFile);
  }

  return { inFile, outFile };
}

function rewriteFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return false;
  const st = fs.statSync(filePath);
  if (st.isDirectory()) return false;
  if (!isTextFile(filePath)) return false;

  let content = fs.readFileSync(filePath, "utf8");
  let changedAny = false;

  for (const { from, to } of replacements) {
    const r = replaceAll(content, from, to);
    content = r.content;
    if (r.changed) changedAny = true;
  }

  if (changedAny && !DRY_RUN) {
    fs.writeFileSync(filePath, content, "utf8");
  }
  return changedAny;
}

(async () => {
  console.log(DRY_RUN ? "🧪 DRY RUN: no files will be written\n" : "🚀 Converting ALL images to WebP + rewriting references\n");
  console.log(KEEP_ORIGINALS ? "Mode: keep originals\n" : "Mode: delete originals\n");

  // 1) Convert every png/jpg/jpeg in IMAGE_ROOTS
  const allFiles = IMAGE_ROOTS.flatMap((d) => (fs.existsSync(d) ? walk(d) : []));
  const imageFiles = allFiles.filter((p) => EXTENSIONS.has(path.extname(p).toLowerCase()));

  const conversions = [];
  for (const f of imageFiles) {
    try {
      const result = await convertToWebp(f);
      if (result) conversions.push(result);
    } catch (e) {
      console.error("Failed to convert:", f, e?.message || e);
      process.exitCode = 1;
    }
  }

  if (!conversions.length) {
    console.log("No images found to convert.\n");
    return;
  }

  const replacements = conversions.map(({ inFile, outFile }) => ({
    from: toRepoRelative(inFile),
    to: toRepoRelative(outFile),
  }));

  console.log(`Planned conversions: ${replacements.length}`);
  console.log("");

  // 2) Rewrite references everywhere in REWRITE_ROOTS
  const rewriteTargets = [];
  for (const r of REWRITE_ROOTS) {
    const full = path.join(ROOT, r);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) rewriteTargets.push(...walk(full));
    else if (fs.existsSync(full)) rewriteTargets.push(full);
  }

  let touched = 0;
  for (const f of rewriteTargets) {
    if (rewriteFile(f, replacements)) touched++;
  }

  console.log(`Rewrote references in ${touched} file(s).`);
  console.log(DRY_RUN ? "\nDry run complete." : "\nDone.");
})();
