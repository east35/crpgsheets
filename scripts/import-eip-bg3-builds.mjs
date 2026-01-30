import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';

const LIST_URL = 'https://eip.gg/bg3/builds/';
const SOURCE_LABEL = 'EIP.gg';
const OUTPUT_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/games/baldurs-gate-3/data/builds/index.ts');

const COMPANION_NAMES = [
  'Shadowheart',
  'Astarion',
  'Gale',
  'Laezel',
  'Wyll',
  'Karlach',
  'Halsin',
  'Jaheira',
  'Minsc',
  'Minthara',
];

const COMPANION_ALIASES = new Map([
  ['lae\'zel', 'Laezel'],
  ['laezel', 'Laezel'],
  ['shadowheart', 'Shadowheart'],
  ['astarion', 'Astarion'],
  ['gale', 'Gale'],
  ['wyll', 'Wyll'],
  ['karlach', 'Karlach'],
  ['halsin', 'Halsin'],
  ['jaheira', 'Jaheira'],
  ['minsc', 'Minsc'],
  ['minthara', 'Minthara'],
]);

const RACE_NAMES = [
  'Dragonborn',
  'Drow',
  'Dwarf',
  'Elf',
  'Githyanki',
  'Gnome',
  'Half-Elf',
  'Half-Orc',
  'Halfling',
  'Human',
  'Tiefling',
];

const SUBRACE_NAMES = [
  'High Elf',
  'Wood Elf',
  'High Half-Elf',
  'Wood Half-Elf',
  'Drow Half-Elf',
  'Asmodeus Tiefling',
  'Mephistopheles Tiefling',
  'Zariel Tiefling',
  'Seldarine Drow',
  'Lolth-Sworn Drow',
  'Forest Gnome',
  'Rock Gnome',
  'Deep Gnome',
  'Duergar',
  'Gold Dwarf',
  'Shield Dwarf',
  'Lightfoot Halfling',
  'Stout Halfling',
  'Strongheart Halfling',
  'Githyanki',
  'Half-Orc',
  'Dragonborn',
];

const BACKGROUND_NAMES = [
  'Acolyte',
  'Charlatan',
  'Criminal',
  'Entertainer',
  'Folk Hero',
  'Guild Artisan',
  'Haunted One',
  'Noble',
  'Outlander',
  'Sage',
  'Soldier',
  'Urchin',
];

const CLASS_NAMES = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
];

const SUBCLASS_LEVEL = {
  Barbarian: 3,
  Bard: 3,
  Cleric: 1,
  Druid: 2,
  Fighter: 3,
  Monk: 3,
  Paladin: 1,
  Ranger: 3,
  Rogue: 3,
  Sorcerer: 1,
  Warlock: 1,
  Wizard: 2,
};

