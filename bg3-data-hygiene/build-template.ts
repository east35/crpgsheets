/**
 * BG3 Build Parser Template
 *
 * This file provides templates and utilities for converting scraped build data
 * from various sources (eip.gg, fextralife, etc.) into our BG3Build format.
 *
 * Source: https://eip.gg/bg3/builds/
 */

import type { BG3Build, LevelProgression, GearRecommendation, ClassName, RaceName, BackgroundName, AbilityScore } from '../src/games/baldurs-gate-3/types';

// ============================================================================
// BUILD TEMPLATE - Copy and fill this out for each new build
// ============================================================================

export const BUILD_TEMPLATE: BG3Build = {
  // Unique identifier - use kebab-case, include source prefix for non-community builds
  id: 'eip-build-name',

  // Display name as shown on source site
  name: 'Build Name',

  // Short description (1-2 sentences)
  description: 'Brief description of the build playstyle and strengths.',

  // Attribution
  author: 'eip.gg',
  sourceUrl: 'https://eip.gg/bg3/builds/build-name/',
  sourceLabel: 'EIP.GG',

  // Character creation choices
  race: 'Human' as RaceName,
  subrace: undefined, // e.g., 'High Half-Elf', 'Wood Elf', 'Zariel Tiefling'
  background: 'Soldier' as BackgroundName,

  // Starting ability scores (must total 27 points using point buy, or use standard array)
  abilityScores: {
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  },

  // Level 1-12 progression
  progression: [
    {
      characterLevel: 1,
      classLevels: [{ class: 'Fighter' as ClassName, level: 1 }],
      notes: 'Starting class and initial choices.'
    },
    {
      characterLevel: 2,
      classLevels: [{ class: 'Fighter' as ClassName, level: 2 }],
      notes: 'Level 2 features.'
    },
    {
      characterLevel: 3,
      classLevels: [{ class: 'Fighter' as ClassName, level: 3, subclass: 'Battle Master' }],
      notes: 'Subclass selection.'
    },
    {
      characterLevel: 4,
      classLevels: [{ class: 'Fighter' as ClassName, level: 4 }],
      feat: 'Great Weapon Master', // Or 'Ability Improvement'
      abilityScoreImprovement: undefined, // Or { Strength: 2 } for ASI
      notes: 'Feat/ASI choice.'
    },
    // ... continue for levels 5-12
  ],

  // Gear recommendations by slot
  gearRecommendations: [
    { slot: 'head', items: ['Best Item', 'Good Alternative', 'Budget Option'] },
    { slot: 'cloak', items: ['Cloak of Displacement'] },
    { slot: 'armour', items: ['Helldusk Armour'] },
    { slot: 'gloves', items: ['Helldusk Gloves'] },
    { slot: 'boots', items: ['Helldusk Boots'] },
    { slot: 'amulet', items: ['Amulet of Greater Health'] },
    { slot: 'ring1', items: ["Killer's Sweetheart"] },
    { slot: 'ring2', items: ['Ring of Protection'] },
    { slot: 'melee', items: ['Balduran\'s Giantslayer'] },
    // Or for ranged builds:
    // { slot: 'ranged', items: ['Gontr Mael'] },
  ],

  // Tags for filtering
  tags: ['Companion', 'Shadowheart', 'Melee', 'Tank', 'Beginner Friendly'],

  // Difficulty rating
  difficulty: 'Beginner', // 'Beginner' | 'Intermediate' | 'Advanced'
};

// ============================================================================
// VALID VALUES REFERENCE
// ============================================================================

export const VALID_CLASSES: ClassName[] = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
  'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

export const VALID_RACES: RaceName[] = [
  'Dragonborn', 'Drow', 'Dwarf', 'Elf', 'Githyanki', 'Gnome',
  'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Tiefling'
];

export const VALID_BACKGROUNDS: BackgroundName[] = [
  'Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero',
  'Guild Artisan', 'Haunted One', 'Noble', 'Outlander', 'Sage', 'Soldier', 'Urchin'
];

export const COMMON_SUBCLASSES: Record<ClassName, string[]> = {
  Barbarian: ['Berserker', 'Wildheart', 'Wild Magic'],
  Bard: ['College of Lore', 'College of Valour', 'College of Swords'],
  Cleric: ['Life Domain', 'Light Domain', 'Trickery Domain', 'Knowledge Domain', 'Nature Domain', 'Tempest Domain', 'War Domain'],
  Druid: ['Circle of the Land', 'Circle of the Moon', 'Circle of the Spores'],
  Fighter: ['Battle Master', 'Champion', 'Eldritch Knight'],
  Monk: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements'],
  Paladin: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oathbreaker'],
  Ranger: ['Hunter', 'Beast Master', 'Gloom Stalker'],
  Rogue: ['Thief', 'Arcane Trickster', 'Assassin'],
  Sorcerer: ['Draconic Bloodline', 'Wild Magic', 'Storm Sorcery'],
  Warlock: ['The Fiend', 'The Great Old One', 'The Archfey'],
  Wizard: ['Evocation School', 'Abjuration School', 'Conjuration School', 'Divination School', 'Enchantment School', 'Illusion School', 'Necromancy School', 'Transmutation School']
};

