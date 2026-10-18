# Jewelry Storefronts — Phase 1: Product Catalog and API Verification

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
- **Native Context API** with localStorage persistence for cart state
- **Decoupled Asynchronous API Layer** (`src/api/index.ts`) consuming `/api/{brandId}/products.json`
- **Zero-Dependency Vector Imagery**: 108 brand-specific vector SVGs procedurally generated into `public/images/products/`

---

## Catalog & Data Requirements (Phase 1)

All catalog data is consumed asynchronously via `src/api/index.ts` using `fetch()` with HTTP status checks, in-memory session caching, deterministic filtering, and type-safe contracts. **Components never import JSON directly.**

| Brand | Minimum Required | Delivered in Phase 1 | Unique Views per Item | Certifications |
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

- `/` — Storefront Showcase linking to all three jewelry brands
- `/aurelle` — Aurelle brand landing page with signature curated designs
- `/aurelle/engagement-rings` — Aurelle catalog listing with filters, sorting, and grid/list views
- `/aurelle/engagement-rings/:slug` — Aurelle product detail page (PDP) with variants, specs, and related items
- `/gemma-grove` — Gemma & Grove brand landing page
- `/gemma-grove/gemstone-rings` — Gemma & Grove gemstone catalog listing
- `/gemma-grove/gemstone-rings/:slug` — Gemma & Grove product detail page (PDP)
- `/lustre` — Lustre brand landing page
- `/lustre/moissanite-rings` — Lustre moissanite catalog listing
- `/lustre/moissanite-rings/:slug` — Lustre product detail page (PDP)
- `*` — Branded 404 page with direct route recovery

---

## Verification & Automated Testing

The project includes an automated catalog validation script checking required product counts, unique IDs, slug routing consistency, field schemas, in-stock variants, image path resolution, and API contracts.

### Commands

```bash
# 1. Run catalog validation (tests all 36 products, 108 assets, schemas)
npm run validate:catalogs

# 2. Strict TypeScript type-check
npm run typecheck

# 3. ESLint verification
npm run lint

# 4. Production build
npm run build

# 5. Local development server
npm run dev
```

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

---

Built for Axe Consultancy And Security Services LLC — Frontend Developer Job Application Assignment.
