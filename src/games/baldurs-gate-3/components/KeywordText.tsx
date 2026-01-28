import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { findKeyword, ALL_KEYWORD_NAMES, type KeywordInfo } from '../data/keywords';
import { useTooltipSheet } from '../../../components/TooltipSheet';
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
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const { showSheet, isMobile } = useTooltipSheet();

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
    
    // Build description from available info
    let description = info.description || '';
    if (info.category === 'spell') {
      const parts = [];
      if (info.flavorText) parts.push(info.flavorText);
      if (info.schoolRank) parts.push(`School: ${info.schoolRank}`);
      if (info.damage) parts.push(`Damage: ${info.damage}`);
      if (info.duration) parts.push(`Duration: ${info.duration}`);
      if (info.range) parts.push(`Range: ${info.range}`);
      if (info.concentration) parts.push('Requires Concentration');
      description = parts.join('\n');
    } else if (info.category === 'feat' && info.benefits) {
      description = info.benefits.join('\n• ');
      if (description) description = '• ' + description;
    }
    
    showSheet({
      title: info.name,
      subtitle: info.category.replace('-', ' '),
      iconUrl: info.icon,
      description,
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
      let newPosition: 'top' | 'bottom';

      if (triggerRect.top - tooltipHeight - 10 < 0) {
        newPosition = 'bottom';
        top = triggerRect.bottom + 8;
      } else {
        newPosition = 'top';
        top = triggerRect.top - tooltipHeight - 8;
      }

      setPosition(newPosition);

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

  // BG3-themed category colors
  const categoryColors: Record<string, string> = {
    'class': '#e74c3c',
    'subclass': '#c0392b',
    'race': '#9b59b6',
    'subrace': '#8e44ad',
    'background': '#3498db',
    'spell': '#f39c12',
    'feat': '#2ecc71',
    'condition': '#e91e63',
    'ability-score': '#1abc9c',
    'skill': '#27ae60',
  };

  // Render spell-specific tooltip with structured fields
  const renderSpellTooltip = () => (
    <>
      <div className="bg3-keyword-tooltip-header">
        {info.icon && (
          <img 
            className="bg3-keyword-tooltip-image" 
            src={info.icon} 
            alt={info.name}
          />
        )}
        <div className="bg3-keyword-tooltip-header-text">
          <span className="bg3-keyword-tooltip-name">{info.name}</span>
          <span
            className="bg3-keyword-tooltip-category"
            style={{ backgroundColor: categoryColors[info.category] || '#666' }}
          >
            {info.category.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      {info.schoolRank && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">School:</span> {info.schoolRank}
        </div>
      )}
      
      {info.flavorText && (
        <div className="bg3-keyword-tooltip-flavor">
          {info.flavorText}
        </div>
      )}
      
      {info.type && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">Type:</span> {info.type}
        </div>
      )}
      
      {info.damage && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">Damage:</span> {info.damage}
        </div>
      )}
      
      {info.duration && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">Duration:</span> {info.duration}
        </div>
      )}
      
      {info.range && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">Range:</span> {info.range}
        </div>
      )}
      
      {info.savingThrow && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">Saving Throw:</span> {info.savingThrow}
        </div>
      )}
      
      {info.cost && (
        <div className="bg3-keyword-tooltip-field">
          <span className="bg3-keyword-tooltip-label">Cost:</span> {info.cost}
        </div>
      )}
      
      {info.concentration && (
        <div className="bg3-keyword-tooltip-concentration">
          Requires Concentration
        </div>
      )}
      
      {info.wikiUrl && (
        <div className="bg3-keyword-tooltip-link">
          <a href={info.wikiUrl} target="_blank" rel="noopener noreferrer">
            View on Wiki →
          </a>
        </div>
      )}
    </>
  );

  // Render feat-specific tooltip with benefits list
  const renderFeatTooltip = () => (
    <>
      <div className="bg3-keyword-tooltip-header">
        <div className="bg3-keyword-tooltip-header-text">
          <span className="bg3-keyword-tooltip-name">{info.name}</span>
          <span
            className="bg3-keyword-tooltip-category"
            style={{ backgroundColor: categoryColors[info.category] || '#666' }}
          >
            {info.category.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      {info.benefits && info.benefits.length > 0 && (
        <ul className="bg3-keyword-tooltip-benefits">
          {info.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      )}
      
      {info.notes && (
        <div className="bg3-keyword-tooltip-notes">
          <span className="bg3-keyword-tooltip-label">Note:</span> {info.notes}
        </div>
      )}
      
      {info.wikiUrl && (
        <div className="bg3-keyword-tooltip-link">
          <a href={info.wikiUrl} target="_blank" rel="noopener noreferrer">
            View on Wiki →
          </a>
        </div>
      )}
    </>
  );

  // Render generic tooltip for non-spell keywords
  const renderGenericTooltip = () => (
    <>
      <div className="bg3-keyword-tooltip-header">
        <div className="bg3-keyword-tooltip-header-text">
          <span className="bg3-keyword-tooltip-name">{info.name}</span>
          <span
            className="bg3-keyword-tooltip-category"
            style={{ backgroundColor: categoryColors[info.category] || '#666' }}
          >
            {info.category.replace('-', ' ')}
          </span>
        </div>
      </div>
      {info.description && (
        <div className="bg3-keyword-tooltip-description">
          {info.description}
        </div>
      )}
      {info.wikiUrl && (
        <div className="bg3-keyword-tooltip-link">
          <a href={info.wikiUrl} target="_blank" rel="noopener noreferrer">
            View on Wiki →
          </a>
        </div>
      )}
    </>
  );

  const tooltipContent = isVisible && createPortal(
    <div
      ref={tooltipRef}
      className={`bg3-keyword-tooltip ${position}`}
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {info.category === 'spell' ? renderSpellTooltip() : info.category === 'feat' ? renderFeatTooltip() : renderGenericTooltip()}
    </div>,
    document.body
  );

  return (
    <span
      ref={triggerRef}
      className={`bg3-keyword-trigger bg3-keyword-${info.category}`}
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
