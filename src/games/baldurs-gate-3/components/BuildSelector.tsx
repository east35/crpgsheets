import { useState } from 'react';
import { EditPencil, NavArrowRight } from 'iconoir-react';
import type { BG3Build, CompanionInfo } from '../types';
import { getAllBuilds } from '../data/builds';
import { getAllCompanions } from '../data/companions';
import { getCsvGearImage } from '../data/gear';
import { BuildSelectorModal } from './BuildSelectorModal';
import './BuildSelector.css';

interface TrackedBuildInfo {
  buildId: string;
  currentLevel: number;
}

interface BuildSelectorProps {
  onSelectBuild: (build: BG3Build) => void;
  buildType?: 'all' | 'companion';
  trackedBuilds?: TrackedBuildInfo[];
  onSelectTrackedBuild?: (buildId: string, level: number) => void;
}

const DIFFICULTY_ORDER: Record<string, number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

export function BuildSelector({ onSelectBuild, buildType = 'all', trackedBuilds = [], onSelectTrackedBuild }: BuildSelectorProps) {
  const [modalCompanion, setModalCompanion] = useState<CompanionInfo | null>(null);

  // Get tracked build info by buildId
  const getTrackedBuild = (buildId: string): TrackedBuildInfo | undefined => {
    return trackedBuilds.find(tb => tb.buildId === buildId);
  };

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

  const getSource = (build: BG3Build) => {
    if (build.sourceUrl) {
      return { url: build.sourceUrl, label: build.sourceLabel || 'Build Source' };
    }
    return null;
  };

  const getGearIcons = (build: BG3Build) => {
    if (!build.gearRecommendations) return [];
    const seen = new Set<string>();
    const icons: Array<{ name: string; iconPath: string }> = [];
    for (const rec of build.gearRecommendations) {
      const firstItem = rec.items[0];
      if (!firstItem || seen.has(firstItem)) continue;
      seen.add(firstItem);
      const iconPath = getCsvGearImage(firstItem);
      if (iconPath) {
        icons.push({ name: firstItem, iconPath });
      }
      if (icons.length >= 6) break;
    }
    return icons;
  };

  // Get builds for a specific companion
  const getBuildsForCompanion = (companion: CompanionInfo): BG3Build[] => {
    return allBuilds
      .filter(b => b.tags?.includes('Companion') && b.tags?.includes(companion.name))
      .sort((a, b) => {
        const aOrder = DIFFICULTY_ORDER[a.difficulty || 'Intermediate'] || 2;
        const bOrder = DIFFICULTY_ORDER[b.difficulty || 'Intermediate'] || 2;
        return aOrder - bOrder;
      });
  };

  // Get tracked build for a specific companion
  const getTrackedBuildForCompanion = (companion: CompanionInfo): { build: BG3Build; info: TrackedBuildInfo } | undefined => {
    const builds = getBuildsForCompanion(companion);
    for (const build of builds) {
      const tracked = getTrackedBuild(build.id);
      if (tracked) {
        return { build, info: tracked };
      }
    }
    return undefined;
  };

  if (buildType === 'companion') {
    // Get companions that have builds
    const companionsWithBuilds = allCompanions.filter(companion => {
      const builds = getBuildsForCompanion(companion);
      return builds.length > 0;
    });

    const totalCompanionBuilds = companionsWithBuilds.reduce((sum, companion) => {
      return sum + getBuildsForCompanion(companion).length;
    }, 0);

    // Get the modal companion's builds
    const modalBuilds = modalCompanion ? getBuildsForCompanion(modalCompanion) : [];

    return (
      <div className="build-selector bg3">
        <header className="view-hero">
          <div>
            <p className="view-eyebrow">Builds</p>
            <h1>Companion Builds</h1>
            <p className="view-subtitle">Choose a companion to view optimized build guides.</p>
          </div>
          <div className="view-kpis">
            <div>
              <span>Companions</span>
              <strong>{companionsWithBuilds.length}</strong>
            </div>
            <div>
              <span>Builds</span>
              <strong>{totalCompanionBuilds}</strong>
            </div>
            <div>
              <span>Tracked</span>
              <strong>{trackedBuilds.length}</strong>
            </div>
          </div>
        </header>

        <div className="companion-list">
          {companionsWithBuilds.map((companion) => {
            const builds = getBuildsForCompanion(companion);
            const trackedData = getTrackedBuildForCompanion(companion);
            
            // When tracked, show the build details; otherwise show companion info
            const trackedBuild = trackedData?.build;
            
            return (
              <div
                key={companion.name}
                className={`companion-section ${trackedData ? 'has-tracked' : ''}`}
              >
                {/* Companion/Build Card Layout */}
                <div className="companion-card-layout">
                  {companion.portraitUrl && (
                    <div className="companion-card-portrait-wrapper">
                      <img
                        src={companion.portraitUrl}
                        alt={companion.fullName}
                        className="companion-card-portrait"
                      />
                      {trackedData && (
                        <div className="companion-card-level-badge">{trackedData.info.currentLevel}</div>
                      )}
                    </div>
                  )}
                  <div className="companion-card-content">
                    <div className="companion-card-title">
                      {trackedBuild ? trackedBuild.name : companion.fullName}
                    </div>
                    <div className="companion-card-meta">
                      <span className="companion-card-race">{companion.subrace || companion.race}</span>
                      <span className="companion-card-separator">•</span>
                      <span className="companion-card-background">{companion.background}</span>
                      {trackedBuild && (
                        <>
                          <span className="companion-card-separator">•</span>
                          <span className="companion-card-classes">{formatClassLevels(trackedBuild)}</span>
                        </>
                      )}
                    </div>
                    {trackedBuild?.tags && trackedBuild.tags.length > 0 && (
                      <div className="companion-card-tags">
                        {trackedBuild.tags.map(tag => (
                          <span 
                            key={tag} 
                            className={`companion-card-tag ${tag === trackedBuild.difficulty ? `difficulty ${trackedBuild.difficulty?.toLowerCase()}` : ''}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {trackedBuild && (
                      <div className="companion-card-gear">
                        {getGearIcons(trackedBuild).map((gear) => (
                          <img
                            key={gear.name}
                            src={gear.iconPath}
                            alt={gear.name}
                            className="companion-card-gear-icon"
                            title={gear.name}
                          />
                        ))}
                      </div>
                    )}
                    {trackedBuild?.description ? (
                      <div className="companion-card-desc">{trackedBuild.description}</div>
                    ) : (
                      <div className="companion-card-desc">{companion.bio}</div>
                    )}
                    {trackedBuild && getSource(trackedBuild) && (
                      <a
                        className="build-source-link"
                        href={getSource(trackedBuild)!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {getSource(trackedBuild)!.label}
                      </a>
                    )}
                  </div>
                </div>

                {/* Build Actions */}
                {trackedData && onSelectTrackedBuild ? (
                  <div className="tracked-build-actions">
                    <button
                      className="tracked-build-change-btn"
                      onClick={() => setModalCompanion(companion)}
                    >
                      All Builds
                    </button>
                    <button
                      className="tracked-build-edit-btn"
                      onClick={() => onSelectTrackedBuild(trackedData.info.buildId, trackedData.info.currentLevel)}
                    >
                      <EditPencil width={14} height={14} />
                      View Build
                    </button>
                  </div>
                ) : (
                  <button
                    className="unselected-build-preview"
                    onClick={() => setModalCompanion(companion)}
                  >
                    <div className="unselected-build-info">
                      <span className="unselected-badge">No Build Selected</span>
                      <span className="unselected-build-count">{builds.length} builds available</span>
                    </div>
                    <span className="unselected-build-action">
                      Select Build
                      <NavArrowRight width={14} height={14} />
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Build Selection Modal */}
        {modalCompanion && (
          <BuildSelectorModal
            companion={modalCompanion}
            builds={modalBuilds}
            isOpen={!!modalCompanion}
            onClose={() => setModalCompanion(null)}
            onSelectBuild={onSelectBuild}
            trackedBuildId={getTrackedBuildForCompanion(modalCompanion)?.info.buildId}
            trackedLevel={getTrackedBuildForCompanion(modalCompanion)?.info.currentLevel}
          />
        )}
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
      <header className="view-hero">
        <div>
          <p className="view-eyebrow">Builds</p>
          <h1>Community Builds</h1>
          <p className="view-subtitle">Popular builds from the BG3 community.</p>
        </div>
        <div className="view-kpis">
          <div>
            <span>Builds</span>
            <strong>{communityBuilds.length}</strong>
          </div>
          <div>
            <span>Tracked</span>
            <strong>{trackedBuilds.length}</strong>
          </div>
          <div>
            <span>Tags</span>
            <strong>{new Set(communityBuilds.flatMap(b => b.tags ?? [])).size}</strong>
          </div>
        </div>
      </header>
      
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
            {getSource(build) && (
              <a
                className="build-source-link"
                href={getSource(build)!.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                {getSource(build)!.label}
              </a>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
