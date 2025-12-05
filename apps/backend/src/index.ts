import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { Server } from 'socket.io';
import { prisma } from '@casino/database';

// Routes
import authRoutes from './routes/auth';
import betRoutes from './routes/bet';
import walletRoutes from './routes/wallet';
import gameRoutes from './routes/game';
import seedRoutes from './routes/seed';
import strategyRoutes from './routes/strategy';
import contestRoutes from './routes/contest';
import jackpotRoutes from './routes/jackpot';
import leaderboardRoutes from './routes/leaderboard';
import adminRoutes from './routes/admin';

// WebSocket handlers
import { setupCrashSocket } from './websocket/crash';
import { setupTrenballSocket } from './websocket/trenball';

// Services
import { AutoBetService } from './services/autobet-service';

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  // Register plugins
  await fastify.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await fastify.register(jwt, {
    secret: JWT_SECRET,
  });

  // Add authenticate decorator
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  await fastify.register(websocket);

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(betRoutes, { prefix: '/api/bet' });
  fastify.register(walletRoutes, { prefix: '/api/wallet' });
  fastify.register(gameRoutes, { prefix: '/api/game' });
  fastify.register(seedRoutes, { prefix: '/api/seed' });
  fastify.register(strategyRoutes, { prefix: '/api/strategy' });
  fastify.register(contestRoutes, { prefix: '/api/contest' });
  fastify.register(jackpotRoutes, { prefix: '/api/jackpot' });
  fastify.register(leaderboardRoutes, { prefix: '/api/leaderboard' });
  fastify.register(adminRoutes, { prefix: '/api/admin' });

  // Setup Socket.IO for multiplayer games
  const io = new Server(fastify.server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  setupCrashSocket(io);
  setupTrenballSocket(io);

  // Start AutoBet worker
  AutoBetService.startWorker();
  console.log('✅ AutoBet worker started');

  // Start server
  try {
    await fastify.listen({ port: PORT as number, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await fastify.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}

start();
