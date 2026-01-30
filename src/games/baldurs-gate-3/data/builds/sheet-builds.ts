import type { AbilityScore, BG3Build, BackgroundName, ClassName, GearRecommendation, GearSlot, LevelProgression, RaceName, SubclassName } from '../../types';
import { CLASSES } from '../classes/index';
import { COMPANIONS } from '../companions';
import { RACES } from '../character/races';
import { BACKGROUNDS } from '../character/backgrounds';
import { getCsvGearInfo } from '../gear';
import potionsData from '../potions.json';
import elixirsData from '../elixirs.json';

import tavMrKnowItAll from './sheets/tav/json/mr-know-at-all.json';
import tavOlympicShotputter from './sheets/tav/json/olympic-shotputter-barbarian.json';
import tavPaladinBatman from './sheets/tav/json/paladin-batman.json';
import tavPcGamingMulti from './sheets/tav/json/pcgaming-multiclass.json';
import tavSneakyAssassin from './sheets/tav/json/sneaky-assassin-guy-classic.json';
import tavSwashbuckling from './sheets/tav/json/swashbuckling-duelist-bardadin.json';

import originEipggShadowheart from './sheets/origin/json/eipgg-shadowheart.json';
import originGiantKarlach from './sheets/origin/json/giant-karlach.json';
import originRedditMultiClass from './sheets/origin/json/reddit multi-class.json';
import originRedditSingleClass from './sheets/origin/json/reddit single-class.json';

const CLASS_NAMES = Object.keys(CLASSES) as ClassName[];
const DEFAULT_RACE: RaceName = 'Human';
const DEFAULT_BACKGROUND: BackgroundName = 'Folk Hero';

const SUBRACE_TO_RACE = (() => {
  const map = new Map<string, RaceName>();
  for (const race of Object.values(RACES)) {
    for (const subrace of race.subraces) {
      map.set(subrace.name.toLowerCase(), race.name);
    }
  }
  return map;
})();

const normalizeText = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const normalizeAbilityScores = (stats: Record<string, number> | undefined, fallback?: Record<AbilityScore, number>) => {
  return {
    Strength: stats?.strength ?? stats?.Strength ?? fallback?.Strength ?? 10,
    Dexterity: stats?.dexterity ?? stats?.Dexterity ?? fallback?.Dexterity ?? 10,
    Constitution: stats?.constitution ?? stats?.Constitution ?? fallback?.Constitution ?? 10,
    Intelligence: stats?.intelligence ?? stats?.Intelligence ?? fallback?.Intelligence ?? 10,
    Wisdom: stats?.wisdom ?? stats?.Wisdom ?? fallback?.Wisdom ?? 10,
    Charisma: stats?.charisma ?? stats?.Charisma ?? fallback?.Charisma ?? 10,
  } as Record<AbilityScore, number>;
};

const findCompanion = (name?: string) => {
  if (!name) return null;
  const match = Object.values(COMPANIONS).find((companion) => normalizeText(companion.name) === normalizeText(name) || normalizeText(companion.fullName) === normalizeText(name));
  return match ?? null;
};

const parseRace = (raceValue?: string, originValue?: string, companionName?: string) => {
  const companion = findCompanion(companionName);
  const raw = raceValue || originValue || companion?.subrace || companion?.race;
  if (!raw) {
    return { race: companion?.race ?? DEFAULT_RACE, subrace: companion?.subrace };
  }
  const normalized = raw.trim();
  const parentRace = SUBRACE_TO_RACE.get(normalized.toLowerCase());
  if (parentRace) {
    return { race: parentRace, subrace: normalized };
  }
  if (Object.keys(RACES).includes(normalized)) {
    return { race: normalized as RaceName };
  }
  if (companion) {
    return { race: companion.race, subrace: companion.subrace };
  }
  return { race: DEFAULT_RACE };
};

const parseBackground = (value?: string, companionName?: string): BackgroundName => {
  if (value && Object.keys(BACKGROUNDS).includes(value)) {
    return value as BackgroundName;
  }
  const companion = findCompanion(companionName);
  if (companion?.background) return companion.background;
  return DEFAULT_BACKGROUND;
};

