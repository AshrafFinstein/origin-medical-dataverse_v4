import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface EpicData {
  name: string;
  description?: string;
}

export interface EpicSearchCriteria {
  searchTerm: string;
}

/**
 * EpicPage handles all interactions with the Epic list page
 * Epic is the top-level organizational unit in the Dataverse application
 */
export class EpicPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/');
  }

  // ========== CREATE ==========

  /**
   * Create a new Epic
   */
  async createEpic(data: EpicData) {
    // Click create button
    await this.click(this.selectors.epic['epic-create'].button);

    // Wait for modal to open
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.epic['epic-create'].modal);

    // Fill form
    await this.fill(this.selectors.epic['epic-create']['name-input'], data.name);

    if (data.description) {
      await this.fill(this.selectors.epic['epic-create']['description-input'], data.description);
    }

    // Submit
    await this.click(this.selectors.epic['epic-create']['submit-button']);

    // Wait for success
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  /**
   * Cancel Epic creation
   */
  async cancelEpicCreation() {
    await this.click(this.selectors.epic['epic-create'].button);
    await this.waitForModalOpen();
    await this.click(this.selectors.epic['epic-create']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== READ / SEARCH ==========

  /**
   * Search for Epics
   */
  async searchEpic(criteria: EpicSearchCriteria) {
    // Click search button
    await this.click(this.selectors.epic['epic-search'].button);

    // Wait for modal
    await this.waitForSelector(this.selectors.epic['epic-search'].modal);

    // Enter search term
    await this.fill(this.selectors.epic['epic-search'].input, criteria.searchTerm);

    // Submit search
    await this.click(this.selectors.epic['epic-search']['submit-button']);

    // Wait for results
    await this.waitForSelector(this.selectors.epic['epic-search']['results-table']);
  }

  /**
   * Get Epic count from table
   */
  async getEpicCount(): Promise<number> {
    const tableSelector = this.selectors.epic['epic-table'].root;
    return await this.getTableRowCount(tableSelector);
  }

  /**
   * Get Epic name by row index
   */
  async getEpicName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.epic['epic-table'].root;
    // Assuming name is in the first column (adjust column index if needed)
    return await this.getTableCellText(tableSelector, rowIndex, 1);
  }

  /**
   * Check if Epic exists by name
   */
  async epicExists(name: string): Promise<boolean> {
    return await this.isVisible(`text=${name}`);
  }

  // ========== NAVIGATE ==========

  /**
   * Navigate to an Epic's projects page by clicking on the Epic row
   */
  async navigateToEpic(rowIndex: number) {
    const tableSelector = this.selectors.epic['epic-table'].root;
    await this.clickTableCell(tableSelector, rowIndex, 1);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Epic by name
   */
  async navigateToEpicByName(name: string) {
    await this.clickByText(name);
    await this.waitForPageLoad();
  }

  // ========== DELETE ==========

  /**
   * Delete an Epic (opens delete modal)
   */
  async deleteEpic() {
    // Note: Based on selectors, delete seems to be triggered from within an Epic
    // This might need to be called from Epic detail page
    await this.waitForSelector(this.selectors.epic['epic-delete'].modal);
    await this.click(this.selectors.epic['epic-delete']['confirm-button']);
    await this.waitForToast('success');
  }

  /**
   * Cancel Epic deletion
   */
  async cancelEpicDeletion() {
    await this.click(this.selectors.epic['epic-delete']['cancel-button']);
    await this.waitForModalClose();
  }

  /**
   * View delete session requests
   */
  async viewDeleteSessionRequests() {
    await this.click(this.selectors.epic['epic-delete']['session-requests-button']);
    await this.waitForSelector(this.selectors.epic['delete-session']['requests-modal']);
  }

  /**
   * Reject a delete request
   */
  async rejectDeleteRequest(sessionName: string, reason: string) {
    await this.waitForSelector(this.selectors.epic['reject-delete']['request-modal']);
    await this.fill(this.selectors.epic['reject-request']['session-name-input'], sessionName);
    await this.fill(this.selectors.epic['reject-request']['reason-input'], reason);
    await this.click(this.selectors.epic['reject-request']['confirm-button']);
    await this.waitForToast('success');
  }

  /**
   * Cancel reject delete request
   */
  async cancelRejectDeleteRequest() {
    await this.click(this.selectors.epic['reject-request']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Wait for Epic table to load
   */
  async waitForEpicTable() {
    await this.waitForSelector(this.selectors.epic['epic-table'].root);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify Epic create modal is open
   */
  async isEpicCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-create'].modal);
  }

  /**
   * Verify Epic delete modal is open
   */
  async isEpicDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-delete'].modal);
  }
}
