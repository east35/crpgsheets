import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_DIR = path.join(
  __dirname,
  '../src/assets/html extractions/Boots _ Rogue Trader Wiki_files'
);
const OUTPUT_DIR = path.join(__dirname, '../src/assets/extracted');
const HTML_EXTRACTIONS_DIR = path.join(__dirname, '../src/assets/html extractions');

const CATEGORIES = [
  {
    key: 'boots',
    filename: 'Accessories/Boots ｜ Rogue Trader Wiki (1_25_2026 3：14：31 PM).html',
  },
  {
    key: 'rings',
    filename: 'Accessories/Rings ｜ Rogue Trader Wiki (1_25_2026 3：22：14 PM).html',
  },
  {
    key: 'helmets',
    filename: 'Accessories/Helmets.html',
  },
  {
    key: 'gloves',
    filename: 'Accessories/Gloves ｜ Rogue Trader Wiki (1_25_2026 3：21：27 PM).html',
  },
  {
    key: 'cloaks',
    filename: 'Accessories/Cloaks ｜ Rogue Trader Wiki (1_25_2026 3：21：48 PM).html',
  },
  {
    key: 'amulets',
    filename: 'Accessories/Amulets ｜ Rogue Trader Wiki (1_25_2026 3：22：00 PM).html',
  },
  {
    key: 'familiar-items',
    filename: 'Accessories/Familiar Items ｜ Rogue Trader Wiki (1_25_2026 3：22：30 PM).html',
  },
  {
    key: 'melee-weapons',
    filename: 'Weapons/Melee Weapons ｜ Rogue Trader Wiki (1_25_2026 3：30：02 PM).html',
  },
  {
    key: 'ranged-weapons',
    filename: 'Weapons/Ranged Weapons ｜ Rogue Trader Wiki (1_25_2026 3：33：34 PM).html',
  },
  {
    key: 'shields',
    filename: 'Weapons/Shields ｜ Rogue Trader Wiki (1_25_2026 3：30：23 PM).html',
  },
  {
    key: 'abilities',
    filename: 'Character/Abilities ｜ Rogue Trader Wiki (1_25_2026 3：39：05 PM).html',
  },
  {
    key: 'archetypes',
    filename: 'Character/Archetypes ｜ Rogue Trader Wiki (1_25_2026 3：38：50 PM).html',
  },
  {
    key: 'characteristics',
    filename: 'Character/Characteristics ｜ Rogue Trader Wiki (1_25_2026 3：40：41 PM).html',
  },
  {
    key: 'homeworlds',
    filename: 'Character/Homeworlds ｜ Rogue Trader Wiki (1_25_2026 3：38：21 PM).html',
  },
  {
    key: 'origin',
    filename: 'Character/Origin ｜ Rogue Trader Wiki (1_25_2026 3：38：32 PM).html',
  },
  {
    key: 'convictions',
    filename: 'Character/Rogue Trader Convictions (1_25_2026 3：38：05 PM).html',
  },
  {
    key: 'skills',
    filename: 'Character/Skills ｜ Rogue Trader Wiki (1_25_2026 3：40：54 PM).html',
  },
  {
    key: 'stats',
    filename: 'Character/Stats ｜ Rogue Trader Wiki (1_25_2026 3：39：39 PM).html',
  },
  {
    key: 'status-effects',
    filename: 'Character/Status Effects ｜ Rogue Trader Wiki (1_25_2026 3：40：06 PM).html',
  },
  {
    key: 'talents',
    filename: 'Character/Talents ｜ Rogue Trader Wiki (1_25_2026 3：39：22 PM).html',
  },
];

const ARMOR_CATEGORIES = [
  {
    key: 'light-chest-armor',
    filename: 'Armor/Light Chest Armor ｜ Rogue Trader Wiki (1_25_2026 3：35：32 PM).html',
  },
  {
    key: 'medium-chest-armor',
    filename: 'Armor/Medium Chest Armor ｜ Rogue Trader Wiki (1_25_2026 3：35：42 PM).html',
  },
  {
    key: 'heavy-chest-armor',
    filename: 'Armor/Heavy Chest Armor ｜ Rogue Trader Wiki (1_25_2026 3：35：59 PM).html',
  },
];

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function cleanHtmlToText(html) {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<li[^>]*>/gi, '\n')
    .replace(/<\/li>/gi, '')
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<[^>]+>/g, '');

  const decoded = decodeEntities(withBreaks);
  const lines = decoded.split('\n').map(normalizeLine).filter((line) => line.length > 0);
  return lines.join('\n');
}

