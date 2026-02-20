import { BaseModule } from '../shared/base-module';

export class DLValidationModule extends BaseModule {
  async getCurrentImageInfo(): Promise<{ current: number; total: number }> {
    const infoText = await this.ctx.getText(this.selectors.dataLabelling['dl-counter']);
    const match = infoText.match(/(\d+)\s+of\s+(\d+)/);

    if (match) {
      return {
        current: parseInt(match[1], 10),
        total: parseInt(match[2], 10)
      };
    }

    return { current: 0, total: 0 };
  }

  async getAnnotationCount(): Promise<number> {
    const annotations = this.page.locator(this.selectors.dataLabelling['dl-annotation-items']);
    return await annotations.count();
  }

  async annotationExistsWithLabel(labelName: string): Promise<boolean> {
    return await this.ctx.isTextVisible(labelName);
  }

  async waitForImageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.waitForLoadingComplete();
  }

  async areChangesSaved(): Promise<boolean> {
    return await this.isVisible(this.selectors.dataLabelling['dl-status-saved-indicator']);
  }

  // ============================================================
  // Auto navigate to valid /project/<uuid>
  // ============================================================
  async navigateToModule() {
    // Step 1: Go to home
    await this.ctx.goto('/');
    await this.waitForLoadingComplete();

    // Step 2: Fetch projects list from API (same logged-in session)
    const res = await this.page.request.get('/api/projects');

    if (!res.ok()) {
      throw new Error(`Failed to fetch projects list. Status: ${res.status()}`);
    }

    const data = await res.json();

    // Step 3: Extract first projectId safely (supports multiple API response formats)
    const projectId =
      data?.projects?.[0]?.id ||
      data?.data?.[0]?.id ||
      data?.[0]?.id;

    if (!projectId) {
      throw new Error(`Project ID missing in API response: ${JSON.stringify(data)}`);
    }

    // Step 4: Navigate to correct project page
    await this.ctx.goto(`/project/${projectId}`);
    await this.waitForLoadingComplete();
  }

  async waitForSessionTable(timeout: number = 15000) {
    await this.waitForSelector(this.selectors.session['session-table'], {
      timeout,
      state: 'visible',
    });
    await this.waitForLoadingComplete();
  }

  async verifyTableData(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-table']);
  }

  async selectFromDropdown(dropdownKey: string, value: string) {
    const selector = this.getSessionSelector(dropdownKey);
    if (selector) {
      await this.selectOption(selector, value);
    }
  }

  async clickCreateButton() {
    await this.click(this.selectors.session['session-create-button']);
    await this.waitForModalOpen();
  }

  async fillInputField(fieldName: string, value: string) {
    const selector = this.getSessionSelector(`session-${fieldName}`);
    if (selector) {
      await this.fill(selector, value);
    }
  }

  async verifyElementVisible(elementKey: string): Promise<boolean> {
    const selector = this.getSessionSelector(elementKey);
    return selector ? this.isVisible(selector) : false;
  }

  async verifyModalVisible(modalKey: string): Promise<boolean> {
    const selector = this.getSessionSelector(modalKey);
    return selector ? this.isVisible(selector) : false;
  }

  async getErrorMessage(): Promise<string> {
    return await this.ctx.getToastMessage('error');
  }

  async isInputVisible(inputKey: string): Promise<boolean> {
    const selector = this.getSessionSelector(inputKey);
    return selector ? this.isVisible(selector) : false;
  }

  async isSessionCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-create-modal']);
  }

  async applyFilter(searchTerm: string) {
    await this.fill(this.selectors.session['session-search-input'], searchTerm);
    await this.click(this.selectors.session['session-search-icon']);
    await this.waitForLoadingComplete();
  }

  async getSessionCount(): Promise<number> {
    return await this.ctx.getTableRowCount(this.selectors.session['session-table']);
  }

  private getSessionSelector(key: string): string | undefined {
    const sessionSelectors = this.selectors.session as Record<string, string>;
    return sessionSelectors[key];
  }
}
