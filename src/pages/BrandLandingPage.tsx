import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Star, ArrowRight } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getBrandTheme, applyBrandStyles } from '../brands/config';
import { api, getProductUrl, getBrandListingRoute } from '../api';
import { formatPrice } from '../utils/format';
import type { Product } from '../types';

interface BrandLandingPageProps {
  brandId: 'aurelle' | 'gemma-grove' | 'lustre';
}

const BrandLandingPage: React.FC<BrandLandingPageProps> = ({ brandId }) => {
  const theme = getBrandTheme(brandId);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply brand styles
  useEffect(() => {
    applyBrandStyles(brandId);
  }, [brandId]);

  // Load featured products from the API module
  useEffect(() => {
    let active = true;

    api.getFeaturedProducts(brandId, 4).then((response) => {
      if (!active) return;
      if (response.success) {
        setFeaturedProducts(response.data);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [brandId]);

  const collectionRoute = getBrandListingRoute(brandId);

  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true">
        <LoadingSkeleton type="text" count={3} className="max-w-3xl mx-auto" />
        <LoadingSkeleton type="card" count={4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" />
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="text-center py-12 md:py-20">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-4"
          style={{
            backgroundColor: theme.colors.primary + '18',
            color: theme.colors.primary,
          }}
        >
          Fine Jewelry Collection
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 font-brand-display tracking-tight"
          style={{ color: theme.colors.foreground }}
        >
          {theme.name}
        </h1>
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: theme.colors.muted }}
        >
          {theme.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={collectionRoute}
            className="px-8 py-3 rounded-md font-medium transition-colors shadow-sm hover:opacity-90 inline-flex items-center"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
            }}
          >
            Explore Collection
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            to="/"
            className="px-8 py-3 rounded-md font-medium border transition-colors hover:bg-neutral-50"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.foreground,
            }}
          >
            All Brands
          </Link>
        </div>
      </section>

      {/* Featured Products from API */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-medium tracking-wider" style={{ color: theme.colors.primary }}>
                Curated Selection
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-brand-display mt-1" style={{ color: theme.colors.foreground }}>
                Signature Designs
              </h2>
            </div>
            <Link
              to={collectionRoute}
              className="text-sm font-medium hover:underline inline-flex items-center"
              style={{ color: theme.colors.primary }}
            >
              View All Catalog Designs
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
              const detailUrl = getProductUrl(brandId, product.slug);

              return (
                <article
                  key={product.id}
                  className="group rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                  style={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  }}
                >
                  <Link to={detailUrl} className="block aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={primaryImg?.url || '/favicon.svg'}
                      alt={primaryImg?.alt || product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase font-medium tracking-wider mb-1" style={{ color: theme.colors.muted }}>
                        {product.metal || product.gemstone}
                      </div>
                      <h3 className="font-semibold text-base mb-2 font-brand-display line-clamp-1">
                        <Link to={detailUrl} className="hover:underline" style={{ color: theme.colors.foreground }}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: theme.colors.muted }}>
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.colors.border }}>
                        <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                          {formatPrice(product.price)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold" style={{ color: theme.colors.foreground }}>
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Brand Value Propositions */}
      <section className="max-w-6xl mx-auto border-t pt-16" style={{ borderColor: theme.colors.border }}>
        <h2
          className="text-2xl font-semibold text-center mb-12 font-brand-display"
          style={{ color: theme.colors.foreground }}
        >
          Why Choose {theme.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="p-6 rounded-lg border"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.neutral[50],
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: theme.colors.primary + '20' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: theme.colors.primary }} />
            </div>
            <h3 className="text-lg font-semibold mb-3 font-brand-display" style={{ color: theme.colors.foreground }}>
              Master Artisanship
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.colors.muted }}>
              Every piece is hand-finished with meticulous tolerances, precision gemstone prongs, and seamless comfort-fit shanks.
            </p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.neutral[50],
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: theme.colors.primary + '20' }}
            >
              <Check className="w-6 h-6" style={{ color: theme.colors.primary }} />
            </div>
            <h3 className="text-lg font-semibold mb-3 font-brand-display" style={{ color: theme.colors.foreground }}>
              Ethical Sourcing
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.colors.muted }}>
              100% traceable lab-grown stones, artisanal mines, and recycled precious metals to honor both beauty and our planet.
            </p>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.neutral[50],
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: theme.colors.primary + '20' }}
            >
              <Star className="w-6 h-6" style={{ color: theme.colors.primary }} />
            </div>
            <h3 className="text-lg font-semibold mb-3 font-brand-display" style={{ color: theme.colors.foreground }}>
              Lifetime Warranty
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: theme.colors.muted }}>
              Complimentary annual prong inspection, professional ultrasonic cleaning, and warranty coverage for enduring confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-3xl mx-auto py-8">
        <h2 className="text-2xl font-semibold text-center mb-6 font-brand-display" style={{ color: theme.colors.foreground }}>
          The {theme.name} Philosophy
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-center" style={{ color: theme.colors.muted }}>
          <p>
            {brandId === 'aurelle'
              ? 'Aurelle was founded on the belief that enduring romance deserves modern, conscious diamonds. Our lab-grown engagement rings deliver exceptional optical clarity and brilliance in warm champagne gold and platinum settings.'
              : brandId === 'gemma-grove'
              ? 'Gemma & Grove celebrates rare colored gemstones sourced with integrity. From royal Ceylon sapphires to Australian black opals, each jewel is an heirloom conversation piece.'
              : 'Lustre redefines luxury with moissanite engineered for remarkable refractive brilliance and fiery dispersion. Our high-contrast aesthetic is designed for discerning modern aesthetics.'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default BrandLandingPage;
