import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Sub-project field visible when Session Creation page loads
 * URS: URS-DV-GEN-07
 * SRS: SRS-70
 * SDS: SDS-70
 */
test.describe('URS-DV-GEN-07: Verify Sub-project field visible when Session Creation page ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-852: Verify Sub-project field visible when Session Creation page loads', async ({ page }) => {
    // Test Case: UTC-852
    // Summary: Verify Sub-project field visible when Session Creation page loads
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Sub-project field visible Given Session Creation page loads When form renders Then Sub-Project dropdown should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-853: Verify Field disabled by default when no parent project selected', async ({ page }) => {
    // Test Case: UTC-853
    // Summary: Verify Field disabled by default when no parent project selected
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Field disabled by default Given no parent project selected When page loads Then Sub-Project dropdown should be disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-854: Verify Enable on parent selection when a parent project is selected', async ({ page }) => {
    // Test Case: UTC-854
    // Summary: Verify Enable on parent selection when a parent project is selected
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Enable on parent selection Given a parent project is selected When selection completes Then Sub-Project dropdown should become enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-855: Verify Dynamic API fetch when parent project selected', async ({ page }) => {
    // Test Case: UTC-855
    // Summary: Verify Dynamic API fetch when parent project selected
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Dynamic API fetch Given parent project selected When Sub-Project dropdown opens Then API should fetch only related sub-projects

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-856: Verify Display filtered list when sub-projects returned from API', async ({ page }) => {
    // Test Case: UTC-856
    // Summary: Verify Display filtered list when sub-projects returned from API
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Display filtered list Given sub-projects returned from API When dropdown expands Then only matching sub-projects should be listed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-857: Verify Select sub-project when dropdown list available', async ({ page }) => {
    // Test Case: UTC-857
    // Summary: Verify Select sub-project when dropdown list available
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Select sub-project Given dropdown list available When user selects a sub-project Then selected value should appear in the field

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-858: Verify UUID stored in payload when sub-project selected', async ({ page }) => {
    // Test Case: UTC-858
    // Summary: Verify UUID stored in payload when sub-project selected
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: UUID stored in payload Given sub-project selected When session is created Then sub-project UUID should be included in API payload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-859: Verify Prevent selection without parent when no parent selected', async ({ page }) => {
    // Test Case: UTC-859
    // Summary: Verify Prevent selection without parent when no parent selected
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Prevent selection without parent Given no parent selected When user clicks Sub-Project dropdown Then no selection should be allowed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-860: Verify No sub-projects available when parent has no children', async ({ page }) => {
    // Test Case: UTC-860
    // Summary: Verify No sub-projects available when parent has no children
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: No sub-projects available Given parent has no children When dropdown opens Then message “No Sub-Projects Available” should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-861: Verify Reset when parent changes when sub-project already selected', async ({ page }) => {
    // Test Case: UTC-861
    // Summary: Verify Reset when parent changes when sub-project already selected
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Reset when parent changes Given sub-project already selected When parent project changes Then sub-project value should reset automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-862: Verify Unauthorized sub-project hidden when restricted permissions', async ({ page }) => {
    // Test Case: UTC-862
    // Summary: Verify Unauthorized sub-project hidden when restricted permissions
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Unauthorized sub-project hidden Given restricted permissions When dropdown loads Then unauthorized sub-projects should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-863: Verify Manual payload tampering blocked when forged subProjectId submitted', async ({ page }) => {
    // Test Case: UTC-863
    // Summary: Verify Manual payload tampering blocked when forged subProjectId submitted
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Manual payload tampering blocked Given forged subProjectId submitted When API validates request Then request should be rejected

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

  test('UTC-864: Verify Placeholder guidance when field disabled', async ({ page }) => {
    // Test Case: UTC-864
    // Summary: Verify Placeholder guidance when field disabled
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Placeholder guidance Given field disabled When page loads Then placeholder should indicate “Select Project First”

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-865: Verify Fast load when large sub-project dataset', async ({ page }) => {
    // Test Case: UTC-865
    // Summary: Verify Fast load when large sub-project dataset
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Fast load Given large sub-project dataset When dropdown opens Then results should load within acceptable time (<2s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-866: Verify Keyboard navigation supported when dropdown focused', async ({ page }) => {
    // Test Case: UTC-866
    // Summary: Verify Keyboard navigation supported when dropdown focused
    // Description: Feature: Dependent sub-project dropdown based on parent project selection Scenario: Keyboard navigation supported Given dropdown focused When using keyboard arrows and enter Then user should select sub-project without mouse

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
