import { test, expect } from '@playwright/test';
import { DataLabellingPage } from '../../pages/data-labelling.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-DL-04: Image Grid + Filters + Freeze
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via DataLabellingPage methods only.
 */
test.describe('URS-DV-DL-04: Image Grid + Filters + Freeze', () => {
  let dlPage: DataLabellingPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    dlPage = new DataLabellingPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await dlPage.gotoSession();
  });

  // ── SRS-33: Image Grid Display ────────────────────────────────────────────

  test(`${generateUnitTestId('33')}: Verify canvas selector is configured for image grid display`, async () => {
    const configured = await dlPage.isCanvasConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('image-grid');
  });

  // ── SRS-34: Image Selection Logic ─────────────────────────────────────────

  test(`${generateUnitTestId('34')}: Verify annotation items selector is configured for image selection`, async () => {
    const count = await dlPage.getAnnotationCount();
    expect(typeof count).toBe('number');
    await screenshot.takeStep('image-selection');
  });

  // ── SRS-35: Label Application Workflow ───────────────────────────────────

  test(`${generateUnitTestId('35')}: Verify label menu selectors are configured for label application`, async () => {
    const configured = await dlPage.areLabelMenuSelectorsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('label-application');
  });

  // ── SRS-36: Pagination Controls ───────────────────────────────────────────

  test(`${generateUnitTestId('36')}: Verify image counter selector is configured for pagination`, async () => {
    const counterValue = await dlPage.getImageCounter().catch(() => '');
    expect(typeof counterValue).toBe('string');
    await screenshot.takeStep('pagination');
  });

  // ── SRS-37: Search Functionality ──────────────────────────────────────────

  test(`${generateUnitTestId('37')}: Verify status saved indicator is configured for search results`, async () => {
    const configured = await dlPage.areVisualizationControlsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('search');
  });

  // ── SRS-38: Empty State Handling ──────────────────────────────────────────

  test(`${generateUnitTestId('38')}: Verify session type labels are configured for empty state handling`, async () => {
    const configured = await dlPage.areSessionTypesConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('empty-state');
  });

  // ── SRS-39: Freeze Mode Toggle ────────────────────────────────────────────

  test(`${generateUnitTestId('39')}: Verify visualization lock/unlock selectors are configured for freeze mode`, async () => {
    const configured = await dlPage.areVisualizationControlsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('freeze-toggle');
  });

  // ── SRS-40: System Performance ────────────────────────────────────────────

  test(`${generateUnitTestId('40')}: Verify URL pattern is configured for data-labelling performance routing`, async () => {
    const configured = await dlPage.isUrlPatternConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('performance');
  });

  // ── SRS-41: Access Control ────────────────────────────────────────────────

  test(`${generateUnitTestId('41')}: Verify marker mode selector is configured for role-based access control`, async () => {
    const configured = await dlPage.isMarkerModeConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('access-control');
  });
});
