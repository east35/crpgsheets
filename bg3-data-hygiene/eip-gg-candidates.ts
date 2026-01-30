/**
 * BG3 Build Candidates from EIP.GG
 *
 * These are builds that have been identified from https://eip.gg/bg3/builds/
 * but need to be fully parsed and converted to BG3Build format.
 *
 * Workflow:
 * 1. Fetch each build's detail page
 * 2. Extract race, background, ability scores, progression, and gear
 * 3. Convert to BG3Build format
 * 4. Move to src/games/baldurs-gate-3/data/builds/index.ts
 */

import type { BG3BuildCandidate } from '../src/games/baldurs-gate-3/types';

export const EIP_GG_CANDIDATES: BG3BuildCandidate[] = [
  // ============================================================================
  // COMPANION BUILDS - High Priority
  // ============================================================================
  {
    id: 'eip-companion-shadowheart',
    name: 'Companion Shadowheart',
    sourceId: 'companion-shadowheart',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-shadowheart/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Cleric'],
    tags: ['Companion', 'Shadowheart', 'Beginner', 'Caster', 'Healing'],
    gearHints: [],
    notes: 'Trickery Domain single class. Site suggests respec to Light Domain.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-astarion',
    name: 'Companion Astarion',
    sourceId: 'companion-astarion',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-astarion/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Fighter', 'Rogue'],
    tags: ['Companion', 'Astarion', 'Beginner', 'Melee', 'Stealth'],
    gearHints: [],
    notes: 'Fighter/Thief multiclass utility build.',
    status: 'candidate'
  },
  {
    id: 'eip-drama-queen-astarion',
    name: 'Drama Queen Astarion',
    sourceId: 'drama-queen-astarion',
    sourceUrl: 'https://eip.gg/bg3/builds/drama-queen-astarion/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Bard', 'Rogue'],
    tags: ['Companion', 'Astarion', 'Face', 'Melee', 'Stealth'],
    gearHints: [],
    notes: 'College of Swords / Swashbuckler multiclass for charismatic rogue.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-laezel',
    name: "Companion Lae'zel",
    sourceId: 'companion-laezel',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-laezel/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Fighter'],
    tags: ['Companion', "Lae'zel", 'Beginner', 'Melee'],
    gearHints: [],
    notes: 'Battle Master single class.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-karlach',
    name: 'Companion Karlach',
    sourceId: 'companion-karlach',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-karlach/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Barbarian'],
    tags: ['Companion', 'Karlach', 'Beginner', 'Melee'],
    gearHints: [],
    notes: 'Berserker single class.',
    status: 'candidate'
  },
  {
    id: 'eip-giant-karlach',
    name: 'Giant Karlach',
    sourceId: 'giant-karlach',
    sourceUrl: 'https://eip.gg/bg3/builds/giant-karlach/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Barbarian'],
    tags: ['Companion', 'Karlach', 'Control', 'Melee', 'Strong'],
    gearHints: [],
    notes: 'Giant subclass for throwing builds. DLC content.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-wyll',
    name: 'Companion Pact of the Blade Wyll',
    sourceId: 'companion-pact-of-the-blade-wyll',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-pact-of-the-blade-wyll/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Warlock', 'Paladin'],
    tags: ['Companion', 'Wyll', 'Beginner', 'Melee', 'Strong'],
    gearHints: [],
    notes: 'Fiend Warlock / Vengeance Paladin multiclass.',
    status: 'candidate'
  },
  {
    id: 'eip-hexblade-wyll',
    name: 'Hexblade Warrior Wyll',
    sourceId: 'hexblade-warrior-wyll',
    sourceUrl: 'https://eip.gg/bg3/builds/hexblade-warrior-wyll/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Warlock'],
    tags: ['Companion', 'Wyll', 'Battlemage', 'Caster', 'Face'],
    gearHints: [],
    notes: 'Hexblade single class. Uses mod content or respec.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-halsin',
    name: 'Companion Halsin',
    sourceId: 'companion-halsin',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-halsin/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Druid'],
    tags: ['Companion', 'Halsin', 'Beginner', 'Control', 'Tank'],
    gearHints: [],
    notes: 'Circle of the Moon single class. Recruited in Act 2.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-jaheira',
    name: 'Companion Jaheira',
    sourceId: 'companion-jaheira',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-jaheira/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Druid', 'Fighter'],
    tags: ['Companion', 'Jaheira', 'Battlemage', 'Ranged'],
    gearHints: [],
    notes: 'Circle of the Land / Fighter multiclass. Recruited in Act 2.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-minsc',
    name: 'Companion Minsc',
    sourceId: 'companion-minsc',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-minsc/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Ranger', 'Rogue'],
    tags: ['Companion', 'Minsc', 'Beginner', 'Melee'],
    gearHints: [],
    notes: 'Hunter / Thief multiclass. Recruited in Act 3.',
    status: 'candidate'
  },
  {
    id: 'eip-companion-minthara',
    name: 'Companion Minthara',
    sourceId: 'companion-minthara',
    sourceUrl: 'https://eip.gg/bg3/builds/companion-minthara/',
    author: 'eip.gg',
    type: 'companion',
    classTags: ['Paladin'],
    tags: ['Companion', 'Minthara', 'Beginner', 'Strong', 'Tank'],
    gearHints: [],
    notes: 'Oath of Vengeance single class. Evil route companion.',
    status: 'candidate'
  },

  // ============================================================================
  // TAV / CUSTOM CHARACTER BUILDS
  // ============================================================================
  {
    id: 'eip-battle-master-fighter',
    name: 'Battle Master Fighter',
    sourceId: 'battle-master-fighter',
    sourceUrl: 'https://eip.gg/bg3/builds/battle-master-fighter/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Fighter'],
    tags: ['Melee', 'Strong', 'Action Economy'],
    gearHints: [],
    notes: 'Pure Battle Master. Great Weapon Master focused.',
    status: 'candidate'
  },
  {
    id: 'eip-control-sorcerer',
    name: 'Control Sorcerer',
    sourceId: 'control-sorcerer',
    sourceUrl: 'https://eip.gg/bg3/builds/control-sorcerer/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Sorcerer', 'Warlock'],
    tags: ['Caster', 'Control', 'Strong', 'Multiclass'],
    gearHints: [],
    notes: 'Draconic Sorcerer / Great Old One Warlock for control spells.',
    status: 'candidate'
  },
  {
    id: 'eip-drow-infiltrator',
    name: 'Drow Infiltrator Rogue / Ranger',
    sourceId: 'drow-infiltrator-rogue-ranger',
    sourceUrl: 'https://eip.gg/bg3/builds/drow-infiltrator-rogue-ranger/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Rogue', 'Ranger'],
    tags: ['Stealth', 'Roleplay', 'Multiclass'],
    gearHints: [],
    notes: 'Assassin / Gloom Stalker. Drow race for roleplay.',
    status: 'candidate'
  },
  {
    id: 'eip-thief-bard',
    name: 'Thief Bard',
    sourceId: 'thief-bard',
    sourceUrl: 'https://eip.gg/bg3/builds/thief-bard/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Bard'],
    tags: ['Caster', 'Face'],
    gearHints: [],
    notes: 'College of Lore single class.',
    status: 'candidate'
  },
  {
    id: 'eip-healer-bard',
    name: 'Healer Bard',
    sourceId: 'healer-bard',
    sourceUrl: 'https://eip.gg/bg3/builds/healer-bard/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Bard'],
    tags: ['Caster', 'Face', 'Healer'],
    gearHints: [],
    notes: 'College of Lore with healing focus.',
    status: 'candidate'
  },
  {
    id: 'eip-feared-warlock-ambusher',
    name: 'Feared Warlock Ambusher',
    sourceId: 'feared-warlock-ambusher-rogue-warlock',
    sourceUrl: 'https://eip.gg/bg3/builds/feared-warlock-ambusher-rogue-warlock/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Rogue', 'Warlock'],
    tags: ['Battlemage', 'Stealth', 'Multiclass'],
    gearHints: [],
    notes: 'Assassin / Great Old One for fear-based ambush.',
    status: 'candidate'
  },
  {
    id: 'eip-berserker-thief',
    name: 'Berserker/Thief Barbarian',
    sourceId: 'berserker-thief-barbarian',
    sourceUrl: 'https://eip.gg/bg3/builds/berserker-thief-barbarian/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Barbarian', 'Rogue'],
    tags: ['Melee', 'Strong', 'Multiclass'],
    gearHints: [],
    notes: 'Berserker / Thief for extra bonus actions.',
    status: 'candidate'
  },
  {
    id: 'eip-holy-salami-paladin',
    name: 'Holy Salami Warrior Paladin',
    sourceId: 'holy-salami-warrior-paladin',
    sourceUrl: 'https://eip.gg/bg3/builds/holy-salami-warrior-paladin/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Paladin'],
    tags: ['Face', 'Meme', 'Strong'],
    gearHints: [],
    notes: 'Oath of the Ancients. Meme/roleplay build.',
    status: 'candidate'
  },
  {
    id: 'eip-oopsy-daisy-thief',
    name: 'Oopsy Daisy, the Clumsy Thief',
    sourceId: 'oopsy-daisy-the-clumsy-thief',
    sourceUrl: 'https://eip.gg/bg3/builds/oopsy-daisy-the-clumsy-thief/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Rogue'],
    tags: ['Meme', 'Roleplay'],
    gearHints: [],
    notes: 'Thief subclass. Meme/roleplay build.',
    status: 'candidate'
  },
  {
    id: 'eip-pondering-orb',
    name: 'Pondering the Orb Jack of All Trades',
    sourceId: 'pondering-the-orb-jack-of-all-trades',
    sourceUrl: 'https://eip.gg/bg3/builds/pondering-the-orb-jack-of-all-trades/',
    author: 'eip.gg',
    type: 'tav',
    classTags: ['Barbarian', 'Bard', 'Sorcerer', 'Druid', 'Fighter', 'Cleric', 'Monk', 'Warlock', 'Paladin', 'Ranger', 'Rogue', 'Wizard'],
    tags: ['Multiclass', 'Face', 'Roleplay', 'Meme'],
    gearHints: [],
    notes: 'All 12 classes at level 1 each. Ultimate multiclass meme build.',
    status: 'candidate'
  },
];

// Summary stats
export const CANDIDATE_STATS = {
  total: EIP_GG_CANDIDATES.length,
  companion: EIP_GG_CANDIDATES.filter(c => c.type === 'companion').length,
  tav: EIP_GG_CANDIDATES.filter(c => c.type === 'tav').length,
  byClass: Object.fromEntries(
    ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard']
      .map(cls => [cls, EIP_GG_CANDIDATES.filter(c => c.classTags.includes(cls)).length])
  )
};
