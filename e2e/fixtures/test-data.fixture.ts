import { test as base, Page } from '@playwright/test';
import { TestData } from '../test-data/test-data';

/**
 * Test Data Fixture
 * Ensures Epic and Project exist before each test
 * Automatically creates them if missing
 */

type TestDataFixtures = {
  testDataPage: Page;
  epicId: string;
  projectId: string;
};

export const test = base.extend<TestDataFixtures>({
  /**
   * Page with guaranteed test data (Epic + Project)
   */
  testDataPage: async ({ page }, use) => {
    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    // Check if Epic exists
    const epicExists = await page.locator('[data-testid="epic-go-button-0"]').count() > 0;

    if (!epicExists) {
      console.log('⚠️  No Epic found - creating one for test...');

      // Create Epic
      await page.locator('[data-testid="epic-create-button"]').click();
      await page.waitForSelector('[data-testid="epic-create-modal"]', { state: 'visible' });

      await page.locator('[data-testid="epic-create-name-input"]').fill(`E2E Test Epic - ${Date.now()}`);
      await page.locator('[data-testid="epic-create-description-input"]').fill('Epic for E2E testing');

      await page.locator('[data-testid="epic-create-submit-button"]').click();
      await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle');
    }

    // Navigate to Epic page
    await page.locator('[data-testid="epic-go-button-0"]').click();
    await page.waitForLoadState('networkidle');

    // Check if Project exists
    const projectExists = await page.locator('[data-testid="project-go-button-0"]').count() > 0;

    if (!projectExists) {
      console.log('⚠️  No Project found - creating one for test...');

      // Create Project
      await page.locator('[data-testid="project-create-button"]').click();
      await page.waitForSelector('[data-testid="project-create-modal"]', { state: 'visible' });

      await page.locator('[data-testid="project-create-name-input"]').fill(`E2E Test Project - ${Date.now()}`);
      await page.locator('[data-testid="project-create-description-input"]').fill('Project for E2E testing');

      await page.locator('[data-testid="project-create-submit-button"]').click();
      await page.waitForSelector('.n-message--success-type', { timeout: 10000 });
      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle');
    }

    // Navigate back to home for tests to start from a clean state
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    await use(page);
  },

  /**
   * Epic ID for tests that need it
   */
  epicId: async ({ page }, use) => {
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    // Get epic ID from URL after clicking go button
    const epicGoButton = page.locator('[data-testid="epic-go-button-0"]');
    await epicGoButton.click();
    await page.waitForLoadState('networkidle');

    const url = page.url();
    const epicId = url.split('/epic/')[1];

    // Navigate back to home
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    await use(epicId);
  },

  /**
   * Project ID for tests that need it
   */
  projectId: async ({ page }, use) => {
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    // Navigate to epic
    await page.locator('[data-testid="epic-go-button-0"]').click();
    await page.waitForLoadState('networkidle');

    // Navigate to project
    await page.locator('[data-testid="project-go-button-0"]').click();
    await page.waitForLoadState('networkidle');

    const url = page.url();
    const projectId = url.split('/project/')[1];

    // Navigate back to home
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    await use(projectId);
  },
});

export { expect } from '@playwright/test';
