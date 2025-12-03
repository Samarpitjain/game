import { FastifyPluginAsync } from 'fastify';
import { StrategyEngine } from '../services/strategy-engine';

const strategyRoutes: FastifyPluginAsync = async (fastify) => {
  // Get default strategies
  fastify.get('/defaults', async () => {
    return StrategyEngine.getDefaultStrategies();
  });

  // Create strategy
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const strategy = request.body as any;
    return StrategyEngine.createStrategy(userId, strategy);
  });

  // Get user strategies
  fastify.get('/my', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    return StrategyEngine.getUserStrategies(userId);
  });

  // Get public strategies
  fastify.get('/public', async (request) => {
    const { gameType, limit = 50 } = request.query as any;
    return StrategyEngine.getPublicStrategies(gameType, limit);
  });

  // Publish strategy
  fastify.post('/:strategyId/publish', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const { strategyId } = request.params as any;
    const { commission } = request.body as any;

    try {
      return await StrategyEngine.publishStrategy(strategyId, commission);
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });
};

export default strategyRoutes;
