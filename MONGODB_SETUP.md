# MongoDB Setup - Quick Start

## ✅ Completed

1. **Database Package** - Fully migrated to Mongoose
2. **Core Services** - wallet-service, bet-engine, seed-manager
3. **Auth Routes** - User registration/login
4. **Configuration** - .env files updated

## 🚀 Quick Start

### 1. Install MongoDB

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

### 2. Start MongoDB
```bash
mongod --dbpath="C:\data\db"
```

### 3. Install Dependencies
```bash
cd d:\work\game
npm install
```

### 4. Start Application
```bash
npm run dev
```

## 📋 What's Working

- ✅ MongoDB connection
- ✅ User authentication (register/login)
- ✅ Wallet operations with transactions
- ✅ Bet placement with atomic operations
- ✅ Seed pair management
- ✅ Provably fair system

## 🔧 Remaining Work

Update these files (follow pattern in MONGODB_MIGRATION.md):

### Routes (9 files)
- `routes/wallet.ts`
- `routes/seed.ts`
- `routes/game.ts`
- `routes/strategy.ts`
- `routes/contest.ts`
- `routes/jackpot.ts`
- `routes/leaderboard.ts`
- `routes/admin.ts`
- `routes/bet.ts`

### Services (3 files)
- `services/autobet-service.ts`
- `services/jackpot-service.ts`
- `services/strategy-engine.ts`

### WebSocket (2 files)
- `websocket/crash.ts`
- `websocket/trenball.ts`

## 🔄 Migration Pattern

Replace Prisma calls with Mongoose:

```typescript
// FIND
prisma.model.findUnique({ where: { id } })  →  Model.findById(id)
prisma.model.findMany({ where: { x } })     →  Model.find({ x })
prisma.model.findFirst({ where: { x } })    →  Model.findOne({ x })

// CREATE
prisma.model.create({ data: { x } })        →  Model.create({ x })

// UPDATE
prisma.model.update({ where: { id }, data }) →  Model.findByIdAndUpdate(id, data, { new: true })

// DELETE
prisma.model.delete({ where: { id } })      →  Model.findByIdAndDelete(id)

// COUNT
prisma.model.count({ where: { x } })        →  Model.countDocuments({ x })
```

## 📦 Dependencies

Already added to `packages/database/package.json`:
```json
{
  "dependencies": {
    "mongoose": "^8.0.3"
  }
}
```

## 🗄️ Database Structure

All schemas created in `packages/database/schemas/`:
- user.schema.ts
- wallet.schema.ts
- bet.schema.ts
- seedpair.schema.ts
- transaction.schema.ts
- jackpot.schema.ts
- strategy.schema.ts
- contest.schema.ts
- rakeback.schema.ts
- gameconfig.schema.ts
- usersettings.schema.ts
- userstats.schema.ts
- crash.schema.ts

## 🔐 Connection String

Updated in `.env`:
```env
DATABASE_URL="mongodb://localhost:27017/casinobit"
```

For MongoDB Atlas (cloud):
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/casinobit"
```

## ✨ Key Benefits

1. **Flexible Schema** - Easy to add fields
2. **Horizontal Scaling** - Sharding support
3. **Fast Writes** - Better for high-frequency betting
4. **JSON Native** - Perfect for game data
5. **No Migrations** - Schema changes are instant

## 📝 Notes

- IDs changed from `cuid()` strings to MongoDB `ObjectId`
- Use `.toString()` when returning IDs to frontend
- Transactions use `session.withTransaction()`
- Populate replaces Prisma's include
- Use `.lean()` for read-only queries (faster)

## 🆘 Troubleshooting

**MongoDB won't start:**
```bash
# Create data directory
mkdir C:\data\db

# Start with explicit path
mongod --dbpath="C:\data\db"
```

**Connection refused:**
- Check MongoDB is running
- Verify port 27017 is not blocked
- Check DATABASE_URL in .env

**Transaction errors:**
- MongoDB requires replica set for transactions
- For development, start with: `mongod --replSet rs0`
- Then initialize: `mongosh --eval "rs.initiate()"`
