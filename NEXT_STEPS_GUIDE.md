# Next Steps Implementation Guide

## 🎯 Quick Reference for Completing Phase-1

This guide provides step-by-step instructions for implementing the remaining Phase-1 features.

---

## 1. MINES GAME PAGE (Priority: P0)

### File to Create
`apps/frontend/src/app/game/mines/page.tsx`

### Key Features
```typescript
// State needed:
- gridSize: 16 | 25 | 36 (4x4, 5x5, 6x6)
- minesCount: number
- revealedTiles: number[]
- gameActive: boolean
- currentMultiplier: number

// API Call:
betAPI.place({
  gameType: 'MINES',
  currency: 'USD',
  amount,
  gameParams: { gridSize, minesCount, revealedTiles }
})

// UI Components:
- Grid of clickable tiles
- Mines count selector
- Grid size selector
- Cashout button (when tiles revealed)
- Current multiplier display
- Tile reveal animation
```

### Implementation Steps
1. Create directory: `mkdir apps/frontend/src/app/game/mines`
2. Copy Limbo page as template
3. Replace game logic with grid system
4. Add tile click handler
5. Add cashout functionality
6. Test with backend

---

## 2. PLINKO GAME PAGE (Priority: P0)

### File to Create
`apps/frontend/src/app/game/plinko/page.tsx`

### Key Features
```typescript
// State needed:
- rows: 8 | 10 | 12 | 14 | 16
- risk: 'LOW' | 'MEDIUM' | 'HIGH'
- ballPosition: { x, y }
- multiplierBuckets: number[]

// API Call:
betAPI.place({
  gameType: 'PLINKO',
  currency: 'USD',
  amount,
  gameParams: { rows, risk }
})

// UI Components:
- Plinko board (Canvas or CSS)
- Ball drop animation
- Multiplier buckets at bottom
- Risk level selector
- Rows selector
```

### Implementation Steps
1. Create directory: `mkdir apps/frontend/src/app/game/plinko`
2. Use Canvas API or CSS for animation
3. Implement ball physics (simple bounce)
4. Display multiplier buckets
5. Animate ball drop on bet
6. Test with backend

---

## 3. LEADERBOARD PAGE (Priority: P1)

### File to Create
`apps/frontend/src/app/leaderboard/page.tsx`

### Key Features
```typescript
// Tabs:
- Recent Bets (leaderboardAPI.allBets)
- High Rollers (leaderboardAPI.highRollers)
- Big Wins (leaderboardAPI.bigWins)
- Lucky Wins (leaderboardAPI.luckyWins)

// Table Columns:
- Rank
- Username
- Game
- Amount / Multiplier
- Payout
- Time

// Features:
- Currency filter
- Pagination
- Auto-refresh every 10s
```

### Implementation Steps
1. Create directory: `mkdir apps/frontend/src/app/leaderboard`
2. Create tab navigation
3. Fetch data from leaderboard APIs
4. Display in table format
5. Add pagination
6. Add auto-refresh with setInterval

---

## 4. JACKPOT WIDGET (Priority: P1)

### File to Create
`apps/frontend/src/components/layout/JackpotWidget.tsx`

### Key Features
```typescript
// Display:
- Current jackpot amount per currency
- Recent winners
- Animated counter

// API:
jackpotAPI.getAll() // Get all jackpot pools
jackpotAPI.getWinners(5) // Get recent 5 winners

// Placement:
- Add to layout.tsx or each game page header
```

### Implementation Steps
1. Create component
2. Fetch jackpot data
3. Display with animated counter
4. Add to game pages
5. Auto-refresh every 5s

---

## 5. ADMIN DASHBOARD (Priority: P1)

### Files to Create
```
apps/frontend/src/app/admin/
  ├── page.tsx (dashboard)
  ├── users/page.tsx (user management)
  ├── wallets/page.tsx (wallet management)
  ├── seeds/page.tsx (seed rotation)
  └── config/page.tsx (game config)
```

### Key Features
```typescript
// Admin Routes Needed (Backend):
GET /api/admin/users
GET /api/admin/users/:id/wallets
GET /api/admin/transactions
POST /api/admin/seed/rotate/:userId
PUT /api/admin/game-config/:gameType

// UI Components:
- User list table
- Wallet balance display
- Transaction log
- Seed rotation form
- Game config editor
```

### Implementation Steps
1. Create admin routes in backend
2. Add admin middleware (role check)
3. Create admin pages
4. Add user list
5. Add wallet management
6. Add seed rotation tool
7. Add game config editor

---

## 6. RATE LIMITING (Priority: P1)

### File to Modify
`apps/backend/src/index.ts`

### Implementation
```typescript
import rateLimit from '@fastify/rate-limit';

// Add after other plugins
await fastify.register(rateLimit, {
  max: 100, // 100 requests
  timeWindow: '1 minute',
  cache: 10000,
  allowList: ['127.0.0.1'],
  redis: connection, // Use existing Redis connection
});

// Per-route limits
fastify.post('/api/bet/place', {
  config: {
    rateLimit: {
      max: 10,
      timeWindow: '1 second'
    }
  },
  onRequest: [fastify.authenticate],
}, async (request, reply) => {
  // ... bet logic
});
```

### Steps
1. Install: `npm install @fastify/rate-limit`
2. Add to index.ts
3. Configure per-route limits
4. Test with rapid requests

