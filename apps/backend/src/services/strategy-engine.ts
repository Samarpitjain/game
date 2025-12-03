import { prisma } from '@casino/database';
import { Strategy, StrategyCondition } from '@casino/shared';

/**
 * Strategy Engine - executes betting strategies
 */
export class StrategyEngine {
  /**
   * Create strategy
   */
  static async createStrategy(userId: string, strategy: Omit<Strategy, 'id'>) {
    return prisma.strategy.create({
      data: {
        userId,
        title: strategy.title,
        gameType: strategy.gameType,
        isPublic: strategy.isPublic,
        commission: strategy.commission || 0,
        conditions: strategy.conditions as any,
      },
    });
  }

  /**
   * Get user strategies
   */
  static async getUserStrategies(userId: string) {
    return prisma.strategy.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get public strategies
   */
  static async getPublicStrategies(gameType?: string, limit = 50) {
    return prisma.strategy.findMany({
      where: {
        isPublic: true,
        gameType: gameType as any,
      },
      orderBy: [
        { totalProfit: 'desc' },
        { totalUses: 'desc' },
      ],
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
   * Execute strategy conditions
   */
  static executeStrategy(
    conditions: StrategyCondition[],
    context: {
      currentBet: number;
      totalProfit: number;
      totalLoss: number;
      winStreak: number;
      lossStreak: number;
    }
  ): { action: string; value?: number } | null {
    // Execute conditions in order
    for (const condition of conditions) {
      if (this.evaluateCondition(condition, context)) {
        return {
          action: condition.action,
          value: condition.actionValue,
        };
      }
    }

    return null;
  }

  /**
   * Evaluate single condition
   */
  private static evaluateCondition(condition: StrategyCondition, context: any): boolean {
    let contextValue: number;

    switch (condition.type) {
      case 'bet':
        contextValue = context.currentBet;
        break;
      case 'profit':
        contextValue = context.totalProfit;
        break;
      case 'loss':
        contextValue = context.totalLoss;
        break;
      case 'streak':
        contextValue = Math.max(context.winStreak, context.lossStreak);
        break;
      default:
        return false;
    }

    switch (condition.operator) {
      case 'gt':
        return contextValue > condition.value;
      case 'lt':
        return contextValue < condition.value;
      case 'eq':
        return contextValue === condition.value;
      case 'gte':
        return contextValue >= condition.value;
      case 'lte':
        return contextValue <= condition.value;
      default:
        return false;
    }
  }

  /**
   * Get default strategies (Martingale, etc.)
   */
  static getDefaultStrategies(): Record<string, StrategyCondition[]> {
    return {
      martingale: [
        {
          type: 'loss',
          operator: 'gt',
          value: 0,
          action: 'increase',
          actionValue: 100, // Double on loss
        },
        {
          type: 'profit',
          operator: 'gt',
          value: 0,
          action: 'reset',
        },
      ],
      delayedMartingale: [
        {
          type: 'streak',
          operator: 'gte',
          value: 3,
          action: 'increase',
          actionValue: 100,
        },
        {
          type: 'profit',
          operator: 'gt',
          value: 0,
          action: 'reset',
        },
      ],
      reverseMartingale: [
        {
          type: 'profit',
          operator: 'gt',
          value: 0,
          action: 'increase',
          actionValue: 100,
        },
        {
          type: 'loss',
          operator: 'gt',
          value: 0,
          action: 'reset',
        },
      ],
      paroli: [
        {
          type: 'streak',
          operator: 'eq',
          value: 3,
          action: 'reset',
        },
        {
          type: 'profit',
          operator: 'gt',
          value: 0,
          action: 'increase',
          actionValue: 100,
        },
      ],
      dalembert: [
        {
          type: 'loss',
          operator: 'gt',
          value: 0,
          action: 'increase',
          actionValue: 10, // Increase by 10%
        },
        {
          type: 'profit',
          operator: 'gt',
          value: 0,
          action: 'decrease',
          actionValue: 10,
        },
      ],
    };
  }

  /**
   * Update strategy stats
   */
  static async updateStrategyStats(strategyId: string, profit: number) {
    await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        totalUses: { increment: 1 },
        totalProfit: { increment: profit },
      },
    });
  }

  /**
   * Publish strategy
   */
  static async publishStrategy(strategyId: string, commission: number) {
    // Validate commission
    const maxCommission = 10; // 10% max
    if (commission > maxCommission) {
      throw new Error(`Commission cannot exceed ${maxCommission}%`);
    }

    return prisma.strategy.update({
      where: { id: strategyId },
      data: {
        isPublic: true,
        commission,
      },
    });
  }
}
