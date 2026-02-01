# Layout & Surface Bundles (Top Combo Clusters)

Source: `audit/ui-audit.json` → `combination_clustering`

## Top 10 Layout Bundles
(Combo = padding; gap; align-items)

| Rank | Combo | Count | Example selectors (file) |
| --- | --- | --- | --- |
| 1 | `padding:-; gap:-; align-items:center` | 34 | `.header-left` (`src/App.css`), `.view-header` (`src/App.css`), `.crpg-tooltip-icon-wrap` (`src/components/TooltipCard.css`) |
| 2 | `padding:-; gap:0.5rem; align-items:-` | 28 | `.build-actions` (`src/App.css`), `.form-actions` (`src/App.css`), `.header-content` (`src/App.css`) |
| 3 | `padding:-; gap:1rem; align-items:-` | 25 | `.view-kpis` (`src/App.css`), `.game-grid` (`src/App.css`), `.form-row` (`src/App.css`) |
| 4 | `padding:-; gap:0.5rem; align-items:center` | 18 | `.data-audit-pagination` (`src/components/DataAuditView.css`), `.avatar-upload-placeholder` (`src/components/AvatarUpload.css`), `.party-member-header` (`src/components/BuildList.css`) |
| 5 | `padding:0; gap:-; align-items:-` | 14 | `.main-content.landing` (`src/App.css`), `.footer-landing-link` (`src/App.css`), `.app-footer .footer-link` (`src/App.css`) |
| 6 | `padding:-; gap:0.75rem; align-items:center` | 14 | `.app-footer .footer-content` (`src/App.css`), `.game-select-info` (`src/components/MobileMenu.css`), `.footer-content` (`src/components/GameLibrary.css`) |
| 7 | `padding:-; gap:0.75rem; align-items:-` | 13 | `.view-kpis` (`src/App.css`), `.build-list` (`src/App.css`), `.roadmap-section` (`src/components/InfoModal.css`) |
| 8 | `padding:1rem; gap:-; align-items:-` | 9 | `.mobile-menu-content` (`src/components/MobileMenu.css`), `.roadmap-item` (`src/components/InfoModal.css`), `.add-to-party-mobile .btn` (`src/components/MobileStickyButton.css`) |
| 9 | `padding:0.75rem 1rem; gap:-; align-items:-` | 8 | `.profile-select-btn` (`src/components/MobileMenu.css`), `.landing-footer` (`src/components/GameLibrary.css`), `.tier-divider` (`src/games/rogue-trader/components/CustomBuildEditor.css`) |
| 10 | `padding:1.5rem; gap:-; align-items:-` | 8 | `.info-modal` (`src/components/InfoModal.css`), `.picker-modal` (`src/components/GameLibrary.css`), `.editor-form` (`src/games/rogue-trader/components/CustomBuildEditor.css`) |

## Top 10 Surface Bundles
(Combo = background; border; radius)

