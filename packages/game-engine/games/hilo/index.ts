import { BaseGame, BetInput, BetResult } from '../../base-game';
import { generateInt } from '@casino/fairness';

export type HiLoChoice = 'higher' | 'lower' | 'skip';

export interface HiLoParams {
  choice: HiLoChoice;
  currentCard?: number;
  cardHistory?: number[];
}

export interface HiLoResult {
  currentCard: number;
  nextCard: number;
  won: boolean;
  cardHistory: number[];
  currentMultiplier: number;
}

export class HiLoGame extends BaseGame {
  play(input: BetInput): BetResult {
    this.validateBet(input.amount, input.currency);
    
    const params = input.gameParams as HiLoParams;
    const { choice, currentCard, cardHistory = [] } = params;

    const nextCard = generateInt(input.seedData, 1, 13);
    const current = currentCard || generateInt({ ...input.seedData, nonce: input.seedData.nonce + 1 }, 1, 13);

    let won = false;
    if (choice === 'higher') {
      won = nextCard > current;
    } else if (choice === 'lower') {
      won = nextCard < current;
    } else if (choice === 'skip') {
      won = true;
    }

    const newHistory = [...cardHistory, current];
    const multiplier = this.calculateMultiplier(newHistory.length, choice === 'skip');

    const finalMultiplier = won ? multiplier : 0;
    const payout = this.calculatePayout(input.amount, finalMultiplier);
    const profit = this.calculateProfit(input.amount, payout);

    const result: HiLoResult = {
      currentCard: current,
      nextCard,
      won,
      cardHistory: newHistory,
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

  private calculateMultiplier(cardsPlayed: number, skipped: boolean): number {
    if (cardsPlayed === 0) return 1;

    let multiplier = 1;
    for (let i = 0; i < cardsPlayed; i++) {
      multiplier *= 1.3;
    }

    if (skipped) {
      multiplier *= 0.8;
    }

    return parseFloat((multiplier * 0.99).toFixed(4));
  }
}
