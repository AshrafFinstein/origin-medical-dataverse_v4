import { Page, Locator } from '@playwright/test';
import selectors from '../selectors/selectors.json';

export class DashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly navigationMenu: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;
  readonly epicsTab: Locator;
  readonly projectsTab: Locator;
  readonly sessionsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(selectors.dashboard.pageTitle);
    this.navigationMenu = page.locator(selectors.dashboard.navigationMenu);
    this.userProfile = page.locator(selectors.dashboard.userProfile);
    this.logoutButton = page.locator(selectors.dashboard.logoutButton);
    this.epicsTab = page.locator(selectors.dashboard.epicsTab);
    this.projectsTab = page.locator(selectors.dashboard.projectsTab);
    this.sessionsTab = page.locator(selectors.dashboard.sessionsTab);
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async navigateToEpics() {
    await this.epicsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToProjects() {
    await this.projectsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSessions() {
    await this.sessionsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  async logout() {
    await this.userProfile.click();
    await this.logoutButton.click();
  }

  async isNavigationVisible(): Promise<boolean> {
    return await this.navigationMenu.isVisible();
  }
}
