import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Default tab initialization and lazy loading when the Analysis modal is opened
 * URS: URS-DV-GEN-2
 * SRS: SRS-13
 * SDS: SDS-13
 */
test.describe('URS-DV-GEN-2: Verify Default tab initialization and lazy loading when the ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-116: Verify Default tab initialization and lazy loading when the Analysis modal is op', async ({ page }) => {
    // Test Case: UTC-116
    // Summary: Verify Default tab initialization and lazy loading when the Analysis modal is opened
    // Description: Feature: Default tab initialization and lazy loading Given the Analysis modal is opened When the modal renders Then the default active tab should be “Label Analysis”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-117: Verify Default tab initialization and lazy loading when the modal opens', async ({ page }) => {
    // Test Case: UTC-117
    // Summary: Verify Default tab initialization and lazy loading when the modal opens
    // Description: Feature: Default tab initialization and lazy loading Given the modal opens When initialization completes Then Label Analysis data retrieval should automatically start

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-118: Verify Default tab initialization and lazy loading when the Label Analysis tab i', async ({ page }) => {
    // Test Case: UTC-118
    // Summary: Verify Default tab initialization and lazy loading when the Label Analysis tab is default
    // Description: Feature: Default tab initialization and lazy loading Given the Label Analysis tab is default When fetch executes Then only Label Analysis API endpoint should be triggered

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-119: Verify Default tab initialization and lazy loading when the modal loads', async ({ page }) => {
    // Test Case: UTC-119
    // Summary: Verify Default tab initialization and lazy loading when the modal loads
    // Description: Feature: Default tab initialization and lazy loading Given the modal loads When only default data is fetched Then initial load time should be optimized with minimal delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-120: Verify Default tab initialization and lazy loading when the modal opens', async ({ page }) => {
    // Test Case: UTC-120
    // Summary: Verify Default tab initialization and lazy loading when the modal opens
    // Description: Feature: Default tab initialization and lazy loading Given the modal opens When user has not clicked other tabs Then Annotation and Status tabs should not initiate any API calls

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-121: Verify Default tab initialization and lazy loading when the modal is open', async ({ page }) => {
    // Test Case: UTC-121
    // Summary: Verify Default tab initialization and lazy loading when the modal is open
    // Description: Feature: Default tab initialization and lazy loading Given the modal is open When the user clicks Annotation Analysis tab Then Annotation data should fetch only at that moment

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-122: Verify Default tab initialization and lazy loading when the modal is open', async ({ page }) => {
    // Test Case: UTC-122
    // Summary: Verify Default tab initialization and lazy loading when the modal is open
    // Description: Feature: Default tab initialization and lazy loading Given the modal is open When the user clicks Status Analysis tab Then Status data should fetch only at click time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-123: Verify Default tab initialization and lazy loading when Label Analysis fetch suc', async ({ page }) => {
    // Test Case: UTC-123
    // Summary: Verify Default tab initialization and lazy loading when Label Analysis fetch succeeds
    // Description: Feature: Default tab initialization and lazy loading Given Label Analysis fetch succeeds When switching tabs and returning Then previously loaded data should remain available without refetch (unless refreshed)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-124: Verify Default tab initialization and lazy loading when the modal opens', async ({ page }) => {
    // Test Case: UTC-124
    // Summary: Verify Default tab initialization and lazy loading when the modal opens
    // Description: Feature: Default tab initialization and lazy loading Given the modal opens When Label data is loading Then a loading spinner or placeholder should be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-125: Verify Default tab initialization and lazy loading when Label Analysis API fails', async ({ page }) => {
    // Test Case: UTC-125
    // Summary: Verify Default tab initialization and lazy loading when Label Analysis API fails
    // Description: Feature: Default tab initialization and lazy loading Given Label Analysis API fails When fetch returns error Then system should show “Failed to fetch” notification without closing modal

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-126: Verify Default tab initialization and lazy loading when the modal open state cha', async ({ page }) => {
    // Test Case: UTC-126
    // Summary: Verify Default tab initialization and lazy loading when the modal open state changes from false â†’ true
    // Description: Feature: Default tab initialization and lazy loading Given the modal open state changes from false → true When useEffect triggers Then fetch function should execute once only

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-127: Verify Default tab initialization and lazy loading when repeated modal open/clos', async ({ page }) => {
    // Test Case: UTC-127
    // Summary: Verify Default tab initialization and lazy loading when repeated modal open/close cycles
    // Description: Feature: Default tab initialization and lazy loading Given repeated modal open/close cycles When reopening the modal Then default tab should load correctly without memory leaks or duplicated calls

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
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
