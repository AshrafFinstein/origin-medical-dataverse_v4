import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TestData } from '../test-data/test-data';

type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Authentication fixture that handles:
 * - Auth0 login with CAPTCHA bypass
 * - Session persistence
 * - Auto-retry on auth failures
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    // Navigate to the application
    await page.goto(TestData.urls.homePage);

    // Check if we're redirected to Auth0 login
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();

    if (currentUrl.includes('auth0.com') || currentUrl.includes('/login')) {
      console.log('🔓 Not authenticated - logging in...');

      // Perform login (this handles Auth0 CAPTCHA)
      await loginPage.loginWithAuth0(
        TestData.validCredentials.email,
        TestData.validCredentials.password
      );

      // Wait for redirect back to application
      await page.waitForURL(/dataverse|dashboard|\/$/, { timeout: 30000 });
      await page.waitForLoadState('networkidle');

      // Give Auth0 time to establish session
      await page.waitForTimeout(2000);

      console.log('✅ Login successful');
    } else {
      console.log('✅ Already authenticated');
    }

    // Use the authenticated page
    await use(page);
  },
});

export { expect } from '@playwright/test';
