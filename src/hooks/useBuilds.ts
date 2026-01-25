import { useState, useCallback } from 'react';
import type { CharacterBuild } from '../types';
import { generateBuildId } from '../utils/exportImport';

export function useBuilds(gameId: string) {
  const [builds, setBuilds] = useState<CharacterBuild[]>([]);

  const addBuild = useCallback((name: string, data: unknown, description?: string) => {
    const newBuild: CharacterBuild = {
      id: generateBuildId(),
      gameId,
      profileId: '', // Legacy hook - not used with profiles
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data,
    };
    setBuilds((prev) => [...prev, newBuild]);
    return newBuild;
  }, [gameId]);

  const updateBuild = useCallback((id: string, updates: Partial<Omit<CharacterBuild, 'id' | 'gameId' | 'createdAt'>>) => {
    setBuilds((prev) =>
      prev.map((build) =>
        build.id === id
          ? { ...build, ...updates, updatedAt: new Date().toISOString() }
          : build
      )
    );
  }, []);

  const deleteBuild = useCallback((id: string) => {
    setBuilds((prev) => prev.filter((build) => build.id !== id));
  }, []);

  const importBuilds = useCallback((importedBuilds: CharacterBuild[]) => {
    // Merge imported builds, avoiding duplicates by ID
    setBuilds((prev) => {
      const existingIds = new Set(prev.map((b) => b.id));
      const newBuilds = importedBuilds.filter((b) => !existingIds.has(b.id));
      return [...prev, ...newBuilds];
    });
  }, []);

  const clearBuilds = useCallback(() => {
    setBuilds([]);
  }, []);

  return {
    builds,
    addBuild,
    updateBuild,
    deleteBuild,
    importBuilds,
    clearBuilds,
    setBuilds,
  };
}
