import { test, expect } from '../../fixtures/test-data.fixture';
import { SessionPage } from '../../pages/session.page';
import { TestData } from '../../test-data/test-data';

/**
 * Example Test Using Test Data Fixture
 *
 * This demonstrates how to use the test-data.fixture.ts
 * to ensure Epic and Project exist before tests run.
 */

test.describe('Example: Using Test Data Fixture', () => {
  test('should have Epic and Project available', async ({ testDataPage }) => {
    // testDataPage has Epic + Project guaranteed to exist
    // Page is at home, ready for navigation

    // Verify Epic button exists
    const epicButton = testDataPage.locator('[data-testid="epic-go-button-0"]');
    await expect(epicButton).toBeVisible();

    console.log('✅ Epic exists and is visible');
  });

  test('should navigate to session page successfully', async ({ testDataPage }) => {
    const sessionPage = new SessionPage(testDataPage);

    // Navigate from Home → Epic → Project
    await sessionPage.navigateToModule();

    // Verify we're on session page
    const sessionTable = testDataPage.locator('[data-testid="session-table"]');
    await expect(sessionTable).toBeVisible();

    const createButton = testDataPage.locator('[data-testid="session-create-button"]');
    await expect(createButton).toBeVisible();

    console.log('✅ Successfully navigated to session page');
  });

  test('should provide epic ID', async ({ testDataPage, epicId }) => {
    console.log('Epic ID from fixture:', epicId);
    expect(epicId).toBeTruthy();
    expect(epicId).toMatch(/^[a-f0-9-]+$/); // UUID format

    // Can use epicId to navigate directly
    await testDataPage.goto(`/epic/${epicId}`);
    await testDataPage.waitForLoadState('networkidle');

    // Should see project button
    const projectButton = testDataPage.locator('[data-testid="project-go-button-0"]');
    await expect(projectButton).toBeVisible();

    console.log('✅ Epic ID works for direct navigation');
  });

  test('should provide project ID', async ({ testDataPage, projectId }) => {
    console.log('Project ID from fixture:', projectId);
    expect(projectId).toBeTruthy();
    expect(projectId).toMatch(/^[a-f0-9-]+$/); // UUID format

    // Can use projectId to navigate directly
    await testDataPage.goto(`/project/${projectId}`);
    await testDataPage.waitForLoadState('networkidle');

    // Should see session elements
    const sessionTable = testDataPage.locator('[data-testid="session-table"]');
    await expect(sessionTable).toBeVisible();

    console.log('✅ Project ID works for direct navigation');
  });

  test('should verify session page elements', async ({ testDataPage }) => {
    const sessionPage = new SessionPage(testDataPage);

    // Navigate to session page
    await sessionPage.navigateToModule();

    // Verify key elements using page object methods
    const createButtonVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(createButtonVisible).toBe(true);

    const sessionTableVisible = await sessionPage.isSessionTableVisible();
    expect(sessionTableVisible).toBe(true);

    console.log('✅ All session page elements verified');
  });
});

/**
 * Example: Standard Test (Without Fixture)
 *
 * This uses the global setup instead of the fixture.
 * Works for most tests but relies on global data.
 */
test.describe('Example: Using Global Setup', () => {
  test('should work with standard page object', async ({ page }) => {
    // Epic + Project created by global.setup.ts
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');

    const sessionPage = new SessionPage(page);
    await sessionPage.navigateToModule();

    // Should be on session page
    const createButtonVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(createButtonVisible).toBe(true);

    console.log('✅ Global setup data works correctly');
  });
});
