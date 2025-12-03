# Quick Start Guide

Get CasinoBit running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL running on localhost:5432
- Redis running on localhost:6379

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/casinobit"

# 3. Generate Prisma client
npm run db:generate

# 4. Create database tables
npm run db:push

# 5. Start development servers
npm run dev
```

## Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## First Steps

1. **Register an Account**
   - Go to http://localhost:3000
   - Click "Register"
   - Create your account

2. **Add Test Balance**
   - Use the wallet API to add test funds:
   ```bash
   curl -X POST http://localhost:3001/api/wallet/add \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"currency": "USD", "amount": 1000}'
   ```

3. **Play a Game**
   - Navigate to any game (e.g., Dice)
   - Set your bet amount
   - Click "Bet" to play

4. **Try Demo Mode**
   - Set bet amount to 0
   - Play without using real balance

5. **Enable Auto-Bet**
   - Click "Auto" tab
   - Configure number of bets
   - Set win/loss conditions
   - Start auto-betting

## Testing the Fairness System

1. **View Your Seeds**
   - Click "Fairness" button in any game
   - See your current server seed hash and client seed

2. **Change Client Seed**
   - Enter a new client seed
   - This will rotate your seed pair

3. **Verify a Bet**
   - Go to http://localhost:3000/verifier
   - Enter a bet ID
   - See the complete calculation

## Admin Access

To create an admin user, update the database directly:

```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your@email.com';
```

Then access admin features at http://localhost:3000/admin

## Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production
npm run start

# View database
npm run db:studio

# Reset database
npm run db:push -- --force-reset
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -h localhost -U postgres

# Create database if it doesn't exist
createdb casinobit
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Should return: PONG
```

## Next Steps

- Read the [full documentation](./README.md)
- Learn about [provably fair system](./docs/FAIRNESS.md)
- Check [installation guide](./docs/INSTALLATION.md)
- Explore the [API documentation](./docs/API.md)

## Need Help?

- Check the logs in the terminal
- Review error messages carefully
- Ensure all prerequisites are installed
- Verify environment variables are set correctly

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **Database Changes**: Run `npm run db:push` after schema changes
3. **API Testing**: Use Postman or curl to test endpoints
4. **Debugging**: Check browser console and terminal logs

## Production Deployment

For production deployment, see [INSTALLATION.md](./docs/INSTALLATION.md)

---

Happy coding! 🎮🚀
