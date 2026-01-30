/**
 * Import BG3 build sources from CSV into JSON.
 * Reads: bg3 reference csv/BG3 Builds Compilation (by JRandall0308) - BG3 Builds Compilation (by JRandall0308).csv
 * Writes: src/games/baldurs-gate-3/data/build_sources.json
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_PATH = path.join(
  __dirname,
  '../../bg3 reference csv/BG3 Builds Compilation (by JRandall0308) - BG3 Builds Compilation (by JRandall0308).csv'
);
const OUTPUT_PATH = path.join(__dirname, '../../src/games/baldurs-gate-3/data/build_sources.json');

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
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

function parseCsv(filePath: string): Record<string, string>[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length === 0) return [];

  const headers = normalizeHeaders(parseCsvLine(lines[0]));
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const entry: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (h && values[i]) entry[h] = values[i];
    });
    return entry;
  });
}

function main() {
  if (!fs.existsSync(REF_PATH)) {
    console.error(`Missing source CSV: ${REF_PATH}`);
    process.exit(1);
  }

  const rows = parseCsv(REF_PATH);
  const sources = rows.map((row, index) => ({
    id: slugify(`${row.post_name || row.post || 'build'}_${index}`),
    name: row.post_name || row.post || 'Unknown Build',
    url: row.post_link || row.link || '',
    author: row.author || '',
    type: row.type || '',
    classShorthand: row.class_shorthand || '',
    gameVersion: row.game_version || '',
    datePosted: row.date_posted || '',
    notes: row.notes_description || row.notes || row.description || '',
    notable: row.notable_gear_features_concepts || '',
    seeAlso: row.see_also || '',
    archiveLink: row.archive_link || '',
  }));

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sources, null, 2));
  console.log(`✅ Wrote ${sources.length} build sources to ${OUTPUT_PATH}`);
}

main();
