import { Page } from '@playwright/test';

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

export async function clearStorage(page: Page) {
  await page.goto('/'); // Ensure we are on the origin before accessing localStorage
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());
}

export async function seedAuthState(page: Page) {
  await page.evaluate((user) => {
    localStorage.setItem('auth-store', JSON.stringify({
      state: {
        user: user,
        users: [user],
        _hasHydrated: true
      },
      version: 0
    }));
  }, TEST_USER);
}

export async function registerAndLoginViaUI(page: Page) {
  await page.goto('/login');
  
  // Register
  await page.getByRole('tab', { name: 'Sign Up' }).click();
  await page.getByPlaceholder('John Doe').fill(TEST_USER.name);
  await page.getByPlaceholder('john@example.com').fill(TEST_USER.email);
  await page.getByPlaceholder('••••••••').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'SIGN UP' }).click();
  
  await page.waitForSelector('text=Account created!');
  
  // Sign In
  await page.getByPlaceholder('name@example.com').fill(TEST_USER.email);
  await page.getByPlaceholder('••••••••').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'SIGN IN' }).click();
  
  await page.waitForURL('/');
}
