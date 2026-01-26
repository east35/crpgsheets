import type { BG3Build } from '../types';
import { getAllBuilds } from '../data/builds';
import { getAllCompanions } from '../data/companions';
import './BuildSelector.css';

interface BuildSelectorProps {
  onSelectBuild: (build: BG3Build) => void;
  buildType?: 'all' | 'companion';
}

const DIFFICULTY_ORDER: Record<string, number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

export function BuildSelector({ onSelectBuild, buildType = 'all' }: BuildSelectorProps) {
  const allBuilds = getAllBuilds();
  const allCompanions = getAllCompanions();
  
  // Format class levels for display
  const formatClassLevels = (build: BG3Build) => {
    const finalLevel = build.progression[build.progression.length - 1];
    if (!finalLevel) return '';
    
    return finalLevel.classLevels.map(cl => {
      const subclassStr = cl.subclass ? ` (${cl.subclass})` : '';
      return `${cl.class} ${cl.level}${subclassStr}`;
    }).join(' / ');
  };

  if (buildType === 'companion') {
    // Group builds by companion
    const companionBuilds = allCompanions.map(companion => {
      const builds = allBuilds
        .filter(b => b.tags?.includes('Companion') && b.tags?.includes(companion.name))
        .sort((a, b) => {
          const aOrder = DIFFICULTY_ORDER[a.difficulty || 'Intermediate'] || 2;
          const bOrder = DIFFICULTY_ORDER[b.difficulty || 'Intermediate'] || 2;
          return aOrder - bOrder;
        });
      return { companion, builds };
    }).filter(({ builds }) => builds.length > 0);

    return (
      <div className="build-selector bg3">
        <h2>Companion Builds</h2>
        <p className="build-credit">
          Choose a companion to view optimized build guides
        </p>

        <div className="companion-list">
          {companionBuilds.map(({ companion, builds }) => (
            <div
              key={companion.name}
              className="companion-section"
              style={
                companion.portraitUrl
                  ? { '--companion-bg': `url(${companion.portraitUrl})` } as React.CSSProperties
                  : undefined
              }
            >
              <div className="companion-header">
                <div className="companion-title-row">
                  {companion.portraitUrl && (
                    <img 
                      src={companion.portraitUrl} 
                      alt={companion.fullName} 
                      className="companion-portrait"
                    />
                  )}
                  <div className="companion-title-info">
                    <h3>{companion.fullName}</h3>
                    <span className="companion-role">{companion.role}</span>
                  </div>
                </div>
                <p className="companion-bio">{companion.bio}</p>
                <blockquote className="companion-quote">"{companion.quote}"</blockquote>
              </div>

              <div className="builds-grid">
                {builds.map((build) => (
                  <button
                    key={build.id}
                    className="build-card"
                    onClick={() => onSelectBuild(build)}
                  >
                    <div className="build-card-header">
                      <div className="build-name">{build.name.replace(`${companion.name}: `, '')}</div>
                      {build.difficulty && (
                        <span className={`difficulty-badge ${build.difficulty.toLowerCase()}`}>
                          {build.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="build-path">
                      {formatClassLevels(build)}
                    </div>
                    <p className="build-desc">{build.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Community builds (non-companion)
  const communityBuilds = allBuilds
    .filter(b => !b.tags?.includes('Companion'))
    .sort((a, b) => {
      const aOrder = DIFFICULTY_ORDER[a.difficulty || 'Intermediate'] || 2;
      const bOrder = DIFFICULTY_ORDER[b.difficulty || 'Intermediate'] || 2;
      return aOrder - bOrder;
    });

  return (
    <div className="build-selector bg3">
      <h2>Community Builds</h2>
      <p className="build-credit">
        Popular builds from the BG3 community
      </p>
      
      <div className="build-list">
        {communityBuilds.map((build) => (
          <button
            key={build.id}
            className="build-card"
            onClick={() => onSelectBuild(build)}
          >
            <div className="build-card-header">
              <h3>{build.name}</h3>
              {build.difficulty && (
                <span className={`difficulty-badge ${build.difficulty.toLowerCase()}`}>
                  {build.difficulty}
                </span>
              )}
            </div>
            <div className="build-card-meta">
              <span className="race">{build.subrace || build.race}</span>
              <span className="separator">•</span>
              <span className="classes">{formatClassLevels(build)}</span>
            </div>
            <p className="build-card-description">{build.description}</p>
            {build.tags && build.tags.length > 0 && (
              <div className="build-card-tags">
                {build.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
