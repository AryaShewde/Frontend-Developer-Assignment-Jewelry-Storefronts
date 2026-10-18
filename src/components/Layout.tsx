import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { CartDrawer } from './CartDrawer';

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showBreadcrumbs = true }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Header />

      <main className="grow">
        {/* Breadcrumbs (optional) */}
        {showBreadcrumbs && location.pathname !== '/' && (
          <div className="container mx-auto px-4 sm:px-6 pt-4 max-w-7xl">
            <Breadcrumbs />
          </div>
        )}

        {/* Page content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          {children}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Layout;
