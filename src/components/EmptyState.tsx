import React from 'react';
import { Search, Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: 'search' | 'package' | 'cart';
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'package',
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search className="w-12 h-12" />;
      case 'cart':
        return <ShoppingBag className="w-12 h-12" />;
      case 'package':
      default:
        return <Package className="w-12 h-12" />;
    }
  };

  const iconColor = icon === 'search' ? 'text-blue-500' : 'text-muted';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-neutral-50 rounded-lg border border-border ${className}`}
    >
      <div className={`w-20 h-20 flex items-center justify-center rounded-full bg-white mb-4 ${iconColor}`}>
        {getIcon()}
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h2>

      <p className="text-muted max-w-md mb-6">
        {description}
      </p>

      {actionLabel && (
        <div>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EmptyState;