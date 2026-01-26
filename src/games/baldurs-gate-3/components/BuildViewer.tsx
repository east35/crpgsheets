import { useState } from 'react';
import type { BG3Build } from '../types';
import { getRace } from '../data/character/races';
import { getBackground } from '../data/character/backgrounds';
import './BuildViewer.css';

interface BuildViewerProps {
  build: BG3Build;
  onBack: () => void;
  currentLevel?: number;
  onLevelChange?: (level: number) => void;
  onTrackBuild?: (build: BG3Build) => void;
  isTracked?: boolean;
}

export function BuildViewer({ build, onBack, currentLevel = 1, onLevelChange, onTrackBuild, isTracked }: BuildViewerProps) {
  const [activeTab, setActiveTab] = useState<'progression' | 'stats'>('progression');

  const raceInfo = getRace(build.race);
  const backgroundInfo = getBackground(build.background);

  // Get current class levels at a given character level
  const getClassLevelsAtLevel = (level: number) => {
    const prog = build.progression.find(p => p.characterLevel === level);
    return prog?.classLevels || [];
  };

  // Format class levels for display
  const formatClassLevels = (classLevels: { class: string; level: number; subclass?: string }[]) => {
    return classLevels.map(cl => {
      const subclassStr = cl.subclass ? ` (${cl.subclass})` : '';
      return `${cl.class} ${cl.level}${subclassStr}`;
    }).join(' / ');
  };

  // Get total class breakdown
  const finalClassLevels = getClassLevelsAtLevel(12);

  return (
    <div className="build-viewer bg3">
      <div className="build-viewer-header">
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back
        </button>
        <div className="build-title">
          <h2>{build.name}</h2>
          <div className="build-meta">
            <span className="race">{build.subrace || build.race}</span>
            <span className="separator">•</span>
            <span className="background">{build.background}</span>
            <span className="separator">•</span>
            <span className="classes">{formatClassLevels(finalClassLevels)}</span>
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

      <p className="build-description">{build.description}</p>

      {build.tags && build.tags.length > 0 && (
        <div className="build-tags">
          {build.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {build.difficulty && (
            <span className={`tag difficulty ${build.difficulty.toLowerCase()}`}>{build.difficulty}</span>
          )}
        </div>
      )}

      {onLevelChange && (
        <div className="level-selector">
          <label>Current Level:</label>
          <input
            type="range"
            min="1"
            max="12"
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
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Starting Stats
        </button>
      </div>

      {activeTab === 'progression' && (
        <div className="progression-view">
          {build.progression.map((levelData) => {
            const isCurrentLevel = levelData.characterLevel === currentLevel;
            const isPastLevel = levelData.characterLevel < currentLevel;
            
            return (
              <div
                key={levelData.characterLevel}
                className={`level-row ${isCurrentLevel ? 'current' : ''} ${isPastLevel ? 'completed' : ''}`}
                onClick={() => onLevelChange?.(levelData.characterLevel)}
              >
                <div className="level-number">
                  {isPastLevel && <span className="check">✓</span>}
                  Lv {levelData.characterLevel}
                </div>
                <div className="level-content">
                  <div className="class-levels">
                    {formatClassLevels(levelData.classLevels)}
                  </div>
                  
                  {levelData.feat && (
                    <div className="feat">
                      <span className="feat-label">Feat:</span> {levelData.feat}
                      {levelData.abilityScoreImprovement && (
                        <span className="asi">
                          {Object.entries(levelData.abilityScoreImprovement)
                            .map(([stat, val]) => `+${val} ${stat.slice(0, 3).toUpperCase()}`)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {levelData.spellsLearned && levelData.spellsLearned.length > 0 && (
                    <div className="spells-learned">
                      <span className="spells-label">Spells:</span> {levelData.spellsLearned.join(', ')}
                    </div>
                  )}
                  
                  {levelData.notes && (
                    <div className="level-notes">{levelData.notes}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="stats-view">
          <div className="stats-section">
            <h3>Ability Scores</h3>
            <div className="ability-scores">
              {Object.entries(build.abilityScores).map(([stat, value]) => (
                <div key={stat} className="ability-score">
                  <span className="stat-name">{stat}</span>
                  <span className="stat-value">{value}</span>
                  <span className="stat-modifier">
                    {value >= 10 ? '+' : ''}{Math.floor((value - 10) / 2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h3>Race: {build.subrace || build.race}</h3>
            <p>{raceInfo?.description}</p>
            {raceInfo?.traits && (
              <div className="traits">
                <strong>Racial Traits:</strong> {raceInfo.traits.join(', ')}
              </div>
            )}
          </div>

          <div className="stats-section">
            <h3>Background: {build.background}</h3>
            <p>{backgroundInfo?.description}</p>
            {backgroundInfo?.skillProficiencies && (
              <div className="skills">
                <strong>Skill Proficiencies:</strong> {backgroundInfo.skillProficiencies.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
