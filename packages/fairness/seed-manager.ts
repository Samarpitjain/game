import { prisma } from '@casino/database';
import { generateServerSeed, hashServerSeed, generateClientSeed } from './rng';

/**
 * Seed Manager - handles seed pair lifecycle
 */

export class SeedManager {
  /**
   * Create initial seed pair for user
   */
  static async createSeedPair(userId: string, clientSeed?: string) {
    const serverSeed = generateServerSeed();
    const serverSeedHash = hashServerSeed(serverSeed);
    const finalClientSeed = clientSeed || generateClientSeed();

    return prisma.seedPair.create({
      data: {
        userId,
        serverSeed,
        serverSeedHash,
        clientSeed: finalClientSeed,
        nonce: 0,
        isActive: true,
        revealed: false,
      },
    });
  }

  /**
   * Get active seed pair for user
   */
  static async getActiveSeedPair(userId: string) {
    let seedPair = await prisma.seedPair.findFirst({
      where: { userId, isActive: true },
    });

    if (!seedPair) {
      seedPair = await this.createSeedPair(userId);
    }

    return seedPair;
  }

  /**
   * Increment nonce after bet
   */
  static async incrementNonce(seedPairId: string) {
    return prisma.seedPair.update({
      where: { id: seedPairId },
      data: { nonce: { increment: 1 } },
    });
  }

  /**
   * Rotate to new seed pair (reveals old server seed)
   */
  static async rotateSeedPair(userId: string, newClientSeed?: string) {
    // Deactivate current seed pair and reveal server seed
    await prisma.seedPair.updateMany({
      where: { userId, isActive: true },
      data: {
        isActive: false,
        revealed: true,
        revealedAt: new Date(),
      },
    });

    // Create new seed pair
    return this.createSeedPair(userId, newClientSeed);
  }

  /**
   * Update client seed (rotates seed pair)
   */
  static async updateClientSeed(userId: string, newClientSeed: string) {
    return this.rotateSeedPair(userId, newClientSeed);
  }

  /**
   * Get seed pair by ID with verification data
   */
  static async getSeedPairForVerification(seedPairId: string) {
    const seedPair = await prisma.seedPair.findUnique({
      where: { id: seedPairId },
      include: {
        bets: {
          orderBy: { createdAt: 'asc' },
          take: 100,
        },
      },
    });

    return seedPair;
  }

  /**
   * Get total bets on current seed pair
   */
  static async getBetCount(seedPairId: string) {
    return prisma.bet.count({
      where: { seedPairId },
    });
  }
}
