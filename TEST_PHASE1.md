# Phase 1 Testing Guide

## Prerequisites
1. Backend server running: `npm run dev` (from apps/backend)
2. Frontend server running: `npm run dev` (from apps/frontend)
3. MongoDB connected
4. User registered and logged in
5. Wallet has USD balance

## Test Tower Game

### Test Case 1: Start Game
1. Navigate to http://localhost:3000/game/tower
2. Select floors (8, 10, 12, or 15)
3. Enter bet amount (e.g., $10)
4. Click "Bet" button
5. **Expected**: Game starts, balance deducted, grid appears

### Test Case 2: Reveal Safe Tiles
1. Click on tiles in the bottom floor
2. **Expected**: 
   - Safe tile turns green with ✓
   - Multiplier increases
   - "Cash Out" button appears

### Test Case 3: Hit Danger
1. Keep clicking tiles until hitting a danger tile
2. **Expected**:
   - Danger tile turns red with 💀
   - Game over message
   - Balance not refunded
   - "New Game" button appears

### Test Case 4: Cash Out
1. Start new game
2. Reveal 2-3 safe tiles
3. Click "Cash Out" button
4. **Expected**:
   - Success message with profit
   - All danger tiles revealed
   - Balance updated with winnings
   - "New Game" button appears

## Test Stairs Game

### Test Case 1: Start Game
1. Navigate to http://localhost:3000/game/stairs
2. Select steps (8, 10, 12, or 15)
3. Enter bet amount
4. Click "Bet"
5. **Expected**: Game starts, 2-tile steps appear

### Test Case 2: Progressive Gameplay
1. Click tiles from bottom to top
2. **Expected**: Each safe tile increases multiplier by ~1.4x

### Test Case 3: Cash Out
1. Clear 3-4 steps
2. Click "Cash Out"
3. **Expected**: Win amount = bet × multiplier

## Test HiLo Game

### Test Case 1: Start Game
1. Navigate to http://localhost:3000/game/hilo
2. Enter bet amount
3. Click "Bet"
4. **Expected**: First card displayed (A-K)

### Test Case 2: Correct Prediction
1. If card is low (A-6), click "Higher"
2. If card is high (8-K), click "Lower"
3. **Expected**: 
   - New card shown
   - Multiplier increases
   - Cards played counter increases

### Test Case 3: Wrong Prediction
1. Make an incorrect prediction
2. **Expected**:
   - Game over
   - Bet lost
   - Balance not refunded

### Test Case 4: Skip Option
1. Click "Skip" button
2. **Expected**:
   - Multiplier increases but less than normal
   - Game continues
   - Safe move

### Test Case 5: Cash Out
1. Make 3-4 correct predictions
2. Click "Cash Out"
3. **Expected**: Win amount = bet × multiplier

## Common Issues & Solutions

### Issue: "Insufficient balance"
**Solution**: Add balance via wallet page

### Issue: "Active game exists"
**Solution**: Complete or cash out existing game first

### Issue: "Session not found"
**Solution**: Game session expired, start new game

### Issue: Balance not updating
**Solution**: Refresh page or check backend logs

## API Testing (Optional)

### Test Tower API
```bash
# Start game
curl -X POST http://localhost:3001/api/tower/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"floors": 10, "betAmount": 10, "currency": "USD"}'

# Reveal tile
curl -X POST http://localhost:3001/api/tower/reveal \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "SESSION_ID", "tileIndex": 0}'

# Cash out
curl -X POST http://localhost:3001/api/tower/cashout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "SESSION_ID"}'
```

### Test Stairs API
```bash
# Start game
curl -X POST http://localhost:3001/api/stairs/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"steps": 10, "betAmount": 10, "currency": "USD"}'
```

### Test HiLo API
```bash
# Start game
curl -X POST http://localhost:3001/api/hilo/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"betAmount": 10, "currency": "USD"}'

# Make prediction
curl -X POST http://localhost:3001/api/hilo/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "SESSION_ID", "choice": "higher"}'
```

## Success Criteria

✅ All 3 games load without errors
✅ Games can be started with bet deduction
✅ Gameplay works (reveal/predict)
✅ Multipliers calculate correctly
✅ Cash out works and updates balance
✅ Game over works and shows results
✅ Stats update correctly
✅ Fairness modal opens
✅ New game resets state properly

## If All Tests Pass

Proceed to **Phase 2: Blackjack Implementation**

## If Tests Fail

1. Check browser console for errors
2. Check backend logs
3. Verify MongoDB connection
4. Verify all routes registered in apps/backend/src/index.ts
5. Verify schemas exported in packages/database/schemas/index.ts
