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

interface GearData {
  name: string;
  type: 'weapon' | 'accessory' | 'item';
  effect: string;
  stats: Record<string, string>;
  wikiUrl?: string;
  imageLocal?: string;
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

function getEffectText(item: ExtractedItem): string {
  // In the extracted data, sometimes effect is "None" and the real effect is in prerequisite
  // Or sometimes effect has the actual effect text
  const effect = item.effect?.trim() || '';
  const prereq = item.prerequisite?.trim() || '';
  
  if (effect && effect !== 'None' && effect.length > 15) {
    return effect;
  }
  if (prereq && prereq !== 'None' && prereq.length > 10) {
    return prereq;
  }
  if (effect && effect !== 'None') {
    return effect;
  }
  return prereq || effect || '';
}

function toKey(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Parse helmets from Accessories HTML (since helmets.json is empty)
function parseHelmetsFromAccessoriesHTML(): GearData[] {
  // Try the html extractions folder first
  let htmlPath = path.join(__dirname, '../src/assets/html extractions/Accessories/Amulets ｜ Rogue Trader Wiki (1_25_2026 3：22：00 PM).html');
  // Actually we need a page with helmets - let's check the old Accessories folder
  const oldPath = path.join(__dirname, '../src/assets/Accessories/Accessories _ Rogue Trader Wiki.html');
  if (fs.existsSync(oldPath)) {
    htmlPath = oldPath;
  }
  if (!fs.existsSync(htmlPath)) {
    console.log('Accessories HTML not found for helmets');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  const tableMatch = html.match(/<table class="wiki_table sortable searchable" data-key="Skills">([\s\S]*?)<\/table>/);
  if (!tableMatch) return [];
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*)<\/tbody>/);
  if (!tbodyMatch) return [];
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items: GearData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 3) continue;
    
    // Check if this is a helmet
    const slotType = cells[1] ? cells[1].replace(/<[^>]+>/g, '').trim() : '';
    if (!slotType.toLowerCase().includes('helmet')) continue;
    
    let name = '';
    const nameAfterBr = cells[0].match(/<br[^>]*>([^<]+)<\/a>/i);
    if (nameAfterBr) {
      name = nameAfterBr[1].trim();
    } else {
      const plainLink = cells[0].match(/<a[^>]*>([^<]+)<\/a>/);
      if (plainLink) {
        name = plainLink[1].trim();
      }
    }
    
    // Find effect - look for longest non-trivial cell
    let effect = '';
    for (let i = 1; i < cells.length; i++) {
      const cellText = cells[i]
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, ' ')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, ' ')
        .replace(/<ul>/gi, '')
        .replace(/<\/ul>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (cellText && cellText !== 'None' && cellText !== '--' && cellText.length > 10) {
        if (cellText.length > effect.length) {
          effect = cellText;
        }
      }
    }
    
    if (name && effect) {
      items.push({
        name,
        type: 'accessory',
        effect,
        stats: { slot: 'Helmet' },
      });
    }
  }
  
  return items;
}

function main(): void {
  const outputPath = path.join(__dirname, '../src/games/rogue-trader/data/gear/gear-from-wiki.ts');
  
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load all extracted JSON files
  const files = [
    { file: 'rings.json', type: 'accessory' as const, slot: 'Ring' },
    { file: 'amulets.json', type: 'accessory' as const, slot: 'Amulet' },
    { file: 'boots.json', type: 'accessory' as const, slot: 'Boot' },
    { file: 'cloaks.json', type: 'accessory' as const, slot: 'Cloak' },
    { file: 'gloves.json', type: 'accessory' as const, slot: 'Glove' },
    { file: 'helmets.json', type: 'accessory' as const, slot: 'Helmet' },
    { file: 'familiar-items.json', type: 'item' as const, slot: 'Familiar' },
    { file: 'melee-weapons.json', type: 'weapon' as const, slot: 'Melee' },
    { file: 'ranged-weapons.json', type: 'weapon' as const, slot: 'Ranged' },
    { file: 'shields.json', type: 'weapon' as const, slot: 'Shield' },
    { file: 'light-chest-armor.json', type: 'accessory' as const, slot: 'Light Armor' },
    { file: 'medium-chest-armor.json', type: 'accessory' as const, slot: 'Medium Armor' },
    { file: 'heavy-chest-armor.json', type: 'accessory' as const, slot: 'Heavy Armor' },
  ];

  const allGearMap = new Map<string, GearData>();

  // First, add helmets from Accessories HTML
  const helmets = parseHelmetsFromAccessoriesHTML();
  console.log(`Loaded ${helmets.length} helmets from Accessories HTML`);
  for (const helmet of helmets) {
    const key = toKey(helmet.name);
    allGearMap.set(key, helmet);
  }

  for (const { file, type, slot } of files) {
    const items = loadJsonFile(file);
    console.log(`Loaded ${items.length} items from ${file}`);
    
    for (const item of items) {
      const effect = getEffectText(item);
      if (!item.name || !effect) continue;
      
      const key = toKey(item.name);
      if (allGearMap.has(key)) continue; // Skip duplicates
      
      allGearMap.set(key, {
        name: item.name,
        type,
        effect,
        stats: { slot },
        wikiUrl: item.wikiUrl || undefined,
        imageLocal: item.imageLocal || undefined,
        imageRemote: item.imageRemote || undefined,
      });
    }
  }

  const allGear = Array.from(allGearMap.values());
  console.log(`\nTotal unique items: ${allGear.length}`);

  // Generate TypeScript output
  let output = `// Auto-generated gear data from extracted JSON files
// Generated on ${new Date().toISOString()}

export interface GearInfo {
  name: string;
  type: 'weapon' | 'accessory' | 'item';
  effect: string;
  stats: Record<string, string>;
  wikiUrl?: string;
  imageLocal?: string;
  imageRemote?: string;
}

export const GEAR_DATA: Record<string, GearInfo> = {
`;

  for (const gear of allGear) {
    const key = toKey(gear.name);
    const escapedEffect = gear.effect
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n');
    
    output += `  '${key}': {\n`;
    output += `    name: '${gear.name.replace(/'/g, "\\'")}',\n`;
    output += `    type: '${gear.type}',\n`;
    output += `    effect: '${escapedEffect}',\n`;
    output += `    stats: ${JSON.stringify(gear.stats)},\n`;
    if (gear.wikiUrl) {
      output += `    wikiUrl: '${gear.wikiUrl?.replace(/'/g, "\\'")}',\n`;
    }
    if (gear.imageLocal) {
      output += `    imageLocal: '${gear.imageLocal}',\n`;
    }
    if (gear.imageRemote) {
      output += `    imageRemote: '${gear.imageRemote.replace(/'/g, "\\'")}',\n`;
    }
    output += `  },\n`;
  }

  output += `};\n\n`;
  output += `export function findGearByName(name: string): GearInfo | undefined {\n`;
  output += `  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');\n`;
  output += `  return GEAR_DATA[key];\n`;
  output += `}\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`\nOutput written to ${outputPath}`);

  // Show some samples
  const samples = allGear.slice(0, 5);
  console.log('\nSample items:');
  for (const s of samples) {
    console.log(`- ${s.name} (${s.stats.slot}): ${s.effect.substring(0, 60)}...`);
  }
}

main();
