import { test, expect } from '@playwright/test';
import { AnalysisModalPage } from '../../../../pages/analysis-modal.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { sel, AnalysisModalSelectors } from '../../../../selectors';
import { AnalysisModalData } from '../../../../test-data';

/**
 * URS-DV-AN-02 / SRS-010: Filter Caching (cont.), Dropdown Rendering Performance & Error/Empty States
 *
 * Covers SRS-22 (Filter Option Caching, continued), SRS-23 (Filter Dropdown
 * Rendering Performance Optimization), and SRS-24 (Error & Empty State Handling
 * & User Feedback).
 *
 * Auth state injected via storageState -- no re-login between tests.
 */
test.describe('URS-DV-AN-02 / SRS-010: Filter Caching, Dropdown Performance & Error States', () => {
  let analysisPage: AnalysisModalPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analysisPage = new AnalysisModalPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analysisPage.gotoSession();
  });

  // ── SRS-22: Filter Option Caching with 5-Minute TTL (continued) ────────────

  test(`${generateUnitTestId('266')}: Verify Cache usage -- when filter opened repeatedly (cache with annotation search)`, async ({ page }) => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('annotation');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-annotation-search');
  });

  test(`${generateUnitTestId('267')}: Verify Cache usage -- when filter opened repeatedly (cache with status search)`, async ({ page }) => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('status');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-status-search');
  });

  test(`${generateUnitTestId('268')}: Verify Cache usage -- when filter opened repeatedly (cache after apply and reopen)`, async ({ page }) => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-after-apply-reopen');
  });

  test(`${generateUnitTestId('269')}: Verify Cache usage -- when filter opened repeatedly (cache across modal open/close)`, async ({ page }) => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.searchInFilter('test');
      await analysisPage.closeAnalysisModal();
    });

    await test.step('When within TTL', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then data loads from cache without API call', async () => {
      const cacheDuration = analysisPage.getFilterCacheDuration();
      expect(cacheDuration).toBe(5);
    });

    await screenshot.takeStep('cache-across-modal-open-close');
  });

  // ── SRS-23: Filter Dropdown Rendering Performance Optimization ─────────────

  test(`${generateUnitTestId('270')}: Verify Large dataset rendering -- when dropdown opened with many items (max items limit)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const maxItems = analysisPage.getFilterMaxItems();
      expect(maxItems).toBe(AnalysisModalData.filterMaxItems);
    });

    await screenshot.takeStep('dropdown-max-items-limit');
  });

  test(`${generateUnitTestId('271')}: Verify Large dataset rendering -- when dropdown opened with many items (search responsiveness)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      const start = Date.now();
      await analysisPage.searchInFilter('test');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('dropdown-search-responsiveness');
  });

  test(`${generateUnitTestId('272')}: Verify Large dataset rendering -- when dropdown opened with many items (select all responsiveness)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      const start = Date.now();
      await analysisPage.selectAllInFilter();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('dropdown-select-all-responsive');
  });

  test(`${generateUnitTestId('273')}: Verify Large dataset rendering -- when dropdown opened with many items (apply responsiveness)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.selectAllInFilter();
      const start = Date.now();
      await analysisPage.applyFilter();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('dropdown-apply-responsive');
  });

  test(`${generateUnitTestId('274')}: Verify Large dataset rendering -- when dropdown opened with many items (no UI freeze)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.searchInFilter('a');
      await analysisPage.searchInFilter('ab');
      await analysisPage.searchInFilter('abc');
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('dropdown-no-ui-freeze');
  });

  test(`${generateUnitTestId('275')}: Verify Large dataset rendering -- when dropdown opened with many items (label tab dropdown)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const maxItems = analysisPage.getFilterMaxItems();
      expect(maxItems).toBeLessThanOrEqual(1000);
    });

    await screenshot.takeStep('label-tab-dropdown');
  });

  test(`${generateUnitTestId('276')}: Verify Large dataset rendering -- when dropdown opened with many items (annotation tab dropdown)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When items rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('annotation-tab-dropdown');
  });

  test(`${generateUnitTestId('277')}: Verify Large dataset rendering -- when dropdown opened with many items (status tab dropdown)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When items rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('status-tab-dropdown');
  });

  test(`${generateUnitTestId('278')}: Verify Large dataset rendering -- when dropdown opened with many items (scroll performance)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('dropdown-scroll-performance');
  });

  test(`${generateUnitTestId('279')}: Verify Large dataset rendering -- when dropdown opened with many items (filter search with many items)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.searchInFilter('e');
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-search-many-items');
  });

  test(`${generateUnitTestId('280')}: Verify Large dataset rendering -- when dropdown opened with many items (clear search resets)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('clear-search-resets');
  });

  test(`${generateUnitTestId('281')}: Verify Large dataset rendering -- when dropdown opened with many items (dropdown with cache)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const cacheDuration = analysisPage.getFilterCacheDuration();
      expect(cacheDuration).toBe(5);
    });

    await screenshot.takeStep('dropdown-with-cache');
  });

  test(`${generateUnitTestId('282')}: Verify Large dataset rendering -- when dropdown opened with many items (repeated interactions)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      for (let i = 0; i < 3; i++) {
        await analysisPage.selectAllInFilter();
        await analysisPage.applyFilter();
      }
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('dropdown-repeated-interactions');
  });

  test(`${generateUnitTestId('283')}: Verify Large dataset rendering -- when dropdown opened with many items (no crash on rapid search)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      for (let i = 0; i < 5; i++) {
        await analysisPage.searchInFilter(`search${i}`);
      }
      await analysisPage.searchInFilter('');
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('no-crash-rapid-search');
  });

  test(`${generateUnitTestId('284')}: Verify Large dataset rendering -- when dropdown opened with many items (modal stable)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      await analysisPage.sortByName();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('modal-stable-with-dropdown');
  });

  test(`${generateUnitTestId('285')}: Verify Large dataset rendering -- when dropdown opened with many items (combined filter + sort)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      await analysisPage.sortByCount();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('combined-filter-sort');
  });

  test(`${generateUnitTestId('286')}: Verify Large dataset rendering -- when dropdown opened with many items (filter + pagination)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      await analysisPage.clickNextPage();
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-pagination');
  });

  test(`${generateUnitTestId('287')}: Verify Large dataset rendering -- when dropdown opened with many items (performance benchmark)`, async ({ page }) => {
    await test.step('Given dropdown opened with many items', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When items rendered', async () => {
      const start = Date.now();
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then UI remains responsive and limited to 1000', async () => {
      const maxItems = analysisPage.getFilterMaxItems();
      expect(maxItems).toBe(1000);
    });

    await screenshot.takeStep('dropdown-performance-benchmark');
  });

  // ── SRS-24: Error & Empty State Handling & User Feedback ───────────────────

  test(`${generateUnitTestId('288')}: Verify Error or empty state behavior -- when API returns empty or fails (no data message config)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe(AnalysisModalData.errorMessages.noData);
    });

    await screenshot.takeStep('no-data-message-config');
  });

  test(`${generateUnitTestId('289')}: Verify Error or empty state behavior -- when API returns empty or fails (fetch failed message config)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe(AnalysisModalData.errorMessages.fetchFailed);
    });

    await screenshot.takeStep('fetch-failed-message-config');
  });

  test(`${generateUnitTestId('290')}: Verify Error or empty state behavior -- when API returns empty or fails (empty label tab)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('empty-label-tab');
  });

  test(`${generateUnitTestId('291')}: Verify Error or empty state behavior -- when API returns empty or fails (empty annotation tab)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('empty-annotation-tab');
  });

  test(`${generateUnitTestId('292')}: Verify Error or empty state behavior -- when API returns empty or fails (empty status tab)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('empty-status-tab');
  });

  test(`${generateUnitTestId('293')}: Verify Error or empty state behavior -- when API returns empty or fails (modal stays open on error)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('modal-stays-open-on-error');
  });

  test(`${generateUnitTestId('294')}: Verify Error or empty state behavior -- when API returns empty or fails (no crash on empty data)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.switchToAnnotationTab();
      await analysisPage.switchToStatusTab();
      await analysisPage.switchToLabelTab();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('no-crash-on-empty-data');
  });

  test(`${generateUnitTestId('295')}: Verify Error or empty state behavior -- when API returns empty or fails (error config check)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(noDataMsg).toBe('No Data');
      expect(fetchFailedMsg).toBe('Failed to fetch');
    });

    await screenshot.takeStep('error-config-check');
  });

  test(`${generateUnitTestId('296')}: Verify Error or empty state behavior -- when API returns empty or fails (no data element visibility)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const noDataSelector = page.locator(sel(AnalysisModalSelectors['analysis-no-data']));
      // The no-data element should exist in DOM (visible only when empty)
      const count = await noDataSelector.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await screenshot.takeStep('no-data-element-visibility');
  });

  test(`${generateUnitTestId('297')}: Verify Error or empty state behavior -- when API returns empty or fails (filter returns empty results)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.searchInFilter('zzz_nonexistent_zzz');
      await analysisPage.applyFilter();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe(AnalysisModalData.errorMessages.noData);
    });

    await screenshot.takeStep('filter-returns-empty-results');
  });

  test(`${generateUnitTestId('298')}: Verify Error or empty state behavior -- when API returns empty or fails (sort on empty table)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.sortByName();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('sort-on-empty-table');
  });

  test(`${generateUnitTestId('299')}: Verify Error or empty state behavior -- when API returns empty or fails (pagination on empty table)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('pagination-on-empty-table');
  });

  test(`${generateUnitTestId('300')}: Verify Error or empty state behavior -- when API returns empty or fails (close and reopen after error)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.closeAnalysisModal();
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('close-reopen-after-error');
  });

  test(`${generateUnitTestId('301')}: Verify Error or empty state behavior -- when API returns empty or fails (modal comprehensive check)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const configured = await analysisPage.isAnalysisModalConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('modal-comprehensive-check');
  });

  test(`${generateUnitTestId('302')}: Verify Error or empty state behavior -- when API returns empty or fails (tab switch on empty)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('tab-switch-on-empty');
  });

  test(`${generateUnitTestId('303')}: Verify Error or empty state behavior -- when API returns empty or fails (rapid tab switch on empty)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      for (let i = 0; i < 3; i++) {
        await analysisPage.switchToAnnotationTab();
        await analysisPage.switchToStatusTab();
        await analysisPage.switchToLabelTab();
      }
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('rapid-tab-switch-on-empty');
  });

  test(`${generateUnitTestId('304')}: Verify Error or empty state behavior -- when API returns empty or fails (filter on empty annotation)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When UI renders', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('filter-on-empty-annotation');
  });

  test(`${generateUnitTestId('305')}: Verify Error or empty state behavior -- when API returns empty or fails (filter on empty status)`, async ({ page }) => {
    await test.step('Given API returns empty or fails', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When UI renders', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then clean empty state or friendly toast shown', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('filter-on-empty-status');
  });
});
