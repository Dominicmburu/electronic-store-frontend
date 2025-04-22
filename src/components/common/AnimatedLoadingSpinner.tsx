import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const AnimatedLoadingSpinner: React.FC<AnimatedLoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#3B82F6', // Default to blue-500
  text = 'Loading...'
}) => {
  // Determine dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 40, height: 40, textClass: 'text-sm' };
      case 'lg': return { width: 80, height: 80, textClass: 'text-xl' };
      default: return { width: 60, height: 60, textClass: 'text-lg' };
    }
  };

  const { width, height, textClass } = getDimensions();
  
  // Circle elements for the spinner
  const circleCount = 4;
  const circles = Array.from({ length: circleCount });

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative" style={{ width, height }}>
        {circles.map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: width / 4,
              height: width / 4,
              backgroundColor: color,
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              x: [
                `calc(-50% + ${(width / 2 - width / 8) * Math.cos(2 * Math.PI * (index / circleCount))}px)`, 
                `calc(-50% + ${(width / 2 - width / 8) * Math.cos(2 * Math.PI * ((index + 1) / circleCount))}px)`,
                `calc(-50% + ${(width / 2 - width / 8) * Math.cos(2 * Math.PI * ((index + 2) / circleCount))}px)`,
                `calc(-50% + ${(width / 2 - width / 8) * Math.cos(2 * Math.PI * ((index + 3) / circleCount))}px)`,
                `calc(-50% + ${(width / 2 - width / 8) * Math.cos(2 * Math.PI * ((index + 4) / circleCount))}px)`,
              ],
              y: [
                `calc(-50% + ${(height / 2 - height / 8) * Math.sin(2 * Math.PI * (index / circleCount))}px)`,
                `calc(-50% + ${(height / 2 - height / 8) * Math.sin(2 * Math.PI * ((index + 1) / circleCount))}px)`,
                `calc(-50% + ${(height / 2 - height / 8) * Math.sin(2 * Math.PI * ((index + 2) / circleCount))}px)`,
                `calc(-50% + ${(height / 2 - height / 8) * Math.sin(2 * Math.PI * ((index + 3) / circleCount))}px)`,
                `calc(-50% + ${(height / 2 - height / 8) * Math.sin(2 * Math.PI * ((index + 4) / circleCount))}px)`,
              ],
              scale: [1, 1.2, 1.2, 1, 1],
              opacity: [0.8, 1, 1, 0.8, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1
            }}
          />
        ))}
        
        {/* Center circle */}
        <motion.div 
          className="absolute rounded-full"
          style={{
            backgroundColor: color,
            width: width / 3,
            height: width / 3,
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {text && (
        <motion.p 
          className={`mt-4 font-medium ${textClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedLoadingSpinner;