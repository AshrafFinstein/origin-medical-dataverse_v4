import { test, expect } from '@playwright/test';
import { navigateToModule } from '../../../../utils/helpers';
import { SessionLockPage } from '../../../../pages/session-lock.page';

test.describe('SRS-254 - SDS-254', () => {
  test('UTC-2649: Verify lock icon is displayed when session status is Completed when the user is on Data Labelling Session list page', async ({ page }) => {
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollSessionTableToRight();

    const completedRow = await sessionLockPage.rowByStatusWithLock('Completed');
    await expect(completedRow).toBeVisible();
    await expect(sessionLockPage.lockIconForCompletedRow(completedRow)).toBeVisible();
  });

  test('UTC-2650: Verify lock icon is not shown when session status is Yet to do when the user is on Data Labelling Session list page', async ({ page }) => {
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollSessionTableToRight();

    const yetToDoRow = sessionLockPage.rowByStatus('Yet to do');
    await expect(yetToDoRow).toBeVisible();
    await expect(sessionLockPage.lockIconForRow(yetToDoRow)).toBeHidden();
  });

  test('UTC-2651: Verify lock icon is not shown when session status is In progress when the user is on Data Labelling Session list page', async ({ page }) => {
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);
    await sessionLockPage.scrollSessionTableToRight();

    const inProgressRow = sessionLockPage.rowByStatus('In progress');
    await expect(inProgressRow).toBeVisible();
    await expect(sessionLockPage.lockIconForRow(inProgressRow)).toBeHidden();
  });

  test('UTC-2652: Verify lock icon appears after session status is updated to Completed when the session status is not Completed initially', async ({ page }) => {
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const targetRow = await sessionLockPage.rowByAnyStatus(['Yet to do', 'In progress', 'Re-open']);
    const sessionName = await sessionLockPage.getSessionNameFromRow(targetRow);

    await sessionLockPage.openEditForRow(targetRow);
    await sessionLockPage.setSessionStatusInEditModal('Completed');
    await sessionLockPage.saveSessionEdit();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(/completed/i);
    await expect(sessionLockPage.lockIconForCompletedRow(updatedRow)).toBeVisible();
  });

  test('UTC-2653: Verify lock icon disappears if session status is changed from Completed to other status when the session status is Completed and Lock icon is visible', async ({ page }) => {
    const sessionLockPage = new SessionLockPage(page);
    await navigateToModule(page);

    const completedRow = await sessionLockPage.rowByStatusWithLock('Completed');
    await expect(completedRow).toBeVisible();
    const sessionName = await sessionLockPage.getSessionNameFromRow(completedRow);

    await sessionLockPage.openEditForRow(completedRow);
    const newStatus = await sessionLockPage.setSessionStatusInEditModalAny(['Re-open', 'In progress', 'Yet to do']);
    await sessionLockPage.saveSessionEdit();
    await sessionLockPage.refreshSessionList();
    await sessionLockPage.scrollSessionTableToRight();

    const updatedRow = sessionLockPage.rowByName(sessionName);
    await expect(updatedRow).toBeVisible();
    await expect(updatedRow).toContainText(new RegExp(newStatus, 'i'));
    await expect(sessionLockPage.lockIconForRow(updatedRow)).toBeHidden();
  });
});
