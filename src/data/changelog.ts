// Changelog data
export const CHANGELOG = [
  {
    version: '1.0.0',
    date: '2026-01-31',
    title: 'Rogue Trader 1.0 Release',
    changes: [
      'Rogue Trader support is now out of beta',
      'Added game versioning system',
      'Added changelog and roadmap accessible from footer',
      'Improved party member card UI with overflow menu',
      'Fixed mobile CTA button styling',
      'Level badge now only shows for tracked builds',
    ],
  },
  {
    version: '0.9.0',
    date: '2026-01-27',
    title: 'BG3 Beta Launch',
    changes: [
      "Added Baldur's Gate 3 support (beta)",
      'Comprehensive gear tooltips with item stats',
      'Spell and ability keyword highlighting',
      'Custom avatar upload for player characters',
    ],
  },
  {
    version: '0.8.0',
    date: '2026-01-15',
    title: 'Build Tracking & Party Management',
    changes: [
      'Track multiple builds across your party',
      'Level progression tracking with visual indicators',
      'Party bar for quick character switching',
      'Import/export party configurations',
    ],
  },
];

// Roadmap data
export const ROADMAP = [
  {
    status: 'in-progress' as const,
    title: "Baldur's Gate 3 Full Release",
    description: 'Complete all companion builds and gear recommendations',
  },
  {
    status: 'planned' as const,
    title: 'Divinity: Original Sin 2',
    description: 'Full support for DOS2 builds, skills, and party compositions',
  },
  {
    status: 'planned' as const,
    title: 'Disco Elysium',
    description: 'Skill tracking and thought cabinet management',
  },
  {
    status: 'planned' as const,
    title: 'Custom Build Creator',
    description: 'Create and share your own builds with the community',
  },
  {
    status: 'considering' as const,
    title: 'Cloud Sync',
    description: 'Sync your tracked builds across devices',
  },
  {
    status: 'considering' as const,
    title: 'Build Sharing',
    description: 'Share builds via links or export codes',
  },
];
