import { useState } from 'react';
import type { BuildGuide } from '../types';
import { ARCHETYPE_DISPLAY_NAMES, GEAR_SLOT_LABELS } from '../types';
import { TalentTooltip } from './TalentTooltip';
import { GearTooltip } from './GearTooltip';
import { KeywordText } from './KeywordText';
import './BuildViewer.css';

interface BuildViewerProps {
  build: BuildGuide;
  onBack: () => void;
  currentLevel?: number;
  onLevelChange?: (level: number) => void;
  onTrackBuild?: (build: BuildGuide) => void;
  isTracked?: boolean;
}

export function BuildViewer({ build, onBack, currentLevel = 1, onLevelChange, onTrackBuild, isTracked }: BuildViewerProps) {
  const [activeTab, setActiveTab] = useState<'progression' | 'gear'>('progression');
  const [showAllLevels, setShowAllLevels] = useState(false);

  const archetypePath = build.archetypePath;

  // Determine archetype tier boundaries
  const getArchetypeForLevel = (level: number) => {
    if (level <= 15) return archetypePath.base;
    if (level <= 35) return archetypePath.advanced;
    return archetypePath.exemplar;
  };

  const getTierForLevel = (level: number): 'base' | 'advanced' | 'exemplar' => {
    if (level <= 15) return 'base';
    if (level <= 35) return 'advanced';
    return 'exemplar';
  };

  // Filter levels to show
  const levelsToShow = showAllLevels
    ? build.progression
    : build.progression.filter((l) => l.level <= currentLevel + 5 && l.level >= currentLevel - 2);

  return (
    <div className="build-viewer">
      <div className="build-viewer-header">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back
        </button>
        <div className="build-title">
          <h2>{build.companion}: {build.buildName}</h2>
          <div className="archetype-path">
            <span className="tier base">{ARCHETYPE_DISPLAY_NAMES[archetypePath.base]}</span>
            <span className="arrow">→</span>
            <span className="tier advanced">{ARCHETYPE_DISPLAY_NAMES[archetypePath.advanced]}</span>
            <span className="arrow">→</span>
            <span className="tier exemplar">{ARCHETYPE_DISPLAY_NAMES[archetypePath.exemplar]}</span>
          </div>
        </div>
        {onTrackBuild && (
          <button
            className={`btn ${isTracked ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => onTrackBuild(build)}
            disabled={isTracked}
          >
            {isTracked ? 'Tracking' : 'Track Build'}
          </button>
        )}
      </div>

      {build.description && (
        <p className="build-description"><KeywordText text={build.description} /></p>
      )}

      {build.videoUrl && (
        <a href={build.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
          Watch Video Guide
        </a>
      )}

      <div className="skill-options">
        <strong>Recommended Skills:</strong> <KeywordText text={build.skillOptions.join(', ')} />
      </div>

      {onLevelChange && (
        <div className="level-selector">
          <label>Current Level:</label>
          <input
            type="range"
            min="1"
            max="55"
            value={currentLevel}
            onChange={(e) => onLevelChange(Number(e.target.value))}
          />
          <span className="level-display">{currentLevel}</span>
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'progression' ? 'active' : ''}`}
          onClick={() => setActiveTab('progression')}
        >
          Level Progression
        </button>
        <button
          className={`tab ${activeTab === 'gear' ? 'active' : ''}`}
          onClick={() => setActiveTab('gear')}
        >
          Gear Recommendations
        </button>
      </div>

      {activeTab === 'progression' && (
        <div className="progression-view">
          <div className="progression-controls">
            <label>
              <input
                type="checkbox"
                checked={showAllLevels}
                onChange={(e) => setShowAllLevels(e.target.checked)}
              />
              Show all levels
            </label>
          </div>

          <div className="level-list">
            {levelsToShow.map((levelData) => {
              const tier = getTierForLevel(levelData.level);
              const archetype = getArchetypeForLevel(levelData.level);
              const isCurrentLevel = levelData.level === currentLevel;
              const isPastLevel = levelData.level < currentLevel;
              const isTierStart = levelData.level === 1 || levelData.level === 16 || levelData.level === 36;

              return (
                <div key={levelData.level}>
                  {isTierStart && (
                    <div className={`tier-header ${tier}`}>
                      {ARCHETYPE_DISPLAY_NAMES[archetype]} (Levels {levelData.level}-{tier === 'base' ? 15 : tier === 'advanced' ? 35 : 55})
                    </div>
                  )}
                  <div
                    className={`level-row ${tier} ${isCurrentLevel ? 'current' : ''} ${isPastLevel ? 'completed' : ''}`}
                    onClick={() => onLevelChange?.(levelData.level)}
                  >
                    <div className="level-number">
                      {isPastLevel && <span className="check">✓</span>}
                      Lv {levelData.level}
                    </div>
                    <div className="level-content">
                      {levelData.talents.length > 0 && (
                        <div className="talents">
                          {levelData.talents.map((talent, i) => (
                            <TalentTooltip key={i} talentName={talent}>
                              <span className="talent">{talent}</span>
                            </TalentTooltip>
                          ))}
                        </div>
                      )}
                      {levelData.statIncrease && (
                        <div className="stat-increase">
                          +{levelData.statIncrease}
                        </div>
                      )}
                      {levelData.notes && (
                        <div className="level-notes">{levelData.notes}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'gear' && (
        <div className="gear-view">
          {build.gearRecommendations.map((gear) => (
            <div key={gear.slot} className="gear-slot">
              <div className="slot-name">{GEAR_SLOT_LABELS[gear.slot]}</div>
              <div className="gear-options">
                {gear.items.map((item, i) => (
                  <GearTooltip key={i} gearName={item}>
                    <span className={`gear-item ${i === 0 ? 'primary' : ''}`}>
                      {item}
                    </span>
                  </GearTooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
