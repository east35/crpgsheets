import type { Game } from '../types';
import { getAllGames } from '../games/registry';

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
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
