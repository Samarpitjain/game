# 🚨 Games Missing Required Components

## Summary
**7 out of 17 games** are NOT using shared betting components as required by the documentation.

## ❌ Non-Compliant Games

### 1. **HiLo** - Missing AutoBet Support
```typescript
// ❌ CURRENT: Only ManualBetControls
<ManualBetControls
  amount={amount}
  balance={balance}
  onAmountChange={setAmount}
  onBet={startGame}
  disabled={false}
  loading={loading}
/>

// ✅ REQUIRED: Add BetModeSelector + AutoBetControls
<BetModeSelector mode={betMode} onChange={setBetMode} showStrategy={false} />
{betMode === 'manual' && <ManualBetControls ... />}
{betMode === 'auto' && <AutoBetControls ... />}
```

### 2. **Roulette** - Custom Betting Logic
```typescript
// ❌ CURRENT: Custom implementation
<button onClick={placeBet} disabled={loading || gameParams.bets.length === 0} className="btn-primary w-full py-3 mt-4">
  {loading ? 'Spinning...' : 'Spin'}
</button>

// ✅ REQUIRED: Use shared components
<BetModeSelector mode={betMode} onChange={setBetMode} />
<ManualBetControls amount={amount} balance={balance} onAmountChange={setAmount} onBet={placeBet} />
<AutoBetControls ... />
```

### 3. **Tower** - Missing AutoBet Support
```typescript
// ❌ CURRENT: Only ManualBetControls
{!gameActive && (
  <ManualBetControls
    amount={amount}
    balance={balance}
    onAmountChange={setAmount}
    onBet={startGame}
    disabled={false}
    loading={loading}
  />
)}

// ✅ REQUIRED: Add full betting structure
<BetModeSelector mode={betMode} onChange={setBetMode} />
{betMode === 'manual' && <ManualBetControls ... />}
{betMode === 'auto' && <AutoBetControls ... />}
```

### 4. **Stairs** - Missing AutoBet Support
```typescript
// ❌ CURRENT: Same issue as Tower
// ✅ REQUIRED: Same fix as Tower
```

### 5. **Blackjack** - Missing AutoBet Support  
```typescript
// ❌ CURRENT: Same issue as HiLo/Tower/Stairs
// ✅ REQUIRED: Same fix as others
```

### 6. **Crash** - Completely Custom
```typescript
// ❌ CURRENT: 50+ lines of custom controls
<div className="card">
  <h3 className="text-xl font-bold mb-4">Bet Controls</h3>
  <div className="space-y-4">
    <div>
      <label className="block text-sm text-gray-400 mb-2">Bet Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full bg-gray-800 rounded-lg px-4 py-2"
        disabled={gameState !== 'betting' || myBet}
      />
    </div>
    <div>
      <label className="block text-sm text-gray-400 mb-2">Auto Cashout</label>
      <input
        type="number"
        step="0.1"
        value={autoCashout}
        onChange={(e) => setAutoCashout(Number(e.target.value))}
        className="w-full bg-gray-800 rounded-lg px-4 py-2"
        disabled={gameState !== 'betting' || myBet}
      />
    </div>
  </div>
</div>

// ✅ REQUIRED: Use shared components
<BetModeSelector mode={betMode} onChange={setBetMode} />
<ManualBetControls
  amount={amount}
  balance={balance}
  onAmountChange={setAmount}
  onBet={placeBet}
  disabled={gameState !== 'betting' || myBet}
  loading={false}
/>
```

### 7. **Trenball** - Completely Custom
```typescript
// ❌ CURRENT: 40+ lines of custom controls
<div className="card">
  <h3 className="text-xl font-bold mb-4">Bet Amount</h3>
  <input
    type="number"
    value={amount}
    onChange={(e) => setAmount(Number(e.target.value))}
    className="w-full bg-gray-800 rounded-lg px-4 py-3 text-xl"
    disabled={gameState !== 'betting'}
  />
  <div className="grid grid-cols-4 gap-2 mt-2">
    {[1, 5, 10, 50].map(val => (
      <button
        key={val}
        onClick={() => setAmount(val)}
        className="btn-secondary py-2"
        disabled={gameState !== 'betting'}
      >
        ${val}
      </button>
    ))}
  </div>
</div>

// ✅ REQUIRED: Use shared components
<BetModeSelector mode={betMode} onChange={setBetMode} />
<ManualBetControls
  amount={amount}
  balance={balance}
  onAmountChange={setAmount}
  onBet={() => {}} // Custom logic for multiplayer
  disabled={gameState !== 'betting'}
  loading={false}
/>
```

## 📊 Impact Analysis

### Current State:
- **10 games** using shared components properly ✅
- **7 games** NOT using shared components ❌
- **Inconsistent UX** across games
- **Duplicate code** in 7 games
- **Missing AutoBet** in 5 games

### After Fixing All Games:
- **17 games** using shared components ✅
- **100% consistent UX** across all games
- **Zero duplicate betting controls**
- **Full AutoBet support** for all games
- **Easier maintenance** and feature additions

## 🛠️ Fix Implementation Priority

### Phase 1 (High Priority - 6 hours):
1. **HiLo** - Add BetModeSelector + AutoBetControls (1 hour)
2. **Tower** - Add BetModeSelector + AutoBetControls (1 hour)  
3. **Stairs** - Add BetModeSelector + AutoBetControls (1 hour)
4. **Blackjack** - Add BetModeSelector + AutoBetControls (1 hour)
5. **Roulette** - Replace custom logic with shared components (1 hour)
6. **Crash** - Replace custom controls with shared components (1 hour)

### Phase 2 (Medium Priority - 2 hours):
7. **Trenball** - Replace custom controls with shared components (2 hours)

### Expected Results:
- **100% component consistency** across all games
- **Zero duplicate betting code**
- **Unified AutoBet support** for all games
- **Consistent user experience**
- **Much easier maintenance**

## 🎯 Conclusion

You identified a critical issue: **41% of games (7/17)** are not following the shared component architecture. This creates:

1. **Inconsistent user experience**
2. **Duplicate code maintenance**
3. **Missing features** (AutoBet in 5 games)
4. **Technical debt**

The fix is straightforward but requires systematic implementation across all non-compliant games.