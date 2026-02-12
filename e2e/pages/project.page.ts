import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface ProjectData {
  name: string;
  description?: string;
  assignees?: string[];
}

export interface ProjectSearchCriteria {
  searchTerm: string;
}

/**
 * ProjectPage handles all interactions with the Project management page
 * Projects belong to Epics and contain Sessions (DL and CE)
 */
export class ProjectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(epicId?: string) {
    if (epicId) {
      await super.goto(`/epic/${epicId}`);
    } else {
      // Navigate to home and then to first epic
      await super.goto('/');
    }
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate back to Epic list
   */
  async navigateBack() {
    await this.click(this.selectors.project['project-back'].button);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to home via breadcrumb
   */
  async navigateToHome() {
    await this.click(this.selectors.project['project-breadcrumb'].home);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to specific project
   */
  async navigateToProject(rowIndex: number) {
    const tableSelector = this.selectors.project['project-table'].root;
    await this.clickTableCell(tableSelector, rowIndex, 1);
    await this.waitForPageLoad();
  }

  // ========== CREATE ==========

  /**
   * Create a new Project
   */
  async createProject(data: ProjectData) {
    // Click create button
    await this.click(this.selectors.project['project-create'].button);

    // Wait for modal to open
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.project['project-create'].modal);

    // Fill form
    await this.fill(this.selectors.project['project-create']['name-input'], data.name);

    if (data.description) {
      await this.fill(
        this.selectors.project['project-create']['description-input'],
        data.description
      );
    }

    // Select assignees if provided
    if (data.assignees && data.assignees.length > 0) {
      if (data.assignees.includes('all')) {
        await this.click(this.selectors.project['project-create']['select-all-assignees']);
      } else {
        for (const assignee of data.assignees) {
          await this.page.locator(this.selectors.project['project-create']['assignees-select'])
            .selectOption(assignee);
        }
      }
    }

    // Submit
    await this.click(this.selectors.project['project-create']['submit-button']);

    // Wait for success
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  /**
   * Cancel Project creation
   */
  async cancelProjectCreation() {
    await this.click(this.selectors.project['project-create'].button);
    await this.waitForModalOpen();
    await this.click(this.selectors.project['project-create']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== READ / SEARCH ==========

  /**
   * Search for Projects
   */
  async searchProject(criteria: ProjectSearchCriteria) {
    // Click search button
    await this.click(this.selectors.project['project-search'].button);

    // Wait for modal
    await this.waitForSelector(this.selectors.project['project-search'].modal);

    // Enter search term
    await this.fill(this.selectors.project['project-search'].input, criteria.searchTerm);

    // Submit search
    await this.click(this.selectors.project['project-search']['submit-button']);

    // Wait for results
    await this.waitForSelector(this.selectors.project['project-search']['results-table']);
  }

  /**
   * Get Project count from table
   */
  async getProjectCount(): Promise<number> {
    const tableSelector = this.selectors.project['project-table'].root;
    return await this.getTableRowCount(tableSelector);
  }

  /**
   * Get Project name by row index
   */
  async getProjectName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.project['project-table'].root;
    return await this.getTableCellText(tableSelector, rowIndex, 1);
  }

  /**
   * Check if Project exists by name
   */
  async projectExists(name: string): Promise<boolean> {
    return await this.isVisible(`text=${name}`);
  }

  // ========== DELETE ==========

  /**
   * Delete a Project
   */
  async deleteProject(confirmName: string) {
    // Wait for delete modal to be triggered (usually from a button click in the UI)
    await this.waitForSelector(this.selectors.project['project-delete'].modal);

    // Confirm deletion
    await this.click(this.selectors.project['project-delete']['confirm-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Cancel Project deletion
   */
  async cancelProjectDeletion() {
    await this.click(this.selectors.project['project-delete']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== USER MANAGEMENT ==========

  /**
   * Remove user from project
   */
  async removeUserFromProject() {
    // Wait for user removal modal
    await this.waitForSelector(this.selectors.project['project-user']['removal-modal']);

    // Confirm removal
    await this.click(this.selectors.project['project-user']['removal-confirm-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Cancel user removal
   */
  async cancelUserRemoval() {
    await this.click(this.selectors.project['project-user']['removal-cancel-button']);
    await this.waitForModalClose();
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Wait for Project table to load
   */
  async waitForProjectTable() {
    await this.waitForSelector(this.selectors.project['project-table'].root);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify Project create modal is open
   */
  async isProjectCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.project['project-create'].modal);
  }

  /**
   * Verify Project delete modal is open
   */
  async isProjectDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.project['project-delete'].modal);
  }

  /**
   * Verify Project search modal is open
   */
  async isProjectSearchModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.project['project-search'].modal);
  }
}
