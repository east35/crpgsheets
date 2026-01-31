import { useState } from 'react';
import { NavArrowRight } from 'iconoir-react';
import type { BG3Build, CompanionInfo } from '../types';
import { getAllBuilds } from '../data/builds';
import { getAllCompanions } from '../data/companions';
import { getCsvGearImage } from '../data/gear';
import { getClassIcon, getPrimaryClass } from '../data/classIcons';
import { BuildSelectorModal } from './BuildSelectorModal';
import './BuildSelector.css';
import './CompanionDetailScreen.css';

interface TrackedBuildInfo {
  buildId: string;
  currentLevel: number;
}

interface BuildSelectorProps {
  onSelectBuild: (build: BG3Build) => void;
  onSelectCompanion?: (companion: CompanionInfo) => void;
  buildType?: 'all' | 'companion';
  trackedBuilds?: TrackedBuildInfo[];
  onSelectTrackedBuild?: (buildId: string, level: number) => void;
}

const DIFFICULTY_ORDER: Record<string, number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

const BG3_COMPANION_ORDER = [
  'Astarion',
  'Gale',
  'Karlach',
  'Laezel',
  'Shadowheart',
  'Wyll',
  'Dark Urge',
  'Minthara',
  'Halsin',
  'Jaheira',
  'Minsc',
];

const BG3_ORIGIN_COMPANIONS = [
  'Astarion',
  'Gale',
  'Karlach',
  'Laezel',
  'Shadowheart',
  'Wyll',
  'Dark Urge',
];

const BG3_RECRUITABLE_COMPANIONS = [
  'Minthara',
  'Halsin',
  'Jaheira',
  'Minsc',
];

