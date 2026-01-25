import Dexie, { type EntityTable } from 'dexie';
import type { CharacterBuild, Profile } from '../types';

// Database schema
const db = new Dexie('crpg-character-manager') as Dexie & {
  profiles: EntityTable<Profile, 'id'>;
  builds: EntityTable<CharacterBuild, 'id'>;
};

// Version 2: Added profiles table and profileId to builds
db.version(2).stores({
  profiles: 'id, gameId, name, createdAt, updatedAt',
  builds: 'id, gameId, profileId, name, createdAt, updatedAt',
}).upgrade(async (tx) => {
  // Migrate existing builds to a default profile
  const existingBuilds = await tx.table('builds').toArray();
  if (existingBuilds.length > 0) {
    // Get unique gameIds from existing builds
    const gameIds = [...new Set(existingBuilds.map((b: CharacterBuild) => b.gameId))];
    
    // Create a default profile for each game
    for (const gameId of gameIds) {
      const defaultProfileId = `default-${gameId}`;
      await tx.table('profiles').add({
        id: defaultProfileId,
        gameId,
        name: 'Default Playthrough',
        description: 'Migrated from previous version',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Update builds to use the default profile
      const buildsForGame = existingBuilds.filter((b: CharacterBuild) => b.gameId === gameId);
      for (const build of buildsForGame) {
        await tx.table('builds').update(build.id, { profileId: defaultProfileId });
      }
    }
  }
});

export { db };
