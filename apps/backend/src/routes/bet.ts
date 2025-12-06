import { FastifyPluginAsync } from 'fastify';
import { BetEngine } from '../services/bet-engine';
import { AutoBetService } from '../services/autobet-service';
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
    }).optional(),
    onLoss: z.object({
      reset: z.boolean(),
      increaseBy: z.number().optional(),
      decreaseBy: z.number().optional(),
    }).optional(),
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

  // Start autobet
  fastify.post('/autobet/start', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    try {
      console.log('AutoBet request body:', JSON.stringify(request.body, null, 2));
      const body = autoBetSchema.parse(request.body);
      const userId = (request.user as any).id;

      await AutoBetService.startAutoBet(userId, body.config, {
        userId,
        gameType: body.gameType as any,
        currency: body.currency as any,
        amount: body.amount,
        gameParams: body.gameParams,
      });

      return { success: true, message: 'Auto-bet started' };
    } catch (error: any) {
      console.error('AutoBet error:', error);
      return reply.code(400).send({ error: error.message || error.toString() });
    }
  });

  // Stop autobet
  fastify.post('/autobet/stop', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    await AutoBetService.stopAutoBet(userId);
    return { success: true, message: 'Auto-bet stopped' };
  });

  // Get autobet status
  fastify.get('/autobet/status', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    return AutoBetService.getAutoBetStatus(userId);
  });

  // Get bet history
  fastify.get('/history', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const { limit = 50, offset = 0 } = request.query as any;
    
    return BetEngine.getBetHistory(userId, parseInt(limit) || 50, parseInt(offset) || 0);
  });

  // Get bet by ID
  fastify.get('/:betId', async (request) => {
    const { betId } = request.params as any;
    return BetEngine.getBetById(betId);
  });
};

export default betRoutes;
