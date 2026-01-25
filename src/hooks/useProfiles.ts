import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db } from '../db';
import type { Profile } from '../types';

function generateProfileId(): string {
  return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useProfiles(gameId: string) {
  // Live query that auto-updates when DB changes
  const profiles = useLiveQuery(
    () => db.profiles.where('gameId').equals(gameId).toArray(),
    [gameId],
    [] // default value while loading
  );

  const createProfile = useCallback(async (name: string, description?: string) => {
    const newProfile: Profile = {
      id: generateProfileId(),
      gameId,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.profiles.add(newProfile);
    return newProfile;
  }, [gameId]);

  const updateProfile = useCallback(async (id: string, updates: Partial<Omit<Profile, 'id' | 'gameId' | 'createdAt'>>) => {
    await db.profiles.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    // Delete all builds associated with this profile first
    await db.builds.where('profileId').equals(id).delete();
    // Then delete the profile
    await db.profiles.delete(id);
  }, []);

  const duplicateProfile = useCallback(async (sourceProfileId: string, newName: string) => {
    // Get the source profile
    const sourceProfile = await db.profiles.get(sourceProfileId);
    if (!sourceProfile) throw new Error('Source profile not found');

    // Create new profile
    const newProfile: Profile = {
      id: generateProfileId(),
      gameId,
      name: newName,
      description: `Copied from "${sourceProfile.name}"`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.profiles.add(newProfile);

    // Copy all builds from source profile
    const sourceBuilds = await db.builds.where('profileId').equals(sourceProfileId).toArray();
    const newBuilds = sourceBuilds.map(build => ({
      ...build,
      id: `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profileId: newProfile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    await db.builds.bulkAdd(newBuilds);

    return newProfile;
  }, [gameId]);

  // Ensure there's always at least one profile
  const ensureDefaultProfile = useCallback(async () => {
    const existingProfiles = await db.profiles.where('gameId').equals(gameId).toArray();
    if (existingProfiles.length === 0) {
      return createProfile('My First Playthrough', 'Track your builds for this playthrough');
    }
    return existingProfiles[0];
  }, [gameId, createProfile]);

  const exportProfile = useCallback(async (profileId: string) => {
    const profile = await db.profiles.get(profileId);
    if (!profile) throw new Error('Profile not found');
    
    const builds = await db.builds.where('profileId').equals(profileId).toArray();
    
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      builds,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importProfile = useCallback(async (file: File): Promise<Profile> => {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!data.profile || !data.builds) {
      throw new Error('Invalid profile file format');
    }
    
    // Create new profile with new ID
    const newProfile: Profile = {
      id: generateProfileId(),
      gameId,
      name: data.profile.name + ' (Imported)',
      description: data.profile.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.profiles.add(newProfile);
    
    // Import builds with new IDs
    const newBuilds = data.builds.map((build: { id: string; profileId: string; createdAt: string; updatedAt: string }) => ({
      ...build,
      id: `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profileId: newProfile.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    await db.builds.bulkAdd(newBuilds);
    
    return newProfile;
  }, [gameId]);

  return {
    profiles: profiles ?? [],
    createProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
    ensureDefaultProfile,
    exportProfile,
    importProfile,
  };
}
