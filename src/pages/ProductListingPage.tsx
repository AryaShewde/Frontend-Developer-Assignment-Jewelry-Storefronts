import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  Star,
  Sparkles,
  X,
  RotateCcw,
  SlidersHorizontal,
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

const ITEMS_PER_PAGE = 12;

// Metal color map for visual swatches
const METAL_COLOR_MAP: Record<string, { bg: string; name: string }> = {
  yellow: { bg: '#E6CA65', name: 'Yellow Gold' },
  white: { bg: '#E0E0E0', name: 'White Gold / Platinum' },
  rose: { bg: '#E8A598', name: 'Rose Gold' },
  platinum: { bg: '#D8D8D8', name: 'Platinum' },
};

const getMetalSwatchColor = (metalName?: string) => {
  if (!metalName) return null;
  const lower = metalName.toLowerCase();
  if (lower.includes('rose')) return METAL_COLOR_MAP.rose;
  if (lower.includes('yellow')) return METAL_COLOR_MAP.yellow;
  if (lower.includes('white') || lower.includes('platinum')) return METAL_COLOR_MAP.white;
  return null;
};

const ProductListingPage: React.FC<ProductListingPageProps> = ({ brandId }) => {
  const theme = getBrandTheme(brandId);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);

  // Filter and sort state
  const [sortBy, setSortBy] = useState<ProductSortOption>('featured');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [selectedShapeOrGem, setSelectedShapeOrGem] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [reloadKey, setReloadKey] = useState(0);

  // Apply brand styles and update page title
  useEffect(() => {
    applyBrandStyles(brandId);
    const titles: Record<string, string> = {
      aurelle: 'Aurelle — Lab-Grown Diamond Engagement Rings Catalog',
      'gemma-grove': 'Gemma & Grove — Fine Colored Gemstone Rings Collection',
      lustre: 'Lustre — Architectural Moissanite Jewelry Collection',
    };
    document.title = titles[brandId] || 'Jewelry Storefronts Catalog';
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
        return 'Lab-Grown Diamond Engagement Rings';
      case 'gemma-grove':
        return 'Artisanal Colored Gemstone Rings';
      case 'lustre':
        return 'Architectural Moissanite Rings & Jewelry';
    }
  };

  const getCategoryDescription = () => {
    switch (brandId) {
      case 'aurelle':
        return 'Discover our master-crafted collection of conflict-free lab-grown diamond engagement rings. Hand-set in warm champagne gold, platinum, and delicate milgrain bezels, each stone is certified by IGI for exceptional cut, color, and optical clarity.';
      case 'gemma-grove':
        return 'Explore vivid colored gemstones celebrated for their natural provenance, deep chromatic saturation, and organic geometry. From royal Ceylon sapphires to glowing Zambian emeralds, each design honors nature’s most alluring mineral treasures.';
      case 'lustre':
        return 'Engineered with silicon carbide moissanite boasting a refractive index of 2.65 and 0.104 fire dispersion. Paired with stark geometric lines, knife-edge bands, and monochrome minimalism for the discerning contemporary connoisseur.';
    }
  };

  // Derive unique filter options
  const metalOptions = useMemo(() => {
    const metals = new Set<string>();
    products.forEach((p) => {
      if (p.metal) metals.add(p.metal);
    });
    return Array.from(metals);
  }, [products]);

  // Brand-specific secondary filter options:
  // Aurelle: Stone Shape
  // Gemma & Grove: Gemstone Type
  // Lustre: Stone Shape / Style
  const shapeOrGemOptions = useMemo(() => {
    const options = new Set<string>();
    products.forEach((p) => {
      if (brandId === 'gemma-grove' && p.gemstone) {
        options.add(p.gemstone);
      } else if (p.stoneDetails?.cut) {
        options.add(p.stoneDetails.cut);
      }
    });
    return Array.from(options);
  }, [products, brandId]);

  // Filter and sort products client-side for instantaneous feedback
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Metal
    if (selectedMetal !== 'all') {
      list = list.filter((p) => p.metal?.toLowerCase().includes(selectedMetal.toLowerCase()));
    }

    // Filter by Shape or Gemstone
    if (selectedShapeOrGem !== 'all') {
      if (brandId === 'gemma-grove') {
        list = list.filter((p) => p.gemstone?.toLowerCase() === selectedShapeOrGem.toLowerCase());
      } else {
        list = list.filter((p) => p.stoneDetails?.cut?.toLowerCase() === selectedShapeOrGem.toLowerCase());
      }
    }

    // Filter by Price Range
    if (selectedPriceRange !== 'all') {
      if (selectedPriceRange === 'under-1000') {
        list = list.filter((p) => p.price < 1000);
      } else if (selectedPriceRange === '1000-2500') {
        list = list.filter((p) => p.price >= 1000 && p.price <= 2500);
      } else if (selectedPriceRange === 'over-2500') {
        list = list.filter((p) => p.price > 2500);
      }
    }

    // Sort
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
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedMetal, selectedShapeOrGem, selectedPriceRange, sortBy, brandId]);

  // Reset to page 1 during render whenever filters change
  const filterKey = `${selectedMetal}-${selectedShapeOrGem}-${selectedPriceRange}-${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const activeFilterCount =
    (selectedMetal !== 'all' ? 1 : 0) +
    (selectedShapeOrGem !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedMetal('all');
    setSelectedShapeOrGem('all');
    setSelectedPriceRange('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

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
      {/* 1. Header & SEO Section */}
      <section className="space-y-3">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase shadow-xs"
          style={{
            backgroundColor: theme.colors.primary + '18',
            color: theme.colors.primary,
          }}
        >
          {theme.name} • Official Catalog
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-brand-display text-foreground"
        >
          {getCategoryTitle()}
        </h1>
        <p
          className="text-sm sm:text-base max-w-3xl leading-relaxed text-muted font-light"
        >
          {getCategoryDescription()}
        </p>
      </section>

      {/* 2. Controls Bar */}
      <section
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border rounded-xl shadow-xs transition-colors"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.neutral[50],
        }}
      >
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center px-4 py-2 text-xs font-semibold rounded-md border bg-background text-foreground touch-target shadow-xs"
            style={{ borderColor: theme.colors.border }}
            aria-label="Open filter options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-primary" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          {/* Desktop Filter Toggle */}
          <button
            onClick={() => setShowDesktopFilters(!showDesktopFilters)}
            className="hidden md:flex items-center px-4 py-2 text-xs font-semibold rounded-md border transition-colors touch-target shadow-xs"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: showDesktopFilters ? theme.colors.primary : 'transparent',
              color: showDesktopFilters
                ? theme.id === 'lustre'
                  ? theme.colors.foreground
                  : '#ffffff'
                : theme.colors.foreground,
            }}
            aria-expanded={showDesktopFilters}
          >
            <Filter className="w-3.5 h-3.5 mr-2" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 ml-2 transition-transform duration-200 ${
                showDesktopFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          <span className="text-xs font-medium text-muted">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} designs
          </span>

          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-primary hover:underline font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-xs uppercase font-bold tracking-wider text-muted">
              Sort:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
              className="text-xs sm:text-sm px-3 py-2 rounded-md border bg-background font-medium focus:outline-none focus:ring-1 focus:ring-primary touch-target"
              style={{
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
            </select>
          </div>

          {/* Grid/List switch */}
          <div
            className="flex items-center space-x-1 border rounded-md p-1 bg-background"
            style={{ borderColor: theme.colors.border }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors touch-target ${
                viewMode === 'grid' ? 'bg-neutral-100 font-semibold' : 'text-neutral-400'
              }`}
              style={{ color: viewMode === 'grid' ? theme.colors.primary : undefined }}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors touch-target ${
                viewMode === 'list' ? 'bg-neutral-100 font-semibold' : 'text-neutral-400'
              }`}
              style={{ color: viewMode === 'list' ? theme.colors.primary : undefined }}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Desktop Collapsible Filter Panel */}
      {showDesktopFilters && (
        <section
          className="hidden md:block p-6 border rounded-xl shadow-xs space-y-6 animate-slide-down"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.neutral[50],
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metal Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Precious Metal
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedMetal('all')}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                    selectedMetal === 'all'
                      ? 'bg-primary font-bold shadow-xs'
                      : 'bg-background hover:bg-neutral-100 text-foreground'
                  }`}
                  style={{
                    borderColor: theme.colors.border,
                    color: selectedMetal === 'all'
                      ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                      : theme.colors.foreground,
                    backgroundColor: selectedMetal === 'all' ? theme.colors.primary : undefined,
                  }}
                >
                  All Metals
                </button>
                {metalOptions.map((metal) => {
                  const isSelected = selectedMetal === metal;
                  return (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(isSelected ? 'all' : metal)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                        isSelected
                          ? 'bg-primary font-bold shadow-xs'
                          : 'bg-background hover:bg-neutral-100 text-foreground'
                      }`}
                      style={{
                        borderColor: theme.colors.border,
                        color: isSelected
                          ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                          : theme.colors.foreground,
                        backgroundColor: isSelected ? theme.colors.primary : undefined,
                      }}
                    >
                      {metal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shape or Gemstone Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                {brandId === 'gemma-grove' ? 'Gemstone Type' : 'Stone Shape'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedShapeOrGem('all')}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                    selectedShapeOrGem === 'all'
                      ? 'bg-primary font-bold shadow-xs'
                      : 'bg-background hover:bg-neutral-100 text-foreground'
                  }`}
                  style={{
                    borderColor: theme.colors.border,
                    color: selectedShapeOrGem === 'all'
                      ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                      : theme.colors.foreground,
                    backgroundColor: selectedShapeOrGem === 'all' ? theme.colors.primary : undefined,
                  }}
                >
                  All {brandId === 'gemma-grove' ? 'Gemstones' : 'Shapes'}
                </button>
                {shapeOrGemOptions.map((opt) => {
                  const isSelected = selectedShapeOrGem === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedShapeOrGem(isSelected ? 'all' : opt)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                        isSelected
                          ? 'bg-primary font-bold shadow-xs'
                          : 'bg-background hover:bg-neutral-100 text-foreground'
                      }`}
                      style={{
                        borderColor: theme.colors.border,
                        color: isSelected
                          ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                          : theme.colors.foreground,
                        backgroundColor: isSelected ? theme.colors.primary : undefined,
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Price Range
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-1000', label: 'Under $1,000' },
                  { id: '1000-2500', label: '$1,000 – $2,500' },
                  { id: 'over-2500', label: 'Over $2,500' },
                ].map((range) => {
                  const isSelected = selectedPriceRange === range.id;
                  return (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                        isSelected
                          ? 'bg-primary font-bold shadow-xs'
                          : 'bg-background hover:bg-neutral-100 text-foreground'
                      }`}
                      style={{
                        borderColor: theme.colors.border,
                        color: isSelected
                          ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                          : theme.colors.foreground,
                        backgroundColor: isSelected ? theme.colors.primary : undefined,
                      }}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Mobile Slide-In Filter Drawer */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-50 md:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-sm bg-background border-l border-border h-full flex flex-col p-6 shadow-2xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold font-brand-display text-foreground">
                  Refine Catalog ({activeFilterCount})
                </h2>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-muted hover:text-foreground touch-target"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-6">
              {/* Metal Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Precious Metal
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedMetal('all')}
                    className={`px-3 py-2 text-xs rounded-md border touch-target ${
                      selectedMetal === 'all' ? 'bg-primary text-white font-bold' : 'bg-background text-foreground'
                    }`}
                  >
                    All Metals
                  </button>
                  {metalOptions.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(selectedMetal === metal ? 'all' : metal)}
                      className={`px-3 py-2 text-xs rounded-md border touch-target ${
                        selectedMetal === metal ? 'bg-primary text-white font-bold' : 'bg-background text-foreground'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stone / Gemstone Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  {brandId === 'gemma-grove' ? 'Gemstone Family' : 'Stone Shape'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedShapeOrGem('all')}
                    className={`px-3 py-2 text-xs rounded-md border touch-target ${
                      selectedShapeOrGem === 'all' ? 'bg-primary text-white font-bold' : 'bg-background text-foreground'
                    }`}
                  >
                    All Silhouettes
                  </button>
                  {shapeOrGemOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedShapeOrGem(selectedShapeOrGem === opt ? 'all' : opt)}
                      className={`px-3 py-2 text-xs rounded-md border touch-target ${
                        selectedShapeOrGem === opt ? 'bg-primary text-white font-bold' : 'bg-background text-foreground'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Price
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under-1000', label: '< $1,000' },
                    { id: '1000-2500', label: '$1,000 – $2,500' },
                    { id: 'over-2500', label: '> $2,500' },
                  ].map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`px-3 py-2 text-xs rounded-md border touch-target ${
                        selectedPriceRange === range.id ? 'bg-primary text-white font-bold' : 'bg-background text-foreground'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 rounded-md font-semibold text-xs shadow-sm text-center touch-target"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                }}
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={resetAllFilters}
                className="w-full py-2.5 rounded-md border border-border text-xs text-muted hover:text-foreground touch-target"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Empty State */}
      {filteredProducts.length === 0 && (
        <EmptyState
          icon="search"
          title="No Matching Jewelry Found"
          description="We couldn't find any designs matching your current filter criteria. Try clearing or expanding your filters to discover all available pieces."
          actionLabel="Reset All Filters"
          onAction={resetAllFilters}
        />
      )}

      {/* 6. Product Catalog Grid / List */}
      {filteredProducts.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {paginatedProducts.map((product) => {
            const primaryImg = product.images.find((i) => i.isPrimary) || product.images[0];
            const secondaryImg = product.images.length > 1 ? product.images[1] : primaryImg;
            const detailUrl = getProductUrl(brandId, product.slug);
            const swatch = getMetalSwatchColor(product.metal);

            return (
              <article
                key={product.id}
                className={`group rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-xl flex ${
                  viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'
                }`}
                style={{
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                }}
              >
                {/* Image Section with Desktop Hover Swap */}
                <Link
                  to={detailUrl}
                  className={`relative block overflow-hidden bg-neutral-100 ${
                    viewMode === 'list'
                      ? 'sm:w-64 sm:min-w-[16rem] aspect-square'
                      : 'aspect-square'
                  }`}
                  aria-label={`View ${product.name}`}
                >
                  {/* Primary Image (View 1) */}
                  <img
                    src={primaryImg?.url || '/favicon.svg'}
                    alt={primaryImg?.alt || product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />

                  {/* Secondary Image (View 2) on Desktop Hover */}
                  <img
                    src={secondaryImg?.url || primaryImg?.url || '/favicon.svg'}
                    alt={secondaryImg?.alt || `${product.name} alternate view`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                    {product.tags.includes('bestseller') && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs"
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
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Metal swatch dot & stone tag */}
                    <div className="flex items-center justify-between text-xs uppercase font-medium tracking-wider mb-1.5" style={{ color: theme.colors.muted }}>
                      <span className="truncate">{product.metal || product.gemstone}</span>
                      {swatch && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: swatch.bg }}
                          title={swatch.name}
                        />
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-semibold leading-snug mb-1.5 font-brand-display line-clamp-1">
                      <Link
                        to={detailUrl}
                        className="hover:underline transition-colors text-foreground"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    {/* Short Description */}
                    <p className="text-xs line-clamp-2 mb-3 leading-relaxed text-muted">
                      {product.shortDescription || product.description}
                    </p>
                  </div>

                  <div>
                    {/* Rating & Reviews */}
                    <div className="flex items-center space-x-1 mb-3">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-foreground">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/70">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-base sm:text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-xs line-through text-muted">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <Link
                        to={detailUrl}
                        className="text-xs font-semibold px-3 py-1.5 rounded border transition-all hover:bg-neutral-100 text-foreground touch-target flex items-center justify-center"
                        style={{ borderColor: theme.colors.border }}
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

      {/* 7. Pagination Controls */}
      {totalPages > 1 && (
        <section className="flex justify-center items-center space-x-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-xs font-semibold rounded-md border border-border text-foreground hover:bg-neutral-50 disabled:opacity-40 touch-target"
          >
            Previous
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 text-xs font-semibold rounded-md border transition-colors touch-target flex items-center justify-center ${
                    isActive
                      ? 'bg-primary text-white font-bold'
                      : 'border-border text-foreground hover:bg-neutral-50'
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.colors.primary : undefined,
                    color: isActive
                      ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                      : undefined,
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-xs font-semibold rounded-md border border-border text-foreground hover:bg-neutral-50 disabled:opacity-40 touch-target"
          >
            Next
          </button>
        </section>
      )}

      {/* 8. Craftsmanship Quality Assurance Strip */}
      <section
        className="mt-16 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{ borderColor: theme.colors.border }}
      >
        <div className="p-5 rounded-xl bg-neutral-50/50 border border-border/60">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground font-brand-display">
              Ethical Sourcing Assurance
            </h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            All center stones and precious metals adhere to strict zero-conflict ethical guidelines with full chain of custody transparency.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-50/50 border border-border/60">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground font-brand-display">
              Master Lapidary Precision
            </h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Each piece undergoes five-stage optical alignment and ultrasonic polish to ensure supreme fire dispersion and durability.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-50/50 border border-border/60">
          <div className="flex items-center space-x-2 mb-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground font-brand-display">
              Complimentary Atelier Sizing
            </h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            We provide 60-day complimentary ring resizing and insured domestic return shipping on every fine jewelry acquisition.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductListingPage;
