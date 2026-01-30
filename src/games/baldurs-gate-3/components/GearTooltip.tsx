import { createPortal } from 'react-dom';
import { getCsvGearInfo } from '../data/gear';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipBadge, type TooltipField } from '../../../components/TooltipCard';
import { useCursorTooltip } from '../../../components/useCursorTooltip';
import './GearTooltip.css';

interface GearTooltipProps {
  gearName: string;
  children: React.ReactNode;
}

export function GearTooltip({ gearName, children }: GearTooltipProps) {
  const { showSheet, isMobile } = useTooltipSheet();
  const { isVisible, tooltipRef, tooltipStyle, show, hide, handleMouseMove } = useCursorTooltip(!isMobile);

  const gearInfo = getCsvGearInfo(gearName);
  const rarityColors: Record<string, string> = {
    Common: '#9d9d9d',
    Uncommon: '#1eff00',
    Rare: '#0070dd',
    'Very Rare': '#a335ee',
    Legendary: '#ff8000',
  };

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
    if (gearInfo.slot) sections.push({ label: 'Slot', value: gearInfo.slot });
    if (gearInfo.type) sections.push({ label: 'Type', value: gearInfo.type });
    if (gearInfo.act) sections.push({ label: 'Act', value: String(gearInfo.act) });
    const stats: TooltipField[] = [];
    if (gearInfo.rarity) stats.push({ label: 'Rarity', value: gearInfo.rarity });
    if (gearInfo.location) stats.push({ label: 'Location', value: gearInfo.location });

    const badge: TooltipBadge = {
      label: (gearInfo.category === 'weapon' ? 'WEAPON' : 'GEAR'),
      background: (gearInfo.rarity && rarityColors[gearInfo.rarity]) || '#f0a319',
      color: '#1b1206',
    };

    showSheet({
      title: gearInfo.name,
      badge,
      sections,
      stats,
      iconUrl: gearInfo.image,
      description: gearInfo.description || '',
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
        iconUrl={gearInfo.image}
        badge={{
          label: gearInfo.category === 'weapon' ? 'WEAPON' : 'GEAR',
          background: (gearInfo.rarity && rarityColors[gearInfo.rarity]) || '#f0a319',
          color: '#1b1206',
        }}
        sections={[
          ...(gearInfo.slot ? [{ label: 'Slot', value: gearInfo.slot }] : []),
          ...(gearInfo.type ? [{ label: 'Type', value: gearInfo.type }] : []),
          ...(gearInfo.act ? [{ label: 'Act', value: String(gearInfo.act) }] : []),
        ]}
        description={gearInfo.description}
        stats={[
          ...(gearInfo.rarity ? [{ label: 'Rarity', value: gearInfo.rarity }] : []),
          ...(gearInfo.location ? [{ label: 'Location', value: gearInfo.location }] : []),
        ]}
      />
    </div>,
    document.body
  );

  return (
    <>
      <span
        className={`gear-trigger ${gearInfo ? 'has-info' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </span>
      {tooltipContent}
    </>
  );
}
