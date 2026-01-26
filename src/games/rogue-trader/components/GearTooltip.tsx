import { useState, useRef, useEffect } from 'react';
import { getGearInfo } from '../data/gear';
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

  const gearInfo = getGearInfo(gearName);

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
    >
      {children || gearName}
      {isVisible && gearInfo && (
        <div 
          ref={tooltipRef} 
          className={`gear-tooltip ${position}`}
          style={{ transform: `translateX(calc(-50% + ${horizontalOffset}px))` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="gear-tooltip-header">
            {gearInfo.imageRemote && (
              <img 
                src={gearInfo.imageRemote} 
                alt={gearInfo.name}
                className="gear-tooltip-image"
              />
            )}
            <div className="gear-tooltip-header-text">
              <span className="gear-tooltip-name">{gearInfo.name}</span>
              <span className={`gear-tooltip-type ${gearInfo.type}`}>{gearInfo.type}</span>
            </div>
          </div>
          {gearInfo.stats && Object.keys(gearInfo.stats).length > 0 && (
            <div className="gear-tooltip-stats">
              {gearInfo.stats.damage && <span className="gear-stat">Damage: {gearInfo.stats.damage}</span>}
              {gearInfo.stats.armorPenetration && <span className="gear-stat">AP: {gearInfo.stats.armorPenetration}</span>}
              {gearInfo.stats.damageType && <span className="gear-stat">Type: {gearInfo.stats.damageType}</span>}
              {gearInfo.stats.slot && <span className="gear-stat">Slot: {gearInfo.stats.slot}</span>}
            </div>
          )}
          <div className="gear-tooltip-description">
            {gearInfo.effect}
          </div>
        </div>
      )}
    </span>
  );
}
