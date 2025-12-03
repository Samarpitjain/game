# CasinoBit Documentation

## Important Info
- Document all the variables and provide properly commented code
- **Backend:** NodeJs  
- **Frontend:** Any  
- **Design and Theme:** Retro Template (with hint of space and crypto)
- **Current Site Design:** BitDesign (Sample)

### Colours (Hex)
- Primary: `#FF0DB7`
- Secondary: `#FFC100`
- Special: `#73FFD7`
- Alt: `#9D73FF`
- Main Gradient: `#C20DFF` → `#00C3FF` (Linear)
- Alt Gradient: `#FF0D11` → `#FF6A00` (Linear)

Any other retro-modern colours will work.  
All templates should be modifiable.

---

# Core Features (present in all games)

## Demo Mode
Bet 0.

## Manual Bet
- Presets of amount  
- Bet currency set from main site  
- Option to swap between fiat and crypto betting  
- Display fiat or crypto equivalent  

## Amount Input
- Enter Amount  
- ½ ×  
- 2×  
- Max Bet  
- Up/Down Slider  
- Profit on Win (currency swap option)

## Display Modes
- Theatre Mode  
- Full Screen Mode  

## Live Stats
- Profit/Loss  
- Wins / Losses  
- Wagered Amount  
- Reset stats  
- Leaderboard toggle  
- Favourite game (shows on home page)

## Settings
### Animations
- On / Off  

### Hotkeys
- Enable / Disable  
- View hotkeys  

### Sound
- On / Off  
- Volume control  

### Other
- Max Bet toggle (hide if off)  
- Instant Bet toggle  

---

# Fairness Modal
- Edit Client Seed  
- Next Server Seed  
- Active Client Seed  
- Active Server Seed  
- Total bets on current pair  
- Verifier link  

---

# AUTO Bet

### Inputs
- Amount  
- Number of bets (0 = infinite)

### On Win:
- Reset bet  
- Increase or Reduce amount by %  

### On Loss:
- Same as On Win options  

### Stop Conditions:
- Stop on Profit  
- Stop on Loss  

---

# Strategy System

## Default Strategies (included in all games)
- Martingale  
- Delayed Martingale  
- Reverse Martingale  
- Paroli  
- D’Alembert  

Includes “How This Works” modal.

---

## Create Own Strategy
- Title  
- Conditions (+ max limit)  
- Bet Condition  
- Profit Condition  
- Rearrange conditions (top → bottom execution)  
- Edit Strategy  

---

## Upload Script
- Check Script Format (show default example)  
- Upload and save script  

### Make Strategy Public
- Set commission % (Max X%)  
- Strategy ID  
- Strategy settings  
- Fee required to publish  
- Share strategy  

---

## Use Public Strategy
- Strategies with highest ROI listed  
- Strategy settings shown  
- Search by username or ID  
- AUM shown  
- Modal:
  - Amount input  
  - Total bet amount (auto)  
  - Edit strategy parameters  
  - Repeat strategy X times (0 = infinite)

---

# Share Game
- URL  
- Social share links  

---

# Game Description Page
- How to Play  
- Rules  
- Information  
- Description  
- Fairness  
- Game Details  
- House Edge  
- Icon  
- “More” button (details page)  

---

# Leaderboards / History
- My Bets  
- All Bets  
- High Rollers  
- Big Wins  
- Lucky Wins  

---

# Contests
- Daily / Weekly / Currency-based  
- Prize Pool  
- Time Remaining  
- Last Winner  
- Ranking Table:
  - Rank  
  - Username  
  - Wagered / Profit / Loss  
  - Prize  

---

# RakeBack
- Opt in / Opt out  
- Claim Rakeback (per currency)  
- VIP / Premium benefits  

---

# Jackpots
- X% of house edge → jackpot pot  
- Winner takes all if min X$ met (or no minimum)  
- Configurable per game / currency  

### Jackpot Types
- Same for all games  
- Different per game  
- Different per currency  
- Different for game + currency  

### Jackpot Status
- Refilling  
- Ready  
- Mega  
- Calculating Winner  

### Setting
- If user doesn’t bet for X minutes after hitting jackpot → refund  
- Minimum bet amount per currency  

---

# Pages

## Home Page
- Auto-order games based on user preference  
- Categories: Games & PvP  
- User Info:
  - Username  
  - VIP  
  - Level  
  - Premium  
- Search  
- Leaderboard  
- Bonuses  

