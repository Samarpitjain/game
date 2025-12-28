'use client';

import { useState, useEffect } from 'react';

export type ParityColor = 'green' | 'red' | 'violet';
export type ParityBetType = 'number' | 'color' | 'even' | 'odd';

export interface FastParityGameParams {
  betType: ParityBetType;
  value: number | ParityColor | 'even' | 'odd';
}

interface FastParityGameControlsProps {
  onChange: (params: FastParityGameParams) => void;
  disabled?: boolean;
}

export default function FastParityGameControls({ onChange, disabled = false }: FastParityGameControlsProps) {
  const [betType, setBetType] = useState<ParityBetType>('color');
  const [value, setValue] = useState<any>('red');

  useEffect(() => {
    onChange({ betType, value });
  }, [betType, value, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-3">Bet Type</label>
        <div className="grid grid-cols-4 gap-2">
          {(['number', 'color', 'even', 'odd'] as ParityBetType[]).map(t => (
            <button
              key={t}
              onClick={() => {
                setBetType(t);
                if (t === 'number') setValue(5);
                else if (t === 'color') setValue('red');
                else setValue(t);
              }}
              disabled={disabled}
              className={`py-2 rounded-lg font-bold capitalize transition-all ${
                betType === t ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {betType === 'number' && (
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => setValue(num)}
              disabled={disabled}
              className={`aspect-square rounded-lg font-bold text-xl transition-all ${
                value === num ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {betType === 'color' && (
        <div className="grid grid-cols-3 gap-4">
          {(['green', 'red', 'violet'] as ParityColor[]).map(c => (
            <button
              key={c}
              onClick={() => setValue(c)}
              disabled={disabled}
              className={`py-6 rounded-lg font-bold capitalize transition-all ${
                value === c ? 'ring-4 ring-white' : ''
              } disabled:opacity-50`}
              style={{ backgroundColor: c === 'green' ? '#10b981' : c === 'red' ? '#ef4444' : '#8b5cf6' }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {(betType === 'even' || betType === 'odd') && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold capitalize">{betType}</div>
          <div className="text-sm text-gray-400 mt-2">2x payout</div>
        </div>
      )}
    </div>
  );
}
