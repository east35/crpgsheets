import type { CharacterBuild } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../games/rogue-trader/types';
import type { Archetype } from '../games/rogue-trader/types';
import './BuildList.css';

interface TrackedBuildData {
  guideId?: string;
  companion?: string;
  buildName?: string;
  currentLevel?: number;
  isCustom?: boolean;
  archetypePath?: {
    base: string;
    advanced: string;
    exemplar: string;
  };
}

interface BuildListProps {
  builds: CharacterBuild[];
  onSelectBuild: (build: CharacterBuild) => void;
  onDeleteBuild: (id: string) => void;
}

export function BuildList({ builds, onSelectBuild, onDeleteBuild }: BuildListProps) {
  if (builds.length === 0) {
    return (
      <div className="build-list-empty">
        <p>No builds yet. Track a build from the Companion Builds tab or create a custom build.</p>
      </div>
    );
  }

  // Sort builds so RogueTrader comes first
  const sortedBuilds = [...builds].sort((a, b) => {
    const aData = a.data as TrackedBuildData | undefined;
    const bData = b.data as TrackedBuildData | undefined;
    const aIsRT = aData?.companion === 'RogueTrader';
    const bIsRT = bData?.companion === 'RogueTrader';
    if (aIsRT && !bIsRT) return -1;
    if (!aIsRT && bIsRT) return 1;
    return 0;
  });

  return (
    <div className="build-grid">
      {sortedBuilds.map((build) => {
        const data = build.data as TrackedBuildData | undefined;
        const currentLevel = data?.currentLevel || 1;
        const isCustom = data?.isCustom;

        return (
          <div key={build.id} className="my-build-card" onClick={() => onSelectBuild(build)}>
            <div className="build-card-header">
              <span className="build-level">Lv {currentLevel}</span>
              {isCustom && <span className="build-tag custom">Custom</span>}
            </div>
            <h3 className="build-card-name">{build.name}</h3>
            {data?.archetypePath && (
              <div className="build-card-path">
                <span className="archetype base">
                  {ARCHETYPE_DISPLAY_NAMES[data.archetypePath.base as Archetype] || data.archetypePath.base}
                </span>
                <span className="arrow">→</span>
                <span className="archetype advanced">
                  {ARCHETYPE_DISPLAY_NAMES[data.archetypePath.advanced as Archetype] || data.archetypePath.advanced}
                </span>
              </div>
            )}
            <button
              className="build-remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBuild(build.id);
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