const parseClassName = (value?: string): ClassName | null => {
  if (!value) return null;
  const match = CLASS_NAMES.find((className) => normalizeText(value).includes(normalizeText(className)));
  return match ?? null;
};

const parseClassSegments = (value?: string) => {
  if (!value) return [] as Array<{ className: ClassName; level: number; subclass?: SubclassName }>;
  const parts = value.split('/').map((part) => part.trim()).filter(Boolean);
  const segments: Array<{ className: ClassName; level: number; subclass?: SubclassName }> = [];
  for (const part of parts) {
    const tokens = part.split(/\s+/).filter(Boolean);
    const levelToken = tokens[tokens.length - 1];
    const level = Number.parseInt(levelToken, 10);
    const className = parseClassName(part);
    if (!className || Number.isNaN(level)) continue;
    const classIndex = tokens.findIndex((token) => normalizeText(token) === normalizeText(className));
    const subclass = classIndex > 0 ? tokens.slice(0, classIndex).join(' ') : undefined;
    segments.push({ className, level, ...(subclass ? { subclass } : {}) });
  }
  return segments;
};

const matchSubclassFromText = (className: ClassName, text?: string) => {
  if (!text) return undefined;
  const options = CLASSES[className].subclasses.map((entry) => entry.name);
  return options.find((subclass) => normalizeText(text).includes(normalizeText(subclass)));
};

const splitList = (value?: string) => {
  if (!value) return [] as string[];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const spellLevelToCharacterLevel = (spellLevel: number) => {
  const mapping: Record<number, number> = { 1: 1, 2: 3, 3: 5, 4: 7, 5: 9, 6: 11 };
  return mapping[spellLevel] ?? spellLevel;
};

const normalizeConsumableName = (value: string) => {
  return value
    .toLowerCase()
    .replace(/^elixirs\\s+of\\s+/i, 'elixir of ')
    .replace(/^potions\\s+of\\s+/i, 'potion of ')
    .trim();
};

const collectConsumables = (items: string[]) => {
  const potionNames = new Set(Object.values(potionsData).map((item: any) => normalizeConsumableName(item.name)));
  const elixirNames = new Set(Object.values(elixirsData).map((item: any) => normalizeConsumableName(item.name)));
  const consumables: string[] = [];
  const gear: string[] = [];
  for (const item of items) {
    const cleaned = item.trim();
    const key = normalizeConsumableName(cleaned);
    if (potionNames.has(key) || elixirNames.has(key)) {
      consumables.push(cleaned);
    } else {
      gear.push(cleaned);
    }
  }
  return { consumables, gear };
};

const splitGearItem = (value: string) => {
  const trimmed = value.trim();
  const [base, ...rest] = trimmed.split(' (');
  const name = base.split(' - ')[0].trim();
  const location = rest.length > 0 ? rest.join('(').replace(/\)$/, '').trim() : '';
  return { name, location };
};

const mapGearSlot = (slot: string | undefined): GearSlot => {
  const normalized = slot?.toLowerCase();
  switch (normalized) {
    case 'head':
    case 'headwear':
      return 'head';
    case 'cloak':
      return 'cloak';
    case 'armour':
    case 'armor':
      return 'armour';
    case 'gloves':
    case 'handwear':
      return 'gloves';
    case 'shield':
      return 'handwear';
    case 'boots':
    case 'footwear':
      return 'boots';
    case 'amulet':
      return 'amulet';
    case 'ring':
    case 'rings':
      return 'ring1';
    case 'weapon':
    case 'weapons':
    case 'secondaryhand':
    case 'secondary_hand':
      return 'melee';
    default:
      return 'melee';
  }
};

