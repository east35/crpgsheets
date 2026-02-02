#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGE_DIRS = ["public", "src"]; // adjust if needed
const MAX_WIDTH = 1920;
const QUALITY = 80;

function walk(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(png|jpe?g|webp)$/i.test(file)) {
      results.push(full);
    }
  }
  return results;
}

async function optimize(file) {
  const img = sharp(file);
  const meta = await img.metadata();

  if (!meta.width || meta.width <= MAX_WIDTH) return;

  const tmp = file + ".tmp";

  await img
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toFormat("webp", { quality: QUALITY })
    .toFile(tmp);

  fs.renameSync(tmp, file.replace(/\.(png|jpe?g)$/i, ".webp"));
  if (!file.endsWith(".webp")) fs.unlinkSync(file);

  console.log("Optimized:", file);
}

(async () => {
  const files = IMAGE_DIRS.flatMap((d) =>
    fs.existsSync(d) ? walk(d) : []
  );

  for (const file of files) {
    try {
      await optimize(file);
    } catch (e) {
      console.error("Failed to optimize", file, e.message);
    }
  }
})();