const EQUIPMENT_SLOT_BY_HEADING = {
  Chestpiece: 'armour',
  Armor: 'armour',
  Armour: 'armour',
  Shield: 'melee',
  Cloak: 'cloak',
  Footwear: 'boots',
  Boots: 'boots',
  Headwear: 'head',
  Helmet: 'head',
  Gloves: 'gloves',
  Rings: 'ring1',
  Ring: 'ring1',
  Amulet: 'amulet',
  Necklace: 'amulet',
  Weapons: 'melee',
  Weapon: 'melee',
  'Main Hand': 'melee',
  'Off Hand': 'melee',
  Ranged: 'ranged',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

const titleCase = (value) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const trimDescription = (value, max = 220) => {
  if (!value) return '';
  const cleaned = value.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max).trim()}…`;
};

const parseLabelValue = (text) => {
  const parts = text.split(/–|-/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 1];
  return text.trim();
};

const findMatch = (value, options) => {
  const lower = value.toLowerCase();
  return options.find((option) => lower.includes(option.toLowerCase()));
};

const parseRaceAndSubrace = (rawValue) => {
  if (!rawValue) return { race: 'Human', subrace: undefined };
  const race = findMatch(rawValue, RACE_NAMES) || 'Human';
  const subrace = findMatch(rawValue, SUBRACE_NAMES);
  if (subrace && race === 'Half-Elf' && !subrace.toLowerCase().includes('half-elf')) {
    return { race, subrace: `${subrace} Half-Elf` };
  }
  return { race, subrace: subrace || undefined };
};

const parseBackground = (rawValue) => {
  if (!rawValue) return 'Soldier';
  return findMatch(rawValue, BACKGROUND_NAMES) || 'Soldier';
};

const parseClassName = (rawValue) => {
  if (!rawValue) return 'Fighter';
  return findMatch(rawValue, CLASS_NAMES) || 'Fighter';
};

const parseAbilityScores = (items) => {
  const scores = {
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  };

  if (!items || items.length === 0) return scores;

  for (const item of items) {
    const match = item.match(/(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)/i);
    if (match) {
      scores[match[2][0].toUpperCase() + match[2].slice(1)] = Number.parseInt(match[1], 10);
    }
  }

  return scores;
};

const parseAbilityImprovement = (value) => {
  if (!value) return undefined;
  const match = value.match(/\\(([^)]+)\\)/);
  if (!match) return undefined;
  const bonuses = match[1]
    .split(',')
    .map((part) => part.trim())
    .map((part) => part.match(/([+-]?\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)/i))
    .filter(Boolean);

  if (bonuses.length === 0) return undefined;
  const improvements = {};
  for (const bonus of bonuses) {
    const amount = Number.parseInt(bonus[1], 10);
    const stat = bonus[2][0].toUpperCase() + bonus[2].slice(1);
    improvements[stat] = amount;
  }
  return improvements;
};

const parseLabeledList = ($, sectionHeading) => {
  const list = sectionHeading.nextAll('ul,ol').first();
  if (!list.length) return [];
  const items = [];
  list.children('li').each((_, li) => {
    const $li = $(li);
    const label = $li.find('strong, b').first().text().trim();
    const text = $li.clone().children('ul,ol').remove().end().text().replace(/\s+/g, ' ').trim();
    const nestedItems = $li
      .find('ul,ol')
      .first()
      .find('li')
      .map((__, el) => $(el).text().replace(/\s+/g, ' ').trim())
      .get();
    items.push({ label: label || text.split(/–|-/)[0].trim(), text, items: nestedItems });
  });
  return items;
};

const parseSummarySection = ($, article) => {
  const heading = article.find('h2').filter((_, el) => $(el).text().trim() === 'Build Summary').first();
  if (!heading.length) return [];
  return parseLabeledList($, heading);
};

const parseFeatsSection = ($, article) => {
  const heading = article.find('h3').filter((_, el) => $(el).text().trim() === 'Feats').first();
  if (!heading.length) return [];
  const list = heading.nextAll('ul,ol').first();
  if (!list.length) return [];
  return list.children('li').map((_, li) => $(li).text().replace(/\s+/g, ' ').trim()).get();
};

const extractSectionText = ($, article, headingText) => {
  const heading = article.find('h2').filter((_, el) => $(el).text().trim() === headingText).first();
  if (!heading.length) return '';
  const collected = [];
  let next = heading.next();
  while (next.length && next.get(0).tagName !== 'h2') {
    collected.push(next.text().replace(/\s+/g, ' ').trim());
    next = next.next();
  }
  return collected.join(' ');
};

const parseCharacterCreationSection = ($, article) => {
  let heading = article.find('h2').filter((_, el) => $(el).text().trim() === 'Character Creation').first();
  if (!heading.length) {
    heading = article.find('h2').filter((_, el) => $(el).text().trim().endsWith('Overview')).first();
  }
  if (!heading.length) return [];
  return parseLabeledList($, heading);
};

const parseAdvancingSection = ($, article) => {
  const heading = article.find('h2').filter((_, el) => $(el).text().trim() === 'Advancing Through the Levels').first();
  if (!heading.length) return [];
  const list = heading.nextAll('ul,ol').first();
  if (!list.length) return [];
  return list.children('li').map((_, li) => $(li).text().replace(/\s+/g, ' ').trim()).get();
};

const extractLabelValues = (text) => {
  const labels = ['Class', 'Subclass', 'Feat', 'Feats', 'Spells', 'Cantrips', 'Fighting Style', 'Dragon Ancestor', 'Proficiency', 'Expertise'];
  const regex = new RegExp(`(${labels.join('|')})\\s*[–-]\\s*`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ label: match[1], valueStart: match.index + match[0].length, labelStart: match.index });
  }
  const values = {};
  for (let i = 0; i < matches.length; i += 1) {
    const current = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].labelStart : text.length;
    const value = text.slice(current.valueStart, nextStart).trim();
    values[current.label.toLowerCase()] = value;
  }
  return values;
};

const parseProgression = (startingClass, advancingItems, summaryItems, extraFeats) => {
  const levelEntries = [];
  const classLevels = new Map();
  const subclassByClass = new Map();
  const levelData = new Map();

  for (const text of advancingItems) {
    const levelMatch = text.match(/Level\s*(\d+)/i);
    if (!levelMatch) continue;
    const level = Number.parseInt(levelMatch[1], 10);
    const values = extractLabelValues(text);
    const className = parseClassName(values.class || '');
    const subclass = values.subclass ? values.subclass.replace(/\s+/g, ' ').trim() : undefined;
    const feat = values.feat || values.feats;
    const spells = values.spells ? values.spells.split(',').map((spell) => spell.trim()).filter(Boolean) : [];
    const cantrips = values.cantrips ? values.cantrips.split(',').map((spell) => spell.trim()).filter(Boolean) : [];
    levelData.set(level, { className, subclass, feat: feat?.trim(), spells: [...spells, ...cantrips] });
  }

  const feats = summaryItems.find((item) => item.label.toLowerCase() === 'feats')?.items || extraFeats;
  const featByLevel = new Map();
  const featLevels = [4, 8, 12];
  for (let i = 0; i < featLevels.length; i += 1) {
    if (feats[i] && !featByLevel.has(featLevels[i])) {
      featByLevel.set(featLevels[i], feats[i]);
    }
  }

  const summarySubclass = summaryItems.find((item) => item.label.toLowerCase() === 'subclass')?.items?.[0];
  if (summarySubclass) {
    subclassByClass.set(startingClass, summarySubclass);
  }

  const addLevelEntry = (level, className, subclass, feat, spells, notes) => {
    const current = classLevels.get(className) || 0;
    classLevels.set(className, current + 1);
    if (subclass) {
      subclassByClass.set(className, subclass);
    }

    const classLevelsArray = Array.from(classLevels.entries()).map(([cls, lvl]) => ({
      class: cls,
      level: lvl,
      ...(subclassByClass.has(cls) && lvl >= (SUBCLASS_LEVEL[cls] || 1) ? { subclass: subclassByClass.get(cls) } : {}),
    }));

    const dedupedSpells = spells ? Array.from(new Set(spells)) : [];

    levelEntries.push({
      characterLevel: level,
      classLevels: classLevelsArray,
      ...(feat ? { feat } : {}),
      ...(feat ? { abilityScoreImprovement: parseAbilityImprovement(feat) } : {}),
      ...(dedupedSpells.length > 0 ? { spellsLearned: dedupedSpells } : {}),
      ...(notes ? { notes } : {}),
    });
  };

  let lastClass = startingClass;
  for (let level = 1; level <= 12; level += 1) {
    const data = levelData.get(level);
    const className = data?.className || lastClass;
    if (data?.className) lastClass = data.className;
    const feat = data?.feat || featByLevel.get(level);
    addLevelEntry(level, className, data?.subclass, feat, data?.spells || [], data?.notes);
  }

  return levelEntries;
};

const parseEquipment = (article) => {
  const equipmentHeading = article.find('h2').filter((_, el) => article.find(el).text().trim() === 'Equipment').first();
  if (!equipmentHeading.length) return [];

  const gear = [];
  const headings = equipmentHeading.nextAll('h3');
  headings.each((_, el) => {
    const headingText = equipmentHeading.find(el).text().trim();
    const slot = EQUIPMENT_SLOT_BY_HEADING[headingText];
    if (!slot) return;
    const list = equipmentHeading.find(el).nextAll('ul,ol').first();
    if (!list.length) return;
    const items = list.children('li').map((__, li) => {
      const $li = list.find(li);
      const strong = $li.find('strong, b').first().text().trim();
      if (strong) return strong;
      const text = $li.text().replace(/\s+/g, ' ').trim();
      return text.split(/[–—-]/)[0].trim();
    }).get().filter(Boolean);
    if (items.length > 0) {
      gear.push({ slot, items });
    }
  });

  return gear;
};

const parseLevelSpellLists = ($, article) => {
  const levelMap = new Map();
  article.find('strong').each((_, el) => {
    const text = $(el).text().trim();
    const match = text.match(/^Level\s*(\d+)$/i);
    if (!match) return;
    const level = Number.parseInt(match[1], 10);
    const li = $(el).closest('li');
    const spellItems = li
      .find('ul')
      .first()
      .children('li')
      .map((__, liEl) => {
        const anchorText = $(liEl).find('a').first().text().trim();
        if (anchorText) return anchorText;
        return $(liEl).text().replace(/\s+/g, ' ').trim();
      })
      .get()
      .filter(Boolean);
    if (spellItems.length > 0) {
      const existing = levelMap.get(level) || [];
      levelMap.set(level, [...existing, ...spellItems]);
    }
  });
  return levelMap;
};

const detectCompanion = (title, url) => {
  const lowered = normalize(`${title} ${url}`);
  for (const [alias, name] of COMPANION_ALIASES.entries()) {
    if (lowered.includes(normalize(alias))) return name;
  }
  return null;
};

const extractTags = (article, companionName) => {
  const classes = (article.attr('class') || '').split(/\s+/).filter(Boolean);
  const tags = new Set();
  for (const cls of classes) {
    if (cls.startsWith('builds-bg3-class-')) {
      const name = cls.replace('builds-bg3-class-', '').replace(/-/g, ' ');
      tags.add(titleCase(name));
    }
    if (cls.startsWith('builds-bg3-tag-')) {
      const name = cls.replace('builds-bg3-tag-', '').replace(/-/g, ' ');
      tags.add(titleCase(name));
    }
  }
  if (companionName) {
    tags.add('Companion');
    tags.add(companionName);
  }
  return Array.from(tags);
};

const parseBuild = async (url) => {
  const html = await (await fetch(url)).text();
  const $ = load(html);
  const article = $('article.build, article.type-build').first();
  if (!article.length) return null;

  const title = article.find('h1').first().text().trim();
  if (!title) return null;

  const metaDescription = $('meta[name=\"description\"]').attr('content') || '';
  const description = trimDescription(metaDescription);

  const summaryItems = parseSummarySection($, article);
  const creationItems = parseCharacterCreationSection($, article);
  const advancingItems = parseAdvancingSection($, article);
  const gearRecommendations = parseEquipment(article);
  const featsFromSection = parseFeatsSection($, article);
  const levelSpellMap = parseLevelSpellLists($, article);

  if (summaryItems.length === 0 && creationItems.length === 0 && advancingItems.length === 0 && gearRecommendations.length === 0) {
    return null;
  }

  const creationMap = new Map(creationItems.map((item) => [item.label.toLowerCase(), item]));
  const raceValue = creationMap.get('race')?.text || creationMap.get('race/subrace')?.text || '';
  const backgroundValue = creationMap.get('background')?.text || '';
  const classValue = creationMap.get('class')?.text || creationMap.get('starting class')?.text || '';
  const abilitiesItem = creationMap.get('abilities');

  const fallbackText = extractSectionText($, article, 'Character Creation');
  const fallbackRace = raceValue ? parseLabelValue(raceValue) : fallbackText;
  const fallbackBackground = backgroundValue ? parseLabelValue(backgroundValue) : fallbackText;
  const fallbackClass = classValue ? parseLabelValue(classValue) : '';

  const { race, subrace } = parseRaceAndSubrace(fallbackRace);
  const background = parseBackground(fallbackBackground);
  const startingClass = parseClassName(fallbackClass || extractTags(article, null).find((tag) => CLASS_NAMES.includes(tag)) || '');
  const abilityScores = parseAbilityScores(abilitiesItem?.items || []);

  const companionName = detectCompanion(title, url);
  const tags = extractTags(article, companionName);

  const notesByLevel = new Map();
  const spellsByLevel = new Map();

  const skillItems = creationMap.get('skill proficiencies')?.items;
  if (skillItems && skillItems.length > 0) {
    notesByLevel.set(1, `Skill Proficiencies: ${skillItems.join(', ')}`);
  }

  const startingCantrips = creationMap.get('starting cantrips')?.items || [];
  const startingSpells = creationMap.get('starting spells')?.items || [];
  if (startingCantrips.length || startingSpells.length) {
    spellsByLevel.set(1, [...startingCantrips, ...startingSpells]);
  }

  for (const [level, spells] of levelSpellMap.entries()) {
    const existing = spellsByLevel.get(level) || [];
    spellsByLevel.set(level, [...existing, ...spells]);
  }

  const progression = parseProgression(startingClass, advancingItems, summaryItems, featsFromSection)
    .map((entry) => {
      const extraSpells = spellsByLevel.get(entry.characterLevel) || [];
      const combinedSpells = [...(entry.spellsLearned || []), ...extraSpells];
      const notes = notesByLevel.get(entry.characterLevel);
      return {
        ...entry,
        ...(combinedSpells.length > 0 ? { spellsLearned: Array.from(new Set(combinedSpells)) } : {}),
        ...(notes ? { notes } : {}),
      };
    });

  const slug = url.replace(/\/$/, '').split('/').pop();
  return {
    id: slug,
    name: title,
    description,
    author: SOURCE_LABEL,
    sourceUrl: url,
    sourceLabel: SOURCE_LABEL,
    race,
    ...(subrace ? { subrace } : {}),
    background,
    abilityScores,
    progression,
    ...(gearRecommendations.length > 0 ? { gearRecommendations } : {}),
    ...(tags.length > 0 ? { tags } : {}),
  };
};

const extractBuildLinks = async () => {
  const html = await (await fetch(LIST_URL)).text();
  const $ = load(html);
  const links = new Set();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    if (!href.startsWith('https://eip.gg/bg3/')) return;
    if (href === LIST_URL || href === `${LIST_URL}#`) return;
    if (href.includes('/bg3/builds/')) links.add(href.split('#')[0]);
  });
  return Array.from(links).filter((link) => !link.endsWith('/builds/'));
};

