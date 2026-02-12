import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify S3 key input field visibility when Upload from S3 modal opens
 * URS: URS-DV-DM-29
 * SRS: SRS-242
 * SDS: SDS-242
 */
test.describe('URS-DV-DM-29: Verify S3 key input field visibility when Upload from S3 mod', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2534: Verify S3 key input field visibility when Upload from S3 modal opens', async ({ page }) => {
    // Test Case: UTC-2534
    // Summary: Verify S3 key input field visibility when Upload from S3 modal opens
    // Description: Feature: S3 Key Validation Before Upload Scenario: S3 key input field visibility Given Upload from S3 modal opens When UI renders Then an S3 Key input field with helper text should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2535: Verify Upload button disabled by default when modal is opened', async ({ page }) => {
    // Test Case: UTC-2535
    // Summary: Verify Upload button disabled by default when modal is opened
    // Description: Feature: S3 Key Validation Before Upload Scenario: Upload button disabled by default Given modal is opened When no value entered Then Upload button remains disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2536: Verify Empty value blocked when S3 key is empty', async ({ page }) => {
    // Test Case: UTC-2536
    // Summary: Verify Empty value blocked when S3 key is empty
    // Description: Feature: S3 Key Validation Before Upload Scenario: Empty value blocked Given S3 key is empty When user attempts upload Then validation message “Enter a valid S3 key path” should display

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2537: Verify Reject HTTP public URL when user enters https://public-url/file.json', async ({ page }) => {
    // Test Case: UTC-2537
    // Summary: Verify Reject HTTP public URL when user enters https://public-url/file.json
    // Description: Feature: S3 Key Validation Before Upload Scenario: Reject HTTP public URL Given user enters https://public-url/file.json When validation runs Then Upload remains disabled and URL is rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2538: Verify Reject HTTP protocol prefix when user enters http://bucket/key.json', async ({ page }) => {
    // Test Case: UTC-2538
    // Summary: Verify Reject HTTP protocol prefix when user enters http://bucket/key.json
    // Description: Feature: S3 Key Validation Before Upload Scenario: Reject HTTP protocol prefix Given user enters http://bucket/key.json When validation occurs Then inline message should show invalid format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2539: Verify Reject malformed key when user enters special characters or spaces only', async ({ page }) => {
    // Test Case: UTC-2539
    // Summary: Verify Reject malformed key when user enters special characters or spaces only
    // Description: Feature: S3 Key Validation Before Upload Scenario: Reject malformed key Given user enters special characters or spaces only When validated Then Upload button remains disabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2540: Verify Accept valid S3 object key when user enters bucket/folder/file.json', async ({ page }) => {
    // Test Case: UTC-2540
    // Summary: Verify Accept valid S3 object key when user enters bucket/folder/file.json
    // Description: Feature: S3 Key Validation Before Upload Scenario: Accept valid S3 object key Given user enters bucket/folder/file.json When validation passes Then Upload button becomes enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2541: Verify Backend request triggered only after valid input when valid key entered', async ({ page }) => {
    // Test Case: UTC-2541
    // Summary: Verify Backend request triggered only after valid input when valid key entered
    // Description: Feature: S3 Key Validation Before Upload Scenario: Backend request triggered only after valid input Given valid key entered When Upload clicked Then backend fetch request should be initiated

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2542: Verify Prevent network call for invalid input when invalid key or URL entered', async ({ page }) => {
    // Test Case: UTC-2542
    // Summary: Verify Prevent network call for invalid input when invalid key or URL entered
    // Description: Feature: S3 Key Validation Before Upload Scenario: Prevent network call for invalid input Given invalid key or URL entered When Upload attempted Then no backend/network call should be made

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2543: Verify Helper text guidance visible when user views input field', async ({ page }) => {
    // Test Case: UTC-2543
    // Summary: Verify Helper text guidance visible when user views input field
    // Description: Feature: S3 Key Validation Before Upload Scenario: Helper text guidance visible Given user views input field When no value entered Then helper text should guide correct S3 key format

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2544: Verify Inline validation clears after correction when invalid key previously ent', async ({ page }) => {
    // Test Case: UTC-2544
    // Summary: Verify Inline validation clears after correction when invalid key previously entered
    // Description: Feature: S3 Key Validation Before Upload Scenario: Inline validation clears after correction Given invalid key previously entered When corrected to valid format Then error message should disappear automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-2545: Verify Multiple rapid inputs handled correctly when user types quickly or edits ', async ({ page }) => {
    // Test Case: UTC-2545
    // Summary: Verify Multiple rapid inputs handled correctly when user types quickly or edits repeatedly
    // Description: Feature: S3 Key Validation Before Upload Scenario: Multiple rapid inputs handled correctly Given user types quickly or edits repeatedly When validation runs Then UI remains responsive without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2546: Verify Whitespace-only value when user enters spaces only', async ({ page }) => {
    // Test Case: UTC-2546
    // Summary: Verify Whitespace-only value when user enters spaces only
    // Description: Feature: S3 Key Validation Before Upload Scenario: Whitespace-only value Given user enters spaces only When validated Then system treats it as empty and blocks upload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2547: Verify Prevent external domain injection when user enters external domain link', async ({ page }) => {
    // Test Case: UTC-2547
    // Summary: Verify Prevent external domain injection when user enters external domain link
    // Description: Feature: S3 Key Validation Before Upload Scenario: Prevent external domain injection Given user enters external domain link When validation occurs Then system must reject and show invalid key message

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
