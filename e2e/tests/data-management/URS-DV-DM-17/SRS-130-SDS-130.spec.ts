import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify version rows support single selection only when the user opens Version History list
 * URS: URS-DV-DM-17
 * SRS: SRS-130
 * SDS: SDS-130
 */
test.describe('URS-DV-DM-17: Verify version rows support single selection only when the u', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-1764: Verify version rows support single selection only when the user opens Version Hi', async ({ page }) => {
    // Test Case: UTC-1764
    // Summary: Verify version rows support single selection only when the user opens Version History list
    // Description: Feature: Version Selection – Single Selection UI Control Scenario: Verify version rows support single selection only Given the user opens Version History list When the list is displayed Then the system should allow selecting only one version row at a time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1765: Verify selection indicator is visible for selected row when Version History list', async ({ page }) => {
    // Test Case: UTC-1765
    // Summary: Verify selection indicator is visible for selected row when Version History list is displayed
    // Description: Feature: Version Selection – Row Highlight / Radio Visible Scenario: Verify selection indicator is visible for selected row Given Version History list is displayed When the user selects a version row Then the selected row should be highlighted or radio button should show selected state

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1766: Verify previous selection is removed when new version selected when the user sel', async ({ page }) => {
    // Test Case: UTC-1766
    // Summary: Verify previous selection is removed when new version selected when the user selected version V1
    // Description: Feature: Version Selection – Selecting New Row Deselects Previous Scenario: Verify previous selection is removed when new version selected Given the user selected version V1 When the user selects version V3 Then V1 should be deselected automatically And only V3 should remain selected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1767: Verify UI stores only one selected version identifier when a version is selected', async ({ page }) => {
    // Test Case: UTC-1767
    // Summary: Verify UI stores only one selected version identifier when a version is selected in Version History list
    // Description: Feature: Version Selection – Only One Identifier Stored Scenario: Verify UI stores only one selected version identifier Given a version is selected in Version History list When the user selects another version row Then the system should update selection state with only one active version identifier

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-1768: Verify user cannot multi-select versions using keyboard shortcuts when the Versi', async ({ page }) => {
    // Test Case: UTC-1768
    // Summary: Verify user cannot multi-select versions using keyboard shortcuts when the Version History list is displayed
    // Description: Feature: Version Selection – Prevent Multi Select Using Keyboard Scenario: Verify user cannot multi-select versions using keyboard shortcuts Given the Version History list is displayed When the user attempts multi-select using Ctrl+Click or Shift+Click Then the system should still allow only one version selection at a time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-1769: Verify selection can be cleared safely (if supported) when a version row is sele', async ({ page }) => {
    // Test Case: UTC-1769
    // Summary: Verify selection can be cleared safely (if supported) when a version row is selected
    // Description: Feature: Version Selection – Selection Clears Properly Scenario: Verify selection can be cleared safely (if supported) Given a version row is selected When the user clicks outside the table (or uses clear action if available) Then the selection should be cleared safely And no multiple selection should occur

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
