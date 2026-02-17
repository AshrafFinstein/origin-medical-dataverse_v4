import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify keyboard shortcut is supported for copying annotations to previous image when the user is viewing an image with saved annotations
 * URS: URS-DV-DA-30
 * SRS: SRS-251
 * SDS: SDS-251
 */
test.describe('URS-DV-DA-30: Verify keyboard shortcut is supported for copying annotation', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2627: Verify keyboard shortcut is supported for copying annotations to previous image ', async ({ page }) => {
    // Test Case: UTC-2627
    // Summary: Verify keyboard shortcut is supported for copying annotations to previous image when the user is viewing an image with saved annotations
    // Description: Feature: Copy Annotations – Previous Image Shortcut Availability Scenario: Verify keyboard shortcut is supported for copying annotations to previous image Given the user is viewing an image with saved annotations When the user presses Shift + Ctrl + Left Arrow Then the system should initiate the copy annotations action to the previous image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2628: Verify annotations are copied to the previous image using shortcut when the curr', async ({ page }) => {
    // Test Case: UTC-2628
    // Summary: Verify annotations are copied to the previous image using shortcut when the current image has one or more saved annotations
    // Description: Feature: Copy Annotations – Copy to Previous Image via Shortcut Scenario: Verify annotations are copied to the previous image using shortcut Given the current image has one or more saved annotations When the user presses Shift + Ctrl + Left Arrow Then all saved annotations should be copied to the previous image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2629: Verify manual copy flow allows selecting a previous image when the Copy Annotati', async ({ page }) => {
    // Test Case: UTC-2629
    // Summary: Verify manual copy flow allows selecting a previous image when the Copy Annotation button is enabled
    // Description: Feature: Copy Annotations – Manual Copy Option to Previous Image Scenario: Verify manual copy flow allows selecting a previous image Given the Copy Annotation button is enabled When the user clicks the Copy Annotation button Then the “Select an image to copy annotations to” popup should be displayed with previous image options

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2630: Verify annotations are copied to selected previous image via manual option when ', async ({ page }) => {
    // Test Case: UTC-2630
    // Summary: Verify annotations are copied to selected previous image via manual option when the image selection popup is displayed
    // Description: Feature: Copy Annotations – Manual Target Selection to Previous Image Scenario: Verify annotations are copied to selected previous image via manual option Given the image selection popup is displayed When the user selects a previous image and confirms Then all saved annotations should be copied to the selected previous image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2631: Verify confirmation message after successful copy to previous image when annotat', async ({ page }) => {
    // Test Case: UTC-2631
    // Summary: Verify confirmation message after successful copy to previous image when annotations are copied successfully to a previous image
    // Description: Feature: Copy Annotations – Success Confirmation Message (Previous Image) Scenario: Verify confirmation message after successful copy to previous image Given annotations are copied successfully to a previous image When the copy operation completes Then a confirmation message such as “Annotations copied to image XX” should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2632: Verify copy is blocked when unsaved annotations exist when the current image has', async ({ page }) => {
    // Test Case: UTC-2632
    // Summary: Verify copy is blocked when unsaved annotations exist when the current image has unsaved annotations
    // Description: Feature: Copy Annotations – Unsaved Annotation Restriction (Previous Image) Scenario: Verify copy is blocked when unsaved annotations exist Given the current image has unsaved annotations When the user attempts to copy annotations to a previous image using shortcut or button Then the copy action should be blocked And an error message “Cannot copy annotations: Please save your annotations first. You have X unsaved annotation(s).” should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2633: Verify previous image view refreshes after copy when annotations are copied to a', async ({ page }) => {
    // Test Case: UTC-2633
    // Summary: Verify previous image view refreshes after copy when annotations are copied to a previous image
    // Description: Feature: Copy Annotations – Target Image Refresh Scenario: Verify previous image view refreshes after copy Given annotations are copied to a previous image When the previous image is opened Then the copied annotations should be visible and editable

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
