import { useState } from 'react';
import type { Game } from '../types';
import { getAllGames, COMING_SOON_GAMES } from '../games/registry';
import { Xmark } from 'iconoir-react';
import './GameLibrary.css';

interface GameLibraryProps {
  onSelectGame: (game: Game) => void;
}

const GAME_STATS: Record<string, { builds: number; companions: number }> = {
  'rogue-trader': { builds: 36, companions: 10 },
  'baldurs-gate-3': { builds: 16, companions: 7 },
  'divinity-original-sin-2': { builds: 0, companions: 6 },
  'disco-elysium': { builds: 0, companions: 0 },
};

export function GameLibrary({ onSelectGame }: GameLibraryProps) {
  const games = getAllGames();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="landing-page">
      <section className="hero-fullscreen">
        <div
          className="hero-bg"
          style={{ backgroundImage: 'url(/images/marketing/background.png)' }}
        />

        <div className="hero-split">
          <div className="hero-content">
            <img
              src="/images/marketing/SheetsLogo.png"
              alt="Sheets"
              className="hero-logo"
            />
            <p className="hero-tagline">
              Track your party builds.<br />
              Follow optimized guides.<br />
              Master every companion.
            </p>
            <button
              className="hero-cta"
              onClick={() => setShowPicker(true)}
            >
              Start Tracking
            </button>
            <p className="hero-subtitle">The build tracker for cRPG lovers.</p>
          </div>

          <div className="hero-screenshots">
            <img
              src="/images/marketing/screenshot1.png"
              alt="App screenshot"
              className="hero-screenshot screenshot-front"
            />
            <img
              src="/images/marketing/screenshot2.png"
              alt="App screenshot"
              className="hero-screenshot screenshot-back"
            />
          </div>
        </div>
      </section>

      {showPicker && (
        <div className="picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="picker-modal" onClick={e => e.stopPropagation()}>
            <button className="picker-close" onClick={() => setShowPicker(false)}>
              <Xmark width={24} height={24} />
            </button>
            <h2>Available Game Sheets</h2>
            <div className="game-grid">
              {games.map((game) => {
                const stats = GAME_STATS[game.id];
                return (
                  <button
                    key={game.id}
                    className="game-card"
                    onClick={() => onSelectGame(game)}
                    style={game.heroImage ? { backgroundImage: `url(${game.heroImage})` } : undefined}
                  >
                    <span className="beta-badge">Beta</span>
                    {game.logo ? (
                      <img src={game.logo} alt={game.name} className="game-logo" />
                    ) : (
                      <h3>{game.name}</h3>
                    )}
                  </button>
                );
              })}
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
        </div>
      )}

      <footer className="landing-footer">
        <div className="footer-content">
          <span className="footer-item">
            ©{' '}
            <a href="https://jimjordan.design/" target="_blank" rel="noreferrer">
              Jim Jordan
            </a>
          </span>
          <span className="footer-dot" aria-hidden="true">•</span>
          <a
            className="footer-github"
            href="https://github.com/jimjordan/crpg-character-manager"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              className="footer-github-icon"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.54 7.54 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            Contribute on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
