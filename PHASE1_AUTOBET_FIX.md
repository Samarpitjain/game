# Phase 1: Fix AutoBet Data Structure Mismatch

## Problem Analysis
Frontend AutoBetControls sends:
```typescript
{
  numberOfBets: number,
  onWin: { action: 'reset' | 'increase', value?: number },
  onLoss: { action: 'reset' | 'increase', value?: number },
  stopOnProfit?: number,
  stopOnLoss?: number
}
```

Backend expects:
```typescript
{
  enabled: boolean,
  numberOfBets: number,
  onWin: { reset: boolean, increaseBy?: number },
  onLoss: { reset: boolean, increaseBy?: number },
  stopOnProfit?: number,
  stopOnLoss?: number
}
```

## Fix Strategy
1. Update frontend AutoBetControls to send correct format
2. Add proper validation and error handling
3. Test with simple games first (Dice, Limbo, Plinko)

## Files to Update
- `apps/frontend/src/components/betting/AutoBetControls.tsx`
- `apps/frontend/src/hooks/useUniversalGameLogic.ts` (if created)
- Test with Dice game first

## Expected Result
AutoBet will work properly for simple games (Dice, Limbo, Plinko, Balloon, CoinFlip, FastParity, Keno, Wheel, Rush)