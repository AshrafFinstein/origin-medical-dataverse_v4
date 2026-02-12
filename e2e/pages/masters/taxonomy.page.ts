import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export interface TaxonomyData {
  name: string;
  annotations?: Array<{
    annotation: string;
    color?: string;
  }>;
}

/**
 * TaxonomyPage handles all interactions with Taxonomy Master data
 * Taxonomies are hierarchical classification systems used in Data Labeling
 */
export class TaxonomyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/masters');
    await this.navigateToTaxonomyTab();
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate to Taxonomy tab in Masters
   */
  async navigateToTaxonomyTab() {
    await this.click(this.selectors.common['master-tab'].taxonomy);
    await this.waitForLoadingComplete();
  }

  // ========== CREATE ==========

  /**
   * Create a new Taxonomy
   */
  async createTaxonomy(data: TaxonomyData) {
    // Click create button
    await this.click(this.selectors.taxonomy['taxonomy-create'].button);

    // Wait for modal to open
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-create'].modal);

    // Fill taxonomy name
    await this.fill(this.selectors.taxonomy['taxonomy-create']['name-input'], data.name);

    // Add annotations if provided
    if (data.annotations && data.annotations.length > 0) {
      for (let i = 0; i < data.annotations.length; i++) {
        await this.addAnnotationToTaxonomy(i, data.annotations[i]);
      }
    }

    // Submit
    await this.click(this.selectors.taxonomy['taxonomy-create']['submit-button']);

    // Wait for success
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  /**
   * Cancel Taxonomy creation
   */
  async cancelTaxonomyCreation() {
    await this.click(this.selectors.taxonomy['taxonomy-create'].button);
    await this.waitForModalOpen();
    await this.click(this.selectors.taxonomy['taxonomy-create']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== ANNOTATION MANAGEMENT ==========

  /**
   * Add annotation to taxonomy
   */
  private async addAnnotationToTaxonomy(index: number, annotation: { annotation: string; color?: string }) {
    // Click add annotation button
    await this.click(this.selectors.taxonomy['taxonomy-add']['annotation-button']);
    await this.waitForTimeout(500);

    // Select annotation
    const selectSelector = this.getSelector(
      this.selectors.taxonomy['`taxonomy-annotation']['select-${index}`'],
      { index }
    );

    await this.selectOption(selectSelector, annotation.annotation);

    // Set color if provided
    if (annotation.color) {
      const colorPickerSelector = this.getSelector(
        this.selectors.taxonomy['`taxonomy-color']['picker-${index}`'],
        { index }
      );

      await this.click(colorPickerSelector);
      // Color selection logic
      await this.waitForTimeout(500);
    }
  }

  /**
   * Duplicate annotation row
   */
  async duplicateAnnotation(index: number) {
    const duplicateButton = this.getSelector(
      this.selectors.taxonomy['`taxonomy-duplicate']['button-${index}`'],
      { index }
    );

    await this.click(duplicateButton);
    await this.waitForTimeout(500);
  }

  /**
   * Delete annotation from taxonomy
   */
  async deleteAnnotationFromTaxonomy(index: number) {
    const deleteButton = this.getSelector(
      this.selectors.taxonomy['`taxonomy-delete']['annotation-button-${index}`'],
      { index }
    );

    await this.click(deleteButton);
    await this.waitForTimeout(500);
  }

  // ========== UPDATE ==========

  /**
   * Update taxonomy
   */
  async updateTaxonomy() {
    // Click update button
    await this.click(this.selectors.taxonomy['taxonomy-update'].button);

    // Wait for confirmation modal
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-update']['confirmation-modal']);

    // Confirm update
    await this.click(this.selectors.taxonomy['taxonomy-update']['confirmation-proceed-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Cancel taxonomy update
   */
  async cancelTaxonomyUpdate() {
    await this.click(this.selectors.taxonomy['taxonomy-update']['confirmation-cancel-button']);
    await this.waitForModalClose();
  }

  // ========== DELETE ==========

  /**
   * Delete taxonomy
   */
  async deleteTaxonomy() {
    // Wait for delete modal (triggered by delete button in table)
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-delete'].modal);

    // Confirm deletion
    await this.click(this.selectors.taxonomy['taxonomy-delete']['confirm-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Cancel taxonomy deletion
   */
  async cancelTaxonomyDeletion() {
    await this.click(this.selectors.taxonomy['taxonomy-delete']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== READ ==========

  /**
   * Get Taxonomy count from table
   */
  async getTaxonomyCount(): Promise<number> {
    const tableSelector = this.selectors.taxonomy['taxonomy-table'].root;
    return await this.getTableRowCount(tableSelector);
  }

  /**
   * Get Taxonomy name by row index
   */
  async getTaxonomyName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.taxonomy['taxonomy-table'].root;
    return await this.getTableCellText(tableSelector, rowIndex, 1);
  }

  /**
   * Check if Taxonomy exists by name
   */
  async taxonomyExists(name: string): Promise<boolean> {
    return await this.isVisible(`text=${name}`);
  }

  /**
   * Get annotation count in current taxonomy
   */
  async getAnnotationCountInTaxonomy(): Promise<number> {
    const rows = this.page.locator('[data-testid^="taxonomy-annotation-row-"]');
    return await rows.count();
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Wait for Taxonomy table to load
   */
  async waitForTaxonomyTable() {
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-table'].root);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify Taxonomy create modal is open
   */
  async isTaxonomyCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.taxonomy['taxonomy-create'].modal);
  }

  /**
   * Verify Taxonomy update confirmation modal is open
   */
  async isTaxonomyUpdateConfirmationModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.taxonomy['taxonomy-update']['confirmation-modal']);
  }

  /**
   * Verify Taxonomy delete modal is open
   */
  async isTaxonomyDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.taxonomy['taxonomy-delete'].modal);
  }
}