---

## 7. CONCURRENCY TESTS (Priority: P1)

### File to Create
`apps/backend/tests/concurrency.test.ts`

### Test Cases
```typescript
describe('Concurrency Tests', () => {
  test('100 simultaneous bets', async () => {
    const promises = Array(100).fill(null).map(() =>
      BetEngine.placeBet({
        userId: testUser.id,
        gameType: 'DICE',
        currency: 'USD',
        amount: 1,
        gameParams: { target: 50, isOver: true }
      })
    );
    
    const results = await Promise.all(promises);
    
    // Verify:
    // - All bets succeeded
    // - Balance is correct
    // - Nonce incremented correctly
    // - No duplicate nonces
  });
  
  test('Balance never negative', async () => {
    // Place bets exceeding balance
    // Verify error thrown
    // Verify balance unchanged
  });
  
  test('Nonce increments atomically', async () => {
    // Place 50 bets
    // Verify nonces are 1,2,3...50 (no gaps, no duplicates)
  });
});
```

### Steps
1. Install Jest: `npm install --save-dev jest @types/jest ts-jest`
2. Create test file
3. Write concurrency tests
4. Run: `npm test`

---

## 8. LOGGING & MONITORING (Priority: P1)

### File to Modify
`apps/backend/src/index.ts`

### Implementation
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Use in routes:
logger.info({ userId, betId }, 'Bet placed');
logger.error({ error }, 'Bet failed');

// Add to bet-engine.ts:
betEvents.on('bet-placed', (data) => {
  logger.info(data, 'Bet placed successfully');
});
```

### Steps
1. Install: `npm install pino pino-pretty`
2. Add logger to index.ts
3. Add logging to bet-engine
4. Add logging to auth routes
5. Add error logging

---

## 9. DOCUMENTATION UPDATES (Priority: P1)

### Files to Update
- `README.md`
- `docs/API.md`
- `docs/ADMIN.md`

### Sections to Add

#### README.md
```markdown
## Auto-Bet Usage

1. Navigate to any game (Dice, Limbo)
2. Click "Auto" tab in bet controls
3. Select strategy preset or configure custom
4. Set stop conditions (profit/loss)
5. Click "Start Auto-Bet"
6. Monitor progress in real-time
7. Click "Stop Auto-Bet" to end session

## Fairness Verification

1. Click "Fairness" button on any game
2. View your current seed pair
3. After rotating seeds, visit /verifier
4. Enter revealed server seed + client seed + nonce
5. Verify outcome matches your bet

## Admin Panel

1. Login as admin user
2. Navigate to /admin
3. Manage users, wallets, seeds, configs
```

---

## 🚀 QUICK START FOR NEXT SESSION

### Option A: Complete Games First (Recommended)
1. Implement Mines game (3-4 hours)
2. Implement Plinko game (4-5 hours)
3. Test both games thoroughly
4. **Result**: 4 playable games ✅

### Option B: Complete UI/UX First
1. Implement Leaderboard page (3 hours)
2. Implement Jackpot widget (2 hours)
3. Add to all game pages
4. **Result**: Better user engagement ✅

### Option C: Complete Admin/Testing First
1. Implement Admin dashboard (4-5 hours)
2. Add rate limiting (1 hour)
3. Write concurrency tests (2-3 hours)
4. **Result**: Production-ready backend ✅

---

## 📋 RECOMMENDED ORDER

1. **Mines Game** (completes 3-game requirement)
2. **Plinko Game** (completes 4-game requirement)
3. **Leaderboard Page** (user engagement)
4. **Jackpot Widget** (user engagement)
5. **Rate Limiting** (security)
6. **Admin Dashboard** (management)
7. **Concurrency Tests** (reliability)
8. **Documentation** (completeness)

---

## ✅ DEFINITION OF DONE (Per Task)

### For Each Game Page
- [ ] Page renders without errors
- [ ] Bet button works
- [ ] Balance updates correctly
- [ ] Result displays correctly
- [ ] Fairness modal integrated
- [ ] Stats tracking works
- [ ] Responsive on mobile

### For Leaderboard
- [ ] All tabs work
- [ ] Data loads from API
- [ ] Pagination works
- [ ] Auto-refresh works
- [ ] Currency filter works

### For Admin Dashboard
- [ ] Admin-only access enforced
- [ ] User list displays
- [ ] Wallet management works
- [ ] Seed rotation works
- [ ] Config editor works

### For Tests
- [ ] All tests pass
- [ ] Coverage > 80%
- [ ] No race conditions
- [ ] Balance never negative

---

## 🎯 PHASE-1 COMPLETION CHECKLIST

Use this to track final completion:

- [x] Seed auto-creation ✅
- [x] Auto-bet backend ✅
- [x] Dice auto-bet UI ✅
- [x] Fairness modal ✅
- [x] Verifier page ✅
- [x] Limbo game ✅
- [ ] Mines game ❌
- [ ] Plinko game ❌
- [ ] Leaderboard page ❌
- [ ] Jackpot widget ❌
- [ ] Admin dashboard ❌
- [ ] Rate limiting ❌
- [ ] Concurrency tests ❌
- [ ] Documentation ❌

**Current**: 6/14 complete (43%)
**Target**: 14/14 complete (100%)

---

**Ready to continue implementation!** 🚀

Choose your next task and follow the guide above.
