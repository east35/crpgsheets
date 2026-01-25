import { useRef } from 'react';
import type { CharacterBuild, Game } from '../types';
import { downloadBuilds, importFromFile } from '../utils/exportImport';

interface ImportExportToolbarProps {
  game: Game;
  builds: CharacterBuild[];
  onImport: (builds: CharacterBuild[]) => void;
  onError: (message: string) => void;
}

export function ImportExportToolbar({
  game,
  builds,
  onImport,
  onError,
}: ImportExportToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (builds.length === 0) {
      onError('No builds to export');
      return;
    }
    downloadBuilds(game, builds);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importFromFile(file);
    if (result.success && result.data) {
      if (result.data.game.id !== game.id) {
        onError(`This file contains builds for ${result.data.game.name}, not ${game.name}`);
      } else {
        onImport(result.data.builds);
      }
    } else {
      onError(result.error || 'Failed to import file');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="import-export-toolbar">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />
      <button className="btn btn-secondary" onClick={handleImportClick}>
        Import Builds
      </button>
      <button className="btn btn-primary" onClick={handleExport}>
        Export Builds ({builds.length})
      </button>
    </div>
  );
}
