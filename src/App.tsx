import { useState, useEffect } from 'react';
import type { Game, CharacterBuild, Profile } from './types';
import type { BuildGuide, CompanionName } from './games/rogue-trader/types';
import type { BG3Build, CompanionInfo as BG3CompanionInfo } from './games/baldurs-gate-3/types';
import { Header } from './components/Header';
import { GameLibrary } from './components/GameLibrary';
import { BuildList } from './components/BuildList';
// Rogue Trader imports
import { BuildSelector as RTBuildSelector } from './games/rogue-trader/components/BuildSelector';
import { BuildViewer as RTBuildViewer } from './games/rogue-trader/components/BuildViewer';
import { CustomBuildEditor, type CustomBuildData } from './games/rogue-trader/components/CustomBuildEditor';
import { CompanionDetailScreen as RTCompanionDetailScreen } from './games/rogue-trader/components/CompanionDetailScreen';
import { COMPANIONS } from './games/rogue-trader/data/companions';
import { getBuildById as getRTBuildById, getBuildsForCompanion as getRTBuildsForCompanion } from './games/rogue-trader/data/builds';
// BG3 imports
import { BuildSelector as BG3BuildSelector } from './games/baldurs-gate-3/components/BuildSelector';
import { BuildViewer as BG3BuildViewer } from './games/baldurs-gate-3/components/BuildViewer';
import { CompanionDetailScreen as BG3CompanionDetailScreen } from './games/baldurs-gate-3/components/CompanionDetailScreen';
import { getBuild as getBG3BuildById, getAllBuilds as getAllBG3Builds } from './games/baldurs-gate-3/data/builds';
import { DataAuditView } from './components/DataAuditView';
import { usePersistedBuilds } from './hooks/usePersistedBuilds';
import { useProfiles } from './hooks/useProfiles';
import { getGame } from './games/registry';
import { getProfileSelectionAction } from './utils/profileSelection';
import './App.css';

type View =
  | 'game-select'
  | 'companion-builds'
  | 'rogue-trader-builds'
  | 'rt-companion-detail'
  | 'build-viewer'
  | 'my-builds'
  | 'build-editor'
  | 'custom-build-editor'
  | 'bg3-builds'
  | 'bg3-companion-builds'
  | 'bg3-companion-detail'
  | 'data-audit';

const LAST_GAME_KEY = 'crpgsheets_last_game';

