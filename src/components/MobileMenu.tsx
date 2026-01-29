import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Game, Profile } from '../types';
import { ProfileSelector } from './ProfileSelector';
import { GamePickerModal } from './GamePickerModal';
import { Menu, Xmark, NavArrowRight } from 'iconoir-react';
import './MobileMenu.css';

interface MobileMenuProps {
  currentGame: Game;
  onSelectGame: (game: Game) => void;
  profiles: Profile[];
  currentProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: (name: string, description?: string) => Promise<Profile>;
  onDeleteProfile: (id: string) => Promise<void>;
  onDuplicateProfile: (sourceId: string, newName: string) => Promise<Profile>;
  onRenameProfile: (id: string, name: string) => Promise<void>;
  onExportProfile: (id: string) => Promise<void>;
  onImportProfile: (file: File) => Promise<Profile>;
  onClearAllData?: () => Promise<void>;
}

export function MobileMenu({
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
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showGamePicker, setShowGamePicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showGamePicker) {
          setShowGamePicker(false);
        } else {
          setIsOpen(false);
        }
      }
    };
    if (isOpen || showGamePicker) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, showGamePicker]);

  // Close on click outside (for desktop dropdown)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !showGamePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, showGamePicker]);

  // Lock body scroll when menu is open (mobile only)
  // Uses position:fixed technique to prevent content shift
  useEffect(() => {
    if (isOpen && window.innerWidth <= 768) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    }
    return () => {
      if (document.body.style.position === 'fixed') {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  const handleGameSelect = (game: Game) => {
    onSelectGame(game);
    setShowGamePicker(false);
    setIsOpen(false);
  };

  const panelContent = (
    <>
      <button
        className="mobile-menu-close"
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
      >
        <Xmark width={24} height={24} />
      </button>
      <div className="mobile-menu-content">
        <section className="mobile-menu-section">
          <h3>Game</h3>
          <button
            className="game-select-btn"
            onClick={() => setShowGamePicker(true)}
          >
            <span className="game-select-info">
              {currentGame.logo ? (
                <img src={currentGame.logo} alt={currentGame.name} className="game-select-logo" />
              ) : (
                <span className="game-select-name">{currentGame.name}</span>
              )}
            </span>
            <NavArrowRight width={20} height={20} />
          </button>
        </section>

        <section className="mobile-menu-section">
          <h3>Profile</h3>
          <ProfileSelector
            profiles={profiles}
            currentProfile={currentProfile}
            onSelectProfile={(profile) => {
              onSelectProfile(profile);
              setIsOpen(false);
            }}
            onCreateProfile={onCreateProfile}
            onDeleteProfile={onDeleteProfile}
            onDuplicateProfile={onDuplicateProfile}
            onRenameProfile={onRenameProfile}
            onExportProfile={onExportProfile}
            onImportProfile={onImportProfile}
            onClearAllData={onClearAllData}
            variant="mobile"
          />
        </section>
      </div>
    </>
  );

  return (
    <div className="mobile-menu" ref={containerRef}>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <Xmark width={24} height={24} /> : <Menu width={24} height={24} />}
      </button>

      {/* Desktop: render panel inline as dropdown */}
      <div className={`mobile-menu-panel desktop-only ${isOpen ? 'open' : ''}`}>
        {panelContent}
      </div>

      {/* Mobile: portal overlay and panel to body for proper stacking */}
      {createPortal(
        <>
          {isOpen && (
            <div
              className="mobile-menu-overlay mobile-only"
              onClick={() => setIsOpen(false)}
            />
          )}
          <div className={`mobile-menu-panel mobile-only ${isOpen ? 'open' : ''}`}>
            {panelContent}
          </div>
        </>,
        document.body
      )}

      {/* Game Picker Modal */}
      {showGamePicker && (
        <GamePickerModal
          currentGame={currentGame}
          onSelectGame={handleGameSelect}
          onClose={() => setShowGamePicker(false)}
        />
      )}
    </div>
  );
}
