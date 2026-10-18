import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Truck,
  RotateCcw,
  Award,
  ArrowRight,
  Star,
  CheckCircle2,
  Mail,
  Send,
  Gem,
  Scale,
  Zap,
} from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getBrandTheme, applyBrandStyles } from '../brands/config';
import { api, getProductUrl, getBrandListingRoute } from '../api';
import { formatPrice } from '../utils/format';
import type { Product } from '../types';

interface BrandLandingPageProps {
  brandId: 'aurelle' | 'gemma-grove' | 'lustre';
}

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  productName: string;
  rating: number;
}

const BRAND_TESTIMONIALS: Record<string, Testimonial[]> = {
  aurelle: [
    {
      quote:
        'The radiance of our 1.50ct lab-grown diamond in champagne gold is mesmerizing. My fiancé was stunned by the clarity and the warm glow of the metal. Far superior craftsmanship to traditional retailers.',
      author: 'Eleanor & Marcus',
      location: 'New York, NY',
      productName: 'Radiance Solitaire Engagement Ring',
      rating: 5,
    },
    {
      quote:
        'The hidden halo detail is subtle perfection. Knowing it is 100% conflict-free and IGI certified gave us complete peace of mind. The packaging alone felt like an atelier experience.',
      author: 'Sophia V.',
      location: 'San Francisco, CA',
      productName: 'Aurora Hidden Halo Ring',
      rating: 5,
    },
    {
      quote:
        'Aurelle resized my ring within 4 days through their complimentary sizing guarantee. Flawless prong tolerances and an attentive, knowledgeable concierge.',
      author: 'David M.',
      location: 'Chicago, IL',
      productName: 'Lumina Emerald Cut Bezel Ring',
      rating: 5,
    },
  ],
  'gemma-grove': [
    {
      quote:
        'The Ceylon sapphire has a velvety royal blue hue that catches the light in every room. It feels like an authentic heirloom passed down through generations.',
      author: 'Amara K.',
      location: 'Seattle, WA',
      productName: 'Azure Cascade Ceylon Sapphire Ring',
      rating: 5,
    },
    {
      quote:
        'The Zambian emerald bezel is breathtaking. Rich, vivid forest green with extraordinary transparency. The compliments haven’t stopped since our engagement.',
      author: 'Clara & Julian',
      location: 'Austin, TX',
      productName: 'Verdant Solstice Zambian Emerald Ring',
      rating: 5,
    },
    {
      quote:
        'Gemma & Grove’s editorial imagery accurately captured the actual gemstone. The Australian black opal has extraordinary fire and play-of-color in natural sunlight.',
      author: 'Elena R.',
      location: 'Boston, MA',
      productName: 'Starlight Opal Cosmic Ring',
      rating: 5,
    },
  ],
  lustre: [
    {
      quote:
        'The fire dispersion of this moissanite is otherworldly—more sparkle than any diamond I compared it against, with a stark, modern knife-edge band that fits seamlessly.',
      author: 'Devon T.',
      location: 'Los Angeles, CA',
      productName: 'Prism Pure Moissanite Solitaire Ring',
      rating: 5,
    },
    {
      quote:
        'Architectural perfection. The high-contrast aesthetic and bold geometry match our personal design philosophy. Incredible value for exceptional optical precision.',
      author: 'Kai & Morgan',
      location: 'Portland, OR',
      productName: 'Nova Emerald Cut Architectural Ring',
      rating: 5,
    },
    {
      quote:
        'The Supernova studs are my daily essential. Crisp, fiery, and completely unblemished under 10x magnification. Lustre has redefined modern fine jewelry.',
      author: 'Jordan S.',
      location: 'Denver, CO',
      productName: 'Supernova Moissanite Stud Earrings',
      rating: 5,
    },
  ],
};

