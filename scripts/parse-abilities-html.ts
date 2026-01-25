import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AbilityData {
  name: string;
  archetype: string;
  effect: string;
  target: string;
  cost: string;
}

function parseHTML(): void {
  const htmlPath = path.join(__dirname, '../src/assets/Abilities _ Rogue Trader Wiki.html');
  const outputPath = path.join(__dirname, '../src/games/rogue-trader/data/talents/abilities-from-wiki.ts');
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find the table with abilities
  const tableMatch = html.match(/<table class="wiki_table sortable searchable" data-key="Skills">([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.error('Could not find abilities table');
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
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  const abilities: AbilityData[] = [];
  
  let match;
  while ((match = rowRegex.exec(tbody)) !== null) {
    const row = match[1];
    
    // Extract cells
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 3) continue;
    
    // Extract name from first cell (look for link text, skip images)
    const nameCell = cells[0];
    const nameMatch = nameCell.match(/<a[^>]*>(?:<[^>]*>)*([^<]+)<\/a>/);
    let name = '';
    if (nameMatch) {
      name = nameMatch[1].trim();
    } else {
      // Try alternative: get text after any images
      const altMatch = nameCell.match(/<a[^>]*>[^<]*<br>([^<]+)<\/a>/);
      if (altMatch) {
        name = altMatch[1].trim();
      }
    }
    
    // Extract archetype from second cell
    const archetypeMatch = cells[1].match(/<a[^>]*>([^<]+)<\/a>/);
    const archetype = archetypeMatch ? archetypeMatch[1].trim() : '';
    
    // Extract effect from third cell
    let effect = cells[2]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, ' ')
      .replace(/<strong>/gi, '')
      .replace(/<\/strong>/gi, '')
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Extract target from fourth cell if exists
    let target = '';
    if (cells.length > 3) {
      target = cells[3]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
    }
    
    // Extract cost from fifth cell if exists
    let cost = '';
    if (cells.length > 4) {
      cost = cells[4]
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
    }
    
    if (name && effect) {
      abilities.push({
        name,
        archetype,
        effect,
        target,
        cost,
      });
    }
  }
  
  console.log(`Parsed ${abilities.length} abilities`);
  
  // Generate TypeScript output
  let output = `// Auto-generated from Fextralife Wiki HTML (Abilities page)
// Generated on ${new Date().toISOString()}

export interface WikiAbility {
  name: string;
  archetype: string;
  effect: string;
  target: string;
  cost: string;
}

export const WIKI_ABILITIES: Record<string, WikiAbility> = {\n`;

  for (const ability of abilities) {
    const key = ability.name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
    
    const escapedName = ability.name.replace(/'/g, "\\'");
    const escapedArchetype = ability.archetype.replace(/'/g, "\\'");
    const escapedEffect = ability.effect.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const escapedTarget = ability.target.replace(/'/g, "\\'");
    const escapedCost = ability.cost.replace(/'/g, "\\'");
    
    output += `  '${key}': {\n`;
    output += `    name: '${escapedName}',\n`;
    output += `    archetype: '${escapedArchetype}',\n`;
    output += `    effect: '${escapedEffect}',\n`;
    output += `    target: '${escapedTarget}',\n`;
    output += `    cost: '${escapedCost}',\n`;
    output += `  },\n`;
  }

  output += `};\n\n`;
  output += `// Helper function to find ability by name (case-insensitive, partial match)\n`;
  output += `export function findAbility(name: string): WikiAbility | undefined {\n`;
  output += `  const normalizedName = name.toLowerCase().replace(/[^a-z0-9\\s]/g, '').replace(/\\s+/g, '_');\n`;
  output += `  \n`;
  output += `  // Try exact match first\n`;
  output += `  if (WIKI_ABILITIES[normalizedName]) {\n`;
  output += `    return WIKI_ABILITIES[normalizedName];\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  // Try partial match\n`;
  output += `  for (const [key, ability] of Object.entries(WIKI_ABILITIES)) {\n`;
  output += `    if (key.includes(normalizedName) || normalizedName.includes(key)) {\n`;
  output += `      return ability;\n`;
  output += `    }\n`;
  output += `    if (ability.name.toLowerCase().includes(name.toLowerCase())) {\n`;
  output += `      return ability;\n`;
  output += `    }\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  return undefined;\n`;
  output += `}\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`Output written to ${outputPath}`);
  
  // Print some sample abilities
  console.log('\nSample abilities:');
  for (let i = 0; i < Math.min(10, abilities.length); i++) {
    console.log(`- ${abilities[i].name} (${abilities[i].archetype}): ${abilities[i].effect.substring(0, 60)}...`);
  }
}

parseHTML();
