import { useState } from 'react';
import type { Game } from '../types';
import { getAllGames, COMING_SOON_GAMES } from '../games/registry';
import { Xmark, List, Check, User } from 'iconoir-react';
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

const CHANGELOG: Record<string, { date: string; changes: string[] }[]> = {
  'rogue-trader': [
    { date: 'Jan 2026', changes: ['Added 36 optimized companion builds', 'Level-by-level progression tracking', 'Talent and gear recommendations'] },
    { date: 'Dec 2025', changes: ['Initial release with party management'] },
  ],
  'baldurs-gate-3': [
    { date: 'Jan 2026', changes: ['Added 16 character builds', 'Multi-class support', 'Companion build guides'] },
  ],
};

const FEATURES = [
  { icon: 'builds', title: 'Curated Builds', desc: 'Optimized character builds for every companion' },
  { icon: 'tracker', title: 'Level Tracker', desc: 'Track progress across your entire party' },
  { icon: 'local', title: 'Local Storage', desc: 'Your data stays private on your device' },
];

export function GameLibrary({ onSelectGame }: GameLibraryProps) {
  const games = getAllGames();
  const allGames = [...games, ...COMING_SOON_GAMES];
  const [showPicker, setShowPicker] = useState(false);

  const isComingSoon = (gameId: string) => {
    return COMING_SOON_GAMES.some(g => g.id === gameId);
  };

  const totalBuilds = Object.values(GAME_STATS).reduce((sum, g) => sum + g.builds, 0);

  return (
    <div className="landing-page">
      {/* Full-screen Hero */}
      <section className="hero-fullscreen">
        <div 
          className="hero-bg"
          style={{ backgroundImage: 'url(/images/marketing/m7.jpg)' }}
        />
        
        <div className="hero-content">
          <h1 className="hero-title">cRPG Sheets</h1>
          <p className="hero-tagline">
            Track your party builds.<br />
            Follow optimized guides.<br />
            Master every companion.
          </p>
          <button 
            className="hero-cta"
            onClick={() => setShowPicker(true)}
          >
            Get started — it's free!
          </button>
          <p className="hero-subtitle">The build tracker for CRPG lovers.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{totalBuilds}+</span>
            <span className="stat-label">Premade Builds</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{allGames.length}</span>
            <span className="stat-label">Supported Games</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">Free & Local</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {FEATURES.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">
                {feature.icon === 'builds' && <List width={24} height={24} />}
                {feature.icon === 'tracker' && <Check width={24} height={24} />}
                {feature.icon === 'local' && <User width={24} height={24} />}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Changelog Section */}
      <section className="changelog-section">
        <h2>Recent Updates</h2>
        <div className="changelog-grid">
          {games.map((game) => {
            const logs = CHANGELOG[game.id];
            if (!logs) return null;
            return (
              <div key={game.id} className="changelog-card">
                <h3>{game.shortName || game.name}</h3>
                {logs.map((log, i) => (
                  <div key={i} className="changelog-entry">
                    <span className="changelog-date">{log.date}</span>
                    <ul>
                      {log.changes.map((change, j) => (
                        <li key={j}>{change}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>Your builds are saved locally to this device. Use Export/Import to transfer data between devices.</p>
      </footer>

      {/* Game Picker Modal */}
      {showPicker && (
        <div className="picker-overlay" onClick={() => setShowPicker(false)}>
          <div className="picker-modal" onClick={e => e.stopPropagation()}>
            <button className="picker-close" onClick={() => setShowPicker(false)}>
              <Xmark width={24} height={24} />
            </button>
            <h2>Choose Your Game</h2>
            <div className="game-grid">
              {allGames.map((game) => {
                const comingSoon = isComingSoon(game.id);
                const stats = GAME_STATS[game.id];
                return (
                  <button
                    key={game.id}
                    className={`game-card ${comingSoon ? 'coming-soon' : ''}`}
                    onClick={() => !comingSoon && onSelectGame(game as Game)}
                    disabled={comingSoon}
                    style={game.heroImage ? { backgroundImage: `url(${game.heroImage})` } : undefined}
                  >
                    {comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
                    {!comingSoon && <span className="beta-badge">Beta</span>}
                    {game.logo ? (
                      <img src={game.logo} alt={game.name} className="game-logo" />
                    ) : (
                      <h3>{game.name}</h3>
                    )}
                    {stats && !comingSoon && (
                      <p className="game-stats">{stats.builds} builds • {stats.companions} companions</p>
                    )}
                    {comingSoon && <p>{game.description}</p>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