| Rank | Combo | Count | Example selectors (file) |
| --- | --- | --- | --- |
| 1 | `background:none; border:none; radius:-` | 11 | `.footer-landing-link` (`src/App.css`), `.info-modal-close` (`src/components/InfoModal.css`), `.picker-close` (`src/components/GameLibrary.css`) |
| 2 | `background:transparent; border:none; radius:-` | 9 | `.search-input` (`src/components/SearchBar.css`), `.search-clear` (`src/components/SearchBar.css`), `.header-game-item` (`src/components/HeaderGameSelector.css`) |
| 3 | `background:-; border:rgba(139, 92, 246, 0.6); radius:-` | 9 | `.filter-tag:hover` (`src/games/rogue-trader/components/BuildSelector.css`), `.unselected-build-preview:hover` (`src/games/rogue-trader/components/BuildSelector.css`), `.back-button:hover` (`src/games/rogue-trader/components/CompanionDetailScreen.css`) |
| 4 | `background:rgba(18, 20, 36, 0.75); border:1px solid rgba(106, 112, 160, 0.35); radius:10px` | 9 | `.tracked-build-preview` (`src/games/rogue-trader/components/BuildSelector.css`), `.unselected-build-preview` (`src/games/rogue-trader/components/BuildSelector.css`), `.gear-slot` (`src/games/rogue-trader/components/BuildViewer.css`) |
| 5 | `background:#4a3d2d; border:-; radius:-` | 8 | `.build-archetype-path .archetype.advanced` (`src/App.css`), `.build-path .archetype.advanced` (`src/games/rogue-trader/components/BuildSelector.css`), `.tier-accordion.advanced` (`src/games/rogue-trader/components/BuildViewer.css`) |
| 6 | `background:-; border:-; radius:4px` | 8 | `.header-game-icon` (`src/components/HeaderGameSelector.css`), `.roadmap-section-title` (`src/components/InfoModal.css`), `.coming-soon-badge` (`src/components/GameLibrary.css`) |
| 7 | `background:rgba(18, 20, 36, 0.75); border:1px solid rgba(106, 112, 160, 0.35); radius:12px` | 8 | `.build-selector-controls` (`src/games/rogue-trader/components/BuildSelector.css`), `.build-card` (`src/games/rogue-trader/components/BuildSelector.css`), `.companion-build-card` (`src/games/rogue-trader/components/CompanionDetailScreen.css`) |
| 8 | `background:#2d4a2d; border:-; radius:-` | 7 | `.build-archetype-path .archetype.base` (`src/App.css`), `.build-path .archetype.base` (`src/games/rogue-trader/components/BuildSelector.css`), `.tier-accordion.base` (`src/games/rogue-trader/components/BuildViewer.css`) |
| 9 | `background:#4a2d4a; border:-; radius:-` | 7 | `.build-archetype-path .archetype.exemplar` (`src/App.css`), `.build-path .archetype.exemplar` (`src/games/rogue-trader/components/BuildSelector.css`), `.tier-accordion.exemplar` (`src/games/rogue-trader/components/BuildViewer.css`) |
| 10 | `background:#2a2a4e; border:-; radius:-` | 6 | `.search-result-item:hover` (`src/components/SearchBar.css`), `.header-game-item.active` (`src/components/HeaderGameSelector.css`), `.profile-item.active` (`src/components/ProfileSelector.css`) |

## Proposed Minimal `u-*` Bundle Classes (No Refactors)
These map directly to the most frequent bundles above and use raw values (no new tokens). This is a proposal only; no CSS changes applied.

```css
/* Layout bundles */
.u-align-center { align-items: center; }
.u-gap-0-5 { gap: 0.5rem; }
.u-gap-0-75 { gap: 0.75rem; }
.u-gap-1 { gap: 1rem; }
.u-pad-0 { padding: 0; }
.u-pad-1 { padding: 1rem; }
.u-pad-1-5 { padding: 1.5rem; }
.u-pad-0-75-1 { padding: 0.75rem 1rem; }

/* Surface bundles */
.u-surface-none { background: none; border: none; }
.u-surface-transparent { background: transparent; border: none; }
.u-surface-border-accent { border: 1px solid rgba(139, 92, 246, 0.6); }
.u-surface-card-10 { background: rgba(18, 20, 36, 0.75); border: 1px solid rgba(106, 112, 160, 0.35); border-radius: 10px; }
.u-surface-card-12 { background: rgba(18, 20, 36, 0.75); border: 1px solid rgba(106, 112, 160, 0.35); border-radius: 12px; }
.u-radius-4 { border-radius: 4px; }
.u-bg-tier-advanced { background: #4a3d2d; }
.u-bg-tier-base { background: #2d4a2d; }
.u-bg-tier-exemplar { background: #4a2d4a; }
.u-bg-active-2a2a4e { background: #2a2a4e; }
```
