import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SessionLockSelectors } from '../selectors';
import { SessionLockData } from '../test-data';

const {
  'session-lock-button': sessionLockButton,
  'session-unlock-button': sessionUnlockButton,
  'session-lock-icon': sessionLockIcon,
  'session-lock-modal': sessionLockModal,
  'session-lock-reason-input': sessionLockReasonInput,
  'session-lock-submit-button': sessionLockSubmitButton,
  'session-lock-cancel-button': sessionLockCancelButton,
  'session-unlock-modal': sessionUnlockModal,
  'session-unlock-reason-input': sessionUnlockReasonInput,
  'session-unlock-submit-button': sessionUnlockSubmitButton,
  'session-unlock-cancel-button': sessionUnlockCancelButton,
  'session-duplicate-button': sessionDuplicateButton,
} = SessionLockSelectors;

const { lockReason, unlockReason, restrictedActions, allowedActions } = SessionLockData;

export class SessionLockPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSession(): Promise<void> {
    await this.navigate(process.env.SESSION_URL || '/');
  }

  // ── Lock ──────────────────────────────────────────────────────────────────

  async openLockModal(): Promise<void> {
    await this.click(sessionLockButton);
    await this.waitForVisible(sessionLockModal);
  }

  async fillLockReason(reason: string): Promise<void> {
    await this.fill(sessionLockReasonInput, reason);
  }

  async submitLock(): Promise<void> {
    await this.click(sessionLockSubmitButton);
    await this.waitForSuccess();
    await this.waitForLoad();
  }

  async cancelLock(): Promise<void> {
    await this.click(sessionLockCancelButton);
    await this.waitForHidden(sessionLockModal);
  }

  async lockSession(reason?: string): Promise<void> {
    await this.openLockModal();
    await this.fillLockReason(reason ?? lockReason);
    await this.submitLock();
  }

  // ── Unlock ────────────────────────────────────────────────────────────────

  async openUnlockModal(): Promise<void> {
    await this.click(sessionUnlockButton);
    await this.waitForVisible(sessionUnlockModal);
  }

  async fillUnlockReason(reason: string): Promise<void> {
    await this.fill(sessionUnlockReasonInput, reason);
  }

  async submitUnlock(): Promise<void> {
    await this.click(sessionUnlockSubmitButton);
    await this.waitForSuccess();
    await this.waitForLoad();
  }

  async cancelUnlock(): Promise<void> {
    await this.click(sessionUnlockCancelButton);
    await this.waitForHidden(sessionUnlockModal);
  }

  async unlockSession(reason?: string): Promise<void> {
    await this.openUnlockModal();
    await this.fillUnlockReason(reason ?? unlockReason);
    await this.submitUnlock();
  }

  // ── Status ────────────────────────────────────────────────────────────────

  async isLockIconVisible(): Promise<boolean> {
    return this.isVisible(sessionLockIcon);
  }

  async isLockButtonVisible(): Promise<boolean> {
    return this.isVisible(sessionLockButton);
  }

  async isDuplicateButtonVisible(): Promise<boolean> {
    return this.isVisible(sessionDuplicateButton);
  }

  // ── Config Verification ───────────────────────────────────────────────────

  async isLockPageConfigured(): Promise<boolean> {
    return (
      Boolean(sessionLockButton) &&
      Boolean(sessionLockModal) &&
      Boolean(sessionLockReasonInput)
    );
  }

  async isUnlockPageConfigured(): Promise<boolean> {
    return (
      Boolean(sessionUnlockButton) &&
      Boolean(sessionUnlockModal) &&
      Boolean(sessionUnlockReasonInput)
    );
  }

  async isLockIconConfigured(): Promise<boolean> {
    return Boolean(sessionLockIcon);
  }

  async isDuplicateButtonConfigured(): Promise<boolean> {
    return Boolean(sessionDuplicateButton);
  }

  getRestrictedActions(): string[] {
    return restrictedActions;
  }

  getAllowedActions(): string[] {
    return allowedActions;
  }
}
