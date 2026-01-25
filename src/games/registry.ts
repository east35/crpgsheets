import type { Game } from '../types';

export const GAMES: Record<string, Game> = {
  'rogue-trader': {
    id: 'rogue-trader',
    name: 'Warhammer 40,000: Rogue Trader',
    shortName: 'Rogue Trader',
    description: 'Manage your Rogue Trader party builds and progression',
  },
  // Future games can be added here
  // 'baldurs-gate-3': {
  //   id: 'baldurs-gate-3',
  //   name: "Baldur's Gate 3",
  //   shortName: 'BG3',
  //   description: 'Plan your BG3 character builds',
  // },
};

export function getGame(gameId: string): Game | undefined {
  return GAMES[gameId];
}

export function getAllGames(): Game[] {
  return Object.values(GAMES);
}
