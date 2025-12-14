'use client';

interface HiLoGameControlsProps {
  currentCard?: number;
  onChoice: (choice: 'higher' | 'lower' | 'skip') => void;
  disabled?: boolean;
}

const cardNames = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function HiLoGameControls({ 
  currentCard, 
  onChoice, 
  disabled = false 
}: HiLoGameControlsProps) {
  return (
    <div className="space-y-6">
      {currentCard && (
        <div className="flex justify-center">
          <div className="w-32 h-48 bg-white rounded-lg shadow-xl flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-900">{cardNames[currentCard]}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => onChoice('lower')}
          disabled={disabled || !currentCard}
          className="btn-secondary py-4 text-lg font-bold disabled:opacity-50"
        >
          ⬇️ Lower
        </button>
        <button
          onClick={() => onChoice('skip')}
          disabled={disabled || !currentCard}
          className="btn-secondary py-4 text-lg font-bold disabled:opacity-50"
        >
          ⏭️ Skip
        </button>
        <button
          onClick={() => onChoice('higher')}
          disabled={disabled || !currentCard}
          className="btn-primary py-4 text-lg font-bold disabled:opacity-50"
        >
          ⬆️ Higher
        </button>
      </div>

      <div className="text-center text-sm text-gray-400">
        <p>Predict if the next card will be higher or lower</p>
        <p>Skip reduces multiplier but keeps you safe</p>
      </div>
    </div>
  );
}
