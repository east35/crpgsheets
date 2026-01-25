import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TalentEntry {
  name: string;
  description: string;
}

function parseCSV(content: string): TalentEntry[] {
  const lines = content.split('\n');
  const talents: TalentEntry[] = [];
  
  let currentName = '';
  let currentDescription = '';
  let inMultilineDescription = false;
  
  for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i];
    
    if (!line.trim()) continue;
    
    // Check if this is a continuation of a multiline description
    if (inMultilineDescription) {
      // If line starts with a quote or doesn't have a comma before any quote, it's a continuation
      if (line.startsWith('  ') || line.startsWith('"') || !line.includes(',')) {
        currentDescription += '\n' + line.replace(/^"|"$/g, '').trim();
        if (line.endsWith('"') || !line.includes('"')) {
          inMultilineDescription = false;
          talents.push({ name: currentName, description: currentDescription.replace(/"""/g, '"').replace(/""/g, '"') });
        }
        continue;
      } else {
        // New entry
        inMultilineDescription = false;
        talents.push({ name: currentName, description: currentDescription.replace(/"""/g, '"').replace(/""/g, '"') });
      }
    }
    
    // Parse new entry
    const firstComma = line.indexOf(',');
    if (firstComma === -1) continue;
    
    currentName = line.substring(0, firstComma).replace(/^"|"$/g, '').trim();
    let desc = line.substring(firstComma + 1).trim();
    
    // Skip empty descriptions or section headers
    if (!desc || desc === ',' || currentName === '') continue;
    
    // Handle quoted descriptions that may span multiple lines
    if (desc.startsWith('"') && !desc.endsWith('"')) {
      currentDescription = desc.substring(1);
      inMultilineDescription = true;
      continue;
    }
    
    // Single line description
    currentDescription = desc.replace(/^"|"$/g, '').replace(/""/g, '"');
    talents.push({ name: currentName, description: currentDescription });
  }
  
  return talents;
}

function generateTalentId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateTypeScript(talents: TalentEntry[], abilities: TalentEntry[]): string {
  const allEntries = [...talents, ...abilities];
  const seen = new Set<string>();
  const uniqueEntries: TalentEntry[] = [];
  
  for (const entry of allEntries) {
    const key = entry.name.toLowerCase();
    if (!seen.has(key) && entry.description) {
      seen.add(key);
      uniqueEntries.push(entry);
    }
  }
  
  // Sort alphabetically
  uniqueEntries.sort((a, b) => a.name.localeCompare(b.name));
  
  let output = `// Auto-generated from CSV data
// Last updated: ${new Date().toISOString()}

export interface TalentInfo {
  id: string;
  name: string;
  description: string;
  imagePath?: string;
}

// Talent database with descriptions from game data
const TALENTS: Record<string, TalentInfo> = {
`;

  for (const entry of uniqueEntries) {
    const id = generateTalentId(entry.name);
    // Escape for use in single-quoted strings
    const escapedName = entry.name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapedDesc = entry.description
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n');
    
    output += `  '${escapedName}': {
    id: '${id}',
    name: '${escapedName}',
    description: '${escapedDesc}',
  },
`;
  }

  output += `};

export function getTalentInfo(talentName: string): TalentInfo | undefined {
  return TALENTS[talentName];
}

export function getTalentImagePath(talentName: string): string | undefined {
  const talent = TALENTS[talentName];
  if (talent?.imagePath) {
    return \`/skills/\${talent.imagePath}\`;
  }
  return undefined;
}

export { TALENTS };
`;

  return output;
}

// Main
const csvDir = path.join(__dirname, '../src/sheets-csv');
const talentsFile = path.join(csvDir, 'Community Rogue Trader Unfair Builds & Resources - Talents (WIP).csv');
const abilitiesFile = path.join(csvDir, 'Community Rogue Trader Unfair Builds & Resources - Abilities (WIP).csv');

const talentsContent = fs.readFileSync(talentsFile, 'utf-8');
const abilitiesContent = fs.readFileSync(abilitiesFile, 'utf-8');

const talents = parseCSV(talentsContent);
const abilities = parseCSV(abilitiesContent);

console.log(`Parsed ${talents.length} talents and ${abilities.length} abilities`);

const output = generateTypeScript(talents, abilities);
const outputPath = path.join(__dirname, '../src/games/rogue-trader/data/talents/generated.ts');

fs.writeFileSync(outputPath, output);
console.log(`Generated ${outputPath}`);