export const COMMON_FEATS = [
  'Ability Improvement', // +2 to one ability or +1 to two abilities
  'Alert',
  'Athlete',
  'Charger',
  'Crossbow Expert',
  'Defensive Duelist',
  'Dual Wielder',
  'Dungeon Delver',
  'Durable',
  'Elemental Adept',
  'Great Weapon Master',
  'Heavily Armored',
  'Heavy Armor Master',
  'Lightly Armored',
  'Lucky',
  'Mage Slayer',
  'Magic Initiate',
  'Martial Adept',
  'Medium Armor Master',
  'Mobile',
  'Moderately Armored',
  'Polearm Master',
  'Resilient',
  'Ritual Caster',
  'Savage Attacker',
  'Sentinel',
  'Sharpshooter',
  'Shield Master',
  'Skilled',
  'Spell Sniper',
  'Tavern Brawler',
  'Tough',
  'War Caster',
  'Weapon Master'
];

export const COMPANION_NAMES = [
  'Shadowheart', 'Astarion', 'Gale', 'Laezel', 'Wyll',
  'Karlach', 'Halsin', 'Jaheira', 'Minsc', 'Minthara'
];

export const EIP_TAG_MAPPING: Record<string, string[]> = {
  'Beginner': ['Beginner Friendly'],
  'Caster': ['Spellcaster'],
  'Healing': ['Healer', 'Support'],
  'Melee': ['Melee'],
  'Ranged': ['Ranged'],
  'Control': ['Crowd Control'],
  'Strong': ['Damage'],
  'Stealth/Sneak Attack': ['Stealth', 'Burst Damage'],
  'Face of Party': ['Face', 'Charisma'],
  'Battlemage/Gish': ['Battlemage', 'Versatile'],
  'Actions/Bonus Actions': ['Action Economy'],
  'Act 1': [],
  'Act 2': [],
  'Act 3': [],
  'Multiclass': ['Multiclass'],
  'Roleplay': ['Roleplay'],
  'Meme': ['Meme'],
  'Funny': ['Meme'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates a standard progression array for a single-class build
 */
export function createSingleClassProgression(
  className: ClassName,
  subclass: string,
  subclassLevel: number,
  feats: { level: number; feat: string; asi?: Partial<Record<AbilityScore, number>> }[],
  notes: Record<number, string> = {}
): LevelProgression[] {
  const progression: LevelProgression[] = [];

  for (let level = 1; level <= 12; level++) {
    const entry: LevelProgression = {
      characterLevel: level,
      classLevels: [{
        class: className,
        level,
        ...(level >= subclassLevel ? { subclass } : {})
      }],
      notes: notes[level] || ''
    };

    const featEntry = feats.find(f => f.level === level);
    if (featEntry) {
      entry.feat = featEntry.feat;
      if (featEntry.asi) {
        entry.abilityScoreImprovement = featEntry.asi;
      }
    }

    progression.push(entry);
  }

  return progression;
}

/**
 * Validates a build object against the schema
 */
export function validateBuild(build: BG3Build): string[] {
  const errors: string[] = [];

  if (!build.id || !/^[a-z0-9-]+$/.test(build.id)) {
    errors.push('ID must be kebab-case');
  }

  if (!build.name) {
    errors.push('Name is required');
  }

  if (!VALID_RACES.includes(build.race)) {
    errors.push(`Invalid race: ${build.race}`);
  }

  if (!VALID_BACKGROUNDS.includes(build.background)) {
    errors.push(`Invalid background: ${build.background}`);
  }

  const totalPoints = Object.values(build.abilityScores).reduce((sum, val) => sum + val, 0);
  if (totalPoints < 60 || totalPoints > 80) {
    errors.push(`Ability scores total ${totalPoints} - seems unusual`);
  }

  if (build.progression.length !== 12) {
    errors.push(`Progression has ${build.progression.length} levels, expected 12`);
  }

  for (const level of build.progression) {
    for (const cl of level.classLevels) {
      if (!VALID_CLASSES.includes(cl.class)) {
        errors.push(`Invalid class at level ${level.characterLevel}: ${cl.class}`);
      }
    }
  }

  return errors;
}

/**
 * Generate a build ID from a name
 */
export function generateBuildId(name: string, source: string = ''): string {
  const prefix = source ? `${source}-` : '';
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `${prefix}${slug}`;
}

// ============================================================================
// EXAMPLE: Converting an EIP.GG build candidate to full build
// ============================================================================

/*
Example workflow:

1. Scrape build list from https://eip.gg/bg3/builds/
2. For each build, fetch the detail page
3. Extract:
   - Race/subrace recommendations
   - Background
   - Ability score distribution
   - Level-by-level class/subclass choices
   - Feat selections at levels 4, 8, 12
   - Gear recommendations
4. Convert to BG3Build format using this template
5. Validate with validateBuild()
6. Add to src/games/baldurs-gate-3/data/builds/index.ts

The EIP.GG pages are structured with:
- "Character Creation" section with race/background/abilities
- "Leveling" section with per-level breakdown
- "Equipment" section with gear by slot
*/
