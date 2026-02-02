import { useState } from 'react';
import { NavArrowDown, NavArrowRight, Check, NavArrowLeft } from 'iconoir-react';
import type { BuildGuide, CompanionName } from '../types';
import type { CharacterBuild } from '../../../types';
import { ARCHETYPE_DISPLAY_NAMES, GEAR_SLOT_LABELS } from '../types';
import { TalentTooltip } from './TalentTooltip';
import { GearTooltip } from './GearTooltip';
import { ArchetypeTooltip } from './ArchetypeTooltip';
import { KeywordText } from './KeywordText';
import { PartyBar, type PartyMember } from '../../../components/PartyBar';
import { ImageLightbox } from '../../../components/ImageLightbox';
import { AvatarUpload, useCustomAvatar, useCustomAvatars } from '../../../components/AvatarUpload';
import { COMPANIONS } from '../data/companions';
import '../../../components/MobileStickyButton.css';
import './BuildViewer.css';

interface TrackedRTBuild extends CharacterBuild {
  data: {
    guideId: string;
    companion: CompanionName;
    currentLevel: number;
    customName?: string;
  };
}

interface BuildViewerProps {
  build: BuildGuide;
  onBack: () => void;
  currentLevel?: number;
  onLevelChange?: (level: number) => void;
  onTrackBuild?: (build: BuildGuide) => void;
  onUntrackBuild?: (guideId: string) => void;
  isTracked?: boolean;
  trackedBuilds?: TrackedRTBuild[];
  onSelectTrackedBuild?: (guideId: string, level: number) => void;
  onDeleteTrackedBuild?: (id: string) => void;
  gameId?: string;
  profileId?: string;
  customName?: string;
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
  gameId = 'rogue-trader',
  profileId = '',
  customName,
}: BuildViewerProps) {
  void _onUntrackBuild;
  const [activeTab, setActiveTab] = useState<'progression' | 'gear'>('progression');
  const [showLightbox, setShowLightbox] = useState(false);
  const [pendingLevelChange, setPendingLevelChange] = useState<number | null>(null);
  
  // Check if this is a player character build (RogueTrader, not a companion)
  const isPlayerBuild = build.companion === 'RogueTrader';
  const customAvatar = useCustomAvatar(isPlayerBuild ? build.id : undefined);
  
  // Get all player character build IDs for fetching their custom avatars
  const playerBuildIds = trackedBuilds
    .filter(t => t.data.companion === 'RogueTrader')
    .map(t => t.data.guideId);
  const customAvatarsMap = useCustomAvatars(playerBuildIds);
  
  const archetypePath = build.archetypePath;
  const showPartyBar = trackedBuilds.length > 0 && onSelectTrackedBuild && onDeleteTrackedBuild;
  
  // Get avatar URL - custom avatar takes precedence for player builds
  const companionAvatar = COMPANIONS[build.companion]?.portraitUrl;
  const avatarUrl = (isPlayerBuild && customAvatar?.imageData) || companionAvatar;

  const partyMembers: PartyMember[] = [];
  for (const tracked of trackedBuilds) {
    const companion = COMPANIONS[tracked.data.companion];
    const isPlayer = tracked.data.companion === 'RogueTrader';
    const playerCustomAvatar = isPlayer ? (customAvatarsMap as Record<string, string>)[tracked.data.guideId] : null;
    // Use custom name for player character, otherwise use companion name
    const displayName = isPlayer
      ? (tracked.data.customName || 'Rogue Trader')
      : tracked.data.companion;
    partyMembers.push({
      id: tracked.id,
      buildId: tracked.data.guideId,
      name: displayName,
      level: tracked.data.currentLevel || 1,
      avatarUrl: companion?.portraitUrl || null,
      isPlayerCharacter: isPlayer,
      customAvatarUrl: playerCustomAvatar || null,
    });
  }

  // Determine which tier the current level is in
  const getCurrentTier = (): 'base' | 'advanced' | 'exemplar' => {
    if (currentLevel <= 15) return 'base';
    if (currentLevel <= 35) return 'advanced';
    return 'exemplar';
  };

  // Check if a tier is completed (all levels in that tier are below current level)
  const isTierCompleted = (tier: 'base' | 'advanced' | 'exemplar'): boolean => {
    if (tier === 'base') return currentLevel > 15;
    if (tier === 'advanced') return currentLevel > 35;
    return false;
  };

  // Initialize accordion state: expand current tier, collapse completed tiers
  const currentTier = getCurrentTier();
  const [expandedTiers, setExpandedTiers] = useState<Record<string, boolean>>({
    base: currentTier === 'base' || !isTierCompleted('base'),
    advanced: currentTier === 'advanced',
    exemplar: currentTier === 'exemplar',
  });

  const toggleTier = (tier: 'base' | 'advanced' | 'exemplar') => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  // Group levels by tier
  const baseLevels = build.progression.filter(l => l.level >= 1 && l.level <= 15);
  const advancedLevels = build.progression.filter(l => l.level >= 16 && l.level <= 35);
  const exemplarLevels = build.progression.filter(l => l.level >= 36 && l.level <= 55);

  // Handle level row click - show confirmation if different from current level
  const handleLevelClick = (level: number) => {
    if (level === currentLevel) return;
    if (!isTracked) {
      const confirmed = window.confirm('Track this build to update levels. Add to Party now?');
      if (confirmed) {
        onTrackBuild?.(build);
      }
      return;
    }
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
        <PartyBar
          members={partyMembers}
          currentBuildId={build.id}
          onSelectMember={onSelectTrackedBuild}
          onDeleteMember={onDeleteTrackedBuild}
        />
      )}
      <div className={`build-viewer ${showPartyBar ? 'has-party-bar' : ''}`}>
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
              {isTracked && <div className="build-avatar-level">{currentLevel}</div>}
            </div>
          ) : isPlayerBuild && profileId ? (
            <div className="build-avatar-wrapper">
              <AvatarUpload
                buildId={build.id}
                gameId={gameId}
                profileId={profileId}
                className="build-avatar-upload"
              />
              {isTracked && <div className="build-avatar-level">{currentLevel}</div>}
            </div>
          ) : null}
          <div className="build-title">
            <h2>{customName || build.companion}: {build.buildName}</h2>
            <div className="archetype-path">
              <ArchetypeTooltip archetype={archetypePath.base} tier="base" />
              <span className="arrow">→</span>
              <ArchetypeTooltip archetype={archetypePath.advanced} tier="advanced" />
              <span className="arrow">→</span>
              <ArchetypeTooltip archetype={archetypePath.exemplar} tier="exemplar" />
            </div>
            <div className="skill-options">
              <strong>Skills:</strong> <KeywordText text={build.skillOptions.join(', ')} />
            </div>

            {build.description && (
              <p className="build-description"><KeywordText text={build.description} /></p>
            )}
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

      {build.videoUrl && (
        <a href={build.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">
          Watch Video Guide
        </a>
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
          {/* Base Tier Accordion */}
          <div className="tier-accordion base">
            <button 
              className={`tier-accordion-header base ${isTierCompleted('base') ? 'completed' : ''}`}
              onClick={() => toggleTier('base')}
            >
              <span className="tier-accordion-icon">{expandedTiers.base ? <NavArrowDown width={14} height={14} /> : <NavArrowRight width={14} height={14} />}</span>
              <span className="tier-accordion-title">
                {ARCHETYPE_DISPLAY_NAMES[archetypePath.base]} (Levels 1-15)
              </span>
              {isTierCompleted('base') && <span className="tier-completed-badge"><Check width={12} height={12} /> Complete</span>}
            </button>
            {expandedTiers.base && (
              <div className="tier-accordion-content">
                {baseLevels.map((levelData) => {
                  const isCurrentLevel = levelData.level === currentLevel;
                  const isPastLevel = levelData.level < currentLevel;
                  return (
                    <div
                      key={levelData.level}
                      className={`level-row base ${isCurrentLevel ? 'current' : ''} ${isPastLevel ? 'completed' : ''}`}
                      onClick={() => handleLevelClick(levelData.level)}
                    >
                      <div className="level-number">
                        {isPastLevel && <span className="check"><Check width={12} height={12} /></span>}
                        Lv {levelData.level}
                      </div>
                      <div className="level-content">
                        {levelData.talents.length > 0 && (
                          <div className="talents">
                            {levelData.talents.map((talent: string, i: number) => (
                              <TalentTooltip key={i} talentName={talent}>
                                <span className="talent">{talent}</span>
                              </TalentTooltip>
                            ))}
                          </div>
                        )}
                        {levelData.statIncrease && (
                          <div className="stat-increase">+{levelData.statIncrease}</div>
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
          </div>

          {/* Advanced Tier Accordion */}
          <div className="tier-accordion advanced">
            <button 
              className={`tier-accordion-header advanced ${isTierCompleted('advanced') ? 'completed' : ''}`}
              onClick={() => toggleTier('advanced')}
            >
              <span className="tier-accordion-icon">{expandedTiers.advanced ? <NavArrowDown width={14} height={14} /> : <NavArrowRight width={14} height={14} />}</span>
              <span className="tier-accordion-title">
                {ARCHETYPE_DISPLAY_NAMES[archetypePath.advanced]} (Levels 16-35)
              </span>
              {isTierCompleted('advanced') && <span className="tier-completed-badge"><Check width={12} height={12} /> Complete</span>}
            </button>
            {expandedTiers.advanced && (
              <div className="tier-accordion-content">
                {advancedLevels.map((levelData) => {
                  const isCurrentLevel = levelData.level === currentLevel;
                  const isPastLevel = levelData.level < currentLevel;
                  return (
                    <div
                      key={levelData.level}
                      className={`level-row advanced ${isCurrentLevel ? 'current' : ''} ${isPastLevel ? 'completed' : ''}`}
                      onClick={() => handleLevelClick(levelData.level)}
                    >
                      <div className="level-number">
                        {isPastLevel && <span className="check"><Check width={12} height={12} /></span>}
                        Lv {levelData.level}
                      </div>
                      <div className="level-content">
                        {levelData.talents.length > 0 && (
                          <div className="talents">
                            {levelData.talents.map((talent: string, i: number) => (
                              <TalentTooltip key={i} talentName={talent}>
                                <span className="talent">{talent}</span>
                              </TalentTooltip>
                            ))}
                          </div>
                        )}
                        {levelData.statIncrease && (
                          <div className="stat-increase">+{levelData.statIncrease}</div>
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
          </div>

          {/* Exemplar Tier Accordion */}
          <div className="tier-accordion exemplar">
            <button 
              className={`tier-accordion-header exemplar`}
              onClick={() => toggleTier('exemplar')}
            >
              <span className="tier-accordion-icon">{expandedTiers.exemplar ? <NavArrowDown width={14} height={14} /> : <NavArrowRight width={14} height={14} />}</span>
              <span className="tier-accordion-title">
                {ARCHETYPE_DISPLAY_NAMES[archetypePath.exemplar]} (Levels 36-55)
              </span>
            </button>
            {expandedTiers.exemplar && (
              <div className="tier-accordion-content">
                {exemplarLevels.map((levelData) => {
                  const isCurrentLevel = levelData.level === currentLevel;
                  const isPastLevel = levelData.level < currentLevel;
                  return (
                    <div
                      key={levelData.level}
                      className={`level-row exemplar ${isCurrentLevel ? 'current' : ''} ${isPastLevel ? 'completed' : ''}`}
                      onClick={() => handleLevelClick(levelData.level)}
                    >
                      <div className="level-number">
                        {isPastLevel && <span className="check"><Check width={12} height={12} /></span>}
                        Lv {levelData.level}
                      </div>
                      <div className="level-content">
                        {levelData.talents.length > 0 && (
                          <div className="talents">
                            {levelData.talents.map((talent: string, i: number) => (
                              <TalentTooltip key={i} talentName={talent}>
                                <span className="talent">{talent}</span>
                              </TalentTooltip>
                            ))}
                          </div>
                        )}
                        {levelData.statIncrease && (
                          <div className="stat-increase">+{levelData.statIncrease}</div>
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
    {showLightbox && avatarUrl && (
      <ImageLightbox
        src={avatarUrl}
        alt={`${build.companion} portrait`}
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
            Set {build.companion === 'RogueTrader' ? 'Rogue Trader' : build.companion} to <strong>Level {pendingLevelChange}</strong>?
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
