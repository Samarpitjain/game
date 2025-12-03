import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@casino/database';

const contestRoutes: FastifyPluginAsync = async (fastify) => {
  // Get active contests
  fastify.get('/active', async () => {
    const now = new Date();
    return prisma.contest.findMany({
      where: {
        startAt: { lte: now },
        endAt: { gte: now },
      },
      include: {
        entries: {
          orderBy: { wagered: 'desc' },
          take: 100,
        },
      },
    });
  });

  // Get contest leaderboard
  fastify.get('/:contestId/leaderboard', async (request) => {
    const { contestId } = request.params as any;
    
    return prisma.contestEntry.findMany({
      where: { contestId },
      orderBy: { wagered: 'desc' },
      take: 100,
    });
  });

  // Get user contest entry
  fastify.get('/:contestId/my-entry', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const { contestId } = request.params as any;

    return prisma.contestEntry.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId,
        },
      },
    });
  });
};

export default contestRoutes;
