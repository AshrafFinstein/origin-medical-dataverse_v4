import { BaseModule } from '../shared/base-module';
import { EpicSelectors, ProjectSelectors, getDynamicSelector } from '../../selectors';

// UUID pattern: 8-4-4-4-12 hex chars
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export class SessionNavigationModule extends BaseModule {
  async navigateBack() {
    await this.click(this.selectors.session['session-back'].button);
    await this.waitForPageLoad();
  }

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

  async navigateToModule() {
    // If session table is already visible, skip navigation
    try {
      const sessionTable = this.selectors.session['session-table'].root;
      const tableVisible = await this.isVisible(sessionTable);

      if (tableVisible) {
        await this.waitForLoadingComplete();
        return;
      }
    } catch {
      // Session table not visible, need to navigate
    }

    // Navigate: Home → Epic → Project → Session table
    // Use 'load' instead of 'networkidle' because the Nuxt app renders
    // the epic table asynchronously after checking user abilities.
    await this.page.goto('/', { waitUntil: 'load' });
    await this.page.waitForTimeout(2000);
    await this.waitForLoadingComplete();

    // ─── Step 1: Click Epic "Go" button ───────────────────────────
    const epicGoButton = getDynamicSelector(EpicSelectors['epic-go'].button, { index: 0 });
    await this.waitForSelector(epicGoButton, { timeout: 15000, state: 'visible' });
    await this.waitForLoadingComplete();
    await this.click(epicGoButton);

    // Wait for URL to change to /epic/{uuid}
    await this.page.waitForURL(/\/epic\//, { timeout: 15000 });
    const epicUrl = this.page.url();
    if (!UUID_PATTERN.test(epicUrl)) {
      throw new Error(`Epic navigation failed — no valid ID in URL: ${epicUrl}`);
    }
    await this.waitForPageLoad();
    await this.waitForLoadingComplete();

    // ─── Step 2: Click Project "Go" button ────────────────────────
    const projectGoButton = getDynamicSelector(ProjectSelectors['project-go'].button, { index: 0 });
    await this.waitForSelector(projectGoButton, { timeout: 15000, state: 'visible' });
    await this.waitForLoadingComplete();
    await this.click(projectGoButton);

    // Wait for URL to change to /project/{uuid}
    await this.page.waitForURL(/\/project\//, { timeout: 15000 });
    const projectUrl = this.page.url();
    if (!UUID_PATTERN.test(projectUrl)) {
      throw new Error(
        `Project navigation failed — no valid ID in URL: ${projectUrl}. ` +
        `Ensure at least one Project exists under the first Epic.`,
      );
    }
    await this.waitForPageLoad();
    await this.waitForLoadingComplete();

    // ─── Step 3: Wait for session table ───────────────────────────
    const sessionTable = this.selectors.session['session-table'].root;
    await this.waitForSelector(sessionTable, { timeout: 15000, state: 'visible' });
    await this.waitForLoadingComplete();
  }
}
