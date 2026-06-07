// Difficulty configurations
export const difficultyConfig = {
  easy: { pairs: 6, gridCols: 3, timeBonus: 50, movePenalty: 2, countdownTime: 120 },
  medium: { pairs: 8, gridCols: 4, timeBonus: 40, movePenalty: 3, countdownTime: 90 },
  hard: { pairs: 12, gridCols: 4, timeBonus: 30, movePenalty: 5, countdownTime: 60 }
};

// Calculate score based on moves, matches, time, and difficulty
export const calculateScore = (
  moves: number, 
  matches: number, 
  timeElapsed: number, 
  difficulty: keyof typeof difficultyConfig,
  timerMode: 'countup' | 'countdown' = 'countup'
): number => {
  const config = difficultyConfig[difficulty];
  let newScore = 0;
  
  if (timerMode === 'countup') {
    const baseScore = 1000;
    const movePenalty = moves * config.movePenalty;
    const timeBonus = Math.max(0, config.timeBonus * 10 - timeElapsed);
    const matchBonus = matches * 50;
    newScore = baseScore - movePenalty + timeBonus + matchBonus;
  } else {
    // Countdown mode: more time left = higher score
    const baseScore = 1000;
    const movePenalty = moves * config.movePenalty;
    const timeBonus = timeElapsed * 10;
    const matchBonus = matches * 50;
    newScore = baseScore - movePenalty + timeBonus + matchBonus;
  }
  
  return Math.max(0, Math.floor(newScore));
};

// Format time from seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format time with hours for longer games
export const formatTimeLong = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Get performance rating based on score
export const getPerformanceRating = (score: number): 'excellent' | 'good' | 'average' | 'poor' => {
  if (score >= 800) return 'excellent';
  if (score >= 600) return 'good';
  if (score >= 400) return 'average';
  return 'poor';
};

// Calculate game progress percentage
export const calculateProgress = (matchedPairs: number, totalPairs: number): number => {
  return (matchedPairs / totalPairs) * 100;
};

// Get remaining pairs count
export const getRemainingPairs = (cards: any[]): number => {
  const unmatchedCards = cards.filter(card => !card.isMatched);
  return unmatchedCards.length / 2;
};

// Check if game is complete
export const isGameComplete = (matchedPairs: number, totalPairs: number): boolean => {
  return matchedPairs === totalPairs;
};