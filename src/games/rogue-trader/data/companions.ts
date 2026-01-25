import type { CompanionInfo, CompanionName, BaseArchetype } from '../types';

export const COMPANIONS: Record<CompanionName, CompanionInfo> = {
  Abelard: {
    name: 'Abelard',
    fullName: 'Abelard Werserian',
    defaultArchetype: 'warrior',
    origin: 'voidBorn',
    description: 'Your loyal Seneschal and former first officer. A disciplined warrior focused on melee combat.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Frontline Damage / Tank',
  },
  Argenta: {
    name: 'Argenta',
    fullName: 'Sister Argenta',
    defaultArchetype: 'soldier',
    origin: 'schola',
    description: 'A Battle Sister of the Adepta Sororitas. Excels at ranged combat with bolters.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Ranged Damage',
  },
  Idira: {
    name: 'Idira',
    fullName: 'Idira Tlass',
    defaultArchetype: 'operative',
    origin: 'crimeWorld',
    description: 'A sanctioned psyker with powerful but dangerous abilities.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Psyker Support / Disruptor / Blaster',
  },
  Pasqal: {
    name: 'Pasqal',
    fullName: 'Pasqal Haneumann',
    defaultArchetype: 'operative',
    origin: 'forgeWorld',
    description: 'A Tech-Priest of the Adeptus Mechanicus. Master of technology and mechadendrites.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Ranged Damage / Support',
  },
  Cassia: {
    name: 'Cassia',
    fullName: 'Cassia Orsellio',
    defaultArchetype: 'officer',
    origin: 'voidBorn',
    description: 'Your Navigator and heir to House Orsellio. Support-focused with unique Navigator powers.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Support / Buffer',
  },
  Heinrix: {
    name: 'Heinrix',
    fullName: 'Heinrix van Calox',
    defaultArchetype: 'soldier',
    origin: 'imperialWorld',
    description: 'An Interrogator of the Inquisition. Skilled psyker and investigator.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Psyker / Ranged Damage',
  },
  Jae: {
    name: 'Jae',
    fullName: 'Jae Heydari',
    defaultArchetype: 'operative',
    origin: 'crimeWorld',
    description: 'A Cold Trader and skilled smuggler. Expert in deception and thievery.',
    recruitmentAct: 2,
    startingLevel: 12,
    role: 'Melee Damage / Debuffer',
  },
  Yrliet: {
    name: 'Yrliet',
    fullName: 'Yrliet Lanaevyss',
    defaultArchetype: 'soldier',
    origin: 'deathWorld',
    description: 'An Aeldari Ranger. Master sniper with unparalleled accuracy.',
    recruitmentAct: 2,
    startingLevel: 16,
    role: 'Long Range Damage',
  },
  Marazhai: {
    name: 'Marazhai',
    fullName: 'Marazhai Aezyrraesh',
    defaultArchetype: 'warrior' as BaseArchetype, // Starts as warrior, typically goes assassin
    origin: 'deathWorld',
    description: 'A Drukhari Kabalite. Deadly melee assassin who feeds on suffering.',
    recruitmentAct: 3,
    startingLevel: 26,
    role: 'Melee Damage / Assassin',
  },
  Ulfar: {
    name: 'Ulfar',
    fullName: 'Ulfar',
    defaultArchetype: 'warrior',
    origin: 'deathWorld',
    description: 'A Space Wolf. Devastating melee combatant with superhuman abilities.',
    recruitmentAct: 4,
    startingLevel: 36,
    role: 'Melee Damage / Tank',
  },
  RogueTrader: {
    name: 'RogueTrader',
    fullName: 'Rogue Trader',
    defaultArchetype: 'warrior',
    origin: 'imperialWorld',
    description: 'Your custom Rogue Trader protagonist.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Varies by Build',
  },
};

// Helper to get all companions as array
export function getAllCompanions(): CompanionInfo[] {
  return Object.values(COMPANIONS);
}

// Helper to get companions available at a specific act
export function getCompanionsByAct(act: number): CompanionInfo[] {
  return Object.values(COMPANIONS).filter((c) => c.recruitmentAct <= act);
}
