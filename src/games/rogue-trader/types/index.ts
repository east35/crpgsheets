// Rogue Trader specific types

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

export type Archetype =
  | 'warrior'
  | 'operative'
  | 'soldier'
  | 'officer'
  | 'assassin'
  | 'vanguard'
  | 'bountyHunter'
  | 'masterTactician'
  | 'archMilitant'
  | 'exemplar'
  | 'bladeDancer'
  | 'grandStrategist';

export type Origin =
  | 'crimeWorld'
  | 'deathWorld'
  | 'forgeWorld'
  | 'imperialWorld'
  | 'voidBorn'
  | 'fortress'
  | 'agriWorld'
  | 'schola';

export interface CharacteristicValues {
  weaponSkill: number;
  ballisticSkill: number;
  strength: number;
  toughness: number;
  agility: number;
  intelligence: number;
  perception: number;
  willpower: number;
  fellowship: number;
}

export interface Skill {
  id: string;
  name: string;
  characteristic: Characteristic;
  acquired: boolean;
  level: number; // 0-4 typically
}

export interface Talent {
  id: string;
  name: string;
  description?: string;
  tier: number;
  prerequisites?: string[];
  acquired: boolean;
  levelAcquired?: number;
}

export interface LevelProgression {
  level: number;
  archetype: Archetype;
  talentsChosen: string[]; // talent IDs
  characteristicIncreases: Partial<CharacteristicValues>;
  skillsAcquired: string[]; // skill IDs
  notes?: string;
}

export interface RogueTraderCharacter {
  // Basic info
  name: string;
  origin: Origin;
  startingArchetype: Archetype;
  currentLevel: number;

  // Base characteristics (before any progression)
  baseCharacteristics: CharacteristicValues;

  // Calculated/current characteristics
  currentCharacteristics: CharacteristicValues;

  // Progression tracking
  levelProgression: LevelProgression[];

  // Current state
  talents: Talent[];
  skills: Skill[];

  // Build planning
  plannedLevels?: LevelProgression[];

  // Meta
  notes?: string;
  guideReference?: string;
}

export interface RogueTraderBuildGuide {
  characterName: string; // e.g., "Argenta", "Cassia", "Abelard"
  recommendedOrigin?: Origin;
  archetypePath: Archetype[];
  priorityCharacteristics: Characteristic[];
  keyTalents: string[];
  playstyleNotes: string;
  levelByLevelGuide: {
    level: number;
    recommendations: string;
    talents: string[];
    characteristics?: Characteristic[];
  }[];
}

// Companion characters in Rogue Trader
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
  | 'Custom';
