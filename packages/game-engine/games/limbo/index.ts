import { BaseGame, BetInput, BetResult } from '../../base-game';
import { generateFloat, applyHouseEdge } from '@casino/fairness';

export interface LimboParams {
  targetMultiplier: number;
}

export interface LimboResult {
  result: number;
  target: number;
  won: boolean;
}

/**
 * Limbo Game
 * Predict if result will be above target multiplier
 */
export class LimboGame extends BaseGame {
  play(input: BetInput): BetResult {
    this.validateBet(input.amount, input.currency);
    
    const params = input.gameParams as LimboParams;
    const { targetMultiplier } = params;

    // Generate result using exponential distribution
    const float = generateFloat(input.seedData);
    
    // Limbo uses: result = 99 / (100 * float)
    // This creates exponential distribution with most results between 1-2x
    const houseEdgeMultiplier = (100 - this.config.houseEdge) / 100;
    const result = parseFloat(
      ((99 * houseEdgeMultiplier) / (100 * float)).toFixed(2)
    );

    // Cap at 1,000,000x
    const finalResult = Math.min(result, 1000000);

    const won = finalResult >= targetMultiplier;
    const multiplier = won ? targetMultiplier : 0;

    const payout = this.calculatePayout(input.amount, multiplier);
    const profit = this.calculateProfit(input.amount, payout);

    const limboResult: LimboResult = {
      result: finalResult,
      target: targetMultiplier,
      won,
    };

    return {
      multiplier,
      payout,
      profit,
      won,
      gameData: params,
      result: limboResult,
    };
  }

  /**
   * Check jackpot conditions for limbo
   */
  checkJackpot(result: LimboResult, streak: number): boolean {
    // Hit exactly 7.77x or 77.77x
    if (result.result === 7.77 || result.result === 77.77) {
      return true;
    }

    // Win/lose streak
    if (streak >= 10) {
      return true;
    }

    return false;
  }
}
