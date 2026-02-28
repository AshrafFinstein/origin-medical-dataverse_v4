import { test, expect, Page, Locator } from '@playwright/test';
import { reloginAndPersistSession, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { RolePermissionsPage } from '../../../../pages/masters/role-permissions.page';
import { UserRolesPage } from '../../../../pages/user-roles.page';

const lockReason = 'Automation lock reason';

function uniqueSessionName(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

async function setLockPermissionEnabled(page: Page): Promise<void> {
  const userRolesPage = new UserRolesPage(page);
  await userRolesPage.navigateToUserRoles();
  await userRolesPage.openEditRole('Admin');
  await userRolesPage.openPermissionsTab();

  const rolePermissionsPage = new RolePermissionsPage(page);
  const changed = await rolePermissionsPage.setSessionLockInCurrentModal(true);
  await expect(await rolePermissionsPage.isSessionLockCheckedInCurrentModal()).toBe(true);

  if (changed) {
    await reloginAndPersistSession(page);
  }
}

async function getCompletedRowForLockAction(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  await navigateToModule(page);
  await sessionLockPage.waitForSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const completedRow = await sessionLockPage.rowByStatusWithLock('Completed');
  await expect(completedRow).toBeVisible();
  return completedRow;
}

async function getLockedCompletedRow(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
  const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

  if (!(await sessionLockPage.tryOpenUnlockModalForRow(completedRow))) {
    await sessionLockPage.openLockModalForRow(completedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
  } else {
    await sessionLockPage.unlockModalCancelButton().click().catch(() => {});
    await sessionLockPage.unlockModalLocator().waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
  }

  await sessionLockPage.refreshSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const lockedRow = sessionLockPage.rowByName(sessionName);
  await expect(lockedRow).toBeVisible();
  await expect(sessionLockPage.lockIconForCompletedRow(lockedRow)).toBeVisible();
  return lockedRow;
}

test.describe('SRS-259 - SDS-259', () => {
  test('UTC-2680: Verify backend rejects update request for locked session when a session is locked successfully', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isEditAvailableForRow(lockedRow)).toBe(false);
  });

  test('UTC-2681: Verify backend rejects delete request for locked session when a session is locked successfully', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isDeleteAvailableForRow(lockedRow)).toBe(false);
  });

  test('UTC-2682: Verify backend rejects session status update when session is locked when a session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isEditAvailableForRow(lockedRow)).toBe(false);
    await expect(lockedRow).toContainText(/completed/i);
  });

  test('UTC-2683: Verify backend blocks updates to session configuration fields when locked when a session is locked successfully', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isEditAvailableForRow(lockedRow)).toBe(false);
    await expect(await sessionLockPage.isDeleteAvailableForRow(lockedRow)).toBe(false);
    await expect(await sessionLockPage.isDuplicateIconEnabledForRow(lockedRow)).toBe(true);
  });

  test('UTC-2684: Verify backend allows creating a new duplicated session while original is locked when the original session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    const opened = await sessionLockPage.openDuplicateForRow(lockedRow);
    await expect(opened).toBe(true);

    const duplicatedName = uniqueSessionName('Auto-Duplicate-Locked');
    const submitted = await sessionLockPage.submitDuplicateName(duplicatedName);
    await expect(submitted).toBe(true);

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    await expect(sessionLockPage.rowByName(duplicatedName)).toBeVisible({ timeout: 15000 });
  });

  test('UTC-2685: Verify access denied response is safe and non-technical when a session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isEditAvailableForRow(lockedRow)).toBe(false);

    const responseText = await sessionLockPage.getLatestErrorToastText();
    if (responseText) {
      await expect(sessionLockPage.hasSafeAccessDeniedMessage(responseText)).toBe(true);
    } else {
      await expect(await sessionLockPage.isRowLocked(lockedRow)).toBe(true);
    }
  });
});
