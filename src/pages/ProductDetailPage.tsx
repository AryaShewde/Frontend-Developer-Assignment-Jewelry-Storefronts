import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Heart,
  Truck,
  Shield,
  Sparkles,
  Star,
  Tag,
  CreditCard,
  Award,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import ErrorState from '../components/ErrorState';
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
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [reloadKey, setReloadKey] = useState(0);

  // Apply brand styles
  useEffect(() => {
    applyBrandStyles(brandId);
  }, [brandId]);

  // Load product asynchronously from API module
  useEffect(() => {
    let active = true;

    if (!slug) {
      Promise.resolve().then(() => {
        if (!active) return;
        setError('Product slug is missing from URL.');
        setLoading(false);
      });
      return;
    }

    api.getProductBySlug(brandId, slug).then(async (response) => {
      if (!active) return;

      if (!response.success) {
        setError(response.error || `Product "${slug}" not found.`);
        setProduct(null);
      } else {
        setProduct(response.data);

        // Load related products
        if (response.data) {
          const relatedResponse = await api.getRelatedProducts(brandId, response.data.id, 4);
          if (active && relatedResponse.success) {
            setRelatedProducts(relatedResponse.data);
          }
        }
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [brandId, slug, reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setImageError({});
    setReloadKey((prev) => prev + 1);
  };

  // Handle image load errors
  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  // Helper: Get primary image or fallback
  const primaryImage = product?.images.find((i) => i.isPrimary) || product?.images[0];

  // Helper: Determine if current variant is in stock
  const isVariantInStock = product?.variants[selectedVariant]?.inStock ?? false;

  const handleAddToCart = () => {
    if (!product) return;

    setIsAddingToCart(true);
    setTimeout(() => {
      addItem(product.id, product.variants[selectedVariant].id, quantity);
      setIsAddingToCart(false);
      // In a real app, show toast notification
      alert(`${product.name} added to cart!`);
    }, 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In a real app, navigate to checkout
    alert('Checkout functionality coming soon!');
  };

  const navigateToCollection = () => {
    navigate(getBrandListingRoute(brandId));
  };


  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-neutral-200 rounded mb-4" />
          <div className="w-64 h-10 bg-neutral-200 rounded mb-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-neutral-200 rounded-lg animate-pulse" />
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-neutral-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="w-48 h-6 bg-neutral-200 rounded animate-pulse" />
              <div className="w-32 h-8 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="w-24 h-6 bg-neutral-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-20 h-10 bg-neutral-200 rounded animate-pulse" />
                <div className="w-20 h-10 bg-neutral-200 rounded animate-pulse" />
                <div className="w-20 h-10 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-24 h-6 bg-neutral-200 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="w-32 h-12 bg-neutral-200 rounded animate-pulse" />
                <div className="w-24 h-12 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <ErrorState
        title="Product Not Found"
        message={error || `We couldn't find the product "${slug}" in the ${theme.name} catalog.`}
        showRetry={true}
        onRetry={handleRetry}
        secondaryAction={navigateToCollection}
        secondaryActionLabel={`Back to ${theme.name} Collection`}
      />
    );
  }

  return (
    <div className="space-y-12">
      {/* Back navigation */}
      <div>
        <button
          onClick={navigateToCollection}
          className="inline-flex items-center text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: theme.colors.muted }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {theme.name} Collection
        </button>
      </div>

      {/* Product content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                className="w-full h-full object-cover transition-opacity"
                loading="eager"
                onError={() => handleImageError(0)}
              />
            ) : (
              <div className="flex items-center justify-center h-full" style={{ backgroundColor: theme.colors.neutral[100] }}>
                <Sparkles className="w-24 h-24" style={{ color: theme.colors.muted }} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto py-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`shrink-0 w-20 h-20 rounded border transition-all ${
                    selectedImageIndex === index ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={{
                    borderColor: theme.colors.border,
                    backgroundColor: imageError[index] ? theme.colors.neutral[100] : 'transparent',
                  }}
                  aria-label={`View ${image.alt || `product image ${index + 1}`}`}
                >
                  {imageError[index] ? (
                    <div className="flex items-center justify-center w-full h-full">
                      <span className="text-xs" style={{ color: theme.colors.muted }}>
                        {index + 1}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.alt || `Product thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-8">
          {/* Brand and title */}
          <div>
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-3"
              style={{
                backgroundColor: theme.colors.primary + '18',
                color: theme.colors.primary,
              }}
            >
              {product.category} • {product.metal || product.gemstone}
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 font-brand-display"
              style={{ color: theme.colors.foreground }}
            >
              {product.name}
            </h1>
            <p className="text-base leading-relaxed mb-6" style={{ color: theme.colors.muted }}>
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium" style={{ color: theme.colors.foreground }}>
              {product.rating.toFixed(1)}
            </span>
            <span className="text-sm" style={{ color: theme.colors.muted }}>
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg line-through" style={{ color: theme.colors.muted }}>
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: theme.colors.primary + '20',
                    color: theme.colors.primary,
                  }}
                >
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.includes('bestseller') && (
              <span
                className="text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: theme.colors.neutral[50],
                  color: theme.colors.foreground,
                }}
              >
                <TrendingUp className="w-3 h-3" />
                Bestseller
              </span>
            )}
            {product.tags.includes('new') && (
              <span
                className="text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: theme.colors.primary + '20',
                  color: theme.colors.primary,
                }}
              >
                <Sparkles className="w-3 h-3" />
                New Arrival
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                  Select {product.variants[0].name.includes('Ring') ? 'Size' : 'Variant'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(index)}
                      disabled={!variant.inStock}
                      className={`px-4 py-2 rounded border transition-colors ${
                        !variant.inStock ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{
                        borderColor: selectedVariant === index ? theme.colors.primary : theme.colors.border,
                        backgroundColor: selectedVariant === index ? theme.colors.primary : 'transparent',
                        color: selectedVariant === index
                          ? (theme.id === 'lustre' ? theme.colors.foreground : '#ffffff')
                          : theme.colors.foreground,
                      }}
                    >
                      {variant.name}
                      {variant.price !== product.price && ` (${formatPrice(variant.price - product.price)})`}
                      {!variant.inStock && ' - Out of Stock'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.foreground }}>
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded" style={{ borderColor: theme.colors.border }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 transition-colors hover:bg-neutral-50"
                    style={{ color: theme.colors.foreground }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 min-w-15 text-center" style={{ color: theme.colors.foreground }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 transition-colors hover:bg-neutral-50"
                    style={{ color: theme.colors.foreground }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: isVariantInStock ? theme.colors.primary : theme.colors.muted }}
                >
                  {isVariantInStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isVariantInStock}
                className="flex-1 py-3 px-6 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isVariantInStock ? theme.colors.primary : theme.colors.border,
                  color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                }}
              >
                {isAddingToCart ? 'Adding...' : isVariantInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isVariantInStock}
                className="flex-1 py-3 px-6 rounded-md font-medium border transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                }}
              >
                Buy Now
              </button>
              <button
                className="p-3 rounded-md border transition-colors hover:bg-neutral-50"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                }}
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trust signals */}
          <div
            className="grid grid-cols-2 gap-4 pt-6 border-t"
            style={{ borderColor: theme.colors.border }}
          >
            <div className="flex items-center">
              <Truck className="w-5 h-5 mr-3" style={{ color: theme.colors.muted }} />
              <span className="text-sm" style={{ color: theme.colors.foreground }}>
                Free Shipping & Returns
              </span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3" style={{ color: theme.colors.muted }} />
              <span className="text-sm" style={{ color: theme.colors.foreground }}>
                Lifetime Warranty
              </span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-3" style={{ color: theme.colors.muted }} />
              <span className="text-sm" style={{ color: theme.colors.foreground }}>
                Flexible Financing
              </span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-3" style={{ color: theme.colors.muted }} />
              <span className="text-sm" style={{ color: theme.colors.foreground }}>
                Certified Gemstones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="pt-8 border-t" style={{ borderColor: theme.colors.border }}>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: theme.colors.foreground }}>
          Details & Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product specs */}
          <dl className="space-y-6">
            {product.metal && (
              <div>
                <dt className="text-sm font-medium mb-1" style={{ color: theme.colors.muted }}>
                  Metal
                </dt>
                <dd className="text-base" style={{ color: theme.colors.foreground }}>
                  {product.metal}
                </dd>
              </div>
            )}
            {product.gemstone && (
              <div>
                <dt className="text-sm font-medium mb-1" style={{ color: theme.colors.muted }}>
                  Gemstone
                </dt>
                <dd className="text-base" style={{ color: theme.colors.foreground }}>
                  {product.gemstone}
                </dd>
              </div>
            )}
            {product.stoneDetails && (
              <div>
                <dt className="text-sm font-medium mb-1" style={{ color: theme.colors.muted }}>
                  Stone Details
                </dt>
                <dd className="text-base space-y-1" style={{ color: theme.colors.foreground }}>
                  {product.stoneDetails.type && <div>Type: {product.stoneDetails.type}</div>}
                  {product.stoneDetails.cut && <div>Cut: {product.stoneDetails.cut}</div>}
                  {product.stoneDetails.carat && <div>Weight: {product.stoneDetails.carat} carat</div>}
                  {product.stoneDetails.color && <div>Color: {product.stoneDetails.color}</div>}
                  {product.stoneDetails.clarity && <div>Clarity: {product.stoneDetails.clarity}</div>}
                  {product.stoneDetails.certificate && (
                    <div className="font-medium" style={{ color: theme.colors.primary }}>
                      ✓ {product.stoneDetails.certificate} Certified
                    </div>
                  )}
                </dd>
              </div>
            )}
          </dl>

          {/* Additional specs */}
          <dl className="space-y-6">
            {product.specifications.map((spec) => (
              <div key={spec.label}>
                <dt className="text-sm font-medium mb-1" style={{ color: theme.colors.muted }}>
                  {spec.label}
                </dt>
                <dd className="text-base" style={{ color: theme.colors.foreground }}>
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t" style={{ borderColor: theme.colors.border }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold" style={{ color: theme.colors.foreground }}>
              You May Also Like
            </h2>
            <button
              onClick={navigateToCollection}
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: theme.colors.primary }}
            >
              View Full Collection →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((related) => {
              const relatedPrimaryImg = related.images.find((i) => i.isPrimary) || related.images[0];
              const detailUrl = getProductUrl(brandId, related.slug);

              return (
                <article
                  key={related.id}
                  className="group rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  }}
                >
                  <Link
                    to={detailUrl}
                    className="block aspect-square overflow-hidden bg-neutral-100"
                  >
                    <img
                      src={relatedPrimaryImg?.url || '/favicon.svg'}
                      alt={relatedPrimaryImg?.alt || related.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="text-xs uppercase font-medium mb-1" style={{ color: theme.colors.muted }}>
                      {related.metal || related.gemstone}
                    </div>
                    <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">
                      <Link
                        to={detailUrl}
                        className="hover:underline"
                        style={{ color: theme.colors.foreground }}
                      >
                        {related.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold" style={{ color: theme.colors.primary }}>
                        {formatPrice(related.price)}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* API Integration Note */}
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: theme.colors.neutral[50],
          borderColor: theme.colors.border,
        }}
      >
        <div className="flex items-start">
          <Sparkles className="w-6 h-6 mr-4 mt-1" style={{ color: theme.colors.primary }} />
          <div>
            <h3 className="font-medium mb-2" style={{ color: theme.colors.foreground }}>
              Asynchronous API Integration
            </h3>
            <p className="text-sm mb-3" style={{ color: theme.colors.muted }}>
              This product detail page loads data dynamically from the `/api/{brandId}/products.json` endpoint using the API module. All content—product details, images, specifications, and related products—is fetched asynchronously via `fetch()` with error handling and type validation.
            </p>
            <div className="flex items-center text-xs" style={{ color: theme.colors.muted }}>
              <Tag className="w-3 h-3 mr-1" />
              Slug-based routing: <code className="mx-1 px-1 py-0.5 rounded bg-neutral-100">/aurelle/engagement-rings/{product.slug}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;