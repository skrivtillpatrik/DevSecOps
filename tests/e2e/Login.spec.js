import { test, expect } from '@playwright/test';


// test.beforeEach(async () => {
//     // Reset the test database before each test
//     // This ensures a consistent state for each test run
//     resetTestDB();
// }
// );
test.describe('Login', () => {
    test('should log in successfully with valid credentials', async ({ page, browserName }) => {
        const testUserName = `e2eTestUser${browserName}`;
        await page.goto('http://localhost:3001');
        await page.fill('input[name="createUserName"]', testUserName);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('http://localhost:3001/');
        await expect(page.locator('select[name="userSelect"] option').filter({ hasText: testUserName })
        ).toHaveCount(1);

        await page.getByRole("button", { name: "Logga in" }).click();
        await page.waitForTimeout(100);
        await expect(page).toHaveURL('http://localhost:3001/login');
        await page.fill('input[placeholder="Användarnamn"]', testUserName);
        await page.fill('input[placeholder="Lösenord"]', 'defaultPassword');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(200);
        await expect(page).toHaveURL('http://localhost:3001/app');

    });
});
