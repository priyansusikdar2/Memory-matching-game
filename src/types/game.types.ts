// Card status types
export type CardStatus = 'default' | 'flipped' | 'matched';

// Game status types
export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed';

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Animation types
export type AnimationType = 'flip' | 'match' | 'shake' | 'glow' | 'float';
export type AnimationDirection = 'forward' | 'backward' | 'none';

// Sound effect types
export type SoundEffect = 'flip' | 'match' | 'mismatch' | 'victory' | 'click' | 'gameOver';

// Card interface
export interface Card {
  id: number;
  icon: string;
  status: CardStatus;
  value: string;
  matchedAt?: number; // Timestamp when card was matched
  flippedAt?: number; // Timestamp when card was flipped
  animation?: AnimationType;
}

// Game state interface
export interface GameState {
  cards: Card[];
  moves: number;
  matchedPairs: number;
  isProcessing: boolean;
  firstSelectedCard: Card | null;
  secondSelectedCard: Card | null;
  gameStatus: GameStatus;
  score: number;
  startedAt?: number;
  completedAt?: number;
  lastMoveAt?: number;
}

// Game statistics interface
export interface GameStats {
  moves: number;
  matchedPairs: number;
  timeElapsed: number;
  score: number;
  accuracy?: number;
  efficiency?: number;
  averageMoveTime?: number;
  longestStreak?: number;
  currentStreak?: number;
}

// Detailed game statistics
export interface DetailedGameStats extends GameStats {
  totalTime: number;
  fastestMatch: number;
  slowestMatch: number;
  flipHistory: FlipRecord[];
  matchHistory: MatchRecord[];
  performanceRating: 'excellent' | 'good' | 'average' | 'poor';
}

// Flip record for tracking
export interface FlipRecord {
  cardId: number;
  timestamp: number;
  duration: number;
}

// Match record for tracking
export interface MatchRecord {
  card1: Card;
  card2: Card;
  matchedAt: number;
  timeToMatch: number;
  moveNumber: number;
}

// Difficulty configuration
export interface DifficultyConfig {
  pairs: number;
  gridCols: number;
  gridRows: number;
  timeBonus: number;
  movePenalty: number;
  maxMoves?: number;
  timeLimit?: number;
  cardSize: 'small' | 'medium' | 'large';
  gapSize: 'small' | 'medium' | 'large';
}

// Player settings
export interface PlayerSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  highContrast: boolean;
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
  difficulty: Difficulty;
  cardBack: 'default' | 'pattern' | 'solid' | 'custom';
}

// Player profile
export interface PlayerProfile {
  id: string;
  name: string;
  totalGames: number;
  wins: number;
  losses: number;
  bestScore: number;
  bestTime: number;
  bestMoves: number;
  totalMatches: number;
  totalMoves: number;
  achievements: Achievement[];
  createdAt: number;
  lastPlayedAt: number;
}

// Achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
  progress: number;
  requiredProgress: number;
  isSecret: boolean;
}

// Achievement types
export type AchievementCategory = 
  | 'speed' 
  | 'accuracy' 
  | 'streak' 
  | 'mastery' 
  | 'special';

// Leaderboard entry
export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  moves: number;
  timeElapsed: number;
  difficulty: Difficulty;
  completedAt: number;
  rank?: number;
}

// Game session
export interface GameSession {
  id: string;
  difficulty: Difficulty;
  startTime: number;
  endTime?: number;
  moves: number;
  score: number;
  completed: boolean;
  cardsMatched: number;
  flipCount: number;
  accuracy: number;
  averageResponseTime: number;
}

// Card theme
export interface CardTheme {
  id: string;
  name: string;
  icons: string[];
  backFace: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Animation configuration
export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  type: AnimationType;
  direction: AnimationDirection;
}

// Event callbacks
export interface GameEventCallbacks {
  onGameStart?: () => void;
  onGamePause?: () => void;
  onGameResume?: () => void;
  onGameComplete?: (stats: GameStats) => void;
  onCardFlip?: (card: Card) => void;
  onMatch?: (card1: Card, card2: Card, moveNumber: number) => void;
  onMismatch?: (card1: Card, card2: Card) => void;
  onMove?: (moveNumber: number) => void;
  onScoreUpdate?: (score: number) => void;
  onTimeUpdate?: (timeElapsed: number) => void;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

// Utility type for partial game state updates
export type GameStateUpdate = Partial<GameState>;

// Type guard for card status
export const isCardFlipped = (card: Card): boolean => {
  return card.status === 'flipped';
};

export const isCardMatched = (card: Card): boolean => {
  return card.status === 'matched';
};

export const isCardPlayable = (card: Card): boolean => {
  return card.status === 'default';
};

// Type guard for game completion
export const isGameComplete = (state: GameState): boolean => {
  return state.gameStatus === 'completed';
};

export const isGamePlaying = (state: GameState): boolean => {
  return state.gameStatus === 'playing';
};

export const isGamePaused = (state: GameState): boolean => {
  return state.gameStatus === 'paused';
};

// Helper function to create a new card
export const createCard = (id: number, icon: string, value: string): Card => ({
  id,
  icon,
  value,
  status: 'default',
  matchedAt: undefined,
  flippedAt: undefined
});

// Helper function to create initial game state
export const createInitialGameState = (cards: Card[]): GameState => ({
  cards,
  moves: 0,
  matchedPairs: 0,
  isProcessing: false,
  firstSelectedCard: null,
  secondSelectedCard: null,
  gameStatus: 'idle',
  score: 0,
  startedAt: undefined,
  completedAt: undefined,
  lastMoveAt: undefined
});

// Difficulty configuration map
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    pairs: 6,
    gridCols: 3,
    gridRows: 4,
    timeBonus: 50,
    movePenalty: 2,
    maxMoves: 50,
    timeLimit: 300,
    cardSize: 'large',
    gapSize: 'large'
  },
  medium: {
    pairs: 8,
    gridCols: 4,
    gridRows: 4,
    timeBonus: 40,
    movePenalty: 3,
    maxMoves: 40,
    timeLimit: 240,
    cardSize: 'medium',
    gapSize: 'medium'
  },
  hard: {
    pairs: 12,
    gridCols: 4,
    gridRows: 6,
    timeBonus: 30,
    movePenalty: 5,
    maxMoves: 30,
    timeLimit: 180,
    cardSize: 'small',
    gapSize: 'small'
  }
};

