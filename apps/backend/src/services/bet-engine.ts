import { Bet, BetStatus, GameType, Currency, UserStats } from '@casino/database';
import mongoose from 'mongoose';
import { gameRegistry } from '@casino/game-engine';
import { SeedManager } from '@casino/fairness';
import { WalletService } from './wallet-service';
import { EventEmitter } from 'events';

export const betEvents = new EventEmitter();

export interface PlaceBetInput {
  userId: string;
  gameType: GameType;
  currency: Currency;
  amount: number;
  gameParams: any;
  isDemo?: boolean;
  isAutoBet?: boolean;
  strategyId?: string;
}

/**
 * Bet Engine - handles all bet processing
 */
export class BetEngine {
  /**
   * Place a bet (FULLY ATOMIC)
   */
  static async placeBet(input: PlaceBetInput) {
    const { userId, gameType, currency, amount, gameParams, isDemo, isAutoBet, strategyId } = input;

    if (!isDemo && amount <= 0) {
      throw new Error('Bet amount must be positive');
    }

    await SeedManager.getActiveSeedPair(userId);

    // Get seed data
    const seedData = await SeedManager.reserveSeedForBetNoTx(userId);

    let walletId: string | undefined;
    if (!isDemo) {
      const wallet = await WalletService.debitBalance(userId, currency, amount);
      walletId = wallet._id.toString();
    }

    const game = gameRegistry.getGame(gameType);
    const result = game.play({
      amount,
      currency,
      seedData: {
        serverSeed: seedData.serverSeed,
        clientSeed: seedData.clientSeed,
        nonce: seedData.nonce,
      },
      gameParams,
    });

    const status = result.won ? BetStatus.WON : BetStatus.LOST;

    const bet = await Bet.create({
      userId,
      gameType,
      currency,
      amount,
      multiplier: result.multiplier,
      payout: result.payout,
      profit: result.profit,
      status,
      seedPairId: seedData.seedPairId,
      nonce: seedData.nonce,
      gameData: gameParams,
      result: result.result,
      isDemo: isDemo || false,
      isAutoBet: isAutoBet || false,
      strategyId,
    });

    if (!isDemo && walletId) {
      if (result.won) {
        await WalletService.creditBalance(userId, walletId, currency, result.payout);
      }

      await UserStats.findOneAndUpdate(
        { userId },
        {
          $inc: {
            totalWagered: amount,
            totalProfit: result.profit,
            totalWins: result.won ? 1 : 0,
            totalLosses: result.won ? 0 : 1,
          },
          $setOnInsert: { userId }
        },
        { upsert: true }
      );
    }

    const betResult = { bet, result };

    const wallet = isDemo ? null : await WalletService.getWallet(userId, currency);

    betEvents.emit('bet-placed', {
      userId,
      betId: betResult.bet.id,
      gameType,
      amount,
      multiplier: betResult.result.multiplier,
      won: betResult.result.won,
    });

    betEvents.emit('user-activity', {
      user_id: userId,
      activity: 'bet_placed',
      brief_desc: `Placed ${amount} ${currency} bet on ${gameType}`,
      severity: 'info',
      meta_data: { betId: betResult.bet.id, gameType, amount, won: betResult.result.won },
    });

    return {
      bet: betResult.bet,
      result: betResult.result,
      wallet,
    };
  }

  /**
   * Get bet history
   */
  static async getBetHistory(userId: string, limit = 50, offset = 0) {
    return Bet.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate('seedPairId', 'serverSeedHash clientSeed nonce revealed serverSeed');
  }

  /**
   * Get bet by ID
   */
  static async getBetById(betId: string) {
    return Bet.findById(betId)
      .populate('seedPairId')
      .populate('userId', 'username');
  }

  /**
   * Get all bets (for leaderboard)
   */
  static async getAllBets(limit = 50, offset = 0) {
    return Bet.find({ isDemo: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .populate('userId', 'username');
  }

  /**
   * Get high roller bets
   */
  static async getHighRollers(currency: Currency, limit = 50) {
    return Bet.find({ currency, isDemo: false })
      .sort({ amount: -1 })
      .limit(limit)
      .populate('userId', 'username');
  }

  /**
   * Get big wins
   */
  static async getBigWins(currency: Currency, limit = 50) {
    return Bet.find({ currency, status: BetStatus.WON, isDemo: false })
      .sort({ payout: -1 })
      .limit(limit)
      .populate('userId', 'username');
  }

  /**
   * Get lucky wins (highest multiplier)
   */
  static async getLuckyWins(limit = 50) {
    return Bet.find({ status: BetStatus.WON, isDemo: false })
      .sort({ multiplier: -1 })
      .limit(limit)
      .populate('userId', 'username');
  }
}
