'use client';

import { useState, useEffect } from 'react';
import { betAPI, walletAPI } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function DicePage() {
  const { user } = useAuthStore();
  const [amount, setAmount] = useState(10);
  const [target, setTarget] = useState(50);
  const [isOver, setIsOver] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({ profit: 0, wins: 0, losses: 0, wagered: 0 });

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const response = await walletAPI.getAll();
      const usdWallet = response.data.find((w: any) => w.currency === 'USD');
      setBalance(usdWallet?.balance || 0);
    } catch (error) {
      console.error('Failed to load balance');
    }
  };

  const winChance = isOver ? (100 - target) : target;
  const multiplier = (99 / winChance).toFixed(2);

  const placeBet = async () => {
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      const response = await betAPI.place({
        gameType: 'DICE',
        currency: 'USD',
        amount,
        gameParams: { target, isOver },
      });

      const { bet, result: gameResult } = response.data;
      setResult(gameResult);

      if (gameResult.won) {
        toast.success(`Won $${gameResult.profit.toFixed(2)}!`);
        setStats(s => ({ ...s, wins: s.wins + 1, profit: s.profit + gameResult.profit, wagered: s.wagered + amount }));
      } else {
        toast.error(`Lost $${amount}`);
        setStats(s => ({ ...s, losses: s.losses + 1, profit: s.profit - amount, wagered: s.wagered + amount }));
      }

      await loadBalance();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Bet failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold gradient-text">← Dice</Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Balance</div>
              <div className="text-xl font-bold text-primary">${balance.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Roll the Dice</h2>

              {/* Result Display */}
              {result && (
                <div className={`mb-6 p-6 rounded-lg text-center ${result.won ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
                  <div className="text-6xl font-bold mb-2">{result.roll}</div>
                  <div className="text-2xl mb-2">{result.won ? '🎉 WIN!' : '😢 LOST'}</div>
                  <div className="text-xl">
                    {result.won ? `+$${(amount * parseFloat(multiplier) - amount).toFixed(2)}` : `-$${amount.toFixed(2)}`}
                  </div>
                </div>
              )}

              {/* Target Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Target: {target.toFixed(2)}</span>
                  <span className="text-primary">Win Chance: {winChance.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="99"
                  step="0.01"
                  value={target}
                  onChange={(e) => setTarget(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Roll Over/Under */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setIsOver(true)}
                  className={`py-3 rounded-lg font-bold transition-all ${isOver ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  Roll Over {target.toFixed(2)}
                </button>
                <button
                  onClick={() => setIsOver(false)}
                  className={`py-3 rounded-lg font-bold transition-all ${!isOver ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  Roll Under {target.toFixed(2)}
                </button>
              </div>

              {/* Multiplier Display */}
              <div className="text-center mb-6">
                <div className="text-sm text-gray-400">Multiplier</div>
                <div className="text-4xl font-bold text-secondary">{multiplier}x</div>
              </div>
            </div>
          </div>

          {/* Bet Controls */}
          <div className="space-y-6">
            {/* Amount Input */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Bet Amount</h3>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="input w-full mb-4"
                min="0"
                step="0.01"
              />

              {/* Presets */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={() => setAmount(a => a / 2)} className="btn-secondary py-2">½×</button>
                <button onClick={() => setAmount(a => a * 2)} className="btn-secondary py-2">2×</button>
                <button onClick={() => setAmount(balance)} className="btn-secondary py-2">Max</button>
                <button onClick={() => setAmount(10)} className="btn-secondary py-2">Reset</button>
              </div>

              {/* Profit Display */}
              <div className="bg-gray-800 p-3 rounded-lg mb-4">
                <div className="text-sm text-gray-400">Profit on Win</div>
                <div className="text-xl font-bold text-special">
                  ${(amount * parseFloat(multiplier) - amount).toFixed(2)}
                </div>
              </div>

              {/* Bet Button */}
              <button
                onClick={placeBet}
                disabled={loading || amount <= 0 || amount > balance}
                className="btn-primary w-full py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Rolling...' : `Bet $${amount.toFixed(2)}`}
              </button>
            </div>

            {/* Live Stats */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Live Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit/Loss</span>
                  <span className={stats.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${stats.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wins</span>
                  <span className="text-green-500">{stats.wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Losses</span>
                  <span className="text-red-500">{stats.losses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wagered</span>
                  <span>${stats.wagered.toFixed(2)}</span>
                </div>
                <button onClick={() => setStats({ profit: 0, wins: 0, losses: 0, wagered: 0 })} className="btn-secondary w-full mt-4">
                  Reset Stats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
