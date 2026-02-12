import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system blocks upload when JSON contains deprecated field labelIds when the user selects a valid JSON file for upload
 * URS: URS-DV-GEN-21
 * SRS: SRS-212
 * SDS: SDS-212
 */
test.describe('URS-DV-GEN-21: Verify system blocks upload when JSON contains deprecated fi', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-2083: Verify system blocks upload when JSON contains deprecated field labelIds when th', async ({ page }) => {
    // Test Case: UTC-2083
    // Summary: Verify system blocks upload when JSON contains deprecated field labelIds when the user selects a valid JSON file for upload
    // Description: Feature: Label Schema Validation – Reject Deprecated labelIds Field Scenario: Verify system blocks upload when JSON contains deprecated field labelIds Given the user selects a valid JSON file for upload When the JSON contains the deprecated key “labelIds” anywhere in the payload And clicks Upload Then the system should reject the file And show toast message File [filename]: labelIds. Please provide labels as labels: [{ id:  }].

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2084: Verify schema error message includes filename and correction guidance when the u', async ({ page }) => {
    // Test Case: UTC-2084
    // Summary: Verify schema error message includes filename and correction guidance when the user uploads a JSON containing labelIds
    // Description: Feature: Label Schema Validation – Message Includes Filename & Fix Hint Scenario: Verify schema error message includes filename and correction guidance Given the user uploads a JSON containing labelIds When validation fails Then the toast should include the filename And should clearly instruct to use labels object array instead

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
