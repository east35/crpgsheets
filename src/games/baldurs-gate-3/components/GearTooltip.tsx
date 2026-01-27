import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getGearInfo } from '../data/gear';
import { KeywordText } from './KeywordText';
import './GearTooltip.css';

interface GearTooltipProps {
  gearName: string;
  children: React.ReactNode;
}

export function GearTooltip({ gearName, children }: GearTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'above' | 'below'>('below');
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [hasIcon, setHasIcon] = useState(true);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const gearInfo = getGearInfo(gearName);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const tooltipHeight = 200;
    const tooltipWidth = 320;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top: number;
    if (spaceBelow >= tooltipHeight || spaceBelow >= spaceAbove) {
      setPosition('below');
      top = rect.bottom + 8;
    } else {
      setPosition('above');
      top = rect.top - tooltipHeight - 8;
    }

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 10) left = 10;
    if (left + tooltipWidth > viewportWidth - 10) {
      left = viewportWidth - tooltipWidth - 10;
    }

    setTooltipStyle({
      position: 'fixed',
      top: `${Math.max(10, top)}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
    });
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const rarityColors: Record<string, string> = {
    'Common': '#9d9d9d',
    'Uncommon': '#1eff00',
    'Rare': '#0070dd',
    'Very Rare': '#a335ee',
    'Legendary': '#ff8000',
  };

  const tooltipContent = isVisible && gearInfo && createPortal(
    <div
      ref={tooltipRef}
      className={`bg3-gear-tooltip ${position}`}
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="gear-tooltip-header">
        <div className="gear-tooltip-title">
          {gearInfo.iconPath && hasIcon && (
            <img
              className="gear-tooltip-icon"
              src={gearInfo.iconPath}
              alt={gearInfo.name}
              onError={() => setHasIcon(false)}
            />
          )}
          <span 
            className="gear-tooltip-name"
            style={{ color: rarityColors[gearInfo.rarity] || '#fff' }}
          >
            {gearInfo.name}
          </span>
        </div>
        <span 
          className="gear-tooltip-rarity"
          style={{ backgroundColor: rarityColors[gearInfo.rarity] || '#666' }}
        >
          {gearInfo.rarity}
        </span>
      </div>
      <div className="gear-tooltip-meta">
        <span className="gear-slot">{gearInfo.slot}</span>
        {gearInfo.act && <span className="gear-act">Act {gearInfo.act}</span>}
      </div>
      <div className="gear-tooltip-effect">
        <KeywordText text={gearInfo.effect} />
      </div>
      {gearInfo.location && (
        <div className="gear-tooltip-location">
          📍 {gearInfo.location}
        </div>
      )}
      {gearInfo.wikiUrl && (
        <div className="gear-tooltip-link">
          <a href={gearInfo.wikiUrl} target="_blank" rel="noopener noreferrer">
            View on Wiki →
          </a>
        </div>
      )}
    </div>,
    document.body
  );

  return (
    <>
      <span
        ref={triggerRef}
        className={`gear-trigger ${gearInfo ? 'has-info' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}
