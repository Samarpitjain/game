import { prisma, GameType, Currency, JackpotStatus } from '@casino/database';
import { WalletService } from './wallet-service';
import { EventEmitter } from 'events';

export const jackpotEvents = new EventEmitter();

/**
 * Jackpot Service - manages jackpot pools and winners
 */
export class JackpotService {
  /**
   * Get or create jackpot for game/currency
   */
  static async getJackpot(gameType?: GameType, currency?: Currency) {
    let jackpot = await prisma.jackpot.findFirst({
      where: {
        gameType: gameType || null,
        currency: currency || null,
      },
    });

    if (!jackpot) {
      jackpot = await prisma.jackpot.create({
        data: {
          gameType: gameType || null,
          currency: currency || null,
          currentAmount: 0,
          minAmount: 100, // Default minimum
          status: JackpotStatus.REFILLING,
          houseEdgePercent: 1,
          conditions: {},
        },
      });
    }

    return jackpot;
  }

  /**
   * Add to jackpot pool from house edge
   */
  static async addToPool(gameType: GameType, currency: Currency, betAmount: number) {
    const jackpot = await this.getJackpot(gameType, currency);
    
    // Calculate contribution (percentage of house edge)
    const contribution = betAmount * (jackpot.houseEdgePercent / 100) * 0.1; // 10% of house edge

    const updated = await prisma.jackpot.update({
      where: { id: jackpot.id },
      data: {
        currentAmount: { increment: contribution },
      },
    });

    // Update status based on amount
    await this.updateJackpotStatus(updated.id);

    return updated;
  }

  /**
   * Update jackpot status based on current amount
   */
  private static async updateJackpotStatus(jackpotId: string) {
    const jackpot = await prisma.jackpot.findUnique({
      where: { id: jackpotId },
    });

    if (!jackpot) return;

    let newStatus = jackpot.status;

    if (jackpot.currentAmount < jackpot.minAmount) {
      newStatus = JackpotStatus.REFILLING;
    } else if (jackpot.currentAmount >= jackpot.minAmount * 5) {
      newStatus = JackpotStatus.MEGA;
    } else {
      newStatus = JackpotStatus.READY;
    }

    if (newStatus !== jackpot.status) {
      await prisma.jackpot.update({
        where: { id: jackpotId },
        data: { status: newStatus },
      });
    }
  }

  /**
   * Check if bet wins jackpot
   */
  static async checkJackpot(betId: string, gameType: GameType, currency: Currency, betAmount: number) {
    const jackpot = await this.getJackpot(gameType, currency);

    // Check if jackpot is ready
    if (jackpot.status === JackpotStatus.REFILLING) {
      return false;
    }

    // Check minimum bet requirement
    const minBet = jackpot.conditions?.minBet || 0;
    if (betAmount < minBet) {
      return false;
    }

    // Random chance (configurable per jackpot)
    const randomChance = jackpot.conditions?.randomChance || 0.0001; // 0.01% default
    const won = Math.random() < randomChance;

    if (won) {
      await this.awardJackpot(jackpot.id, betId);
      return true;
    }

    return false;
  }

  /**
   * Award jackpot to winner
   */
  private static async awardJackpot(jackpotId: string, betId: string) {
    const jackpot = await prisma.jackpot.findUnique({
      where: { id: jackpotId },
    });

    const bet = await prisma.bet.findUnique({
      where: { id: betId },
    });

    if (!jackpot || !bet) return;

    // Set status to calculating
    await prisma.jackpot.update({
      where: { id: jackpotId },
      data: { status: JackpotStatus.CALCULATING },
    });

    // Award jackpot to user
    await WalletService.addBalance(bet.userId, bet.currency, jackpot.currentAmount);

    // Record win
    await prisma.jackpotWin.create({
      data: {
        jackpotId,
        userId: bet.userId,
        amount: jackpot.currentAmount,
        currency: bet.currency,
      },
    });

    // Reset jackpot
    await prisma.jackpot.update({
      where: { id: jackpotId },
      data: {
        currentAmount: 0,
        status: JackpotStatus.REFILLING,
        lastWinnerId: bet.userId,
        lastWinAmount: jackpot.currentAmount,
        lastWinAt: new Date(),
      },
    });

    // Emit event
    jackpotEvents.emit('jackpot-won', {
      userId: bet.userId,
      amount: jackpot.currentAmount,
      currency: bet.currency,
      gameType: jackpot.gameType,
    });
  }

  /**
   * Get all active jackpots
   */
  static async getAllJackpots() {
    return prisma.jackpot.findMany({
      orderBy: { currentAmount: 'desc' },
    });
  }

  /**
   * Get jackpot winners
   */
  static async getJackpotWinners(limit = 50) {
    return prisma.jackpotWin.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        jackpot: {
          select: {
            gameType: true,
          },
        },
      },
    });
  }
}
