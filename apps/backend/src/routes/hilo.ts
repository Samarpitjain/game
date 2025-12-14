import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { HiLoSession, Bet, Wallet } from '@casino/database';
import { HiLoGame } from '@casino/game-engine';
import { SeedManager, generateInt } from '@casino/fairness';

const router = Router();

const gameConfig = {
  houseEdge: 1,
  minBet: { USD: 0.1, BTC: 0.00001 },
  maxBet: { USD: 10000, BTC: 1 },
  maxWin: { USD: 100000, BTC: 10 },
};

router.post('/start', authenticate, async (req: AuthRequest, res) => {
  try {
    const { betAmount, currency } = req.body;

    if (!betAmount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingSession = await HiLoSession.findOne({ userId: req.userId, active: true });
    if (existingSession) {
      return res.status(400).json({ error: 'Active game exists. Cash out first.' });
    }

    const wallet = await Wallet.findOne({ userId: req.userId, currency });
    if (!wallet || wallet.balance < betAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    wallet.balance -= betAmount;
    await wallet.save();

    const seedData = await SeedManager.reserveSeedForBetNoTx(req.userId!);
    const currentCard = generateInt(seedData, 1, 13);

    const session = await HiLoSession.create({
      userId: req.userId,
      currentCard,
      cardHistory: [],
      betAmount,
      currency,
      currentMultiplier: 1,
      active: true,
      seedPairId: seedData.seedPairId,
      nonce: seedData.nonce,
    });

    res.json({
      sessionId: session._id,
      currentCard,
      currentMultiplier: 1,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/predict', authenticate, async (req: AuthRequest, res) => {
  try {
    const { sessionId, choice } = req.body;

    const session = await HiLoSession.findOne({ _id: sessionId, userId: req.userId, active: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const seedData = {
      seedPairId: session.seedPairId,
      nonce: session.nonce + session.cardHistory.length + 1,
    };

    const nextCard = generateInt(seedData, 1, 13);
    const currentCard = session.currentCard;

    let won = false;
    if (choice === 'higher') {
      won = nextCard > currentCard;
    } else if (choice === 'lower') {
      won = nextCard < currentCard;
    } else if (choice === 'skip') {
      won = true;
    }

    session.cardHistory.push(currentCard);

    if (!won) {
      session.active = false;
      await session.save();

      const bet = await Bet.create({
        userId: req.userId,
        gameType: 'HILO',
        currency: session.currency,
        amount: session.betAmount,
        multiplier: 0,
        payout: 0,
        profit: -session.betAmount,
        won: false,
        seedPairId: session.seedPairId,
        nonce: session.nonce,
        gameData: { cardHistory: session.cardHistory, choice },
        result: { currentCard, nextCard, choice },
      });

      return res.json({
        won: false,
        gameOver: true,
        currentCard,
        nextCard,
        bet,
      });
    }

    const hiloGame = new HiLoGame(gameConfig);
    const multiplier = (hiloGame as any).calculateMultiplier(session.cardHistory.length, choice === 'skip');
    
    session.currentCard = nextCard;
    session.currentMultiplier = multiplier;
    await session.save();

    res.json({
      won: true,
      gameOver: false,
      currentCard: nextCard,
      currentMultiplier: multiplier,
      cardHistory: session.cardHistory,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/session', authenticate, async (req: AuthRequest, res) => {
  try {
    await HiLoSession.deleteMany({ userId: req.userId, active: true });
    res.json({ message: 'Active sessions cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cashout', authenticate, async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.body;

    const session = await HiLoSession.findOne({ _id: sessionId, userId: req.userId, active: true });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.cardHistory.length === 0) {
      return res.status(400).json({ error: 'Must play at least one card' });
    }

    const payout = session.betAmount * session.currentMultiplier;
    const profit = payout - session.betAmount;

    const wallet = await Wallet.findOne({ userId: req.userId, currency: session.currency });
    if (wallet) {
      wallet.balance += payout;
      await wallet.save();
    }

    const bet = await Bet.create({
      userId: req.userId,
      gameType: 'HILO',
      currency: session.currency,
      amount: session.betAmount,
      multiplier: session.currentMultiplier,
      payout,
      profit,
      won: true,
      seedPairId: session.seedPairId,
      nonce: session.nonce,
      gameData: { cardHistory: session.cardHistory },
      result: { cashedOut: true, cardsPlayed: session.cardHistory.length },
    });

    session.active = false;
    session.betId = bet._id;
    await session.save();

    res.json({
      bet,
      payout,
      profit,
      multiplier: session.currentMultiplier,
      wallet: { balance: wallet?.balance },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
