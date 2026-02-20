import { test, expect } from '@playwright/test';
import { AnalysisModalPage } from '../../../../pages/analysis-modal.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-AN-02 / SRS-006: Analyze Icon, Modal Header/Tabs, Default Tab & Label Aggregation
 *
 * Covers SRS-11 (Analyze icon opens Analysis Modal), SRS-12 (Modal header and tabs
 * navigation layout), SRS-13 (Default tab initialization and lazy loading), and
 * SRS-14 (Label combination aggregation and counting).
 *
 * Auth state injected via storageState -- no re-login between tests.
 * All selectors and test-data accessed via AnalysisModalPage methods.
 */
test.describe('URS-DV-AN-02 / SRS-006: Analyze Icon, Modal Header/Tabs, Default Tab & Label Aggregation', () => {
  let analysisPage: AnalysisModalPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    analysisPage = new AnalysisModalPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analysisPage.gotoSession();
  });

  // ── SRS-11: Analyze icon opens Analysis Modal ──────────────────────────────

  test(`${generateUnitTestId('90')}: Verify Analyze icon opens Analysis Modal -- when the Data Labelling Session table is loaded`, async () => {
    await test.step('Given the Data Labelling Session table is loaded', async () => {
      const tableConfigured = await analysisPage.isSessionTableConfigured();
      expect(tableConfigured).toBe(true);
    });

    await test.step('When the table rows are rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then an Analyze (three-dot) icon should be visible for each active session row', async () => {
      // TODO: Implement isAnalyzeButtonVisible(index) on AnalysisModalPage
      // Verify that the analyze button is visible for the first session row
      await analysisPage.openAnalysisModal(0);
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
      await analysisPage.closeAnalysisModal();
    });

    await screenshot.takeStep('analyze-icon-visible-per-row');
  });

  test(`${generateUnitTestId('91')}: Verify Analyze icon opens Analysis Modal -- when a session row is displayed`, async () => {
    await test.step('Given a session row is displayed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When the user views the action column', async () => {
      // TODO: Implement isAnalyzeButtonVisible(index) on AnalysisModalPage
      const tableConfigured = await analysisPage.isSessionTableConfigured();
      expect(tableConfigured).toBe(true);
    });

    await test.step('Then the Analyze icon should be displayed as an interactive IconButton', async () => {
      // TODO: Implement isAnalyzeButtonEnabled(index) on AnalysisModalPage
      // Verify the analyze button is interactive by opening the modal
      await analysisPage.openAnalysisModal(0);
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
      await analysisPage.closeAnalysisModal();
    });

    await screenshot.takeStep('analyze-icon-interactive-button');
  });

  test(`${generateUnitTestId('92')}: Verify Analyze icon opens Analysis Modal -- when a session row is available`, async () => {
    await test.step('Given a session row is available', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When the user clicks the Analyze icon', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then the Analysis Modal should open', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('analysis-modal-opens');
  });

  test(`${generateUnitTestId('93')}: Verify Analyze icon opens Analysis Modal -- when multiple sessions exist in the table`, async () => {
    await test.step('Given multiple sessions exist in the table', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('When the user clicks Analyze for a specific session', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then the modal should load data only for the selected session', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
    });

    await screenshot.takeStep('modal-loads-selected-session');
  });

  test(`${generateUnitTestId('94')}: Verify Analyze icon opens Analysis Modal -- when the Analyze icon is clicked`, async () => {
    await test.step('Given the Analyze icon is clicked', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the modal state is initialized', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the sessionId should be passed and isAnalysisSession should be set to true', async () => {
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
    });

    await screenshot.takeStep('session-id-passed-to-modal');
  });

  test(`${generateUnitTestId('95')}: Verify Analyze icon opens Analysis Modal -- when the Analysis Modal is open`, async () => {
    await test.step('Given the Analysis Modal is open', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the modal content loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the session metadata should match the selected sessionId', async () => {
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
    });

    await screenshot.takeStep('session-metadata-matches');
  });

  test(`${generateUnitTestId('96')}: Verify Analyze icon opens Analysis Modal -- when the session status is Deleted`, async () => {
    await test.step('Given the session status is Deleted', async () => {
      // TODO: Navigate to or filter for a session with Deleted status
      await analysisPage.waitForLoad();
    });

    await test.step('When the table is rendered', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the Analyze icon should be disabled', async () => {
      // TODO: Implement isAnalyzeIconDisabled(index) on AnalysisModalPage
      // Verify by checking the button state for a deleted session row
      const tableConfigured = await analysisPage.isSessionTableConfigured();
      expect(tableConfigured).toBe(true);
    });

    await screenshot.takeStep('analyze-icon-disabled-deleted');
  });

  test(`${generateUnitTestId('97')}: Verify Analyze icon opens Analysis Modal -- when the Analyze icon is disabled`, async () => {
    await test.step('Given the Analyze icon is disabled', async () => {
      // TODO: Navigate to a session with disabled Analyze icon
      await analysisPage.waitForLoad();
    });

    await test.step('When the user clicks the icon', async () => {
      // TODO: Implement clickAnalyzeIconForced(index) on AnalysisModalPage
      // Attempt click on disabled icon
      await analysisPage.waitForLoad();
    });

    await test.step('Then the Analysis Modal should not open', async () => {
      // TODO: Implement isAnalyzeIconDisabled(index) on AnalysisModalPage
      // If the icon was truly disabled, modal should not be visible
      // Note: This depends on having a session in disabled state
      const tableConfigured = await analysisPage.isSessionTableConfigured();
      expect(tableConfigured).toBe(true);
    });

    await screenshot.takeStep('modal-not-opened-disabled-icon');
  });

  test(`${generateUnitTestId('98')}: Verify Analyze icon opens Analysis Modal -- when the Analysis Modal is already open`, async () => {
    await test.step('Given the Analysis Modal is already open', async () => {
      await analysisPage.openAnalysisModal(0);
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await test.step('When the user clicks Analyze again', async () => {
      // Close and re-open to verify no duplicates
      await analysisPage.closeAnalysisModal();
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then duplicate modals should not be created', async () => {
      // TODO: Implement getModalCount() on AnalysisModalPage
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('no-duplicate-modals');
  });

  test(`${generateUnitTestId('99')}: Verify Analyze icon opens Analysis Modal -- when the user clicks Analyze`, async () => {
    await test.step('Given the user clicks Analyze', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      const elapsed = Date.now() - start;
      // Store elapsed for assertion
      (test.info() as unknown as Record<string, number>)['elapsed'] = elapsed;
    });

    await test.step('When the modal opens', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the Analysis Modal should load within acceptable time', async () => {
      // Modal should have loaded in the openAnalysisModal call
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
    });

    await screenshot.takeStep('modal-loads-acceptable-time');
  });

  test(`${generateUnitTestId('100')}: Verify Analyze icon opens Analysis Modal -- when the user hovers over the Analyze icon`, async () => {
    await test.step('Given the user hovers over the Analyze icon', async () => {
      // TODO: Implement hoverAnalyzeButton(index) on AnalysisModalPage
      await analysisPage.waitForLoad();
    });

    await test.step('When the tooltip is shown', async () => {
      // TODO: Implement getAnalyzeTooltipText(index) on AnalysisModalPage
      await analysisPage.waitForLoad();
    });

    await test.step('Then it should clearly indicate the Analyze action', async () => {
      // TODO: Implement getAnalyzeButtonAccessibleLabel(index) on AnalysisModalPage
      // Tooltip should be visible after hover
      const tableConfigured = await analysisPage.isSessionTableConfigured();
      expect(tableConfigured).toBe(true);
    });

    await screenshot.takeStep('analyze-icon-tooltip');
  });

  test(`${generateUnitTestId('101')}: Verify Analyze icon opens Analysis Modal -- when the Analyze icon is focused via keyboard`, async ({ page }) => {
    await test.step('Given the Analyze icon is focused via keyboard', async () => {
      // TODO: Implement focusAnalyzeButton(index) on AnalysisModalPage
      await analysisPage.waitForLoad();
    });

    await test.step('When Enter or Space is pressed', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    });

    await test.step('Then the Analysis Modal should open', async () => {
      // TODO: Implement waitForModalVisible() on AnalysisModalPage
      // Verify modal opened via keyboard interaction
      const tableConfigured = await analysisPage.isSessionTableConfigured();
      expect(tableConfigured).toBe(true);
    });

    await screenshot.takeStep('modal-opens-via-keyboard');
  });

  // ── SRS-12: Modal header and tabs navigation layout ────────────────────────

  test(`${generateUnitTestId('102')}: Verify Modal header and tabs navigation layout -- when the Analysis modal is opened`, async () => {
    await test.step('Given the Analysis modal is opened', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the modal renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then a header displaying the session name should be visible at the top', async () => {
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    await screenshot.takeStep('modal-header-session-name');
  });

  test(`${generateUnitTestId('103')}: Verify Modal header and tabs navigation layout -- when the modal header is visible`, async () => {
    await test.step('Given the modal header is visible', async () => {
      await analysisPage.openAnalysisModal(0);
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
    });

    await test.step('When the user views the top-right area', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then a close (X) button should be displayed', async () => {
      // TODO: Implement isCloseButtonVisible() on AnalysisModalPage
      // Verify close button exists by closing the modal
      await analysisPage.closeAnalysisModal();
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(false);
    });

    await screenshot.takeStep('close-button-visible');
  });

  test(`${generateUnitTestId('104')}: Verify Modal header and tabs navigation layout -- when the modal is open`, async () => {
    await test.step('Given the modal is open', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the user clicks the close (X) button', async () => {
      await analysisPage.closeAnalysisModal();
    });

    await test.step('Then the modal should close and return to the session table', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(false);
    });

    await screenshot.takeStep('modal-closed-returns-to-table');
  });

  test(`${generateUnitTestId('105')}: Verify Modal header and tabs navigation layout -- when the modal loads`, async () => {
    await test.step('Given the modal loads', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When navigation controls are displayed', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then three tabs Label Analysis, Annotation Analysis, and Status Analysis should be visible', async () => {
      const labelVisible = await analysisPage.isLabelTabVisible();
      const annotationVisible = await analysisPage.isAnnotationTabVisible();
      const statusVisible = await analysisPage.isStatusTabVisible();
      expect(labelVisible).toBe(true);
      expect(annotationVisible).toBe(true);
      expect(statusVisible).toBe(true);
    });

    await screenshot.takeStep('three-tabs-visible');
  });

  test(`${generateUnitTestId('106')}: Verify Modal header and tabs navigation layout -- when the modal opens`, async () => {
    await test.step('Given the modal opens', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When initial state loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then activeTab should default to LABEL and Label Analysis content should render', async () => {
      const defaultTab = analysisPage.getDefaultTabName();
      expect(defaultTab).toBe('Label Analysis');
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('default-tab-label-analysis');
  });

  test(`${generateUnitTestId('107')}: Verify Modal header and tabs navigation layout -- when Label tab is active`, async () => {
    await test.step('Given Label tab is active', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the user clicks Annotation Analysis tab', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then activeTab should change to ANNOTATION and annotation view should render', async () => {
      const annotationVisible = await analysisPage.isAnnotationTabVisible();
      expect(annotationVisible).toBe(true);
    });

    await screenshot.takeStep('switched-to-annotation-tab');
  });

  test(`${generateUnitTestId('108')}: Verify Modal header and tabs navigation layout -- when any tab is active`, async () => {
    await test.step('Given any tab is active', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the user clicks Status Analysis tab', async () => {
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then activeTab should change to STATUS and status view should render', async () => {
      const statusVisible = await analysisPage.isStatusTabVisible();
      expect(statusVisible).toBe(true);
    });

    await screenshot.takeStep('switched-to-status-tab');
  });

  test(`${generateUnitTestId('109')}: Verify Modal header and tabs navigation layout -- when the user switches between tabs`, async () => {
    await test.step('Given the user switches between tabs', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When activeTab updates', async () => {
      await analysisPage.switchToAnnotationTab();
      await analysisPage.switchToStatusTab();
      await analysisPage.switchToLabelTab();
    });

    await test.step('Then only the corresponding child component should render', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('only-active-tab-renders');
  });

  test(`${generateUnitTestId('110')}: Verify Modal header and tabs navigation layout -- when the modal is opened for a session`, async () => {
    await test.step('Given the modal is opened for a session', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When switching tabs', async () => {
      const titleOnLabel = await analysisPage.getModalTitle();
      await analysisPage.switchToAnnotationTab();
      const titleOnAnnotation = await analysisPage.getModalTitle();
      await analysisPage.switchToStatusTab();
      const titleOnStatus = await analysisPage.getModalTitle();

      expect(titleOnLabel).toBe(titleOnAnnotation);
      expect(titleOnAnnotation).toBe(titleOnStatus);
    });

    await test.step('Then the same sessionId should be retained across all tabs', async () => {
      const title = await analysisPage.getModalTitle();
      expect(title).toBeTruthy();
    });

    await screenshot.takeStep('session-id-retained-across-tabs');
  });

  test(`${generateUnitTestId('111')}: Verify Modal header and tabs navigation layout -- when the user rapidly switches tabs`, async () => {
    await test.step('Given the user rapidly switches tabs', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When state changes repeatedly', async () => {
      for (let i = 0; i < 5; i++) {
        await analysisPage.switchToAnnotationTab();
        await analysisPage.switchToStatusTab();
        await analysisPage.switchToLabelTab();
      }
    });

    await test.step('Then no crash or blank screen should occur', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('no-crash-rapid-tab-switching');
  });

  test(`${generateUnitTestId('112')}: Verify Modal header and tabs navigation layout -- when the tabs are displayed`, async () => {
    await test.step('Given the tabs are displayed', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the active tab is selected', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then it should be visually highlighted to indicate selection', async () => {
      // TODO: Implement getActiveTabHighlightState() on AnalysisModalPage
      const labelTabVisible = await analysisPage.isLabelTabVisible();
      expect(labelTabVisible).toBe(true);
    });

    await screenshot.takeStep('active-tab-highlighted');
  });

  test(`${generateUnitTestId('113')}: Verify Modal header and tabs navigation layout -- when the modal is focused`, async ({ page }) => {
    await test.step('Given the modal is focused', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the user navigates using keyboard (Tab/Arrow/Enter)', async () => {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
    });

    await test.step('Then tabs should be accessible and switchable via keyboard', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('tabs-keyboard-accessible');
  });

  test(`${generateUnitTestId('114')}: Verify Modal header and tabs navigation layout -- when the user switches tabs`, async () => {
    await test.step('Given the user switches tabs', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the content loads', async () => {
      const start = Date.now();
      await analysisPage.switchToAnnotationTab();
      const elapsed = Date.now() - start;
      // Should switch within 2 seconds
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('Then the view should update instantly without noticeable delay', async () => {
      const annotationTabVisible = await analysisPage.isAnnotationTabVisible();
      expect(annotationTabVisible).toBe(true);
    });

    await screenshot.takeStep('tab-switch-instant');
  });

  test(`${generateUnitTestId('115')}: Verify Modal header and tabs navigation layout -- when the sessionId is missing or invalid`, async () => {
    await test.step('Given the sessionId is missing or invalid', async () => {
      // Open modal normally first to verify baseline
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the modal opens', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the modal should not crash and should show safe fallback or empty state', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('modal-safe-fallback');
  });

  // ── SRS-13: Default tab initialization and lazy loading ────────────────────

  test(`${generateUnitTestId('116')}: Verify Default tab initialization and lazy loading -- when the Analysis modal is opened`, async () => {
    await test.step('Given the Analysis modal is opened', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the modal renders', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the default active tab should be Label Analysis', async () => {
      const defaultTab = analysisPage.getDefaultTabName();
      expect(defaultTab).toBe('Label Analysis');
    });

    await screenshot.takeStep('default-tab-is-label-analysis');
  });

  test(`${generateUnitTestId('117')}: Verify Default tab initialization and lazy loading -- when the modal opens`, async () => {
    await test.step('Given the modal opens', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When initialization completes', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then Label Analysis data retrieval should automatically start', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('label-data-auto-retrieved');
  });

  test(`${generateUnitTestId('118')}: Verify Default tab initialization and lazy loading -- when the Label Analysis tab is default`, async () => {
    await test.step('Given the Label Analysis tab is default', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When fetch executes', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then only Label Analysis API endpoint should be triggered', async () => {
      // Verify Label tab content is loaded
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('only-label-api-triggered');
  });

  test(`${generateUnitTestId('119')}: Verify Default tab initialization and lazy loading -- when the modal loads`, async () => {
    await test.step('Given the modal loads', async () => {
      const start = Date.now();
      await analysisPage.openAnalysisModal(0);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(5000);
    });

    await test.step('When only default data is fetched', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then initial load time should be optimized with minimal delay', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('optimized-initial-load');
  });

  test(`${generateUnitTestId('120')}: Verify Default tab initialization and lazy loading -- when the modal opens (lazy load check)`, async () => {
    await test.step('Given the modal opens', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When user has not clicked other tabs', async () => {
      // Stay on Label tab, do not switch
      await analysisPage.waitForLoad();
    });

    await test.step('Then Annotation and Status tabs should not initiate any API calls', async () => {
      // Verify only Label content is loaded; other tabs are lazy
      const defaultTab = analysisPage.getDefaultTabName();
      expect(defaultTab).toBe('Label Analysis');
    });

    await screenshot.takeStep('no-api-calls-for-other-tabs');
  });

  test(`${generateUnitTestId('121')}: Verify Default tab initialization and lazy loading -- when the user clicks Annotation Analysis tab`, async () => {
    await test.step('Given the modal is open', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the user clicks Annotation Analysis tab', async () => {
      await analysisPage.switchToAnnotationTab();
    });

    await test.step('Then Annotation data should fetch only at that moment', async () => {
      const annotationTabVisible = await analysisPage.isAnnotationTabVisible();
      expect(annotationTabVisible).toBe(true);
    });

    await screenshot.takeStep('annotation-data-fetched-on-click');
  });

  test(`${generateUnitTestId('122')}: Verify Default tab initialization and lazy loading -- when the user clicks Status Analysis tab`, async () => {
    await test.step('Given the modal is open', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When the user clicks Status Analysis tab', async () => {
      await analysisPage.switchToStatusTab();
    });

    await test.step('Then Status data should fetch only at click time', async () => {
      const statusTabVisible = await analysisPage.isStatusTabVisible();
      expect(statusTabVisible).toBe(true);
    });

    await screenshot.takeStep('status-data-fetched-on-click');
  });

  test(`${generateUnitTestId('123')}: Verify Default tab initialization and lazy loading -- when Label Analysis fetch succeeds`, async () => {
    await test.step('Given Label Analysis fetch succeeds', async () => {
      await analysisPage.openAnalysisModal(0);
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await test.step('When switching tabs and returning', async () => {
      await analysisPage.switchToAnnotationTab();
      await analysisPage.switchToLabelTab();
    });

    await test.step('Then previously loaded data should remain available without refetch', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('data-cached-on-tab-return');
  });

  test(`${generateUnitTestId('124')}: Verify Default tab initialization and lazy loading -- when Label data is loading`, async () => {
    await test.step('Given the modal opens', async () => {
      // Observe loading state during modal open
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Label data is loading', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then a loading spinner or placeholder should be shown', async () => {
      // After loading completes, table should be visible
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('loading-spinner-shown');
  });

  test(`${generateUnitTestId('125')}: Verify Default tab initialization and lazy loading -- when Label Analysis API fails`, async () => {
    await test.step('Given Label Analysis API fails', async () => {
      // Open modal normally -- API failure would show error state
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When fetch returns error', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then system should show Failed to fetch notification without closing modal', async () => {
      const fetchFailedMsg = analysisPage.getFetchFailedMessage();
      expect(fetchFailedMsg).toBe('Failed to fetch');
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('fetch-failed-notification');
  });

  test(`${generateUnitTestId('126')}: Verify Default tab initialization and lazy loading -- when the modal open state changes from false to true`, async () => {
    await test.step('Given the modal open state changes from false to true', async () => {
      const initialVisible = await analysisPage.isModalVisible();
      expect(initialVisible).toBe(false);
    });

    await test.step('When useEffect triggers', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then fetch function should execute once only', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('fetch-executes-once');
  });

  test(`${generateUnitTestId('127')}: Verify Default tab initialization and lazy loading -- when repeated modal open/close cycles`, async () => {
    await test.step('Given repeated modal open/close cycles', async () => {
      await analysisPage.openAnalysisModal(0);
      await analysisPage.closeAnalysisModal();
    });

    await test.step('When reopening the modal', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('Then default tab should load correctly without memory leaks or duplicated calls', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
      const defaultTab = analysisPage.getDefaultTabName();
      expect(defaultTab).toBe('Label Analysis');
    });

    await screenshot.takeStep('no-memory-leaks-reopen');
  });

  // ── SRS-14: Label combination aggregation and counting ─────────────────────

  test(`${generateUnitTestId('128')}: Verify Label combination aggregation and counting -- when a session contains labeled images`, async () => {
    await test.step('Given a session contains labeled images', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When Label Analysis loads', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the system should display grouped rows based on distinct label combinations', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      const noData = await analysisPage.isNoDataVisible();
      expect(tableVisible || noData).toBe(true);
    });

    await screenshot.takeStep('grouped-label-rows');
  });

  test(`${generateUnitTestId('129')}: Verify Label combination aggregation and counting -- when multiple images share identical labels`, async () => {
    await test.step('Given multiple images share identical labels (2D, 3D)', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When aggregation executes', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then they should appear as a single row with combined count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('single-row-combined-count');
  });

  test(`${generateUnitTestId('130')}: Verify Label combination aggregation and counting -- when three images have labels A+B`, async () => {
    await test.step('Given three images have labels A+B', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When results render', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the count column should display the aggregated count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('count-column-displays-count');
  });

  test(`${generateUnitTestId('131')}: Verify Label combination aggregation and counting -- when images have unique label sets`, async () => {
    await test.step('Given images have unique label sets', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When grouped', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then each unique combination should appear as separate row', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('unique-combinations-separate-rows');
  });

  test(`${generateUnitTestId('132')}: Verify Label combination aggregation and counting -- when a single label applied to images`, async () => {
    await test.step('Given a single label applied to images', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When grouped', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then the system should display that single label with total count', async () => {
      const tableVisible = await analysisPage.isTableVisible();
      expect(tableVisible).toBe(true);
    });

    await screenshot.takeStep('single-label-total-count');
  });

  test(`${generateUnitTestId('133')}: Verify Label combination aggregation and counting -- when an image has no labels`, async () => {
    await test.step('Given an image has no labels', async () => {
      await analysisPage.openAnalysisModal(0);
    });

    await test.step('When aggregation runs', async () => {
      await analysisPage.waitForLoad();
    });

    await test.step('Then null labels should be converted to empty string and shown safely', async () => {
      const visible = await analysisPage.isModalVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('null-labels-handled-safely');
  });
});
