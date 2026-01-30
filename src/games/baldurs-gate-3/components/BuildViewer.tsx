import { useState } from 'react';
import { Check, NavArrowLeft } from 'iconoir-react';
import type { BG3Build } from '../types';
import type { CharacterBuild } from '../../../types';
import { getRace } from '../data/character/races';
import { getBackground } from '../data/character/backgrounds';
import { getCsvGearImage } from '../data/gear';
import { GearTooltip } from './GearTooltip';
import { KeywordText } from './KeywordText';
import { MyBuildsPanel, getAvatarForBuild, getCompanionFromBuild } from './MyBuildsPanel';
import { ImageLightbox } from '../../../components/ImageLightbox';
import { AvatarUpload, useCustomAvatar } from '../../../components/AvatarUpload';
import '../../../components/MobileStickyButton.css';
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
  onUntrackBuild?: (buildId: string) => void;
  isTracked?: boolean;
  trackedBuilds?: TrackedBG3Build[];
  onSelectTrackedBuild?: (buildId: string, level: number) => void;
  onDeleteTrackedBuild?: (id: string) => void;
  getBuildById?: (id: string) => BG3Build | undefined;
  gameId?: string;
  profileId?: string;
  customName?: string;
}

function GearItem({ name }: { name: string }) {
  const [hasIcon, setHasIcon] = useState(true);
  const csvIcon = getCsvGearImage(name);
  const iconPath = csvIcon;

  return (
    <GearTooltip gearName={name}>
      <span className="gear-item">
        {iconPath && hasIcon && (
          <img
            className="gear-item-icon"
            src={iconPath}
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
  onUntrackBuild: _onUntrackBuild,
  isTracked,
  trackedBuilds = [],
  onSelectTrackedBuild,
  onDeleteTrackedBuild,
  getBuildById,
  gameId = 'baldurs-gate-3',
  profileId = '',
  customName,
}: BuildViewerProps) {
  void _onUntrackBuild;
  const [activeTab, setActiveTab] = useState<'progression' | 'stats' | 'gear'>('progression');
  const [showLightbox, setShowLightbox] = useState(false);
  const [pendingLevelChange, setPendingLevelChange] = useState<number | null>(null);

  const showPartyBar = trackedBuilds.length > 0 && onSelectTrackedBuild && onDeleteTrackedBuild && getBuildById;
  
  // Check if this is a player character build (not a companion)
  const isPlayerBuild = !getCompanionFromBuild(build);
  const customAvatar = useCustomAvatar(isPlayerBuild ? build.id : undefined);
  const avatarUrl = customAvatar?.imageData || getAvatarForBuild(build);

  const raceInfo = getRace(build.race);
  const backgroundInfo = getBackground(build.background);

  // Get current class levels at a given character level
  const getClassLevelsAtLevel = (level: number) => {
    const prog = build.progression.find(p => p.characterLevel === level);
    return prog?.classLevels || [];
  };

  // Calculate cumulative ability scores at a given level
  const getAbilityScoresAtLevel = (level: number) => {
    const scores = { ...build.abilityScores };
    for (const prog of build.progression) {
      if (prog.characterLevel <= level && prog.abilityScoreImprovement) {
        for (const [stat, bonus] of Object.entries(prog.abilityScoreImprovement)) {
          scores[stat as keyof typeof scores] += bonus;
        }
      }
    }
    return scores;
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
  const title = isPlayerBuild && customName ? `${customName}: ${build.name}` : build.name;

  // Handle level row click - show confirmation if different from current level
  const handleLevelClick = (level: number) => {
    if (level === currentLevel) return;
    setPendingLevelChange(level);
  };

  // Confirm level change
  const confirmLevelChange = () => {
    if (pendingLevelChange !== null) {
      onLevelChange?.(pendingLevelChange);
      setPendingLevelChange(null);
    }
  };

  // Cancel level change
  const cancelLevelChange = () => {
    setPendingLevelChange(null);
  };

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
      <button className="build-viewer-back-btn" onClick={onBack}>
        <NavArrowLeft width={20} height={20} />
        <span>Back</span>
      </button>
      <div className="build-viewer-header">
        {avatarUrl ? (
          <div className="build-avatar-wrapper">
            <button
              className="build-avatar-btn"
              onClick={() => setShowLightbox(true)}
              aria-label="View larger portrait"
            >
              <img
                src={avatarUrl}
                alt=""
                className="build-avatar"
              />
            </button>
            <div className="build-avatar-level">{currentLevel}</div>
          </div>
        ) : isPlayerBuild && profileId ? (
          <div className="build-avatar-wrapper">
            <AvatarUpload
              buildId={build.id}
              gameId={gameId}
              profileId={profileId}
              className="build-avatar-upload"
            />
            <div className="build-avatar-level">{currentLevel}</div>
          </div>
        ) : null}
        <div className="build-title">
          <h2>{title}</h2>
          <div className="build-meta">
            <span className="race">{build.subrace || build.race}</span>
            <span className="separator">•</span>
            <span className="background">{build.background}</span>
            <span className="separator">•</span>
            <span className="classes">{formatClassLevels(finalClassLevels)}</span>
          </div>
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
          <p className="build-description"><KeywordText text={build.description} /></p>
        </div>

        {/* Desktop Add to Party button */}
        {onTrackBuild && !isTracked && (
          <button
            className="btn btn-primary add-to-party-desktop"
            onClick={() => onTrackBuild(build)}
          >
            Add to Party
          </button>
        )}
      </div>

      {/* Mobile floating Add to Party button */}
      {onTrackBuild && !isTracked && (
        <div className={`add-to-party-mobile ${showPartyBar ? 'above-party-bar' : ''}`}>
          <button
            className="btn btn-primary"
            onClick={() => onTrackBuild(build)}
          >
            Add to Party
          </button>
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
                onClick={() => handleLevelClick(levelData.characterLevel)}
              >
                <div className="level-number">
                  {isPastLevel && <span className="check"><Check width={12} height={12} /></span>}
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
                
                {levelData.abilityScoreImprovement && (
                  <div className="level-stat-changes">
                    {(() => {
                      const newScores = getAbilityScoresAtLevel(levelData.characterLevel);
                      return Object.entries(levelData.abilityScoreImprovement).map(([stat, _bonus]) => {
                        const newValue = newScores[stat as keyof typeof newScores];
                        const modifier = Math.floor((newValue - 10) / 2);
                        return (
                          <div key={stat} className="stat-change-item">
                            <span className="stat-change-name">{stat.slice(0, 3).toUpperCase()}</span>
                            <span className="stat-change-value">{newValue}</span>
                            <span className="stat-change-mod">{modifier >= 0 ? '+' : ''}{modifier}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
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
    {showLightbox && avatarUrl && (
      <ImageLightbox
        src={avatarUrl}
        alt={`${build.name} portrait`}
        onClose={() => setShowLightbox(false)}
      >
        {isPlayerBuild && profileId && (
          <AvatarUpload
            buildId={build.id}
            gameId={gameId}
            profileId={profileId}
          />
        )}
      </ImageLightbox>
    )}
    {pendingLevelChange !== null && (
      <div className="level-confirm-overlay" onClick={cancelLevelChange}>
        <div className="level-confirm-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="level-confirm-title">Change Level?</div>
          <div className="level-confirm-message">
            Set {build.name} to <strong>Level {pendingLevelChange}</strong>?
          </div>
          <div className="level-confirm-actions">
            <button className="level-confirm-cancel" onClick={cancelLevelChange}>
              Cancel
            </button>
            <button className="level-confirm-ok" onClick={confirmLevelChange}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
