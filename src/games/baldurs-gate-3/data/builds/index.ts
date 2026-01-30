import type { BG3Build } from '../../types';
import { SHEET_COMMUNITY_BUILDS } from './sheet-builds';

export const COMMUNITY_BUILDS: BG3Build[] = SHEET_COMMUNITY_BUILDS;

export function getBuild(id: string): BG3Build | undefined {
  return COMMUNITY_BUILDS.find(b => b.id === id);
}

export function getAllBuilds(): BG3Build[] {
  return COMMUNITY_BUILDS;
}

export function getBuildsByTag(tag: string): BG3Build[] {
  return COMMUNITY_BUILDS.filter(b => b.tags?.includes(tag));
}

export function getBuildsByDifficulty(difficulty: BG3Build['difficulty']): BG3Build[] {
  return COMMUNITY_BUILDS.filter(b => b.difficulty === difficulty);
}
