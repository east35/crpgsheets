// BG3 Class Icons - Local paths
import type { ClassName } from '../types';

// Available icons (extracted from bg3.wiki)
export const CLASS_ICONS: Record<ClassName, string> = {
  Barbarian: '/images/classes/bg3/barbarian.png',
  Bard: '/images/classes/bg3/barbarian.png', // fallback - needs icon
  Cleric: '/images/classes/bg3/cleric.png',
  Druid: '/images/classes/bg3/druid.png',
  Fighter: '/images/classes/bg3/barbarian.png', // fallback - needs icon
  Monk: '/images/classes/bg3/barbarian.png', // fallback - needs icon
  Paladin: '/images/classes/bg3/paladin.png',
  Ranger: '/images/classes/bg3/barbarian.png', // fallback - needs icon
  Rogue: '/images/classes/bg3/barbarian.png', // fallback - needs icon
  Sorcerer: '/images/classes/bg3/sorcerer.png',
  Warlock: '/images/classes/bg3/sorcerer.png', // fallback - needs icon
  Wizard: '/images/classes/bg3/wizard.png',
};

export function getClassIcon(className: ClassName): string {
  return CLASS_ICONS[className] || CLASS_ICONS.Fighter;
}

// Get the primary class from a build's final progression
export function getPrimaryClass(classLevels: { class: ClassName; level: number }[]): ClassName {
  if (!classLevels || classLevels.length === 0) return 'Fighter';
  
  // Return the class with the highest level
  const sorted = [...classLevels].sort((a, b) => b.level - a.level);
  return sorted[0].class;
}
