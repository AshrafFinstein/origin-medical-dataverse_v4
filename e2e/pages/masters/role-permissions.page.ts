import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';
import { CommonSelectors, RolePermissionsSelectors } from '../../selectors';
import TestData from '../../test-data/test-data';

const {
  'header-masters-link': headerMastersLink,
  'master-tab-role-permissions': masterTabRolePermissions,
  'role-permission-table': rolePermissionTable,
  'role-permission-create-button': rolePermissionCreateButton,
  'role-permission-update-button': rolePermissionUpdateButton,
  'header-logout-button': headerLogoutButton,
  'header-masters-link-href': headerMastersLinkHref,
  'app-navigation': appNavigation,
  'role-permission-table-fallback': rolePermissionTableFallback,
  'masters-user-roles-tab': mastersUserRolesTab,
  'masters-role-permissions-tab': mastersRolePermissionsTab,
  'masters-roles-tab-fallback': mastersRolesTabFallback,
  'role-permission-table-by-header': rolePermissionTableByHeader,
} = CommonSelectors;
const {
  permissionsTable,
  sessionPermissionRow,
  sessionLockCheckbox,
  updatePermissionButton,
  permissionUpdateSuccessToast,
} = RolePermissionsSelectors;

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export type LockPermissionData = {
  roleName: string;
  enabled: boolean;
};

