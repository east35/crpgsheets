/**
 * HTML parser for BG3Compendium Spells and Cantrips pages
 * Reads: bg3 reference csv/BG3Compendium - Spells*.html and Cantrips*.html (SingleFile exports)
 * Outputs: src/games/baldurs-gate-3/data/spells.json
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_DIR = path.join(__dirname, '../../bg3 reference csv');
const OUTPUT_PATH = path.join(__dirname, '../../src/games/baldurs-gate-3/data/spells.json');

interface Spell {
  name: string;
  level: number;
  school: string;
  schoolRank: string;
  flavorText: string;
  description: string;
  icon?: string;
  type?: string;
  damage?: string;
  range?: string;
  duration?: string;
  savingThrow?: string;
  cost?: string;
  concentration: boolean;
}

function findHtmlFile(prefix: string): string | null {
  const files = fs.readdirSync(REF_DIR);
  const htmlFiles = files.filter((f: string) => f.startsWith(prefix) && f.endsWith('.html'));
  if (htmlFiles.length === 0) {
    return null;
  }
  // Sort to get the newest file (by name, which includes timestamp)
  htmlFiles.sort();
  return path.join(REF_DIR, htmlFiles[htmlFiles.length - 1]);
}

function extractText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSpellCards(html: string): Spell[] {
  const spells: Spell[] = [];
  
  // Split by spell card containers
  const cardRegex = /<div class=list-card-cont>([\s\S]*?)<div class=list-card-bottom-grad>/g;
  let match;
  
  while ((match = cardRegex.exec(html)) !== null) {
    const card = match[1];
    
    // Extract name
    const nameMatch = card.match(/<div class=list-card-title><p class=gradient-text>([^<]+)<\/p>/);
    if (!nameMatch) continue;
    const name = extractText(nameMatch[1]);
    
    // Skip invocation variants (they're duplicates with "Invocation:" prefix)
    if (name.startsWith('Invocation:')) continue;
    
    // Extract icon (base64 or CSS variable reference)
    let icon: string | undefined;
    const iconMatch = card.match(/<div class=list-card-icon><img[^>]*src=(['"])([^'"]+)\1/);
    if (iconMatch && iconMatch[2]) {
      const iconSrc = iconMatch[2];
      // Only keep actual image data, not placeholder SVGs
      if (iconSrc.startsWith('data:image/png')) {
        icon = iconSrc;
      }
    }
    
    // Extract school and level
    const schoolMatch = card.match(/<p class="list-card-label gradient-text">School<p>([^<]+)/);
    let school = 'Unknown';
    let level = 0;
    let schoolRank = '';
    if (schoolMatch) {
      schoolRank = extractText(schoolMatch[1]);
      // Format: "Evocation, Rank 1" or "Conjuration, Cantrip"
      const parts = schoolRank.split(',').map((s: string) => s.trim());
      school = parts[0] || 'Unknown';
      if (parts[1]) {
        const rankMatch = parts[1].match(/Rank (\d+)/i);
        if (rankMatch) {
          level = parseInt(rankMatch[1]);
        }
      }
    }
    
    // Extract flavor text (italic text)
    const flavorMatch = card.match(/<div class=list-card-row style=font-style:italic>([^<]+)/);
    const flavorText = flavorMatch ? extractText(flavorMatch[1]) : '';
    
    // Extract type
    const typeMatch = card.match(/<p class="list-card-label gradient-text">Type<p class=cap-text>([^<]+)/);
    const type = typeMatch ? extractText(typeMatch[1]) : undefined;
    
    // Extract damage
    const damageMatch = card.match(/<p class="list-card-label gradient-text">Amount<p class=amount-text>([^<]+)/);
    const damage = damageMatch ? extractText(damageMatch[1]) : undefined;
    
    // Extract range
    const rangeMatch = card.match(/<p class="list-card-label gradient-text">Range<\/p><\/div><div>([^<]+)/);
    const range = rangeMatch ? extractText(rangeMatch[1]) : undefined;
    
    // Extract duration
    const durationMatch = card.match(/<p class="list-card-label gradient-text">Duration<div><p>([^<]+)/);
    const duration = durationMatch ? extractText(durationMatch[1]) : undefined;
    
    // Extract saving throw
    const saveMatch = card.match(/<p class="list-card-label gradient-text">Saving Throw<\/p><\/div><div class=cap-text>([^<]+)/);
    const savingThrow = saveMatch ? extractText(saveMatch[1]) : undefined;
    
    // Extract cost
    const costMatch = card.match(/<p class="list-card-label gradient-text">Cost<p class=cap-text>([^<]+)/);
    const cost = costMatch ? extractText(costMatch[1]) : undefined;
    
    // Check concentration
    const concentration = card.includes('Requires Concentration');
    
    // Build structured description (for fallback display)
    const descParts: string[] = [];
    descParts.push(`School: ${schoolRank}`);
    if (flavorText) descParts.push(flavorText);
    if (type) descParts.push(`Type: ${type}`);
    if (damage) descParts.push(`Damage: ${damage}`);
    if (duration) descParts.push(`Duration: ${duration}`);
    if (range) descParts.push(`Range: ${range}`);
    if (savingThrow) descParts.push(`Saving Throw: ${savingThrow}`);
    if (cost) descParts.push(`Cost: ${cost}`);
    if (concentration) descParts.push('Requires Concentration');
    
    const description = descParts.join('\n\n');
    
    spells.push({
      name,
      level,
      school,
      schoolRank,
      flavorText,
      description,
      ...(icon && { icon }),
      ...(type && { type }),
      ...(damage && { damage }),
      ...(range && { range }),
      ...(duration && { duration }),
      ...(savingThrow && { savingThrow }),
      ...(cost && { cost }),
      concentration,
    });
  }
  
  return spells;
}

function main() {
  const allSpells: Spell[] = [];
  
  // Parse spells
  const spellsPath = findHtmlFile('BG3Compendium - Spells');
  if (spellsPath) {
    console.log(`Parsing ${path.basename(spellsPath)}...`);
    const spellsHtml = fs.readFileSync(spellsPath, 'utf-8');
    const spellList = parseSpellCards(spellsHtml);
    allSpells.push(...spellList);
    console.log(`Found ${spellList.length} spells`);
  } else {
    console.log('No Spells HTML file found');
  }
  
  // Parse cantrips
  const cantripsPath = findHtmlFile('BG3Compendium - Cantrips');
  if (cantripsPath) {
    console.log(`Parsing ${path.basename(cantripsPath)}...`);
    const cantripsHtml = fs.readFileSync(cantripsPath, 'utf-8');
    const cantripList = parseSpellCards(cantripsHtml);
    allSpells.push(...cantripList);
    console.log(`Found ${cantripList.length} cantrips`);
  } else {
    console.log('No Cantrips HTML file found');
  }
  
  // Convert to keyed object
  const spells: Record<string, Spell> = {};
  const seen = new Set<string>();
  
  for (const spell of allSpells) {
    const key = spell.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    spells[key] = spell;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(spells, null, 2));
  console.log(`Written ${Object.keys(spells).length} total spells/cantrips to ${OUTPUT_PATH}`);
}

main();