---

## Limits Page
Separate Minimum & Maximum limits per game and per crypto.  
Bankroll-based limits:
- Max Win %  
- Max Bet %  

Max wins also shown in game description.

---

## Verifier Page
- Overview  
- Implementation  
- Conversions  
- Game Events  
- Unhash Server Seed  
- Calculation breakdown  

---

# Games  
(All include Anti-Cheat where needed)

---

# DICE
- Multiplier  
- Roll Over  
- Win Chance (house edge applied)  
- Ultimate Mode toggle  

### Jackpot Conditions
- Roll 77.77 / 7.77 (with streak options)  
- Win/Lose X bets in a row  
- Random % chance  

---

# Limbo
- Payout  
- Win Chance  

### Jackpot Conditions
- Hit 7.77x / 77.77x  
- Win/Lose streak  
- Random chance  

---

# FastParity (Colour)
- Bet on number  
- Bet on colour  
- Bet Even/Odd  
- Probability table (last 1000)  
- Records  
- History  

### Jackpot Conditions
- Win specific colour X times  
- Win number X times  
- Win combination X times  
- Win/Lose streak  
- Random chance  

---

# Crash (Multiplayer)
- Auto cash out  
- Round stats  

### Jackpot Winner Types
- Highest Bettor  
- Highest Winner  
- Ratio-based distribution  
- Equal distribution  
- Highest loser  
- Closest to 7.77 / 77.77  

### Jackpot Conditions
- Hit multiplier conditions  
- Win/Lose streak  
- Random chance  

---

# Trenball
- Bet: Crash, Red, Green, Moon  
- Round stats  

### Jackpot logic similar to Crash  
(including distribution and conditions)

---

# Solo Crash
- Quick Rise  
- Custom Rise  

### Jackpot Conditions same as Crash  

---

# Plinko
- Risk: Low / Medium / High  
- Rows: 8–16  
- Rewards shown on hover  

## Super Mode
- New seed  
- Special coin placement  
- Same risk/row settings  

### Jackpot
- Same trajectory X times  
- Win/Lose streak  
- Random chance  

---

# Mines
- Grid: 4×4, 5×5, 6×6  
- Pick tile after bet  
- Total profit shown  

### Jackpot
- Random chance on tile  
- Random chance on bomb  
- Streak conditions  

---

# Balloon
- Difficulty: Simple → Expert  
- Random Pump / Specific Pump / Both  

### Jackpot
- Hit X multipliers  
- Pump streaks  
- Random chance  
- Win/Lose streak  

---

# CoinFlip
### Normal
- Heads / Tails  

### Series
- Multi-flip betting  

### Jackpot
- Win/Lose streak (normal)  
- Series streaks  
- Random chance  

---

# Rush
- Difficulty modes  
- Next multiplier-based crossing logic  

### Jackpot
- Hit multipliers  
- Chance per cross  
- Chance per crash  
- Win/Lose streak  

---

# Wheel (Spin Design)
- Risk: Low/Medium/High  
- Segments: 10–50  
- Show chance & profit  

### Jackpot
- Get segment/colour streaks  
- Win/Lose streak  
- Random chance  

---

# Roulette
### Bet Tools
- ½  
- 2×  
- Reset  
- Undo  

### Presets
- Neighbors of 0  
- Orphans  
- Thirds  
- Zero Game  

### Jackpot Conditions
- Colour streaks  
- Odd/Even streaks  
- Green streaks  
- Number streaks  
- Range streaks  
- 2:1 multipliers streaks  
- Random chance  

---

# Keno
- Risk: Low → High  
- Auto pick  
- Show chances  
- Clear table  

### Jackpot
- Hit numbers X times  
- Auto pick wins  
- Win/Lose streak  
- Random chance  

---

# Ludo (PvP)
- 1v1  
- 2v2  
- 1v1v1v1  
- Dice timer  
- Move timer  
- Strong Anti-Cheat  
- Shareable match link  

---

# Chess (PvP)
- Set time / increment  
- Very strong anti-cheat  
- Shareable match link  

---

# HiLo  
# Blackjack  
# Tower  
# Stairs  

(Details similar to other games: fairness, jackpot, stats, etc.)

---

# Data Events

```
events.emit('user-activity', { 
  "user_id", 
  "activity", 
  "req", 
  "brief_desc", 
  "severity", 
  ...meta_data 
});
```

---

# End of Documentation
