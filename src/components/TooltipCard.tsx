import { useEffect, useState } from 'react';
import './TooltipCard.css';

export interface TooltipBadge {
  label: string;
  color?: string;
  background?: string;
}

export interface TooltipField {
  label: string;
  value: string;
}

export interface TooltipLink {
  label: string;
  url: string;
}

export interface TooltipCardProps {
  title: string;
  badge?: TooltipBadge;
  iconUrl?: string;
  sections?: TooltipField[];
  flavor?: string;
  description?: string;
  descriptionItalic?: boolean;
  stats?: TooltipField[];
  callout?: string;
  link?: TooltipLink;
  variant?: 'tooltip' | 'sheet';
}

export function TooltipCard({
  title,
  badge,
  iconUrl,
  sections,
  flavor,
  description,
  descriptionItalic,
  stats,
  callout,
  link,
  variant = 'tooltip',
}: TooltipCardProps) {
  const isPlaceholderIcon = (url?: string) => {
    if (!url) return true;
    const trimmed = url.trim();
    if (!trimmed) return true;
    if (trimmed.includes('__image__')) return true;
    if (trimmed.startsWith('data:image/svg+xml')) {
      const lower = trimmed.toLowerCase();
      const hasShape = /(path|circle|polygon|polyline|ellipse|line)/.test(lower);
      return !hasShape;
    }
    return false;
  };

  const [showIcon, setShowIcon] = useState(
    Boolean(iconUrl && iconUrl.trim() && !isPlaceholderIcon(iconUrl))
  );

  useEffect(() => {
    setShowIcon(Boolean(iconUrl && iconUrl.trim() && !isPlaceholderIcon(iconUrl)));
  }, [iconUrl]);

  const hasSections = !!(sections && sections.length);
  const hasFlavor = !!flavor;
  const hasDescription = !!description;
  const hasStats = !!(stats && stats.length);
  const hasCallout = !!callout;
  const hasLink = !!link;

  const needsSectionDivider = hasSections && (hasFlavor || hasDescription || hasStats || hasCallout || hasLink);
  const needsFlavorDivider = hasFlavor && (hasDescription || hasStats || hasCallout || hasLink);
  const needsDescriptionDivider = hasDescription && (hasStats || hasCallout || hasLink);
  const needsStatsDivider = hasStats && (hasCallout || hasLink);
  const needsCalloutDivider = hasCallout && hasLink;

  return (
    <div className={`crpg-tooltip-card ${variant}`}>
      <div className="crpg-tooltip-header">
        {showIcon && iconUrl && (
          <div className="crpg-tooltip-icon-wrap">
            <img
              src={iconUrl}
              alt=""
              className="crpg-tooltip-icon"
              onError={() => setShowIcon(false)}
            />
          </div>
        )}
        <div className="crpg-tooltip-title-block">
          <div className="crpg-tooltip-title">{title}</div>
          {badge && (
            <span
              className="crpg-tooltip-badge"
              style={
                badge.background || badge.color
                  ? { backgroundColor: badge.background, color: badge.color }
                  : undefined
              }
            >
              {badge.label}
            </span>
          )}
        </div>
      </div>

      {hasSections && (
        <div className="crpg-tooltip-section">
          {sections.map((item) => (
            <div key={`${item.label}-${item.value}`} className="crpg-tooltip-kv">
              <span className="crpg-tooltip-label">{item.label}:</span>
              <span className="crpg-tooltip-value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {needsSectionDivider && <div className="crpg-tooltip-divider" />}

      {hasFlavor && (
        <div className="crpg-tooltip-description italic">{flavor}</div>
      )}

      {needsFlavorDivider && <div className="crpg-tooltip-divider" />}

      {hasDescription && (
        <div
          className={`crpg-tooltip-description${descriptionItalic ? ' italic' : ''}`}
        >
          {description}
        </div>
      )}

      {needsDescriptionDivider && <div className="crpg-tooltip-divider" />}

      {hasStats && (
        <div className="crpg-tooltip-stats">
          {stats.map((item) => (
            <div key={`${item.label}-${item.value}`} className="crpg-tooltip-kv">
              <span className="crpg-tooltip-label">{item.label}:</span>
              <span className="crpg-tooltip-value">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {needsStatsDivider && <div className="crpg-tooltip-divider" />}

      {hasCallout && (
        <div className="crpg-tooltip-callout">
          {callout}
        </div>
      )}

      {needsCalloutDivider && <div className="crpg-tooltip-divider" />}

      {hasLink && (
        <a className="crpg-tooltip-link" href={link.url} target="_blank" rel="noopener noreferrer">
          {link.label} →
        </a>
      )}
    </div>
  );
}
