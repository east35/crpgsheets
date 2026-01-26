import type { BG3Build } from '../types';
import { getAllBuilds } from '../data/builds';
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
  
  // Filter by type
  const filteredBuilds = buildType === 'companion' 
    ? allBuilds.filter(b => b.tags?.includes('Companion'))
    : allBuilds.filter(b => !b.tags?.includes('Companion'));
  
  // Sort by difficulty
  const builds = [...filteredBuilds].sort((a, b) => {
    const aOrder = DIFFICULTY_ORDER[a.difficulty || 'Intermediate'] || 2;
    const bOrder = DIFFICULTY_ORDER[b.difficulty || 'Intermediate'] || 2;
    return aOrder - bOrder;
  });

  // Format class levels for display
  const formatClassLevels = (build: BG3Build) => {
    const finalLevel = build.progression[build.progression.length - 1];
    if (!finalLevel) return '';
    
    return finalLevel.classLevels.map(cl => {
      const subclassStr = cl.subclass ? ` (${cl.subclass})` : '';
      return `${cl.class} ${cl.level}${subclassStr}`;
    }).join(' / ');
  };

  return (
    <div className="build-selector bg3">
      <h2>{buildType === 'companion' ? 'Companion Builds' : 'Community Builds'}</h2>
      <p className="build-credit">
        {buildType === 'companion' 
          ? 'Optimized builds for each BG3 companion'
          : 'Popular builds from the BG3 community'}
      </p>
      
      <div className="build-list">
        {builds.map((build) => (
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
