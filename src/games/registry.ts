import type { Game } from '../types';

export const GAMES: Record<string, Game> = {
  'rogue-trader': {
    id: 'rogue-trader',
    name: 'Warhammer 40,000: Rogue Trader',
    shortName: 'Rogue Trader',
    description: 'Manage your Rogue Trader party builds and progression',
  },
};

export interface ComingSoonGame {
  id: string;
  name: string;
  shortName: string;
  description: string;
  heroImage?: string;
}

export const COMING_SOON_GAMES: ComingSoonGame[] = [
  {
    id: 'baldurs-gate-3',
    name: "Baldur's Gate 3",
    shortName: 'BG3',
    description: 'Plan your BG3 character builds',
    heroImage: 'https://cdn2.steamgriddb.com/hero/f6027eaa23d8c01cf1717ad410d1d657.png',
  },
  {
    id: 'divinity-os2',
    name: 'Divinity: Original Sin 2',
    shortName: 'DOS2',
    description: 'Manage your party builds and skill combinations',
    heroImage: 'https://cdn2.steamgriddb.com/hero/2596308d8adbb05e6be2cdccd00473f4.png',
  },
  {
    id: 'disco-elysium',
    name: 'Disco Elysium - The Final Cut',
    shortName: 'Disco Elysium',
    description: 'Track your detective skills and thought cabinet',
    heroImage: 'https://cdn2.steamgriddb.com/hero/7b16a52cf3727c22984590c4f4c36039.png',
  },
];

export function getGame(gameId: string): Game | undefined {
  return GAMES[gameId];
}

export function getAllGames(): Game[] {
  return Object.values(GAMES);
}
