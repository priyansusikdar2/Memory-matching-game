import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VictoryModalProps {
  isOpen: boolean;
  moves: number;
  timeElapsed: number;
  score: number;
  onPlayAgain: () => void;
  isDarkMode: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  moves,
  timeElapsed,
  score,
  onPlayAgain,
  isDarkMode
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (): { message: string; emoji: string; color: string } => {
    if (score >= 900) {
      return { message: 'Perfect Memory!', emoji: '👑', color: 'from-yellow-400 to-yellow-600' };
    } else if (score >= 700) {
      return { message: 'Excellent!', emoji: '🎉', color: 'from-purple-400 to-pink-600' };
    } else if (score >= 500) {
      return { message: 'Good Job!', emoji: '👍', color: 'from-blue-400 to-blue-600' };
    } else {
      return { message: 'Keep Practicing!', emoji: '💪', color: 'from-green-400 to-green-600' };
    }
  };

  const performance = getPerformanceMessage();
  const totalPairs = moves / 2;

  // Create confetti effect
  useEffect(() => {
    if (isOpen) {
      const createConfetti = () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        for (let i = 0; i < 100; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'fixed pointer-events-none z-50';
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.width = Math.random() * 10 + 5 + 'px';
          confetti.style.height = Math.random() * 10 + 5 + 'px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = '50%';
          confetti.style.opacity = '0.8';
          confetti.style.animation = `confetti ${Math.random() * 2 + 2}s linear forwards`;
          document.body.appendChild(confetti);
          
          setTimeout(() => confetti.remove(), 3000);
        }
      };
      
      // Add confetti animation to styles
      if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      createConfetti();
    }
  }, [isOpen]);

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onPlayAgain}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                relative max-w-md w-full rounded-2xl shadow-2xl overflow-hidden
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
              `}
            >
              {/* Header with gradient */}
              <div className={`
                relative text-center py-8 px-6
                bg-gradient-to-r ${performance.color}
              `}>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="text-7xl md:text-8xl mb-2"
                >
                  {performance.emoji}
                </motion.div>
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  Victory!
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-white text-opacity-90 text-lg"
                >
                  {performance.message}
                </motion.p>
              </div>
              
              {/* Stats Section */}
              <div className="p-6 space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Moves</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {moves}
                    </motion.p>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    >
                      {formatTime(timeElapsed)}
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  className={`text-center p-4 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-900 to-pink-900' 
                      : 'bg-gradient-to-r from-purple-100 to-pink-100'
                  }`}
                >
                  <p className={`text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>Final Score</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    {score}
                  </motion.p>
                </motion.div>
                
                {/* Achievement badges */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap gap-2 justify-center"
                >
                  {moves <= 20 && (
                    <span className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full">
                      ⚡ Speed Demon
                    </span>
                  )}
                  {timeElapsed <= 60 && (
                    <span className="px-3 py-1 text-xs bg-green-500 text-white rounded-full">
                      🏃 Fast Thinker
                    </span>
                  )}
                  {score >= 800 && (
                    <span className="px-3 py-1 text-xs bg-yellow-500 text-white rounded-full">
                      👑 Memory Master
                    </span>
                  )}
                  {moves / (totalPairs || 1) <= 2 && (
                    <span className="px-3 py-1 text-xs bg-purple-500 text-white rounded-full">
                      🎯 Perfect Matches
                    </span>
                  )}
                </motion.div>
              </div>
              
              {/* Action Buttons */}
              <div className="p-6 pt-0 flex gap-3">
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPlayAgain}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Play Again 🎮
                </motion.button>
                
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold shadow-lg hover:bg-gray-600 transition-all"
                >
                  Close ✖
                </motion.button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-10 rounded-tl-full" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};