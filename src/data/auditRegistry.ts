import actions from '../games/baldurs-gate-3/data/actions.json';
import areas from '../games/baldurs-gate-3/data/areas.json';
import arrows from '../games/baldurs-gate-3/data/arrows.json';
import classes from '../games/baldurs-gate-3/data/classes.json';
import conditions from '../games/baldurs-gate-3/data/conditions.json';
import creatureStats from '../games/baldurs-gate-3/data/creature_stats.json';
import creatures from '../games/baldurs-gate-3/data/creatures.json';
import elixirs from '../games/baldurs-gate-3/data/elixirs.json';
import feats from '../games/baldurs-gate-3/data/feats.json';
import features from '../games/baldurs-gate-3/data/features.json';
import grenades from '../games/baldurs-gate-3/data/grenades.json';
import missingImages from '../games/baldurs-gate-3/data/missing_images.json';
import buildSources from '../games/baldurs-gate-3/data/build_sources.json';
import buildCandidates from '../games/baldurs-gate-3/data/build_candidates.json';
import permanentBonuses from '../games/baldurs-gate-3/data/permanent_bonuses.json';
import potions from '../games/baldurs-gate-3/data/potions.json';
import races from '../games/baldurs-gate-3/data/races.json';
import spells from '../games/baldurs-gate-3/data/spells.json';
import weapons from '../games/baldurs-gate-3/data/weapons.json';
import wearables from '../games/baldurs-gate-3/data/wearables.json';
import { COMPANIONS } from '../games/rogue-trader/data/companions';
import { KEYWORD_DATA } from '../games/rogue-trader/data/character';
import { ALL_BUILDS } from '../games/rogue-trader/data/builds';
import { GEAR_DATA } from '../games/rogue-trader/data/gear';
import helmetItems from '../games/rogue-trader/data/gear/helmets.json';
import { WIKI_TALENTS, WIKI_ABILITIES } from '../games/rogue-trader/data/talents';
import {
  SOURCE_TO_ARCHETYPE,
  ARCHETYPE_PROGRESSION,
  COMPANION_DEFAULT_ARCHETYPES,
  COMPANION_START_LEVELS,
} from '../games/rogue-trader/data/archetypes';

export interface AuditDataset {
  id: string;
  label: string;
  data: Record<string, Record<string, unknown>>;
}

const missingImagesRecord = Object.fromEntries(
  (missingImages as Array<{ dataset: string; name: string; reason: string }>).map((entry, index) => [
    `${entry.dataset}:${entry.name}:${index}`,
    entry,
  ])
);

const BG3_DATASETS: AuditDataset[] = [
  { id: 'build-sources', label: 'Build Sources', data: Object.fromEntries((buildSources as Array<Record<string, unknown>>).map((entry, index) => [`source_${index}`, entry])) },
  { id: 'build-candidates', label: 'Build Candidates', data: Object.fromEntries((buildCandidates as Array<Record<string, unknown>>).map((entry, index) => [`candidate_${index}`, entry])) },
  { id: 'spells', label: 'Spells', data: spells },
  { id: 'actions', label: 'Actions', data: actions },
  { id: 'weapons', label: 'Weapons', data: weapons },
  { id: 'wearables', label: 'Wearables', data: wearables },
  { id: 'features', label: 'Features', data: features },
  { id: 'conditions', label: 'Conditions', data: conditions },
  { id: 'classes', label: 'Classes', data: classes },
  { id: 'races', label: 'Races', data: races },
  { id: 'creatures', label: 'Creatures', data: creatures },
  { id: 'creature-stats', label: 'Creature Stats', data: creatureStats },
  { id: 'areas', label: 'Areas', data: areas },
  { id: 'arrows', label: 'Arrows', data: arrows },
  { id: 'elixirs', label: 'Elixirs', data: elixirs },
  { id: 'grenades', label: 'Grenades', data: grenades },
  { id: 'permanent-bonuses', label: 'Permanent Bonuses', data: permanentBonuses },
  { id: 'potions', label: 'Potions', data: potions },
  { id: 'feats', label: 'Feats', data: feats },
  { id: 'missing-images', label: 'Missing Images', data: missingImagesRecord },
];

