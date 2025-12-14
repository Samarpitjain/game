'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

const games = [
  { id: 'dice', name: 'Dice', icon: '🎲', status: 'live' },
  { id: 'limbo', name: 'Limbo', icon: '🚀', status: 'live' },
  { id: 'coinflip', name: 'Coin Flip', icon: '🪙', status: 'live' },
  { id: 'rush', name: 'Rush', icon: '⚡', status: 'live' },
  { id: 'balloon', name: 'Balloon', icon: '🎈', status: 'live' },
  { id: 'wheel', name: 'Wheel', icon: '🎰', status: 'live' },
  { id: 'mines', name: 'Mines', icon: '💣', status: 'live' },
  { id: 'plinko', name: 'Plinko', icon: '⚪', status: 'live' },
  { id: 'keno', name: 'Keno', icon: '🎱', status: 'live' },
  { id: 'fastparity', name: 'Fast Parity', icon: '🎨', status: 'live' },
  { id: 'solocrash', name: 'Solo Crash', icon: '📊', status: 'live' },
  { id: 'roulette', name: 'Roulette', icon: '🎡', status: 'live' },
  { id: 'tower', name: 'Tower', icon: '🗼', status: 'live' },
  { id: 'stairs', name: 'Stairs', icon: '🪜', status: 'live' },
  { id: 'hilo', name: 'HiLo', icon: '🃏', status: 'live' },
  { id: 'blackjack', name: 'Blackjack', icon: '♠️', status: 'live' },
  { id: 'crash', name: 'Crash MP', icon: '📈', status: 'live' },
  { id: 'trenball', name: 'Trenball', icon: '⚽', status: 'live' },
  { id: 'blackjack', name: 'Blackjack', icon: '♠️', status: 'coming' },
  { id: 'ludo', name: 'Ludo', icon: '🎲', status: 'coming' },
  { id: 'chess', name: 'Chess', icon: '♟️', status: 'coming' },
];

export default function HomePage() {
  const { loadUser, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">CasinoBit</h1>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">
                  Welcome, <span className="text-primary">{user?.username}</span>
                </span>
                <Link href="/wallet" className="btn-primary">
                  Wallet
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <h2 className="text-5xl font-bold mb-4 gradient-text">
          Provably Fair Casino
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Play with confidence. Every bet is verifiable.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/games" className="btn-primary text-lg px-8 py-3">
            Play Now
          </Link>
          <Link href="/fairness" className="btn-secondary text-lg px-8 py-3">
            Learn About Fairness
          </Link>
        </div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold mb-8">Popular Games</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.status === 'live' ? `/game/${game.id}` : '#'}
              className={`card hover:border-primary transition-all group relative ${
                game.status === 'live' ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
            >
              {game.status === 'coming' && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                  SOON
                </div>
              )}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <h4 className="text-xl font-bold">{game.name}</h4>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="text-xl font-bold mb-2">Provably Fair</h4>
            <p className="text-gray-400">
              Verify every bet with our transparent RNG system
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-xl font-bold mb-2">Instant Payouts</h4>
            <p className="text-gray-400">
              Win and withdraw instantly with crypto
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h4 className="text-xl font-bold mb-2">Jackpots & Contests</h4>
            <p className="text-gray-400">
              Compete for massive prizes daily
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>&copy; 2024 CasinoBit. All rights reserved.</p>
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/fairness" className="hover:text-primary">
              Fairness
            </Link>
            <Link href="/limits" className="hover:text-primary">
              Limits
            </Link>
            <Link href="/contests" className="hover:text-primary">
              Contests
            </Link>
            <Link href="/leaderboard" className="hover:text-primary">
              Leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
