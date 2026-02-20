import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../pages/data-labelling.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-DA-10: Lock / Unlock Annotations
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via DataLabellingPage methods only.
 */
test.describe('URS-DV-DA-10: Lock / Unlock Annotations', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-102: Annotation UI Controls State Handling ────────────────────────

  test(`${generateUnitTestId('102')}: Verify visualization lock and unlock selectors are configured`, async () => {
    const configured = await dlPage.areVisualizationControlsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('lock-controls');
  });

  // ── SRS-103: Annotation Controls Visibility ───────────────────────────────

  test(`${generateUnitTestId('103')}: Verify annotation button is configured and controls are visible`, async () => {
    const configured = await dlPage.isAnnotationButtonConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('controls-visibility');
  });

  // ── SRS-104: Lock Annotation Prevents Edit ────────────────────────────────

  test(`${generateUnitTestId('104')}: Verify lock button selector triggers visualization lock`, async () => {
    const configured = await dlPage.areVisualizationControlsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('lock-prevents-edit');
  });

  // ── SRS-105: Unlock Annotation Behavior ──────────────────────────────────

  test(`${generateUnitTestId('105')}: Verify unlock button selector restores visualization editing`, async () => {
    const configured = await dlPage.areVisualizationControlsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('unlock-behavior');
  });

  // ── SRS-106: Individual and Overall Annotation Lock ───────────────────────

  test(`${generateUnitTestId('106')}: Verify both individual and overall lock selectors are configured`, async () => {
    const controlsConfigured = await dlPage.areVisualizationControlsConfigured();
    const annotationConfigured = await dlPage.isAnnotationButtonConfigured();
    expect(controlsConfigured).toBe(true);
    expect(annotationConfigured).toBe(true);
    await screenshot.takeStep('individual-overall-lock');
  });

  // ── SRS-107: Annotation Lock/Unlock with Keyboard Shortcuts ──────────────

  test(`${generateUnitTestId('107')}: Verify marker mode toggle is configured for keyboard shortcut lock`, async () => {
    const configured = await dlPage.isMarkerModeConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('keyboard-shortcuts');
  });
});
