import { Page } from '@playwright/test';
import { CommonSelectors, UserRolesSelectors } from '../selectors';

const {
  'header-masters-link': headerMastersLink,
  'header-masters-link-href': headerMastersLinkHref,
  'app-navigation': appNavigation,
} = CommonSelectors;

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class UserRolesPage {
  constructor(private page: Page) {}

  async navigateToUserRoles(): Promise<void> {
    await this.openMastersNav();
    await this.openUserRolesTab();
  }

  async editRolePermissions(): Promise<void> {
    await this.page.getByTestId(UserRolesSelectors.editRoleButton).click();
    await this.page.getByTestId(UserRolesSelectors.permissionsTab).click();
  }

  async openEditRole(roleName: string): Promise<void> {
    const row = this.page.locator('tr').filter({ hasText: new RegExp(roleName, 'i') }).first();
    if (await row.isVisible().catch(() => false)) {
      const editBtn = row.getByTestId(UserRolesSelectors.editRoleButton).first();
      if (await editBtn.isVisible().catch(() => false)) {
        await editBtn.click();
        return;
      }
      const editByRole = row.getByRole('button', { name: /edit/i }).first();
      if (await editByRole.isVisible().catch(() => false)) {
        await editByRole.click();
        return;
      }
    }

    const fallbackEdit = this.page.getByTestId(UserRolesSelectors.editRoleButton).first();
    if (await fallbackEdit.isVisible().catch(() => false)) {
      await fallbackEdit.click();
      return;
    }
    const fallbackByRole = this.page.getByRole('button', { name: /edit/i }).first();
    if (await fallbackByRole.isVisible().catch(() => false)) {
      await fallbackByRole.click();
      return;
    }
    throw new Error(`Edit button not found for role "${roleName}".`);
  }

  async openPermissionsTab(): Promise<void> {
    const permissionsTab = this.page.getByTestId(UserRolesSelectors.permissionsTab).first();
    if (await permissionsTab.isVisible().catch(() => false)) {
      await permissionsTab.click();
      return;
    }
    const permissionsByText = this.page.getByRole('tab', { name: /permissions/i }).first();
    if (await permissionsByText.isVisible().catch(() => false)) {
      await permissionsByText.click();
      return;
    }
    const permissionsHeader = this.page.getByText(/^Permissions$/i).first();
    if (await permissionsHeader.isVisible().catch(() => false)) {
      return;
    }
    const sessionSection = this.page.getByText(/^Session$/i).first();
    if (await sessionSection.isVisible().catch(() => false)) {
      return;
    }
    // No explicit permissions tab in this modal; assume permissions are already visible.
    return;
  }

  private async openMastersNav(): Promise<void> {
    const mastersMenu = this.page.getByTestId(UserRolesSelectors.mastersMenu).first();
    if (await mastersMenu.isVisible().catch(() => false)) {
      await mastersMenu.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const mastersLink = this.page.locator(tid(headerMastersLink)).first();
    if (await mastersLink.isVisible().catch(() => false)) {
      await mastersLink.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
      return;
    }

    const mastersByText = this.page.getByRole('link', { name: /masters/i }).first();
    if (await mastersByText.isVisible().catch(() => false)) {
      await mastersByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
      return;
    }

    const mastersByHref = this.page.locator(headerMastersLinkHref).first();
    if (await mastersByHref.isVisible().catch(() => false)) {
      await mastersByHref.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
      return;
    }

    const nav = this.page.locator(appNavigation).first();
    if (await nav.isVisible().catch(() => false)) {
      const navLink = nav.getByRole('link', { name: /masters/i }).first();
      if (await navLink.isVisible().catch(() => false)) {
        await navLink.click();
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
        return;
      }
    }

    if (!this.page.url().includes('/master')) {
      const href = await mastersByHref.getAttribute('href').catch(() => null);
      if (href) {
        const targetUrl = new URL(href, this.page.url()).toString();
        await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.page.waitForLoadState('networkidle').catch(() => {});
        return;
      }
      throw new Error(`Could not navigate to masters page from URL: ${this.page.url()}`);
    }
  }

  private async openUserRolesTab(): Promise<void> {
    const userRolesMenu = this.page.getByTestId(UserRolesSelectors.userRolesMenu).first();
    if (await userRolesMenu.isVisible().catch(() => false)) {
      await userRolesMenu.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const byText = this.page.getByRole('link', { name: /user roles/i }).first();
    if (await byText.isVisible().catch(() => false)) {
      await byText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const tabByText = this.page.getByRole('tab', { name: /user roles/i }).first();
    if (await tabByText.isVisible().catch(() => false)) {
      await tabByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const anyByText = this.page.locator('text=User Roles').first();
    if (await anyByText.isVisible().catch(() => false)) {
      await anyByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const buttonByText = this.page.getByRole('button', { name: /user roles/i }).first();
    if (await buttonByText.isVisible().catch(() => false)) {
      await buttonByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    throw new Error('User Roles tab/menu not found.');
  }

  async setSessionsLockPermission(enabled: boolean): Promise<void> {
    await this.page.getByTestId(UserRolesSelectors.sessionsPermissionExpand).click();
    const checkbox = this.page.getByTestId(UserRolesSelectors.sessionsLockCheckbox);
    if (enabled) {
      await checkbox.check();
      return;
    }
    await checkbox.uncheck();
  }

  async savePermissions(): Promise<void> {
    await this.page.getByTestId(UserRolesSelectors.savePermissionButton).click();
  }
}
