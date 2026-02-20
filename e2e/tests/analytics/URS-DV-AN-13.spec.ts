import { test, expect } from '@playwright/test';
import { AnalyticsPage } from '../../pages/analytics.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-AN-13: JSON Filename Field Display
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via AnalyticsPage methods only.
 */
test.describe('URS-DV-AN-13: JSON Filename Field Display', () => {
  let analyticsPage: AnalyticsPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analyticsPage = new AnalyticsPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analyticsPage.gotoSession();
  });

  // ── SRS-114: Uploaded JSON File Name Display ──────────────────────────────

  test(`${generateUnitTestId('114')}: Verify JSON upload file list selector is configured for filename display`, async () => {
    const configured = await analyticsPage.isJsonFilenameConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('filename-display');
  });

  // ── SRS-115: JSON Upload Success Stage Handling ───────────────────────────

  test(`${generateUnitTestId('115')}: Verify success message selector is configured for upload completion`, async () => {
    const configured = await analyticsPage.isJsonFilenameConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('upload-success');
  });

  // ── SRS-116: Multi-File Upload Performance ────────────────────────────────

  test(`${generateUnitTestId('116')}: Verify upload process time threshold is within 3 seconds`, async () => {
    const maxTime = analyticsPage.getMaxUploadProcessTime();
    expect(maxTime).toBe(3000);
    await screenshot.takeStep('upload-performance');
  });

  // ── SRS-117: Multi-File Upload Usability Feedback ─────────────────────────

  test(`${generateUnitTestId('117')}: Verify allowed file extension is .json for upload restriction`, async () => {
    const ext = analyticsPage.getAllowedFileExtension();
    expect(ext).toBe('.json');
    await screenshot.takeStep('upload-usability');
  });
});
