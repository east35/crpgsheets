# Token Candidate Replacement Plan (Value-by-Value)

Thresholds: min_count=10, min_files=5

## Suggested PR Sequence (one value per PR)
1. spacing — 1rem
2. spacing — 0.5rem
3. spacing — 0.75rem
4. spacing — 0
5. spacing — 1.5rem
6. spacing — 0.25rem
7. spacing — 0.75rem 1rem
8. spacing — 2rem
9. spacing — 0 auto
10. spacing — 8px
11. spacing — 0.35rem
12. spacing — 4px
13. spacing — 2px 8px
14. spacing — 1.25rem
15. spacing — .5rem
16. spacing — 0 0 0.5rem
17. spacing — 0.2rem 0.6rem
18. spacing — 0.25rem 0.5rem
19. spacing — 2px 6px
20. spacing — 1.25rem 1.5rem
21. type — font-weight: 600
22. type — font-size: 0.85rem
23. type — font-size: 0.75rem
24. type — font-size: 0.9rem
25. type — font-weight: 500
26. type — text-transform: uppercase
27. type — font-size: 0.8rem
28. type — font-size: 1rem
29. type — line-height: 1.5
30. type — font-size: 0.7rem
31. type — letter-spacing: 0.05em
32. type — font-size: 1.1rem
33. type — font-size: 1.25rem
34. type — font-size: 1.5rem
35. type — line-height: 1.6
36. type — font-size: 1.35rem
37. radius — 8px
38. radius — 6px
39. radius — 4px
40. radius — 12px
41. radius — 10px
42. radius — 14px
43. color — color: #fff
44. color — color: #888
45. color — background: rgba(18, 20, 36, 0.75)
46. color — color: #e0e0e0
47. color — background: #1a1a2e
48. color — color: #9aa3c2
49. color — color: #b7bdd6
50. color — color: #b8b0ff
51. color — background: #2a2a3e
52. color — background: #2a2a4a
53. color — color: #e5e9ff
54. color — background: #3a3a5a
55. color — border-color: rgba(139, 92, 246, 0.6)
56. color — color: #666
57. color — color: var(--audit-muted)
58. color — border-color: #8b5cf6
59. color — color: #f0c040
60. color — background: rgba(26, 26, 46, 0.9)
61. color — background: rgba(139, 92, 246, 0.2)
62. color — background: #4a3d2d
63. color — color: #555
64. color — background: rgba(139, 92, 246, 0.15)
65. color — color: #98a0c3
66. color — color: #90ee90
67. color — background: #2d4a2d
68. color — color: #ffd700
69. color — background: #4a2d4a
70. color — background: #4a7c4a
71. color — color: #da70d6
72. color — color: #8b5cf6

## Value-by-Value Details

### spacing — 1rem
Audit count/files: 97 / 18

- src/App.css
  - .view-kpis — gap: 1rem
  - .view-hero — margin-bottom: 1rem (risk: media-query)
  - .header-content — gap: 1rem
  - .current-game — gap: 1rem
  - .profile-bar — margin-bottom: 1rem
  - .error-banner — margin-bottom: 1rem
  - .game-grid — gap: 1rem
  - .import-export-toolbar — padding: 1rem
  - .build-card — padding: 1rem
  - .form-row — gap: 1rem
  - .build-actions — margin-top: 1rem (risk: media-query)
- src/components/BuildList.css
  - .build-list-container — gap: 1rem
  - .party-member-card — padding: 1rem
  - .party-member-card — gap: 1rem
- src/components/DataAuditView.css
  - .data-audit-kpis — gap: 1rem
  - .data-audit-main — gap: 1rem
  - .data-audit-toolbar — padding: 1rem
  - .data-audit-toolbar — gap: 1rem
  - .data-audit-row — gap: 1rem
  - .data-audit-detail-json — margin-top: 1rem
- src/components/GameLibrary.css
  - .hero-cta — margin-bottom: 1rem
  - .game-grid — gap: 1rem
- src/components/InfoModal.css
  - .changelog-header — gap: 1rem
  - .roadmap-item — padding: 1rem
  - .info-modal-overlay — padding: 1rem (risk: media-query)
- src/components/MobileMenu.css
  - .mobile-menu-content — padding: 1rem (risk: media-query)
  - .mobile-menu-section .profile-current — padding: 1rem
  - .mobile-menu-section .profile-switch-section — margin-top: 1rem
- src/components/MobileStickyButton.css
  - .add-to-party-mobile .btn — padding: 1rem (risk: media-query)
- src/components/PartyBar.css
  - .party-bar-content — gap: 1rem
- src/components/TooltipCard.css
  - .crpg-tooltip-header — margin-bottom: 1rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-list — gap: 1rem
  - .build-selector.bg3 .companion-list — gap: 1rem
  - .build-selector.bg3 .companion-group — gap: 1rem
  - .build-selector.bg3 .builds-grid — gap: 1rem
  - .build-selector.bg3 .builds-grid .build-card — padding: 1rem
  - .build-selector.bg3 .unselected-build-preview — gap: 1rem
  - .build-selector.bg3 .companion-card-footer — gap: 1rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 — padding: 1rem
  - .build-selector-modal-overlay.bg3 .build-selector-modal-builds — padding: 1rem
  - .build-selector-modal-overlay.bg3 .build-selector-modal-grid — gap: 1rem
  - .build-selector-modal-overlay.bg3 .build-selector-modal-card — padding: 1rem
  - .build-selector-modal-overlay.bg3 .build-card-layout — gap: 1rem
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header — padding: 1rem (risk: media-query)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-header — gap: 1rem
  - .build-tags — margin-bottom: 1rem
  - .tabs — margin-bottom: 1rem
  - .level-row — padding: 1rem
  - .level-row — gap: 1rem
  - .ability-scores — gap: 1rem
  - .ability-score — padding: 1rem
  - .gear-view — gap: 1rem
  - .gear-slot — padding: 1rem
  - .gear-slot — gap: 1rem
  - .level-confirm-overlay — padding: 1rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-layout — gap: 1rem
  - .companion-detail-controls — margin-bottom: 1rem
  - .companion-detail-controls — padding: 1rem
  - .companion-detail-builds — gap: 1rem
  - .build-card-layout — padding: 1rem
  - .companion-detail-controls — gap: 1rem (risk: media-query)
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector-controls — margin-bottom: 1rem
  - .build-selector-controls — padding: 1rem
  - .companion-list — gap: 1rem
  - .companion-group — gap: 1rem
  - .build-selector-controls — gap: 1rem (risk: media-query)
  - .companion-section — gap: 1rem
  - .companion-section.expanded .companion-header — margin-bottom: 1rem
  - .companion-title-row — gap: 1rem
  - .builds-grid — gap: 1rem
  - .coming-soon p — margin-bottom: 1rem
  - .unselected-build-preview — gap: 1rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-overlay — padding: 1rem
  - .build-selector-modal-grid — gap: 1rem
  - .build-selector-modal-card — padding: 1rem
- src/games/rogue-trader/components/BuildViewer.css
  - .build-viewer-header — margin-bottom: 1rem
  - .build-viewer-header — gap: 1rem
  - .build-description — margin-bottom: 1rem
  - .video-link — margin-bottom: 1rem
  - .level-indicator — margin-bottom: 1rem
  - .progression-view — margin-top: 1rem
  - .level-row — gap: 1rem
  - .gear-slot — gap: 1rem
  - .level-confirm-overlay — padding: 1rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-layout — gap: 1rem
  - .companion-detail-controls — margin-bottom: 1rem
  - .companion-detail-controls — padding: 1rem
  - .companion-detail-builds — gap: 1rem
  - .build-card-layout — padding: 1rem
  - .companion-detail-controls — gap: 1rem (risk: media-query)
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .editor-header — padding-bottom: 1rem
  - .form-row — margin-bottom: 1rem
  - .progression-editor .hint — margin-bottom: 1rem
  - .tier-divider — margin-top: 1rem
  - .talent-picker — padding: 1rem
  - .form-row — gap: 1rem (risk: media-query)
  - .editor-header — gap: 1rem (risk: media-query)

### spacing — 0.5rem
Audit count/files: 91 / 17

- src/App.css
  - .builds-subnav — gap: 0.5rem
  - .game-selector h2 — margin-bottom: 0.5rem
  - .game-card .game-logo — margin-bottom: 0.5rem
  - .storage-notice — gap: 0.5rem
  - .import-export-toolbar — gap: 0.5rem
  - .build-actions — gap: 0.5rem
  - .form-section label — margin-bottom: 0.5rem
  - .form-section .helper-text — margin-top: 0.5rem
  - .form-actions — gap: 0.5rem
  - .header-content — gap: 0.5rem (risk: media-query)
- src/components/AvatarUpload.css
  - .avatar-upload-placeholder — gap: 0.5rem
  - .avatar-upload-error — margin-top: 0.5rem
- src/components/BuildList.css
  - .import-export-buttons — gap: 0.5rem
  - .party-member-header — gap: 0.5rem
  - .dropdown-item — gap: 0.5rem
- src/components/DataAuditView.css
  - .data-audit-list-item — gap: 0.5rem
  - .data-audit-pagination — gap: 0.5rem
  - .data-audit-detail-json h3 — margin-bottom: 0.5rem
- src/components/GameLibrary.css
  - .picker-close — padding: 0.5rem
- src/components/InfoModal.css
  - .info-modal-close — padding: 0.5rem
  - .changelog-header — margin-bottom: 0.5rem
- src/components/MobileMenu.css
  - .mobile-menu-section .profile-current-actions — gap: 0.5rem
  - .mobile-menu-section .profile-list — gap: 0.5rem
  - .profile-selector.mobile .profile-bottom-actions — gap: 0.5rem
  - .profile-selector.mobile .profile-bottom-actions .profile-privacy — margin-top: 0.5rem
  - .profile-selector.mobile .profile-create-form — gap: 0.5rem
- src/components/PartyBar.css
  - .party-avatars — gap: 0.5rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-header — margin-bottom: 0.5rem
  - .build-selector.bg3 .build-card-meta — gap: 0.5rem
  - .build-selector.bg3 .build-card-tags — gap: 0.5rem
  - .build-selector.bg3 .build-source-link — margin-top: 0.5rem
  - .build-selector.bg3 .companion-card-content — gap: 0.5rem
  - .build-selector.bg3 .companion-card-meta — gap: 0.5rem
  - .build-selector.bg3 .builds-grid .build-card — gap: 0.5rem
  - .build-selector.bg3 .tracked-build-actions — gap: 0.5rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-close — padding: 0.5rem
  - .build-selector-modal-overlay.bg3 .build-card-content — gap: 0.5rem
  - .build-selector-modal-overlay.bg3 .build-card-meta — gap: 0.5rem
  - .build-selector-modal-overlay.bg3 .build-source-link — margin-top: 0.5rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn — gap: 0.5rem
  - .build-avatar-container .avatar-upload-overlay — margin-top: 0.5rem (risk: media-query)
  - .build-meta — gap: 0.5rem
  - .build-tags — gap: 0.5rem
  - .tabs — gap: 0.5rem
  - .progression-view — gap: 0.5rem
  - .level-content — gap: 0.5rem
  - .asi — margin-left: 0.5rem
  - .level-stat-changes — gap: 0.5rem
  - .level-stat-changes — margin-top: 0.5rem (risk: media-query)
  - .gear-slot — gap: 0.5rem (risk: media-query)
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .back-button — gap: 0.5rem
  - .companion-detail-screen .companion-card-content — gap: 0.5rem
  - .companion-detail-screen .companion-card-meta — gap: 0.5rem
  - .filter-tags — gap: 0.5rem
  - .sort-options — gap: 0.5rem
  - .tracked-banner — padding: 0.5rem
  - .tracked-banner — gap: 0.5rem
  - .build-card-meta — margin-bottom: 0.5rem
  - .build-card-meta — gap: 0.5rem
  - .build-card-tags — margin-bottom: 0.5rem
  - .build-card-gear — margin-bottom: 0.5rem
  - .build-card-desc — margin-bottom: 0.5rem
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .build-source-link — margin-top: 0.5rem
  - .filter-tags — gap: 0.5rem
  - .companion-card-content — gap: 0.5rem
  - .companion-card-meta — gap: 0.5rem
  - .build-path — gap: 0.5rem
  - .companion-tags — gap: 0.5rem
  - .tracked-build-row — gap: 0.5rem
  - .tracked-build-info — gap: 0.5rem
  - .tracked-build-actions — gap: 0.5rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card — gap: 0.5rem
  - .build-selector-modal-card .build-source-link — margin-top: 0.5rem
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-container .avatar-upload-overlay — margin-top: 0.5rem (risk: media-query)
  - .archetype-path — gap: 0.5rem
  - .skill-options — margin-bottom: 0.5rem
  - .tabs — gap: 0.5rem
  - .tier-accordion-content — gap: 0.5rem
  - .talents — gap: 0.5rem
  - .gear-options — gap: 0.5rem
  - .gear-slot — gap: 0.5rem (risk: media-query)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .back-button — gap: 0.5rem
  - .companion-summary-content — gap: 0.5rem
  - .companion-summary-meta — gap: 0.5rem
  - .filter-tags — gap: 0.5rem
  - .build-card-meta — margin-bottom: 0.5rem
  - .build-card-meta — gap: 0.5rem
  - .build-card-desc — margin-bottom: 0.5rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .form-row label — gap: 0.5rem
  - .level-talents — gap: 0.5rem
  - .more-talents — padding: 0.5rem

