import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType, Difficulty } from '../types/game.types';
import { Card } from './Card';
import { difficultyConfigs } from '../utils/gameUtils';

interface GameBoardProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
  difficulty: Difficulty;
  isProcessing: boolean;
  isDarkMode: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  onCardClick,
  difficulty,
  isProcessing,
  isDarkMode
}) => {
  const config = difficultyConfigs[difficulty];
  const gridCols = config.gridCols;
  
  // Calculate grid classes based on difficulty
  const getGridClasses = () => {
    switch (gridCols) {
      case 3:
        return 'grid-cols-2 sm:grid-cols-3';
      case 4:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
    }
  };

  // Get background color based on dark mode
  const getBackgroundClass = () => {
    return isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50';
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: 90
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  // Check if all cards are matched
  const isGameCompleted = cards.length > 0 && cards.every(card => card.status === 'matched');

  return (
    <div className={`py-6 md:py-8 rounded-xl transition-colors duration-300 ${getBackgroundClass()}`}>
      <motion.div
        className={`grid ${getGridClasses()} gap-2 md:gap-3 lg:gap-4 max-w-6xl mx-auto p-4`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: index * 0.02 }}
              layout
            >
              <Card
                card={card}
                onClick={() => onCardClick(card)}
                disabled={isProcessing}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {/* Game completion celebration effect */}
      <AnimatePresence>
        {isGameCompleted && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl md:text-3xl lg:text-4xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight,
                  scale: 0,
                  rotate: 0
                }}
                animate={{
                  y: -100,
                  scale: [0, 1, 0],
                  rotate: [0, 360, 720],
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              >
                {['🎉', '🎊', '🏆', '⭐', '🎮', '🃏', '✨', '🌟'][i % 8]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Completion message */}
      {isGameCompleted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg md:text-xl">
            🎉 Congratulations! You completed the game! 🎉
          </div>
        </motion.div>
      )}
    </div>
  );
};