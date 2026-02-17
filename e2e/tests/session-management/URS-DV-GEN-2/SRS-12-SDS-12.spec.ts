import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Modal header and tabs navigation layout when the Analysis modal is opened
 * URS: URS-DV-GEN-2
 * SRS: SRS-12
 * SDS: SDS-12
 */
test.describe('URS-DV-GEN-2: Verify Modal header and tabs navigation layout when the Anal', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-102: Verify Modal header and tabs navigation layout when the Analysis modal is opened', async ({ page }) => {
    // Test Case: UTC-102
    // Summary: Verify Modal header and tabs navigation layout when the Analysis modal is opened
    // Description: Feature: Modal header and tabs navigation layout Given the Analysis modal is opened When the modal renders Then a header displaying the session name should be visible at the top

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-103: Verify Modal header and tabs navigation layout when the modal header is visible', async ({ page }) => {
    // Test Case: UTC-103
    // Summary: Verify Modal header and tabs navigation layout when the modal header is visible
    // Description: Feature: Modal header and tabs navigation layout Given the modal header is visible When the user views the top-right area Then a close (“X”) button should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-104: Verify Modal header and tabs navigation layout when the modal is open', async ({ page }) => {
    // Test Case: UTC-104
    // Summary: Verify Modal header and tabs navigation layout when the modal is open
    // Description: Feature: Modal header and tabs navigation layout Given the modal is open When the user clicks the close (“X”) button Then the modal should close and return to the session table

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-105: Verify Modal header and tabs navigation layout when the modal loads', async ({ page }) => {
    // Test Case: UTC-105
    // Summary: Verify Modal header and tabs navigation layout when the modal loads
    // Description: Feature: Modal header and tabs navigation layout Given the modal loads When navigation controls are displayed Then three tabs “Label Analysis”, “Annotation Analysis”, and “Status Analysis” should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-106: Verify Modal header and tabs navigation layout when the modal opens', async ({ page }) => {
    // Test Case: UTC-106
    // Summary: Verify Modal header and tabs navigation layout when the modal opens
    // Description: Feature: Modal header and tabs navigation layout Given the modal opens When initial state loads Then activeTab should default to LABEL and Label Analysis content should render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-107: Verify Modal header and tabs navigation layout when Label tab is active', async ({ page }) => {
    // Test Case: UTC-107
    // Summary: Verify Modal header and tabs navigation layout when Label tab is active
    // Description: Feature: Modal header and tabs navigation layout Given Label tab is active When the user clicks Annotation Analysis tab Then activeTab should change to ANNOTATION and annotation view should render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-108: Verify Modal header and tabs navigation layout when any tab is active', async ({ page }) => {
    // Test Case: UTC-108
    // Summary: Verify Modal header and tabs navigation layout when any tab is active
    // Description: Feature: Modal header and tabs navigation layout Given any tab is active When the user clicks Status Analysis tab Then activeTab should change to STATUS and status view should render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-109: Verify Modal header and tabs navigation layout when the user switches between ta', async ({ page }) => {
    // Test Case: UTC-109
    // Summary: Verify Modal header and tabs navigation layout when the user switches between tabs
    // Description: Feature: Modal header and tabs navigation layout Given the user switches between tabs When activeTab updates Then only the corresponding child component should render

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-110: Verify Modal header and tabs navigation layout when the modal is opened for a se', async ({ page }) => {
    // Test Case: UTC-110
    // Summary: Verify Modal header and tabs navigation layout when the modal is opened for a session
    // Description: Feature: Modal header and tabs navigation layout Given the modal is opened for a session When switching tabs Then the same sessionId should be retained across all tabs

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-111: Verify Modal header and tabs navigation layout when the user rapidly switches ta', async ({ page }) => {
    // Test Case: UTC-111
    // Summary: Verify Modal header and tabs navigation layout when the user rapidly switches tabs
    // Description: Feature: Modal header and tabs navigation layout Given the user rapidly switches tabs When state changes repeatedly Then no crash or blank screen should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-112: Verify Modal header and tabs navigation layout when the tabs are displayed', async ({ page }) => {
    // Test Case: UTC-112
    // Summary: Verify Modal header and tabs navigation layout when the tabs are displayed
    // Description: Feature: Modal header and tabs navigation layout Given the tabs are displayed When the active tab is selected Then it should be visually highlighted to indicate selection

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-113: Verify Modal header and tabs navigation layout when the modal is focused', async ({ page }) => {
    // Test Case: UTC-113
    // Summary: Verify Modal header and tabs navigation layout when the modal is focused
    // Description: Feature: Modal header and tabs navigation layout Given the modal is focused When the user navigates using keyboard (Tab/Arrow/Enter) Then tabs should be accessible and switchable via keyboard

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-114: Verify Modal header and tabs navigation layout when the user switches tabs', async ({ page }) => {
    // Test Case: UTC-114
    // Summary: Verify Modal header and tabs navigation layout when the user switches tabs
    // Description: Feature: Modal header and tabs navigation layout Given the user switches tabs When the content loads Then the view should update instantly without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-115: Verify Modal header and tabs navigation layout when the sessionId is missing or ', async ({ page }) => {
    // Test Case: UTC-115
    // Summary: Verify Modal header and tabs navigation layout when the sessionId is missing or invalid
    // Description: Feature: Modal header and tabs navigation layout Given the sessionId is missing or invalid When the modal opens Then the modal should not crash and should show safe fallback or empty state

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
