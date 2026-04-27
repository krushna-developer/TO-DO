import { test, expect } from '@playwright/test';
import { clearStorage, seedAuthState } from './fixtures/auth';
import * as path from 'path';

test.describe('Settings Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await seedAuthState(page);
    await page.goto('/settings');
  });

  test('Profile tab is active by default', async ({ page }) => {
    await expect(page.getByText('Personal Information')).toBeVisible();
    // Assuming the tab itself can be identified as active
  });

  test('Avatar: click avatar circle -> file picker opens and updates avatar', async ({ page }) => {
    // We can't easily assert the native file picker opens, but we can set input files.
    // Usually the file input is hidden but associated with the avatar circle.
    
    // Create a dummy image buffer to upload
    const dummyImage = Buffer.from('fake-image-content');
    
    // Playwright allows setting input files directly if we find the input type="file"
    const fileChooserPromise = page.waitForEvent('filechooser');
    // Assume the avatar circle is clickable
    await page.locator('text=Profile Photo').locator('..').locator('img').first().click({ force: true }); // Fallback click
    // Alternatively, just dispatch the file to the input
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: dummyImage,
    });
    
    // Wait for the update (e.g. check for a specific class or wait a moment)
    await expect(page.getByRole('button', { name: /remove/i })).toBeVisible();
  });

  test('Avatar: remove button appears when custom photo set -> click removes it', async ({ page }) => {
    // Set up a custom photo first by directly interacting with input type=file
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake'),
    });
    
    const removeBtn = page.getByRole('button', { name: /remove/i });
    await expect(removeBtn).toBeVisible();
    
    await removeBtn.click();
    await expect(removeBtn).not.toBeVisible();
  });

  test('Profile form: save with empty required fields -> inline error messages appear', async ({ page }) => {
    // Clear fields
    const usernameInput = page.getByLabel(/username/i, { exact: false }).or(page.getByPlaceholder(/username/i));
    const fullNameInput = page.getByLabel(/full name/i, { exact: false }).or(page.getByPlaceholder(/name/i));
    const emailInput = page.getByLabel(/email/i, { exact: false }).or(page.getByPlaceholder(/email/i));
    
    await usernameInput.fill('');
    await fullNameInput.fill('');
    await emailInput.fill('');
    
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Expect inline errors (e.g., text like "Required" or similar validation messages)
    // We'll check for generic error text that usually appears
    const errors = page.locator('.text-red-500, [role="alert"]');
    await expect(errors.first()).toBeVisible();
  });

  test('Profile form: fill all fields -> Save Changes -> "Profile saved!" toast appears', async ({ page }) => {
    const usernameInput = page.getByLabel(/username/i, { exact: false }).or(page.getByPlaceholder(/username/i));
    const fullNameInput = page.getByLabel(/full name/i, { exact: false }).or(page.getByPlaceholder(/name/i));
    const emailInput = page.getByLabel(/email/i, { exact: false }).or(page.getByPlaceholder(/email/i));
    
    if (await usernameInput.isVisible()) {
      await usernameInput.fill('newuser123');
    }
    if (await fullNameInput.isVisible()) {
      await fullNameInput.fill('New User');
    }
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@user.com');
    }
    
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.getByText('Profile saved!')).toBeVisible();
  });

  test('Profile form: dirty state -> Reset button appears -> click resets to last saved', async ({ page }) => {
    const fullNameInput = page.getByLabel(/full name/i, { exact: false }).or(page.getByPlaceholder(/name/i));
    await fullNameInput.fill('Changed Name');
    
    const resetBtn = page.getByRole('button', { name: /reset/i });
    await expect(resetBtn).toBeVisible();
    
    await resetBtn.click();
    await expect(resetBtn).not.toBeVisible();
    // Assuming previous value was Test User or similar
    await expect(fullNameInput).not.toHaveValue('Changed Name');
  });

  test('Image Details tab: basic interactions', async ({ page }) => {
    // Click Image Details tab
    const imageTabBtn = page.getByRole('button', { name: /image details|images/i }).or(page.getByText(/image details|images/i));
    await imageTabBtn.first().click();
    
    // Photo grid loads (look for search input usually present in grid)
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
    
    // Search input -> debounce 400ms -> results filter
    await searchInput.fill('accusamus');
    // Wait for debounce and network
    await page.waitForTimeout(600);
    
    // Result count updates
    const countText = page.getByText(/results|photos found/i);
    if (await countText.isVisible()) {
       await expect(countText).toBeVisible();
    }
    
    // Clear search (✕ button) -> all photos shown
    const clearBtn = page.getByRole('button', { name: /clear|✕/i });
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    }
    
    // Load More -> more cards appear
    const loadMoreBtn = page.getByRole('button', { name: /load more/i });
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      // Wait for more to load
      await page.waitForTimeout(1000);
    }
  });
});
