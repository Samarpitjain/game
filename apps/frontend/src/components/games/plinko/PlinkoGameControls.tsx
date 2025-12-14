'use client';

import { useState, useEffect } from 'react';

export type PlinkoRisk = 'low' | 'medium' | 'high';

export interface PlinkoGameParams {
  risk: PlinkoRisk;
  rows: 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
  superMode: boolean;
}

interface PlinkoGameControlsProps {
  onChange: (params: PlinkoGameParams) => void;
  disabled?: boolean;
}

export default function PlinkoGameControls({ onChange, disabled = false }: PlinkoGameControlsProps) {
  const [risk, setRisk] = useState<PlinkoRisk>('medium');
  const [rows, setRows] = useState<8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16>(12);
  const [superMode, setSuperMode] = useState(false);

  useEffect(() => {
    onChange({ risk, rows, superMode });
  }, [risk, rows, superMode, onChange]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-3">Risk Level</label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as PlinkoRisk[]).map(r => (
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

      <div>
        <label className="block text-sm text-gray-400 mb-2">Rows: {rows}</label>
        <input
          type="range"
          min="8"
          max="16"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value) as any)}
          className="w-full"
          disabled={disabled}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8</span>
          <span>16</span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
        <div>
          <div className="font-bold">Super Mode</div>
          <div className="text-xs text-gray-400">1.5x multiplier boost</div>
        </div>
        <button
          onClick={() => setSuperMode(!superMode)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            superMode ? 'bg-primary' : 'bg-gray-700'
          } disabled:opacity-50`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              superMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
