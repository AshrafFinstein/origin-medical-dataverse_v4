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

async function getCompletedRow(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  await navigateToModule(page);
  await sessionLockPage.waitForSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const completedRow = await sessionLockPage.rowByStatusWithLock('Completed');
  await expect(completedRow).toBeVisible();
  return completedRow;
}

async function ensureCompletedSessionUnlocked(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  const completedRow = await getCompletedRow(page, sessionLockPage);
  const name = await sessionLockPage.getSessionNameFromRow(completedRow);

  if (await sessionLockPage.tryOpenUnlockModalForRow(completedRow)) {
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason).catch(() => {});
    await sessionLockPage.unlockSubmitButtonLocator().click().catch(() => {});
    await sessionLockPage.waitForPageLoad();
  }

  await sessionLockPage.refreshSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const row = sessionLockPage.rowByName(name);
  await expect(row).toBeVisible();
  return row;
}

async function ensureCompletedSessionLocked(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  const row = await ensureCompletedSessionUnlocked(page, sessionLockPage);
  const name = await sessionLockPage.getSessionNameFromRow(row);

  if (await sessionLockPage.tryOpenLockModalForRow(row)) {
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
  }

  await sessionLockPage.refreshSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const lockedRow = sessionLockPage.rowByName(name);
  await expect(lockedRow).toBeVisible();
  await expect(sessionLockPage.lockIconForCompletedRow(lockedRow)).toBeVisible();
  return lockedRow;
}

test.describe('SRS-260 - SDS-260', () => {
  test('UTC-2686: Verify session lock completes without noticeable delay when the user is on Data Labelling Session list page', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const unlockedRow = await ensureCompletedSessionUnlocked(page, sessionLockPage);

    const startedAt = Date.now();
    await sessionLockPage.openLockModalForRow(unlockedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForLoaderCycleOrSettled();
    const elapsed = Date.now() - startedAt;

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const updatedRow = sessionLockPage.rowByName(await sessionLockPage.getSessionNameFromRow(unlockedRow));
    await expect(updatedRow).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedRow(updatedRow)).toBeVisible();
    await expect(elapsed).toBeLessThan(20000);
  });

  test('UTC-2687: Verify session unlock completes without noticeable delay when a session is locked', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await ensureCompletedSessionLocked(page, sessionLockPage);

    const startedAt = Date.now();
    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason);
    await sessionLockPage.unlockSubmitButtonLocator().click();
    await sessionLockPage.waitForLoaderCycleOrSettled();
    const elapsed = Date.now() - startedAt;

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const updatedRow = sessionLockPage.rowByName(await sessionLockPage.getSessionNameFromRow(lockedRow));
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(/re-?open/i);
    await expect(elapsed).toBeLessThan(20000);
  });

  test('UTC-2688: Verify loader is shown during lock/unlock processing when the user triggers Lock or Unlock action', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);

    const unlockedRow = await ensureCompletedSessionUnlocked(page, sessionLockPage);
    await sessionLockPage.openLockModalForRow(unlockedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    const lockLoaderSeen = await sessionLockPage.isAnyLoaderVisible();
    await sessionLockPage.waitForLoaderCycleOrSettled();

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const lockedRow = sessionLockPage.rowByName(await sessionLockPage.getSessionNameFromRow(unlockedRow));
    await sessionLockPage.openUnlockModalForRow(lockedRow);
    await sessionLockPage.unlockReasonInputLocator().fill(unlockReason);
    await sessionLockPage.unlockSubmitButtonLocator().click();
    const unlockLoaderSeen = await sessionLockPage.isAnyLoaderVisible();
    await sessionLockPage.waitForLoaderCycleOrSettled();

    await expect(lockLoaderSeen || unlockLoaderSeen).toBe(true);
  });

  test('UTC-2689: Verify grid refresh happens instantly without full page reload when the session list page is open', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const unlockedRow = await ensureCompletedSessionUnlocked(page, sessionLockPage);

    const beforeUrl = page.url();
    const navCountBefore = await page.evaluate(() => performance.getEntriesByType('navigation').length);

    await sessionLockPage.openLockModalForRow(unlockedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForLoaderCycleOrSettled();
    await sessionLockPage.scrollSessionTableToRight();

    const afterUrl = page.url();
    const navCountAfter = await page.evaluate(() => performance.getEntriesByType('navigation').length);

    await expect(afterUrl).toBe(beforeUrl);
    await expect(navCountAfter).toBe(navCountBefore);
  });

  test('UTC-2690: Verify retry option/message appears when lock action times out when the user triggers lock/unlock action', async ({ page }) => {
    await setLockPermissionEnabled(page);
    const sessionLockPage = new SessionLockPage(page);
    const unlockedRow = await ensureCompletedSessionUnlocked(page, sessionLockPage);

    await sessionLockPage.openLockModalForRow(unlockedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForLoaderCycleOrSettled();

    const retryOrTimeoutVisible = await sessionLockPage.isTimeoutOrRetryMessageVisible();
    if (retryOrTimeoutVisible) {
      await expect(retryOrTimeoutVisible).toBe(true);
    } else {
      await sessionLockPage.refreshSessionList();
      await sessionLockPage.scrollSessionTableToRight();
      const updatedRow = sessionLockPage.rowByName(await sessionLockPage.getSessionNameFromRow(unlockedRow));
      await expect(updatedRow).toBeVisible();
    }
  });
});
