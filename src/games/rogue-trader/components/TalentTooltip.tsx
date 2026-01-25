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
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const talentInfo = getTalentInfo(talentName);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      
      // Check if tooltip would go above viewport
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
      className="talent-tooltip-trigger"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || talentName}
      {isVisible && talentInfo && (
        <div ref={tooltipRef} className={`talent-tooltip ${position}`}>
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
