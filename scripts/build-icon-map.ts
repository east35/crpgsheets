import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface IconMapping {
  [key: string]: string;
}

function findIconFiles(dir: string, icons: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findIconFiles(fullPath, icons);
    } else if (file.endsWith('.png') || file.endsWith('.jpg')) {
      // Filter to only talent/ability related icons
      const lowerFile = file.toLowerCase();
      if (
        lowerFile.includes('talent') ||
        lowerFile.includes('abilit') ||
        lowerFile.includes('_abilities_') ||
        lowerFile.includes('_talents_') ||
        // Common ability names
        lowerFile.includes('charge') ||
        lowerFile.includes('break_through') ||
        lowerFile.includes('voice_of_command') ||
        lowerFile.includes('run_and_gun') ||
        lowerFile.includes('biomancy') ||
        lowerFile.includes('stratagem') ||
        lowerFile.includes('bounty_hunter') ||
        lowerFile.includes('psyker') ||
        lowerFile.includes('warrior') ||
        lowerFile.includes('officer') ||
        lowerFile.includes('operative') ||
        lowerFile.includes('vanguard') ||
        lowerFile.includes('grand_strategist')
      ) {
        // Exclude placeholder and non-icon files
        if (!lowerFile.includes('placeholder') && 
            !lowerFile.includes('logo') && 
            !lowerFile.includes('avatar') &&
            !lowerFile.includes('caution') &&
            !lowerFile.includes('fextra') &&
            !lowerFile.includes('mhws')) {
          icons.push(fullPath);
        }
      }
    }
  }
  
  return icons;
}

function extractTalentName(filename: string): string {
  // Remove path and extension
  const base = path.basename(filename, path.extname(filename));
  
  // Remove common suffixes
  let name = base
    .replace(/_talents_warhammer_40k_rogue_trader.*$/i, '')
    .replace(/_abilities_warhammer_40k_rogue_trader.*$/i, '')
    .replace(/_ability_icon.*$/i, '')
    .replace(/_warhammer_40k_rogue_trader.*$/i, '')
    .replace(/_rogue_trader.*$/i, '')
    .replace(/_wiki_guide.*$/i, '')
    .replace(/_64px$/i, '')
    .replace(/_128px$/i, '')
    .replace(/_192px$/i, '');
  
  // Convert underscores to spaces and title case
  name = name
    .replace(/_/g, ' ')
    .trim();
  
  return name;
}

function buildIconMap(): void {
  const assetsDir = path.join(__dirname, '../src/assets');
  const outputPath = path.join(__dirname, '../src/games/rogue-trader/data/talents/icon-map.ts');
  
  const iconFiles = findIconFiles(assetsDir);
  
  console.log(`Found ${iconFiles.length} icon files`);
  
  const iconMap: IconMapping = {};
  
  for (const iconPath of iconFiles) {
    const talentName = extractTalentName(iconPath);
    // Create a normalized key for lookup
    const key = talentName.toLowerCase();
    
    // Get relative path from src/assets
    const relativePath = iconPath.replace(assetsDir, '').replace(/^\//, '');
    
    iconMap[key] = relativePath;
    console.log(`  ${key} -> ${relativePath}`);
  }
  
  // Generate TypeScript output
  let output = `// Auto-generated icon mapping for talents and abilities
// Generated on ${new Date().toISOString()}

export const TALENT_ICONS: Record<string, string> = {\n`;

  for (const [key, iconPath] of Object.entries(iconMap).sort()) {
    const escapedKey = key.replace(/'/g, "\\'");
    const escapedPath = iconPath.replace(/'/g, "\\'");
    output += `  '${escapedKey}': '${escapedPath}',\n`;
  }

  output += `};\n\n`;
  output += `// Get icon path for a talent/ability name\n`;
  output += `export function getTalentIcon(name: string): string | undefined {\n`;
  output += `  const normalizedName = name.toLowerCase().trim();\n`;
  output += `  \n`;
  output += `  // Try exact match first\n`;
  output += `  if (TALENT_ICONS[normalizedName]) {\n`;
  output += `    return TALENT_ICONS[normalizedName];\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  // Try partial match\n`;
  output += `  for (const [key, iconPath] of Object.entries(TALENT_ICONS)) {\n`;
  output += `    if (key.includes(normalizedName) || normalizedName.includes(key)) {\n`;
  output += `      return iconPath;\n`;
  output += `    }\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  return undefined;\n`;
  output += `}\n`;

  fs.writeFileSync(outputPath, output);
  console.log(`\nOutput written to ${outputPath}`);
}

buildIconMap();