const buildGearRecommendations = (build: any) => {
  const slotMap = new Map<GearSlot, { items: string[]; notes: string[] }>();
  const consumables: string[] = [];

  const pushSlotItem = (slot: GearSlot, item: string, note?: string) => {
    if (!item) return;
    const entry = slotMap.get(slot) ?? { items: [], notes: [] };
    if (!entry.items.includes(item)) entry.items.push(item);
    if (note) entry.notes.push(note);
    slotMap.set(slot, entry);
  };

  const inferSlotFromItem = (item: string) => {
    const info = getCsvGearInfo(item);
    if (!info) return undefined;
    if (info.category === 'weapon') return 'melee' as GearSlot;
    return mapGearSlot(info.slot);
  };

  const handleItemList = (items: string[], actLabel?: string) => {
    const parsedItems = items.map(splitGearItem).filter(item => item.name);
    const { consumables: foundConsumables, gear } = collectConsumables(parsedItems.map(item => item.name));
    if (foundConsumables.length > 0) {
      consumables.push(`${actLabel ? `${actLabel}: ` : ''}${foundConsumables.join(', ')}`);
    }
    for (const item of parsedItems) {
      if (!gear.includes(item.name)) continue;
      const slot = inferSlotFromItem(item.name) ?? 'melee';
      const note = actLabel ? `${actLabel}: ${item.location || item.name}` : item.location || undefined;
      pushSlotItem(slot, item.name, note);
    }
  };

  if (build.gearByAct && Array.isArray(build.gearByAct)) {
    for (const actEntry of build.gearByAct) {
      if (!actEntry?.items) continue;
      const label = actEntry.act ? `Act ${actEntry.act}` : 'Gear';
      const items = (actEntry.items as Array<{ name?: string; notes?: string }>).map((item) => item.name).filter(Boolean) as string[];
      handleItemList(items, label);
      for (const item of actEntry.items as Array<{ name?: string; notes?: string }>) {
        if (!item?.name) continue;
        const cleaned = splitGearItem(item.name).name;
        const slot = inferSlotFromItem(cleaned) ?? 'melee';
        const note = item.notes ? `${label}: ${item.notes}` : `${label}: ${cleaned}`;
        pushSlotItem(slot, cleaned, note);
      }
    }
  }

  if (build.notableGear) {
    Object.entries(build.notableGear).forEach(([actKey, items]) => {
      if (!Array.isArray(items)) return;
      const label = actKey.replace('act', 'Act ').toUpperCase();
      handleItemList(items, label);
    });
  }

  if (build.equipment) {
    if (Array.isArray(build.equipment)) {
      handleItemList(build.equipment, 'Gear');
    } else if (build.equipment.act1 || build.equipment.act2 || build.equipment.act3) {
      const actMap: Record<string, any> = build.equipment;
      for (const [actKey, actValue] of Object.entries(actMap)) {
        if (!actValue || typeof actValue !== 'object') continue;
        const label = actKey.replace('act', 'Act ').toUpperCase();
        for (const [slotKey, items] of Object.entries(actValue as Record<string, unknown>)) {
          if (!Array.isArray(items)) continue;
          const cleanedItems = (items as string[]).map((item) => splitGearItem(item).name).filter(Boolean);
          const { consumables: foundConsumables, gear } = collectConsumables(cleanedItems);
          if (foundConsumables.length > 0) {
            consumables.push(`${label} ${slotKey}: ${foundConsumables.join(', ')}`);
          }
          const slot = mapGearSlot(slotKey);
          for (const item of gear) {
            pushSlotItem(slot, item, `${label}: ${item}`);
          }
        }
      }
    } else {
      for (const [slotKey, itemValue] of Object.entries(build.equipment)) {
        if (!itemValue) continue;
        const slot = mapGearSlot(slotKey);
        if (Array.isArray(itemValue)) {
          const cleaned = itemValue.flatMap((entry) => {
            if (typeof entry === 'string') return [splitGearItem(entry).name];
            if (entry && typeof entry === 'object' && 'name' in entry) {
              return [splitGearItem(String((entry as any).name)).name];
            }
            return [];
          });
          handleItemList(cleaned, slotKey);
          for (const item of cleaned) {
            pushSlotItem(slot, item);
          }
        } else if (typeof itemValue === 'object' && 'name' in (itemValue as any)) {
          const name = splitGearItem(String((itemValue as any).name)).name;
          pushSlotItem(slot, name);
        } else if (typeof itemValue === 'string') {
          const name = splitGearItem(itemValue).name;
          pushSlotItem(slot, name);
        }
      }
    }
  }

  if (build.finalGear && Array.isArray(build.finalGear)) {
    handleItemList(build.finalGear, 'Final Gear');
  }

  const gearRecommendations: GearRecommendation[] = Array.from(slotMap.entries()).map(([slot, entry]) => ({
    slot,
    items: entry.items,
    ...(entry.notes.length > 0 ? { notes: unique(entry.notes).join(' | ') } : {}),
  }));

  return { gearRecommendations: gearRecommendations.length > 0 ? gearRecommendations : undefined, consumables };
};

