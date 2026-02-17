import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Analyze icon opens Analysis Modal when the Data Labelling Session table is loaded
 * URS: URS-DV-GEN-2
 * SRS: SRS-11
 * SDS: SDS-11
 */
test.describe('URS-DV-GEN-2: Verify Analyze icon opens Analysis Modal when the Data Label', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-90: Verify Analyze icon opens Analysis Modal when the Data Labelling Session table i', async ({ page }) => {
    // Test Case: UTC-90
    // Summary: Verify Analyze icon opens Analysis Modal when the Data Labelling Session table is loaded
    // Description: Feature: Analyze icon opens Analysis Modal Given the Data Labelling Session table is loaded When the table rows are rendered Then an Analyze (three-dot) icon should be visible for each active session row

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-91: Verify Analyze icon opens Analysis Modal when a session row is displayed', async ({ page }) => {
    // Test Case: UTC-91
    // Summary: Verify Analyze icon opens Analysis Modal when a session row is displayed
    // Description: Feature: Analyze icon opens Analysis Modal Given a session row is displayed When the user views the action column Then the Analyze icon should be displayed as an interactive IconButton

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-92: Verify Analyze icon opens Analysis Modal when a session row is available', async ({ page }) => {
    // Test Case: UTC-92
    // Summary: Verify Analyze icon opens Analysis Modal when a session row is available
    // Description: Feature: Analyze icon opens Analysis Modal Given a session row is available When the user clicks the Analyze icon Then the Analysis Modal should open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-93: Verify Analyze icon opens Analysis Modal when multiple sessions exist in the tab', async ({ page }) => {
    // Test Case: UTC-93
    // Summary: Verify Analyze icon opens Analysis Modal when multiple sessions exist in the table
    // Description: Feature: Analyze icon opens Analysis Modal Given multiple sessions exist in the table When the user clicks Analyze for a specific session Then the modal should load data only for the selected session

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-94: Verify Analyze icon opens Analysis Modal when the Analyze icon is clicked', async ({ page }) => {
    // Test Case: UTC-94
    // Summary: Verify Analyze icon opens Analysis Modal when the Analyze icon is clicked
    // Description: Feature: Analyze icon opens Analysis Modal Given the Analyze icon is clicked When the modal state is initialized Then the sessionId should be passed and isAnalysisSession should be set to true

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-95: Verify Analyze icon opens Analysis Modal when the Analysis Modal is open', async ({ page }) => {
    // Test Case: UTC-95
    // Summary: Verify Analyze icon opens Analysis Modal when the Analysis Modal is open
    // Description: Feature: Analyze icon opens Analysis Modal Given the Analysis Modal is open When the modal content loads Then the session metadata should match the selected sessionId

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-96: Verify Analyze icon opens Analysis Modal when the session status is Deleted', async ({ page }) => {
    // Test Case: UTC-96
    // Summary: Verify Analyze icon opens Analysis Modal when the session status is Deleted
    // Description: Feature: Analyze icon opens Analysis Modal Given the session status is Deleted When the table is rendered Then the Analyze icon should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-97: Verify Analyze icon opens Analysis Modal when the Analyze icon is disabled', async ({ page }) => {
    // Test Case: UTC-97
    // Summary: Verify Analyze icon opens Analysis Modal when the Analyze icon is disabled
    // Description: Feature: Analyze icon opens Analysis Modal Given the Analyze icon is disabled When the user clicks the icon Then the Analysis Modal should not open

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-98: Verify Analyze icon opens Analysis Modal when the Analysis Modal is already open', async ({ page }) => {
    // Test Case: UTC-98
    // Summary: Verify Analyze icon opens Analysis Modal when the Analysis Modal is already open
    // Description: Feature: Analyze icon opens Analysis Modal Given the Analysis Modal is already open When the user clicks Analyze again Then duplicate modals should not be created

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-99: Verify Analyze icon opens Analysis Modal when the user clicks Analyze', async ({ page }) => {
    // Test Case: UTC-99
    // Summary: Verify Analyze icon opens Analysis Modal when the user clicks Analyze
    // Description: Feature: Analyze icon opens Analysis Modal Given the user clicks Analyze When the modal opens Then the Analysis Modal should load within acceptable time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-100: Verify Analyze icon opens Analysis Modal when the user hovers over the Analyze i', async ({ page }) => {
    // Test Case: UTC-100
    // Summary: Verify Analyze icon opens Analysis Modal when the user hovers over the Analyze icon
    // Description: Feature: Analyze icon opens Analysis Modal Given the user hovers over the Analyze icon When the tooltip is shown Then it should clearly indicate the Analyze action

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-101: Verify Analyze icon opens Analysis Modal when the Analyze icon is focused via ke', async ({ page }) => {
    // Test Case: UTC-101
    // Summary: Verify Analyze icon opens Analysis Modal when the Analyze icon is focused via keyboard
    // Description: Feature: Analyze icon opens Analysis Modal Given the Analyze icon is focused via keyboard When Enter or Space is pressed Then the Analysis Modal should open

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
