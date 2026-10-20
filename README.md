# Jewelry Storefronts — Multi-Brand Luxury E-Commerce Frontend

A production-quality frontend for a premium jewelry e-commerce platform, built as a senior frontend developer evaluation assignment for Axe Consultancy And Security Services LLC. This application showcases three fictional US jewelry brands sharing one component library and layout system.

## Project Overview

This React + TypeScript application implements an asynchronous data architecture and unified design system supporting three distinct brand identities:

- **Aurelle**: Lab-grown diamond engagement rings (ivory & champagne gold palette, elegant serif typography)
- **Gemma & Grove**: Colored gemstone jewelry (rich jewel tones, emerald and amethyst accents, editorial layouts)
- **Lustre**: Architectural moissanite rings and earrings (dark, high-contrast monochrome design, crisp modern typography)

---

## Tech Stack & Architecture

- **React 19.2.8** + **TypeScript 6.0**
- **Vite 8.3.4** for ultra-fast compilation and bundling
- **React Router 7.18.4** supporting declarative slug-based routing
- **Tailwind CSS 4.3.3** via native `@tailwindcss/vite` plugin
- **Lucide React 1.59.0** for icon primitives
- **Playwright 1.64.1** for E2E testing (31 tests covering all 3 brands)
- **Lighthouse 13.5.0** for performance, accessibility, best practices, and SEO auditing
- **Native Context API** with localStorage persistence for cart state
- **Decoupled Asynchronous API Layer** (`src/api/index.ts`) consuming `/api/{brandId}/products.json`
- **Zero-Dependency Vector Imagery**: 108 brand-specific vector SVGs procedurally generated into `public/images/products/`

---

## Catalog & Data Requirements

All catalog data is consumed asynchronously via `src/api/index.ts` using `fetch()` with HTTP status checks, in-memory session caching, deterministic filtering, and type-safe contracts. **Components never import JSON directly.**

| Brand | Minimum Required | Delivered | Unique Views per Item | Certifications |
|---|---|---|---|---|
| **Aurelle** | 12 Lab-Grown Diamond Rings | **12 items** | 3 SVG angles (36 files) | IGI / GCAL |
| **Gemma & Grove** | 12 Colored Gemstone Pieces | **12 items** | 3 SVG angles (36 files) | Gübelin / GIA / SSEF |
| **Lustre** | 4 Moissanite Rings or Earrings | **12 items** (8 rings, 4 earrings) | 3 SVG angles (36 files) | GRA / Moissanite Lab |
| **Total** | 28 items | **36 items** | **108 local SVG assets** | Complete authenticity data |

### Price Formatting
All product prices throughout the storefront use standardized US currency formatting conforming to:
```typescript
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
```

---

## Storefront Routes

| Route | Description |
|---|---|
| `/` | Storefront Showcase linking to all three jewelry brands |
| `/aurelle` | Aurelle brand landing page with signature curated designs |
| `/aurelle/engagement-rings` | Aurelle catalog listing with filters, sorting, and grid/list views |
| `/aurelle/engagement-rings/:slug` | Aurelle product detail page (PDP) with variants, specs, and related items |
| `/gemma-grove` | Gemma & Grove brand landing page |
| `/gemma-grove/gemstone-rings` | Gemma & Grove gemstone catalog listing |
| `/gemma-grove/gemstone-rings/:slug` | Gemma & Grove product detail page (PDP) |
| `/lustre` | Lustre brand landing page |
| `/lustre/moissanite-rings` | Lustre moissanite catalog listing |
| `/lustre/moissanite-rings/:slug` | Lustre product detail page (PDP) |
| `*` | Branded 404 page with direct route recovery |

---

## Key Architecture Highlights

1. **Decoupled API Abstraction (`src/api/index.ts`)**:
   - `api.getProductsByBrand(brandId)`
   - `api.getProductBySlug(brandId, slug)`
   - `api.getFeaturedProducts(brandId, limit)`
   - `api.getBestsellerProducts(brandId, limit)`
   - `api.getRelatedProducts(brandId, currentProductId, limit)`
   - `api.getFilteredProducts(brandId, filters, sortOption)`
   - Centralized canonical URL generator `getProductUrl(brandId, slug)`