function splitLines(value) {
  if (!value) return [];
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function normalizeImageKey(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = filename.slice(0, filename.length - ext.length);
  return base
    .toLowerCase()
    .replace(/_(\d+px)$/i, '')
    .replace(/_+$/g, '');
}

function buildImageIndex() {
  if (!fs.existsSync(FILES_DIR)) return { exact: new Map(), normalized: new Map() };
  const files = fs.readdirSync(FILES_DIR);
  const exact = new Map();
  const normalized = new Map();

  for (const file of files) {
    const lower = file.toLowerCase();
    exact.set(lower, file);

    const normalizedKey = normalizeImageKey(file);
    if (!normalized.has(normalizedKey)) {
      normalized.set(normalizedKey, file);
    }
  }

  return { exact, normalized };
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function decodeDataUriImage(dataUri) {
  if (!dataUri || typeof dataUri !== 'string') return null;
  const match = dataUri.match(/^data:image\/(png|jpe?g);base64,(.+)$/i);
  if (!match) return null;
  const ext = match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase();
  return { buffer: Buffer.from(match[2], 'base64'), ext };
}

function sanitizeFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function pickImageFilename(name, imageRemote, ext = 'png') {
  if (imageRemote) {
    const base = path.posix.basename(imageRemote);
    if (base && base !== '__image__') return sanitizeFilename(base);
  }
  return `${sanitizeFilename(name)}.${ext}`;
}

function getHtmlAttr(html, attrName) {
  const attrRegex = new RegExp(`${attrName}\\s*=\\s*(?:\"([^\"]+)\"|'([^']+)'|([^\\s>]+))`, 'i');
  const match = html.match(attrRegex);
  if (!match) return null;
  return match[1] || match[2] || match[3] || null;
}

function extractCssImageVars(html) {
  const vars = new Map();
  const regex = /--sf-img-(\d+)\s*:\s*url\(\"(data:image\/[^"]+)\"\)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    vars.set(match[1], match[2]);
  }
  return vars;
}

function resolveLocalImage(imageRemote, index) {
  if (!imageRemote) return null;

  const base = path.posix.basename(imageRemote);
  const lower = base.toLowerCase();
  if (index.exact.has(lower)) return index.exact.get(lower);

  const normalizedKey = normalizeImageKey(base);
  if (index.normalized.has(normalizedKey)) return index.normalized.get(normalizedKey);

  return null;
}

function parseCategory(category) {
  const htmlPath = path.join(HTML_EXTRACTIONS_DIR, category.filename);
  if (!fs.existsSync(htmlPath)) {
    console.log(`Skipping missing HTML: ${htmlPath}`);
    return [];
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  if (html.includes('table-sort')) {
    return parseGgCategory(category, html);
  }
  const cssImageVars = extractCssImageVars(html);
  const outputImageDir = path.join(OUTPUT_DIR, `${category.key}-images`);
  let tableMatch = html.match(
    /<table[^>]*class=\"?wiki_table[^>]*data-key=\"?weapons\"?[^>]*>([\s\S]*?)<\/table>/i
  );
  if (!tableMatch) {
    tableMatch = html.match(
      /<table[^>]*class=\"?wiki_table[^>]*data-key=\"?skills\"?[^>]*>([\s\S]*?)<\/table>/i
    );
  }
  if (!tableMatch) {
    tableMatch = html.match(/<table[^>]*class=\"?wiki_table[^>]*>([\s\S]*?)<\/table>/i);
  }
  if (!tableMatch) return [];

  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) return [];

  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items = [];
  const imageIndex = buildImageIndex();
  ensureDir(outputImageDir);

  let rowMatch;
  while ((rowMatch = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = rowMatch[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 3) continue;

    const nameCell = cells[0];
    const effectCell = cells[1];
    const prereqCell = cells[2];

    let name = '';
    const nameAfterBr = nameCell.match(/<br[^>]*>\s*([^<]+)\s*<\/a>/i);
    if (nameAfterBr) {
      name = nameAfterBr[1].trim();
    } else {
      const plainLink = nameCell.match(/<a[^>]*>([^<]+)<\/a>/i);
      if (plainLink) name = plainLink[1].trim();
    }

    const wikiUrl = getHtmlAttr(nameCell, 'href');

    let imageRemote = null;
    const dataSrc = getHtmlAttr(nameCell, 'data-src');
    const src = getHtmlAttr(nameCell, 'src');
    if (dataSrc) imageRemote = dataSrc;
    else if (src) imageRemote = src;

    const effect = cleanHtmlToText(effectCell);
    const prerequisiteText = cleanHtmlToText(prereqCell);
    const prerequisite = prerequisiteText.toLowerCase() === 'none' ? null : prerequisiteText || null;

    if (!name) continue;

    let imageLocal = resolveLocalImage(imageRemote, imageIndex);
    if (!imageLocal) {
      let dataUri = src;
      if (dataUri && dataUri.startsWith('data:image/svg+xml')) {
        const varMatch = nameCell.match(/background-image:\s*var\(--sf-img-(\d+)\)/i);
        if (varMatch) {
          dataUri = cssImageVars.get(varMatch[1]) || null;
        }
      }
      const imageData = decodeDataUriImage(dataUri);
      if (imageData) {
        const filename = pickImageFilename(name, imageRemote, imageData.ext === 'jpeg' ? 'jpg' : imageData.ext);
        const filePath = path.join(outputImageDir, filename);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, imageData.buffer);
        }
        imageLocal = path.join(`${category.key}-images`, filename);
      }
    }

    items.push({
      id: slugify(name),
      name,
      wikiUrl,
      imageRemote,
      imageLocal,
      effect,
      prerequisite,
      category: category.key,
    });
  }

  return items;
}

