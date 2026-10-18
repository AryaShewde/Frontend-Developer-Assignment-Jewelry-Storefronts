import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  Star,
  Sparkles,
} from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { getBrandTheme, applyBrandStyles } from '../brands/config';
import { api, getProductUrl } from '../api';
import { formatPrice } from '../utils/format';
import type { Product, ProductSortOption } from '../types';

interface ProductListingPageProps {
  brandId: 'aurelle' | 'gemma-grove' | 'lustre';
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({ brandId }) => {
  const theme = getBrandTheme(brandId);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<ProductSortOption>('featured');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');

  const [reloadKey, setReloadKey] = useState(0);

  // Apply brand styles
  useEffect(() => {
    applyBrandStyles(brandId);
  }, [brandId]);

  // Load products asynchronously from API module
  useEffect(() => {
    let active = true;

    api.getProductsByBrand(brandId).then((response) => {
      if (!active) return;

      if (!response.success) {
        setError(response.error || 'Failed to load catalog products.');
        setProducts([]);
      } else {
        setProducts(response.data);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [brandId, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  const getCategoryTitle = () => {
    switch (brandId) {
      case 'aurelle':
        return 'Engagement Rings';
      case 'gemma-grove':
        return 'Gemstone Rings';
      case 'lustre':
        return 'Moissanite Rings & Fine Jewelry';
    }
  };

  const getCategoryDescription = () => {
    switch (brandId) {
      case 'aurelle':
        return 'Conflict-free lab-grown diamond engagement rings crafted in warm champagne gold, radiant platinum, and fine ivory accents.';
      case 'gemma-grove':
        return 'Bold, vibrant colored gemstones sourced with integrity and framed in rich artisanal jewel-toned settings.';
      case 'lustre':
        return 'Architectural moissanite rings and earrings engineered for maximum optical dispersion, fire, and stark modern elegance.';
    }
  };

  // Filter and sort products client-side for immediate responsive interactions
  const displayedProducts = React.useMemo(() => {
    let list = [...products];

    if (selectedMetal !== 'all') {
      list = list.filter((p) => p.metal?.toLowerCase().includes(selectedMetal.toLowerCase()));
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedMetal, sortBy]);

  // Unique metal options
  const metalOptions = React.useMemo(() => {
    const metals = new Set<string>();
    products.forEach((p) => {
      if (p.metal) metals.add(p.metal);
    });
    return Array.from(metals);
  }, [products]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true">
        <div className="space-y-4">
          <LoadingSkeleton type="text" count={2} className="max-w-2xl" />
          <div className="flex items-center justify-between pt-2">
            <LoadingSkeleton type="text" count={1} className="w-48" />
            <div className="flex space-x-3">
              <div className="w-24 h-9 bg-neutral-200 rounded animate-pulse" />
              <div className="w-24 h-9 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <LoadingSkeleton type="card" count={8} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Unable to Load Catalog"
        message={error}
        showRetry={true}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-3"
          style={{
            backgroundColor: theme.colors.primary + '18',
            color: theme.colors.primary,
          }}
        >
          {theme.name} Catalog
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold tracking-tight mb-3 font-brand-display"
          style={{ color: theme.colors.foreground }}
        >
          {getCategoryTitle()}
        </h1>
        <p
          className="text-base md:text-lg max-w-3xl leading-relaxed"
          style={{ color: theme.colors.muted }}
        >
          {getCategoryDescription()}
        </p>
      </div>

      {/* Controls Bar */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-lg transition-colors"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.neutral[50],
        }}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm rounded-md border font-medium transition-colors"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: showFilters ? theme.colors.primary : 'transparent',
              color: showFilters
                ? theme.id === 'lustre'
                  ? theme.colors.foreground
                  : '#ffffff'
                : theme.colors.foreground,
            }}
            aria-expanded={showFilters}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          <span className="text-sm font-medium" style={{ color: theme.colors.muted }}>
            Showing {displayedProducts.length} of {products.length} products
          </span>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-xs uppercase font-medium tracking-wider" style={{ color: theme.colors.muted }}>
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
              className="text-sm px-3 py-1.5 rounded-md border bg-background font-medium focus:outline-none"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Alphabetical</option>
            </select>
          </div>

          {/* Grid/List switch */}
          <div
            className="flex items-center space-x-1 border rounded-md p-1 bg-background"
            style={{ borderColor: theme.colors.border }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-neutral-100 font-semibold' : 'text-neutral-400'
              }`}
              style={{ color: viewMode === 'grid' ? theme.colors.primary : undefined }}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-neutral-100 font-semibold' : 'text-neutral-400'
              }`}
              style={{ color: viewMode === 'list' ? theme.colors.primary : undefined }}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <div
          className="p-5 border rounded-lg animate-slide-down space-y-4"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.neutral[50],
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: theme.colors.border }}>
            <h2 className="text-sm font-semibold tracking-wider uppercase" style={{ color: theme.colors.foreground }}>
              Filter by Material
            </h2>
            {selectedMetal !== 'all' && (
              <button
                onClick={() => setSelectedMetal('all')}
                className="text-xs underline hover:opacity-80"
                style={{ color: theme.colors.primary }}
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMetal('all')}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedMetal === 'all' ? 'font-semibold' : ''
              }`}
              style={{
                borderColor: theme.colors.border,
                backgroundColor: selectedMetal === 'all' ? theme.colors.primary : 'transparent',
                color: selectedMetal === 'all'
                  ? theme.id === 'lustre'
                    ? theme.colors.foreground
                    : '#ffffff'
                  : theme.colors.foreground,
              }}
            >
              All Materials ({products.length})
            </button>
            {metalOptions.map((metal) => {
              const count = products.filter((p) => p.metal === metal).length;
              const isSelected = selectedMetal === metal;
              return (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(isSelected ? 'all' : metal)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    isSelected ? 'font-semibold' : ''
                  }`}
                  style={{
                    borderColor: theme.colors.border,
                    backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    color: isSelected
                      ? theme.id === 'lustre'
                        ? theme.colors.foreground
                        : '#ffffff'
                      : theme.colors.foreground,
                  }}
                >
                  {metal} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {displayedProducts.length === 0 && (
        <EmptyState
          icon="search"
          title="No Matching Jewelry Found"
          description="We couldn't find any designs matching your current filter criteria. Try clearing filters to see all available products."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedMetal('all');
            setSortBy('featured');
          }}
        />
      )}

