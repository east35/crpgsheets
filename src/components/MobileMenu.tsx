import { useState, useEffect } from 'react';
import type { Game, Profile } from '../types';
import { ProfileSelector } from './ProfileSelector';
import { HeaderGameSelector } from './HeaderGameSelector';
import { Menu, Xmark } from 'iconoir-react';
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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleGameSelect = (game: Game) => {
    onSelectGame(game);
    setIsOpen(false);
  };

  return (
    <div className="mobile-menu">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <Xmark width={24} height={24} /> : <Menu width={24} height={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}>
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
            <HeaderGameSelector
              currentGame={currentGame}
              onSelectGame={handleGameSelect}
              variant="mobile"
            />
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
      </div>
    </div>
  );
}