const helmetRecord = Object.fromEntries(
  (helmetItems as Array<Record<string, unknown>>).map((entry, index) => {
    const images = entry.images as string[] | undefined;
    return [`helmet_${index}`, { image: images?.[0], ...entry }];
  })
);

const gearWikiRecord = Object.fromEntries(
  Object.entries(GEAR_DATA).map(([key, entry]) => [
    key,
    {
      image: entry.imageRemote ?? entry.imageLocal,
      ...entry,
    },
  ])
);

const buildSourceRecord = (() => {
  const sources = new Map<string, { sourceUrl: string; sourceLabel?: string; count: number; companions: Set<string> }>();
  for (const build of ALL_BUILDS) {
    const sourceUrl = build.sourceUrl ?? 'unknown';
    const existing = sources.get(sourceUrl);
    if (existing) {
      existing.count += 1;
      if (build.companion) existing.companions.add(build.companion);
    } else {
      sources.set(sourceUrl, {
        sourceUrl,
        sourceLabel: build.sourceLabel,
        count: 1,
        companions: new Set(build.companion ? [build.companion] : []),
      });
    }
  }
  return Object.fromEntries(
    Array.from(sources.entries()).map(([_key, value], index) => [
      `source_${index}`,
      {
        sourceUrl: value.sourceUrl,
        sourceLabel: value.sourceLabel,
        count: value.count,
        companions: Array.from(value.companions),
      },
    ])
  );
})();

const archetypeSourceRecord = Object.fromEntries(
  Object.entries(SOURCE_TO_ARCHETYPE).map(([key, value]) => [
    key,
    { name: key, archetype: value },
  ])
);

const archetypeProgressionRecord = Object.fromEntries(
  Object.entries(ARCHETYPE_PROGRESSION).map(([key, value]) => [
    key,
    { baseArchetype: key, advanced: value },
  ])
);

const companionDefaultsRecord = Object.fromEntries(
  Object.entries(COMPANION_DEFAULT_ARCHETYPES).map(([key, value]) => [
    key,
    { companion: key, archetype: value },
  ])
);

const companionStartLevelsRecord = Object.fromEntries(
  Object.entries(COMPANION_START_LEVELS).map(([key, value]) => [
    key,
    { companion: key, level: value },
  ])
);

const RT_DATASETS: AuditDataset[] = [
  { id: 'companions', label: 'Companions', data: COMPANIONS as unknown as Record<string, Record<string, unknown>> },
  { id: 'build-sources', label: 'Build Sources', data: buildSourceRecord },
  { id: 'builds', label: 'Builds', data: Object.fromEntries(ALL_BUILDS.map((entry, index) => [entry.id ?? `build_${index}`, entry as unknown as Record<string, unknown>])) },
  { id: 'character-keywords', label: 'Character Keywords', data: KEYWORD_DATA as unknown as Record<string, Record<string, unknown>> },
  { id: 'talents', label: 'Talents', data: WIKI_TALENTS as unknown as Record<string, Record<string, unknown>> },
  { id: 'abilities', label: 'Abilities', data: WIKI_ABILITIES as unknown as Record<string, Record<string, unknown>> },
  { id: 'gear', label: 'Gear (Wiki)', data: gearWikiRecord },
  { id: 'helmets', label: 'Helmets', data: helmetRecord },
  { id: 'archetype-sources', label: 'Archetype Sources', data: archetypeSourceRecord },
  { id: 'archetype-progression', label: 'Archetype Progression', data: archetypeProgressionRecord },
  { id: 'companion-archetypes', label: 'Companion Archetypes', data: companionDefaultsRecord },
  { id: 'companion-start-levels', label: 'Companion Start Levels', data: companionStartLevelsRecord },
];

const DATASETS_BY_GAME: Record<string, AuditDataset[]> = {
  'baldurs-gate-3': BG3_DATASETS,
  'rogue-trader': RT_DATASETS,
};

export function getDatasetsForGame(gameId: string): AuditDataset[] {
  return DATASETS_BY_GAME[gameId] ?? [];
}
