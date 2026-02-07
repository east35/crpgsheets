# Building cRPG Sheets: A Love Letter to Character Build Tracking

## The Problem

If you've ever tried to follow a character build guide for a complex cRPG like Warhammer 40K: Rogue Trader or Baldur's Gate 3, you know the pain. Build information is scattered everywhere—buried in hour-long YouTube videos, lost in Reddit threads, or locked in sprawling Google Sheets that require a second monitor just to reference.

And even when you find a great build, actually *tracking* it during gameplay is another challenge entirely. Alt-tabbing to a spreadsheet every level-up breaks immersion. Scrubbing through a video to find "what do I pick at level 23?" is tedious. I wanted something better.

I wanted a tool that would let me:

1. **Discover** optimized builds from the community
2. **Track** my progress through those builds during actual gameplay sessions
3. **Manage** multiple characters across different playthroughs

So I built cRPG Sheets.

## What It Does

cRPG Sheets is a companion app for managing character builds in complex RPGs. Think of it as a digital character sheet that knows your build path.

**For each character, you can:**

- Follow level-by-level progression guides (talents, abilities, feats)
- Track your current level and see exactly what to pick next
- View gear recommendations organized by slot
- Save multiple builds across different playthroughs

**At the party level:**

- Create separate profiles for each playthrough
- Manage your full party roster with a visual party bar
- Export/import profiles to share or backup your data

Currently it supports **Rogue Trader** (full support for all 16 companions across 55 levels) and **Baldur's Gate 3** (beta, with 10 companion builds).

## Technical Decisions

A few architectural choices I'm happy with:

**Offline-first, privacy-respecting**: All data lives in your browser via IndexedDB. No accounts, no servers, no tracking. Your build data never leaves your device unless you explicitly export it.

**Game-agnostic architecture**: Each game is a self-contained module with its own types, components, and data. Adding support for a new game means creating a new folder and registering it—the core app doesn't care about game-specific details like "archetypes" vs "subclasses."

**Minimal stored state**: Builds in the database only store a guide reference and your current level. The actual guide data (55 levels of talent choices) stays in static JSON files. This keeps the database lean and makes updates easy.

**Security by default**: Import validation sanitizes URLs, enforces file size limits, and strips unexpected fields. Users share profile exports, so treating imported data as untrusted was important.

## The Stack

- React 19 + TypeScript
- Dexie (IndexedDB wrapper) for persistence
- Vite for builds
- Netlify for hosting
- No backend

## What's Next

Planning to add support for Divinity: Original Sin 2 and Disco Elysium. The game-agnostic architecture should make this straightforward.

## Try It

[Link to your deployed app]

If you're deep into a Rogue Trader playthrough or planning a BG3 honour mode run, give it a shot. Your party will thank you.
