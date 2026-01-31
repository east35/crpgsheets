/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * BG3 Keyword System
 * Simple unified lookup for tooltips
 */
import spellsData from '../spells.json';
import featsData from '../feats.json';
import actionsData from '../actions.json';
import conditionsData from '../conditions.json';
import featuresData from '../features.json';
import potionsData from '../potions.json';
import elixirsData from '../elixirs.json';
import grenadesData from '../grenades.json';
import arrowsData from '../arrows.json';
import permanentBonusesData from '../permanent_bonuses.json';
import { CLASSES } from '../classes/index';
import { RACES } from '../character/races';
import { BACKGROUNDS } from '../character/backgrounds';

export type KeywordCategory =
  | 'spell'
  | 'feat'
  | 'condition'
  | 'action'
  | 'feature'
  | 'class'
  | 'subclass'
  | 'race'
  | 'subrace'
  | 'background'
  | 'ability'
  | 'skill'
  | 'potion'
  | 'elixir'
  | 'grenade'
  | 'arrow'
  | 'bonus';

export interface KeywordInfo {
  name: string;
  category: KeywordCategory;
  description: string;
  wikiUrl: string;
  // Spell-specific
  level?: number;
  school?: string;
  schoolRank?: string;
  flavorText?: string;
  icon?: string;
  type?: string;
  damage?: string;
  range?: string;
  duration?: string;
  savingThrow?: string;
  cost?: string;
  concentration?: boolean;
  // Feat-specific
  benefits?: string[];
  notes?: string;
}

