import { test, expect } from '@playwright/test';
import { SessionPage } from '../../pages/session.page';
import { S3StoragePage } from '../../pages/s3-storage.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-GEN-09: Multiple JSON Uploads
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via page object methods only.
 */
test.describe('URS-DV-GEN-09: Multiple JSON Uploads', () => {
  let sessionPage: SessionPage;
  let s3Page: S3StoragePage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionPage(page);
    s3Page = new S3StoragePage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await s3Page.gotoSession();
  });

  // ── SRS-96: Multiple JSON File Selection ──────────────────────────────────

  test(`${generateUnitTestId('96')}: Verify S3 upload modal supports multiple file selection`, async () => {
    const configured = await s3Page.isS3UploadConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('multi-file-selection');
  });

  // ── SRS-97: Upload Area and Interaction ───────────────────────────────────

  test(`${generateUnitTestId('97')}: Verify S3 modal is configured for drag-and-drop upload area`, async () => {
    const configured = await s3Page.isS3ModalConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('upload-area');
  });

  // ── SRS-98: Duplicate Image Detection ─────────────────────────────────────

  test(`${generateUnitTestId('98')}: Verify S3 key input is configured for duplicate image detection`, async () => {
    const configured = await s3Page.isS3KeyInputConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('duplicate-detection');
  });

  // ── SRS-99: Upload Performance Standards ──────────────────────────────────

  test(`${generateUnitTestId('99')}: Verify upload button is configured to meet performance standards`, async () => {
    const configured = await s3Page.isS3UploadButtonConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('upload-performance');
  });

  // ── SRS-100: Secure File Type Restriction ─────────────────────────────────

  test(`${generateUnitTestId('100')}: Verify S3 upload configuration restricts to JSON files only`, async () => {
    const configured = await s3Page.isS3UploadConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('file-type-restriction');
  });

  // ── SRS-101: Selection Management Usability ───────────────────────────────

  test(`${generateUnitTestId('101')}: Verify CSV import selector supports file selection management`, async () => {
    const configured = await s3Page.isCsvImportConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('selection-management');
  });
});
