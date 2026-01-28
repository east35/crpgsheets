import { createPortal } from 'react-dom';
import { Xmark, Check } from 'iconoir-react';
import type { BuildGuide, CompanionName } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { COMPANIONS } from '../data/companions';
import './BuildSelectorModal.css';

interface BuildSelectorModalProps {
  companion: CompanionName;
  builds: BuildGuide[];
  isOpen: boolean;
  onClose: () => void;
  onSelectBuild: (build: BuildGuide) => void;
  onCreateCustomBuild?: (companion: CompanionName) => void;
  trackedBuildId?: string;
  trackedLevel?: number;
}

export function BuildSelectorModal({
  companion,
  builds,
  isOpen,
  onClose,
  onSelectBuild,
  onCreateCustomBuild,
  trackedBuildId,
  trackedLevel,
}: BuildSelectorModalProps) {
  const info = COMPANIONS[companion];

  if (!isOpen) return null;

  const handleSelectBuild = (build: BuildGuide) => {
    onSelectBuild(build);
    onClose();
  };

  return createPortal(
    <div className="build-selector-modal-overlay" onClick={onClose}>
      <div className="build-selector-modal" onClick={(e) => e.stopPropagation()}>
        <button className="build-selector-modal-close" onClick={onClose}>
          <Xmark width={24} height={24} />
        </button>
        
        <div className="build-selector-modal-header">
          {info.portraitUrl && (
            <img
              src={info.portraitUrl}
              alt={info.fullName}
              className="build-selector-modal-portrait"
            />
          )}
          <div className="build-selector-modal-info">
            <h2>{info.fullName}</h2>
            <span className="build-selector-modal-role">{info.role}</span>
            {info.quote && (
              <blockquote className="build-selector-modal-quote">"{info.quote}"</blockquote>
            )}
          </div>
        </div>

        <div className="build-selector-modal-builds">
          <h3>Available Builds</h3>
          <div className="build-selector-modal-grid">
            {builds.map((build) => {
              const isTracked = build.id === trackedBuildId;
              return (
              <button
                key={build.id}
                className={`build-selector-modal-card ${isTracked ? 'tracked' : ''}`}
                onClick={() => handleSelectBuild(build)}
              >
                {isTracked && (
                  <div className="build-selector-modal-card-badge">
                    <Check width={12} height={12} /> In Party (Lv {trackedLevel})
                  </div>
                )}
                <div className="build-selector-modal-card-name">{build.buildName}</div>
                <div className="build-selector-modal-card-path">
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
                  <div className="build-selector-modal-card-desc">{build.description}</div>
                )}
              </button>
              );
            })}
            {onCreateCustomBuild && (
              <button
                className="build-selector-modal-card custom"
                onClick={() => {
                  onCreateCustomBuild(companion);
                  onClose();
                }}
              >
                <div className="build-selector-modal-card-name">+ Custom Build</div>
                <div className="build-selector-modal-card-desc">
                  Create your own build for {info.fullName}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
