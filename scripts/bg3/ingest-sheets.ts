/**
 * CSV Ingestion for BG3 Data
 * Reads: bg3 reference csv/*.csv
 * Outputs: src/games/baldurs-gate-3/data/*.json
 *
 * Notes:
 * - CSVs are the source of truth (no merge with existing JSON).
 * - Handles repeated headers by suffixing (e.g., text, text_2).
 * - Skips build-related CSVs for now.
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_DIR = path.join(__dirname, '../../bg3 reference csv');
const DATA_DIR = path.join(__dirname, '../../src/games/baldurs-gate-3/data');
const PUBLIC_IMAGE_DIR = path.join(__dirname, '../../public/images/bg3');
const PUBLIC_IMAGE_BASE = '/images/bg3';

const SKIP_FILES = new Set([
  'BG3 Builds Compilation (by JRandall0308) - BG3 Builds Compilation (by JRandall0308).csv',
]);

const IMAGE_DATASETS = new Set([
  'actions',
  'weapons',
  'wearables',
  'features',
  'conditions',
  'races',
  'classes',
  'permanent_bonuses',
  'elixirs',
  'grenades',
  'arrows',
  'areas',
  'potions',
]);

const imageCache = new Map<string, string>();
const missingImages: Array<{ dataset: string; name: string; reason: string }> = [];

// Standard ID generation to match existing files
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

// Robust CSV Line Parser (handles quoted values containing commas)
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Double quote inside quotes -> single quote
        current += '"';
        i++;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function pickHeaderIndex(lines: string[]): number {
  // Choose the line with the most non-empty headers in the first few lines.
  const candidates = lines.slice(0, Math.min(lines.length, 4));
  let bestIndex = 0;
  let bestCount = -1;

  for (let i = 0; i < candidates.length; i++) {
    const headers = parseCsvLine(candidates[i]);
    const nonEmpty = headers.filter(h => h.trim()).length;
    if (nonEmpty > bestCount) {
      bestCount = nonEmpty;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function normalizeHeaders(rawHeaders: string[]): string[] {
  const seen = new Map<string, number>();
  return rawHeaders.map((header) => {
    const base = slugify(header);
    if (!base) return '';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
}

function parseCsvFile(filePath: string): Record<string, string>[] {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  CSV file not found: ${path.basename(filePath)} (Skipping)`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return [];

  const headerIndex = pickHeaderIndex(lines);
  const rawHeaders = parseCsvLine(lines[headerIndex]);
  const headers = normalizeHeaders(rawHeaders);

  return lines.slice(headerIndex + 1).map(line => {
    const values = parseCsvLine(line);
    const entry: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (h && values[i]) entry[h] = values[i];
    });
    return entry;
  });
}

function saveJson(filename: string, data: Record<string, any>) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Wrote ${Object.keys(data).length} entries to ${filename}`);
}

// --- Data Processors ---

function ensurePublicImageDir() {
  if (!fs.existsSync(PUBLIC_IMAGE_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGE_DIR, { recursive: true });
  }
}

function buildWikiUrl(name: string): string {
  const slug = name.replace(/ /g, '_');
  return `https://bg3.wiki/wiki/${encodeURIComponent(slug)}`;
}

function normalizeImageUrl(url: string): string {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `https://bg3.wiki${url}`;
  return `https://bg3.wiki/wiki/Special:FilePath/${encodeURIComponent(url)}`;
}

async function fetchWikiImageUrl(name: string): Promise<string | null> {
  const url = buildWikiUrl(name);
  try {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) return null;
    const html = await response.text();

    const ogMatch = html.match(/property="og:image" content="([^"]+)"/i);
    if (ogMatch?.[1]) return normalizeImageUrl(ogMatch[1]);

    const infoboxMatch = html.match(/class="[^"]*infobox-image[^"]*"[^>]*>\s*<img[^>]+src="([^"]+)"/i);
    if (infoboxMatch?.[1]) return normalizeImageUrl(infoboxMatch[1]);

    const imgMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    if (imgMatch?.[1]) return normalizeImageUrl(imgMatch[1]);
  } catch (error) {
    console.warn(`⚠️  Failed to fetch wiki page for "${name}": ${(error as Error).message}`);
  }
  return null;
}

async function downloadImage(url: string, destPath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

function getImageExtension(url: string): string {
  const cleanUrl = url.split('?')[0];
  const ext = path.extname(cleanUrl);
  return ext && ext.length <= 5 ? ext : '.png';
}

async function ensureLocalImage(name: string, datasetId: string): Promise<string | null> {
  const key = `${datasetId}:${name}`;
  const cached = imageCache.get(key);
  if (cached) return cached;

  ensurePublicImageDir();
  const imageUrl = await fetchWikiImageUrl(name);
  if (!imageUrl) {
    missingImages.push({ dataset: datasetId, name, reason: 'no-image-url' });
    return null;
  }

  const ext = getImageExtension(imageUrl);
  const filename = `${datasetId}_${slugify(name)}${ext}`;
  const filePath = path.join(PUBLIC_IMAGE_DIR, filename);
  const publicPath = `${PUBLIC_IMAGE_BASE}/${filename}`;

  if (!fs.existsSync(filePath)) {
    try {
      await downloadImage(imageUrl, filePath);
    } catch (error) {
      missingImages.push({ dataset: datasetId, name, reason: (error as Error).message });
      return null;
    }
  }

  imageCache.set(key, publicPath);
  return publicPath;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  });

  await Promise.all(runners);
  return results;
}

const NAME_KEYS = [
  'name',
  'spell',
  'feat',
  'class',
  'race',
  'subrace',
  'creature',
  'arrow',
  'area',
  'elixir',
  'potion',
  'feature',
  'bonus',
  'condition',
  'action',
  'weapon',
  'wearable',
  'title',
];

function getRowName(row: Record<string, string>): string | undefined {
  for (const key of NAME_KEYS) {
    const value = row[key];
    if (value) return value;
  }
  const fallbackKey = Object.keys(row).find(k => row[k]);
  return fallbackKey ? row[fallbackKey] : undefined;
}

function buildKeyedData(rows: Record<string, string>[]): Record<string, any> {
  const data: Record<string, any> = {};
  for (const row of rows) {
    const name = getRowName(row);
    if (!name) continue;
    const id = slugify(name);
    data[id] = {
      ...row,
      name,
    };
  }
  return data;
}

function processFeatsCsv(filePath: string, outputName: string) {
  console.log('Processing Feats...');
  const csvData = parseCsvFile(filePath);
  const feats: Record<string, any> = {};

  for (const row of csvData) {
    const name = row.feat || row.name;
    if (!name) continue;
    const id = slugify(name);

    const textParts = [
      row.text,
      row.text_2,
    ].filter(Boolean);
    const listParts = [
      row.list,
      row.list_2,
    ].filter(Boolean);

    const benefits = [
      ...textParts,
      ...listParts.map(list => `Options: ${list}`),
    ];

    feats[id] = {
      ...row,
      name,
      description: benefits.join('\n'),
      benefits,
    };
  }

  saveJson(outputName, feats);
}

async function processCsvGeneric(filePath: string, outputName: string, datasetId: string) {
  const rows = parseCsvFile(filePath);
  if (!IMAGE_DATASETS.has(datasetId)) {
    const data = buildKeyedData(rows);
    saveJson(outputName, data);
    return;
  }

  console.log(`Downloading images for ${datasetId}...`);
  const enriched = await mapWithConcurrency(rows, 6, async (row) => {
    const name = getRowName(row);
    if (!name) return row;
    const localImage = await ensureLocalImage(name, datasetId);
    if (localImage) {
      row.image = localImage;
    }
    return row;
  });

  const data = buildKeyedData(enriched);
  saveJson(outputName, data);
}

function parseBool(value?: string): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

function combineFirst(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value && value.trim()) return value;
  }
  return undefined;
}

async function processActionsAndSpells(filePath: string) {
  console.log('Processing Actions + Spells...');
  const rows = parseCsvFile(filePath);

  console.log('Downloading images for actions...');
  const enriched = await mapWithConcurrency(rows, 6, async (row) => {
    const name = getRowName(row);
    if (!name) return row;
    const localImage = await ensureLocalImage(name, 'actions');
    if (localImage) {
      row.image = localImage;
    }
    return row;
  });

  const actions = buildKeyedData(enriched);
  saveJson('actions.json', actions);

  const spells: Record<string, any> = {};

  for (const row of enriched) {
    const isSpell = parseBool(row.spell) || parseBool(row.cantrip);
    if (!isSpell) continue;

    const name = row.name || row.action || row.weapon_action || getRowName(row);
    if (!name) continue;
    const id = slugify(name);

    const school = row.school || 'Unknown';
    const level = parseBool(row.cantrip) ? 0 : parseInt(row.spell_level || '0', 10) || 0;
    const schoolRank = parseBool(row.cantrip) ? `${school}, Cantrip` : (level > 0 ? `${school}, Rank ${level}` : school);

    const descParts = [row.desc1, row.desc2].filter(Boolean);
    const description = descParts.join('\n\n');

    const damage = combineFirst(
      row.dmg1 && row.dmg1_type ? `${row.dmg1} ${row.dmg1_type}` : undefined,
      row.dmg2 && row.dmg2_type ? `${row.dmg2} ${row.dmg2_type}` : undefined,
      row.dmg3 && row.dmg3_type ? `${row.dmg3} ${row.dmg3_type}` : undefined,
    );

    const cost = [
      row.cost_1,
      row.cost_2,
      row.cost,
      row.cost_3,
      row.cost_on_hit_1,
      row.cost_on_hit_2,
    ]
      .filter(Boolean)
      .join(', ');

    spells[id] = {
      ...row,
      name,
      level,
      school,
      schoolRank,
      flavorText: row.desc1 || '',
      description,
      ...(row.image && { icon: row.image }),
      ...(row.attack_type && { type: row.attack_type }),
      ...(damage && { damage }),
      ...(row.range && { range: row.range }),
      ...(row.condition_1_duration && { duration: row.condition_1_duration }),
      ...(row.st_ability && { savingThrow: row.st_ability }),
      ...(cost && { cost }),
      concentration: parseBool(row.concentration),
    };
  }

  saveJson('spells.json', spells);
}

function outputNameForFile(filename: string): string {
  const base = filename.replace(/\.csv$/i, '');
  return `${slugify(base)}.json`;
}

async function main() {
  const files = fs.readdirSync(REF_DIR).filter((f: string) => f.toLowerCase().endsWith('.csv'));
  const skipped = files.filter(f => SKIP_FILES.has(f));

  for (const file of files) {
    if (SKIP_FILES.has(file)) continue;
    const filePath = path.join(REF_DIR, file);
    const outputName = outputNameForFile(file);
    const datasetId = outputName.replace(/\.json$/i, '');

    if (file.toLowerCase() === 'actions.csv') {
      await processActionsAndSpells(filePath);
      continue;
    }

    if (file.toLowerCase().includes('feats')) {
      processFeatsCsv(filePath, outputName);
      continue;
    }

    await processCsvGeneric(filePath, outputName, datasetId);
  }

  if (skipped.length > 0) {
    console.log(`⏸️  Skipped: ${skipped.join(', ')}`);
  }

  if (missingImages.length > 0) {
    const reportPath = path.join(DATA_DIR, 'missing_images.json');
    fs.writeFileSync(reportPath, JSON.stringify(missingImages, null, 2));
    console.log(`⚠️  Missing images: ${missingImages.length} (see ${reportPath})`);
  } else {
    console.log('✅ All images resolved.');
  }
}

main().catch((error) => {
  console.error('❌ Ingest failed:', error);
  process.exit(1);
});
