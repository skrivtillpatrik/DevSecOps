import { test, expect } from '@playwright/test';

test.describe('Login', () => {
    test('should log in successfully with valid credentials', async ({ page }) => {
        // Use the same user created in global setup
        const testUserName = 'e2etestUser';

        // Small delay to let servers stabilize in CI
        if (process.env.CI) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Increase timeout for CI
        const timeout = process.env.CI ? 30000 : 10000;

        await page.goto('http://localhost:3001', { timeout, waitUntil: 'domcontentloaded' });

        // Wait for the page to load and user select to be available
        await page.waitForSelector('h1:has-text("Välj användare")', { timeout });
        await page.waitForSelector('select[name="userSelect"]', { timeout });
        await page.waitForSelector('input[name="createUserName"]', { timeout });

        // Check if user already exists in the select
        const userOption = page.locator('select[name="userSelect"] option').filter({ hasText: testUserName });
        const userExists = await userOption.count() > 0;

        if (!userExists) {
            // Create user if not exists
            await page.locator('input[name="createUserName"]').fill(testUserName);
            await page.locator('button:has-text("Skapa")').click();

            // Wait for user to appear in select
            await page.waitForSelector('select[name="userSelect"] option:has-text("e2etestUser")', { timeout });
        }

        // Select the test user to log in
        await page.selectOption('select[name="userSelect"]', { label: testUserName });
        await page.waitForURL('http://localhost:3001/app', { timeout });
        await expect(page).toHaveURL('http://localhost:3001/app');
    });
});
