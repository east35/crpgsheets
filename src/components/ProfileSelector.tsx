import { useState } from 'react';
import type { Profile } from '../types';
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
}: ProfileSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  return (
    <div className="profile-selector">
      <button 
        className="profile-selector-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="profile-icon">📁</span>
        <span className="profile-name">{currentProfile?.name || 'Select Profile'}</span>
        <span className={`profile-arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="profile-dropdown">
          <div className="profile-list">
            {profiles.map(profile => (
              <div 
                key={profile.id} 
                className={`profile-item ${currentProfile?.id === profile.id ? 'active' : ''}`}
              >
                {editingId === profile.id ? (
                  <div className="profile-edit">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                      autoFocus
                    />
                    <button onClick={handleSaveRename}>✓</button>
                    <button onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <button 
                      className="profile-select-btn"
                      onClick={() => {
                        onSelectProfile(profile);
                        setIsExpanded(false);
                      }}
                    >
                      {profile.name}
                    </button>
                    <div className="profile-actions">
                      <button 
                        className="profile-action-btn"
                        onClick={() => handleStartRename(profile)}
                        title="Rename"
                      >
                        ✏️
                      </button>
                      <button 
                        className="profile-action-btn"
                        onClick={() => handleDuplicate(profile)}
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button 
                        className="profile-action-btn"
                        onClick={() => onExportProfile(profile.id)}
                        title="Export"
                      >
                        📤
                      </button>
                      <button 
                        className="profile-action-btn delete"
                        onClick={() => handleDelete(profile)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

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
              📥 Import Playthrough
            </button>
          </div>

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
      )}
    </div>
  );
}
