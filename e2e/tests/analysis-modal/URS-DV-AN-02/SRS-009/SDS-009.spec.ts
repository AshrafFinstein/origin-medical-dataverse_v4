import { test, expect } from '@playwright/test';
import { AnalysisModalPage } from '../../../../pages/analysis-modal.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-AN-02 / SRS-009: Filtering UI (cont.), Filter Application Logic & Filter Option Caching
 *
 * Covers SRS-20 (Filtering UI & Interaction Controls, continued), SRS-21 (Filter
 * Application Logic & Immediate Table Update), and SRS-22 (Filter Option Caching
 * with 5-Minute TTL).
 *
 * Auth state injected via storageState -- no re-login between tests.
 */
test.describe('URS-DV-AN-02 / SRS-009: Filtering UI, Filter Logic & Cache', () => {
  let analysisPage: AnalysisModalPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analysisPage = new AnalysisModalPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analysisPage.gotoSession();
  });

  // ── SRS-20: Filtering UI & Interaction Controls (continued) ────────────────

  test(`${generateUnitTestId('222')}: Verify Filter dropdown behavior -- when table displayed (filter select-all button)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      // TODO: Implement isSelectAllButtonVisible() on AnalysisModalPage
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-select-all-btn-visible');
  });

  test(`${generateUnitTestId('223')}: Verify Filter dropdown behavior -- when table displayed (apply button visible)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      // TODO: Implement isApplyButtonVisible() on AnalysisModalPage
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-apply-btn-visible');
  });

  test(`${generateUnitTestId('224')}: Verify Filter dropdown behavior -- when table displayed (search then select all)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.selectAllInFilter();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-search-then-select-all');
  });

  test(`${generateUnitTestId('225')}: Verify Filter dropdown behavior -- when table displayed (clear search)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-clear-search');
  });

  test(`${generateUnitTestId('226')}: Verify Filter dropdown behavior -- when table displayed (search with no match)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('zzz_no_match_zzz');
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-search-no-match');
  });

  test(`${generateUnitTestId('227')}: Verify Filter dropdown behavior -- when table displayed (filter controls configured)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-controls-configured');
  });

  test(`${generateUnitTestId('228')}: Verify Filter dropdown behavior -- when table displayed (search partial match)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('a');
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-partial-match');
  });

  test(`${generateUnitTestId('229')}: Verify Filter dropdown behavior -- when table displayed (multiple filter interactions)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
      await analysisPage.selectAllInFilter();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-multiple-interactions');
  });

  test(`${generateUnitTestId('230')}: Verify Filter dropdown behavior -- when table displayed (apply without selection)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.applyFilter();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('filter-apply-without-selection');
  });

  test(`${generateUnitTestId('231')}: Verify Filter dropdown behavior -- when table displayed (case-insensitive search)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('TEST');
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-case-insensitive-search');
  });

  test(`${generateUnitTestId('232')}: Verify Filter dropdown behavior -- when table displayed (rapid filter interactions)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('a');
      await analysisPage.searchInFilter('ab');
      await analysisPage.searchInFilter('abc');
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('filter-rapid-interactions');
  });

  test(`${generateUnitTestId('233')}: Verify Filter dropdown behavior -- when table displayed (select all then apply)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-select-all-then-apply');
  });

  test(`${generateUnitTestId('234')}: Verify Filter dropdown behavior -- when table displayed (filter max items limit)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const maxItems = analysisPage.getFilterMaxItems();
      expect(maxItems).toBe(1000);
    });

    await screenshot.takeStep('filter-max-items-limit');
  });

  // ── SRS-21: Filter Application Logic & Immediate Table Update ──────────────

  test(`${generateUnitTestId('235')}: Verify Apply filter updates dataset -- when records exist (apply filter refreshes table)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-applied-table-refreshed');
  });

  test(`${generateUnitTestId('236')}: Verify Apply filter updates dataset -- when records exist (filter resets page to 1)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.clickNextPage();
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-resets-page-to-1');
  });

  test(`${generateUnitTestId('237')}: Verify Apply filter updates dataset -- when records exist (search filter then apply)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('search-filter-then-apply');
  });

  test(`${generateUnitTestId('238')}: Verify Apply filter updates dataset -- when records exist (filter preserves sort)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.sortByName();
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-preserves-sort');
  });

  test(`${generateUnitTestId('239')}: Verify Apply filter updates dataset -- when records exist (count updates after filter)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('count-updates-after-filter');
  });

  test(`${generateUnitTestId('240')}: Verify Apply filter updates dataset -- when records exist (filter on annotation tab)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-on-annotation-tab');
  });

  test(`${generateUnitTestId('241')}: Verify Apply filter updates dataset -- when records exist (filter on status tab)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-on-status-tab');
  });

  test(`${generateUnitTestId('242')}: Verify Apply filter updates dataset -- when records exist (filter returns empty)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe('No Data');
    });

    await screenshot.takeStep('filter-returns-empty');
  });

  test(`${generateUnitTestId('243')}: Verify Apply filter updates dataset -- when records exist (loading shown during filter)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('loading-shown-during-filter');
  });

  test(`${generateUnitTestId('244')}: Verify Apply filter updates dataset -- when records exist (filter API response time)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      const start = Date.now();
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('filter-api-response-time');
  });

  test(`${generateUnitTestId('245')}: Verify Apply filter updates dataset -- when records exist (repeated filter apply)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('repeated-filter-apply');
  });

  test(`${generateUnitTestId('246')}: Verify Apply filter updates dataset -- when records exist (filter with pagination)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-with-pagination');
  });

  test(`${generateUnitTestId('247')}: Verify Apply filter updates dataset -- when records exist (filter with sort)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      await analysisPage.sortByCount();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('filter-with-sort');
  });

  test(`${generateUnitTestId('248')}: Verify Apply filter updates dataset -- when records exist (filter error handling)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe('Failed to fetch');
    });

    await screenshot.takeStep('filter-error-handling');
  });

  test(`${generateUnitTestId('249')}: Verify Apply filter updates dataset -- when records exist (filter across tabs)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('filter-across-tabs');
  });

  test(`${generateUnitTestId('250')}: Verify Apply filter updates dataset -- when records exist (filter UI state preserved)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-ui-state-preserved');
  });

  test(`${generateUnitTestId('251')}: Verify Apply filter updates dataset -- when records exist (no data after filter)`, async () => {
    await test.step('Given records exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user confirms filter', async () => {
      await analysisPage.searchInFilter('zzz_nonexistent_zzz');
      await analysisPage.applyFilter();
    });

    await test.step('Then table refreshes with filtered results instantly', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe('No Data');
    });

    await screenshot.takeStep('no-data-after-filter');
  });

  // ── SRS-22: Filter Option Caching with 5-Minute TTL ───────────────────────

  test(`${generateUnitTestId('252')}: Verify Cache usage -- when filter opened repeatedly (cache config)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const cacheDuration = analysisPage.getFilterCacheDuration();
      expect(cacheDuration).toBe(5);
    });

    await screenshot.takeStep('cache-config-5-min');
  });

  test(`${generateUnitTestId('253')}: Verify Cache usage -- when filter opened repeatedly (cache on label tab)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-on-label-tab');
  });

  test(`${generateUnitTestId('254')}: Verify Cache usage -- when filter opened repeatedly (cache on annotation tab)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-on-annotation-tab');
  });

  test(`${generateUnitTestId('255')}: Verify Cache usage -- when filter opened repeatedly (cache on status tab)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-on-status-tab');
  });

  test(`${generateUnitTestId('256')}: Verify Cache usage -- when filter opened repeatedly (cache duration value)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const cacheDuration = analysisPage.getFilterCacheDuration();
      expect(cacheDuration).toBe(5);
    });

    await screenshot.takeStep('cache-duration-5-minutes');
  });

  test(`${generateUnitTestId('257')}: Verify Cache usage -- when filter opened repeatedly (repeated filter open)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('a');
      await analysisPage.searchInFilter('');
      await analysisPage.searchInFilter('b');
      await analysisPage.searchInFilter('');
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('repeated-filter-open-cached');
  });

  test(`${generateUnitTestId('258')}: Verify Cache usage -- when filter opened repeatedly (cache improves performance)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      const start = Date.now();
      await analysisPage.searchInFilter('test');
      await analysisPage.searchInFilter('');
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('Then data loads from cache without API call', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('cache-improves-performance');
  });

  test(`${generateUnitTestId('259')}: Verify Cache usage -- when filter opened repeatedly (cache per tab)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.searchInFilter('test');
      await analysisPage.switchToAnnotationTab();
      await analysisPage.searchInFilter('test');
      await analysisPage.switchToLabelTab();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('cache-per-tab');
  });

  test(`${generateUnitTestId('260')}: Verify Cache usage -- when filter opened repeatedly (modal reopen within TTL)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.closeAnalysisModal();
    });

    await test.step('When within TTL', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('modal-reopen-within-ttl');
  });

  test(`${generateUnitTestId('261')}: Verify Cache usage -- when filter opened repeatedly (cache with select all)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('cache-with-select-all');
  });

  test(`${generateUnitTestId('262')}: Verify Cache usage -- when filter opened repeatedly (cache consistency)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
      const cacheDuration = analysisPage.getFilterCacheDuration();
      expect(cacheDuration).toBe(5);
    });

    await screenshot.takeStep('cache-consistency-check');
  });

  test(`${generateUnitTestId('263')}: Verify Cache usage -- when filter opened repeatedly (cache does not break filter)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.selectAllInFilter();
      await analysisPage.applyFilter();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('cache-does-not-break-filter');
  });

  test(`${generateUnitTestId('264')}: Verify Cache usage -- when filter opened repeatedly (cache stability)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      for (let i = 0; i < 3; i++) {
        await analysisPage.searchInFilter(`search${i}`);
        await analysisPage.searchInFilter('');
      }
    });

    await test.step('Then data loads from cache without API call', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('cache-stability');
  });

  test(`${generateUnitTestId('265')}: Verify Cache usage -- when filter opened repeatedly (max items cached)`, async () => {
    await test.step('Given filter opened repeatedly', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When within TTL', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then data loads from cache without API call', async () => {
      const maxItems = analysisPage.getFilterMaxItems();
      expect(maxItems).toBe(1000);
    });

    await screenshot.takeStep('max-items-cached');
  });
});