const buildLevelEntries = (levels: number, classMap: Map<number, { className: ClassName; subclass?: SubclassName }>) => {
  const classLevels = new Map<ClassName, { level: number; subclass?: SubclassName }>();
  const progression: LevelProgression[] = [];
  for (let level = 1; level <= levels; level += 1) {
    const classEntry = classMap.get(level);
    if (classEntry) {
      const previous = classLevels.get(classEntry.className) ?? { level: 0 };
      classLevels.set(classEntry.className, { level: previous.level + 1, ...(classEntry.subclass ? { subclass: classEntry.subclass } : previous.subclass ? { subclass: previous.subclass } : {}) });
    }
    const classLevelsArray = Array.from(classLevels.entries()).map(([className, info]) => ({
      class: className,
      level: info.level,
      ...(info.subclass ? { subclass: info.subclass } : {}),
    }));
    progression.push({ characterLevel: level, classLevels: classLevelsArray });
  }
  return progression;
};

const fillClassMapFromSegments = (
  classMap: Map<number, { className: ClassName; subclass?: SubclassName }>,
  classSegments: Array<{ className: ClassName; level: number; subclass?: SubclassName }>,
  maxLevel: number
) => {
  if (classSegments.length === 0) return classMap;
  let currentLevel = 1;
  for (const segment of classSegments) {
    for (let i = 0; i < segment.level; i += 1) {
      if (currentLevel > maxLevel) break;
      if (!classMap.has(currentLevel)) {
        classMap.set(currentLevel, { className: segment.className, ...(segment.subclass ? { subclass: segment.subclass } : {}) });
      }
      currentLevel += 1;
    }
  }
  return classMap;
};

const applyLevelExtras = (progression: LevelProgression[], extras: Map<number, { notes?: string[]; spells?: string[]; feat?: string }>) => {
  return progression.map((entry) => {
    const extra = extras.get(entry.characterLevel);
    if (!extra) return entry;
    const combinedNotes = extra.notes?.length ? unique(extra.notes).join(' | ') : undefined;
    const spells = extra.spells?.length ? unique(extra.spells) : undefined;
    return {
      ...entry,
      ...(combinedNotes ? { notes: combinedNotes } : {}),
      ...(spells ? { spellsLearned: spells } : {}),
      ...(extra.feat ? { feat: extra.feat } : {}),
    };
  });
};

