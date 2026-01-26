import type { CharacterBuild, ExportData, Game } from '../types';

const CURRENT_VERSION = '1.0.0';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max file size
const MAX_BUILDS = 1000; // Max builds per import
const MAX_NAME_LENGTH = 200; // Max length for names

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

function isValidString(value: unknown, maxLength: number = MAX_NAME_LENGTH): value is string {
  return typeof value === 'string' && value.length <= maxLength;
}

function sanitizeBuild(build: unknown): CharacterBuild | null {
  if (!build || typeof build !== 'object') return null;
  const b = build as Record<string, unknown>;
  
  // Validate required fields
  if (!isValidString(b.id, 100)) return null;
  if (!isValidString(b.name, MAX_NAME_LENGTH)) return null;
  if (!isValidString(b.gameId, 50)) return null;
  if (!isValidString(b.profileId, 100)) return null;
  if (!isValidString(b.createdAt, 50)) return null;
  if (!isValidString(b.updatedAt, 50)) return null;
  
  // Return only expected fields (reject unexpected)
  return {
    id: b.id as string,
    gameId: b.gameId as string,
    profileId: b.profileId as string,
    name: (b.name as string).slice(0, MAX_NAME_LENGTH),
    createdAt: b.createdAt as string,
    updatedAt: b.updatedAt as string,
    description: isValidString(b.description, 10000) ? b.description as string : undefined,
    data: b.data && typeof b.data === 'object' ? b.data : undefined,
  };
}

export function parseImportedData(jsonString: string): ImportResult {
  // Check string size before parsing
  if (jsonString.length > MAX_FILE_SIZE) {
    return { success: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid file format: not a valid object' };
    }

    // Validate version
    if (!isValidString(data.version, 20)) {
      return { success: false, error: 'Invalid file format: missing or invalid version' };
    }

    // Validate game
    if (!data.game || typeof data.game !== 'object') {
      return { success: false, error: 'Invalid file format: missing game information' };
    }
    if (!isValidString(data.game.id, 50) || !isValidString(data.game.name, 100)) {
      return { success: false, error: 'Invalid file format: invalid game information' };
    }

    // Validate builds array
    if (!Array.isArray(data.builds)) {
      return { success: false, error: 'Invalid file format: builds must be an array' };
    }
    if (data.builds.length > MAX_BUILDS) {
      return { success: false, error: `Too many builds. Maximum is ${MAX_BUILDS}` };
    }

    // Sanitize each build, rejecting invalid ones
    const sanitizedBuilds: CharacterBuild[] = [];
    for (const build of data.builds) {
      const sanitized = sanitizeBuild(build);
      if (sanitized) {
        sanitizedBuilds.push(sanitized);
      }
    }

    // Construct validated export data with only expected fields
    const validatedData: ExportData = {
      version: data.version,
      exportedAt: isValidString(data.exportedAt, 50) ? data.exportedAt : new Date().toISOString(),
      game: {
        id: data.game.id,
        name: data.game.name,
        shortName: isValidString(data.game.shortName, 20) ? data.game.shortName : data.game.id,
      } as Game,
      builds: sanitizedBuilds,
    };

    return { success: true, data: validatedData };
  } catch {
    return { success: false, error: 'Failed to parse JSON file' };
  }
}

export function importFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    // Check file size before reading
    if (file.size > MAX_FILE_SIZE) {
      resolve({ success: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` });
      return;
    }

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
