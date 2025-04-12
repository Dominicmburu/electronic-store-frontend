import React from 'react';
import { motion } from 'framer-motion';
import AnimatedLoadingSpinner from './AnimatedLoadingSpinner';

export const ShopLoadingState: React.FC = () => {
  // Placeholder items for skeleton loading
  const placeholderProducts = Array.from({ length: 6 });
  
  return (
    <div className="py-8 px-4">
      {/* Header skeleton */}
      <div className="container mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div 
            className="w-40 h-8 bg-gray-200 rounded mb-4 md:mb-0"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div 
            className="w-64 h-10 bg-gray-200 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </div>
      
      {/* Main content skeleton with sidebar and products */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar skeleton */}
          <motion.div 
            className="w-full md:w-64 md:mr-8 mb-6 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-gray-100 p-4 rounded-lg shadow-sm"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-full h-6 bg-gray-200 rounded mb-4" />
              
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="mb-4">
                  <motion.div 
                    className="w-full h-5 bg-gray-200 rounded mb-2"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                  />
                  <div className="pl-2">
                    {Array.from({ length: 3 }).map((_, subIndex) => (
                      <motion.div 
                        key={subIndex}
                        className="w-5/6 h-4 bg-gray-200 rounded mt-2"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: (index * 0.1) + (subIndex * 0.05) }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Product grid skeleton */}
          <div className="flex-1">
            {/* Main spinner */}
            <div className="mb-8">
              <AnimatedLoadingSpinner size="lg" text="Loading products..." />
            </div>
            
            {/* Product card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeholderProducts.map((_, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                >
                  {/* Product image placeholder */}
                  <motion.div 
                    className="w-full h-48 bg-gray-200"
                    animate={{ opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                  />
                  
                  {/* Product details placeholders */}
                  <div className="p-4">
                    <motion.div 
                      className="w-5/6 h-5 bg-gray-200 rounded mb-3"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 + (index * 0.1) }}
                    />
                    <div className="flex justify-between items-center">
                      <motion.div 
                        className="w-1/3 h-4 bg-gray-200 rounded"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 + (index * 0.1) }}
                      />
                      <motion.div 
                        className="w-1/3 h-4 bg-gray-200 rounded"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 + (index * 0.1) }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination skeleton */}
            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex space-x-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.div 
                    key={index}
                    className="w-8 h-8 rounded-md bg-gray-200"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLoadingState;