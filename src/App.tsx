import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

// Types
interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  moves: number;
  time: number;
  difficulty: string;
  date: string;
}

interface GameStatistics {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  averageMoves: number;
  averageTime: number;
  bestScore: number;
  gamesPlayed: number[];
}

const App: React.FC = () => {
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'paused' | 'completed'>('idle');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timerMode, setTimerMode] = useState<'countup' | 'countdown'>('countup');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'animals' | 'food' | 'space' | 'holidays' | 'vehicles' | 'emojis'>('animals');
  const [selectedCardBack, setSelectedCardBack] = useState<'default' | 'pattern' | 'stars' | 'hearts'>('default');
  const [hintCard, setHintCard] = useState<number | null>(null);
  const [multiplayerMode, setMultiplayerMode] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [playerScores, setPlayerScores] = useState({ player1: 0, player2: 0 });
  const [showStatistics, setShowStatistics] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [_dailyChallenge, _setDailyChallenge] = useState<{ date: string; pairs: number; completed: boolean } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pausedTime, setPausedTime] = useState(0);

  // Stats and leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('leaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [statistics, setStatistics] = useState<GameStatistics>(() => {
    const saved = localStorage.getItem('statistics');
    return saved ? JSON.parse(saved) : {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      averageMoves: 0,
      averageTime: 0,
      bestScore: 0,
      gamesPlayed: []
    };
  });
  const [achievements, setAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });

  // Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sound effects
  const sounds = {
    flip: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-card-flip-2909.mp3'], volume: 0.3 }),
    match: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-2213.mp3'], volume: 0.4 }),
    mismatch: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-interface-error-2346.mp3'], volume: 0.3 }),
    victory: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3'], volume: 0.5 }),
    click: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-software-interface-click-2568.mp3'], volume: 0.2 })
  };

  // Theme icons
  const themeIcons = {
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
    food: ['🍎', '🍕', '🍔', '🌮', '🍣', '🍩', '🍪', '🍫', '🍦', '🍉', '🍒', '🥑'],
    space: ['🌍', '🌙', '⭐', '🪐', '🚀', '👽', '🛸', '🌌', '🔭', '☄️', '🌠', '🛰️'],
    holidays: ['🎄', '🎅', '🦌', '🎃', '👻', '🕯️', '🥚', '🐇', '🎆', '🍾', '🎉', '💝'],
    vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛'],
    emojis: ['😀', '😂', '😍', '🥺', '😎', '🤔', '😴', '🥳', '😡', '😱', '🥶', '🤯']
  };

  // Card back designs
  const cardBacks = {
    default: '?',
    pattern: '◆',
    stars: '★',
    hearts: '♥'
  };

  // Difficulty configurations
  const difficultyConfig = {
    easy: { pairs: 6, gridCols: 3, timeBonus: 50, movePenalty: 2, countdownTime: 120 },
    medium: { pairs: 8, gridCols: 4, timeBonus: 40, movePenalty: 3, countdownTime: 90 },
    hard: { pairs: 12, gridCols: 4, timeBonus: 30, movePenalty: 5, countdownTime: 60 }
  };

  // Play sound helper
  const playSound = (sound: Howl) => {
    if (soundEnabled) sound.play();
  };

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start timer
  const startTimer = useCallback(() => {
    if (timerRef.current) stopTimer();
    
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          if (timerMode === 'countup') {
            const newTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
            return newTime;
          } else {
            const newTime = prev - 1;
            if (newTime <= 0) {
              stopTimer();
              setGameStatus('completed');
              setShowVictoryModal(true);
              return 0;
            }
            return newTime;
          }
        });
      }, 1000);
    }
  }, [gameStatus, timerMode, stopTimer]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const config = difficultyConfig[difficulty];
    const pairs = config.pairs;
    
    const icons = [...themeIcons[selectedTheme]].slice(0, pairs);
    const newCards: Card[] = [];
    
    icons.forEach((icon, idx) => {
      newCards.push({ id: idx * 2, icon, isFlipped: false, isMatched: false });
      newCards.push({ id: idx * 2 + 1, icon, isFlipped: false, isMatched: false });
    });
    
    // Shuffle cards
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }
    
    setCards(newCards);
    setMoves(0);
    setMatches(0);
    setScore(0);
    setFlippedIndex(null);
    setIsProcessing(false);
    setGameStatus('playing');
    setShowVictoryModal(false);
    setPlayerScores({ player1: 0, player2: 0 });
    setCurrentPlayer('player1');
    
    // Setup timer
    stopTimer();
    if (timerMode === 'countdown') {
      setTimeElapsed(config.countdownTime);
    } else {
      setTimeElapsed(0);
    }
    startTimeRef.current = Date.now();
    startTimer();
  }, [difficulty, selectedTheme, timerMode, stopTimer, startTimer]);

  // Calculate score
  const calculateScore = useCallback((currentMoves: number, currentMatches: number, time: number) => {
    const config = difficultyConfig[difficulty];
    let newScore = 0;
    
    if (timerMode === 'countup') {
      const baseScore = 1000;
      const movePenalty = currentMoves * config.movePenalty;
      const timeBonus = Math.max(0, config.timeBonus * 10 - time);
      const matchBonus = currentMatches * 50;
      newScore = baseScore - movePenalty + timeBonus + matchBonus;
    } else {
      const baseScore = 1000;
      const movePenalty = currentMoves * config.movePenalty;
      const timeBonus = time * 10;
      const matchBonus = currentMatches * 50;
      newScore = baseScore - movePenalty + timeBonus + matchBonus;
    }
    
    newScore = Math.max(0, Math.floor(newScore));
    
    if (newScore > statistics.bestScore) {
      setStatistics(prev => ({ ...prev, bestScore: newScore }));
    }
    
    return newScore;
  }, [difficulty, timerMode, statistics.bestScore]);

  // Update score
  useEffect(() => {
    if (gameStatus === 'playing' && moves > 0) {
      const newScore = calculateScore(moves, matches, timeElapsed);
      setScore(newScore);
    }
  }, [moves, matches, timeElapsed, gameStatus, calculateScore]);

  // Handle card click
  const handleCardClick = (index: number) => {
    if (isProcessing || gameStatus !== 'playing') return;
    
    const clickedCard = cards[index];
    if (clickedCard.isMatched || clickedCard.isFlipped) return;
    
    playSound(sounds.flip);
    
    // First card flip
    if (flippedIndex === null) {
      const newCards = [...cards];
      newCards[index].isFlipped = true;
      setCards(newCards);
      setFlippedIndex(index);
      return;
    }
    
    // Second card flip
    if (flippedIndex !== null && flippedIndex !== index) {
      const firstCard = cards[flippedIndex];
      const secondCard = cards[index];
      
      const newCards = [...cards];
      newCards[index].isFlipped = true;
      setCards(newCards);
      
      const newMoves = moves + 1;
      setMoves(newMoves);
      
      const isMatch = firstCard.icon === secondCard.icon;
      setIsProcessing(true);
      
      if (isMatch) {
        playSound(sounds.match);
        
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[flippedIndex].isMatched = true;
          updatedCards[flippedIndex].isFlipped = true;
          updatedCards[index].isMatched = true;
          updatedCards[index].isFlipped = true;
          setCards(updatedCards);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          // Multiplayer scoring
          if (multiplayerMode) {
            setPlayerScores(prev => {
              const newScores = { ...prev };
              if (currentPlayer === 'player1') {
                newScores.player1 = prev.player1 + 100;
              } else {
                newScores.player2 = prev.player2 + 100;
              }
              return newScores;
            });
            setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
          }
          
          setFlippedIndex(null);
          setIsProcessing(false);
          
          // Check for win
          const totalPairs = difficultyConfig[difficulty].pairs;
          if (newMatches === totalPairs) {
            stopTimer();
            setGameStatus('completed');
            setShowVictoryModal(true);
            playSound(sounds.victory);
            
            // Update statistics
            const finalScore = calculateScore(newMoves, newMatches, timeElapsed);
            const newStats = {
              ...statistics,
              totalGames: statistics.totalGames + 1,
              totalWins: statistics.totalWins + 1,
              averageMoves: (statistics.averageMoves * statistics.totalGames + newMoves) / (statistics.totalGames + 1),
              averageTime: (statistics.averageTime * statistics.totalGames + timeElapsed) / (statistics.totalGames + 1),
              bestScore: Math.max(statistics.bestScore, finalScore),
              gamesPlayed: [...statistics.gamesPlayed, newMoves]
            };
            setStatistics(newStats);
            localStorage.setItem('statistics', JSON.stringify(newStats));
            
            // Update leaderboard
            if (playerName) {
              const newEntry: LeaderboardEntry = {
                name: playerName,
                score: finalScore,
                moves: newMoves,
                time: timeElapsed,
                difficulty: difficulty,
                date: new Date().toISOString()
              };
              const newLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
              setLeaderboard(newLeaderboard);
              localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
            }
            
            // Check achievements
            if (!achievements.includes('speed_demon') && timerMode === 'countdown' && timeElapsed > difficultyConfig[difficulty].countdownTime * 0.7) {
              const newAchievements = [...achievements, 'speed_demon'];
              setAchievements(newAchievements);
              localStorage.setItem('achievements', JSON.stringify(newAchievements));
            }
            
            if (!achievements.includes('marathon') && statistics.totalGames >= 9) {
              const newAchievements = [...achievements, 'marathon'];
              setAchievements(newAchievements);
              localStorage.setItem('achievements', JSON.stringify(newAchievements));
            }
          }
        }, 500);
      } else {
        playSound(sounds.mismatch);
        
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[flippedIndex].isFlipped = false;
          resetCards[index].isFlipped = false;
          setCards(resetCards);
          setFlippedIndex(null);
          setIsProcessing(false);
          
          if (multiplayerMode) {
            setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
          }
        }, 800);
      }
    }
  };

  // Hint system
  const showHintCard = () => {
    if (gameStatus !== 'playing' || isProcessing) return;
    
    const unmatchedCards = cards.reduce((acc, card, idx) => {
      if (!card.isMatched && !card.isFlipped) acc.push(idx);
      return acc;
    }, [] as number[]);
    
    if (unmatchedCards.length > 0) {
      const randomIndex = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
      setHintCard(randomIndex);
      
      const newCards = [...cards];
      newCards[randomIndex].isFlipped = true;
      setCards(newCards);
      
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setCards(prevCards => {
          const resetCards = [...prevCards];
          if (resetCards[randomIndex] && !resetCards[randomIndex].isMatched) {
            resetCards[randomIndex].isFlipped = false;
          }
          return resetCards;
        });
        setHintCard(null);
      }, 2000);
    }
  };

  // Pause game
  const pauseGame = () => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
      stopTimer();
      setPausedTime(timeElapsed);
      playSound(sounds.click);
    }
  };

  // Resume game
  const resumeGame = () => {
    if (gameStatus === 'paused') {
      setGameStatus('playing');
      const currentTime = timerMode === 'countup' ? pausedTime : timeElapsed;
      startTimeRef.current = Date.now() - (currentTime * 1000);
      startTimer();
      playSound(sounds.click);
    }
  };

  // Reset game
  const resetGame = () => {
    if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    stopTimer();
    initializeGame();
    playSound(sounds.click);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
    setTimeout(() => resetGame(), 100);
  };

  // Change timer mode
  const changeTimerMode = (mode: 'countup' | 'countdown') => {
    setTimerMode(mode);
    setTimeout(() => resetGame(), 100);
  };

  // Change theme
  const changeTheme = (theme: 'animals' | 'food' | 'space' | 'holidays' | 'vehicles' | 'emojis') => {
    setSelectedTheme(theme);
    setTimeout(() => resetGame(), 100);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get grid columns class
  const getGridCols = () => {
    const cols = difficultyConfig[difficulty].gridCols;
    return cols === 3 ? 'grid-cols-3' : 'grid-cols-4';
  };

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
    return () => {
      stopTimer();
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, [initializeGame, stopTimer]);

  // Dark mode styles
  const darkModeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  };

  // Name prompt
  if (showNamePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">🎮 Memory Matching Game</h1>
          <p className="text-gray-600 mb-6">Enter your name to get started!</p>
          <input
            type="text"
            placeholder="Your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg mb-4 focus:outline-none focus:border-purple-500 text-gray-800"
            onKeyPress={(e) => e.key === 'Enter' && playerName && setShowNamePrompt(false)}
            autoFocus
          />
          <button
            onClick={() => playerName && setShowNamePrompt(false)}
            disabled={!playerName}
            className="w-full py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkModeClasses.bg}`}>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${darkModeClasses.buttonSecondary}`}
          >
            📊 Stats
          </button>
          <h1 className={`text-2xl md:text-4xl font-bold text-center ${darkModeClasses.text}`}>
            🎮 Memory Matching Game
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${darkModeClasses.cardBg} ${darkModeClasses.text}`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full shadow-lg transition-all hover:scale-110 ${darkModeClasses.cardBg} ${darkModeClasses.text}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${darkModeClasses.buttonSecondary}`}
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>

        {/* Statistics Panel */}
        <AnimatePresence>
          {showStatistics && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-6 p-4 rounded-xl ${darkModeClasses.cardBg} shadow-lg overflow-hidden`}
            >
              <h2 className={`text-xl font-bold mb-3 ${darkModeClasses.text}`}>📈 Your Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className={`text-sm ${darkModeClasses.textSecondary}`}>Total Games</p>
                  <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{statistics.totalGames}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkModeClasses.textSecondary}`}>Wins</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.totalWins}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkModeClasses.textSecondary}`}>Avg Moves</p>
                  <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{Math.round(statistics.averageMoves)}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkModeClasses.textSecondary}`}>Best Score</p>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.bestScore}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard Panel */}
        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-6 p-4 rounded-xl ${darkModeClasses.cardBg} shadow-lg overflow-hidden`}
            >
              <h2 className={`text-xl font-bold mb-3 ${darkModeClasses.text}`}>🏆 Leaderboard - Top 10</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {leaderboard.map((entry, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-2 border-b ${darkModeClasses.border}`}>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-lg ${darkModeClasses.text}`}>{idx + 1}.</span>
                      <span className={darkModeClasses.text}>{entry.name}</span>
                    </div>
                    <div className={`flex gap-4 text-sm ${darkModeClasses.textSecondary}`}>
                      <span>Score: {entry.score}</span>
                      <span>Moves: {entry.moves}</span>
                      <span>Time: {formatTime(entry.time)}</span>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className={`text-center ${darkModeClasses.textSecondary}`}>No scores yet. Play a game!</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className={`rounded-xl p-3 text-center ${darkModeClasses.cardBg} shadow-lg`}>
            <p className={`text-xs ${darkModeClasses.textSecondary}`}>Moves</p>
            <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{moves}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkModeClasses.cardBg} shadow-lg`}>
            <p className={`text-xs ${darkModeClasses.textSecondary}`}>Matches</p>
            <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{matches}/{difficultyConfig[difficulty].pairs}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkModeClasses.cardBg} shadow-lg`}>
            <p className={`text-xs ${darkModeClasses.textSecondary}`}>Time</p>
            <p className={`text-2xl font-bold ${timerMode === 'countdown' && timeElapsed < 10 ? 'text-red-600' : darkModeClasses.text}`}>
              {formatTime(timeElapsed)}
            </p>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkModeClasses.cardBg} shadow-lg`}>
            <p className={`text-xs ${darkModeClasses.textSecondary}`}>Score</p>
            <p className="text-2xl font-bold text-purple-600">{score}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkModeClasses.cardBg} shadow-lg`}>
            <p className={`text-xs ${darkModeClasses.textSecondary}`}>Best</p>
            <p className="text-2xl font-bold text-yellow-600">{statistics.bestScore}</p>
          </div>
          {multiplayerMode && (
            <div className={`rounded-xl p-3 text-center ${darkModeClasses.cardBg} shadow-lg`}>
              <p className={`text-xs ${darkModeClasses.textSecondary}`}>Turn</p>
              <p className={`text-xl font-bold ${currentPlayer === 'player1' ? 'text-blue-500' : 'text-red-500'}`}>
                {currentPlayer === 'player1' ? '👤 P1' : '🤖 P2'}
              </p>
              <p className={`text-xs ${darkModeClasses.textSecondary}`}>
                P1: {playerScores.player1} | P2: {playerScores.player2}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg"
          >
            🎮 New Game
          </motion.button>
          
          {gameStatus === 'playing' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={pauseGame}
              className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold shadow-lg"
            >
              ⏸️ Pause
            </motion.button>
          ) : gameStatus === 'paused' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resumeGame}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg"
            >
              ▶️ Resume
            </motion.button>
          ) : null}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={showHintCard}
            disabled={gameStatus !== 'playing' || isProcessing}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50"
          >
            💡 Hint
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMultiplayerMode(!multiplayerMode);
              resetGame();
            }}
            className={`px-5 py-2 rounded-lg font-semibold shadow-lg ${
              multiplayerMode 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : `${darkModeClasses.buttonSecondary}`
            }`}
          >
            👥 Multiplayer
          </motion.button>
        </div>

        {/* Timer Mode Selection */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <p className={`text-sm font-medium ${darkModeClasses.textSecondary}`}>Timer Mode:</p>
          {(['countup', 'countdown'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => changeTimerMode(mode)}
              className={`px-4 py-1 rounded-lg capitalize transition-all ${
                timerMode === mode
                  ? 'bg-purple-500 text-white'
                  : darkModeClasses.buttonSecondary
              }`}
            >
              {mode === 'countup' ? '⏱️ Count Up' : '⏳ Countdown'}
            </button>
          ))}
        </div>

        {/* Difficulty Selection */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => changeDifficulty(diff)}
              className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all text-sm ${
                difficulty === diff
                  ? 'bg-purple-500 text-white shadow-lg scale-105'
                  : darkModeClasses.buttonSecondary
              }`}
            >
              {diff} ({difficultyConfig[diff].pairs})
            </button>
          ))}
        </div>

        {/* Theme Selection */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {(['animals', 'food', 'space', 'holidays', 'vehicles', 'emojis'] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => changeTheme(theme)}
              className={`px-3 py-1 rounded-lg capitalize transition-all text-sm ${
                selectedTheme === theme
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : darkModeClasses.buttonSecondary
              }`}
            >
              {theme === 'animals' && '🐾'} {theme === 'food' && '🍕'} {theme === 'space' && '🚀'}
              {theme === 'holidays' && '🎄'} {theme === 'vehicles' && '🚗'} {theme === 'emojis' && '😀'}
              {theme}
            </button>
          ))}
        </div>

        {/* Card Back Selection */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <p className={`text-sm font-medium ${darkModeClasses.textSecondary}`}>Card Back:</p>
          {(['default', 'pattern', 'stars', 'hearts'] as const).map((back) => (
            <button
              key={back}
              onClick={() => setSelectedCardBack(back)}
              className={`px-3 py-1 rounded-lg capitalize transition-all text-sm ${
                selectedCardBack === back
                  ? 'bg-green-500 text-white'
                  : darkModeClasses.buttonSecondary
              }`}
            >
              {back === 'default' && '?'} {back === 'pattern' && '◆'} 
              {back === 'stars' && '★'} {back === 'hearts' && '♥'}
              {back}
            </button>
          ))}
        </div>

        {/* Game Board */}
        <div className={`grid ${getGridCols()} gap-2 md:gap-3 max-w-4xl mx-auto`}>
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: card.isMatched || card.isFlipped ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || isProcessing || gameStatus !== 'playing'}
              className={`
                aspect-square rounded-lg shadow-lg text-3xl md:text-4xl font-bold
                transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-glow'
                  : `${darkModeClasses.cardBg} ${darkModeClasses.text} shadow-md`
                }
                ${card.isMatched ? 'opacity-50 cursor-default' : 'cursor-pointer'}
                ${hintCard === index ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.icon : cardBacks[selectedCardBack]}
            </motion.button>
          ))}
        </div>

        {/* Victory Modal */}
        <AnimatePresence>
          {showVictoryModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowVictoryModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className={`max-w-md w-full rounded-2xl shadow-2xl p-6 text-center ${darkModeClasses.cardBg}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-6xl mb-3">🏆</div>
                <h2 className={`text-3xl font-bold mb-3 ${darkModeClasses.text}`}>You Won!</h2>
                {multiplayerMode && (
                  <p className={`text-lg mb-2 font-bold ${playerScores.player1 > playerScores.player2 ? 'text-green-600' : 'text-blue-600'}`}>
                    Final: P1 {playerScores.player1} - {playerScores.player2} P2
                  </p>
                )}
                <div className={`space-y-1 mb-4 text-sm ${darkModeClasses.textSecondary}`}>
                  <p>Moves: <span className="font-bold text-purple-600">{moves}</span></p>
                  <p>Time: <span className="font-bold text-purple-600">{formatTime(timeElapsed)}</span></p>
                  <p>Score: <span className="font-bold text-purple-600">{score}</span></p>
                  {score > statistics.bestScore && statistics.bestScore > 0 && (
                    <p className="text-green-600 font-semibold">🎉 New High Score! 🎉</p>
                  )}
                </div>
                
                {/* Achievements */}
                {achievements.length > 0 && (
                  <div className="mb-4 p-2 bg-yellow-100 rounded-lg text-sm">
                    <p className="font-semibold text-yellow-800">Achievements:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {achievements.includes('high_scorer') && <span className="text-2xl" title="High Scorer">🏆</span>}
                      {achievements.includes('perfect_game') && <span className="text-2xl" title="Perfect Game">⭐</span>}
                      {achievements.includes('speed_demon') && <span className="text-2xl" title="Speed Demon">⚡</span>}
                      {achievements.includes('marathon') && <span className="text-2xl" title="Marathon">🏃</span>}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowVictoryModal(false); resetGame(); }}
                    className="flex-1 py-2 bg-purple-500 text-white rounded-lg font-semibold text-sm hover:bg-purple-600 transition-all"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setShowVictoryModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-sm hover:bg-gray-600 transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Badges */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-1">
          {achievements.includes('high_scorer') && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs shadow-lg font-semibold">
              🏆 High Scorer
            </div>
          )}
          {achievements.includes('perfect_game') && (
            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs shadow-lg font-semibold">
              ⭐ Perfect Game
            </div>
          )}
          {achievements.includes('speed_demon') && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs shadow-lg font-semibold">
              ⚡ Speed Demon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;