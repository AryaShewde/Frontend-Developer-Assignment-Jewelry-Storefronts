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

  // Structured Data (JSON-LD) for BreadcrumbList
  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jewelry-storefronts.example.com/',
      },
      ...generatedItems.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.label,
        item: `https://jewelry-storefronts.example.com${item.href}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <nav aria-label="Breadcrumb" className={`${className}`}>
        <ol className="flex items-center space-x-2 text-xs sm:text-sm">
          {/* Home breadcrumb */}
          <li>
            <Link
              to="/"
              className="flex items-center text-muted hover:text-primary transition-colors touch-target py-1"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          {/* Dynamic breadcrumbs */}
          {generatedItems.map((item, index) => (
            <React.Fragment key={item.href}>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
              </li>
              <li className="truncate max-w-48 sm:max-w-none">
                {item.current || index === generatedItems.length - 1 ? (
                  <span
                    className="text-foreground font-semibold truncate block"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-muted hover:text-primary transition-colors truncate block"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
};

// Helper function to generate breadcrumbs from route path
const generateBreadcrumbsFromRoute = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter((segment) => segment !== '');

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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special cases for brand names
    if (segment === 'gemma-grove') {
      label = 'Gemma & Grove';
    } else if (segment === 'aurelle') {
      label = 'Aurelle';
    } else if (segment === 'lustre') {
      label = 'Lustre';
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
