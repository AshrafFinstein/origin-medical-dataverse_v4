import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export interface LabelData {
  name: string;
  abbreviation: string;
}

/**
 * LabelPage handles all interactions with Label Master data
 * Labels are used for classification in Data Labeling sessions
 */
export class LabelPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/masters');
    await this.navigateToLabelTab();
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate to Label tab in Masters
   */
  async navigateToLabelTab() {
    await this.click(this.selectors.common['master-tab'].label);
    await this.waitForLoadingComplete();
  }

  // ========== CREATE ==========

  /**
   * Create a new Label
   */
  async createLabel(data: LabelData) {
    // Click create button
    await this.click(this.selectors.label['label-create'].button);

    // Wait for modal to open
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.label['label-create'].modal);

    // Fill form
    await this.fill(this.selectors.label['label-create']['name-input'], data.name);
    await this.fill(this.selectors.label['label-create']['abbreviation-input'], data.abbreviation);

    // Submit
    await this.click(this.selectors.label['label-create']['submit-button']);

    // Wait for success
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  /**
   * Cancel Label creation
   */
  async cancelLabelCreation() {
    await this.click(this.selectors.label['label-create'].button);
    await this.waitForModalOpen();
    await this.click(this.selectors.label['label-create']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== READ ==========

  /**
   * Get Label count from table
   */
  async getLabelCount(): Promise<number> {
    const tableSelector = this.selectors.label['label-table'].root;
    return await this.getTableRowCount(tableSelector);
  }

  /**
   * Get Label name by row index
   */
  async getLabelName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.label['label-table'].root;
    return await this.getTableCellText(tableSelector, rowIndex, 1);
  }

  /**
   * Check if Label exists by name
   */
  async labelExists(name: string): Promise<boolean> {
    return await this.isVisible(`text=${name}`);
  }

  // ========== EXPORT ==========

  /**
   * Export labels
   */
  async exportLabels() {
    await this.click(this.selectors.label['label-export'].button);
    await this.waitForTimeout(2000); // Wait for download
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Wait for Label table to load
   */
  async waitForLabelTable() {
    await this.waitForSelector(this.selectors.label['label-table'].root);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify Label create modal is open
   */
  async isLabelCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.label['label-create'].modal);
  }

  /**
   * Search label in table
   */
  async searchLabel(searchTerm: string) {
    // Assuming there's a search input in the table
    const searchInput = this.page.locator('input[type="search"], input[placeholder*="Search"]');
    await searchInput.fill(searchTerm);
    await this.waitForLoadingComplete();
  }
}
