import type { Game } from '../types';

export const GAMES: Record<string, Game> = {
  'rogue-trader': {
    id: 'rogue-trader',
    name: 'Warhammer 40,000: Rogue Trader',
    shortName: 'Rogue Trader',
    description: 'Manage your Rogue Trader party builds and progression',
    heroImage: '/images/heroes/rogue-trader-hero.png',
    logo: '/images/logos/rogue-trader-logo.png',
  },
  'baldurs-gate-3': {
    id: 'baldurs-gate-3',
    name: "Baldur's Gate III",
    shortName: 'BG3',
    description: 'Plan your BG3 character builds and party composition',
    heroImage: '/images/heroes/bg3-hero.png',
    logo: '/images/logos/baldurs-gate-logo.png',
  },
};

export interface ComingSoonGame {
  id: string;
  name: string;
  shortName: string;
  description: string;
  heroImage?: string;
  logo?: string;
}

export const COMING_SOON_GAMES: ComingSoonGame[] = [
  {
    id: 'divinity-os2',
    name: 'Divinity: Original Sin 2',
    shortName: 'DOS2',
    description: 'Manage your party builds and skill combinations',
    heroImage: '/images/heroes/dos2-hero.png',
    logo: '/images/logos/divinity.png',
  },
  {
    id: 'disco-elysium',
    name: 'Disco Elysium - The Final Cut',
    shortName: 'Disco Elysium',
    description: 'Track your detective skills and thought cabinet',
    heroImage: '/images/heroes/disco-elysium-hero.png',
    logo: '/images/logos/disco.png',
  },
];

export function getGame(gameId: string): Game | undefined {
  return GAMES[gameId];
}

export function getAllGames(): Game[] {
  return Object.values(GAMES);
}
