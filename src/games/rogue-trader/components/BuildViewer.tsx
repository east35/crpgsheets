import { useState } from 'react';
import type { BuildGuide, CompanionName } from '../types';
import type { CharacterBuild } from '../../../types';
import { ARCHETYPE_DISPLAY_NAMES, GEAR_SLOT_LABELS } from '../types';
import { TalentTooltip } from './TalentTooltip';
import { GearTooltip } from './GearTooltip';
import { ArchetypeTooltip } from './ArchetypeTooltip';
import { KeywordText } from './KeywordText';
import { PartyBar, type PartyMember } from '../../../components/PartyBar';
import { COMPANIONS } from '../data/companions';
import './BuildViewer.css';

interface TrackedRTBuild extends CharacterBuild {
  data: {
    guideId: string;
    companion: CompanionName;
    currentLevel: number;
  };
}

interface BuildViewerProps {
  build: BuildGuide;
  onBack: () => void;
  currentLevel?: number;
  onLevelChange?: (level: number) => void;
  onTrackBuild?: (build: BuildGuide) => void;
  isTracked?: boolean;
  trackedBuilds?: TrackedRTBuild[];
  onSelectTrackedBuild?: (guideId: string, level: number) => void;
  onDeleteTrackedBuild?: (id: string) => void;
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
}: BuildViewerProps) {
  const [activeTab, setActiveTab] = useState<'progression' | 'gear'>('progression');
  
  const archetypePath = build.archetypePath;
  const showPartyBar = trackedBuilds.length > 0 && onSelectTrackedBuild && onDeleteTrackedBuild;

  const partyMembers: PartyMember[] = [];
  for (const tracked of trackedBuilds) {
    const companion = COMPANIONS[tracked.data.companion];
    partyMembers.push({
      id: tracked.id,
      buildId: tracked.data.guideId,
      name: `${tracked.data.companion}`,
      level: tracked.data.currentLevel || 1,
      avatarUrl: companion?.portraitUrl || null,
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
    return false; // Exemplar can't be "completed" in this sense
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
      <div className="build-viewer-header">
        {/* <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back
        </button> */}
        {COMPANIONS[build.companion]?.portraitUrl && (
          <img 
            src={COMPANIONS[build.companion].portraitUrl} 
            alt="" 
            className="build-avatar"
          />
        )}
        <div className="build-title">
          <h2>{build.companion}: {build.buildName}</h2>
          <div className="archetype-path">
            <ArchetypeTooltip archetype={archetypePath.base} tier="base" />
            <span className="arrow">→</span>
            <ArchetypeTooltip archetype={archetypePath.advanced} tier="advanced" />
            <span className="arrow">→</span>
            <ArchetypeTooltip archetype={archetypePath.exemplar} tier="exemplar" />
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
          {/* Base Tier Accordion */}
          <div className="tier-accordion base">
            <button 
              className={`tier-accordion-header base ${isTierCompleted('base') ? 'completed' : ''}`}
              onClick={() => toggleTier('base')}
            >
              <span className="tier-accordion-icon">{expandedTiers.base ? '▼' : '▶'}</span>
              <span className="tier-accordion-title">
                {ARCHETYPE_DISPLAY_NAMES[archetypePath.base]} (Levels 1-15)
              </span>
              {isTierCompleted('base') && <span className="tier-completed-badge">✓ Complete</span>}
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
              <span className="tier-accordion-icon">{expandedTiers.advanced ? '▼' : '▶'}</span>
              <span className="tier-accordion-title">
                {ARCHETYPE_DISPLAY_NAMES[archetypePath.advanced]} (Levels 16-35)
              </span>
              {isTierCompleted('advanced') && <span className="tier-completed-badge">✓ Complete</span>}
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
              <span className="tier-accordion-icon">{expandedTiers.exemplar ? '▼' : '▶'}</span>
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
    </>
  );
}
