import { useState } from 'react';
import type { Game, CharacterBuild } from './types';
import { Header } from './components/Header';
import { GameSelector } from './components/GameSelector';
import { BuildList } from './components/BuildList';
import { ImportExportToolbar } from './components/ImportExportToolbar';
import { RogueTraderBuildEditor } from './games/rogue-trader/components/RogueTraderBuildEditor';
import { useBuilds } from './hooks/useBuilds';
import type { RogueTraderCharacter } from './games/rogue-trader/types';
import './App.css';

type View = 'game-select' | 'build-list' | 'build-editor';

function App() {
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [view, setView] = useState<View>('game-select');
  const [selectedBuild, setSelectedBuild] = useState<CharacterBuild | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { builds, addBuild, updateBuild, deleteBuild, importBuilds } = useBuilds(
    currentGame?.id || ''
  );

  const handleSelectGame = (game: Game) => {
    setCurrentGame(game);
    setView('build-list');
  };

  const handleGameChange = () => {
    setCurrentGame(null);
    setView('game-select');
    setSelectedBuild(null);
  };

  const handleNewBuild = () => {
    setSelectedBuild(null);
    setView('build-editor');
  };

  const handleSelectBuild = (build: CharacterBuild) => {
    setSelectedBuild(build);
    setView('build-editor');
  };

  const handleDeleteBuild = (id: string) => {
    if (confirm('Are you sure you want to delete this build?')) {
      deleteBuild(id);
    }
  };

  const handleSaveBuild = (name: string, data: RogueTraderCharacter, description?: string) => {
    if (selectedBuild) {
      updateBuild(selectedBuild.id, { name, data, description });
    } else {
      addBuild(name, data, description);
    }
    setView('build-list');
    setSelectedBuild(null);
  };

  const handleCancelEdit = () => {
    setView('build-list');
    setSelectedBuild(null);
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

        {view === 'game-select' && <GameSelector onSelectGame={handleSelectGame} />}

        {view === 'build-list' && currentGame && (
          <div className="build-list-view">
            <div className="view-header">
              <h2>{currentGame.shortName} Builds</h2>
              <button className="btn btn-primary" onClick={handleNewBuild}>
                New Build
              </button>
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

        {view === 'build-editor' && currentGame?.id === 'rogue-trader' && (
          <RogueTraderBuildEditor
            build={selectedBuild}
            onSave={handleSaveBuild}
            onCancel={handleCancelEdit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
