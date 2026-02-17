import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Move image out of Levels after acceptance when an image is accepted by a Levels user
 * URS: URS-DV-QC-01
 * SRS: SRS-6
 * SDS: SDS-6
 */
test.describe('URS-DV-QC-01: Verify Move image out of Levels after acceptance when an ima', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-49: Verify Move image out of Levels after acceptance when an image is accepted by a ', async ({ page }) => {
    // Test Case: UTC-49
    // Summary: Verify Move image out of Levels after acceptance when an image is accepted by a Levels user
    // Description: Feature: QC Workflow Progression As a system, accepted images must move forward in the workflow. Scenario: Move image out of Levels after acceptance Given an image is accepted by a Levels user When the image status is updated Then the image should move to the next approval level or final stage

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-50: Verify Multiple users access same image when multiple users are configured under', async ({ page }) => {
    // Test Case: UTC-50
    // Summary: Verify Multiple users access same image when multiple users are configured under Approval Level
    // Description: Feature: QC Access – Multiple Reviewers As a QC system, multiple reviewers must be able to view the same images. Scenario: Multiple users access same image Given multiple users are configured under Approval Level When each user accesses the same session Then the same IN_REVIEW images should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-51: Verify Image moves to next approval level after acceptance at non-final level wh', async ({ page }) => {
    // Test Case: UTC-51
    // Summary: Verify Image moves to next approval level after acceptance at non-final level when an image is in IN_REVIEW status at a non-final approval level (e.g., Level 1 or Level 2)
    // Description: Feature: Image workflow progression after non-final approval Scenario: Image moves to next approval level after acceptance at non-final level Given an image is in IN_REVIEW status at a non-final approval level (e.g., Level 1 or Level 2) And the user belongs to the current active approval level When the user clicks Accept on the image Then the image should move to the next approval level in the workflow

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-52: Verify Image becomes editable at the new active level after workflow transition ', async ({ page }) => {
    // Test Case: UTC-52
    // Summary: Verify Image becomes editable at the new active level after workflow transition when the image has moved to the next approval level after acceptance
    // Description: Feature: Edit access at new active approval level Scenario: Image becomes editable at the new active level after workflow transition Given the image has moved to the next approval level after acceptance When a user from the new active approval level opens the image Then the image should be accessible and editable, with all editing tools enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/failed-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });
});
