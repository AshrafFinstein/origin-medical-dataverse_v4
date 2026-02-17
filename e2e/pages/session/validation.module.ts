import { BaseModule } from '../shared/base-module';

type SessionSelectorEntry = {
  button?: string;
  input?: string;
  select?: string;
  modal?: string;
  table?: string;
  root?: string;
};

export class SessionValidationModule extends BaseModule {
  async waitForSessionTable(timeout: number = 15000) {
    try {
      await this.waitForSelector(this.selectors.session['session-table'].root, {
        timeout,
        state: 'visible'
      });
      await this.waitForLoadingComplete();
    } catch {
      const currentUrl = this.page.url();
      throw new Error(`Session table not visible after ${timeout}ms. Current URL: ${currentUrl}`);
    }
  }

  async getSessionCount(): Promise<number> {
    const tableSelector = this.selectors.session['session-table'].root;
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getSessionName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.session['session-table'].root;
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async sessionExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async isSessionCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-create'].modal);
  }

  async isSessionDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-delete'].modal);
  }

  async isSessionLabelTableVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-label'].table);
  }

  async isSessionTableVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-table'].root);
  }

  async verifyElementVisible(elementKey: string): Promise<boolean> {
    const parts = elementKey.split('-');
    const category = parts.slice(0, 2).join('-');
    const key = parts.slice(2).join('-') || 'root';
    const selector = this.getSessionSelector(category)?.[key as keyof SessionSelectorEntry];
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  async verifyModalVisible(modalKey: string): Promise<boolean> {
    const selector = this.getSessionSelector(modalKey)?.modal;
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  async verifyTableData(): Promise<boolean> {
    return await this.isVisible(this.selectors.session['session-table'].root);
  }

  async isButtonVisible(buttonKey: string): Promise<boolean> {
    const selector = this.getSessionSelector(buttonKey)?.button;
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  async isInputVisible(inputKey: string): Promise<boolean> {
    const selector = this.getSessionSelector(inputKey)?.input;
    if (selector) {
      return await this.isVisible(selector);
    }
    return false;
  }

  async getErrorMessage(): Promise<string> {
    try {
      return await this.ctx.getToastMessage('error');
    } catch {
      return '';
    }
  }

  async getSuccessMessage(): Promise<string> {
    try {
      return await this.ctx.getToastMessage('success');
    } catch {
      return '';
    }
  }

  private getSessionSelector(key: string): SessionSelectorEntry | undefined {
    const sessionSelectors = this.selectors.session as Record<string, SessionSelectorEntry>;
    return sessionSelectors[key];
  }
}
