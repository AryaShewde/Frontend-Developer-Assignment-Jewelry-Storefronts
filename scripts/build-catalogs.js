import fs from 'node:fs';
import path from 'node:path';
import { generateRingSvg } from './generate-images.js';

// Base target paths
const PUBLIC_API_DIR = path.resolve('public/api');
const PUBLIC_IMG_DIR = path.resolve('public/images/products');

fs.mkdirSync(path.join(PUBLIC_IMG_DIR, 'aurelle'), { recursive: true });
fs.mkdirSync(path.join(PUBLIC_IMG_DIR, 'gemma-grove'), { recursive: true });
fs.mkdirSync(path.join(PUBLIC_IMG_DIR, 'lustre'), { recursive: true });

fs.mkdirSync(path.join(PUBLIC_API_DIR, 'aurelle'), { recursive: true });
fs.mkdirSync(path.join(PUBLIC_API_DIR, 'gemma-grove'), { recursive: true });
fs.mkdirSync(path.join(PUBLIC_API_DIR, 'lustre'), { recursive: true });

// 1. AURELLE CATALOG (12 Lab-grown diamond engagement rings)
const aurelleProducts = [
  {
    id: 'aur-001',
    slug: 'radiance-solitaire',
    brandId: 'aurelle',
    name: 'Radiance Solitaire Engagement Ring',
    description: 'An iconic classic featuring a brilliant 1.50-carat round lab-grown diamond elevated in a timeless four-prong setting with a knife-edge band in warm 14k champagne gold.',
    shortDescription: '1.50ct round brilliant lab diamond in champagne gold',
    category: 'Engagement Rings',
    subcategory: 'Solitaire',
    price: 1850,
    compareAtPrice: 2150,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Round Brilliant',
      carat: 1.5,
      color: 'E',
      clarity: 'VVS1',
      certificate: 'IGI Certified'
    },
    rating: 4.9,
    reviewCount: 42,
    tags: ['bestseller', 'classic', 'solitaire', 'lab-grown'],
    featured: true,
    shape: 'round',
    color: '#f8fafc',
    variants: [
      { id: 'aur-001-v1', sku: 'AUR-001-14KCG-6', name: '14k Champagne Gold / Size 6', price: 1850, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-001-v2', sku: 'AUR-001-14KCG-7', name: '14k Champagne Gold / Size 7', price: 1850, inStock: true, metal: '14k Champagne Gold', size: '7' },
      { id: 'aur-001-v3', sku: 'AUR-001-18KYG-6', name: '18k Yellow Gold / Size 6', price: 2050, inStock: true, metal: '18k Yellow Gold', size: '6' },
      { id: 'aur-001-v4', sku: 'AUR-001-PLAT-6', name: 'Platinum / Size 6', price: 2250, inStock: false, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.50 Carat Lab-Grown Diamond' },
      { label: 'Cut & Symmetry', value: 'Ideal / Hearts & Arrows' },
      { label: 'Color & Clarity', value: 'E / VVS1' },
      { label: 'Band Width', value: '1.8 mm' },
      { label: 'Certification', value: 'IGI Official Lab Report Included' }
    ]
  },
  {
    id: 'aur-002',
    slug: 'celestial-halo',
    brandId: 'aurelle',
    name: 'Celestial Cushion Halo Ring',
    description: 'A romantic cushion-cut lab diamond enveloped by a luminous micropavé halo of conflict-free lab diamonds, resting atop a graceful tapered gallery.',
    shortDescription: '1.75ct cushion cut diamond with micropavé halo',
    category: 'Engagement Rings',
    subcategory: 'Halo',
    price: 2450,
    compareAtPrice: 2800,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Cushion Brilliant',
      carat: 1.75,
      color: 'F',
      clarity: 'VVS2',
      certificate: 'IGI Certified'
    },
    rating: 4.8,
    reviewCount: 38,
    tags: ['bestseller', 'halo', 'romantic'],
    featured: true,
    shape: 'cushion',
    color: '#f8fafc',
    variants: [
      { id: 'aur-002-v1', sku: 'AUR-002-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2450, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-002-v2', sku: 'AUR-002-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2450, inStock: true, metal: '14k Champagne Gold', size: '7' },
      { id: 'aur-002-v3', sku: 'AUR-002-PLAT-6', name: 'Platinum / Size 6', price: 2790, inStock: true, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.75 Carat Cushion Cut Lab Diamond' },
      { label: 'Halo Stones', value: '0.35ctw F/VS1 Lab Diamonds' },
      { label: 'Band Width', value: '1.9 mm' },
      { label: 'Setting Style', value: 'French Pavé Cushion Halo' }
    ]
  },
  {
    id: 'aur-003',
    slug: 'etoile-three-stone',
    brandId: 'aurelle',
    name: 'Étoile Three-Stone Oval Ring',
    description: 'A striking 2.0-carat oval lab-grown center stone anchored by two custom-tapered diamond baguettes, celebrating past, present, and future.',
    shortDescription: '2.0ct oval diamond flanked by tapered baguettes',
    category: 'Engagement Rings',
    subcategory: 'Three-Stone',
    price: 3100,
    compareAtPrice: 3450,
    metal: '18k Yellow Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Oval Brilliant',
      carat: 2.0,
      color: 'D',
      clarity: 'VVS1',
      certificate: 'GCAL 8X'
    },
    rating: 5.0,
    reviewCount: 29,
    tags: ['new', 'three-stone', 'luxury'],
    featured: true,
    shape: 'oval',
    color: '#f8fafc',
    variants: [
      { id: 'aur-003-v1', sku: 'AUR-003-18KYG-6', name: '18k Yellow Gold / Size 6', price: 3100, inStock: true, metal: '18k Yellow Gold', size: '6' },
      { id: 'aur-003-v2', sku: 'AUR-003-18KYG-7', name: '18k Yellow Gold / Size 7', price: 3100, inStock: true, metal: '18k Yellow Gold', size: '7' },
      { id: 'aur-003-v3', sku: 'AUR-003-PLAT-6', name: 'Platinum / Size 6', price: 3450, inStock: false, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.00 Carat Oval Cut Lab Diamond' },
      { label: 'Side Stones', value: '0.40ctw Tapered Baguettes' },
      { label: 'Color & Clarity', value: 'D / VVS1' },
      { label: 'Certification', value: 'GCAL 8X Ultimate Cut' }
    ]
  },
  {
    id: 'aur-004',
    slug: 'lumina-emerald-bezel',
    brandId: 'aurelle',
    name: 'Lumina Emerald Cut Bezel Ring',
    description: 'Architectural refinement meets art deco geometry. A 2.20-carat emerald-cut lab diamond surrounded by a sleek, low-profile bezel setting.',
    shortDescription: '2.20ct emerald cut in modern flush bezel',
    category: 'Engagement Rings',
    subcategory: 'Bezel',
    price: 2890,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Emerald Step Cut',
      carat: 2.2,
      color: 'E',
      clarity: 'VS1',
      certificate: 'IGI Certified'
    },
    rating: 4.9,
    reviewCount: 24,
    tags: ['modern', 'bezel', 'emerald-cut'],
    featured: false,
    shape: 'emerald',
    color: '#f8fafc',
    variants: [
      { id: 'aur-004-v1', sku: 'AUR-004-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2890, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-004-v2', sku: 'AUR-004-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2890, inStock: true, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.20 Carat Emerald Cut' },
      { label: 'Setting Profile', value: 'Low Profile Protective Bezel' },
      { label: 'Band Width', value: '2.0 mm flat comfort fit' }
    ]
  },
  {
    id: 'aur-005',
    slug: 'seraphina-oval-pave',
    brandId: 'aurelle',
    name: 'Seraphina Oval Pavé Engagement Ring',
    description: 'An elongated 1.80-carat oval lab diamond suspended over a cathedral gallery with handset pavé diamonds lining the slender 1.6mm band.',
    shortDescription: '1.80ct oval diamond with delicate pavé band',
    category: 'Engagement Rings',
    subcategory: 'Pavé',
    price: 2350,
    compareAtPrice: 2600,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Oval Brilliant',
      carat: 1.8,
      color: 'F',
      clarity: 'VVS2',
      certificate: 'IGI Certified'
    },
    rating: 4.8,
    reviewCount: 51,
    tags: ['bestseller', 'pave', 'oval'],
    featured: true,
    shape: 'oval',
    color: '#f8fafc',
    variants: [
      { id: 'aur-005-v1', sku: 'AUR-005-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2350, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-005-v2', sku: 'AUR-005-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2350, inStock: true, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.80 Carat Oval Cut' },
      { label: 'Side Diamonds', value: '0.28ctw micro-prong pavé' },
      { label: 'Band Width', value: '1.6 mm petite shank' }
    ]
  },
  {
    id: 'aur-006',
    slug: 'heritage-vintage-milgrain',
    brandId: 'aurelle',
    name: 'Heritage Vintage Milgrain Ring',
    description: 'Inspired by Edwardian romance, featuring delicate hand-applied milgrain edging, filigree gallery scrollwork, and a 1.40-carat round brilliant diamond.',
    shortDescription: '1.40ct vintage filigree ring with milgrain detailing',
    category: 'Engagement Rings',
    subcategory: 'Vintage',
    price: 2100,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Round Brilliant',
      carat: 1.4,
      color: 'G',
      clarity: 'VS1',
      certificate: 'IGI Certified'
    },
    rating: 4.7,
    reviewCount: 19,
    tags: ['vintage', 'milgrain', 'artisan'],
    featured: false,
    shape: 'round',
    color: '#f8fafc',
    variants: [
      { id: 'aur-006-v1', sku: 'AUR-006-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2100, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-006-v2', sku: 'AUR-006-PLAT-6', name: 'Platinum / Size 6', price: 2450, inStock: true, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.40 Carat Round Brilliant' },
      { label: 'Craft Technique', value: 'Hand-milled French milgrain & piercework' },
      { label: 'Band Profile', value: 'Slightly domed vintage profile' }
    ]
  },
  {
    id: 'aur-007',
    slug: 'aurora-hidden-halo',
    brandId: 'aurelle',
    name: 'Aurora Hidden Halo Ring',
    description: 'A discreet collar of micro-diamonds rests directly beneath the center 2.0-carat stone, visible only from profile views for understated brilliance.',
    shortDescription: '2.00ct round diamond with hidden collar halo',
    category: 'Engagement Rings',
    subcategory: 'Solitaire',
    price: 2680,
    compareAtPrice: 2950,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Round Brilliant',
      carat: 2.0,
      color: 'E',
      clarity: 'VVS2',
      certificate: 'IGI Certified'
    },
    rating: 4.9,
    reviewCount: 33,
    tags: ['hidden-halo', 'modern', 'bestseller'],
    featured: false,
    shape: 'round',
    color: '#f8fafc',
    variants: [
      { id: 'aur-007-v1', sku: 'AUR-007-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2680, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-007-v2', sku: 'AUR-007-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2680, inStock: true, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.00 Carat Round Brilliant' },
      { label: 'Hidden Detail', value: '16 pavé micro-diamonds beneath gallery' },
      { label: 'Prong Count', value: '4 claw prongs' }
    ]
  },
  {
    id: 'aur-008',
    slug: 'marquise-royale',
    brandId: 'aurelle',
    name: 'Marquise Royale Engagement Ring',
    description: 'An elongated 1.65-carat marquise lab diamond secured with V-shaped tips, mounted on a softly tapered solid champagne gold band.',
    shortDescription: '1.65ct marquise diamond with V-tip protective prongs',
    category: 'Engagement Rings',
    subcategory: 'Solitaire',
    price: 2200,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Marquise Brilliant',
      carat: 1.65,
      color: 'F',
      clarity: 'VS1',
      certificate: 'IGI Certified'
    },
    rating: 4.8,
    reviewCount: 16,
    tags: ['marquise', 'elongating', 'statement'],
    featured: false,
    shape: 'marquise',
    color: '#f8fafc',
    variants: [
      { id: 'aur-008-v1', sku: 'AUR-008-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2200, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-008-v2', sku: 'AUR-008-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2200, inStock: true, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.65 Carat Marquise Cut' },
      { label: 'Length-to-Width Ratio', value: '1.85 : 1.00 (optimal spread)' },
      { label: 'Prong Style', value: 'Two V-caps & four rounded side claws' }
    ]
  },
  {
    id: 'aur-009',
    slug: 'pear-silhouette',
    brandId: 'aurelle',
    name: 'Pear Silhouette Floating Ring',
    description: 'A 1.90-carat teardrop pear diamond seemingly floating above a knife-edge gold shank with an asymmetric floating gallery.',
    shortDescription: '1.90ct pear diamond in open floating gallery',
    category: 'Engagement Rings',
    subcategory: 'Solitaire',
    price: 2590,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Pear Brilliant',
      carat: 1.9,
      color: 'E',
      clarity: 'VVS2',
      certificate: 'IGI Certified'
    },
    rating: 4.9,
    reviewCount: 22,
    tags: ['pear', 'modern', 'new'],
    featured: false,
    shape: 'pear',
    color: '#f8fafc',
    variants: [
      { id: 'aur-009-v1', sku: 'AUR-009-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2590, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-009-v2', sku: 'AUR-009-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2590, inStock: false, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.90 Carat Pear Cut' },
      { label: 'Setting Style', value: '5-Prong floating basket with V-tip' },
      { label: 'Metal Weight', value: '3.4 grams solid 14k gold' }
    ]
  },
  {
    id: 'aur-010',
    slug: 'solstice-east-west',
    brandId: 'aurelle',
    name: 'Solstice East-West Emerald Ring',
    description: 'A modern orientation where a 1.50-carat emerald-cut diamond is set horizontally along the finger in a minimalist four-corner prong cradle.',
    shortDescription: '1.50ct emerald diamond set horizontally',
    category: 'Engagement Rings',
    subcategory: 'East-West',
    price: 2150,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Emerald Step Cut',
      carat: 1.5,
      color: 'F',
      clarity: 'VS1',
      certificate: 'IGI Certified'
    },
    rating: 4.7,
    reviewCount: 14,
    tags: ['east-west', 'minimalist', 'contemporary'],
    featured: false,
    shape: 'emerald',
    color: '#f8fafc',
    variants: [
      { id: 'aur-010-v1', sku: 'AUR-010-14KCG-6', name: '14k Champagne Gold / Size 6', price: 2150, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-010-v2', sku: 'AUR-010-14KCG-7', name: '14k Champagne Gold / Size 7', price: 2150, inStock: true, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.50 Carat Emerald Cut' },
      { label: 'Orientation', value: 'Horizontal East-West Layout' },
      { label: 'Band Type', value: 'Comfort-fit rectangular wire' }
    ]
  },
  {
    id: 'aur-011',
    slug: 'clarity-twisted-shank',
    brandId: 'aurelle',
    name: 'Clarity Entwined Pavé Ring',
    description: 'Two strands of gold—one polished and one handset with micro-diamonds—intertwine seamlessly toward a 1.35-carat round brilliant center stone.',
    shortDescription: '1.35ct round brilliant with braided pavé band',
    category: 'Engagement Rings',
    subcategory: 'Pavé',
    price: 1980,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Round Brilliant',
      carat: 1.35,
      color: 'E',
      clarity: 'VS1',
      certificate: 'IGI Certified'
    },
    rating: 4.8,
    reviewCount: 27,
    tags: ['twist', 'intertwined', 'pave'],
    featured: false,
    shape: 'round',
    color: '#f8fafc',
    variants: [
      { id: 'aur-011-v1', sku: 'AUR-011-14KCG-6', name: '14k Champagne Gold / Size 6', price: 1980, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-011-v2', sku: 'AUR-011-14KCG-7', name: '14k Champagne Gold / Size 7', price: 1980, inStock: true, metal: '14k Champagne Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.35 Carat Round Brilliant' },
      { label: 'Accent Stones', value: '0.22ctw micro-prong diamonds' },
      { label: 'Symbolism', value: 'Two lives intertwined in harmony' }
    ]
  },
  {
    id: 'aur-012',
    slug: 'monarch-split-shank',
    brandId: 'aurelle',
    name: 'Monarch Radiant Split-Shank Ring',
    description: 'A showstopping 2.50-carat radiant-cut lab diamond supported by an open split-shank band encrusted with two rows of brilliant pavé diamonds.',
    shortDescription: '2.50ct radiant cut on double pavé split shank',
    category: 'Engagement Rings',
    subcategory: 'Split-Shank',
    price: 3650,
    compareAtPrice: 4100,
    metal: '14k Champagne Gold',
    gemstone: 'Lab-Grown Diamond',
    stoneDetails: {
      type: 'Lab-Grown Diamond',
      cut: 'Radiant Cut',
      carat: 2.5,
      color: 'D',
      clarity: 'VVS1',
      certificate: 'IGI Certified'
    },
    rating: 5.0,
    reviewCount: 31,
    tags: ['statement', 'radiant', 'luxury', 'split-shank'],
    featured: true,
    shape: 'emerald',
    color: '#f8fafc',
    variants: [
      { id: 'aur-012-v1', sku: 'AUR-012-14KCG-6', name: '14k Champagne Gold / Size 6', price: 3650, inStock: true, metal: '14k Champagne Gold', size: '6' },
      { id: 'aur-012-v2', sku: 'AUR-012-PLAT-6', name: 'Platinum / Size 6', price: 3990, inStock: true, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.50 Carat Radiant Cut' },
      { label: 'Band Diamonds', value: '0.45ctw pavé diamond accents' },
      { label: 'Band Width', value: '3.2 mm widening at split shoulder' }
    ]
  }
];

