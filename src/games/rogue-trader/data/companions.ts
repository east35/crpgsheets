import type { CompanionInfo, CompanionName, BaseArchetype } from '../types';

export const COMPANIONS: Record<CompanionName, CompanionInfo> = {
  // ============================================
  // PLAYER CHARACTER
  // ============================================
  RogueTrader: {
    name: 'RogueTrader',
    fullName: 'Rogue Trader',
    defaultArchetype: 'warrior',
    origin: 'imperialWorld',
    description: 'Your custom Rogue Trader protagonist.',
    bio: 'The Rogue Trader is the player character, heir to a powerful dynasty with a Warrant of Trade granting them authority to explore beyond the borders of the Imperium.',
    quote: 'By the authority of the Golden Throne and the Warrant of Trade, I claim dominion over all I survey.',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Varies by Build',
  },

  // ============================================
  // PROLOGUE COMPANIONS
  // ============================================
  Abelard: {
    name: 'Abelard',
    fullName: 'Abelard Werserian',
    defaultArchetype: 'warrior',
    origin: 'voidBorn',
    description: 'Your loyal Seneschal and former first officer. A disciplined warrior focused on melee combat.',
    bio: 'Abelard Werserian is a powerful Warrior faithful to the Rogue Trader empire. He used to be an officer in the Navis Imperialis before becoming Seneschal to Lord Captain Theodora.',
    quote: 'I used to be an officer in the Navis Imperialis. No, "used to be" is not quite right. It was not simply a job — it was my calling, the essence of my life. I was proud to serve Lord Captain Theodora, but in my heart and mind, I am still an officer of the Imperium.',
    portraitUrl: '/images/companions/rogue-trader/abelard.webp',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Frontline Damage / Tank',
  },
  Idira: {
    name: 'Idira',
    fullName: 'Idira Tlass',
    defaultArchetype: 'operative',
    origin: 'crimeWorld',
    description: 'An unsanctioned psyker with powerful but dangerous abilities.',
    bio: 'Idira Tlass is a psyker diviner Operative in the service of Rogue Trader von Valancius. She possesses powerful psychic abilities but must carefully manage the dangers of the Warp.',
    quote: 'Only losers who are afraid of their own gift lose control. Or idiots who never figure out what they are before it\'s too late. Or little kids who want to play around with their shiny new toy. If you don\'t know the limits of your abilities or you\'re always bouncing around in your own head, that\'s a recipe for disaster.',
    portraitUrl: '/images/companions/rogue-trader/idira.jpg',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Psyker Support / Disruptor / Blaster',
  },
  Argenta: {
    name: 'Argenta',
    fullName: 'Sister Argenta',
    defaultArchetype: 'soldier',
    origin: 'schola',
    description: 'A Battle Sister of the Adepta Sororitas. Excels at ranged combat with bolters.',
    bio: 'Sister Argenta is one of the blessed Adepta Sororitas, a warrior of the God-Emperor who brings His wrath to heretics, mutants, and other enemies of Humanity.',
    quote: 'The Sisters of Battle are a fire lit by the God-Emperor. They are the echo of His voice that travels through the dark expanses of the universe. We bring His wrath to heretics, mutants, and other enemies of Humanity. We protect the faithful from the unholy and unhallowed. Sometimes with words. More often than not, with a bolter.',
    portraitUrl: '/images/companions/rogue-trader/argenta.jpg',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Ranged Damage',
  },

  // ============================================
  // CHAPTER 1 COMPANIONS
  // ============================================
  Cassia: {
    name: 'Cassia',
    fullName: 'Cassia Orsellio',
    defaultArchetype: 'officer',
    origin: 'voidBorn',
    description: 'Your Navigator and heir to House Orsellio. Support-focused with unique Navigator powers.',
    bio: 'Cassia Orsellio is the young heiress of a Navis Nobilite House. Blessed with the Navigator\'s third eye, she can perceive the inner nature of beings and guide ships through the Warp.',
    quote: 'The Emperor graced me with a gift — I can see inner life in addition to the mundane. You cannot know that a fruit has rotten from the inside until a blade slices it in two. I can see the rot from far away — it roils like swamp mud, oozing through the bright peel. Anger and boredom, sadness and joy, everything that people shut away inside themselves is revealed to me like colours on the canvas of my world.',
    portraitUrl: '/images/companions/rogue-trader/cassia.jpg',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Support / Buffer',
  },
  Pasqal: {
    name: 'Pasqal',
    fullName: 'Pasqal Haneumann',
    defaultArchetype: 'operative',
    origin: 'forgeWorld',
    description: 'A Tech-Priest of the Adeptus Mechanicus. Master of technology and mechadendrites.',
    bio: 'Pasqal Haneumann is a venerable Magos of the Adeptus Mechanicus. He serves as the technical expert aboard the Rogue Trader\'s vessel, maintaining the sacred machine spirits.',
    quote: 'Everything that bears the blessed seal of machinery comes from our hands, and it is we who make sure the operating rituals are performed as they were meant to. We are everywhere — we are the Mars-forged steel bars that give the Imperium strength.',
    portraitUrl: '/images/companions/rogue-trader/pasqal.jpg',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Ranged Damage / Support',
  },
  Heinrix: {
    name: 'Heinrix',
    fullName: 'Heinrix van Calox',
    defaultArchetype: 'soldier',
    origin: 'imperialWorld',
    description: 'An Interrogator of the Inquisition. Skilled psyker and investigator.',
    bio: 'Heinrix van Calox is an Agent of the Golden Throne, an Interrogator serving the Holy Inquisition. He has traveled extensively throughout the Imperium and beyond its borders.',
    quote: 'I have visited many of the places brought to the Emperor\'s light... and those sullied by the filth of the Archenemy. In truth, even after all these years spent visiting the various corners of the Imperium and looking beyond its borders, I still consider the Segmentum Solar to be the greatest of all Humanity\'s bastions.',
    portraitUrl: '/images/companions/rogue-trader/heinrix.jpg',
    recruitmentAct: 1,
    startingLevel: 1,
    role: 'Psyker / Ranged Damage',
  },

  // ============================================
  // CHAPTER 2 COMPANIONS
  // ============================================
  Jae: {
    name: 'Jae',
    fullName: 'Jae Heydari',
    defaultArchetype: 'operative',
    origin: 'crimeWorld',
    description: 'A Cold Trader and skilled smuggler. Expert in deception and thievery.',
    bio: 'Jae Heydari is a cunning Cold Trader whose precision with guns is only matched by her social and financial acumen. She knows the right people and connections to move precious goods.',
    quote: 'My trade means knowing the right people and non-people, having the right connections, and making sure the precious goods find their way into the hands of my no-less-precious customers. My wisdom includes the knowledge of the enemies of Humankind, be they xenos or the lowest scum in the Imperium, as well as the latest knowledge about how much they charge for any particular curio at the Footfall market.',
    portraitUrl: '/images/companions/rogue-trader/jae.webp',
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
    bio: 'Yrliet Lanaevyss is a member of the Aeldari species and a far-flung member of the Outcast path whose specialty dwells in that of the ranger. Her homeworld is gone and her kin scattered.',
    quote: 'The Outcasts my Path led me to had a saying... Let me translate it for you: "If you fall off a cliff, grab the roots and do not ask if they belong to a weed or a noble rose bush." You are the root I grabbed, elantach. Because I fell off a cliff. My homeworld is gone, my kin are either dead or hiding no one knows where. By joining forces with you, I may be able to nurture a seedling of the truth I so deeply yearn for.',
    portraitUrl: '/images/companions/rogue-trader/yrliet.webp',
    recruitmentAct: 2,
    startingLevel: 16,
    role: 'Long Range Damage',
  },

  // ============================================
  // CHAPTER 3 COMPANIONS
  // ============================================
  Ulfar: {
    name: 'Ulfar',
    fullName: 'Ulfar',
    defaultArchetype: 'warrior',
    origin: 'deathWorld',
    description: 'A Space Wolf. Devastating melee combatant with superhuman abilities.',
    bio: 'Ulfar is a proud member of the Adeptus Astartes, the Vlka Fenryka of Fenris, a proud skald and savage warrior. Before becoming an Astartes, he dreamed of becoming a keeper of stories.',
    quote: 'Before becoming an Astartes, I dreamed of becoming a skjald, a keeper of stories. At feasts I often sing of my brothers\' exploits. Thousands are stored in my memory. When I am near, Wolves fight even more ferociously, for they know their deeds will be immortalised. One of the Tech-Priests theorised that our songs contained hidden psychometric codes to increase courage. Maybe there is such a thing in other places. But on Fenris our sagas are spun from memory, from respect, from pride.',
    portraitUrl: '/images/companions/rogue-trader/ulfar.webp',
    recruitmentAct: 3,
    startingLevel: 26,
    role: 'Melee Damage / Tank',
  },
  Marazhai: {
    name: 'Marazhai',
    fullName: 'Marazhai Aezyrraesh',
    defaultArchetype: 'warrior' as BaseArchetype,
    origin: 'deathWorld',
    description: 'A Drukhari Kabalite. Deadly melee assassin who feeds on suffering.',
    bio: 'Marazhai Aezyrraesh is a cruel and callous Dracon of the wretched Drukhari. He delights in the suffering of others, particularly the pain of the soul.',
    quote: 'The sole thing that your kind is good for, mon-keigh, is your ability to suffer. I have long been surfeited with physical pain — your kin provide it in abundance from their cages in Commorragh. The pain of the soul, on the other hand... is a rare delight.',
    portraitUrl: '/images/companions/rogue-trader/marazhai.webp',
    recruitmentAct: 3,
    startingLevel: 26,
    role: 'Melee Damage / Assassin',
  },

  // ============================================
  // DLC COMPANIONS
  // ============================================
  Kibellah: {
    name: 'Kibellah',
    fullName: 'Kibellah',
    defaultArchetype: 'bladeDancer',
    origin: 'deathWorld',
    description: 'A deadly Blade Dancer from the Death Cult Assassins. DLC companion.',
    bio: 'Kibellah is a Death Cult Assassin, a lethal warrior who has dedicated her life to the art of killing in service to the God-Emperor.',
    quote: 'Death is my art, and I am its finest artist.',
    portraitUrl: '/images/companions/rogue-trader/kibellah.jpg',
    recruitmentAct: 2,
    startingLevel: 16,
    role: 'Melee Damage / Assassin',
    availability: 'dlc',
  },
  Solomorne: {
    name: 'Solomorne',
    fullName: 'Solomorne Anthar',
    defaultArchetype: 'soldier',
    origin: 'imperialWorld',
    description: 'An Arbitrator with a loyal cyber-mastiff. DLC companion.',
    bio: 'Solomorne Anthar is an Adeptus Arbites enforcer who brings Imperial law to the lawless Koronus Expanse, accompanied by his faithful cyber-mastiff.',
    quote: 'The law is absolute. There is no negotiation, only judgement.',
    portraitUrl: '/images/companions/rogue-trader/solomorne.jpg',
    recruitmentAct: 2,
    startingLevel: 19,
    role: 'Ranged Damage / Pet Handler',
    availability: 'dlc',
  },

  // ============================================
  // SECRET COMPANIONS
  // ============================================
  Incendia: {
    name: 'Incendia',
    fullName: 'Incendia Bastaal-Chorda',
    defaultArchetype: 'soldier',
    origin: 'imperialWorld',
    description: 'A zealous Ministorum Priest wielding dual pistols. Secret companion.',
    bio: 'Incendia Bastaal-Chorda is a fiery preacher of the Imperial Cult, spreading the word of the God-Emperor with righteous fury and blazing pistols.',
    quote: 'Let the flames of faith purify the unworthy!',
    portraitUrl: '/images/companions/rogue-trader/incendia.jpg',
    recruitmentAct: 2,
    startingLevel: 16,
    role: 'Ranged Damage / Support',
    availability: 'secret',
  },
  Winterscale: {
    name: 'Winterscale',
    fullName: 'Calligos Winterscale',
    defaultArchetype: 'warrior',
    origin: 'imperialWorld',
    description: 'A rival Rogue Trader known for his aggressive tactics. Secret companion.',
    bio: 'Calligos Winterscale is a legendary Rogue Trader whose dynasty rivals the von Valancius. He is known for his bold tactics and martial prowess.',
    quote: 'In the Koronus Expanse, the bold take what they want and the weak serve those who do.',
    portraitUrl: '/images/companions/rogue-trader/calligos.jpg',
    recruitmentAct: 3,
    startingLevel: 26,
    role: 'Melee Damage / Frontline',
    availability: 'secret',
  },
  Uralon: {
    name: 'Uralon',
    fullName: 'Uralon the Cruel',
    defaultArchetype: 'officer',
    origin: 'deathWorld',
    description: 'A Dark Apostle of the Word Bearers. Secret companion.',
    bio: 'Uralon the Cruel is a Dark Apostle of the Word Bearers Traitor Legion, a preacher of the Ruinous Powers who spreads the word of Chaos.',
    quote: 'The False Emperor sits upon a throne of lies. Let me show you the truth.',
    portraitUrl: '/images/companions/rogue-trader/uralon.jpeg',
    recruitmentAct: 4,
    startingLevel: 36,
    role: 'Support / Buffer',
    availability: 'secret',
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
