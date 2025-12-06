# MongoDB Migration Guide

## Changes Made

### 1. Database Package
- ✅ Replaced Prisma with Mongoose
- ✅ Created Mongoose schemas for all models
- ✅ Updated connection logic

### 2. Services Updated
- ✅ `wallet-service.ts` - Converted to Mongoose transactions
- ✅ `bet-engine.ts` - Converted to Mongoose transactions
- ✅ `seed-manager.ts` - Converted to Mongoose

### 3. Configuration
- ✅ Updated `.env` files with MongoDB connection string
- ✅ Updated `package.json` dependencies

## Installation Steps

### 1. Install MongoDB
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

### 2. Start MongoDB
```bash
# Start MongoDB service
mongod --dbpath="C:\data\db"

# Or if installed as service
net start MongoDB
```

### 3. Install Dependencies
```bash
cd d:\work\game
npm install
```

### 4. Update Environment Variables
Already updated in `.env` files:
```env
DATABASE_URL="mongodb://localhost:27017/casinobit"
```

### 5. Start the Application
```bash
npm run dev
```

## Key Differences

### Prisma vs Mongoose

| Feature | Prisma | Mongoose |
|---------|--------|----------|
| Transactions | `prisma.$transaction()` | `session.withTransaction()` |
| Queries | `findUnique()`, `findMany()` | `findOne()`, `find()` |
| Updates | `update()` with `data` | `findByIdAndUpdate()` or `save()` |
| Relations | Auto-populated | Manual `populate()` |
| IDs | `cuid()` strings | `ObjectId` |

### Transaction Pattern

**Before (Prisma):**
```typescript
await prisma.$transaction(async (tx) => {
  await tx.wallet.update({ where: { id }, data: { balance } });
});
```

**After (Mongoose):**
```typescript
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Wallet.findByIdAndUpdate(id, { balance }).session(session);
});
session.endSession();
```

## Remaining Tasks

You need to update these route files to use Mongoose:

### Routes to Update
- `apps/backend/src/routes/auth.ts`
- `apps/backend/src/routes/wallet.ts`
- `apps/backend/src/routes/seed.ts`
- `apps/backend/src/routes/game.ts`
- `apps/backend/src/routes/strategy.ts`
- `apps/backend/src/routes/contest.ts`
- `apps/backend/src/routes/jackpot.ts`
- `apps/backend/src/routes/leaderboard.ts`
- `apps/backend/src/routes/admin.ts`

### Services to Update
- `apps/backend/src/services/autobet-service.ts`
- `apps/backend/src/services/jackpot-service.ts`
- `apps/backend/src/services/strategy-engine.ts`

### WebSocket to Update
- `apps/backend/src/websocket/crash.ts`
- `apps/backend/src/websocket/trenball.ts`

## Migration Pattern

For each file, replace:

1. **Imports:**
```typescript
// Old
import { prisma, ModelName } from '@casino/database';

// New
import { ModelName } from '@casino/database';
```

2. **Find Operations:**
```typescript
// Old
prisma.model.findUnique({ where: { id } })
prisma.model.findMany({ where: { userId } })

// New
Model.findById(id)
Model.find({ userId })
```

3. **Create Operations:**
```typescript
// Old
prisma.model.create({ data: { ... } })

// New
Model.create({ ... })
```

4. **Update Operations:**
```typescript
// Old
prisma.model.update({ where: { id }, data: { ... } })

// New
Model.findByIdAndUpdate(id, { ... }, { new: true })
```

5. **Delete Operations:**
```typescript
// Old
prisma.model.delete({ where: { id } })

// New
Model.findByIdAndDelete(id)
```

## Testing

After migration, test:
1. User registration/login
2. Placing bets
3. Wallet operations
4. Seed rotation
5. Leaderboards
6. Multiplayer games

## Rollback

If needed, revert by:
1. Restore `packages/database/` from git
2. Restore service files
3. Change DATABASE_URL back to PostgreSQL
4. Run `npm install`
