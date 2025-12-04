'use client';

import { useState, useEffect } from 'react';
import { betAPI, walletAPI } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import FairnessModal from '@/components/games/FairnessModal';

export default function LimboPage() {
  const [amount, setAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.00);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({ profit: 0, wins: 0, losses: 0, wagered: 0 });
  const [fairnessModalOpen, setFairnessModalOpen] = useState(false);

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

  const placeBet = async () => {
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (targetMultiplier < 1.01 || targetMultiplier > 1000000) {
      toast.error('Target must be between 1.01x and 1,000,000x');
      return;
    }

    setLoading(true);
    try {
      const response = await betAPI.place({
        gameType: 'LIMBO',
        currency: 'USD',
        amount,
        gameParams: { targetMultiplier },
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
          <Link href="/" className="text-2xl font-bold gradient-text">← Limbo</Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFairnessModalOpen(true)}
              className="btn-secondary px-4 py-2"
            >
              🎲 Fairness
            </button>
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
              <h2 className="text-2xl font-bold mb-6">Limbo</h2>

              {/* Result Display */}
              {result && (
                <div className={`mb-6 p-8 rounded-lg text-center ${result.won ? 'bg-green-900/20 border border-green-500' : 'bg-red-900/20 border border-red-500'}`}>
                  <div className="text-6xl font-bold mb-2">{result.result.toFixed(2)}x</div>
                  <div className="text-2xl mb-2">{result.won ? '🎉 WIN!' : '😢 LOST'}</div>
                  <div className="text-xl">
                    {result.won ? `+$${(amount * targetMultiplier - amount).toFixed(2)}` : `-$${amount.toFixed(2)}`}
                  </div>
                </div>
              )}

              {/* Target Multiplier Input */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Target Multiplier</span>
                  <span className="text-primary">{targetMultiplier.toFixed(2)}x</span>
                </div>
                <input
                  type="number"
                  value={targetMultiplier}
                  onChange={(e) => setTargetMultiplier(parseFloat(e.target.value) || 1.01)}
                  className="input w-full text-center text-2xl font-bold"
                  min="1.01"
                  max="1000000"
                  step="0.01"
                />
                
                {/* Quick Presets */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  <button onClick={() => setTargetMultiplier(1.5)} className="btn-secondary py-2">1.5x</button>
                  <button onClick={() => setTargetMultiplier(2)} className="btn-secondary py-2">2x</button>
                  <button onClick={() => setTargetMultiplier(5)} className="btn-secondary py-2">5x</button>
                  <button onClick={() => setTargetMultiplier(10)} className="btn-secondary py-2">10x</button>
                  <button onClick={() => setTargetMultiplier(100)} className="btn-secondary py-2">100x</button>
                </div>
              </div>

              {/* Payout Display */}
              <div className="text-center mb-6">
                <div className="text-sm text-gray-400">Potential Payout</div>
                <div className="text-4xl font-bold text-secondary">
                  ${(amount * targetMultiplier).toFixed(2)}
                </div>
              </div>

              {/* Game Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold mb-2">How to Play</h3>
                <p className="text-sm text-gray-400">
                  Set your target multiplier and place your bet. The game will generate a random multiplier.
                  If the result is equal to or higher than your target, you win!
                  Higher targets = lower chance but bigger payouts.
                </p>
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
                  ${(amount * targetMultiplier - amount).toFixed(2)}
                </div>
              </div>

              {/* Bet Button */}
              <button
                onClick={placeBet}
                disabled={loading || amount <= 0 || amount > balance}
                className="btn-primary w-full py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Playing...' : `Bet $${amount.toFixed(2)}`}
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

      <FairnessModal
        isOpen={fairnessModalOpen}
        onClose={() => setFairnessModalOpen(false)}
      />
    </div>
  );
}
