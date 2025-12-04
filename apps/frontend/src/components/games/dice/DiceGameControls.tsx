'use client';

import { useState, useEffect } from 'react';

export interface DiceGameParams {
  multiplier: number;
  winChance: number;
  target: number;
  isOver: boolean;
}

interface DiceGameControlsProps {
  onChange: (params: DiceGameParams) => void;
  disabled?: boolean;
}

export default function DiceGameControls({ onChange, disabled = false }: DiceGameControlsProps) {
  const [multiplier, setMultiplier] = useState(2.0);
  const [winChance, setWinChance] = useState(49.5);
  const [isOver, setIsOver] = useState(true);

  // Calculate target based on win chance and roll direction
  const target = isOver ? (100 - winChance) : winChance;

  // Sync multiplier and win chance
  useEffect(() => {
    const params: DiceGameParams = {
      multiplier,
      winChance,
      target,
      isOver,
    };
    onChange(params);
  }, [multiplier, winChance, isOver, target]);

  const handleMultiplierChange = (value: number) => {
    if (value < 1.01) value = 1.01;
    if (value > 99) value = 99;
    setMultiplier(value);
    // Calculate win chance from multiplier: winChance = 99 / multiplier
    const newWinChance = 99 / value;
    setWinChance(parseFloat(newWinChance.toFixed(2)));
  };

  const handleWinChanceChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > 98) value = 98;
    setWinChance(value);
    // Calculate multiplier from win chance: multiplier = 99 / winChance
    const newMultiplier = 99 / value;
    setMultiplier(parseFloat(newMultiplier.toFixed(2)));
  };

  return (
    <div className="space-y-6">
      {/* Multiplier Input */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Multiplier</span>
          <span className="text-primary font-bold">{multiplier.toFixed(2)}x</span>
        </div>
        <input
          type="number"
          value={multiplier}
          onChange={(e) => handleMultiplierChange(parseFloat(e.target.value) || 1.01)}
          className="input w-full"
          min="1.01"
          max="99"
          step="0.01"
          disabled={disabled}
        />
      </div>

      {/* Win Chance Input */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Win Chance</span>
          <span className="text-primary font-bold">{winChance.toFixed(2)}%</span>
        </div>
        <input
          type="number"
          value={winChance}
          onChange={(e) => handleWinChanceChange(parseFloat(e.target.value) || 1)}
          className="input w-full"
          min="1"
          max="98"
          step="0.01"
          disabled={disabled}
        />
        <input
          type="range"
          min="1"
          max="98"
          step="0.01"
          value={winChance}
          onChange={(e) => handleWinChanceChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2"
          disabled={disabled}
        />
      </div>

      {/* Roll Over/Under */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Roll Direction</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsOver(true)}
            disabled={disabled}
            className={`py-3 rounded-lg font-bold transition-all ${
              isOver ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Roll Over {target.toFixed(2)}
          </button>
          <button
            onClick={() => setIsOver(false)}
            disabled={disabled}
            className={`py-3 rounded-lg font-bold transition-all ${
              !isOver ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Roll Under {target.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Info Display */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-center">
          <div className="text-sm text-gray-400">Target</div>
          <div className="text-3xl font-bold text-secondary">{target.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">
            {isOver ? 'Win if roll > target' : 'Win if roll < target'}
          </div>
        </div>
      </div>
    </div>
  );
}
