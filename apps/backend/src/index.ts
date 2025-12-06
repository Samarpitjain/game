import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import { Server } from 'socket.io';
import { connectDB, disconnectDB } from '@casino/database';

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
import { socketManager } from './services/socket-manager';

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function start() {
  // Connect to MongoDB
  await connectDB();
  console.log('✅ MongoDB connected');

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

  // Start server FIRST
  try {
    await fastify.listen({ port: PORT as number, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Setup Socket.IO AFTER server starts
  const io = new Server(fastify.server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
  });

  // Initialize Socket Manager
  socketManager.setIO(io);
  console.log('✅ Socket.IO initialized');

  // User room management
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`✅ User ${userId} connected to socket`);
    }

    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected from socket`);
    });
  });

  setupCrashSocket(io);
  setupTrenballSocket(io);

  // Start AutoBet worker
  await AutoBetService.startWorker();
  console.log('✅ AutoBet worker started');

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await fastify.close();
    await disconnectDB();
    process.exit(0);
  });
}

start();
