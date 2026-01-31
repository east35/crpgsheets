import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TalentData {
  name: string;
  shortform: string;
  effect: string;
  source: string[];
}

function parseHTML(): void {
  const htmlPath = path.join(__dirname, '../src/assets/Talents/Talents _ Rogue Trader Wiki.html');
  const outputPath = path.join(__dirname, '../src/games/rogue-trader/data/talents/talents-from-wiki.ts');
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find the table with talents
  const tableMatch = html.match(/<table class="wiki_table sortable searchable" data-key="talents">([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.error('Could not find talents table');
    return;
  }
  
  const tableContent = tableMatch[1];
  
  // Extract all rows from tbody
  const tbodyMatch = tableContent.match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) {
    console.error('Could not find tbody');
    return;
  }
  
  const tbody = tbodyMatch[1];
  
  // Match each row
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const talents: TalentData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbody)) !== null) {
    const row = match[1];
    
    // Extract cells
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 4) continue;
    
    // Extract name from first cell (look for link text)
    const nameMatch = cells[0].match(/<a[^>]*>([^<]+)<\/a>/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    // Extract shortform from second cell
    const shortformMatch = cells[1].match(/<td[^>]*>([\s\S]*?)<\/td>/);
    let shortform = '';
    if (shortformMatch) {
      shortform = shortformMatch[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, '')
        .trim();
    }
    
    // Extract effect from third cell
    const effectMatch = cells[2].match(/<td[^>]*>([\s\S]*?)<\/td>/);
    let effect = '';
    if (effectMatch) {
      effect = effectMatch[1]
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<p>/gi, '')
        .replace(/<\/p>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Extract sources from fourth cell (look for links)
    const sourceMatches = cells[3].matchAll(/<a[^>]*>([^<]+)<\/a>/g);
    const sources: string[] = [];
    for (const sourceMatch of sourceMatches) {
      sources.push(sourceMatch[1].trim());
    }
    
    if (name) {
      talents.push({
        name,
        shortform,
        effect,
        source: sources,
      });
    }
  }
  
  console.log(`Parsed ${talents.length} talents`);
  
  // Generate TypeScript output
  let output = `// Auto-generated from Fextralife Wiki HTML
// Generated on ${new Date().toISOString()}

export interface WikiTalent {
  name: string;
  shortform: string;
  effect: string;
  source: string[];
}

export const WIKI_TALENTS: Record<string, WikiTalent> = {\n`;

  const usedKeys = new Set<string>();
  
  for (const talent of talents) {
    const baseKey = talent.name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    // Handle duplicate keys by appending a number
    let key = baseKey;
    let counter = 2;
    while (usedKeys.has(key)) {
      key = `${baseKey}_${counter}`;
      counter++;
    }
    usedKeys.add(key);
    
    const escapedName = talent.name.replace(/'/g, "\\'");
    const escapedShortform = talent.shortform.replace(/'/g, "\\'");
    const escapedEffect = talent.effect.replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    output += `  '${key}': {\n`;
    output += `    name: '${escapedName}',\n`;
    output += `    shortform: '${escapedShortform}',\n`;
    output += `    effect: '${escapedEffect}',\n`;
    output += `    source: [${talent.source.map(s => `'${s.replace(/'/g, "\\'")}'`).join(', ')}],\n`;
    output += `  },\n`;
  }

  output += `};\n\n`;
  output += `// Helper function to find talent by name (case-insensitive, partial match)\n`;
  output += `export function findTalent(name: string): WikiTalent | undefined {\n`;
  output += `  const normalizedName = name.toLowerCase().replace(/[^a-z0-9\\s]/g, '').replace(/\\s+/g, '_');\n`;
  output += `  \n`;
  output += `  // Try exact match first\n`;
  output += `  if (WIKI_TALENTS[normalizedName]) {\n`;
  output += `    return WIKI_TALENTS[normalizedName];\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  // Try partial match\n`;
  output += `  for (const [key, talent] of Object.entries(WIKI_TALENTS)) {\n`;
  output += `    if (key.includes(normalizedName) || normalizedName.includes(key)) {\n`;
  output += `      return talent;\n`;
  output += `    }\n`;
  output += `    if (talent.name.toLowerCase().includes(name.toLowerCase())) {\n`;
  output += `      return talent;\n`;
  output += `    }\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  return undefined;\n`;
  output += `}\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`Output written to ${outputPath}`);
  
  // Print some sample talents
  console.log('\nSample talents:');
  for (let i = 0; i < Math.min(5, talents.length); i++) {
    console.log(`- ${talents[i].name}: ${talents[i].effect.substring(0, 80)}...`);
  }
}

parseHTML();
