import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SessionLockSelectors, SessionSelectors } from '../selectors';

const {
  'session-lock-button': sessionLockButton,
  'session-unlock-button': sessionUnlockButton,
  'session-lock-icon': sessionLockIcon,
  'session-lock-modal': sessionLockModal,
  'session-lock-reason-input': sessionLockReasonInput,
  'session-lock-submit-button': sessionLockSubmitButton,
  'session-unlock-modal': sessionUnlockModal,
  'session-unlock-reason-input': sessionUnlockReasonInput,
  'session-unlock-submit-button': sessionUnlockSubmitButton,
} = SessionLockSelectors;

const { 'session-table': sessionTable } = SessionSelectors;

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class SessionLockPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForSessionList(): Promise<void> {
    await this.page.locator(tid(sessionTable)).first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async scrollSessionTableToRight(): Promise<void> {
    const table = this.page.locator(tid(sessionTable)).first();
    await table.evaluate((el) => {
      const root = el as HTMLElement | null;
      if (!root) return;
      let node: HTMLElement | null = root;
      while (node) {
        if (node.scrollWidth > node.clientWidth + 5) {
          node.scrollLeft = node.scrollWidth;
          break;
        }
        node = node.parentElement;
      }
    }).catch(() => {});
  }

  lockIconLocator(): Locator {
    return this.page.locator(tid(sessionLockIcon)).first();
  }

  completedSessionRowLocator(): Locator {
    const table = this.page.locator(tid(sessionTable));
    const completedRow = table.locator('tr').filter({ hasText: /completed/i }).first();
    const anyRow = table.locator('tbody tr').first();
    return completedRow.or(anyRow).first();
  }

  lockIconForCompletedSessionLocator(): Locator {
    const lockSelector = [
      tid(sessionLockIcon),
      tid(sessionLockButton),
      tid(sessionUnlockButton),
      '.n-icon',
      'i.n-icon',
      'svg',
      '[aria-label*="lock" i]',
      '[title*="lock" i]',
      '[data-icon*="lock" i]',
      '[class*="lock" i]',
      'svg[aria-label*="lock" i]',
      'svg[title*="lock" i]',
      'img[alt*="lock" i]',
      'img[src*="lock" i]',
    ].join(', ');

    const row = this.completedSessionRowLocator();
    const actionCell = row.locator('td').last();
    const actionScoped = actionCell.locator(lockSelector).first();
    const rowScoped = row.locator(lockSelector).first();
    const rowRoleScoped = row.getByRole('button', { name: /lock/i }).first();
    const pageRoleScoped = this.page.getByRole('button', { name: /lock/i }).first();
    return actionScoped.or(rowScoped).or(rowRoleScoped).or(pageRoleScoped).first();
  }

  async scrollLockIconIntoView(): Promise<void> {
    await this.scrollSessionTableToRight();
    const lockIcon = this.lockIconForCompletedSessionLocator();
    await lockIcon.scrollIntoViewIfNeeded().catch(() => {});
  }

  lockButtonLocator(): Locator {
    return this.page.locator(tid(sessionLockButton)).first();
  }

  unlockButtonLocator(): Locator {
    return this.page.locator(tid(sessionUnlockButton)).first();
  }

  lockModalLocator(): Locator {
    return this.page.locator(tid(sessionLockModal)).first();
  }

  unlockModalLocator(): Locator {
    return this.page.locator(tid(sessionUnlockModal)).first();
  }

  async isLockIconVisible(): Promise<boolean> {
    return this.lockIconLocator().isVisible().catch(() => false);
  }

  async isLockIconHidden(): Promise<boolean> {
    return this.lockIconLocator().isHidden().catch(() => true);
  }

  async openLockModalIfVisible(): Promise<boolean> {
    const button = this.lockButtonLocator();
    if (!(await button.isVisible().catch(() => false))) return false;
    await button.click();
    return this.lockModalLocator().isVisible({ timeout: 5000 }).catch(() => false);
  }

  async openUnlockModalIfVisible(): Promise<boolean> {
    const button = this.unlockButtonLocator();
    if (!(await button.isVisible().catch(() => false))) return false;
    await button.click();
    return this.unlockModalLocator().isVisible({ timeout: 5000 }).catch(() => false);
  }

  async lockSession(reason: string): Promise<void> {
    if (!(await this.openLockModalIfVisible())) return;
    await this.page.locator(tid(sessionLockReasonInput)).first().fill(reason);
    await this.page.locator(tid(sessionLockSubmitButton)).first().click();
    await this.waitForPageLoad();
  }

  async unlockSession(reason: string): Promise<void> {
    if (!(await this.openUnlockModalIfVisible())) return;
    await this.page.locator(tid(sessionUnlockReasonInput)).first().fill(reason);
    await this.page.locator(tid(sessionUnlockSubmitButton)).first().click();
    await this.waitForPageLoad();
  }
}
