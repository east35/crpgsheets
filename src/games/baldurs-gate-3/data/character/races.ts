import type { RaceInfo, RaceName } from '../../types';

export const RACES: Record<RaceName, RaceInfo> = {
  Dragonborn: {
    name: 'Dragonborn',
    description: 'Dragonborn are proud dragon-kin, born with elemental breath weapons and resistance.',
    speed: 9,
    traits: ['Draconic Ancestry', 'Breath Weapon'],
    subraces: [
      { name: 'Black Dragonborn', description: 'Acid breath and resistance.', parentRace: 'Dragonborn', traits: ['Acid Breath', 'Acid Resistance'] },
      { name: 'Blue Dragonborn', description: 'Lightning breath and resistance.', parentRace: 'Dragonborn', traits: ['Lightning Breath', 'Lightning Resistance'] },
      { name: 'Brass Dragonborn', description: 'Fire breath and resistance.', parentRace: 'Dragonborn', traits: ['Fire Breath (Line)', 'Fire Resistance'] },
      { name: 'Bronze Dragonborn', description: 'Lightning breath and resistance.', parentRace: 'Dragonborn', traits: ['Lightning Breath', 'Lightning Resistance'] },
      { name: 'Copper Dragonborn', description: 'Acid breath and resistance.', parentRace: 'Dragonborn', traits: ['Acid Breath (Line)', 'Acid Resistance'] },
      { name: 'Gold Dragonborn', description: 'Fire breath and resistance.', parentRace: 'Dragonborn', traits: ['Fire Breath', 'Fire Resistance'] },
      { name: 'Green Dragonborn', description: 'Poison breath and resistance.', parentRace: 'Dragonborn', traits: ['Poison Breath', 'Poison Resistance'] },
      { name: 'Red Dragonborn', description: 'Fire breath and resistance.', parentRace: 'Dragonborn', traits: ['Fire Breath', 'Fire Resistance'] },
      { name: 'Silver Dragonborn', description: 'Cold breath and resistance.', parentRace: 'Dragonborn', traits: ['Cold Breath', 'Cold Resistance'] },
      { name: 'White Dragonborn', description: 'Cold breath and resistance.', parentRace: 'Dragonborn', traits: ['Cold Breath (Line)', 'Cold Resistance'] },
    ],
  },
  Drow: {
    name: 'Drow',
    description: 'Dark elves who dwell in the Underdark, known for their cruelty and magical prowess.',
    speed: 9,
    traits: ['Superior Darkvision', 'Fey Ancestry', 'Drow Weapon Training'],
    subraces: [
      { name: 'Lolth-Sworn Drow', description: 'Drow devoted to the spider goddess Lolth.', parentRace: 'Drow', traits: ['Dancing Lights', 'Faerie Fire', 'Darkness'] },
      { name: 'Seldarine Drow', description: 'Drow who have rejected Lolth and worship the Seldarine.', parentRace: 'Drow', traits: ['Dancing Lights', 'Faerie Fire', 'Darkness'] },
    ],
  },
  Dwarf: {
    name: 'Dwarf',
    description: 'Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.',
    speed: 7.5,
    traits: ['Darkvision', 'Dwarven Resilience', 'Dwarven Combat Training'],
    subraces: [
      { name: 'Gold Dwarf', description: 'Also known as hill dwarves, confident and keen-sensed.', parentRace: 'Dwarf', traits: ['Dwarven Toughness'] },
      { name: 'Shield Dwarf', description: 'Also known as mountain dwarves, strong and hardy.', parentRace: 'Dwarf', traits: ['Dwarven Armor Training'] },
      { name: 'Duergar', description: 'Grey dwarves from the Underdark with psionic abilities.', parentRace: 'Dwarf', traits: ['Superior Darkvision', 'Duergar Resilience', 'Enlarge', 'Invisibility'] },
    ],
  },
  Elf: {
    name: 'Elf',
    description: 'Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.',
    speed: 9,
    traits: ['Darkvision', 'Fey Ancestry', 'Keen Senses'],
    subraces: [
      { name: 'High Elf', description: 'High elves have a keen mind and mastery of basic magic.', parentRace: 'Elf', traits: ['High Elf Cantrip', 'Elf Weapon Training'] },
      { name: 'Wood Elf', description: 'Wood elves have keen senses and intuition, moving quickly and stealthily.', parentRace: 'Elf', traits: ['Fleet of Foot', 'Mask of the Wild', 'Elf Weapon Training'] },
    ],
  },
  Githyanki: {
    name: 'Githyanki',
    description: 'Githyanki are peerless warriors from the Astral Plane, known for their martial prowess and psionic abilities.',
    speed: 9,
    traits: ['Astral Knowledge', 'Martial Prodigy', 'Githyanki Psionics'],
    subraces: [],
  },
  Gnome: {
    name: 'Gnome',
    description: 'A gnome\'s energy and enthusiasm for living shines through every inch of their tiny body.',
    speed: 7.5,
    traits: ['Darkvision', 'Gnome Cunning'],
    subraces: [
      { name: 'Rock Gnome', description: 'Rock gnomes are natural inventors and tinkerers.', parentRace: 'Gnome', traits: ['Artificer\'s Lore'] },
      { name: 'Forest Gnome', description: 'Forest gnomes have a natural knack for illusion and stealth.', parentRace: 'Gnome', traits: ['Speak with Animals', 'Natural Illusionist'] },
      { name: 'Deep Gnome', description: 'Deep gnomes, or svirfneblin, are natives of the Underdark.', parentRace: 'Gnome', traits: ['Superior Darkvision', 'Stone Camouflage'] },
    ],
  },
  'Half-Elf': {
    name: 'Half-Elf',
    description: 'Half-elves combine what some say are the best qualities of their elf and human parents.',
    speed: 9,
    traits: ['Darkvision', 'Fey Ancestry', 'Civil Militia'],
    subraces: [
      { name: 'High Half-Elf', description: 'A half-elf with high elf ancestry, gaining a cantrip.', parentRace: 'Half-Elf', traits: ['High Elf Cantrip'] },
      { name: 'Wood Half-Elf', description: 'A half-elf with wood elf ancestry, gaining increased movement.', parentRace: 'Half-Elf', traits: ['Fleet of Foot', 'Mask of the Wild'] },
      { name: 'Drow Half-Elf', description: 'A half-elf with drow ancestry, gaining drow magic.', parentRace: 'Half-Elf', traits: ['Dancing Lights'] },
    ],
  },
  'Half-Orc': {
    name: 'Half-Orc',
    description: 'Half-orcs\' grayish pigmentation, sloping foreheads, jutting jaws, and prominent teeth mark their orcish heritage.',
    speed: 9,
    traits: ['Darkvision', 'Relentless Endurance', 'Savage Attacks', 'Menacing'],
    subraces: [],
  },
  Halfling: {
    name: 'Halfling',
    description: 'The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.',
    speed: 7.5,
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness'],
    subraces: [
      { name: 'Lightfoot Halfling', description: 'Lightfoot halflings are adept at hiding and naturally stealthy.', parentRace: 'Halfling', traits: ['Naturally Stealthy'] },
      { name: 'Strongheart Halfling', description: 'Strongheart halflings are hardier and more resilient.', parentRace: 'Halfling', traits: ['Strongheart Resilience'] },
    ],
  },
  Human: {
    name: 'Human',
    description: 'Humans are the most adaptable and ambitious people among the common races.',
    speed: 9,
    traits: ['Civil Militia', 'Human Versatility'],
    subraces: [],
  },
  Tiefling: {
    name: 'Tiefling',
    description: 'Tieflings are derived from human bloodlines, and in the broadest possible sense, they still look human.',
    speed: 9,
    traits: ['Darkvision', 'Hellish Resistance'],
    subraces: [
      { name: 'Asmodeus Tiefling', description: 'Tieflings connected to Asmodeus gain fire magic.', parentRace: 'Tiefling', traits: ['Thaumaturgy', 'Hellish Rebuke', 'Darkness'] },
      { name: 'Mephistopheles Tiefling', description: 'Tieflings connected to Mephistopheles gain arcane magic.', parentRace: 'Tiefling', traits: ['Mage Hand', 'Burning Hands', 'Flame Blade'] },
      { name: 'Zariel Tiefling', description: 'Tieflings connected to Zariel gain martial and fire abilities.', parentRace: 'Tiefling', traits: ['Thaumaturgy', 'Searing Smite', 'Branding Smite'] },
    ],
  },
};

export function getRace(name: RaceName): RaceInfo {
  return RACES[name];
}

export function getAllRaces(): RaceInfo[] {
  return Object.values(RACES);
}
