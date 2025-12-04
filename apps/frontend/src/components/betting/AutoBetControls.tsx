'use client';

import { useState } from 'react';

export interface AutoBetConfig {
  numberOfBets: number;
  onWin: {
    action: 'reset' | 'increase' | 'decrease';
    value?: number;
  };
  onLoss: {
    action: 'reset' | 'increase' | 'decrease';
    value?: number;
  };
  stopOnProfit?: number;
  stopOnLoss?: number;
}

interface AutoBetControlsProps {
  onStart: (config: AutoBetConfig) => void;
  onStop: () => void;
  isActive: boolean;
  disabled?: boolean;
}

export default function AutoBetControls({ onStart, onStop, isActive, disabled }: AutoBetControlsProps) {
  const [numberOfBets, setNumberOfBets] = useState(0);
  const [onWinAction, setOnWinAction] = useState<'reset' | 'increase' | 'decrease'>('reset');
  const [onWinValue, setOnWinValue] = useState(100);
  const [onLossAction, setOnLossAction] = useState<'reset' | 'increase' | 'decrease'>('increase');
  const [onLossValue, setOnLossValue] = useState(100);
  const [stopOnProfit, setStopOnProfit] = useState<number | undefined>();
  const [stopOnLoss, setStopOnLoss] = useState<number | undefined>();

  const handleStart = () => {
    const config: any = {
      enabled: true,
      numberOfBets,
      onWin: {
        reset: onWinAction === 'reset',
        increaseBy: onWinAction === 'increase' ? onWinValue : undefined,
        decreaseBy: onWinAction === 'decrease' ? onWinValue : undefined,
      },
      onLoss: {
        reset: onLossAction === 'reset',
        increaseBy: onLossAction === 'increase' ? onLossValue : undefined,
        decreaseBy: onLossAction === 'decrease' ? onLossValue : undefined,
      },
      stopOnProfit,
      stopOnLoss,
    };
    onStart(config);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4">Auto Bet</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Number of Bets (0 = Infinite)</label>
          <input
            type="number"
            value={numberOfBets}
            onChange={(e) => setNumberOfBets(parseInt(e.target.value) || 0)}
            className="input w-full"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">On Win</label>
          <div className="flex gap-2">
            <select
              value={onWinAction}
              onChange={(e) => setOnWinAction(e.target.value as any)}
              className="input flex-1"
            >
              <option value="reset">Reset</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            {onWinAction !== 'reset' && (
              <input
                type="number"
                value={onWinValue}
                onChange={(e) => setOnWinValue(parseFloat(e.target.value) || 0)}
                className="input w-24"
                placeholder="%"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">On Loss</label>
          <div className="flex gap-2">
            <select
              value={onLossAction}
              onChange={(e) => setOnLossAction(e.target.value as any)}
              className="input flex-1"
            >
              <option value="reset">Reset</option>
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            {onLossAction !== 'reset' && (
              <input
                type="number"
                value={onLossValue}
                onChange={(e) => setOnLossValue(parseFloat(e.target.value) || 0)}
                className="input w-24"
                placeholder="%"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Stop on Profit ($)</label>
          <input
            type="number"
            value={stopOnProfit || ''}
            onChange={(e) => setStopOnProfit(parseFloat(e.target.value) || undefined)}
            className="input w-full"
            placeholder="Leave empty for no limit"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Stop on Loss ($)</label>
          <input
            type="number"
            value={stopOnLoss || ''}
            onChange={(e) => setStopOnLoss(parseFloat(e.target.value) || undefined)}
            className="input w-full"
            placeholder="Leave empty for no limit"
          />
        </div>

        {isActive ? (
          <button onClick={onStop} className="btn-secondary w-full py-3 text-lg">
            Stop Auto-Bet
          </button>
        ) : (
          <button
            onClick={handleStart}
            disabled={disabled}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50"
          >
            Start Auto-Bet
          </button>
        )}
      </div>
    </div>
  );
}
