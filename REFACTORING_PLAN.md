# Game Components Refactoring Plan

## Phase 1: Universal Game Page Component

### 1.1 Enhanced GameLayout Component
```typescript
// apps/frontend/src/components/layout/UniversalGameLayout.tsx
interface UniversalGameLayoutProps<T = any> {
  gameType: GameType;
  gameTitle: string;
  gameParams: T;
  onGameParamsChange: (params: T) => void;
  gameSpecificContent: ReactNode;
  betModes?: ('manual' | 'auto' | 'strategy')[];
  currency?: string;
  customActions?: ReactNode;
}
```

### 1.2 Universal Game Hook
```typescript
// apps/frontend/src/hooks/useUniversalGame.ts
export function useUniversalGame<T>(config: {
  gameType: GameType;
  currency?: string;
  initialGameParams: T;
}) {
  // All common game logic consolidated here
}
```

## Phase 2: Game-Specific Components Standardization

### 2.1 Standardized Game Controls Interface
```typescript
interface GameControlsProps<T> {
  params: T;
  onChange: (params: T) => void;
  disabled?: boolean;
  loading?: boolean;
}
```

### 2.2 Result Display Component
```typescript
// apps/frontend/src/components/games/common/GameResult.tsx
interface GameResultProps {
  result: any;
  amount: number;
  gameType: GameType;
  onNewGame?: () => void;
}
```

## Phase 3: Shared Game State Management

### 3.1 Game Store
```typescript
// apps/frontend/src/store/useUniversalGameStore.ts
interface GameState {
  balance: number;
  stats: GameStats;
  autoBetActive: boolean;
  loading: boolean;
  result: any;
}
```

## Phase 4: Template-Based Game Pages

### 4.1 Game Page Template
```typescript
// apps/frontend/src/components/templates/GamePageTemplate.tsx
export function GamePageTemplate<T>({
  gameType,
  gameTitle,
  GameControlsComponent,
  initialGameParams,
  betModes = ['manual', 'auto', 'strategy'],
  currency = 'USD'
}: GamePageTemplateProps<T>) {
  // Universal game page logic
}
```

### 4.2 Simplified Game Pages
```typescript
// apps/frontend/src/app/game/dice/page.tsx (After refactoring)
export default function DicePage() {
  return (
    <GamePageTemplate
      gameType="DICE"
      gameTitle="Dice"
      GameControlsComponent={DiceGameControls}
      initialGameParams={{ multiplier: 2.0, winChance: 49.5, target: 50.5, isOver: true }}
    />
  );
}
```

## Expected Results

### Code Reduction
- **Before**: ~800 lines per game × 17 games = 13,600 lines
- **After**: ~50 lines per game × 17 games = 850 lines
- **Savings**: ~12,750 lines (94% reduction)

### Maintenance Benefits
- Single source of truth for game logic
- Consistent UI/UX across all games
- Easier to add new features globally
- Reduced bug surface area
- Faster development of new games

### File Structure After Refactoring
```
apps/frontend/src/
├── components/
│   ├── templates/
│   │   └── GamePageTemplate.tsx          # Universal game page
│   ├── games/
│   │   ├── common/
│   │   │   ├── GameResult.tsx           # Reusable result display
│   │   │   ├── GameHeader.tsx           # Reusable header
│   │   │   └── GameStats.tsx            # Reusable stats
│   │   └── [game]/
│   │       └── [Game]Controls.tsx       # Game-specific controls only
│   └── layout/
│       └── UniversalGameLayout.tsx      # Enhanced layout
├── hooks/
│   └── useUniversalGame.ts              # All game logic
└── app/game/[game]/
    └── page.tsx                         # Minimal game pages (50 lines each)
```