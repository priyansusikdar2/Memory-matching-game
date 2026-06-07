import { Card, Difficulty, DifficultyConfig, GameStats } from '../types/game.types';
import { cardIcons } from '../data/cardIcons';

// Difficulty configurations
export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
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

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array - The array to shuffle
 * @returns A new shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generates a shuffled deck of cards based on difficulty
 * @param difficulty - The game difficulty
 * @returns Array of shuffled cards
 */
export const generateCards = (difficulty: Difficulty): Card[] => {
  const config = difficultyConfigs[difficulty];
  const selectedIcons = [...cardIcons].slice(0, config.pairs);
  
  const cards: Card[] = [];
  selectedIcons.forEach((icon, index) => {
    // Create two cards for each icon (pair)
    cards.push(
      { 
        id: index * 2, 
        icon: icon.value, 
        status: 'default', 
        value: icon.value,
        matchedAt: undefined,
        flippedAt: undefined
      },
      { 
        id: index * 2 + 1, 
        icon: icon.value, 
        status: 'default', 
        value: icon.value,
        matchedAt: undefined,
        flippedAt: undefined
      }
    );
  });
  
  return shuffleArray(cards);
};

/**
 * Calculates the score based on moves and time
 * @param moves - Number of moves made
 * @param timeElapsed - Time elapsed in seconds
 * @param difficulty - Game difficulty
 * @returns Calculated score
 */
export const calculateScore = (moves: number, timeElapsed: number, difficulty: Difficulty): number => {
  const config = difficultyConfigs[difficulty];
  const baseScore = 1000;
  
  // Calculate penalties and bonuses
  const movePenalty = moves * config.movePenalty;
  const timeBonus = Math.max(0, config.timeBonus * 10 - timeElapsed);
  const efficiencyBonus = Math.max(0, (config.pairs * 2 - moves) * 5);
  
  // Calculate final score
  let score = baseScore - movePenalty + timeBonus + efficiencyBonus;
  
  // Apply difficulty multiplier
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };
  
  score = Math.floor(score * difficultyMultiplier[difficulty]);
  
  // Ensure score is not negative
  return Math.max(0, score);
};

/**
 * Checks if the game is won
 * @param matchedPairs - Number of matched pairs
 * @param difficulty - Game difficulty
 * @returns True if all pairs are matched
 */
export const checkWinCondition = (matchedPairs: number, difficulty: Difficulty): boolean => {
  const config = difficultyConfigs[difficulty];
  return matchedPairs === config.pairs;
};

/**
 * Calculates game statistics
 * @param moves - Total moves made
 * @param matchedPairs - Total matched pairs
 * @param timeElapsed - Time elapsed in seconds
 * @param score - Current score
 * @returns Detailed game statistics
 */
export const calculateGameStats = (
  moves: number, 
  matchedPairs: number, 
  timeElapsed: number, 
  score: number
): GameStats => {
  const accuracy = moves > 0 ? (matchedPairs / (moves / 2)) * 100 : 0;
  const efficiency = moves > 0 ? (matchedPairs / moves) * 100 : 0;
  
  return {
    moves,
    matchedPairs,
    timeElapsed,
    score,
    accuracy: Math.min(100, Math.round(accuracy)),
    efficiency: Math.round(efficiency)
  };
};

/**
 * Formats time from seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formats time with hours for longer games
 * @param seconds - Time in seconds
 * @returns Formatted time string (HH:MM:SS or MM:SS)
 */
export const formatTimeLong = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates performance rating based on score
 * @param score - Final game score
 * @returns Performance rating
 */
export const getPerformanceRating = (score: number): 'excellent' | 'good' | 'average' | 'poor' => {
  if (score >= 800) return 'excellent';
  if (score >= 600) return 'good';
  if (score >= 400) return 'average';
  return 'poor';
};

/**
 * Gets performance message based on score
 * @param score - Final game score
 * @returns Object with message and emoji
 */
export const getPerformanceMessage = (score: number): { message: string; emoji: string; color: string } => {
  if (score >= 900) {
    return { message: 'Perfect Memory!', emoji: '👑', color: 'from-yellow-400 to-yellow-600' };
  } else if (score >= 750) {
    return { message: 'Excellent!', emoji: '🎉', color: 'from-purple-400 to-pink-600' };
  } else if (score >= 600) {
    return { message: 'Great Job!', emoji: '👍', color: 'from-blue-400 to-blue-600' };
  } else if (score >= 400) {
    return { message: 'Good Effort!', emoji: '💪', color: 'from-green-400 to-green-600' };
  } else {
    return { message: 'Keep Practicing!', emoji: '📚', color: 'from-gray-400 to-gray-600' };
  }
};

/**
 * Saves game state to localStorage
 * @param key - Storage key
 * @param data - Data to save
 * @returns Success status
 */
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Loads game state from localStorage
 * @param key - Storage key
 * @returns Loaded data or null
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

/**
 * Clears saved game data
 * @param key - Storage key to clear
 */
export const clearSavedGame = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear saved game:', error);
  }
};

/**
 * Validates if a saved game is still valid
 * @param savedData - Saved game data
 * @param maxAge - Maximum age in milliseconds (default: 24 hours)
 * @returns True if valid
 */
