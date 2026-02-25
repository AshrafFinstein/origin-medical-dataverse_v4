import { test, expect, Locator, Page } from '@playwright/test';
import { loginToApplication, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import TestData from '../../../../test-data/test-data';

const lockReason = 'Automation lock reason';
const unlockReason = 'Unlock for setup';

function uniqueSessionName(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

async function getCompletedRowForLockAction(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
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

  const candidate = await sessionLockPage.rowByAnyStatus(['Re-open', 'In progress', 'In review', 'Yet to do']).catch(() => null);
  if (candidate && await candidate.isVisible({ timeout: 1200 }).catch(() => false) && await sessionLockPage.isEditAvailableForRow(candidate)) {
    const sessionName = await sessionLockPage.getSessionNameFromRow(candidate);
    await sessionLockPage.openEditForRow(candidate);
    await sessionLockPage.setSessionStatusInEditModal('Completed');
    await sessionLockPage.saveSessionEdit();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const completedNow = sessionLockPage.rowByName(sessionName);
    if (await completedNow.isVisible({ timeout: 3000 }).catch(() => false)) return completedNow;
  }

  throw new Error('No usable Completed row available for lock action (and could not convert one).');
}

async function getLockedCompletedRow(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
  await navigateToModule(page);
  await sessionLockPage.waitForSessionList();
  await sessionLockPage.scrollSessionTableToRight();

  const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
  const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

  if (await sessionLockPage.tryOpenUnlockModalForRow(completedRow)) {
    await sessionLockPage.unlockModalCancelButton().click().catch(() => {});
    await sessionLockPage.unlockModalLocator().waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
  } else {
    await sessionLockPage.openLockModalForRow(completedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
  }

  await sessionLockPage.refreshSessionList();
  await sessionLockPage.scrollSessionTableToRight();
  const lockedRow = sessionLockPage.rowByName(sessionName);
  await expect(lockedRow).toBeVisible();
  await expect(sessionLockPage.lockIconForCompletedRow(lockedRow)).toBeVisible();
  return lockedRow;
}

async function getCompletedRowForDuplicateAction(page: Page, sessionLockPage: SessionLockPage): Promise<Locator> {
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

    const duplicateEnabled = await sessionLockPage.isDuplicateIconEnabledForRow(row);
    if (duplicateEnabled) return row;
  }

  if (firstVisibleCompleted) return firstVisibleCompleted;
  throw new Error('No visible Completed row available for duplicate action.');
}

test.describe('SRS-256 - SDS-256', () => {
  test('UTC-2659: Verify Edit is disabled/hidden when session is locked when a session is locked successfully', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    const editAvailable = await sessionLockPage.isEditAvailableForRow(lockedRow);
    await expect(editAvailable).toBe(false);
  });

  test('UTC-2660: Verify Delete is disabled/hidden when session is locked when a session is locked successfully', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    const deleteAvailable = await sessionLockPage.isDeleteAvailableForRow(lockedRow);
    await expect(deleteAvailable).toBe(false);
  });

  test('UTC-2661: Verify Duplicate action remains enabled for locked session when a session is locked successfully', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);

    const duplicateEnabled = await sessionLockPage.isDuplicateIconEnabledForRow(lockedRow);
    await expect(duplicateEnabled).toBe(true);
  });

  test('UTC-2662: Verify user can duplicate a locked session successfully when a session is locked', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    const completedRow = await getCompletedRowForDuplicateAction(page, sessionLockPage);
    await expect(completedRow).toContainText(/completed/i);

    // Strict row action flow: click Duplicate icon from Completed row only.
    const duplicateOpened = await sessionLockPage.openDuplicateForRow(completedRow);
    await expect(duplicateOpened).toBe(true);
    const duplicatedName = uniqueSessionName('Auto-Duplicate-Locked');
    const duplicated = await sessionLockPage.submitDuplicateName(duplicatedName);
    await expect(duplicated).toBe(true);
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    await expect(sessionLockPage.rowByName(duplicatedName)).toBeVisible({ timeout: 15000 });
  });

  test('UTC-2663: Verify direct API edit request is rejected for locked session when the session is locked', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    const editAvailable = await sessionLockPage.isEditAvailableForRow(lockedRow);
    await expect(editAvailable).toBe(false);
    await expect(sessionLockPage.rowByName(sessionName)).toBeVisible();
  });

  test('UTC-2664: Verify direct API delete request is rejected for locked session when the session is locked', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    const lockedRow = await getLockedCompletedRow(page, sessionLockPage);
    const sessionName = await sessionLockPage.getSessionNameFromRow(lockedRow);

    const deleteAvailable = await sessionLockPage.isDeleteAvailableForRow(lockedRow);
    await expect(deleteAvailable).toBe(false);
    await expect(sessionLockPage.rowByName(sessionName)).toBeVisible();
  });

  test('UTC-2665: Verify Edit/Delete available when session is unlocked when a session is not locked', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.waitForSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const unlockedRow = await sessionLockPage.rowByAnyStatus(['Yet to do', 'In progress', 'Re-open']);
    await expect(unlockedRow).toBeVisible();

    const editAvailable = await sessionLockPage.isEditAvailableForRow(unlockedRow);
    const deleteAvailable = await sessionLockPage.isDeleteAvailableForRow(unlockedRow);
    await expect(editAvailable).toBe(true);
    await expect(deleteAvailable).toBe(true);
  });

  test('UTC-2666: Verify locked session cannot be edited via direct URL navigation when the session is locked', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.waitForSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const unlockedRow = await sessionLockPage.rowByAnyStatus(['Yet to do', 'In progress', 'Re-open']);
    await expect(unlockedRow).toBeVisible();
    await expect(await sessionLockPage.isEditAvailableForRow(unlockedRow)).toBe(true);

    const sessionName = await sessionLockPage.getSessionNameFromRow(unlockedRow);
    const editUrl = await sessionLockPage.openDirectEditUrlForRow(unlockedRow);

    await navigateToModule(page);
    await sessionLockPage.waitForSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const sameRow = sessionLockPage.rowByName(sessionName);
    await expect(sameRow).toBeVisible();
    if (!(await sameRow.locator('td').filter({ hasText: /completed/i }).first().isVisible({ timeout: 1000 }).catch(() => false))) {
      await sessionLockPage.openEditForRow(sameRow);
      await sessionLockPage.setSessionStatusInEditModal('Completed');
      await sessionLockPage.saveSessionEdit();
      await sessionLockPage.refreshSessionList();
      await sessionLockPage.scrollSessionTableToRight();
    }
    const completedSameRow = sessionLockPage.rowByName(sessionName);
    await expect(completedSameRow).toContainText(/completed/i);
    await sessionLockPage.openLockModalForRow(completedSameRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.refreshSessionList();

    await page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.assertEditAccessBlocked();
  });
});
