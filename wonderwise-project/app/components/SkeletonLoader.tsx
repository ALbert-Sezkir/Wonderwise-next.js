import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-300 h-64 mb-4 rounded"></div>
      <div className="bg-gray-300 h-64 mb-4 rounded"></div>
      <div className="bg-gray-300 h-64 mb-4 rounded"></div>
      <div className="bg-gray-300 h-64 mb-4 rounded"></div>
      <div className="bg-gray-300 h-64 mb-4 rounded"></div>
      <div className="bg-gray-300 h-64 mb-4 rounded"></div>
    </div>
  );
};

export default SkeletonLoader;