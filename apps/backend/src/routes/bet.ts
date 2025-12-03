import { FastifyPluginAsync } from 'fastify';
import { BetEngine } from '../services/bet-engine';
// import { AutoBetService } from '../services/autobet-service';
import { z } from 'zod';

const placeBetSchema = z.object({
  gameType: z.string(),
  currency: z.string(),
  amount: z.number().positive(),
  gameParams: z.any(),
  isDemo: z.boolean().optional(),
});

const autoBetSchema = z.object({
  gameType: z.string(),
  currency: z.string(),
  amount: z.number().positive(),
  gameParams: z.any(),
  config: z.object({
    enabled: z.boolean(),
    numberOfBets: z.number().min(0),
    onWin: z.object({
      reset: z.boolean(),
      increaseBy: z.number().optional(),
      decreaseBy: z.number().optional(),
    }),
    onLoss: z.object({
      reset: z.boolean(),
      increaseBy: z.number().optional(),
      decreaseBy: z.number().optional(),
    }),
    stopOnProfit: z.number().optional(),
    stopOnLoss: z.number().optional(),
  }),
});

const betRoutes: FastifyPluginAsync = async (fastify) => {
  // Place bet
  fastify.post('/place', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      const body = placeBetSchema.parse(request.body);
      const userId = (request.user as any).id;

      const result = await BetEngine.placeBet({
        userId,
        gameType: body.gameType as any,
        currency: body.currency as any,
        amount: body.amount,
        gameParams: body.gameParams,
        isDemo: body.isDemo,
      });

      return result;
    } catch (error: any) {
      return reply.code(400).send({ error: error.message });
    }
  });

  // Start autobet (DISABLED - Requires Redis 5+)
  fastify.post('/autobet/start', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    return reply.code(503).send({ error: 'Auto-bet temporarily disabled. Upgrade Redis to 5.0+' });
  });

  // Stop autobet
  fastify.post('/autobet/stop', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    return { success: true, message: 'Auto-bet disabled' };
  });

  // Get autobet status
  fastify.get('/autobet/status', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    return { active: false, message: 'Auto-bet disabled' };
  });

  // Get bet history
  fastify.get('/history', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const { limit = 50, offset = 0 } = request.query as any;
    
    return BetEngine.getBetHistory(userId, limit, offset);
  });

  // Get bet by ID
  fastify.get('/:betId', async (request) => {
    const { betId } = request.params as any;
    return BetEngine.getBetById(betId);
  });
};

export default betRoutes;
