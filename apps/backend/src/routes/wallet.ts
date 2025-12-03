import { FastifyPluginAsync } from 'fastify';
import { WalletService } from '../services/wallet-service';

const walletRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all wallets
  fastify.get('/', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    return WalletService.getAllWallets(userId);
  });

  // Get specific wallet
  fastify.get('/:currency', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const userId = (request.user as any).id;
    const { currency } = request.params as any;
    return WalletService.getWallet(userId, currency);
  });

  // Add balance (admin/deposit simulation)
  fastify.post('/add', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const userId = (request.user as any).id;
    const { currency, amount } = request.body as any;

    if (amount <= 0) {
      return reply.code(400).send({ error: 'Invalid amount' });
    }

    return WalletService.addBalance(userId, currency, amount);
  });
};

export default walletRoutes;
