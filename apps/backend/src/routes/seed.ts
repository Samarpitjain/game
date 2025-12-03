import { FastifyPluginAsync } from 'fastify';
import { SeedManager } from '@casino/fairness';
import { z } from 'zod';

const updateClientSeedSchema = z.object({
  clientSeed: z.string().min(1),
});

const seedRoutes: FastifyPluginAsync = async (fastify) => {
  // Get active seed pair
  fastify.get('/active', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const seedPair = await SeedManager.getActiveSeedPair(userId);
    
    // Don't expose server seed
    return {
      id: seedPair.id,
      serverSeedHash: seedPair.serverSeedHash,
      clientSeed: seedPair.clientSeed,
      nonce: seedPair.nonce,
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

  // Rotate seed pair
  fastify.post('/rotate', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const newSeedPair = await SeedManager.rotateSeedPair(userId);

    return {
      id: newSeedPair.id,
      serverSeedHash: newSeedPair.serverSeedHash,
      clientSeed: newSeedPair.clientSeed,
      nonce: newSeedPair.nonce,
    };
  });

  // Get seed pair for verification (revealed only)
  fastify.get('/verify/:seedPairId', async (request) => {
    const { seedPairId } = request.params as any;
    const seedPair = await SeedManager.getSeedPairForVerification(seedPairId);

    if (!seedPair || !seedPair.revealed) {
      return { error: 'Seed pair not found or not revealed' };
    }

    return {
      serverSeed: seedPair.serverSeed,
      serverSeedHash: seedPair.serverSeedHash,
      clientSeed: seedPair.clientSeed,
      bets: seedPair.bets,
    };
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
};

export default seedRoutes;
