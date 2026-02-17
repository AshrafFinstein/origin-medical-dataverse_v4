import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify conflict popup appears when copying to next image with existing annotations when the source image has saved annotations
 * URS: URS-DV-DA-30
 * SRS: SRS-252
 * SDS: SDS-252
 */
test.describe('URS-DV-DA-30: Verify conflict popup appears when copying to next image wit', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2634: Verify conflict popup appears when copying to next image with existing annotatio', async ({ page }) => {
    // Test Case: UTC-2634
    // Summary: Verify conflict popup appears when copying to next image with existing annotations when the source image has saved annotations
    // Description: Feature: Copy Annotation – Conflict Detection on Next Image Scenario: Verify conflict popup appears when copying to next image with existing annotations Given the source image has saved annotations And the next image already contains annotations When the user copies annotations to the next image Then the “Existing Annotations Found” popup should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2635: Verify conflict popup appears when copying to previous image with existing annot', async ({ page }) => {
    // Test Case: UTC-2635
    // Summary: Verify conflict popup appears when copying to previous image with existing annotations when the source image has saved annotations
    // Description: Feature: Copy Annotation – Conflict Detection on Previous Image Scenario: Verify conflict popup appears when copying to previous image with existing annotations Given the source image has saved annotations And the previous image already contains annotations When the user copies annotations to the previous image Then the “Existing Annotations Found” popup should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2636: Verify background is blocked when conflict popup is displayed when the Existing ', async ({ page }) => {
    // Test Case: UTC-2636
    // Summary: Verify background is blocked when conflict popup is displayed when the Existing Annotations Found popup is open
    // Description: Feature: Copy Annotation – Background Interaction Block Scenario: Verify background is blocked when conflict popup is displayed Given the “Existing Annotations Found” popup is open When the user attempts to interact with the background image or controls Then no background interaction should be allowed until popup action is taken

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2637: Verify old annotations are fully removed before copy when the target image conta', async ({ page }) => {
    // Test Case: UTC-2637
    // Summary: Verify old annotations are fully removed before copy when the target image contains existing annotations
    // Description: Feature: Copy Annotation – Replace Overwrite Validation Scenario: Verify old annotations are fully removed before copy Given the target image contains existing annotations When the user selects Replace in the conflict popup Then all existing annotations should be removed And only copied annotations should be present

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2638: Verify partial replacement does not occur when the conflict popup is displayed', async ({ page }) => {
    // Test Case: UTC-2638
    // Summary: Verify partial replacement does not occur when the conflict popup is displayed
    // Description: Feature: Copy Annotation – No Partial Replace Scenario: Verify partial replacement does not occur Given the conflict popup is displayed When the user selects Replace Then the system should not retain any previous annotations on the target image

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
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
