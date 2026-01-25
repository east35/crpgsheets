import type { BuildGuide, CompanionName } from '../../types';
import { ABELARD_BUILDS } from './abelard';

// All available build guides
export const ALL_BUILDS: BuildGuide[] = [
  ...ABELARD_BUILDS,
  // Add more companion builds here as they're added
];

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
