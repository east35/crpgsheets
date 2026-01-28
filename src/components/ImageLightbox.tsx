import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Xmark } from 'iconoir-react';
import './ImageLightbox.css';

interface ImageLightboxProps {
  src: string;
  alt?: string;
  onClose: () => void;
  children?: ReactNode;
}

export function ImageLightbox({ src, alt, onClose, children }: ImageLightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <Xmark width={24} height={24} />
      </button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt || ''} className="lightbox-image" />
        {children}
      </div>
    </div>,
    document.body
  );
}
