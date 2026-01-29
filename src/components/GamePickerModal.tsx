import { createPortal } from 'react-dom';
import type { Game } from '../types';
import { getAllGames, COMING_SOON_GAMES } from '../games/registry';
import { Xmark } from 'iconoir-react';

interface GamePickerModalProps {
  currentGame?: Game;
  onSelectGame: (game: Game) => void;
  onClose: () => void;
}

export function GamePickerModal({ currentGame, onSelectGame, onClose }: GamePickerModalProps) {
  const games = getAllGames();

  const handleSelect = (game: Game) => {
    onSelectGame(game);
    onClose();
  };

  return createPortal(
    <div className="picker-overlay" onClick={onClose}>
      <div className="picker-modal" onClick={e => e.stopPropagation()}>
        <button className="picker-close" onClick={onClose}>
          <Xmark width={24} height={24} />
        </button>
        <h2>Select Game</h2>
        <div className="game-grid">
          {games.map((game) => (
            <button
              key={game.id}
              className={`game-card ${currentGame?.id === game.id ? 'active' : ''}`}
              onClick={() => handleSelect(game)}
              style={game.heroImage ? { backgroundImage: `url(${game.heroImage})` } : undefined}
            >
              <span className="beta-badge">Beta</span>
              {game.logo ? (
                <img src={game.logo} alt={game.name} className="game-logo" />
              ) : (
                <h3>{game.name}</h3>
              )}
            </button>
          ))}
        </div>

        <h3 className="section-header">Games Planned</h3>
        <div className="game-grid">
          {COMING_SOON_GAMES.map((game) => (
            <button
              key={game.id}
              className="game-card coming-soon"
              disabled
              style={game.heroImage ? { backgroundImage: `url(${game.heroImage})` } : undefined}
            >
              <span className="coming-soon-badge">Coming Soon</span>
              {game.logo ? (
                <img src={game.logo} alt={game.name} className="game-logo" />
              ) : (
                <h3>{game.name}</h3>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
