import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'blue-600',
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    'blue-600': 'border-blue-200 border-t-blue-600',
    'white': 'border-white/30 border-t-white',
    'gray-600': 'border-gray-200 border-t-gray-600',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses['blue-600'];

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 rounded-full animate-spin ${colorClass}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;