/**
 * Generate BG3 build candidates from imported source links.
 * Reads: src/games/baldurs-gate-3/data/build_sources.json
 * Writes: src/games/baldurs-gate-3/data/build_candidates.json
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES_PATH = path.join(__dirname, '../../src/games/baldurs-gate-3/data/build_sources.json');
const OUTPUT_PATH = path.join(__dirname, '../../src/games/baldurs-gate-3/data/build_candidates.json');

const CLASS_NAMES = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
];

const TAG_KEYWORDS: Array<[string, string[]]> = [
  ['Ranged', ['ranged', 'bow', 'archer', 'archery']],
  ['Melee', ['melee', 'dual wield', 'two-handed', 'greatsword', 'sword']],
  ['Stealth', ['stealth', 'assassin', 'sneak']],
  ['Tank', ['tank', 'frontline', 'durable']],
  ['Support', ['support', 'healer', 'buff']],
  ['Control', ['control', 'cc', 'crowd']],
  ['Blaster', ['blaster', 'burst', 'nuke']],
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function extractClasses(text: string): string[] {
  const lower = text.toLowerCase();
  const classes = new Set<string>();
  CLASS_NAMES.forEach((name) => {
    if (lower.includes(name.toLowerCase())) classes.add(name);
  });
  return Array.from(classes);
}

function extractTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();
  TAG_KEYWORDS.forEach(([tag, keys]) => {
    if (keys.some((k) => lower.includes(k))) tags.add(tag);
  });
  return Array.from(tags);
}

function extractGearHints(text: string): string[] {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function main() {
  if (!fs.existsSync(SOURCES_PATH)) {
    console.error(`Missing sources: ${SOURCES_PATH}`);
    process.exit(1);
  }

  const sources = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf-8')) as Array<Record<string, string>>;
  const candidates = sources.map((source, index) => {
    const textBlob = [
      source.name,
      source.notes,
      source.notable,
      source.classShorthand,
      source.type,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      id: slugify(`${source.name || 'build'}_${index}`),
      name: source.name || 'Unknown Build',
      sourceId: source.id || `source_${index}`,
      sourceUrl: source.url || '',
      author: source.author || '',
      type: source.type || '',
      classTags: extractClasses(textBlob),
      tags: extractTags(textBlob),
      gearHints: extractGearHints(source.notable || ''),
      notes: source.notes || '',
      status: 'candidate' as const,
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(candidates, null, 2));
  console.log(`✅ Wrote ${candidates.length} build candidates to ${OUTPUT_PATH}`);
}

main();
