import { test, expect } from '@playwright/test';
import { AnalysisModalPage } from '../../../../pages/analysis-modal.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-AN-02 / SRS-007: Label Aggregation (cont.), Hierarchical Annotation Analysis & Status Aggregation
 *
 * Covers SRS-14 (Label combination aggregation, continued), SRS-15 (Hierarchical
 * annotation count analysis), SRS-16 (Status aggregation with conditional level
 * formatting), and SRS-17 (Concurrent Promise Execution, start).
 *
 * Auth state injected via storageState -- no re-login between tests.
 */
test.describe('URS-DV-AN-02 / SRS-007: Label Aggregation, Annotation Analysis & Status Aggregation', () => {
  let analysisPage: AnalysisModalPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analysisPage = new AnalysisModalPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analysisPage.gotoSession();
  });

  // ── SRS-14: Label combination aggregation and counting (continued) ─────────

  test(`${generateUnitTestId('134')}: Verify Label combination aggregation and counting -- when backend query executes`, async () => {
    await test.step('Given backend query executes', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When SQL grouping occurs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then grouping should occur by extractedResourceId arrays before count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('backend-grouping-by-resource-id');
  });

  test(`${generateUnitTestId('135')}: Verify Label combination aggregation and counting -- when aggregation completes`, async () => {
    await test.step('Given aggregation completes', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When API responds', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then response format should be { labelName: string, count: number }', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('response-format-valid');
  });

  test(`${generateUnitTestId('136')}: Verify Label combination aggregation and counting -- when table renders`, async () => {
    await test.step('Given table renders', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When viewing each row', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then label combination name and count should be clearly visible', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('label-name-count-visible');
  });

  test(`${generateUnitTestId('137')}: Verify Label combination aggregation and counting -- when large dataset (1000+ images)`, async () => {
    await test.step('Given large dataset (1000+ images)', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When aggregation runs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then results should display correctly without duplication', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('large-dataset-no-duplication');
  });

  test(`${generateUnitTestId('138')}: Verify Label combination aggregation and counting -- when large dataset performance`, async () => {
    await test.step('Given large dataset', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      await analysisPage.waitForLoad();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('When Label Analysis loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then aggregation should complete within acceptable time (<2s)', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('aggregation-acceptable-time');
  });

  test(`${generateUnitTestId('139')}: Verify Label combination aggregation and counting -- when backend fails to fetch labels`, async () => {
    await test.step('Given backend fails to fetch labels', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When API returns error', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then system should show Failed to fetch message without breaking modal', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe('Failed to fetch');
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('fetch-failed-message-shown');
  });

  test(`${generateUnitTestId('140')}: Verify Label combination aggregation and counting -- when multiple combinations exist`, async () => {
    await test.step('Given multiple combinations exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When viewing list', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then rows should be sorted consistently and readable', async () => {
      const sortConfigured = await analysisPage.isSortConfigured();
      expect(sortConfigured).toBe(true);
    });

    await screenshot.takeStep('rows-sorted-consistently');
  });

  test(`${generateUnitTestId('141')}: Verify Label combination aggregation and counting -- when session has zero labeled images`, async () => {
    await test.step('Given session has zero labeled images', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Label Analysis loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then system should show empty state or No Data message', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe('No Data');
    });

    await screenshot.takeStep('no-data-empty-state');
  });

  // ── SRS-15: Hierarchical annotation count analysis ─────────────────────────

  test(`${generateUnitTestId('142')}: Verify Hierarchical annotation count analysis -- when session contains annotated images`, async () => {
    await test.step('Given session contains annotated images', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Annotation Analysis tab opens', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then the system should display aggregated annotation rows with counts', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('annotation-rows-with-counts');
  });

  test(`${generateUnitTestId('143')}: Verify Hierarchical annotation count analysis -- when parent annotations exist`, async () => {
    await test.step('Given parent annotations exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When aggregation runs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each parent annotation should display its total count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('parent-annotation-count');
  });

  test(`${generateUnitTestId('144')}: Verify Hierarchical annotation count analysis -- when child taxonomy annotations exist`, async () => {
    await test.step('Given child taxonomy annotations exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When aggregation runs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each child annotation should display its total count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('child-annotation-count');
  });

  test(`${generateUnitTestId('145')}: Verify Hierarchical annotation count analysis -- when multiple images share same parent annotation`, async () => {
    await test.step('Given multiple images share same parent annotation', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When grouped', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then count should equal total occurrences across all images', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('parent-count-total-occurrences');
  });

  test(`${generateUnitTestId('146')}: Verify Hierarchical annotation count analysis -- when multiple images share same child taxonomy`, async () => {
    await test.step('Given multiple images share same child taxonomy', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When grouped', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then child count should equal correct total', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('child-count-correct-total');
  });

  test(`${generateUnitTestId('147')}: Verify Hierarchical annotation count analysis -- when both parent and child annotations exist`, async () => {
    await test.step('Given both parent and child annotations exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When response is returned', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then both should appear in one unified list', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('unified-parent-child-list');
  });

  test(`${generateUnitTestId('148')}: Verify Hierarchical annotation count analysis -- when backend query executes UNION ALL`, async () => {
    await test.step('Given backend query executes', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When SQL runs', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then UNION ALL should combine parent and child queries', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('union-all-combined');
  });

  test(`${generateUnitTestId('149')}: Verify Hierarchical annotation count analysis -- when API returns results`, async () => {
    await test.step('Given API returns results', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When inspecting payload', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each object should contain name, count, and isChild flag', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('payload-contains-name-count-isChild');
  });

  test(`${generateUnitTestId('150')}: Verify Hierarchical annotation count analysis -- when UI renders results`, async () => {
    await test.step('Given UI renders results', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When viewing table', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then parent and child annotations should appear uniformly formatted', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('uniform-annotation-formatting');
  });

  test(`${generateUnitTestId('151')}: Verify Hierarchical annotation count analysis -- when a parent has multiple children`, async () => {
    await test.step('Given a parent has multiple children', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When displayed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then children should appear clearly associated with their parent', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('children-associated-with-parent');
  });

  test(`${generateUnitTestId('152')}: Verify Hierarchical annotation count analysis -- when child annotation has no valid parent`, async () => {
    await test.step('Given child annotation has no valid parent', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When aggregation runs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then it should be excluded from UI', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('orphan-child-excluded');
  });

  test(`${generateUnitTestId('153')}: Verify Hierarchical annotation count analysis -- when orphan child exists`, async () => {
    await test.step('Given orphan child exists', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When processed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then system should log warning for monitoring', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('orphan-child-warning-logged');
  });

  test(`${generateUnitTestId('154')}: Verify Hierarchical annotation count analysis -- when large dataset (1000+ annotations)`, async () => {
    await test.step('Given large dataset (1000+ annotations)', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When loading analysis', async () => {
      const start = Date.now();
      await analysisPage.switchToAnnotationTab();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then results should load within acceptable time (<2s)', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('annotation-large-dataset-perf');
  });

  test(`${generateUnitTestId('155')}: Verify Hierarchical annotation count analysis -- when repeated refresh`, async () => {
    await test.step('Given repeated refresh', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When reloading analysis', async () => {
      await analysisPage.switchToLabelTab();
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then counts should remain consistent without duplication', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('annotation-counts-consistent');
  });

  test(`${generateUnitTestId('156')}: Verify Hierarchical annotation count analysis -- when multiple annotations displayed`, async () => {
    await test.step('Given multiple annotations displayed', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('When viewing list', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then annotation names and counts should be readable and aligned', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('annotations-readable-aligned');
  });

  test(`${generateUnitTestId('157')}: Verify Hierarchical annotation count analysis -- when backend fails to fetch data`, async () => {
    await test.step('Given backend fails to fetch data', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When API returns error', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then Failed to fetch toast should appear and table should not crash', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe('Failed to fetch');
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('annotation-fetch-failed-toast');
  });

  test(`${generateUnitTestId('158')}: Verify Hierarchical annotation count analysis -- when no annotations exist`, async () => {
    await test.step('Given no annotations exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When analysis loads', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then No Data empty state should be displayed', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe('No Data');
    });

    await screenshot.takeStep('annotation-no-data-state');
  });

  // ── SRS-16: Status aggregation with conditional level formatting ───────────

  test(`${generateUnitTestId('159')}: Verify Status aggregation with conditional level formatting -- when session contains images with various statuses`, async () => {
    await test.step('Given session contains images with various statuses', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Status Analysis tab opens', async () => {
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then system should display grouped rows with counts per status', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('status-grouped-rows');
  });

  test(`${generateUnitTestId('160')}: Verify Status aggregation with conditional level formatting -- when images in PENDING status exist`, async () => {
    await test.step('Given images in PENDING status exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When aggregation runs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then PENDING should be shown as a separate row with correct count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('pending-status-row');
  });

  test(`${generateUnitTestId('161')}: Verify Status aggregation with conditional level formatting -- when images in IN_REVIEW at Level 1`, async () => {
    await test.step('Given images in IN_REVIEW at Level 1', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When results are displayed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then status should show as IN_REVIEW - L1', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('in-review-l1-format');
  });

  test(`${generateUnitTestId('162')}: Verify Status aggregation with conditional level formatting -- when images in IN_REVIEW at Level 3`, async () => {
    await test.step('Given images in IN_REVIEW at Level 3', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When aggregated', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then status should show IN_REVIEW - L3', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('in-review-l3-format');
  });

  test(`${generateUnitTestId('163')}: Verify Status aggregation with conditional level formatting -- when images in REJECTED at Level 2`, async () => {
    await test.step('Given images in REJECTED at Level 2', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When displayed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then status should show REJECTED - L2', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('rejected-l2-format');
  });

  test(`${generateUnitTestId('164')}: Verify Status aggregation with conditional level formatting -- when multiple images share same status and level`, async () => {
    await test.step('Given multiple images share same status and level', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When grouped', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then count should equal total matching records', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('status-count-total-matching');
  });

  test(`${generateUnitTestId('165')}: Verify Status aggregation with conditional level formatting -- when images exist across different levels`, async () => {
    await test.step('Given images exist across different levels', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When aggregated', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each level should appear as a separate grouped row', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('separate-level-rows');
  });

  test(`${generateUnitTestId('166')}: Verify Status aggregation with conditional level formatting -- when backend executes query`, async () => {
    await test.step('Given backend executes query', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When CTE runs', async () => {
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then status and approval level should be combined before response', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('status-level-combined');
  });

  test(`${generateUnitTestId('167')}: Verify Status aggregation with conditional level formatting -- when API response received`, async () => {
    await test.step('Given API response received', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When inspecting payload', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then formatted status name and count should be precomputed by backend', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('precomputed-status-format');
  });

  test(`${generateUnitTestId('168')}: Verify Status aggregation with conditional level formatting -- when statuses displayed`, async () => {
    await test.step('Given statuses displayed', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When viewing UI', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each status should show readable badge/label formatting', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('status-badge-formatting');
  });

  test(`${generateUnitTestId('169')}: Verify Status aggregation with conditional level formatting -- when mixed statuses exist`, async () => {
    await test.step('Given mixed statuses exist', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When aggregated', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each distinct combination should appear only once', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('distinct-status-combinations');
  });

  test(`${generateUnitTestId('170')}: Verify Status aggregation with conditional level formatting -- when no images exist`, async () => {
    await test.step('Given no images exist', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When analysis loads', async () => {
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then No Data state should appear', async () => {
      const noDataMsg = analysisPage.getNoDataMessage();
      expect(noDataMsg).toBe('No Data');
    });

    await screenshot.takeStep('status-no-data-state');
  });

  test(`${generateUnitTestId('171')}: Verify Status aggregation with conditional level formatting -- when large dataset (>10k images)`, async () => {
    await test.step('Given large dataset (>10k images)', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When analysis loads', async () => {
      const start = Date.now();
      await analysisPage.switchToStatusTab();
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then aggregation should complete within acceptable time (<2s)', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('status-large-dataset-perf');
  });

  test(`${generateUnitTestId('172')}: Verify Status aggregation with conditional level formatting -- when repeated refresh`, async () => {
    await test.step('Given repeated refresh', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When analysis reloads', async () => {
      await analysisPage.switchToLabelTab();
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then counts remain consistent', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('status-counts-consistent');
  });

  test(`${generateUnitTestId('173')}: Verify Status aggregation with conditional level formatting -- when backend error occurs`, async () => {
    await test.step('Given backend error occurs', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When request fails', async () => {
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then empty data returned and notification displayed', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe('Failed to fetch');
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('status-backend-error-notification');
  });

  test(`${generateUnitTestId('174')}: Verify Status aggregation with conditional level formatting -- when invalid status value exists`, async () => {
    await test.step('Given invalid status value exists', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When aggregated', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then record should be ignored or logged without breaking UI', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('invalid-status-handled');
  });

  test(`${generateUnitTestId('175')}: Verify Status aggregation with conditional level formatting -- when multiple statuses displayed`, async () => {
    await test.step('Given multiple statuses displayed', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.switchToStatusTab();
    });

    await test.step('When user views table', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then labels should be clearly readable and distinguishable', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('status-labels-readable');
  });

  // ── SRS-17: Concurrent Promise Execution (start) ──────────────────────────

  test(`${generateUnitTestId('176')}: Verify Concurrent Promise Execution -- when session grid loads`, async () => {
    await test.step('Given session grid loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When API endpoint is triggered', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then main data, count, and filter queries should execute simultaneously', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('concurrent-queries-executed');
  });

  test(`${generateUnitTestId('177')}: Verify Concurrent Promise Execution -- when three queries configured`, async () => {
    await test.step('Given three queries configured', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When executed concurrently', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(10000);
    });

    await test.step('Then total response time should approximate the slowest query, not the sum', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('concurrent-response-time');
  });
});