// 2. GEMMA & GROVE CATALOG (12 Colored gemstone jewelry products)
const gemmaGroveProducts = [
  {
    id: 'gg-001',
    slug: 'azure-cascade-sapphire',
    brandId: 'gemma-grove',
    name: 'Azure Cascade Ceylon Sapphire Ring',
    description: 'An untreated 2.80-carat royal blue oval Ceylon sapphire crowned with an asymmetrical cluster of natural marquise and pear diamonds.',
    shortDescription: '2.80ct royal blue Ceylon sapphire with diamond cluster',
    category: 'Gemstone Rings',
    subcategory: 'Sapphire',
    price: 2850,
    compareAtPrice: 3200,
    metal: '18k Yellow Gold',
    gemstone: 'Ceylon Sapphire',
    stoneDetails: {
      type: 'Natural Ceylon Sapphire',
      cut: 'Oval Mixed Cut',
      carat: 2.8,
      color: 'Royal Velvet Blue',
      clarity: 'Eye Clean',
      certificate: 'GRS Certified'
    },
    rating: 4.9,
    reviewCount: 47,
    tags: ['bestseller', 'sapphire', 'royal-blue', 'cocktail'],
    featured: true,
    shape: 'oval',
    color: '#1d4ed8',
    variants: [
      { id: 'gg-001-v1', sku: 'GG-001-18KYG-6', name: '18k Yellow Gold / Size 6', price: 2850, inStock: true, metal: '18k Yellow Gold', size: '6' },
      { id: 'gg-001-v2', sku: 'GG-001-18KYG-7', name: '18k Yellow Gold / Size 7', price: 2850, inStock: true, metal: '18k Yellow Gold', size: '7' },
      { id: 'gg-001-v3', sku: 'GG-001-14KWG-6', name: '14k White Gold / Size 6', price: 2650, inStock: false, metal: '14k White Gold', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.80 Carat Natural Blue Sapphire' },
      { label: 'Origin', value: 'Sri Lanka (Ceylon)' },
      { label: 'Side Diamonds', value: '0.42ctw VS1 F-G Diamonds' },
      { label: 'Certification', value: 'GRS Swiss Gemological Report' }
    ]
  },
  {
    id: 'gg-002',
    slug: 'verdant-monarch-emerald',
    brandId: 'gemma-grove',
    name: 'Verdant Monarch Zambian Emerald Ring',
    description: 'A deep forest-green 2.20-carat emerald-cut Zambian emerald framed by a geometric scalloped diamond halo in rich yellow gold.',
    shortDescription: '2.20ct Zambian emerald in scalloped diamond halo',
    category: 'Gemstone Rings',
    subcategory: 'Emerald',
    price: 3200,
    compareAtPrice: 3600,
    metal: '18k Yellow Gold',
    gemstone: 'Zambian Emerald',
    stoneDetails: {
      type: 'Natural Emerald',
      cut: 'Emerald Cut',
      carat: 2.2,
      color: 'Vivid Forest Green',
      clarity: 'Minor Clarity Enhancement (Cedar Oil)',
      certificate: 'GIA Certified'
    },
    rating: 5.0,
    reviewCount: 34,
    tags: ['bestseller', 'emerald', 'statement', 'luxury'],
    featured: true,
    shape: 'emerald',
    color: '#059669',
    variants: [
      { id: 'gg-002-v1', sku: 'GG-002-18KYG-6', name: '18k Yellow Gold / Size 6', price: 3200, inStock: true, metal: '18k Yellow Gold', size: '6' },
      { id: 'gg-002-v2', sku: 'GG-002-18KYG-7', name: '18k Yellow Gold / Size 7', price: 3200, inStock: true, metal: '18k Yellow Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.20 Carat Natural Zambian Emerald' },
      { label: 'Halo Stones', value: '0.38ctw Round Brilliant Cut Diamonds' },
      { label: 'Prong Style', value: 'Double corner claw prongs' }
    ]
  },
  {
    id: 'gg-003',
    slug: 'crimson-velvet-ruby',
    brandId: 'gemma-grove',
    name: 'Crimson Velvet Burmese Ruby Ring',
    description: 'An arresting 1.90-carat cushion-cut pigeon blood ruby flanked by two trillion-cut white diamonds in an opulent four-prong cathedral setting.',
    shortDescription: '1.90ct pigeon blood ruby with trillion diamond sides',
    category: 'Gemstone Rings',
    subcategory: 'Ruby',
    price: 3400,
    metal: '18k Rose Gold',
    gemstone: 'Burmese Ruby',
    stoneDetails: {
      type: 'Natural Ruby',
      cut: 'Cushion Cut',
      carat: 1.9,
      color: 'Pigeon Blood Red',
      clarity: 'Slightly Included',
      certificate: 'Gübelin Certified'
    },
    rating: 4.8,
    reviewCount: 22,
    tags: ['ruby', 'luxury', 'crimson'],
    featured: true,
    shape: 'cushion',
    color: '#e11d48',
    variants: [
      { id: 'gg-003-v1', sku: 'GG-003-18KRG-6', name: '18k Rose Gold / Size 6', price: 3400, inStock: true, metal: '18k Rose Gold', size: '6' },
      { id: 'gg-003-v2', sku: 'GG-003-18KYG-6', name: '18k Yellow Gold / Size 6', price: 3400, inStock: true, metal: '18k Yellow Gold', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.90 Carat Natural Ruby' },
      { label: 'Side Diamonds', value: '0.35ctw Trillion Cut' },
      { label: 'Treatment', value: 'Standard heat only, no glass filling' }
    ]
  },
  {
    id: 'gg-004',
    slug: 'blush-morganite-bloom',
    brandId: 'gemma-grove',
    name: 'Blush Morganite Lotus Bloom Ring',
    description: 'A 3.10-carat cushion cut peach-pink Madagascar morganite set inside an organic floral petal bezel adorned with shimmering diamond accents.',
    shortDescription: '3.10ct peach morganite in rose gold lotus setting',
    category: 'Gemstone Rings',
    subcategory: 'Morganite',
    price: 1250,
    compareAtPrice: 1450,
    metal: '14k Rose Gold',
    gemstone: 'Madagascar Morganite',
    stoneDetails: {
      type: 'Natural Beryl Morganite',
      cut: 'Cushion Checkerboard',
      carat: 3.1,
      color: 'Pastel Peach Blush',
      clarity: 'Eye Clean',
      certificate: 'Authenticity Certificate'
    },
    rating: 4.9,
    reviewCount: 56,
    tags: ['bestseller', 'morganite', 'rose-gold', 'romantic'],
    featured: false,
    shape: 'cushion',
    color: '#fda4af',
    variants: [
      { id: 'gg-004-v1', sku: 'GG-004-14KRG-6', name: '14k Rose Gold / Size 6', price: 1250, inStock: true, metal: '14k Rose Gold', size: '6' },
      { id: 'gg-004-v2', sku: 'GG-004-14KRG-7', name: '14k Rose Gold / Size 7', price: 1250, inStock: true, metal: '14k Rose Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '3.10 Carat Natural Morganite' },
      { label: 'Accent Diamonds', value: '0.15ctw round diamonds' },
      { label: 'Metal Tone', value: 'Warm 14k Pink Gold' }
    ]
  },
  {
    id: 'gg-005',
    slug: 'kilimanjaro-tanzanite',
    brandId: 'gemma-grove',
    name: 'Kilimanjaro Royal Tanzanite Trilogy Ring',
    description: 'A 2.50-carat violet-blue pear-shaped tanzanite exhibiting deep pleochroism, flanked by matching pear white sapphires in 14k white gold.',
    shortDescription: '2.50ct violet-blue pear tanzanite trilogy',
    category: 'Gemstone Rings',
    subcategory: 'Tanzanite',
    price: 1950,
    metal: '14k White Gold',
    gemstone: 'Tanzanite',
    stoneDetails: {
      type: 'Natural Tanzanite',
      cut: 'Pear Brilliant',
      carat: 2.5,
      color: 'Intense Violet-Blue (5A grade)',
      clarity: 'Eye Clean',
      certificate: 'GIA Gem Report'
    },
    rating: 4.8,
    reviewCount: 28,
    tags: ['tanzanite', 'pear', 'trilogy'],
    featured: false,
    shape: 'pear',
    color: '#6366f1',
    variants: [
      { id: 'gg-005-v1', sku: 'GG-005-14KWG-6', name: '14k White Gold / Size 6', price: 1950, inStock: true, metal: '14k White Gold', size: '6' },
      { id: 'gg-005-v2', sku: 'GG-005-14KWG-7', name: '14k White Gold / Size 7', price: 1950, inStock: false, metal: '14k White Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.50 Carat Tanzanian Tanzanite' },
      { label: 'Color Saturation', value: 'Top 1% AAA+ Vivid Royal Blue-Violet' }
    ]
  },
  {
    id: 'gg-006',
    slug: 'lagoon-aquamarine-solitaire',
    brandId: 'gemma-grove',
    name: 'Lagoon Seafoam Aquamarine Solitaire',
    description: 'An ethereal 2.70-carat emerald-cut Santa Maria aquamarine that mirrors tropical waters, held in split double-claw platinum prongs.',
    shortDescription: '2.70ct seafoam aquamarine in claw prongs',
    category: 'Gemstone Rings',
    subcategory: 'Aquamarine',
    price: 1680,
    compareAtPrice: 1890,
    metal: 'Platinum',
    gemstone: 'Aquamarine',
    stoneDetails: {
      type: 'Natural Beryl Aquamarine',
      cut: 'Octagon Emerald Cut',
      carat: 2.7,
      color: 'Santa Maria Deep Seafoam Blue',
      clarity: 'Flawless Eye Clean',
      certificate: 'IGI Certified'
    },
    rating: 4.9,
    reviewCount: 31,
    tags: ['aquamarine', 'seafoam', 'emerald-cut'],
    featured: true,
    shape: 'emerald',
    color: '#06b6d4',
    variants: [
      { id: 'gg-006-v1', sku: 'GG-006-PLAT-6', name: 'Platinum / Size 6', price: 1680, inStock: true, metal: 'Platinum', size: '6' },
      { id: 'gg-006-v2', sku: 'GG-006-PLAT-7', name: 'Platinum / Size 7', price: 1680, inStock: true, metal: 'Platinum', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.70 Carat Santa Maria Aquamarine' },
      { label: 'Mounting', value: 'Hand-fabricated 950 Solid Platinum' }
    ]
  },
  {
    id: 'gg-007',
    slug: 'solaris-citrine-statement',
    brandId: 'gemma-grove',
    name: 'Solaris Madeira Citrine Cocktail Ring',
    description: 'A warm 4.0-carat cushion-cut Madeira citrine set in an art deco inspired architectural octagon frame with alternating black enamel accents.',
    shortDescription: '4.00ct golden Madeira citrine in deco frame',
    category: 'Gemstone Rings',
    subcategory: 'Citrine',
    price: 980,
    metal: '14k Yellow Gold',
    gemstone: 'Madeira Citrine',
    stoneDetails: {
      type: 'Natural Quartz Citrine',
      cut: 'Cushion Cut',
      carat: 4.0,
      color: 'Deep Madeira Cognac Gold',
      clarity: 'Eye Clean',
      certificate: 'Authenticity Certificate'
    },
    rating: 4.7,
    reviewCount: 18,
    tags: ['citrine', 'cocktail', 'art-deco'],
    featured: false,
    shape: 'cushion',
    color: '#d97706',
    variants: [
      { id: 'gg-007-v1', sku: 'GG-007-14KYG-6', name: '14k Yellow Gold / Size 6', price: 980, inStock: true, metal: '14k Yellow Gold', size: '6' },
      { id: 'gg-007-v2', sku: 'GG-007-14KYG-7', name: '14k Yellow Gold / Size 7', price: 980, inStock: true, metal: '14k Yellow Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '4.00 Carat Madeira Citrine' },
      { label: 'Design Origin', value: '1920s Art Deco Revival' }
    ]
  },
  {
    id: 'gg-008',
    slug: 'nebula-black-opal',
    brandId: 'gemma-grove',
    name: 'Nebula Lightning Ridge Black Opal Ring',
    description: 'A genuine 1.85-carat Australian black opal featuring electrifying peacock play-of-color in rolling flash patterns across green and neon blue spectrums.',
    shortDescription: '1.85ct Australian solid black opal with neon flash',
    category: 'Gemstone Rings',
    subcategory: 'Opal',
    price: 2750,
    metal: '18k Yellow Gold',
    gemstone: 'Australian Black Opal',
    stoneDetails: {
      type: 'Natural Solid Black Opal',
      cut: 'Cabochon Oval',
      carat: 1.85,
      color: 'N2 Body Tone / Electric Blue-Green Flash',
      clarity: 'Opaque with Intense Fire',
      certificate: 'Lightning Ridge Gem Report'
    },
    rating: 5.0,
    reviewCount: 15,
    tags: ['opal', 'rare', 'collector'],
    featured: false,
    shape: 'oval',
    color: '#0284c7',
    variants: [
      { id: 'gg-008-v1', sku: 'GG-008-18KYG-6', name: '18k Yellow Gold / Size 6', price: 2750, inStock: true, metal: '18k Yellow Gold', size: '6' }
    ],
    specifications: [
      { label: 'Center Gem', value: '1.85 Carat Solid Australian Opal' },
      { label: 'Origin', value: 'Lightning Ridge, New South Wales' }
    ]
  },
  {
    id: 'gg-009',
    slug: 'verdelite-tourmaline-bar',
    brandId: 'gemma-grove',
    name: 'Verdelite Forest Tourmaline Ring',
    description: 'A 2.40-carat elongated baguette tourmaline displaying deep pine forest hues, set horizontally in an architectural bezel with diamond pavé shoulders.',
    shortDescription: '2.40ct green verdelite tourmaline east-west ring',
    category: 'Gemstone Rings',
    subcategory: 'Tourmaline',
    price: 1450,
    metal: '14k Yellow Gold',
    gemstone: 'Green Tourmaline',
    stoneDetails: {
      type: 'Natural Verdelite Tourmaline',
      cut: 'Barion Baguette Cut',
      carat: 2.4,
      color: 'Deep Forest Pine',
      clarity: 'VVS',
      certificate: 'Authenticity Certificate'
    },
    rating: 4.8,
    reviewCount: 20,
    tags: ['tourmaline', 'green', 'east-west'],
    featured: false,
    shape: 'emerald',
    color: '#15803d',
    variants: [
      { id: 'gg-009-v1', sku: 'GG-009-14KYG-6', name: '14k Yellow Gold / Size 6', price: 1450, inStock: true, metal: '14k Yellow Gold', size: '6' },
      { id: 'gg-009-v2', sku: 'GG-009-14KYG-7', name: '14k Yellow Gold / Size 7', price: 1450, inStock: true, metal: '14k Yellow Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.40 Carat Green Tourmaline' },
      { label: 'Shoulder Accents', value: '10 Round Diamonds (0.12ctw)' }
    ]
  },
  {
    id: 'gg-010',
    slug: 'amethyst-nocturne',
    brandId: 'gemma-grove',
    name: 'Nocturne Royal Amethyst Cocktail Ring',
    description: 'A deep Siberian purple 3.50-carat round brilliant amethyst set inside a gothic openwork basket with champagne diamond accents.',
    shortDescription: '3.50ct deep royal purple amethyst in gothic setting',
    category: 'Gemstone Rings',
    subcategory: 'Amethyst',
    price: 890,
    metal: '14k Rose Gold',
    gemstone: 'Royal Amethyst',
    stoneDetails: {
      type: 'Natural Amethyst',
      cut: 'Round Brilliant',
      carat: 3.5,
      color: 'Deep Royal Siberian Purple',
      clarity: 'Eye Clean',
      certificate: 'Authenticity Certificate'
    },
    rating: 4.7,
    reviewCount: 39,
    tags: ['amethyst', 'purple', 'affordable-luxury'],
    featured: false,
    shape: 'round',
    color: '#7e22ce',
    variants: [
      { id: 'gg-010-v1', sku: 'GG-010-14KRG-6', name: '14k Rose Gold / Size 6', price: 890, inStock: true, metal: '14k Rose Gold', size: '6' },
      { id: 'gg-010-v2', sku: 'GG-010-14KRG-7', name: '14k Rose Gold / Size 7', price: 890, inStock: true, metal: '14k Rose Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '3.50 Carat Natural Amethyst' },
      { label: 'Metal Setting', value: '14k Rose Gold open piercework' }
    ]
  },
  {
    id: 'gg-011',
    slug: 'alexandrite-twilight',
    brandId: 'gemma-grove',
    name: 'Twilight Color-Change Alexandrite Ring',
    description: 'A captivating 1.30-carat chrysoberyl alexandrite that shifts dynamically from emerald teal in daylight to deep raspberry purple under incandescent light.',
    shortDescription: '1.30ct color-changing alexandrite in petal prongs',
    category: 'Gemstone Rings',
    subcategory: 'Alexandrite',
    price: 3100,
    metal: '18k White Gold',
    gemstone: 'Alexandrite',
    stoneDetails: {
      type: 'Natural Chrysoberyl Alexandrite',
      cut: 'Oval Brilliant',
      carat: 1.3,
      color: 'Teal Green to Raspberry Red (90% color change)',
      clarity: 'VS',
      certificate: 'GIA Certified'
    },
    rating: 5.0,
    reviewCount: 12,
    tags: ['alexandrite', 'color-change', 'rare'],
    featured: false,
    shape: 'oval',
    color: '#0d9488',
    variants: [
      { id: 'gg-011-v1', sku: 'GG-011-18KWG-6', name: '18k White Gold / Size 6', price: 3100, inStock: true, metal: '18k White Gold', size: '6' }
    ],
    specifications: [
      { label: 'Phenomenon', value: 'Strong pleochroic color shift' },
      { label: 'Certification', value: 'GIA Gem Identification Report' }
    ]
  },
  {
    id: 'gg-012',
    slug: 'rhodolite-garnet-halo',
    brandId: 'gemma-grove',
    name: 'Rhodolite Raspberry Garnet Halo Ring',
    description: 'A luscious 2.60-carat cushion rhodolite garnet glowing with pure raspberry-magenta fire, ringed with warm pavé diamonds on a knife-edge gold shank.',
    shortDescription: '2.60ct raspberry rhodolite garnet with diamond halo',
    category: 'Gemstone Rings',
    subcategory: 'Garnet',
    price: 1150,
    metal: '14k Yellow Gold',
    gemstone: 'Rhodolite Garnet',
    stoneDetails: {
      type: 'Natural Rhodolite Garnet',
      cut: 'Cushion Cut',
      carat: 2.6,
      color: 'Vivid Raspberry Magenta',
      clarity: 'Eye Clean',
      certificate: 'Authenticity Certificate'
    },
    rating: 4.8,
    reviewCount: 25,
    tags: ['garnet', 'rhodolite', 'magenta'],
    featured: false,
    shape: 'cushion',
    color: '#be123c',
    variants: [
      { id: 'gg-012-v1', sku: 'GG-012-14KYG-6', name: '14k Yellow Gold / Size 6', price: 1150, inStock: true, metal: '14k Yellow Gold', size: '6' },
      { id: 'gg-012-v2', sku: 'GG-012-14KYG-7', name: '14k Yellow Gold / Size 7', price: 1150, inStock: true, metal: '14k Yellow Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.60 Carat Natural Rhodolite Garnet' },
      { label: 'Diamond Halo', value: '0.24ctw Pavé Set' }
    ]
  }
];

// 3. LUSTRE CATALOG (12 Moissanite rings and earrings)
const lustreProducts = [
  {
    id: 'lus-001',
    slug: 'prism-round-solitaire',
    brandId: 'lustre',
    name: 'Prism Pure Moissanite Solitaire Ring',
    description: 'A 2.0-carat Diamond Equivalent Weight (DEW) hearts-and-arrows round moissanite engineered for maximum dispersion and fire, held in four crisp compass prongs.',
    shortDescription: '2.0ct DEW hearts & arrows round moissanite in compass prongs',
    category: 'Moissanite Rings',
    subcategory: 'Solitaire',
    price: 850,
    compareAtPrice: 1050,
    metal: '950 Platinum',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Hearts & Arrows Round Brilliant',
      carat: 2.0,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.9,
    reviewCount: 64,
    tags: ['bestseller', 'solitaire', 'minimalist', 'high-fire'],
    featured: true,
    shape: 'round',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-001-v1', sku: 'LUS-001-PLAT-6', name: 'Platinum / Size 6', price: 850, inStock: true, metal: 'Platinum', size: '6' },
      { id: 'lus-001-v2', sku: 'LUS-001-PLAT-7', name: 'Platinum / Size 7', price: 850, inStock: true, metal: 'Platinum', size: '7' },
      { id: 'lus-001-v3', sku: 'LUS-001-14KWG-6', name: '14k White Gold / Size 6', price: 720, inStock: true, metal: '14k White Gold', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.00 Carat DEW (8.0mm)' },
      { label: 'Refractive Index', value: '2.65 - 2.69 (higher fire than diamond)' },
      { label: 'Prong Geometry', value: 'Precision North-South-East-West Compass' }
    ]
  },
  {
    id: 'lus-002',
    slug: 'nova-emerald-cut-ring',
    brandId: 'lustre',
    name: 'Nova Emerald Cut Architectural Ring',
    description: 'A clean 3.0-carat DEW elongated emerald cut moissanite set within an ultra-flat sharp platinum wire band with an open pavilion gallery.',
    shortDescription: '3.0ct DEW emerald cut moissanite in architectural band',
    category: 'Moissanite Rings',
    subcategory: 'Emerald Cut',
    price: 1150,
    compareAtPrice: 1350,
    metal: '950 Platinum',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Step-Cut Emerald',
      carat: 3.0,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 5.0,
    reviewCount: 41,
    tags: ['bestseller', 'emerald-cut', 'architectural'],
    featured: true,
    shape: 'emerald',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-002-v1', sku: 'LUS-002-PLAT-6', name: 'Platinum / Size 6', price: 1150, inStock: true, metal: 'Platinum', size: '6' },
      { id: 'lus-002-v2', sku: 'LUS-002-PLAT-7', name: 'Platinum / Size 7', price: 1150, inStock: true, metal: 'Platinum', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '3.00 Carat DEW (9.5 x 7.0mm)' },
      { label: 'Cut Quality', value: 'Optically Pure Stepped Facets' },
      { label: 'Band Profile', value: '1.6mm knife-edge solid platinum' }
    ]
  },
  {
    id: 'lus-003',
    slug: 'vortex-radiant-halo',
    brandId: 'lustre',
    name: 'Vortex Radiant Floating Halo Ring',
    description: 'A 2.50-carat DEW radiant-cut moissanite that bursts with rainbow scintillation, underscored by a floating square micro-pavé collar.',
    shortDescription: '2.50ct DEW radiant cut with floating pavé collar',
    category: 'Moissanite Rings',
    subcategory: 'Halo',
    price: 1280,
    metal: '14k White Gold',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Radiant Cut',
      carat: 2.5,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.8,
    reviewCount: 35,
    tags: ['radiant', 'halo', 'scintillation'],
    featured: true,
    shape: 'emerald',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-003-v1', sku: 'LUS-003-14KWG-6', name: '14k White Gold / Size 6', price: 1280, inStock: true, metal: '14k White Gold', size: '6' },
      { id: 'lus-003-v2', sku: 'LUS-003-14KWG-7', name: '14k White Gold / Size 7', price: 1280, inStock: false, metal: '14k White Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.50 Carat DEW (8.5 x 6.5mm)' },
      { label: 'Halo Accents', value: '0.30ctw micro-cut moissanite gems' }
    ]
  },
  {
    id: 'lus-004',
    slug: 'stellar-cushion-ring',
    brandId: 'lustre',
    name: 'Stellar Elongated Cushion Ring',
    description: 'A 2.20-carat DEW elongated cushion moissanite cut with antique barion facet patterns, mounted on a solid 14k white gold comfort shank.',
    shortDescription: '2.20ct DEW elongated cushion in minimalist basket',
    category: 'Moissanite Rings',
    subcategory: 'Cushion',
    price: 940,
    metal: '14k White Gold',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Elongated Cushion Brilliant',
      carat: 2.2,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.9,
    reviewCount: 29,
    tags: ['cushion', 'elongated', 'fire'],
    featured: true,
    shape: 'cushion',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-004-v1', sku: 'LUS-004-14KWG-6', name: '14k White Gold / Size 6', price: 940, inStock: true, metal: '14k White Gold', size: '6' },
      { id: 'lus-004-v2', sku: 'LUS-004-14KWG-7', name: '14k White Gold / Size 7', price: 940, inStock: true, metal: '14k White Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.20 Carat DEW Cushion' },
      { label: 'Optical Dispersion', value: '0.104 (2.4x diamond)' }
    ]
  },
  {
    id: 'lus-005',
    slug: 'monolith-east-west-ring',
    brandId: 'lustre',
    name: 'Monolith East-West Bezel Ring',
    description: 'A sharp, industrial-luxe statement featuring a 2.80-carat DEW emerald moissanite set horizontally in a heavy flush platinum bezel.',
    shortDescription: '2.80ct DEW horizontal emerald cut in heavy bezel',
    category: 'Moissanite Rings',
    subcategory: 'Bezel',
    price: 1350,
    metal: '950 Platinum',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Emerald Cut',
      carat: 2.8,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.9,
    reviewCount: 19,
    tags: ['bezel', 'east-west', 'modern'],
    featured: false,
    shape: 'emerald',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-005-v1', sku: 'LUS-005-PLAT-6', name: 'Platinum / Size 6', price: 1350, inStock: true, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.80 Carat DEW Emerald Cut' },
      { label: 'Bezel Profile', value: 'Precision CNC-milled 950 Platinum' }
    ]
  },
  {
    id: 'lus-006',
    slug: 'eclipse-oval-ring',
    brandId: 'lustre',
    name: 'Eclipse Minimalist Oval Ring',
    description: 'An elongated 2.40-carat DEW oval moissanite perched upon an ultra-fine 1.5mm wire band, providing an illusion of a diamond floating on air.',
    shortDescription: '2.40ct DEW oval moissanite on 1.5mm wire band',
    category: 'Moissanite Rings',
    subcategory: 'Oval',
    price: 990,
    compareAtPrice: 1150,
    metal: '14k White Gold',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Oval Brilliant',
      carat: 2.4,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.8,
    reviewCount: 43,
    tags: ['oval', 'minimalist', 'bestseller'],
    featured: false,
    shape: 'oval',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-006-v1', sku: 'LUS-006-14KWG-6', name: '14k White Gold / Size 6', price: 990, inStock: true, metal: '14k White Gold', size: '6' },
      { id: 'lus-006-v2', sku: 'LUS-006-14KWG-7', name: '14k White Gold / Size 7', price: 990, inStock: true, metal: '14k White Gold', size: '7' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.40 Carat DEW Oval (10 x 7mm)' },
      { label: 'Band Thickness', value: '1.5 mm solid gold wire' }
    ]
  },
  {
    id: 'lus-007',
    slug: 'spectre-pear-ring',
    brandId: 'lustre',
    name: 'Spectre Pear Cut Knife-Edge Ring',
    description: 'A 2.0-carat DEW teardrop pear moissanite with razor-sharp facet definition, mounted on an architectural knife-edge platinum shank.',
    shortDescription: '2.0ct DEW pear moissanite on knife-edge shank',
    category: 'Moissanite Rings',
    subcategory: 'Pear',
    price: 1020,
    metal: '950 Platinum',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Pear Brilliant',
      carat: 2.0,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.7,
    reviewCount: 18,
    tags: ['pear', 'knife-edge'],
    featured: false,
    shape: 'pear',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-007-v1', sku: 'LUS-007-PLAT-6', name: 'Platinum / Size 6', price: 1020, inStock: true, metal: 'Platinum', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '2.00 Carat DEW Pear Cut' },
      { label: 'Safety Feature', value: 'V-tip chevron prong for point protection' }
    ]
  },
  {
    id: 'lus-008',
    slug: 'vector-marquise-ring',
    brandId: 'lustre',
    name: 'Vector Modern Marquise Ring',
    description: 'A 1.80-carat DEW marquise moissanite suspended horizontally between bold geometric open claws for a high-concept silhouette.',
    shortDescription: '1.80ct DEW marquise in geometric open claws',
    category: 'Moissanite Rings',
    subcategory: 'Marquise',
    price: 890,
    metal: '14k White Gold',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Marquise Brilliant',
      carat: 1.8,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.8,
    reviewCount: 14,
    tags: ['marquise', 'geometric'],
    featured: false,
    shape: 'marquise',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-008-v1', sku: 'LUS-008-14KWG-6', name: '14k White Gold / Size 6', price: 890, inStock: true, metal: '14k White Gold', size: '6' }
    ],
    specifications: [
      { label: 'Center Stone', value: '1.80 Carat DEW Marquise' },
      { label: 'Setting Design', value: 'Open pavilion geometric architecture' }
    ]
  },
  {
    id: 'lus-009',
    slug: 'supernova-stud-earrings',
    brandId: 'lustre',
    name: 'Supernova Round Moissanite Stud Earrings',
    description: 'A pair of matched 1.0-carat DEW round brilliant moissanite stones (2.0ctw total) set in ultra-low profile 3-prong martini settings with secure screw backs.',
    shortDescription: '2.0ctw matched hearts & arrows moissanite studs',
    category: 'Moissanite Earrings',
    subcategory: 'Studs',
    price: 680,
    compareAtPrice: 850,
    metal: '950 Platinum',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Hearts & Arrows Round',
      carat: 2.0,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 5.0,
    reviewCount: 78,
    tags: ['bestseller', 'earrings', 'studs', 'classic'],
    featured: false,
    shape: 'stud-earring',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-009-v1', sku: 'LUS-009-PLAT-STD', name: 'Platinum / Screw Backs', price: 680, inStock: true, metal: 'Platinum' },
      { id: 'lus-009-v2', sku: 'LUS-009-14KWG-STD', name: '14k White Gold / Push Backs', price: 550, inStock: true, metal: '14k White Gold' }
    ],
    specifications: [
      { label: 'Total Carat Weight', value: '2.00ctw (1.0ct / 6.5mm each ear)' },
      { label: 'Setting Style', value: 'Low Profile 3-Prong Martini' },
      { label: 'Backing', value: 'Double notched threaded posts' }
    ]
  },
  {
    id: 'lus-010',
    slug: 'linear-drop-earrings',
    brandId: 'lustre',
    name: 'Linear Emerald Cut Drop Earrings',
    description: 'Two matched 1.60-carat DEW emerald-cut moissanite gems dangling elegantly from sleek solid white gold bars that catch light with every gesture.',
    shortDescription: '3.20ctw emerald cut moissanite bar drops',
    category: 'Moissanite Earrings',
    subcategory: 'Drops',
    price: 1100,
    metal: '14k White Gold',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Emerald Cut',
      carat: 3.2,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.9,
    reviewCount: 23,
    tags: ['earrings', 'drops', 'statement'],
    featured: false,
    shape: 'earring-drop',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-010-v1', sku: 'LUS-010-14KWG-PAIR', name: '14k White Gold / Pair', price: 1100, inStock: true, metal: '14k White Gold' }
    ],
    specifications: [
      { label: 'Total Carat Weight', value: '3.20ctw (1.60ct each)' },
      { label: 'Drop Length', value: '28 mm total articulated drop' }
    ]
  },
  {
    id: 'lus-011',
    slug: 'astral-cushion-halo-earrings',
    brandId: 'lustre',
    name: 'Astral Cushion Halo Stud Earrings',
    description: 'Matched 1.0-carat cushion-cut moissanite centers wrapped in a sharp geometric micro-halo for unforgettable brilliance and high-contrast impact.',
    shortDescription: '2.50ctw cushion cut halo moissanite studs',
    category: 'Moissanite Earrings',
    subcategory: 'Halo Studs',
    price: 890,
    compareAtPrice: 1050,
    metal: '14k White Gold',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Cushion Cut',
      carat: 2.5,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.8,
    reviewCount: 31,
    tags: ['earrings', 'halo', 'cushion'],
    featured: false,
    shape: 'stud-earring',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-011-v1', sku: 'LUS-011-14KWG-PAIR', name: '14k White Gold / Pair', price: 890, inStock: true, metal: '14k White Gold' }
    ],
    specifications: [
      { label: 'Total Carat Weight', value: '2.50ctw total' },
      { label: 'Diameter', value: '9.2 mm outer halo diameter' }
    ]
  },
  {
    id: 'lus-012',
    slug: 'orion-huggie-hoops',
    brandId: 'lustre',
    name: 'Orion Channel-Set Moissanite Huggie Hoops',
    description: 'A pair of modern 14mm huggie hoop earrings channel-set with 1.60-carat total weight precision princess-cut moissanite gems in platinum.',
    shortDescription: '1.60ctw princess cut moissanite huggie hoops',
    category: 'Moissanite Earrings',
    subcategory: 'Hoops',
    price: 790,
    metal: '950 Platinum',
    gemstone: 'DEF Colorless Moissanite',
    stoneDetails: {
      type: 'Silicon Carbide Moissanite',
      cut: 'Princess Cut',
      carat: 1.6,
      color: 'DEF Colorless',
      clarity: 'VVS1',
      certificate: 'GRA Certified'
    },
    rating: 4.9,
    reviewCount: 45,
    tags: ['earrings', 'hoops', 'channel-set'],
    featured: false,
    shape: 'earring-hoop',
    color: '#f1f5f9',
    variants: [
      { id: 'lus-012-v1', sku: 'LUS-012-PLAT-PAIR', name: 'Platinum / Pair', price: 790, inStock: true, metal: 'Platinum' }
    ],
    specifications: [
      { label: 'Total Weight', value: '1.60ctw Princess Moissanite' },
      { label: 'Hoop Diameter', value: '14 mm outer / 11 mm inner' },
      { label: 'Closure', value: 'Seamless click-latch closure' }
    ]
  }
];

