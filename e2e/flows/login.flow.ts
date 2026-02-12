import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers } from '../config/test.config';

export class LoginFlow {
  private page: Page;
  private loginPage: LoginPage;
  private dashboardPage: DashboardPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
  }

  /**
   * Complete login flow as admin user
   */
  async loginAsAdmin() {
    await this.loginPage.goto();
    await this.loginPage.login(
      testUsers.admin.username,
      testUsers.admin.password
    );
    await this.page.waitForURL(/.*dashboard/);
  }

  /**
   * Complete login flow as regular user
   */
  async loginAsUser() {
    await this.loginPage.goto();
    await this.loginPage.login(
      testUsers.user.username,
      testUsers.user.password
    );
    await this.page.waitForURL(/.*dashboard/);
  }

  /**
   * Complete login and navigate to specific section
   */
  async loginAndNavigateTo(section: 'epics' | 'projects' | 'sessions') {
    await this.loginAsAdmin();

    switch (section) {
      case 'epics':
        await this.dashboardPage.navigateToEpics();
        break;
      case 'projects':
        await this.dashboardPage.navigateToProjects();
        break;
      case 'sessions':
        await this.dashboardPage.navigateToSessions();
        break;
    }
  }

  /**
   * Complete logout flow
   */
  async logout() {
    await this.dashboardPage.logout();
    await this.page.waitForURL(/.*login/);
  }
}
