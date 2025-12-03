import { FastifyPluginAsync } from 'fastify';
import { JackpotService } from '../services/jackpot-service';

const jackpotRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all jackpots
  fastify.get('/', async () => {
    return JackpotService.getAllJackpots();
  });

  // Get jackpot winners
  fastify.get('/winners', async (request) => {
    const { limit = 50 } = request.query as any;
    return JackpotService.getJackpotWinners(limit);
  });
};

export default jackpotRoutes;