### spacing — 0.75rem
Audit count/files: 55 / 15

- src/App.css
  - .view-kpis — gap: 0.75rem (risk: media-query)
  - .build-list — gap: 0.75rem
  - .form-section input,
.form-section select,
.form-section textarea — padding: 0.75rem
  - .app-footer .footer-content — gap: 0.75rem
  - .header — padding: 0.75rem (risk: media-query)
- src/components/BuildList.css
  - .party-list — gap: 0.75rem
  - .party-member-progress — gap: 0.75rem
  - .party-member-card — padding: 0.75rem (risk: media-query)
- src/components/DataAuditView.css
  - .data-audit-coverage — gap: 0.75rem
  - .data-audit-detail-header — margin-bottom: 0.75rem
  - .data-audit-detail-json pre — padding: 0.75rem
- src/components/GameLibrary.css
  - .footer-content — gap: 0.75rem
- src/components/InfoModal.css
  - .roadmap-section — gap: 0.75rem
- src/components/MobileMenu.css
  - .game-select-info — gap: 0.75rem
- src/components/PartyBar.css
  - .party-bar-content — gap: 0.75rem (risk: media-query)
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-meta — margin-bottom: 0.75rem
  - .build-selector.bg3 .companion-card-desc — padding-left: 0.75rem
  - .build-selector.bg3 .tracked-build-actions — padding-top: 0.75rem
  - .build-selector.bg3 .tracked-build-actions — margin-top: 0.75rem
  - .build-selector.bg3 .unselected-build-info — gap: 0.75rem
  - .build-selector.bg3 .tracked-build-indicator — gap: 0.75rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-desc — padding: 0.75rem
  - .build-selector-modal-overlay.bg3 .build-card-layout — gap: 0.75rem (risk: media-query)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-description — padding-left: 0.75rem
  - .level-indicator — gap: 0.75rem
  - .gear-slots — gap: 0.75rem
  - .level-confirm-title — margin-bottom: 0.75rem
  - .level-confirm-actions — gap: 0.75rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-desc — padding-left: 0.75rem
  - .filter-section,
.sort-section — gap: 0.75rem
  - .build-card-desc — padding-left: 0.75rem
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .subtitle — margin-top: 0.75rem
  - .filter-section — gap: 0.75rem
  - .companion-header — padding-bottom: 0.75rem
  - .companion-header — gap: 0.75rem
  - .companion-card-title-row — gap: 0.75rem
  - .companion-card-desc — padding-left: 0.75rem
  - .build-card — gap: 0.75rem
  - .companion-header-static — padding-bottom: 0.75rem
  - .companion-header-static — gap: 0.75rem
  - .tracked-build-preview — gap: 0.75rem
  - .unselected-build-info — gap: 0.75rem
- src/games/rogue-trader/components/BuildViewer.css
  - .build-description — padding-left: 0.75rem
  - .level-indicator — gap: 0.75rem
  - .tier-accordion — margin-bottom: 0.75rem
  - .tier-accordion-header — gap: 0.75rem
  - .gear-view — gap: 0.75rem
  - .gear-slot — padding: 0.75rem
  - .level-confirm-title — margin-bottom: 0.75rem
  - .level-confirm-actions — gap: 0.75rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-section — gap: 0.75rem
  - .build-card-title-row — gap: 0.75rem
  - .build-card-desc — padding-left: 0.75rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .header-actions — gap: 0.75rem
  - .talent-search — margin-bottom: 0.75rem

### spacing — 0
Audit count/files: 45 / 16

- src/App.css
  - .view-subtitle — margin: 0
  - .build-selector .build-credit — margin-bottom: 0 (risk: media-query)
  - .storage-notice — margin: 0
  - .back-btn — padding: 0
  - .header h1 — margin: 0
  - .main-content.landing — margin: 0
  - .main-content.landing — padding: 0
  - .game-card p — margin: 0
  - .view-header h1 — margin-bottom: 0
  - .footer-landing-link — padding: 0
  - .app-footer .footer-link — padding: 0
  - .main-content.landing — padding: 0 (risk: media-query)
- src/components/BuildList.css
  - .party-member-menu-btn — padding: 0
- src/components/DataAuditView.css
  - .data-audit — padding: 0
  - .data-audit-subtitle — margin: 0
  - .data-audit-detail-header h2 — margin: 0
- src/components/GameLibrary.css
  - .hero-subtitle — margin: 0
  - .footer-link — padding: 0
  - .picker-modal .game-card .game-logo — margin: 0
  - .game-card p — margin: 0
  - .game-stats — margin: 0
- src/components/InfoModal.css
  - .changelog-entry:last-child — padding-bottom: 0
  - .changelog-changes — margin: 0
  - .roadmap-section-title — margin: 0
- src/components/MobileMenu.css
  - .mobile-menu-section:last-child — margin-bottom: 0
  - .mobile-menu-section .profile-dropdown.mobile — padding: 0
  - .profile-selector.mobile .profile-create-form — padding: 0
- src/components/TooltipSheet.css
  - .tooltip-sheet-title — margin: 0
  - .tooltip-sheet-description p:last-child — margin-bottom: 0
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-header h3 — margin: 0
  - .build-selector.bg3 .builds-grid .build-desc — margin: 0
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header h2 — margin: 0
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar-btn — padding: 0
  - .gear-intro — margin: 0
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .clear-filters — padding: 0
  - .companion-build-card — padding: 0
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector h1 — margin-bottom: 0
  - .clear-filters — padding: 0
  - .companion-section.collapsed .companion-header — margin-bottom: 0
  - .companion-section.collapsed .companion-header — padding-bottom: 0
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-btn — padding: 0
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .clear-filters — padding: 0
  - .companion-build-card — padding: 0
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .editor-header h2 — margin: 0
- src/index.css
  - body — margin: 0

### spacing — 1.5rem
Audit count/files: 39 / 13

- src/App.css
  - .view-header — margin-bottom: 1.5rem
  - .import-export-toolbar — margin-bottom: 1.5rem
  - .build-editor h2 — margin-bottom: 1.5rem
  - .form-actions — padding-top: 1.5rem
- src/components/DataAuditView.css
  - .data-audit-body — gap: 1.5rem
- src/components/GameLibrary.css
  - .hero-tagline — margin-bottom: 1.5rem (risk: media-query)
  - .picker-modal — padding: 1.5rem (risk: media-query)
- src/components/InfoModal.css
  - .changelog-list — gap: 1.5rem
  - .changelog-entry — padding-bottom: 1.5rem
  - .roadmap-list — gap: 1.5rem
  - .info-modal — padding: 1.5rem (risk: media-query)
- src/components/MobileMenu.css
  - .mobile-menu-section — margin-bottom: 1.5rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-credit — margin-bottom: 1.5rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn — margin-bottom: 1.5rem
  - .build-viewer-header — margin-bottom: 1.5rem
  - .level-indicator — margin-bottom: 1.5rem
  - .stats-view — gap: 1.5rem
  - .stats-section — padding: 1.5rem
  - .level-confirm-dialog — padding: 1.5rem
  - .level-confirm-message — margin-bottom: 1.5rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-header — margin-bottom: 1.5rem
  - .back-button — margin-bottom: 1.5rem
  - .companion-detail-summary — margin-bottom: 1.5rem
  - .companion-detail-controls — gap: 1.5rem
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector-controls — gap: 1.5rem
  - .coming-soon — padding: 1.5rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-header — padding: 1.5rem
  - .build-selector-modal-header — gap: 1.5rem
  - .build-selector-modal-builds — padding: 1.5rem
- src/games/rogue-trader/components/BuildViewer.css
  - .level-confirm-dialog — padding: 1.5rem
  - .level-confirm-message — margin-bottom: 1.5rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-detail-header — margin-bottom: 1.5rem
  - .back-button — margin-bottom: 1.5rem
  - .companion-detail-summary — margin-bottom: 1.5rem
  - .companion-detail-controls — gap: 1.5rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .editor-header — margin-bottom: 1.5rem
  - .editor-form — margin-bottom: 1.5rem
  - .editor-form — padding: 1.5rem
  - .form-row — gap: 1.5rem

### spacing — 0.25rem
Audit count/files: 18 / 9

- src/components/AvatarUpload.css
  - .avatar-upload-actions — gap: 0.25rem
- src/components/BuildList.css
  - .party-member-progress — margin-top: 0.25rem
- src/components/DataAuditView.css
  - .data-audit-table — padding-right: 0.25rem
  - .data-audit-row-meta — gap: 0.25rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-desc — margin-top: 0.25rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-number — gap: 0.25rem
  - .ability-score — gap: 0.25rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .filter-tag — gap: 0.25rem
  - .sort-option — gap: 0.25rem
  - .build-card-title — margin-bottom: 0.25rem
  - .build-card-gear — gap: 0.25rem
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-tag — gap: 0.25rem
  - .companion-header — gap: 0.25rem (risk: media-query)
- src/games/rogue-trader/components/BuildViewer.css
  - .level-list — gap: 0.25rem
  - .level-number — gap: 0.25rem
  - .level-content — gap: 0.25rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-tag — gap: 0.25rem
  - .build-card-title — margin-bottom: 0.25rem

### spacing — 0.75rem 1rem
Audit count/files: 16 / 8

- src/App.css
  - .builds-subnav — padding: 0.75rem 1rem
  - .error-banner — padding: 0.75rem 1rem
  - .storage-notice — padding: 0.75rem 1rem
- src/components/GameLibrary.css
  - .landing-footer — padding: 0.75rem 1rem (risk: media-query)
- src/components/MobileMenu.css
  - .game-select-btn — padding: 0.75rem 1rem
  - .mobile-menu-section .profile-select-btn — padding: 0.75rem 1rem
  - .profile-selector.mobile .profile-create-form input — padding: 0.75rem 1rem
  - .profile-selector.mobile .profile-create-form button — padding: 0.75rem 1rem
- src/components/PartyBar.css
  - .party-bar-content — padding: 0.75rem 1rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-confirm-cancel,
.level-confirm-ok — padding: 0.75rem 1rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-quote — padding: 0.75rem 1rem
- src/games/rogue-trader/components/BuildViewer.css
  - .tier-accordion-header — padding: 0.75rem 1rem
  - .tier-accordion-content — padding: 0.75rem 1rem
  - .level-confirm-cancel,
.level-confirm-ok — padding: 0.75rem 1rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .tier-divider — padding: 0.75rem 1rem
  - .level-row — padding: 0.75rem 1rem

### spacing — 2rem
Audit count/files: 15 / 6

- src/App.css
  - .view-hero — gap: 2rem
  - .main-content — padding: 2rem
  - .game-selector .subtitle — margin-bottom: 2rem
  - .game-card — padding: 2rem
  - .storage-notice — margin-top: 2rem
  - .form-actions — margin-top: 2rem
- src/components/DataAuditView.css
  - .data-audit-hero — gap: 2rem
- src/components/GameLibrary.css
  - .hero-content — padding: 2rem
  - .hero-split — padding: 2rem (risk: media-query)
  - .picker-overlay — padding: 2rem
  - .picker-modal — padding: 2rem
