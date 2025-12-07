import { BaseGame, BetInput, BetResult } from '../../base-game';
import { shuffle, generateFloat } from '@casino/fairness';

export interface MinesParams {
  gridSize: 16 | 25 | 36; // 4x4, 5x5, 6x6
  minesCount: number;
  revealedTiles?: number[]; // For manual mode progressive reveal
  selectedTiles?: number[]; // For auto-bet mode
}

export interface MinesResult {
  grid: boolean[]; // true = mine, false = safe
  revealedTiles: number[];
  hitMine: boolean;
  currentMultiplier: number;
}

/**
 * Mines Game
 * Click tiles to avoid mines, each safe tile increases multiplier
 */
export class MinesGame extends BaseGame {
  play(input: BetInput): BetResult {
    this.validateBet(input.amount, input.currency);
    
    const params = input.gameParams as MinesParams;
    const { gridSize, minesCount, revealedTiles = [], selectedTiles = [] } = params;
    
    // For auto-bet, use selectedTiles as revealedTiles
    const tilesToReveal = selectedTiles.length > 0 ? selectedTiles : revealedTiles;

    // Validate mines count
    if (minesCount >= gridSize || minesCount < 1) {
      throw new Error('Invalid mines count');
    }

    // Generate grid using Fisher-Yates shuffle
    const grid = this.generateGrid(gridSize, minesCount, input.seedData);

    // Check if any revealed tile is a mine
    const hitMine = tilesToReveal.some(tile => grid[tile]);

    // Calculate multiplier based on revealed safe tiles
    const safeTilesRevealed = tilesToReveal.filter(tile => !grid[tile]).length;
    const multiplier = this.calculateMultiplier(gridSize, minesCount, safeTilesRevealed);

    const won = !hitMine && safeTilesRevealed > 0;
    const finalMultiplier = won ? multiplier : 0;

    const payout = this.calculatePayout(input.amount, finalMultiplier);
    const profit = this.calculateProfit(input.amount, payout);

    const result: MinesResult = {
      grid,
      revealedTiles: tilesToReveal,
      hitMine,
      currentMultiplier: multiplier,
    };

    return {
      multiplier: finalMultiplier,
      payout,
      profit,
      won,
      gameData: params,
      result,
    };
  }

  private generateGrid(gridSize: number, minesCount: number, seedData: any): boolean[] {
    // Create array with mines (true) and safe tiles (false)
    const tiles = Array(gridSize).fill(false);
    for (let i = 0; i < minesCount; i++) {
      tiles[i] = true;
    }

    // Shuffle using provably fair RNG
    return shuffle(tiles, seedData);
  }

  private calculateMultiplier(gridSize: number, minesCount: number, safeTilesRevealed: number): number {
    if (safeTilesRevealed === 0) return 1;

    const safeTiles = gridSize - minesCount;
    let multiplier = 1;

    for (let i = 0; i < safeTilesRevealed; i++) {
      const remainingSafe = safeTiles - i;
      const remainingTotal = gridSize - i;
      const probability = remainingSafe / remainingTotal;
      
      // Apply house edge
      const adjustedProbability = probability * (1 - this.config.houseEdge / 100);
      multiplier *= (1 / adjustedProbability);
    }

    return parseFloat(multiplier.toFixed(4));
  }

  /**
   * Check jackpot conditions
   */
  checkJackpot(result: MinesResult): boolean {
    // Random chance on each tile reveal
    const randomChance = Math.random() < 0.0001; // 0.01%
    
    if (randomChance) return true;

    // Hit mine on first tile (bad luck jackpot)
    if (result.revealedTiles.length === 1 && result.hitMine) {
      return Math.random() < 0.001; // 0.1%
    }

    return false;
  }
}
