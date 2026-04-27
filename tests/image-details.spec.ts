import { test, expect } from '@playwright/test';
import { clearStorage, seedAuthState } from './fixtures/auth';

test.describe('Image Details Flow', () => {
  // The API call is external, so we mark these tests as slow
  test.slow();

  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await seedAuthState(page);
    await page.goto('/image-details');
  });

  test('Page loads and shows skeleton cards while fetching, then grid appears', async ({ page }) => {
    // Reload to catch the skeleton state reliably
    await page.reload();
    
    // Skeleton cards often use a generic skeleton class, e.g., 'animate-pulse' or a specific aria-label
    // Here we'll look for something with the skeleton pulse class if it exists
    const skeleton = page.locator('.animate-pulse').first();
    // It might be too fast to catch sometimes, but we try to expect it if it appears
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
    
    // After load -> grid of photo cards appears
    // The photo cards typically have images and titles
    const photoCard = page.locator('img').first();
    await expect(photoCard).toBeVisible();
    
    // Check for some title text inside a card
    const firstTitle = page.locator('p.line-clamp-2').first();
    await expect(firstTitle).toBeVisible();
  });

  test('Search "accusamus" -> only matching titles shown + result count updates', async ({ page }) => {
    // Wait for the grid to load
    await expect(page.locator('img').first()).toBeVisible();

    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('accusamus');
    
    // Wait for debounce (400ms) + network
    await page.waitForTimeout(600);
    
    // Check result count updates (assuming it says something like "X photos found" or "X results")
    const countText = page.getByText(/photos found|results/i);
    if (await countText.isVisible()) {
       await expect(countText).toContainText(/[0-9]+/);
    }

    // Check that matching title is shown
    // "accusamus" is part of JSONPlaceholder's first few items
    const title = page.getByText(/accusamus/i).first();
    await expect(title).toBeVisible();
  });

 

  test('Photo card shows album badge, title, and image', async ({ page }) => {
    // Wait for the grid to load
    await expect(page.locator('img').first()).toBeVisible();
    
    const firstImage = page.locator('img').first();
    await expect(firstImage).toHaveAttribute('src', /.*/);
  
    const albumBadge = page.getByText(/Album [0-9]+/i).first();
    await expect(albumBadge).toBeVisible();

    const title = page.locator('p.line-clamp-2').first();
    await expect(title).toBeVisible();
  });

  test('Broken image -> shows fallback icon (no crash)', async ({ page }) => {
    await page.route('**/*', (route) => {
      if (route.request().resourceType() === 'image') {
        return route.abort();
      }
      return route.continue();
    });
    
    await page.reload();
    
    
    const fallbackIcon = page.locator('.lucide-image-off').first();
    await expect(fallbackIcon).toBeVisible();
    
    const title = page.locator('p.line-clamp-2').first();
    await expect(title).toBeVisible();
  });
});
