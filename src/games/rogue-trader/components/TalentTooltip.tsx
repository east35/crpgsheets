import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getTalentInfo } from '../data/talents';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipField } from '../../../components/TooltipCard';
import './TalentTooltip.css';

interface TalentTooltipProps {
  talentName: string;
  children?: React.ReactNode;
}

export function TalentTooltip({ talentName, children }: TalentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const { showSheet, isMobile } = useTooltipSheet();

  const talentInfo = getTalentInfo(talentName);

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
    if (!isMobile || !talentInfo) return;
    e.preventDefault();
    e.stopPropagation();

    const meta: Array<{ label: string; value: string; color?: string }> = [];
    if (talentInfo.cost) meta.push({ label: 'Cost', value: talentInfo.cost, color: '#60a0ff' });
    if (talentInfo.target) meta.push({ label: 'Target', value: talentInfo.target, color: '#a0ff60' });

    showSheet({
      title: talentInfo.name,
      badge: talentInfo.source?.length
        ? { label: talentInfo.source.join(', ').toUpperCase(), background: '#5f4a2a', color: '#f1d29a' }
        : undefined,
      iconUrl: talentInfo.iconPath,
      stats: meta,
      description: talentInfo.effect || '',
      link: undefined,
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

      // Calculate position
      let top: number;
      if (triggerRect.top - tooltipHeight - 10 < 0) {
        top = triggerRect.bottom + 8;
      } else {
        top = triggerRect.top - tooltipHeight - 8;
      }

      // Calculate horizontal position with viewport containment
      let left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;

      // Constrain to viewport
      const padding = 10;
      if (left < padding) {
        left = padding;
      } else if (left + tooltipWidth > window.innerWidth - padding) {
        left = window.innerWidth - padding - tooltipWidth;
      }

      setTooltipStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  }, [isVisible]);

  const tooltipContent = isVisible && !isMobile && talentInfo && createPortal(
    <div
      ref={tooltipRef}
      className="crpg-tooltip-container"
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TooltipCard
        title={talentInfo.name}
        iconUrl={talentInfo.iconPath}
        badge={
          talentInfo.source?.length
            ? { label: talentInfo.source.join(', ').toUpperCase(), background: '#5f4a2a', color: '#f1d29a' }
            : undefined
        }
        stats={[
          ...(talentInfo.cost ? [{ label: 'Cost', value: talentInfo.cost } as TooltipField] : []),
          ...(talentInfo.target ? [{ label: 'Target', value: talentInfo.target } as TooltipField] : []),
        ]}
        description={talentInfo.effect || ''}
        link={undefined}
      />
    </div>,
    document.body
  );

  return (
    <span
      ref={triggerRef}
      className="talent-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || talentName}
      {tooltipContent}
    </span>
  );
}
