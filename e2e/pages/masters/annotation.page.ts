import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export interface AnnotationData {
  name: string;
  abbreviation: string;
  taxonomyType: string;
  color?: string;
}

/**
 * AnnotationPage handles all interactions with Annotation Master data
 * Annotations are used for marking specific features in Data Labeling
 */
export class AnnotationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/masters');
    await this.navigateToAnnotationTab();
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate to Annotation tab in Masters
   */
  async navigateToAnnotationTab() {
    await this.click(this.selectors.common['master-tab'].annotation);
    await this.waitForLoadingComplete();
  }

  // ========== CREATE ==========

  /**
   * Create a new Annotation
   */
  async createAnnotation(data: AnnotationData) {
    // Click create button
    await this.click(this.selectors.annotation['annotation-create'].button);

    // Wait for modal to open
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.annotation['annotation-create'].modal);

    // Fill form
    await this.fill(this.selectors.annotation['annotation-create']['name-input'], data.name);
    await this.fill(this.selectors.annotation['annotation-create']['abbreviation-input'], data.abbreviation);

    // Select taxonomy type
    await this.selectOption(
      this.selectors.annotation['annotation-create']['taxonomy-type-select'],
      data.taxonomyType
    );

    // Select color if provided
    if (data.color) {
      await this.click(this.selectors.annotation['annotation-create']['color-picker']);
      // Color selection logic would go here
      await this.waitForTimeout(500);
    }

    // Submit
    await this.click(this.selectors.annotation['annotation-create']['submit-button']);

    // Wait for success
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  /**
   * Cancel Annotation creation
   */
  async cancelAnnotationCreation() {
    await this.click(this.selectors.annotation['annotation-create'].button);
    await this.waitForModalOpen();
    await this.click(this.selectors.annotation['annotation-create']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== UPDATE ==========

  /**
   * Update an existing annotation
   */
  async updateAnnotation(rowIndex: number, data: Partial<AnnotationData>) {
    // Click update button for the row
    const updateButton = `${this.selectors.annotation['annotation-table'].root} tbody tr:nth-child(${rowIndex}) ${this.selectors.annotation['annotation-update'].button}`;

    await this.click(updateButton);
    await this.waitForModalOpen();

    // Update fields
    if (data.name) {
      await this.fill(this.selectors.annotation['annotation-create']['name-input'], data.name);
    }

    if (data.abbreviation) {
      await this.fill(this.selectors.annotation['annotation-create']['abbreviation-input'], data.abbreviation);
    }

    if (data.taxonomyType) {
      await this.selectOption(
        this.selectors.annotation['annotation-create']['taxonomy-type-select'],
        data.taxonomyType
      );
    }

    // Submit
    await this.click(this.selectors.annotation['annotation-create']['submit-button']);
    await this.waitForToast('success');
  }

  // ========== READ ==========

  /**
   * Get Annotation count from table
   */
  async getAnnotationCount(): Promise<number> {
    const tableSelector = this.selectors.annotation['annotation-table'].root;
    return await this.getTableRowCount(tableSelector);
  }

  /**
   * Get Annotation name by row index
   */
  async getAnnotationName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.annotation['annotation-table'].root;
    return await this.getTableCellText(tableSelector, rowIndex, 1);
  }

  /**
   * Check if Annotation exists by name
   */
  async annotationExists(name: string): Promise<boolean> {
    return await this.isVisible(`text=${name}`);
  }

  // ========== EXPORT ==========

  /**
   * Export annotations
   */
  async exportAnnotations() {
    await this.click(this.selectors.annotation['annotation-export'].button);
    await this.waitForTimeout(2000); // Wait for download
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Wait for Annotation table to load
   */
  async waitForAnnotationTable() {
    await this.waitForSelector(this.selectors.annotation['annotation-table'].root);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify Annotation create modal is open
   */
  async isAnnotationCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.annotation['annotation-create'].modal);
  }
}
