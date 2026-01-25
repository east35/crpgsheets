import { useState } from 'react';
import type { Game, CharacterBuild } from './types';
import type { BuildGuide } from './games/rogue-trader/types';
import { Header } from './components/Header';
import { GameSelector } from './components/GameSelector';
import { BuildList } from './components/BuildList';
import { ImportExportToolbar } from './components/ImportExportToolbar';
import { BuildSelector } from './games/rogue-trader/components/BuildSelector';
import { BuildViewer } from './games/rogue-trader/components/BuildViewer';
import { useBuilds } from './hooks/useBuilds';
import './App.css';

type View = 'game-select' | 'build-guides' | 'build-viewer' | 'my-builds' | 'build-editor';

function App() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [view, setView] = useState<View>('game-select');
  const [selectedGuide, setSelectedGuide] = useState<BuildGuide | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { builds, deleteBuild, importBuilds } = useBuilds(currentGame?.id || '');

  const handleSelectGame = (game: Game) => {
    setCurrentGame(game);
    setView('build-guides');
  };

  const handleGameChange = () => {
    setCurrentGame(null);
    setView('game-select');
    setSelectedGuide(null);
  };

  const handleSelectGuide = (guide: BuildGuide) => {
    setSelectedGuide(guide);
    setCurrentLevel(1);
    setView('build-viewer');
  };

  const handleBackToGuides = () => {
    setSelectedGuide(null);
    setView('build-guides');
  };

  const handleViewMyBuilds = () => {
    setView('my-builds');
  };

  const handleViewBuildGuides = () => {
    setView('build-guides');
  };

  const handleSelectBuild = (_build: CharacterBuild) => {
    // TODO: Implement build viewing/editing
    console.log('Selected build:', _build);
  };

  const handleDeleteBuild = (id: string) => {
    if (confirm('Are you sure you want to delete this build?')) {
      deleteBuild(id);
    }
  };

  const handleImport = (importedBuilds: CharacterBuild[]) => {
    importBuilds(importedBuilds);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="app">
      <Header currentGame={currentGame} onGameChange={handleGameChange} />

      <main className="main-content">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Navigation tabs for game views */}
        {currentGame && view !== 'game-select' && (
          <div className="view-tabs">
            <button
              className={`view-tab ${view === 'build-guides' || view === 'build-viewer' ? 'active' : ''}`}
              onClick={handleViewBuildGuides}
            >
              Build Guides
            </button>
            <button
              className={`view-tab ${view === 'my-builds' || view === 'build-editor' ? 'active' : ''}`}
              onClick={handleViewMyBuilds}
            >
              My Builds ({builds.length})
            </button>
          </div>
        )}

        {view === 'game-select' && <GameSelector onSelectGame={handleSelectGame} />}

        {view === 'build-guides' && currentGame?.id === 'rogue-trader' && (
          <BuildSelector onSelectBuild={handleSelectGuide} />
        )}

        {view === 'build-viewer' && selectedGuide && (
          <BuildViewer
            build={selectedGuide}
            onBack={handleBackToGuides}
            currentLevel={currentLevel}
            onLevelChange={setCurrentLevel}
          />
        )}

        {view === 'my-builds' && currentGame && (
          <div className="build-list-view">
            <div className="view-header">
              <h2>My {currentGame.shortName} Builds</h2>
            </div>

            <ImportExportToolbar
              game={currentGame}
              builds={builds}
              onImport={handleImport}
              onError={handleError}
            />

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
