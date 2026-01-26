/**
 * Audit script to identify talents and gear items with missing images
 * Run with: npx ts-node scripts/audit-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import data
import { TALENT_ICONS } from '../src/games/rogue-trader/data/talents/icon-map';
import { WIKI_TALENTS } from '../src/games/rogue-trader/data/talents/talents-from-wiki';
import { WIKI_ABILITIES } from '../src/games/rogue-trader/data/talents/abilities-from-wiki';
import { GEAR_DATA } from '../src/games/rogue-trader/data/gear/gear-from-wiki';

// Check public folder for talent icons
const TALENT_ICONS_DIR = path.join(__dirname, '../public/talent-icons');

interface AuditResult {
  talentsWithIcons: string[];
  talentsWithoutIcons: string[];
  abilitiesWithIcons: string[];
  abilitiesWithoutIcons: string[];
  gearWithImages: string[];
  gearWithoutImages: string[];
  gearWithPlaceholderImages: string[];
}

function auditImages(): AuditResult {
  const result: AuditResult = {
    talentsWithIcons: [],
    talentsWithoutIcons: [],
    abilitiesWithIcons: [],
    abilitiesWithoutIcons: [],
    gearWithImages: [],
    gearWithoutImages: [],
    gearWithPlaceholderImages: [],
  };

  // Check which icon files actually exist
  let existingIconFiles: Set<string> = new Set();
  if (fs.existsSync(TALENT_ICONS_DIR)) {
    const files = fs.readdirSync(TALENT_ICONS_DIR);
    existingIconFiles = new Set(files);
  }

  // Audit talents
  const talentIconKeys = new Set(Object.keys(TALENT_ICONS).map(k => k.toLowerCase()));
  
  for (const talent of Object.values(WIKI_TALENTS)) {
    const normalizedName = talent.name.toLowerCase().trim();
    if (talentIconKeys.has(normalizedName)) {
      result.talentsWithIcons.push(talent.name);
    } else {
      result.talentsWithoutIcons.push(talent.name);
    }
  }

  // Audit abilities
  for (const ability of Object.values(WIKI_ABILITIES)) {
    const normalizedName = ability.name.toLowerCase().trim();
    if (talentIconKeys.has(normalizedName)) {
      result.abilitiesWithIcons.push(ability.name);
    } else {
      result.abilitiesWithoutIcons.push(ability.name);
    }
  }

  // Audit gear
  for (const gear of Object.values(GEAR_DATA)) {
    if (gear.imageRemote) {
      // Check if it's a placeholder SVG
      if (gear.imageRemote.startsWith('data:image/svg+xml')) {
        result.gearWithPlaceholderImages.push(gear.name);
      } else if (gear.imageRemote.startsWith('data:image/png')) {
        result.gearWithImages.push(gear.name);
      } else {
        result.gearWithoutImages.push(gear.name);
      }
    } else {
      result.gearWithoutImages.push(gear.name);
    }
  }

  return result;
}

function main() {
  console.log('🔍 Auditing images for talents and gear...\n');
  
  const result = auditImages();

  console.log('=== TALENT ICONS ===');
  console.log(`✅ Talents with icons: ${result.talentsWithIcons.length}`);
  console.log(`❌ Talents without icons: ${result.talentsWithoutIcons.length}`);
  
  console.log('\n=== ABILITY ICONS ===');
  console.log(`✅ Abilities with icons: ${result.abilitiesWithIcons.length}`);
  console.log(`❌ Abilities without icons: ${result.abilitiesWithoutIcons.length}`);

  console.log('\n=== GEAR IMAGES ===');
  console.log(`✅ Gear with images: ${result.gearWithImages.length}`);
  console.log(`⚠️  Gear with placeholder images: ${result.gearWithPlaceholderImages.length}`);
  console.log(`❌ Gear without images: ${result.gearWithoutImages.length}`);

  // Write detailed report
  const reportPath = path.join(__dirname, 'image-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`\n📄 Detailed report written to: ${reportPath}`);

  // Print some examples of missing items
  if (result.talentsWithoutIcons.length > 0) {
    console.log('\n--- Sample talents without icons (first 10): ---');
    result.talentsWithoutIcons.slice(0, 10).forEach(t => console.log(`  - ${t}`));
  }

  if (result.gearWithPlaceholderImages.length > 0) {
    console.log('\n--- Sample gear with placeholder images (first 10): ---');
    result.gearWithPlaceholderImages.slice(0, 10).forEach(g => console.log(`  - ${g}`));
  }

  // Summary
  const totalTalents = result.talentsWithIcons.length + result.talentsWithoutIcons.length;
  const totalAbilities = result.abilitiesWithIcons.length + result.abilitiesWithoutIcons.length;
  const totalGear = result.gearWithImages.length + result.gearWithPlaceholderImages.length + result.gearWithoutImages.length;

  console.log('\n=== SUMMARY ===');
  console.log(`Talents: ${result.talentsWithIcons.length}/${totalTalents} have icons (${((result.talentsWithIcons.length / totalTalents) * 100).toFixed(1)}%)`);
  console.log(`Abilities: ${result.abilitiesWithIcons.length}/${totalAbilities} have icons (${((result.abilitiesWithIcons.length / totalAbilities) * 100).toFixed(1)}%)`);
  console.log(`Gear: ${result.gearWithImages.length}/${totalGear} have real images (${((result.gearWithImages.length / totalGear) * 100).toFixed(1)}%)`);
}

main();
