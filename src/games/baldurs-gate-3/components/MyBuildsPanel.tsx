import type { BG3Build, CompanionName } from '../types';
import type { CharacterBuild } from '../../../types';
import { COMPANIONS } from '../data/companions';
import { PartyBar, type PartyMember } from '../../../components/PartyBar';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db';

interface TrackedBG3Build extends CharacterBuild {
  data: {
    buildId: string;
    currentLevel: number;
    customName?: string;
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
  // Fetch all custom avatars for tracked builds
  const buildIds = trackedBuilds.map(t => t.data.buildId);
  const customAvatars = useLiveQuery(
    () => db.customAvatars.where('buildId').anyOf(buildIds).toArray(),
    [buildIds.join(',')]
  );
  
  const getCustomAvatar = (buildId: string) => {
    return customAvatars?.find(a => a.buildId === buildId)?.imageData || null;
  };

  const members: PartyMember[] = [];
  
  for (const tracked of trackedBuilds) {
    const build = getBuildById(tracked.data.buildId);
    if (build) {
      const companion = getCompanionFromBuild(build);
      const isPlayer = !companion;
      // Use custom name for player character, companion name, or build name as fallback
      const displayName = isPlayer
        ? (tracked.data.customName || 'Tav')
        : (companion || build.name);
      members.push({
        id: tracked.id,
        buildId: tracked.data.buildId,
        name: displayName,
        level: tracked.data.currentLevel || 1,
        avatarUrl: getAvatarForBuild(build),
        isPlayerCharacter: isPlayer,
        customAvatarUrl: getCustomAvatar(tracked.data.buildId),
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
