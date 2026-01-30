import type { Profile } from '../types';

type ProfileSelectionAction =
  | { type: 'none' }
  | { type: 'clear' }
  | { type: 'set'; profile: Profile }
  | { type: 'ensureDefault' };

interface ProfileSelectionInput {
  currentGameId: string | null;
  profilesReady: boolean;
  profiles: Profile[];
  currentProfile: Profile | null;
}

export function getProfileSelectionAction({
  currentGameId,
  profilesReady,
  profiles,
  currentProfile,
}: ProfileSelectionInput): ProfileSelectionAction {
  if (!currentGameId || !profilesReady) {
    return { type: 'none' };
  }

  if (currentProfile && currentProfile.gameId !== currentGameId) {
    return { type: 'clear' };
  }

  if (profiles.length === 0) {
    return { type: 'ensureDefault' };
  }

  if (!currentProfile) {
    return { type: 'set', profile: profiles[0] };
  }

  return { type: 'none' };
}
