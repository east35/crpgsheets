import { createPortal } from 'react-dom';
import type { Archetype } from '../types';
import { ARCHETYPE_DISPLAY_NAMES } from '../types';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipField } from '../../../components/TooltipCard';
import { useCursorTooltip } from '../../../components/useCursorTooltip';
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
  const { showSheet, isMobile } = useTooltipSheet();
  const { isVisible, tooltipRef, tooltipStyle, show, hide, handleMouseMove } = useCursorTooltip(!isMobile);

  const info = ARCHETYPE_DESCRIPTIONS[archetype];
  const displayName = ARCHETYPE_DISPLAY_NAMES[archetype];
  const imageSrc = ARCHETYPE_IMAGES[archetype];

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (isMobile) return;
    if (!info) return;
    show(event);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hide();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile || !info) return;
    e.preventDefault();
    e.stopPropagation();

    showSheet({
      title: displayName,
      badge: { label: info.role.toUpperCase(), background: 'var(--color-rt-tooltip-badge-bg)', color: 'var(--color-rt-tooltip-badge-text)' },
      description: info.description,
      iconUrl: imageSrc,
    });
  };

  const tooltipContent = isVisible && !isMobile && info && createPortal(
    <div
      ref={tooltipRef}
      className="crpg-tooltip-container"
      style={tooltipStyle}
    >
      <TooltipCard
        title={displayName}
        iconUrl={imageSrc}
        badge={{ label: info.role.toUpperCase(), background: 'var(--color-rt-tooltip-badge-bg)', color: 'var(--color-rt-tooltip-badge-text)' }}
        sections={[{ label: 'Tier', value: tier } as TooltipField]}
        description={info.description}
      />
    </div>,
    document.body
  );

  return (
    <span
      className={`archetype-tooltip-trigger tier-${tier}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || displayName}
      {tooltipContent}
    </span>
  );
}
