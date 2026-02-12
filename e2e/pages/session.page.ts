import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface SessionData {
  name: string;
  description?: string;
  autoGenerate?: boolean;
  status?: string;
  labels?: string[];
  assignees?: string[];
  reviewers?: string[];
  approvalLevel?: string;
  sessionCodes?: {
    projectCode?: string;
    subProjectCode?: string;
    useCaseCode?: string;
    anatomyPlaneCode?: string;
    centerCode?: string;
    userTypeCode?: string;
    setCode?: string;
  };
}

export interface SessionSearchCriteria {
  searchTerm: string;
}

export interface ImageSearchCriteria {
  searchTerm: string;
  count?: number;
}

/**
 * SessionPage handles all interactions with Session management
 * Sessions can be Data Labeling (DL) or Clinical Evaluation (CE)
 */
export class SessionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(projectId?: string) {
    if (projectId) {
      await super.goto(`/project/${projectId}`);
    } else {
      await super.goto('/');
    }
  }

  // ========== NAVIGATION ==========

  /**
   * Navigate back to Project list
   */
  async navigateBack() {
    await this.click(this.selectors.session['session-back'].button);
    await this.waitForPageLoad();
  }

  /**
   * Navigate via breadcrumb
   */
  async navigateToHome() {
    await this.click(this.selectors.session['session-breadcrumb'].home);
    await this.waitForPageLoad();
  }

  async navigateToEpic() {
    await this.click(this.selectors.session['session-breadcrumb'].epic);
    await this.waitForPageLoad();
  }

  async navigateToProject() {
    await this.click(this.selectors.session['session-breadcrumb'].project);
    await this.waitForPageLoad();
  }

  // ========== CREATE SESSION ==========

  /**
   * Create a new Session (DL or CE)
   */
  async createSession(data: SessionData) {
    // Click create button
    await this.click(this.selectors.session['session-create'].button);

    // Wait for modal to open
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.session['session-create'].modal);

    // Fill session name
    await this.fill(this.selectors.session['session-name'].input, data.name);

    // Auto-generate name checkbox
    if (data.autoGenerate !== undefined) {
      const checkbox = this.page.locator(this.selectors.session['session-auto']['generate-checkbox']);
      const isChecked = await checkbox.isChecked();

      if (data.autoGenerate && !isChecked) {
        await this.check(this.selectors.session['session-auto']['generate-checkbox']);
      } else if (!data.autoGenerate && isChecked) {
        await this.uncheck(this.selectors.session['session-auto']['generate-checkbox']);
      }
    }

    // Fill description
    if (data.description) {
      await this.fill(this.selectors.session['session-description'].input, data.description);
    }

    // Select status
    if (data.status) {
      await this.selectOption(this.selectors.session['session-status'].select, data.status);
    }

    // Configure session codes
    if (data.sessionCodes) {
      await this.configureSessionCodes(data.sessionCodes);
    }

    // Select assignees
    if (data.assignees && data.assignees.length > 0) {
      if (data.assignees.includes('all')) {
        await this.click(this.selectors.session['session-assignees']['select-all']);
      } else {
        const assigneeSelect = this.selectors.session['session-assignees'].select;
        for (const assignee of data.assignees) {
          await this.page.locator(assigneeSelect).selectOption(assignee);
        }
      }
    }

    // Select reviewers
    if (data.reviewers && data.reviewers.length > 0) {
      if (data.reviewers.includes('all')) {
        await this.click(this.selectors.session['session-reviewers']['select-all']);
      } else {
        const reviewerSelect = this.selectors.session['session-reviewers'].select;
        for (const reviewer of data.reviewers) {
          await this.page.locator(reviewerSelect).selectOption(reviewer);
        }
      }
    }

    // Select approval level
    if (data.approvalLevel) {
      await this.selectOption(
        this.selectors.session['session-approval']['level-select'],
        data.approvalLevel
      );
    }

    // Select labels
    if (data.labels && data.labels.length > 0) {
      const labelSelect = this.selectors.session['session-labels'].select;
      for (const label of data.labels) {
        await this.page.locator(labelSelect).selectOption(label);
      }
    }

    // Submit (modal should have a submit button - you may need to add this selector)
    // For now, we'll assume pressing Enter or clicking outside closes and saves
    await this.page.keyboard.press('Enter');

    // Wait for success
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  /**
   * Configure session codes
   */
  private async configureSessionCodes(codes: SessionData['sessionCodes']) {
    if (!codes) {
      return;
    }

    if (codes.projectCode) {
      await this.selectOption(this.selectors.session['session-project']['code-select'], codes.projectCode);
    }

    if (codes.subProjectCode) {
      await this.selectOption(this.selectors.session['session-sub']['project-code-select'], codes.subProjectCode);
    }

    if (codes.useCaseCode) {
      await this.selectOption(this.selectors.session['session-use']['case-code-select'], codes.useCaseCode);
    }

    if (codes.anatomyPlaneCode) {
      await this.selectOption(this.selectors.session['session-anatomy']['plane-code-select'], codes.anatomyPlaneCode);
    }

    if (codes.centerCode) {
      await this.selectOption(this.selectors.session['session-center']['code-select'], codes.centerCode);
    }

    if (codes.userTypeCode) {
      await this.selectOption(this.selectors.session['session-user']['type-code-select'], codes.userTypeCode);
    }

    if (codes.setCode) {
      await this.fill(this.selectors.session['session-set']['code-input'], codes.setCode);
    }
  }

  /**
   * Generate session name automatically
   */
  async generateSessionName() {
    await this.click(this.selectors.session['session-generate']['name-button']);
    await this.page.waitForTimeout(500);
  }

  // ========== SEARCH ==========

  /**
   * Search for Sessions
   */
  async searchSession(criteria: SessionSearchCriteria) {
    await this.fill(this.selectors.session['session-search'].input, criteria.searchTerm);
    await this.click(this.selectors.session['session-search'].icon);
    await this.waitForLoadingComplete();
  }

  /**
   * Clear session search
   */
  async clearSessionSearch() {
    await this.clear(this.selectors.session['session-search'].input);
    await this.click(this.selectors.session['session-search'].icon);
    await this.waitForLoadingComplete();
  }

  /**
   * Search for images within session
   */
  async searchImages(criteria: ImageSearchCriteria) {
    // Click search button
    await this.click(this.selectors.session['session-image']['search-button']);

    // Wait for modal
    await this.waitForSelector(this.selectors.session['session-image']['search-modal']);

    // Enter count if provided
    if (criteria.count) {
      await this.fill(
        this.selectors.session['session-image']['count-input'],
        criteria.count.toString()
      );
    }

    // Enter search term
    await this.fill(this.selectors.session['session-image']['search-input'], criteria.searchTerm);

    // Wait for results
    await this.waitForSelector(this.selectors.session['session-image']['search-table']);
  }

  // ========== IMPORT / EXPORT ==========

  /**
   * Import CSV data
   */
  async importCSV(filePath: string) {
    // Click import button
    await this.click(this.selectors.session['session-import']['csv-button']);

    // Upload file
    const fileInput = await this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Upload to S3
   */
  async uploadToS3(s3Key: string) {
    // Wait for S3 modal
    await this.waitForSelector(this.selectors.session['session-s3'].modal);

    // Enter S3 key
    await this.fill(this.selectors.session['session-s3']['key-input'], s3Key);

    // Click upload
    await this.click(this.selectors.session['session-s3']['upload-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  // ========== DELETE ==========

  /**
   * Request session deletion
   */
  async requestSessionDeletion(reason: string) {
    // Wait for delete modal
    await this.waitForSelector(this.selectors.session['session-delete'].modal);

    // Enter reason
    await this.fill(this.selectors.session['session-delete']['reason-input'], reason);

    // Submit request
    await this.click(this.selectors.session['session-delete']['request-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Cancel session deletion
   */
  async cancelSessionDeletion() {
    await this.click(this.selectors.session['session-delete']['cancel-button']);
    await this.waitForModalClose();
  }

  // ========== SESSION LABELS ==========

  /**
   * Create a session label
   */
  async createSessionLabel(name: string, description: string, color: string) {
    // Click create button
    await this.click(this.selectors.session['session-label']['create-button']);

    // Wait for modal
    await this.waitForSelector(this.selectors.session['session-label']['create-modal']);

    // Fill form
    await this.fill(this.selectors.session['session-label']['create-name-input'], name);
    await this.fill(this.selectors.session['session-label']['create-description-input'], description);

    // Select color
    await this.click(this.selectors.session['session-label']['create-color-picker']);
    // Color selection logic here

    // Submit
    await this.click(this.selectors.session['session-label']['create-submit-button']);

    // Wait for success
    await this.waitForToast('success');
  }

  /**
   * Cancel session label creation
   */
  async cancelSessionLabelCreation() {
    await this.click(this.selectors.session['session-label']['create-cancel-button']);
    await this.waitForModalClose();
  }

  // ========== SESSION CODES MANAGEMENT ==========

  /**
   * Navigate to session codes tab
   */
  async navigateToSessionCodesTab(tab: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType') {
    const tabSelector = this.selectors.session['session-codes'];

    
    switch (tab) {
      case 'project':
        await this.click(tabSelector['tab-project-code']);
        break;
      case 'subProject':
        await this.click(tabSelector['tab-sub-project-code']);
        break;
      case 'useCase':
        await this.click(tabSelector['tab-use-case-code']);
        break;
      case 'anatomyPlane':
        await this.click(tabSelector['tab-anatomy-plane-code']);
        break;
      case 'center':
        await this.click(tabSelector['tab-center-code']);
        break;
      case 'userType':
        await this.click(tabSelector['tab-user-type-code']);
        break;
    }

    await this.waitForLoadingComplete();
  }

  // ========== READ ==========

  /**
   * Get Session count from table
   */
  async getSessionCount(): Promise<number> {
    const tableSelector = this.selectors.session['session-table'].root;
    return await this.getTableRowCount(tableSelector);
  }

  /**
   * Get Session name by row index
   */
  async getSessionName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.session['session-table'].root;
    return await this.getTableCellText(tableSelector, rowIndex, 1);
  }

  /**
   * Check if Session exists by name
   */
  async sessionExists(name: string): Promise<boolean> {
    return await this.isVisible(`text=${name}`);
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Wait for Session table to load
   */
  async waitForSessionTable() {
    await this.waitForSelector(this.selectors.session['session-table'].root);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify Session create modal is open
   */
  async isSessionCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-create'].modal);
  }

  /**
   * Verify Session delete modal is open
   */
  async isSessionDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-delete'].modal);
  }

  /**
   * Verify Session label table is visible
   */
  async isSessionLabelTableVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-label'].table);
  }

  // ========== ADDITIONAL HELPER METHODS ==========

  /**
   * Navigate to session module/list
   * Navigates from Home → Epic → Project (where sessions are)
   */
  async navigateToModule() {
    try {
      // Check if we're already on a page with session table
      const sessionTable = this.selectors.session['session-table'].root;
      const tableVisible = await this.page.locator(sessionTable).isVisible({ timeout: 2000 });

      if (tableVisible) {
        // Already on session page
        await this.waitForLoadingComplete();
        return;
      }
    } catch {
      // Session table not visible, need to navigate
    }

    try {
      // Step 1: From home page, click on first epic's "Go" button
      const epicGoButton = '[data-testid="epic-go-button-0"]';
      await this.waitForSelector(epicGoButton, { timeout: 5000, state: 'visible' });
      await this.click(epicGoButton);
      await this.page.waitForLoadState('networkidle');

      // Step 2: From epic page, click on first project's "Go" button
      const projectGoButton = '[data-testid="project-go-button-0"]';
      await this.waitForSelector(projectGoButton, { timeout: 5000, state: 'visible' });
      await this.click(projectGoButton);
      await this.page.waitForLoadState('networkidle');

      // Step 3: Wait for session table to be visible
      const sessionTable = this.selectors.session['session-table'].root;
      await this.waitForSelector(sessionTable, { timeout: 5000, state: 'visible' });
      await this.waitForLoadingComplete();
    } catch (error: any) {
      console.error('⚠️  Navigation to session module failed:', error.message);
      console.error('   Make sure there is at least one Epic and one Project with sessions in the database');
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  /**
   * Click create button
   */
  async clickCreateButton() {
    await this.click(this.selectors.session['session-create'].button);
    await this.waitForModalOpen();
  }

  /**
   * Fill input field (generic)
   */
  async fillInputField(fieldName: string, value: string) {
    const selector = this.selectors.session[`session-${fieldName}`]?.input;
    if (selector) {
      await this.fill(selector, value);
    }
  }

  /**
   * Verify element visible by key
   */
  async verifyElementVisible(elementKey: string): Promise<boolean> {
    const parts = elementKey.split('-');
    const category = parts.slice(0, 2).join('-');
    const key = parts.slice(2).join('-') || 'root';

    const selector = this.selectors.session[category]?.[key];
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  /**
   * Select from dropdown
   */
  async selectFromDropdown(dropdownKey: string, value: string) {
    const selector = this.selectors.session[dropdownKey]?.select;
    if (selector) {
      await this.selectOption(selector, value);
    }
  }

  /**
   * Apply filter/search
   */
  async applyFilter(searchTerm: string) {
    await this.fill(this.selectors.session['session-search'].input, searchTerm);
    await this.click(this.selectors.session['session-search'].icon);
    await this.waitForLoadingComplete();
  }

  /**
   * Verify modal visible
   */
  async verifyModalVisible(modalKey: string): Promise<boolean> {
    const selector = this.selectors.session[modalKey]?.modal;
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  /**
   * Get error message from toast
   */
  async getErrorMessage(): Promise<string> {
    try {
      await this.waitForToast('error');
      const errorToast = this.page.locator('.n-message--error-type');
      return await errorToast.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Get success message from toast
   */
  async getSuccessMessage(): Promise<string> {
    try {
      await this.waitForToast('success');
      const successToast = this.page.locator('.n-message--success-type');
      return await successToast.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Perform generic action (click button by key)
   */
  async performAction(actionKey: string) {
    const selector = this.selectors.session[actionKey]?.button;
    if (selector) {
      await this.click(selector);
    }
  }

  /**
   * Check if button is visible
   */
  async isButtonVisible(buttonKey: string): Promise<boolean> {
    const selector = this.selectors.session[buttonKey]?.button;
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  /**
   * Check if input is visible
   */
  async isInputVisible(inputKey: string): Promise<boolean> {
    const selector = this.selectors.session[inputKey]?.input;
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  /**
   * Verify table data
   */
  async verifyTableData(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-table'].root);
  }
}
