import { describe, expect, it } from 'vitest';
import type { Profile } from '../types';
import { getProfileSelectionAction } from './profileSelection';

const makeProfile = (id: string, gameId: string): Profile => ({
  id,
  gameId,
  name: `Profile ${id}`,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

describe('getProfileSelectionAction', () => {
  it('clears the profile when the game changes', () => {
    const action = getProfileSelectionAction({
      currentGameId: 'baldurs-gate-3',
      profilesReady: true,
      profiles: [makeProfile('bg3-1', 'baldurs-gate-3')],
      currentProfile: makeProfile('rt-1', 'rogue-trader'),
    });

    expect(action).toEqual({ type: 'clear' });
  });
});
