import type { Game } from '../types';
import { getAllGames, COMING_SOON_GAMES } from '../games/registry';

interface GameSelectorProps {
  onSelectGame: (game: Game) => void;
}

export function GameSelector({ onSelectGame }: GameSelectorProps) {
  const games = getAllGames();

  return (
    <div className="game-selector">
      <h2>Select a Game</h2>
      <p className="subtitle">Choose which game you want to manage builds for</p>
      <div className="game-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => onSelectGame(game)}
          >
            <span className="beta-badge">Beta</span>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </button>
        ))}
        {COMING_SOON_GAMES.map((game) => (
          <div
            key={game.id}
            className="game-card coming-soon"
            style={game.heroImage ? { backgroundImage: `url(${game.heroImage})` } : undefined}
          >
            <span className="coming-soon-badge">Coming Soon</span>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
      <div className="storage-notice">
        <span className="notice-icon">💾</span>
        <span>Your builds are saved locally to this device only. Use Export/Import in My Builds to transfer data between devices.</span>
      </div>
    </div>
  );
}
