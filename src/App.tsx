import { useState, useEffect } from 'react';
import type { Game, CharacterBuild, Profile } from './types';
import type { BuildGuide, CompanionName } from './games/rogue-trader/types';
import { Header } from './components/Header';
import { GameSelector } from './components/GameSelector';
import { BuildList } from './components/BuildList';
import { BuildSelector } from './games/rogue-trader/components/BuildSelector';
import { BuildViewer } from './games/rogue-trader/components/BuildViewer';
import { CustomBuildEditor, type CustomBuildData } from './games/rogue-trader/components/CustomBuildEditor';
import { getBuildById } from './games/rogue-trader/data/builds';
import { usePersistedBuilds } from './hooks/usePersistedBuilds';
import { useProfiles } from './hooks/useProfiles';
import { SearchBar } from './components/SearchBar';
import { getTalentInfo, WIKI_TALENTS } from './games/rogue-trader/data/talents';
import { getGearInfo, GEAR_DATA } from './games/rogue-trader/data/gear';
import './App.css';

type View = 'game-select' | 'companion-builds' | 'rogue-trader-builds' | 'build-viewer' | 'my-builds' | 'build-editor' | 'custom-build-editor';

function App() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<View>('game-select');
  const [selectedGuide, setSelectedGuide] = useState<BuildGuide | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [activeTrackedBuildId, setActiveTrackedBuildId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customBuildCompanion, setCustomBuildCompanion] = useState<CompanionName | null>(null);

  const { 
    profiles, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    duplicateProfile,
    ensureDefaultProfile,
    exportProfile,
    importProfile,
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
    setView('my-builds');
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
      const guide = getBuildById(data.guideId);
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
      />

      <main className={`main-content${currentGame ? ' game-selected' : ''}`}>
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Navigation tabs */}
        {currentGame && view !== 'game-select' && (
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

        {view === 'game-select' && <GameSelector onSelectGame={handleSelectGame} />}

        {view === 'companion-builds' && currentGame?.id === 'rogue-trader' && (
          <BuildSelector 
            onSelectBuild={handleSelectGuide} 
            onCreateCustomBuild={handleCreateCustomBuild}
            buildType="companion" 
          />
        )}

        {view === 'rogue-trader-builds' && currentGame?.id === 'rogue-trader' && (
          <BuildSelector 
            onSelectBuild={handleSelectGuide} 
            onCreateCustomBuild={handleCreateCustomBuild}
            buildType="rogueTrader" 
          />
        )}

        {view === 'build-viewer' && selectedGuide && (
          <BuildViewer
            build={selectedGuide}
            onBack={handleBackToGuides}
            currentLevel={currentLevel}
            onLevelChange={handleLevelChange}
            onTrackBuild={handleTrackBuild}
            isTracked={isGuideTracked(selectedGuide.id)}
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
