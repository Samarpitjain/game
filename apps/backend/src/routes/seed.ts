import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/active', authenticate, async (req: AuthRequest, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export default router;
