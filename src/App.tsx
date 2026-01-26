import { useState, useEffect } from 'react';
import type { Game, CharacterBuild, Profile } from './types';
import type { BuildGuide, CompanionName } from './games/rogue-trader/types';
import type { BG3Build } from './games/baldurs-gate-3/types';
import { Header } from './components/Header';
import { GameSelector } from './components/GameSelector';
import { BuildList } from './components/BuildList';
// Rogue Trader imports
import { BuildSelector as RTBuildSelector } from './games/rogue-trader/components/BuildSelector';
import { BuildViewer as RTBuildViewer } from './games/rogue-trader/components/BuildViewer';
import { CustomBuildEditor, type CustomBuildData } from './games/rogue-trader/components/CustomBuildEditor';
import { getBuildById as getRTBuildById } from './games/rogue-trader/data/builds';
import { getTalentInfo, WIKI_TALENTS } from './games/rogue-trader/data/talents';
import { getGearInfo, GEAR_DATA } from './games/rogue-trader/data/gear';
// BG3 imports
import { BuildSelector as BG3BuildSelector } from './games/baldurs-gate-3/components/BuildSelector';
import { BuildViewer as BG3BuildViewer } from './games/baldurs-gate-3/components/BuildViewer';
import { usePersistedBuilds } from './hooks/usePersistedBuilds';
import { useProfiles } from './hooks/useProfiles';
import { SearchBar } from './components/SearchBar';
import './App.css';

type View = 'game-select' | 'companion-builds' | 'rogue-trader-builds' | 'build-viewer' | 'my-builds' | 'build-editor' | 'custom-build-editor' | 'bg3-builds' | 'bg3-companion-builds';

