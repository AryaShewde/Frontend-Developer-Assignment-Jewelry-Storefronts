# Jewelry Storefronts — Multi-Brand Luxury E-Commerce Frontend

> **Live Demo:** [https://jewelry-storefronts-livid.vercel.app/](https://jewelry-storefronts-livid.vercel.app/)

A production-quality frontend for a premium jewelry e-commerce platform, built as a senior frontend developer evaluation assignment for **Axe Consultancy And Security Services LLC**. This application showcases three fictional US jewelry brands sharing one component library and layout system.

---

## Project Overview

**Jewelry Storefronts** is a modern React + TypeScript e-commerce frontend demonstrating a scalable multi-brand architecture. The application implements a **unified design system** with **dynamic theming** that supports three distinct jewelry brands, each with its own visual identity, color palette, typography, and product catalog — all powered by shared React components.

### The Three Brands

| Brand | Specialty | Visual Identity | Product Count |
|-------|-----------|-----------------|---------------|
| **Aurelle** | Lab-grown diamond engagement rings | Ivory & champagne gold palette, elegant serif typography (Playfair Display) | 12 rings |
| **Gemma & Grove** | Colored gemstone jewelry | Rich jewel tones, emerald/amethyst accents, editorial layouts (Cormorant Garamond) | 12 rings |
| **Lustre** | Architectural moissanite rings & earrings | Modern blue/white palette, crisp sans-serif typography (Inter) | 12 pieces (8 rings, 4 earrings) |

---

## Key Features

### Multi-Brand Architecture
- **Dynamic theming** via CSS custom properties — theme variables (`--primary`, `--background`, `--foreground`, `--border`, `--font-*`) swap automatically on brand route changes without unmounting components
- **Shared component library** — all three brands use identical React components with brand-specific styling
- **Zero code duplication** — single codebase serves all brands

### Product Catalog & Discovery
- **Catalog pages** with server-like filtering (metal, shape/gem, price range) and sorting (price asc/desc, newest)
- **Responsive grid/list views** with skeleton loading states
- **Product detail pages** with variant selection, image gallery, specifications, and related products
- **108 hand-crafted SVG assets** (3 angles × 36 products) — zero external image dependencies

### Shopping Experience
- **Persistent cart** via Context API + localStorage (survives page reloads)
- **Slide-out cart drawer** with backdrop overlay, Escape key dismissal, body scroll lock
- **Quantity controls** and item removal with toast notifications
- **Free shipping progress meter** with visual progress bar

### User Experience
- **Mobile-first responsive design** (breakpoints: 768px, 1024px)
- **Mobile navigation drawer** with brand & catalog shortcuts
- **Mobile filter drawer** for catalog pages
- **Sticky add-to-cart bar** on mobile product pages
- **Zero horizontal overflow** validated at 360px, 768px, 1024px, 1440px

### Accessibility (WCAG AA)
- Semantic HTML with proper heading hierarchy (H1→H2→H3)
- ARIA roles, labels, and live regions
- Keyboard navigation (Escape closes drawers, focus management)
- Color contrast compliance across all brand themes
- Skip links and landmark regions

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2.8 + TypeScript 6.0 |
| **Build Tool** | Vite 8.3.4 |
| **Routing** | React Router 7.18.4 |
| **Styling** | Tailwind CSS 4.3.3 (`@tailwindcss/vite`) |
| **Icons** | Lucide React 1.59.0 |
| **State** | Native Context API + localStorage |
| **Testing** | Playwright 1.64.1 (31 E2E tests) |
| **Auditing** | Lighthouse 13.5.0 |
| **Linting** | ESLint 10 + TypeScript ESLint 8 |

---

## Project Structure

```
jewelry-storefronts/
├── public/
│   ├── api/                    # Brand product JSON data (3 brands × 12 products)
│   ├── images/products/        # 108 SVG assets (36 per brand, 3 angles each)
│   └── favicon.svg
├── src/
│   ├── api/                    # Async API layer (fetch, cache, filter, sort)
│   ├── brands/
│   │   └── config.ts           # Brand themes (colors, typography, spacing)
│   ├── components/             # Shared UI components (Header, CartDrawer, Toast, etc.)
│   ├── context/                # Cart Context (state, persistence, actions)
│   ├── hooks/                  # Custom hooks (useCart)
│   ├── pages/                  # Route pages (Home, BrandLanding, Listing, PDP)
│   ├── types/                  # TypeScript interfaces & types
│   ├── utils/                  # Formatters, helpers
│   ├── App.tsx                 # Router + Layout composition
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + CSS variables
├── e2e/
│   └── storefronts.spec.ts     # 31 Playwright E2E tests
├── scripts/
│   └── validate-catalogs.js    # Catalog validation script
├── submission/                 # Phase 4 deliverables (keyword map, LH reports, QA)
├── .vercel.json                # Vercel deployment config
└── package.json
```

---

## Storefront Routes

| Route | Description |
|-------|-------------|
| `/` | Brand showcase home page linking to all three brands |
| `/aurelle` | Aurelle brand landing page |
| `/aurelle/engagement-rings` | Aurelle catalog with filters & sorting |
| `/aurelle/engagement-rings/:slug` | Aurelle product detail page |
| `/gemma-grove` | Gemma & Grove brand landing page |
| `/gemma-grove/gemstone-rings` | Gemma & Grove catalog |
| `/gemma-grove/gemstone-rings/:slug` | Gemma & Grove product detail |
| `/lustre` | Lustre brand landing page |
| `/lustre/moissanite-rings` | Lustre moissanite catalog |
| `/lustre/moissanite-rings/:slug` | Lustre product detail |
| `*` | Branded 404 page with recovery links |

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```

### Verification Commands

```bash
# 1. Catalog validation (36 products, 108 assets, schemas)
npm run validate:catalogs

# 2. Strict TypeScript type-check
npm run typecheck

# 3. ESLint verification
npm run lint

# 4. Playwright E2E tests (all 31 tests)
npm test

# 5. Playwright E2E tests with headed browser (debugging)
npm run test:headed

# 6. Lighthouse audit (against preview server)
npm run build && npm run preview &
npx lighthouse http://localhost:4173 --output=json --output-path=lighthouse-report.json
```

---

## Test Coverage Summary

| Category | Tests | Status |
|----------|-------|--------|
| Home page & brand links | 1 | ✅ |
| Brand landing pages (×3) | 3 | ✅ |
| Product listing rendering (×3) | 3 | ✅ |
| Sorting functionality (×3) | 3 | ✅ |
| Desktop filter panel (×3) | 3 | ✅ |
| Filter reset (×3) | 3 | ✅ |
| PDP variant selection & add-to-cart (×3) | 3 | ✅ |
| Invalid product slug / 404 (×3) | 3 | ✅ |
| Global 404 page | 1 | ✅ |
| Cart persistence after reload | 1 | ✅ |
| Cart drawer close controls | 1 | ✅ |
| Mobile navigation | 1 | ✅ |
| Mobile filter drawer | 1 | ✅ |
| Sticky mobile add-to-cart bar | 1 | ✅ |
| Newsletter validation & submission | 1 | ✅ |
| Responsive layout (no horizontal overflow) | 1 | ✅ |
| Console errors & failed requests | 1 | ✅ |
| **Total** | **31** | **All passing** |

---

## Performance & SEO (Lighthouse)

### Production Build Scores (Mobile)

| Page | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| Home (`/`) | **93** | 95 | 100 | 100 |
| Aurelle Landing (`/aurelle`) | **90** | 96 | 100 | 100 |
| PDP (`/aurelle/engagement-rings/radiance-solitaire`) | **91** | 96 | 100 | 100 |

> All targets met: **Performance 70+**, **Accessibility 90+**, **Best Practices 90+**, **SEO 90+**

### SEO Implementation
- Unique `<title>` and `<meta description>` per page/brand
- Open Graph tags (image, title, description) for social sharing
- JSON-LD structured data (Product schema on PDPs)
- Semantic HTML with proper heading hierarchy
- Descriptive `alt` text on all product images
- Valid `robots.txt` and canonical URLs
- [Full keyword map](submission/keyword-map.md)

---

## Submission Deliverables (Phase 4)

| File | Description |
|------|-------------|
| `submission/keyword-map.md` | SEO keyword map for all pages & brands |
| `submission/lighthouse-*-prod.json` | Lighthouse reports (production build) |
| `submission/lighthouse-*-live.json` | Lighthouse reports (live Vercel deployment) |
| `submission/*-screenshot.jpg` | Lighthouse final screenshots |
| `submission/qa-report.md` | Full QA report (test results, content audit, limitations) |

---

## Deployment

**Live URL:** [https://jewelry-storefronts-livid.vercel.app/](https://jewelry-storefronts-livid.vercel.app/)

The project includes a `.vercel.json` configuration for:
- SPA routing (rewrites all routes to `/index.html`)
- Static asset caching (1 year for `/assets/`, `/images/`)
- API data caching (24 hours for `/api/`)

```bash
# Deploy to Vercel (requires Vercel CLI login)
vercel --prod
```

---

## Architecture Highlights

### 1. Decoupled Async API Layer (`src/api/index.ts`)
- `getProductsByBrand(brandId)` — fetch all products for a brand
- `getProductBySlug(brandId, slug)` — fetch single product
- `getFeaturedProducts(brandId, limit)` — homepage featured items
- `getBestsellerProducts(brandId, limit)` — bestseller section
- `getRelatedProducts(brandId, currentProductId, limit)` — PDP cross-sell
- `getFilteredProducts(brandId, filters, sortOption)` — catalog filtering/sorting
- In-memory session caching + HTTP status validation

### 2. Graceful State Handling
- `LoadingSkeleton` — animated placeholders during fetch
- `ErrorState` — retry buttons + recovery navigation
- `EmptyState` — filter reset triggers

### 3. Dynamic Theming System
- CSS custom properties applied to `:root` on route change
- Brand config in `src/brands/config.ts` (colors, fonts, spacing, border radius)
- No component duplication — pure CSS variable swapping

### 4. Cart System
- React Context + localStorage persistence
- Slide-out drawer with backdrop, Escape key, scroll lock
- Toast notifications on add-to-cart

---

## Assignment Information

**Built for:** Axe Consultancy And Security Services LLC  
**Role:** Frontend Developer Evaluation Assignment  
**Deadline:** October 21, 2026  
**Repository:** [Frontend-Developer-Assignment-Jewelry-Storefronts](https://github.com/AryaShewde/Frontend-Developer-Assignment-Jewelry-Storefronts)

---

## License

This project is built for evaluation purposes. All brand names, product descriptions, testimonials, and imagery are fictional.