- src/components/InfoModal.css
  - .info-modal-overlay — padding: 2rem
  - .info-modal — padding: 2rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header h2 — padding-right: 2rem (risk: media-query)
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .build-credit — margin-bottom: 2rem

### spacing — 0 auto
Audit count/files: 14 / 10

- src/App.css
  - .header-content — margin: 0 auto
  - .main-content — margin: 0 auto
  - .game-grid — margin: 0 auto
  - .build-list-view — margin: 0 auto
  - .build-editor — margin: 0 auto
- src/components/GameLibrary.css
  - .hero-split — margin: 0 auto
- src/components/PartyBar.css
  - .party-bar-content — margin: 0 auto
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 — margin: 0 auto
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer.bg3 — margin: 0 auto
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen — margin: 0 auto
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector — margin: 0 auto
- src/games/rogue-trader/components/BuildViewer.css
  - .build-viewer — margin: 0 auto
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-detail-screen.rt — margin: 0 auto
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .custom-build-editor — margin: 0 auto

### spacing — 8px
Audit count/files: 14 / 4

- src/components/HeaderGameSelector.css
  - .header-game-toggle — gap: 8px
  - .header-game-toggle — padding: 8px (risk: media-query)
- src/components/ProfileSelector.css
  - .profile-selector-toggle — gap: 8px
  - .profile-current-header — margin-bottom: 8px
  - .profile-current-actions — gap: 8px
  - .profile-edit-buttons — gap: 8px
  - .profile-switch-header — margin-bottom: 8px
  - .profile-create-form — padding: 8px
  - .profile-import-export — padding: 8px
  - .profile-privacy — padding: 8px
- src/components/SearchBar.css
  - .search-icon — margin-right: 8px
- src/components/TooltipCard.css
  - .crpg-tooltip-title-block — gap: 8px
  - .crpg-tooltip-section,
.crpg-tooltip-stats — gap: 8px
  - .crpg-tooltip-kv — gap: 8px

### spacing — 0.35rem
Audit count/files: 12 / 8

- src/components/BuildList.css
  - .party-member-header-right — gap: 0.35rem
  - .party-member-path — gap: 0.35rem
- src/components/DataAuditView.css
  - .data-audit-controls label — gap: 0.35rem
- src/components/InfoModal.css
  - .changelog-changes li — margin-bottom: 0.35rem
  - .roadmap-item-title — margin-bottom: 0.35rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-gear — gap: 0.35rem
  - .build-selector.bg3 .companion-card-desc — margin-top: 0.35rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-gear — gap: 0.35rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-desc — margin-top: 0.35rem
  - .companion-detail-screen .companion-card-quote — margin-top: 0.35rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-desc — margin-top: 0.35rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path — gap: 0.35rem

### spacing — 4px
Audit count/files: 11 / 5

- src/components/BuildList.css
  - .party-member-dropdown — margin-top: 4px
- src/components/ProfileSelector.css
  - .profile-actions — padding-right: 4px
  - .profile-edit — gap: 4px
  - .profile-create-form — gap: 4px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .unselected-badge — gap: 4px
  - .build-selector.bg3 .tracked-badge — gap: 4px
  - .build-selector.bg3 .build-card-tracked-badge — gap: 4px
- src/games/rogue-trader/components/BuildSelector.css
  - .unselected-badge — gap: 4px
  - .tracked-badge — gap: 4px
  - .build-card-tracked-badge — gap: 4px
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-badge — gap: 4px

### spacing — 2px 8px
Audit count/files: 10 / 4

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-tag — padding: 2px 8px
  - .build-selector.bg3 .unselected-badge — padding: 2px 8px
  - .build-selector.bg3 .tracked-level — padding: 2px 8px
  - .build-selector.bg3 .tracked-badge — padding: 2px 8px
  - .build-selector.bg3 .build-card-tracked-badge — padding: 2px 8px
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-tag — padding: 2px 8px
- src/games/rogue-trader/components/BuildSelector.css
  - .unselected-badge — padding: 2px 8px
  - .tracked-badge — padding: 2px 8px
  - .build-card-tracked-badge — padding: 2px 8px
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-badge — padding: 2px 8px

### spacing — 1.25rem
Audit count/files: 8 / 6

- src/App.css
  - .form-section — margin-bottom: 1.25rem
- src/components/InfoModal.css
  - .changelog-changes — padding-left: 1.25rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-list .build-card — padding: 1.25rem
  - .build-selector.bg3 .companion-card-layout — gap: 1.25rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .build-card-layout — gap: 1.25rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-layout — gap: 1.25rem
  - .build-card — padding: 1.25rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .build-card-layout — gap: 1.25rem

### spacing — .5rem
Audit count/files: 8 / 7

- src/components/BuildList.css
  - .party-member-build — margin-bottom: .5rem
  - .party-member-path — margin-bottom: .5rem
- src/components/MobileMenu.css
  - .mobile-menu-section .profile-list — margin-top: .5rem
- src/components/ProfileSelector.css
  - .profile-import-btn — margin-bottom: .5rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-header — gap: .5rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-meta — margin-bottom: .5rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-title-row — margin-bottom: .5rem
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path — margin-bottom: .5rem

### spacing — 0 0 0.5rem
Audit count/files: 6 / 5

- src/App.css
  - .view-eyebrow — margin: 0 0 0.5rem
  - .game-card h3 — margin: 0 0 0.5rem
- src/components/DataAuditView.css
  - .data-audit-eyebrow — margin: 0 0 0.5rem
- src/components/GameLibrary.css
  - .game-card h3 — margin: 0 0 0.5rem
- src/games/rogue-trader/components/BuildSelector.css
  - .coming-soon h3 — margin: 0 0 0.5rem
- src/games/rogue-trader/components/BuildViewer.css
  - .build-title h2 — margin: 0 0 0.5rem

### spacing — 0.2rem 0.6rem
Audit count/files: 6 / 6

- src/components/BuildList.css
  - .party-member-level — padding: 0.2rem 0.6rem
- src/components/InfoModal.css
  - .changelog-version — padding: 0.2rem 0.6rem
- src/components/TooltipSheet.css
  - .tooltip-sheet-subtitle.badge — padding: 0.2rem 0.6rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .difficulty-badge — padding: 0.2rem 0.6rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-level-badge — padding: 0.2rem 0.6rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .build-card-level — padding: 0.2rem 0.6rem

### spacing — 0.25rem 0.5rem
Audit count/files: 5 / 5

- src/App.css
  - .error-banner button — padding: 0.25rem 0.5rem
- src/components/AvatarUpload.css
  - .avatar-upload-error — padding: 0.25rem 0.5rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .build-card-tag — padding: 0.25rem 0.5rem
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger — padding: 0.25rem 0.5rem
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier — padding: 0.25rem 0.5rem

### spacing — 2px 6px
Audit count/files: 5 / 5

- src/components/SearchBar.css
  - .result-type — padding: 2px 6px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-level-badge — padding: 2px 6px
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-level-badge — padding: 2px 6px
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar-level — padding: 2px 6px
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-level — padding: 2px 6px

### spacing — 1.25rem 1.5rem
Audit count/files: 5 / 5

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-section — padding: 1.25rem 1.5rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header — padding: 1.25rem 1.5rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-section — padding: 1.25rem 1.5rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-section — padding: 1.25rem 1.5rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-detail-summary — padding: 1.25rem 1.5rem

### type — font-weight: 600
Audit count/files: 64 / 19

- src/App.css
  - .coming-soon-badge — font-weight: 600
  - .beta-badge — font-weight: 600
- src/components/BuildList.css
  - .party-member-avatar .avatar-placeholder — font-weight: 600
  - .party-member-name — font-weight: 600
  - .party-member-level — font-weight: 600
- src/components/DataAuditView.css
  - .data-audit-row-title span — font-weight: 600
- src/components/GameLibrary.css
  - .picker-modal h2 — font-weight: 600
  - .section-header — font-weight: 600
  - .game-card h3 — font-weight: 600
- src/components/InfoModal.css
  - .info-modal h2 — font-weight: 600
  - .changelog-version — font-weight: 600
  - .changelog-title — font-weight: 600
  - .roadmap-section-title — font-weight: 600
  - .roadmap-item-title — font-weight: 600
- src/components/MobileMenu.css
  - .mobile-menu-section h3 — font-weight: 600
- src/components/MobileStickyButton.css
  - .add-to-party-desktop.btn,
.add-to-party-mobile .btn — font-weight: 600
- src/components/PartyBar.css
  - .party-label — font-weight: 600
  - .party-avatar-fallback — font-weight: 600
  - .party-level — font-weight: 600
- src/components/ProfileSelector.css
  - .profile-current-name — font-weight: 600
- src/components/TooltipSheet.css
  - .tooltip-sheet-title — font-weight: 600
  - .tooltip-sheet-subtitle.badge — font-weight: 600
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .difficulty-badge — font-weight: 600
  - .build-selector.bg3 .companion-card-level-badge — font-weight: 600
  - .build-selector.bg3 .companion-card-title — font-weight: 600
  - .build-selector.bg3 .companion-card-tag.difficulty — font-weight: 600
  - .build-selector.bg3 .builds-grid .build-name — font-weight: 600
  - .build-selector.bg3 .unselected-badge — font-weight: 600
  - .build-selector.bg3 .tracked-level — font-weight: 600
  - .build-selector.bg3 .tracked-badge — font-weight: 600
  - .build-selector.bg3 .build-card-tracked-badge — font-weight: 600
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-level-badge — font-weight: 600
  - .build-selector-modal-overlay.bg3 .build-card-title — font-weight: 600
  - .build-selector-modal-overlay.bg3 .build-card-tag.difficulty — font-weight: 600
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar-level — font-weight: 600
  - .build-tags .tag.difficulty — font-weight: 600
  - .level-display — font-weight: 600
  - .level-number — font-weight: 600
  - .stat-change-value — font-weight: 600
  - .stat-value — font-weight: 600
  - .level-confirm-title — font-weight: 600
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-title — font-weight: 600
  - .filter-label,
.sort-label — font-weight: 600
  - .tracked-banner — font-weight: 600
  - .build-card-title — font-weight: 600
  - .build-card-tag.difficulty — font-weight: 600
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-label — font-weight: 600
  - .companion-card-level-badge — font-weight: 600
  - .companion-card-title — font-weight: 600
  - .unselected-badge — font-weight: 600
  - .tracked-badge — font-weight: 600
  - .build-card-tracked-badge — font-weight: 600
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-name — font-weight: 600
  - .build-selector-modal-card-badge — font-weight: 600
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-level — font-weight: 600
  - .level-display — font-weight: 600
  - .tier-accordion-header — font-weight: 600
  - .level-confirm-title — font-weight: 600
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-title — font-weight: 600
  - .filter-label — font-weight: 600
  - .build-card-title — font-weight: 600
  - .build-card-level — font-weight: 600
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .tier-divider — font-weight: 600
  - .level-number — font-weight: 600

### type — font-size: 0.85rem
Audit count/files: 54 / 16

- src/App.css
  - .storage-notice — font-size: 0.85rem
  - .form-section .helper-text — font-size: 0.85rem
  - .btn-sm — font-size: 0.85rem
- src/components/BuildList.css
  - .import-export-buttons .btn — font-size: 0.85rem
  - .party-member-level — font-size: 0.85rem
- src/components/DataAuditView.css
  - .data-audit-list-item em — font-size: 0.85rem
  - .data-audit-meta — font-size: 0.85rem
  - .data-audit-detail-header span — font-size: 0.85rem
- src/components/GameLibrary.css
  - .hero-subtitle — font-size: 0.85rem
  - .game-stats — font-size: 0.85rem
- src/components/InfoModal.css
  - .changelog-date — font-size: 0.85rem
  - .roadmap-section-title — font-size: 0.85rem
- src/components/ProfileSelector.css
  - .profile-action-btn-large — font-size: 0.85rem
  - .profile-action-btn — font-size: 0.85rem
  - .profile-create-form button — font-size: 0.85rem
  - .profile-import-btn — font-size: 0.85rem
