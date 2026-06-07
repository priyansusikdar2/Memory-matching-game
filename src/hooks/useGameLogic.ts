import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Card, GameState, Difficulty, CardStatus } from '../types/game.types';
import { generateCards, calculateScore, checkWinCondition, shuffleArray } from '../utils/gameUtils';

interface UseGameLogicOptions {
  onGameStart?: () => void;
  onGameComplete?: (stats: { moves: number; timeElapsed: number; score: number }) => void;
  onMatch?: (matched: boolean, card1: Card, card2: Card) => void;
  onMove?: (moves: number) => void;
  autoSave?: boolean;
  saveKey?: string;
}

const initialState: GameState = {
  cards: [],
  moves: 0,
  matchedPairs: 0,
  isProcessing: false,
  firstSelectedCard: null,
  secondSelectedCard: null,
  gameStatus: 'idle',
  score: 0
};

export const useGameLogic = (
  difficulty: Difficulty,
  options: UseGameLogicOptions = {}
) => {
  const {
    onGameStart,
    onGameComplete,
    onMatch,
    onMove,
    autoSave = true,
    saveKey = 'memory-game-save'
  } = options;

  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game if autoSave is enabled
    if (autoSave) {
      try {
        const saved = localStorage.getItem(saveKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.difficulty === difficulty && parsed.gameState.gameStatus === 'playing') {
            return parsed.gameState;
          }
        }
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
    return { ...initialState, cards: generateCards(difficulty), gameStatus: 'playing' };
  });

  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const matchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moveHistoryRef = useRef<Array<{ cards: [Card, Card]; matched: boolean; timestamp: number }>>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    if (!autoSave) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const saveData = {
          difficulty,
          gameState: {
            ...gameState,
            cards: gameState.cards
          },
          timestamp: Date.now()
        };
        localStorage.setItem(saveKey, JSON.stringify(saveData));
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    }, 500);
  }, [autoSave, difficulty, gameState, saveKey]);

  // Auto-save effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      saveGameState();
    }
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState, saveGameState]);

  // Track game time
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      startTimeRef.current = Date.now();
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.gameStatus]);

  // Clear match timeout on unmount
  useEffect(() => {
    return () => {
      if (matchTimeoutRef.current) {
        clearTimeout(matchTimeoutRef.current);
      }
    };
  }, []);

  const initializeGame = useCallback(() => {
    const newCards = generateCards(difficulty);
    setGameState({
      ...initialState,
      cards: newCards,
      gameStatus: 'playing'
    });
    setTimeElapsed(0);
    moveHistoryRef.current = [];
    startTimeRef.current = Date.now();
    onGameStart?.();
  }, [difficulty, onGameStart]);

  const handleMatch = useCallback((
    cards: Card[],
    firstCard: Card,
    secondCard: Card,
    currentMoves: number,
    currentMatchedPairs: number
  ) => {
    const isMatch = firstCard.value === secondCard.value;
    
    let newCards = [...cards];
    let newMatchedPairs = currentMatchedPairs;
    let newScore = gameState.score;

    if (isMatch) {
      // Mark cards as matched
      newCards = newCards.map(card =>
        card.id === firstCard.id || card.id === secondCard.id
          ? { ...card, status: 'matched' as CardStatus }
          : card
      );
      newMatchedPairs = currentMatchedPairs + 1;
      
      // Calculate new score
      newScore = calculateScore(currentMoves, timeElapsed, difficulty);
      
      // Trigger match callback
      onMatch?.(true, firstCard, secondCard);
    } else {
      // Flip cards back after delay
      const timeoutId = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          cards: prev.cards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, status: 'default' as CardStatus }
              : card
          )
        }));
      }, 600);
      
      // Store timeout ID for cleanup
      matchTimeoutRef.current = timeoutId;
      
      onMatch?.(false, firstCard, secondCard);
    }

    // Record move history
    moveHistoryRef.current.push({
      cards: [firstCard, secondCard],
      matched: isMatch,
      timestamp: Date.now()
    });

    // Keep only last 50 moves
    if (moveHistoryRef.current.length > 50) {
      moveHistoryRef.current.shift();
    }

    // Check for win
    const isWin = checkWinCondition(newMatchedPairs, difficulty);
    
    if (isWin) {
      onGameComplete?.({
        moves: currentMoves,
        timeElapsed,
        score: newScore
      });
    }

    return {
      cards: newCards,
      matchedPairs: newMatchedPairs,
      score: newScore,
      isWin
    };
  }, [difficulty, timeElapsed, gameState.score, onMatch, onGameComplete]);

  const handleCardClick = useCallback((clickedCard: Card) => {
    setGameState(prev => {
      // Validation checks
      if (
        prev.gameStatus !== 'playing' ||
        prev.isProcessing ||
        clickedCard.status === 'matched' ||
        clickedCard.status === 'flipped' ||
        (prev.firstSelectedCard && prev.secondSelectedCard)
      ) {
        return prev;
      }

      // First card selection
      if (!prev.firstSelectedCard) {
        onMove?.(prev.moves + 1);
        
        return {
          ...prev,
          cards: prev.cards.map(card =>
            card.id === clickedCard.id ? { ...card, status: 'flipped' as CardStatus } : card
          ),
          firstSelectedCard: clickedCard,
          moves: prev.moves + 1
        };
      }

      // Second card selection
      if (prev.firstSelectedCard && !prev.secondSelectedCard) {
        const newCards = prev.cards.map(card =>
          card.id === clickedCard.id ? { ...card, status: 'flipped' as CardStatus } : card
        );
        
        // Process match
        const result = handleMatch(
          newCards,
          prev.firstSelectedCard,
          clickedCard,
          prev.moves + 1,
          prev.matchedPairs
        );
        
        return {
          ...prev,
          cards: result.cards,
          secondSelectedCard: clickedCard,
          moves: prev.moves + 1,
          matchedPairs: result.matchedPairs,
          score: result.score,
          isProcessing: !result.isWin, // Don't process further if game is won
          gameStatus: result.isWin ? 'completed' : prev.gameStatus
        };
      }

      return prev;
    });
  }, [handleMatch, onMove]);

  const resetGame = useCallback(() => {
    if (matchTimeoutRef.current) {
      clearTimeout(matchTimeoutRef.current);
      matchTimeoutRef.current = null;
    }
    initializeGame();
  }, [initializeGame]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'playing'
    }));
  }, []);

  const shuffleRemainingCards = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      
      const unmatchedCards = prev.cards.filter(card => card.status !== 'matched');
      const matchedCards = prev.cards.filter(card => card.status === 'matched');
      const shuffledUnmatched = shuffleArray(unmatchedCards);
      
      return {
        ...prev,
        cards: [...shuffledUnmatched, ...matchedCards],
        moves: prev.moves + 1 // Penalty move for shuffling
      };
    });
  }, []);

  const getMoveHistory = useCallback(() => {
    return moveHistoryRef.current;
  }, []);

  const getStats = useCallback(() => {
    const totalMatches = gameState.matchedPairs;
    const accuracy = gameState.moves > 0 
      ? (totalMatches / (gameState.moves / 2)) * 100 
      : 0;
    
    return {
      totalMoves: gameState.moves,
      totalMatches,
      accuracy: Math.min(100, Math.round(accuracy)),
      currentScore: gameState.score,
      timeElapsed,
      efficiency: gameState.moves > 0 
        ? Math.round((totalMatches / gameState.moves) * 100) 
        : 0
    };
  }, [gameState.moves, gameState.matchedPairs, gameState.score, timeElapsed]);

  // Reset processing state after match
  useEffect(() => {
    if (gameState.isProcessing && gameState.secondSelectedCard) {
      if (matchTimeoutRef.current) {
        clearTimeout(matchTimeoutRef.current);
      }
      
      const timeoutId = setTimeout(() => {
        setGameState(prev => {
          // Check if still processing and game not completed
          if (prev.isProcessing && prev.gameStatus !== 'completed') {
            return {
              ...prev,
              firstSelectedCard: null,
              secondSelectedCard: null,
              isProcessing: false
            };
          }
          return prev;
        });
      }, 700);
      
      matchTimeoutRef.current = timeoutId;
    }
  }, [gameState.isProcessing, gameState.secondSelectedCard, gameState.gameStatus]);

  return useMemo(() => ({
    gameState,
    timeElapsed,
    handleCardClick,
    resetGame,
    pauseGame,
    resumeGame,
    initializeGame,
    shuffleRemainingCards,
    getMoveHistory,
    getStats
  }), [
    gameState,
    timeElapsed,
    handleCardClick,
    resetGame,
    pauseGame,
    resumeGame,
    initializeGame,
    shuffleRemainingCards,
    getMoveHistory,
    getStats
  ]);
};