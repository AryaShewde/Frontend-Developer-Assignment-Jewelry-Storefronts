import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getBrandTheme } from '../brands/config';

const Header: React.FC = () => {
  const location = useLocation();
  const { itemCount, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine current brand based on route
  const getCurrentBrand = () => {
    const path = location.pathname;
    if (path.startsWith('/aurelle')) return 'aurelle';
    if (path.startsWith('/gemma-grove')) return 'gemma-grove';
    if (path.startsWith('/lustre')) return 'lustre';
    return null;
  };

  const currentBrand = getCurrentBrand();
  const brandTheme = currentBrand ? getBrandTheme(currentBrand) : null;

  // Auto-close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 border-b border-border backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand Name */}
          <div className="flex items-center space-x-6 lg:space-x-10">
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity font-brand-display flex items-center space-x-2"
              aria-label="Jewelry Storefronts Home"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span>{brandTheme ? brandTheme.name : 'Jewelry Storefronts'}</span>
            </Link>

            {/* Navigation for larger screens */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/aurelle"
                className={`transition-colors py-1 hover:text-primary ${
                  currentBrand === 'aurelle'
                    ? 'text-foreground font-semibold border-b-2 border-primary'
                    : 'text-muted'
                }`}
              >
                Aurelle
              </Link>
              <Link
                to="/gemma-grove"
                className={`transition-colors py-1 hover:text-primary ${
                  currentBrand === 'gemma-grove'
                    ? 'text-foreground font-semibold border-b-2 border-primary'
                    : 'text-muted'
                }`}
              >
                Gemma &amp; Grove
              </Link>
              <Link
                to="/lustre"
                className={`transition-colors py-1 hover:text-primary ${
                  currentBrand === 'lustre'
                    ? 'text-foreground font-semibold border-b-2 border-primary'
                    : 'text-muted'
                }`}
              >
                Lustre
              </Link>

              {/* Direct Collection Shortcut */}
              {currentBrand === 'aurelle' && (
                <Link
                  to="/aurelle/engagement-rings"
                  className="text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-foreground transition-colors"
                >
                  Rings Catalog
                </Link>
              )}
              {currentBrand === 'gemma-grove' && (
                <Link
                  to="/gemma-grove/gemstone-rings"
                  className="text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-foreground transition-colors"
                >
                  Gemstone Catalog
                </Link>
              )}
              {currentBrand === 'lustre' && (
                <Link
                  to="/lustre/moissanite-rings"
                  className="text-xs uppercase tracking-wider px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-foreground transition-colors"
                >
                  Moissanite Catalog
                </Link>
              )}
            </nav>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full hover:bg-neutral-100 text-foreground transition-colors touch-target flex items-center justify-center"
              aria-label={`Open shopping bag, ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-primary rounded-full ring-2 ring-background animate-scale-in">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2.5 rounded-full hover:bg-neutral-100 text-foreground transition-colors touch-target flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-slide-down">
            <nav className="flex flex-col space-y-3">
              <div className="text-xs uppercase font-semibold tracking-wider text-muted px-2">
                Brand Storefronts
              </div>
              <Link
                to="/aurelle"
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors touch-target flex items-center justify-between ${
                  currentBrand === 'aurelle' ? 'bg-neutral-100 text-primary font-semibold' : 'text-foreground hover:bg-neutral-50'
                }`}
              >
                <span>Aurelle — Lab-Grown Diamonds</span>
                <span className="text-xs text-muted">Ivory &amp; Gold</span>
              </Link>
              <Link
                to="/gemma-grove"
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors touch-target flex items-center justify-between ${
                  currentBrand === 'gemma-grove' ? 'bg-neutral-100 text-primary font-semibold' : 'text-foreground hover:bg-neutral-50'
                }`}
              >
                <span>Gemma &amp; Grove — Colored Gemstones</span>
                <span className="text-xs text-muted">Jewel Tones</span>
              </Link>
              <Link
                to="/lustre"
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors touch-target flex items-center justify-between ${
                  currentBrand === 'lustre' ? 'bg-neutral-100 text-primary font-semibold' : 'text-foreground hover:bg-neutral-50'
                }`}
              >
                <span>Lustre — Architectural Moissanite</span>
                <span className="text-xs text-muted">Monochrome</span>
              </Link>

              <div className="pt-2 border-t border-border">
                <div className="text-xs uppercase font-semibold tracking-wider text-muted px-2 mb-2">
                  Catalogs
                </div>
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    to="/aurelle/engagement-rings"
                    className="px-3 py-2 text-xs font-medium text-muted hover:text-foreground hover:bg-neutral-50 rounded"
                  >
                    Aurelle Engagement Rings Catalog (12)
                  </Link>
                  <Link
                    to="/gemma-grove/gemstone-rings"
                    className="px-3 py-2 text-xs font-medium text-muted hover:text-foreground hover:bg-neutral-50 rounded"
                  >
                    Gemma &amp; Grove Gemstones Catalog (12)
                  </Link>
                  <Link
                    to="/lustre/moissanite-rings"
                    className="px-3 py-2 text-xs font-medium text-muted hover:text-foreground hover:bg-neutral-50 rounded"
                  >
                    Lustre Moissanite Catalog (12)
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
