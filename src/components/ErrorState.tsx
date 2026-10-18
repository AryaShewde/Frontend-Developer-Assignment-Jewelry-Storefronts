import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHomeLink?: boolean;
  onRetry?: () => void;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this page. Please try again.',
  showRetry = true,
  showHomeLink = true,
  onRetry,
  secondaryAction,
  secondaryActionLabel,
  className = '',
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-neutral-50 rounded-lg border border-border ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h2>

      <p className="text-muted max-w-md mb-6">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}

        {secondaryAction && secondaryActionLabel ? (
          <button
            onClick={secondaryAction}
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-foreground border border-border rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium"
          >
            {secondaryActionLabel}
          </button>
        ) : (
          showHomeLink && (
            <Link
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-foreground border border-border rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default ErrorState;