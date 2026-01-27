import { useState } from 'react';
import type { BG3Build } from '../types';
import type { CharacterBuild } from '../../../types';
import { getRace } from '../data/character/races';
import { getBackground } from '../data/character/backgrounds';
import { getGearInfo } from '../data/gear';
import { GearTooltip } from './GearTooltip';
import { KeywordText } from './KeywordText';
import { MyBuildsPanel, getAvatarForBuild } from './MyBuildsPanel';
import './BuildViewer.css';

interface TrackedBG3Build extends CharacterBuild {
  data: {
    buildId: string;
    currentLevel: number;
  };
}

interface BuildViewerProps {
  build: BG3Build;
  onBack: () => void;
  currentLevel?: number;
  onLevelChange?: (level: number) => void;
  onTrackBuild?: (build: BG3Build) => void;
  isTracked?: boolean;
  trackedBuilds?: TrackedBG3Build[];
  onSelectTrackedBuild?: (buildId: string, level: number) => void;
  onDeleteTrackedBuild?: (id: string) => void;
  getBuildById?: (id: string) => BG3Build | undefined;
}

function GearItem({ name }: { name: string }) {
  const [hasIcon, setHasIcon] = useState(true);
  const info = getGearInfo(name);

  return (
    <GearTooltip gearName={name}>
      <span className="gear-item">
        {info?.iconPath && hasIcon && (
          <img
            className="gear-item-icon"
            src={info.iconPath}
            alt={name}
            onError={() => setHasIcon(false)}
          />
        )}
        <span className="gear-item-name">{name}</span>
      </span>
    </GearTooltip>
  );
}

export function BuildViewer({ 
  build, 
  onBack, 
  currentLevel = 1, 
  onLevelChange, 
  onTrackBuild, 
  isTracked,
  trackedBuilds = [],
  onSelectTrackedBuild,
  onDeleteTrackedBuild,
  getBuildById,
}: BuildViewerProps) {
  const [activeTab, setActiveTab] = useState<'progression' | 'stats' | 'gear'>('progression');

  const showPartyBar = trackedBuilds.length > 0 && onSelectTrackedBuild && onDeleteTrackedBuild && getBuildById;

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
    <>
      {showPartyBar && (
        <MyBuildsPanel
          trackedBuilds={trackedBuilds}
          currentBuildId={build.id}
          onSelectBuild={onSelectTrackedBuild}
          onDeleteBuild={onDeleteTrackedBuild}
          getBuildById={getBuildById}
        />
      )}
      <div className={`build-viewer bg3 ${showPartyBar ? 'has-party-bar' : ''}`}>
      <div className="build-viewer-header">
        {/* <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back
        </button> */}
        {getAvatarForBuild(build) && (
          <img 
            src={getAvatarForBuild(build)!} 
            alt="" 
            className="build-avatar"
          />
        )}
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

      <p className="build-description"><KeywordText text={build.description} /></p>

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
        {build.gearRecommendations && build.gearRecommendations.length > 0 && (
          <button
            className={`tab ${activeTab === 'gear' ? 'active' : ''}`}
            onClick={() => setActiveTab('gear')}
          >
            Gear
          </button>
        )}
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
                      <span className="feat-label">Feat:</span> <KeywordText text={levelData.feat} />
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
                      <span className="spells-label">Spells:</span> <KeywordText text={levelData.spellsLearned.join(', ')} />
                    </div>
                  )}
                  
                  {levelData.notes && (
                    <div className="level-notes"><KeywordText text={levelData.notes} /></div>
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
            {raceInfo?.description && <p><KeywordText text={raceInfo.description} /></p>}
            {raceInfo?.traits && (
              <div className="traits">
                <strong>Racial Traits:</strong> {raceInfo.traits.join(', ')}
              </div>
            )}
          </div>

          <div className="stats-section">
            <h3>Background: {build.background}</h3>
            {backgroundInfo?.description && <p><KeywordText text={backgroundInfo.description} /></p>}
            {backgroundInfo?.skillProficiencies && (
              <div className="skills">
                <strong>Skill Proficiencies:</strong> {backgroundInfo.skillProficiencies.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'gear' && build.gearRecommendations && (
        <div className="gear-view">
          <p className="gear-intro">Recommended gear for this build. Hover over items with tooltips for details.</p>
          <div className="gear-slots">
            {build.gearRecommendations.map((rec) => (
              <div key={rec.slot} className="gear-slot">
                <div className="slot-name">{rec.slot}</div>
                <div className="slot-items">
                  {rec.items.map((item, idx) => (
                    <span key={item}>
                      <GearItem name={item} />
                      {idx < rec.items.length - 1 && <span className="item-separator"> / </span>}
                    </span>
                  ))}
                </div>
                {rec.notes && <div className="slot-notes"><KeywordText text={rec.notes} /></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