      {/* Product Catalog Grid / List */}
      {displayedProducts.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {displayedProducts.map((product) => {
            const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
            const detailUrl = getProductUrl(brandId, product.slug);

            return (
              <article
                key={product.id}
                className={`group rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg flex ${
                  viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'
                }`}
                style={{
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                }}
              >
                {/* Image Section */}
                <Link
                  to={detailUrl}
                  className={`relative block overflow-hidden bg-neutral-100 ${
                    viewMode === 'list'
                      ? 'sm:w-64 sm:min-w-[16rem] aspect-square'
                      : 'aspect-square'
                  }`}
                >
                  <img
                    src={primaryImg?.url || '/favicon.svg'}
                    alt={primaryImg?.alt || product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badge */}
                  {product.tags.includes('bestseller') && (
                    <span
                      className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                      }}
                    >
                      Bestseller
                    </span>
                  )}
                  {product.tags.includes('new') && (
                    <span
                      className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm bg-neutral-900 text-white"
                    >
                      New Arrival
                    </span>
                  )}
                </Link>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metal / Stone Tag */}
                    <div className="text-xs uppercase font-medium tracking-wider mb-1" style={{ color: theme.colors.muted }}>
                      {product.metal || product.gemstone}
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-semibold leading-snug mb-2 font-brand-display">
                      <Link
                        to={detailUrl}
                        className="hover:underline transition-colors"
                        style={{ color: theme.colors.foreground }}
                      >
                        {product.name}
                      </Link>
                    </h2>

                    {/* Short Description */}
                    <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: theme.colors.muted }}>
                      {product.shortDescription || product.description}
                    </p>
                  </div>

                  <div>
                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold" style={{ color: theme.colors.foreground }}>
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-xs" style={{ color: theme.colors.muted }}>
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.colors.border }}>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs line-through" style={{ color: theme.colors.muted }}>
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <Link
                        to={detailUrl}
                        className="text-xs font-semibold px-3 py-1.5 rounded border transition-colors hover:opacity-90 inline-flex items-center"
                        style={{
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.neutral[50],
                          color: theme.colors.foreground,
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Craftsmanship Footer Info */}
      <div
        className="mt-16 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ borderColor: theme.colors.border }}
      >
        <div className="p-4 rounded-lg bg-neutral-50/50">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <h3 className="font-semibold text-sm" style={{ color: theme.colors.foreground }}>
              Authentic Materials
            </h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: theme.colors.muted }}>
            Every gemstone and diamond is verified, graded, and set by master jewelers adhering to strict environmental standards.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50/50">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <h3 className="font-semibold text-sm" style={{ color: theme.colors.foreground }}>
              Complimentary Sizing
            </h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: theme.colors.muted }}>
            Enjoy one complimentary ring resize within 60 days of purchase to ensure a flawless and comfortable fit.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-neutral-50/50">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <h3 className="font-semibold text-sm" style={{ color: theme.colors.foreground }}>
              Direct Asynchronous API
            </h3>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: theme.colors.muted }}>
            Catalogs are retrieved dynamically through asynchronous API modules, keeping UI views decoupled from static files.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
