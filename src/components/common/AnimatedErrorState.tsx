import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const AnimatedErrorState: React.FC<{ error: string }> = ({ error }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-24 h-24 flex items-center justify-center bg-red-100 rounded-full mb-6"
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-red-500 w-12 h-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </motion.svg>
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold mb-2 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Oops! Something went wrong
      </motion.h2>
      
      <motion.p 
        className="text-gray-600 mb-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {error || "We couldn't load the products. Please try again later."}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link 
          to="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Go back to home
        </Link>
      </motion.div>
    </div>
  );
};

export const AnimatedEmptyState: React.FC<{ searchQuery?: string }> = ({ searchQuery }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6"
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-gray-500 w-12 h-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </motion.svg>
      </motion.div>
      
      <motion.h2 
        className="text-2xl font-bold mb-2 text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        No products found
      </motion.h2>
      
      <motion.p 
        className="text-gray-600 mb-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {searchQuery 
          ? `We couldn't find any products matching "${searchQuery}".` 
          : "There are no products available at the moment."}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-x-4"
      >
        {searchQuery && (
          <Link 
            to="/shop"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          >
            Clear search
          </Link>
        )}
        <Link 
          to="/"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
        >
          Go back to home
        </Link>
      </motion.div>
    </div>
  );
};