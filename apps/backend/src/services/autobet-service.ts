import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { BetEngine, PlaceBetInput } from './bet-engine';
import { AutoBetConfig } from '@casino/shared';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

/**
 * AutoBet Service - handles automated betting with strategies
 */
export class AutoBetService {
  private static autoBetQueue = new Queue('autobet', { connection });
  private static worker: Worker | null = null;

  /**
   * Start autobet worker
   */
  static startWorker() {
    if (this.worker) return;

    this.worker = new Worker(
      'autobet',
      async (job) => {
        const { userId, config, betInput, currentBet } = job.data;
        
        try {
          // Place bet
          const { bet, result } = await BetEngine.placeBet(betInput);

          // Update config based on result
          const newConfig = this.updateConfigAfterBet(config, result.won, betInput.amount);

          // Check stop conditions
          if (this.shouldStop(config, currentBet, result.profit)) {
            return { completed: true, totalBets: currentBet };
          }

          // Schedule next bet
          if (config.numberOfBets === 0 || currentBet < config.numberOfBets) {
            await this.scheduleNextBet(userId, newConfig, betInput, currentBet + 1);
          }

          return { bet, result, nextBet: currentBet + 1 };
        } catch (error) {
          console.error('AutoBet error:', error);
          throw error;
        }
      },
      { connection }
    );

    console.log('AutoBet worker started');
  }

  /**
   * Start autobet session
   */
  static async startAutoBet(userId: string, config: AutoBetConfig, betInput: Omit<PlaceBetInput, 'isAutoBet'>) {
    // Stop any existing session
    await this.stopAutoBet(userId);
    
    // Store initial amount for reset functionality
    const sessionData = {
      ...config,
      initialAmount: betInput.amount,
      totalProfit: 0,
      totalBets: 0,
    };
    
    await this.scheduleNextBet(userId, sessionData, betInput, 1);
  }

  /**
   * Schedule next bet
   */
  private static async scheduleNextBet(
    userId: string,
    config: AutoBetConfig,
    betInput: any,
    currentBet: number
  ) {
    await this.autoBetQueue.add(
      `autobet-${userId}`,
      {
        userId,
        config,
        betInput: { ...betInput, isAutoBet: true },
        currentBet,
      },
      {
        delay: 100, // Small delay between bets
        jobId: `${userId}-${currentBet}`,
      }
    );
  }

  /**
   * Update config after bet based on win/loss
   */
  private static updateConfigAfterBet(config: any, won: boolean, currentAmount: number): any {
    const newConfig = { ...config };
    const adjustment = won ? config.onWin : config.onLoss;

    if (adjustment.reset) {
      // Reset to initial amount
      return { ...newConfig, currentAmount: config.initialAmount };
    }

    let newAmount = currentAmount;
    if (adjustment.increaseBy) {
      newAmount = currentAmount * (1 + adjustment.increaseBy / 100);
    } else if (adjustment.decreaseBy) {
      newAmount = currentAmount * (1 - adjustment.decreaseBy / 100);
    }

    return { ...newConfig, currentAmount: newAmount };
  }

  /**
   * Check if autobet should stop
   */
  private static shouldStop(config: any, currentBet: number, profit: number): boolean {
    // Update total profit
    const totalProfit = (config.totalProfit || 0) + profit;
    
    // Check bet count
    if (config.numberOfBets > 0 && currentBet >= config.numberOfBets) {
      return true;
    }

    // Check profit stop
    if (config.stopOnProfit && totalProfit >= config.stopOnProfit) {
      return true;
    }

    // Check loss stop
    if (config.stopOnLoss && totalProfit <= -config.stopOnLoss) {
      return true;
    }

    return false;
  }

  /**
   * Stop autobet for user
   */
  static async stopAutoBet(userId: string) {
    const jobs = await this.autoBetQueue.getJobs(['waiting', 'delayed']);
    
    for (const job of jobs) {
      if (job.data.userId === userId) {
        await job.remove();
      }
    }
  }

  /**
   * Get autobet status
   */
  static async getAutoBetStatus(userId: string) {
    const jobs = await this.autoBetQueue.getJobs(['waiting', 'delayed', 'active']);
    const userJobs = jobs.filter(job => job.data.userId === userId);

    return {
      active: userJobs.length > 0,
      currentBet: userJobs[0]?.data.currentBet || 0,
      totalBets: userJobs[0]?.data.config.numberOfBets || 0,
    };
  }
}
