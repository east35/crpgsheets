import { useState } from 'react';
import { Xmark, Check, EditPencil } from 'iconoir-react';
import './PartyBar.css';

export interface PartyMember {
  id: string;
  buildId: string;
  name: string;
  level: number;
  avatarUrl?: string | null;
}

interface PartyBarProps {
  members: PartyMember[];
  currentBuildId: string | null;
  onSelectMember: (buildId: string, level: number) => void;
  onDeleteMember: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(/[:\s]+/)
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('');
}

export function PartyBar({
  members,
  currentBuildId,
  onSelectMember,
  onDeleteMember,
}: PartyBarProps) {
  const [deleteMode, setDeleteMode] = useState(false);

  if (members.length === 0) {
    return null;
  }

  return (
    <div className="party-bar">
      <div className="party-bar-content">
        <div className="party-avatars">
          {members.map((member) => {
            const isActive = member.buildId === currentBuildId;
            const initials = getInitials(member.name);

            return (
              <div
                key={member.id}
                className={`party-member ${isActive ? 'active' : ''} ${deleteMode ? 'delete-mode' : ''}`}
                onClick={() => {
                  if (deleteMode) {
                    onDeleteMember(member.id);
                  } else {
                    onSelectMember(member.buildId, member.level);
                  }
                }}
                title={`${member.name} - Level ${member.level}`}
              >
                {member.avatarUrl ? (
                  <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    className="party-avatar"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`party-avatar-fallback ${member.avatarUrl ? 'hidden' : ''}`}>
                  {initials}
                </div>
                <div className="party-level">{member.level}</div>
                {deleteMode && <div className="delete-badge"><Xmark width={12} height={12} /></div>}
                {isActive && <div className="active-indicator" />}
              </div>
            );
          })}
        </div>
        <button
          className={`party-edit-btn ${deleteMode ? 'active' : ''}`}
          onClick={() => setDeleteMode(!deleteMode)}
          title={deleteMode ? 'Done editing' : 'Remove builds'}
        >
          {deleteMode ? <Check width={16} height={16} /> : <EditPencil width={16} height={16} />}
        </button>
      </div>
    </div>
  );
}