const parseTemplateBuild = (file: any): BG3Build[] => {
  const build = file.build;
  const companionName = build.companions?.[0]?.name;
  const companion = findCompanion(companionName);
  const { race, subrace } = parseRace(build.race, build.origin, companionName);
  const background = parseBackground(build.background, companionName);
  const abilityScores = normalizeAbilityScores(build.startingAttributes, companion?.defaultAbilityScores);

  const classMap = new Map<number, { className: ClassName; subclass?: SubclassName }>();
  for (const entry of build.levelingOrder ?? []) {
    const className = entry.class?.name ? parseClassName(entry.class.name) : null;
    if (!className) continue;
    const subclass = entry.class?.subclass || matchSubclassFromText(className, entry.notes);
    classMap.set(entry.level, { className, ...(subclass ? { subclass } : {}) });
  }

  const classSegments = build.classes ? parseClassSegments(build.classes) : [];
  const maxLevel = Math.max(...(build.levelingOrder?.map((entry: any) => entry.level) ?? [12]));
  fillClassMapFromSegments(classMap, classSegments, maxLevel);
  let progression = buildLevelEntries(maxLevel, classMap);

  const extras = new Map<number, { notes?: string[]; spells?: string[]; feat?: string }>();
  for (const entry of build.levelingOrder ?? []) {
    const notes: string[] = [];
    if (entry.notes) notes.push(entry.notes);
    if (entry.features?.length) notes.push(`Features: ${entry.features.join(', ')}`);
    if (entry.skills?.length) notes.push(`Skills: ${entry.skills.join(', ')}`);
    if (entry.expertise?.length) notes.push(`Expertise: ${entry.expertise.join(', ')}`);
    if (entry.choices?.length) {
      const featChoices = entry.choices
        .filter((choice: any) => choice.type === 'feat')
        .flatMap((choice: any) => choice.options ?? []);
      if (featChoices.length > 0) notes.push(`Feat Choices: ${featChoices.join(', ')}`);
    }

    const spells = unique([...(entry.spells ?? []), ...(entry.cantrips ?? [])]);
    const feat = entry.feats?.[0];
    if (entry.feats && entry.feats.length > 1) {
      notes.push(`Feats: ${entry.feats.slice(1).join(', ')}`);
    }

    const existing = extras.get(entry.level) ?? { notes: [], spells: [] };
    existing.notes = [...(existing.notes ?? []), ...notes];
    existing.spells = [...(existing.spells ?? []), ...spells];
    if (feat) existing.feat = feat;
    extras.set(entry.level, existing);
  }

  if (build.keySpells?.length) {
    const note = `Key Spells: ${build.keySpells.map((entry: any) => entry.spells?.join(', ') || '').filter(Boolean).join(' / ')}`;
    const existing = extras.get(1) ?? { notes: [], spells: [] };
    existing.notes = [...(existing.notes ?? []), note];
    extras.set(1, existing);
  }

  const { gearRecommendations, consumables } = buildGearRecommendations(build);
  if (consumables.length > 0) {
    const existing = extras.get(1) ?? { notes: [], spells: [] };
    existing.notes = [...(existing.notes ?? []), `Consumables: ${consumables.join(' | ')}`];
    extras.set(1, existing);
  }

  progression = applyLevelExtras(progression, extras);

  const tags = new Set<string>();
  for (const cls of build.references?.classes ?? []) tags.add(cls);
  for (const subclass of build.references?.subclasses ?? []) tags.add(subclass);
  if (build.characterType) tags.add(build.characterType);
  if (companion) {
    tags.add('Companion');
    tags.add(companion.name);
  }

  const sourceLabel = file.source?.publisher || file.source?.title || file.source?.author || 'Manual';

  return [
    {
      id: slugify(build.title),
      name: build.title,
      description: build.summary || build.playstyle || 'Custom build.',
      author: file.source?.author || file.source?.publisher || 'Manual',
      ...(file.source?.url ? { sourceUrl: file.source.url } : {}),
      ...(sourceLabel ? { sourceLabel } : {}),
      race,
      ...(subrace ? { subrace } : {}),
      background,
      abilityScores,
      progression,
      ...(gearRecommendations ? { gearRecommendations } : {}),
      ...(tags.size > 0 ? { tags: Array.from(tags) } : {}),
    },
  ];
};

