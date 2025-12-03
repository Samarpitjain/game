import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@casino/database';
import { gameRegistry } from '@casino/game-engine';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // Admin middleware
  const requireAdmin = async (request: any, reply: any) => {
    await fastify.authenticate(request, reply);
    if (request.user.role !== 'ADMIN' && request.user.role !== 'SUPER_ADMIN') {
      return reply.code(403).send({ error: 'Forbidden' });
    }
  };

  // Update game config
  fastify.put('/game/:gameType/config', {
    onRequest: [requireAdmin],
  }, async (request) => {
    const { gameType } = request.params as any;
    const config = request.body as any;

    const updated = await prisma.gameConfig.upsert({
      where: { gameType },
      create: {
        gameType,
        ...config,
      },
      update: config,
    });

    // Update in game registry
    gameRegistry.updateConfig(gameType, {
      houseEdge: config.houseEdge,
      minBet: config.minBet,
      maxBet: config.maxBet,
      maxWin: config.maxWin,
    });

    return updated;
  });

  // Create contest
  fastify.post('/contest', {
    onRequest: [requireAdmin],
  }, async (request) => {
    const contest = request.body as any;
    return prisma.contest.create({
      data: contest,
    });
  });

  // Update jackpot config
  fastify.put('/jackpot/:jackpotId', {
    onRequest: [requireAdmin],
  }, async (request) => {
    const { jackpotId } = request.params as any;
    const config = request.body as any;

    return prisma.jackpot.update({
      where: { id: jackpotId },
      data: config,
    });
  });

  // Get user activities
  fastify.get('/activities', {
    onRequest: [requireAdmin],
  }, async (request) => {
    const { limit = 100, offset = 0 } = request.query as any;
    
    return prisma.userActivity.findMany({
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
  });
};

export default adminRoutes;
