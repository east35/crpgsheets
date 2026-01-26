import type { BackgroundInfo, BackgroundName } from '../../types';

export const BACKGROUNDS: Record<BackgroundName, BackgroundInfo> = {
  Acolyte: {
    name: 'Acolyte',
    description: 'You have spent your life in service to a temple, learning sacred rites and providing sacrifices to the god or gods you worship.',
    skillProficiencies: ['Insight', 'Religion'],
  },
  Charlatan: {
    name: 'Charlatan',
    description: 'You have always had a way with people. You know what makes them tick, you can tease out their hearts\' desires, and with a few leading questions you can read them like they were children\'s books.',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
  },
  Criminal: {
    name: 'Criminal',
    description: 'You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld.',
    skillProficiencies: ['Deception', 'Stealth'],
  },
  Entertainer: {
    name: 'Entertainer',
    description: 'You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.',
    skillProficiencies: ['Acrobatics', 'Performance'],
  },
  'Folk Hero': {
    name: 'Folk Hero',
    description: 'You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion.',
    skillProficiencies: ['Animal Handling', 'Survival'],
  },
  'Guild Artisan': {
    name: 'Guild Artisan',
    description: 'You are a member of an artisan\'s guild, skilled in a particular field and closely associated with other artisans.',
    skillProficiencies: ['Insight', 'Persuasion'],
  },
  'Haunted One': {
    name: 'Haunted One',
    description: 'You are haunted by something so terrible that you dare not speak of it. You have tried to bury it and run away from it, to no avail.',
    skillProficiencies: ['Intimidation', 'Medicine'],
  },
  Noble: {
    name: 'Noble',
    description: 'You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.',
    skillProficiencies: ['History', 'Persuasion'],
  },
  Outlander: {
    name: 'Outlander',
    description: 'You grew up in the wilds, far from civilization and the comforts of town and technology.',
    skillProficiencies: ['Athletics', 'Survival'],
  },
  Sage: {
    name: 'Sage',
    description: 'You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you.',
    skillProficiencies: ['Arcana', 'History'],
  },
  Soldier: {
    name: 'Soldier',
    description: 'War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, and learned basic survival techniques.',
    skillProficiencies: ['Athletics', 'Intimidation'],
  },
  Urchin: {
    name: 'Urchin',
    description: 'You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself.',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
  },
};

export function getBackground(name: BackgroundName): BackgroundInfo {
  return BACKGROUNDS[name];
}

export function getAllBackgrounds(): BackgroundInfo[] {
  return Object.values(BACKGROUNDS);
}
