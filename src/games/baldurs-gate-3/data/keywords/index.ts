/**
 * BG3 Keyword System
 * Simple unified lookup for tooltips
 */
import spellsData from '../spells.json';
import featsData from '../feats.json';

export type KeywordCategory = 'spell' | 'feat' | 'condition' | 'class' | 'race' | 'background' | 'ability' | 'skill';

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

// Build the keyword map at module load
const KEYWORDS = new Map<string, KeywordInfo>();
const ALL_NAMES: string[] = [];

// Load spells
const spells = spellsData as Record<string, SpellData>;
for (const [key, spell] of Object.entries(spells)) {
  const info: KeywordInfo = {
    name: spell.name,
    category: 'spell',
    description: spell.description,
    wikiUrl: `https://bg3.wiki/wiki/${spell.name.replace(/ /g, '_')}`,
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
    wikiUrl: `https://bg3.wiki/wiki/${feat.name.replace(/ /g, '_')}`,
    benefits: feat.benefits,
    notes: feat.notes,
  };
  KEYWORDS.set(key, info);
  ALL_NAMES.push(feat.name);
}

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
