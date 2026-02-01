import { createPortal } from 'react-dom';
import { getGearInfo } from '../data/gear';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipBadge, type TooltipField } from '../../../components/TooltipCard';
import { useCursorTooltip } from '../../../components/useCursorTooltip';
import './GearTooltip.css';

interface GearTooltipProps {
  gearName: string;
  children?: React.ReactNode;
}

export function GearTooltip({ gearName, children }: GearTooltipProps) {
  const { showSheet, isMobile } = useTooltipSheet();
  const { isVisible, tooltipRef, tooltipStyle, show, hide, handleMouseMove } = useCursorTooltip(!isMobile);

  const gearInfo = getGearInfo(gearName);
  const sections: TooltipField[] = [];
  if (gearInfo?.stats?.slot) sections.push({ label: 'Slot', value: gearInfo.stats.slot });
  const stats: TooltipField[] = [];
  if (gearInfo?.stats?.rarity) stats.push({ label: 'Rarity', value: gearInfo.stats.rarity });
  if (gearInfo?.stats?.requirements) stats.push({ label: 'Requirements', value: gearInfo.stats.requirements });
  if (gearInfo?.stats?.keywords) stats.push({ label: 'Keywords', value: gearInfo.stats.keywords });

  const typeStyles: Record<string, { background: string; color: string }> = {
    weapon: { background: 'var(--color-rt-gear-weapon-bg)', color: 'var(--color-rt-gear-weapon-text)' },
    accessory: { background: 'var(--color-rt-gear-accessory-bg)', color: 'var(--color-rt-gear-accessory-text)' },
    item: { background: 'var(--color-rt-gear-item-bg)', color: 'var(--color-rt-gear-item-text)' },
  };
  const typeStyle = gearInfo ? (typeStyles[gearInfo.type] || { background: 'var(--color-rt-gear-item-bg)', color: 'var(--color-rt-gear-item-text)' }) : { background: 'var(--color-rt-gear-item-bg)', color: 'var(--color-rt-gear-item-text)' };

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (isMobile) return;
    if (!gearInfo) return;
    show(event);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hide();
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
    });
  };

  const tooltipContent = isVisible && !isMobile && gearInfo && createPortal(
    <div
      ref={tooltipRef}
      className="crpg-tooltip-container"
      style={tooltipStyle}
    >
      <TooltipCard
        title={gearInfo.name}
        iconUrl={gearInfo.imageRemote}
        badge={{ label: gearInfo.type.toUpperCase(), background: typeStyle.background, color: typeStyle.color }}
        sections={sections}
        description={gearInfo.effect || ''}
        stats={stats}
      />
    </div>,
    document.body
  );

  return (
    <span
      className="gear-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || gearName}
      {tooltipContent}
    </span>
  );
}