- src/components/TooltipSheet.css
  - .tooltip-sheet-subtitle — font-size: 0.85rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-meta — font-size: 0.85rem
  - .build-selector.bg3 .companion-card-meta — font-size: 0.85rem
  - .build-selector.bg3 .builds-grid .build-path — font-size: 0.85rem
  - .build-selector.bg3 .builds-grid .build-desc — font-size: 0.85rem
  - .build-selector.bg3 .tracked-build-change-btn — font-size: 0.85rem
  - .build-selector.bg3 .tracked-build-edit-btn — font-size: 0.85rem
  - .build-selector.bg3 .unselected-build-count — font-size: 0.85rem
  - .build-selector.bg3 .unselected-build-action — font-size: 0.85rem
  - .build-selector.bg3 .tracked-label — font-size: 0.85rem
  - .build-selector.bg3 .companion-card-action — font-size: 0.85rem
  - .build-selector.bg3 .tracked-build-level — font-size: 0.85rem
  - .build-selector.bg3 .tracked-build-edit-btn — font-size: 0.85rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-meta — font-size: 0.85rem
  - .build-selector-modal-overlay.bg3 .build-card-desc — font-size: 0.85rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .asi — font-size: 0.85rem
  - .level-notes — font-size: 0.85rem
  - .slot-name — font-size: 0.85rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-meta — font-size: 0.85rem
  - .companion-detail-screen .companion-card-quote — font-size: 0.85rem
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger — font-size: 0.85rem
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .build-credit — font-size: 0.85rem
  - .companion-card-meta — font-size: 0.85rem
  - .build-desc — font-size: 0.85rem
  - .companion-tag — font-size: 0.85rem
  - .unselected-build-count — font-size: 0.85rem
  - .unselected-build-action — font-size: 0.85rem
  - .tracked-build-level — font-size: 0.85rem
  - .tracked-build-change-btn — font-size: 0.85rem
  - .tracked-build-edit-btn — font-size: 0.85rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-quote — font-size: 0.85rem
  - .build-selector-modal-card-desc — font-size: 0.85rem
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier — font-size: 0.85rem
  - .stat-increase — font-size: 0.85rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .progression-editor .hint — font-size: 0.85rem
  - .selected-talent — font-size: 0.85rem
  - .no-talents — font-size: 0.85rem
  - .more-talents — font-size: 0.85rem

### type — font-size: 0.75rem
Audit count/files: 47 / 17

- src/App.css
  - .view-eyebrow — font-size: 0.75rem
- src/components/BuildList.css
  - .party-member-path — font-size: 0.75rem
  - .progress-label — font-size: 0.75rem
- src/components/DataAuditView.css
  - .data-audit-eyebrow — font-size: 0.75rem
  - .data-audit-controls label — font-size: 0.75rem
  - .data-audit-row-meta — font-size: 0.75rem
  - .data-audit-detail-fields strong — font-size: 0.75rem
  - .data-audit-detail-json pre — font-size: 0.75rem
- src/components/GameLibrary.css
  - .footer-content — font-size: 0.75rem (risk: media-query)
- src/components/MobileMenu.css
  - .mobile-menu-section h3 — font-size: 0.75rem
- src/components/PartyBar.css
  - .party-label — font-size: 0.75rem
- src/components/ProfileSelector.css
  - .profile-current-label — font-size: 0.75rem
  - .profile-switch-header — font-size: 0.75rem
  - .privacy-notice — font-size: 0.75rem
- src/components/TooltipCard.css
  - .crpg-tooltip-badge — font-size: 0.75rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .difficulty-badge — font-size: 0.75rem
  - .build-selector.bg3 .build-card-tags .tag — font-size: 0.75rem
  - .build-selector.bg3 .companion-card-level-badge — font-size: 0.75rem
  - .build-selector.bg3 .companion-card-tag — font-size: 0.75rem
  - .build-selector.bg3 .unselected-badge — font-size: 0.75rem
  - .build-selector.bg3 .tracked-level — font-size: 0.75rem
  - .build-selector.bg3 .tracked-badge — font-size: 0.75rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-level-badge — font-size: 0.75rem
  - .build-selector-modal-overlay.bg3 .build-card-tag — font-size: 0.75rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar-level — font-size: 0.75rem
  - .stat-change-mod — font-size: 0.75rem
  - .stat-name — font-size: 0.75rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .filter-label,
.sort-label — font-size: 0.75rem
  - .filter-tag — font-size: 0.75rem
  - .sort-option — font-size: 0.75rem
  - .clear-filters — font-size: 0.75rem
  - .tracked-banner — font-size: 0.75rem
  - .build-source-link — font-size: 0.75rem
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-label — font-size: 0.75rem
  - .filter-tag — font-size: 0.75rem
  - .clear-filters — font-size: 0.75rem
  - .unselected-badge — font-size: 0.75rem
  - .tracked-badge — font-size: 0.75rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path — font-size: 0.75rem
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-level — font-size: 0.75rem
  - .tier-accordion-icon — font-size: 0.75rem
  - .tier-completed-badge — font-size: 0.75rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-label — font-size: 0.75rem
  - .filter-tag — font-size: 0.75rem
  - .clear-filters — font-size: 0.75rem
  - .build-source-link — font-size: 0.75rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .talent-source — font-size: 0.75rem

### type — font-size: 0.9rem
Audit count/files: 43 / 16

- src/App.css
  - .game-card p — font-size: 0.9rem
  - .build-info p — font-size: 0.9rem
- src/components/BuildList.css
  - .party-member-build — font-size: 0.9rem
- src/components/DataAuditView.css
  - .data-audit-detail-fields span — font-size: 0.9rem
  - .data-audit-detail-json h3 — font-size: 0.9rem
- src/components/HeaderGameSelector.css
  - .header-game-toggle — font-size: 0.9rem
  - .header-game-item-name — font-size: 0.9rem
- src/components/InfoModal.css
  - .changelog-changes li — font-size: 0.9rem
  - .roadmap-item-desc — font-size: 0.9rem
- src/components/ProfileSelector.css
  - .profile-selector-toggle — font-size: 0.9rem
  - .profile-edit-buttons button — font-size: 0.9rem
  - .profile-select-btn — font-size: 0.9rem
  - .profile-edit input — font-size: 0.9rem
  - .profile-create-form input — font-size: 0.9rem
  - .profile-create-btn — font-size: 0.9rem
- src/components/SearchBar.css
  - .search-icon — font-size: 0.9rem
  - .search-input — font-size: 0.9rem
  - .search-no-results — font-size: 0.9rem
- src/components/TooltipSheet.css
  - .tooltip-sheet-meta — font-size: 0.9rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-credit — font-size: 0.9rem
  - .build-selector.bg3 .build-card-description — font-size: 0.9rem
  - .build-selector.bg3 .companion-card-desc — font-size: 0.9rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-meta — font-size: 0.9rem
  - .level-label — font-size: 0.9rem
  - .tab — font-size: 0.9rem
  - .feat — font-size: 0.9rem
  - .spells-learned — font-size: 0.9rem
  - .stat-modifier — font-size: 0.9rem
  - .traits, .skills — font-size: 0.9rem
  - .gear-intro — font-size: 0.9rem
  - .slot-items — font-size: 0.9rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-desc — font-size: 0.9rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-desc — font-size: 0.9rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-role — font-size: 0.9rem
  - .build-selector-modal-bio — font-size: 0.9rem
- src/games/rogue-trader/components/BuildViewer.css
  - .level-label — font-size: 0.9rem
  - .talent — font-size: 0.9rem
  - .gear-item — font-size: 0.9rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-desc — font-size: 0.9rem
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .form-row label — font-size: 0.9rem
  - .tier-divider — font-size: 0.9rem
  - .talent-search — font-size: 0.9rem
  - .talent-name — font-size: 0.9rem

### type — font-weight: 500
Audit count/files: 30 / 16

- src/App.css
  - .header-nav-tab — font-weight: 500
  - .builds-subnav-tab — font-weight: 500
  - .build-archetype-path .archetype — font-weight: 500
  - .form-section label — font-weight: 500
  - .btn — font-weight: 500
- src/components/BuildList.css
  - .build-tag — font-weight: 500
- src/components/GameLibrary.css
  - .game-stats — font-weight: 500
- src/components/HeaderGameSelector.css
  - .header-game-name — font-weight: 500
  - .header-game-item-name — font-weight: 500
- src/components/MobileMenu.css
  - .game-select-name — font-weight: 500
- src/components/ProfileSelector.css
  - .profile-name — font-weight: 500
- src/components/SearchBar.css
  - .result-name — font-weight: 500
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .unselected-build-action — font-weight: 500
  - .build-selector.bg3 .companion-card-action — font-weight: 500
  - .build-selector.bg3 .tracked-build-name — font-weight: 500
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .class-levels — font-weight: 500
  - .slot-name — font-weight: 500
  - .level-confirm-cancel,
.level-confirm-ok — font-weight: 500
- src/games/baldurs-gate-3/components/KeywordText.css
  - .bg3-keyword-trigger — font-weight: 500
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger — font-weight: 500
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype — font-weight: 500
  - .unselected-build-action — font-weight: 500
  - .tracked-build-name — font-weight: 500
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype — font-weight: 500
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier — font-weight: 500
  - .tier-completed-badge — font-weight: 500
  - .slot-name — font-weight: 500
  - .level-confirm-cancel,
.level-confirm-ok — font-weight: 500
- src/games/rogue-trader/components/KeywordText.css
  - .keyword-trigger — font-weight: 500
- src/index.css
  - a — font-weight: 500

### type — text-transform: uppercase
Audit count/files: 26 / 16

- src/App.css
  - .view-eyebrow — text-transform: uppercase
  - .coming-soon-badge — text-transform: uppercase
  - .beta-badge — text-transform: uppercase
- src/components/BuildList.css
  - .build-tag — text-transform: uppercase
- src/components/DataAuditView.css
  - .data-audit-eyebrow — text-transform: uppercase
  - .data-audit-panel h2 — text-transform: uppercase
  - .data-audit-controls label — text-transform: uppercase
  - .data-audit-detail-fields strong — text-transform: uppercase
  - .data-audit-detail-json h3 — text-transform: uppercase
- src/components/GameLibrary.css
  - .coming-soon-badge,
.beta-badge — text-transform: uppercase
  - .version-badge — text-transform: uppercase
- src/components/InfoModal.css
  - .roadmap-section-title — text-transform: uppercase
- src/components/MobileMenu.css
  - .mobile-menu-section h3 — text-transform: uppercase
- src/components/PartyBar.css
  - .party-label — text-transform: uppercase
- src/components/ProfileSelector.css
  - .profile-current-label — text-transform: uppercase
  - .profile-switch-header — text-transform: uppercase
- src/components/SearchBar.css
  - .result-type — text-transform: uppercase
- src/components/TooltipCard.css
  - .crpg-tooltip-badge — text-transform: uppercase
- src/components/TooltipSheet.css
  - .tooltip-sheet-subtitle.badge — text-transform: uppercase
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .stat-change-name — text-transform: uppercase
  - .stat-name — text-transform: uppercase
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .filter-label,
.sort-label — text-transform: uppercase
  - .build-card-tag — text-transform: uppercase
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-label — text-transform: uppercase
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-builds h3 — text-transform: uppercase
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-label — text-transform: uppercase

### type — font-size: 0.8rem
Audit count/files: 26 / 14

- src/App.css
  - .view-kpis span — font-size: 0.8rem
  - .storage-notice — font-size: 0.8rem
  - .build-date — font-size: 0.8rem
  - .build-archetype-path — font-size: 0.8rem
  - .app-footer .footer-content — font-size: 0.8rem
- src/components/BuildList.css
  - .dropdown-item — font-size: 0.8rem
- src/components/DataAuditView.css
  - .data-audit-kpis span — font-size: 0.8rem
  - .data-audit-coverage-row — font-size: 0.8rem
  - .data-audit-row-title em — font-size: 0.8rem
- src/components/GameLibrary.css
  - .footer-content — font-size: 0.8rem
- src/components/InfoModal.css
  - .changelog-version — font-size: 0.8rem
- src/components/ProfileSelector.css
  - .clear-data-btn — font-size: 0.8rem
- src/components/SearchBar.css
  - .search-clear — font-size: 0.8rem
  - .result-description — font-size: 0.8rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-source-link — font-size: 0.8rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-source-link — font-size: 0.8rem
  - .build-selector-modal-overlay.bg3 .build-card-meta — font-size: 0.8rem (risk: media-query)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-tags .tag — font-size: 0.8rem
  - .slot-notes — font-size: 0.8rem
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .build-source-link — font-size: 0.8rem
  - .companion-card-level-badge — font-size: 0.8rem
  - .build-path — font-size: 0.8rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card .build-source-link — font-size: 0.8rem
