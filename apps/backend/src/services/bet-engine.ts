import { prisma, BetStatus, GameType, Currency } from '@casino/database';
import { gameRegistry } from '@casino/game-engine';
import { SeedManager } from '@casino/fairness';
import { WalletService } from './wallet-service';
import { JackpotService } from './jackpot-service';
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
   * Place a bet
   */
  static async placeBet(input: PlaceBetInput) {
    const { userId, gameType, currency, amount, gameParams, isDemo, isAutoBet, strategyId } = input;

    // Get or create active seed pair
    const seedPair = await SeedManager.getActiveSeedPair(userId);

    // Lock wallet balance (skip for demo)
    if (!isDemo) {
      await WalletService.lockBalance(userId, currency, amount);
    }

    try {
      // Get game instance
      const game = gameRegistry.getGame(gameType);

      // Play game
      const result = game.play({
        amount,
        currency,
        seedData: {
          serverSeed: seedPair.serverSeed,
          clientSeed: seedPair.clientSeed,
          nonce: seedPair.nonce,
        },
        gameParams,
      });

      // Determine bet status
      const status = result.won ? BetStatus.WON : BetStatus.LOST;

      // Create bet record
      const bet = await prisma.bet.create({
        data: {
          userId,
          gameType,
          currency,
          amount,
          multiplier: result.multiplier,
          payout: result.payout,
          profit: result.profit,
          status,
          seedPairId: seedPair.id,
          nonce: seedPair.nonce,
          gameData: gameParams,
          result: result.result,
          isDemo: isDemo || false,
          isAutoBet: isAutoBet || false,
          strategyId,
        },
      });

      // Increment nonce
      await SeedManager.incrementNonce(seedPair.id);

      // Process payout (skip for demo)
      if (!isDemo) {
        await WalletService.unlockBalance(userId, currency, amount);

        if (result.won) {
          await WalletService.addBalance(userId, currency, result.payout);
        }

        // Update user stats
        await this.updateUserStats(userId, amount, result.profit, result.won);

        // Check jackpot
        await JackpotService.checkJackpot(bet.id, gameType, currency, amount);
      }

      // Emit bet event
      betEvents.emit('bet-placed', {
        userId,
        betId: bet.id,
        gameType,
        amount,
        multiplier: result.multiplier,
        won: result.won,
      });

      // Emit user activity
      betEvents.emit('user-activity', {
        user_id: userId,
        activity: 'bet_placed',
        brief_desc: `Placed ${amount} ${currency} bet on ${gameType}`,
        severity: 'info',
        meta_data: { betId: bet.id, gameType, amount, won: result.won },
      });

      return { bet, result };
    } catch (error) {
      // Unlock balance on error
      if (!isDemo) {
        await WalletService.unlockBalance(userId, currency, amount);
      }
      throw error;
    }
  }

  /**
   * Update user statistics
   */
  private static async updateUserStats(userId: string, wagered: number, profit: number, won: boolean) {
    await prisma.userStats.upsert({
      where: { userId },
      create: {
        userId,
        totalWagered: wagered,
        totalProfit: profit,
        totalWins: won ? 1 : 0,
        totalLosses: won ? 0 : 1,
      },
      update: {
        totalWagered: { increment: wagered },
        totalProfit: { increment: profit },
        totalWins: won ? { increment: 1 } : undefined,
        totalLosses: won ? undefined : { increment: 1 },
      },
    });
  }

  /**
   * Get bet history
   */
  static async getBetHistory(userId: string, limit = 50, offset = 0) {
    return prisma.bet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        seedPair: {
          select: {
            serverSeedHash: true,
            clientSeed: true,
            nonce: true,
            revealed: true,
            serverSeed: true,
          },
        },
      },
    });
  }

  /**
   * Get bet by ID
   */
  static async getBetById(betId: string) {
    return prisma.bet.findUnique({
      where: { id: betId },
      include: {
        seedPair: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  /**
   * Get all bets (for leaderboard)
   */
  static async getAllBets(limit = 50, offset = 0) {
    return prisma.bet.findMany({
      where: { isDemo: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  /**
   * Get high roller bets
   */
  static async getHighRollers(currency: Currency, limit = 50) {
    return prisma.bet.findMany({
      where: {
        currency,
        isDemo: false,
      },
      orderBy: { amount: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  /**
   * Get big wins
   */
  static async getBigWins(currency: Currency, limit = 50) {
    return prisma.bet.findMany({
      where: {
        currency,
        status: BetStatus.WON,
        isDemo: false,
      },
      orderBy: { payout: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  /**
   * Get lucky wins (highest multiplier)
   */
  static async getLuckyWins(limit = 50) {
    return prisma.bet.findMany({
      where: {
        status: BetStatus.WON,
        isDemo: false,
      },
      orderBy: { multiplier: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
}
