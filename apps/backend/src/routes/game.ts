import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@casino/database';
import { gameRegistry } from '@casino/game-engine';

const gameRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all games
  fastify.get('/', async () => {
    const games = gameRegistry.getAllGames();
    const configs = await prisma.gameConfig.findMany();

    return games.map(gameType => {
      const config = configs.find(c => c.gameType === gameType);
      return {
        gameType,
        config: config || null,
      };
    });
  });

  // Get game config
  fastify.get('/:gameType', async (request) => {
    const { gameType } = request.params as any;
    
    const config = await prisma.gameConfig.findUnique({
      where: { gameType },
    });

    return config;
  });

  // Toggle favorite
  fastify.post('/:gameType/favorite', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const { gameType } = request.params as any;

    const existing = await prisma.favoriteGame.findUnique({
      where: {
        userId_gameType: {
          userId,
          gameType,
        },
      },
    });

    if (existing) {
      await prisma.favoriteGame.delete({
        where: { id: existing.id },
      });
      return { favorited: false };
    } else {
      await prisma.favoriteGame.create({
        data: { userId, gameType },
      });
      return { favorited: true };
    }
  });

  // Get favorites
  fastify.get('/favorites/list', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    return prisma.favoriteGame.findMany({
      where: { userId },
    });
  });
};

export default gameRoutes;
