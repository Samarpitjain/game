# Phase 4: Standardize Fairness System

## Problem Analysis
- Simple games use seed-based RNG properly
- Session games may not integrate with fairness system
- Multiplayer games use separate RNG systems
- Fairness verification may not work for all game types

## Fairness System Requirements
All games should:
1. Use same seed pair system
2. Allow seed verification
3. Support seed rotation
4. Provide verifiable results

## Implementation Plan

### Session Games Integration (2 hours)
1. Ensure session games use SeedManager
2. Update session APIs to include seed data
3. Make session results verifiable

### Multiplayer Games Integration (1 hour)
1. Document why multiplayer games use different RNG
2. Ensure server seeds are still verifiable
3. Update fairness modal to explain multiplayer differences

## Files to Update
- Session game APIs (mines.ts, tower.ts, stairs.ts, hilo.ts, blackjack.ts)
- Multiplayer WebSocket handlers (crash.ts, trenball.ts)
- FairnessModal.tsx to handle different game types

## Expected Result
All games have consistent, verifiable fairness system