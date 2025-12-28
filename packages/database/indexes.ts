import { 
  User, Wallet, Bet, SeedPair, Jackpot, JackpotWin, 
  Strategy, Contest, ContestEntry, Rakeback, GameConfig,
  UserSettings, UserStats, Transaction, CrashRound, CrashBet
} from './schemas';

export const createOptimizedIndexes = async () => {
  console.log('🔧 Creating optimized MongoDB indexes...');

  // User indexes for fast lookups
  await User.collection.createIndex({ username: 1 }, { unique: true });
  await User.collection.createIndex({ email: 1 }, { unique: true });
  await User.collection.createIndex({ role: 1 });
  await User.collection.createIndex({ isVip: 1, isPremium: 1 });

  // Wallet indexes for balance operations
  await Wallet.collection.createIndex({ userId: 1, currency: 1 }, { unique: true });
  await Wallet.collection.createIndex({ userId: 1 });
  await Wallet.collection.createIndex({ currency: 1 });

  // Bet indexes for history and analytics
  await Bet.collection.createIndex({ userId: 1, createdAt: -1 });
  await Bet.collection.createIndex({ gameType: 1, createdAt: -1 });
  await Bet.collection.createIndex({ status: 1, createdAt: -1 });
  await Bet.collection.createIndex({ currency: 1, amount: -1 });
  await Bet.collection.createIndex({ profit: -1, createdAt: -1 }); // Big wins
  await Bet.collection.createIndex({ multiplier: -1, createdAt: -1 }); // Lucky wins
  await Bet.collection.createIndex({ amount: -1, createdAt: -1 }); // High rollers
  await Bet.collection.createIndex({ isDemo: 1, userId: 1 });

  // SeedPair indexes for fairness
  await SeedPair.collection.createIndex({ userId: 1, isActive: 1 });
  await SeedPair.collection.createIndex({ userId: 1, nonce: 1 });
  await SeedPair.collection.createIndex({ revealed: 1, createdAt: -1 });

  // Jackpot indexes
  await Jackpot.collection.createIndex({ gameType: 1, currency: 1 });
  await Jackpot.collection.createIndex({ status: 1 });
  await Jackpot.collection.createIndex({ currentAmount: -1 });

  // JackpotWin indexes
  await JackpotWin.collection.createIndex({ userId: 1, createdAt: -1 });
  await JackpotWin.collection.createIndex({ amount: -1, createdAt: -1 });

  // Strategy indexes
  await Strategy.collection.createIndex({ userId: 1 });
  await Strategy.collection.createIndex({ isPublic: 1, gameType: 1 });
  await Strategy.collection.createIndex({ totalUses: -1 });

  // Contest indexes
  await Contest.collection.createIndex({ startAt: 1, endAt: 1 });
  await Contest.collection.createIndex({ type: 1, currency: 1 });

  // Transaction indexes for audit
  await Transaction.collection.createIndex({ userId: 1, createdAt: -1 });
  await Transaction.collection.createIndex({ type: 1, createdAt: -1 });
  await Transaction.collection.createIndex({ walletId: 1, createdAt: -1 });

  // Crash game indexes
  await CrashRound.collection.createIndex({ roundNumber: 1 }, { unique: true });
  await CrashRound.collection.createIndex({ startedAt: -1 });
  await CrashBet.collection.createIndex({ roundId: 1, userId: 1 });
  await CrashBet.collection.createIndex({ userId: 1, createdAt: -1 });

  console.log('✅ All MongoDB indexes created successfully');
};