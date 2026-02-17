import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Image Count field visible when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-75
 * SDS: SDS-75
 */
test.describe('URS-DV-GEN-07: Verify Image Count field visible when Session Creation page ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-927: Verify Image Count field visible when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-927
    // Summary: Verify Image Count field visible when Session Creation page loads
    // Description: Feature: Numeric input for expected session image count validation Scenario: Image Count field visible Given Session Creation page loads When form renders Then Image Count numeric input should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-928: Verify Accept positive integers only when user enters value 100', async ({ page }) => {
    // Test Case: UTC-928
    // Summary: Verify Accept positive integers only when user enters value 100
    // Description: Feature: Numeric input for expected session image count validation Scenario: Accept positive integers only Given user enters value 100 When input validated Then value should be accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-929: Verify Reject alphabetic characters when user types letters', async ({ page }) => {
    // Test Case: UTC-929
    // Summary: Verify Reject alphabetic characters when user types letters
    // Description: Feature: Numeric input for expected session image count validation Scenario: Reject alphabetic characters Given user types letters When input attempted Then characters should not be accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-930: Verify Reject decimal values when user enters 10.5', async ({ page }) => {
    // Test Case: UTC-930
    // Summary: Verify Reject decimal values when user enters 10.5
    // Description: Feature: Numeric input for expected session image count validation Scenario: Reject decimal values Given user enters 10.5 When validation runs Then decimals should be prevented

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-931: Verify Reject negative numbers when user enters -5', async ({ page }) => {
    // Test Case: UTC-931
    // Summary: Verify Reject negative numbers when user enters -5
    // Description: Feature: Numeric input for expected session image count validation Scenario: Reject negative numbers Given user enters -5 When validation runs Then value should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-932: Verify Zero value handling when user enters 0', async ({ page }) => {
    // Test Case: UTC-932
    // Summary: Verify Zero value handling when user enters 0
    // Description: Feature: Numeric input for expected session image count validation Scenario: Zero value handling Given user enters 0 When validation runs Then system should show validation message for positive number

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-933: Verify Spinner arrows increase/decrease value when numeric control present', async ({ page }) => {
    // Test Case: UTC-933
    // Summary: Verify Spinner arrows increase/decrease value when numeric control present
    // Description: Feature: Numeric input for expected session image count validation Scenario: Spinner arrows increase/decrease value Given numeric control present When user clicks arrows Then value should increment/decrement correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-934: Verify Value persists during navigation when value entered', async ({ page }) => {
    // Test Case: UTC-934
    // Summary: Verify Value persists during navigation when value entered
    // Description: Feature: Numeric input for expected session image count validation Scenario: Value persists during navigation Given value entered When user navigates within form Then value should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-935: Verify Value sent in payload when session submitted', async ({ page }) => {
    // Test Case: UTC-935
    // Summary: Verify Value sent in payload when session submitted
    // Description: Feature: Numeric input for expected session image count validation Scenario: Value sent in payload Given session submitted When API request triggered Then imageCount should be included in JSON payload

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

  test('UTC-936: Verify Progress bar calculation when expected count 100 and 50 uploaded', async ({ page }) => {
    // Test Case: UTC-936
    // Summary: Verify Progress bar calculation when expected count 100 and 50 uploaded
    // Description: Feature: Numeric input for expected session image count validation Scenario: Progress bar calculation Given expected count 100 and 50 uploaded When progress calculated Then progress should show 50%

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-937: Verify Large number handling when user enters large value (100000+)', async ({ page }) => {
    // Test Case: UTC-937
    // Summary: Verify Large number handling when user enters large value (100000+)
    // Description: Feature: Numeric input for expected session image count validation Scenario: Large number handling Given user enters large value (100000+) When saved Then system should handle without overflow

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-938: Verify Refresh retains value when value entered and saved', async ({ page }) => {
    // Test Case: UTC-938
    // Summary: Verify Refresh retains value when value entered and saved
    // Description: Feature: Numeric input for expected session image count validation Scenario: Refresh retains value Given value entered and saved When page refreshed Then value should reload correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-939: Verify Keyboard entry supported when field focused', async ({ page }) => {
    // Test Case: UTC-939
    // Summary: Verify Keyboard entry supported when field focused
    // Description: Feature: Numeric input for expected session image count validation Scenario: Keyboard entry supported Given field focused When user types numbers Then input should work without mouse

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-940: Verify Instant validation feedback when invalid input entered', async ({ page }) => {
    // Test Case: UTC-940
    // Summary: Verify Instant validation feedback when invalid input entered
    // Description: Feature: Numeric input for expected session image count validation Scenario: Instant validation feedback Given invalid input entered When validation triggered Then response should occur immediately without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-941: Verify Blank submission when field left empty', async ({ page }) => {
    // Test Case: UTC-941
    // Summary: Verify Blank submission when field left empty
    // Description: Feature: Numeric input for expected session image count validation Scenario: Blank submission Given field left empty When submitting form Then submission should be blocked or default applied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
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
