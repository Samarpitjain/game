# Win Amount Implementation Status

## Games Updated ✅
1. **Dice** - Uses `gameParams.multiplier`
2. **Limbo** - Uses `gameParams.targetMultiplier`

## Games to Update

### Simple Multiplier Games (Pass multiplier directly)
3. **Keno** - Check for multiplier in gameParams
4. **Wheel** - Check for multiplier in gameParams  
5. **Roulette** - Check for multiplier in gameParams
6. **CoinFlip** - Check for multiplier in gameParams
7. **HiLo** - Check for multiplier in gameParams

### Session-Based Games (Use currentMultiplier state)
8. **Mines** - Use `currentMultiplier` state (dynamic)
9. **Tower** - Use `currentMultiplier` state (dynamic)
10. **Stairs** - Use `currentMultiplier` state (dynamic)

### Multiplayer/Special Games (May not need Win Amount)
11. **Crash** - Multiplayer, no fixed multiplier
12. **Trenball** - Multiplayer, no fixed multiplier
13. **SoloCrash** - Similar to Crash
14. **Rush** - Check structure
15. **FastParity** - Check structure
16. **Balloon** - Check structure
17. **Blackjack** - Session-based, complex payout
18. **Poker** - Session-based, complex payout

## Implementation Strategy

For simple games: Pass `multiplier={gameParams.multiplier}` to ManualBetControls
For session games: Pass `multiplier={currentMultiplier}` when game is active
For multiplayer: Skip or show "N/A"
