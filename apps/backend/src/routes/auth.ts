import { FastifyPluginAsync } from 'fastify';
import { prisma } from '@casino/database';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { SeedManager } from '@casino/fairness';

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);

      // Check if user exists
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { email: body.email },
            { username: body.username },
          ],
        },
      });

      if (existing) {
        return reply.code(400).send({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(body.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: body.username,
          email: body.email,
          passwordHash,
        },
      });

      // Create default settings
      await prisma.userSettings.create({
        data: { userId: user.id },
      });

      // Create default stats
      await prisma.userStats.create({
        data: { userId: user.id },
      });

      // Create initial seed pair
      await SeedManager.createSeedPair(user.id);

      // Generate token
      const token = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      throw error;
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const valid = await bcrypt.compare(body.password, user.passwordHash);

      if (!valid) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVip: user.isVip,
          isPremium: user.isPremium,
          level: user.level,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      throw error;
    }
  });

  // Get current user
  fastify.get('/me', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: (request.user as any).id },
      include: {
        settings: true,
        stats: true,
      },
    });

    return user;
  });
};

export default authRoutes;
