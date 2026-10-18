import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gem, Diamond } from 'lucide-react';
import { brandThemes } from '../brands/config';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Curated Jewelry Storefronts
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
          Three distinct brands, one exceptional experience. Explore premium jewelry collections with unique aesthetics and craftsmanship.
        </p>
      </section>

      {/* Brands showcase */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-12">
          Our Premium Brands
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Aurelle */}
          <div
            className="rounded-xl overflow-hidden border border-border transition-all hover:shadow-lg"
            style={{
              backgroundColor: brandThemes.aurelle.colors.background,
              borderColor: brandThemes.aurelle.colors.border,
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
                style={{ backgroundColor: brandThemes.aurelle.colors.primary + '20' }}
              >
                <Diamond className="w-8 h-8" style={{ color: brandThemes.aurelle.colors.primary }} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3"
                style={{ color: brandThemes.aurelle.colors.foreground }}
              >
                {brandThemes.aurelle.name}
              </h3>
              <p className="text-center mb-6"
                style={{ color: brandThemes.aurelle.colors.muted }}
              >
                {brandThemes.aurelle.description}
              </p>
              <div className="space-y-2 mb-8">
                <div className="text-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: brandThemes.aurelle.colors.accent }} />
                  <span style={{ color: brandThemes.aurelle.colors.foreground }}>
                    Lab-grown diamond engagement rings
                  </span>
                </div>
                <div className="text-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: brandThemes.aurelle.colors.accent }} />
                  <span style={{ color: brandThemes.aurelle.colors.foreground }}>
                    Ivory & champagne gold elegance
                  </span>
                </div>
              </div>
              <Link
                to="/aurelle"
                className="block w-full py-3 text-center rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: brandThemes.aurelle.colors.primary,
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Explore Aurelle
              </Link>
            </div>
          </div>

          {/* Gemma & Grove */}
          <div
            className="rounded-xl overflow-hidden border border-border transition-all hover:shadow-lg"
            style={{
              backgroundColor: brandThemes['gemma-grove'].colors.background,
              borderColor: brandThemes['gemma-grove'].colors.border,
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
                style={{ backgroundColor: brandThemes['gemma-grove'].colors.primary + '20' }}
              >
                <Gem className="w-8 h-8" style={{ color: brandThemes['gemma-grove'].colors.primary }} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3"
                style={{ color: brandThemes['gemma-grove'].colors.foreground }}
              >
                {brandThemes['gemma-grove'].name}
              </h3>
              <p className="text-center mb-6"
                style={{ color: brandThemes['gemma-grove'].colors.muted }}
              >
                {brandThemes['gemma-grove'].description}
              </p>
              <div className="space-y-2 mb-8">
                <div className="text-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: brandThemes['gemma-grove'].colors.accent }} />
                  <span style={{ color: brandThemes['gemma-grove'].colors.foreground }}>
                    Colored gemstone jewelry
                  </span>
                </div>
                <div className="text-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: brandThemes['gemma-grove'].colors.accent }} />
                  <span style={{ color: brandThemes['gemma-grove'].colors.foreground }}>
                    Rich jewel tones & editorial layouts
                  </span>
                </div>
              </div>
              <Link
                to="/gemma-grove"
                className="block w-full py-3 text-center rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: brandThemes['gemma-grove'].colors.primary,
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                Explore Gemma & Grove
              </Link>
            </div>
          </div>

          {/* Lustre */}
          <div
            className="rounded-xl overflow-hidden border border-border transition-all hover:shadow-lg"
            style={{
              backgroundColor: brandThemes.lustre.colors.background,
              borderColor: brandThemes.lustre.colors.border,
            }}
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto"
                style={{ backgroundColor: brandThemes.lustre.colors.primary + '20' }}
              >
                <Diamond className="w-8 h-8" style={{ color: brandThemes.lustre.colors.accent }} />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3"
                style={{ color: brandThemes.lustre.colors.foreground }}
              >
                {brandThemes.lustre.name}
              </h3>
              <p className="text-center mb-6"
                style={{ color: brandThemes.lustre.colors.muted }}
              >
                {brandThemes.lustre.description}
              </p>
              <div className="space-y-2 mb-8">
                <div className="text-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: brandThemes.lustre.colors.accent }} />
                  <span style={{ color: brandThemes.lustre.colors.foreground }}>
                    Moissanite rings & earrings
                  </span>
                </div>
                <div className="text-sm flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: brandThemes.lustre.colors.accent }} />
                  <span style={{ color: brandThemes.lustre.colors.foreground }}>
                    Dark, high-contrast design
                  </span>
                </div>
              </div>
              <Link
                to="/lustre"
                className="block w-full py-3 text-center rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: brandThemes.lustre.colors.primary,
                  color: brandThemes.lustre.colors.foreground,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = brandThemes.lustre.colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = brandThemes.lustre.colors.primary;
                }}
              >
                Explore Lustre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="max-w-3xl mx-auto text-center py-12 border-t border-border">
        <h2 className="text-2xl font-semibold mb-6">
          About This Project
        </h2>
        <div className="space-y-4 text-muted">
          <p>
            This is a frontend development demonstration for Axe Consultancy And Security Services LLC, showcasing three fictional premium jewelry brands sharing one component library and layout system.
          </p>
          <p>
            Each brand maintains distinct visual identity while using shared React components, TypeScript architecture, and Tailwind CSS utilities.
          </p>
          <p className="text-sm pt-4">
            Built with React, TypeScript, Vite, React Router, Tailwind CSS, and Lucide React icons.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;