export function BuildSelector({ onSelectBuild, onSelectCompanion, buildType = 'all', trackedBuilds = [] }: BuildSelectorProps) {
  const [modalCompanion, setModalCompanion] = useState<CompanionInfo | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const companionOrder = new Map(BG3_COMPANION_ORDER.map((name, index) => [name, index]));

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
    const sortedCompanions = [...companionsWithBuilds].sort((a, b) => {
      const aOrder = companionOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = companionOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.fullName.localeCompare(b.fullName);
    });

    const totalCompanionBuilds = sortedCompanions.reduce((sum, companion) => {
      return sum + getBuildsForCompanion(companion).length;
    }, 0);

    // Get the modal companion's builds
    const modalBuilds = modalCompanion ? getBuildsForCompanion(modalCompanion) : [];
    const usedCompanions = new Set<string>();

    const getCompanionsByNameOrder = (names: string[]) => {
      return names
        .map(name => sortedCompanions.find(companion => companion.name === name))
        .filter((companion): companion is CompanionInfo => {
          if (!companion) return false;
          usedCompanions.add(companion.name);
          return true;
        });
    };

    const originCompanions = getCompanionsByNameOrder(BG3_ORIGIN_COMPANIONS);
    const recruitableCompanions = getCompanionsByNameOrder(BG3_RECRUITABLE_COMPANIONS);
    const otherCompanions = sortedCompanions.filter(companion => !usedCompanions.has(companion.name));

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
          {[
            { title: 'Origin Companions', companions: originCompanions },
            { title: 'Recruitable Companions', companions: recruitableCompanions },
            { title: 'Other Companions', companions: otherCompanions },
          ]
            .filter(section => section.companions.length > 0)
            .map((section) => (
              <div key={section.title} className="companion-group">
                <h2 className="companion-group-title">{section.title}</h2>
                {section.companions.map((companion) => {
                  const builds = getBuildsForCompanion(companion);
                  const trackedData = getTrackedBuildForCompanion(companion);

                  // When tracked, show the build details; otherwise show companion info
                  const trackedBuild = trackedData?.build;

                  // Handler for clicking anywhere on the companion card
                  const handleCompanionClick = () => {
                    if (onSelectCompanion) {
                      onSelectCompanion(companion);
                    } else {
                      setModalCompanion(companion);
                    }
                  };

                  return (
                    <button
                      key={companion.name}
                      className={`companion-section ${trackedData ? 'has-tracked' : ''}`}
                      onClick={handleCompanionClick}
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

                      {/* Build Actions - shown at bottom of card */}
                      <div className="companion-card-footer">
                        {trackedData ? (
                          <div className="tracked-build-indicator">
                            <span className="tracked-level">Level {trackedData.info.currentLevel}</span>
                            <span className="tracked-label">Currently Tracking</span>
                          </div>
                        ) : (
                          <div className="unselected-build-info">
                            <span className="unselected-badge">No Build Selected</span>
                            <span className="unselected-build-count">{builds.length} builds available</span>
                          </div>
                        )}
                        <span className="companion-card-action">
                          {trackedData ? 'View Builds' : 'Select Build'}
                          <NavArrowRight width={14} height={14} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
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

  const availableTags = Array.from(new Set(communityBuilds.flatMap(build => build.tags ?? []))).sort();
  const filteredBuilds = selectedTags.length === 0
    ? communityBuilds
    : communityBuilds.filter(build => selectedTags.every(tag => build.tags?.includes(tag)));

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="companion-detail-screen bg3">
      <section className="companion-detail-main">
        <header className="view-hero">
          <div>
            <p className="view-eyebrow">Builds</p>
            <h1>Community Builds</h1>
            <p className="view-subtitle">Popular builds from the BG3 community.</p>
          </div>
          <div className="view-kpis">
            <div>
              <span>Builds</span>
              <strong>{filteredBuilds.length}</strong>
            </div>
            <div>
              <span>Tracked</span>
              <strong>{trackedBuilds.length}</strong>
            </div>
            <div>
              <span>Tags</span>
              <strong>{new Set(filteredBuilds.flatMap(b => b.tags ?? [])).size}</strong>
            </div>
          </div>
        </header>

        <div className="companion-detail-controls">
          <div className="filter-section">
            <span className="filter-label">Filter:</span>
            <div className="filter-tags">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button className="clear-filters" onClick={() => setSelectedTags([])}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="companion-detail-builds">
          {filteredBuilds.map((build) => {
            const finalLevel = build.progression[build.progression.length - 1];
            const primaryClass = finalLevel ? getPrimaryClass(finalLevel.classLevels) : 'Fighter';
            const classIcon = getClassIcon(primaryClass);
            const source = getSource(build);

            return (
              <button
                key={build.id}
                className="companion-build-card"
                onClick={() => onSelectBuild(build)}
              >
                <div className="build-card-layout">
                  <div className="build-card-icon-wrapper">
                    <img
                      src={classIcon}
                      alt={primaryClass}
                      className="build-card-class-icon"
                    />
                  </div>
                  <div className="build-card-content">
                    <div className="build-card-title">{build.name}</div>
                    <div className="build-card-meta">
                      <span className="build-card-race">{build.subrace || build.race}</span>
                      <span className="build-card-separator">•</span>
                      <span className="build-card-background">{build.background}</span>
                      <span className="build-card-separator">•</span>
                      <span className="build-card-classes">{formatClassLevels(build)}</span>
                    </div>
                    {build.tags && build.tags.length > 0 && (
                      <div className="build-card-tags">
                        {build.tags.map(tag => (
                          <span
                            key={tag}
                            className={`build-card-tag ${tag === build.difficulty ? `difficulty ${build.difficulty?.toLowerCase()}` : ''}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {build.gearRecommendations && (
                      <div className="build-card-gear">
                        {getGearIcons(build).map((gear) => (
                          <img
                            key={gear.name}
                            src={gear.iconPath}
                            alt={gear.name}
                            className="build-card-gear-icon"
                            title={gear.name}
                          />
                        ))}
                      </div>
                    )}
                    {build.description && (
                      <div className="build-card-desc">{build.description}</div>
                    )}
                    {source && (
                      <a
                        className="build-source-link"
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {source.label}
                      </a>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
