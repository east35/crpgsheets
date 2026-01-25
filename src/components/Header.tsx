import type { Game, Profile } from '../types';
import { ProfileSelector } from './ProfileSelector';

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
}

const GAME_LOGOS: Record<string, string> = {
  'rogue-trader': 'https://cdn2.steamgriddb.com/logo/404bfdece06f0fc5ba56bef1e19d8896.png',
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
}: HeaderProps) {
  const gameLogo = currentGame ? GAME_LOGOS[currentGame.id] : null;

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
            <h1>CRPG Character Manager</h1>
          )}
        </div>
        {currentGame && profiles && onSelectProfile && onCreateProfile && onDeleteProfile && onDuplicateProfile && onRenameProfile && onExportProfile && onImportProfile && (
          <div className="header-right">
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
            />
          </div>
        )}
      </div>
    </header>
  );
}
