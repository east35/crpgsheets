import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExtractedItem {
  id: string;
  name: string;
  wikiUrl: string;
  imageRemote: string | null;
  imageLocal: string | null;
  effect: string;
  prerequisite: string | null;
  category: string;
}

interface KeywordInfo {
  name: string;
  category: 'homeworld' | 'origin' | 'archetype' | 'characteristic' | 'skill' | 'stat' | 'conviction' | 'status-effect' | 'talent' | 'ability';
  effect: string;
  wikiUrl?: string;
  imageRemote?: string;
}

function loadJsonFile(filename: string): ExtractedItem[] {
  const filePath = path.join(__dirname, '../src/assets/extracted', filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.log(`Error parsing ${filename}:`, e);
    return [];
  }
}

function toKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function getEffectText(item: ExtractedItem): string {
  const effect = item.effect?.trim() || '';
  const prereq = item.prerequisite?.trim() || '';
  
  if (effect && effect !== 'None' && effect.length > 10) {
    return effect;
  }
  if (prereq && prereq !== 'None' && prereq.length > 10) {
    return prereq;
  }
  return effect || prereq || '';
}

function main(): void {
  const outputPath = path.join(__dirname, '../src/games/rogue-trader/data/character/character-keywords.ts');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const files: { file: string; category: KeywordInfo['category'] }[] = [
    { file: 'homeworlds.json', category: 'homeworld' },
    { file: 'origin.json', category: 'origin' },
    { file: 'archetypes.json', category: 'archetype' },
    { file: 'characteristics.json', category: 'characteristic' },
    { file: 'skills.json', category: 'skill' },
    { file: 'stats.json', category: 'stat' },
    { file: 'convictions.json', category: 'conviction' },
    { file: 'status-effects.json', category: 'status-effect' },
    { file: 'talents.json', category: 'talent' },
    { file: 'abilities.json', category: 'ability' },
  ];

  const allKeywordsMap = new Map<string, KeywordInfo>();

  for (const { file, category } of files) {
    const items = loadJsonFile(file);
    console.log(`Loaded ${items.length} items from ${file}`);
    
    for (const item of items) {
      const effect = getEffectText(item);
      if (!item.name) continue;
      
      const key = toKey(item.name);
      if (allKeywordsMap.has(key)) continue; // Skip duplicates
      
      allKeywordsMap.set(key, {
        name: item.name,
        category,
        effect,
        wikiUrl: item.wikiUrl || undefined,
        imageRemote: item.imageRemote || undefined,
      });

      // Also add common abbreviations/aliases for characteristics
      if (category === 'characteristic') {
        const abbrevMap: Record<string, string> = {
          'Weapon Skill (WS)': 'WS',
          'Ballistic Skill (BS)': 'BS',
          'Strength (STR)': 'STR',
          'Toughness (TGH)': 'TGH',
          'Agility (AGI)': 'AGI',
          'Intelligence (INT)': 'INT',
          'Perception (PER)': 'PER',
          'Willpower (WP)': 'WP',
          'Fellowship (FEL)': 'FEL',
        };
        const abbrev = abbrevMap[item.name];
        if (abbrev) {
          const abbrevKey = toKey(abbrev);
          if (!allKeywordsMap.has(abbrevKey)) {
            allKeywordsMap.set(abbrevKey, {
              name: item.name,
              category,
              effect,
              wikiUrl: item.wikiUrl || undefined,
              imageRemote: item.imageRemote || undefined,
            });
          }
          // Also add the full name without abbreviation
          const fullName = item.name.replace(/\s*\([^)]+\)\s*$/, '').trim();
          const fullKey = toKey(fullName);
          if (!allKeywordsMap.has(fullKey)) {
            allKeywordsMap.set(fullKey, {
              name: item.name,
              category,
              effect,
              wikiUrl: item.wikiUrl || undefined,
              imageRemote: item.imageRemote || undefined,
            });
          }
        }
      }
    }
  }

  const allKeywords = Array.from(allKeywordsMap.entries());
  console.log(`\nTotal unique keywords: ${allKeywords.length}`);

  // Generate TypeScript output
  let output = `// Auto-generated character keyword data from extracted JSON files
// Generated on ${new Date().toISOString()}

export type KeywordCategory = 'homeworld' | 'origin' | 'archetype' | 'characteristic' | 'skill' | 'stat' | 'conviction' | 'status-effect' | 'talent' | 'ability';

export interface KeywordInfo {
  name: string;
  category: KeywordCategory;
  effect: string;
  wikiUrl?: string;
  imageRemote?: string;
}

export const KEYWORD_DATA: Record<string, KeywordInfo> = {
`;

  for (const [key, info] of allKeywords) {
    const escapedEffect = info.effect
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n');
    
    output += `  '${key}': {\n`;
    output += `    name: '${info.name.replace(/'/g, "\\'")}',\n`;
    output += `    category: '${info.category}',\n`;
    output += `    effect: '${escapedEffect}',\n`;
    if (info.wikiUrl) {
      output += `    wikiUrl: '${info.wikiUrl.replace(/'/g, "\\'")}',\n`;
    }
    if (info.imageRemote && !info.imageRemote.includes('svg+xml')) {
      // Only include real images, not placeholder SVGs
      output += `    imageRemote: '${info.imageRemote.replace(/'/g, "\\'")}',\n`;
    }
    output += `  },\n`;
  }

  output += `};\n\n`;
  
  // Add lookup function
  output += `export function findKeyword(name: string): KeywordInfo | undefined {\n`;
  output += `  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');\n`;
  output += `  return KEYWORD_DATA[key];\n`;
  output += `}\n\n`;

  // Add function to find keywords by category
  output += `export function findKeywordsByCategory(category: KeywordCategory): KeywordInfo[] {\n`;
  output += `  return Object.values(KEYWORD_DATA).filter(k => k.category === category);\n`;
  output += `}\n\n`;

  // Add list of all keyword names for text matching
  output += `export const ALL_KEYWORD_NAMES: string[] = [\n`;
  const sortedNames = Array.from(allKeywordsMap.values())
    .map(k => k.name)
    .filter((v, i, a) => a.indexOf(v) === i) // unique
    .sort((a, b) => b.length - a.length); // longest first for matching
  for (const name of sortedNames) {
    output += `  '${name.replace(/'/g, "\\'")}',\n`;
  }
  output += `];\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`\nOutput written to ${outputPath}`);

  // Print sample items
  console.log('\nSample keywords by category:');
  const categories = ['homeworld', 'origin', 'archetype', 'characteristic', 'skill'] as const;
  for (const cat of categories) {
    const items = Array.from(allKeywordsMap.values()).filter(k => k.category === cat);
    console.log(`- ${cat}: ${items.slice(0, 3).map(i => i.name).join(', ')}${items.length > 3 ? '...' : ''}`);
  }
}

main();
