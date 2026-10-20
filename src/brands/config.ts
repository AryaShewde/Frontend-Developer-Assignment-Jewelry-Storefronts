import type { BrandTheme } from '../types';

export const brandThemes: Record<string, BrandTheme> = {
  aurelle: {
    id: 'aurelle',
    name: 'Aurelle',
    description: 'Lab-grown diamond engagement rings',
    domain: 'aurelle.com',
    colors: {
      primary: '#d4af37', // Champagne gold
      secondary: '#8b7355', // Ivory/cream
      accent: '#a0522d', // Warm brown
      background: '#fdf6e3', // Ivory background
      foreground: '#2c1810', // Dark brown for text
      muted: '#8b7355', // Muted brown
      border: '#e6d5b8', // Light gold border
      neutral: {
        50: '#fdf6e3',
        100: '#f8e9c9',
        200: '#f2d9a6',
        300: '#ebc983',
        400: '#e3b960',
        500: '#d4af37',
        600: '#b89429',
        700: '#9c7a1d',
        800: '#806213',
        900: '#674d0c',
        950: '#4a3708',
      },
    },
    typography: {
      fontFamily: {
        sans: "'Inter', system-ui, -apple-system, sans-serif",
        serif: "'Playfair Display', Georgia, serif",
        display: "'Playfair Display', Georgia, serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '60px',
      },
    },
    spacing: {
      unit: 4,
    },
    borderRadius: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      full: '9999px',
    },
  },
  'gemma-grove': {
    id: 'gemma-grove',
    name: 'Gemma & Grove',
    description: 'Colored gemstone jewelry',
    domain: 'gemmagrove.com',
    colors: {
      primary: '#4a148c', // Deep purple
      secondary: '#6a1b9a', // Jewel tone purple
      accent: '#ff4081', // Fuchsia accent
      background: '#ffffff',
      foreground: '#1a237e', // Deep blue for text
      muted: '#5c6bc0', // Muted blue-purple
      border: '#c5cae9', // Light lavender border
      neutral: {
        50: '#f3e5f5',
        100: '#e1bee7',
        200: '#ce93d8',
        300: '#ba68c8',
        400: '#ab47bc',
        500: '#9c27b0',
        600: '#8e24aa',
        700: '#7b1fa2',
        800: '#6a1b9a',
        900: '#4a148c',
        950: '#311b92',
      },
    },
    typography: {
      fontFamily: {
        sans: "'Inter', system-ui, -apple-system, sans-serif",
        serif: "'Cormorant Garamond', Georgia, serif",
        display: "'Cormorant Garamond', Georgia, serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '60px',
      },
    },
    spacing: {
      unit: 4,
    },
    borderRadius: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      full: '9999px',
    },
  },
  lustre: {
    id: 'lustre',
    name: 'Lustre',
    description: 'Moissanite rings and earrings',
    domain: 'lustre.com',
    colors: {
      primary: '#2563eb', // Elegant blue
      secondary: '#1e40af', // Darker blue
      accent: '#3b82f6', // Bright blue accent
      background: '#ffffff',
      foreground: '#1a1a2e', // Dark navy for text
      muted: '#6b7280', // Muted gray
      border: '#e5e7eb', // Light gray border
      neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    typography: {
      fontFamily: {
        sans: "'Inter', system-ui, -apple-system, sans-serif",
        serif: "'Inter', system-ui, -apple-system, sans-serif", // No serif for this brand
        display: "'Inter', system-ui, -apple-system, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
      },
      fontSize: {
        xs: '11px',
        sm: '13px',
        base: '15px',
        lg: '17px',
        xl: '19px',
        '2xl': '22px',
        '3xl': '26px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
      },
    },
    spacing: {
      unit: 4,
    },
    borderRadius: {
      xs: '1px',
      sm: '2px',
      md: '4px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      full: '9999px',
    },
  },
};

export const getBrandTheme = (brandId: string): BrandTheme => {
  return brandThemes[brandId] || brandThemes.aurelle;
};

export const applyBrandStyles = (brandId: string): void => {
  const theme = getBrandTheme(brandId);
  const root = document.documentElement;

  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([shade, shadeValue]) => {
        root.style.setProperty(`--${key}-${shade}`, shadeValue);
      });
    } else {
      root.style.setProperty(`--${key}`, value);
    }
  });

  // Apply font variables
  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
};