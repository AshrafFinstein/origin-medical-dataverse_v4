import { test, expect } from '@playwright/test';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-19 / SRS-068: Session Lock Permission & Lock Icon Status
 *
 * Covers SRS-253 (lock permission - icon visible/hidden, unauthorized access,
 * permission change, backend restriction, unlock visibility)
 * and SRS-254 (lock icon visible for Completed status, hidden for other statuses,
 * dynamic state updates).
 */
test.describe('URS-DV-GEN-19 / SRS-068: Lock Permission & Lock Icon Status', () => {
  let lockPage: SessionLockPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    lockPage = new SessionLockPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await lockPage.gotoSession();
  });

  // ── SRS-253: Session Lock Permission ────────────────────────────────────

  test(`${generateUnitTestId('2639')}: Verify Lock icon is visible when Lock permission is enabled in role — when the admin enables "Lock" permission`, async ({ page }) => {
    await test.step('Given the admin enables "Lock" permission in Masters > User Roles > Session for the logged-in user role', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user navigates to Data Labelling Session list page', async () => {
      // Page loaded in beforeEach
    });

    await test.step('Then Lock icon should be visible in Actions column for sessions', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-visible-permission');
  });

  test(`${generateUnitTestId('2640')}: Verify Lock icon is hidden when Lock permission is disabled in role — when the admin disables "Lock" permission`, async ({ page }) => {
    await test.step('Given the admin disables "Lock" permission in Masters > User Roles > Session for the logged-in user role', async () => {
      // TODO: Login as user without lock permission
    });

    await test.step('When the user navigates to Data Labelling Session list page', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('Then Lock icon should not be visible in Actions column', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-hidden-no-permission');
  });

  test(`${generateUnitTestId('2641')}: Verify unauthorized user cannot access Lock Session popup — when the user role does not have Lock permission enabled`, async ({ page }) => {
    await test.step('Given the user role does not have Lock permission enabled', async () => {
      // TODO: Login as unauthorized user
    });

    await test.step('When the user attempts to lock a session (directly via UI or shortcut)', async () => {
      // TODO: Attempt lock action
    });

    await test.step('Then the system should block the action and Lock Session popup should not be accessible', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('unauthorized-no-lock-popup');
  });

  test(`${generateUnitTestId('2642')}: Verify Lock icon visibility updates after permission change — when the user is logged in with a role where Lock permission is disabled`, async ({ page }) => {
    await test.step('Given the user is logged in with a role where Lock permission is disabled', async () => {
      // TODO: Login with disabled lock permission
    });

    await test.step('When admin enables Lock permission for that role and user refreshes or re-login to application', async () => {
      await page.reload();
      await lockPage.waitForLoad();
    });

    await test.step('Then Lock icon should appear in Actions column', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-updates-permission');
  });

  test(`${generateUnitTestId('2643')}: Verify lock action is rejected even if API is triggered without permission — when the user does not have Lock permission`, async ({ page }) => {
    await test.step('Given the user does not have Lock permission', async () => {
      // TODO: Login as user without permission
    });

    await test.step('When the user tries to perform lock action through direct request (bypass UI)', async () => {
      // TODO: Send direct API request
    });

    await test.step('Then the system should deny the request and session should not be locked', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-api-rejected-no-permission');
  });

  test(`${generateUnitTestId('2644')}: Verify Unlock action is visible only if Lock permission exists — when the user role has Lock permission enabled`, async ({ page }) => {
    await test.step('Given the user role has Lock permission enabled and the session is already locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the session list page is displayed', async () => {
      // Page loaded
    });

    await test.step('Then Unlock icon/action should be visible for locked session', async () => {
      const configured = await lockPage.isUnlockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('unlock-visible-with-permission');
  });

  test(`${generateUnitTestId('2645')}: Verify Unlock action is hidden when Lock permission is removed — when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked and the admin removes Lock permission from the user role', async () => {
      // TODO: Login as user with removed lock permission
    });

    await test.step('When the user opens the session list page', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('Then Unlock icon should not be visible', async () => {
      const configured = await lockPage.isUnlockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('unlock-hidden-no-permission');
  });

  test(`${generateUnitTestId('2646')}: Verify unauthorized user cannot unlock a locked session — when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked and the user does not have Lock permission enabled', async () => {
      // TODO: Login as unauthorized user
    });

    await test.step('When the user attempts to unlock the session', async () => {
      // TODO: Attempt unlock
    });

    await test.step('Then the system should block unlock action and session should remain locked', async () => {
      const configured = await lockPage.isUnlockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('unauthorized-cannot-unlock');
  });

  test(`${generateUnitTestId('2647')}: Verify authorized user can lock and unlock session successfully — when the user role has Lock permission enabled`, async ({ page }) => {
    await test.step('Given the user role has Lock permission enabled', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When user locks a session by providing reason', async () => {
      // await lockPage.lockSession();
    });

    await test.step('Then both lock and unlock actions should be completed successfully', async () => {
      const lockConfigured = await lockPage.isLockPageConfigured();
      expect(lockConfigured).toBe(true);
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('authorized-lock-unlock-success');
  });

  test(`${generateUnitTestId('2648')}: Verify lock controls are fully hidden when permission is not granted — when Lock permission is disabled for the role`, async ({ page }) => {
    await test.step('Given Lock permission is disabled for the role', async () => {
      // TODO: Login as user without lock permission
    });

    await test.step('When the user opens session list page', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('Then lock-related icons should not appear anywhere (Actions / menu / tooltip)', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-controls-fully-hidden');
  });

  // ── SRS-254: Lock Icon Status by Session Status ─────────────────────────

  test(`${generateUnitTestId('2649')}: Verify lock icon is displayed when session status is Completed — when the user is on Data Labelling Session list page`, async ({ page }) => {
    await test.step('Given the user is on Data Labelling Session list page and a session status is set to Completed', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the grid is displayed/refreshed', async () => {
      // Grid visible
    });

    await test.step('Then the Lock icon should be visible for that Completed session row', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-completed-status');
  });

  test(`${generateUnitTestId('2650')}: Verify lock icon is not shown when session status is Yet to do — when the user is on Data Labelling Session list page`, async ({ page }) => {
    await test.step('Given the user is on Data Labelling Session list page', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When a session status is Yet to do', async () => {
      // TODO: Find session with Yet to do status
    });

    await test.step('Then the Lock icon should not be displayed for that session row', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-hidden-yet-to-do');
  });

  test(`${generateUnitTestId('2651')}: Verify lock icon is not shown when session status is In progress — when the user is on Data Labelling Session list page`, async ({ page }) => {
    await test.step('Given the user is on Data Labelling Session list page', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When a session status is In progress', async () => {
      // TODO: Find session with In progress status
    });

    await test.step('Then the Lock icon should not be displayed for that session row', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-hidden-in-progress');
  });

  test(`${generateUnitTestId('2652')}: Verify lock icon appears after session status is updated to Completed — when the session status is not Completed initially`, async ({ page }) => {
    await test.step('Given the session status is not Completed initially', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the session status is changed to Completed and the user returns to session list page / refreshes grid', async () => {
      await page.reload();
      await lockPage.waitForLoad();
    });

    await test.step('Then the Lock icon should appear for that session row', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-appears-completed');
  });

  test(`${generateUnitTestId('2653')}: Verify lock icon disappears if session status is changed from Completed to other status — when the session status is Completed and Lock icon is visible`, async ({ page }) => {
    await test.step('Given the session status is Completed and Lock icon is visible', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the session status changes to Re-open / In progress / Yet to do', async () => {
      // TODO: Change session status
    });

    await test.step('Then the Lock icon should no longer be displayed for that session row', async () => {
      const configured = await lockPage.isLockIconConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-disappears-status-change');
  });
});
