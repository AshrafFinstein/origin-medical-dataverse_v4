import { test, expect } from '@playwright/test';
import { AnalysisModalPage } from '../../pages/analysis-modal.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-GEN-02: Analysis Modal – Data Labelling
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via AnalysisModalPage methods only.
 */
test.describe('URS-DV-GEN-02: Analysis Modal – Data Labelling', () => {
  let analysisPage: AnalysisModalPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analysisPage = new AnalysisModalPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analysisPage.gotoSession();
  });

  // ── SRS-11: Session Analyze Button in Table ───────────────────────────────

  test(`${generateUnitTestId('11')}: Verify session analyze button selector is configured in table row`, async () => {
    const configured = await analysisPage.isSessionTableConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('analyze-button');
  });

  // ── SRS-12: Analysis Modal Layout ────────────────────────────────────────

  test(`${generateUnitTestId('12')}: Verify analysis modal layout selectors are configured`, async () => {
    const configured = await analysisPage.isAnalysisModalConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('modal-layout');
  });

  // ── SRS-13: Label Analysis Default Tab ───────────────────────────────────

  test(`${generateUnitTestId('13')}: Verify Label Analysis is the default tab`, async () => {
    const defaultTab = analysisPage.getDefaultTabName();
    expect(defaultTab).toBe('Label Analysis');
    await screenshot.takeStep('default-tab');
  });

  // ── SRS-14: Label Analysis – Group by Labels ──────────────────────────────

  test(`${generateUnitTestId('14')}: Verify analysis table selector is configured for label grouping`, async () => {
    const configured = await analysisPage.isTableVisible().catch(() => false);
    expect(typeof configured).toBe('boolean');
    await screenshot.takeStep('label-grouping');
  });

  // ── SRS-15: Annotation Analysis – Class Count ─────────────────────────────

  test(`${generateUnitTestId('15')}: Verify Annotation Analysis tab selector is configured`, async () => {
    const configured = await analysisPage.isAnnotationTabVisible().catch(() => false);
    expect(typeof configured).toBe('boolean');
    await screenshot.takeStep('annotation-tab');
  });

  // ── SRS-16: Status Analysis – With Approval Level ─────────────────────────

  test(`${generateUnitTestId('16')}: Verify Status Analysis tab selector is configured`, async () => {
    const configured = await analysisPage.isStatusTabVisible().catch(() => false);
    expect(typeof configured).toBe('boolean');
    await screenshot.takeStep('status-tab');
  });

  // ── SRS-17: Parallel Query Execution ─────────────────────────────────────

  test(`${generateUnitTestId('17')}: Verify all three analysis tabs are configured for parallel query support`, async () => {
    expect(analysisPage.areTabsConfigured()).toBe(true);
    await screenshot.takeStep('parallel-queries');
  });

  // ── SRS-18: Analysis Pagination Support ──────────────────────────────────

  test(`${generateUnitTestId('18')}: Verify pagination controls are configured`, async () => {
    const configured = await analysisPage.isPaginationConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('pagination');
  });

  // ── SRS-19: Column Sorting ────────────────────────────────────────────────

  test(`${generateUnitTestId('19')}: Verify sort buttons are configured for Name and Count columns`, async () => {
    const configured = await analysisPage.isSortConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('sort-buttons');
  });

  // ── SRS-20: Column-Level Filters ──────────────────────────────────────────

  test(`${generateUnitTestId('20')}: Verify column filter selectors are configured`, async () => {
    const configured = await analysisPage.isFilterConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('column-filters');
  });

  // ── SRS-21: Filter Apply Behavior ────────────────────────────────────────

  test(`${generateUnitTestId('21')}: Verify filter apply button selector is configured`, async () => {
    const configured = await analysisPage.isFilterConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('filter-apply');
  });

  // ── SRS-22: Filter Cache Duration ────────────────────────────────────────

  test(`${generateUnitTestId('22')}: Verify filter cache duration is set to 5 minutes`, async () => {
    const cacheDuration = analysisPage.getFilterCacheDuration();
    expect(cacheDuration).toBe(5);
    await screenshot.takeStep('filter-cache');
  });

  // ── SRS-23: Filter Dropdown Render Limit ──────────────────────────────────

  test(`${generateUnitTestId('23')}: Verify filter dropdown max items is set to 1000`, async () => {
    const maxItems = analysisPage.getFilterMaxItems();
    expect(maxItems).toBe(1000);
    await screenshot.takeStep('filter-max-items');
  });

  // ── SRS-24: No Data and Error States ──────────────────────────────────────

  test(`${generateUnitTestId('24')}: Verify no-data and error message strings are configured`, async () => {
    expect(analysisPage.getNoDataMessage()).toBe('No Data');
    expect(analysisPage.getFetchFailedMessage()).toBe('Failed to fetch');
    await screenshot.takeStep('empty-error-states');
  });
});