function parseGgCategory(category, html) {
  const outputImageDir = path.join(OUTPUT_DIR, `${category.key}-images`);
  const tableMatch = html.match(
    /<table[^>]*class=\"[^\"]*table-sort[^\"]*\"[^>]*>([\s\S]*?)<\/table>/i
  );
  if (!tableMatch) return [];

  const theadMatch = tableMatch[1].match(/<thead>([\s\S]*?)<\/thead>/i);
  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*?)<\/tbody>/i);
  if (!theadMatch || !tbodyMatch) return [];

  const headerCells = Array.from(theadMatch[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)).map(
    (match) => cleanHtmlToText(match[1]).toLowerCase()
  );
  const findHeaderIndex = (needle) =>
    headerCells.findIndex((header) => header.includes(needle.toLowerCase()));

  const colIndex = {
    icon: findHeaderIndex('icon'),
    title: findHeaderIndex('title'),
    lore: findHeaderIndex('lore'),
    description: findHeaderIndex('description'),
    location: findHeaderIndex('location'),
    armorSet: findHeaderIndex('armour set'),
    prerequisites: findHeaderIndex('talent prerequisites'),
    mustNotHave: findHeaderIndex('must not have features'),
  };

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  const items = [];
  ensureDir(outputImageDir);

  let rowMatch;
  while ((rowMatch = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = rowMatch[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length === 0) continue;

    const getCell = (index) => (index >= 0 && index < cells.length ? cells[index] : '');

    const titleCell = getCell(colIndex.title);
    const iconCell = getCell(colIndex.icon);
    const loreCell = getCell(colIndex.lore);
    const descriptionCell = getCell(colIndex.description);
    const locationCell = getCell(colIndex.location);
    const armorSetCell = getCell(colIndex.armorSet);
    const prereqCell = getCell(colIndex.prerequisites);
    const mustNotHaveCell = getCell(colIndex.mustNotHave);

    const nameMatch = titleCell ? titleCell.match(/<a[^>]*>([^<]+)<\/a>/i) : null;
    const name = nameMatch ? nameMatch[1].trim() : cleanHtmlToText(titleCell);
    if (!name) continue;

    const wikiUrl = getHtmlAttr(titleCell, 'href');
    const imageRemote = getHtmlAttr(iconCell, 'src') || getHtmlAttr(iconCell, 'data-src');

    let imageLocal = null;
    const imageData = decodeDataUriImage(imageRemote);
    if (imageData) {
      const filename = pickImageFilename(name, null, imageData.ext === 'jpeg' ? 'jpg' : imageData.ext);
      const filePath = path.join(outputImageDir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, imageData.buffer);
      }
      imageLocal = path.join(`${category.key}-images`, filename);
    }

    const lore = cleanHtmlToText(loreCell);
    const description = cleanHtmlToText(descriptionCell);
    const location = cleanHtmlToText(locationCell);
    const armorSet = cleanHtmlToText(armorSetCell);
    const mustNotHave = cleanHtmlToText(mustNotHaveCell);
    const prerequisites = cleanHtmlToText(prereqCell);

    const effectParts = [];
    if (description) effectParts.push(description);
    if (lore) effectParts.push(`Lore: ${lore}`);
    if (location) effectParts.push(`Location: ${location}`);
    if (armorSet) effectParts.push(`Armour Set: ${armorSet}`);
    if (mustNotHave) effectParts.push(`Must not have: ${mustNotHave}`);

    items.push({
      id: slugify(name),
      name,
      wikiUrl,
      imageRemote,
      imageLocal,
      effect: effectParts.join('\n'),
      prerequisite: prerequisites || null,
      category: category.key,
    });
  }

  return items;
}

