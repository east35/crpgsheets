import { useState, useRef, useEffect } from 'react';
import type { Game, Profile } from '../types';
import { ProfileSelector } from './ProfileSelector';

interface SearchResult {
  type: 'talent' | 'gear' | 'companion' | 'build';
  name: string;
  description?: string;
  onClick?: () => void;
}

interface HeaderProps {
  currentGame: Game | null;
  onGameChange: () => void;
  profiles?: Profile[];
  currentProfile?: Profile | null;
  onSelectProfile?: (profile: Profile) => void;
  onCreateProfile?: (name: string, description?: string) => Promise<Profile>;
  onDeleteProfile?: (id: string) => Promise<void>;
  onDuplicateProfile?: (sourceId: string, newName: string) => Promise<Profile>;
  onRenameProfile?: (id: string, name: string) => Promise<void>;
  onExportProfile?: (id: string) => Promise<void>;
  onImportProfile?: (file: File) => Promise<Profile>;
  onClearAllData?: () => Promise<void>;
  onSearch?: (query: string) => SearchResult[];
}

const GAME_LOGOS: Record<string, string> = {
  'rogue-trader': '/images/logos/rogue-trader-logo.png',
  'baldurs-gate-3': '/images/logos/baldurs-gate-logo.png',
};

export function Header({ 
  currentGame, 
  onGameChange,
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onDuplicateProfile,
  onRenameProfile,
  onExportProfile,
  onImportProfile,
  onClearAllData,
  onSearch,
}: HeaderProps) {
  const gameLogo = currentGame ? GAME_LOGOS[currentGame.id] : null;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2 && onSearch) {
      setSearchResults(onSearch(value));
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    result.onClick?.();
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'talent': return '⚔️';
      case 'gear': return '🛡️';
      case 'companion': return '👤';
      case 'build': return '📋';
      default: return '🔍';
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {currentGame && (
            <button onClick={onGameChange} className="back-btn" title="Change Game">
              ‹
            </button>
          )}
          {gameLogo ? (
            <img src={gameLogo} alt={currentGame?.name} className="game-logo" />
          ) : (
            <h1>cRPG: Character Manager</h1>
          )}
        </div>
        {currentGame && profiles && onSelectProfile && onCreateProfile && onDeleteProfile && onDuplicateProfile && onRenameProfile && onExportProfile && onImportProfile && (
          <div className="header-right">
            {onSearch && (
              <div className="header-search" ref={searchRef}>
                <button 
                  className={`header-search-btn ${searchOpen ? 'active' : ''}`}
                  onClick={() => setSearchOpen(!searchOpen)}
                  title="Search"
                >
                  🔍
                </button>
                {searchOpen && (
                  <div className="header-search-dropdown">
                    <input
                      ref={inputRef}
                      type="text"
                      className="header-search-input"
                      placeholder="Search talents, gear..."
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                    />
                    {searchResults.length > 0 && (
                      <div className="header-search-results">
                        {searchResults.slice(0, 10).map((result, i) => (
                          <button
                            key={`${result.type}-${result.name}-${i}`}
                            className="header-search-result"
                            onClick={() => handleResultClick(result)}
                          >
                            <span className="result-icon">{getTypeIcon(result.type)}</span>
                            <span className="result-name">{result.name}</span>
                            <span className="result-type">{result.type}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchQuery.length >= 2 && searchResults.length === 0 && (
                      <div className="header-search-empty">No results</div>
                    )}
                  </div>
                )}
              </div>
            )}
            <ProfileSelector
              profiles={profiles}
              currentProfile={currentProfile ?? null}
              onSelectProfile={onSelectProfile}
              onCreateProfile={onCreateProfile}
              onDeleteProfile={onDeleteProfile}
              onDuplicateProfile={onDuplicateProfile}
              onRenameProfile={onRenameProfile}
              onExportProfile={onExportProfile}
              onImportProfile={onImportProfile}
              onClearAllData={onClearAllData}
            />
          </div>
        )}
      </div>
    </header>
  );
}
