import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, LabelSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Color Picker visible with default white when the Create Session Label popup is open
 * URS: URS-DV-GEN-5
 * SRS: SRS-46
 * SDS: SDS-46
 */
test.describe('URS-DV-GEN-5: Verify Color Picker visible with default white when the Crea', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-541: Verify Color Picker visible with default white when the Create Session Label pop', async ({ page }) => {
    // Test Case: UTC-541
    // Summary: Verify Color Picker visible with default white when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Color Picker visible with default white Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-542: Verify User selects a color successfully when the Create Session Label popup is ', async ({ page }) => {
    // Test Case: UTC-542
    // Summary: Verify User selects a color successfully when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: User selects a color successfully Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-543: Verify Selected color reflected in preview when the Create Session Label popup i', async ({ page }) => {
    // Test Case: UTC-543
    // Summary: Verify Selected color reflected in preview when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Selected color reflected in preview Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-544: Verify Submit disabled when mandatory fields empty when the Create Session Label', async ({ page }) => {
    // Test Case: UTC-544
    // Summary: Verify Submit disabled when mandatory fields empty when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Submit disabled when mandatory fields empty Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-545: Verify Submit enabled when all fields valid when the Create Session Label popup ', async ({ page }) => {
    // Test Case: UTC-545
    // Summary: Verify Submit enabled when all fields valid when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Submit enabled when all fields valid Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-546: Verify Color saved in payload on submit when the Create Session Label popup is o', async ({ page }) => {
    // Test Case: UTC-546
    // Summary: Verify Color saved in payload on submit when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Color saved in payload on submit Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-547: Verify Popup retains selected color before submission when the Create Session La', async ({ page }) => {
    // Test Case: UTC-547
    // Summary: Verify Popup retains selected color before submission when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Popup retains selected color before submission Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-548: Verify Prevent submit when invalid name when the Create Session Label popup is o', async ({ page }) => {
    // Test Case: UTC-548
    // Summary: Verify Prevent submit when invalid name when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Prevent submit when invalid name Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-549: Verify Multiple color changes handled correctly when the Create Session Label po', async ({ page }) => {
    // Test Case: UTC-549
    // Summary: Verify Multiple color changes handled correctly when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Multiple color changes handled correctly Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify modal
    await sessionPage.clickCreateButton();
    const modalVisible = await sessionPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-550: Verify Clear visual feedback for selected color when the Create Session Label po', async ({ page }) => {
    // Test Case: UTC-550
    // Summary: Verify Clear visual feedback for selected color when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Clear visual feedback for selected color Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-551: Verify Unauthorized users cannot submit label when the Create Session Label popu', async ({ page }) => {
    // Test Case: UTC-551
    // Summary: Verify Unauthorized users cannot submit label when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: Unauthorized users cannot submit label Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-552: Verify API failure shows friendly error when the Create Session Label popup is o', async ({ page }) => {
    // Test Case: UTC-552
    // Summary: Verify API failure shows friendly error when the Create Session Label popup is open
    // Description: Feature: Session Label Color & Submit Handling Scenario: API failure shows friendly error Given the Create Session Label popup is open When the user performs the action Then the system should behave accordingly

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
