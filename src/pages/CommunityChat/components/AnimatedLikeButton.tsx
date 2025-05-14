
import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimatedLikeButtonProps {
  isLiked: boolean;
  count: number;
  onLike: () => void;
  text: string;
}

const AnimatedLikeButton: React.FC<AnimatedLikeButtonProps> = ({ 
  isLiked, 
  count, 
  onLike,
  text
}) => {
  return (
    <button 
      onClick={onLike}
      className="flex items-center gap-1 hover:text-blue-500 transition-colors"
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <motion.div
        whileTap={{ scale: 0.9 }}
        animate={isLiked ? {
          scale: [1, 1.2, 1],
          transition: { duration: 0.3 }
        } : {}}
      >
        <Heart 
          className={`h-4 w-4 transition-colors ${isLiked ? 'fill-blue-500 text-blue-500' : 'text-gray-500'}`} 
        />
      </motion.div>
      
      <motion.span 
        className={`text-xs ${isLiked ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
        animate={count > 0 ? { y: [0, -3, 0], transition: { duration: 0.3 } } : {}}
      >
        {text} {count > 0 && `(${count})`}
      </motion.span>
    </button>
  );
};

export default AnimatedLikeButton;
