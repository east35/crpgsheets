import { useState, useRef, useEffect } from 'react';
import { getTalentInfo } from '../data/talents';
import './TalentTooltip.css';

interface TalentTooltipProps {
  talentName: string;
  children?: React.ReactNode;
}

export function TalentTooltip({ talentName, children }: TalentTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [horizontalOffset, setHorizontalOffset] = useState(0);
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
      
      // Check if tooltip would go above viewport
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
      className="talent-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children || talentName}
      {isVisible && talentInfo && (
        <div 
          ref={tooltipRef} 
          className={`talent-tooltip ${position}`}
          style={{ transform: `translateX(calc(-50% + ${horizontalOffset}px))` }}
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
        </div>
      )}
    </span>
  );
}
