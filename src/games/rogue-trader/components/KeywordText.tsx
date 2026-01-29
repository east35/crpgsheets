import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { findKeyword, ALL_KEYWORD_NAMES, type KeywordInfo } from '../data/character';
import { useTooltipSheet } from '../../../components/TooltipSheet';
import { TooltipCard, type TooltipBadge, type TooltipField, type TooltipLink } from '../../../components/TooltipCard';
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
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const { showSheet, isMobile } = useTooltipSheet();

  const categoryColors: Record<string, string> = {
    homeworld: '#4a9eff',
    origin: '#9b59b6',
    archetype: '#e74c3c',
    characteristic: '#f39c12',
    skill: '#2ecc71',
    stat: '#1abc9c',
    conviction: '#e91e63',
    'status-effect': '#ff5722',
    talent: '#3498db',
    ability: '#8e44ad',
  };

  const buildBadge = (category: string): TooltipBadge => ({
    label: category.replace('-', ' ').toUpperCase(),
    background: categoryColors[category] || '#f0a319',
  });

  const buildSections = (): TooltipField[] => [];

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
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    
    showSheet({
      title: info.name,
      badge: buildBadge(info.category),
      iconUrl: info.imageRemote,
      sections: buildSections(),
      description: info.effect || '',
      link: info.wikiUrl ? ({ label: 'View on Wiki', url: info.wikiUrl } as TooltipLink) : undefined,
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
      
      // Calculate vertical position
      let top: number;
      if (triggerRect.top - tooltipHeight - 10 < 0) {
        top = triggerRect.bottom + 8;
      } else {
        top = triggerRect.top - tooltipHeight - 8;
      }

      // Calculate horizontal position with viewport containment
      let left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
      
      const padding = 10;
      if (left < padding) {
        left = padding;
      } else if (left + tooltipWidth > window.innerWidth - padding) {
        left = window.innerWidth - padding - tooltipWidth;
      }
      
      setTooltipStyle({
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  }, [isVisible]);

  const tooltipContent = isVisible && createPortal(
    <div 
      ref={tooltipRef} 
      className="crpg-tooltip-container"
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <TooltipCard
        title={info.name}
        iconUrl={info.imageRemote}
        badge={buildBadge(info.category)}
        sections={buildSections()}
        description={info.effect || ''}
        link={info.wikiUrl ? ({ label: 'View on Wiki', url: info.wikiUrl } as TooltipLink) : undefined}
      />
    </div>,
    document.body
  );

  return (
    <span
      ref={triggerRef}
      className={`keyword-trigger keyword-${info.category}`}
      onMouseEnter={handleMouseEnter}
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