const parseEipggBuild = (file: any): BG3Build[] => {
  const build = file.builds?.[0];
  if (!build) return [];
  const companionName = build.name;
  const companion = findCompanion(companionName);
  const { race, subrace } = parseRace(build.race, build.origin, companionName);
  const background = parseBackground(build.background, companionName);
  const abilityScores = normalizeAbilityScores(build.startingStats, companion?.defaultAbilityScores);
  const classSegments = parseClassSegments(build.class);
  const classMap = new Map<number, { className: ClassName; subclass?: SubclassName }>();
  const primary = classSegments[0];
  const maxLevel = primary?.level ?? 12;
  for (let level = 1; level <= maxLevel; level += 1) {
    if (!primary) continue;
    classMap.set(level, { className: primary.className, subclass: build.subclass ?? primary.subclass });
  }

  let progression = buildLevelEntries(maxLevel, classMap);
  const extras = new Map<number, { notes?: string[]; spells?: string[]; feat?: string }>();

  if (build.skills?.length) {
    extras.set(1, { notes: [`Skills: ${build.skills.join(', ')}`], spells: [] });
  }

  if (build.startingCantrips?.length || build.startingSpells?.length) {
    const spells = [...(build.startingCantrips ?? []), ...(build.startingSpells ?? [])];
    const existing = extras.get(1) ?? { notes: [], spells: [] };
    existing.spells = [...(existing.spells ?? []), ...spells];
    extras.set(1, existing);
  }

  for (const feat of build.feats ?? []) {
    if (!feat?.level) continue;
    const label = feat.effect ? `${feat.name} (${feat.effect})` : feat.name;
    const existing = extras.get(feat.level) ?? { notes: [], spells: [] };
    if (feat.notes) existing.notes = [...(existing.notes ?? []), feat.notes];
    existing.feat = label;
    extras.set(feat.level, existing);
  }

  const spellBuckets: Record<number, string[]> = {};
  const addSpellBucket = (spellLevel: number, spells: string[]) => {
    if (!spellBuckets[spellLevel]) spellBuckets[spellLevel] = [];
    spellBuckets[spellLevel].push(...spells);
  };

  for (const [levelKey, spells] of Object.entries(build.domainSpells ?? {})) {
    const spellLevel = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
    if (!Number.isNaN(spellLevel)) addSpellBucket(spellLevel, spells as string[]);
  }

  for (const [levelKey, spells] of Object.entries(build.spellsByLevel ?? {})) {
    const spellLevel = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
    if (!Number.isNaN(spellLevel)) addSpellBucket(spellLevel, spells as string[]);
  }

  for (const [spellLevelStr, spells] of Object.entries(spellBuckets)) {
    const spellLevel = Number(spellLevelStr);
    const characterLevel = spellLevelToCharacterLevel(spellLevel);
    const existing = extras.get(characterLevel) ?? { notes: [], spells: [] };
    existing.spells = [...(existing.spells ?? []), ...spells];
    extras.set(characterLevel, existing);
  }

  if (build.keySpells?.length) {
    const existing = extras.get(1) ?? { notes: [], spells: [] };
    existing.notes = [...(existing.notes ?? []), `Key Spells: ${build.keySpells.join(', ')}`];
    extras.set(1, existing);
  }

  const { gearRecommendations, consumables } = buildGearRecommendations(build);
  if (consumables.length > 0) {
    const existing = extras.get(1) ?? { notes: [], spells: [] };
    existing.notes = [...(existing.notes ?? []), `Consumables: ${consumables.join(' | ')}`];
    extras.set(1, existing);
  }

  progression = applyLevelExtras(progression, extras);

  const tags = new Set<string>(['Companion', companionName]);

  return [
    {
      id: slugify(build.name),
      name: build.name,
      description: build.description || 'Companion build.',
      author: file.source || 'Manual',
      ...(file.sourceUrl ? { sourceUrl: file.sourceUrl } : {}),
      ...(file.source ? { sourceLabel: file.source } : {}),
      race,
      ...(subrace ? { subrace } : {}),
      background,
      abilityScores,
      progression,
      ...(gearRecommendations ? { gearRecommendations } : {}),
      tags: Array.from(tags),
    },
  ];
};

const parseCollectionBuilds = (file: any): BG3Build[] => {
  const builds = file.builds ?? [];
  const result: BG3Build[] = [];
  for (const build of builds) {
    if (file.source === 'eipgg') {
      result.push(...parseEipggBuild(file));
      break;
    }
    if (build.levelingOrder && build.levelingOrder[0]?.class && typeof build.levelingOrder[0].class === 'object') {
      result.push(...parseTemplateBuild({ build, source: { publisher: file.source, title: build.name } }));
      continue;
    }
    result.push(parseSimpleBuild(build, file));
  }
  return result.filter(Boolean) as BG3Build[];
};

