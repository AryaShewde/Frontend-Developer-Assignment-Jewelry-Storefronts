import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'text' | 'image';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const skeletons = Array(count).fill(null);

  const getSkeleton = (index: number) => {
    switch (type) {
      case 'card':
        return (
          <div
            key={index}
            className={`bg-neutral-100 rounded-lg overflow-hidden animate-pulse ${className}`}
          >
            <div className="aspect-square bg-neutral-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div
            key={index}
            className={`space-y-3 animate-pulse ${className}`}
          >
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
          </div>
        );

      case 'text':
        return (
          <div
            key={index}
            className={`space-y-2 animate-pulse ${className}`}
          >
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-11/12"></div>
            <div className="h-4 bg-neutral-200 rounded w-10/12"></div>
          </div>
        );

      case 'image':
        return (
          <div
            key={index}
            className={`aspect-square bg-neutral-200 rounded-lg animate-pulse ${className}`}
          ></div>
        );

      default:
        return (
          <div
            key={index}
            className={`bg-neutral-100 rounded-lg animate-pulse ${className}`}
          >
            <div className="h-48 bg-neutral-200 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4" role="status" aria-label="Loading">
      {skeletons.map((_, index) => getSkeleton(index))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export default LoadingSkeleton;