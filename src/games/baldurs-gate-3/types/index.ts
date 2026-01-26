// BG3 Core Types

export type ClassName = 
  | 'Barbarian'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Fighter'
  | 'Monk'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard';

export type SubclassName = string; // Dynamic based on class

export type RaceName =
  | 'Dragonborn'
  | 'Drow'
  | 'Dwarf'
  | 'Elf'
  | 'Githyanki'
  | 'Gnome'
  | 'Half-Elf'
  | 'Half-Orc'
  | 'Halfling'
  | 'Human'
  | 'Tiefling';

export type SubraceName = string; // Dynamic based on race

export type BackgroundName =
  | 'Acolyte'
  | 'Charlatan'
  | 'Criminal'
  | 'Entertainer'
  | 'Folk Hero'
  | 'Guild Artisan'
  | 'Haunted One'
  | 'Noble'
  | 'Outlander'
  | 'Sage'
  | 'Soldier'
  | 'Urchin';

export type AbilityScore = 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma';

export interface ClassInfo {
  name: ClassName;
  description: string;
  hitDie: number;
  primaryAbility: AbilityScore[];
  savingThrows: AbilityScore[];
  subclassLevel: number; // Level at which subclass is chosen
  subclasses: SubclassInfo[];
  spellcasting?: {
    ability: AbilityScore;
    type: 'full' | 'half' | 'third' | 'pact';
  };
  iconPath?: string;
}

export interface SubclassInfo {
  name: SubclassName;
  description: string;
  parentClass: ClassName;
  iconPath?: string;
}

export interface RaceInfo {
  name: RaceName;
  description: string;
  speed: number;
  subraces: SubraceInfo[];
  traits: string[];
  iconPath?: string;
}

export interface SubraceInfo {
  name: SubraceName;
  description: string;
  parentRace: RaceName;
  traits: string[];
  iconPath?: string;
}

export interface BackgroundInfo {
  name: BackgroundName;
  description: string;
  skillProficiencies: string[];
  iconPath?: string;
}

export interface FeatInfo {
  name: string;
  description: string;
  prerequisites?: string;
  iconPath?: string;
}

export interface SpellInfo {
  name: string;
  level: number; // 0 = cantrip
  school: 'Abjuration' | 'Conjuration' | 'Divination' | 'Enchantment' | 'Evocation' | 'Illusion' | 'Necromancy' | 'Transmutation';
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  classes: ClassName[];
  concentration?: boolean;
  ritual?: boolean;
  iconPath?: string;
}

// Build-related types
export interface ClassLevel {
  class: ClassName;
  subclass?: SubclassName;
  level: number;
}

export interface LevelProgression {
  characterLevel: number;
  classLevels: ClassLevel[];
  feat?: string;
  abilityScoreImprovement?: Partial<Record<AbilityScore, number>>;
  spellsLearned?: string[];
  notes?: string;
}

export type GearSlot = 
  | 'head'
  | 'cloak'
  | 'armour'
  | 'gloves'
  | 'boots'
  | 'amulet'
  | 'ring1'
  | 'ring2'
  | 'melee'
  | 'ranged'
  | 'handwear';

export interface GearRecommendation {
  slot: GearSlot;
  items: string[];
  notes?: string;
}

export interface GearInfo {
  name: string;
  type: 'weapon' | 'armour' | 'accessory' | 'clothing';
  slot: GearSlot;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary';
  effect: string;
  location?: string;
  act?: 1 | 2 | 3;
  wikiUrl?: string;
  iconPath?: string;
}

export interface BG3Build {
  id: string;
  name: string;
  description: string;
  author?: string;
  race: RaceName;
  subrace?: SubraceName;
  background: BackgroundName;
  abilityScores: Record<AbilityScore, number>;
  progression: LevelProgression[];
  gearRecommendations?: GearRecommendation[];
  tags?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Companion types
export type CompanionName = 
  | 'Shadowheart'
  | 'Astarion'
  | 'Gale'
  | 'Laezel'
  | 'Wyll'
  | 'Karlach'
  | 'Halsin'
  | 'Jaheira'
  | 'Minsc'
  | 'Minthara';

export interface CompanionInfo {
  name: CompanionName;
  fullName: string;
  defaultClass: ClassName;
  defaultSubclass?: SubclassName;
  race: RaceName;
  subrace?: SubraceName;
  background: BackgroundName;
  description: string;
  bio: string;
  quote: string;
  portraitUrl: string;
  recruitmentAct: 1 | 2 | 3;
  startingLevel: number;
  role: string;
  defaultAbilityScores: Record<AbilityScore, number>;
}
