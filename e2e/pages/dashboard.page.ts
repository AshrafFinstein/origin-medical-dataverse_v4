import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import selectors from '../selectors/selectors.json';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto('/dashboard');
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(selectors.dashboard.pageTitle);
  }

  async navigateToEpics() {
    await this.click(selectors.dashboard.epicsTab);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToProjects() {
    await this.click(selectors.dashboard.projectsTab);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSessions() {
    await this.click(selectors.dashboard.sessionsTab);
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.click(selectors.dashboard.userProfile);
    await this.click(selectors.dashboard.logoutButton);
  }

  async isNavigationVisible(): Promise<boolean> {
    return await this.isVisible(selectors.dashboard.navigationMenu);
  }
}
