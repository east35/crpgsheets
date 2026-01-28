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
    
    const fileName = `${profile.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    
    // Try native share sheet first (mobile)
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fileName, { type: 'application/json' });
      const shareData = { files: [file] };
      
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return; // Successfully shared
        } catch (err) {
          // User cancelled or share failed - fall through to download
          if ((err as Error).name === 'AbortError') {
            return; // User cancelled, don't download
          }
        }
      }
    }
    
    // Fallback to download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importProfile = useCallback(async (file: File): Promise<Profile> => {
    // Security: Check file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const MAX_NAME_LENGTH = 200;
    const MAX_BUILDS = 1000;
    
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    
    const text = await file.text();
    
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON file');
    }
    
    // Validate structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid profile file format');
    }
    
    const d = data as Record<string, unknown>;
    
    if (!d.profile || typeof d.profile !== 'object') {
      throw new Error('Invalid profile file format: missing profile');
    }
    if (!Array.isArray(d.builds)) {
      throw new Error('Invalid profile file format: builds must be an array');
    }
    if (d.builds.length > MAX_BUILDS) {
      throw new Error(`Too many builds. Maximum is ${MAX_BUILDS}`);
    }
    
    const profile = d.profile as Record<string, unknown>;
    
    // Validate and sanitize profile name
    const profileName = typeof profile.name === 'string' 
      ? profile.name.slice(0, MAX_NAME_LENGTH) 
      : 'Imported Profile';
    const profileDesc = typeof profile.description === 'string'
      ? profile.description.slice(0, 10000)
      : undefined;
    
    // Create new profile with new ID (don't trust imported IDs)
    const newProfile: Profile = {
      id: generateProfileId(),
      gameId,
      name: profileName,
      description: profileDesc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.profiles.add(newProfile);
    
    // Import builds with new IDs, sanitizing each one
    const newBuilds = [];
    for (const build of d.builds) {
      if (!build || typeof build !== 'object') continue;
      const b = build as Record<string, unknown>;
      
      // Validate required fields exist
      if (typeof b.name !== 'string') continue;
      
      // Sanitize and create new build with safe fields only
      newBuilds.push({
        id: `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        gameId,
        profileId: newProfile.id,
        name: (b.name as string).slice(0, MAX_NAME_LENGTH),
        description: typeof b.description === 'string' ? b.description.slice(0, 10000) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: b.data && typeof b.data === 'object' ? b.data : undefined,
      });
    }
    
    if (newBuilds.length > 0) {
      await db.builds.bulkAdd(newBuilds);
    }
    
    return newProfile;
  }, [gameId]);

  const clearAllData = useCallback(async () => {
    // Delete all builds and profiles for this game
    await db.builds.where('gameId').equals(gameId).delete();
    await db.profiles.where('gameId').equals(gameId).delete();
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
    clearAllData,
  };
}
