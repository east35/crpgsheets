import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Xmark } from 'iconoir-react';
import './TooltipSheet.css';
import { TooltipCard, type TooltipBadge, type TooltipField } from './TooltipCard';

interface TooltipContent {
  title: string;
  subtitle?: string;
  subtitleVariant?: 'text' | 'badge';
  subtitleColor?: string;
  subtitleBackground?: string;
  badge?: TooltipBadge;
  sections?: TooltipField[];
  flavor?: string;
  iconUrl?: string;
  meta?: Array<{ label: string; value: string; color?: string }>;
  stats?: TooltipField[];
  callout?: string;
  descriptionItalic?: boolean;
  description: string;
}

interface TooltipSheetContextType {
  showSheet: (content: TooltipContent) => void;
  hideSheet: () => void;
  isMobile: boolean;
}

const TooltipSheetContext = createContext<TooltipSheetContextType | null>(null);

export function useTooltipSheet() {
  const context = useContext(TooltipSheetContext);
  if (!context) {
    throw new Error('useTooltipSheet must be used within TooltipSheetProvider');
  }
  return context;
}

interface TooltipSheetProviderProps {
  children: ReactNode;
}

export function TooltipSheetProvider({ children }: TooltipSheetProviderProps) {
  const [content, setContent] = useState<TooltipContent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showSheet = useCallback((newContent: TooltipContent) => {
    setContent(newContent);
    setIsVisible(true);
  }, []);

  const hideSheet = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setContent(null), 300);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hideSheet();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, hideSheet]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <TooltipSheetContext.Provider value={{ showSheet, hideSheet, isMobile }}>
      {children}
      {content && createPortal(
        <div
          className={`tooltip-sheet-overlay ${isVisible ? 'visible' : ''}`}
          onClick={hideSheet}
        >
          <div
            className={`tooltip-sheet ${isVisible ? 'visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="tooltip-sheet-close" onClick={hideSheet}>
              <Xmark width={20} height={20} />
            </button>
            <div className="tooltip-sheet-content">
              <TooltipCard
                title={content.title}
                iconUrl={content.iconUrl}
                badge={
                  content.badge ||
                  (content.subtitle
                    ? {
                        label: content.subtitle,
                        background: content.subtitleBackground,
                        color: content.subtitleColor,
                      }
                    : undefined)
                }
                sections={content.sections}
                flavor={content.flavor}
                description={content.description}
                descriptionItalic={content.descriptionItalic}
                stats={content.stats || content.meta}
                callout={content.callout}
                link={content.link}
                variant="sheet"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </TooltipSheetContext.Provider>
  );
}
