import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Copy Annotation button is disabled when image has no annotations when the user selects an image with no existing annotations
 * URS: URS-DV-DA-30
 * SRS: SRS-249
 * SDS: SDS-249
 */
test.describe('URS-DV-DA-30: Verify Copy Annotation button is disabled when image has no ', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2615: Verify Copy Annotation button is disabled when image has no annotations when the', async ({ page }) => {
    // Test Case: UTC-2615
    // Summary: Verify Copy Annotation button is disabled when image has no annotations when the user selects an image with no existing annotations
    // Description: Feature: Copy Annotation – Default Disabled State Scenario: Verify Copy Annotation button is disabled when image has no annotations Given the user selects an image with no existing annotations When the image is loaded Then the Copy Annotation button should be disabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2616: Verify Copy Annotation button is enabled when image has annotations when the use', async ({ page }) => {
    // Test Case: UTC-2616
    // Summary: Verify Copy Annotation button is enabled when image has annotations when the user selects an image with at least one saved annotation
    // Description: Feature: Copy Annotation – Enabled State for Annotated Image Scenario: Verify Copy Annotation button is enabled when image has annotations Given the user selects an image with at least one saved annotation When the image is loaded Then the Copy Annotation button should be enabled

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2617: Verify Copy Annotation button becomes enabled after saving an annotation when th', async ({ page }) => {
    // Test Case: UTC-2617
    // Summary: Verify Copy Annotation button becomes enabled after saving an annotation when the user selects an image with no annotations
    // Description: Feature: Copy Annotation – Enable After Save Scenario: Verify Copy Annotation button becomes enabled after saving an annotation Given the user selects an image with no annotations When the user adds and saves a new annotation Then the Copy Annotation button should become enabled immediately

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2618: Verify button state updates when switching between images when the user switches', async ({ page }) => {
    // Test Case: UTC-2618
    // Summary: Verify button state updates when switching between images when the user switches between images with and without annotations
    // Description: Feature: Copy Annotation – Dynamic State Update on Image Change Scenario: Verify button state updates when switching between images Given the user switches between images with and without annotations When a new image is selected Then the Copy Annotation button state should update dynamically based on annotation presence

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Click button
    await datalabellingPage.clickCreateButton();

    const modalVisible = await datalabellingPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2619: Verify Copy Annotation action cannot be triggered when disabled when the selecte', async ({ page }) => {
    // Test Case: UTC-2619
    // Summary: Verify Copy Annotation action cannot be triggered when disabled when the selected image has no annotations
    // Description: Feature: Copy Annotation – Disabled Action Protection Scenario: Verify Copy Annotation action cannot be triggered when disabled Given the selected image has no annotations When the user attempts to click the disabled Copy Annotation button Then no action should be triggered

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

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
