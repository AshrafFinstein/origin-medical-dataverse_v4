import { Page, test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Auth fixture — page is already authenticated via storageState
 * from the auth-setup project (OAuth Code Flow, no browser).
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await use(page);
  },
});

export { expect } from '@playwright/test';
