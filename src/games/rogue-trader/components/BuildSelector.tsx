import { useState } from 'react';
import { Check, EditPencil, NavArrowRight } from 'iconoir-react';
import type { BuildGuide, CompanionName } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { COMPANIONS } from '../data/companions';
import { getBuildsForCompanion, getCompanionsWithBuilds } from '../data/builds';
import { BuildSelectorModal } from './BuildSelectorModal';
import './BuildSelector.css';

export type BuildType = 'companion' | 'rogueTrader';

interface TrackedBuildInfo {
  guideId: string;
  companion: CompanionName;
  currentLevel: number;
}

interface BuildSelectorProps {
  onSelectBuild: (build: BuildGuide) => void;
  onCreateCustomBuild?: (companion: CompanionName) => void;
  buildType: BuildType;
  trackedBuilds?: TrackedBuildInfo[];
  onSelectTrackedBuild?: (guideId: string, level: number) => void;
}

export function BuildSelector({ onSelectBuild, onCreateCustomBuild, buildType, trackedBuilds = [], onSelectTrackedBuild }: BuildSelectorProps) {
  const [modalCompanion, setModalCompanion] = useState<CompanionName | null>(null);

  // Get tracked build for a specific companion
  const getTrackedBuildForCompanion = (companion: CompanionName): TrackedBuildInfo | undefined => {
    return trackedBuilds.find(tb => tb.companion === companion);
  };

  const allCompanionsWithBuilds = getCompanionsWithBuilds();
  
  // Filter based on build type
  const companionsWithBuilds: CompanionName[] = buildType === 'companion'
    ? allCompanionsWithBuilds.filter((c): c is Exclude<CompanionName, 'RogueTrader'> => c !== 'RogueTrader')
    : allCompanionsWithBuilds.filter((c): c is 'RogueTrader' => c === 'RogueTrader');

  // Get companions without builds for "coming soon" section
  const allCompanions = Object.values(COMPANIONS);
  const companionsWithoutBuilds = buildType === 'companion'
    ? allCompanions.filter((c) => c.name !== 'RogueTrader' && !companionsWithBuilds.includes(c.name))
    : [];

  // Group builds by companion
  const buildsByCompanion = companionsWithBuilds.map((companion) => ({
    companion,
    info: COMPANIONS[companion],
    builds: getBuildsForCompanion(companion),
  }));

  const title = buildType === 'companion' ? 'Companion Builds' : 'Rogue Trader Builds';
  const subtitle = buildType === 'companion'
    ? 'Choose a companion build to view the level-by-level progression guide'
    : 'Choose a build for your Rogue Trader protagonist';

  // For Rogue Trader builds, show directly without expansion pattern
  if (buildType === 'rogueTrader') {
    const rtBuilds = buildsByCompanion.find(b => b.companion === 'RogueTrader');
    const trackedBuild = getTrackedBuildForCompanion('RogueTrader');
    
    return (
      <div className="build-selector">
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
        <p className="build-credit">
          Builds sourced from{' '}
          <a 
            href="https://docs.google.com/spreadsheets/d/1rskX4sYcNm6Wqt4rtm8EQqRR4__yrEuxCEzjwoKlHOY/edit?gid=1688447117#gid=1688447117" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Community Rogue Trader Unfair Builds & Resources
          </a>
        </p>

        <div className="builds-grid direct">
          {rtBuilds?.builds.map((build) => {
            const isTracked = trackedBuild?.guideId === build.id;
            return (
              <button
                key={build.id}
                className={`build-card ${isTracked ? 'tracked' : ''}`}
                onClick={() => onSelectBuild(build)}
              >
                {isTracked && (
                  <div className="build-card-tracked-badge">
                    <Check width={12} height={12} /> In Party (Lv {trackedBuild.currentLevel})
                  </div>
                )}
                <div className="build-name">{build.buildName}</div>
                <div className="build-path">
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
                  <div className="build-desc">{build.description}</div>
                )}
              </button>
            );
          })}
          {onCreateCustomBuild && (
            <button
              className="build-card custom-build-card"
              onClick={() => onCreateCustomBuild('RogueTrader')}
            >
              <div className="build-name">+ Custom Build</div>
              <div className="build-desc">Create your own Rogue Trader build</div>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Get the modal companion's builds
  const modalBuilds = modalCompanion ? getBuildsForCompanion(modalCompanion) : [];

  return (
    <div className="build-selector">
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
      <p className="build-credit">
        Builds sourced from{' '}
        <a 
          href="https://docs.google.com/spreadsheets/d/1rskX4sYcNm6Wqt4rtm8EQqRR4__yrEuxCEzjwoKlHOY/edit?gid=1688447117#gid=1688447117" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Community Rogue Trader Unfair Builds & Resources
        </a>
      </p>

      <div className="companion-list">
        {buildsByCompanion.map(({ companion, info, builds }) => {
          const trackedBuild = getTrackedBuildForCompanion(companion);
          const trackedGuide = trackedBuild ? builds.find(b => b.id === trackedBuild.guideId) : undefined;
          
          return (
            <div
              key={companion}
              className={`companion-section ${trackedBuild ? 'has-tracked' : ''}`}
            >
              {/* Companion/Build Card Layout */}
              <div className="companion-card-layout">
                {info.portraitUrl && (
                  <div className="companion-card-portrait-wrapper">
                    <img
                      src={info.portraitUrl}
                      alt={info.fullName}
                      className="companion-card-portrait"
                    />
                    {trackedBuild && (
                      <div className="companion-card-level-badge">{trackedBuild.currentLevel}</div>
                    )}
                  </div>
                )}
                <div className="companion-card-content">
                  <div className="companion-card-title">
                    {info.fullName}
                  </div>
                  <div className="companion-card-meta">
                    <span className="companion-card-origin">{info.origin}</span>
                    <span className="companion-card-separator">•</span>
                    <span className="companion-card-archetype">{ARCHETYPE_DISPLAY_NAMES[info.defaultArchetype]}</span>
                    <span className="companion-card-separator">•</span>
                    <span className="companion-card-role">{info.role}</span>
                  </div>
                  <div className="companion-card-desc">
                    {trackedGuide?.description || info.bio}
                  </div>
                </div>
              </div>

              {/* Build Preview Card - shows tracked build or neutral "select build" state */}
              {trackedBuild && trackedGuide && onSelectTrackedBuild ? (
                <div className="tracked-build-preview">
                  <div className="tracked-build-row">
                    <span className="tracked-badge"><Check width={12} height={12} /> In Party</span>
                  </div>
                  <div className="tracked-build-row">
                    <div className="tracked-build-info">
                      <span className="tracked-build-name">{trackedGuide.buildName}</span>
                      <span className="tracked-build-level">Lv {trackedBuild.currentLevel}</span>
                    </div>
                    <div className="tracked-build-actions">
                      <button
                        className="tracked-build-change-btn"
                        onClick={() => setModalCompanion(companion)}
                      >
                        All Builds
                      </button>
                      <button
                        className="tracked-build-edit-btn"
                        onClick={() => onSelectTrackedBuild(trackedBuild.guideId, trackedBuild.currentLevel)}
                      >
                        <EditPencil width={14} height={14} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="unselected-build-preview"
                  onClick={() => setModalCompanion(companion)}
                >
                  <div className="unselected-build-info">
                    <span className="unselected-badge">No Build Selected</span>
                    <span className="unselected-build-count">{builds.length} builds available</span>
                  </div>
                  <span className="unselected-build-action">
                    Select Build
                    <NavArrowRight width={14} height={14} />
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {companionsWithBuilds.length === 0 && (
        <div className="no-builds">
          <p>No build guides available yet.</p>
        </div>
      )}

      {companionsWithoutBuilds.length > 0 && (
        <div className="coming-soon">
          <h3>Coming Soon</h3>
          <p>Builds for other companions will be added.</p>
          <div className="companion-tags">
            {companionsWithoutBuilds.map((c) => (
              <span key={c.name} className="companion-tag">
                {c.fullName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Build Selection Modal */}
      {modalCompanion && (
        <BuildSelectorModal
          companion={modalCompanion}
          builds={modalBuilds}
          isOpen={!!modalCompanion}
          onClose={() => setModalCompanion(null)}
          onSelectBuild={onSelectBuild}
          onCreateCustomBuild={onCreateCustomBuild}
          trackedBuildId={getTrackedBuildForCompanion(modalCompanion)?.guideId}
          trackedLevel={getTrackedBuildForCompanion(modalCompanion)?.currentLevel}
        />
      )}
    </div>
  );
}