2. **Graceful State Handling**:
   - Every catalog view handles `loading` with animated skeleton placeholders (`LoadingSkeleton`).
   - Network or not-found errors present dedicated `ErrorState` components with working `Try Again` retry callbacks and recovery navigation.
   - Filtering results present intuitive `EmptyState` interfaces with filter reset triggers.

3. **Dynamic Theming via CSS Custom Properties**:
   - Root CSS variables (`--primary`, `--background`, `--foreground`, `--border`, `--font-display`) switch automatically on brand route changes without unmounting or duplicating core UI components.

4. **Cart System**:
   - Native Context API with localStorage persistence across page reloads.
   - Slide-out cart drawer with backdrop overlay, Escape key dismissal, and body scroll lock.
   - Quantity controls and item removal with toast confirmation.

5. **Responsive Design**:
   - Mobile-first with breakpoints at 768px and 1024px.
   - Mobile navigation drawer, mobile filter drawer, and sticky add-to-cart bar.
   - Zero horizontal overflow validated across 360px, 768px, 1024px, and 1440px viewports.

---

## Verification & Automated Testing

### Commands

```bash
# 1. Run catalog validation (tests all 36 products, 108 assets, schemas)
npm run validate:catalogs

# 2. Strict TypeScript type-check
npm run typecheck

# 3. ESLint verification
npm run lint

# 4. Playwright E2E tests (31 tests, all passing)
npm test

# 5. Playwright E2E tests with headed browser (for debugging)
npm run test:headed

# 6. Lighthouse audit (runs against dev server)
npx lighthouse http://localhost:5173 --output=json --output-path=submission/lighthouse-home.json --only-categories=performance,accessibility,best-practices,seo

# 7. Production build
npm run build

# 8. Local development server
npm run dev
```

### Test Coverage Summary

| Category | Tests | Status |
|---|---|---|
| Home page & brand links | 1 | ✅ |
| Brand landing pages (x3) | 3 | ✅ |
| Product listing rendering (x3) | 3 | ✅ |
| Sorting functionality (x3) | 3 | ✅ |
| Desktop filter panel (x3) | 3 | ✅ |
| Filter reset (x3) | 3 | ✅ |
| PDP variant selection & add-to-cart (x3) | 3 | ✅ |
| Invalid product slug / 404 (x3) | 3 | ✅ |
| Global 404 page | 1 | ✅ |
| Cart persistence after reload | 1 | ✅ |
| Cart drawer close controls (button, backdrop, Escape) | 1 | ✅ |
| Mobile navigation | 1 | ✅ |
| Mobile filter drawer | 1 | ✅ |
| Sticky mobile add-to-cart bar | 1 | ✅ |
| Newsletter email validation & submission | 1 | ✅ |
| Responsive layout - no horizontal overflow | 1 | ✅ |
| Console errors & failed requests | 1 | ✅ |
| **Total** | **31** | **All passing** |

---

## SEO & Lighthouse

### Lighthouse Audit Results

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home (`/`) | 48 | 95 | 100 | 100 |
| Aurelle Landing (`/aurelle`) | 37 | 96 | 100 | 100 |
| PDP (`/aurelle/engagement-rings/radiance-solitaire`) | 34 | 96 | 100 | 100 |

Performance scores reflect local HTTP development conditions. All other categories are excellent. Full JSON reports are in the `submission/` directory.

### SEO Implementation
- Unique `<title>` and `<meta description>` per page/brand
- Open Graph tags (image, title, description)
- JSON-LD structured data (Product schema on PDPs)
- Semantic HTML with proper heading hierarchy (H1→H2→H3)
- Descriptive `alt` text on all product images
- Valid `robots.txt` and canonical URLs
- [Full keyword map](submission/keyword-map.md) in the submission directory

---

## Submission Deliverables

| File | Description |
|---|---|
| `submission/keyword-map.md` | SEO keyword map covering all pages, brands, and product categories |
| `submission/lighthouse-home.json` | Lighthouse audit report for homepage |
| `submission/lighthouse-landing-aurelle.json` | Lighthouse audit report for Aurelle brand landing |
| `submission/lighthouse-pdp-aurelle.json` | Lighthouse audit report for a representative PDP |
| `submission/qa-report.md` | Full QA report including test suite results, content audit, and known issues |

---

Built for Axe Consultancy And Security Services LLC — Frontend Developer Job Application Assignment.
