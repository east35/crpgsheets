// Rogue Trader specific types

// === Core Game Types ===

export type Characteristic =
  | 'weaponSkill'
  | 'ballisticSkill'
  | 'strength'
  | 'toughness'
  | 'agility'
  | 'intelligence'
  | 'perception'
  | 'willpower'
  | 'fellowship';

// Base archetypes (levels 1-15)
export type BaseArchetype =
  | 'warrior'
  | 'operative'
  | 'soldier'
  | 'officer'
  | 'bladeDancer';

// Advanced archetypes (levels 16-35)
export type AdvancedArchetype =
  | 'assassin'
  | 'vanguard'
  | 'bountyHunter'
  | 'masterTactician'
  | 'archMilitant'
  | 'executioner'
  | 'grandStrategist'
  | 'overseer';

// Exemplar archetypes (levels 36-55)
export type ExemplarArchetype = 'exemplar';

export type Archetype = BaseArchetype | AdvancedArchetype | ExemplarArchetype;

export type Origin =
  | 'crimeWorld'
  | 'deathWorld'
  | 'forgeWorld'
  | 'imperialWorld'
  | 'voidBorn'
  | 'fortress'
  | 'agriWorld'
  | 'schola';

// === Build Guide Types (from spreadsheet) ===

export type GearSlot =
  | 'helm'
  | 'armour'
  | 'cloak'
  | 'neck'
  | 'accessory1'
  | 'accessory2'
  | 'gloves'
  | 'boots'
  | 'weaponSet1'
  | 'weaponSet2';

export interface GearRecommendation {
  slot: GearSlot;
  items: string[]; // Multiple options, first is usually best
}

export interface LevelChoice {
  level: number;
  talents: string[]; // Talent names, can have multiple picks per level
  statIncrease?: string; // e.g., "Weapon Skill", "Toughness", "Athletics"
  notes?: string;
}

export interface ArchetypeTier {
  archetype: Archetype;
  startLevel: number;
  endLevel: number;
  levels: LevelChoice[];
}

export interface BuildGuide {
  id: string;
  companion: CompanionName;
  buildName: string; // e.g., "Navy Breacher", "Defender", "Assassin"
  description?: string;
  videoUrl?: string;
  sourceUrl?: string;
  sourceLabel?: string;

  // Recommended skills to pick
  skillOptions: string[];

  // Archetype progression path
  archetypePath: {
    base: BaseArchetype;
    advanced: AdvancedArchetype;
    exemplar: ExemplarArchetype;
  };

  // Level-by-level progression (1-55)
  progression: LevelChoice[];

  // Recommended gear
  gearRecommendations: GearRecommendation[];
}

// === Character Tracking Types ===

export interface CharacterProgress {
  buildGuideId: string; // Reference to the guide being followed
  currentLevel: number;

  // Track what's been done vs planned
  completedLevels: number[]; // Levels where choices have been made

  // Any deviations from the guide
  deviations: {
    level: number;
    planned: string[];
    actual: string[];
    reason?: string;
  }[];

  // Current gear equipped
  currentGear: Partial<Record<GearSlot, string>>;

  notes?: string;
}

export interface RogueTraderCharacter {
  id: string;
  companion: CompanionName;
  buildName: string;

  // If following a guide
  guideId?: string;
  progress?: CharacterProgress;

  // Or custom build tracking
  customProgression?: LevelChoice[];

  createdAt: string;
  updatedAt: string;
}

// === Companion Types ===

export type CompanionName =
  | 'Abelard'
  | 'Argenta'
  | 'Idira'
  | 'Pasqal'
  | 'Cassia'
  | 'Heinrix'
  | 'Jae'
  | 'Yrliet'
  | 'Marazhai'
  | 'Ulfar'
  | 'Kibellah'
  | 'Solomorne'
  | 'Winterscale'
  | 'Uralon'
  | 'Incendia'
  | 'RogueTrader';

export interface CompanionInfo {
  name: CompanionName;
  fullName: string;
  defaultArchetype: BaseArchetype;
  origin: Origin;
  description: string;
  bio: string;
  quote: string;
  portraitUrl?: string;
  recruitmentAct: number;
  startingLevel: number;
  role: string; // e.g., "Frontline Damage / Tank"
  availability?: 'dlc' | 'secret';
}

// === Display Helpers ===

export const GEAR_SLOT_LABELS: Record<GearSlot, string> = {
  helm: 'Helm',
  armour: 'Armour',
  cloak: 'Cloak',
  neck: 'Neck',
  accessory1: 'Accessory 1',
  accessory2: 'Accessory 2',
  gloves: 'Gloves',
  boots: 'Boots',
  weaponSet1: 'Weapon Set 1',
  weaponSet2: 'Weapon Set 2',
};

export const ARCHETYPE_DISPLAY_NAMES: Record<Archetype, string> = {
  warrior: 'Warrior',
  operative: 'Operative',
  soldier: 'Soldier',
  officer: 'Officer',
  bladeDancer: 'Blade Dancer',
  assassin: 'Assassin',
  vanguard: 'Vanguard',
  bountyHunter: 'Bounty Hunter',
  masterTactician: 'Master Tactician',
  archMilitant: 'Arch-Militant',
  executioner: 'Executioner',
  grandStrategist: 'Grand Strategist',
  overseer: 'Overseer',
  exemplar: 'Exemplar',
};

export const ORIGIN_DISPLAY_NAMES: Record<Origin, string> = {
  crimeWorld: 'Crime World',
  deathWorld: 'Death World',
  forgeWorld: 'Forge World',
  imperialWorld: 'Imperial World',
  voidBorn: 'Void Born',
  fortress: 'Fortress World',
  agriWorld: 'Agri-World',
  schola: 'Schola Progenium',
};
