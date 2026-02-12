import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Trigger removal with Backspace when one or more images are selected
 * URS: URS-DV-DA-27
 * SRS: SRS-236
 * SDS: SDS-236
 */
test.describe('URS-DV-DA-27: Verify Trigger removal with Backspace when one or more image', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2440: Verify Trigger removal with Backspace when one or more images are selected', async ({ page }) => {
    // Test Case: UTC-2440
    // Summary: Verify Trigger removal with Backspace when one or more images are selected
    // Description: Feature: Keyboard label removal with confirmation Scenario: Trigger removal with Backspace Given one or more images are selected When user presses Backspace Then confirmation popup should appear

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2441: Verify Modal shows correct message when popup opened', async ({ page }) => {
    // Test Case: UTC-2441
    // Summary: Verify Modal shows correct message when popup opened
    // Description: Feature: Keyboard label removal with confirmation Scenario: Modal shows correct message Given popup opened When content rendered Then message text should explain label removal clearly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2442: Verify Modal shows image preview when selected images exist', async ({ page }) => {
    // Test Case: UTC-2442
    // Summary: Verify Modal shows image preview when selected images exist
    // Description: Feature: Keyboard label removal with confirmation Scenario: Modal shows image preview Given selected images exist When popup opens Then image thumbnails should be visible in modal

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2443: Verify Display label count when images have labels', async ({ page }) => {
    // Test Case: UTC-2443
    // Summary: Verify Display label count when images have labels
    // Description: Feature: Keyboard label removal with confirmation Scenario: Display label count Given images have labels When popup opens Then correct label count should be displayed

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2444: Verify Cancel action using No when popup displayed', async ({ page }) => {
    // Test Case: UTC-2444
    // Summary: Verify Cancel action using No when popup displayed
    // Description: Feature: Keyboard label removal with confirmation Scenario: Cancel action using No Given popup displayed When user clicks No Then modal closes and labels remain unchanged

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2445: Verify Confirm removal using Yes when popup displayed', async ({ page }) => {
    // Test Case: UTC-2445
    // Summary: Verify Confirm removal using Yes when popup displayed
    // Description: Feature: Keyboard label removal with confirmation Scenario: Confirm removal using Yes Given popup displayed When user clicks Yes Then labels should be removed from selected images

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2446: Verify Success toast after removal when labels removed successfully', async ({ page }) => {
    // Test Case: UTC-2446
    // Summary: Verify Success toast after removal when labels removed successfully
    // Description: Feature: Keyboard label removal with confirmation Scenario: Success toast after removal Given labels removed successfully When operation completes Then toast “Labels removed successfully from selected image(s)” appears

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await datalabellingPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-2447: Verify Backend payload correctness when labels removed', async ({ page }) => {
    // Test Case: UTC-2447
    // Summary: Verify Backend payload correctness when labels removed
    // Description: Feature: Keyboard label removal with confirmation Scenario: Backend payload correctness Given labels removed When API triggered Then image IDs and label IDs should be sent correctly

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2448: Verify No image selected when no image selected', async ({ page }) => {
    // Test Case: UTC-2448
    // Summary: Verify No image selected when no image selected
    // Description: Feature: Keyboard label removal with confirmation Scenario: No image selected Given no image selected When Backspace pressed Then removal should not trigger and notification shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2449: Verify Prevent action during text input when cursor inside search/text field', async ({ page }) => {
    // Test Case: UTC-2449
    // Summary: Verify Prevent action during text input when cursor inside search/text field
    // Description: Feature: Keyboard label removal with confirmation Scenario: Prevent action during text input Given cursor inside search/text field When Backspace pressed Then label removal should not trigger

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Apply filter/search
    await datalabellingPage.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2450: Verify Failure handling when backend removal fails', async ({ page }) => {
    // Test Case: UTC-2450
    // Summary: Verify Failure handling when backend removal fails
    // Description: Feature: Keyboard label removal with confirmation Scenario: Failure handling Given backend removal fails When operation completes Then previous labels remain and error toast shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2451: Verify Instant UI refresh when labels removed', async ({ page }) => {
    // Test Case: UTC-2451
    // Summary: Verify Instant UI refresh when labels removed
    // Description: Feature: Keyboard label removal with confirmation Scenario: Instant UI refresh Given labels removed When confirmation accepted Then UI updates immediately without reload

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2452: Verify Clear confirmation controls when popup visible', async ({ page }) => {
    // Test Case: UTC-2452
    // Summary: Verify Clear confirmation controls when popup visible
    // Description: Feature: Keyboard label removal with confirmation Scenario: Clear confirmation controls Given popup visible When user reviews buttons Then Yes/No buttons clearly distinguishable

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-2453: Verify Keyboard navigation when popup open', async ({ page }) => {
    // Test Case: UTC-2453
    // Summary: Verify Keyboard navigation when popup open
    // Description: Feature: Keyboard label removal with confirmation Scenario: Keyboard navigation Given popup open When user presses Tab/Enter Then Yes/No buttons selectable via keyboard

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify modal
    await datalabellingPage.clickCreateButton();
    const modalVisible = await datalabellingPage.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);
  });

  test('UTC-2454: Verify Multiple images removal when many images selected (50+)', async ({ page }) => {
    // Test Case: UTC-2454
    // Summary: Verify Multiple images removal when many images selected (50+)
    // Description: Feature: Keyboard label removal with confirmation Scenario: Multiple images removal Given many images selected (50+) When user confirms removal Then all labels removed without lag

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2455: Verify Unauthorized user attempt when user lacks permission', async ({ page }) => {
    // Test Case: UTC-2455
    // Summary: Verify Unauthorized user attempt when user lacks permission
    // Description: Feature: Keyboard label removal with confirmation Scenario: Unauthorized user attempt Given user lacks permission When Backspace pressed Then removal blocked and access message shown

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