function App() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>('game-select');
  const [selectedGuide, setSelectedGuide] = useState<BuildGuide | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [activeTrackedBuildId, setActiveTrackedBuildId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customBuildCompanion, setCustomBuildCompanion] = useState<CompanionName | null>(null);
  const [selectedBG3Build, setSelectedBG3Build] = useState<BG3Build | null>(null);
  const [bg3PreviousView, setBg3PreviousView] = useState<'bg3-builds' | 'bg3-companion-builds'>('bg3-builds');

  const { 
    profiles, 
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
    if (currentGame && profiles.length === 0) {
      ensureDefaultProfile().then(profile => {
        setCurrentProfile(profile);
      });
    } else if (currentGame && profiles.length > 0 && !currentProfile) {
      setCurrentProfile(profiles[0]);
    }
  }, [currentGame, profiles, currentProfile, ensureDefaultProfile]);

  // Check if a guide is already being tracked
  const isGuideTracked = (guideId: string) => {
    return builds.some((b) => {
      const data = b.data as { guideId?: string } | undefined;
      return data?.guideId === guideId;
    });
  };

  const handleTrackBuild = (guide: BuildGuide) => {
    if (isGuideTracked(guide.id)) return;

    addBuild(
      `${guide.companion}: ${guide.buildName}`,
      {
        guideId: guide.id,
        companion: guide.companion,
        buildName: guide.buildName,
        currentLevel: 1,
        archetypePath: guide.archetypePath,
      },
      guide.description
    );
  };

  const handleSelectGame = (game: Game) => {
    setCurrentGame(game);
    setCurrentProfile(null); // Reset profile, will be set by useEffect
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
    setView('build-viewer');
    window.scrollTo(0, 0);
  };

  const handleBackToGuides = () => {
    // Return to the correct view based on the selected guide's companion type
    const returnView = selectedGuide?.companion === 'RogueTrader' ? 'rogue-trader-builds' : 'companion-builds';
    setSelectedGuide(null);
    setActiveTrackedBuildId(null);
    setView(returnView);
  };

  const handleViewMyBuilds = () => {
    setView('my-builds');
  };

  const handleViewCompanionBuilds = () => {
    setView('companion-builds');
  };

  const handleViewRogueTraderBuilds = () => {
    setView('rogue-trader-builds');
  };

  const handleSelectBuild = (build: CharacterBuild) => {
    const data = build.data as { guideId?: string; currentLevel?: number } | undefined;
    if (data?.guideId) {
      const guide = getRTBuildById(data.guideId);
      if (guide) {
        setSelectedGuide(guide);
        setCurrentLevel(data.currentLevel || 1);
        setActiveTrackedBuildId(build.id);
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

  
  const handleCreateCustomBuild = (companion: CompanionName) => {
    setCustomBuildCompanion(companion);
    setView('custom-build-editor');
    window.scrollTo(0, 0);
  };

  const handleSaveCustomBuild = (buildData: CustomBuildData) => {
    addBuild(
      `${buildData.companion}: ${buildData.buildName}`,
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

  const handleSearch = (query: string) => {
    const results: { type: 'talent' | 'gear'; name: string; description?: string }[] = [];
    const lowerQuery = query.toLowerCase();
    const seen = new Set<string>();

    // Search talents - exact match first
    const talentInfo = getTalentInfo(query);
    if (talentInfo && !seen.has(talentInfo.name)) {
      seen.add(talentInfo.name);
      results.push({
        type: 'talent',
        name: talentInfo.name,
        description: talentInfo.effect?.slice(0, 100) + (talentInfo.effect && talentInfo.effect.length > 100 ? '...' : ''),
      });
    }

    // Search gear - exact match first
    const gearInfo = getGearInfo(query);
    if (gearInfo && !seen.has(gearInfo.name)) {
      seen.add(gearInfo.name);
      results.push({
        type: 'gear',
        name: gearInfo.name,
        description: gearInfo.effect?.slice(0, 100) + (gearInfo.effect && gearInfo.effect.length > 100 ? '...' : ''),
      });
    }

    // Partial matching for talents
    Object.values(WIKI_TALENTS).forEach((talent) => {
      if (talent.name.toLowerCase().includes(lowerQuery) && !seen.has(talent.name)) {
        seen.add(talent.name);
        results.push({
          type: 'talent',
          name: talent.name,
          description: talent.effect?.slice(0, 100) + (talent.effect && talent.effect.length > 100 ? '...' : ''),
        });
      }
    });

    // Partial matching for gear
    Object.values(GEAR_DATA).forEach((gear) => {
      if (gear.name.toLowerCase().includes(lowerQuery) && !seen.has(gear.name)) {
        seen.add(gear.name);
        results.push({
          type: 'gear',
          name: gear.name,
          description: gear.effect?.slice(0, 100) + (gear.effect && gear.effect.length > 100 ? '...' : ''),
        });
      }
    });

    return results;
  };

  return (
    <div className="app">
      <Header 
        currentGame={currentGame} 
        onGameChange={handleGameChange}
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
      />

      <main 
        className={`main-content${currentGame ? ' game-selected' : ''}`}
        style={currentGame?.heroImage ? { '--hero-image': `url(${currentGame.heroImage})` } as React.CSSProperties : undefined}
      >
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Navigation tabs - Rogue Trader */}
        {currentGame?.id === 'rogue-trader' && view !== 'game-select' && (
          <>
            <div className="nav-row">
              <div className="view-tabs">
                <button
                  className={`view-tab ${view === 'my-builds' || view === 'build-editor' ? 'active' : ''}`}
                  onClick={handleViewMyBuilds}
                >
                  My Builds
                </button>
                <button
                  className={`view-tab ${view === 'rogue-trader-builds' || (view === 'build-viewer' && selectedGuide?.companion === 'RogueTrader') ? 'active' : ''}`}
                  onClick={handleViewRogueTraderBuilds}
                >
                  Rogue Trader
                </button>
                <button
                  className={`view-tab ${view === 'companion-builds' || (view === 'build-viewer' && selectedGuide?.companion !== 'RogueTrader') ? 'active' : ''}`}
                  onClick={handleViewCompanionBuilds}
                >
                  Companions
                </button>
              </div>
              <SearchBar onSearch={handleSearch} />
            </div>
          </>
        )}

        {/* Navigation tabs - BG3 */}
        {currentGame?.id === 'baldurs-gate-3' && view !== 'game-select' && (
          <>
            <div className="nav-row">
              <div className="view-tabs">
                <button
                  className={`view-tab ${view === 'my-builds' ? 'active' : ''}`}
                  onClick={handleViewMyBuilds}
                >
                  My Builds
                </button>
                <button
                  className={`view-tab ${view === 'bg3-builds' ? 'active' : ''}`}
                  onClick={() => setView('bg3-builds')}
                >
                  Community Builds
                </button>
                <button
                  className={`view-tab ${view === 'bg3-companion-builds' ? 'active' : ''}`}
                  onClick={() => setView('bg3-companion-builds')}
                >
                  Companions
                </button>
              </div>
            </div>
          </>
        )}

        {view === 'game-select' && <GameSelector onSelectGame={handleSelectGame} />}

        {view === 'companion-builds' && currentGame?.id === 'rogue-trader' && (
          <RTBuildSelector 
            onSelectBuild={handleSelectGuide} 
            onCreateCustomBuild={handleCreateCustomBuild}
            buildType="companion" 
          />
        )}

        {view === 'rogue-trader-builds' && currentGame?.id === 'rogue-trader' && (
          <RTBuildSelector 
            onSelectBuild={handleSelectGuide} 
            onCreateCustomBuild={handleCreateCustomBuild}
            buildType="rogueTrader" 
          />
        )}

        {view === 'build-viewer' && selectedGuide && currentGame?.id === 'rogue-trader' && (
          <RTBuildViewer
            build={selectedGuide}
            onBack={handleBackToGuides}
            currentLevel={currentLevel}
            onLevelChange={handleLevelChange}
            onTrackBuild={handleTrackBuild}
            isTracked={isGuideTracked(selectedGuide.id)}
          />
        )}

        {view === 'build-viewer' && selectedBG3Build && currentGame?.id === 'baldurs-gate-3' && (
          <BG3BuildViewer
            build={selectedBG3Build}
            onBack={() => { setSelectedBG3Build(null); setView(bg3PreviousView); }}
            currentLevel={currentLevel}
            onLevelChange={setCurrentLevel}
          />
        )}

        {view === 'bg3-builds' && currentGame?.id === 'baldurs-gate-3' && (
          <BG3BuildSelector
            buildType="all"
            onSelectBuild={(build) => {
              setSelectedBG3Build(build);
              setBg3PreviousView('bg3-builds');
              setCurrentLevel(1);
              setView('build-viewer');
              window.scrollTo(0, 0);
            }}
          />
        )}

        {view === 'bg3-companion-builds' && currentGame?.id === 'baldurs-gate-3' && (
          <BG3BuildSelector
            buildType="companion"
            onSelectBuild={(build) => {
              setSelectedBG3Build(build);
              setBg3PreviousView('bg3-companion-builds');
              setCurrentLevel(1);
              setView('build-viewer');
              window.scrollTo(0, 0);
            }}
          />
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
            <div className="view-header">
              <h2>My {currentGame.shortName} Builds</h2>
            </div>

            <BuildList
              builds={builds}
              onSelectBuild={handleSelectBuild}
              onDeleteBuild={handleDeleteBuild}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
