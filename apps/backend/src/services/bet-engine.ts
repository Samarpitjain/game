import { prisma, BetStatus, GameType, Currency, Prisma } from '@casino/database';
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

    // Ensure seed pair exists BEFORE transaction
    await SeedManager.getActiveSeedPair(userId);

    const betResult = await prisma.$transaction(
      async (tx) => {
        const seedData = await SeedManager.reserveSeedForBet(tx, userId);

        let walletId: string | undefined;
        if (!isDemo) {
          const wallet = await WalletService.debitAndLockBalance(tx, userId, currency, amount);
          walletId = wallet.id;
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

        const bet = await tx.bet.create({
          data: {
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
            gameData: gameParams as any,
            result: result.result as any,
            isDemo: isDemo || false,
            isAutoBet: isAutoBet || false,
            strategyId,
          },
        });

        if (!isDemo && walletId) {
          if (result.won) {
            await WalletService.creditAndUnlockBalance(tx, userId, walletId, currency, amount, result.payout);
          } else {
            await WalletService.releaseLockOnLoss(tx, userId, walletId, currency, amount);
          }

          await tx.userStats.upsert({
            where: { userId },
            create: {
              userId,
              totalWagered: amount,
              totalProfit: result.profit,
              totalWins: result.won ? 1 : 0,
              totalLosses: result.won ? 0 : 1,
            },
            update: {
              totalWagered: { increment: amount },
              totalProfit: { increment: result.profit },
              totalWins: result.won ? { increment: 1 } : undefined,
              totalLosses: result.won ? undefined : { increment: 1 },
            },
          });
        }

        return { bet, result };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

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
