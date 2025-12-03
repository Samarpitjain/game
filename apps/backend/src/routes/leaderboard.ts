import { FastifyPluginAsync } from 'fastify';
import { BetEngine } from '../services/bet-engine';

const leaderboardRoutes: FastifyPluginAsync = async (fastify) => {
  // All bets
  fastify.get('/all-bets', async (request) => {
    const { limit = 50, offset = 0 } = request.query as any;
    return BetEngine.getAllBets(limit, offset);
  });

  // High rollers
  fastify.get('/high-rollers', async (request) => {
    const { currency, limit = 50 } = request.query as any;
    return BetEngine.getHighRollers(currency, limit);
  });

  // Big wins
  fastify.get('/big-wins', async (request) => {
    const { currency, limit = 50 } = request.query as any;
    return BetEngine.getBigWins(currency, limit);
  });

  // Lucky wins
  fastify.get('/lucky-wins', async (request) => {
    const { limit = 50 } = request.query as any;
    return BetEngine.getLuckyWins(limit);
  });
};

export default leaderboardRoutes;
