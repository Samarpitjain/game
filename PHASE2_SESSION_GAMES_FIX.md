# Phase 2: Fix Session-Based Games AutoBet Integration

## Problem Analysis
Session games use custom APIs:
- `minesAPI.start()` → `minesAPI.reveal()` → `minesAPI.cashout()`
- `towerAPI.start()` → `towerAPI.reveal()` → `towerAPI.cashout()`
- `blackjackAPI.start()` → `blackjackAPI.hit()` → `blackjackAPI.stand()`

These don't integrate with standard `betAPI.place()` used by AutoBet system.

## Fix Strategy Options

### Option A: Modify AutoBet Service (Recommended)
1. Create session-aware AutoBet logic
2. Handle different game types in AutoBet worker
3. Integrate session APIs with AutoBet system

### Option B: Disable AutoBet for Session Games
1. Remove AutoBet UI from session games
2. Show "AutoBet not available for this game type"
3. Keep only manual betting

### Option C: Refactor Session Games
1. Make session games work with standard bet engine
2. Move session logic to game engines
3. Use standard betting flow

## Recommended Approach: Option A
- Least disruptive to existing functionality
- Maintains user expectation of AutoBet everywhere
- Preserves session game complexity

## Implementation Plan
1. Modify AutoBetService to detect session games
2. Create session-specific AutoBet handlers
3. Update frontend to handle session AutoBet responses
4. Test with Mines game first

## Files to Update
- `apps/backend/src/services/autobet-service.ts`
- `apps/backend/src/routes/mines.ts` (and other session routes)
- Session game pages to handle AutoBet properly

## Expected Result
AutoBet works for session games with proper session management