const GEMSTONE_SWATCHES = [
  {
    name: 'Ceylon Sapphire',
    hue: 'Royal Cornflower Blue',
    bg: '#1e3a8a',
    border: '#3b82f6',
    mohs: '9.0',
    meaning: 'Wisdom, nobility & enduring loyalty',
    origin: 'Ratnapura, Sri Lanka',
  },
  {
    name: 'Zambian Emerald',
    hue: 'Deep Lush Forest Green',
    bg: '#064e3b',
    border: '#10b981',
    mohs: '7.5 – 8.0',
    meaning: 'Renewal, prosperity & harmony',
    origin: 'Kagem, Zambia',
  },
  {
    name: 'Burmese Ruby',
    hue: 'Intense Pigeon Blood Crimson',
    bg: '#881337',
    border: '#f43f5e',
    mohs: '9.0',
    meaning: 'Vitality, passion & inner fire',
    origin: 'Mogok Valley, Myanmar',
  },
  {
    name: 'Peach Morganite',
    hue: 'Warm Sunset Champagne',
    bg: '#fb7185',
    border: '#fda4af',
    mohs: '7.5 – 8.0',
    meaning: 'Compassion, grace & divine love',
    origin: 'Minas Gerais, Brazil',
  },
  {
    name: 'Royal Tanzanite',
    hue: 'Velvety Violet-Indigo',
    bg: '#4338ca',
    border: '#818cf8',
    mohs: '6.5 – 7.0',
    meaning: 'Transformation, intuition & rare luxury',
    origin: 'Mount Kilimanjaro, Tanzania',
  },
  {
    name: 'Australian Opal',
    hue: 'Prismatic Iridescent Aurora',
    bg: '#0f766e',
    border: '#2dd4bf',
    mohs: '5.5 – 6.5',
    meaning: 'Creativity, cosmic wonder & hope',
    origin: 'Lightning Ridge, Australia',
  },
];

const SHAPE_CATEGORIES = {
  aurelle: [
    { name: 'Solitaire', desc: 'Timeless focus on center stone', count: '4 Designs' },
    { name: 'Halo & Hidden Halo', desc: 'Radiant micro-pavé frames', count: '3 Designs' },
    { name: 'Three-Stone', desc: 'Past, present, and future trilogy', count: '2 Designs' },
    { name: 'Emerald & Bezel', desc: 'Architectural clean contours', count: '3 Designs' },
  ],
  'gemma-grove': [
    { name: 'Sapphires & Rubies', desc: 'Corundum family royal jewels', count: '4 Designs' },
    { name: 'Emeralds & Tourmalines', desc: 'Verdant greens and teals', count: '3 Designs' },
    { name: 'Morganite & Opals', desc: 'Warm blushes and iridescent fire', count: '3 Designs' },
    { name: 'Rare Collector Cuts', desc: 'Alexandrite, Tanzanite & Garnet', count: '2 Designs' },
  ],
  lustre: [
    { name: 'Solitaire Rings', desc: 'Pure optical prism settings', count: '4 Designs' },
    { name: 'Halo & Bezel Rings', desc: 'High-contrast modern frames', count: '4 Designs' },
    { name: 'Solitaire Studs', desc: 'High-dispersion daily fire', count: '2 Designs' },
    { name: 'Architectural Drops', desc: 'Linear geometric earrings', count: '2 Designs' },
  ],
};

