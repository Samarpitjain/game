'use client';

import { useState, useEffect } from 'react';

export interface MinesGameParams {
  minesCount: number;
  selectedTiles: number[];
}

interface MinesGameControlsProps {
  onChange: (params: MinesGameParams) => void;
  disabled?: boolean;
  isAutoMode?: boolean;
  revealedTiles?: number[];
  mineTiles?: number[];
  onTileClick?: (index: number) => void;
}

export default function MinesGameControls({ 
  onChange, 
  disabled = false,
  isAutoMode = false,
  revealedTiles = [],
  mineTiles = [],
  onTileClick
}: MinesGameControlsProps) {
  const [minesCount, setMinesCount] = useState(3);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const gridSize = 25;

  useEffect(() => {
    onChange({ minesCount, selectedTiles });
  }, [minesCount, selectedTiles, onChange]);

  const handleTileClick = (index: number) => {
    if (disabled) return;

    if (isAutoMode) {
      // Auto mode: pre-select tiles
      if (selectedTiles.includes(index)) {
        setSelectedTiles(selectedTiles.filter(t => t !== index));
      } else {
        setSelectedTiles([...selectedTiles, index]);
      }
    } else {
      // Manual mode: reveal tiles during game
      if (onTileClick) {
        onTileClick(index);
      }
    }
  };

  const getTileClass = (index: number) => {
    if (mineTiles.includes(index)) return 'bg-red-500 text-white';
    if (revealedTiles.includes(index)) return 'bg-green-500 text-white';
    if (isAutoMode && selectedTiles.includes(index)) return 'bg-blue-500 text-white';
    if (disabled && !isAutoMode) return 'bg-gray-800';
    return 'bg-gray-700 hover:bg-gray-600 cursor-pointer';
  };

  const getTileContent = (index: number) => {
    if (mineTiles.includes(index)) return '💣';
    if (revealedTiles.includes(index)) return '💎';
    if (isAutoMode && selectedTiles.includes(index)) return '✓';
    return '';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Mines Count</label>
        <input
          type="range"
          min="1"
          max="24"
          value={minesCount}
          onChange={(e) => setMinesCount(Number(e.target.value))}
          className="w-full"
          disabled={disabled}
        />
        <div className="text-center text-2xl font-bold mt-2">{minesCount}</div>
      </div>

      {isAutoMode && (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-400">Selected Tiles for Auto-Bet</div>
          <div className="text-xl font-bold text-blue-500">{selectedTiles.length}</div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: gridSize }, (_, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            disabled={disabled && !isAutoMode}
            className={`aspect-square rounded-lg font-bold text-2xl transition-all ${getTileClass(i)}`}
          >
            {getTileContent(i)}
          </button>
        ))}
      </div>
    </div>
  );
}
