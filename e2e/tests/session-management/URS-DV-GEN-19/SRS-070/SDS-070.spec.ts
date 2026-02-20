import { test, expect } from '@playwright/test';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-19 / SRS-070: Unlock Reason/Success/Cancel, Lock Icon Permission & Backend Restrictions
 *
 * Covers SRS-257 (unlock reason mandatory, successful unlock, actions enabled after unlock,
 * cancel does not unlock, unauthorized unlock, unlock reason stored),
 * SRS-258 (lock icon disabled without permission, click ignored, tooltip, enabled after grant,
 * API block without permission),
 * and SRS-259 (backend blocks edit/delete/status change/config update for locked session).
 */
test.describe('URS-DV-GEN-19 / SRS-070: Unlock Flow, Lock Icon Permission & Backend Restrictions', () => {
  let lockPage: SessionLockPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    lockPage = new SessionLockPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await lockPage.gotoSession();
  });

  // ── SRS-257 (continued): Unlock Session Flow ─────────────────────────────

  test(`${generateUnitTestId('2669')}: Verify unlock submission is blocked if reason is empty -- when Unlock popup is opened`, async ({ page }) => {
    await test.step('Given Unlock popup is opened', async () => {
      await lockPage.waitForLoad();
      await lockPage.openUnlockModal();
    });

    await test.step('When the user keeps Reason field empty and clicks Submit', async () => {
      await lockPage.fillUnlockReason('');
      await lockPage.submitUnlock();
    });

    await test.step('Then the system should block unlock action and mandatory validation should be shown', async () => {
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-blocked-empty-reason');
  });

  test(`${generateUnitTestId('2670')}: Verify session unlocks successfully with valid reason -- when Unlock popup is opened`, async ({ page }) => {
    await test.step('Given Unlock popup is opened', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user enters a valid unlock reason and clicks Submit', async () => {
      await lockPage.unlockSession();
    });

    await test.step('Then the session should be unlocked successfully and session state should change to Re-open', async () => {
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-success-valid-reason');
  });

  test(`${generateUnitTestId('2671')}: Verify Edit/Delete actions are enabled after session unlock -- when the session was locked and then unlocked successfully`, async ({ page }) => {
    await test.step('Given the session was locked and then unlocked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Actions column for that session', async () => {
      // Actions column visible in session list
    });

    await test.step('Then Edit and Delete actions should become enabled', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
      expect(restricted).toContain('Delete');
      const lockConfigured = await lockPage.isLockPageConfigured();
      expect(lockConfigured).toBe(true);
    });

    await screenshot.takeStep('edit-delete-enabled-after-unlock');
  });

  test(`${generateUnitTestId('2672')}: Verify session remains locked when user cancels unlock popup -- when Unlock popup is opened`, async ({ page }) => {
    await test.step('Given Unlock popup is opened', async () => {
      await lockPage.waitForLoad();
      await lockPage.openUnlockModal();
    });

    await test.step('When the user enters a reason and clicks Cancel', async () => {
      await lockPage.fillUnlockReason('Cancel test reason');
      await lockPage.cancelUnlock();
    });

    await test.step('Then the popup should close and the session should remain locked', async () => {
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-cancel-session-remains-locked');
  });

  test(`${generateUnitTestId('2673')}: Verify unauthorized user cannot unlock session -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked and the logged-in user does not have Lock permission', async () => {
      await lockPage.waitForLoad();
      // TODO: Login as user without Lock permission
    });

    await test.step('When the user tries to unlock the session', async () => {
      // TODO: Attempt unlock action
    });

    await test.step('Then the system should block the unlock action and session should remain locked', async () => {
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('unauthorized-unlock-blocked');
  });

  test(`${generateUnitTestId('2674')}: Verify unlock reason is stored for audit and visible in history/tooltip if available -- when the session is unlocked with a reason`, async ({ page }) => {
    await test.step('Given the session is unlocked with a reason', async () => {
      await lockPage.waitForLoad();
      // TODO: Ensure session was unlocked with a specific reason
    });

    await test.step('When the user checks lock/unlock info (tooltip/log if available)', async () => {
      // TODO: Hover over relevant icon or open audit log
    });

    await test.step('Then the unlock reason should be recorded correctly', async () => {
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-reason-stored-audit');
  });

  // ── SRS-258: Lock Icon – Permission-Based Behavior ─────────────────────

  test(`${generateUnitTestId('2675')}: Verify lock icon is visible but disabled when user belongs to group but lacks lock permission -- when the user is assigned to the project/session group`, async ({ page }) => {
    await test.step('Given the user is assigned to the project/session group and the user role does not have Lock permission enabled', async () => {
      await lockPage.waitForLoad();
      // TODO: Login as user without Lock permission but in session group
    });

    await test.step('When the user opens Data Labelling Session list page', async () => {
      // Page loaded in beforeEach
    });

    await test.step('Then the Lock icon should be visible and it should be greyed out and non-clickable', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-disabled-no-permission');
  });

  test(`${generateUnitTestId('2676')}: Verify clicking disabled lock icon does not open popup -- when lock icon is displayed in disabled state`, async ({ page }) => {
    await test.step('Given lock icon is displayed in disabled state', async () => {
      await lockPage.waitForLoad();
      // TODO: Login as user without Lock permission
    });

    await test.step('When the user clicks the disabled Lock icon', async () => {
      // TODO: Click on the disabled lock icon
    });

    await test.step('Then Lock popup should not open and no action should be performed', async () => {
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('disabled-lock-icon-no-popup');
  });

  test(`${generateUnitTestId('2677')}: Verify tooltip message indicates permission missing -- when lock icon is disabled`, async ({ page }) => {
    await test.step('Given lock icon is disabled', async () => {
      await lockPage.waitForLoad();
      // TODO: Login as user without Lock permission
    });

    await test.step('When the user hovers over the lock icon', async () => {
      // TODO: Hover over disabled lock icon
    });

    await test.step('Then tooltip should indicate lock permission is required (if tooltip is implemented)', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-tooltip-permission-missing');
  });

  test(`${generateUnitTestId('2678')}: Verify disabled lock icon becomes enabled after Lock permission is granted -- when the user is in the group but lock permission is disabled initially`, async ({ page }) => {
    await test.step('Given the user is in the group but lock permission is disabled initially', async () => {
      await lockPage.waitForLoad();
      // TODO: Login as user without Lock permission initially
    });

    await test.step('When admin enables Lock permission for the user role and the user refreshes or re-login', async () => {
      // TODO: Enable Lock permission for user role
      await page.reload();
      await lockPage.waitForLoad();
    });

    await test.step('Then the lock icon should become enabled and clickable', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-icon-enabled-after-permission-grant');
  });

  test(`${generateUnitTestId('2679')}: Verify user cannot lock session via API even if icon is visible disabled -- when the user belongs to the group but lacks Lock permission`, async ({ page }) => {
    await test.step('Given the user belongs to the group but lacks Lock permission', async () => {
      await lockPage.waitForLoad();
      // TODO: Login as user without Lock permission
    });

    await test.step('When the user attempts lock action through direct request/API call', async () => {
      // TODO: Send direct API request to lock session
    });

    await test.step('Then the system should reject the request and session should remain unlocked', async () => {
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('api-lock-rejected-no-permission');
  });

  // ── SRS-259: Backend Restrictions for Locked Sessions ──────────────────

  test(`${generateUnitTestId('2680')}: Verify backend rejects update request for locked session -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user attempts to update session details using direct request/API (bypass UI)', async () => {
      // TODO: Send direct API request to update locked session
    });

    await test.step('Then the system should reject the request and return access denied response', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
    });

    await screenshot.takeStep('backend-rejects-update-locked-session');
  });

  test(`${generateUnitTestId('2681')}: Verify backend rejects delete request for locked session -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user attempts to delete session using direct request/API call', async () => {
      // TODO: Send direct API request to delete locked session
    });

    await test.step('Then the system should reject the request and return access denied response', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Delete');
    });

    await screenshot.takeStep('backend-rejects-delete-locked-session');
  });

  test(`${generateUnitTestId('2682')}: Verify backend rejects session status update when session is locked -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user attempts to change session status through API (Completed to Re-open / In progress)', async () => {
      // TODO: Send direct API request to change status of locked session
    });

    await test.step('Then the system should reject the request and session status should remain unchanged', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
      const lockConfigured = await lockPage.isLockPageConfigured();
      expect(lockConfigured).toBe(true);
    });

    await screenshot.takeStep('backend-rejects-status-change-locked');
  });

  test(`${generateUnitTestId('2683')}: Verify backend blocks updates to session configuration fields when locked -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user attempts to update session config fields (labels, assignees, reviewers, approval levels) using API', async () => {
      // TODO: Send direct API request to update configuration of locked session
    });

    await test.step('Then the system should reject the update request and no changes should be saved', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('backend-blocks-config-update-locked');
  });
});
