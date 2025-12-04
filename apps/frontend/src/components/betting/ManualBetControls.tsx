'use client';

interface ManualBetControlsProps {
  amount: number;
  balance: number;
  onAmountChange: (amount: number) => void;
  onBet: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function ManualBetControls({
  amount,
  balance,
  onAmountChange,
  onBet,
  disabled = false,
  loading = false,
}: ManualBetControlsProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Bet Amount</h3>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
        className="input w-full mb-4"
        min="0"
        step="0.01"
      />

      <div className="grid grid-cols-4 gap-2 mb-4">
        <button onClick={() => onAmountChange(amount / 2)} className="btn-secondary py-2">½×</button>
        <button onClick={() => onAmountChange(amount * 2)} className="btn-secondary py-2">2×</button>
        <button onClick={() => onAmountChange(balance)} className="btn-secondary py-2">Max</button>
        <button onClick={() => onAmountChange(10)} className="btn-secondary py-2">Reset</button>
      </div>

      <button
        onClick={onBet}
        disabled={disabled || loading || amount <= 0 || amount > balance}
        className="btn-primary w-full py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Betting...' : `Bet $${amount.toFixed(2)}`}
      </button>
    </div>
  );
}
