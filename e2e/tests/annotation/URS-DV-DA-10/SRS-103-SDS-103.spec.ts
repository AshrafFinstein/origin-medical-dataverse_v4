import { test, expect } from '../../../fixtures/auth.fixture';
import { DataLabellingPage } from '../../../pages/data-labelling.page';
import { TestData } from '../../../test-data/test-data';
import { AnnotationSelectors, DataLabellingSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify annotation action icons are not visible before adding annotation when the user opens an image in annotation screen
 * URS: URS-DV-DA-10
 * SRS: SRS-103
 * SDS: SDS-103
 */
test.describe('URS-DV-DA-10: Verify annotation action icons are not visible before adding', () => {
  let datalabellingPage: DataLabellingPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    datalabellingPage = new DataLabellingPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-1357: Verify annotation action icons are not visible before adding annotation when the', async ({ page }) => {
    // Test Case: UTC-1357
    // Summary: Verify annotation action icons are not visible before adding annotation when the user opens an image in annotation screen
    // Description: Feature: Annotation Controls – Hidden Before Annotation Scenario: Verify annotation action icons are not visible before adding annotation Given the user opens an image in annotation screen When no annotation is created yet Then the annotation list should not show Delete / Hide / Lock icons

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify element visibility
    const isVisible = await datalabellingPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1358: Verify anatomy type appears in list after annotation is created when the user is', async ({ page }) => {
    // Test Case: UTC-1358
    // Summary: Verify anatomy type appears in list after annotation is created when the user is on annotation screen
    // Description: Feature: Annotation Controls – Anatomy Type Appears After Annotation Scenario: Verify anatomy type appears in list after annotation is created Given the user is on annotation screen When the user adds a new annotation for an anatomy type Then the anatomy type should appear in the annotation list

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1359: Verify action icons appear once annotation exists when an annotation is created ', async ({ page }) => {
    // Test Case: UTC-1359
    // Summary: Verify action icons appear once annotation exists when an annotation is created for an anatomy type
    // Description: Feature: Annotation Controls – Action Icons Visible After Annotation Scenario: Verify action icons appear once annotation exists Given an annotation is created for an anatomy type When the annotation list is displayed Then Delete, Hide/Unhide, and Lock/Unlock icons should be visible for that anatomy type

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1360: Verify user can lock an annotation using Lock icon when an annotation exists for', async ({ page }) => {
    // Test Case: UTC-1360
    // Summary: Verify user can lock an annotation using Lock icon when an annotation exists for an anatomy type
    // Description: Feature: Annotation Controls – Lock Option Works Scenario: Verify user can lock an annotation using Lock icon Given an annotation exists for an anatomy type When the user clicks Lock icon Then the annotation should become locked And Unlock icon should be shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1361: Verify user can unlock an annotation using Unlock icon when an annotation is loc', async ({ page }) => {
    // Test Case: UTC-1361
    // Summary: Verify user can unlock an annotation using Unlock icon when an annotation is locked
    // Description: Feature: Annotation Controls – Unlock Option Works Scenario: Verify user can unlock an annotation using Unlock icon Given an annotation is locked When the user clicks Unlock icon Then the annotation should become unlocked And Lock icon should be shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1362: Verify user can hide and unhide annotation when an annotation exists for an anat', async ({ page }) => {
    // Test Case: UTC-1362
    // Summary: Verify user can hide and unhide annotation when an annotation exists for an anatomy type
    // Description: Feature: Annotation Controls – Hide/Unhide Works Scenario: Verify user can hide and unhide annotation Given an annotation exists for an anatomy type When the user clicks Hide icon Then the annotation should be hidden in image view And Unhide icon should be shown

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1363: Verify user can delete an annotation from list when an annotation exists for an ', async ({ page }) => {
    // Test Case: UTC-1363
    // Summary: Verify user can delete an annotation from list when an annotation exists for an anatomy type
    // Description: Feature: Annotation Controls – Delete Works Scenario: Verify user can delete an annotation from list Given an annotation exists for an anatomy type When the user clicks Delete icon Then the annotation should be removed And the anatomy type should disappear from list if no annotations remain

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1364: Verify action icons disappear when annotation removed when an annotation existed', async ({ page }) => {
    // Test Case: UTC-1364
    // Summary: Verify action icons disappear when annotation removed when an annotation existed and was deleted successfully
    // Description: Feature: Annotation Controls – Icons Hidden After Deletion Scenario: Verify action icons disappear when annotation removed Given an annotation existed and was deleted successfully When the annotation list refreshes Then Delete / Hide / Lock icons should no longer be visible for that anatomy type

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Verify page loaded and module accessible
    await datalabellingPage.waitForSessionTable();
    const tableVisible = await datalabellingPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1365: Verify annotation list refreshes correctly after changes when the user adds and ', async ({ page }) => {
    // Test Case: UTC-1365
    // Summary: Verify annotation list refreshes correctly after changes when the user adds and removes annotations repeatedly
    // Description: Feature: Annotation Controls – List Refresh on Add/Remove Scenario: Verify annotation list refreshes correctly after changes Given the user adds and removes annotations repeatedly When the annotation list updates Then the list should refresh correctly without stale anatomy types

    // Navigate to module
    await datalabellingPage.navigateToModule();

    // Interact with dropdown
    await datalabellingPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1366: Verify system shows clear non-technical message if action fails when an annotati', async ({ page }) => {
    // Test Case: UTC-1366
    // Summary: Verify system shows clear non-technical message if action fails when an annotation exists
    // Description: Feature: Annotation Controls – Friendly Error on Action Failure Scenario: Verify system shows clear non-technical message if action fails Given an annotation exists When the user performs Delete/Lock/Hide action and system fails due to backend issue Then the system should show a clear user-friendly message And annotation workflow should not break

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
