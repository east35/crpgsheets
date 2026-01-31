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

function toId(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function cleanText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<span[^>]*>/gi, '')
    .replace(/<\/span>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseArchetypesHTML(): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character/Archetypes ｜ Rogue Trader Wiki (1_25_2026 3：38：50 PM).html');
  if (!fs.existsSync(htmlPath)) {
    console.log('Archetypes HTML not found');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Find all col-sm-4 or col-sm-3 divs with archetype info
  const colRegex = /<div class=col-sm-[34]>\s*<h3[^>]*><a class=wiki_link[^>]*title="[^"]*"[^>]*href=([^\s>]+)[^>]*><img[^>]*title=([^\s>]+)[^>]*src="?([^"\s>]+)"?[^>]*>[\s\S]*?<\/a><\/h3>\s*([\s\S]*?)<\/div>/gi;
  
  let match;
  while ((match = colRegex.exec(html)) !== null) {
    const wikiUrl = match[1].replace(/['"]/g, '');
    const imgSrc = match[3];
    const content = match[4];
    
    // Extract name from URL or title
    const nameFromUrl = wikiUrl.split('/').pop()?.replace(/\+/g, ' ') || '';
    const name = decodeURIComponent(nameFromUrl);
    
    // Extract description from p tags
    const pTags = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const description = pTags.map(p => cleanText(p)).filter(t => t && t !== '').join('\n');
    
    if (name && description) {
      items.push({
        id: toId(name),
        name,
        wikiUrl,
        imageRemote: imgSrc.startsWith('data:') ? imgSrc.substring(0, 100) + '...' : imgSrc,
        imageLocal: null,
        effect: description,
        prerequisite: null,
        category: 'archetypes'
      });
    }
  }
  
  return items;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseGenericGalleryPage(filename: string, category: string): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character', filename);
  if (!fs.existsSync(htmlPath)) {
    console.log(`${category} HTML not found: ${filename}`);
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Look for h3 headings with wiki links followed by content
  // Pattern: <h3 class=titlearea>Name</h3> followed by content until next h3
  const sectionRegex = /<h3[^>]*class="?titlearea"?[^>]*>([^<]+)<\/h3>([\s\S]*?)(?=<h3|<div class=discussion-wrapper)/gi;
  
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const name = cleanText(match[1]);
    const content = match[2];
    
    // Extract description from p tags
    const pTags = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const description = pTags.map(p => cleanText(p)).filter(t => t && t.length > 5).join('\n');
    
    if (name && description && name.length > 2) {
      items.push({
        id: toId(name),
        name,
        wikiUrl: `https://roguetrader.wiki.fextralife.com/${encodeURIComponent(name).replace(/%20/g, '+')}`,
        imageRemote: null,
        imageLocal: null,
        effect: description,
        prerequisite: null,
        category
      });
    }
  }
  
  return items;
}

function parseStatusEffectsHTML(): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character/Status Effects ｜ Rogue Trader Wiki (1_25_2026 3：40：06 PM).html');
  if (!fs.existsSync(htmlPath)) {
    console.log('Status Effects HTML not found');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Status effects page has a table with wiki_table class
  const tableMatch = html.match(/<table class="wiki_table sortable searchable"[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.log('Status Effects: Could not find table');
    return [];
  }
  
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*)<\/tbody>/);
  if (!tbodyMatch) return [];
  
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  
  let match;
  while ((match = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = match[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 2) continue;
    
    // Name is in first cell, wrapped in h4 and span
    const nameMatch = cells[0].match(/<span[^>]*>([^<]+)<\/span>/);
    const name = nameMatch ? cleanText(nameMatch[1]) : '';
    
    // Effect is in second cell
    const effect = cleanText(cells[1]);
    
    if (name && effect) {
      items.push({
        id: toId(name),
        name,
        wikiUrl: `https://roguetrader.wiki.fextralife.com/${encodeURIComponent(name).replace(/%20/g, '+')}`,
        imageRemote: null,
        imageLocal: null,
        effect,
        prerequisite: null,
        category: 'status-effects'
      });
    }
  }
  
  return items;
}

function parseSkillsHTML(): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character/Skills ｜ Rogue Trader Wiki (1_25_2026 3：40：54 PM).html');
  if (!fs.existsSync(htmlPath)) {
    console.log('Skills HTML not found');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Skills page uses col-sm-4 divs - parse each div block
  // Pattern: <div class=col-sm-4> ... </div>
  const divRegex = /<div class=col-sm-[34]>\s*([\s\S]*?)<\/div>\s*(?=<div class=col-sm|<\/div>\s*<p>|<p>&nbsp;)/gi;
  
  let match;
  while ((match = divRegex.exec(html)) !== null) {
    const content = match[1];
    
    // Extract name from h3 > a
    const nameMatch = content.match(/<h3[^>]*><a[^>]*href=([^\s>]+)[^>]*>([^<]+)<\/a><\/h3>/i);
    if (!nameMatch) continue;
    
    const wikiUrl = nameMatch[1].replace(/['"]/g, '');
    const name = cleanText(nameMatch[2]);
    
    // Extract all p tags for description
    const pTags = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const description = pTags.map(p => cleanText(p)).filter(t => t && t.length > 5).join('\n');
    
    if (name && description) {
      items.push({
        id: toId(name),
        name,
        wikiUrl: wikiUrl.startsWith('http') ? wikiUrl : `https://roguetrader.wiki.fextralife.com${wikiUrl}`,
        imageRemote: null,
        imageLocal: null,
        effect: description,
        prerequisite: null,
        category: 'skills'
      });
    }
  }
  
  return items;
}

function parseConvictionsHTML(): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character/Rogue Trader Convictions (1_25_2026 3：38：05 PM).html');
  if (!fs.existsSync(htmlPath)) {
    console.log('Convictions HTML not found');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Convictions uses h3.bonfire with links inside
  const bonfireRegex = /<h3 class=bonfire><a[^>]*href=([^\s>]+)[^>]*>([^<]+)<\/a><\/h3>([\s\S]*?)(?=<h3 class=bonfire|<hr>|<div class=discussion-wrapper)/gi;
  
  let match;
  while ((match = bonfireRegex.exec(html)) !== null) {
    const wikiUrl = match[1].replace(/['"]/g, '');
    const name = cleanText(match[2]);
    const content = match[3];
    
    // Extract description from p tags and table
    const pTags = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const description = pTags.map(p => cleanText(p)).filter(t => t && t.length > 10).join('\n');
    
    if (name && description) {
      items.push({
        id: toId(name),
        name,
        wikiUrl: wikiUrl.startsWith('http') ? wikiUrl : `https://roguetrader.wiki.fextralife.com${wikiUrl}`,
        imageRemote: null,
        imageLocal: null,
        effect: description,
        prerequisite: null,
        category: 'convictions'
      });
    }
  }
  
  return items;
}

function parseOriginsHTML(): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character/Origin ｜ Rogue Trader Wiki (1_25_2026 3：38：32 PM).html');
  if (!fs.existsSync(htmlPath)) {
    console.log('Origins HTML not found');
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Origins uses col-sm-4 with img then h3 with link (name only, no description on main page)
  const colRegex = /<div class=col-sm-4>\s*<h3[^>]*><a[^>]*href=([^\s>]+)[^>]*>(?:<img[^>]*>)?([^<]*)<\/a><\/h3>/gi;
  
  let match;
  while ((match = colRegex.exec(html)) !== null) {
    const wikiUrl = match[1].replace(/['"]/g, '');
    let name = cleanText(match[2]);
    
    // If name is empty, try to get it from the URL
    if (!name) {
      const urlName = wikiUrl.split('/').pop()?.replace(/\+/g, ' ') || '';
      name = decodeURIComponent(urlName);
    }
    
    if (name && name.length > 2) {
      items.push({
        id: toId(name),
        name,
        wikiUrl: wikiUrl.startsWith('http') ? wikiUrl : `https://roguetrader.wiki.fextralife.com${wikiUrl}`,
        imageRemote: null,
        imageLocal: null,
        effect: '', // Origins don't have descriptions on the main page
        prerequisite: null,
        category: 'origins'
      });
    }
  }
  
  return items;
}

function parseColSmPage(filename: string, category: string): ExtractedItem[] {
  const htmlPath = path.join(__dirname, '../src/assets/html extractions/Character', filename);
  if (!fs.existsSync(htmlPath)) {
    console.log(`${category} HTML not found: ${filename}`);
    return [];
  }
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const items: ExtractedItem[] = [];

  // Parse col-sm-4 or col-sm-3 divs with h3 links and p descriptions
  const divRegex = /<div class=col-sm-[34]>\s*([\s\S]*?)<\/div>\s*(?=<div class=col-sm|<\/div>\s*<p>|<p>&nbsp;)/gi;
  
  let match;
  while ((match = divRegex.exec(html)) !== null) {
    const content = match[1];
    
    // Extract name from h3 > a
    const nameMatch = content.match(/<h3[^>]*><a[^>]*href=([^\s>]+)[^>]*>([^<]+)<\/a><\/h3>/i);
    if (!nameMatch) continue;
    
    const wikiUrl = nameMatch[1].replace(/['"]/g, '');
    const name = cleanText(nameMatch[2]);
    
    // Extract all p tags for description
    const pTags = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const description = pTags.map(p => cleanText(p)).filter(t => t && t.length > 5).join('\n');
    
    if (name && description) {
      items.push({
        id: toId(name),
        name,
        wikiUrl: wikiUrl.startsWith('http') ? wikiUrl : `https://roguetrader.wiki.fextralife.com${wikiUrl}`,
        imageRemote: null,
        imageLocal: null,
        effect: description,
        prerequisite: null,
        category
      });
    }
  }
  
  return items;
}

function writeJsonFile(items: ExtractedItem[], filename: string): void {
  const outputPath = path.join(__dirname, '../src/assets/extracted', filename);
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} items to ${filename}`);
}

function main(): void {
  console.log('Parsing Character HTML files...\n');
  
  // Parse Archetypes
  const archetypes = parseArchetypesHTML();
  console.log(`Archetypes: ${archetypes.length} items`);
  if (archetypes.length > 0) {
    writeJsonFile(archetypes, 'archetypes.json');
  }
  
  // Parse Status Effects
  const statusEffects = parseStatusEffectsHTML();
  console.log(`Status Effects: ${statusEffects.length} items`);
  if (statusEffects.length > 0) {
    writeJsonFile(statusEffects, 'status-effects.json');
  }
  
  // Parse Skills
  const skills = parseSkillsHTML();
  console.log(`Skills: ${skills.length} items`);
  if (skills.length > 0) {
    writeJsonFile(skills, 'skills.json');
  }
  
  // Parse Characteristics
  const characteristics = parseColSmPage('Characteristics ｜ Rogue Trader Wiki (1_25_2026 3：40：41 PM).html', 'characteristics');
  console.log(`Characteristics: ${characteristics.length} items`);
  if (characteristics.length > 0) {
    writeJsonFile(characteristics, 'characteristics.json');
  }
  
  // Parse Homeworlds
  const homeworlds = parseColSmPage('Homeworlds ｜ Rogue Trader Wiki (1_25_2026 3：38：21 PM).html', 'homeworlds');
  console.log(`Homeworlds: ${homeworlds.length} items`);
  if (homeworlds.length > 0) {
    writeJsonFile(homeworlds, 'homeworlds.json');
  }
  
  // Parse Origin
  const origins = parseOriginsHTML();
  console.log(`Origins: ${origins.length} items`);
  if (origins.length > 0) {
    writeJsonFile(origins, 'origin.json');
  }
  
  // Parse Convictions - uses h3.bonfire with links
  const convictions = parseConvictionsHTML();
  console.log(`Convictions: ${convictions.length} items`);
  if (convictions.length > 0) {
    writeJsonFile(convictions, 'convictions.json');
  }
  
  // Parse Stats
  const stats = parseColSmPage('Stats ｜ Rogue Trader Wiki (1_25_2026 3：39：39 PM).html', 'stats');
  console.log(`Stats: ${stats.length} items`);
  if (stats.length > 0) {
    writeJsonFile(stats, 'stats.json');
  }
  
  console.log('\nDone!');
}

main();
