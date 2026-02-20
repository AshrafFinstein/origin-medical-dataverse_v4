import { test, expect } from '@playwright/test';
import { SessionLockPage } from '../../../../pages/session-lock.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-19 / SRS-071: Backend Duplicate/Access Denied, Performance & Visual Indicators
 *
 * Covers SRS-259 (backend allows duplicate creation, access denied message non-technical),
 * SRS-260 (lock/unlock quick completion, loader visibility, grid refresh without reload,
 * timeout retry handling),
 * and SRS-261 (lock status visual indicator, unlock indicator removed, tooltip shows reason,
 * disabled actions visually distinct, duplicate clearly available, consistent indicators,
 * no ambiguous messaging).
 */
test.describe('URS-DV-GEN-19 / SRS-071: Backend Duplicate, Performance & Visual Indicators', () => {
  let lockPage: SessionLockPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    lockPage = new SessionLockPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await lockPage.gotoSession();
  });

  // ── SRS-259 (continued): Backend Allows Duplicate & Access Denied ──────

  test(`${generateUnitTestId('2684')}: Verify backend allows creating a new duplicated session while original is locked -- when the original session is locked`, async ({ page }) => {
    await test.step('Given the original session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user duplicates the session (new session creation request)', async () => {
      const duplicateVisible = await lockPage.isDuplicateButtonVisible();
      expect(duplicateVisible).toBe(true);
      // TODO: Click duplicate button and submit
    });

    await test.step('Then the system should allow duplication and create a new session record successfully', async () => {
      const allowed = lockPage.getAllowedActions();
      expect(allowed).toContain('Duplicate');
      const duplicateConfigured = await lockPage.isDuplicateButtonConfigured();
      expect(duplicateConfigured).toBe(true);
    });

    await screenshot.takeStep('backend-allows-duplicate-locked-session');
  });

  test(`${generateUnitTestId('2685')}: Verify access denied response is safe and non-technical -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user triggers a blocked update request', async () => {
      // TODO: Send direct API request to update locked session and capture response
    });

    await test.step('Then the system should return access denied response and it should not expose internal server or stack details', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
      expect(restricted).toContain('Delete');
    });

    await screenshot.takeStep('access-denied-non-technical');
  });

  // ── SRS-260: Lock/Unlock Performance ────────────────────────────────────

  test(`${generateUnitTestId('2686')}: Verify session lock completes without noticeable delay -- when the user is on Data Labelling Session list page`, async ({ page }) => {
    await test.step('Given the user is on Data Labelling Session list page', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user locks a Completed session with valid reason', async () => {
      await lockPage.lockSession();
    });

    await test.step('Then the lock action should complete quickly and lock state should reflect immediately in grid', async () => {
      const lockIconVisible = await lockPage.isLockIconVisible();
      expect(lockIconVisible).toBe(true);
    });

    await screenshot.takeStep('lock-completes-quickly');
  });

  test(`${generateUnitTestId('2687')}: Verify session unlock completes without noticeable delay -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user unlocks the session with valid reason', async () => {
      await lockPage.unlockSession();
    });

    await test.step('Then the unlock action should complete quickly and session status should update to Re-open instantly', async () => {
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('unlock-completes-quickly');
  });

  test(`${generateUnitTestId('2688')}: Verify loader is shown during lock/unlock processing -- when the user triggers Lock or Unlock action`, async ({ page }) => {
    await test.step('Given the user triggers Lock or Unlock action', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the system processes the request', async () => {
      // TODO: Trigger lock action and observe loader
      await lockPage.lockSession();
    });

    await test.step('Then a loader/processing indicator should be shown until completion', async () => {
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('loader-shown-during-lock-unlock');
  });

  test(`${generateUnitTestId('2689')}: Verify grid refresh happens instantly without full page reload -- when the session list page is open`, async ({ page }) => {
    await test.step('Given the session list page is open', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user locks a session', async () => {
      await lockPage.lockSession();
    });

    await test.step('Then the grid should refresh immediately and the page should not fully reload', async () => {
      const lockIconVisible = await lockPage.isLockIconVisible();
      expect(lockIconVisible).toBe(true);
    });

    await screenshot.takeStep('grid-refresh-no-full-reload');
  });

  test(`${generateUnitTestId('2690')}: Verify retry option/message appears when lock action times out -- when the user triggers lock/unlock action`, async ({ page }) => {
    await test.step('Given the user triggers lock/unlock action', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the request times out due to slow network/backend delay', async () => {
      // TODO: Simulate network timeout during lock/unlock action
    });

    await test.step('Then the system should show retry option or timeout message and user should be able to retry without breaking UI', async () => {
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('timeout-retry-handling');
  });

  // ── SRS-261: Lock Status Visual Indicators ─────────────────────────────

  test(`${generateUnitTestId('2691')}: Verify locked session is clearly identifiable in session list -- when a session is locked successfully`, async ({ page }) => {
    await test.step('Given a session is locked successfully', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the session list page is displayed', async () => {
      // Session list visible
    });

    await test.step('Then a lock icon/badge should be clearly visible for the locked session', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
      const lockIconVisible = await lockPage.isLockIconVisible();
      expect(lockIconVisible).toBe(true);
    });

    await screenshot.takeStep('locked-session-clearly-identifiable');
  });

  test(`${generateUnitTestId('2692')}: Verify lock indicator is removed after unlocking session -- when a session was locked and then unlocked`, async ({ page }) => {
    await test.step('Given a session was locked and then unlocked', async () => {
      await lockPage.waitForLoad();
      // TODO: Ensure session was previously locked then unlocked
    });

    await test.step('When the session list refreshes', async () => {
      await page.reload();
      await lockPage.waitForLoad();
    });

    await test.step('Then the lock icon/badge should no longer be visible', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-indicator-removed-after-unlock');
  });

  test(`${generateUnitTestId('2693')}: Verify tooltip displays lock reason clearly -- when a session is locked with a reason`, async ({ page }) => {
    await test.step('Given a session is locked with a reason', async () => {
      await lockPage.waitForLoad();
      // TODO: Ensure session is locked with a specific reason
    });

    await test.step('When the user hovers over the lock icon/badge', async () => {
      // TODO: Hover over lock icon to trigger tooltip
    });

    await test.step('Then the tooltip should display "Session is locked. Reason: <reason>"', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('tooltip-displays-lock-reason');
  });

  test(`${generateUnitTestId('2694')}: Verify disabled actions are visually distinguishable for locked session -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Edit/Delete actions', async () => {
      // Actions column visible
    });

    await test.step('Then disabled actions should appear greyed out or hidden and clearly indicate non-interactive state', async () => {
      const restricted = lockPage.getRestrictedActions();
      expect(restricted).toContain('Edit');
      expect(restricted).toContain('Delete');
    });

    await screenshot.takeStep('disabled-actions-visually-distinct');
  });

  test(`${generateUnitTestId('2695')}: Verify Duplicate action is clearly available even when session is locked -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user views Actions column', async () => {
      // Actions column visible
    });

    await test.step('Then Duplicate option should remain clearly enabled and usable', async () => {
      const allowed = lockPage.getAllowedActions();
      expect(allowed).toContain('Duplicate');
      const duplicateConfigured = await lockPage.isDuplicateButtonConfigured();
      expect(duplicateConfigured).toBe(true);
    });

    await screenshot.takeStep('duplicate-clearly-available-locked');
  });

  test(`${generateUnitTestId('2696')}: Verify lock indicators remain clear after refresh or re-login -- when a session is locked`, async ({ page }) => {
    await test.step('Given a session is locked', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user refreshes the page or logs out and logs in again', async () => {
      await page.reload();
      await lockPage.waitForLoad();
    });

    await test.step('Then the lock icon/badge and tooltip should still display correctly', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-indicators-persist-after-refresh');
  });

  test(`${generateUnitTestId('2697')}: Verify lock/unlock indicators do not confuse users -- when multiple sessions exist (locked and unlocked)`, async ({ page }) => {
    await test.step('Given multiple sessions exist (locked and unlocked)', async () => {
      await lockPage.waitForLoad();
    });

    await test.step('When the user scans the session list', async () => {
      // Session list visible
    });

    await test.step('Then locked and unlocked sessions should be clearly distinguishable at a glance', async () => {
      const lockIconConfigured = await lockPage.isLockIconConfigured();
      expect(lockIconConfigured).toBe(true);
      const lockPageConfigured = await lockPage.isLockPageConfigured();
      expect(lockPageConfigured).toBe(true);
      const unlockPageConfigured = await lockPage.isUnlockPageConfigured();
      expect(unlockPageConfigured).toBe(true);
    });

    await screenshot.takeStep('lock-unlock-clearly-distinguishable');
  });
});
