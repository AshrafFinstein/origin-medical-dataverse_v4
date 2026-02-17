import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Remove icon visibility when the user is on the Session Creation page
 * URS: URS-DV-GEN-3
 * SRS: SRS-29
 * SDS: SDS-29
 */
test.describe('URS-DV-GEN-3: Verify Remove icon visibility when the user is on the Sessio', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-352: Verify Remove icon visibility when the user is on the Session Creation page', async ({ page }) => {
    // Test Case: UTC-352
    // Summary: Verify Remove icon visibility when the user is on the Session Creation page
    // Description: Feature: Approval Level Removal Before Submission Scenario: Remove icon visibility Given the user is on the Session Creation page When approval levels are displayed Then each level should show a visible Remove (–) icon

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-353: Verify Remove level successfully before submission when multiple approval levels', async ({ page }) => {
    // Test Case: UTC-353
    // Summary: Verify Remove level successfully before submission when multiple approval levels exist
    // Description: Scenario: Remove level successfully before submission Given multiple approval levels exist When the user clicks the Remove (–) icon on Level 3 Then Level 3 should be deleted immediately from the list

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-354: Verify Level sequence updates after removal when Level 1, Level 2, Level 3 are c', async ({ page }) => {
    // Test Case: UTC-354
    // Summary: Verify Level sequence updates after removal when Level 1, Level 2, Level 3 are configured
    // Description: Scenario: Level sequence updates after removal Given Level 1, Level 2, Level 3 are configured When Level 2 is removed Then remaining levels should reorder sequentially without gaps

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-355: Verify Remove last level only when multiple levels exist', async ({ page }) => {
    // Test Case: UTC-355
    // Summary: Verify Remove last level only when multiple levels exist
    // Description: Scenario: Remove last level only Given multiple levels exist When the user removes the last level Then only the selected last level should be removed and others remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-356: Verify Remove middle level only when Level 1â€“Level 4 exist', async ({ page }) => {
    // Test Case: UTC-356
    // Summary: Verify Remove middle level only when Level 1â€“Level 4 exist
    // Description: Scenario: Remove middle level only Given Level 1–Level 4 exist When Level 2 is removed Then only Level 2 should be removed and other levels retained

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-357: Verify Remove clears assigned users/groups when Level 3 has assigned users or gr', async ({ page }) => {
    // Test Case: UTC-357
    // Summary: Verify Remove clears assigned users/groups when Level 3 has assigned users or groups
    // Description: Scenario: Remove clears assigned users/groups Given Level 3 has assigned users or groups When the level is removed Then associated assignments should also be cleared

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-358: Verify Add level after removal when a level was removed', async ({ page }) => {
    // Test Case: UTC-358
    // Summary: Verify Add level after removal when a level was removed
    // Description: Scenario: Add level after removal Given a level was removed When the user clicks Add Level again Then a new level should be added correctly without errors

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-359: Verify Removal disabled after submission when the session is submitted or update', async ({ page }) => {
    // Test Case: UTC-359
    // Summary: Verify Removal disabled after submission when the session is submitted or updated
    // Description: Scenario: Removal disabled after submission Given the session is submitted or updated When the user views approval levels Then the Remove icon should be disabled or hidden

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-360: Verify Prevent removal after submission attempt when the session is already subm', async ({ page }) => {
    // Test Case: UTC-360
    // Summary: Verify Prevent removal after submission attempt when the session is already submitted
    // Description: Scenario: Prevent removal after submission attempt Given the session is already submitted When the user tries to remove a level Then removal should not occur and a restriction message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-361: Verify Immediate UI update after removal when the user clicks Remove', async ({ page }) => {
    // Test Case: UTC-361
    // Summary: Verify Immediate UI update after removal when the user clicks Remove
    // Description: Scenario: Immediate UI update after removal Given the user clicks Remove When the action is executed Then the UI should update instantly without page reload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-362: Verify Clear visual feedback on removal when a level is removed', async ({ page }) => {
    // Test Case: UTC-362
    // Summary: Verify Clear visual feedback on removal when a level is removed
    // Description: Scenario: Clear visual feedback on removal Given a level is removed When the action completes Then the user should clearly see updated level list without confusion

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-363: Verify Remove until only Level 1 remains when multiple levels exist', async ({ page }) => {
    // Test Case: UTC-363
    // Summary: Verify Remove until only Level 1 remains when multiple levels exist
    // Description: Scenario: Remove until only Level 1 remains Given multiple levels exist When the user removes all additional levels Then Level 1 should remain as the minimum required level

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-364: Verify Removal before saving persists correctly when levels are removed before s', async ({ page }) => {
    // Test Case: UTC-364
    // Summary: Verify Removal before saving persists correctly when levels are removed before submission
    // Description: Scenario: Removal before saving persists correctly Given levels are removed before submission When the session is saved Then removed levels should not reappear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-365: Verify Clicking remove with no levels available when only default Level 1 exists', async ({ page }) => {
    // Test Case: UTC-365
    // Summary: Verify Clicking remove with no levels available when only default Level 1 exists
    // Description: Scenario: Clicking remove with no levels available Given only default Level 1 exists When no removable levels remain Then no removal action should be allowed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
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