- src/games/rogue-trader/components/BuildViewer.css
  - .level-notes — font-size: 0.8rem
  - .archetype-path — font-size: 0.8rem (risk: media-query)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .build-card-level — font-size: 0.8rem

### type — font-size: 1rem
Audit count/files: 20 / 15

- src/App.css
  - .header-nav-tab — font-size: 1rem
  - .builds-subnav-tab — font-size: 1rem
  - .form-section input,
.form-section select,
.form-section textarea — font-size: 1rem
- src/components/BuildList.css
  - .party-member-name — font-size: 1rem (risk: media-query)
- src/components/DataAuditView.css
  - .data-audit-panel h2 — font-size: 1rem
- src/components/GameLibrary.css
  - .section-header — font-size: 1rem
- src/components/MobileMenu.css
  - .game-select-name — font-size: 1rem
- src/components/MobileStickyButton.css
  - .add-to-party-mobile .btn — font-size: 1rem (risk: media-query)
- src/components/PartyBar.css
  - .party-avatar-fallback — font-size: 1rem
  - .party-edit-btn — font-size: 1rem
- src/components/ProfileSelector.css
  - .profile-icon — font-size: 1rem
  - .profile-edit-large input — font-size: 1rem
- src/components/SearchBar.css
  - .result-icon — font-size: 1rem
- src/components/TooltipSheet.css
  - .tooltip-sheet-description — font-size: 1rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .builds-grid .build-name — font-size: 1rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-title — font-size: 1rem (risk: media-query)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-confirm-cancel,
.level-confirm-ok — font-size: 1rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-builds h3 — font-size: 1rem
- src/games/rogue-trader/components/BuildViewer.css
  - .tier-accordion-header — font-size: 1rem
  - .level-confirm-cancel,
.level-confirm-ok — font-size: 1rem

### type — line-height: 1.5
Audit count/files: 15 / 9

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-desc — line-height: 1.5
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-desc — line-height: 1.5
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-description — line-height: 1.5
  - .stats-section p — line-height: 1.5
  - .level-confirm-message — line-height: 1.5
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-desc — line-height: 1.5
  - .build-card-desc — line-height: 1.5
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-desc — line-height: 1.5
  - .build-desc — line-height: 1.5
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-quote — line-height: 1.5
  - .build-selector-modal-bio — line-height: 1.5
- src/games/rogue-trader/components/BuildViewer.css
  - .level-confirm-message — line-height: 1.5
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-desc — line-height: 1.5
  - .build-card-desc — line-height: 1.5
- src/index.css
  - :root — line-height: 1.5

### type — font-size: 0.7rem
Audit count/files: 13 / 10

- src/App.css
  - .coming-soon-badge — font-size: 0.7rem
  - .beta-badge — font-size: 0.7rem
- src/components/AvatarUpload.css
  - .avatar-upload-error — font-size: 0.7rem
- src/components/BuildList.css
  - .build-tag — font-size: 0.7rem
- src/components/GameLibrary.css
  - .coming-soon-badge,
.beta-badge — font-size: 0.7rem
  - .version-badge — font-size: 0.7rem
- src/components/PartyBar.css
  - .party-level — font-size: 0.7rem
  - .delete-badge — font-size: 0.7rem
- src/components/ProfileSelector.css
  - .profile-arrow — font-size: 0.7rem
- src/components/SearchBar.css
  - .result-type — font-size: 0.7rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-tracked-badge — font-size: 0.7rem
- src/games/rogue-trader/components/BuildSelector.css
  - .build-card-tracked-badge — font-size: 0.7rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-badge — font-size: 0.7rem

### type — letter-spacing: 0.05em
Audit count/files: 12 / 10

- src/components/GameLibrary.css
  - .coming-soon-badge,
.beta-badge — letter-spacing: 0.05em
  - .version-badge — letter-spacing: 0.05em
- src/components/InfoModal.css
  - .roadmap-section-title — letter-spacing: 0.05em
- src/components/MobileMenu.css
  - .mobile-menu-section h3 — letter-spacing: 0.05em
- src/components/PartyBar.css
  - .party-label — letter-spacing: 0.05em
- src/components/ProfileSelector.css
  - .profile-current-label — letter-spacing: 0.05em
  - .profile-switch-header — letter-spacing: 0.05em
- src/components/TooltipCard.css
  - .crpg-tooltip-badge — letter-spacing: 0.05em
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .filter-label,
.sort-label — letter-spacing: 0.05em
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-label — letter-spacing: 0.05em
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-builds h3 — letter-spacing: 0.05em
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-label — letter-spacing: 0.05em

### type — font-size: 1.1rem
Audit count/files: 10 / 8

- src/App.css
  - .storage-notice .notice-icon — font-size: 1.1rem
- src/components/BuildList.css
  - .party-member-name — font-size: 1.1rem
- src/components/GameLibrary.css
  - .hero-cta — font-size: 1.1rem (risk: media-query)
- src/components/InfoModal.css
  - .changelog-title — font-size: 1.1rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-header h3 — font-size: 1.1rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-title — font-size: 1.1rem
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header h2 — font-size: 1.1rem (risk: media-query)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .stat-change-value — font-size: 1.1rem
  - .stats-section h3 — font-size: 1.1rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-name — font-size: 1.1rem

### type — font-size: 1.25rem
Audit count/files: 9 / 8

- src/App.css
  - .back-btn — font-size: 1.25rem
- src/components/GameLibrary.css
  - .hero-tagline — font-size: 1.25rem (risk: media-query)
  - .game-card h3 — font-size: 1.25rem
- src/components/InfoModal.css
  - .info-modal h2 — font-size: 1.25rem (risk: media-query)
- src/components/ProfileSelector.css
  - .profile-current-name — font-size: 1.25rem
- src/components/TooltipSheet.css
  - .tooltip-sheet-title — font-size: 1.25rem
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header h2 — font-size: 1.25rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-confirm-title — font-size: 1.25rem
- src/games/rogue-trader/components/BuildViewer.css
  - .level-confirm-title — font-size: 1.25rem

### type — font-size: 1.5rem
Audit count/files: 8 / 8

- src/App.css
  - .header h1 — font-size: 1.5rem
- src/components/BuildList.css
  - .party-member-avatar .avatar-placeholder — font-size: 1.5rem
- src/components/GameLibrary.css
  - .picker-modal h2 — font-size: 1.5rem
- src/components/InfoModal.css
  - .info-modal h2 — font-size: 1.5rem
- src/components/TooltipCard.css
  - .crpg-tooltip-title — font-size: 1.5rem
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .stat-value — font-size: 1.5rem
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-info h2 — font-size: 1.5rem
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-title — font-size: 1.5rem

### type — line-height: 1.6
Audit count/files: 6 / 6

- src/components/GameLibrary.css
  - .hero-tagline — line-height: 1.6
- src/components/InfoModal.css
  - .info-modal-content — line-height: 1.6
- src/components/TooltipCard.css
  - .crpg-tooltip-description — line-height: 1.6
- src/components/TooltipSheet.css
  - .tooltip-sheet-description — line-height: 1.6
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .slot-items — line-height: 1.6
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path — line-height: 1.6

### type — font-size: 1.35rem
Audit count/files: 5 / 5

- src/App.css
  - .view-kpis strong — font-size: 1.35rem (risk: media-query)
- src/components/GameLibrary.css
  - .hero-tagline — font-size: 1.35rem
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-group-title — font-size: 1.35rem
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-title — font-size: 1.35rem
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-group-title — font-size: 1.35rem

### radius — 8px
Audit count/files: 43 / 19

- src/App.css
  - .error-banner — border-radius: 8px
  - .storage-notice — border-radius: 8px
  - .import-export-toolbar — border-radius: 8px
  - .build-list-empty — border-radius: 8px
  - .build-card — border-radius: 8px
- src/components/AvatarUpload.css
  - .avatar-upload-placeholder — border-radius: 8px
  - .avatar-upload-image — border-radius: 8px
- src/components/BuildList.css
  - .build-list-empty — border-radius: 8px
  - .party-member-avatar — border-radius: 8px
  - .party-member-dropdown — border-radius: 8px
- src/components/GameLibrary.css
  - .picker-modal — border-radius: 8px
  - .game-card — border-radius: 8px
- src/components/HeaderGameSelector.css
  - .header-game-dropdown — border-radius: 8px
- src/components/InfoModal.css
  - .info-modal — border-radius: 8px
- src/components/MobileMenu.css
  - .mobile-menu-toggle — border-radius: 8px
  - .mobile-menu-close — border-radius: 8px (risk: media-query)
  - .game-select-btn — border-radius: 8px
  - .mobile-menu-section .profile-current — border-radius: 8px
  - .mobile-menu-section .profile-select-btn — border-radius: 8px
  - .profile-selector.mobile .profile-create-form input — border-radius: 8px
  - .profile-selector.mobile .profile-create-form button — border-radius: 8px
- src/components/PartyBar.css
  - .party-member — border-radius: 8px
  - .party-edit-btn — border-radius: 8px
- src/components/ProfileSelector.css
  - .profile-dropdown — border-radius: 8px
  - .profile-create-btn — border-radius: 8px
- src/components/SearchBar.css
  - .search-results — border-radius: 8px
- src/components/TooltipCard.css
  - .crpg-tooltip-icon-wrap — border-radius: 8px
  - .crpg-tooltip-badge — border-radius: 8px
- src/components/TooltipSheet.css
  - .tooltip-sheet-icon — border-radius: 8px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-gear-icon — border-radius: 8px
  - .build-selector.bg3 .builds-grid .build-card — border-radius: 8px
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-close — border-radius: 8px
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .stat-change-item — border-radius: 8px
  - .level-confirm-cancel,
.level-confirm-ok — border-radius: 8px
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .sort-option — border-radius: 8px
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-close — border-radius: 8px
  - .build-selector-modal-portrait — border-radius: 8px
  - .build-selector-modal-card — border-radius: 8px
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar — border-radius: 8px
  - .tier-accordion — border-radius: 8px
  - .level-row — border-radius: 8px
  - .level-confirm-cancel,
.level-confirm-ok — border-radius: 8px
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .editor-form — border-radius: 8px

### radius — 6px
Audit count/files: 39 / 14

- src/App.css
  - .back-btn — border-radius: 6px
  - .form-section input,
.form-section select,
.form-section textarea — border-radius: 6px
  - .btn — border-radius: 6px
- src/components/HeaderGameSelector.css
  - .header-game-toggle — border-radius: 6px
- src/components/InfoModal.css
  - .roadmap-item — border-radius: 6px
- src/components/ProfileSelector.css
  - .profile-selector-toggle — border-radius: 6px
  - .profile-action-btn-large — border-radius: 6px
  - .profile-edit-large input — border-radius: 6px
  - .profile-edit-buttons button — border-radius: 6px
  - .profile-import-btn — border-radius: 6px
  - .clear-data-btn — border-radius: 6px
- src/components/SearchBar.css
  - .search-input-wrapper — border-radius: 6px
- src/components/TooltipSheet.css
  - .tooltip-sheet-subtitle.badge — border-radius: 6px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-tags .tag — border-radius: 6px
  - .build-selector.bg3 .companion-card-level-badge — border-radius: 6px
  - .build-selector.bg3 .tracked-build-change-btn — border-radius: 6px
  - .build-selector.bg3 .tracked-build-edit-btn — border-radius: 6px
  - .build-selector.bg3 .unselected-badge — border-radius: 6px
  - .build-selector.bg3 .tracked-level — border-radius: 6px
  - .build-selector.bg3 .tracked-badge — border-radius: 6px
  - .build-selector.bg3 .tracked-build-edit-btn — border-radius: 6px
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-desc — border-radius: 6px
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar-level — border-radius: 6px
  - .build-tags .tag — border-radius: 6px
  - .level-display — border-radius: 6px
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .build-card-tag — border-radius: 6px
  - .build-card-gear-icon — border-radius: 6px
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-level-badge — border-radius: 6px
  - .unselected-badge — border-radius: 6px
  - .tracked-badge — border-radius: 6px
  - .tracked-build-change-btn — border-radius: 6px
  - .tracked-build-edit-btn — border-radius: 6px
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-level — border-radius: 6px
  - .level-display — border-radius: 6px
  - .talent — border-radius: 6px
  - .gear-item — border-radius: 6px
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .build-card-level — border-radius: 6px
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .form-row input,
.form-row select,
.form-row textarea — border-radius: 6px
  - .talent-search — border-radius: 6px

