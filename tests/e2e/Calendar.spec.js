import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:3001/login');
    console.log('URL:', page.url());
    await page.fill('input[placeholder="Användarnamn"]', 'e2etestUser');
    await page.fill('input[placeholder="Lösenord"]', 'defaultPassword');
    await page.click('button[type="submit"]');
});


test.describe('Calendar', () => {
    test('should display calendar page after login.', async ({ page }) => {

        page.on('console', msg => console.log('BROWSER:', msg.text()));
        page.on('requestfailed', req => console.log('FAILED REQUEST:', req.url(), req.failure()));
        page.on('response', res => console.log('RESPONSE:', res.url(), res.status()));


        await page.goto('http://localhost:3001/app');

        await page.waitForTimeout(100);
        console.log('URL:', page.url());
        console.log(await page.getByRole('link', { name: 'Kalender' }).count());
        await page.getByRole('link', { name: 'Kalender' }).click();
        await page.waitForTimeout(100);
        await expect(page).toHaveURL('http://localhost:3001/app/calendar');
    });

    test("should create a new calendar event", async ({ page }) => {

        page.on('console', msg => console.log('BROWSER:', msg.text()));
        page.on('requestfailed', req => console.log('FAILED REQUEST:', req.url(), req.failure()));
        page.on('response', res => console.log('RESPONSE:', res.url(), res.status()));

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
        await page.click('button[name="EditEvent"]');
        await page.fill('input[name="title"]', "E2E Test Event Updated");
        await page.click('button[type="submit"]');
        await page.waitForTimeout(200);
        await expect(page.locator('.event-header').filter({ hasText: "E2E Test Event Updated" })).toHaveCount(1);
    });
    test("should delete an existing calendar event", async ({ page }) => {

        // Fånga confirm-dialogen
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Ta bort detta event?');
            await dialog.accept(); // klicka OK
        });

        await page.goto('http://localhost:3001/app/calendar')
        await page.click('button[name="DeleteEvent"]');
        await page.waitForTimeout(200);
        await expect(page.locator('.event').filter({ hasText: "E2E Test Event Updated" })).toHaveCount(0);
    });
});