import { test, expect } from '@playwright/test';

test.describe('Login', () => {
    test('should log in successfully with valid credentials', async ({ page }) => {
        // Use the same user created in global setup
        const testUserName = 'e2etestUser';

        await page.goto('http://localhost:3001');

        // Wait for the page to load and user select to be available
        await page.waitForSelector('select[name="userSelect"]');

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
        await expect(page).toHaveURL('http://localhost:3001/login');

        // Fill login form
        await page.fill('input[placeholder="Användarnamn"]', testUserName);
        await page.fill('input[placeholder="Lösenord"]', 'defaultPassword');
        await page.click('button[type="submit"]');

        // Wait for successful login - check for app URL
        await page.waitForURL('http://localhost:3001/app');
        await expect(page).toHaveURL('http://localhost:3001/app');
    });
});
