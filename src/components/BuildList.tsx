import type { CharacterBuild } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../games/rogue-trader/types';
import type { Archetype } from '../games/rogue-trader/types';
import { COMPANIONS as RT_COMPANIONS } from '../games/rogue-trader/data/companions';
import { COMPANIONS as BG3_COMPANIONS } from '../games/baldurs-gate-3/data/companions';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import './BuildList.css';

interface TrackedBuildData {
  guideId?: string;
  buildId?: string;
  companion?: string;
  buildName?: string;
  customName?: string;
  currentLevel?: number;
  isCustom?: boolean;
  archetypePath?: {
    base: string;
    advanced: string;
    exemplar: string;
  };
}

function getAvatarForTrackedBuild(data: TrackedBuildData | undefined, gameId: string): string | null {
  if (!data?.companion) return null;
  
  if (gameId === 'rogue-trader') {
    return RT_COMPANIONS[data.companion as keyof typeof RT_COMPANIONS]?.portraitUrl || null;
  }
  if (gameId === 'baldurs-gate-3') {
    return BG3_COMPANIONS[data.companion as keyof typeof BG3_COMPANIONS]?.portraitUrl || null;
  }
  return null;
}

function getCharacterName(data: TrackedBuildData | undefined): string {
  // Use custom name if available (for protagonist builds)
  if (data?.customName) return data.customName;
  if (!data?.companion) return 'Tav';
  // For RT, RogueTrader is the player character
  if (data.companion === 'RogueTrader') return 'Rogue Trader';
  return data.companion;
}

function getBuildDisplayName(build: CharacterBuild, data: TrackedBuildData | undefined, characterName: string): string {
  if (data?.buildName) return data.buildName;
  if (build.gameId === 'rogue-trader' && build.name.startsWith(`${characterName}: `)) {
    return build.name.slice(characterName.length + 2);
  }
  return build.name;
}

interface BuildListProps {
  builds: CharacterBuild[];
  onSelectBuild: (build: CharacterBuild) => void;
  onDeleteBuild: (id: string) => void;
}

function BuildCard({ build, onSelect, onDelete }: { 
  build: CharacterBuild; 
  onSelect: () => void; 
  onDelete: () => void;
}) {
  const data = build.data as TrackedBuildData | undefined;
  const currentLevel = data?.currentLevel || 1;
  const isCustom = data?.isCustom;
  const characterName = getCharacterName(data);
  const buildDisplayName = getBuildDisplayName(build, data, characterName);
  const defaultAvatar = getAvatarForTrackedBuild(data, build.gameId);
  
  // Check for custom avatar
  const customAvatar = useLiveQuery(
    () => db.customAvatars.where('buildId').equals(data?.buildId || data?.guideId || '').first(),
    [data?.buildId, data?.guideId]
  );
  
  const avatarUrl = customAvatar?.imageData || defaultAvatar;
  
  // Determine max level based on game
  const maxLevel = build.gameId === 'rogue-trader' ? 55 : 12;
  const progressPercent = (currentLevel / maxLevel) * 100;

  return (
    <div className="party-member-card" onClick={onSelect}>
      <div className="party-member-avatar">
        {avatarUrl ? (
          <img src={avatarUrl} alt={characterName} />
        ) : (
          <div className="avatar-placeholder">{characterName.charAt(0)}</div>
        )}
      </div>
      <div className="party-member-info">
        <div className="party-member-header">
          <span className="party-member-name">{characterName}</span>
          <span className="party-member-level">Lv {currentLevel}</span>
        </div>
        <div className="party-member-build">{buildDisplayName}</div>
        {data?.archetypePath && (
          <div className="party-member-path">
            <span className="archetype base">
              {ARCHETYPE_DISPLAY_NAMES[data.archetypePath.base as Archetype] || data.archetypePath.base}
            </span>
            <span className="arrow">→</span>
            <span className="archetype advanced">
              {ARCHETYPE_DISPLAY_NAMES[data.archetypePath.advanced as Archetype] || data.archetypePath.advanced}
            </span>
          </div>
        )}
        <div className="party-member-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="progress-label">{currentLevel} / {maxLevel}</span>
        </div>
        {isCustom && <span className="build-tag custom">Custom</span>}
      </div>
      <button
        className="party-member-remove"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Remove from party"
      >
        ×
      </button>
    </div>
  );
}

export function BuildList({ builds, onSelectBuild, onDeleteBuild }: BuildListProps) {
  if (builds.length === 0) {
    return (
      <div className="build-list-empty">
        <p>No builds yet. Track a build from the Companion Builds tab or create a custom build.</p>
      </div>
    );
  }

  // Sort builds: player character first, then by name
  const sortedBuilds = [...builds].sort((a, b) => {
    const aData = a.data as TrackedBuildData | undefined;
    const bData = b.data as TrackedBuildData | undefined;
    const aIsPlayer = aData?.companion === 'RogueTrader' || !aData?.companion;
    const bIsPlayer = bData?.companion === 'RogueTrader' || !bData?.companion;
    if (aIsPlayer && !bIsPlayer) return -1;
    if (!aIsPlayer && bIsPlayer) return 1;
    return (aData?.companion || '').localeCompare(bData?.companion || '');
  });

  return (
    <div className="party-list">
      {sortedBuilds.map((build) => (
        <BuildCard
          key={build.id}
          build={build}
          onSelect={() => onSelectBuild(build)}
          onDelete={() => onDeleteBuild(build.id)}
        />
      ))}
    </div>
  );
}
