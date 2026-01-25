import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GearData {
  name: string;
  type: string;
  effect: string;
  stats: Record<string, string>;
}

function parseWeaponsHTML(): GearData[] {
  const htmlPath = path.join(__dirname, '../src/assets/Weapons /Weapons _ Rogue Trader Wiki.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  const tableMatch = html.match(/<table class="wiki_table sortable searchable"[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) return [];
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) return [];
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items: GearData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 6) continue;
    
    const nameMatch = cells[0].match(/<a[^>]*>([^<]+)<\/a>/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    const type = cells[1].replace(/<[^>]+>/g, '').trim();
    const damage = cells[2].replace(/<[^>]+>/g, '').trim();
    const ap = cells[3].replace(/<[^>]+>/g, '').trim();
    const damageType = cells[4].replace(/<[^>]+>/g, '').trim();
    const effect = cells[5]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (name) {
      items.push({
        name,
        type: 'weapon',
        effect,
        stats: { weaponType: type, damage, armorPenetration: ap, damageType },
      });
    }
  }
  
  return items;
}

function parseAccessoriesHTML(): GearData[] {
  const htmlPath = path.join(__dirname, '../src/assets/Accessories/Accessories _ Rogue Trader Wiki.html');
  if (!fs.existsSync(htmlPath)) {
    console.log('Accessories HTML not found, trying alternate path...');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find the accessories table (data-key="Skills")
  const tableMatch = html.match(/<table class="wiki_table sortable searchable" data-key="Skills">([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.log('Accessories: Could not find table with data-key="Skills"');
    return [];
  }
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*)<\/tbody>/);
  if (!tbodyMatch) {
    console.log('Accessories: Could not find tbody');
    return [];
  }
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items: GearData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 3) continue;
    
    // Name - may have image before it with <br>
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
    
    const slotType = cells[1] ? cells[1].replace(/<[^>]+>/g, '').trim() : '';
    const effect = cells[2] ? cells[2]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() : '';
    
    if (name && effect) {
      items.push({
        name,
        type: 'accessory',
        effect,
        stats: { slot: slotType },
      });
    }
  }
  
  return items;
}

function parseItemsHTML(): GearData[] {
  const htmlPath = path.join(__dirname, '../src/assets/Items/Items _ Rogue Trader Wiki.html');
  if (!fs.existsSync(htmlPath)) return [];
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find the consumables table (data-key="consumables")
  const tableMatch = html.match(/<table class="wiki_table sortable searchable" data-key="consumables">([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.log('Items: Could not find consumables table');
    return [];
  }
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) return [];
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items: GearData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 3) continue;
    
    // Name is in first cell - may have image before it with <br>
    let name = '';
    // Try to get name after <br> (when there's an image)
    const nameAfterBr = cells[0].match(/<br[^>]*>([^<]+)<\/a>/i);
    if (nameAfterBr) {
      name = nameAfterBr[1].trim();
    } else {
      // Try plain link text
      const plainLink = cells[0].match(/<a[^>]*>([^<]+)<\/a>/);
      if (plainLink) {
        name = plainLink[1].trim();
      }
    }
    
    // Cost is in second cell
    const cost = cells[1] ? cells[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim() : '';
    
    // Effect is in third cell
    const effect = cells[2] ? cells[2]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() : '';
    
    if (name && effect) {
      items.push({
        name,
        type: 'item',
        effect,
        stats: { cost },
      });
    }
  }
  
  return items;
}

// Parse a category page (Rings, Helmets, etc.) with standard table format
function parseCategoryHTML(filename: string, itemType: string, slotName: string): GearData[] {
  const htmlPath = path.join(__dirname, `../src/assets/${filename}`);
  if (!fs.existsSync(htmlPath)) {
    console.log(`${slotName}: File not found - ${filename}`);
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find table - try different data-key values
  let tableMatch = html.match(/<table class="wiki_table sortable searchable"[^>]*data-key="Skills"[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    tableMatch = html.match(/<table class="wiki_table sortable searchable"[^>]*data-key="weapons"[^>]*>([\s\S]*?)<\/table>/);
  }
  if (!tableMatch) {
    tableMatch = html.match(/<table class="wiki_table sortable searchable"[^>]*>([\s\S]*?)<\/table>/);
  }
  if (!tableMatch) {
    console.log(`${slotName}: Could not find table`);
    return [];
  }
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*)<\/tbody>/);
  if (!tbodyMatch) return [];
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items: GearData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 2) continue;
    
    // Name - may have image before it with <br>
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
    
    // Effect could be in different positions - find the cell with the most content that isn't just "None" or "--"
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
      
      // Skip cells that are just "None", "--", or very short
      if (cellText && cellText !== 'None' && cellText !== '--' && cellText.length > 10) {
        if (cellText.length > effect.length) {
          effect = cellText;
        }
      }
    }
    
    if (name && effect) {
      items.push({
        name,
        type: itemType as 'weapon' | 'accessory' | 'item',
        effect,
        stats: { slot: slotName },
      });
    }
  }
  
  return items;
}

