import { createPortal } from 'react-dom';
import { Xmark } from 'iconoir-react';
import type { BG3Build } from '../types';
import type { CompanionInfo } from '../types';
import { getClassIcon, getPrimaryClass } from '../data/classIcons';
import { getCsvGearImage } from '../data/gear';
import './BuildSelectorModal.css';

interface BuildSelectorModalProps {
  companion: CompanionInfo;
  builds: BG3Build[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBuild: (build: BG3Build) => void;
  trackedBuildId?: string;
  trackedLevel?: number;
}

// Format class levels for display (e.g., "Rogue 7 / Ranger 5")
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

export function BuildSelectorModal({
  companion,
  builds,
  isOpen,
  onClose,
  onSelectBuild,
  trackedBuildId,
  trackedLevel,
}: BuildSelectorModalProps) {
  if (!isOpen) return null;

  const handleSelectBuild = (build: BG3Build) => {
    onSelectBuild(build);
    onClose();
  };

  return createPortal(
    <div className="build-selector-modal-overlay bg3" onClick={onClose}>
      <div className="build-selector-modal" onClick={(e) => e.stopPropagation()}>
        <button className="build-selector-modal-close" onClick={onClose}>
          <Xmark width={24} height={24} />
        </button>
        
        <div className="build-selector-modal-header">
          <h2>Select a Build for {companion.fullName}</h2>
        </div>

        <div className="build-selector-modal-builds">
          <div className="build-selector-modal-grid">
            {builds.map((build) => {
              const isTracked = build.id === trackedBuildId;
              const finalLevel = build.progression[build.progression.length - 1];
              const primaryClass = finalLevel ? getPrimaryClass(finalLevel.classLevels) : 'Fighter';
              const classIcon = getClassIcon(primaryClass);
              const source = getSource(build);
              
              return (
                <button
                  key={build.id}
                  className={`build-selector-modal-card ${isTracked ? 'tracked' : ''}`}
                  onClick={() => handleSelectBuild(build)}
                >
                  {/* Class icon and main content */}
                  <div className="build-card-layout">
                    <div className="build-card-icon-wrapper">
                      <img
                        src={classIcon}
                        alt={primaryClass}
                        className="build-card-class-icon"
                      />
                      {isTracked && (
                        <div className="build-card-level-badge">{trackedLevel}</div>
                      )}
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
        </div>
      </div>
    </div>,
    document.body
  );
}
