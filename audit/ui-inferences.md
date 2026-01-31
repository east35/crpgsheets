# UI Pattern Inferences (Evidence-Based)

Notes
- Inferences are derived from repeated CSS combinations and selector usage.
- This file contains no implementation guidance; it is an observational summary.

## Tabs / Segmented Navigation
Evidence
- `src/App.css`: `.header-nav-tab`, `.builds-subnav-tab`
- `src/games/rogue-trader/components/BuildViewer.css`: `.tab`
- `src/games/baldurs-gate-3/components/BuildViewer.css`: `.tab`

Traits
- Small radius (6–8px) and muted text, with stronger contrast on active.
- Active state uses stronger background and shadow.

States observed
- `:hover`, `.active`

## Primary / Secondary / Danger Buttons
Evidence
- `src/App.css`: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `src/components/ProfileSelector.css`: `.profile-action-btn*`, `.profile-edit-buttons button`
- `src/components/MobileStickyButton.css`: `.add-to-party-* .btn`

Traits
- Compact padding (0.5–0.75rem vertical), 6–8px radius.
- Font weights centered around 500–600.
- Intent expressed primarily by background color.

States observed
- `:hover`, `:disabled`

## Icon Buttons / Micro Actions
Evidence
- `src/components/AvatarUpload.css`: `.avatar-action-btn`
- `src/components/ImageLightbox.css`: `.lightbox-close`
- `src/components/TooltipSheet.css`: `.tooltip-sheet-close`

Traits
- Circular shapes (50% or 999px radius).
- Background-only controls with hover tint.

States observed
- `:hover`, `:disabled`

## Cards / Surface Containers
Evidence
- `src/App.css`: `.game-card`, `.view-kpis div`
- `src/components/DataAuditView.css`: `.data-audit-panel`, `.data-audit-kpis div`
- `src/games/rogue-trader/components/BuildSelector.css`: `.build-card`, `.companion-section`
- `src/games/baldurs-gate-3/components/BuildSelector.css`: `.build-card`, `.companion-section`

Traits
- Dark surfaces (#1a1a2e, #252540, rgba(18,20,36,0.75)).
- 8–12px radius, 1px borders with translucent light edges.

States observed
- `:hover`, `.tracked`, `.selected` (game-specific), `.coming-soon`

## Badges / Tags / Pills
Evidence
- `src/App.css`: `.coming-soon-badge`, `.beta-badge`
- `src/components/BuildList.css`: `.build-tag`
- `src/games/*/CompanionDetailScreen.css`: `.build-card-tag`

Traits
- Small text (0.75–0.85rem), uppercase in several places.
- Tight padding with 3–4px radius and solid fills.

States observed
- Variants via class names (difficulty/intent)

## Forms / Inputs
Evidence
- `src/App.css`: `.form-section input/select/textarea`
- `src/components/SearchBar.css`: `.search-input`, `.search-input-wrapper`
- `src/components/ProfileSelector.css`: `.profile-edit input`
- `src/games/rogue-trader/components/CustomBuildEditor.css`: `.form-row input/select/textarea`

Traits
- 6–10px radius with 1px border; focus styling varies by context.

States observed
- `:focus`, `:focus-within`

## Modals / Overlays
Evidence
- `src/components/InfoModal.css`
- `src/components/TooltipSheet.css`
- `src/components/ImageLightbox.css`
- `src/games/*/BuildSelectorModal.css`

Traits
- Dark overlays (rgba(0,0,0,0.7–0.9)).
- 8–12px radius for surface cards.

States observed
- `:hover` on close controls

## Filter Chips / Selector Rows
Evidence
- `src/games/*/BuildSelector.css`: `.filter-tag`, `.clear-filters`
- `src/games/*/CompanionDetailScreen.css`: `.filter-tag`, `.sort-option`

Traits
- Small caps/labels and bordered pill styles.
- Border color shifts on hover/active.

States observed
- `:hover`, `.active`, `.tracked`

## Interaction Coverage Note (Pressed vs Hover)
- Pressed (`:active`) is only present on mobile menu controls (`src/components/MobileMenu.css`).
- Most interactive elements are hover-only in CSS, despite the mobile-first constraint.

# Extraction Priority (Pattern-First, Low Risk)

## 1) Base Button + Variants
Why
- Broad reuse in `src/App.css` and multiple component CSS files.

Risk notes
- Interaction styles emphasize hover; pressed state coverage is sparse.

## 2) Tabs / Segmented Controls
Why
- Repeated, consistent styling across header and build viewers.

Risk notes
- Active states include shadows/borders that vary by context.

## 3) Card / Surface Containers
Why
- High reuse across app and game-specific UI.

Risk notes
- Game-specific variants may require per-context overrides.

## 4) Badge / Tag / Pill
Why
- Common across multiple surfaces; low structural coupling.

Risk notes
- Strong visual divergence by intent; avoid semantic naming too early.

## 5) Form Fields / Input Wrappers
Why
- Frequent usage with consistent border + radius norms.

Risk notes
- Focus treatments vary; specificity and parent selectors differ.

## 6) Modal / Overlay Shell
Why
- Multiple overlay patterns share similar scaffolding.

Risk notes
- Close button and internal layout are highly component-specific.

## 7) Tooltip / Micro-Overlay
Why
- Lower reuse and more bespoke styling.

Risk notes
- High variance in visuals; extract last.
