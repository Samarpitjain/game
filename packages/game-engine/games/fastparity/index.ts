import { BaseGame, BetInput, BetResult } from '../../base-game';
import { generateInt } from '@casino/fairness';

export type ParityColor = 'green' | 'red' | 'violet';
export type ParityBetType = 'number' | 'color' | 'even' | 'odd';

export interface FastParityParams {
  betType: ParityBetType;
  value: number | ParityColor | 'even' | 'odd';
}

export interface FastParityResult {
  number: number;
  color: ParityColor;
  isEven: boolean;
  won: boolean;
}

export class FastParityGame extends BaseGame {
  private getColor(num: number): ParityColor {
    if (num === 0) return 'green';
    return num % 2 === 0 ? 'violet' : 'red';
  }

  play(input: BetInput): BetResult {
    this.validateBet(input.amount, input.currency);
    
    const params = input.gameParams as FastParityParams;
    const { betType, value } = params;

    const number = generateInt(input.seedData, 0, 9);
    const color = this.getColor(number);
    const isEven = number % 2 === 0;

    let won = false;
    let multiplier = 0;

    switch (betType) {
      case 'number':
        won = number === value;
        multiplier = won ? 9.9 : 0; // 10x with 1% house edge
        break;
      case 'color':
        won = color === value;
        multiplier = won ? (color === 'green' ? 9.9 : 1.98) : 0;
        break;
      case 'even':
        won = isEven && number !== 0;
        multiplier = won ? 1.98 : 0;
        break;
      case 'odd':
        won = !isEven;
        multiplier = won ? 1.98 : 0;
        break;
    }

    const payout = this.calculatePayout(input.amount, multiplier);
    const profit = this.calculateProfit(input.amount, payout);

    const result: FastParityResult = {
      number,
      color,
      isEven,
      won,
    };

    return {
      multiplier,
      payout,
      profit,
      won,
      gameData: params,
      result,
    };
  }
}
