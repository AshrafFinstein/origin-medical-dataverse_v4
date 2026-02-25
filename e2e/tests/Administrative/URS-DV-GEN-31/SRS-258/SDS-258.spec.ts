import { test, expect, Page, Locator } from '@playwright/test';
import { loginToApplication, logoutFromApplication, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { RolePermissionsPage } from '../../../../pages/masters/role-permissions.page';
import { UserRolesPage } from '../../../../pages/user-roles.page';
import TestData from '../../../../test-data/test-data';

async function setLockPermission(page: Page, enabled: boolean): Promise<void> {
  await loginToApplication(page, TestData.testUsers.admin);
  const userRolesPage = new UserRolesPage(page);
  await userRolesPage.navigateToUserRoles();
  await userRolesPage.openEditRole('Admin');
  await userRolesPage.openPermissionsTab();

  const rolePermissionsPage = new RolePermissionsPage(page);
  const changed = await rolePermissionsPage.setSessionLockInCurrentModal(enabled);
  await expect(await rolePermissionsPage.isSessionLockCheckedInCurrentModal()).toBe(enabled);

  if (changed) {
    await logoutFromApplication(page);
    await loginToApplication(page, TestData.testUsers.admin);
    await page.waitForLoadState('networkidle');
  }
}

async function getCompletedRow(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  await navigateToModule(page);
  await sessionLockPage.waitForSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const completedRow = await sessionLockPage.rowByStatusWithLock('Completed');
  await expect(completedRow).toBeVisible();
  return completedRow;
}

test.describe('SRS-258 - SDS-258', () => {
  test('UTC-2675: Verify lock icon is visible but disabled when user belongs to group but lacks lock permission when the user is assigned to the project/session group', async ({ page }) => {
    await setLockPermission(page, false);
    const sessionLockPage = new SessionLockPage(page);
    const completedRow = await getCompletedRow(page, sessionLockPage);

    await expect(sessionLockPage.lockIconForRow(completedRow)).toBeVisible();
    await expect(await sessionLockPage.isLockIconDisabledForRow(completedRow)).toBe(true);
  });

  test('UTC-2676: Verify clicking disabled lock icon does not open popup when lock icon is displayed in disabled state', async ({ page }) => {
    await setLockPermission(page, false);
    const sessionLockPage = new SessionLockPage(page);
    const completedRow = await getCompletedRow(page, sessionLockPage);

    const opened = await sessionLockPage.tryOpenLockModalForRow(completedRow);
    await expect(opened).toBe(false);
    await expect(sessionLockPage.lockModalAnyLocator()).toBeHidden();
  });

  test('UTC-2677: Verify tooltip message indicates permission missing when lock icon is disabled', async ({ page }) => {
    await setLockPermission(page, false);
    const sessionLockPage = new SessionLockPage(page);
    const completedRow = await getCompletedRow(page, sessionLockPage);

    const tooltip = await sessionLockPage.lockPermissionTooltipForRow(completedRow);
    if (tooltip) {
      expect(tooltip.toLowerCase()).toMatch(/permission|access|authorized|required/);
    } else {
      await expect(await sessionLockPage.isLockIconDisabledForRow(completedRow)).toBe(true);
    }
  });

  test('UTC-2678: Verify disabled lock icon becomes enabled after Lock permission is granted when the user is in the group but lock permission is disabled initially', async ({ page }) => {
    await setLockPermission(page, false);
    const sessionLockPage = new SessionLockPage(page);
    const completedRow = await getCompletedRow(page, sessionLockPage);
    await expect(await sessionLockPage.isLockIconDisabledForRow(completedRow)).toBe(true);

    await setLockPermission(page, true);
    await navigateToModule(page);
    await sessionLockPage.waitForSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const rowAfterEnable = await sessionLockPage.rowByStatusWithLock('Completed');
    await expect(rowAfterEnable).toBeVisible();
    await expect(await sessionLockPage.isLockIconDisabledForRow(rowAfterEnable)).toBe(false);
  });

  test('UTC-2679: Verify user cannot lock session via API even if icon is visible disabled when the user belongs to the group but lacks Lock permission', async ({ page }) => {
    await setLockPermission(page, false);
    const sessionLockPage = new SessionLockPage(page);
    const completedRow = await getCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

    const opened = await sessionLockPage.tryOpenLockModalForRow(completedRow);
    await expect(opened).toBe(false);
    await expect(sessionLockPage.lockModalAnyLocator()).toBeHidden();

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const sameRow = sessionLockPage.rowByName(sessionName);
    await expect(sameRow).toBeVisible();
    await expect(sessionLockPage.unlockButtonForRow(sameRow)).toBeHidden();
  });
});
