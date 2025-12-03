import { prisma, Currency } from '@casino/database';

/**
 * Wallet Service - manages user balances
 */
export class WalletService {
  /**
   * Get or create wallet for user
   */
  static async getWallet(userId: string, currency: Currency) {
    let wallet = await prisma.wallet.findUnique({
      where: {
        userId_currency: {
          userId,
          currency,
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          currency,
          balance: 0,
          lockedBalance: 0,
        },
      });
    }

    return wallet;
  }

  /**
   * Get all wallets for user
   */
  static async getAllWallets(userId: string) {
    return prisma.wallet.findMany({
      where: { userId },
    });
  }

  /**
   * Add balance
   */
  static async addBalance(userId: string, currency: Currency, amount: number) {
    const wallet = await this.getWallet(userId, currency);

    return prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
      },
    });
  }

  /**
   * Subtract balance
   */
  static async subtractBalance(userId: string, currency: Currency, amount: number) {
    const wallet = await this.getWallet(userId, currency);

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    return prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
      },
    });
  }

  /**
   * Lock balance (for pending bets)
   */
  static async lockBalance(userId: string, currency: Currency, amount: number) {
    const wallet = await this.getWallet(userId, currency);

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    return prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amount },
        lockedBalance: { increment: amount },
      },
    });
  }

  /**
   * Unlock balance (after bet completion)
   */
  static async unlockBalance(userId: string, currency: Currency, amount: number) {
    const wallet = await this.getWallet(userId, currency);

    return prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        lockedBalance: { decrement: amount },
      },
    });
  }

  /**
   * Get available balance
   */
  static async getAvailableBalance(userId: string, currency: Currency): Promise<number> {
    const wallet = await this.getWallet(userId, currency);
    return wallet.balance;
  }

  /**
   * Transfer between currencies (for swaps)
   */
  static async transfer(
    userId: string,
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number,
    rate: number
  ) {
    const convertedAmount = amount * rate;

    await prisma.$transaction([
      prisma.wallet.update({
        where: {
          userId_currency: {
            userId,
            currency: fromCurrency,
          },
        },
        data: {
          balance: { decrement: amount },
        },
      }),
      prisma.wallet.update({
        where: {
          userId_currency: {
            userId,
            currency: toCurrency,
          },
        },
        data: {
          balance: { increment: convertedAmount },
        },
      }),
    ]);

    return convertedAmount;
  }
}
