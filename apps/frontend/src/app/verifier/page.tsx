'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createHmac, createHash } from 'crypto';

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

    // Generate HMAC (Stake implementation)
    const currentRound = Math.floor(0 / 32); // cursor = 0 for most games
    const message = `${clientSeed}:${nonce}:${currentRound}`;
    const hmac = createHmac('sha256', serverSeed).update(message).digest('hex');
    
    // Convert first 4 bytes (8 hex chars) to float
    const hex = hmac.substring(0, 8);
    const intValue = parseInt(hex, 16);
    const float = intValue / 0x100000000;

    // Calculate game-specific result
    let gameResult: any = {};
    
    switch (gameType) {
      case 'DICE':
        // Stake's Dice formula: (float * 10001) / 100
        const roll = Math.floor(float * 10001) / 100;
        gameResult = {
          roll: roll.toFixed(2),
          float,
          hmac,
          explanation: `Roll = floor(${float.toFixed(10)} * 10001) / 100 = ${roll.toFixed(2)}`,
        };
        break;
        
      case 'LIMBO':
        // Stake's Limbo formula: (1 / float) * houseEdge, min 1.00
        const houseEdge = 0.99; // 1% house edge
        const floatPoint = (1 / float) * houseEdge;
        const crashPoint = Math.floor(floatPoint * 100) / 100;
        const limboResult = Math.max(crashPoint, 1.00);
        gameResult = {
          result: limboResult.toFixed(2),
          float,
          hmac,
          explanation: `Result = max(floor((1 / ${float.toFixed(10)}) * 0.99 * 100) / 100, 1.00) = ${limboResult.toFixed(2)}`,
        };
        break;

      case 'ROULETTE':
        // Stake's Roulette formula: floor(float * 37)
        const pocket = Math.floor(float * 37);
        gameResult = {
          pocket,
          float,
          hmac,
          explanation: `Pocket = floor(${float.toFixed(10)} * 37) = ${pocket}`,
        };
        break;
        
      default:
        gameResult = {
          float,
          hmac,
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
    
    const hash = createHash('sha256').update(serverSeed).digest('hex');
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
                <option value="ROULETTE">Roulette</option>
                <option value="MINES">Mines (Coming Soon)</option>
                <option value="PLINKO">Plinko (Coming Soon)</option>
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

                {result.hmac && (
                  <div>
                    <div className="text-sm text-gray-400">HMAC-SHA256 Output</div>
                    <div className="font-mono text-xs break-all text-gray-300">{result.hmac}</div>
                  </div>
                )}

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

                {result.pocket !== undefined && (
                  <div>
                    <div className="text-sm text-gray-400">Roulette Pocket</div>
                    <div className="font-mono text-2xl font-bold text-secondary">
                      {result.pocket}
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
                  <p><strong>Stake's Provably Fair Algorithm:</strong></p>
                  <p>1. currentRound = floor(cursor / 32)</p>
                  <p>2. HMAC-SHA256(serverSeed, "clientSeed:nonce:currentRound")</p>
                  <p>3. First 4 bytes (8 hex chars) → float (0-1)</p>
                  <p>4. Float mapped to game-specific outcome</p>
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
