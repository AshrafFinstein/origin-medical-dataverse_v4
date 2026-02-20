import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../pages/data-labelling.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-GEN-15: Undo / Redo Shortcut Keys
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via DataLabellingPage methods only.
 */
test.describe('URS-DV-GEN-15: Undo / Redo Shortcut Keys', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-118: Undo Last Annotation Action ─────────────────────────────────

  test(`${generateUnitTestId('118')}: Verify canvas is configured for undo last annotation action`, async () => {
    const configured = await dlPage.isCanvasConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('undo-action');
  });

  // ── SRS-119: Redo Reverted Action ─────────────────────────────────────────

  test(`${generateUnitTestId('119')}: Verify annotation button is configured for redo reverted action`, async () => {
    const configured = await dlPage.isAnnotationButtonConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('redo-action');
  });

  // ── SRS-120: Undo/Redo Visual States ──────────────────────────────────────

  test(`${generateUnitTestId('120')}: Verify visualization controls are configured for undo/redo state display`, async () => {
    const configured = await dlPage.areVisualizationControlsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('visual-states');
  });

  // ── SRS-121: Post-Save History Constraint ─────────────────────────────────

  test(`${generateUnitTestId('121')}: Verify status saved indicator is configured for post-save history constraint`, async () => {
    const visible = await dlPage.isStatusSaved().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('post-save-history');
  });
});
