import { test, expect, Page, Locator } from '@playwright/test';
import { loginToApplication, logoutFromApplication, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { RolePermissionsPage } from '../../../../pages/masters/role-permissions.page';
import { UserRolesPage } from '../../../../pages/user-roles.page';
import TestData from '../../../../test-data/test-data';

const lockReason = 'Automation lock reason';
const unlockReason = 'Automation unlock reason';

async function setLockPermissionEnabled(page: Page): Promise<void> {
  await loginToApplication(page, TestData.testUsers.admin);
  const userRolesPage = new UserRolesPage(page);
  await userRolesPage.navigateToUserRoles();
  await userRolesPage.openEditRole('Admin');
  await userRolesPage.openPermissionsTab();

  const rolePermissionsPage = new RolePermissionsPage(page);
  const changed = await rolePermissionsPage.setSessionLockInCurrentModal(true);
  await expect(await rolePermissionsPage.isSessionLockCheckedInCurrentModal()).toBe(true);

  if (changed) {
    await logoutFromApplication(page);
    await loginToApplication(page, TestData.testUsers.admin);
    await page.waitForLoadState('networkidle');
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

test.describe('SRS-261 - SDS-261', () => {
  test('UTC-2691: Verify locked session is clearly identifiable in session list when a session is locked successfully', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isLockIndicatorVisibleForRow(lockedRow)).toBe(true);
    await expect(sessionLockPage.lockIconForCompletedRow(lockedRow)).toBeVisible();
  });

  test('UTC-2692: Verify lock indicator is removed after unlocking session when a session was locked and then unlocked', async ({ page }) => {
    await setLockPermissionEnabled(page);
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
    await expect(sessionLockPage.unlockButtonForRow(updatedRow)).toBeHidden();
  });

  test('UTC-2693: Verify tooltip displays lock reason clearly when a session is locked with a reason', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    const tooltipText = await sessionLockPage.lockReasonTooltipForRow(lockedRow);
    expect(tooltipText.trim().length).toBeGreaterThan(0);
  });

  test('UTC-2694: Verify disabled actions are visually distinguishable for locked session when a session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isEditAvailableForRow(lockedRow)).toBe(false);
    await expect(await sessionLockPage.isDeleteAvailableForRow(lockedRow)).toBe(false);
  });

  test('UTC-2695: Verify Duplicate action is clearly available even when session is locked when a session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    await expect(await sessionLockPage.isDuplicateIconEnabledForRow(lockedRow)).toBe(true);
  });

  test('UTC-2696: Verify lock indicators remain clear after refresh or re-login when a session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    const tooltipBefore = await sessionLockPage.lockReasonTooltipForRow(lockedRow);
    expect(tooltipBefore.trim().length).toBeGreaterThan(0);

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const refreshedRow = sessionLockPage.rowByName(sessionName);
    await expect(refreshedRow).toBeVisible();
    await expect(await sessionLockPage.isLockIndicatorVisibleForRow(refreshedRow)).toBe(true);

    await logoutFromApplication(page);
    await loginToApplication(page, TestData.testUsers.admin);
    await navigateToModule(page);
    await sessionLockPage.waitForSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const reloginRow = sessionLockPage.rowByName(sessionName);
    await expect(reloginRow).toBeVisible();
    await expect(await sessionLockPage.isLockIndicatorVisibleForRow(reloginRow)).toBe(true);
    const tooltipAfter = await sessionLockPage.lockReasonTooltipForRow(reloginRow);
    expect(tooltipAfter.trim().length).toBeGreaterThan(0);
  });

  test('UTC-2697: Verify lock/unlock indicators do not confuse users when multiple sessions exist (locked and unlocked)', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    const unlockedRow = await sessionLockPage.rowByAnyStatus(['Yet to do', 'In progress', 'Re-open']);
    await expect(unlockedRow).toBeVisible();

    const distinct = await sessionLockPage.areLockedAndUnlockedRowsVisuallyDistinct(lockedRow, unlockedRow);
    await expect(distinct).toBe(true);
  });
});