### radius — 4px
Audit count/files: 34 / 17

- src/App.css
  - .error-banner button — border-radius: 4px
  - .coming-soon-badge — border-radius: 4px
  - .beta-badge — border-radius: 4px
- src/components/AvatarUpload.css
  - .avatar-upload-error — border-radius: 4px
- src/components/BuildList.css
  - .party-member-level — border-radius: 4px
  - .party-member-menu-btn — border-radius: 4px
- src/components/GameLibrary.css
  - .coming-soon-badge,
.beta-badge — border-radius: 4px
  - .version-badge — border-radius: 4px
- src/components/HeaderGameSelector.css
  - .header-game-icon — border-radius: 4px
  - .header-game-item-icon — border-radius: 4px
- src/components/InfoModal.css
  - .changelog-version — border-radius: 4px
  - .roadmap-section-title — border-radius: 4px
- src/components/PartyBar.css
  - .party-level — border-radius: 4px
  - .party-avatar-expand — border-radius: 4px
- src/components/ProfileSelector.css
  - .profile-edit input — border-radius: 4px
  - .profile-edit button — border-radius: 4px
  - .profile-create-form input — border-radius: 4px
  - .profile-create-form button — border-radius: 4px
- src/components/SearchBar.css
  - .result-type — border-radius: 4px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .difficulty-badge — border-radius: 4px
  - .build-selector.bg3 .companion-card-tag — border-radius: 4px
  - .build-selector.bg3 .build-card-tracked-badge — border-radius: 4px
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-level-badge — border-radius: 4px
  - .build-selector-modal-overlay.bg3 .build-card-tag — border-radius: 4px
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger — border-radius: 4px
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype — border-radius: 4px
  - .companion-tag — border-radius: 4px
  - .build-card-tracked-badge — border-radius: 4px
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-badge — border-radius: 4px
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier — border-radius: 4px
  - .tier-completed-badge — border-radius: 4px
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .selected-talent — border-radius: 4px
  - .talent-option — border-radius: 4px
- src/index.css
  - ::-webkit-scrollbar-thumb — border-radius: 4px

### radius — 12px
Audit count/files: 20 / 14

- src/App.css
  - .game-card — border-radius: 12px
- src/components/BuildList.css
  - .party-member-card — border-radius: 12px
- src/components/DataAuditView.css
  - .data-audit-list-item — border-radius: 12px
  - .data-audit-detail-json pre — border-radius: 12px
- src/components/ImageLightbox.css
  - .lightbox-image — border-radius: 12px
- src/components/MobileMenu.css
  - .mobile-menu-panel — border-radius: 12px (risk: media-query)
- src/components/PartyBar.css
  - .party-bar-content — border-radius: 12px
- src/components/TooltipCard.css
  - .crpg-tooltip-card — border-radius: 12px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-list .build-card — border-radius: 12px
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-card — border-radius: 12px
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .stats-section — border-radius: 12px
  - .level-confirm-dialog — border-radius: 12px
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-controls — border-radius: 12px
  - .companion-build-card — border-radius: 12px
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector-controls — border-radius: 12px
  - .build-card — border-radius: 12px
  - .coming-soon — border-radius: 12px
- src/games/rogue-trader/components/BuildViewer.css
  - .level-confirm-dialog — border-radius: 12px
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-detail-controls — border-radius: 12px
  - .companion-build-card — border-radius: 12px

### radius — 10px
Audit count/files: 18 / 8

- src/App.css
  - .game-card::before — border-radius: 10px
- src/components/DataAuditView.css
  - .data-audit-controls input,
.data-audit-controls select — border-radius: 10px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-portrait — border-radius: 10px
  - .build-selector.bg3 .unselected-build-preview — border-radius: 10px
  - .build-selector.bg3 .companion-card-footer — border-radius: 10px
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn — border-radius: 10px
  - .build-avatar — border-radius: 10px
  - .level-row — border-radius: 10px
  - .ability-score — border-radius: 10px
  - .gear-slot — border-radius: 10px
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .back-button — border-radius: 10px
  - .companion-detail-screen .companion-card-portrait — border-radius: 10px
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-portrait — border-radius: 10px
  - .tracked-build-preview — border-radius: 10px
  - .unselected-build-preview — border-radius: 10px
- src/games/rogue-trader/components/BuildViewer.css
  - .gear-slot — border-radius: 10px
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .back-button — border-radius: 10px
  - .companion-summary-portrait — border-radius: 10px

### radius — 14px
Audit count/files: 8 / 6

- src/App.css
  - .view-kpis div — border-radius: 14px
- src/components/DataAuditView.css
  - .data-audit-kpis div — border-radius: 14px
  - .data-audit-row — border-radius: 14px
  - .data-audit-detail-image — border-radius: 14px
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-section — border-radius: 14px
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-section — border-radius: 14px
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-section — border-radius: 14px
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-detail-summary — border-radius: 14px

### color — color: #fff
Audit count/files: 63 / 17

- src/App.css
  - .header-nav-tab:hover — color: #fff
  - .header-nav-tab.active — color: #fff
  - .builds-subnav-tab:hover — color: #fff
  - .builds-subnav-tab.active — color: #fff
  - .header h1 — color: #fff
  - .game-card h3 — color: #fff
  - .build-info h3 — color: #fff
  - .form-section input,
.form-section select,
.form-section textarea — color: #fff
  - .btn-primary — color: #fff
  - .btn-secondary — color: #fff
  - .app-footer a:hover — color: #fff
  - .footer-landing-link:hover — color: #fff
  - .app-footer .footer-link:hover — color: #fff
- src/components/AvatarUpload.css
  - .avatar-upload-placeholder span — color: #fff
- src/components/BuildList.css
  - .party-member-name — color: #fff
- src/components/GameLibrary.css
  - .hero-tagline — color: #fff
  - .hero-cta — color: #fff
  - .landing-footer a:hover — color: #fff
  - .footer-link:hover — color: #fff
  - .picker-close:hover — color: #fff
  - .picker-modal h2 — color: #fff
  - .section-header — color: #fff
  - .game-card h3 — color: #fff
  - .coming-soon-badge,
.beta-badge — color: #fff
  - .version-badge — color: #fff
- src/components/ImageLightbox.css
  - .lightbox-close — color: #fff
- src/components/InfoModal.css
  - .info-modal-close:hover — color: #fff
  - .info-modal h2 — color: #fff
  - .changelog-title — color: #fff
  - .roadmap-item-title — color: #fff
- src/components/PartyBar.css
  - .party-edit-btn:hover — color: #fff
- src/components/ProfileSelector.css
  - .profile-create-btn — color: #fff
- src/components/TooltipSheet.css
  - .tooltip-sheet-close:hover — color: #fff1c9
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 h2 — color: #fff
  - .build-selector.bg3 .build-card-header h3 — color: #fff
  - .build-selector.bg3 .companion-card-title — color: #fff
  - .build-selector.bg3 .builds-grid .build-name — color: #fff
  - .build-selector.bg3 .tracked-build-edit-btn — color: #fff
  - .build-selector.bg3 .tracked-build-name — color: #fff
  - .build-selector.bg3 .build-card-tracked-badge — color: #fff
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-close:hover — color: #fff
  - .build-selector-modal-overlay.bg3 .build-selector-modal-header h2 — color: #fff
  - .build-selector-modal-overlay.bg3 .build-card-level-badge — color: #fff
  - .build-selector-modal-overlay.bg3 .build-card-title — color: #fff
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar-level — color: #fff
  - .build-title h2 — color: #fff
  - .class-levels — color: #fff
  - .stats-section h3 — color: #fff
  - .stat-value — color: #fff
  - .level-confirm-message strong — color: #fff
  - .level-confirm-cancel:hover — color: #fff
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-title — color: #fff
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-header:hover .companion-expand-icon — color: #fff
  - .companion-card-title — color: #fff
  - .build-name — color: #fff
  - .tracked-build-name — color: #fff
  - .build-card-tracked-badge — color: #fff
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-close:hover — color: #fff
  - .build-selector-modal-card-name — color: #fff
  - .build-selector-modal-card-badge — color: #fff
- src/games/rogue-trader/components/BuildViewer.css
  - .level-confirm-message strong — color: #fff
  - .level-confirm-cancel:hover — color: #fff
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-title — color: #fff
- src/index.css
  - h1, h2, h3, h4, h5, h6 — color: #fff

### color — color: #888
Audit count/files: 35 / 11

- src/App.css
  - .back-btn — color: #888
  - .current-game — color: #888
  - .game-selector .subtitle — color: #888
  - .game-card p — color: #888
  - .build-list-empty — color: #888
  - .build-info p — color: #888
  - .form-section .helper-text — color: #888
- src/components/AvatarUpload.css
  - .avatar-upload-placeholder — color: #888
- src/components/BuildList.css
  - .build-list-empty — color: #888
  - .party-member-path — color: #888
- src/components/MobileMenu.css
  - .mobile-menu-section h3 — color: #888
- src/components/PartyBar.css
  - .party-avatar-fallback — color: #888
  - .party-edit-btn — color: #888
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-tag — color: #888
  - .build-selector.bg3 .builds-grid .build-desc — color: #888
  - .build-selector.bg3 .tracked-build-change-btn — color: #888
  - .build-selector.bg3 .tracked-build-level — color: #888
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-close — color: #888
  - .build-selector-modal-overlay.bg3 .build-card-race — color: #888
  - .build-selector-modal-overlay.bg3 .build-card-tag — color: #888
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .traits strong, .skills strong — color: #888
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .subtitle — color: #888
  - .companion-expand-icon — color: #888
  - .no-builds — color: #888
  - .coming-soon h3 — color: #888
  - .companion-tag — color: #888
  - .tracked-build-level — color: #888
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-close — color: #888
  - .build-selector-modal-role — color: #888
  - .build-selector-modal-builds h3 — color: #888
  - .build-selector-modal-card-desc — color: #888
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .progression-editor .hint — color: #888
  - .level-number — color: #888
  - .talent-source — color: #888
  - .more-talents — color: #888

### color — background: rgba(18, 20, 36, 0.75)
Audit count/files: 30 / 6

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-list .build-card — background: rgba(18, 20, 36, 0.75)
  - .build-selector.bg3 .unselected-build-preview — background: rgba(18, 20, 36, 0.75)
  - .build-selector.bg3 .companion-card-footer — background: rgba(18, 20, 36, 0.75)
  - .build-selector.bg3 .companion-section.has-tracked .companion-card-footer — background: rgba(18, 20, 36, 0.75)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn — background: rgba(18, 20, 36, 0.75)
  - .tab:hover — background: rgba(18, 20, 36, 0.75)
  - .level-row — background: rgba(18, 20, 36, 0.75)
  - .stat-change-item — background: rgba(18, 20, 36, 0.75)
  - .stats-section — background: rgba(18, 20, 36, 0.75)
  - .gear-slot — background: rgba(18, 20, 36, 0.75)
  - .gear-item-icon — background: rgba(18, 20, 36, 0.75)
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .back-button — background: rgba(18, 20, 36, 0.75)
  - .companion-detail-controls — background: rgba(18, 20, 36, 0.75)
  - .filter-tag — background: rgba(18, 20, 36, 0.75)
  - .sort-option — background: rgba(18, 20, 36, 0.75)
  - .companion-build-card — background: rgba(18, 20, 36, 0.75)
  - .build-card-gear-icon — background: rgba(18, 20, 36, 0.75)
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector-controls — background: rgba(18, 20, 36, 0.75)
  - .filter-tag — background: rgba(18, 20, 36, 0.75)
  - .build-card — background: rgba(18, 20, 36, 0.75)
  - .tracked-build-preview — background: rgba(18, 20, 36, 0.75)
  - .unselected-build-preview — background: rgba(18, 20, 36, 0.75)
  - .build-card.tracked — background: rgba(18, 20, 36, 0.75)
