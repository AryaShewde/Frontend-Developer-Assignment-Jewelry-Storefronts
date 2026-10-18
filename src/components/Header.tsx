import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getBrandRoute } from '../api';

const Header: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCart();

  // Determine current brand based on route
  const getCurrentBrand = () => {
    const path = location.pathname;
    if (path.startsWith('/aurelle')) return 'aurelle';
    if (path.startsWith('/gemma-grove')) return 'gemma-grove';
    if (path.startsWith('/lustre')) return 'lustre';
    return null;
  };

  const currentBrand = getCurrentBrand();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand Name */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              Jewelry Storefronts
            </Link>

            {/* Navigation for larger screens */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/aurelle"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentBrand === 'aurelle' ? 'text-primary' : 'text-muted'
                }`}
              >
                Aurelle
              </Link>
              <Link
                to="/gemma-grove"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentBrand === 'gemma-grove' ? 'text-primary' : 'text-muted'
                }`}
              >
                Gemma & Grove
              </Link>
              <Link
                to="/lustre"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentBrand === 'lustre' ? 'text-primary' : 'text-muted'
                }`}
              >
                Lustre
              </Link>
            </nav>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-muted" />
            </button>

            {/* User account */}
            <button
              className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-muted" />
            </button>

            {/* Cart with badge */}
            <Link
              to={currentBrand ? `${getBrandRoute(currentBrand)}/cart` : '/cart'}
              className="relative p-2 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-muted" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-neutral-100 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-muted" />
            </button>
          </div>
        </div>

        {/* Mobile navigation (hidden by default) */}
        <div className="md:hidden border-t border-border mt-2 pt-2 pb-4">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/aurelle"
              className={`py-2 text-sm font-medium transition-colors hover:text-primary ${
                currentBrand === 'aurelle' ? 'text-primary' : 'text-muted'
              }`}
            >
              Aurelle
            </Link>
            <Link
              to="/gemma-grove"
              className={`py-2 text-sm font-medium transition-colors hover:text-primary ${
                currentBrand === 'gemma-grove' ? 'text-primary' : 'text-muted'
              }`}
            >
              Gemma & Grove
            </Link>
            <Link
              to="/lustre"
              className={`py-2 text-sm font-medium transition-colors hover:text-primary ${
                currentBrand === 'lustre' ? 'text-primary' : 'text-muted'
              }`}
            >
              Lustre
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;