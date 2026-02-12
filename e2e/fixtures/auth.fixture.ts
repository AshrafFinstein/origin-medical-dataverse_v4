import { Page, test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AuthFixtures = {
  authenticatedPage: Page;
  loginPage: LoginPage;
};

/**
 * Extended Playwright test with authentication fixtures
 *
 * The authenticatedPage fixture uses the storage state from global setup
 * which contains the authenticated session from browser-based login.
 * No need to refresh tokens - the storage state is shared across all workers.
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Page is already authenticated via storageState from global setup
    // Just use the page as-is
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