- src/games/rogue-trader/components/BuildViewer.css
  - .tab:hover — background: rgba(18, 20, 36, 0.75)
  - .level-row — background: rgba(18, 20, 36, 0.75)
  - .gear-slot — background: rgba(18, 20, 36, 0.75)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .back-button — background: rgba(18, 20, 36, 0.75)
  - .companion-detail-controls — background: rgba(18, 20, 36, 0.75)
  - .filter-tag — background: rgba(18, 20, 36, 0.75)
  - .companion-build-card — background: rgba(18, 20, 36, 0.75)

### color — color: #e0e0e0
Audit count/files: 26 / 8

- src/App.css
  - .header-nav-tab — color: #e0e0e0
  - .builds-subnav-tab — color: #e0e0e0
- src/components/HeaderGameSelector.css
  - .header-game-toggle — color: #e0e0e0
  - .header-game-item — color: #e0e0e0
- src/components/MobileMenu.css
  - .mobile-menu-toggle — color: #e0e0e0
  - .mobile-menu-close — color: #e0e0e0 (risk: media-query)
  - .game-select-btn — color: #e0e0e0
- src/components/ProfileSelector.css
  - .profile-selector-toggle — color: #e0e0e0
  - .profile-action-btn-large — color: #e0e0e0
  - .profile-edit-large input — color: #e0e0e0
  - .profile-edit-buttons button — color: #e0e0e0
  - .profile-select-btn — color: #e0e0e0
  - .profile-edit input — color: #e0e0e0
  - .profile-edit button — color: #e0e0e0
  - .profile-create-form input — color: #e0e0e0
  - .profile-create-form button — color: #e0e0e0
- src/components/SearchBar.css
  - .search-input — color: #e0e0e0
  - .search-clear:hover — color: #e0e0e0
  - .search-result-item — color: #e0e0e0
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .tracked-build-change-btn:hover — color: #e0e0e0
  - .build-selector.bg3 .tracked-build-edit-btn — color: #e0e0e0
- src/games/rogue-trader/components/BuildSelector.css
  - .tracked-build-change-btn:hover — color: #e0e0e0
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .form-row input,
.form-row select,
.form-row textarea — color: #e0e0e0
  - .progression-editor h3 — color: #e0e0e0
  - .talent-search — color: #e0e0e0
  - .talent-name — color: #e0e0e0

### color — background: #1a1a2e
Audit count/files: 25 / 13

- src/App.css
  - .game-card — background: #1a1a2e
  - .import-export-toolbar — background: #1a1a2e
  - .build-list-empty — background: #1a1a2e
  - .build-card — background: #1a1a2e
  - .form-section input,
.form-section select,
.form-section textarea — background: #1a1a2e
- src/components/AvatarUpload.css
  - .avatar-upload-placeholder:hover — background: #1a1a2e
- src/components/BuildList.css
  - .build-list-empty — background: #1a1a2e
  - .party-member-card — background: #1a1a2e
  - .party-member-avatar .avatar-placeholder — background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%) (risk: gradient)
- src/components/HeaderGameSelector.css
  - .header-game-dropdown — background: #1a1a2e
- src/components/MobileMenu.css
  - .mobile-menu-panel — background: #1a1a2e (risk: media-query)
  - .mobile-menu-panel — background: #1a1a2e (risk: media-query)
- src/components/PartyBar.css
  - .party-bar-content — background: #1a1a2e
  - .party-avatar-fallback — background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%) (risk: gradient)
- src/components/ProfileSelector.css
  - .profile-dropdown — background: #1a1a2e
  - .profile-edit-large input — background: #1a1a2e
  - .profile-switch-section — background: #1a1a2e
- src/components/SearchBar.css
  - .search-results — background: #1a1a2e
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal — background: #1a1a2e
- src/games/rogue-trader/components/BuildSelector.css
  - .coming-soon — background: #1a1a2e
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal — background: #1a1a2e
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .editor-form — background: #1a1a2e
  - .level-row — background: #1a1a2e
  - .talent-picker — background: #1a1a2e
- src/index.css
  - ::-webkit-scrollbar-track — background: #1a1a2e

### color — color: #9aa3c2
Audit count/files: 24 / 6

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-meta .race — color: #9aa3c2
  - .build-selector.bg3 .companion-card-race — color: #9aa3c2
  - .build-selector.bg3 .unselected-build-count — color: #9aa3c2
  - .build-selector.bg3 .tracked-label — color: #9aa3c2
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-meta .race — color: #9aa3c2
  - .level-label — color: #9aa3c2
  - .tab — color: #9aa3c2
  - .level-number — color: #9aa3c2
  - .feat-label — color: #9aa3c2
  - .spells-label — color: #9aa3c2
  - .level-notes — color: #9aa3c2
  - .stat-change-name — color: #9aa3c2
  - .stat-name — color: #9aa3c2
  - .slot-notes — color: #9aa3c2
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-race — color: #9aa3c2
  - .filter-label,
.sort-label — color: #9aa3c2
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-label — color: #9aa3c2
  - .companion-card-origin — color: #9aa3c2
  - .unselected-build-count — color: #9aa3c2
- src/games/rogue-trader/components/BuildViewer.css
  - .level-label — color: #9aa3c2
  - .tab — color: #9aa3c2
  - .level-number — color: #9aa3c2
  - .level-notes — color: #9aa3c2
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-label — color: #9aa3c2

### color — color: #b7bdd6
Audit count/files: 22 / 6

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-description — color: #b7bdd6
  - .build-selector.bg3 .companion-card-desc — color: #b7bdd6
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn — color: #b7bdd6
  - .build-description — color: #b7bdd6
  - .stats-section p — color: #b7bdd6
  - .gear-intro — color: #b7bdd6
  - .level-confirm-message — color: #b7bdd6
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .back-button — color: #b7bdd6
  - .companion-detail-screen .companion-card-desc — color: #b7bdd6
  - .companion-detail-screen .companion-card-quote — color: #b7bdd6
  - .filter-tag — color: #b7bdd6
  - .sort-option — color: #b7bdd6
  - .build-card-desc — color: #b7bdd6
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-tag — color: #b7bdd6
  - .companion-card-desc — color: #b7bdd6
  - .build-desc — color: #b7bdd6
- src/games/rogue-trader/components/BuildViewer.css
  - .build-description — color: #b7bdd6
  - .level-confirm-message — color: #b7bdd6
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .back-button — color: #b7bdd6
  - .companion-summary-desc — color: #b7bdd6
  - .filter-tag — color: #b7bdd6
  - .build-card-desc — color: #b7bdd6

### color — color: #b8b0ff
Audit count/files: 19 / 6

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-level-badge — color: #b8b0ff
  - .build-selector.bg3 .unselected-badge — color: #b8b0ff
  - .build-selector.bg3 .unselected-build-action — color: #b8b0ff
  - .build-selector.bg3 .companion-card-action — color: #b8b0ff
  - .build-selector.bg3 .companion-section.has-tracked .companion-card-action — color: #b8b0ff
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-display — color: #b8b0ff
  - .spells-learned — color: #b8b0ff
  - .stat-change-mod — color: #b8b0ff
  - .stat-modifier — color: #b8b0ff
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .clear-filters — color: #b8b0ff
  - .build-card-tag.difficulty.advanced — color: #b8b0ff
  - .build-source-link — color: #b8b0ff
- src/games/rogue-trader/components/BuildSelector.css
  - .clear-filters — color: #b8b0ff
  - .unselected-badge — color: #b8b0ff
  - .unselected-build-action — color: #b8b0ff
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-level — color: #b8b0ff
  - .level-display — color: #b8b0ff
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .clear-filters — color: #b8b0ff
  - .build-source-link — color: #b8b0ff

### color — background: #2a2a3e
Audit count/files: 17 / 6

- src/App.css
  - .back-btn:hover — background: #2a2a3e
- src/components/HeaderGameSelector.css
  - .header-game-toggle — background: #2a2a3e
- src/components/MobileMenu.css
  - .mobile-menu-toggle:hover,
.mobile-menu-toggle:active — background: #2a2a3e
  - .mobile-menu-close:hover,
  .mobile-menu-close:active — background: #2a2a3e (risk: media-query)
  - .game-select-btn — background: #2a2a3e
  - .mobile-menu-section .profile-current — background: #2a2a3e
  - .mobile-menu-section .profile-select-btn — background: #2a2a3e
- src/components/ProfileSelector.css
  - .profile-selector-toggle — background: #2a2a3e
  - .profile-edit input — background: #2a2a3e
  - .profile-create-form input — background: #2a2a3e
  - .profile-create-btn — background: #2a2a3e
  - .profile-create-btn:hover — background: #2a2a3e
- src/components/SearchBar.css
  - .search-input-wrapper — background: #2a2a3e
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .form-row input,
.form-row select,
.form-row textarea — background: #2a2a3e
  - .level-row:hover — background: #2a2a3e
  - .talent-search — background: #2a2a3e
  - .talent-option — background: #2a2a3e

### color — background: #2a2a4a
Audit count/files: 17 / 9

- src/components/AvatarUpload.css
  - .avatar-upload-placeholder — background: #2a2a4a
- src/components/BuildList.css
  - .party-member-avatar — background: #2a2a4a
  - .party-member-avatar .avatar-placeholder — background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%) (risk: gradient)
  - .progress-bar — background: #2a2a4a
  - .party-member-dropdown — background: #2a2a4a
- src/components/PartyBar.css
  - .party-member — background: #2a2a4a
  - .party-avatar-fallback — background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%) (risk: gradient)
  - .party-edit-btn — background: #2a2a4a
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-portrait — background: #2a2a4a
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-avatar — background: #2a2a4a
  - .ability-score — background: #2a2a4a
  - .level-confirm-cancel:hover — background: #2a2a4a
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-portrait — background: #2a2a4a
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-portrait — background: #2a2a4a
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar — background: #2a2a4a
  - .level-confirm-cancel:hover — background: #2a2a4a
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-portrait — background: #2a2a4a

### color — color: #e5e9ff
Audit count/files: 16 / 5

- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn:hover — color: #e5e9ff
  - .tab:hover — color: #e5e9ff
  - .tab.active — color: #e5e9ff
  - .level-confirm-ok — color: #e5e9ff
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .back-button:hover — color: #e5e9ff
  - .filter-tag.active — color: #e5e9ff
  - .sort-option.active — color: #e5e9ff
  - .build-card-title — color: #e5e9ff
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-tag.active — color: #e5e9ff
  - .tracked-build-edit-btn — color: #e5e9ff
- src/games/rogue-trader/components/BuildViewer.css
  - .tab:hover — color: #e5e9ff
  - .tab.active — color: #e5e9ff
  - .level-confirm-ok — color: #e5e9ff
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .back-button:hover — color: #e5e9ff
  - .filter-tag.active — color: #e5e9ff
  - .build-card-title — color: #e5e9ff

### color — background: #3a3a5a
Audit count/files: 15 / 10

- src/components/BuildList.css
  - .dropdown-item:hover — background: #3a3a5a
- src/components/PartyBar.css
  - .party-edit-btn:hover — background: #3a3a5a
- src/components/ProfileSelector.css
  - .profile-action-btn-large — background: #3a3a5a
  - .profile-edit-buttons button — background: #3a3a5a
  - .profile-edit button — background: #3a3a5a
  - .profile-create-form button — background: #3a3a5a
- src/components/SearchBar.css
  - .result-type — background: #3a3a5a
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-tag — background: #3a3a5a
  - .build-selector.bg3 .tracked-build-change-btn:hover — background: #3a3a5a
  - .build-selector.bg3 .tracked-build-edit-btn — background: #3a3a5a
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-tag — background: #3a3a5a
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-confirm-ok:hover — background: #3a3a5a
- src/games/rogue-trader/components/BuildSelector.css
  - .tracked-build-change-btn:hover — background: #3a3a5a
- src/games/rogue-trader/components/BuildViewer.css
  - .level-confirm-ok:hover — background: #3a3a5a
- src/index.css
  - ::-webkit-scrollbar-thumb — background: #3a3a5a

