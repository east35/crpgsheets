import { createPortal } from 'react-dom';
import { getTalentInfo } from '../data/talents';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipField } from '../../../components/TooltipCard';
import { useCursorTooltip } from '../../../components/useCursorTooltip';
import './TalentTooltip.css';

interface TalentTooltipProps {
  talentName: string;
  children?: React.ReactNode;
}

export function TalentTooltip({ talentName, children }: TalentTooltipProps) {
  const { showSheet, isMobile } = useTooltipSheet();
  const { isVisible, tooltipRef, tooltipStyle, show, hide, handleMouseMove } = useCursorTooltip(!isMobile);

  const talentInfo = getTalentInfo(talentName);

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (isMobile) return;
    if (!talentInfo) return;
    show(event);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hide();
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
    });
  };

  const tooltipContent = isVisible && !isMobile && talentInfo && createPortal(
    <div
      ref={tooltipRef}
      className="crpg-tooltip-container"
      style={tooltipStyle}
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
      className="talent-tooltip-trigger"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children || talentName}
      {tooltipContent}
    </span>
  );
}
