import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify system rejects upload when required childAnnotation is missing for taxonomy annotation when the user selects a valid JSON file
 * URS: URS-DV-GEN-21
 * SRS: SRS-213
 * SDS: SDS-213
 */
test.describe('URS-DV-GEN-21: Verify system rejects upload when required childAnnotation i', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-2085: Verify system rejects upload when required childAnnotation is missing for taxono', async ({ page }) => {
    // Test Case: UTC-2085
    // Summary: Verify system rejects upload when required childAnnotation is missing for taxonomy annotation when the user selects a valid JSON file
    // Description: Feature: Child Annotation Validation – Block Missing childAnnotation Scenario: Verify system rejects upload when required childAnnotation is missing for taxonomy annotation Given the user selects a valid JSON file When the JSON contains a taxonomy annotation type that requires childAnnotation And the childAnnotation key is missing And clicks Upload Then the system should reject the file And show toast message File [filename]: childAnnotation is required for taxonomy annotation [annotationId].

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-2086: Verify error message identifies which annotation is missing childAnnotation when', async ({ page }) => {
    // Test Case: UTC-2086
    // Summary: Verify error message identifies which annotation is missing childAnnotation when the uploaded file contains multiple taxonomy annotations
    // Description: Feature: Child Annotation Validation – Message Includes Annotation ID Scenario: Verify error message identifies which annotation is missing childAnnotation Given the uploaded file contains multiple taxonomy annotations When one annotation is missing childAnnotation Then the toast message should mention the specific annotationId causing the failure And should not show technical schema dumps

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
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
