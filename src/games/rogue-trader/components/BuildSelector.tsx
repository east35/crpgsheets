import type { BuildGuide } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { COMPANIONS } from '../data/companions';
import { getBuildsForCompanion, getCompanionsWithBuilds } from '../data/builds';
import './BuildSelector.css';

interface BuildSelectorProps {
  onSelectBuild: (build: BuildGuide) => void;
}

export function BuildSelector({ onSelectBuild }: BuildSelectorProps) {
  const companionsWithBuilds = getCompanionsWithBuilds();

  // Group builds by companion
  const buildsByCompanion = companionsWithBuilds.map((companion) => ({
    companion,
    info: COMPANIONS[companion],
    builds: getBuildsForCompanion(companion),
  }));

  return (
    <div className="build-selector">
      <h2>Select a Build Guide</h2>
      <p className="subtitle">
        Choose a companion and build to view the level-by-level progression guide
      </p>

      <div className="companion-list">
        {buildsByCompanion.map(({ companion, info, builds }) => (
          <div key={companion} className="companion-section">
            <div className="companion-header">
              <h3>{info.fullName}</h3>
              <span className="companion-role">{info.role}</span>
            </div>

            <div className="builds-grid">
              {builds.map((build) => (
                <button
                  key={build.id}
                  className="build-card"
                  onClick={() => onSelectBuild(build)}
                >
                  <div className="build-name">{build.buildName}</div>
                  <div className="build-path">
                    {ARCHETYPE_DISPLAY_NAMES[build.archetypePath.base]} →{' '}
                    {ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced]} →{' '}
                    {ARCHETYPE_DISPLAY_NAMES[build.archetypePath.exemplar]}
                  </div>
                  {build.description && (
                    <div className="build-desc">{build.description.slice(0, 80)}...</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {companionsWithBuilds.length === 0 && (
        <div className="no-builds">
          <p>No build guides available yet.</p>
        </div>
      )}

      <div className="coming-soon">
        <h3>Coming Soon</h3>
        <p>Builds for other companions will be added. You can also import custom builds.</p>
        <div className="companion-tags">
          {Object.values(COMPANIONS)
            .filter((c) => !companionsWithBuilds.includes(c.name))
            .map((c) => (
              <span key={c.name} className="companion-tag">
                {c.fullName}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