const parseSimpleBuild = (build: any, file: any): BG3Build => {
  const companionName = build.name;
  const companion = findCompanion(companionName);
  const roleSuffix = build.role ? ` (${build.role})` : '';
  const { race, subrace } = parseRace(build.race, build.origin, companionName);
  const background = parseBackground(build.background, companionName);
  const abilityScores = normalizeAbilityScores(build.stats ?? build.startingStats, companion?.defaultAbilityScores);

  const classSegments = parseClassSegments(build.classes || build.class);
  const maxLevel = classSegments.reduce((sum, seg) => sum + seg.level, 0) || 12;

  const classMap = new Map<number, { className: ClassName; subclass?: SubclassName }>();

  if (Array.isArray(build.levelingOrder)) {
    for (const entry of build.levelingOrder) {
      const className = parseClassName(entry.class);
      if (!className) continue;
      const subclass = matchSubclassFromText(className, entry.notes) || classSegments.find(seg => seg.className === className)?.subclass;
      classMap.set(entry.level, { className, ...(subclass ? { subclass } : {}) });
    }
  } else if (Array.isArray(build.progression)) {
    for (const entry of build.progression) {
      const className = parseClassName(entry.class) || classSegments[0]?.className;
      if (!className) continue;
      const subclass = entry.feature === 'Subclass' ? entry.choice : matchSubclassFromText(className, entry.choice);
      classMap.set(entry.level, { className, ...(subclass ? { subclass } : {}) });
    }
  } else if (classSegments.length === 1) {
    for (let level = 1; level <= maxLevel; level += 1) {
      classMap.set(level, { className: classSegments[0].className, ...(build.subclass ? { subclass: build.subclass } : classSegments[0].subclass ? { subclass: classSegments[0].subclass } : {}) });
    }
  }

  let progression = buildLevelEntries(maxLevel, classMap);
  const extras = new Map<number, { notes?: string[]; spells?: string[]; feat?: string }>();

  const addNotes = (level: number, note: string) => {
    const existing = extras.get(level) ?? { notes: [], spells: [] };
    existing.notes = [...(existing.notes ?? []), note];
    extras.set(level, existing);
  };

  if (build.recommendedSkills?.length) {
    addNotes(1, `Recommended Skills: ${build.recommendedSkills.join(', ')}`);
  }
  if (build.skills?.length) {
    addNotes(1, `Skills: ${build.skills.join(', ')}`);
  }

  const appendLevelSpellList = (level: number, spells: string[]) => {
    const existing = extras.get(level) ?? { notes: [], spells: [] };
    existing.spells = [...(existing.spells ?? []), ...spells];
    extras.set(level, existing);
  };

  if (build.spells) {
    for (const [levelKey, spells] of Object.entries(build.spells)) {
      const level = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
      if (Number.isNaN(level)) continue;
      appendLevelSpellList(level, spells as string[]);
    }
  }
  if (build.cantrips) {
    for (const [levelKey, spells] of Object.entries(build.cantrips)) {
      const level = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
      if (Number.isNaN(level)) continue;
      appendLevelSpellList(level, spells as string[]);
    }
  }

  if (build.levelingOrder) {
    for (const entry of build.levelingOrder) {
      const notes: string[] = [];
      if (entry.notes) notes.push(entry.notes);
      const featMatch = entry.notes?.match(/Feat:\s*(.+)/i);
      if (featMatch) {
        const existing = extras.get(entry.level) ?? { notes: [], spells: [] };
        existing.feat = featMatch[1];
        extras.set(entry.level, existing);
      }
      if (notes.length > 0) addNotes(entry.level, notes.join(' '));
    }
  }

  if (build.progression) {
    for (const entry of build.progression) {
      if (!entry.level) continue;
      if (entry.feature === 'Feat' && entry.choice) {
        const existing = extras.get(entry.level) ?? { notes: [], spells: [] };
        existing.feat = entry.choice;
        extras.set(entry.level, existing);
        continue;
      }
      if ((entry.feature === 'Spells' || entry.feature === 'Cantrips') && entry.choice) {
        appendLevelSpellList(entry.level, splitList(entry.choice));
        continue;
      }
      if (entry.feature === 'Subclass' && entry.choice) {
        addNotes(entry.level, `Subclass: ${entry.choice}`);
        continue;
      }
      if (entry.features?.length) {
        const featureNames = entry.features
          .map((feature: any) => feature.name || feature)
          .filter(Boolean);
        if (featureNames.length > 0) {
          addNotes(entry.level, `Features: ${featureNames.join(', ')}`);
        }
      }
      if (entry.feature && entry.choice) {
        addNotes(entry.level, `${entry.feature}: ${entry.choice}`);
      } else if (entry.feature) {
        addNotes(entry.level, entry.feature);
      }
      if (entry.notes) {
        addNotes(entry.level, entry.notes);
      }
    }
  }

  if (build.expertise) {
    if (Array.isArray(build.expertise)) {
      addNotes(1, `Expertise: ${build.expertise.join(', ')}`);
    } else {
      for (const [levelKey, skills] of Object.entries(build.expertise)) {
        const level = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
        if (Number.isNaN(level)) continue;
        addNotes(level, `Expertise: ${(skills as string[]).join(', ')}`);
      }
    }
  }

  if (build.invocations) {
    for (const [levelKey, invocations] of Object.entries(build.invocations)) {
      const level = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
      if (Number.isNaN(level)) continue;
      addNotes(level, `Invocations: ${(invocations as string[]).join(', ')}`);
    }
  }

  if (build.maneuvers) {
    for (const [levelKey, maneuvers] of Object.entries(build.maneuvers)) {
      const level = Number.parseInt(levelKey.replace(/\D/g, ''), 10);
      if (Number.isNaN(level)) continue;
      addNotes(level, `Maneuvers: ${(maneuvers as string[]).join(', ')}`);
    }
  }

  if (build.pactBoon) {
    addNotes(3, `Pact Boon: ${build.pactBoon}`);
  }

  if (build.fightingStyle) {
    addNotes(2, `Fighting Style: ${build.fightingStyle}`);
  }

  if (build.features?.length) {
    addNotes(1, `Features: ${build.features.join(', ')}`);
  }

  if (build.keySpells) {
    if (Array.isArray(build.keySpells)) {
      addNotes(1, `Key Spells: ${build.keySpells.join(', ')}`);
    } else if (typeof build.keySpells === 'object') {
      const entries = Object.entries(build.keySpells as Record<string, string[]>)
        .map(([label, spells]) => `${label}: ${spells.join(', ')}`);
      if (entries.length > 0) addNotes(1, `Key Spells: ${entries.join(' | ')}`);
    }
  }

  const { gearRecommendations, consumables } = buildGearRecommendations(build);
  if (consumables.length > 0) {
    addNotes(1, `Consumables: ${consumables.join(' | ')}`);
  }

  progression = applyLevelExtras(progression, extras);

  const tags = new Set<string>();
  if (file.source) tags.add(file.source);
  if (file.type) tags.add(file.type);
  if (companion) {
    tags.add('Companion');
    tags.add(companion.name);
  }

  return {
    id: slugify(`${build.name}${build.role ? `-${build.role}` : ''}-${file.source || 'build'}`),
    name: `${build.name}${roleSuffix}`,
    description: build.description || 'Build notes.',
    author: file.source || 'Manual',
    ...(file.sourceUrl ? { sourceUrl: file.sourceUrl } : {}),
    ...(file.source ? { sourceLabel: file.source } : {}),
    race,
    ...(subrace ? { subrace } : {}),
    background,
    abilityScores,
    progression,
    ...(gearRecommendations ? { gearRecommendations } : {}),
    ...(tags.size > 0 ? { tags: Array.from(tags) } : {}),
  };
};

const SOURCE_FILES = [
  tavMrKnowItAll,
  tavOlympicShotputter,
  tavPaladinBatman,
  tavPcGamingMulti,
  tavSneakyAssassin,
  tavSwashbuckling,
  originEipggShadowheart,
  originGiantKarlach,
  originRedditMultiClass,
  originRedditSingleClass,
];

export const SHEET_COMMUNITY_BUILDS: BG3Build[] = SOURCE_FILES.flatMap((file) => {
  if (file?.build) return parseTemplateBuild(file);
  if (file?.builds) return parseCollectionBuilds(file);
  return [];
});
