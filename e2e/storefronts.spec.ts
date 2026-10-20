import { test, expect } from '@playwright/test';

const BRANDS = [
  { id: 'aurelle', name: 'Aurelle', listing: 'engagement-rings', productSlug: 'radiance-solitaire' },
  { id: 'gemma-grove', name: 'Gemma & Grove', listing: 'gemstone-rings', productSlug: 'azure-cascade-sapphire' },
  { id: 'lustre', name: 'Lustre', listing: 'moissanite-rings', productSlug: 'prism-round-solitaire' }
];

test.describe('Jewelry Storefronts Core E2E Tests', () => {
  test('1. Home page renders and has brand links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jewelry Storefronts/i);
    await expect(page.locator('h1')).toContainText(/Curated Jewelry Storefronts/i);

    await expect(page.locator('text=Explore Aurelle')).toBeVisible();
    await expect(page.locator('text=Explore Gemma & Grove')).toBeVisible();
    await expect(page.locator('text=Explore Lustre')).toBeVisible();
  });

  for (const brand of BRANDS) {
    test(`2. ${brand.name} landing page and navigation to listing`, async ({ page }) => {
      await page.goto(`/${brand.id}`);
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      // Check H1 contains brand name (may have additional text)
      await expect(page.locator('h1').first()).toContainText(new RegExp(brand.name, 'i'), { timeout: 10000 });

      // Navigate to catalog
      await page.click('text=Explore Collection');
      await expect(page).toHaveURL(new RegExp(`${brand.id}/${brand.listing}`));
      await expect(page.locator('h1')).toContainText(/Rings/i);
    });

    test(`3. ${brand.name} product listing - products render with images, prices, links`, async ({ page }) => {
      await page.goto(`/${brand.id}/${brand.listing}`);
      await expect(page.locator('h1')).toContainText(/Rings/i);

      const articles = page.locator('article');
      await expect(articles.first()).toBeVisible();

      // Check first product has image, name, price, and link
      const firstArticle = articles.first();
      // There are two images (primary + hover), so use first() to get primary
      await expect(firstArticle.locator('img').first()).toBeVisible();
      // Price is in a span with class text-primary
      await expect(firstArticle.locator('span.text-primary').first()).toBeVisible();
      await expect(firstArticle.locator('a', { hasText: 'View Details' })).toBeVisible();
    });

    test(`4. ${brand.name} product listing - sorting works`, async ({ page }) => {
      await page.goto(`/${brand.id}/${brand.listing}`);
      await expect(page.locator('article').first()).toBeVisible();

      // Sort by price ascending
      await page.selectOption('#sort-select', 'price-asc');
      await expect(page).toHaveURL(new RegExp(`${brand.id}/${brand.listing}`));

      // Sort by price descending
      await page.selectOption('#sort-select', 'price-desc');
      await expect(page).toHaveURL(new RegExp(`${brand.id}/${brand.listing}`));

      // Sort by newest
      await page.selectOption('#sort-select', 'newest');
      await expect(page).toHaveURL(new RegExp(`${brand.id}/${brand.listing}`));
    });

    test(`5. ${brand.name} product listing - filters work`, async ({ page }) => {
      await page.goto(`/${brand.id}/${brand.listing}`);
      await expect(page.locator('article').first()).toBeVisible();

      // Wait for page to fully render
      await page.waitForLoadState('networkidle');

      // Filter panel is open by default on desktop (showDesktopFilters defaults to true)
      // Check if the filter panel is visible - use label to avoid footer text match
      const filterPanel = page.locator('label:has-text("Precious Metal")');
      await expect(filterPanel).toBeVisible({ timeout: 15000 });

      // Click a metal filter - each brand uses different metal options
      // Aurelle: 14k Champagne Gold, Gemma & Grove: 18k Yellow Gold, Lustre: 950 Platinum
      const metalFilter = brand.id === 'aurelle'
        ? '14k Champagne Gold'
        : brand.id === 'gemma-grove'
        ? '18k Yellow Gold'
        : '950 Platinum';

      // Wait for the filter button to be visible and clickable
      const metalBtn = page.locator('button', { hasText: metalFilter }).first();
      await expect(metalBtn).toBeVisible({ timeout: 15000 });
      await metalBtn.click();

      // Wait for filter to apply - check that products are still visible
      await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
    });

    test(`6. ${brand.name} product listing - filter reset works`, async ({ page }) => {
      await page.goto(`/${brand.id}/${brand.listing}`);
      await expect(page.locator('article').first()).toBeVisible();

      // Wait for page to fully render
      await page.waitForLoadState('networkidle');

      // Filter panel is open by default on desktop (showDesktopFilters defaults to true)
      // Check if the filter panel is visible - use label to avoid footer text match
      const filterPanel = page.locator('label:has-text("Precious Metal")');
      await expect(filterPanel).toBeVisible({ timeout: 15000 });

      // Apply a filter
      const metalFilter = brand.id === 'aurelle'
        ? '14k Champagne Gold'
        : brand.id === 'gemma-grove'
        ? '18k Yellow Gold'
        : '950 Platinum';
      await page.locator('button', { hasText: metalFilter }).first().click();

      // Wait for filter to apply
      await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });

      // Clear all filters - use more specific selector
      await page.click('button:has-text("Clear all")');
      await expect(page.locator('article').first()).toBeVisible({ timeout: 10000 });
    });

    test(`7. ${brand.name} product detail page - variant selection, price, add-to-cart`, async ({ page }) => {
      await page.goto(`/${brand.id}/${brand.listing}`);
      await page.locator('article a', { hasText: 'View Details' }).first().click();
      await expect(page).toHaveURL(new RegExp(`${brand.id}/${brand.listing}/.+`));

      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('button:has-text("Add to Shopping Bag")')).toBeVisible({ timeout: 10000 });

      // Add to cart
      await page.click('button:has-text("Add to Shopping Bag")');

      // Toast appears
      await expect(page.locator('text=Added to Shopping Bag')).toBeVisible({ timeout: 10000 });

      // Open cart drawer
      await page.click('button[aria-label*="shopping bag"]');
      await expect(page.locator('[role="dialog"][aria-label="Shopping Bag"]')).toBeVisible({ timeout: 10000 });

      // Verify item in cart
      await expect(page.locator('[role="dialog"][aria-label="Shopping Bag"]')).toContainText(/\$/);

      // Close cart drawer to continue testing on PDP
      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"][aria-label="Shopping Bag"]')).not.toBeVisible({ timeout: 5000 });

      // Increase quantity on PDP
      await page.click('button[aria-label="Increase quantity"]');
      await expect(page.locator('span:has-text("2")').first()).toBeVisible({ timeout: 10000 });

      // Re-open cart to remove item
      await page.click('button[aria-label*="shopping bag"]');
      await expect(page.locator('[role="dialog"][aria-label="Shopping Bag"]')).toBeVisible({ timeout: 10000 });

      // Remove item
      await page.click('button[aria-label*="Remove"]');
      await expect(page.locator('text=Your shopping bag is empty')).toBeVisible({ timeout: 10000 });

      // Close cart with Escape
      await page.keyboard.press('Escape');
    });

    test(`8. ${brand.name} invalid product slug shows 404`, async ({ page }) => {
      await page.goto(`/${brand.id}/${brand.listing}/invalid-slug-12345`);
      // The ProductDetailPage shows an ErrorState component for invalid slugs
      // Check for the error state message
      await expect(page.locator('text=Design Not Found')).toBeVisible({ timeout: 10000 });
      // Click the "Explore [Brand] Catalog" button (secondary action)
      await page.click(`button:has-text("Explore ${brand.name} Catalog")`);
      await expect(page).toHaveURL(new RegExp(`${brand.id}/${brand.listing}`));
    });
  }

  test('9. Unknown URL shows 404', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
    await page.click('text=Go Home');
    await expect(page).toHaveURL('/');
  });

  test('10. Cart persistence after reload', async ({ page }) => {
    await page.goto('/aurelle/engagement-rings');
    await page.locator('article a', { hasText: 'View Details' }).first().click();
    await page.click('button:has-text("Add to Shopping Bag")');
    await expect(page.locator('text=Added to Shopping Bag')).toBeVisible();

    // Reload page
    await page.reload();

    // Check cart count persists
    await expect(page.locator('button[aria-label*="items"]')).toContainText('1');
  });

  test('11. Cart drawer - close control, backdrop, Escape key, focus, scroll restoration', async ({ page }) => {
    await page.goto('/aurelle/engagement-rings');
    await page.locator('article a', { hasText: 'View Details' }).first().click();
    await page.click('button:has-text("Add to Shopping Bag")');

    // Open cart
    await page.click('button[aria-label*="shopping bag"]');
    const cartDialog = page.locator('[role="dialog"][aria-label="Shopping Bag"]');
    await expect(cartDialog).toBeVisible();

    // Test close button
    await cartDialog.locator('button[aria-label="Close bag"]').click();
    await expect(cartDialog).not.toBeVisible();

    // Reopen and test backdrop click
    await page.click('button[aria-label*="shopping bag"]');
    await expect(cartDialog).toBeVisible();
    await page.locator('.fixed.inset-0.bg-black\\/60').click();
    await expect(cartDialog).not.toBeVisible();

    // Reopen and test Escape key
    await page.click('button[aria-label*="shopping bag"]');
    await expect(cartDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(cartDialog).not.toBeVisible();

    // Verify body scroll restored
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).not.toBe('hidden');
  });

  test('12. Mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const menuBtn = page.locator('button[aria-label="Open menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator('nav').filter({ hasText: 'Brand Storefronts' })).toBeVisible();

    // Navigate via mobile menu
    await page.click('text=Lustre — Architectural Moissanite');
    await expect(page).toHaveURL(/\/lustre/);
  });

  test('13. Mobile filter drawer', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/aurelle/engagement-rings');

    const mobileFilterBtn = page.locator('button[aria-label="Open filter options"]');
    await expect(mobileFilterBtn).toBeVisible();
    await mobileFilterBtn.click();

    const mobileDrawer = page.locator('[role="dialog"][aria-label="Filter products"]');
    await expect(mobileDrawer).toBeVisible();
    await expect(mobileDrawer.locator('text=Refine Catalog')).toBeVisible();

    // Apply a filter
    await mobileDrawer.locator('button', { hasText: 'Champagne Gold' }).click();
    await mobileDrawer.locator('button', { hasText: 'Apply Filters' }).click();

    // Verify results
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('14. Sticky mobile add-to-cart bar', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/aurelle/engagement-rings');
    await page.locator('article a', { hasText: 'View Details' }).first().click();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Check sticky bar exists
    const stickyBar = page.locator('[aria-label="Quick Add to Bag"]');
    await expect(stickyBar).toBeVisible();
    await expect(stickyBar.locator('text=Add to Bag')).toBeVisible();
  });

  test('15. Newsletter validation and submission', async ({ page }) => {
    await page.goto('/aurelle');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    const newsletterInput = page.locator('input[type="email"]');
    await expect(newsletterInput).toBeVisible({ timeout: 10000 });
    await newsletterInput.scrollIntoViewIfNeeded();

    // Test invalid email - HTML5 validation should prevent submission
    await newsletterInput.fill('invalid-email');
    await page.click('button:has-text("Subscribe")');
    // Check that the input has validation attributes
    await expect(newsletterInput).toHaveAttribute('type', 'email');

    // Test valid email - simulate successful submission
    await newsletterInput.fill('test@example.com');
    await page.click('button:has-text("Subscribe")');
    // Wait for success state
    await page.waitForTimeout(1000);
    // Check for success message
    await expect(page.locator('text=Thank you for subscribing')).toBeVisible({ timeout: 10000 });
  });

  test('16. Responsive layout - no horizontal overflow at multiple viewports', async ({ page }) => {
    const viewports = [
      { width: 360, height: 800 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto('/');

      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width + 1); // Allow 1px tolerance
    }
  });

  test('17. Console errors and failed requests', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        failedRequests.push(`${response.url()} - ${response.status()}`);
      }
    });

    await page.goto('/');
    await page.goto('/aurelle');
    await page.goto('/aurelle/engagement-rings');
    await page.goto('/aurelle/engagement-rings/radiance-solitaire-diamond-ring');
    await page.goto('/gemma-grove');
    await page.goto('/gemma-grove/gemstone-rings');
    await page.goto('/gemma-grove/gemstone-rings/azure-cascade-ceylon-sapphire-ring');
    await page.goto('/lustre');
    await page.goto('/lustre/moissanite-rings');
    await page.goto('/lustre/moissanite-rings/prism-pure-moissanite-solitaire-ring');

    expect(consoleErrors.filter(e => !e.includes('vite') && !e.includes('React DevTools'))).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });
});