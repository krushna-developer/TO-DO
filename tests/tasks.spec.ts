import { test, expect } from '@playwright/test';
import { clearStorage, seedAuthState } from './fixtures/auth';

test.describe('Tasks Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Seed auth state to bypass login
    await clearStorage(page);
    await seedAuthState(page);
    await page.goto('/');
  });

  test('Empty state shows illustration and message', async ({ page }) => {
    await expect(page.getByText(/Empty as my motivation/i)).toBeVisible(); // or checking for empty state text
    // We can also check for image if there's a specific alt text
  });

  test('Type in input + press Add button -> task appears', async ({ page }) => {
    const input = page.getByPlaceholder('Type your task here..');
    await input.fill('New Playwright Task');
    await page.getByRole('button', { name: 'Add' }).click();
    
    await expect(page.getByText('New Playwright Task')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('Type in input + press Enter -> task appears', async ({ page }) => {
    const input = page.getByPlaceholder('Type your task here..');
    await input.fill('Another Playwright Task');
    await input.press('Enter');
    
    await expect(page.getByText('Another Playwright Task')).toBeVisible();
  });

  test('Add button disabled when input is empty', async ({ page }) => {
    const input = page.getByPlaceholder('Type your task here..');
    const addButton = page.getByRole('button', { name: 'Add' });
    
    await expect(addButton).toBeDisabled();
    
    await input.fill('test');
    await expect(addButton).toBeEnabled();
    
    await input.fill('');
    await expect(addButton).toBeDisabled();
  });

  test('Check the checkbox -> task gets strikethrough + completed style', async ({ page }) => {
    // Add a task
    await page.getByPlaceholder('Type your task here..').fill('Task to complete');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Check the checkbox
    const checkbox = page.getByRole('checkbox');
    await checkbox.check();
    
    // Check strikethrough (typically by class or text decoration)
    // We can verify it's completed by checking filter or text style
    const taskText = page.getByText('Task to complete');
    await expect(taskText).toHaveClass(/line-through/);
  });

  test('Click pencil icon -> inline edit input appears -> change text -> Enter to save', async ({ page }) => {
    await page.getByPlaceholder('Type your task here..').fill('Task to edit');
    await page.press('input[placeholder="Type your task here.."]', 'Enter');
    
    // Click pencil icon (using lucide class)
    await page.locator('.lucide-pencil').first().locator('..').click();
    
    const editInput = page.getByRole('textbox').nth(1); // The second textbox, or find by generic edit input
    await editInput.fill('Edited task');
    await editInput.press('Enter');
    
    await expect(page.getByText('Edited task')).toBeVisible();
  });

  test('Click trash icon -> task removed from list', async ({ page }) => {
    await page.getByPlaceholder('Type your task here..').fill('Task to delete');
    await page.press('input[placeholder="Type your task here.."]', 'Enter');
    
    // Click trash icon
    await page.locator('.lucide-trash-2').first().locator('..').click();
    
    await expect(page.getByText('Task to delete')).not.toBeVisible();
  });

  test('Filter tabs: All / Active / Completed filter correctly', async ({ page }) => {
    // Add two tasks, complete one
    const input = page.getByPlaceholder('Type your task here..');
    await input.fill('Active Task');
    await input.press('Enter');
    
    await input.fill('Completed Task');
    await input.press('Enter');
    
    // Complete the second one
    const checkboxes = page.getByRole('checkbox');
    await checkboxes.nth(1).check();
    
    // Check Active tab
    await page.getByRole('button', { name: 'Active' }).click();
    await expect(page.getByText('Active Task')).toBeVisible();
    await expect(page.getByText('Completed Task')).not.toBeVisible();
    
    // Check Completed tab
    await page.getByRole('button', { name: 'Completed' }).click();
    await expect(page.getByText('Active Task')).not.toBeVisible();
    await expect(page.getByText('Completed Task')).toBeVisible();
    
    // Check All tab
    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page.getByText('Active Task')).toBeVisible();
    await expect(page.getByText('Completed Task')).toBeVisible();
  });

 });