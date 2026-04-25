import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001/login');
  await page.fill('input[placeholder="Användarnamn"]', 'e2etestUser');
  await page.fill('input[placeholder="Lösenord"]', 'defaultPassword');
  await page.click('button[type="submit"]');
});


test.describe('Calendar', () => {
    test('should display calendar page after login.', async ({ page }) => {
        await page.goto('http://localhost:3001/app');

        //await page.getByRole("link", { name: "Kalender" }).click();
        await page.waitForTimeout(100);
        await page.locator('a[href="/app/calendar"]').waitFor();
        await page.click('a[href="/app/calendar"]');
        await page.waitForTimeout(100);
        await expect(page).toHaveURL('http://localhost:3001/app/calendar');
    });
    test("should create a new calendar event", async ({ page }) => {
        await page.goto('http://localhost:3001/app/calendar')
        await page.click('button[name="CreateEvent"]');
        await page.fill('input[name="title"]', "E2E Test Event");
        await page.fill('input[name="datestart"]', "2028-12-31T14:00");
        await page.fill('input[name="dateend"]', "2028-12-31T15:00");
        await page.fill('textarea[name="description"]', "This is a test event created during end-to-end testing.");
        await page.click('button[type="submit"]');
        await page.waitForTimeout(200);
        await expect(page.locator('.event-header strong').filter({ hasText: "E2E Test Event" })).toHaveCount(1);
    });
    test("should update an existing calendar event", async ({ page }) => {
        await page.goto('http://localhost:3001/app/calendar')
        await page.getByRole("button", { name: "Redigera" }).first().click();
        await page.fill('input[name="title"]', "E2E Test Event Updated");
        await page.click('button[type="submit"]');
        await page.waitForTimeout(200);
        await expect(page.locator('.event').filter({ hasText: "E2E Test Event Updated" })).toHaveCount(1);
    });
    test("should delete an existing calendar event", async ({ page }) => {
        await page.goto('http://localhost:3001/app/calendar')
        await page.getByRole("button", { name: "Ta bort" }).first().click();
        await page.waitForTimeout(200);
        await expect(page.locator('.event').filter({ hasText: "E2E Test Event Updated" })).toHaveCount(0);
    });
});