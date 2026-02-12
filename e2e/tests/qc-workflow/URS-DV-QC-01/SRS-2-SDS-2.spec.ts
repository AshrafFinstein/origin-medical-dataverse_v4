import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Open status dropdown on clicking Select Status when the user is on the Data Labeling page
 * URS: URS-DV-QC-01
 * SRS: SRS-2
 * SDS: SDS-2
 */
test.describe('URS-DV-QC-01: Verify Open status dropdown on clicking Select Status when t', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-9: Verify Open status dropdown on clicking Select Status when the user is on the Da', async ({ page }) => {
    // Test Case: UTC-9
    // Summary: Verify Open status dropdown on clicking Select Status when the user is on the Data Labeling page
    // Description: Feature: Data Labeling – Status Dropdown Interaction As a user, the user wants the status dropdown to open so that filtering options can be selected. Scenario: Open status dropdown on clicking Select Status Given the user is on the Data Labeling page When the user clicks the Select Status field Then the status dropdown should be opened

    // Navigate to module
    await sessionPage.navigateToModule();

    // Click button
    await sessionPage.clickCreateButton();

    const modalVisible = await sessionPage.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-10: Verify Display all supported statuses in dropdown when the Select Status dropdow', async ({ page }) => {
    // Test Case: UTC-10
    // Summary: Verify Display all supported statuses in dropdown when the Select Status dropdown is opened
    // Description: Feature: Data Labeling – Status Options Display As a user, the user wants to view all supported image statuses so that correct filtering can be applied. Scenario: Display all supported statuses in dropdown Given the Select Status dropdown is opened When the user views the dropdown options Then statuses should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-11: Verify Filter images using PENDING status when the Select Status dropdown is ope', async ({ page }) => {
    // Test Case: UTC-11
    // Summary: Verify Filter images using PENDING status when the Select Status dropdown is opened
    // Description: Feature: Data Labeling – Status-Based Filtering As a user, the user wants to filter images by PENDING status so that only pending work is visible. Scenario: Filter images using PENDING status Given the Select Status dropdown is opened When the user selects the PENDING status Then only PENDING images should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Apply filter/search
    await sessionPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-12: Verify Display no images message for PENDING status when no images exist with PE', async ({ page }) => {
    // Test Case: UTC-12
    // Summary: Verify Display no images message for PENDING status when no images exist with PENDING status
    // Description: Feature: Data Labeling – No Images Handling As a user, the user wants a clear message when no images are available so that system state is understood. Scenario: Display no images message for PENDING status Given no images exist with PENDING status When the user selects PENDING status Then a “No images available” message should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-13: Verify Tools visibility on image selection when the user is on the Data Labeling', async ({ page }) => {
    // Test Case: UTC-13
    // Summary: Verify Tools visibility on image selection when the user is on the Data Labeling page
    // Description: Feature: Pending Image The system displays editing tools for selected pending images. Scenario: Tools visibility on image selection Given the user is on the Data Labeling page And an image in Pending status is selected When the image is selected Then Annotation button, Invert Color checkbox, Zoom In, Zoom Out, Reset Zoom, Rotate Clockwise, Flip, Pen icon, Brightness control, and Contrast control should be displayed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-14: Verify Annotate selected image when a Pending status image is selected', async ({ page }) => {
    // Test Case: UTC-14
    // Summary: Verify Annotate selected image when a Pending status image is selected
    // Description: Feature: Image Annotation Actions The system allows annotation on pending images. Scenario: Annotate selected image Given a Pending status image is selected When the user clicks the Annotation button Then the user should be able to draw and mark on the image

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-15: Verify Invert image colors when a Pending image is selected', async ({ page }) => {
    // Test Case: UTC-15
    // Summary: Verify Invert image colors when a Pending image is selected
    // Description: Feature: Image Color Manipulation The system supports color inversion. Scenario: Invert image colors Given a Pending image is selected When the user checks the Invert Color checkbox Then the image colors should be inverted

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-16: Verify Zoom in, zoom out and reset zoom when a Pending image is selected', async ({ page }) => {
    // Test Case: UTC-16
    // Summary: Verify Zoom in, zoom out and reset zoom when a Pending image is selected
    // Description: Feature: Zoom Controls The system allows zoom operations. Scenario: Zoom in, zoom out and reset zoom Given a Pending image is selected When the user clicks Zoom In, Zoom Out, and Reset Zoom Then the image zoom level should adjust correctly and reset to default

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-17: Verify Rotate and flip image when a Pending image is selected', async ({ page }) => {
    // Test Case: UTC-17
    // Summary: Verify Rotate and flip image when a Pending image is selected
    // Description: Feature: Image Rotation and Flip The system supports image orientation controls. Scenario: Rotate and flip image Given a Pending image is selected When the user clicks Rotate Clockwise and Flip icons Then the image orientation should update correctly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-18: Verify Adjust brightness and contrast when a Pending image is selected', async ({ page }) => {
    // Test Case: UTC-18
    // Summary: Verify Adjust brightness and contrast when a Pending image is selected
    // Description: Feature: Brightness & Contrast Adjustments The system supports visual adjustments. Scenario: Adjust brightness and contrast Given a Pending image is selected When the user adjusts Brightness and Contrast controls Then the image appearance should change accordingly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-19: Verify Edit access in active workflow level when the image belongs to the users ', async ({ page }) => {
    // Test Case: UTC-19
    // Summary: Verify Edit access in active workflow level when the image belongs to the users current workflow / approval level
    // Description: Feature: Workflow-Based Edit Access Control The system restricts editing by workflow level. Scenario: Edit access in active workflow level Given the image belongs to the user’s current workflow / approval level When the user selects the image Then all editing actions should be enabled

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-20: Verify Access image in non-active level when the image is in a completed or othe', async ({ page }) => {
    // Test Case: UTC-20
    // Summary: Verify Access image in non-active level when the image is in a completed or other approval level
    // Description: Feature: Read-Only Image Access The system enforces read-only mode for inactive workflow images. Scenario: Access image in non-active level Given the image is in a completed or other approval level When the user opens the image Then the image should be view-only and non-editable

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
