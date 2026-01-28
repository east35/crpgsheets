import { useState, useRef, useEffect } from 'react';
import type { Profile } from '../types';
import { Folder, NavArrowDown, Check, Xmark, EditPencil, Copy, Download, ShareIos, Trash } from 'iconoir-react';
import './ProfileSelector.css';

interface ProfileSelectorProps {
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
  variant?: 'default' | 'mobile';
}

export function ProfileSelector({
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
  variant = 'default',
}: ProfileSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleCreate = async () => {
    if (!newProfileName.trim()) return;
    const profile = await onCreateProfile(newProfileName.trim());
    setNewProfileName('');
    setIsCreating(false);
    onSelectProfile(profile);
  };

  const handleDuplicate = async (profile: Profile) => {
    const newProfile = await onDuplicateProfile(profile.id, `${profile.name} (Copy)`);
    onSelectProfile(newProfile);
  };

  const handleDelete = async (profile: Profile) => {
    if (profiles.length <= 1) {
      alert('You must have at least one profile.');
      return;
    }
    if (confirm(`Delete "${profile.name}" and all its tracked builds?`)) {
      await onDeleteProfile(profile.id);
      // Select another profile if we deleted the current one
      if (currentProfile?.id === profile.id) {
        const remaining = profiles.filter(p => p.id !== profile.id);
        if (remaining.length > 0) {
          onSelectProfile(remaining[0]);
        }
      }
    }
  };

  const handleStartRename = (profile: Profile) => {
    setEditingId(profile.id);
    setEditingName(profile.name);
  };

  const handleSaveRename = async () => {
    if (editingId && editingName.trim()) {
      await onRenameProfile(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  // Mobile variant: show content directly without dropdown toggle
  if (variant === 'mobile') {
    return (
      <div className="profile-selector mobile" ref={containerRef}>
        <div className="profile-dropdown mobile">
          {/* Current Profile Section */}
          {currentProfile && editingId !== currentProfile.id && (
            <div className="profile-current">
              <div className="profile-current-header">
                <span className="profile-current-label">Current Playthrough</span>
              </div>
              <div className="profile-current-name">{currentProfile.name}</div>
              <div className="profile-current-actions">
                <button
                  className="profile-action-btn-large"
                  onClick={() => handleStartRename(currentProfile)}
                >
                  <EditPencil width={16} height={16} />
                  <span>Rename</span>
                </button>
                <button
                  className="profile-action-btn-large"
                  onClick={() => handleDuplicate(currentProfile)}
                >
                  <Copy width={16} height={16} />
                  <span>Duplicate</span>
                </button>
                <button
                  className="profile-action-btn-large"
                  onClick={() => onExportProfile(currentProfile.id)}
                >
                  <ShareIos width={16} height={16} />
                  <span>Share</span>
                </button>
                <button
                  className="profile-action-btn-large delete"
                  onClick={() => handleDelete(currentProfile)}
                >
                  <Trash width={16} height={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* Rename form for current profile */}
          {editingId === currentProfile?.id && (
            <div className="profile-current">
              <div className="profile-current-header">
                <span className="profile-current-label">Rename Playthrough</span>
              </div>
              <div className="profile-edit-large">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  autoFocus
                />
                <div className="profile-edit-buttons">
                  <button className="save" onClick={handleSaveRename}>
                    <Check width={16} height={16} /> Save
                  </button>
                  <button onClick={() => setEditingId(null)}>
                    <Xmark width={16} height={16} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Switch Profile Section */}
          {profiles.length > 1 && (
            <div className="profile-switch-section">
              <span className="profile-current-label">Switch Playthrough</span>
              <div className="profile-list">
                {profiles.filter(p => p.id !== currentProfile?.id).map(profile => (
                  <div key={profile.id} className="profile-item">
                    {editingId === profile.id ? (
                      <div className="profile-edit">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                          autoFocus
                        />
                        <button onClick={handleSaveRename}><Check width={14} height={14} /></button>
                        <button onClick={() => setEditingId(null)}><Xmark width={14} height={14} /></button>
                      </div>
                    ) : (
                      <button
                        className="profile-select-btn"
                        onClick={() => onSelectProfile(profile)}
                      >
                        {profile.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions - pinned to bottom of panel */}
        <div className="profile-bottom-actions">
          {isCreating ? (
            <div className="profile-create-form">
              <input
                type="text"
                placeholder="New profile name..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => setIsCreating(false)}>Cancel</button>
            </div>
          ) : (
            <button 
              className="profile-create-btn"
              onClick={() => setIsCreating(true)}
            >
              + New Playthrough
            </button>
          )}

          <button
            className="profile-import-btn"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  try {
                    const newProfile = await onImportProfile(file);
                    onSelectProfile(newProfile);
                  } catch (err) {
                    alert('Failed to import: ' + (err as Error).message);
                  }
                }
              };
              input.click();
            }}
          >
            <Download width={14} height={14} /> Import Playthrough
          </button>

          {onClearAllData && (
            <div className="profile-privacy">
              <p className="privacy-notice">Data is stored locally on this device.</p>
              <button 
                className="clear-data-btn"
                onClick={async () => {
                  if (confirm('This will permanently delete ALL profiles and builds. This cannot be undone. Continue?')) {
                    await onClearAllData();
                  }
                }}
              >
                <Trash width={14} height={14} /> Clear All Local Data
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-selector" ref={containerRef}>
      <button 
        className="profile-selector-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="profile-icon"><Folder width={16} height={16} /></span>
        <span className="profile-name">{currentProfile?.name || 'Select Profile'}</span>
        <span className={`profile-arrow ${isExpanded ? 'expanded' : ''}`}><NavArrowDown width={14} height={14} /></span>
      </button>

      {isExpanded && (
        <div className="profile-dropdown">
          {/* Current Profile Section */}
          {currentProfile && editingId !== currentProfile.id && (
            <div className="profile-current">
              <div className="profile-current-header">
                <span className="profile-current-label">Current Playthrough</span>
              </div>
              <div className="profile-current-name">{currentProfile.name}</div>
              <div className="profile-current-actions">
                <button
                  className="profile-action-btn-large"
                  onClick={() => handleStartRename(currentProfile)}
                >
                  <EditPencil width={16} height={16} />
                  <span>Rename</span>
                </button>
                <button
                  className="profile-action-btn-large"
                  onClick={() => handleDuplicate(currentProfile)}
                >
                  <Copy width={16} height={16} />
                  <span>Duplicate</span>
                </button>
                <button
                  className="profile-action-btn-large"
                  onClick={() => onExportProfile(currentProfile.id)}
                >
                  <ShareIos width={16} height={16} />
                  <span>Export</span>
                </button>
                <button
                  className="profile-action-btn-large delete"
                  onClick={() => handleDelete(currentProfile)}
                >
                  <Trash width={16} height={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* Rename form for current profile */}
          {editingId === currentProfile?.id && (
            <div className="profile-current">
              <div className="profile-current-header">
                <span className="profile-current-label">Rename Playthrough</span>
              </div>
              <div className="profile-edit-large">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  autoFocus
                />
                <div className="profile-edit-buttons">
                  <button className="save" onClick={handleSaveRename}>
                    <Check width={16} height={16} /> Save
                  </button>
                  <button onClick={() => setEditingId(null)}>
                    <Xmark width={16} height={16} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Switch Profile Section */}
          {profiles.length > 1 && (
            <div className="profile-switch-section">
              <div className="profile-switch-header">Switch Playthrough</div>
              <div className="profile-list">
                {profiles.filter(p => p.id !== currentProfile?.id).map(profile => (
                  <div key={profile.id} className="profile-item">
                    {editingId === profile.id ? (
                      <div className="profile-edit">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                          autoFocus
                        />
                        <button onClick={handleSaveRename}><Check width={14} height={14} /></button>
                        <button onClick={() => setEditingId(null)}><Xmark width={14} height={14} /></button>
                      </div>
                    ) : (
                      <button
                        className="profile-select-btn"
                        onClick={() => {
                          onSelectProfile(profile);
                          setIsExpanded(false);
                        }}
                      >
                        {profile.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="profile-import-export">
            <button
              className="profile-import-btn"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    try {
                      const newProfile = await onImportProfile(file);
                      onSelectProfile(newProfile);
                      setIsExpanded(false);
                    } catch (err) {
                      alert('Failed to import: ' + (err as Error).message);
                    }
                  }
                };
                input.click();
              }}
            >
              <Download width={14} height={14} /> Import Playthrough
            </button>
            {isCreating ? (
            <div className="profile-create-form">
              <input
                type="text"
                placeholder="New profile name..."
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => setIsCreating(false)}>Cancel</button>
            </div>
          ) : (
            <button 
              className="profile-create-btn"
              onClick={() => setIsCreating(true)}
            >
              + New Playthrough
            </button>
          )}
          </div>

          

          {onClearAllData && (
            <div className="profile-privacy">
              <p className="privacy-notice">Data is stored locally on this device.</p>
              <button 
                className="clear-data-btn"
                onClick={async () => {
                  if (confirm('This will permanently delete ALL profiles and builds. This cannot be undone. Continue?')) {
                    await onClearAllData();
                    setIsExpanded(false);
                  }
                }}
              >
                <Trash width={14} height={14} /> Clear All Local Data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
