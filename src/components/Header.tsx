import { useState, useRef, useEffect } from 'react';
import type { Game, Profile } from '../types';
import { ProfileSelector } from './ProfileSelector';
import { HeaderGameSelector } from './HeaderGameSelector';
import { Search, Shield, User, List, FlaskSolid } from 'iconoir-react';

interface SearchResult {
  type: 'talent' | 'gear' | 'companion' | 'build';
  name: string;
  description?: string;
  onClick?: () => void;
}

interface HeaderProps {
  currentGame: Game;
  onSelectGame: (game: Game) => void;
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

export function Header({
  currentGame,
  onSelectGame,
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
      case 'talent': return <FlaskSolid width={16} height={16} />;
      case 'gear': return <Shield width={16} height={16} />;
      case 'companion': return <User width={16} height={16} />;
      case 'build': return <List width={16} height={16} />;
      default: return <Search width={16} height={16} />;
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <HeaderGameSelector
            currentGame={currentGame}
            onSelectGame={onSelectGame}
          />
        </div>
        {profiles && onSelectProfile && onCreateProfile && onDeleteProfile && onDuplicateProfile && onRenameProfile && onExportProfile && onImportProfile && (
          <div className="header-right">
            {onSearch && (
              <div className="header-search" ref={searchRef}>
                <button 
                  className={`header-search-btn ${searchOpen ? 'active' : ''}`}
                  onClick={() => setSearchOpen(!searchOpen)}
                  title="Search"
                >
                  <Search width={18} height={18} />
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