const BrandLandingPage: React.FC<BrandLandingPageProps> = ({ brandId }) => {
  const theme = getBrandTheme(brandId);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gemma & Grove interactive swatch state
  const [selectedSwatch, setSelectedSwatch] = useState(0);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Apply brand styles
  useEffect(() => {
    applyBrandStyles(brandId);
  }, [brandId]);

  // Load bestsellers from the API module
  useEffect(() => {
    let active = true;

    api.getBestsellerProducts(brandId, 4).then((response) => {
      if (!active) return;
      if (response.success) {
        setBestsellerProducts(response.data);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [brandId]);

  const collectionRoute = getBrandListingRoute(brandId);
  const testimonials = BRAND_TESTIMONIALS[brandId] || BRAND_TESTIMONIALS.aurelle;
  const shapes = SHAPE_CATEGORIES[brandId] || SHAPE_CATEGORIES.aurelle;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterStatus('error');
      setNewsletterMsg('Please provide a valid email address.');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMsg(`Thank you for subscribing to ${theme.name}. Your welcome guide and $100 bespoke privilege code have been dispatched to ${email}.`);
      setEmail('');
    }, 600);
  };

  if (loading) {
    return (
      <div className="space-y-12" aria-busy="true">
        <LoadingSkeleton type="text" count={3} className="max-w-3xl mx-auto" />
        <LoadingSkeleton type="card" count={4} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" />
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-12">
      {/* 1. Hero Section */}
      <section className="text-center py-12 md:py-20 max-w-4xl mx-auto">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 shadow-xs"
          style={{
            backgroundColor: theme.colors.primary + '18',
            color: theme.colors.primary,
          }}
        >
          {brandId === 'aurelle'
            ? 'Conflict-Free Lab-Grown Diamonds'
            : brandId === 'gemma-grove'
            ? 'Artisanal Colored Gemstones'
            : 'Engineered Architectural Moissanite'}
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-brand-display tracking-tight leading-tight"
          style={{ color: theme.colors.foreground }}
        >
          {theme.name}
        </h1>
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          style={{ color: theme.colors.muted }}
        >
          {theme.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={collectionRoute}
            className="px-8 py-3.5 rounded-md font-semibold text-sm transition-all shadow-md hover:opacity-90 inline-flex items-center space-x-2"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
            }}
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
          <a
            href="#brand-story"
            className="px-8 py-3.5 rounded-md font-semibold text-sm border transition-colors hover:bg-neutral-50"
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.foreground,
            }}
          >
            Our Atelier Philosophy
          </a>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section
        className="p-6 md:p-8 rounded-xl border grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.neutral[50],
        }}
      >
        <div className="space-y-1.5 flex flex-col items-center">
          <Truck className="w-6 h-6 mb-1 text-primary" />
          <h2 className="text-sm font-semibold text-foreground font-brand-display">Free Insured Express</h2>
          <p className="text-xs text-muted">Complimentary insured delivery on every order</p>
        </div>
        <div className="space-y-1.5 flex flex-col items-center">
          <RotateCcw className="w-6 h-6 mb-1 text-primary" />
          <h2 className="text-sm font-semibold text-foreground font-brand-display">60-Day Complimentary Sizing</h2>
          <p className="text-xs text-muted">One free precision resize for a flawless fit</p>
        </div>
        <div className="space-y-1.5 flex flex-col items-center">
          <Shield className="w-6 h-6 mb-1 text-primary" />
          <h2 className="text-sm font-semibold text-foreground font-brand-display">Lifetime Warranty</h2>
          <p className="text-xs text-muted">Annual prong inspection &amp; ultrasonic cleaning</p>
        </div>
        <div className="space-y-1.5 flex flex-col items-center">
          <Award className="w-6 h-6 mb-1 text-primary" />
          <h2 className="text-sm font-semibold text-foreground font-brand-display">Certified Authenticity</h2>
          <p className="text-xs text-muted">Verified IGI, GIA, GCAL &amp; GRA grading reports</p>
        </div>
      </section>

      {/* 3. Category & Shape Exploration Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-primary">
            Curated Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground">
            Explore by Silhouette &amp; Style
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Select a design category to discover specialized cuts, prong configurations, and stone settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shapes.map((item, idx) => (
            <Link
              key={idx}
              to={collectionRoute}
              className="group p-6 rounded-lg border transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
              }}
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {item.count}
                </span>
                <h3 className="text-lg font-bold font-brand-display text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-primary mt-2">
                <span>Browse Designs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Special Brand Highlights */}
      {/* GEMMA & GROVE: Gemstone Swatches Section */}
      {brandId === 'gemma-grove' && (
        <section
          className="p-8 sm:p-10 rounded-2xl border space-y-8"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.neutral[50],
          }}
        >
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Mineralogy &amp; Provenance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground mt-1 mb-2">
              The Gemma &amp; Grove Gemstone Palette
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Every colored gemstone possesses its own geological origin, refractive vibrancy, and symbolic legacy. Explore our ethically sourced jewel tones:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {GEMSTONE_SWATCHES.map((swatch, index) => {
              const isSelected = selectedSwatch === index;
              return (
                <button
                  key={swatch.name}
                  onClick={() => setSelectedSwatch(index)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-primary shadow-md bg-white'
                      : 'hover:bg-white/60 bg-transparent'
                  }`}
                  style={{ borderColor: isSelected ? theme.colors.primary : theme.colors.border }}
                  aria-pressed={isSelected}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2.5 shadow-inner"
                    style={{ backgroundColor: swatch.bg }}
                  />
                  <div className="text-xs font-bold text-foreground truncate">{swatch.name}</div>
                  <div className="text-[10px] text-muted truncate">{swatch.hue}</div>
                </button>
              );
            })}
          </div>

          {/* Active Swatch Detail Card */}
          {GEMSTONE_SWATCHES[selectedSwatch] && (
            <div className="p-6 rounded-xl bg-white border border-border shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Active Gemstone</span>
                <h3 className="text-lg font-bold font-brand-display text-foreground mt-0.5">
                  {GEMSTONE_SWATCHES[selectedSwatch].name}
                </h3>
                <p className="text-xs text-muted mt-1">
                  Origin: <strong>{GEMSTONE_SWATCHES[selectedSwatch].origin}</strong>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Durability &amp; Color</span>
                <p className="text-xs text-foreground mt-1 font-semibold">
                  Mohs Hardness: {GEMSTONE_SWATCHES[selectedSwatch].mohs}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Hue: {GEMSTONE_SWATCHES[selectedSwatch].hue}
                </p>
              </div>
              <div className="flex flex-col justify-between sm:items-end">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Symbolism</span>
                  <p className="text-xs text-foreground mt-1">
                    {GEMSTONE_SWATCHES[selectedSwatch].meaning}
                  </p>
                </div>
                <Link
                  to={collectionRoute}
                  className="mt-3 sm:mt-0 text-xs font-semibold text-primary hover:underline inline-flex items-center"
                >
                  <span>Filter {GEMSTONE_SWATCHES[selectedSwatch].name} Rings</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* LUSTRE: Moissanite vs. Diamond Comparison Section */}
      {brandId === 'lustre' && (
        <section
          className="p-8 sm:p-10 rounded-2xl border space-y-8"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.neutral[50],
          }}
        >
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Optical Science &amp; Innovation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground mt-1 mb-2">
              Moissanite vs. Mined Diamond: The Scientific Reality
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Silicon carbide moissanite delivers higher refractive brilliance, superior fire dispersion, and extraordinary hardness without ethical compromise or mining markups.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-muted">
                  <th className="py-3 px-4 font-semibold">Optical Property</th>
                  <th className="py-3 px-4 font-bold text-foreground">Lustre Moissanite</th>
                  <th className="py-3 px-4 font-semibold">Mined Diamond</th>
                  <th className="py-3 px-4 font-semibold">The Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>Fire Dispersion (Fire)</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-primary">0.104</td>
                  <td className="py-3 px-4 text-muted">0.044</td>
                  <td className="py-3 px-4 text-xs text-foreground font-semibold">2.4x more colored rainbow fire</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Refractive Index (Brilliance)</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-primary">2.65 – 2.69</td>
                  <td className="py-3 px-4 text-muted">2.42</td>
                  <td className="py-3 px-4 text-xs text-foreground font-semibold">Higher light return &amp; brightness</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>Hardness (Mohs Scale)</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">9.25 / 10</td>
                  <td className="py-3 px-4 text-muted">10 / 10</td>
                  <td className="py-3 px-4 text-xs text-muted">Immune to daily scratching; second only to diamond</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground flex items-center space-x-1.5">
                    <Scale className="w-3.5 h-3.5 text-primary" />
                    <span>Price Efficiency</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-primary">~$650 – $1,800</td>
                  <td className="py-3 px-4 text-muted">$6,000 – $20,000+</td>
                  <td className="py-3 px-4 text-xs text-foreground font-semibold">Up to 90% savings for equal visual luxury</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-foreground flex items-center space-x-1.5">
                    <Gem className="w-3.5 h-3.5 text-primary" />
                    <span>Environmental Impact</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">Zero Earth Mining</td>
                  <td className="py-3 px-4 text-muted">Heavy Geological Displacement</td>
                  <td className="py-3 px-4 text-xs text-emerald-700 font-semibold">100% lab-created ethical purity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. API-Loaded Bestsellers Section */}
      {bestsellerProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-primary">
                Customer Favorites
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground mt-1">
                Bestselling Designs
              </h2>
            </div>
            <Link
              to={collectionRoute}
              className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center"
            >
              <span>View All 12 Designs</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerProducts.map((product) => {
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
                  <Link to={detailUrl} className="block aspect-square overflow-hidden bg-neutral-100 relative">
                    <img
                      src={primaryImg?.url || '/favicon.svg'}
                      alt={primaryImg?.alt || product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                      }}
                    >
                      Bestseller
                    </span>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] uppercase font-medium tracking-wider mb-1" style={{ color: theme.colors.muted }}>
                        {product.metal || product.gemstone}
                      </div>
                      <h3 className="font-semibold text-sm mb-2 font-brand-display line-clamp-1">
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
                        <span className="text-base font-bold" style={{ color: theme.colors.primary }}>
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

      {/* 6. Brand Story & Atelier Heritage */}
      <section
        id="brand-story"
        className="max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl border text-center space-y-6"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.neutral[50],
        }}
      >
        <span className="text-xs uppercase font-bold tracking-wider text-primary">
          Our Heritage &amp; Mission
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground">
          The {theme.name} Philosophy
        </h2>
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-muted max-w-3xl mx-auto">
          {brandId === 'aurelle' && (
            <>
              <p>
                Aurelle was founded on the belief that enduring romance deserves conscious, conflict-free beauty. Our lab-grown diamonds are atom-for-atom identical to mined diamonds, grown through advanced chemical vapor deposition and laser-cut by master lapidaries.
              </p>
              <p>
                Framed in warm 14k and 18k champagne gold, radiant platinum, and delicate milgrain bezels, each ring embodies an understated elegance tailored for life&apos;s most meaningful commitments.
              </p>
            </>
          )}
          {brandId === 'gemma-grove' && (
            <>
              <p>
                Gemma &amp; Grove celebrates nature&apos;s extraordinary chromatic wonders. From the legendary gem gravels of Ratnapura to the verdant mineral veins of Zambia, our master gemologists curate stones with character, saturation, and natural soul.
              </p>
              <p>
                We eschew repetitive cookie-cutter designs in favor of sculptural signets, asymmetric halos, and bespoke prongs that honor each stone&apos;s organic geometry and rich color personality.
              </p>
            </>
          )}
          {brandId === 'lustre' && (
            <>
              <p>
                Lustre was engineered for the modern connoisseur who values optical purity over outdated industry traditions. Silicon carbide moissanite possesses a refractive index of 2.65 and an extraordinary 0.104 fire dispersion—more vibrant than any mined gemstone in existence.
              </p>
              <p>
                Paired with stark monochrome packaging, knife-edge bands, and crisp sans-serif lines, Lustre creates fine jewelry that is bold, unapologetic, and mathematically stunning.
              </p>
            </>
          )}
        </div>
      </section>

      {/* 7. Customer Testimonials (At least 3 verified reviews) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Client Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground">
            Trusted by Connoisseurs
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Read authentic experiences from clients who entrusted their milestones to {theme.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border flex flex-col justify-between space-y-4"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: review.rating }).map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-[10px] uppercase font-bold tracking-wider text-emerald-700 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-0.5 inline" /> Verified Client
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-foreground italic leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-border/60">
                <p className="text-xs font-bold text-foreground">{review.author}</p>
                <p className="text-[11px] text-muted">{review.location}</p>
                <p className="text-[11px] font-medium text-primary mt-1 truncate">
                  Purchased: {review.productName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Functional Newsletter Signup */}
      <section
        className="max-w-3xl mx-auto p-8 sm:p-12 rounded-2xl border text-center space-y-6 shadow-xs"
        style={{
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.neutral[50],
        }}
      >
        <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-primary/10 text-primary">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-brand-display text-foreground">
            Join the {theme.name} Atelier Circle
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Receive private release invitations, gemstone market insights, and a <strong>$100 bespoke privilege code</strong> toward your inaugural order.
          </p>
        </div>

        {newsletterStatus === 'success' ? (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{newsletterMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (newsletterStatus === 'error') setNewsletterStatus('idle');
                }}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-target"
                aria-label="Email address for newsletter"
                disabled={newsletterStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="py-3 px-6 rounded-md font-semibold text-xs sm:text-sm shadow-sm transition-all hover:opacity-90 flex items-center justify-center space-x-1.5 touch-target disabled:opacity-50"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.id === 'lustre' ? theme.colors.foreground : '#ffffff',
                }}
              >
                <span>{newsletterStatus === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <Send className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
            {newsletterStatus === 'error' && (
              <p className="text-xs text-red-500 text-left pl-1 font-medium">{newsletterMsg}</p>
            )}
            <p className="text-[11px] text-muted">
              We respect your privacy. Unsubscribe at any time with a single click.
            </p>
          </form>
        )}
      </section>
    </div>
  );
};

export default BrandLandingPage;
