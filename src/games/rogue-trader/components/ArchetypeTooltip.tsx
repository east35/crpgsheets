import { useState, useRef, useEffect } from 'react';
import type { Archetype } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import './ArchetypeTooltip.css';

// Archetype image paths
const ARCHETYPE_IMAGES: Partial<Record<Archetype, string>> = {
  warrior: '/images/archetypes/rogue-trader/warrior.png',
  operative: '/images/archetypes/rogue-trader/operative.png',
  soldier: '/images/archetypes/rogue-trader/soldier.png',
  officer: '/images/archetypes/rogue-trader/officer.png',
  bladeDancer: '/images/archetypes/rogue-trader/bladeDancer.png',
  assassin: '/images/archetypes/rogue-trader/assassin.png',
  vanguard: '/images/archetypes/rogue-trader/vanguard.png',
  bountyHunter: '/images/archetypes/rogue-trader/bountyHunter.png',
  masterTactician: '/images/archetypes/rogue-trader/masterTactician.png',
  archMilitant: '/images/archetypes/rogue-trader/archMilitant.png',
  executioner: '/images/archetypes/rogue-trader/executioner.png',
  grandStrategist: '/images/archetypes/rogue-trader/grandStrategist.png',
  overseer: '/images/archetypes/rogue-trader/overseer.png',
  exemplar: '/images/archetypes/rogue-trader/exemplar.png',
};

// Archetype descriptions
const ARCHETYPE_DESCRIPTIONS: Partial<Record<Archetype, { description: string; role: string }>> = {
  warrior: {
    role: 'Melee DPS / Tank',
    description: 'Warriors excel in close combat, wielding powerful melee weapons and wearing heavy armor. They can charge into battle and break through enemy lines.',
  },
  operative: {
    role: 'Ranged DPS / Utility',
    description: 'Operatives are versatile combatants skilled in ranged weapons and tactical maneuvers. They excel at exploiting enemy weaknesses.',
  },
  soldier: {
    role: 'Ranged DPS',
    description: 'Soldiers are disciplined fighters trained in the use of ranged weapons. They provide consistent damage output from a distance.',
  },
  officer: {
    role: 'Support / Buffer',
    description: 'Officers inspire and command their allies, providing powerful buffs and tactical advantages through leadership abilities.',
  },
  bladeDancer: {
    role: 'Melee DPS',
    description: 'Blade Dancers are agile melee combatants who weave through battle with deadly grace, striking multiple enemies with fluid movements.',
  },
  assassin: {
    role: 'Burst DPS',
    description: 'Assassins specialize in eliminating high-value targets with devastating single-target damage and critical strikes.',
  },
  vanguard: {
    role: 'Tank / Frontline',
    description: 'Vanguards are heavily armored warriors who protect their allies by drawing enemy attention and absorbing damage.',
  },
  bountyHunter: {
    role: 'Ranged DPS / Debuffer',
    description: 'Bounty Hunters track and eliminate their prey with precision, applying debuffs and exploiting marked targets.',
  },
  masterTactician: {
    role: 'Support / Controller',
    description: 'Master Tacticians control the battlefield through superior strategy, repositioning allies and disrupting enemy formations.',
  },
  archMilitant: {
    role: 'Melee DPS / Tank',
    description: 'Arch-Militants are elite warriors who combine offensive prowess with defensive capabilities, leading from the front.',
  },
  executioner: {
    role: 'Burst DPS',
    description: 'Executioners deliver devastating finishing blows, specializing in eliminating weakened enemies with extreme prejudice.',
  },
  grandStrategist: {
    role: 'Support / Buffer',
    description: 'Grand Strategists orchestrate battle from afar, providing powerful army-wide buffs and strategic advantages.',
  },
  overseer: {
    role: 'Support / Summoner',
    description: 'Overseers command servitors and other units, overwhelming enemies through superior numbers and coordination.',
  },
  exemplar: {
    role: 'Ultimate',
    description: 'Exemplars have mastered their chosen path, gaining access to the most powerful abilities and talents.',
  },
};

interface ArchetypeTooltipProps {
  archetype: Archetype;
  tier: 'base' | 'advanced' | 'exemplar';
  children?: React.ReactNode;
}

export function ArchetypeTooltip({ archetype, tier, children }: ArchetypeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const { showSheet, isMobile } = useTooltipSheet();

  const info = ARCHETYPE_DESCRIPTIONS[archetype];
  const displayName = ARCHETYPE_DISPLAY_NAMES[archetype];
  const imageSrc = ARCHETYPE_IMAGES[archetype];

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
    if (!isMobile || !info) return;
    e.preventDefault();
    e.stopPropagation();

    showSheet({
      title: displayName,
      subtitle: info.role,
      description: info.description,
      iconUrl: imageSrc,
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
      className={`archetype-tooltip-trigger tier-${tier}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || displayName}
      {isVisible && !isMobile && info && (
        <div
          ref={tooltipRef}
          className={`archetype-tooltip ${position}`}
          style={{ transform: `translateX(calc(-50% + ${horizontalOffset}px))` }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="archetype-tooltip-header">
            {imageSrc && (
              <img
                src={imageSrc}
                alt={displayName}
                className="archetype-tooltip-image"
              />
            )}
            <div className="archetype-tooltip-header-text">
              <span className={`archetype-tooltip-name tier-${tier}`}>{displayName}</span>
              <span className="archetype-tooltip-role">{info.role}</span>
            </div>
          </div>
          <div className="archetype-tooltip-description">
            {info.description}
          </div>
        </div>
      )}
    </span>
  );
}
