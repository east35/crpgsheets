// Archetype data and talent mappings for custom build creation
import type { BaseArchetype, AdvancedArchetype, CompanionName } from '../../types';

// Map wiki source names to our archetype types
export const SOURCE_TO_ARCHETYPE: Record<string, string> = {
  'Warrior': 'warrior',
  'Operative': 'operative',
  'Soldier': 'soldier',
  'Officer': 'officer',
  'Bladedancer': 'bladeDancer',
  'Assassin': 'assassin',
  'Vanguard': 'vanguard',
  'Bounty Hunter': 'bountyHunter',
  'Master Tactician': 'masterTactician',
  'Arch-Militant': 'archMilitant',
  'Executioner': 'executioner',
  'Grand Strategist': 'grandStrategist',
  'Overseer': 'overseer',
  'Exemplar': 'exemplar',
  'All Archetypes': 'all',
};

// Which advanced archetypes can follow from which base archetypes
export const ARCHETYPE_PROGRESSION: Record<BaseArchetype, AdvancedArchetype[]> = {
  warrior: ['assassin', 'vanguard', 'archMilitant'],
  operative: ['assassin', 'bountyHunter', 'executioner'],
  soldier: ['vanguard', 'archMilitant', 'masterTactician'],
  officer: ['masterTactician', 'grandStrategist', 'overseer'],
  bladeDancer: ['assassin', 'executioner', 'vanguard'],
};

// Companion starting archetypes
export const COMPANION_DEFAULT_ARCHETYPES: Record<CompanionName, BaseArchetype> = {
  Abelard: 'warrior',
  Argenta: 'soldier',
  Idira: 'operative',
  Pasqal: 'operative',
  Cassia: 'officer',
  Heinrix: 'soldier',
  Jae: 'operative',
  Yrliet: 'soldier',
  Marazhai: 'warrior',
  Ulfar: 'warrior',
  Kibellah: 'bladeDancer',
  Solomorne: 'soldier',
  Incendia: 'soldier',
  Winterscale: 'warrior',
  Uralon: 'officer',
  RogueTrader: 'officer', // Default, player can choose
};

// Starting levels for companions
export const COMPANION_START_LEVELS: Record<CompanionName, number> = {
  Abelard: 1,
  Argenta: 1,
  Idira: 1,
  Pasqal: 1,
  Cassia: 1,
  Heinrix: 1,
  Jae: 12,
  Yrliet: 16,
  Marazhai: 26,
  Ulfar: 26,
  Kibellah: 16,
  Solomorne: 19,
  Incendia: 16,
  Winterscale: 26,
  Uralon: 36,
  RogueTrader: 1,
};

// Get archetype tier for a level
export function getArchetypeTier(level: number): 'base' | 'advanced' | 'exemplar' {
  if (level <= 15) return 'base';
  if (level <= 35) return 'advanced';
  return 'exemplar';
}

// Get valid sources for talent filtering based on archetype path
export function getValidSourcesForLevel(
  level: number,
  baseArchetype: BaseArchetype,
  advancedArchetype: AdvancedArchetype
): string[] {
  const tier = getArchetypeTier(level);
  const sources: string[] = ['All Archetypes'];
  
  if (tier === 'base') {
    // Base archetype talents
    const baseSourceName = Object.entries(SOURCE_TO_ARCHETYPE)
      .find(([, v]) => v === baseArchetype)?.[0];
    if (baseSourceName) sources.push(baseSourceName);
  } else if (tier === 'advanced') {
    // Advanced archetype talents
    const advSourceName = Object.entries(SOURCE_TO_ARCHETYPE)
      .find(([, v]) => v === advancedArchetype)?.[0];
    if (advSourceName) sources.push(advSourceName);
  } else {
    // Exemplar talents
    sources.push('Exemplar');
  }
  
  return sources;
}
