import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AnalysisModalSelectors, SessionSelectors } from '../selectors';
import { AnalysisModalData } from '../test-data';

const {
  'session-analyze-button-${index}': sessionAnalyzeButtonTemplate,
  'analysis-modal': analysisModal,
  'analysis-modal-close-button': analysisModalCloseButton,
  'analysis-modal-title': analysisModalTitle,
  'analysis-tab-label': analysisTabLabel,
  'analysis-tab-annotation': analysisTabAnnotation,
  'analysis-tab-status': analysisTabStatus,
  'analysis-table': analysisTable,
  'analysis-page-size-select': analysisPageSizeSelect,
  'analysis-sort-name-button': analysisSortNameButton,
  'analysis-sort-count-button': analysisSortCountButton,
  'analysis-filter-search-input': analysisFilterSearchInput,
  'analysis-filter-select-all': analysisFilterSelectAll,
  'analysis-filter-apply-button': analysisFilterApplyButton,
  'analysis-pagination-next': analysisPaginationNext,
  'analysis-pagination-prev': analysisPaginationPrev,
  'analysis-no-data': analysisNoData,
} = AnalysisModalSelectors;

const { 'session-table': sessionTable } = SessionSelectors;

const { tabs, defaultTab, pageSizes, filterCacheDurationMin, filterMaxItems, errorMessages } =
  AnalysisModalData;

export class AnalysisModalPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSession(): Promise<void> {
    await this.navigate(process.env.SESSION_URL || '/');
  }

  // ── Modal ─────────────────────────────────────────────────────────────────

  async openAnalysisModal(index = 0): Promise<void> {
    const selector = sessionAnalyzeButtonTemplate.replace('${index}', String(index));
    await this.click(selector);
    await this.waitForVisible(analysisModal);
  }

  async closeAnalysisModal(): Promise<void> {
    await this.click(analysisModalCloseButton);
    await this.waitForHidden(analysisModal);
  }

  async isModalVisible(): Promise<boolean> {
    return this.isVisible(analysisModal);
  }

  async getModalTitle(): Promise<string> {
    return this.getText(analysisModalTitle);
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────

  async switchToLabelTab(): Promise<void> {
    await this.click(analysisTabLabel);
    await this.waitForLoad();
  }

  async switchToAnnotationTab(): Promise<void> {
    await this.click(analysisTabAnnotation);
    await this.waitForLoad();
  }

  async switchToStatusTab(): Promise<void> {
    await this.click(analysisTabStatus);
    await this.waitForLoad();
  }

  async isLabelTabVisible(): Promise<boolean> {
    return this.isVisible(analysisTabLabel);
  }

  async isAnnotationTabVisible(): Promise<boolean> {
    return this.isVisible(analysisTabAnnotation);
  }

  async isStatusTabVisible(): Promise<boolean> {
    return this.isVisible(analysisTabStatus);
  }

  // ── Pagination / Sort / Filter ────────────────────────────────────────────

  async isTableVisible(): Promise<boolean> {
    return this.isVisible(analysisTable);
  }

  async selectPageSize(size: number): Promise<void> {
    await this.selectOption(analysisPageSizeSelect, String(size));
    await this.waitForLoad();
  }

  async clickNextPage(): Promise<void> {
    await this.click(analysisPaginationNext);
    await this.waitForLoad();
  }

  async clickPrevPage(): Promise<void> {
    await this.click(analysisPaginationPrev);
    await this.waitForLoad();
  }

  async sortByName(): Promise<void> {
    await this.click(analysisSortNameButton);
    await this.waitForLoad();
  }

  async sortByCount(): Promise<void> {
    await this.click(analysisSortCountButton);
    await this.waitForLoad();
  }

  async searchInFilter(term: string): Promise<void> {
    await this.fill(analysisFilterSearchInput, term);
    await this.waitForLoad();
  }

  async selectAllInFilter(): Promise<void> {
    await this.click(analysisFilterSelectAll);
  }

  async applyFilter(): Promise<void> {
    await this.click(analysisFilterApplyButton);
    await this.waitForLoad();
  }

  async isNoDataVisible(): Promise<boolean> {
    return this.isVisible(analysisNoData);
  }

  // ── Config Verification ───────────────────────────────────────────────────

  async isAnalysisModalConfigured(): Promise<boolean> {
    return (
      Boolean(analysisModal) &&
      Boolean(analysisTabLabel) &&
      Boolean(analysisTabAnnotation) &&
      Boolean(analysisTabStatus)
    );
  }

  async isFilterConfigured(): Promise<boolean> {
    return (
      Boolean(analysisFilterSearchInput) &&
      Boolean(analysisFilterSelectAll) &&
      Boolean(analysisFilterApplyButton)
    );
  }

  async isPaginationConfigured(): Promise<boolean> {
    return Boolean(analysisPaginationNext) && Boolean(analysisPaginationPrev);
  }

  async isSortConfigured(): Promise<boolean> {
    return Boolean(analysisSortNameButton) && Boolean(analysisSortCountButton);
  }

  async isSessionTableConfigured(): Promise<boolean> {
    return Boolean(sessionTable);
  }

  areTabsConfigured(): boolean {
    return tabs.length === 3 && tabs[0] === 'Label Analysis';
  }

  getDefaultTabName(): string {
    return defaultTab;
  }

  getFilterCacheDuration(): number {
    return filterCacheDurationMin;
  }

  getFilterMaxItems(): number {
    return filterMaxItems;
  }

  getPageSizes(): number[] {
    return pageSizes;
  }

  getNoDataMessage(): string {
    return errorMessages.noData;
  }

  getFetchFailedMessage(): string {
    return errorMessages.fetchFailed;
  }
}
