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
        await page.waitForSelector('select[name="userSelect"]', { timeout });

        // Check if user already exists in the select
        const userOption = page.locator('select[name="userSelect"] option').filter({ hasText: testUserName });
        const userExists = await userOption.count() > 0;

        if (!userExists) {
            // Create user if not exists
            await page.fill('input[name="createUserName"]', testUserName);
            await page.click('button[type="submit"]');

            // Wait for user to appear in select
            await expect(page.locator('select[name="userSelect"] option').filter({ hasText: testUserName })).toHaveCount(1);
        }

        // Click login button
        await page.getByRole("button", { name: "Logga in" }).click();

        // Wait for login page
        await page.waitForURL('http://localhost:3001/login', { timeout });

        // Fill login form
        await page.fill('input[placeholder="Användarnamn"]', testUserName);
        await page.fill('input[placeholder="Lösenord"]', 'defaultPassword');
        await page.click('button[type="submit"]');

        // Wait for successful login - check for app URL
        await page.waitForURL('http://localhost:3001/app', { timeout });
        await expect(page).toHaveURL('http://localhost:3001/app');
    });
});
