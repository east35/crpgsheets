import { useState } from 'react';
import { Check, EditPencil, NavArrowRight } from 'iconoir-react';
import type { BuildGuide, CompanionName } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { COMPANIONS } from '../data/companions';
import { getBuildsForCompanion, getCompanionsWithBuilds } from '../data/builds';
import { BuildSelectorModal } from './BuildSelectorModal';
import './BuildSelector.css';

export type BuildType = 'companion' | 'rogueTrader';

interface TrackedBuildInfo {
  guideId: string;
  companion: CompanionName;
  currentLevel: number;
}

interface BuildSelectorProps {
  onSelectBuild: (build: BuildGuide) => void;
  onCreateCustomBuild?: (companion: CompanionName) => void;
  buildType: BuildType;
  onSelectCompanion?: (companion: CompanionName) => void;
  trackedBuilds?: TrackedBuildInfo[];
  onSelectTrackedBuild?: (guideId: string, level: number) => void;
}

export function BuildSelector({ onSelectBuild, onCreateCustomBuild, buildType, onSelectCompanion, trackedBuilds = [], onSelectTrackedBuild }: BuildSelectorProps) {
  const [modalCompanion, setModalCompanion] = useState<CompanionName | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get tracked build for a specific companion
  const getTrackedBuildForCompanion = (companion: CompanionName): TrackedBuildInfo | undefined => {
    return trackedBuilds.find(tb => tb.companion === companion);
  };

  const allCompanionsWithBuilds = getCompanionsWithBuilds();
  
  // Filter based on build type
  const companionsWithBuilds: CompanionName[] = buildType === 'companion'
    ? allCompanionsWithBuilds.filter((c): c is Exclude<CompanionName, 'RogueTrader'> => c !== 'RogueTrader')
    : allCompanionsWithBuilds.filter((c): c is 'RogueTrader' => c === 'RogueTrader');
  const sortedCompanionsWithBuilds = buildType === 'companion'
    ? [...companionsWithBuilds].sort((a, b) =>
        (COMPANIONS[a]?.fullName ?? '').localeCompare(COMPANIONS[b]?.fullName ?? '')
      )
    : companionsWithBuilds;

  // Get companions without builds for "coming soon" section
  const allCompanions = Object.values(COMPANIONS);
  const companionsWithoutBuilds = buildType === 'companion'
    ? allCompanions.filter((c) => c.name !== 'RogueTrader' && !companionsWithBuilds.includes(c.name))
    : [];

  // Group builds by companion
  const buildsByCompanion = sortedCompanionsWithBuilds.map((companion) => ({
    companion,
    info: COMPANIONS[companion],
    builds: getBuildsForCompanion(companion),
  }));

  const title = buildType === 'companion' ? 'Companion Builds' : 'Rogue Trader Builds';
  const subtitle = buildType === 'companion'
    ? 'Choose a companion build to view the level-by-level progression guide'
    : 'Choose a build for your Rogue Trader protagonist';

  const getSource = (build: BuildGuide) => {
    if (build.sourceUrl) {
      return { url: build.sourceUrl, label: build.sourceLabel || 'Build Source' };
    }
    if (build.videoUrl) {
      return { url: build.videoUrl, label: 'Build Video' };
    }
    return null;
  };

  const getBuildTags = (build: BuildGuide) => [
    ARCHETYPE_DISPLAY_NAMES[build.archetypePath.base],
    ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced],
    ARCHETYPE_DISPLAY_NAMES[build.archetypePath.exemplar],
  ];

  const getArchetypeImage = (build: BuildGuide) =>
    `/images/archetypes/rogue-trader/${build.archetypePath.advanced}.png`;

  const openCompanionBuilds = (companion: CompanionName) => {
    if (onSelectCompanion) {
      onSelectCompanion(companion);
    } else {
      setModalCompanion(companion);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // For Rogue Trader builds, show directly without expansion pattern
  if (buildType === 'rogueTrader') {
    const rtBuilds = buildsByCompanion.find(b => b.companion === 'RogueTrader');
    const trackedBuild = getTrackedBuildForCompanion('RogueTrader');
    const availableTags = Array.from(new Set((rtBuilds?.builds ?? []).flatMap(getBuildTags))).sort();
    const filteredBuilds = selectedTags.length === 0
      ? (rtBuilds?.builds ?? [])
      : (rtBuilds?.builds ?? []).filter(build => selectedTags.every(tag => getBuildTags(build).includes(tag)));
    const trackedGuide = trackedBuild ? filteredBuilds.find(build => build.id === trackedBuild.guideId) : undefined;
    const orderedBuilds = trackedGuide
      ? [trackedGuide, ...filteredBuilds.filter(build => build.id !== trackedGuide.id)]
      : filteredBuilds;
    
    return (
      <div className="build-selector">
        <header className="view-hero">
          <div>
            <p className="view-eyebrow">Builds</p>
            <h1>{title}</h1>
            <p className="view-subtitle">{subtitle}.</p>
          </div>
          <div className="view-kpis">
            <div>
              <span>Builds</span>
              <strong>{filteredBuilds.length}</strong>
            </div>
            <div>
              <span>Tracked</span>
              <strong>{trackedBuild ? 1 : 0}</strong>
            </div>
            <div>
              <span>Archetypes</span>
              <strong>{new Set(filteredBuilds.flatMap(getBuildTags)).size}</strong>
            </div>
          </div>
        </header>

        <div className="build-selector-controls">
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

        <div className="companion-list">
          {orderedBuilds.map((build) => {
            const isTracked = trackedBuild?.guideId === build.id;
            const source = getSource(build);
            return (
              <button
                key={build.id}
                className={`companion-section rogue-trader-build-card ${isTracked ? 'has-tracked' : ''}`}
                onClick={() => onSelectBuild(build)}
              >
                <div className="companion-card-layout">
                  <div className="rt-build-icon-wrapper">
                    <img
                      src={getArchetypeImage(build)}
                      alt={ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced]}
                      className="rt-build-icon"
                    />
                  </div>
                  <div className="companion-card-content">
                    <div className="companion-card-title-row">
                      <div className="companion-card-title">{build.buildName}</div>
                      {isTracked && (
                        <span className="companion-card-level-badge">Lv {trackedBuild.currentLevel}</span>
                      )}
                    </div>
                    <div className="companion-card-meta">
                      <span className="companion-card-archetype">{ARCHETYPE_DISPLAY_NAMES[build.archetypePath.base]}</span>
                      <span className="companion-card-separator">•</span>
                      <span className="companion-card-archetype">{ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced]}</span>
                      <span className="companion-card-separator">•</span>
                      <span className="companion-card-archetype">{ARCHETYPE_DISPLAY_NAMES[build.archetypePath.exemplar]}</span>
                    </div>
                    {build.description && (
                      <div className="companion-card-desc">{build.description}</div>
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
          {onCreateCustomBuild && (
            <button
              className="companion-section rogue-trader-build-card"
              onClick={() => onCreateCustomBuild('RogueTrader')}
            >
              <div className="companion-card-layout">
                <div className="companion-card-content">
                  <div className="companion-card-title">+ Custom Build</div>
                  <div className="companion-card-desc">Create your own Rogue Trader build</div>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Get the modal companion's builds
  const modalBuilds = modalCompanion ? getBuildsForCompanion(modalCompanion) : [];
  const totalCompanionBuilds = buildsByCompanion.reduce((sum, entry) => sum + entry.builds.length, 0);

  return (
    <div className="build-selector">
      <header className="view-hero">
        <div>
          <p className="view-eyebrow">Builds</p>
          <h1>{title}</h1>
          <p className="view-subtitle">{subtitle}.</p>
        </div>
        <div className="view-kpis">
          <div>
            <span>Companions</span>
            <strong>{buildsByCompanion.length}</strong>
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
        {(() => {
          const sortByName = (entries: (typeof buildsByCompanion)[number][]) =>
            [...entries].sort((a, b) => a.info.fullName.localeCompare(b.info.fullName));
          const storyCompanions = buildsByCompanion.filter(entry => !entry.info.availability);
          const actNumbers = Array.from(new Set(storyCompanions.map(entry => entry.info.recruitmentAct)))
            .sort((a, b) => a - b);
          const actSections = actNumbers.map(act => ({
            title: `Act ${act} Companions`,
            entries: sortByName(storyCompanions.filter(entry => entry.info.recruitmentAct === act)),
          }));
          const dlcCompanions = sortByName(
            buildsByCompanion.filter(entry => entry.info.availability === 'dlc')
          );
          const secretCompanions = sortByName(
            buildsByCompanion.filter(entry => entry.info.availability === 'secret')
          );

          return [
            ...actSections,
            { title: 'DLC Companions', entries: dlcCompanions },
            { title: 'Secret Companions', entries: secretCompanions },
          ]
            .filter(section => section.entries.length > 0)
            .map(section => (
              <div key={section.title} className="companion-group">
                <h2 className="companion-group-title">{section.title}</h2>
                {section.entries.map(({ companion, info, builds }) => {
                  const trackedBuild = getTrackedBuildForCompanion(companion);
                  const trackedGuide = trackedBuild ? builds.find(b => b.id === trackedBuild.guideId) : undefined;

                  return (
                    <div
                      key={companion}
                      className={`companion-section ${trackedBuild ? 'has-tracked' : ''}`}
                    >
                      {/* Companion/Build Card Layout */}
                      <div className="companion-card-layout">
                        {info.portraitUrl && (
                          <div className="companion-card-portrait-wrapper">
                            <img
                              src={info.portraitUrl}
                              alt={info.fullName}
                              className="companion-card-portrait"
                            />
                          </div>
                        )}
                        <div className="companion-card-content">
                          <div className="companion-card-title-row">
                            <div className="companion-card-title">
                              {info.fullName}
                            </div>
                            {trackedBuild && (
                              <span className="companion-card-level-badge">Lv {trackedBuild.currentLevel}</span>
                            )}
                          </div>
                          <div className="companion-card-meta">
                            <span className="companion-card-origin">{info.origin}</span>
                            <span className="companion-card-separator">•</span>
                            <span className="companion-card-archetype">{ARCHETYPE_DISPLAY_NAMES[info.defaultArchetype]}</span>
                            <span className="companion-card-separator">•</span>
                            <span className="companion-card-role">{info.role}</span>
                          </div>
                          <div className="companion-card-desc">
                            {trackedGuide?.description || info.bio}
                          </div>
                          {trackedGuide && getSource(trackedGuide) && (
                            <a
                              className="build-source-link"
                              href={getSource(trackedGuide)!.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {getSource(trackedGuide)!.label}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Build Preview Card - shows tracked build or neutral "select build" state */}
                      {trackedBuild && trackedGuide && onSelectTrackedBuild ? (
                        <div className="tracked-build-preview">
                          <div className="tracked-build-row">
                            <span className="tracked-badge"><Check width={12} height={12} /> In Party</span>
                          </div>
                          <div className="tracked-build-row">
                            <div className="tracked-build-info">
                              <span className="tracked-build-name">{trackedGuide.buildName}</span>
                              <span className="tracked-build-level">Lv {trackedBuild.currentLevel}</span>
                            </div>
                            <div className="tracked-build-actions">
                              <button
                                className="tracked-build-change-btn"
                                onClick={() => openCompanionBuilds(companion)}
                              >
                                All Builds
                              </button>
                              <button
                                className="tracked-build-edit-btn"
                                onClick={() => onSelectTrackedBuild(trackedBuild.guideId, trackedBuild.currentLevel)}
                              >
                                <EditPencil width={14} height={14} />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="unselected-build-preview"
                          onClick={() => openCompanionBuilds(companion)}
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
            ));
        })()}
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

      {/* Build Selection Modal */}
      {modalCompanion && (
        <BuildSelectorModal
          companion={modalCompanion}
          builds={modalBuilds}
          isOpen={!!modalCompanion}
          onClose={() => setModalCompanion(null)}
          onSelectBuild={onSelectBuild}
          onCreateCustomBuild={onCreateCustomBuild}
          trackedBuildId={getTrackedBuildForCompanion(modalCompanion)?.guideId}
          trackedLevel={getTrackedBuildForCompanion(modalCompanion)?.currentLevel}
        />
      )}
    </div>
  );
}
