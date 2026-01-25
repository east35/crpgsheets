// Core types for CRPG Character Manager

export interface Game {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon?: string;
}

// Profile represents a "save slot" for a playthrough
export interface Profile {
  id: string;
  gameId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterBuild {
  id: string;
  gameId: string;
  profileId: string; // Links build to a specific profile/playthrough
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  data: unknown; // Game-specific data structure
}

export interface BuildGuide {
  id: string;
  gameId: string;
  characterName: string;
  title: string;
  sourceUrl?: string;
  notes?: string;
  build: unknown; // Game-specific build data
}

export interface ExportData {
  version: string;
  exportedAt: string;
  game: Game;
  builds: CharacterBuild[];
}