function parseArmorCategory(category) {
  const htmlPath = path.join(HTML_EXTRACTIONS_DIR, category.filename);
  if (!fs.existsSync(htmlPath)) {
    console.log(`Skipping missing HTML: ${htmlPath}`);
    return [];
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  const cssImageVars = extractCssImageVars(html);
  const outputImageDir = path.join(OUTPUT_DIR, `${category.key}-images`);
  let tableMatch = html.match(
    /<table[^>]*class=\"?wiki_table[^>]*data-key=\"?skills\"?[^>]*>([\s\S]*?)<\/table>/i
  );
  if (!tableMatch) {
    tableMatch = html.match(/<table[^>]*class=\"?wiki_table[^>]*>([\s\S]*?)<\/table>/i);
  }
  if (!tableMatch) return [];

  const tbodyMatch = tableMatch[1].match(/<tbody>([\s\S]*?)<\/tbody>/);
  if (!tbodyMatch) return [];

  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const items = [];
  const imageIndex = buildImageIndex();
  ensureDir(outputImageDir);

  let rowMatch;
  while ((rowMatch = rowRegex.exec(tbodyMatch[1])) !== null) {
    const row = rowMatch[1];
    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g);
    if (!cells || cells.length < 5) continue;

    const nameCell = cells[0];
    const typeCell = cells[1];
    const armorCell = cells[2];
    const effectCell = cells[3];
    const prereqCell = cells[4];

    let name = '';
    const nameAfterBr = nameCell.match(/<br[^>]*>\s*([^<]+)\s*<\/a>/i);
    if (nameAfterBr) {
      name = nameAfterBr[1].trim();
    } else {
      const plainLink = nameCell.match(/<a[^>]*>([^<]+)<\/a>/i);
      if (plainLink) name = plainLink[1].trim();
    }

    const wikiUrl = getHtmlAttr(nameCell, 'href');

    let imageRemote = null;
    const dataSrc = getHtmlAttr(nameCell, 'data-src');
    const src = getHtmlAttr(nameCell, 'src');
    if (dataSrc) imageRemote = dataSrc;
    else if (src) imageRemote = src;

    const armorType = cleanHtmlToText(typeCell);
    const armorValue = cleanHtmlToText(armorCell);
    const effectText = cleanHtmlToText(effectCell);
    const prerequisiteList = splitLines(cleanHtmlToText(prereqCell));

    if (!name) continue;

    let imageLocal = resolveLocalImage(imageRemote, imageIndex);
    if (!imageLocal) {
      let dataUri = src;
      if (dataUri && dataUri.startsWith('data:image/svg+xml')) {
        const varMatch = nameCell.match(/background-image:\s*var\(--sf-img-(\d+)\)/i);
        if (varMatch) {
          dataUri = cssImageVars.get(varMatch[1]) || null;
        }
      }
      const imageData = decodeDataUriImage(dataUri);
      if (imageData) {
        const filename = pickImageFilename(name, imageRemote, imageData.ext === 'jpeg' ? 'jpg' : imageData.ext);
        const filePath = path.join(outputImageDir, filename);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, imageData.buffer);
        }
        imageLocal = path.join(`${category.key}-images`, filename);
      }
    }

    const effectParts = [];
    if (armorType) effectParts.push(`Type: ${armorType}`);
    if (armorValue) effectParts.push(`Armor: ${armorValue}`);
    if (effectText) effectParts.push(effectText);

    items.push({
      id: slugify(name),
      name,
      wikiUrl,
      imageRemote,
      imageLocal,
      effect: effectParts.join('\n'),
      prerequisite: prerequisiteList.length > 0 ? prerequisiteList.join('; ') : null,
      category: category.key,
    });
  }

  return items;
}

function main() {
  ensureDir(OUTPUT_DIR);
  for (const category of CATEGORIES) {
    const items = parseCategory(category);
    const outputPath = path.join(OUTPUT_DIR, `${category.key}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`Wrote ${items.length} items to ${outputPath}`);
  }

  for (const category of ARMOR_CATEGORIES) {
    const items = parseArmorCategory(category);
    const outputPath = path.join(OUTPUT_DIR, `${category.key}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
    console.log(`Wrote ${items.length} items to ${outputPath}`);
  }
}

main();
