'use client';

import { useState, useEffect } from 'react';

export type CoinSide = 'heads' | 'tails';
export type CoinFlipMode = 'normal' | 'series';

export interface CoinFlipGameParams {
  choice: CoinSide;
  mode: CoinFlipMode;
  seriesCount: number;
}

interface CoinFlipGameControlsProps {
  onChange: (params: CoinFlipGameParams) => void;
  disabled?: boolean;
}

export default function CoinFlipGameControls({ onChange, disabled = false }: CoinFlipGameControlsProps) {
  const [choice, setChoice] = useState<CoinSide>('heads');
  const [mode, setMode] = useState<CoinFlipMode>('normal');
  const [seriesCount, setSeriesCount] = useState(3);

  useEffect(() => {
    onChange({ choice, mode, seriesCount });
  }, [choice, mode, seriesCount, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-3">Choose Side</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setChoice('heads')}
            disabled={disabled}
            className={`py-8 rounded-lg font-bold text-2xl transition-all ${
              choice === 'heads' ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            🪙 HEADS
          </button>
          <button
            onClick={() => setChoice('tails')}
            disabled={disabled}
            className={`py-8 rounded-lg font-bold text-2xl transition-all ${
              choice === 'tails' ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            🪙 TAILS
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-3">Mode</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('normal')}
            disabled={disabled}
            className={`py-3 rounded-lg font-bold transition-all ${
              mode === 'normal' ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            Normal
          </button>
          <button
            onClick={() => setMode('series')}
            disabled={disabled}
            className={`py-3 rounded-lg font-bold transition-all ${
              mode === 'series' ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            Series
          </button>
        </div>
      </div>

      {mode === 'series' && (
        <div>
          <label className="block text-sm text-gray-400 mb-2">Number of Flips</label>
          <input
            type="number"
            value={seriesCount}
            onChange={(e) => setSeriesCount(Math.max(2, Math.min(10, Number(e.target.value))))}
            className="input w-full"
            min="2"
            max="10"
            disabled={disabled}
          />
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">Win Chance</div>
          <div className="text-2xl font-bold text-primary">
            {mode === 'normal' ? '49.5%' : `${((0.5 ** seriesCount) * 100).toFixed(2)}%`}
          </div>
        </div>
      </div>
    </div>
  );
}
