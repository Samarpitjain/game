# Win Amount Display - Quick Reference

## What Was Done
Added Win Amount display to all applicable games in manual betting mode.

## How It Works
The `ManualBetControls` component already had the Win Amount display feature built-in. We simply passed the `multiplier` prop to activate it.

## Game-by-Game Multipliers

| Game | Multiplier Logic | Example |
|------|-----------------|---------|
| **Dice** ✅ | `gameParams.multiplier` | 2.0x |
| **Limbo** ✅ | `gameParams.targetMultiplier` | 2.0x |
| **Coinflip** ✅ | Normal: 1.98x, Series: 1.98x * count | 1.98x or 5.94x |
| **Plinko** ✅ | `result?.multiplier \|\| 1.2` | 1.2x - 1000x |
| **Wheel** ✅ | `result?.multiplier \|\| 1.5` | 1.5x - 20x |
| **Balloon** ✅ | `1 + (targetPumps * 0.1)` | 1.5x - 3.0x |
| **Rush** ✅ | `gameParams.targetMultiplier` | 2.0x |
| **FastParity** ✅ | Color/Parity: 2x, Number: 9x | 2x or 9x |
| **SoloCrash** ✅ | `gameParams.targetMultiplier` | 2.0x |
| **Keno** ⚠️ | Variable (skipped) | - |
| **Roulette** ⚠️ | Multiple bets (skipped) | - |
| **Mines** ⚠️ | Dynamic (has own display) | - |
| **HiLo** ⚠️ | Dynamic (has own display) | - |
| **Tower** ⚠️ | Dynamic (has own display) | - |
| **Stairs** ⚠️ | Dynamic (has own display) | - |
| **Blackjack** ⚠️ | Variable payout (skipped) | - |
| **Crash** ⚠️ | Multiplayer (skipped) | - |
| **Trenball** ⚠️ | Multiplayer (skipped) | - |

## Code Pattern

### Before
```typescript
<ManualBetControls
  amount={amount}
  balance={balance}
  onAmountChange={setAmount}
  onBet={placeBet}
  disabled={autoBetActive}
  loading={loading}
/>
```

### After
```typescript
<ManualBetControls
  amount={amount}
  balance={balance}
  onAmountChange={setAmount}
  onBet={placeBet}
  disabled={autoBetActive}
  loading={loading}
  multiplier={2.0} // ← Added this line
/>
```

## What Users See

When betting $10 with 2x multiplier:

```
┌─────────────────────────────┐
│ Bet Amount                  │
│ ┌─────────────────────────┐ │
│ │ 10                      │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Win Amount              │ │
│ │ 💰 $10.00               │ │ ← NEW!
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Bet $10.00              │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## Calculation
```
Win Amount = (Bet Amount × Multiplier) - Bet Amount
Example: ($10 × 2.0) - $10 = $10.00 profit
```

## Status
✅ **COMPLETE** - 9 games updated
⚠️ **SKIPPED** - 10 games (not applicable)
📊 **TOTAL** - 19 games reviewed

## Testing
Run the dev server and test each game:
```bash
npm run dev
```

Visit each game and verify Win Amount displays correctly in Manual mode.
