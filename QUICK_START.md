# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- MongoDB running
- Redis running

## Installation

1. **Install dependencies** (if not already done)
```bash
npm install
```

2. **Setup environment variables**

Create `.env` in `apps/backend`:
```env
DATABASE_URL="mongodb://localhost:27017/casinobit"
REDIS_HOST="localhost"
REDIS_PORT="6379"
JWT_SECRET="your-super-secret-jwt-key"
PORT="3001"
FRONTEND_URL="http://localhost:3000"
```

Create `.env.local` in `apps/frontend`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

3. **Setup database**
```bash
npm run db:push
```

## Start Servers

### Terminal 1 - Backend
```bash
cd apps/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd apps/frontend
npm run dev
```

## Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Test the New Games

### Phase 1 Games
1. **Tower**: http://localhost:3000/game/tower
2. **Stairs**: http://localhost:3000/game/stairs
3. **HiLo**: http://localhost:3000/game/hilo

### Phase 2 Game
4. **Blackjack**: http://localhost:3000/game/blackjack

### Phase 3 & 4 Games
5. **Crash**: http://localhost:3000/game/crash
6. **Trenball**: http://localhost:3000/game/trenball

## First Time Setup

1. **Register an account**: http://localhost:3000/register
2. **Login**: http://localhost:3000/login
3. **Add balance**: Go to Wallet page and add USD balance
4. **Play games**: Navigate to any game and start playing!

## Clear Active Sessions (if needed)

If you get "Active game exists" error, run in browser console:

```javascript
// For Tower
fetch('http://localhost:3001/api/tower/session', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})

// For Stairs
fetch('http://localhost:3001/api/stairs/session', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})

// For HiLo
fetch('http://localhost:3001/api/hilo/session', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})

// For Blackjack
fetch('http://localhost:3001/api/blackjack/session', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod --version`
- Check Redis is running: `redis-cli ping`
- Verify environment variables in `apps/backend/.env`

### Frontend won't start
- Verify environment variables in `apps/frontend/.env.local`
- Clear Next.js cache: `rm -rf apps/frontend/.next`

### Games not loading
- Check browser console for errors
- Verify backend is running on port 3001
- Check network tab for failed API calls

### WebSocket not connecting (Crash/Trenball)
- Verify Socket.IO is initialized in backend
- Check browser console for WebSocket errors
- Try refreshing the page

## Game-Specific Testing

### Tower/Stairs
1. Select difficulty (8/10/12/15)
2. Enter bet amount
3. Click "Bet"
4. Click tiles to reveal
5. Cash out or continue

### HiLo
1. Enter bet amount
2. Click "Bet"
3. Predict Higher/Lower/Skip
4. Cash out or continue

### Blackjack
1. Enter bet amount
2. Click "Bet"
3. Use Hit/Stand/Double buttons
4. See result

### Crash
1. Enter bet amount and auto cashout
2. Wait for betting phase
3. Click "Place Bet"
4. Click "Cash Out" or wait for auto cashout

### Trenball
1. Enter bet amount
2. Wait for betting phase
3. Click on Crash/Red/Green/Moon
4. Wait for result

## Next Steps

- Test all 21 games
- Verify balance updates correctly
- Check provably fair seeds work
- Test multiplayer games with multiple browsers
- Optional: Implement Ludo & Chess (40h+ each)

## Support

For issues:
1. Check `IMPLEMENTATION_COMPLETE.md` for details
2. Check `TEST_PHASE1.md` for testing guide
3. Review backend logs for errors
4. Check browser console for frontend errors

---

Happy Gaming! 🎮
