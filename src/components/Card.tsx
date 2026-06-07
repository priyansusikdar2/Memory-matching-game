import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types/game.types';

interface CardProps {
  card: CardType;
  onClick: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled = false }) => {
  const isFlipped = card.status === 'flipped' || card.status === 'matched';
  const isMatched = card.status === 'matched';

  return (
    <motion.button
      className={`
        relative w-full aspect-square rounded-xl shadow-lg
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        transform transition-all duration-300
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
        ${isMatched ? 'cursor-default opacity-60' : ''}
      `}
      onClick={onClick}
      disabled={disabled || isMatched}
      whileTap={{ scale: 0.95 }}
      initial={false}
      animate={{ 
        rotateY: isFlipped ? 180 : 0,
        transition: { duration: 0.4, type: "spring", stiffness: 300 }
      }}
    >
      <div className={`
        absolute inset-0 rounded-xl backface-hidden
        flex items-center justify-center text-4xl md:text-5xl lg:text-6xl
        transition-all duration-300
        ${isFlipped 
          ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white shadow-glow' 
          : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-transparent shadow-inner'
        }
        ${isMatched ? 'animate-match' : ''}
      `}>
        {isFlipped ? card.icon : '?'}
      </div>
      
      {/* Ripple effect on click */}
      {!disabled && !isMatched && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-white opacity-0"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1.5, opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};