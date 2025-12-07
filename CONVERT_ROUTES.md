# Route Conversion Pattern

Replace in ALL route files:

## 1. Imports
```typescript
// OLD
import { FastifyPluginAsync } from 'fastify';

// NEW
import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
```

## 2. Router Setup
```typescript
// OLD
const routeName: FastifyPluginAsync = async (fastify) => {

// NEW
const router = Router();
```

## 3. Routes
```typescript
// OLD
fastify.post('/path', { onRequest: [fastify.authenticate] }, async (request, reply) => {
  const body = request.body;
  return { data };
});

// NEW
router.post('/path', authenticate, async (req: AuthRequest, res) => {
  const body = req.body;
  return res.json({ data });
});
```

## 4. Export
```typescript
// OLD
export default routeName;

// NEW
export default router;
```

## 5. Response Methods
- `reply.code(400).send()` → `res.status(400).json()`
- `return { data }` → `return res.json({ data })`
- `request.user` → `req.user`
- `request.body` → `req.body`
- `request.params` → `req.params`
- `request.query` → `req.query`
