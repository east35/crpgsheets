import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getTalentInfo } from '../data/talents';
import './TalentTooltip.css';

interface TalentTooltipProps {
  talentName: string;
  children?: React.ReactNode;
}

export function TalentTooltip({ talentName, children }: TalentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const talentInfo = getTalentInfo(talentName);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 150);
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
      let newPosition: 'top' | 'bottom';
      
      if (triggerRect.top - tooltipHeight - 10 < 0) {
        newPosition = 'bottom';
        top = triggerRect.bottom + 8;
      } else {
        newPosition = 'top';
        top = triggerRect.top - tooltipHeight - 8;
      }
      
      setPosition(newPosition);

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

  const tooltipContent = isVisible && talentInfo && createPortal(
    <div 
      ref={tooltipRef} 
      className={`talent-tooltip ${position}`}
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="talent-tooltip-header">
        {talentInfo.iconPath && (
          <img
            src={talentInfo.iconPath}
            alt={talentInfo.name}
            className="talent-tooltip-image"
          />
        )}
        <span className="talent-tooltip-name">{talentInfo.name}</span>
      </div>
      {talentInfo.source && talentInfo.source.length > 0 && (
        <div className="talent-tooltip-source">
          {talentInfo.source.join(', ')}
        </div>
      )}
      {(talentInfo.cost || talentInfo.target) && (
        <div className="talent-tooltip-meta">
          {talentInfo.cost && <span className="talent-cost">Cost: {talentInfo.cost}</span>}
          {talentInfo.target && <span className="talent-target">Target: {talentInfo.target}</span>}
        </div>
      )}
      <div className="talent-tooltip-description">
        {talentInfo.effect}
      </div>
    </div>,
    document.body
  );

  return (
    <span
      ref={triggerRef}
      className="talent-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children || talentName}
      {tooltipContent}
    </span>
  );
}
