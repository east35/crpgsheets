import { useRef, useState } from 'react';
import { Camera, Trash } from 'iconoir-react';
import { db, type CustomAvatar } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import './AvatarUpload.css';

interface AvatarUploadProps {
  buildId: string;
  gameId: string;
  profileId: string;
  onAvatarChange?: (avatarUrl: string | null) => void;
  className?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const TARGET_WIDTH = 200;
const TARGET_HEIGHT = 250;

async function resizeImage(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate crop to maintain aspect ratio (center crop)
      const sourceAspect = img.width / img.height;
      const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;
      
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      if (sourceAspect > targetAspect) {
        // Image is wider - crop sides
        sourceWidth = img.height * targetAspect;
        sourceX = (img.width - sourceWidth) / 2;
      } else {
        // Image is taller - crop top/bottom
        sourceHeight = img.width / targetAspect;
        sourceY = (img.height - sourceHeight) / 2;
      }

      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, TARGET_WIDTH, TARGET_HEIGHT
      );

      const mimeType = 'image/jpeg';
      const data = canvas.toDataURL(mimeType, 0.85);
      resolve({ data, mimeType });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function AvatarUpload({ 
  buildId, 
  gameId, 
  profileId, 
  onAvatarChange,
  className = '' 
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const customAvatar = useLiveQuery(
    () => db.customAvatars.where('buildId').equals(buildId).first(),
    [buildId]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please select a JPEG, PNG, or WebP image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be under 2MB');
      return;
    }

    setIsUploading(true);

    try {
      const { data, mimeType } = await resizeImage(file);
      const now = new Date().toISOString();

      const avatarData: CustomAvatar = {
        id: `avatar-${buildId}`,
        gameId,
        profileId,
        buildId,
        imageData: data,
        mimeType,
        createdAt: customAvatar?.createdAt || now,
        updatedAt: now,
      };

      await db.customAvatars.put(avatarData);
      onAvatarChange?.(data);
    } catch (err) {
      setError('Failed to process image');
      console.error('Avatar upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!customAvatar) return;
    
    try {
      await db.customAvatars.delete(customAvatar.id);
      onAvatarChange?.(null);
    } catch (err) {
      setError('Failed to delete avatar');
      console.error('Avatar delete error:', err);
    }
  };

  const avatarUrl = customAvatar?.imageData || null;

  return (
    <div className={`avatar-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileSelect}
        className="avatar-upload-input"
        aria-label="Upload avatar"
      />
      
      {avatarUrl ? (
        <div className="avatar-upload-preview">
          <img src={avatarUrl} alt="Custom avatar" className="avatar-upload-image" />
          <div className="avatar-upload-actions">
            <button
              className="avatar-action-btn upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Change avatar"
            >
              <Camera width={16} height={16} />
            </button>
            <button
              className="avatar-action-btn delete"
              onClick={handleDelete}
              aria-label="Delete avatar"
            >
              <Trash width={16} height={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="avatar-upload-placeholder"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera width={24} height={24} />
          <span>{isUploading ? 'Uploading...' : 'Add Photo'}</span>
        </button>
      )}
      
      {error && <div className="avatar-upload-error">{error}</div>}
    </div>
  );
}

export function useCustomAvatar(buildId: string | undefined) {
  return useLiveQuery(
    () => buildId ? db.customAvatars.where('buildId').equals(buildId).first() : undefined,
    [buildId]
  );
}

export function useCustomAvatars(buildIds: string[]) {
  return useLiveQuery(
    async () => {
      if (buildIds.length === 0) return {};
      const avatars = await db.customAvatars.where('buildId').anyOf(buildIds).toArray();
      const map: Record<string, string> = {};
      for (const avatar of avatars) {
        map[avatar.buildId] = avatar.imageData;
      }
      return map;
    },
    [buildIds.join(',')],
    {}
  );
}
