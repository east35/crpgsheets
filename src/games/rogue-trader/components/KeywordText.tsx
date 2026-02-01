import { createPortal } from 'react-dom';
import { findKeyword, ALL_KEYWORD_NAMES, type KeywordInfo } from '../data/character';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipBadge, type TooltipField } from '../../../components/TooltipCard';
import { useCursorTooltip } from '../../../components/useCursorTooltip';
import './KeywordText.css';

interface KeywordTextProps {
  text: string;
}

interface KeywordMatch {
  start: number;
  end: number;
  keyword: string;
  info: KeywordInfo;
}

function findKeywordMatches(text: string): KeywordMatch[] {
  const matches: KeywordMatch[] = [];
  const usedRanges: [number, number][] = [];

  // ALL_KEYWORD_NAMES is sorted by length (longest first) to prioritize longer matches
  for (const keywordName of ALL_KEYWORD_NAMES) {
    if (keywordName.length < 3) continue; // Skip very short keywords
    
    // Create a case-insensitive regex that matches whole words
    const escapedKeyword = keywordName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      
      // Check if this range overlaps with any existing match
      const overlaps = usedRanges.some(([s, e]) => 
        (start >= s && start < e) || (end > s && end <= e) || (start <= s && end >= e)
      );
      
      if (!overlaps) {
        const info = findKeyword(keywordName);
        if (info) {
          matches.push({ start, end, keyword: match[0], info });
          usedRanges.push([start, end]);
        }
      }
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start);
  return matches;
}

function KeywordTooltip({ info, children }: { info: KeywordInfo; children: React.ReactNode }) {
  const { showSheet, isMobile } = useTooltipSheet();
  const { isVisible, tooltipRef, tooltipStyle, show, hide, handleMouseMove } = useCursorTooltip(!isMobile);

  const categoryColors: Record<string, string> = {
    homeworld: 'var(--color-keyword-homeworld)',
    origin: 'var(--color-keyword-origin)',
    archetype: 'var(--color-keyword-archetype)',
    characteristic: 'var(--color-keyword-characteristic)',
    skill: 'var(--color-keyword-skill)',
    stat: 'var(--color-keyword-stat)',
    conviction: 'var(--color-keyword-conviction)',
    'status-effect': 'var(--color-keyword-status-effect)',
    talent: 'var(--color-keyword-talent)',
    ability: 'var(--color-keyword-ability)',
  };

  const buildBadge = (category: string): TooltipBadge => ({
    label: category.replace('-', ' ').toUpperCase(),
    background: categoryColors[category] || 'var(--color-keyword-background)',
  });

  const buildSections = (): TooltipField[] => [];

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (isMobile) return;
    show(event);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hide();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    
    showSheet({
      title: info.name,
      badge: buildBadge(info.category),
      iconUrl: info.imageRemote,
      sections: buildSections(),
      description: info.effect || '',
    });
  };

  const tooltipContent = isVisible && createPortal(
    <div
      ref={tooltipRef}
      className="crpg-tooltip-container"
      style={tooltipStyle}
    >
      <TooltipCard
        title={info.name}
        iconUrl={info.imageRemote}
        badge={buildBadge(info.category)}
        sections={buildSections()}
        description={info.effect || ''}
      />
    </div>,
    document.body
  );

  return (
    <span
      className={`keyword-trigger keyword-${info.category}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {!isMobile && tooltipContent}
    </span>
  );
}

export function KeywordText({ text }: KeywordTextProps) {
  const matches = findKeywordMatches(text);
  
  if (matches.length === 0) {
    return <>{text}</>;
  }

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const match of matches) {
    // Add text before this match
    if (match.start > lastEnd) {
      parts.push(text.slice(lastEnd, match.start));
    }
    
    // Add the keyword with tooltip
    parts.push(
      <KeywordTooltip key={match.start} info={match.info}>
        {match.keyword}
      </KeywordTooltip>
    );
    
    lastEnd = match.end;
  }

  // Add remaining text
  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd));
  }

  return <>{parts}</>;
}