export class RolePermissionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToRolePermissions(): Promise<void> {
    await this.openRolePermissionsTab();
  }

  async openRolePermissionsTab(): Promise<void> {
    await this.ensureOnApp();
    await this.openMastersNav();
    await this.openRolePermissionsTabFromMasters();
    await this.waitForRolePermissionsTable();
  }

  async setLockPermissionForRole(data: LockPermissionData): Promise<void> {
    await this.openRolePermissionsTab();
    await this.openRolePermissionsEditor(data.roleName);
    const updated = await this.setSessionLockPermission(data.enabled);
    if (updated) {
      await this.savePermissionsIfNeeded();
    }
  }

  async isSessionLockPermissionChecked(roleName: string): Promise<boolean> {
    await this.openRolePermissionsTab();
    await this.openRolePermissionsEditor(roleName);
    const checkbox = await this.findSessionLockCheckbox();
    if (!checkbox) {
      throw new Error('Session lock checkbox not found.');
    }
    const current = await this.readToggleState(checkbox);
    if (current === null) {
      throw new Error('Unable to determine session lock checkbox state.');
    }
    return current;
  }

  async isSessionLockCheckedInCurrentModal(): Promise<boolean> {
    const checkbox = await this.findSessionLockCheckbox();
    if (!checkbox) {
      throw new Error('Session lock checkbox not found.');
    }
    const current = await this.readToggleState(checkbox);
    if (current === null) {
      throw new Error('Unable to determine session lock checkbox state.');
    }
    return current;
  }

  async setSessionLockInCurrentModal(enabled: boolean): Promise<boolean> {
    const checkbox = await this.findSessionLockCheckbox();
    if (!checkbox) {
      throw new Error('Session lock checkbox not found.');
    }
    const current = await this.readToggleState(checkbox);
    if (current === null || current !== enabled) {
      await checkbox.click();
      await this.page.waitForTimeout(300);
      await this.clickUpdatePermissionsButton();
      return true;
    }
    return false;
  }

  private async ensureOnApp(): Promise<void> {
    const currentUrl = this.page.url();
    if (currentUrl === 'about:blank' || currentUrl.includes('auth0.com')) {
      await this.page.goto(TestData.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await this.waitForPageLoad();
    }
    const logoutBtn = this.page.locator(tid(headerLogoutButton)).first();
    if (await logoutBtn.isVisible().catch(() => false)) {
      return;
    }
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  private async openMastersNav(): Promise<void> {
    const mastersLink = this.page.locator(tid(headerMastersLink)).first();
    if (await mastersLink.isVisible().catch(() => false)) {
      await mastersLink.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
      if (this.page.url().includes('/master')) return;
    }

    const mastersByText = this.page.getByRole('link', { name: /masters/i }).first();
    if (await mastersByText.isVisible().catch(() => false)) {
      await mastersByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
      if (this.page.url().includes('/master')) return;
    }

    const mastersByHref = this.page.locator(headerMastersLinkHref).first();
    if (await mastersByHref.isVisible().catch(() => false)) {
      await mastersByHref.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
      if (this.page.url().includes('/master')) return;
    }

    const nav = this.page.locator(appNavigation).first();
    if (await nav.isVisible().catch(() => false)) {
      const navLink = nav.getByRole('link', { name: /masters/i }).first();
      if (await navLink.isVisible().catch(() => false)) {
        await navLink.click();
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.waitForURL(/\/master/, { timeout: 15000 }).catch(() => {});
        if (this.page.url().includes('/master')) return;
      }
    }

    if (!this.page.url().includes('/master')) {
      const href = await mastersByHref.getAttribute('href').catch(() => null);
      if (href) {
        const targetUrl = new URL(href, this.page.url()).toString();
        await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.page.waitForLoadState('networkidle').catch(() => {});
        if (this.page.url().includes('/master')) return;
      }
      throw new Error(`Could not navigate to masters page from URL: ${this.page.url()}`);
    }
  }

  private async openRolePermissionsTabFromMasters(): Promise<void> {
    const roleTab = this.page.locator(tid(masterTabRolePermissions)).first();
    if (await roleTab.isVisible().catch(() => false)) {
      await roleTab.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const roleTabByText = this.page.getByRole('tab', { name: /role permissions/i }).first();
    if (await roleTabByText.isVisible().catch(() => false)) {
      await roleTabByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const roleNavByText = this.page.getByRole('link', { name: /role permissions/i }).first();
    if (await roleNavByText.isVisible().catch(() => false)) {
      await roleNavByText.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const userRolesLink = this.page.locator(mastersUserRolesTab).first();
    if (await userRolesLink.isVisible().catch(() => false)) {
      await userRolesLink.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const rolePermissionsButton = this.page.locator(mastersRolePermissionsTab).first();
    if (await rolePermissionsButton.isVisible().catch(() => false)) {
      await rolePermissionsButton.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
      return;
    }

    const rolesFallback = this.page.locator(mastersRolesTabFallback).first();
    if (await rolesFallback.isVisible().catch(() => false)) {
      await rolesFallback.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }
  }

  private async waitForRolePermissionsTable(): Promise<void> {
    const table = this.page.locator(tid(rolePermissionTable)).first();
    if (await table.isVisible().catch(() => false)) {
      return;
    }
    const createButton = this.page.locator(tid(rolePermissionCreateButton)).first();
    if (await createButton.isVisible().catch(() => false)) {
      return;
    }
    const updateButtons = this.page.locator(`[data-testid^="${rolePermissionUpdateButton}"], [data-testid^="role-permission-edit-button-"], [data-testid^="role-permission-actions-row-"]`).first();
    if (await updateButtons.isVisible().catch(() => false)) {
      return;
    }
    await this.page.waitForLoadState('networkidle').catch(() => {});
    if (await table.isVisible().catch(() => false)) {
      return;
    }
    if (await createButton.isVisible().catch(() => false)) {
      return;
    }
    if (await updateButtons.isVisible().catch(() => false)) {
      return;
    }
    const fallbackTable = this.page.locator(rolePermissionTableByHeader).first();
    if (await fallbackTable.isVisible().catch(() => false)) {
      return;
    }

    const fallbackTableByText = this.page.locator(rolePermissionTableFallback).filter({ hasText: /role|permission/i }).first();
    if (await fallbackTableByText.isVisible().catch(() => false)) {
      return;
    }
    const anyTable = this.page.locator('table').first();
    if (await anyTable.isVisible().catch(() => false)) {
      return;
    }
    throw new Error(`Role permissions view not visible after navigation. Current URL: ${this.page.url()}`);
  }

  private async openRolePermissionsEditor(roleName: string): Promise<void> {
    const table = this.page.locator(tid(rolePermissionTable)).first();
    const tableVisible = await table.isVisible().catch(() => false);

    const scope = tableVisible ? table : this.page;
    const row = scope.locator('tr').filter({ hasText: new RegExp(roleName, 'i') }).first();
    if (await row.isVisible().catch(() => false)) {
      const updateBtn = row.locator(tid(rolePermissionUpdateButton)).first();
      if (await updateBtn.isVisible().catch(() => false)) {
        await updateBtn.click();
        await this.waitForPageLoad();
        return;
      }

      const editBtn = row.getByRole('button', { name: /edit|update|permission|view/i }).first();
      if (await editBtn.isVisible().catch(() => false)) {
        await editBtn.click();
        await this.waitForPageLoad();
        return;
      }

      await row.click();
      await this.waitForPageLoad();
      return;
    }

    const fallbackEditBtn = this.page.getByRole('button', { name: /update|edit|permissions/i }).first();
    if (await fallbackEditBtn.isVisible().catch(() => false)) {
      await fallbackEditBtn.click();
      await this.waitForPageLoad();
      return;
    }

    throw new Error(`Could not open role permissions editor for role "${roleName}".`);
  }

  private async setPermissionToggle(permissionLabel: string, enabled: boolean): Promise<void> {
    const root = await this.getPermissionsRoot();

    const lockRow = root.locator('tr').filter({ hasText: new RegExp(permissionLabel, 'i') }).first();
    const lockLabel = root.getByText(new RegExp(`^${permissionLabel}$`, 'i')).first();

    let container = lockRow;
    if (!(await container.isVisible().catch(() => false))) {
      container = lockLabel.locator('xpath=ancestor::*[self::tr or self::li or self::div][1]');
    }

    const toggle = container.locator('input[type="checkbox"], [role="switch"], [role="checkbox"], .n-switch, .n-checkbox').first();
    if (!(await toggle.isVisible().catch(() => false))) {
      return;
    }

    const current = await this.readToggleState(toggle);
    if (current === null || current !== enabled) {
      await toggle.click();
      await this.page.waitForTimeout(300);
    }
  }

  private async setSessionLockPermission(enabled: boolean): Promise<boolean> {
    const checkbox = await this.findSessionLockCheckbox();
    if (!checkbox) {
      await this.setPermissionToggle('Lock', enabled);
      return true;
    }
    const current = await this.readToggleState(checkbox);
    if (current === null || current !== enabled) {
      await checkbox.click();
      await this.page.waitForTimeout(300);
      await this.clickUpdatePermissionsButton();
      return true;
    }

    return false;
  }

  private async findSessionLockCheckbox(): Promise<Locator | null> {
    const root = await this.getPermissionsRoot();
    const table = root.locator(tid(permissionsTable)).first();
    const scope = (await table.isVisible().catch(() => false)) ? table : root;

    const byRole = root.getByRole('checkbox', { name: /lock/i }).first();
    if (await byRole.isVisible().catch(() => false)) return byRole;

    let sessionRow = scope.locator(tid(sessionPermissionRow)).first();
    if (!(await sessionRow.isVisible().catch(() => false))) {
      sessionRow = scope.locator('tr').filter({ hasText: /session/i }).first();
    }

    if (await sessionRow.isVisible().catch(() => false)) {
      let checkbox = sessionRow.locator(tid(sessionLockCheckbox)).first();
      if (await checkbox.isVisible().catch(() => false)) return checkbox;
      checkbox = sessionRow.locator('input[type="checkbox"], [role="switch"], [role="checkbox"], .n-switch, .n-checkbox').first();
      if (await checkbox.isVisible().catch(() => false)) return checkbox;
    }

    const sectionByText = scope.locator('div, li, tr').filter({ hasText: /session/i }).filter({ hasText: /lock/i }).first();
    let sessionSection = sectionByText;
    if (!(await sessionSection.isVisible().catch(() => false))) {
      const sessionLabel = scope.getByText(/^Session$/i).first();
      if (await sessionLabel.isVisible().catch(() => false)) {
        sessionSection = sessionLabel.locator('xpath=ancestor::*[self::div or self::li or self::tr][1]');
      }
    }

    if (!(await sessionSection.isVisible().catch(() => false))) {
      return null;
    }

    let checkbox = sessionSection.locator('label').filter({ hasText: /lock/i }).locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible().catch(() => false)) return checkbox;

    const lockLabel = sessionSection.locator('label').filter({ hasText: /lock/i }).first();
    if (await lockLabel.isVisible().catch(() => false)) {
      checkbox = lockLabel.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible().catch(() => false)) return checkbox;
    }

    // const lockText = sessionSection.getByText(/^Lock$/i).first();
    // if (await lockText.isVisible().catch(() => false)) {
    //   const labelContainer = lockText.locator('xpath=ancestor::label[1]');
    //   checkbox = labelContainer.locator('input[type="checkbox"]').first();
    //   if (await checkbox.isVisible().catch(() => false)) return checkbox;
    // }

    checkbox = sessionSection.locator('input[type="checkbox"]').filter({ has: sessionSection.locator('text=Lock') }).first();
    if (await checkbox.isVisible().catch(() => false)) return checkbox;

    // XPath fallback: find checkbox near a "Lock" text node within the session section
    const xpathCheckbox = sessionSection.locator(
      'xpath=.//*[normalize-space()="Lock"]/preceding::input[@type="checkbox"][1] | .//*[normalize-space()="Lock"]/following::input[@type="checkbox"][1]'
    ).first();
    if (await xpathCheckbox.isVisible().catch(() => false)) return xpathCheckbox;

    checkbox = root.locator('label:has-text("Lock") input[type="checkbox"]').first();
    if (await checkbox.isVisible().catch(() => false)) return checkbox;

    const lockText = root.getByText(/^Lock$/i).first();
    if (await lockText.isVisible().catch(() => false)) {
      const labelContainer = lockText.locator('xpath=ancestor::label[1]');
      checkbox = labelContainer.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible().catch(() => false)) return checkbox;
      const nearby = lockText.locator('xpath=following::input[@type="checkbox"][1]');
      if (await nearby.isVisible().catch(() => false)) return nearby;
    }

    return null;
  }

  private async clickUpdatePermissionsButton(): Promise<void> {
    const root = await this.getPermissionsRoot();
    const updateBtn = root.locator(tid(updatePermissionButton)).first();
    if (await updateBtn.isVisible().catch(() => false)) {
      if (await updateBtn.isEnabled().catch(() => false)) {
        await updateBtn.click();
        await this.waitForPermissionUpdate();
      }
      return;
    }

    const fallback = root.getByRole('button', { name: /update|save|apply|submit/i }).first();
    if (await fallback.isVisible().catch(() => false)) {
      if (await fallback.isEnabled().catch(() => false)) {
        await fallback.click();
        await this.waitForPermissionUpdate();
      }
      return;
    }
  }

  private async waitForPermissionUpdate(): Promise<void> {
    const toast = this.page.locator(tid(permissionUpdateSuccessToast)).first();
    if (await toast.isVisible().catch(() => false)) {
      await toast.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      return;
    }
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  private async readToggleState(toggle: Locator): Promise<boolean | null> {
    const ariaChecked = await toggle.getAttribute('aria-checked');
    if (ariaChecked === 'true') return true;
    if (ariaChecked === 'false') return false;

    const ariaPressed = await toggle.getAttribute('aria-pressed');
    if (ariaPressed === 'true') return true;
    if (ariaPressed === 'false') return false;

    const input = toggle.locator('input[type="checkbox"]').first();
    if (await input.count()) {
      return await input.isChecked().catch(() => null);
    }

    try {
      return await toggle.isChecked();
    } catch {
      return null;
    }
  }

  private async savePermissionsIfNeeded(): Promise<void> {
    const root = await this.getPermissionsRoot();
    const updateBtn = root.locator(tid(updatePermissionButton)).first();
    if (await updateBtn.isVisible().catch(() => false)) {
      if (await updateBtn.isEnabled().catch(() => false)) {
        await updateBtn.click();
        await this.waitForPermissionUpdate();
      }
      return;
    }
    const saveBtn = root.getByRole('button', { name: /save|update|submit|apply|ok/i }).first();
    if (await saveBtn.isVisible().catch(() => false)) {
      if (await saveBtn.isEnabled().catch(() => false)) {
        await saveBtn.click();
        await this.waitForPermissionUpdate();
      }
    }
  }

  private async getPermissionsRoot() {
    const dialog = this.page.getByRole('dialog').first();
    if (await dialog.isVisible().catch(() => false)) {
      return dialog;
    }

    const modal = this.page.locator('.n-modal-container, .n-drawer, .modal, .drawer, [role="dialog"]').first();
    if (await modal.isVisible().catch(() => false)) {
      return modal;
    }

    return this.page;
  }
  
}
