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
  variant?: 'tooltip' | 'sheet';
}

const decodeSvgData = (url: string) => {
  const commaIndex = url.indexOf(',');
  if (commaIndex === -1) return '';
  const data = url.slice(commaIndex + 1);
  if (url.includes(';base64')) {
    try {
      return atob(data);
    } catch {
      return '';
    }
  }
  try {
    return decodeURIComponent(data);
  } catch {
    return data;
  }
};

const isInvisibleRect = (rectTag: string) => {
  return /fill="none"|fill='none'|fill-opacity="0"|fill-opacity='0'|stroke="none"|stroke='none'|stroke-opacity="0"|stroke-opacity='0'/.test(rectTag);
};

const isPlaceholderIcon = (url?: string) => {
  if (!url) return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.includes('__image__')) return true;
  if (trimmed.startsWith('data:image/svg+xml')) {
    const svg = decodeSvgData(trimmed).toLowerCase();
    if (!svg) return true;
    const hasNonRectShape = /(path|circle|polygon|polyline|ellipse|line)/.test(svg);
    if (hasNonRectShape) return false;
    const rects = svg.match(/<rect[^>]*>/g) || [];
    if (!rects.length) return true;
    const anyVisibleRect = rects.some((rect) => !isInvisibleRect(rect));
    return !anyVisibleRect;
  }
  return false;
};

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
  variant = 'tooltip',
}: TooltipCardProps) {
  const [showIcon, setShowIcon] = useState(
    Boolean(iconUrl && iconUrl.trim() && !isPlaceholderIcon(iconUrl))
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowIcon(Boolean(iconUrl && iconUrl.trim() && !isPlaceholderIcon(iconUrl)));
  }, [iconUrl]);

  const hasSections = !!(sections && sections.length);
  const hasFlavor = !!flavor;
  const hasDescription = !!description;
  const hasStats = !!(stats && stats.length);
  const hasCallout = !!callout;
  const needsSectionDivider = hasSections && (hasFlavor || hasDescription || hasStats || hasCallout);
  const needsFlavorDivider = hasFlavor && (hasDescription || hasStats || hasCallout);
  const needsDescriptionDivider = hasDescription && (hasStats || hasCallout);
  const needsStatsDivider = hasStats && hasCallout;
  const needsCalloutDivider = false;

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
    </div>
  );
}
