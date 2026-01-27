import { useState, useRef, useEffect } from 'react';
import type { Game } from '../types';
import { getAllGames } from '../games/registry';
import { NavArrowDown } from 'iconoir-react';
import './HeaderGameSelector.css';

const GAME_ICONS: Record<string, string> = {
  'rogue-trader': '/images/icons/roguetrader.png',
  'baldurs-gate-3': '/images/icons/baldursgate.png',
};

interface HeaderGameSelectorProps {
  currentGame: Game;
  onSelectGame: (game: Game) => void;
}

export function HeaderGameSelector({ currentGame, onSelectGame }: HeaderGameSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const games = getAllGames();

  // Calculate dropdown position when expanded
  useEffect(() => {
    if (isExpanded && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // On mobile, header is at bottom, so dropdown opens upward
        setDropdownStyle({
          bottom: window.innerHeight - rect.top + 4,
          left: rect.left,
        });
      } else {
        // On desktop, dropdown opens downward
        setDropdownStyle({
          top: rect.bottom + 4,
          left: rect.left,
        });
      }
    }
  }, [isExpanded, games.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const currentIcon = GAME_ICONS[currentGame.id];

  return (
    <div className="header-game-selector" ref={containerRef}>
      <button
        ref={toggleRef}
        className="header-game-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {currentIcon && (
          <img src={currentIcon} alt="" className="header-game-icon" />
        )}
        <span className="header-game-name">{currentGame.name}</span>
        <span className={'header-game-arrow' + (isExpanded ? ' expanded' : '')}>
          <NavArrowDown width={14} height={14} />
        </span>
      </button>

      {isExpanded && (
        <div className="header-game-dropdown" style={dropdownStyle}>
          <div className="header-game-list">
            {games.map(game => (
              <button
                key={game.id}
                className={'header-game-item' + (currentGame.id === game.id ? ' active' : '')}
                onClick={() => {
                  onSelectGame(game);
                  setIsExpanded(false);
                }}
              >
                {GAME_ICONS[game.id] && (
                  <img src={GAME_ICONS[game.id]} alt="" className="header-game-item-icon" />
                )}
                <span className="header-game-item-name">{game.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
