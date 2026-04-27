import { test, expect } from '@playwright/test';
import { clearStorage, TEST_USER, registerAndLoginViaUI, seedAuthState } from './fixtures/auth';

test.describe('Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test('Page loads at /login by default when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Sign Up and Sign In flow', async ({ page }) => {
    await page.goto('/login');
    
    // Sign Up tab: click SIGN UP overlay button (it's the second SIGN UP button in DOM)
    await page.locator('button', { hasText: /^SIGN UP$/ }).nth(1).click();
    await page.getByPlaceholder('Name').fill(TEST_USER.name);
    await page.locator('input[placeholder="Email"]').nth(1).fill(TEST_USER.email);
    await page.locator('input[placeholder="Password"]').nth(1).fill(TEST_USER.password);
    
    // Submit button is the first SIGN UP button in DOM
    await page.locator('button', { hasText: /^SIGN UP$/ }).nth(0).click();
    
    // toast "Account created!" appears -> panel slides to Sign In
    await expect(page.getByText('Account created!')).toBeVisible();
    
    // Sign In: fill registered email + password -> click SIGN IN (first in DOM)
    await page.locator('input[placeholder="Email"]').nth(0).fill(TEST_USER.email);
    await page.locator('input[placeholder="Password"]').nth(0).fill(TEST_USER.password);
    await page.locator('button', { hasText: /^SIGN IN$/ }).nth(0).click();
    
    // redirects to /
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('Sign In with wrong credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('input[placeholder="Email"]').nth(0).fill('wrong@example.com');
    await page.locator('input[placeholder="Password"]').nth(0).fill('wrongpassword');
    await page.locator('button', { hasText: /^SIGN IN$/ }).nth(0).click();
    
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('Sign Up with empty fields', async ({ page }) => {
    await page.goto('/login');
    
    // Click overlay SIGN UP
    await page.locator('button', { hasText: /^SIGN UP$/ }).nth(1).click();
    // Click submit SIGN UP
    await page.locator('button', { hasText: /^SIGN UP$/ }).nth(0).click();
    
    await expect(page.getByText('Please fill in all fields')).toBeVisible();
  });

  test('On page reload when logged in -> does NOT redirect to login (no blink)', async ({ page }) => {
    // Seed auth state
    await page.goto('/login'); // go to a page to initialize storage context
    await seedAuthState(page);
    
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Reload
    await page.reload();
    await expect(page).toHaveURL('http://localhost:3000/');
    // We expect it to not show the login page
    await expect(page.getByRole('button', { name: 'SIGN IN' })).not.toBeVisible();
  });
});