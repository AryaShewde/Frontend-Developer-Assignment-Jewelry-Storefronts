import type {
  Product,
  ApiResponse,
  ProductFilterOptions,
  ProductSortOption,
} from '../types';

const API_BASE_URL = '/api';
const VALID_BRANDS = ['aurelle', 'gemma-grove', 'lustre'] as const;
export type ValidBrandId = (typeof VALID_BRANDS)[number];

export const isValidBrand = (brandId: string): brandId is ValidBrandId => {
  return VALID_BRANDS.includes(brandId as ValidBrandId);
};

// In-memory cache for loaded catalogs during a session
const catalogCache: Record<string, Product[]> = {};

export const api = {
  /**
   * Fetch all products for a specific brand asynchronously from /api/{brandId}/products.json.
   * Handles network errors, validation, and HTTP status codes cleanly.
   */
  async getProductsByBrand(brandId: string): Promise<ApiResponse<Product[]>> {
    if (!isValidBrand(brandId)) {
      return {
        data: [],
        success: false,
        error: `Invalid brand identifier: "${brandId}". Valid brands are: ${VALID_BRANDS.join(', ')}`,
      };
    }

    if (catalogCache[brandId]) {
      return {
        data: [...catalogCache[brandId]],
        success: true,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${brandId}/products.json`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            data: [],
            success: false,
            error: `Catalog data not found for brand "${brandId}" (HTTP 404).`,
          };
        }
        return {
          data: [],
          success: false,
          error: `Failed to load catalog for "${brandId}" (HTTP ${response.status}: ${response.statusText}).`,
        };
      }

      const products: Product[] = await response.json();

      if (!Array.isArray(products)) {
        return {
          data: [],
          success: false,
          error: `Malformed catalog payload for brand "${brandId}". Expected an array of products.`,
        };
      }

      catalogCache[brandId] = products;

      return {
        data: [...products],
        success: true,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown network error';
      return {
        data: [],
        success: false,
        error: `Network failure fetching "${brandId}" catalog: ${message}`,
      };
    }
  },

  /**
   * Fetch a single product by brand and slug.
   * Resolves null with an error message when the product does not exist.
   */
  async getProductBySlug(brandId: string, slug: string): Promise<ApiResponse<Product | null>> {
    if (!slug) {
      return {
        data: null,
        success: false,
        error: 'A product slug is required.',
      };
    }

    const brandResponse = await this.getProductsByBrand(brandId);
    if (!brandResponse.success) {
      return {
        data: null,
        success: false,
        error: brandResponse.error,
      };
    }

    const matched = brandResponse.data.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );

    if (!matched) {
      return {
        data: null,
        success: false,
        error: `Product with slug "${slug}" not found in brand "${brandId}".`,
      };
    }

    return {
      data: matched,
      success: true,
    };
  },

  /**
   * Fetch featured products for a brand.
   */
  async getFeaturedProducts(brandId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const brandResponse = await this.getProductsByBrand(brandId);
    if (!brandResponse.success) {
      return brandResponse;
    }

    const featured = brandResponse.data
      .filter((p) => p.featured)
      .slice(0, limit);

    return {
      data: featured,
      success: true,
    };
  },

  /**
   * Fetch bestseller products for a brand.
   */
  async getBestsellerProducts(brandId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const brandResponse = await this.getProductsByBrand(brandId);
    if (!brandResponse.success) {
      return brandResponse;
    }

    const bestsellers = brandResponse.data
      .filter((p) => p.tags.includes('bestseller'))
      .slice(0, limit);

    return {
      data: bestsellers.length > 0 ? bestsellers : brandResponse.data.slice(0, limit),
      success: true,
    };
  },

  /**
   * Fetch related products from the same brand and category/subcategory, excluding the current product.
   */
  async getRelatedProducts(
    brandId: string,
    currentProductId: string,
    limit: number = 4
  ): Promise<ApiResponse<Product[]>> {
    const brandResponse = await this.getProductsByBrand(brandId);
    if (!brandResponse.success) {
      return brandResponse;
    }

    const currentProduct = brandResponse.data.find((p) => p.id === currentProductId);

    // Filter out current product
    const candidates = brandResponse.data.filter((p) => p.id !== currentProductId);

    if (!currentProduct) {
      return {
        data: candidates.slice(0, limit),
        success: true,
      };
    }

    // Score candidates by shared subcategory, metal, or gemstone
    const scored = candidates.map((p) => {
      let score = 0;
      if (p.subcategory && p.subcategory === currentProduct.subcategory) score += 3;
      if (p.category === currentProduct.category) score += 2;
      if (p.metal && p.metal === currentProduct.metal) score += 1;
      if (p.gemstone && p.gemstone === currentProduct.gemstone) score += 1;
      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      data: scored.slice(0, limit).map((s) => s.product),
      success: true,
    };
  },

  /**
   * Filter and sort products deterministically.
   */
  async getFilteredProducts(
    brandId: string,
    filters?: ProductFilterOptions,
    sortOption: ProductSortOption = 'featured'
  ): Promise<ApiResponse<Product[]>> {
    const brandResponse = await this.getProductsByBrand(brandId);
    if (!brandResponse.success) {
      return brandResponse;
    }

    let results = [...brandResponse.data];

    if (filters) {
      if (filters.category) {
        const cat = filters.category.toLowerCase();
        results = results.filter((p) => p.category.toLowerCase() === cat);
      }

      if (filters.subcategory) {
        const sub = filters.subcategory.toLowerCase();
        results = results.filter((p) => p.subcategory?.toLowerCase() === sub);
      }

      if (typeof filters.minPrice === 'number') {
        results = results.filter((p) => p.price >= (filters.minPrice as number));
      }

      if (typeof filters.maxPrice === 'number') {
        results = results.filter((p) => p.price <= (filters.maxPrice as number));
      }

      if (filters.metal) {
        const metal = filters.metal.toLowerCase();
        results = results.filter((p) => p.metal?.toLowerCase().includes(metal));
      }

      if (filters.gemstone) {
        const gem = filters.gemstone.toLowerCase();
        results = results.filter((p) => p.gemstone?.toLowerCase().includes(gem));
      }

      if (filters.inStockOnly) {
        results = results.filter((p) => p.variants.some((v) => v.inStock));
      }

      if (filters.tags && filters.tags.length > 0) {
        results = results.filter((p) =>
          filters.tags!.some((t) => p.tags.includes(t))
        );
      }

      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
    }

    // Deterministic sorting
    switch (sortOption) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
        break;
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name));
        break;
    }

    return {
      data: results,
      success: true,
    };
  },

  /**
   * Search products within a brand.
   */
  async searchProducts(
    brandId: string,
    query: string,
    category?: string
  ): Promise<ApiResponse<Product[]>> {
    return this.getFilteredProducts(brandId, {
      search: query,
      category,
    });
  },

  /**
   * Clear cache (useful for testing or refreshing).
   */
  clearCache(): void {
    for (const key of Object.keys(catalogCache)) {
      delete catalogCache[key];
    }
  },
};

/**
 * Generate canonical storefront URL for any product by brand and slug.
 */
export const getProductUrl = (brandId: string, productSlug: string): string => {
  switch (brandId) {
    case 'aurelle':
      return `/aurelle/engagement-rings/${productSlug}`;
    case 'gemma-grove':
      return `/gemma-grove/gemstone-rings/${productSlug}`;
    case 'lustre':
      return `/lustre/moissanite-rings/${productSlug}`;
    default:
      return `/`;
  }
};

/**
 * Generate brand landing page route.
 */
export const getBrandRoute = (brandId: string): string => {
  switch (brandId) {
    case 'aurelle':
      return '/aurelle';
    case 'gemma-grove':
      return '/gemma-grove';
    case 'lustre':
      return '/lustre';
    default:
      return '/';
  }
};

/**
 * Generate brand primary listing route.
 */
export const getBrandListingRoute = (brandId: string): string => {
  switch (brandId) {
    case 'aurelle':
      return '/aurelle/engagement-rings';
    case 'gemma-grove':
      return '/gemma-grove/gemstone-rings';
    case 'lustre':
      return '/lustre/moissanite-rings';
    default:
      return '/';
  }
};
