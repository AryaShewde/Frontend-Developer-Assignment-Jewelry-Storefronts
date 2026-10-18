import { test, expect } from '@playwright/test';

test.describe('Jewelry Storefronts Core E2E Tests', () => {
  test('1. Home page renders and has brand links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jewelry Storefronts/i);
    await expect(page.locator('h1')).toContainText(/Curated Jewelry Storefronts/i);

    await expect(page.locator('text=Explore Aurelle')).toBeVisible();
    await expect(page.locator('text=Explore Gemma & Grove')).toBeVisible();
    await expect(page.locator('text=Explore Lustre')).toBeVisible();
  });

  test('2. Aurelle landing page and navigation to listing', async ({ page }) => {
    await page.goto('/aurelle');
    await expect(page.locator('h1')).toContainText(/Aurelle/i);

    // Navigate to catalog
    await page.click('text=Explore Collection');
    await expect(page).toHaveURL(/\/aurelle\/engagement-rings/);
    await expect(page.locator('h1')).toContainText(/Engagement Rings/i);
  });

  test('3. Product listing view', async ({ page }) => {
    await page.goto('/aurelle/engagement-rings');
    await expect(page.locator('h1')).toContainText(/Engagement Rings/i);

    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
  });

  test('4. Product Detail Page view', async ({ page }) => {
    await page.goto('/aurelle/engagement-rings');
    await page.locator('article a', { hasText: 'View Details' }).first().click();
    await expect(page).toHaveURL(/\/aurelle\/engagement-rings\/.+/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Add to Shopping Bag")')).toBeVisible();
  });

  test('5. 404 page recovery', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
    await page.click('text=Go Home');
    await expect(page).toHaveURL('/');
  });

  test('6. Mobile responsive checks', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const menuBtn = page.locator('button[aria-label="Open menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    await expect(page.locator('nav').filter({ hasText: 'Brand Storefronts' })).toBeVisible();

    await page.click('text=Lustre — Architectural Moissanite');
    await expect(page).toHaveURL(/\/lustre/);
  });
});
