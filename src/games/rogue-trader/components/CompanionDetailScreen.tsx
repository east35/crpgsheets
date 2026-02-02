import { useState } from 'react';
import { NavArrowLeft } from 'iconoir-react';
import type { BuildGuide, CompanionInfo } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import './CompanionDetailScreen.css';

interface CompanionDetailScreenProps {
  companion: CompanionInfo;
  builds: BuildGuide[];
  onBack: () => void;
  onSelectBuild: (build: BuildGuide) => void;
  trackedBuildId?: string;
  trackedLevel?: number;
}

const getBuildTags = (build: BuildGuide) => [
  ARCHETYPE_DISPLAY_NAMES[build.archetypePath.base],
  ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced],
  ARCHETYPE_DISPLAY_NAMES[build.archetypePath.exemplar],
];

const getArchetypeImage = (build: BuildGuide) =>
  `/images/archetypes/rogue-trader/${build.archetypePath.advanced}.png`;

export function CompanionDetailScreen({
  companion,
  builds,
  onBack,
  onSelectBuild,
  trackedBuildId,
  trackedLevel,
}: CompanionDetailScreenProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const availabilityLabel = companion.availability === 'dlc'
    ? 'DLC'
    : companion.availability === 'secret'
      ? 'Secret'
      : `Act ${companion.recruitmentAct}`;

  const availableTags = Array.from(new Set(builds.flatMap(getBuildTags))).sort();
  const filteredBuilds = selectedTags.length === 0
    ? builds
    : builds.filter(build => selectedTags.every(tag => getBuildTags(build).includes(tag)));
  const sortedBuilds = [...filteredBuilds].sort((a, b) => a.buildName.localeCompare(b.buildName));

  const trackedBuild = trackedBuildId ? sortedBuilds.find(build => build.id === trackedBuildId) : undefined;
  const displayBuilds = trackedBuild
    ? [trackedBuild, ...sortedBuilds.filter(build => build.id !== trackedBuildId)]
    : sortedBuilds;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="companion-detail-screen rt">
      <header className="companion-detail-header">
        <button className="back-button" onClick={onBack}>
          <NavArrowLeft width={20} height={20} />
          <span>Back</span>
        </button>
      </header>

      <section className="companion-detail-main">
        <div className="companion-detail-summary">
          <div className="companion-summary-layout">
            {companion.portraitUrl && (
              <div className="companion-summary-portrait-wrapper">
                <img
                  src={companion.portraitUrl}
                  alt={companion.fullName}
                  className="companion-summary-portrait"
                />
              </div>
            )}
            <div className="companion-summary-content">
              <div className="companion-summary-title">{companion.fullName}</div>
              <div className="companion-summary-meta">
                <span>{companion.origin}</span>
                <span className="separator">•</span>
                <span>{companion.role}</span>
                <span className="separator">•</span>
                <span>{availabilityLabel}</span>
              </div>
              <div className="companion-summary-desc">{companion.bio}</div>
            </div>
          </div>
        </div>

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
          {displayBuilds.map((build) => {
            const isTracked = build.id === trackedBuildId;
            const source = build.sourceUrl ? { url: build.sourceUrl, label: build.sourceLabel || 'Build Source' }
              : build.videoUrl ? { url: build.videoUrl, label: 'Build Video' }
              : null;

            return (
              <button
                key={build.id}
                className={`companion-build-card ${isTracked ? 'tracked' : ''}`}
                onClick={() => onSelectBuild(build)}
              >
                <div className="build-card-layout">
                  <div className="build-card-icon-wrapper rt-build-icon-wrapper">
                    <img
                      src={getArchetypeImage(build)}
                      alt={ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced]}
                      className="rt-build-icon"
                    />
                  </div>
                  <div className="build-card-content">
                    <div className="build-card-title-row">
                      <div className="build-card-title">{build.buildName}</div>
                      {isTracked && (
                        <span className="build-card-level">Lv {trackedLevel}</span>
                      )}
                    </div>
                    <div className="build-card-meta">
                      <span className="build-card-archetype">{ARCHETYPE_DISPLAY_NAMES[build.archetypePath.base]}</span>
                      <span className="build-card-separator">•</span>
                      <span className="build-card-archetype">{ARCHETYPE_DISPLAY_NAMES[build.archetypePath.advanced]}</span>
                      <span className="build-card-separator">•</span>
                      <span className="build-card-archetype">{ARCHETYPE_DISPLAY_NAMES[build.archetypePath.exemplar]}</span>
                    </div>
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
