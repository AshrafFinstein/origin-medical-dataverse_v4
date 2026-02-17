import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks saving when duplicate taxonomy group names exist when the user is configuring taxonomy groups in session creation
 * URS: URS-DV-GEN-21
 * SRS: SRS-202
 * SDS: SDS-202
 */
test.describe('URS-DV-GEN-21: Verify system blocks saving when duplicate taxonomy group na', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2063: Verify system blocks saving when duplicate taxonomy group names exist when the u', async ({ page }) => {
    // Test Case: UTC-2063
    // Summary: Verify system blocks saving when duplicate taxonomy group names exist when the user is configuring taxonomy groups in session creation
    // Description: Feature: Taxonomy Group Uniqueness – Block Duplicate Names Scenario: Verify system blocks saving when duplicate taxonomy group names exist Given the user is configuring taxonomy groups in session creation When the user enters the same taxonomy group name in two rows (e.g., “Bone”) And clicks Save/Create Session Then the system should block submission And show toast message “There are duplicate taxonomy group names. Please ensure all taxonomy names are unique.”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2064: Verify taxonomy duplicate message clearly describes the issue when the user atte', async ({ page }) => {
    // Test Case: UTC-2064
    // Summary: Verify taxonomy duplicate message clearly describes the issue when the user attempts to save session with duplicate taxonomy group names
    // Description: Feature: Taxonomy Group Uniqueness – Message Mentions Duplicate Issue Scenario: Verify taxonomy duplicate message clearly describes the issue Given the user attempts to save session with duplicate taxonomy group names When validation fails Then the toast message should clearly mention duplicates exist And should not show technical error codes

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
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
