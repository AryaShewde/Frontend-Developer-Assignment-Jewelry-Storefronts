import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '../types';

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Generate breadcrumbs from route if not provided
  const generatedItems = items || generateBreadcrumbsFromRoute(location.pathname);

  if (generatedItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`${className}`}>
      <ol className="flex items-center space-x-2 text-sm">
        {/* Home breadcrumb */}
        <li>
          <Link
            to="/"
            className="flex items-center text-muted hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {/* Dynamic breadcrumbs */}
        {generatedItems.map((item, index) => (
          <React.Fragment key={item.href}>
            <li>
              <ChevronRight className="w-4 h-4 text-muted" />
            </li>
            <li>
              {item.current || index === generatedItems.length - 1 ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-muted hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from route path
const generateBreadcrumbsFromRoute = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(segment => segment !== '');

  if (segments.length === 0) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  let accumulatedPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    accumulatedPath += `/${segment}`;

    // Format the label from the segment
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special cases for brand names
    if (segment === 'gemma-grove') {
      label = 'Gemma & Grove';
    }

    breadcrumbs.push({
      label,
      href: accumulatedPath,
      current: i === segments.length - 1,
    });
  }

  return breadcrumbs;
};

export default Breadcrumbs;