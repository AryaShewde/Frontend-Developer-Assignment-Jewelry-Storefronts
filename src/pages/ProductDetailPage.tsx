import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Truck,
  Shield,
  Sparkles,
  Star,
  Award,
  ArrowLeft,
  ChevronDown,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Gem,
  Plus,
  Minus,
} from 'lucide-react';
import ErrorState from '../components/ErrorState';
import { Toast, type ToastItem } from '../components/Toast';
import { getBrandTheme, applyBrandStyles } from '../brands/config';
import { useCart } from '../hooks/useCart';
import { api, getProductUrl, getBrandListingRoute } from '../api';
import { formatPrice } from '../utils/format';
import type { Product } from '../types';

interface ProductDetailPageProps {
  brandId: 'aurelle' | 'gemma-grove' | 'lustre';
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ brandId }) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const theme = getBrandTheme(brandId);
  const { addItem, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [toastItem, setToastItem] = useState<ToastItem | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Accordion open/close state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    specs: true,
    care: false,
    shipping: false,
    warranty: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Apply brand styles
  useEffect(() => {
    applyBrandStyles(brandId);
  }, [brandId]);

  // Track key to reset loading state during render when route params change
  const productKey = `${brandId}-${slug}-${reloadKey}`;
  const [prevProductKey, setPrevProductKey] = useState(productKey);
  if (prevProductKey !== productKey) {
    setPrevProductKey(productKey);
    setLoading(true);
    setError(null);
  }

  // Load product asynchronously from API module
  useEffect(() => {
    let active = true;

    if (!slug) {
      Promise.resolve().then(() => {
        if (!active) return;
        setError('Product identifier is missing.');
        setLoading(false);
      });
      return;
    }

    api.getProductBySlug(brandId, slug).then(async (response) => {
      if (!active) return;

      if (!response.success || !response.data) {
        setError(response.error || `We couldn't locate "${slug}" in the ${theme.name} collection.`);
        setProduct(null);
      } else {
        const prod = response.data;
        setProduct(prod);
        setSelectedImageIndex(0);
        setSelectedVariantIndex(0);
        setQuantity(1);

        // Update document title for SEO
        document.title = `${prod.name} | ${theme.name}`;

        // Load 4 related products
        const relatedRes = await api.getRelatedProducts(brandId, prod.id, 4);
        if (active && relatedRes.success) {
          setRelatedProducts(relatedRes.data);
        }
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [brandId, slug, reloadKey, theme.name]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setImageError({});
    setReloadKey((prev) => prev + 1);
  };

  // Variant calculations
  const activeVariant = useMemo(() => {
    if (!product || !product.variants.length) return null;
    return product.variants[selectedVariantIndex] || product.variants[0];
  }, [product, selectedVariantIndex]);

  const currentPrice = activeVariant?.price ?? product?.price ?? 0;
  const isVariantInStock = activeVariant?.inStock ?? false;

  // Active image
  const activeImage = useMemo(() => {
    if (!product || !product.images.length) return null;
    return product.images[selectedImageIndex] || product.images[0];
  }, [product, selectedImageIndex]);

  const handleAddToCart = () => {
    if (!product || !activeVariant || !isVariantInStock) return;

    setIsAddingToCart(true);

    setTimeout(() => {
      addItem(product.id, activeVariant.id, quantity, {
        productName: product.name,
        variantName: activeVariant.name,
        price: currentPrice,
        imageUrl: activeImage?.url || product.images[0]?.url,
        brandId,
        slug: product.slug,
      });

      setToastItem({
        id: `${product.id}-${activeVariant.id}-${Date.now()}`,
        productName: product.name,
        variantName: activeVariant.name,
        price: currentPrice,
        imageUrl: activeImage?.url || product.images[0]?.url,
      });

      setIsAddingToCart(false);
    }, 300);
  };

  const handleBuyNow = () => {
    if (!product || !activeVariant || !isVariantInStock) return;
    addItem(product.id, activeVariant.id, quantity, {
      productName: product.name,
      variantName: activeVariant.name,
      price: currentPrice,
      imageUrl: activeImage?.url || product.images[0]?.url,
      brandId,
      slug: product.slug,
    });
    openCart();
  };

  const navigateToCollection = () => {
    navigate(getBrandListingRoute(brandId));
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLdData = useMemo(() => {
    if (!product) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images.map((img) => img.url),
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: theme.name,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: currentPrice.toString(),
        availability: isVariantInStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount.toString(),
      },
    };
  }, [product, currentPrice, isVariantInStock, theme.name]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto" aria-busy="true">
        <div className="animate-pulse space-y-3">
          <div className="w-32 h-5 bg-neutral-200 rounded" />
          <div className="w-64 h-10 bg-neutral-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-200 rounded-xl animate-pulse" />
            <div className="flex space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-neutral-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="w-40 h-8 bg-neutral-200 rounded animate-pulse" />
            <div className="w-full h-24 bg-neutral-200 rounded animate-pulse" />
            <div className="w-48 h-12 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Design Not Found"
        message={error || `We couldn't locate "${slug}" in the ${theme.name} collection.`}
        showRetry={true}
        onRetry={handleRetry}
        secondaryAction={navigateToCollection}
        secondaryActionLabel={`Explore ${theme.name} Catalog`}
      />
    );
  }

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-16">
      {/* JSON-LD Structured Data */}
      {jsonLdData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      {/* Confirmation Toast */}
      <Toast item={toastItem} onClose={() => setToastItem(null)} />

      {/* Top Navigation Link */}
      <div>
        <button
          onClick={navigateToCollection}
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground transition-colors touch-target"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          <span>Back to {theme.name} Catalog</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Visual Display */}
          <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-neutral-100 relative shadow-xs">
            {activeImage && !imageError[selectedImageIndex] ? (
              <img
                src={activeImage.url}
                alt={activeImage.alt || product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="eager"
                onError={() =>
                  setImageError((prev) => ({ ...prev, [selectedImageIndex]: true }))
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted space-y-2">
                <Sparkles className="w-16 h-16 text-primary/40" />
                <span className="text-xs">Atelier Photography</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
              {product.tags.includes('bestseller') && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs"
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
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-xs"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.foreground,
                  }}
                >
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-1">
              {product.images.map((image, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`shrink-0 w-20 h-20 rounded-lg border overflow-hidden transition-all touch-target ${
                      isSelected
                        ? 'ring-2 ring-primary ring-offset-2 border-transparent'
                        : 'border-border hover:opacity-80'
                    }`}
                    aria-label={`View image ${idx + 1} of ${product.name}`}
                    aria-pressed={isSelected}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Buying Actions */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span
                className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: theme.colors.primary + '18',
                  color: theme.colors.primary,
                }}
              >
                {product.metal || product.gemstone}
              </span>
              <span className="text-xs text-muted font-medium">• {theme.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-brand-display text-foreground leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-foreground">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted">
              ({product.reviewCount} verified client reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 pt-1">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(currentPrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > currentPrice && (
              <>
                <span className="text-base line-through text-muted">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Save {formatPrice(product.compareAtPrice - currentPrice)}
                </span>
              </>
            )}
          </div>

          {/* Stock Availability Indicator */}
          <div className="flex items-center space-x-2 text-xs font-medium">
            {isVariantInStock ? (
              <span className="text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock — Ready for Immediate Atelier Dispatch</span>
              </span>
            ) : (
              <span className="text-amber-700 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>Currently Made-to-Order (Estimated 2–3 weeks)</span>
              </span>
            )}
          </div>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold uppercase tracking-wider text-muted">
                  Ring Size / Setting Option
                </label>
                <a
                  href="#accordion-shipping"
                  onClick={() =>
                    setOpenAccordions((prev) => ({ ...prev, shipping: true }))
                  }
                  className="text-primary hover:underline font-semibold"
                >
                  Complimentary Sizing Guide
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      disabled={!v.inStock}
                      className={`px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all touch-target flex items-center space-x-1.5 ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary ring-offset-1 font-bold'
                          : 'border-border hover:bg-neutral-50 text-foreground'
                      } ${!v.inStock ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                      style={{
                        backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                        color: isSelected
                          ? theme.id === 'lustre' ? theme.colors.foreground : '#ffffff'
                          : undefined,
                      }}
                      aria-pressed={isSelected}
                    >
                      <span>{v.name}</span>
                      {v.price && v.price !== product.price && (
                        <span className="text-[10px] opacity-80">
                          ({formatPrice(v.price)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-border rounded-md bg-background">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 text-foreground hover:bg-neutral-100 transition-colors touch-target disabled:opacity-40"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-foreground min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 text-foreground hover:bg-neutral-100 transition-colors touch-target"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-muted">
                Each piece includes presentation box and lab certificate.
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isVariantInStock}
                className="flex-1 py-3.5 px-6 rounded-md font-semibold text-sm transition-all shadow-md hover:opacity-90 flex items-center justify-center space-x-2 touch-target disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isAddingToCart
                    ? 'Adding to Bag...'
                    : isVariantInStock
                    ? 'Add to Shopping Bag'
                    : 'Out of Stock'}
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!isVariantInStock}
                className="flex-1 py-3.5 px-6 rounded-md font-semibold text-sm border border-border transition-colors hover:bg-neutral-50 touch-target disabled:opacity-50 text-foreground"
              >
                Immediate Checkout
              </button>
            </div>
          </div>

          {/* Trust Value Strip */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/80 text-xs text-muted">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-primary shrink-0" />
              <span>Complimentary Insured Overnight</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-primary shrink-0" />
              <span>60-Day Free Resizing Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span>Lifetime Atelier Craft Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-primary shrink-0" />
              <span>Certified Authenticity Dossier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions: Detailed Technical Specifications & Information */}
      <section className="space-y-4 pt-6 border-t border-border" id="accordion-shipping">
        <h2 className="text-xl sm:text-2xl font-bold font-brand-display text-foreground">
          Atelier Specifications &amp; Assurances
        </h2>

        {/* 1. Description */}
        <div className="border border-border rounded-xl overflow-hidden bg-background">
          <button
            onClick={() => toggleAccordion('description')}
            className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-foreground bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors touch-target"
            aria-expanded={openAccordions.description}
          >
            <span>Design Philosophy &amp; Atelier Notes</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openAccordions.description ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordions.description && (
            <div className="p-6 text-xs sm:text-sm text-muted leading-relaxed space-y-3">
              <p>{product.description}</p>
              <p>
                Every angle of this setting has been engineered to maximize light intake beneath the stone pavilion while maintaining an ergonomic low-profile gallery for comfortable everyday wear.
              </p>
            </div>
          )}
        </div>

        {/* 2. Materials & Stone Specifications */}
        <div className="border border-border rounded-xl overflow-hidden bg-background">
          <button
            onClick={() => toggleAccordion('specs')}
            className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-foreground bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors touch-target"
            aria-expanded={openAccordions.specs}
          >
            <span>Materials &amp; Gemstone Specifications</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openAccordions.specs ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordions.specs && (
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                {product.metal && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">Precious Metal</dt>
                    <dd className="font-bold text-foreground">{product.metal}</dd>
                  </div>
                )}
                {product.gemstone && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">Center Gemstone</dt>
                    <dd className="font-bold text-foreground">{product.gemstone}</dd>
                  </div>
                )}
                {product.stoneDetails?.cut && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">Cut Silhouette</dt>
                    <dd className="font-bold text-foreground">{product.stoneDetails.cut}</dd>
                  </div>
                )}
                {product.stoneDetails?.carat && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">Carat Weight / Dimension</dt>
                    <dd className="font-bold text-foreground">{product.stoneDetails.carat} Carat</dd>
                  </div>
                )}
                {product.stoneDetails?.color && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">Color Grade</dt>
                    <dd className="font-bold text-foreground">{product.stoneDetails.color}</dd>
                  </div>
                )}
                {product.stoneDetails?.clarity && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">Clarity Grade</dt>
                    <dd className="font-bold text-foreground">{product.stoneDetails.clarity}</dd>
                  </div>
                )}
                {product.stoneDetails?.certificate && (
                  <div className="p-3 rounded-lg bg-neutral-50 border border-border/50 sm:col-span-2">
                    <dt className="text-muted font-medium mb-1">Independent Certification</dt>
                    <dd className="font-bold text-primary flex items-center space-x-1.5">
                      <Gem className="w-4 h-4" />
                      <span>{product.stoneDetails.certificate} Certified with Inscribed Serial Number</span>
                    </dd>
                  </div>
                )}
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="p-3 rounded-lg bg-neutral-50 border border-border/50">
                    <dt className="text-muted font-medium mb-1">{spec.label}</dt>
                    <dd className="font-bold text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* 3. Care & Maintenance */}
        <div className="border border-border rounded-xl overflow-hidden bg-background">
          <button
            onClick={() => toggleAccordion('care')}
            className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-foreground bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors touch-target"
            aria-expanded={openAccordions.care}
          >
            <span>Fine Jewelry Care &amp; Maintenance</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openAccordions.care ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordions.care && (
            <div className="p-6 text-xs sm:text-sm text-muted leading-relaxed space-y-3">
              <p>
                Clean your jewelry periodically using warm water, a mild dish soap, and a soft-bristle toothbrush. Gently brush behind the pavilion where lotions and oils collect.
              </p>
              <p>
                Store each piece independently in your velvet pouch to avoid friction scratching. We offer complimentary annual professional ultrasonic bath and prong tightening services for the lifetime of your ring.
              </p>
            </div>
          )}
        </div>

        {/* 4. Shipping & Sizing Guarantee */}
        <div className="border border-border rounded-xl overflow-hidden bg-background">
          <button
            onClick={() => toggleAccordion('shipping')}
            className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-foreground bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors touch-target"
            aria-expanded={openAccordions.shipping}
          >
            <span>Insured Shipping &amp; Complimentary Sizing</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openAccordions.shipping ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordions.shipping && (
            <div className="p-6 text-xs sm:text-sm text-muted leading-relaxed space-y-3">
              <p>
                <strong>Free Insured Express:</strong> All orders are dispatched in discreet, unmarked tamper-evident boxes with signature confirmation required upon delivery.
              </p>
              <p>
                <strong>60-Day Complimentary Sizing:</strong> If the ring size is not an exact match, we provide one free precision resize and cover all domestic round-trip insured transport.
              </p>
            </div>
          )}
        </div>

        {/* 5. Returns & Lifetime Warranty */}
        <div className="border border-border rounded-xl overflow-hidden bg-background">
          <button
            onClick={() => toggleAccordion('warranty')}
            className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-foreground bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors touch-target"
            aria-expanded={openAccordions.warranty}
          >
            <span>30-Day Risk-Free Returns &amp; Lifetime Warranty</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openAccordions.warranty ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openAccordions.warranty && (
            <div className="p-6 text-xs sm:text-sm text-muted leading-relaxed space-y-3">
              <p>
                We offer 30-day risk-free returns for unworn pieces with their original lab documentation and tamper tags intact.
              </p>
              <p>
                Our lifetime warranty protects against all manufacturing defects, prong loosening, and structural anomalies.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-border">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl sm:text-2xl font-bold font-brand-display text-foreground">
              Complementary {theme.name} Designs
            </h2>
            <Link
              to={getBrandListingRoute(brandId)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Full Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => {
              const relImg = rel.images.find((i) => i.isPrimary) || rel.images[0];
              const relUrl = getProductUrl(brandId, rel.slug);

              return (
                <article
                  key={rel.id}
                  className="group rounded-xl border border-border overflow-hidden bg-background transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                >
                  <Link to={relUrl} className="block aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={relImg?.url || '/favicon.svg'}
                      alt={relImg?.alt || rel.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-1">
                        {rel.metal || rel.gemstone}
                      </div>
                      <h3 className="text-sm font-semibold font-brand-display line-clamp-1 mb-1 text-foreground">
                        <Link to={relUrl} className="hover:underline">
                          {rel.name}
                        </Link>
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/60 mt-3">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(rel.price)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-foreground font-semibold">
                          {rel.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add-to-Cart Bar */}
      <aside
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-background/95 border-t border-border backdrop-blur-md shadow-2xl flex items-center justify-between gap-3"
        aria-label="Quick Add to Bag"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          {activeImage && (
            <img
              src={activeImage.url}
              alt={product.name}
              className="w-10 h-10 object-cover rounded border border-border shrink-0 bg-neutral-100"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
            <p className="text-xs font-bold text-primary">{formatPrice(currentPrice)}</p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !isVariantInStock}
          className="px-4 py-2.5 rounded-md font-semibold text-xs shadow-md shrink-0 flex items-center space-x-1.5 touch-target disabled:opacity-50"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
          }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{isAddingToCart ? 'Adding...' : isVariantInStock ? 'Add to Bag' : 'Out of Stock'}</span>
        </button>
      </aside>
    </div>
  );
};

export default ProductDetailPage;
