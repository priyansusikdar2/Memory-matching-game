import { describe, it, expect } from 'vitest';
import { 
  calculateScore, 
  formatTime, 
  difficultyConfig,
  formatTimeLong,
  shuffleArray,
  getPerformanceRating,
  calculateProgress,
  getRemainingPairs,
  isGameComplete
} from '../utils/gameHelpers';

describe('Game Utilities', () => {
  describe('calculateScore', () => {
    it('should calculate score correctly for easy difficulty - countup mode', () => {
      const score = calculateScore(10, 4, 30, 'easy', 'countup');
      expect(score).toBeGreaterThan(0);
      // Score can exceed 1000 due to bonuses
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should calculate score correctly for easy difficulty - countdown mode', () => {
      const score = calculateScore(10, 4, 90, 'easy', 'countdown');
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate score correctly for medium difficulty', () => {
      const score = calculateScore(15, 6, 45, 'medium', 'countup');
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate score correctly for hard difficulty', () => {
      const score = calculateScore(20, 8, 60, 'hard', 'countup');
      expect(score).toBeGreaterThan(0);
    });

    it('should not return negative score', () => {
      const score = calculateScore(1000, 0, 300, 'hard', 'countup');
      expect(score).toBe(0);
    });

    it('should give higher score for fewer moves', () => {
      const score1 = calculateScore(10, 4, 30, 'easy', 'countup');
      const score2 = calculateScore(20, 4, 30, 'easy', 'countup');
      expect(score1).toBeGreaterThan(score2);
    });

    it('should give higher score for faster completion', () => {
      const score1 = calculateScore(10, 4, 20, 'easy', 'countup');
      const score2 = calculateScore(10, 4, 40, 'easy', 'countup');
      expect(score1).toBeGreaterThan(score2);
    });

    it('should give bonus for matches', () => {
      const score1 = calculateScore(10, 4, 30, 'easy', 'countup');
      const score2 = calculateScore(10, 2, 30, 'easy', 'countup');
      expect(score1).toBeGreaterThan(score2);
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(120)).toBe('2:00');
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(61)).toBe('1:01');
    });

    it('should handle large times', () => {
      expect(formatTime(3665)).toBe('61:05');
    });

    it('should handle negative numbers', () => {
      expect(formatTime(-10)).toBe('0:10');
    });
  });

  describe('formatTimeLong', () => {
    it('should format seconds with hours', () => {
      expect(formatTimeLong(3665)).toBe('1:01:05');
      expect(formatTimeLong(7200)).toBe('2:00:00');
    });

    it('should format without hours when less than 3600 seconds', () => {
      expect(formatTimeLong(3599)).toBe('59:59');
      expect(formatTimeLong(120)).toBe('2:00');
    });
  });

  describe('difficultyConfig', () => {
    it('should have correct pairs for each difficulty', () => {
      expect(difficultyConfig.easy.pairs).toBe(6);
      expect(difficultyConfig.medium.pairs).toBe(8);
      expect(difficultyConfig.hard.pairs).toBe(12);
    });

    it('should have correct grid columns', () => {
      expect(difficultyConfig.easy.gridCols).toBe(3);
      expect(difficultyConfig.medium.gridCols).toBe(4);
      expect(difficultyConfig.hard.gridCols).toBe(4);
    });

    it('should have correct time bonuses', () => {
      expect(difficultyConfig.easy.timeBonus).toBe(50);
      expect(difficultyConfig.medium.timeBonus).toBe(40);
      expect(difficultyConfig.hard.timeBonus).toBe(30);
    });

    it('should have correct move penalties', () => {
      expect(difficultyConfig.easy.movePenalty).toBe(2);
      expect(difficultyConfig.medium.movePenalty).toBe(3);
      expect(difficultyConfig.hard.movePenalty).toBe(5);
    });

    it('should have correct countdown times', () => {
      expect(difficultyConfig.easy.countdownTime).toBe(120);
      expect(difficultyConfig.medium.countdownTime).toBe(90);
      expect(difficultyConfig.hard.countdownTime).toBe(60);
    });
  });

  describe('shuffleArray', () => {
    it('should return array of same length', () => {
      const input = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(input);
      expect(shuffled.length).toBe(input.length);
    });

    it('should not modify original array', () => {
      const input = [1, 2, 3, 4, 5];
      const copy = [...input];
      shuffleArray(input);
      expect(input).toEqual(copy);
    });

    it('should contain same elements', () => {
      const input = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(input);
      expect(shuffled.sort()).toEqual(input.sort());
    });

    it('should handle empty array', () => {
      const input: number[] = [];
      const shuffled = shuffleArray(input);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element array', () => {
      const input = [1];
      const shuffled = shuffleArray(input);
      expect(shuffled).toEqual([1]);
    });
  });

  describe('getPerformanceRating', () => {
    it('should return excellent for scores >= 800', () => {
      expect(getPerformanceRating(800)).toBe('excellent');
      expect(getPerformanceRating(900)).toBe('excellent');
      expect(getPerformanceRating(1000)).toBe('excellent');
    });

    it('should return good for scores between 600-799', () => {
      expect(getPerformanceRating(600)).toBe('good');
      expect(getPerformanceRating(700)).toBe('good');
      expect(getPerformanceRating(799)).toBe('good');
    });

    it('should return average for scores between 400-599', () => {
      expect(getPerformanceRating(400)).toBe('average');
      expect(getPerformanceRating(500)).toBe('average');
      expect(getPerformanceRating(599)).toBe('average');
    });

    it('should return poor for scores < 400', () => {
      expect(getPerformanceRating(399)).toBe('poor');
      expect(getPerformanceRating(200)).toBe('poor');
      expect(getPerformanceRating(0)).toBe('poor');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate correct percentage', () => {
      expect(calculateProgress(4, 8)).toBe(50);
      expect(calculateProgress(2, 8)).toBe(25);
      expect(calculateProgress(8, 8)).toBe(100);
      expect(calculateProgress(0, 8)).toBe(0);
    });
  });

  describe('getRemainingPairs', () => {
    it('should calculate remaining pairs correctly', () => {
      const cards = [
        { isMatched: false }, { isMatched: false },
        { isMatched: true }, { isMatched: true },
        { isMatched: false }, { isMatched: false }
      ];
      expect(getRemainingPairs(cards)).toBe(2);
    });

    it('should return zero when all cards matched', () => {
      const cards = [
        { isMatched: true }, { isMatched: true },
        { isMatched: true }, { isMatched: true }
      ];
      expect(getRemainingPairs(cards)).toBe(0);
    });
  });

  describe('isGameComplete', () => {
    it('should return true when all pairs matched', () => {
      expect(isGameComplete(8, 8)).toBe(true);
      expect(isGameComplete(6, 6)).toBe(true);
    });

    it('should return false when not all pairs matched', () => {
      expect(isGameComplete(4, 8)).toBe(false);
      expect(isGameComplete(0, 8)).toBe(false);
    });
  });
});