import { createPortal } from 'react-dom';
import type { Game, Profile } from '../types';
import { MobileMenu } from './MobileMenu';

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
  // Nav props
  isPartyActive?: boolean;
  onViewParty?: () => void;
  // Subnav items for nav tabs (Companions, Rogue Trader/Tav)
  subnavItems?: { label: string; active: boolean; onClick: () => void }[];
  // Explicitly control when to show the builds subnav (only when browsing build lists)
  showBuildsSubnav?: boolean;
}

// Check if any subnav item is active (means we're in "Builds" mode)
function isBuildsActive(subnavItems?: { active: boolean }[]): boolean {
  return subnavItems?.some(item => item.active) ?? false;
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
  isPartyActive,
  onViewParty,
  subnavItems,
  showBuildsSubnav,
}: HeaderProps) {
  const buildsActive = isBuildsActive(subnavItems);

  return (
    <>
      <header className="header">
        <div className="header-content">
          {/* Left: Logo */}
          <div className="header-left">
            <img
              src="/images/marketing/SheetsLogo.png"
              alt="Sheets"
              className="header-logo"
            />
          </div>

          {/* Center: Nav tabs */}
          {onViewParty && subnavItems && (
            <>
              {/* Desktop: Party, Companions, Rogue Trader/Tav */}
              <div className="header-nav desktop-only">
                <button
                  className={`header-nav-tab ${isPartyActive ? 'active' : ''}`}
                  onClick={onViewParty}
                >
                  Party
                </button>
                {subnavItems.map((item, i) => (
                  <button
                    key={i}
                    className={`header-nav-tab ${item.active ? 'active' : ''}`}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Mobile: Party, Builds (consolidated) */}
              <div className="header-nav mobile-only">
                <button
                  className={`header-nav-tab ${isPartyActive ? 'active' : ''}`}
                  onClick={onViewParty}
                >
                  Party
                </button>
                <button
                  className={`header-nav-tab ${buildsActive ? 'active' : ''}`}
                  onClick={subnavItems[0]?.onClick}
                >
                  Builds
                </button>
              </div>
            </>
          )}

          {/* Right: Hamburger menu (dropdown on desktop, slide-out on mobile) */}
          {profiles && onSelectProfile && onCreateProfile && onDeleteProfile && onDuplicateProfile && onRenameProfile && onExportProfile && onImportProfile && (
            <MobileMenu
              currentGame={currentGame}
              onSelectGame={onSelectGame}
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
          )}
        </div>
      </header>

      {/* Mobile sticky bottom subnav: Companions / Rogue Trader tabs */}
      {/* Only shown when actively browsing build lists (not viewing party details) */}
      {subnavItems && showBuildsSubnav && createPortal(
        <div className="builds-subnav mobile-only">
          {subnavItems.map((item, i) => (
            <button
              key={i}
              className={`builds-subnav-tab ${item.active ? 'active' : ''}`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
