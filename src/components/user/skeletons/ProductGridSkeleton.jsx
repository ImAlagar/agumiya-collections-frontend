// src/components/skeletons/ProductGridSkeleton.js
import React from 'react';
import { motion } from 'framer-motion';

const ProductCardSkeleton = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
  >
    <div className="relative aspect-w-4 aspect-h-3">
      <div className="w-full h-64 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse rounded-t-3xl" />
    </div>
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
      </div>
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} index={index} />
      ))}
    </motion.div>
  );
};

export default ProductGridSkeleton;