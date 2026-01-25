import type { Archetype, CompanionName, Origin } from '../types';

export interface CompanionInfo {
  name: CompanionName;
  fullName: string;
  startingArchetype: Archetype;
  origin: Origin;
  description: string;
  recruitmentAct: number;
  startingLevel: number;
}

export const COMPANIONS: Record<CompanionName, CompanionInfo> = {
  Abelard: {
    name: 'Abelard',
    fullName: 'Abelard Werserian',
    startingArchetype: 'warrior',
    origin: 'voidBorn',
    description: 'Your loyal Seneschal and former first officer. A disciplined warrior focused on melee combat.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
  Argenta: {
    name: 'Argenta',
    fullName: 'Sister Argenta',
    startingArchetype: 'soldier',
    origin: 'schola',
    description: 'A Battle Sister of the Adepta Sororitas. Excels at ranged combat with bolters.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
  Idira: {
    name: 'Idira',
    fullName: 'Idira Tlass',
    startingArchetype: 'operative',
    origin: 'crimeWorld',
    description: 'A sanctioned psyker with powerful but dangerous abilities.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
  Pasqal: {
    name: 'Pasqal',
    fullName: 'Pasqal Haneumann',
    startingArchetype: 'operative',
    origin: 'forgeWorld',
    description: 'A Tech-Priest of the Adeptus Mechanicus. Master of technology and mechadendrites.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
  Cassia: {
    name: 'Cassia',
    fullName: 'Cassia Orsellio',
    startingArchetype: 'officer',
    origin: 'voidBorn',
    description: 'Your Navigator and heir to House Orsellio. Support-focused with unique Navigator powers.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
  Heinrix: {
    name: 'Heinrix',
    fullName: 'Heinrix van Calox',
    startingArchetype: 'soldier',
    origin: 'imperialWorld',
    description: 'An Interrogator of the Inquisition. Skilled psyker and investigator.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
  Jae: {
    name: 'Jae',
    fullName: 'Jae Heydari',
    startingArchetype: 'operative',
    origin: 'crimeWorld',
    description: 'A Cold Trader and skilled smuggler. Expert in deception and thievery.',
    recruitmentAct: 2,
    startingLevel: 12,
  },
  Yrliet: {
    name: 'Yrliet',
    fullName: 'Yrliet Lanaevyss',
    startingArchetype: 'soldier',
    origin: 'deathWorld', // Closest equivalent for Aeldari
    description: 'An Aeldari Ranger. Master sniper with unparalleled accuracy.',
    recruitmentAct: 2,
    startingLevel: 16,
  },
  Marazhai: {
    name: 'Marazhai',
    fullName: 'Marazhai Aezyrraesh',
    startingArchetype: 'assassin',
    origin: 'deathWorld', // Closest equivalent for Drukhari
    description: 'A Drukhari Kabalite. Deadly melee assassin who feeds on suffering.',
    recruitmentAct: 3,
    startingLevel: 26,
  },
  Ulfar: {
    name: 'Ulfar',
    fullName: 'Ulfar',
    startingArchetype: 'warrior',
    origin: 'deathWorld',
    description: 'A Space Wolf. Devastating melee combatant with superhuman abilities.',
    recruitmentAct: 4,
    startingLevel: 36,
  },
  Custom: {
    name: 'Custom',
    fullName: 'Custom Character',
    startingArchetype: 'warrior',
    origin: 'imperialWorld',
    description: 'Your custom Rogue Trader or custom character build.',
    recruitmentAct: 1,
    startingLevel: 1,
  },
};

export const ARCHETYPE_DISPLAY_NAMES: Record<Archetype, string> = {
  warrior: 'Warrior',
  operative: 'Operative',
  soldier: 'Soldier',
  officer: 'Officer',
  assassin: 'Assassin',
  vanguard: 'Vanguard',
  bountyHunter: 'Bounty Hunter',
  masterTactician: 'Master Tactician',
  archMilitant: 'Arch-Militant',
  exemplar: 'Exemplar',
  bladeDancer: 'Blade Dancer',
  grandStrategist: 'Grand Strategist',
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
