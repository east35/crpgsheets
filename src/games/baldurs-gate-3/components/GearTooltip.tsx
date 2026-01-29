import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getGearInfo } from '../data/gear';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipBadge, type TooltipField, type TooltipLink } from '../../../components/TooltipCard';
import './GearTooltip.css';

interface GearTooltipProps {
  gearName: string;
  children: React.ReactNode;
}

export function GearTooltip({ gearName, children }: GearTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const { showSheet, isMobile } = useTooltipSheet();

  const gearInfo = getGearInfo(gearName);
  const rarityColors: Record<string, string> = {
    Common: '#9d9d9d',
    Uncommon: '#1eff00',
    Rare: '#0070dd',
    'Very Rare': '#a335ee',
    Legendary: '#ff8000',
  };

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
      top = rect.bottom + 8;
    } else {
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
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, 200);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile || !gearInfo) return;
    e.preventDefault();
    e.stopPropagation();

    const sections: TooltipField[] = [{ label: 'Slot', value: gearInfo.slot }];
    if (gearInfo.act) sections.push({ label: 'Act', value: String(gearInfo.act) });
    const stats: TooltipField[] = [];
    if (gearInfo.rarity) stats.push({ label: 'Rarity', value: gearInfo.rarity });
    if (gearInfo.location) stats.push({ label: 'Location', value: gearInfo.location });

    const badge: TooltipBadge = {
      label: gearInfo.type.toUpperCase(),
      background: rarityColors[gearInfo.rarity] || '#f0a319',
      color: '#1b1206',
    };

    showSheet({
      title: gearInfo.name,
      badge,
      sections,
      stats,
      iconUrl: gearInfo.iconPath,
      description: gearInfo.effect,
      link: gearInfo.wikiUrl ? ({ label: 'View on Wiki', url: gearInfo.wikiUrl } as TooltipLink) : undefined,
    });
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const tooltipContent = isVisible && !isMobile && gearInfo && createPortal(
    <div
      ref={tooltipRef}
      className="crpg-tooltip-container"
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TooltipCard
        title={gearInfo.name}
        iconUrl={gearInfo.iconPath}
        badge={{
          label: gearInfo.type.toUpperCase(),
          background: rarityColors[gearInfo.rarity] || '#f0a319',
          color: '#1b1206',
        }}
        sections={[
          { label: 'Slot', value: gearInfo.slot },
          ...(gearInfo.act ? [{ label: 'Act', value: String(gearInfo.act) }] : []),
        ]}
        description={gearInfo.effect}
        stats={[
          ...(gearInfo.rarity ? [{ label: 'Rarity', value: gearInfo.rarity }] : []),
          ...(gearInfo.location ? [{ label: 'Location', value: gearInfo.location }] : []),
        ]}
        link={gearInfo.wikiUrl ? ({ label: 'View on Wiki', url: gearInfo.wikiUrl } as TooltipLink) : undefined}
      />
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
        onClick={handleClick}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}
