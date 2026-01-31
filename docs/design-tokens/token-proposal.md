# Design Token Proposal (v1)

This proposal is derived from the raw CSS audit in `docs/design-tokens/raw-values.json` and only uses observed values and contexts. Tokens are semantic (surface/text/border/etc.) and intended to be layered (base + optional theme scopes).

## Colors

### Surfaces
- `--ui-surface-base`: `#1a1a2e` (frequent base panel/background)
- `--ui-surface-panel`: `#2a2a3e` (controls/panels)
- `--ui-surface-panel-alt`: `#2a2a4a` (alternate panel tone)
- `--ui-surface-hover`: `#3a3a4e` (hover/active states)
- `--ui-surface-muted`: `rgba(18, 20, 36, 0.75)` (translucent panel overlays)
- `--ui-surface-elevated`: `rgba(26, 26, 46, 0.9)` (elevated sheets)
- `--ui-surface-scrim`: `rgba(0, 0, 0, 0.4)` (overlays)
- `--ui-surface-scrim-strong`: `rgba(0, 0, 0, 0.7)` (strong overlays)

### Text
- `--ui-text-primary`: `#e0e0e0`
- `--ui-text-muted`: `#b7bdd6`
- `--ui-text-subtle`: `#9aa3c2`
- `--ui-text-disabled`: `#888`
- `--ui-text-disabled-strong`: `#666`
- `--ui-text-on-dark`: `#fff`
- `--ui-text-accent`: `#e5e9ff`

### Borders
- `--ui-border-default`: `#3a3a5a`
- `--ui-border-strong`: `#4a4a6a`
- `--ui-border-subtle`: `rgba(106, 112, 160, 0.35)`
- `--ui-border-contrast`: `#5a5a7a`
- `--ui-border-ghost`: `rgba(255, 255, 255, 0.08)`

### Accents
- `--ui-accent-primary`: `#8b5cf6`
- `--ui-accent-primary-strong`: `#b8b0ff`
- `--ui-accent-primary-soft`: `rgba(139, 92, 246, 0.2)`
- `--ui-accent-primary-soft-strong`: `rgba(139, 92, 246, 0.35)`
- `--ui-accent-primary-glow`: `rgba(139, 92, 246, 0.6)`
- `--ui-accent-secondary`: `#f0c040`
- `--ui-accent-secondary-strong`: `#ffb703`
- `--ui-accent-secondary-glow`: `rgba(255, 183, 3, 0.18)`

### Status
- `--ui-status-success`: `#4a7c4a`
- `--ui-status-success-strong`: `#10b981`
- `--ui-status-success-soft`: `rgba(74, 124, 74, 0.35)`
- `--ui-status-success-soft-strong`: `rgba(74, 124, 74, 0.6)`
- `--ui-status-warning`: `#f0c040`
- `--ui-status-warning-strong`: `#ffd700`
- `--ui-status-danger`: `#f87171`
- `--ui-status-danger-strong`: `#ff9999`
- `--ui-status-danger-deep`: `#7f1d1d`

## Spacing Scale
- Rem scale: `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `2.5rem`, `3rem`, `4rem`, `5rem`
- Pixel steps: `2px`, `4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `16px`

## Radii
- `4px`, `6px`, `8px`, `10px`, `12px`, `14px`, `16px`, `100px`

## Elevation
- `0 2px 4px rgba(0, 0, 0, 0.3)`
- `0 6px 18px rgba(0, 0, 0, 0.35)`
- `0 8px 24px rgba(0, 0, 0, 0.4)`
- `0 8px 32px rgba(0, 0, 0, 0.4)`
- `0 20px 60px rgba(0, 0, 0, 0.5)`
- Focus rings: `0 0 0 2px rgba(139, 92, 246, 0.3)` and `0 0 0 2px rgba(100, 108, 255, 0.2)`

## Z-Index Layers
- Base: `0`
- Raised: `1`
- Sticky: `10`
- Dropdown: `100`
- Overlay: `999`
- Modal: `1000`
- Toast: `10000`
- Max: `10001`

## Motion
- Durations: `150ms`, `200ms`, `300ms`
- Easing: `ease`

## Typography
- Font sizes: `0.7rem`, `0.75rem`, `0.8rem`, `0.85rem`, `0.9rem`, `1rem`, `1.1rem`, `1.25rem`, `1.5rem`, `1.6rem`, `2.2rem`
- Weights: `400`, `500`, `600`, `700`
- Letter spacing: `0.01em`, `0.02em`, `0.05em`, `0.08em`, `0.2em`
- Text transform: `uppercase` (observed for headings/eyebrows)

## Common Sizing Tokens
- Controls: `44px`, `56px`
- Icons: `28px`
- Avatars: `64px`
- Panels: `320px`
- Cards: `120px`
- Detail widths: `520px`

## Theme Scopes (Observed)

### Audit View
Data audit styles already define a distinct palette via `--audit-*` variables. To preserve the intent without polluting base tokens, the proposed theme scope is:

- `[data-theme="audit"]` overrides base surface/text/border/accent tokens using `#e6e9ff`, `#a7aecf`, `rgba(19, 20, 38, 0.85)`, `rgba(106, 112, 160, 0.35)`, `#f0c040`, `#ffb703`, and `rgba(255, 183, 3, 0.18)`.

This allows audit-specific styling to remain scoped while the rest of the app uses base tokens.
