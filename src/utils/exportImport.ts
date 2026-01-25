import type { CharacterBuild, ExportData, Game } from '../types';

const CURRENT_VERSION = '1.0.0';

export function exportBuilds(game: Game, builds: CharacterBuild[]): string {
  const exportData: ExportData = {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    game,
    builds,
  };
  return JSON.stringify(exportData, null, 2);
}

export function downloadBuilds(game: Game, builds: CharacterBuild[], filename?: string): void {
  const json = exportBuilds(game, builds);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${game.shortName.toLowerCase()}-builds-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  data?: ExportData;
  error?: string;
}

export function parseImportedData(jsonString: string): ImportResult {
  try {
    const data = JSON.parse(jsonString) as ExportData;

    // Basic validation
    if (!data.version) {
      return { success: false, error: 'Invalid file format: missing version' };
    }
    if (!data.game || !data.game.id) {
      return { success: false, error: 'Invalid file format: missing game information' };
    }
    if (!Array.isArray(data.builds)) {
      return { success: false, error: 'Invalid file format: builds must be an array' };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: 'Failed to parse JSON file' };
  }
}

export function importFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(parseImportedData(content));
      } else {
        resolve({ success: false, error: 'Failed to read file' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' });
    };

    reader.readAsText(file);
  });
}

export function generateBuildId(): string {
  return `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
