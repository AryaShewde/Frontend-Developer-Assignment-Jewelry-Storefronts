import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { applyBrandStyles, getBrandTheme } from '../brands/config';

const NotFoundPage: React.FC = () => {
  const location = useLocation();

  // Determine brand from path for styling
  const getBrandFromPath = (path: string) => {
    if (path.includes('/aurelle')) return 'aurelle';
    if (path.includes('/gemma-grove')) return 'gemma-grove';
    if (path.includes('/lustre')) return 'lustre';
    return null;
  };

  const brandId = getBrandFromPath(location.pathname);
  const brandTheme = brandId ? getBrandTheme(brandId) : null;

  // Apply brand styles if we're on a brand-specific 404
  React.useEffect(() => {
    if (brandId) {
      applyBrandStyles(brandId);
    }
  }, [brandId]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Brand-specific styling if applicable */}
      {brandTheme && (
        <div className="mb-8">
          <div
            className="text-5xl font-bold mb-2"
            style={{ color: brandTheme.colors.primary }}
          >
            404
          </div>
          <p className="text-lg text-muted">
            {brandTheme.name} - Page Not Found
          </p>
        </div>
      )}

      {/* Generic 404 content */}
      {!brandTheme && (
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary mb-4">404</div>
          <h1 className="text-3xl font-semibold text-foreground mb-4">
            Page Not Found
          </h1>
        </div>
      )}

      <div className="max-w-md mx-auto mb-8">
        <p className="text-lg text-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
          {brandTheme && ` This is the ${brandTheme.name} section of our site.`}
        </p>

        <div className="space-y-4">
          <div className="text-left bg-neutral-50 p-4 rounded-lg border border-border">
            <h3 className="font-medium text-sm text-muted mb-2">You tried to visit:</h3>
            <code className="text-sm bg-white p-2 rounded border border-border block overflow-x-auto">
              {location.pathname}
            </code>
          </div>

          <p className="text-sm text-muted">
            Check the URL for typos, or try one of the links below:
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-foreground border border-border rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>

        <Link
          to="/search"
          className="inline-flex items-center justify-center px-6 py-3 bg-white text-foreground border border-border rounded-md hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Link>
      </div>

      {/* Brand-specific navigation if applicable */}
      {brandTheme && (
        <div className="mt-12 pt-8 border-t border-border w-full max-w-md">
          <h3 className="text-sm font-semibold text-muted mb-4">
            Explore {brandTheme.name}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {brandId === 'aurelle' && (
              <>
                <Link
                  to="/aurelle"
                  className="text-sm text-center py-2 bg-white border border-border rounded hover:bg-neutral-50 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/aurelle/engagement-rings"
                  className="text-sm text-center py-2 bg-white border border-border rounded hover:bg-neutral-50 transition-colors"
                >
                  Engagement Rings
                </Link>
              </>
            )}
            {brandId === 'gemma-grove' && (
              <>
                <Link
                  to="/gemma-grove"
                  className="text-sm text-center py-2 bg-white border border-border rounded hover:bg-neutral-50 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/gemma-grove/gemstone-rings"
                  className="text-sm text-center py-2 bg-white border border-border rounded hover:bg-neutral-50 transition-colors"
                >
                  Gemstone Rings
                </Link>
              </>
            )}
            {brandId === 'lustre' && (
              <>
                <Link
                  to="/lustre"
                  className="text-sm text-center py-2 bg-white border border-border rounded hover:bg-neutral-50 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/lustre/moissanite-rings"
                  className="text-sm text-center py-2 bg-white border border-border rounded hover:bg-neutral-50 transition-colors"
                >
                  Moissanite Rings
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotFoundPage;