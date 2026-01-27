import type { BG3Build, CompanionName } from '../types';
import type { CharacterBuild } from '../../../types';
import { COMPANIONS } from '../data/companions';
import { PartyBar, type PartyMember } from '../../../components/PartyBar';

interface TrackedBG3Build extends CharacterBuild {
  data: {
    buildId: string;
    currentLevel: number;
  };
}

interface MyBuildsPanelProps {
  trackedBuilds: TrackedBG3Build[];
  currentBuildId: string | null;
  onSelectBuild: (buildId: string, level: number) => void;
  onDeleteBuild: (id: string) => void;
  getBuildById: (id: string) => BG3Build | undefined;
}

export function getCompanionFromBuild(build: BG3Build): CompanionName | null {
  const companionNames = Object.keys(COMPANIONS) as CompanionName[];
  for (const name of companionNames) {
    if (build.tags?.includes(name) || build.tags?.includes('Companion') && build.name.includes(name)) {
      return name;
    }
  }
  for (const name of companionNames) {
    if (build.name.startsWith(name)) {
      return name;
    }
  }
  return null;
}

export function getAvatarForBuild(build: BG3Build): string | null {
  const companion = getCompanionFromBuild(build);
  if (companion && COMPANIONS[companion]) {
    return COMPANIONS[companion].portraitUrl;
  }
  return null;
}

export function MyBuildsPanel({
  trackedBuilds,
  currentBuildId,
  onSelectBuild,
  onDeleteBuild,
  getBuildById,
}: MyBuildsPanelProps) {
  const members: PartyMember[] = [];
  
  for (const tracked of trackedBuilds) {
    const build = getBuildById(tracked.data.buildId);
    if (build) {
      members.push({
        id: tracked.id,
        buildId: tracked.data.buildId,
        name: build.name,
        level: tracked.data.currentLevel || 1,
        avatarUrl: getAvatarForBuild(build),
      });
    }
  }

  return (
    <PartyBar
      members={members}
      currentBuildId={currentBuildId}
      onSelectMember={onSelectBuild}
      onDeleteMember={onDeleteBuild}
    />
  );
}
