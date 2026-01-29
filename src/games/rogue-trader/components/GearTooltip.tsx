import { useState, useRef, useEffect } from 'react';
import { getGearInfo } from '../data/gear';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipBadge, type TooltipField, type TooltipLink } from '../../../components/TooltipCard';
import './GearTooltip.css';

interface GearTooltipProps {
  gearName: string;
  children?: React.ReactNode;
}

export function GearTooltip({ gearName, children }: GearTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const { showSheet, isMobile } = useTooltipSheet();

  const gearInfo = getGearInfo(gearName);
  const sections: TooltipField[] = [];
  if (gearInfo?.stats?.slot) sections.push({ label: 'Slot', value: gearInfo.stats.slot });
  const stats: TooltipField[] = [];
  if (gearInfo?.stats?.rarity) stats.push({ label: 'Rarity', value: gearInfo.stats.rarity });
  if (gearInfo?.stats?.requirements) stats.push({ label: 'Requirements', value: gearInfo.stats.requirements });
  if (gearInfo?.stats?.keywords) stats.push({ label: 'Keywords', value: gearInfo.stats.keywords });

  const typeStyles: Record<string, { background: string; color: string }> = {
    weapon: { background: '#4a3030', color: '#ff8a8a' },
    accessory: { background: '#3a4a30', color: '#8aff8a' },
    item: { background: '#3a3a4a', color: '#c0c0ff' },
  };
  const typeStyle = gearInfo ? (typeStyles[gearInfo.type] || { background: '#3a3a4a', color: '#c0c0ff' }) : { background: '#3a3a4a', color: '#c0c0ff' };

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile || !gearInfo) return;
    e.preventDefault();
    e.stopPropagation();

    const sections: TooltipField[] = [];
    if (gearInfo.stats?.slot) sections.push({ label: 'Slot', value: gearInfo.stats.slot });
    const stats: TooltipField[] = [];
    if (gearInfo.stats?.rarity) stats.push({ label: 'Rarity', value: gearInfo.stats.rarity });
    if (gearInfo.stats?.requirements) stats.push({ label: 'Requirements', value: gearInfo.stats.requirements });
    if (gearInfo.stats?.keywords) stats.push({ label: 'Keywords', value: gearInfo.stats.keywords });

    const badge: TooltipBadge = {
      label: gearInfo.type.toUpperCase(),
      background: typeStyle.background,
      color: typeStyle.color,
    };

    showSheet({
      title: gearInfo.name,
      badge,
      iconUrl: gearInfo.imageRemote,
      sections,
      stats,
      description: gearInfo.effect || '',
      link: gearInfo.wikiUrl ? ({ label: 'View on Wiki', url: gearInfo.wikiUrl } as TooltipLink) : undefined,
    });
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const tooltipWidth = tooltipRef.current.offsetWidth;

      if (triggerRect.top - tooltipHeight - 10 < 0) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }

      // Check horizontal containment within main content area
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        const mainRect = mainContent.getBoundingClientRect();
        const tooltipLeft = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        const tooltipRight = tooltipLeft + tooltipWidth;

        if (tooltipLeft < mainRect.left + 10) {
          setHorizontalOffset(mainRect.left + 10 - tooltipLeft);
        } else if (tooltipRight > mainRect.right - 10) {
          setHorizontalOffset(mainRect.right - 10 - tooltipRight);
        } else {
          setHorizontalOffset(0);
        }
      }
    }
  }, [isVisible]);

  return (
    <span
      ref={triggerRef}
      className="gear-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || gearName}
      {isVisible && !isMobile && gearInfo && (
        <div
          ref={tooltipRef}
          className={`crpg-tooltip-container ${position}`}
          style={{ transform: `translateX(calc(-50% + ${horizontalOffset}px))` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <TooltipCard
            title={gearInfo.name}
            iconUrl={gearInfo.imageRemote}
            badge={{ label: gearInfo.type.toUpperCase(), background: typeStyle.background, color: typeStyle.color }}
            sections={sections}
            description={gearInfo.effect || ''}
            stats={stats}
            link={gearInfo.wikiUrl ? ({ label: 'View on Wiki', url: gearInfo.wikiUrl } as TooltipLink) : undefined}
          />
        </div>
      )}
    </span>
  );
}
