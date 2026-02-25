import { test, expect, Locator, Page } from '@playwright/test';
import { loginToApplication, navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import TestData from '../../../../test-data/test-data';

const lockReason = 'For testing lock';
const unlockReason = 'Unlock for test setup';

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

  // Self-heal precondition: make one editable row Completed, then use it for lock flow.
  const candidate = await sessionLockPage.rowByAnyStatus(['Re-open', 'In progress', 'In review', 'Yet to do']).catch(() => null);
  if (candidate && await candidate.isVisible({ timeout: 1200 }).catch(() => false)) {
    const sessionName = await sessionLockPage.getSessionNameFromRow(candidate);
    if (await sessionLockPage.isEditAvailableForRow(candidate)) {
      await sessionLockPage.openEditForRow(candidate);
      await sessionLockPage.setSessionStatusInEditModal('Completed');
      await sessionLockPage.saveSessionEdit();
      await sessionLockPage.refreshSessionList();
      await sessionLockPage.scrollSessionTableToRight();
      const completedNow = sessionLockPage.rowByName(sessionName);
      if (await completedNow.isVisible({ timeout: 3000 }).catch(() => false)) return completedNow;
    }
  }

  throw new Error('No usable Completed row available for lock action (and could not convert one).');
}

test.describe('SRS-255 - SDS-255', () => {
  test('UTC-2654: Verify Lock confirmation popup opens on clicking Lock icon when the user is on Data Labelling Session list page', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
    await expect(completedRow).toBeVisible();
    await sessionLockPage.openLockModalForRow(completedRow);

    await expect(sessionLockPage.lockModalAnyLocator()).toBeVisible();
    await expect(sessionLockPage.lockReasonInputLocator()).toBeVisible();
    await expect(sessionLockPage.lockSubmitButtonLocator()).toBeVisible();
    await expect(sessionLockPage.lockModalCancelButton()).toBeVisible();
  });

  test('UTC-2655: Verify submission is blocked if reason is empty when Lock popup is opened', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
    await expect(completedRow).toBeVisible();
    await sessionLockPage.openLockModalForRow(completedRow);

    await expect(sessionLockPage.lockModalAnyLocator()).toBeVisible();
    await expect(sessionLockPage.lockReasonInputLocator()).toHaveValue('');
    await expect(sessionLockPage.lockSubmitButtonLocator()).toBeDisabled();
  });

  test('UTC-2656: Verify session is locked when valid reason is entered when Lock popup is opened', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
    await expect(completedRow).toBeVisible();
    const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

    await sessionLockPage.openLockModalForRow(completedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedRow(updatedRow)).toBeVisible();
  });

  test('UTC-2657: Verify session is not locked when user cancels popup when Lock popup is opened', async ({ page }) => {
    await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
    await expect(completedRow).toBeVisible();
    const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

    await sessionLockPage.openLockModalForRow(completedRow);
    await sessionLockPage.lockModalCancelButton().click();
    await expect(sessionLockPage.lockModalAnyLocator()).toBeHidden();

    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();
    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(/completed/i);
    await expect(sessionLockPage.lockIconForCompletedRow(updatedRow)).toBeVisible();
  });

  test('UTC-2658: Verify lock tooltip is displayed when user hovers on locked icon after session is locked', async ({ page }) => {
      await loginToApplication(page, TestData.testUsers.admin);
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const completedRow = await getCompletedRowForLockAction(page, sessionLockPage);
    await expect(completedRow).toBeVisible();
    const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

    await sessionLockPage.openLockModalForRow(completedRow);
    await sessionLockPage.lockReasonInputLocator().fill(lockReason);
    await sessionLockPage.lockSubmitButtonLocator().click();
    await sessionLockPage.waitForPageLoad();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    const lockIcon = sessionLockPage.lockIconForCompletedRow(updatedRow);
    await expect(lockIcon).toBeVisible();
    await lockIcon.hover().catch(() => {});

    const tooltipText = await sessionLockPage.lockReasonTooltipForRow(updatedRow);
    expect(tooltipText.trim().length).toBeGreaterThan(0);
  });
});
