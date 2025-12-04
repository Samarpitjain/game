'use client';

import { useState } from 'react';
import Link from 'next/link';
import crypto from 'crypto-js';

export default function VerifierPage() {
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState(0);
  const [gameType, setGameType] = useState('DICE');
  const [result, setResult] = useState<any>(null);

  const verifyBet = () => {
    if (!serverSeed || !clientSeed) {
      alert('Please enter server seed and client seed');
      return;
    }

    // Generate HMAC
    const hmac = crypto.HmacSHA256(`${clientSeed}:${nonce}:0`, serverSeed).toString();
    
    // Convert first 8 hex chars to float
    const hex = hmac.substring(0, 8);
    const intValue = parseInt(hex, 16);
    const float = intValue / 0x100000000;

    // Calculate game-specific result
    let gameResult: any = {};
    
    switch (gameType) {
      case 'DICE':
        const roll = parseFloat((float * 100).toFixed(2));
        gameResult = {
          roll,
          float,
          explanation: `Roll = float * 100 = ${float.toFixed(6)} * 100 = ${roll}`,
        };
        break;
        
      case 'LIMBO':
        const houseEdge = 0.99; // 1% house edge
        const limboResult = parseFloat(((99 * houseEdge) / (100 * float)).toFixed(2));
        const cappedResult = Math.min(limboResult, 1000000);
        gameResult = {
          result: cappedResult,
          float,
          explanation: `Result = (99 * 0.99) / (100 * ${float.toFixed(6)}) = ${limboResult.toFixed(2)} (capped at 1M)`,
        };
        break;
        
      default:
        gameResult = {
          float,
          explanation: 'Select a game type to see specific result calculation',
        };
    }

    setResult(gameResult);
  };

  const verifyServerSeedHash = () => {
    if (!serverSeed) {
      alert('Please enter server seed');
      return;
    }
    
    const hash = crypto.SHA256(serverSeed).toString();
    alert(`Server Seed Hash:\n${hash}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold gradient-text">
            ← Bet Verifier
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 gradient-text">Provably Fair Verifier</h1>
          
          <p className="text-gray-400 mb-6">
            Verify any bet by entering the seed data. After rotating your seed pair,
            you can use the revealed server seed to verify all previous bets were fair.
          </p>

          <div className="space-y-6">
            {/* Server Seed */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Server Seed (Revealed after rotation)
              </label>
              <input
                type="text"
                value={serverSeed}
                onChange={(e) => setServerSeed(e.target.value)}
                className="input w-full font-mono"
                placeholder="Enter server seed..."
              />
              <button
                onClick={verifyServerSeedHash}
                className="btn-secondary mt-2"
              >
                Verify Server Seed Hash
              </button>
            </div>

            {/* Client Seed */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Client Seed
              </label>
              <input
                type="text"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                className="input w-full font-mono"
                placeholder="Enter client seed..."
              />
            </div>

            {/* Nonce */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Nonce (Bet Number)
              </label>
              <input
                type="number"
                value={nonce}
                onChange={(e) => setNonce(parseInt(e.target.value) || 0)}
                className="input w-full"
                min="0"
              />
            </div>

            {/* Game Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Game Type
              </label>
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                className="input w-full"
              >
                <option value="DICE">Dice</option>
                <option value="LIMBO">Limbo</option>
                <option value="MINES">Mines</option>
                <option value="PLINKO">Plinko</option>
              </select>
            </div>

            {/* Verify Button */}
            <button
              onClick={verifyBet}
              className="btn-primary w-full py-3 text-lg"
            >
              Verify Bet
            </button>

            {/* Result */}
            {result && (
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Verification Result</h3>
                
                <div>
                  <div className="text-sm text-gray-400">Random Float (0-1)</div>
                  <div className="font-mono text-lg">{result.float?.toFixed(10)}</div>
                </div>

                {result.roll !== undefined && (
                  <div>
                    <div className="text-sm text-gray-400">Dice Roll</div>
                    <div className="font-mono text-2xl font-bold text-secondary">
                      {result.roll}
                    </div>
                  </div>
                )}

                {result.result !== undefined && (
                  <div>
                    <div className="text-sm text-gray-400">Limbo Result</div>
                    <div className="font-mono text-2xl font-bold text-secondary">
                      {result.result}x
                    </div>
                  </div>
                )}

                <div className="bg-gray-900 p-4 rounded">
                  <div className="text-sm text-gray-400 mb-2">Calculation</div>
                  <div className="font-mono text-sm text-gray-300">
                    {result.explanation}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>HMAC-SHA256(serverSeed, clientSeed:nonce:cursor)</p>
                  <p>First 8 hex characters converted to float (0-1)</p>
                  <p>Float mapped to game-specific outcome</p>
                </div>
              </div>
            )}

            {/* How to Use */}
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <h3 className="font-bold mb-2">How to Use</h3>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Rotate your seed pair to reveal the server seed</li>
                <li>Find a bet you want to verify in your history</li>
                <li>Enter the server seed, client seed, and nonce</li>
                <li>Select the game type</li>
                <li>Click "Verify Bet" to recalculate the outcome</li>
                <li>Compare with the actual bet result</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
