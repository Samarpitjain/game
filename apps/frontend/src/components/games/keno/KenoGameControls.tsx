'use client';

import { useState, useEffect } from 'react';

export type KenoRisk = 'low' | 'medium' | 'high';

export interface KenoGameParams {
  selectedNumbers: number[];
  risk: KenoRisk;
}

interface KenoGameControlsProps {
  onChange: (params: KenoGameParams) => void;
  disabled?: boolean;
}

export default function KenoGameControls({ onChange, disabled = false }: KenoGameControlsProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [risk, setRisk] = useState<KenoRisk>('medium');

  useEffect(() => {
    onChange({ selectedNumbers, risk });
  }, [selectedNumbers, risk, onChange]);

  const toggleNumber = (num: number) => {
    if (disabled) return;
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const autoPick = () => {
    if (disabled) return;
    const count = Math.floor(Math.random() * 10) + 1;
    const numbers: number[] = [];
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * 40) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  const clear = () => {
    if (disabled) return;
    setSelectedNumbers([]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <div className="text-sm text-gray-400">Selected Numbers</div>
        <div className="text-3xl font-bold text-primary">{selectedNumbers.length}/10</div>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 40 }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            onClick={() => toggleNumber(num)}
            disabled={disabled}
            className={`aspect-square rounded-lg font-bold transition-all ${
              selectedNumbers.includes(num)
                ? 'bg-primary text-white scale-110 shadow-lg'
                : 'bg-gray-800 hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={autoPick} disabled={disabled} className="btn-secondary flex-1">
          Auto Pick
        </button>
        <button onClick={clear} disabled={disabled} className="btn-secondary flex-1">
          Clear
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Risk Level</label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as KenoRisk[]).map(r => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              disabled={disabled}
              className={`py-3 rounded-lg font-bold capitalize transition-all ${
                risk === r ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
