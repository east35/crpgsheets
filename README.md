# CRPG Character Manager

A web tool for managing character builds and progression in complex CRPGs.

## Supported Games

- **Warhammer 40,000: Rogue Trader** - Manage your party builds, track progression, and follow build guides

More games coming soon (Baldur's Gate 3, etc.)

## Features

- Create and manage character builds for each party member
- Import/export builds as JSON files for backup and sharing
- Track level progression and talent choices
- Reference external build guides
- Extensible architecture for adding new games

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Project Structure

```
src/
  components/       # Shared UI components
  games/           # Game-specific modules
    rogue-trader/  # Rogue Trader specific code
      components/  # RT-specific components
      data/        # Static data (companions, talents, etc.)
      types/       # RT-specific TypeScript types
  hooks/           # Custom React hooks
  types/           # Shared TypeScript types
  utils/           # Utility functions (export/import, etc.)
```

## Adding a New Game

1. Create a new folder under `src/games/your-game/`
2. Add game-specific types, data, and components
3. Register the game in `src/games/registry.ts`
4. Add a build editor component in `src/App.tsx`

## Tech Stack

- React 19
- TypeScript
- Vite
