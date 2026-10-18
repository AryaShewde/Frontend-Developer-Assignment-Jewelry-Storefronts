export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  inStock: boolean;
  material?: string;
  metal?: string;
  gemstone?: string;
  size?: string;
  weight?: number; // in carats or grams
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: 'mm' | 'cm' | 'inch';
  };
}

export interface ProductSpecification {
  label: string;
  value: string;
  details?: string;
}

export interface ProductStoneDetails {
  type: string;
  cut?: string;
  carat?: number;
  color?: string;
  clarity?: string;
  certificate?: string;
}

export interface Product {
  id: string;
  slug: string;
  brandId: 'aurelle' | 'gemma-grove' | 'lustre';
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  metal?: string;
  gemstone?: string;
  stoneDetails?: ProductStoneDetails;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc'
  | 'newest';

export interface ProductFilterOptions {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  metal?: string;
  gemstone?: string;
  stoneType?: string;
  inStockOnly?: boolean;
  tags?: string[];
  search?: string;
}

export interface BrandTheme {
  id: 'aurelle' | 'gemma-grove' | 'lustre';
  name: string;
  description: string;
  domain: string;
  logoUrl?: string;
  wordmarkUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
      display: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
  };
  spacing: {
    unit: number;
  };
  borderRadius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  addedAt: string;
  productName?: string;
  variantName?: string;
  price?: number;
  imageUrl?: string;
  brandId?: 'aurelle' | 'gemma-grove' | 'lustre';
  slug?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

export type RouteParams = {
  slug?: string;
};

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
};