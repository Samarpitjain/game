import { BaseGame, BetInput, BetResult } from '../../base-game';
import { generateFloat, applyHouseEdge } from '@casino/fairness';

export interface DiceParams {
  target: number;
  isOver: boolean;
  ultimateMode?: boolean;
}

export interface DiceResult {
  roll: number;
  target: number;
  isOver: boolean;
  won: boolean;
}

/**
 * Dice Game
 * Roll a number between 0-100, bet over or under target
 */
export class DiceGame extends BaseGame {
  play(input: BetInput): BetResult {
    this.validateBet(input.amount, input.currency);
    
    const params = input.gameParams as DiceParams;
    const { target, isOver, ultimateMode } = params;

    // Generate roll (0-100 with 2 decimals) - Stake formula
    const float = generateFloat(input.seedData);
    const roll = Math.floor(float * 10001) / 100;

    // Determine win (pure RNG, no house edge)
    const won = isOver ? roll > target : roll < target;

    // Calculate win chance (raw probability from 0-100 range)
    const winChance = isOver ? (100 - target) : target;

    // Calculate multiplier: (99 / winChance) with house edge
    const baseMultiplier = 99 / winChance;
    const multiplier = won ? baseMultiplier * (1 - this.config.houseEdge / 100) : 0;

    // Ultimate mode increases multiplier
    const finalMultiplier = ultimateMode && won ? multiplier * 1.1 : multiplier;

    const payout = this.calculatePayout(input.amount, finalMultiplier);
    const profit = this.calculateProfit(input.amount, payout);

    const result: DiceResult = {
      roll,
      target,
      isOver,
      won,
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

  /**
   * Check jackpot conditions for dice
   */
  checkJackpot(result: DiceResult, streak: number): boolean {
    // Roll exactly 77.77 or 7.77
    if (result.roll === 77.77 || result.roll === 7.77) {
      return true;
    }

    // Win/lose streak conditions
    if (streak >= 10) {
      return true;
    }

    return false;
  }
}
