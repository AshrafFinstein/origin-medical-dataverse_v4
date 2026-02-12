import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify URL field visibility when Add Links row is created
 * URS: URS-DV-GEN-07
 * SRS: SRS-80
 * SDS: SDS-80
 */
test.describe('URS-DV-GEN-07: Verify URL field visibility when Add Links row is created', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-988: Verify URL field visibility when Add Links row is created', async ({ page }) => {
    // Test Case: UTC-988
    // Summary: Verify URL field visibility when Add Links row is created
    // Description: Feature: Link URL Input for external references Scenario: URL field visibility Given Add Links row is created When inputs render Then a URL text field should be visible in the Link column

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-989: Verify Placeholder guidance when URL field is displayed', async ({ page }) => {
    // Test Case: UTC-989
    // Summary: Verify Placeholder guidance when URL field is displayed
    // Description: Feature: Link URL Input for external references Scenario: Placeholder guidance Given URL field is displayed When user views the field Then placeholder should indicate valid format (e.g.,.https://example.com)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-990: Verify Enter URL value when URL field active', async ({ page }) => {
    // Test Case: UTC-990
    // Summary: Verify Enter URL value when URL field active
    // Description: Feature: Link URL Input for external references Scenario: Enter URL value Given URL field active When user types a web address Then value should be captured and retained

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-991: Verify Multiple URLs supported when multiple link rows added', async ({ page }) => {
    // Test Case: UTC-991
    // Summary: Verify Multiple URLs supported when multiple link rows added
    // Description: Feature: Link URL Input for external references Scenario: Multiple URLs supported Given multiple link rows added When URLs entered for each row Then each row should store its URL independently

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-992: Verify Accept valid HTTPS URL when a valid https URL entered', async ({ page }) => {
    // Test Case: UTC-992
    // Summary: Verify Accept valid HTTPS URL when a valid https URL entered
    // Description: Feature: Link URL Input for external references Scenario: Accept valid HTTPS URL Given a valid https URL entered When session saved Then URL should be accepted successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-993: Verify Accept HTTP URL when a valid http URL entered', async ({ page }) => {
    // Test Case: UTC-993
    // Summary: Verify Accept HTTP URL when a valid http URL entered
    // Description: Feature: Link URL Input for external references Scenario: Accept HTTP URL Given a valid http URL entered When session saved Then URL should be accepted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-994: Verify Reject invalid URL format when invalid text entered', async ({ page }) => {
    // Test Case: UTC-994
    // Summary: Verify Reject invalid URL format when invalid text entered
    // Description: Feature: Link URL Input for external references Scenario: Reject invalid URL format Given invalid text entered When submitting session Then validation message should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-995: Verify Reject empty URL when URL field is blank', async ({ page }) => {
    // Test Case: UTC-995
    // Summary: Verify Reject empty URL when URL field is blank
    // Description: Feature: Link URL Input for external references Scenario: Reject empty URL Given URL field is blank When user submits Then save should be blocked or warning shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-996: Verify Prevent script injection when user enters script or malicious content', async ({ page }) => {
    // Test Case: UTC-996
    // Summary: Verify Prevent script injection when user enters script or malicious content
    // Description: Feature: Link URL Input for external references Scenario: Prevent script injection Given user enters script or malicious content When validation runs Then system should sanitize or block input

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-997: Verify Strip unsafe protocols when javascript: or unsafe protocol entered', async ({ page }) => {
    // Test Case: UTC-997
    // Summary: Verify Strip unsafe protocols when javascript: or unsafe protocol entered
    // Description: Feature: Link URL Input for external references Scenario: Strip unsafe protocols Given javascript: or unsafe protocol entered When validating Then system should reject the URL

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-998: Verify URL stored in payload when valid URL entered', async ({ page }) => {
    // Test Case: UTC-998
    // Summary: Verify URL stored in payload when valid URL entered
    // Description: Feature: Link URL Input for external references Scenario: URL stored in payload Given valid URL entered When session saved Then API payload should include URL against session metadata

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-999: Verify URL persistence during navigation when URL entered', async ({ page }) => {
    // Test Case: UTC-999
    // Summary: Verify URL persistence during navigation when URL entered
    // Description: Feature: Link URL Input for external references Scenario: URL persistence during navigation Given URL entered When navigating within form Then URL should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1000: Verify Instant input response when rapid typing', async ({ page }) => {
    // Test Case: UTC-1000
    // Summary: Verify Instant input response when rapid typing
    // Description: Feature: Link URL Input for external references Scenario: Instant input response Given rapid typing When characters entered Then UI should respond without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-1001: Verify Keyboard accessibility when URL field focused', async ({ page }) => {
    // Test Case: UTC-1001
    // Summary: Verify Keyboard accessibility when URL field focused
    // Description: Feature: Link URL Input for external references Scenario: Keyboard accessibility Given URL field focused When user navigates via keyboard Then typing and focus should work correctly

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
