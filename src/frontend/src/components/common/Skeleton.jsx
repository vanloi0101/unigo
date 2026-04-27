import React from 'react';

/**
 * Skeleton Component - Loading placeholder for product cards
 * Creates smooth skeleton animation while data loads
 */
const Skeleton = ({ 
  count = 1, 
  type = 'product', 
  className = '' 
}) => {
  const baseClass = 'animate-pulse';

  // Product Card Skeleton
  if (type === 'product') {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className={`${className}`}>
            {/* Image skeleton */}
            <div className="bg-gray-300 h-48 rounded-lg mb-4" />
            
            {/* Content skeleton */}
            <div className="space-y-3">
              {/* Title skeleton */}
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              
              {/* Price skeleton */}
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              
              {/* Button skeleton */}
              <div className="h-10 bg-gray-300 rounded-lg mt-4" />
            </div>
          </div>
        ))}
      </>
    );
  }

  // Text skeleton
  if (type === 'text') {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className={`h-4 bg-gray-300 rounded mb-2 ${className}`} />
        ))}
      </>
    );
  }

  // Banner skeleton
  if (type === 'banner') {
    return (
      <div className={`bg-gray-300 rounded-lg h-96 ${className}`} />
    );
  }

  // Modal/Card skeleton
  if (type === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="h-64 bg-gray-300 rounded-lg" />
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-10 bg-gray-300 rounded-lg" />
      </div>
    );
  }

  return null;
};

export default Skeleton;
