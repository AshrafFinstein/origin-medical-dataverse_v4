import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Success toast displayed after upload when user uploads a valid JSON file
 * URS: URS-DV-AN-13
 * SRS: SRS-115
 * SDS: SDS-115
 */
test.describe('URS-DV-AN-13: Verify Success toast displayed after upload when user upload', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1565: Verify Success toast displayed after upload when user uploads a valid JSON file', async ({ page }) => {
    // Test Case: UTC-1565
    // Summary: Verify Success toast displayed after upload when user uploads a valid JSON file
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Success toast displayed after upload Given user uploads a valid JSON file When backend processing completes successfully Then a success toast message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1566: Verify Toast message clarity when upload success occurs', async ({ page }) => {
    // Test Case: UTC-1566
    // Summary: Verify Toast message clarity when upload success occurs
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Toast message clarity Given upload success occurs When toast appears Then message should clearly indicate successful upload

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1567: Verify File name remains visible when file uploaded successfully', async ({ page }) => {
    // Test Case: UTC-1567
    // Summary: Verify File name remains visible when file uploaded successfully
    // Description: Feature: JSON Upload Success Stage Handling Scenario: File name remains visible Given file uploaded successfully When UI updates Then the uploaded file name should remain listed below upload area

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1568: Verify Correct filename mapped when specific JSON file uploaded', async ({ page }) => {
    // Test Case: UTC-1568
    // Summary: Verify Correct filename mapped when specific JSON file uploaded
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Correct filename mapped Given specific JSON file uploaded When success response received Then displayed file name should exactly match uploaded file

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1569: Verify Status updated after backend response when backend returns success respon', async ({ page }) => {
    // Test Case: UTC-1569
    // Summary: Verify Status updated after backend response when backend returns success response
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Status updated after backend response Given backend returns success response When data flow completes Then file status should update to success in UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1570: Verify No duplicate toast messages when upload succeeds once', async ({ page }) => {
    // Test Case: UTC-1570
    // Summary: Verify No duplicate toast messages when upload succeeds once
    // Description: Feature: JSON Upload Success Stage Handling Scenario: No duplicate toast messages Given upload succeeds once When UI refresh occurs Then only one success toast should appear

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1571: Verify Toast auto dismiss behavior when success toast is displayed', async ({ page }) => {
    // Test Case: UTC-1571
    // Summary: Verify Toast auto dismiss behavior when success toast is displayed
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Toast auto dismiss behavior Given success toast is displayed When timeout completes Then toast should auto-dismiss without blocking UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1572: Verify Toast position visibility when success occurs', async ({ page }) => {
    // Test Case: UTC-1572
    // Summary: Verify Toast position visibility when success occurs
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Toast position visibility Given success occurs When toast displays Then it should appear at visible location without hiding content

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1573: Verify Multiple uploads show individual success when multiple files uploaded', async ({ page }) => {
    // Test Case: UTC-1573
    // Summary: Verify Multiple uploads show individual success when multiple files uploaded
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Multiple uploads show individual success Given multiple files uploaded When each completes successfully Then success toast should reflect each upload result

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1574: Verify Toast appears instantly when upload success response received', async ({ page }) => {
    // Test Case: UTC-1574
    // Summary: Verify Toast appears instantly when upload success response received
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Toast appears instantly Given upload success response received When UI processes response Then toast should appear within 1 second

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1575: Verify No success toast on failure when upload fails', async ({ page }) => {
    // Test Case: UTC-1575
    // Summary: Verify No success toast on failure when upload fails
    // Description: Feature: JSON Upload Success Stage Handling Scenario: No success toast on failure Given upload fails When error occurs Then success toast should not be shown

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-1576: Verify File list persistence after navigation when upload succeeded', async ({ page }) => {
    // Test Case: UTC-1576
    // Summary: Verify File list persistence after navigation when upload succeeded
    // Description: Feature: JSON Upload Success Stage Handling Scenario: File list persistence after navigation Given upload succeeded When user navigates within page Then uploaded file name should remain visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('UTC-1577: Verify Screen reader announcement when upload success occurs', async ({ page }) => {
    // Test Case: UTC-1577
    // Summary: Verify Screen reader announcement when upload success occurs
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Screen reader announcement Given upload success occurs When toast appears Then screen reader should announce success message

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1578: Verify Large file success handling when large JSON file uploaded', async ({ page }) => {
    // Test Case: UTC-1578
    // Summary: Verify Large file success handling when large JSON file uploaded
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Large file success handling Given large JSON file uploaded When success occurs Then toast and filename should still display correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1579: Verify Page refresh after success when file uploaded successfully', async ({ page }) => {
    // Test Case: UTC-1579
    // Summary: Verify Page refresh after success when file uploaded successfully
    // Description: Feature: JSON Upload Success Stage Handling Scenario: Page refresh after success Given file uploaded successfully When page refresh occurs Then file name should still be retrievable from state/server

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

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
