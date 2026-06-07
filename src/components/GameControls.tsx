import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Difficulty } from '../types/game.types';

interface GameControlsProps {
  onReset: () => void;
  onPause: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  currentDifficulty: Difficulty;
  isPlaying: boolean;
  isDarkMode: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  onPause,
  onDifficultyChange,
  currentDifficulty,
  isPlaying,
  isDarkMode
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const difficultyInfo = {
    easy: { icon: '🌱', description: '6 pairs', color: 'green' },
    medium: { icon: '🌟', description: '8 pairs', color: 'yellow' },
    hard: { icon: '⚡', description: '12 pairs', color: 'red' }
  };

  const handleReset = () => {
    if (showConfirmReset) {
      onReset();
      setShowConfirmReset(false);
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex flex-col gap-4 mb-6 md:mb-8">
      <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
        {/* Reset Button */}
        <motion.div className="relative">
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setHoveredButton('reset')}
            onHoverEnd={() => setHoveredButton(null)}
            onClick={handleReset}
            className={`
              px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold shadow-lg
              transition-all duration-300 flex items-center gap-2
              ${isDarkMode
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              } text-white
            `}
          >
            <span className="text-lg">🔄</span>
            <span className="hidden sm:inline">New Game</span>
            <span className="sm:hidden">New</span>
          </motion.button>
          
          <AnimatePresence>
            {showConfirmReset && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 px-3 py-1.5 bg-yellow-500 text-black text-xs rounded-lg shadow-lg whitespace-nowrap z-10"
              >
                Click again to confirm
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pause/Resume Button */}
        <motion.button
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          onHoverStart={() => setHoveredButton('pause')}
          onHoverEnd={() => setHoveredButton(null)}
          onClick={onPause}
          className={`
            px-5 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold shadow-lg
            transition-all duration-300 flex items-center gap-2
            ${isDarkMode
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
            } text-white
          `}
        >
          <span className="text-lg">{isPlaying ? '⏸️' : '▶️'}</span>
          <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Resume'}</span>
          <span className="sm:hidden">{isPlaying ? '⏸️' : '▶️'}</span>
        </motion.button>
      </div>

      {/* Difficulty Selection */}
      <div className="flex flex-col items-center gap-3">
        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Select Difficulty
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {difficulties.map((difficulty) => (
            <motion.button
              key={difficulty}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredButton(difficulty)}
              onHoverEnd={() => setHoveredButton(null)}
              onClick={() => onDifficultyChange(difficulty)}
              className={`
                relative px-4 md:px-6 py-2.5 rounded-lg font-semibold capitalize
                transition-all duration-300 flex flex-col items-center gap-1
                min-w-[80px] md:min-w-[100px]
                ${currentDifficulty === difficulty
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-glow'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <span className="text-xl">{difficultyInfo[difficulty].icon}</span>
              <span className="text-sm md:text-base">{difficulty}</span>
              <span className="text-xs opacity-75">{difficultyInfo[difficulty].description}</span>
              
              {/* Difficulty indicator bar */}
              {currentDifficulty === difficulty && (
                <motion.div
                  layoutId="difficultyIndicator"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tooltip for hovered button */}
      <AnimatePresence>
        {hoveredButton && hoveredButton !== 'reset' && hoveredButton !== 'pause' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap"
          >
            {hoveredButton === 'easy' && 'Start with 6 pairs - Perfect for beginners'}
            {hoveredButton === 'medium' && 'Challenge yourself with 8 pairs'}
            {hoveredButton === 'hard' && 'Test your limits with 12 pairs'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};