const main = async () => {
  if (process.env.EIP_DEBUG_URL) {
    const build = await parseBuild(process.env.EIP_DEBUG_URL);
    console.log(JSON.stringify(build, null, 2));
    return;
  }
  const links = await extractBuildLinks();
  const limit = process.env.EIP_LIMIT ? Number.parseInt(process.env.EIP_LIMIT, 10) : null;
  const targetLinks = limit ? links.slice(0, limit) : links;
  const builds = [];

  for (const link of targetLinks) {
    try {
      const build = await parseBuild(link);
      if (build) builds.push(build);
    } catch (error) {
      console.error(`Failed to parse ${link}:`, error.message);
    }
    await sleep(150);
  }

  const sortedBuilds = builds.sort((a, b) => a.name.localeCompare(b.name));
  const output = `import type { BG3Build } from '../../types';

export const COMMUNITY_BUILDS: BG3Build[] = ${JSON.stringify(sortedBuilds, null, 2)};

export function getBuild(id: string): BG3Build | undefined {
  return COMMUNITY_BUILDS.find(b => b.id === id);
}

export function getAllBuilds(): BG3Build[] {
  return COMMUNITY_BUILDS;
}

export function getBuildsByTag(tag: string): BG3Build[] {
  return COMMUNITY_BUILDS.filter(b => b.tags?.includes(tag));
}

export function getBuildsByDifficulty(difficulty: BG3Build['difficulty']): BG3Build[] {
  return COMMUNITY_BUILDS.filter(b => b.difficulty === difficulty);
}
`;

  await fs.writeFile(OUTPUT_PATH, output, 'utf8');
  console.log(`Wrote ${sortedBuilds.length} builds to ${OUTPUT_PATH}`);
};

await main();