interface SpellData {
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

interface FeatData {
  name: string;
  description: string;
  benefits: string[];
  notes?: string;
}

function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function buildWikiUrl(name: string): string {
  return `https://bg3.wiki/wiki/${name.replace(/ /g, '_')}`;
}

// Build the keyword map at module load
const KEYWORDS = new Map<string, KeywordInfo>();
const ALL_NAMES: string[] = [];

const addKeyword = (info: KeywordInfo) => {
  KEYWORDS.set(normalizeKey(info.name), info);
  ALL_NAMES.push(info.name);
};

// Load spells
const spells = spellsData as Record<string, SpellData>;
for (const [key, spell] of Object.entries(spells)) {
  const info: KeywordInfo = {
    name: spell.name,
    category: 'spell',
    description: spell.description,
    wikiUrl: buildWikiUrl(spell.name),
    level: spell.level,
    school: spell.school,
    schoolRank: spell.schoolRank,
    flavorText: spell.flavorText,
    icon: spell.icon,
    type: spell.type,
    damage: spell.damage,
    range: spell.range,
    duration: spell.duration,
    savingThrow: spell.savingThrow,
    cost: spell.cost,
    concentration: spell.concentration,
  };
  KEYWORDS.set(key, info);
  ALL_NAMES.push(spell.name);
}

// Load feats
const feats = featsData as Record<string, FeatData>;
for (const [key, feat] of Object.entries(feats)) {
  const info: KeywordInfo = {
    name: feat.name,
    category: 'feat',
    description: feat.description,
    wikiUrl: buildWikiUrl(feat.name),
    benefits: feat.benefits,
    notes: feat.notes,
  };
  KEYWORDS.set(key, info);
  ALL_NAMES.push(feat.name);
}

// Load actions
for (const action of Object.values(actionsData as Record<string, any>)) {
  if (!action?.name) continue;
  const description = [action.desc1, action.desc2].filter(Boolean).join(' ');
  addKeyword({
    name: action.name,
    category: 'action',
    description: description || 'Action.',
    wikiUrl: buildWikiUrl(action.name),
    icon: action.image,
  });
}

// Load conditions
for (const condition of Object.values(conditionsData as Record<string, any>)) {
  if (!condition?.name || condition.ignore === 'TRUE') continue;
  addKeyword({
    name: condition.name,
    category: 'condition',
    description: condition.description || 'Condition.',
    wikiUrl: buildWikiUrl(condition.name),
    icon: condition.image,
  });
}

// Load features
for (const feature of Object.values(featuresData as Record<string, any>)) {
  if (!feature?.name || feature.ignore === 'TRUE') continue;
  const description = [feature.desc_1, feature.desc_2].filter(Boolean).join(' ');
  addKeyword({
    name: feature.name,
    category: 'feature',
    description: description || 'Feature.',
    wikiUrl: buildWikiUrl(feature.name),
    icon: feature.image,
  });
}

// Load potions
for (const potion of Object.values(potionsData as Record<string, any>)) {
  if (!potion?.name) continue;
  const details = [];
  if (potion.heal_amount) details.push(`Heals ${potion.heal_amount}.`);
  if (potion.conditions) details.push(`Applies: ${potion.conditions}.`);
  if (potion.duration) details.push(`Duration: ${potion.duration}.`);
  if (potion.crafting) details.push(`Crafting: ${potion.crafting}.`);
  addKeyword({
    name: potion.name,
    category: 'potion',
    description: details.join(' ') || 'Potion.',
    wikiUrl: buildWikiUrl(potion.name),
    icon: potion.image,
  });
}

// Load elixirs
for (const elixir of Object.values(elixirsData as Record<string, any>)) {
  if (!elixir?.name) continue;
  const details = [];
  if (elixir.conditions) details.push(`Effect: ${elixir.conditions}.`);
  if (elixir.ingredient) details.push(`Ingredient: ${elixir.ingredient}.`);
  addKeyword({
    name: elixir.name,
    category: 'elixir',
    description: details.join(' ') || 'Elixir.',
    wikiUrl: buildWikiUrl(elixir.name),
    icon: elixir.image,
  });
}

// Load grenades
for (const grenade of Object.values(grenadesData as Record<string, any>)) {
  if (!grenade?.name) continue;
  const details = [];
  if (grenade.description) details.push(grenade.description);
  if (grenade.dmg1 && grenade.dmg1_type) details.push(`Damage: ${grenade.dmg1} ${grenade.dmg1_type}.`);
  if (grenade.area) details.push(`Area: ${grenade.area}.`);
  if (grenade.conditions) details.push(`Applies: ${grenade.conditions}.`);
  addKeyword({
    name: grenade.name,
    category: 'grenade',
    description: details.join(' ') || 'Throwable.',
    wikiUrl: buildWikiUrl(grenade.name),
    icon: grenade.image,
  });
}

// Load arrows
for (const arrow of Object.values(arrowsData as Record<string, any>)) {
  if (!arrow?.name) continue;
  const details = [];
  if (arrow.dmg1 && arrow.dmg1_type) details.push(`Damage: ${arrow.dmg1} ${arrow.dmg1_type}.`);
  if (arrow.dmg2 && arrow.dmg2_type) details.push(`Bonus: ${arrow.dmg2} ${arrow.dmg2_type}.`);
  if (arrow.area) details.push(`Area: ${arrow.area}.`);
  if (arrow.dmgx2_creature_type) details.push(`Extra damage vs ${arrow.dmgx2_creature_type}.`);
  addKeyword({
    name: arrow.name,
    category: 'arrow',
    description: details.join(' ') || 'Arrow.',
    wikiUrl: buildWikiUrl(arrow.name),
    icon: arrow.image,
  });
}

// Load permanent bonuses
for (const bonus of Object.values(permanentBonusesData as Record<string, any>)) {
  if (!bonus?.name) continue;
  addKeyword({
    name: bonus.name,
    category: 'bonus',
    description: bonus.description || 'Permanent bonus.',
    wikiUrl: buildWikiUrl(bonus.name),
  });
}

// Classes and subclasses
for (const classInfo of Object.values(CLASSES)) {
  addKeyword({
    name: classInfo.name,
    category: 'class',
    description: classInfo.description,
    wikiUrl: buildWikiUrl(classInfo.name),
  });
  for (const subclass of classInfo.subclasses) {
    addKeyword({
      name: subclass.name,
      category: 'subclass',
      description: subclass.description,
      wikiUrl: buildWikiUrl(subclass.name),
    });
  }
}

// Races and subraces
for (const raceInfo of Object.values(RACES)) {
  addKeyword({
    name: raceInfo.name,
    category: 'race',
    description: raceInfo.description,
    wikiUrl: buildWikiUrl(raceInfo.name),
  });
  for (const subrace of raceInfo.subraces) {
    addKeyword({
      name: subrace.name,
      category: 'subrace',
      description: subrace.description,
      wikiUrl: buildWikiUrl(subrace.name),
    });
  }
}

// Backgrounds
for (const background of Object.values(BACKGROUNDS)) {
  addKeyword({
    name: background.name,
    category: 'background',
    description: background.description,
    wikiUrl: buildWikiUrl(background.name),
  });
}

// Ability scores
['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].forEach((ability) => {
  addKeyword({
    name: ability,
    category: 'ability',
    description: `${ability} ability score.`,
    wikiUrl: buildWikiUrl(ability),
  });
});

// Skills
[
  'Athletics',
  'Acrobatics',
  'Sleight of Hand',
  'Stealth',
  'Arcana',
  'History',
  'Investigation',
  'Nature',
  'Religion',
  'Animal Handling',
  'Insight',
  'Medicine',
  'Perception',
  'Survival',
  'Deception',
  'Intimidation',
  'Performance',
  'Persuasion',
].forEach((skill) => {
  addKeyword({
    name: skill,
    category: 'skill',
    description: `${skill} skill check.`,
    wikiUrl: buildWikiUrl(skill),
  });
});

// Sort names by length (longest first) for matching
ALL_NAMES.sort((a, b) => b.length - a.length);

// Exports
export function findKeyword(name: string): KeywordInfo | undefined {
  return KEYWORDS.get(normalizeKey(name));
}

export const ALL_KEYWORD_NAMES = ALL_NAMES;

export function getKeywordsByCategory(category: KeywordCategory): KeywordInfo[] {
  return Array.from(KEYWORDS.values()).filter(k => k.category === category);
}
