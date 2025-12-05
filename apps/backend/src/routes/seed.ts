import { FastifyPluginAsync } from 'fastify';
import { SeedManager } from '@casino/fairness';
import { z } from 'zod';

const updateClientSeedSchema = z.object({
  clientSeed: z.string().min(1),
});

const seedRoutes: FastifyPluginAsync = async (fastify) => {
  // Initialize seed pair (create if missing)
  fastify.post('/init', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    
    // Check if seed pair already exists
    const existing = await SeedManager.getActiveSeedPair(userId);
    
    return {
      id: existing.id,
      serverSeedHash: existing.serverSeedHash,
      clientSeed: existing.clientSeed,
      nonce: existing.nonce,
    };
  });

  // Get active seed pair
  fastify.get('/active', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const seedPair = await SeedManager.getActiveSeedPair(userId);
    const betCount = await SeedManager.getBetCount(seedPair.id);
    
    // Don't expose server seed for active pair
    return {
      id: seedPair.id,
      serverSeedHash: seedPair.serverSeedHash,
      clientSeed: seedPair.clientSeed,
      nonce: seedPair.nonce,
      isActive: true,
      revealed: false,
      betCount,
    };
  });

  // Update client seed (rotates seed pair)
  fastify.post('/client-seed', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const body = updateClientSeedSchema.parse(request.body);
      const userId = (request.user as any).id;

      const newSeedPair = await SeedManager.updateClientSeed(userId, body.clientSeed);

      return {
        id: newSeedPair.id,
        serverSeedHash: newSeedPair.serverSeedHash,
        clientSeed: newSeedPair.clientSeed,
        nonce: newSeedPair.nonce,
      };
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  // Rotate seed pair (reveals old server seed)
  fastify.post('/rotate', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    
    // Get old seed pair before rotation
    const oldSeedPair = await SeedManager.getActiveSeedPair(userId);
    
    // Rotate to new seed pair
    const newSeedPair = await SeedManager.rotateSeedPair(userId);

    return {
      oldSeed: {
        id: oldSeedPair.id,
        serverSeed: oldSeedPair.serverSeed,
        serverSeedHash: oldSeedPair.serverSeedHash,
        clientSeed: oldSeedPair.clientSeed,
        nonce: oldSeedPair.nonce,
        revealed: true,
      },
      newSeed: {
        id: newSeedPair.id,
        serverSeedHash: newSeedPair.serverSeedHash,
        clientSeed: newSeedPair.clientSeed,
        nonce: newSeedPair.nonce,
      },
    };
  });

  // Get seed pair for verification (revealed only)
  fastify.get('/verify/:seedPairId', async (request, reply) => {
    const { seedPairId } = request.params as any;
    const seedPair = await SeedManager.getSeedPairForVerification(seedPairId);

    if (!seedPair) {
      return reply.code(404).send({ error: 'Seed pair not found' });
    }

    if (!seedPair.revealed) {
      return reply.code(403).send({ error: 'Seed pair is still active. Rotate seeds to reveal server seed.' });
    }

    return {
      serverSeed: seedPair.serverSeed,
      serverSeedHash: seedPair.serverSeedHash,
      clientSeed: seedPair.clientSeed,
      nonce: seedPair.nonce,
      revealed: seedPair.revealed,
      revealedAt: seedPair.revealedAt,
      bets: seedPair.bets,
    };
  });

  // Get all revealed seed pairs for user
  fastify.get('/history', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const { prisma } = await import('@casino/database');
    
    const seedPairs = await prisma.seedPair.findMany({
      where: { userId, revealed: true },
      orderBy: { revealedAt: 'desc' },
      take: 20,
      select: {
        id: true,
        serverSeed: true,
        serverSeedHash: true,
        clientSeed: true,
        nonce: true,
        revealed: true,
        revealedAt: true,
        _count: {
          select: { bets: true },
        },
      },
    });

    return seedPairs;
  });

  // Get bet count on current seed pair
  fastify.get('/bet-count', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const seedPair = await SeedManager.getActiveSeedPair(userId);
    const count = await SeedManager.getBetCount(seedPair.id);

    return { count };
  });

  // Unhash/check server seed
  fastify.post('/unhash', async (request, reply) => {
    const { serverSeed } = request.body as any;
    
    if (!serverSeed) {
      return reply.code(400).send({ error: 'Server seed required' });
    }

    const { hashServerSeed } = await import('@casino/fairness');
    const hash = hashServerSeed(serverSeed);

    return { serverSeedHash: hash };
  });
};

export default seedRoutes;
