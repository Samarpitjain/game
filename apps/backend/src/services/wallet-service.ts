import { prisma, Currency, Prisma } from '@casino/database';
import Decimal from 'decimal.js';

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
   * Debit balance and lock funds (atomic, within transaction)
   */
  static async debitAndLockBalance(
    tx: Prisma.TransactionClient,
    userId: string,
    currency: Currency,
    amount: number
  ) {
    const amountDecimal = new Decimal(amount);
    const wallet = await tx.wallet.findUnique({
      where: { userId_currency: { userId, currency } },
    });
    if (!wallet) throw new Error(`Wallet not found for ${currency}`);

    const currentBalance = new Decimal(wallet.balance);
    const currentLocked = new Decimal(wallet.lockedBalance.toString());
    if (currentBalance.lessThan(amountDecimal)) throw new Error('Insufficient balance');

    const newBalance = currentBalance.minus(amountDecimal);
    const newLocked = currentLocked.plus(amountDecimal);

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance.toNumber(),
        lockedBalance: newLocked.toString(),
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: amountDecimal.toString(),
        type: 'bet-reserve',
        beforeAmount: currentBalance.toString(),
        afterAmount: newBalance.toString(),
        meta: { currency },
      },
    });

    return updated;
  }

  /**
   * Credit payout and unlock funds (atomic, within transaction)
   */
  static async creditAndUnlockBalance(
    tx: Prisma.TransactionClient,
    userId: string,
    walletId: string,
    currency: Currency,
    betAmount: number,
    payoutAmount: number
  ) {
    const betDecimal = new Decimal(betAmount);
    const payoutDecimal = new Decimal(payoutAmount);
    const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const currentBalance = new Decimal(wallet.balance);
    const currentLocked = new Decimal(wallet.lockedBalance.toString());
    const newBalance = currentBalance.plus(payoutDecimal);
    const newLocked = currentLocked.minus(betDecimal);

    const updated = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance.toNumber(),
        lockedBalance: newLocked.toString(),
      },
    });

    await tx.transaction.create({
      data: {
        userId,
        walletId,
        amount: payoutDecimal.toString(),
        type: 'payout',
        beforeAmount: currentBalance.toString(),
        afterAmount: newBalance.toString(),
        meta: { currency, betAmount, payoutAmount },
      },
    });

    return updated;
  }

  /**
   * Release locked balance on loss (atomic, within transaction)
   */
  static async releaseLockOnLoss(
    tx: Prisma.TransactionClient,
    userId: string,
    walletId: string,
    currency: Currency,
    amount: number
  ) {
    const amountDecimal = new Decimal(amount);
    const wallet = await tx.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const currentBalance = new Decimal(wallet.balance);
    const currentLocked = new Decimal(wallet.lockedBalance.toString());
    const newLocked = currentLocked.minus(amountDecimal);
    if (newLocked.lessThan(0)) throw new Error('Invalid locked balance state');

    const updated = await tx.wallet.update({
      where: { id: walletId },
      data: { lockedBalance: newLocked.toString() },
    });

    await tx.transaction.create({
      data: {
        userId,
        walletId,
        amount: amountDecimal.negated().toString(),
        type: 'bet-loss',
        beforeAmount: currentBalance.toString(),
        afterAmount: currentBalance.toString(),
        meta: { currency, lostAmount: amount },
      },
    });

    return updated;
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
