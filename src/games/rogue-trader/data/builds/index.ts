import type { BuildGuide, CompanionName } from '../../types';
import { ABELARD_BUILDS } from './abelard';
import { IDIRA_BUILDS } from './idira';
import { ARGENTA_BUILDS } from './argenta';
import { CASSIA_BUILDS } from './cassia';
import { PASQAL_BUILDS } from './pasqal';
import { HEINRIX_BUILDS } from './heinrix';
import { JAE_BUILDS } from './jae';
import { YRLIET_BUILDS } from './yrliet';
import { ULFAR_BUILDS } from './ulfar';
import { MARAZHAI_BUILDS } from './marazhai';
import { KIBELLAH_BUILDS } from './kibellah';
import { SOLOMORNE_BUILDS } from './solomorne';
import { WINTERSCALE_BUILDS } from './winterscale';
import { URALON_BUILDS } from './uralon';
import { INCENDIA_BUILDS } from './incendia';
import { ROGUE_TRADER_BUILDS } from './roguetrader';

// All available build guides
const BUILD_SOURCE_URL =
  'https://docs.google.com/spreadsheets/d/1rskX4sYcNm6Wqt4rtm8EQqRR4__yrEuxCEzjwoKlHOY/edit?gid=1688447117#gid=1688447117';

export const ALL_BUILDS: BuildGuide[] = [
  ...ABELARD_BUILDS,
  ...IDIRA_BUILDS,
  ...ARGENTA_BUILDS,
  ...CASSIA_BUILDS,
  ...PASQAL_BUILDS,
  ...HEINRIX_BUILDS,
  ...JAE_BUILDS,
  ...YRLIET_BUILDS,
  ...ULFAR_BUILDS,
  ...MARAZHAI_BUILDS,
  ...KIBELLAH_BUILDS,
  ...SOLOMORNE_BUILDS,
  ...WINTERSCALE_BUILDS,
  ...URALON_BUILDS,
  ...INCENDIA_BUILDS,
  ...ROGUE_TRADER_BUILDS,
].map((build) => ({
  ...build,
  sourceUrl: build.sourceUrl ?? BUILD_SOURCE_URL,
  sourceLabel: build.sourceLabel ?? 'Build Source',
}));

// Get builds for a specific companion
export function getBuildsForCompanion(companion: CompanionName): BuildGuide[] {
  return ALL_BUILDS.filter((build) => build.companion === companion);
}

// Get a specific build by ID
export function getBuildById(id: string): BuildGuide | undefined {
  return ALL_BUILDS.find((build) => build.id === id);
}

// Get all companions that have builds
export function getCompanionsWithBuilds(): CompanionName[] {
  const companions = new Set(ALL_BUILDS.map((build) => build.companion));
  return Array.from(companions);
}
