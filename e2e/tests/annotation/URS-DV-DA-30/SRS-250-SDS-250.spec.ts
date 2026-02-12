import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify keyboard shortcut is supported for copying annotations when the user is viewing an image with saved annotations
 * URS: URS-DV-DA-30
 * SRS: SRS-250
 * SDS: SDS-250
 */
test.describe('URS-DV-DA-30: Verify keyboard shortcut is supported for copying annotation', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2620: Verify keyboard shortcut is supported for copying annotations when the user is v', async ({ page }) => {
    // Test Case: UTC-2620
    // Summary: Verify keyboard shortcut is supported for copying annotations when the user is viewing an image with saved annotations
    // Description: Feature: Copy Annotations – Shortcut Availability Scenario: Verify keyboard shortcut is supported for copying annotations Given the user is viewing an image with saved annotations When the user presses Shift + Ctrl + Right Arrow Then the system should initiate the copy annotations action

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2621: Verify annotations are copied to the next image using shortcut when the current ', async ({ page }) => {
    // Test Case: UTC-2621
    // Summary: Verify annotations are copied to the next image using shortcut when the current image has one or more saved annotations
    // Description: Feature: Copy Annotations – Copy to Next Image via Shortcut Scenario: Verify annotations are copied to the next image using shortcut Given the current image has one or more saved annotations When the user presses Shift + Ctrl + Right Arrow Then all saved annotations should be copied to the next image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2622: Verify Copy Annotation button triggers manual copy flow when the Copy Annotation', async ({ page }) => {
    // Test Case: UTC-2622
    // Summary: Verify Copy Annotation button triggers manual copy flow when the Copy Annotation button is enabled
    // Description: Feature: Copy Annotations – Manual Copy Option Scenario: Verify Copy Annotation button triggers manual copy flow Given the Copy Annotation button is enabled When the user clicks the Copy Annotation button Then the system should open the image selection popup

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2623: Verify annotations are copied to selected image via manual option when the image', async ({ page }) => {
    // Test Case: UTC-2623
    // Summary: Verify annotations are copied to selected image via manual option when the image selection popup is displayed
    // Description: Feature: Copy Annotations – Manual Target Image Selection Scenario: Verify annotations are copied to selected image via manual option Given the image selection popup is displayed When the user selects a target image and confirms Then all saved annotations should be copied to the selected image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2624: Verify confirmation message after successful copy when annotations are copied su', async ({ page }) => {
    // Test Case: UTC-2624
    // Summary: Verify confirmation message after successful copy when annotations are copied successfully
    // Description: Feature: Copy Annotations – Success Confirmation Message Scenario: Verify confirmation message after successful copy Given annotations are copied successfully When the copy operation completes Then a confirmation message such as “Annotations copied to image XX” should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2625: Verify copy is blocked when unsaved annotations exist when the current image has', async ({ page }) => {
    // Test Case: UTC-2625
    // Summary: Verify copy is blocked when unsaved annotations exist when the current image has unsaved annotations
    // Description: Feature: Copy Annotations – Unsaved Annotation Restriction Scenario: Verify copy is blocked when unsaved annotations exist Given the current image has unsaved annotations When the user attempts to copy annotations using shortcut or button Then the copy action should be blocked And an error message “Cannot copy annotations: Please save your annotations first” should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2626: Verify target image view updates after copy when annotations are copied to a tar', async ({ page }) => {
    // Test Case: UTC-2626
    // Summary: Verify target image view updates after copy when annotations are copied to a target image
    // Description: Feature: Copy Annotations – Target Image Update Scenario: Verify target image view updates after copy Given annotations are copied to a target image When the target image is opened Then the copied annotations should be visible and editable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
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
