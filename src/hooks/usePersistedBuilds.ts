import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../db';
import type { CharacterBuild } from '../types';
import { generateBuildId } from '../utils/exportImport';

export function usePersistedBuilds(gameId: string, profileId: string | null) {
  // Live query that auto-updates when DB changes
  const builds = useLiveQuery(
    () => {
      if (!profileId || !gameId) return [];
      return db.builds
        .where(['profileId', 'gameId'])
        .equals([profileId, gameId])
        .toArray();
    },
    [profileId, gameId],
    [] // default value while loading
  );

  const addBuild = useCallback(async (name: string, data: unknown, description?: string) => {
    if (!profileId) throw new Error('No profile selected');
    const newBuild: CharacterBuild = {
      id: generateBuildId(),
      gameId,
      profileId,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data,
    };
    await db.builds.add(newBuild);
    return newBuild;
  }, [gameId, profileId]);

  const updateBuild = useCallback(async (id: string, updates: Partial<Omit<CharacterBuild, 'id' | 'gameId' | 'profileId' | 'createdAt'>>) => {
    await db.builds.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const deleteBuild = useCallback(async (id: string) => {
    await db.builds.delete(id);
  }, []);

  const importBuilds = useCallback(async (importedBuilds: CharacterBuild[]) => {
    if (!profileId) throw new Error('No profile selected');
    // Get existing IDs to avoid duplicates
    const existingIds = new Set((await db.builds.toArray()).map((b) => b.id));
    // Assign imported builds to current profile
    const newBuilds = importedBuilds
      .filter((b) => !existingIds.has(b.id))
      .map((b) => ({ ...b, profileId }));
    await db.builds.bulkAdd(newBuilds);
  }, [profileId]);

  const clearBuilds = useCallback(async () => {
    if (!profileId) return;
    await db.builds.where('profileId').equals(profileId).delete();
  }, [profileId]);

  return {
    builds: builds ?? [],
    addBuild,
    updateBuild,
    deleteBuild,
    importBuilds,
    clearBuilds,
  };
}