// Parse consumables/grenades with Cost, Effect, Cargo columns
function parseConsumablesHTML(filename: string, itemType: string): GearData[] {
  const htmlPath = path.join(__dirname, `../src/assets/${filename}`);
  if (!fs.existsSync(htmlPath)) {
    console.log(`${itemType}: File not found - ${filename}`);
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find table
  const tableMatch = html.match(/<table class="wiki_table sortable searchable"[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.log(`${itemType}: Could not find table`);
    return [];
  }
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*)<\/tbody>/);
  if (!tbodyMatch) return [];
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items: GearData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 3) continue;
    
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
    
    const cost = cells[1] ? cells[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
    const effect = cells[2] ? cells[2]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() : '';
    
    if (name && effect) {
      items.push({
        name,
        type: 'item',
        effect,
        stats: { cost, category: itemType },
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
  
  const weapons = parseWeaponsHTML();
  const accessories = parseAccessoriesHTML();
  const items = parseItemsHTML();
  
  // Parse category pages
  const rings = parseCategoryHTML('Rings _ Rogue Trader Wiki.html', 'accessory', 'Ring');
  const helmets = parseCategoryHTML('Helmets _ Rogue Trader Wiki.html', 'accessory', 'Helmet');
  const cloaks = parseCategoryHTML('Cloaks _ Rogue Trader Wiki.html', 'accessory', 'Cloak');
  const boots = parseCategoryHTML('Boots _ Rogue Trader Wiki.html', 'accessory', 'Boot');
  const gloves = parseCategoryHTML('Gloves _ Rogue Trader Wiki.html', 'accessory', 'Glove');
  const amulets = parseCategoryHTML('Amulets _ Rogue Trader Wiki.html', 'accessory', 'Amulet');
  
  // Parse consumable-type pages
  const consumables = parseConsumablesHTML('Consumables _ Rogue Trader Wiki.html', 'Consumable');
  const grenades = parseConsumablesHTML('Grenades _ Rogue Trader Wiki.html', 'Grenade');
  const familiarItems = parseCategoryHTML('Familiar Items _ Rogue Trader Wiki.html', 'item', 'Familiar');
  
  console.log(`Parsed ${weapons.length} weapons`);
  console.log(`Parsed ${accessories.length} accessories (main page)`);
  console.log(`Parsed ${items.length} items (main page)`);
  console.log(`Parsed ${rings.length} rings`);
  console.log(`Parsed ${helmets.length} helmets`);
  console.log(`Parsed ${cloaks.length} cloaks`);
  console.log(`Parsed ${boots.length} boots`);
  console.log(`Parsed ${gloves.length} gloves`);
  console.log(`Parsed ${amulets.length} amulets`);
  console.log(`Parsed ${consumables.length} consumables`);
  console.log(`Parsed ${grenades.length} grenades`);
  console.log(`Parsed ${familiarItems.length} familiar items`);
  
  // Merge all gear, deduplicating by name
  const allGearMap = new Map<string, GearData>();
  const addGear = (items: GearData[]) => {
    for (const item of items) {
      const key = item.name.toLowerCase();
      if (!allGearMap.has(key)) {
        allGearMap.set(key, item);
      }
    }
  };
  
  addGear(weapons);
  addGear(accessories);
  addGear(items);
  addGear(rings);
  addGear(helmets);
  addGear(cloaks);
  addGear(boots);
  addGear(gloves);
  addGear(amulets);
  addGear(consumables);
  addGear(grenades);
  addGear(familiarItems);
  
  const allGear = Array.from(allGearMap.values());
  console.log(`Total unique: ${allGear.length} gear items`);
  
  // Generate TypeScript output
  let output = `// Auto-generated gear data from Fextralife Wiki
// Generated on ${new Date().toISOString()}

export interface GearInfo {
  name: string;
  type: 'weapon' | 'accessory' | 'item';
  effect: string;
  stats: Record<string, string>;
}

export const GEAR_DATA: Record<string, GearInfo> = {\n`;

  for (const gear of allGear) {
    const key = gear.name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    const escapedName = gear.name.replace(/'/g, "\\'");
    const escapedEffect = gear.effect.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    output += `  '${key}': {\n`;
    output += `    name: '${escapedName}',\n`;
    output += `    type: '${gear.type}',\n`;
    output += `    effect: '${escapedEffect}',\n`;
    output += `    stats: ${JSON.stringify(gear.stats)},\n`;
    output += `  },\n`;
  }

  output += `};\n\n`;
  output += `// Find gear by name (case-insensitive, partial match)\n`;
  output += `export function findGear(name: string): GearInfo | undefined {\n`;
  output += `  const normalizedName = name.toLowerCase().replace(/[^a-z0-9\\s]/g, '').replace(/\\s+/g, '_');\n`;
  output += `  \n`;
  output += `  // Try exact match first\n`;
  output += `  if (GEAR_DATA[normalizedName]) {\n`;
  output += `    return GEAR_DATA[normalizedName];\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  // Try partial match\n`;
  output += `  for (const [key, gear] of Object.entries(GEAR_DATA)) {\n`;
  output += `    if (key.includes(normalizedName) || normalizedName.includes(key)) {\n`;
  output += `      return gear;\n`;
  output += `    }\n`;
  output += `    if (gear.name.toLowerCase().includes(name.toLowerCase())) {\n`;
  output += `      return gear;\n`;
  output += `    }\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  return undefined;\n`;
  output += `}\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`\nOutput written to ${outputPath}`);
  
  // Print samples
  console.log('\nSample weapons:');
  for (let i = 0; i < Math.min(3, weapons.length); i++) {
    console.log(`- ${weapons[i].name}: ${weapons[i].effect.substring(0, 50)}...`);
  }
  console.log('\nSample accessories:');
  for (let i = 0; i < Math.min(3, accessories.length); i++) {
    console.log(`- ${accessories[i].name}: ${accessories[i].effect.substring(0, 50)}...`);
  }
}

main();
