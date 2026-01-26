import type { BuildGuide, CompanionName } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { COMPANIONS } from '../data/companions';
import { getBuildsForCompanion, getCompanionsWithBuilds } from '../data/builds';
import './BuildSelector.css';

export type BuildType = 'companion' | 'rogueTrader';

interface BuildSelectorProps {
  onSelectBuild: (build: BuildGuide) => void;
  onCreateCustomBuild?: (companion: CompanionName) => void;
  buildType: BuildType;
}

export function BuildSelector({ onSelectBuild, onCreateCustomBuild, buildType }: BuildSelectorProps) {
  const allCompanionsWithBuilds = getCompanionsWithBuilds();
  
  // Filter based on build type
  const companionsWithBuilds: CompanionName[] = buildType === 'companion'
    ? allCompanionsWithBuilds.filter((c): c is Exclude<CompanionName, 'RogueTrader'> => c !== 'RogueTrader')
    : allCompanionsWithBuilds.filter((c): c is 'RogueTrader' => c === 'RogueTrader');

  // Get companions without builds for "coming soon" section
  const allCompanions = Object.values(COMPANIONS);
  const companionsWithoutBuilds = buildType === 'companion'
    ? allCompanions.filter((c) => c.name !== 'RogueTrader' && !companionsWithBuilds.includes(c.name))
    : [];

  // Group builds by companion
  const buildsByCompanion = companionsWithBuilds.map((companion) => ({
    companion,
    info: COMPANIONS[companion],
    builds: getBuildsForCompanion(companion),
  }));

  const title = buildType === 'companion' ? 'Companion Builds' : 'Rogue Trader Builds';
  const subtitle = buildType === 'companion'
    ? 'Choose a companion and build to view the level-by-level progression guide'
    : 'Choose a build for your Rogue Trader protagonist';

  return (
    <div className="build-selector">
      <h2>{title}</h2>
      <p className="subtitle">{subtitle}</p>
      <p className="build-credit">
        Builds sourced from{' '}
        <a 
          href="https://docs.google.com/spreadsheets/d/1rskX4sYcNm6Wqt4rtm8EQqRR4__yrEuxCEzjwoKlHOY/edit?gid=1688447117#gid=1688447117" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Community Rogue Trader Unfair Builds & Resources
        </a>
      </p>

      <div className="companion-list">
        {buildsByCompanion.map(({ companion, info, builds }) => (
          <div
            key={companion}
            className="companion-section"
            style={
              info.portraitUrl
                ? { '--companion-bg': `url(${info.portraitUrl})` } as React.CSSProperties
                : undefined
            }
          >
            <div className="companion-header">
              <div className="companion-title-row">
                {info.portraitUrl && (
                  <img 
                    src={info.portraitUrl} 
                    alt={info.fullName} 
                    className="companion-portrait"
                  />
                )}
                <div className="companion-title-info">
                  <h3>{info.fullName}</h3>
                  <span className="companion-role">{info.role}</span>
                </div>
              </div>
              <p className="companion-bio">{info.bio}</p>
              <blockquote className="companion-quote">"{info.quote}"</blockquote>
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
                    <span className="archetype base">
                      {ARCHETYPE_DISPLAY_NAMES[build.archetypePath.base]}
                    </span>
                    <span className="arrow">→</span>
                    <span className="archetype advanced">
                      {ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced]}
                    </span>
                    <span className="arrow">→</span>
                    <span className="archetype exemplar">
                      {ARCHETYPE_DISPLAY_NAMES[build.archetypePath.exemplar]}
                    </span>
                  </div>
                  {build.description && (
                    <div className="build-desc">{build.description}</div>
                  )}
                </button>
              ))}
              {onCreateCustomBuild && (
                <button
                  className="build-card custom-build-card"
                  onClick={() => onCreateCustomBuild(companion)}
                >
                  <div className="build-name">+ Custom Build</div>
                  <div className="build-desc">Create your own build for {info.fullName}</div>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {companionsWithBuilds.length === 0 && (
        <div className="no-builds">
          <p>No build guides available yet.</p>
        </div>
      )}

      {companionsWithoutBuilds.length > 0 && (
        <div className="coming-soon">
          <h3>Coming Soon</h3>
          <p>Builds for other companions will be added.</p>
          <div className="companion-tags">
            {companionsWithoutBuilds.map((c) => (
              <span key={c.name} className="companion-tag">
                {c.fullName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
