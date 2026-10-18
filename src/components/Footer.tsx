import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Truck, CreditCard, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-border mt-auto">
      {/* Trust signals */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            <div className="flex flex-col items-center text-center">
              <Truck className="w-8 h-8 text-muted mb-3" />
              <h3 className="text-sm font-semibold mb-1">Free Insured Shipping</h3>
              <p className="text-xs text-muted">Complimentary express shipping on all fine orders</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-8 h-8 text-muted mb-3" />
              <h3 className="text-sm font-semibold mb-1">Lifetime Warranty</h3>
              <p className="text-xs text-muted">Prong inspection, cleaning & quality assurance</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="w-8 h-8 text-muted mb-3" />
              <h3 className="text-sm font-semibold mb-1">Secure Ordering</h3>
              <p className="text-xs text-muted">Encrypted processing with flexible financing</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="w-8 h-8 text-muted mb-3" />
              <h3 className="text-sm font-semibold mb-1">Ethical Integrity</h3>
              <p className="text-xs text-muted">100% traceable gemstones & conflict-free stones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight font-brand-display">Jewelry Storefronts</h2>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              A unified e-commerce architecture supporting three distinct American jewelry houses sharing one scalable React component system.
            </p>
            <p className="text-[11px] text-muted">
              Built with React 19, TypeScript, React Router 7, Vite 8, and Tailwind CSS.
            </p>
          </div>

          {/* Storefront Brands */}
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-foreground mb-4">Our Storefronts</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/aurelle"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Aurelle — Lab-Grown Diamonds
                </Link>
              </li>
              <li>
                <Link
                  to="/gemma-grove"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Gemma & Grove — Colored Gemstones
                </Link>
              </li>
              <li>
                <Link
                  to="/lustre"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Lustre — High-Fire Moissanite
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Brand Showcase Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Catalog Collections */}
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-foreground mb-4">Catalog Collections</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/aurelle/engagement-rings"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Aurelle Engagement Rings (12)
                </Link>
              </li>
              <li>
                <Link
                  to="/gemma-grove/gemstone-rings"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Gemma & Grove Gemstones (12)
                </Link>
              </li>
              <li>
                <Link
                  to="/lustre/moissanite-rings"
                  className="text-xs text-muted hover:text-primary transition-colors block"
                >
                  Lustre Moissanite Collection (12)
                </Link>
              </li>
            </ul>
          </div>

          {/* Craftsmanship & Standards */}
          <div>
            <h3 className="text-xs uppercase font-semibold tracking-wider text-foreground mb-4">Standards & Assurance</h3>
            <div className="space-y-2 text-xs text-muted">
              <p>• Verified IGI, GIA & GCAL Certifications</p>
              <p>• 60-Day Complimentary Sizing</p>
              <p>• Recycled 14k/18k Gold & Platinum</p>
              <p>• Pure Asynchronous API Architecture</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted gap-4">
          <p>© {currentYear} Jewelry Storefronts. Built for Axe Consultancy And Security Services LLC Frontend Evaluation.</p>
          <div className="flex space-x-6">
            <Link to="/aurelle" className="hover:text-primary transition-colors">Aurelle</Link>
            <Link to="/gemma-grove" className="hover:text-primary transition-colors">Gemma & Grove</Link>
            <Link to="/lustre" className="hover:text-primary transition-colors">Lustre</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