export const isValidSavedGame = (savedData: { timestamp: number }, maxAge: number = 24 * 60 * 60 * 1000): boolean => {
  const now = Date.now();
  return now - savedData.timestamp < maxAge;
};

/**
 * Generates a unique ID
 * @returns Unique ID string
 */
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to limit function calls
 * @param func - Function to throttle
 * @param limit - Limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Calculates the optimal grid size based on number of cards
 * @param cardCount - Number of cards
 * @returns Object with columns and rows
 */
export const calculateGridSize = (cardCount: number): { cols: number; rows: number } => {
  const cols = Math.ceil(Math.sqrt(cardCount));
  const rows = Math.ceil(cardCount / cols);
  return { cols, rows };
};

/**
 * Checks if two cards are a match
 * @param card1 - First card
 * @param card2 - Second card
 * @returns True if cards match
 */
export const areCardsMatching = (card1: Card, card2: Card): boolean => {
  return card1.value === card2.value && card1.id !== card2.id;
};

/**
 * Calculates the number of remaining pairs
 * @param cards - Array of cards
 * @returns Number of remaining pairs
 */
export const getRemainingPairs = (cards: Card[]): number => {
  const unmatchedCards = cards.filter(card => card.status !== 'matched');
  return unmatchedCards.length / 2;
};

/**
 * Calculates game progress percentage
 * @param matchedPairs - Number of matched pairs
 * @param totalPairs - Total number of pairs
 * @returns Progress percentage
 */
export const calculateProgress = (matchedPairs: number, totalPairs: number): number => {
  return (matchedPairs / totalPairs) * 100;
};

/**
 * Creates a deep copy of an object
 * @param obj - Object to copy
 * @returns Deep copied object
 */
export const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Measures the time taken to execute a function
 * @param fn - Function to measure
 * @returns Object with result and execution time
 */
export const measureExecutionTime = <T>(fn: () => T): { result: T; executionTime: number } => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, executionTime: end - start };
};

/**
 * Retries an async function a specified number of times
 * @param fn - Async function to retry
 * @param retries - Number of retries
 * @param delay - Delay between retries in milliseconds
 * @returns Promise with function result
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
};

/**
 * Creates a memoized version of a function
 * @param fn - Function to memoize
 * @returns Memoized function
 */
export const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
  const cache = new Map();
  return (...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates a string to a specified length
 * @param str - String to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated string
 */
export const truncateString = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Generates random color in hex format
 * @returns Random hex color
 */
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Checks if the device is mobile
 * @returns True if device is mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detects if the user is on a touch device
 * @returns True if touch device
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Gets the appropriate card size based on screen width
 * @returns Card size class
 */
export const getResponsiveCardSize = (): string => {
  const width = window.innerWidth;
  if (width < 640) return 'w-16 h-16 text-2xl';
  if (width < 768) return 'w-20 h-20 text-3xl';
  if (width < 1024) return 'w-24 h-24 text-4xl';
  return 'w-28 h-28 text-5xl';
};

/**
 * Calculates the best score between two games
 * @param score1 - First score
 * @param score2 - Second score
 * @returns Best score
 */
export const getBestScore = (score1: number, score2: number): number => {
  return Math.max(score1, score2);
};

/**
 * Calculates the average of an array of numbers
 * @param numbers - Array of numbers
 * @returns Average value
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

/**
 * Finds the maximum value in an array
 * @param numbers - Array of numbers
 * @returns Maximum value
 */
export const findMax = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
};

/**
 * Finds the minimum value in an array
 * @param numbers - Array of numbers
 * @returns Minimum value
 */
export const findMin = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
};

/**
 * Groups an array by a key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Grouped object
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Creates a range of numbers
 * @param start - Start number
 * @param end - End number
 * @returns Array of numbers
 */
export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Sleep for a specified duration
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Downloads a file as JSON
 * @param data - Data to download
 * @param filename - Filename
 */
export const downloadAsJson = (data: unknown, filename: string): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Parses query parameters from URL
 * @returns Object with query parameters
 */
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Builds a query string from an object
 * @param params - Object with parameters
 * @returns Query string
 */
export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};

// Export all utility functions as a single object
export const GameUtils = {
  shuffleArray,
  generateCards,
  calculateScore,
  checkWinCondition,
  calculateGameStats,
  formatTime,
  formatTimeLong,
  getPerformanceRating,
  getPerformanceMessage,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearSavedGame,
  isValidSavedGame,
  generateUniqueId,
  debounce,
  throttle,
  calculateGridSize,
  areCardsMatching,
  getRemainingPairs,
  calculateProgress,
  deepCopy,
  measureExecutionTime,
  retry,
  memoize,
  isValidEmail,
  capitalizeFirstLetter,
  truncateString,
  getRandomColor,
  isMobileDevice,
  isTouchDevice,
  getResponsiveCardSize,
  getBestScore,
  calculateAverage,
  findMax,
  findMin,
  groupBy,
  range,
  sleep,
  copyToClipboard,
  downloadAsJson,
  getQueryParams,
  buildQueryString
};

export default GameUtils;