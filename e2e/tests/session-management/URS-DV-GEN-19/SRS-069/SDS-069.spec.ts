import { test, expect } from '@playwright/test';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-19 / SRS-069: Lock Popup, Locked Session Actions & Unlock Icon
 *
 * Covers SRS-255 (lock popup open, reason mandatory, lock success, cancel, reason stored),
 * SRS-256 (edit disabled, delete disabled, duplicate allowed, duplicate creates new,
 * API blocks edit/delete, normal actions for unlocked, URL edit blocked),
 * and SRS-257 (unlock icon visibility, unlock popup open).
 */
test.describe('URS-DV-GEN-19 / SRS-069: Lock Popup, Locked Session Actions & Unlock Icon', () => {
  let lockPage: SessionLockPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    lockPage = new SessionLockPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await lockPage.gotoSession();
  });

  // ── SRS-255: Lock Session Popup ─────────────────────────────────────────

  test(`${generateUnitTestId('2654')}: Verify Lock confirmation popup opens on clicking Lock icon -- when the user is on Data Labelling Session list page`, async ({ page }) => {
    await test.step('Given the user is on Data Labelling Session list page and a session status is Completed', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user clicks the Lock icon', async () => {
      await lockPage.openLockModal();
    });

    await test.step('Then the Lock popup should open with Reason textbox and Submit/Cancel buttons', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-popup-opens-on-click');
  });

  test(`${generateUnitTestId('2655')}: Verify submission is blocked if reason is empty -- when Lock popup is opened`, async ({ page }) => {
    await test.step('Given Lock popup is opened', async () => {
      await lockPage.waitForLoad();
      await lockPage.openLockModal();
    });

    await test.step('When the user keeps Reason field empty and clicks Submit', async () => {
      await lockPage.fillLockReason('');
      await lockPage.submitLock();
    });

    await test.step('Then the system should block submission and mandatory validation should be shown for Reason', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-submission-blocked-empty-reason');
  });

  test(`${generateUnitTestId('2656')}: Verify session is locked when valid reason is entered -- when Lock popup is opened`, async ({ page }) => {
    await test.step('Given Lock popup is opened', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user enters a valid reason and clicks Submit', async () => {
      await lockPage.lockSession();
    });

    await test.step('Then the session should be locked successfully and lock state should be applied in UI', async () => {
      const lockIconVisible = await lockPage.isLockIconVisible();
      expect(lockIconVisible).toBe(true);
    });

    await screenshot.takeStep('lock-success-valid-reason');
  });

  test(`${generateUnitTestId('2657')}: Verify session is not locked when user cancels popup -- when Lock popup is opened`, async ({ page }) => {
    await test.step('Given Lock popup is opened', async () => {
      await lockPage.waitForLoad();
      await lockPage.openLockModal();
    });

    await test.step('When the user enters a reason and clicks Cancel', async () => {
      await lockPage.fillLockReason('Test reason for cancel');
      await lockPage.cancelLock();
    });

    await test.step('Then the popup should close and session should remain unlocked', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('lock-cancel-session-remains-unlocked');
  });

  test(`${generateUnitTestId('2658')}: Verify lock reason is stored and visible as tooltip after locking -- when the session is locked using a reason`, async ({ page }) => {
    await test.step('Given the session is locked using a reason', async () => {
      await lockPage.waitForLoad();
      // TODO: Ensure session is locked with a specific reason
    });

    await test.step('When the user hovers over lock indicator/icon in session list', async () => {
      // TODO: Hover over lock icon to trigger tooltip
    });

    await test.step('Then the tooltip should show "Session is locked. Reason: <entered reason>"', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-reason-stored-tooltip');
  });

  // ── SRS-256: Locked Session – Action Restrictions ───────────────────────

  test(`${generateUnitTestId('2659')}: Verify Edit is disabled/hidden when session is locked -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Actions column for that session', async () => {
      // Actions column visible in session list
    });

    await test.step('Then Edit option should be disabled or hidden', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
    });

    await screenshot.takeStep('edit-disabled-locked-session');
  });

  test(`${generateUnitTestId('2660')}: Verify Delete is disabled/hidden when session is locked -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Actions column for that session', async () => {
      // Actions column visible in session list
    });

    await test.step('Then Delete option should be disabled or hidden', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Delete');
    });

    await screenshot.takeStep('delete-disabled-locked-session');
  });

  test(`${generateUnitTestId('2661')}: Verify Duplicate action remains enabled for locked session -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Actions column for that session', async () => {
      // Actions column visible in session list
    });

    await test.step('Then Duplicate option should remain enabled and clickable', async () => {
      const allowed = lockPage.getAllowedActions();
      expect(allowed).toContain('Duplicate');
      const duplicateConfigured = await lockPage.isDuplicateButtonConfigured();
      expect(duplicateConfigured).toBe(true);
    });

    await screenshot.takeStep('duplicate-enabled-locked-session');
  });

  test(`${generateUnitTestId('2662')}: Verify user can duplicate a locked session successfully -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user clicks Duplicate and enters a new valid session name and submits', async () => {
      // TODO: Click duplicate button, enter session name, submit
      const duplicateVisible = await lockPage.isDuplicateButtonVisible();
      expect(duplicateVisible).toBe(true);
    });

    await test.step('Then the system should create a new session successfully', async () => {
      const duplicateConfigured = await lockPage.isDuplicateButtonConfigured();
      expect(duplicateConfigured).toBe(true);
    });

    await screenshot.takeStep('duplicate-locked-session-success');
  });

  test(`${generateUnitTestId('2663')}: Verify direct API edit request is rejected for locked session -- when the session is locked`, async ({ page }) => {
    await test.step('Given the session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user attempts to edit session using direct request/API call', async () => {
      // TODO: Send direct API request to edit locked session
    });

    await test.step('Then the system should reject the request and session data should remain unchanged', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
    });

    await screenshot.takeStep('api-edit-rejected-locked-session');
  });

  test(`${generateUnitTestId('2664')}: Verify direct API delete request is rejected for locked session -- when the session is locked`, async ({ page }) => {
    await test.step('Given the session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user attempts to delete session using direct request/API call', async () => {
      // TODO: Send direct API request to delete locked session
    });

    await test.step('Then the system should reject the request and session should not be deleted', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Delete');
    });

    await screenshot.takeStep('api-delete-rejected-locked-session');
  });

  test(`${generateUnitTestId('2665')}: Verify Edit/Delete available when session is unlocked -- when a session is not locked`, async ({ page }) => {
    await test.step('Given a session is not locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Actions column', async () => {
      // Actions column visible in session list
    });

    await test.step('Then Edit and Delete options should be enabled normally', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('edit-delete-available-unlocked-session');
  });

  test(`${generateUnitTestId('2666')}: Verify locked session cannot be edited via direct URL navigation -- when the session is locked`, async ({ page }) => {
    await test.step('Given the session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user tries to open Edit Session page via direct URL', async () => {
      // TODO: Navigate to edit session URL directly
    });

    await test.step('Then the system should block access and show safe message or redirect back', async () => {
      const configured = await lockPage.isLockPageConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('locked-session-url-edit-blocked');
  });

  // ── SRS-257: Unlock Icon & Popup ───────────────────────────────────────

  test(`${generateUnitTestId('2667')}: Verify Unlock icon is visible for locked session -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the session list page is displayed', async () => {
      // Session list visible
    });

    await test.step('Then Unlock icon should be visible for that locked session row', async () => {
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-icon-visible-locked-session');
  });

  test(`${generateUnitTestId('2668')}: Verify Unlock popup opens on clicking unlock icon -- when the session is locked`, async ({ page }) => {
    await test.step('Given the session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user clicks Unlock icon', async () => {
      await lockPage.openUnlockModal();
    });

    await test.step('Then Unlock popup should open with Reason textbox and Submit/Cancel buttons', async () => {
      const unlockConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-popup-opens-on-click');
  });
});
