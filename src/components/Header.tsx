import type { Game } from '../types';

interface HeaderProps {
  currentGame: Game | null;
  onGameChange: () => void;
}

export function Header({ currentGame, onGameChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>CRPG Character Manager</h1>
        {currentGame && (
          <div className="current-game">
            <span>{currentGame.shortName}</span>
            <button onClick={onGameChange} className="btn btn-secondary btn-sm">
              Change Game
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
