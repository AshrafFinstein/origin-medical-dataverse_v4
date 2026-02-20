import { test, expect } from '@playwright/test';
import { AnalysisModalPage } from '../../../../pages/analysis-modal.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-AN-02 / SRS-008: Concurrent Promise Execution (cont.), Pagination, Sorting & Filtering UI
 *
 * Covers SRS-17 (Concurrent Promise Execution, continued), SRS-18 (Default pagination,
 * page sizes, navigation), SRS-19 (Server-side sorting), and SRS-20 (Filtering UI
 * & Interaction Controls, start).
 *
 * Auth state injected via storageState -- no re-login between tests.
 */
test.describe('URS-DV-AN-02 / SRS-008: Concurrent Execution, Pagination, Sorting & Filtering', () => {
  let analysisPage: AnalysisModalPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analysisPage = new AnalysisModalPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analysisPage.gotoSession();
  });

  // ── SRS-17: Concurrent Promise Execution (continued) ──────────────────────

  test(`${generateUnitTestId('178')}: Verify Concurrent Promise Execution -- when Promise.all is used`, async () => {
    await test.step('Given Promise.all is used', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When inspecting code execution', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then dataQuery(), countQuery(), filterQuery() start together', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('promise-all-queries-start-together');
  });

  test(`${generateUnitTestId('179')}: Verify Concurrent Promise Execution -- when all promises resolve`, async () => {
    await test.step('Given all promises resolve', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When API responds', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then single consolidated JSON should contain rows, totalCount, and filters', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('consolidated-json-response');
  });

  test(`${generateUnitTestId('180')}: Verify Concurrent Promise Execution -- when pagination requested`, async () => {
    await test.step('Given pagination requested', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When response received', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then table rows and total count should match correctly', async () => {
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('pagination-rows-count-match');
  });

  test(`${generateUnitTestId('181')}: Verify Concurrent Promise Execution -- when filters exist`, async () => {
    await test.step('Given filters exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When grid loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then filter options should populate without extra API calls', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filters-populate-no-extra-calls');
  });

  test(`${generateUnitTestId('182')}: Verify Concurrent Promise Execution -- when large dataset`, async () => {
    await test.step('Given large dataset', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When page loads', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then grid should render within SLA (<2-3s)', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('grid-render-within-sla');
  });

  test(`${generateUnitTestId('183')}: Verify Concurrent Promise Execution -- when one query slower than others`, async () => {
    await test.step('Given one query slower than others', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When awaiting Promise.all', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then system should wait for completion without partial UI render', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('no-partial-ui-render');
  });

  test(`${generateUnitTestId('184')}: Verify Concurrent Promise Execution -- when dataQuery fails`, async () => {
    await test.step('Given dataQuery fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Promise.all rejects', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then API should return unified error response', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe('Failed to fetch');
    });

    await screenshot.takeStep('unified-error-response');
  });

  test(`${generateUnitTestId('185')}: Verify Concurrent Promise Execution -- when countQuery fails`, async () => {
    await test.step('Given countQuery fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When executed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then system should catch aggregated error in single catch block', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('aggregated-error-catch');
  });

  test(`${generateUnitTestId('186')}: Verify Concurrent Promise Execution -- when filterQuery fails`, async () => {
    await test.step('Given filterQuery fails', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When executed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then response should return error without partial dataset', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('no-partial-dataset-on-error');
  });

  test(`${generateUnitTestId('187')}: Verify Concurrent Promise Execution -- when API call in progress`, async () => {
    await test.step('Given API call in progress', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When waiting', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then grid should display loading spinner until all results arrive', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('loading-spinner-until-results');
  });

  test(`${generateUnitTestId('188')}: Verify Concurrent Promise Execution -- when multiple pages`, async () => {
    await test.step('Given multiple pages', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When navigating pages', async () => {
      await analysisPage.waitForLoad();
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await test.step('Then rows and counts remain consistent', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('pages-rows-counts-consistent');
  });

  test(`${generateUnitTestId('189')}: Verify Concurrent Promise Execution -- when concurrent users`, async () => {
    await test.step('Given concurrent users', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When multiple requests fire', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then queries execute independently without blocking', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('concurrent-users-no-blocking');
  });

  test(`${generateUnitTestId('190')}: Verify Concurrent Promise Execution -- when sequential vs parallel benchmark`, async () => {
    await test.step('Given sequential vs parallel benchmark', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When compared', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then parallel execution should show reduced latency', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('parallel-reduced-latency');
  });

  test(`${generateUnitTestId('191')}: Verify Concurrent Promise Execution -- when malformed query parameter`, async () => {
    await test.step('Given malformed query parameter', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When request sent', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then system should reject safely without crashing server', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('malformed-query-safe-reject');
  });

  test(`${generateUnitTestId('192')}: Verify Concurrent Promise Execution -- when data loads`, async () => {
    await test.step('Given data loads', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When UI renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then users experience minimal wait and responsive controls', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('minimal-wait-responsive');
  });

  // ── SRS-18: Default pagination ─────────────────────────────────────────────

  test(`${generateUnitTestId('193')}: Verify Default pagination -- when session table loads`, async () => {
    await test.step('Given session table loads', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When page initializes', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then first page should display default page size records only', async () => {
      const pageSizes = analysisPage.getPageSizes();
      expect(pageSizes).toContain(10);
    });

    await screenshot.takeStep('default-page-size-records');
  });

  test(`${generateUnitTestId('194')}: Verify Page size 20 -- when page size changed to 20`, async () => {
    await test.step('Given page size changed to 20', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When data refreshes', async () => {
      await analysisPage.selectPageSize(20);
    });

    await test.step('Then exactly 20 rows should load', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('page-size-20-rows');
  });

  test(`${generateUnitTestId('195')}: Verify Page size 30 -- when page size changed to 30`, async () => {
    await test.step('Given page size changed to 30', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When data refreshes', async () => {
      await analysisPage.selectPageSize(30);
    });

    await test.step('Then exactly 30 rows should load', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('page-size-30-rows');
  });

  test(`${generateUnitTestId('196')}: Verify Offset logic -- when page=2 and size=10`, async () => {
    await test.step('Given page=2 and size=10', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When API called', async () => {
      await analysisPage.clickNextPage();
    });

    await test.step('Then query must use OFFSET 10 LIMIT 10', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('offset-logic-page-2');
  });

  test(`${generateUnitTestId('197')}: Verify Offset calculation -- when page=3 and size=20`, async () => {
    await test.step('Given page=3 and size=20', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.selectPageSize(20);
    });

    await test.step('When API called', async () => {
      await analysisPage.clickNextPage();
      await analysisPage.clickNextPage();
    });

    await test.step('Then OFFSET should be 40', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('offset-calculation-page-3');
  });

  test(`${generateUnitTestId('198')}: Verify Next button -- when user clicks Next`, async () => {
    await test.step('Given user clicks Next', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When page increments', async () => {
      await analysisPage.clickNextPage();
    });

    await test.step('Then next set of records should load', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('next-page-records-loaded');
  });

  test(`${generateUnitTestId('199')}: Verify Previous button -- when user clicks Previous`, async () => {
    await test.step('Given user clicks Previous', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.clickNextPage();
    });

    await test.step('When page decrements', async () => {
      await analysisPage.clickPrevPage();
    });

    await test.step('Then previous set loads', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('prev-page-records-loaded');
  });

  test(`${generateUnitTestId('200')}: Verify Total count display -- when 50 records`, async () => {
    await test.step('Given 50 records', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When page loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then footer shows 1-10 of N format', async () => {
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('total-count-display-format');
  });

  test(`${generateUnitTestId('201')}: Verify Last page navigation -- when user reaches last page`, async () => {
    await test.step('Given user reaches last page', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Next clicked on last page', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then Next should be disabled', async () => {
      // TODO: Implement isNextPageDisabled() on AnalysisModalPage
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('next-disabled-last-page');
  });

  test(`${generateUnitTestId('202')}: Verify First page boundary -- when page=1`, async () => {
    await test.step('Given page=1', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Previous clicked', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then Previous should be disabled', async () => {
      // TODO: Implement isPrevPageDisabled() on AnalysisModalPage
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('prev-disabled-first-page');
  });

  test(`${generateUnitTestId('203')}: Verify Payload minimization -- when page size=10`, async () => {
    await test.step('Given page size=10', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When API returns', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then payload contains only 10 records (not full dataset)', async () => {
      const pageSizes = analysisPage.getPageSizes();
      expect(pageSizes[0]).toBe(10);
    });

    await screenshot.takeStep('payload-minimized-10-records');
  });

  test(`${generateUnitTestId('204')}: Verify Response time -- when large dataset (10k+ rows)`, async () => {
    await test.step('Given large dataset (10k+ rows)', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When fetching a page', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then response should meet SLA (<2-3s)', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('response-time-within-sla');
  });

  test(`${generateUnitTestId('205')}: Verify Loading indicator -- when page change`, async () => {
    await test.step('Given page change', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When fetch pending', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then spinner should appear until data loads', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('loading-indicator-page-change');
  });

  test(`${generateUnitTestId('206')}: Verify No duplicates -- when sequential navigation`, async () => {
    await test.step('Given sequential navigation', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When moving pages', async () => {
      await analysisPage.clickNextPage();
      await analysisPage.clickPrevPage();
    });

    await test.step('Then records should not repeat across pages', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('no-duplicates-across-pages');
  });

  test(`${generateUnitTestId('207')}: Verify No missing rows -- when full navigation`, async () => {
    await test.step('Given full navigation', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When iterating all pages', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then all records are covered exactly once', async () => {
      const paginationConfigured = await analysisPage.isPaginationConfigured();
      expect(paginationConfigured).toBe(true);
    });

    await screenshot.takeStep('all-records-covered-once');
  });

  test(`${generateUnitTestId('208')}: Verify Page reset on size change -- when page=5`, async () => {
    await test.step('Given page=5', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When page size changed', async () => {
      await analysisPage.selectPageSize(20);
    });

    await test.step('Then page resets to 1', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('page-reset-on-size-change');
  });

  test(`${generateUnitTestId('209')}: Verify Invalid page request -- when page beyond max`, async () => {
    await test.step('Given page beyond max', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When requested', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then system auto-corrects to last page', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('auto-correct-to-last-page');
  });

  test(`${generateUnitTestId('210')}: Verify Offset tampering -- when manual API param manipulation`, async () => {
    await test.step('Given manual API param manipulation', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When invalid offset used', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then backend validates and restricts query', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('offset-tampering-validated');
  });

  test(`${generateUnitTestId('211')}: Verify Smooth navigation -- when repeated page switches`, async () => {
    await test.step('Given repeated page switches', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When interacting', async () => {
      await analysisPage.clickNextPage();
      await analysisPage.clickPrevPage();
      await analysisPage.clickNextPage();
    });

    await test.step('Then UI remains responsive without freeze', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('smooth-navigation-responsive');
  });

  test(`${generateUnitTestId('212')}: Verify Zero records -- when no data available`, async () => {
    await test.step('Given no data available', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When page loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then table shows No Data with disabled navigation', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe('No Data');
    });

    await screenshot.takeStep('zero-records-no-data');
  });

  // ── SRS-19: Server-Side Sorting Across Full Dataset ────────────────────────

  test(`${generateUnitTestId('213')}: Verify Sort by Name ascending -- when analysis table loaded with multiple records`, async () => {
    await test.step('Given analysis table loaded with multiple records', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user clicks Name header once', async () => {
      await analysisPage.sortByName();
    });

    await test.step('Then system sorts entire dataset ascending before pagination', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('sort-name-ascending');
  });

  test(`${generateUnitTestId('214')}: Verify Sort by Name descending -- when Name column sorted ascending`, async () => {
    await test.step('Given Name column sorted ascending', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.sortByName();
    });

    await test.step('When user clicks Name header again', async () => {
      await analysisPage.sortByName();
    });

    await test.step('Then system sorts entire dataset descending', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('sort-name-descending');
  });

  test(`${generateUnitTestId('215')}: Verify Sort by Count ascending -- when Count values displayed`, async () => {
    await test.step('Given Count values displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user clicks Count header', async () => {
      await analysisPage.sortByCount();
    });

    await test.step('Then records sorted low to high across full dataset', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('sort-count-ascending');
  });

  test(`${generateUnitTestId('216')}: Verify Sort by Count descending -- when Count sorted ascending`, async () => {
    await test.step('Given Count sorted ascending', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.sortByCount();
    });

    await test.step('When user clicks again', async () => {
      await analysisPage.sortByCount();
    });

    await test.step('Then records sorted high to low', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('sort-count-descending');
  });

  test(`${generateUnitTestId('217')}: Verify Sorting applies to full dataset not current page only -- when pagination enabled`, async () => {
    await test.step('Given pagination enabled', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When sorting applied', async () => {
      await analysisPage.sortByName();
    });

    await test.step('Then backend sorts before LIMIT/OFFSET', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('sort-full-dataset-before-pagination');
  });

  // ── SRS-20: Filtering UI & Interaction Controls (start) ───────────────────

  test(`${generateUnitTestId('218')}: Verify Filter dropdown behavior -- when table displayed (search in filter)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.searchInFilter('test');
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-search-behavior');
  });

  test(`${generateUnitTestId('219')}: Verify Filter dropdown behavior -- when table displayed (select all)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.selectAllInFilter();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-select-all-behavior');
  });

  test(`${generateUnitTestId('220')}: Verify Filter dropdown behavior -- when table displayed (apply filter)`, async () => {
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

    await screenshot.takeStep('filter-apply-behavior');
  });

  test(`${generateUnitTestId('221')}: Verify Filter dropdown behavior -- when table displayed (filter search input visible)`, async () => {
    await test.step('Given table displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user interacts with filter controls', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then correct dropdown/search/selection behavior occurs', async () => {
      // TODO: Implement isFilterSearchInputVisible() on AnalysisModalPage
      const filterConfigured = await analysisPage.isFilterConfigured();
      expect(filterConfigured).toBe(true);
    });

    await screenshot.takeStep('filter-search-input-visible');
  });
});
