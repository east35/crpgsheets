import { useState } from 'react';
import { NavArrowLeft, NavArrowDown, NavArrowUp, Check } from 'iconoir-react';
import type { BG3Build, CompanionInfo } from '../types';
import { getClassIcon, getPrimaryClass } from '../data/classIcons';
import { getCsvGearImage } from '../data/gear';
import './CompanionDetailScreen.css';

interface CompanionDetailScreenProps {
  companion: CompanionInfo;
  builds: BG3Build[];
  onBack: () => void;
  onSelectBuild: (build: BG3Build) => void;
  trackedBuildId?: string;
  trackedLevel?: number;
}

type SortOption = 'difficulty' | 'name' | 'classes';
type FilterTag = string;

const DIFFICULTY_ORDER: Record<string, number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

const formatClassLevels = (build: BG3Build) => {
  const finalLevel = build.progression[build.progression.length - 1];
  if (!finalLevel) return '';
  return finalLevel.classLevels.map(cl => `${cl.class} ${cl.level}`).join(' / ');
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

const getSource = (build: BG3Build) => {
  if (build.sourceUrl) {
    return { url: build.sourceUrl, label: build.sourceLabel || 'Build Source' };
  }
  return null;
};

// Get unique tags from builds (excluding companion name and 'Companion')
const getAvailableTags = (builds: BG3Build[], companionName: string): string[] => {
  const tagSet = new Set<string>();
  for (const build of builds) {
    if (!build.tags) continue;
    for (const tag of build.tags) {
      if (tag !== 'Companion' && tag !== companionName) {
        tagSet.add(tag);
      }
    }
  }
  return Array.from(tagSet).sort();
};

export function CompanionDetailScreen({
  companion,
  builds,
  onBack,
  onSelectBuild,
  trackedBuildId,
  trackedLevel,
}: CompanionDetailScreenProps) {
  const [sortBy, setSortBy] = useState<SortOption>('difficulty');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedTags, setSelectedTags] = useState<FilterTag[]>([]);

  const availableTags = getAvailableTags(builds, companion.name);

  // Filter builds by selected tags
  const filteredBuilds = selectedTags.length === 0
    ? builds
    : builds.filter(build =>
        selectedTags.every(tag => build.tags?.includes(tag))
      );

  // Sort builds
  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'difficulty':
        const aDiff = DIFFICULTY_ORDER[a.difficulty || 'Intermediate'] || 2;
        const bDiff = DIFFICULTY_ORDER[b.difficulty || 'Intermediate'] || 2;
        comparison = aDiff - bDiff;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'classes':
        comparison = formatClassLevels(a).localeCompare(formatClassLevels(b));
        break;
    }

    return sortAsc ? comparison : -comparison;
  });

  // Move tracked build to top if it exists
  const trackedBuild = trackedBuildId ? sortedBuilds.find(b => b.id === trackedBuildId) : null;
  const displayBuilds = trackedBuild
    ? [trackedBuild, ...sortedBuilds.filter(b => b.id !== trackedBuildId)]
    : sortedBuilds;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(option);
      setSortAsc(true);
    }
  };

  return (
    <div className="companion-detail-screen bg3">
      {/* Header with companion info */}
      <header className="companion-detail-header">
        <button className="back-button" onClick={onBack}>
          <NavArrowLeft width={20} height={20} />
          <span>Back</span>
        </button>
      </header>

      <section className="companion-detail-main">
        <div className="companion-section companion-detail-summary">
          <div className="companion-card-layout">
            <div className="companion-card-portrait-wrapper">
              <img
                src={companion.portraitUrl}
                alt={companion.fullName}
                className="companion-card-portrait"
              />
            </div>
            <div className="companion-card-content">
              <div className="companion-card-title">{companion.fullName}</div>
              <div className="companion-card-meta">
                <span className="companion-card-race">{companion.subrace || companion.race}</span>
                <span className="companion-card-separator">•</span>
                <span className="companion-card-background">{companion.background}</span>
                <span className="companion-card-separator">•</span>
                <span>Act {companion.recruitmentAct}</span>
              </div>
              <div className="companion-card-desc">{companion.bio}</div>
              {companion.quote && (
                <div className="companion-card-quote">"{companion.quote}"</div>
              )}
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
                  {selectedTags.includes(tag) && <Check width={12} height={12} />}
                </button>
              ))}
            </div>
          </div>

          <div className="sort-section">
            <span className="sort-label">Sort:</span>
            <div className="sort-options">
              <button
                className={`sort-option ${sortBy === 'difficulty' ? 'active' : ''}`}
                onClick={() => toggleSort('difficulty')}
              >
                Difficulty
                {sortBy === 'difficulty' && (
                  sortAsc ? <NavArrowUp width={14} height={14} /> : <NavArrowDown width={14} height={14} />
                )}
              </button>
              <button
                className={`sort-option ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => toggleSort('name')}
              >
                Name
                {sortBy === 'name' && (
                  sortAsc ? <NavArrowUp width={14} height={14} /> : <NavArrowDown width={14} height={14} />
                )}
              </button>
              <button
                className={`sort-option ${sortBy === 'classes' ? 'active' : ''}`}
                onClick={() => toggleSort('classes')}
              >
                Class
                {sortBy === 'classes' && (
                  sortAsc ? <NavArrowUp width={14} height={14} /> : <NavArrowDown width={14} height={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="builds-count">
          {filteredBuilds.length} build{filteredBuilds.length !== 1 ? 's' : ''} available
          {selectedTags.length > 0 && (
            <button className="clear-filters" onClick={() => setSelectedTags([])}>
              Clear filters
            </button>
          )}
        </div>

        <div className="companion-detail-builds">
          {displayBuilds.map((build) => {
            const isTracked = build.id === trackedBuildId;
            const finalLevel = build.progression[build.progression.length - 1];
            const primaryClass = finalLevel ? getPrimaryClass(finalLevel.classLevels) : 'Fighter';
            const classIcon = getClassIcon(primaryClass);
            const source = getSource(build);

            return (
              <button
                key={build.id}
                className={`companion-build-card ${isTracked ? 'tracked' : ''}`}
                onClick={() => onSelectBuild(build)}
              >
                {isTracked && (
                  <div className="tracked-banner">
                    <Check width={14} height={14} />
                    Currently Tracking (Level {trackedLevel})
                  </div>
                )}

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
                        {build.tags
                          .filter(tag => tag !== 'Companion' && tag !== companion.name)
                          .map(tag => (
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
