/**
 * HTML parser for bg3.wiki Feats page
 * Reads: bg3 reference csv/Feats - bg3.wiki*.html (SingleFile export)
 * Outputs: src/games/baldurs-gate-3/data/feats.json
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REF_DIR = path.join(__dirname, '../../bg3 reference csv');
const OUTPUT_PATH = path.join(__dirname, '../../src/games/baldurs-gate-3/data/feats.json');

interface Feat {
  name: string;
  description: string;
  benefits: string[];
  notes?: string;
  icon?: string;
}

function findHtmlFile(): string | null {
  const files = fs.readdirSync(REF_DIR);
  const htmlFiles = files.filter((f: string) => f.startsWith('Feats - bg3.wiki') && f.endsWith('.html'));
  if (htmlFiles.length === 0) {
    return null;
  }
  // Sort to get the newest file (by name, which includes timestamp)
  htmlFiles.sort();
  return path.join(REF_DIR, htmlFiles[htmlFiles.length - 1]);
}

function extractText(html: string): string {
  let text = html
    // Remove entire img tags (they have complex inline styles)
    .replace(/<img[^>]*>/gi, '')
    // Remove span tags with icon classes but keep content
    .replace(/<span[^>]*class="[^"]*icon[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
    // Remove remaining tags
    .replace(/<[^>]+>/g, ' ')
    // Clean up HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Remove leaked HTML attributes (width=, height=, class=, etc.)
    .replace(/\s*width=\d+/gi, '')
    .replace(/\s*height=\d+/gi, '')
    .replace(/\s*class=[^\s>]+/gi, '')
    .replace(/\s*>/g, '')
    // Clean up stray quotes
    .replace(/'\s*'/g, ' ')
    .replace(/'\s+/g, ' ')
    .replace(/\s+'/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}

function extractBulletPoints(html: string): string[] {
  const bullets: string[] = [];
  const liRegex = /<li>([^]*?)<\/li>/gi;
  let match;
  
  while ((match = liRegex.exec(html)) !== null) {
    const text = extractText(match[1]);
    if (text) {
      bullets.push(text);
    }
  }
  
  // Also try matching <li> without closing tag (wiki format)
  if (bullets.length === 0) {
    const altRegex = /<li>([^<]*(?:<[^>]+>[^<]*)*)/gi;
    while ((match = altRegex.exec(html)) !== null) {
      const text = extractText(match[1]);
      if (text) {
        bullets.push(text);
      }
    }
  }
  
  return bullets;
}

function parseFeats(html: string): Feat[] {
  const feats: Feat[] = [];
  
  // Find the main wikitable with feats
  const tableMatch = html.match(/<table class=wikitable[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.log('No wikitable found');
    return feats;
  }
  
  const tableHtml = tableMatch[1];
  
  // Split by rows
  const rows = tableHtml.split(/<tr>/gi).slice(1); // Skip first empty split
  
  let currentFeat: Partial<Feat> | null = null;
  let collectingNotes = false;
  
  for (const row of rows) {
    // Check for feat name (th with scope=rowgroup)
    const featNameMatch = row.match(/scope=rowgroup[^>]*>([^<]+)/i);
    if (featNameMatch) {
      // Save previous feat if exists
      if (currentFeat && currentFeat.name) {
        feats.push(currentFeat as Feat);
      }
      
      currentFeat = {
        name: extractText(featNameMatch[1]),
        description: '',
        benefits: [],
      };
      collectingNotes = false;
      
      // Check if this row also has description
      const descMatch = row.match(/<td[^>]*>([\s\S]*?)(?:<\/td>|$)/i);
      if (descMatch) {
        const benefits = extractBulletPoints(descMatch[1]);
        if (benefits.length > 0) {
          currentFeat.benefits = benefits;
          currentFeat.description = benefits.join('\n');
        }
      }
      continue;
    }
    
    // Check for Notes header
    if (row.includes('>Notes<') || row.includes('>Notes ')) {
      collectingNotes = true;
      continue;
    }
    
    // If we're collecting notes and have a td
    if (collectingNotes && currentFeat) {
      const notesMatch = row.match(/<td[^>]*>([\s\S]*?)(?:<\/td>|$)/i);
      if (notesMatch) {
        const notesBullets = extractBulletPoints(notesMatch[1]);
        if (notesBullets.length > 0) {
          currentFeat.notes = notesBullets.join(' ');
        } else {
          const notesText = extractText(notesMatch[1]);
          if (notesText) {
            currentFeat.notes = notesText;
          }
        }
      }
      collectingNotes = false;
      continue;
    }
    
    // Regular description row (td with benefits)
    if (currentFeat && !collectingNotes) {
      const descMatch = row.match(/<td[^>]*>([\s\S]*?)(?:<\/td>|$)/i);
      if (descMatch && !row.includes('scope=col')) {
        const benefits = extractBulletPoints(descMatch[1]);
        if (benefits.length > 0 && currentFeat.benefits?.length === 0) {
          currentFeat.benefits = benefits;
          currentFeat.description = benefits.join('\n');
        }
      }
    }
  }
  
  // Don't forget the last feat
  if (currentFeat && currentFeat.name) {
    feats.push(currentFeat as Feat);
  }
  
  return feats;
}

function main() {
  const htmlPath = findHtmlFile();
  if (!htmlPath) {
    console.log('No Feats HTML file found');
    return;
  }
  
  console.log(`Parsing ${path.basename(htmlPath)}...`);
  
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const featList = parseFeats(html);
  
  // Convert to keyed object
  const feats: Record<string, Feat> = {};
  const seen = new Set<string>();
  
  for (const feat of featList) {
    const key = feat.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (seen.has(key)) continue;
    seen.add(key);
    feats[key] = feat;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(feats, null, 2));
  console.log(`Written ${Object.keys(feats).length} feats to ${OUTPUT_PATH}`);
}

main();
