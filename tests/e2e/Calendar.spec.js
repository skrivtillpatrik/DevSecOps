import { test, expect } from '@playwright/test';

// Helper function to ensure user is logged in
async function ensureLoggedIn(page) {
  const timeout = process.env.CI ? 30000 : 10000;

  if (process.env.CI) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  try {
    console.log('Starting ensureLoggedIn...');
    await page.goto('http://localhost:3001', { timeout, waitUntil: 'networkidle' });
    console.log('Frontend page loaded, URL:', page.url());

    if (page.url().includes('/app')) {
      console.log('Already logged in, skipping login process');
      return;
    }

    console.log('Not logged in, proceeding with login...');
    await page.waitForSelector('h1:has-text("Välj användare")', { timeout });
    await page.waitForSelector('select[name="userSelect"]', { timeout });
    await page.waitForSelector('input[name="createUserName"]', { timeout });
    console.log('User select page loaded');

    const userOption = page.locator('select[name="userSelect"] option').filter({ hasText: 'e2etestUser' });
    const userCount = await userOption.count();
    console.log('Test user count:', userCount);

    if (userCount === 0) {
      console.log('Creating test user...');
      await page.locator('input[name="createUserName"]').fill('e2etestUser');
      await page.locator('button:has-text("Skapa")').click();
      await page.waitForSelector('select[name="userSelect"] option:has-text("e2etestUser")', { timeout });
      console.log('Test user created');
    }

    console.log('Selecting test user to log in...');
    await page.selectOption('select[name="userSelect"]', { label: 'e2etestUser' });
    await page.waitForURL('http://localhost:3001/app', { timeout });
    console.log('Login successful');
  } catch (error) {
    console.error('ensureLoggedIn failed:', error);
    throw new Error(`Login process failed: ${error.message}`);
  }
}

test.describe('Calendar', () => {
    test.beforeEach(async ({ page }) => {
        await ensureLoggedIn(page);
    });

    test('should display calendar page after login.', async ({ page }) => {
        await page.goto('http://localhost:3001/app');
        await page.waitForSelector('a[href="/app/calendar"]');
        await page.getByRole('link', { name: 'Kalender' }).click();
        await page.waitForURL('http://localhost:3001/app/calendar');
        await expect(page).toHaveURL('http://localhost:3001/app/calendar');
    });

    test("should create a new calendar event", async ({ page }) => {
        await page.goto('http://localhost:3001/app/calendar');

        // Wait for the create button to be available
        await page.waitForSelector('button[name="CreateEvent"]');
        await page.click('button[name="CreateEvent"]');

        // Wait for form to appear
        await page.waitForSelector('input[name="title"]');

        // Fill form
        await page.fill('input[name="title"]', "E2E Test Event");
        await page.fill('input[name="datestart"]', "2028-12-31T14:00");
        await page.fill('input[name="dateend"]', "2028-12-31T15:00");
        await page.fill('textarea[name="description"]', "This is a test event created during end-to-end testing.");

        // Submit
        await page.click('button[type="submit"]');

        // Wait for event to appear in the list
        await page.waitForSelector('.event-header strong:has-text("E2E Test Event")');
        await expect(page.locator('.event-header strong').filter({ hasText: "E2E Test Event" })).toHaveCount(1);
    });

    test("should update an existing calendar event", async ({ page }) => {
        await page.goto('http://localhost:3001/app/calendar');

        // First create an event to update
        await page.click('button[name="CreateEvent"]');
        await page.waitForSelector('input[name="title"]');
        await page.fill('input[name="title"]', "Event To Update");
        await page.fill('input[name="datestart"]', "2028-12-31T10:00");
        await page.fill('input[name="dateend"]', "2028-12-31T11:00");
        await page.click('button[type="submit"]');
        await page.waitForSelector('.event-header strong:has-text("Event To Update")');

        // Now update it - assuming there's an update button on the event
        const eventCard = page.locator('.event-card').filter({ hasText: 'Event To Update' });
        await eventCard.locator('button[name="EditEvent"]').click();

        await page.fill('input[name="title"]', "Event To Update - Updated");
        await page.click('button[type="submit"]');

        await expect(page.locator('.event-header strong').filter({ hasText: "Event To Update - Updated" })).toHaveCount(1);
    });

    test("should delete an existing calendar event", async ({ page }) => {
        await page.goto('http://localhost:3001/app/calendar');

        // First create an event to delete
        await page.click('button[name="CreateEvent"]');
        await page.waitForSelector('input[name="title"]');
        await page.fill('input[name="title"]', "Event To Delete");
        await page.fill('input[name="datestart"]', "2028-12-31T12:00");
        await page.fill('input[name="dateend"]', "2028-12-31T13:00");
        await page.click('button[type="submit"]');
        await page.waitForSelector('.event-header strong:has-text("Event To Delete")');

        // Delete it
        const eventCard = page.locator('.event-card').filter({ hasText: 'Event To Delete' });

        // Set up dialog handler before clicking delete
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('Ta bort detta event?');
            await dialog.accept();
        });

        await eventCard.locator('button[name="DeleteEvent"]').click();

        // Wait for event to be removed
        await expect(page.locator('.event-header strong').filter({ hasText: "Event To Delete" })).toHaveCount(0);
    });
});