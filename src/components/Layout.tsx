import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Breadcrumbs (optional) */}
        {showBreadcrumbs && location.pathname !== '/' && (
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs />
          </div>
        )}

        {/* Page content */}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;