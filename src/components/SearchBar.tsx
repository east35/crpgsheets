import { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

interface SearchResult {
  type: 'talent' | 'gear' | 'companion' | 'build';
  name: string;
  description?: string;
  onClick?: () => void;
}

interface SearchBarProps {
  onSearch: (query: string) => SearchResult[];
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search talents, gear, items...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const searchResults = onSearch(value);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.onClick) {
      result.onClick();
    }
    setQuery('');
    setResults([]);
    setIsOpen(false);
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
    <div className="search-bar" ref={containerRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button 
            className="search-clear" 
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.slice(0, 20).map((result, index) => (
            <button
              key={`${result.type}-${result.name}-${index}`}
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <span className="result-icon">{getTypeIcon(result.type)}</span>
              <div className="result-content">
                <span className="result-name">{result.name}</span>
                {result.description && (
                  <span className="result-description">{result.description}</span>
                )}
              </div>
              <span className="result-type">{result.type}</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">No results found for "{query}"</div>
        </div>
      )}
    </div>
  );
}