function App() {
  const enableDataAudit = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DATA_AUDIT === 'true';
  // Initialize from localStorage synchronously
  const [currentGame, setCurrentGame] = useState<Game | null>(() => {
    const lastGameId = localStorage.getItem(LAST_GAME_KEY);
    return lastGameId ? getGame(lastGameId) || null : null;
  });
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>(() => {
    const lastGameId = localStorage.getItem(LAST_GAME_KEY);
    if (lastGameId) {
      return lastGameId === 'baldurs-gate-3' ? 'bg3-builds' : 'my-builds';
    }
    return 'game-select';
  });
  const [selectedGuide, setSelectedGuide] = useState<BuildGuide | null>(null);
  const [selectedRTCompanion, setSelectedRTCompanion] = useState<CompanionName | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [activeTrackedBuildId, setActiveTrackedBuildId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customBuildCompanion, setCustomBuildCompanion] = useState<CompanionName | null>(null);
  const [selectedBG3Build, setSelectedBG3Build] = useState<BG3Build | null>(null);
  const [selectedBG3Companion, setSelectedBG3Companion] = useState<BG3CompanionInfo | null>(null);
  const [bg3PreviousView, setBg3PreviousView] = useState<'bg3-builds' | 'bg3-companion-builds' | 'bg3-companion-detail'>('bg3-builds');
  // Track navigation context: did we enter detail view from Party or Builds?
  const [navContext, setNavContext] = useState<'party' | 'builds'>('builds');

  const { 
    profiles, 
    profilesReady,
    createProfile, 
    updateProfile, 
    deleteProfile, 
    duplicateProfile,
    ensureDefaultProfile,
    exportProfile,
    importProfile,
    clearAllData,
  } = useProfiles(currentGame?.id || '');

  const { builds, addBuild, updateBuild, deleteBuild } = usePersistedBuilds(
    currentGame?.id || '', 
    currentProfile?.id || null
  );

  // Ensure a default profile exists when game is selected
  useEffect(() => {
    const action = getProfileSelectionAction({
      currentGameId: currentGame?.id ?? null,
      profilesReady,
      profiles,
      currentProfile,
    });

    if (action.type === 'clear') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentProfile(null);
      return;
    }

    if (action.type === 'ensureDefault') {
      ensureDefaultProfile().then(profile => {
        setCurrentProfile(profile);
      });
      return;
    }

    if (action.type === 'set') {
      setCurrentProfile(action.profile);
    }
  }, [currentGame, profilesReady, profiles, currentProfile, ensureDefaultProfile]);

  useEffect(() => {
    if (view === 'data-audit' && !enableDataAudit) {
      if (!currentGame) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView('game-select');
      } else {
        setView(currentGame.id === 'baldurs-gate-3' ? 'bg3-builds' : 'my-builds');
      }
    }
  }, [view, enableDataAudit, currentGame]);

  // Check if a guide is already being tracked
  const isGuideTracked = (guideId: string) => {
    return builds.some((b) => {
      const data = b.data as { guideId?: string } | undefined;
      return data?.guideId === guideId;
    });
  };

  // Check if a companion already has any build tracked (RT)
  const getTrackedBuildForCompanion = (companion: CompanionName) => {
    return builds.find((b) => {
      const data = b.data as { companion?: string } | undefined;
      return data?.companion === companion;
    });
  };

  const handleTrackBuild = async (guide: BuildGuide) => {
    if (isGuideTracked(guide.id)) return;

    // If companion already has a build tracked, show confirmation
    const existingBuild = getTrackedBuildForCompanion(guide.companion);
    if (existingBuild) {
      const existingData = existingBuild.data as { buildName?: string; currentLevel?: number } | undefined;
      const confirmed = window.confirm(
        `${guide.companion} already has a tracked build "${existingData?.buildName || existingBuild.name}" at level ${existingData?.currentLevel || 1}.\n\nReplacing it will delete all tracked progress for that build.\n\nContinue with the new build?`
      );
      if (!confirmed) return;
      await deleteBuild(existingBuild.id);
    }

    // For player character (RogueTrader), prompt for custom name
    let customName: string | undefined;
    if (guide.companion === 'RogueTrader') {
      const name = window.prompt('Enter a name for your Rogue Trader:', 'Rogue Trader');
      if (name === null) return; // User cancelled
      customName = name.trim() || 'Rogue Trader';
    }

    const newBuild = await addBuild(
      guide.buildName,
      {
        guideId: guide.id,
        companion: guide.companion,
        buildName: guide.buildName,
        customName: customName,
        currentLevel: 1,
        archetypePath: guide.archetypePath,
      },
      guide.description
    );
    setActiveTrackedBuildId(newBuild.id);
  };

  const handleUntrackRTBuild = (guideId: string) => {
    const trackedBuild = builds.find((b) => {
      const data = b.data as { guideId?: string } | undefined;
      return data?.guideId === guideId;
    });
    if (trackedBuild) {
      deleteBuild(trackedBuild.id);
    }
  };

  const handleSelectGame = (game: Game) => {
    setCurrentGame(game);
    setCurrentProfile(null); // Reset profile, will be set by useEffect
    // Persist last selected game
    localStorage.setItem(LAST_GAME_KEY, game.id);
    // Set default view based on game
    if (game.id === 'baldurs-gate-3') {
      setView('bg3-builds');
    } else {
      setView('my-builds');
    }
  };

  const handleGameChange = () => {
    setCurrentGame(null);
    setCurrentProfile(null);
    setView('game-select');
    setSelectedGuide(null);
  };

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
  };

  const handleRenameProfile = async (id: string, name: string) => {
    await updateProfile(id, { name });
  };

  const handleSelectGuide = (guide: BuildGuide) => {
    setSelectedGuide(guide);
    setCurrentLevel(1);
    setNavContext('builds');
    setView('build-viewer');
    window.scrollTo(0, 0);
  };

  const handleBackToGuides = () => {
    // Return to Party if we came from Party, otherwise return to appropriate Builds view
    if (navContext === 'party') {
      setSelectedGuide(null);
      setActiveTrackedBuildId(null);
      setView('my-builds');
    } else {
      const returnView = selectedGuide?.companion === 'RogueTrader' ? 'rogue-trader-builds' : 'companion-builds';
      setSelectedGuide(null);
      setActiveTrackedBuildId(null);
      setView(returnView);
    }
  };

  const handleViewMyBuilds = () => {
    setView('my-builds');
  };

  const handleViewCompanionBuilds = () => {
    setSelectedRTCompanion(null);
    setView('companion-builds');
  };

  const handleSelectBuild = (build: CharacterBuild) => {
    const data = build.data as { guideId?: string; buildId?: string; currentLevel?: number } | undefined;
    // RT build from Party
    if (data?.guideId) {
      const guide = getRTBuildById(data.guideId);
      if (guide) {
        setSelectedGuide(guide);
        setCurrentLevel(data.currentLevel || 1);
        setActiveTrackedBuildId(build.id);
        setNavContext('party');
        setView('build-viewer');
        window.scrollTo(0, 0);
      }
    }
    // BG3 build from Party
    if (data?.buildId) {
      const bg3Build = getBG3BuildById(data.buildId);
      if (bg3Build) {
        setSelectedBG3Build(bg3Build);
        setCurrentLevel(data.currentLevel || 1);
        setActiveTrackedBuildId(build.id);
        setNavContext('party');
        setView('build-viewer');
        window.scrollTo(0, 0);
      }
    }
  };

  const handleLevelChange = (level: number) => {
    setCurrentLevel(level);
    // Persist level change if viewing a tracked build
    if (activeTrackedBuildId) {
      const build = builds.find((b) => b.id === activeTrackedBuildId);
      if (build) {
        const data = build.data as Record<string, unknown>;
        updateBuild(activeTrackedBuildId, {
          data: { ...data, currentLevel: level },
        });
      }
    }
  };

  const handleDeleteBuild = (id: string) => {
    if (confirm('Are you sure you want to delete this build?')) {
      deleteBuild(id);
    }
  };

  // RT build tracking helpers
  const getTrackedRTBuilds = () => {
    return builds.filter((b) => {
      const data = b.data as { guideId?: string; companion?: string } | undefined;
      return data?.guideId !== undefined && data?.companion !== undefined;
    }) as Array<CharacterBuild & { data: { guideId: string; companion: CompanionName; currentLevel: number } }>;
  };

  const getTrackedRTCustomName = (guideId: string) => {
    const tracked = builds.find((b) => {
      const data = b.data as { guideId?: string } | undefined;
      return data?.guideId === guideId;
    });
    return (tracked?.data as { customName?: string } | undefined)?.customName;
  };

  const handleSelectTrackedRTBuild = (guideId: string, level: number) => {
    const guide = getRTBuildById(guideId);
    if (guide) {
      setSelectedGuide(guide);
      setCurrentLevel(level);
      const trackedBuild = builds.find((b) => {
        const data = b.data as { guideId?: string } | undefined;
        return data?.guideId === guideId;
      });
      if (trackedBuild) {
        setActiveTrackedBuildId(trackedBuild.id);
      }
      setView('build-viewer');
      window.scrollTo(0, 0);
    }
  };

  // BG3 build tracking
  const isBG3BuildTracked = (buildId: string) => {
    return builds.some((b) => {
      const data = b.data as { buildId?: string } | undefined;
      return data?.buildId === buildId;
    });
  };

  // Get companion name from BG3 build tags
  const getBG3BuildCompanion = (build: BG3Build): string | null => {
    if (!build.tags?.includes('Companion')) return null;
    // Companion name is in tags (e.g., ['Companion', 'Shadowheart'])
    const companionTag = build.tags.find(t => t !== 'Companion' && !['Melee', 'Ranged', 'Support', 'Tank', 'Damage', 'Control'].includes(t));
    return companionTag || null;
  };

  // Check if a BG3 companion already has any build tracked
  const getTrackedBG3BuildForCompanion = (companionName: string | null) => {
    if (!companionName) {
      // For Tav builds (non-companion), check for any non-companion tracked build
      return builds.find((b) => {
        const data = b.data as { buildId?: string; companion?: string | null } | undefined;
        if (!data?.buildId) return false;
        return data.companion === null || data.companion === undefined;
      });
    }
    return builds.find((b) => {
      const data = b.data as { companion?: string } | undefined;
      return data?.companion === companionName;
    });
  };

  const handleTrackBG3Build = async (build: BG3Build) => {
    if (isBG3BuildTracked(build.id)) return;

    const companion = getBG3BuildCompanion(build);
    const characterName = companion || 'Tav';

    // If companion/Tav already has a build tracked, show confirmation
    const existingBuild = getTrackedBG3BuildForCompanion(companion);
    if (existingBuild) {
      const existingData = existingBuild.data as { currentLevel?: number } | undefined;
      const confirmed = window.confirm(
        `${characterName} already has a tracked build "${existingBuild.name}" at level ${existingData?.currentLevel || 1}.\n\nReplacing it will delete all tracked progress for that build.\n\nContinue with the new build?`
      );
      if (!confirmed) return;
      await deleteBuild(existingBuild.id);
    }

    // For player character (Tav), prompt for custom name
    let customName: string | undefined;
    if (!companion) {
      const name = window.prompt('Enter a name for your character:', 'Tav');
      if (name === null) return; // User cancelled
      customName = name.trim() || 'Tav';
    }

    const newBuild = await addBuild(
      build.name,
      {
        buildId: build.id,
        currentLevel: currentLevel,
        companion: companion, // Store companion name for easier querying
        customName: customName,
      },
      build.description
    );
    setActiveTrackedBuildId(newBuild.id);
  };

  const handleUntrackBG3Build = (buildId: string) => {
    const trackedBuild = builds.find((b) => {
      const data = b.data as { buildId?: string } | undefined;
      return data?.buildId === buildId;
    });
    if (trackedBuild) {
      deleteBuild(trackedBuild.id);
    }
  };

  const handleSelectTrackedBG3Build = (buildId: string, level: number) => {
    const build = getBG3BuildById(buildId);
    if (build) {
      setSelectedBG3Build(build);
      setCurrentLevel(level);
      // Find the tracked build to set as active
      const trackedBuild = builds.find((b) => {
        const data = b.data as { buildId?: string } | undefined;
        return data?.buildId === buildId;
      });
      if (trackedBuild) {
        setActiveTrackedBuildId(trackedBuild.id);
      }
      setView('build-viewer');
      window.scrollTo(0, 0);
    }
  };

  const handleBG3LevelChange = (level: number) => {
    setCurrentLevel(level);
    // Persist level change if viewing a tracked build
    if (activeTrackedBuildId) {
      const build = builds.find((b) => b.id === activeTrackedBuildId);
      if (build) {
        const data = build.data as Record<string, unknown>;
        updateBuild(activeTrackedBuildId, {
          data: { ...data, currentLevel: level },
        });
      }
    }
  };

  const getTrackedBG3Builds = () => {
    return builds.filter((b) => {
      const data = b.data as { buildId?: string } | undefined;
      return data?.buildId !== undefined;
    }) as Array<CharacterBuild & { data: { buildId: string; currentLevel: number } }>;
  };

  const getTrackedBG3CustomName = (buildId: string) => {
    const tracked = builds.find((b) => {
      const data = b.data as { buildId?: string } | undefined;
      return data?.buildId === buildId;
    });
    return (tracked?.data as { customName?: string } | undefined)?.customName;
  };

  // Get builds for a BG3 companion
  const getBG3BuildsForCompanion = (companion: BG3CompanionInfo): BG3Build[] => {
    return getAllBG3Builds()
      .filter(b => b.tags?.includes('Companion') && b.tags?.includes(companion.name));
  };

  // Get tracked build info for a BG3 companion
  const getTrackedBG3BuildInfoForCompanion = (companion: BG3CompanionInfo) => {
    const companionBuilds = getBG3BuildsForCompanion(companion);
    for (const build of companionBuilds) {
      const tracked = builds.find(b => {
        const data = b.data as { buildId?: string } | undefined;
        return data?.buildId === build.id;
      });
      if (tracked) {
        const data = tracked.data as { buildId: string; currentLevel: number };
        return { buildId: data.buildId, currentLevel: data.currentLevel };
      }
    }
    return undefined;
  };

  const handleSelectBG3Companion = (companion: BG3CompanionInfo) => {
    setSelectedBG3Companion(companion);
    setView('bg3-companion-detail');
    window.scrollTo(0, 0);
  };

  const handleBackFromBG3CompanionDetail = () => {
    setSelectedBG3Companion(null);
    setView('bg3-companion-builds');
  };

  const handleCreateCustomBuild = (companion: CompanionName) => {
    setCustomBuildCompanion(companion);
    setView('custom-build-editor');
    window.scrollTo(0, 0);
  };

  const handleSelectRTCompanion = (companion: CompanionName) => {
    setSelectedRTCompanion(companion);
    setView('rt-companion-detail');
    window.scrollTo(0, 0);
  };

  const handleBackFromRTCompanionDetail = () => {
    setSelectedRTCompanion(null);
    setView('companion-builds');
  };

  const handleSaveCustomBuild = (buildData: CustomBuildData) => {
    addBuild(
      buildData.buildName,
      {
        isCustom: true,
        companion: buildData.companion,
        buildName: buildData.buildName,
        baseArchetype: buildData.baseArchetype,
        advancedArchetype: buildData.advancedArchetype,
        progression: buildData.progression,
        notes: buildData.notes,
        currentLevel: 1,
      },
      buildData.notes
    );
    setCustomBuildCompanion(null);
    setView('my-builds');
  };

  const handleCancelCustomBuild = () => {
    setCustomBuildCompanion(null);
    setView('companion-builds');
  };

  return (
    <div className={`app ${currentGame ? 'has-backdrop' : ''} ${currentGame ? `game-${currentGame.id}` : ''}`}>
      {currentGame?.heroImage && (
        <div className="backdrop-container">
          <div 
            className="backdrop-image" 
            style={{ backgroundImage: `url(${currentGame.heroImage})` }}
          />
        </div>
      )}
      {currentGame && (
        <Header
          currentGame={currentGame}
          onSelectGame={handleSelectGame}
          profiles={profiles}
          currentProfile={currentProfile}
          onSelectProfile={handleSelectProfile}
          onCreateProfile={createProfile}
          onDeleteProfile={deleteProfile}
          onDuplicateProfile={duplicateProfile}
          onRenameProfile={handleRenameProfile}
          onExportProfile={exportProfile}
          onImportProfile={importProfile}
          onClearAllData={clearAllData}
          isPartyActive={view === 'my-builds' || (view === 'build-viewer' && navContext === 'party')}
          onViewParty={handleViewMyBuilds}
          subnavItems={
            currentGame.id === 'rogue-trader'
              ? [
                  { label: 'Companions', active: view === 'companion-builds' || view === 'rt-companion-detail' || (view === 'build-viewer' && navContext === 'builds' && selectedGuide?.companion !== 'RogueTrader'), onClick: handleViewCompanionBuilds },
                  { label: 'Rogue Trader', active: view === 'rogue-trader-builds' || (view === 'build-viewer' && navContext === 'builds' && selectedGuide?.companion === 'RogueTrader'), onClick: () => setView('rogue-trader-builds') },
                ]
              : [
                  { label: 'Companions', active: view === 'bg3-companion-builds' || view === 'bg3-companion-detail' || (view === 'build-viewer' && navContext === 'builds' && (selectedBG3Build?.tags?.includes('Companion') ?? false)), onClick: () => setView('bg3-companion-builds') },
                  { label: 'Tav', active: view === 'bg3-builds' || (view === 'build-viewer' && navContext === 'builds' && !(selectedBG3Build?.tags?.includes('Companion') ?? false)), onClick: () => setView('bg3-builds') },
                ]
          }
          utilityNavItems={
            enableDataAudit
              ? [
                  {
                    label: 'Data',
                    active: view === 'data-audit',
                    onClick: () => {
                      setSelectedGuide(null);
                      setSelectedBG3Build(null);
                      setView('data-audit');
                    },
                  },
                ]
              : []
          }
          showBuildsSubnav={
            view === 'companion-builds' ||
            view === 'rogue-trader-builds' ||
            view === 'rt-companion-detail' ||
            view === 'bg3-companion-builds' ||
            view === 'bg3-builds'
          }
        />
      )}

      <main className={`main-content${view === 'game-select' ? ' landing' : ''}${currentGame ? ' game-selected' : ''}`}>
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {view === 'game-select' && <GameLibrary onSelectGame={handleSelectGame} />}

        {view === 'companion-builds' && currentGame?.id === 'rogue-trader' && (
          <RTBuildSelector
            onSelectBuild={handleSelectGuide}
            onCreateCustomBuild={handleCreateCustomBuild}
            buildType="companion"
            onSelectCompanion={handleSelectRTCompanion}
            trackedBuilds={getTrackedRTBuilds().map(b => ({
              guideId: b.data.guideId,
              companion: b.data.companion,
              currentLevel: b.data.currentLevel,
            }))}
            onSelectTrackedBuild={handleSelectTrackedRTBuild}
          />
        )}

        {view === 'rt-companion-detail' && currentGame?.id === 'rogue-trader' && selectedRTCompanion && (
          <RTCompanionDetailScreen
            companion={COMPANIONS[selectedRTCompanion]}
            builds={getRTBuildsForCompanion(selectedRTCompanion)}
            onBack={handleBackFromRTCompanionDetail}
            onSelectBuild={handleSelectGuide}
            trackedBuildId={getTrackedRTBuilds().find(b => b.data.companion === selectedRTCompanion)?.data.guideId}
            trackedLevel={getTrackedRTBuilds().find(b => b.data.companion === selectedRTCompanion)?.data.currentLevel}
          />
        )}

        {view === 'rogue-trader-builds' && currentGame?.id === 'rogue-trader' && (
          <RTBuildSelector
            onSelectBuild={handleSelectGuide}
            onCreateCustomBuild={handleCreateCustomBuild}
            buildType="rogueTrader"
            trackedBuilds={getTrackedRTBuilds().map(b => ({
              guideId: b.data.guideId,
              companion: b.data.companion,
              currentLevel: b.data.currentLevel,
            }))}
            onSelectTrackedBuild={handleSelectTrackedRTBuild}
          />
        )}

        {view === 'build-viewer' && selectedGuide && currentGame?.id === 'rogue-trader' && (
          <RTBuildViewer
            build={selectedGuide}
            onBack={handleBackToGuides}
            currentLevel={currentLevel}
            onLevelChange={handleLevelChange}
            onTrackBuild={handleTrackBuild}
            onUntrackBuild={handleUntrackRTBuild}
            isTracked={isGuideTracked(selectedGuide.id)}
            trackedBuilds={getTrackedRTBuilds()}
            onSelectTrackedBuild={handleSelectTrackedRTBuild}
            onDeleteTrackedBuild={handleDeleteBuild}
            profileId={currentProfile?.id}
            customName={getTrackedRTCustomName(selectedGuide.id)}
          />
        )}

        {view === 'build-viewer' && selectedBG3Build && currentGame?.id === 'baldurs-gate-3' && (
          <BG3BuildViewer
            build={selectedBG3Build}
            onBack={() => {
              setSelectedBG3Build(null);
              setActiveTrackedBuildId(null);
              if (navContext === 'party') {
                setView('my-builds');
              } else {
                setView(bg3PreviousView);
              }
            }}
            currentLevel={currentLevel}
            onLevelChange={handleBG3LevelChange}
            onTrackBuild={handleTrackBG3Build}
            onUntrackBuild={handleUntrackBG3Build}
            isTracked={isBG3BuildTracked(selectedBG3Build.id)}
            trackedBuilds={getTrackedBG3Builds()}
            onSelectTrackedBuild={handleSelectTrackedBG3Build}
            onDeleteTrackedBuild={handleDeleteBuild}
            getBuildById={getBG3BuildById}
            profileId={currentProfile?.id}
            customName={getTrackedBG3CustomName(selectedBG3Build.id)}
          />
        )}

        {view === 'bg3-builds' && currentGame?.id === 'baldurs-gate-3' && (
          <BG3BuildSelector
            buildType="all"
            onSelectBuild={(build) => {
              setSelectedBG3Build(build);
              setBg3PreviousView('bg3-builds');
              setCurrentLevel(1);
              setNavContext('builds');
              setView('build-viewer');
              window.scrollTo(0, 0);
            }}
            trackedBuilds={getTrackedBG3Builds().map(b => ({
              buildId: b.data.buildId,
              currentLevel: b.data.currentLevel,
            }))}
            onSelectTrackedBuild={handleSelectTrackedBG3Build}
          />
        )}

        {view === 'bg3-companion-builds' && currentGame?.id === 'baldurs-gate-3' && (
          <BG3BuildSelector
            buildType="companion"
            onSelectBuild={(build) => {
              setSelectedBG3Build(build);
              setBg3PreviousView('bg3-companion-builds');
              setCurrentLevel(1);
              setNavContext('builds');
              setView('build-viewer');
              window.scrollTo(0, 0);
            }}
            onSelectCompanion={handleSelectBG3Companion}
            trackedBuilds={getTrackedBG3Builds().map(b => ({
              buildId: b.data.buildId,
              currentLevel: b.data.currentLevel,
            }))}
            onSelectTrackedBuild={handleSelectTrackedBG3Build}
          />
        )}

        {view === 'bg3-companion-detail' && currentGame?.id === 'baldurs-gate-3' && selectedBG3Companion && (
          <BG3CompanionDetailScreen
            companion={selectedBG3Companion}
            builds={getBG3BuildsForCompanion(selectedBG3Companion)}
            onBack={handleBackFromBG3CompanionDetail}
            onSelectBuild={(build) => {
              setSelectedBG3Build(build);
              setBg3PreviousView('bg3-companion-detail');
              setCurrentLevel(1);
              setNavContext('builds');
              setView('build-viewer');
              window.scrollTo(0, 0);
            }}
            trackedBuildId={getTrackedBG3BuildInfoForCompanion(selectedBG3Companion)?.buildId}
            trackedLevel={getTrackedBG3BuildInfoForCompanion(selectedBG3Companion)?.currentLevel}
          />
        )}

        {view === 'data-audit' && currentGame && enableDataAudit && (
          <DataAuditView gameId={currentGame.id} gameName={currentGame.name} />
        )}

        {view === 'custom-build-editor' && customBuildCompanion && (
          <CustomBuildEditor
            companion={customBuildCompanion}
            onSave={handleSaveCustomBuild}
            onCancel={handleCancelCustomBuild}
          />
        )}

        {view === 'my-builds' && currentGame && (
          <div className="build-list-view">
            <header className="view-hero">
              <div>
                <p className="view-eyebrow">Party</p>
                <h1>My Party</h1>
                <p className="view-subtitle">Track your active builds and progression for this profile.</p>
              </div>
            </header>

            <BuildList
              builds={builds}
              onSelectBuild={handleSelectBuild}
              onDeleteBuild={handleDeleteBuild}
            />
          </div>
        )}
      </main>

      {currentGame && (
        <footer className="app-footer">
          <div className="footer-content">
            <button className="footer-landing-link" onClick={handleGameChange}>
              Landing Page
            </button>
            <span className="footer-dot" aria-hidden="true">•</span>
            <span className="footer-item">
              ©{' '}
              <a href="https://jimjordan.design/" target="_blank" rel="noreferrer">
                Jim Jordan
              </a>
            </span>
            <span className="footer-dot" aria-hidden="true">•</span>
            <a
              className="footer-github"
              href="https://github.com/east35/crpgsheets"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                className="footer-github-icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.54 7.54 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              GitHub
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
