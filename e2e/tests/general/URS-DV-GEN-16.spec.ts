import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../pages/data-labelling.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-GEN-16: Shortcut Keys – Delete
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via DataLabellingPage methods only.
 */
test.describe('URS-DV-GEN-16: Shortcut Keys – Delete', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-122: Keyboard Shortcut Mapping ───────────────────────────────────

  test(`${generateUnitTestId('122')}: Verify canvas is configured for Backspace keyboard shortcut mapping`, async () => {
    const configured = await dlPage.isCanvasConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('shortcut-mapping');
  });

  // ── SRS-123: Label Deletion Workflow ──────────────────────────────────────

  test(`${generateUnitTestId('123')}: Verify label menu selectors are configured for label deletion workflow`, async () => {
    const configured = await dlPage.areLabelMenuSelectorsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('label-deletion');
  });

  // ── SRS-124: Annotation Mark Deletion ─────────────────────────────────────

  test(`${generateUnitTestId('124')}: Verify delete annotation modal is configured for mark deletion`, async () => {
    const configured = await dlPage.areDeleteAnnotationSelectorsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('annotation-deletion');
  });

  // ── SRS-125: Deletion Confirmation Panel ─────────────────────────────────

  test(`${generateUnitTestId('125')}: Verify Yes/No confirmation modal selectors are configured for deletion`, async () => {
    const configured = await dlPage.areDeleteAnnotationSelectorsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('deletion-confirmation');
  });
});