// Helper to generate SVGs and image records for each product
function processBrandCatalog(brandId, rawProducts) {
  const brandDir = path.join(PUBLIC_IMG_DIR, brandId);
  const now = new Date().toISOString();

  return rawProducts.map((p) => {
    // Generate 3 images per product (front, angle, close-up)
    const images = [];

    for (let view = 1; view <= 3; view++) {
      const fileName = `${p.id}-${view}.svg`;
      const filePath = path.join(brandDir, fileName);
      const svgContent = generateRingSvg(brandId, p.color, p.shape, view);

      fs.writeFileSync(filePath, svgContent, 'utf-8');

      images.push({
        id: `${p.id}-img-${view}`,
        url: `/images/products/${brandId}/${fileName}`,
        alt: `${p.name} - View ${view} (${view === 1 ? 'Primary Front View' : view === 2 ? 'Angle Perspective' : 'Detail Close-Up'})`,
        width: 800,
        height: 800,
        isPrimary: view === 1
      });
    }

    const { shape, color, ...rest } = p;

    return {
      ...rest,
      images,
      createdAt: p.createdAt || '2024-01-15T00:00:00.000Z',
      updatedAt: now
    };
  });
}

const finalAurelle = processBrandCatalog('aurelle', aurelleProducts);
const finalGemmaGrove = processBrandCatalog('gemma-grove', gemmaGroveProducts);
const finalLustre = processBrandCatalog('lustre', lustreProducts);

fs.writeFileSync(
  path.join(PUBLIC_API_DIR, 'aurelle/products.json'),
  JSON.stringify(finalAurelle, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(PUBLIC_API_DIR, 'gemma-grove/products.json'),
  JSON.stringify(finalGemmaGrove, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(PUBLIC_API_DIR, 'lustre/products.json'),
  JSON.stringify(finalLustre, null, 2),
  'utf-8'
);

console.log(`Generated Aurelle: ${finalAurelle.length} products`);
console.log(`Generated Gemma & Grove: ${finalGemmaGrove.length} products`);
console.log(`Generated Lustre: ${finalLustre.length} products`);