### color — border-color: rgba(139, 92, 246, 0.6)
Audit count/files: 15 / 6

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .unselected-build-preview:hover — border-color: rgba(139, 92, 246, 0.6)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-viewer-back-btn:hover — border-color: rgba(139, 92, 246, 0.6)
  - .level-row.current — border-color: rgba(139, 92, 246, 0.6)
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .back-button:hover — border-color: rgba(139, 92, 246, 0.6)
  - .filter-tag:hover — border-color: rgba(139, 92, 246, 0.6)
  - .filter-tag.active — border-color: rgba(139, 92, 246, 0.6)
  - .sort-option:hover — border-color: rgba(139, 92, 246, 0.6)
  - .sort-option.active — border-color: rgba(139, 92, 246, 0.6)
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-tag:hover — border-color: rgba(139, 92, 246, 0.6)
  - .filter-tag.active — border-color: rgba(139, 92, 246, 0.6)
  - .unselected-build-preview:hover — border-color: rgba(139, 92, 246, 0.6)
- src/games/rogue-trader/components/BuildViewer.css
  - .level-row.current — border-color: rgba(139, 92, 246, 0.6)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .back-button:hover — border-color: rgba(139, 92, 246, 0.6)
  - .filter-tag:hover — border-color: rgba(139, 92, 246, 0.6)
  - .filter-tag.active — border-color: rgba(139, 92, 246, 0.6)

### color — color: #666
Audit count/files: 12 / 8

- src/App.css
  - .storage-notice — color: #666
  - .build-date — color: #666
- src/components/BuildList.css
  - .party-member-avatar .avatar-placeholder — color: #666
  - .progress-label — color: #666
  - .party-member-menu-btn — color: #666
- src/components/PartyBar.css
  - .party-label — color: #666
- src/components/ProfileSelector.css
  - .privacy-notice — color: #666
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-credit — color: #666
- src/games/rogue-trader/components/BuildSelector.css
  - .build-selector .build-credit — color: #666
  - .coming-soon p — color: #666
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .arrow — color: #666
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .no-talents — color: #666

### color — color: var(--audit-muted)
Audit count/files: 12 / 1

- src/components/DataAuditView.css
  - .data-audit-subtitle — color: var(--audit-muted)
  - .data-audit-kpis span — color: var(--audit-muted)
  - .data-audit-panel h2 — color: var(--audit-muted)
  - .data-audit-list-item em — color: var(--audit-muted)
  - .data-audit-coverage-row — color: var(--audit-muted)
  - .data-audit-controls label — color: var(--audit-muted)
  - .data-audit-meta — color: var(--audit-muted)
  - .data-audit-row-title em — color: var(--audit-muted)
  - .data-audit-row-meta — color: var(--audit-muted)
  - .data-audit-detail-header span — color: var(--audit-muted)
  - .data-audit-detail-fields strong — color: var(--audit-muted)
  - .data-audit-detail-json h3 — color: var(--audit-muted)

### color — border-color: #8b5cf6
Audit count/files: 11 / 8

- src/components/AvatarUpload.css
  - .avatar-upload-placeholder:hover — border-color: #8b5cf6
- src/components/BuildList.css
  - .party-member-card:hover — border-color: #8b5cf6
- src/components/PartyBar.css
  - .party-member.active — border-color: #8b5cf6
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-list .build-card:hover — border-color: #8b5cf6
  - .build-selector.bg3 .companion-section:hover — border-color: #8b5cf6
  - .build-selector.bg3 .builds-grid .build-card:hover — border-color: #8b5cf6
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-selector-modal-card:hover — border-color: #8b5cf6
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-build-card:hover — border-color: #8b5cf6
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-section:hover — border-color: #8b5cf6
  - .build-card:hover — border-color: #8b5cf6
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-build-card:hover — border-color: #8b5cf6

### color — color: #f0c040
Audit count/files: 10 / 6

- src/App.css
  - .view-eyebrow — color: #f0c040
  - .app.game-baldurs-gate-3 .view-eyebrow — color: #f0c040
  - .back-btn:hover — color: #f0c040
- src/components/ProfileSelector.css
  - .profile-current-name — color: #f0c040
  - .profile-select-btn:hover — color: #f0c040
  - .profile-create-btn:hover — color: #f0c040
- src/components/TooltipSheet.css
  - .tooltip-sheet-title — color: #f0c040
- src/games/rogue-trader/components/BuildSelector.css
  - .custom-build-card .build-name — color: #f0c040
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card.custom .build-selector-modal-card-name — color: #f0c040
- src/games/rogue-trader/components/CustomBuildEditor.css
  - .editor-header h2 — color: #f0c040

### color — background: rgba(26, 26, 46, 0.9)
Audit count/files: 10 / 5

- src/App.css
  - .game-card::before — background: linear-gradient(to bottom, rgba(26, 26, 46, 0.7), rgba(26, 26, 46, 0.9)) (risk: gradient)
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-list .build-card:hover — background: rgba(26, 26, 46, 0.9)
  - .build-selector.bg3 .companion-section — background: rgba(26, 26, 46, 0.9)
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-section — background: rgba(26, 26, 46, 0.9)
  - .companion-build-card:hover — background: rgba(26, 26, 46, 0.9)
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-section — background: rgba(26, 26, 46, 0.9)
  - .build-card:hover — background: rgba(26, 26, 46, 0.9)
  - .build-card.tracked:hover — background: rgba(26, 26, 46, 0.9)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-detail-summary — background: rgba(26, 26, 46, 0.9)
  - .companion-build-card:hover — background: rgba(26, 26, 46, 0.9)

### color — background: rgba(139, 92, 246, 0.2)
Audit count/files: 10 / 6

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-level-badge — background: rgba(139, 92, 246, 0.2)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-display — background: rgba(139, 92, 246, 0.2)
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .filter-tag.active — background: rgba(139, 92, 246, 0.2)
  - .sort-option.active — background: rgba(139, 92, 246, 0.2)
  - .build-card-tag.difficulty.advanced — background: rgba(139, 92, 246, 0.2)
- src/games/rogue-trader/components/BuildSelector.css
  - .filter-tag.active — background: rgba(139, 92, 246, 0.2)
- src/games/rogue-trader/components/BuildViewer.css
  - .build-avatar-level — background: rgba(139, 92, 246, 0.2)
  - .level-display — background: rgba(139, 92, 246, 0.2)
  - .gear-item:hover — background: rgba(139, 92, 246, 0.2)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .filter-tag.active — background: rgba(139, 92, 246, 0.2)

### color — background: #4a3d2d
Audit count/files: 8 / 5

- src/App.css
  - .build-archetype-path .archetype.advanced — background: #4a3d2d
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger.tier-advanced — background: #4a3d2d
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype.advanced — background: #4a3d2d
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype.advanced — background: #4a3d2d
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier.advanced — background: #4a3d2d
  - .tier-accordion.advanced — background: #4a3d2d
  - .tier-accordion-header.advanced — background: #4a3d2d
  - .gear-item.primary — background: #4a3d2d

### color — color: #555
Audit count/files: 8 / 7

- src/App.css
  - .build-archetype-path .arrow — color: #555
- src/components/BuildList.css
  - .party-member-path .arrow — color: #555
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .companion-card-separator — color: #555
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-separator — color: #555
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-separator — color: #555
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-separator — color: #555
  - .build-path .arrow — color: #555
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .arrow — color: #555

### color — background: rgba(139, 92, 246, 0.15)
Audit count/files: 8 / 6

- src/components/BuildList.css
  - .party-member-level — background: rgba(139, 92, 246, 0.15)
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .unselected-badge — background: rgba(139, 92, 246, 0.15)
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .level-row.current — background: rgba(139, 92, 246, 0.15)
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-level-badge — background: rgba(139, 92, 246, 0.15)
  - .unselected-badge — background: rgba(139, 92, 246, 0.15)
- src/games/rogue-trader/components/BuildViewer.css
  - .level-row.current — background: rgba(139, 92, 246, 0.15)
  - .talent — background: rgba(139, 92, 246, 0.15)
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .build-card-level — background: rgba(139, 92, 246, 0.15)

### color — color: #98a0c3
Audit count/files: 8 / 5

- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .build-card-meta — color: #98a0c3
  - .build-selector.bg3 .companion-card-meta — color: #98a0c3
- src/games/baldurs-gate-3/components/BuildViewer.css
  - .build-meta — color: #98a0c3
- src/games/baldurs-gate-3/components/CompanionDetailScreen.css
  - .companion-detail-screen .companion-card-meta — color: #98a0c3
  - .build-card-meta — color: #98a0c3
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-meta — color: #98a0c3
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .companion-summary-meta — color: #98a0c3
  - .build-card-meta — color: #98a0c3

### color — color: #90ee90
Audit count/files: 7 / 5

- src/App.css
  - .build-archetype-path .archetype.base — color: #90ee90
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger.tier-base — color: #90ee90
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype.base — color: #90ee90
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype.base — color: #90ee90
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier.base — color: #90ee90
  - .tier-accordion-header.base — color: #90ee90
  - .stat-increase — color: #90ee90

### color — background: #2d4a2d
Audit count/files: 7 / 5

- src/App.css
  - .build-archetype-path .archetype.base — background: #2d4a2d
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger.tier-base — background: #2d4a2d
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype.base — background: #2d4a2d
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype.base — background: #2d4a2d
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier.base — background: #2d4a2d
  - .tier-accordion.base — background: #2d4a2d
  - .tier-accordion-header.base — background: #2d4a2d

### color — color: #ffd700
Audit count/files: 7 / 5

- src/App.css
  - .build-archetype-path .archetype.advanced — color: #ffd700
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger.tier-advanced — color: #ffd700
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype.advanced — color: #ffd700
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype.advanced — color: #ffd700
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier.advanced — color: #ffd700
  - .tier-accordion-header.advanced — color: #ffd700
  - .gear-item.primary — color: #ffd700

### color — background: #4a2d4a
Audit count/files: 7 / 5

- src/App.css
  - .build-archetype-path .archetype.exemplar — background: #4a2d4a
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger.tier-exemplar — background: #4a2d4a
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype.exemplar — background: #4a2d4a
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype.exemplar — background: #4a2d4a
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier.exemplar — background: #4a2d4a
  - .tier-accordion.exemplar — background: #4a2d4a
  - .tier-accordion-header.exemplar — background: #4a2d4a

### color — background: #4a7c4a
Audit count/files: 7 / 5

- src/components/ProfileSelector.css
  - .profile-edit-buttons button.save — background: #4a7c4a
  - .profile-create-form button:first-of-type — background: #4a7c4a
- src/games/baldurs-gate-3/components/BuildSelector.css
  - .build-selector.bg3 .tracked-build-edit-btn — background: #4a7c4a
  - .build-selector.bg3 .build-card-tracked-badge — background: #4a7c4a
- src/games/baldurs-gate-3/components/BuildSelectorModal.css
  - .build-selector-modal-overlay.bg3 .build-card-level-badge — background: #4a7c4a
- src/games/rogue-trader/components/BuildSelector.css
  - .build-card-tracked-badge — background: #4a7c4a
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-badge — background: #4a7c4a

### color — color: #da70d6
Audit count/files: 6 / 5

- src/App.css
  - .build-archetype-path .archetype.exemplar — color: #da70d6
- src/games/rogue-trader/components/ArchetypeTooltip.css
  - .archetype-tooltip-trigger.tier-exemplar — color: #da70d6
- src/games/rogue-trader/components/BuildSelector.css
  - .build-path .archetype.exemplar — color: #da70d6
- src/games/rogue-trader/components/BuildSelectorModal.css
  - .build-selector-modal-card-path .archetype.exemplar — color: #da70d6
- src/games/rogue-trader/components/BuildViewer.css
  - .archetype-path .tier.exemplar — color: #da70d6
  - .tier-accordion-header.exemplar — color: #da70d6

### color — color: #8b5cf6
Audit count/files: 6 / 6

- src/components/AvatarUpload.css
  - .avatar-upload-placeholder:hover — color: #8b5cf6
- src/components/BuildList.css
  - .party-member-level — color: #8b5cf6
- src/components/PartyBar.css
  - .party-level — color: #8b5cf6
- src/games/baldurs-gate-3/components/GearTooltip.css
  - .gear-trigger.has-info — color: #8b5cf6
- src/games/rogue-trader/components/BuildSelector.css
  - .companion-card-level-badge — color: #8b5cf6
- src/games/rogue-trader/components/CompanionDetailScreen.css
  - .build-card-level — color: #8b5cf6