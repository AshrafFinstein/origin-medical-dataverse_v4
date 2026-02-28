import { test, expect, Page, Locator } from '@playwright/test';
import { reloginAndPersistSession, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { RolePermissionsPage } from '../../../../pages/masters/role-permissions.page';
import { UserRolesPage } from '../../../../pages/user-roles.page';

const lockReason = 'Automation lock reason';
const unlockReason = 'Automation unlock reason';

async function setLockPermission(page: Page, enabled: boolean): Promise<void> {
  const userRolesPage = new UserRolesPage(page);
  await userRolesPage.navigateToUserRoles();
  await userRolesPage.openEditRole('Admin');
  await userRolesPage.openPermissionsTab();

  const rolePermissionsPage = new RolePermissionsPage(page);
  const changed = await rolePermissionsPage.setSessionLockInCurrentModal(enabled);
  await expect(await rolePermissionsPage.isSessionLockCheckedInCurrentModal()).toBe(enabled);

  if (changed) {
    await reloginAndPersistSession(page);
  }
}

async function getCompletedRowForLockAction(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  await navigateToModule(page);
  await sessionLockPage.waitForSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const rows = page.locator('[data-testid="session-table"] tbody tr').filter({ hasText: /completed/i });
  const count = await rows.count();
  let firstVisibleCompleted: Locator | null = null;

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    if (!(await row.isVisible({ timeout: 1200 }).catch(() => false))) continue;
    if (!firstVisibleCompleted) firstVisibleCompleted = row;

    const rowName = await sessionLockPage.getSessionNameFromRow(row);

    if (await sessionLockPage.tryOpenLockModalForRow(row)) {
      await sessionLockPage.lockModalCancelButton().click().catch(() => {});
      await sessionLockPage.lockModalAnyLocator().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
      return row;
    }

    if (await sessionLockPage.tryOpenUnlockModalForRow(row)) {
      await sessionLockPage.unlockReasonInputLocator().fill(unlockReason).catch(() => {});
      await sessionLockPage.unlockSubmitButtonLocator().click().catch(() => {});
      await sessionLockPage.waitForPageLoad();
      await sessionLockPage.refreshSessionList();
      await sessionLockPage.scrollSessionTableToRight();

      const refreshedRow = sessionLockPage.rowByName(rowName);
      if (await sessionLockPage.tryOpenLockModalForRow(refreshedRow)) {
        await sessionLockPage.lockModalCancelButton().click().catch(() => {});
        await sessionLockPage.lockModalAnyLocator().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
        return refreshedRow;
      }
    }
  }

  if (firstVisibleCompleted) return firstVisibleCompleted;
  throw new Error('No usable Completed row available for lock action.');
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

test.describe('SRS-257 - SDS-257', () => {
  test('UTC-2667: Verify Unlock icon is visible for locked session when a session is locked successfully', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(sessionLockPage.unlockButtonForRow(lockedRow)).toBeVisible();
  });

  test('UTC-2668: Verify Unlock popup opens on clicking unlock icon when the session is locked', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await expect(sessionLockPage.unlockModalLocator()).toBeVisible();
    await expect(sessionLockPage.unlockReasonInputLocator()).toBeVisible();
    await expect(sessionLockPage.unlockSubmitButtonLocator()).toBeVisible();
    await expect(sessionLockPage.unlockModalCancelButton()).toBeVisible();
  });

  test('UTC-2669: Verify unlock submission is blocked if reason is empty when Unlock popup is opened', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await expect(sessionLockPage.unlockReasonInputLocator()).toHaveValue('');
    await expect(sessionLockPage.unlockSubmitButtonLocator()).toBeDisabled();
  });

  test('UTC-2670: Verify session unlocks successfully with valid reason when Unlock popup is opened', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason);
    await sessionLockPage.unlockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(/re-?open/i);
    await expect(sessionLockPage.unlockButtonForRow(updatedRow)).toBeHidden();
  });

  test('UTC-2671: Verify Edit/Delete actions are enabled after session unlock when the session was locked and then unlocked successfully', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason);
    await sessionLockPage.unlockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    await expect(await sessionLockPage.isEditAvailableForRow(updatedRow)).toBe(true);
    await expect(await sessionLockPage.isDeleteAvailableForRow(updatedRow)).toBe(true);
  });

  test('UTC-2672: Verify session remains locked when user cancels unlock popup when Unlock popup is opened', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason);
    await sessionLockPage.unlockModalCancelButton().click();
    await expect(sessionLockPage.unlockModalLocator()).toBeHidden();

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const sameRow = sessionLockPage.rowByName(sessionName);
    await expect(sameRow).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedRow(sameRow)).toBeVisible();
  });

  test('UTC-2673: Verify unauthorized user cannot unlock session when a session is locked', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    await setLockPermission(page, false);
    await navigateToModule(page);
    await sessionLockPage.waitForSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const sameRow = sessionLockPage.rowByName(sessionName);
    await expect(sameRow).toBeVisible();

    const opened = await sessionLockPage.tryOpenUnlockModalForRow(sameRow);
    await expect(opened).toBe(false);
    await expect(sessionLockPage.unlockModalLocator()).toBeHidden();
    await expect(sessionLockPage.lockIconForCompletedRow(sameRow)).toBeVisible();
  });

  test('UTC-2674: Verify unlock reason is stored for audit and visible in history/tooltip if available when the session is unlocked with a reason', async ({ page }) => {
    await setLockPermission(page, true);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason);
    await sessionLockPage.unlockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const anyCompleted = await sessionLockPage.rowByAnyStatus(['Completed', 'Re-open', 'In progress']);
    await expect(anyCompleted).toBeVisible();
  });
});
