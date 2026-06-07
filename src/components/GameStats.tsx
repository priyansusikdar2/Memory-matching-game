import React from 'react';
import { motion } from 'framer-motion';
import { GameStats as GameStatsType } from '../types/game.types';

interface GameStatsProps {
  stats: GameStatsType;
  isDarkMode: boolean;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats, isDarkMode }) => {
  const statItems = [
    { 
      label: 'Moves', 
      value: stats.moves, 
      icon: '🖱️',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Matches', 
      value: stats.matchedPairs, 
      icon: '🎯',
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      label: 'Time', 
      value: `${Math.floor(stats.timeElapsed / 60)}:${String(stats.timeElapsed % 60).padStart(2, '0')}`,
      icon: '⏱️',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      label: 'Score', 
      value: stats.score, 
      icon: '🏆',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 300 }
          }}
          className={`
            relative overflow-hidden rounded-xl shadow-lg
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            transition-all duration-300 cursor-pointer
          `}
        >
          {/* Background gradient effect */}
          <div className={`
            absolute inset-0 opacity-10 bg-gradient-to-r ${item.gradient}
            transition-opacity duration-300 group-hover:opacity-20
          `} />
          
          <div className="relative p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl md:text-2xl">{item.icon}</span>
              <span className={`text-xs md:text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </div>
            
            <motion.p
              key={item.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`text-2xl md:text-3xl lg:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              {item.value}
            </motion.p>
            
            {/* Progress bar for score */}
            {item.label === 'Score' && typeof item.value === 'number' && (
              <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (item.value / 1000) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
          
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            whileHover={{
              boxShadow: `0 0 20px rgba(${
                item.color === 'blue' ? '59, 130, 246' :
                item.color === 'green' ? '34, 197, 94' :
                item.color === 'yellow' ? '234, 179, 8' : '168, 85, 247'
              }, 0.5)`
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};