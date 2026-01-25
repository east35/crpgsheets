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
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const gearInfo = getGearInfo(gearName);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      
      if (triggerRect.top - tooltipHeight - 10 < 0) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <span
      ref={triggerRef}
      className="gear-tooltip-trigger"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || gearName}
      {isVisible && gearInfo && (
        <div ref={tooltipRef} className={`gear-tooltip ${position}`}>
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