// Default player settings
export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  soundEnabled: true,
  musicEnabled: false,
  animationsEnabled: true,
  vibrationEnabled: false,
  darkMode: false,
  highContrast: false,
  language: 'en',
  difficulty: 'medium',
  cardBack: 'default'
};

// Pre-defined achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    unlockedAt: 0,
    progress: 0,
    requiredProgress: 1,
    isSecret: false
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a game in under 60 seconds',
    icon: '⚡',
    unlockedAt: 0,
    progress: 0,
    requiredProgress: 1,
    isSecret: false
  },
  {
    id: 'perfect_match',
    name: 'Perfect Match',
    description: 'Achieve 100% accuracy in a game',
    icon: '🎯',
    unlockedAt: 0,
    progress: 0,
    requiredProgress: 1,
    isSecret: false
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Complete 100 games',
    icon: '🏃',
    unlockedAt: 0,
    progress: 0,
    requiredProgress: 100,
    isSecret: false
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Score over 900 points on Hard difficulty',
    icon: '👑',
    unlockedAt: 0,
    progress: 0,
    requiredProgress: 1,
    isSecret: true
  }
];

// Card themes
export const CARD_THEMES: CardTheme[] = [
  {
    id: 'animals',
    name: 'Animals',
    icons: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
    backFace: '🎴',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B'
    }
  },
  {
    id: 'food',
    name: 'Food',
    icons: ['🍎', '🍕', '🍔', '🌮', '🍣', '🍩', '🍪', '🍫', '🍦', '🍉', '🍒', '🥑'],
    backFace: '🍽️',
    colors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#10B981'
    }
  },
  {
    id: 'sports',
    name: 'Sports',
    icons: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥊', '⛸️', '🎯', '🏊'],
    backFace: '🏆',
    colors: {
      primary: '#3B82F6',
      secondary: '#06B6D4',
      accent: '#8B5CF6'
    }
  },
  {
    id: 'space',
    name: 'Space',
    icons: ['🌍', '🌙', '⭐', '🪐', '🚀', '👽', '🛸', '🌌', '🔭', '☄️', '🌠', '🛰️'],
    backFace: '🌠',
    colors: {
      primary: '#6366F1',
      secondary: '#A855F7',
      accent: '#EC4899'
    }
  }
];

// Type for component props with dark mode support
export interface WithDarkMode {
  isDarkMode?: boolean;
}

// Type for component props with className support
export interface WithClassName {
  className?: string;
}

// Type for component props with children
export interface WithChildren {
  children?: React.ReactNode;
}

// Combined prop type for common components
export interface BaseComponentProps extends WithDarkMode, WithClassName, WithChildren {}

// Event handler types
export type CardClickHandler = (card: Card) => void;
export type DifficultyChangeHandler = (difficulty: Difficulty) => void;
export type GameActionHandler = () => void;
export type ScoreUpdateHandler = (score: number) => void;
export type TimeUpdateHandler = (time: number) => void;

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Save game data structure
export interface SavedGameData {
  version: string;
  difficulty: Difficulty;
  gameState: GameState;
  timestamp: number;
  timeElapsed: number;
  moveHistory: MatchRecord[];
}

// API response types (for future backend integration)
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof LeaderboardEntry;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Redux state types (if using Redux in the future)
export interface RootState {
  game: GameState;
  settings: PlayerSettings;
  profile: PlayerProfile;
  leaderboard: LeaderboardEntry[];
}

// Context types (for React Context API)
export interface GameContextType {
  gameState: GameState;
  stats: GameStats;
  settings: PlayerSettings;
  dispatch: React.Dispatch<GameAction>;
  updateSettings: (settings: Partial<PlayerSettings>) => void;
}

export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'FLIP_CARD'; payload: Card }
  | { type: 'MATCH_CARDS'; payload: { card1: Card; card2: Card } }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'COMPLETE_GAME' }
  | { type: 'LOAD_SAVED_GAME'; payload: GameState };

// Utility type for nullable values
export type Nullable<T> = T | null;

// Utility type for optional values
export type Optional<T> = T | undefined;

// Utility type for readonly arrays
export type ReadonlyArray<T> = readonly T[];

// Utility type for mutable arrays
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};