import type { ClassInfo, ClassName } from '../../types';

export const CLASSES: Record<ClassName, ClassInfo> = {
  Barbarian: {
    name: 'Barbarian',
    description: 'A fierce warrior who can enter a battle rage, gaining powerful combat abilities.',
    hitDie: 12,
    primaryAbility: ['Strength'],
    savingThrows: ['Strength', 'Constitution'],
    subclassLevel: 3,
    subclasses: [
      { name: 'Berserker', description: 'Violence is both a means and an end. You follow a path of untrammeled fury, slick with blood, as you thrill in the chaos of battle.', parentClass: 'Barbarian' },
      { name: 'Wildheart', description: 'Your rage is fueled by a connection to the natural world and its primal spirits.', parentClass: 'Barbarian' },
      { name: 'Wild Magic', description: 'Your rage taps into the wild forces of magic, causing unpredictable magical effects.', parentClass: 'Barbarian' },
    ],
  },
  Bard: {
    name: 'Bard',
    description: 'An inspiring magician whose power echoes the music of creation.',
    hitDie: 8,
    primaryAbility: ['Charisma'],
    savingThrows: ['Dexterity', 'Charisma'],
    subclassLevel: 3,
    subclasses: [
      { name: 'College of Lore', description: 'You pursue beauty and truth, collecting knowledge from scholarly tomes to peasant tales.', parentClass: 'Bard' },
      { name: 'College of Valour', description: 'You are a daring skald whose tales keep alive the memory of great heroes.', parentClass: 'Bard' },
      { name: 'College of Swords', description: 'You entertain through daring feats of weapon prowess, performing stunts with blades.', parentClass: 'Bard' },
    ],
    spellcasting: { ability: 'Charisma', type: 'full' },
  },
  Cleric: {
    name: 'Cleric',
    description: 'A priestly champion who wields divine magic in service of a higher power.',
    hitDie: 8,
    primaryAbility: ['Wisdom'],
    savingThrows: ['Wisdom', 'Charisma'],
    subclassLevel: 1,
    subclasses: [
      { name: 'Life Domain', description: 'The Life domain focuses on the vibrant positive energy that sustains all life.', parentClass: 'Cleric' },
      { name: 'Light Domain', description: 'Gods of light promote ideals of rebirth, truth, vigilance, and beauty.', parentClass: 'Cleric' },
      { name: 'Trickery Domain', description: 'Gods of trickery are mischief-makers and instigators who challenge the established order.', parentClass: 'Cleric' },
      { name: 'Knowledge Domain', description: 'The gods of knowledge value learning and understanding above all.', parentClass: 'Cleric' },
      { name: 'Nature Domain', description: 'Gods of nature are as varied as the natural world itself.', parentClass: 'Cleric' },
      { name: 'Tempest Domain', description: 'Gods whose portfolios include the Tempest domain govern storms, sea, and sky.', parentClass: 'Cleric' },
      { name: 'War Domain', description: 'War has many manifestations. It can make heroes of ordinary people.', parentClass: 'Cleric' },
    ],
    spellcasting: { ability: 'Wisdom', type: 'full' },
  },
  Druid: {
    name: 'Druid',
    description: 'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.',
    hitDie: 8,
    primaryAbility: ['Wisdom'],
    savingThrows: ['Intelligence', 'Wisdom'],
    subclassLevel: 2,
    subclasses: [
      { name: 'Circle of the Land', description: 'Your connection to the land grants you additional spells based on the terrain.', parentClass: 'Druid' },
      { name: 'Circle of the Moon', description: 'You have learned to channel the most primal aspects of nature, transforming into powerful beasts.', parentClass: 'Druid' },
      { name: 'Circle of the Spores', description: 'You find beauty in decay and draw power from the cycle of life and death.', parentClass: 'Druid' },
    ],
    spellcasting: { ability: 'Wisdom', type: 'full' },
  },
  Fighter: {
    name: 'Fighter',
    description: 'A master of martial combat, skilled with a variety of weapons and armor.',
    hitDie: 10,
    primaryAbility: ['Strength', 'Dexterity'],
    savingThrows: ['Strength', 'Constitution'],
    subclassLevel: 3,
    subclasses: [
      { name: 'Battle Master', description: 'You employ martial techniques passed down through generations, using superiority dice to fuel special maneuvers.', parentClass: 'Fighter' },
      { name: 'Champion', description: 'You focus on raw physical power, honing your body to deadly perfection.', parentClass: 'Fighter' },
      { name: 'Eldritch Knight', description: 'You combine martial prowess with magical ability, learning to cast spells.', parentClass: 'Fighter' },
    ],
    spellcasting: undefined,
  },
  Monk: {
    name: 'Monk',
    description: 'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
    hitDie: 8,
    primaryAbility: ['Dexterity', 'Wisdom'],
    savingThrows: ['Strength', 'Dexterity'],
    subclassLevel: 3,
    subclasses: [
      { name: 'Way of the Open Hand', description: 'You pursue mastery of martial arts combat, learning techniques to push and trip opponents.', parentClass: 'Monk' },
      { name: 'Way of Shadow', description: 'You follow a tradition that values stealth and subterfuge, striking from the shadows.', parentClass: 'Monk' },
      { name: 'Way of the Four Elements', description: 'You learn to harness the elements, channeling ki into elemental spells.', parentClass: 'Monk' },
    ],
  },
  Paladin: {
    name: 'Paladin',
    description: 'A holy warrior bound to a sacred oath, wielding divine magic and martial prowess.',
    hitDie: 10,
    primaryAbility: ['Strength', 'Charisma'],
    savingThrows: ['Wisdom', 'Charisma'],
    subclassLevel: 1,
    subclasses: [
      { name: 'Oath of Devotion', description: 'You are bound to the loftiest ideals of justice, virtue, and order.', parentClass: 'Paladin' },
      { name: 'Oath of the Ancients', description: 'You have sworn to protect the light and preserve life and beauty in the world.', parentClass: 'Paladin' },
      { name: 'Oath of Vengeance', description: 'You have sworn to punish those who have committed grievous sins.', parentClass: 'Paladin' },
      { name: 'Oathbreaker', description: 'You have broken your sacred oath, gaining dark powers in exchange.', parentClass: 'Paladin' },
    ],
    spellcasting: { ability: 'Charisma', type: 'half' },
  },
  Ranger: {
    name: 'Ranger',
    description: 'A warrior who combats threats on the edges of civilization using martial prowess and nature magic.',
    hitDie: 10,
    primaryAbility: ['Dexterity', 'Wisdom'],
    savingThrows: ['Strength', 'Dexterity'],
    subclassLevel: 3,
    subclasses: [
      { name: 'Hunter', description: 'You accept your place as a bulwark between civilization and the terrors of the wilderness.', parentClass: 'Ranger' },
      { name: 'Beast Master', description: 'You form a mystical bond with a beast companion that fights alongside you.', parentClass: 'Ranger' },
      { name: 'Gloom Stalker', description: 'You are at home in the darkest places, ambushing foes before they can react.', parentClass: 'Ranger' },
    ],
    spellcasting: { ability: 'Wisdom', type: 'half' },
  },
  Rogue: {
    name: 'Rogue',
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.',
    hitDie: 8,
    primaryAbility: ['Dexterity'],
    savingThrows: ['Dexterity', 'Intelligence'],
    subclassLevel: 3,
    subclasses: [
      { name: 'Thief', description: 'You hone your skills in the larcenous arts, gaining abilities useful for dungeon delving.', parentClass: 'Rogue' },
      { name: 'Arcane Trickster', description: 'You augment your roguish abilities with magic, learning enchantment and illusion spells.', parentClass: 'Rogue' },
      { name: 'Assassin', description: 'You focus your training on the grim art of death, excelling at eliminating foes with deadly efficiency.', parentClass: 'Rogue' },
    ],
    spellcasting: undefined,
  },
  Sorcerer: {
    name: 'Sorcerer',
    description: 'A spellcaster who draws on inherent magic from a gift or bloodline.',
    hitDie: 6,
    primaryAbility: ['Charisma'],
    savingThrows: ['Constitution', 'Charisma'],
    subclassLevel: 1,
    subclasses: [
      { name: 'Draconic Bloodline', description: 'Your innate magic comes from draconic ancestry, granting you scales and elemental power.', parentClass: 'Sorcerer' },
      { name: 'Wild Magic', description: 'Your innate magic stems from the forces of chaos, causing unpredictable magical effects.', parentClass: 'Sorcerer' },
      { name: 'Storm Sorcery', description: 'Your innate magic comes from the power of elemental air and storms.', parentClass: 'Sorcerer' },
    ],
    spellcasting: { ability: 'Charisma', type: 'full' },
  },
  Warlock: {
    name: 'Warlock',
    description: 'A wielder of magic derived from a bargain with an extraplanar entity.',
    hitDie: 8,
    primaryAbility: ['Charisma'],
    savingThrows: ['Wisdom', 'Charisma'],
    subclassLevel: 1,
    subclasses: [
      { name: 'The Fiend', description: 'You have made a pact with a fiend from the lower planes of existence.', parentClass: 'Warlock' },
      { name: 'The Great Old One', description: 'Your patron is a mysterious entity from the Far Realm or ancient cosmos.', parentClass: 'Warlock' },
      { name: 'The Archfey', description: 'Your patron is a lord or lady of the fey, a being of immense power.', parentClass: 'Warlock' },
    ],
    spellcasting: { ability: 'Charisma', type: 'pact' },
  },
  Wizard: {
    name: 'Wizard',
    description: 'A scholarly magic-user capable of manipulating the structures of reality.',
    hitDie: 6,
    primaryAbility: ['Intelligence'],
    savingThrows: ['Intelligence', 'Wisdom'],
    subclassLevel: 2,
    subclasses: [
      { name: 'Abjuration School', description: 'You focus on magic that blocks, banishes, or protects.', parentClass: 'Wizard' },
      { name: 'Conjuration School', description: 'You focus on spells that produce objects and creatures out of thin air.', parentClass: 'Wizard' },
      { name: 'Divination School', description: 'You focus on magic that reveals information and glimpses of the future.', parentClass: 'Wizard' },
      { name: 'Enchantment School', description: 'You focus on magic that entrances and beguiles other creatures.', parentClass: 'Wizard' },
      { name: 'Evocation School', description: 'You focus on spells that create powerful elemental effects.', parentClass: 'Wizard' },
      { name: 'Illusion School', description: 'You focus on magic that dazzles the senses and tricks the mind.', parentClass: 'Wizard' },
      { name: 'Necromancy School', description: 'You focus on spells that manipulate the energy of life and death.', parentClass: 'Wizard' },
      { name: 'Transmutation School', description: 'You focus on spells that modify energy and matter.', parentClass: 'Wizard' },
    ],
    spellcasting: { ability: 'Intelligence', type: 'full' },
  },
};

export function getClass(name: ClassName): ClassInfo {
  return CLASSES[name];
}

export function getAllClasses(): ClassInfo[] {
  return Object.values(CLASSES);
}

export function getSubclasses(className: ClassName): ClassInfo['subclasses'] {
  return CLASSES[className].subclasses;
}
