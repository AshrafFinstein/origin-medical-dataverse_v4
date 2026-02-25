import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SessionLockSelectors, SessionSelectors } from '../selectors';

const {
  'session-lock-button': sessionLockButton,
  'session-unlock-button': sessionUnlockButton,
  'session-edit-button': sessionEditButton,
  'session-delete-button': sessionDeleteButton,
  'session-duplicate-button': sessionDuplicateButton,
  'session-lock-icon': sessionLockIcon,
  'session-lock-modal': sessionLockModal,
  'session-lock-reason-input': sessionLockReasonInput,
  'session-lock-submit-button': sessionLockSubmitButton,
  'session-lock-cancel-button': sessionLockCancelButton,
  'session-unlock-modal': sessionUnlockModal,
  'session-unlock-reason-input': sessionUnlockReasonInput,
  'session-unlock-submit-button': sessionUnlockSubmitButton,
  'session-duplicate-modal': sessionDuplicateModal,
  'session-duplicate-name-input': sessionDuplicateNameInput,
  'session-duplicate-submit-button': sessionDuplicateSubmitButton,
  'session-duplicate-cancel-button': sessionDuplicateCancelButton,
  // Add fallback for missing selector
  // 'session-status-select': sessionStatusSelect, // <-- Remove or comment out this line if not present
} = SessionLockSelectors;

const sessionStatusSelect = 'session-status-select'; // Fallback test ID for status select if not defined in selectors
// ...existing code...

const { 'session-table': sessionTable } = SessionSelectors; SessionSelectors;

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class SessionLockPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private statusRegexFor(status: string): RegExp {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'in progress') return /in\s*progress|in\s*review/i;
    if (normalized === 're-open') return /re-?open/i;
    if (normalized === 'yet to do') return /yet\s*to\s*do/i;
    return new RegExp(status, 'i');
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

  // ...existing code...
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

  // Use the same logic as lockIconForRow, but with the custom selector for completed row
  const actionCell = row.locator('td').last();
  const actionScoped = actionCell.locator(lockSelector).first();
  const rowScoped = row.locator(lockSelector).first();
  const rowRoleScoped = row.getByRole('button', { name: /lock/i }).first();
  const pageRoleScoped = this.page.getByRole('button', { name: /lock/i }).first();
  return actionScoped.or(rowScoped).or(rowRoleScoped).or(pageRoleScoped).first();
}
// ...existing code...

  async scrollLockIconIntoView(): Promise<void> {
    await this.scrollSessionTableToRight();
    const lockIcon = this.lockIconForCompletedSessionLocator();
    await lockIcon.scrollIntoViewIfNeeded().catch(() => {});
  }

  rowByStatus(status: string): Locator {
    const table = this.page.locator(tid(sessionTable));
    const statusRegex = this.statusRegexFor(status);
    return table.locator('tbody tr').filter({ hasText: statusRegex }).first();
  }

  async rowByAnyStatus(statuses: string[]): Promise<Locator> {
    let firstVisibleFallback: Locator | null = null;
    for (const status of statuses) {
      const statusRegex = this.statusRegexFor(status);
      const rows = this.page.locator(tid(sessionTable)).locator('tbody tr').filter({ hasText: statusRegex });
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        if (!(await row.isVisible({ timeout: 1200 }).catch(() => false))) continue;
        if (!firstVisibleFallback) firstVisibleFallback = row;
        if (await this.isEditAvailableForRow(row)) return row;
      }
    }
    if (firstVisibleFallback) return firstVisibleFallback;
    throw new Error(`No session row found for statuses: ${statuses.join(', ')}`);
  }

  rowByName(name: string): Locator {
    const table = this.page.locator(tid(sessionTable));
    const xpathLiteral = (value: string): string => {
      if (!value.includes("'")) return `'${value}'`;
      if (!value.includes('"')) return `"${value}"`;
      return `concat('${value.replace(/'/g, `', "'", '`)}')`;
    };
    const nameLiteral = xpathLiteral(name.trim());
    return table.locator(`xpath=.//tbody/tr[normalize-space(td[1])=${nameLiteral}]`).first();
  }

  async getSessionNameFromRow(row: Locator): Promise<string> {
    const nameCell = row.locator('td').first();
    return (await nameCell.textContent())?.trim() || '';
  }

  lockIconForRow(row: Locator): Locator {
    const lockControlSelector = [
      tid(sessionLockIcon),
      tid(sessionLockButton),
      tid(sessionUnlockButton),
      '[aria-label*="lock" i]',
      '[aria-label*="unlock" i]',
      '[title*="lock" i]',
      '[title*="unlock" i]',
      '[data-icon*="lock" i]',
      '[class*="lock" i]',
      'svg[aria-label*="lock" i]',
      'svg[title*="lock" i]',
      'img[alt*="lock" i]',
      'img[src*="lock" i]',
    ].join(', ');

    const actionCell = row.locator('td').last();
    const actionScoped = actionCell.locator(lockControlSelector).first();
    const actionTextScoped = actionCell.getByText(/^lock$/i).first();
    const rowScoped = row.locator(lockControlSelector).first();
    const rowTextScoped = row.getByText(/^lock$/i).first();
    const rowRoleScoped = row.getByRole('button', { name: /lock|unlock/i }).first();
    return actionScoped.or(actionTextScoped).or(rowScoped).or(rowTextScoped).or(rowRoleScoped).first();
  }

  lockIconForCompletedRow(row: Locator): Locator {
    const actionCell = row.locator('td').last();
    const genericCompletedFallback = actionCell.locator('img, svg, i').last();
    return this.lockIconForRow(row).or(genericCompletedFallback).first();
  }

  async rowByStatusWithLock(status: string): Promise<Locator> {
    const table = this.page.locator(tid(sessionTable));
    const statusRegex = this.statusRegexFor(status);
    const rows = table.locator('tbody tr').filter({ hasText: statusRegex });
    const count = await rows.count();
    let firstVisible: Locator | null = null;

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      if (!(await row.isVisible({ timeout: 1200 }).catch(() => false))) continue;
      if (!firstVisible) firstVisible = row;
      const lockVisible = await this.lockIconForCompletedRow(row).isVisible({ timeout: 1200 }).catch(() => false);
      if (lockVisible) return row;
    }

    if (firstVisible) return firstVisible;
    throw new Error(`No visible session row found for status: ${status}`);
  }

  async openEditForRow(row: Locator): Promise<void> {
    const editButton = this.editButtonForRow(row);
    if (
      await editButton.isVisible({ timeout: 2000 }).catch(() => false)
      && await editButton.isEnabled().catch(() => false)
    ) {
      await editButton.click();
      return;
    }
    const fallback = row.getByText('Edit', { exact: true }).first();
    if (
      await fallback.isVisible({ timeout: 2000 }).catch(() => false)
      && await fallback.isEnabled().catch(() => false)
    ) {
      await fallback.click();
      return;
    }
    throw new Error('Edit button not available for selected session row (hidden or disabled).');
  }

  async setSessionStatusInEditModal(status: string): Promise<boolean> {
    const dropdown = this.page.locator(tid(sessionStatusSelect)).first();
    await dropdown.scrollIntoViewIfNeeded().catch(() => {});
    await dropdown.click({ force: true }).catch(() => {});
    const option = this.page.locator('.n-base-select-option__content').filter({ hasText: status }).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
      return true;
    }
    try {
      await this.selectOption(tid(sessionStatusSelect), status);
      return true;
    } catch {
      return false;
    }
  }

  async setSessionStatusInEditModalAny(statuses: string[]): Promise<string> {
    for (const status of statuses) {
      if (await this.setSessionStatusInEditModal(status)) return status;
    }
    throw new Error(`No matching status option found in edit modal: ${statuses.join(', ')}`);
  }

  async saveSessionEdit(): Promise<void> {
    const dialog = this.page.getByRole('dialog').first();
    const saveButton = dialog.getByRole('button', { name: /save|update|apply|submit/i }).first();
    await saveButton.click({ force: true });
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.waitForPageLoad();
  }

  async refreshSessionList(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await this.waitForPageLoad();
    await this.waitForSessionList();
  }

  async tryReachSessionListFromCurrentPage(maxHops = 4): Promise<boolean> {
    if (await this.page.locator(tid(sessionTable)).first().isVisible({ timeout: 1200 }).catch(() => false)) {
      return true;
    }

    for (let hop = 0; hop < maxHops; hop++) {
      const rowGoButton = this.page.locator('tbody tr').first().getByRole('button', { name: /^Go$/i }).first();
      const anyGoButton = this.page.getByRole('button', { name: /^Go$/i }).first();
      const target = (await rowGoButton.isVisible({ timeout: 1200 }).catch(() => false)) ? rowGoButton : anyGoButton;

      if (!(await target.isVisible({ timeout: 1200 }).catch(() => false))) break;
      await target.click({ force: true }).catch(() => {});
      await this.waitForPageLoad();

      if (await this.page.locator(tid(sessionTable)).first().isVisible({ timeout: 2000 }).catch(() => false)) {
        return true;
      }

      const fallbackTable = this.page
        .locator('table')
        .filter({ hasText: /completed|in progress|yet to do/i })
        .first();
      if (await fallbackTable.isVisible({ timeout: 1200 }).catch(() => false)) return true;
    }

    return false;
  }

  async ensureSessionListFromAnyPage(maxDepth = 8): Promise<void> {
    for (let depth = 0; depth < maxDepth; depth++) {
      const hasSessionTable = await this.page.locator(tid(sessionTable)).first().isVisible({ timeout: 1200 }).catch(() => false);
      if (hasSessionTable) return;

      const sessionLikeTable = this.page
        .locator('table')
        .filter({ hasText: /completed|in progress|yet to do|session/i })
        .first();
      if (await sessionLikeTable.isVisible({ timeout: 1200 }).catch(() => false)) return;

      const createSessionButton = this.page.getByRole('button', { name: /create session/i }).first();
      if (await createSessionButton.isVisible({ timeout: 1200 }).catch(() => false)) return;

      const goButtons = this.page.locator('table tbody tr button').filter({ hasText: /^Go$/i });
      const count = await goButtons.count();
      if (!count) break;

      let moved = false;
      for (let i = 0; i < Math.min(count, 5); i++) {
        const btn = goButtons.nth(i);
        if (!(await btn.isVisible({ timeout: 800 }).catch(() => false))) continue;
        await btn.click({ force: true }).catch(() => {});
        await this.waitForPageLoad();
        moved = true;

        const landedOnSession = await this.page.locator(tid(sessionTable)).first().isVisible({ timeout: 1500 }).catch(() => false);
        if (landedOnSession) return;

        const createSessionVisible = await this.page.getByRole('button', { name: /create session/i }).first().isVisible({ timeout: 800 }).catch(() => false);
        if (createSessionVisible) return;
      }

      if (!moved) break;
    }

    throw new Error(`Could not reach Session list page from current state. URL: ${this.page.url()}`);
  }

  private actionCellForRow(row: Locator): Locator {
    return row.locator('td').last();
  }

  editButtonForRow(row: Locator): Locator {
    const actionCell = this.actionCellForRow(row);
    const byTestId = actionCell.locator(tid(sessionEditButton)).first();
    const byRole = actionCell.getByRole('button', { name: /edit/i }).first();
    const byText = actionCell.getByText('Edit', { exact: true }).first();
    return byTestId.or(byRole).or(byText).first();
  }

  deleteButtonForRow(row: Locator): Locator {
    const actionCell = this.actionCellForRow(row);
    const byTestId = actionCell.locator(tid(sessionDeleteButton)).first();
    const byRole = actionCell.getByRole('button', { name: /delete/i }).first();
    const byText = actionCell.getByText('Delete', { exact: true }).first();
    return byTestId.or(byRole).or(byText).first();
  }

  private moreButtonForRow(row: Locator): Locator {
    const actionCell = this.actionCellForRow(row);
    const byAria = actionCell.locator('button[aria-label*="more" i], button[title*="more" i], button[aria-haspopup="menu"]').first();
    const byIcon = actionCell.locator('button:has(i.n-icon), button:has(svg)').last();
    return byAria.or(byIcon).first();
  }

  duplicateButtonForRow(row: Locator): Locator {
    const actionCell = this.actionCellForRow(row);
    const byTestId = actionCell.locator(tid(sessionDuplicateButton)).first();
    const byRole = actionCell.getByRole('button', { name: /duplicate/i }).first();
    const byText = actionCell.getByText('Duplicate', { exact: true }).first();
    const byAttr = actionCell.locator(
      '[aria-label*="duplicate" i], [title*="duplicate" i], [data-icon*="duplicate" i], [data-icon*="copy" i], [class*="duplicate" i]'
    ).first();
    const byIconParent = actionCell
      .locator('svg[aria-label*="duplicate" i], svg[title*="duplicate" i], img[alt*="duplicate" i], img[src*="duplicate" i], svg[data-icon*="copy" i]')
      .locator('xpath=ancestor-or-self::button[1]')
      .first();
    return byTestId.or(byRole).or(byText).or(byAttr).or(byIconParent).first();
  }

  async isEditAvailableForRow(row: Locator): Promise<boolean> {
    const edit = this.editButtonForRow(row);
    if (!(await edit.isVisible({ timeout: 1500 }).catch(() => false))) return false;
    const nativeEnabled = await edit.isEnabled().catch(() => false);
    const disabledAttr = await edit.getAttribute('disabled').catch(() => null);
    const ariaDisabled = await edit.getAttribute('aria-disabled').catch(() => null);
    const tabIndex = await edit.getAttribute('tabindex').catch(() => null);
    const cls = (await edit.getAttribute('class').catch(() => '')) || '';
    const visuallyDisabled = /n-button--disabled|disabled|is-disabled|cursor-not-allowed|opacity-/.test(cls);
    const effectivelyDisabled =
      disabledAttr !== null
      || ariaDisabled === 'true'
      || tabIndex === '-1'
      || visuallyDisabled;
    return nativeEnabled && !effectivelyDisabled;
  }

  async isDeleteAvailableForRow(row: Locator): Promise<boolean> {
    const del = this.deleteButtonForRow(row);
    if (await del.isVisible({ timeout: 1200 }).catch(() => false)) {
      return del.isEnabled().catch(() => false);
    }

    // Some pages put Delete under overflow/kebab menu in the row actions.
    const more = this.moreButtonForRow(row);
    if (!(await more.isVisible({ timeout: 1200 }).catch(() => false))) return false;
    await more.click({ force: true }).catch(() => {});

    const menuDelete = this.page
      .locator('.n-dropdown-option, [role="menuitem"], .n-popover')
      .filter({ hasText: /^Delete$/i })
      .first();
    const visible = await menuDelete.isVisible({ timeout: 1500 }).catch(() => false);
    if (!visible) {
      await this.page.keyboard.press('Escape').catch(() => {});
      return false;
    }
    const enabled = await menuDelete.isEnabled().catch(() => true);
    await this.page.keyboard.press('Escape').catch(() => {});
    return enabled;
  }

  async isDuplicateAvailableForRow(row: Locator): Promise<boolean> {
    const duplicate = this.duplicateButtonForRow(row);
    if (!(await duplicate.isVisible({ timeout: 1500 }).catch(() => false))) return false;
    return duplicate.isEnabled().catch(() => false);
  }

  async isDuplicateIconEnabledForRow(row: Locator): Promise<boolean> {
    const actionCell = this.actionCellForRow(row);

    // Preferred path: explicit duplicate control when available.
    const duplicate = this.duplicateButtonForRow(row);
    if (await duplicate.isVisible({ timeout: 1200 }).catch(() => false)) {
      return duplicate.isEnabled().catch(() => false);
    }

    // Exact UI pattern: Duplicate is the icon immediately before Go in action cell.
    const duplicateIconNearGo = actionCell.locator(
      'xpath=.//button[normalize-space()="Go"]/preceding-sibling::*[1][self::i or self::svg or self::img]'
    ).first();
    if (await duplicateIconNearGo.isVisible({ timeout: 1000 }).catch(() => false)) {
      const ariaDisabled = await duplicateIconNearGo.getAttribute('aria-disabled').catch(() => null);
      const cls = await duplicateIconNearGo.getAttribute('class').catch(() => '');
      if (ariaDisabled === 'true') return false;
      if (/disabled|not-allowed|opacity-50/i.test(cls || '')) return false;
      return true;
    }

    // Fallback for icon-only UIs: enabled action button that is not Edit/Go.
    const iconActionButtons = actionCell.locator('button').filter({ hasNotText: /^(Edit|Go)$/i });
    const count = await iconActionButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = iconActionButtons.nth(i);
      const visible = await btn.isVisible({ timeout: 800 }).catch(() => false);
      if (!visible) continue;
      const enabled = await btn.isEnabled().catch(() => false);
      if (enabled) return true;
    }

    return false;
  }

  duplicateModalLocator(): Locator {
    return this.page.locator(tid(sessionDuplicateModal)).first();
  }

  duplicateModalAnyLocator(): Locator {
    const byTestIdCreate = this.page.locator('[data-testid="session-create-modal"]').first();
    const byDuplicateRole = this.page.getByRole('dialog').filter({ hasText: /duplicate/i }).first();
    const byCreateSessionRole = this.page.getByRole('dialog').filter({ hasText: /create session/i }).first();
    const byCreateHeading = this.page.getByRole('heading', { name: /create session/i }).first();
    return this.duplicateModalLocator().or(byTestIdCreate).or(byDuplicateRole).or(byCreateSessionRole).or(byCreateHeading).first();
  }

  async tryOpenDuplicateForRow(row: Locator): Promise<boolean> {
    const actionCell = this.actionCellForRow(row);
    const duplicateIconNearGo = actionCell.locator(
      'xpath=.//button[normalize-space()="Go"]/preceding-sibling::*[1][self::i or self::svg or self::img]'
    ).first();
    const duplicateINicon = actionCell.locator('i.n-icon').first();
    const candidates = [
      duplicateIconNearGo,
      duplicateINicon,
      this.duplicateButtonForRow(row),
      actionCell.locator('[data-testid*="duplicate" i], [aria-label*="duplicate" i], [title*="duplicate" i]').first(),
      // In this UI duplicate is often the first icon between Edit and Go.
      actionCell.locator('img, svg, i').first(),
    ];

    for (const candidate of candidates) {
      if (!(await candidate.isVisible({ timeout: 1200 }).catch(() => false))) continue;
      await candidate.click({ force: true }).catch(() => {});
      if (await this.duplicateModalAnyLocator().isVisible({ timeout: 6000 }).catch(() => false)) return true;
      await this.page.keyboard.press('Escape').catch(() => {});
    }

    return false;
  }

  async openDuplicateForRow(row: Locator): Promise<boolean> {
    const opened = await this.tryOpenDuplicateForRow(row);
    if (!opened) return false;
    await this.duplicateModalAnyLocator().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    return true;
  }

  async submitDuplicateName(name: string): Promise<boolean> {
    const modal = this.duplicateModalAnyLocator();
    if (!(await modal.isVisible({ timeout: 2000 }).catch(() => false))) return false;
    const namedInput = modal.locator(tid(sessionDuplicateNameInput)).first();
    if (await namedInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await namedInput.fill(name);
    } else {
      await modal.locator('input').first().fill(name);
    }

    const submitByTestId = modal.locator(tid(sessionDuplicateSubmitButton)).first();
    if (await submitByTestId.isVisible({ timeout: 1500 }).catch(() => false)) {
      await submitByTestId.click();
    } else {
      await modal.getByRole('button', { name: /duplicate|create|submit|save|update/i }).first().click();
    }

    await modal.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.waitForPageLoad();
    return true;
  }

  async cancelDuplicate(): Promise<void> {
    const modal = this.duplicateModalAnyLocator();
    const cancelByTestId = modal.locator(tid(sessionDuplicateCancelButton)).first();
    if (await cancelByTestId.isVisible({ timeout: 1500 }).catch(() => false)) {
      await cancelByTestId.click();
    } else {
      await modal.getByRole('button', { name: /cancel|close/i }).first().click();
    }
    await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async openDirectEditUrlForRow(row: Locator): Promise<string> {
    await this.openEditForRow(row);
    await this.page.waitForURL(/\/session\/.*\/edit/i, { timeout: 8000 }).catch(() => {});
    return this.page.url();
  }

  async assertEditAccessBlocked(): Promise<void> {
    const isSessionTableVisible = await this.page
      .locator(tid(sessionTable))
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (isSessionTableVisible) return;

    const blockedSignals = [
      this.page.getByText(/not authorized|access denied|permission|forbidden|blocked/i).first(),
      this.page.getByRole('heading', { name: /unauthorized|forbidden/i }).first(),
    ];
    for (const signal of blockedSignals) {
      if (await signal.isVisible({ timeout: 1500 }).catch(() => false)) return;
    }

    const sessionPath = /\/(session|sessions)(\/|$)/i.test(this.page.url());
    if (!sessionPath) {
      throw new Error(`Expected edit access to be blocked/redirected, current URL: ${this.page.url()}`);
    }
  }

  lockButtonLocator(): Locator {
    return this.page.locator(tid(sessionLockButton)).first();
  }

  lockButtonForRow(row: Locator): Locator {
    const actionCell = this.actionCellForRow(row);
    const byTestId = actionCell.locator(tid(sessionLockButton)).first();
    const byRole = actionCell.getByRole('button', { name: /lock/i }).first();
    const byAttr = actionCell.locator(
      '[aria-label*="lock" i], [title*="lock" i], [data-icon*="lock" i], [class*="lock" i]'
    ).first();
    const byIconParent = actionCell
      .locator('svg[aria-label*="lock" i], svg[title*="lock" i], img[alt*="lock" i], img[src*="lock" i]')
      .locator('xpath=ancestor-or-self::button[1]')
      .first();
    return byTestId.or(byRole).or(byAttr).or(byIconParent).first();
  }

  unlockButtonForRow(row: Locator): Locator {
    const actionCell = this.actionCellForRow(row);
    const byTestId = actionCell.locator(tid(sessionUnlockButton)).first();
    const byRole = actionCell.getByRole('button', { name: /unlock/i }).first();
    const byAttr = actionCell.locator(
      '[aria-label*="unlock" i], [title*="unlock" i], [data-icon*="unlock" i], [class*="unlock" i]'
    ).first();
    return byTestId.or(byRole).or(byAttr).first();
  }

  unlockButtonLocator(): Locator {
    return this.page.locator(tid(sessionUnlockButton)).first();
  }

  lockModalLocator(): Locator {
    return this.page.locator(tid(sessionLockModal)).first();
  }

  lockModalAnyLocator(): Locator {
    return this.lockModalLocator().or(this.lockModalByRoleLocator()).first();
  }

  private lockModalByRoleLocator(): Locator {
    return this.page.getByRole('dialog').filter({ hasText: /lock session/i }).first();
  }

  private unlockModalByRoleLocator(): Locator {
    return this.page.getByRole('dialog').filter({ hasText: /unlock session/i }).first();
  }

  private async isLockModalOpen(timeout = 1200): Promise<boolean> {
    const byTestId = await this.lockModalLocator().isVisible({ timeout }).catch(() => false);
    if (byTestId) return true;
    const byRole = await this.lockModalByRoleLocator().isVisible({ timeout }).catch(() => false);
    if (byRole) return true;
    const reasonInput = this.page.getByRole('textbox', { name: /why do you want to lock this session/i }).first();
    return reasonInput.isVisible({ timeout }).catch(() => false);
  }

  private async isUnlockModalOpen(timeout = 1200): Promise<boolean> {
    const byTestId = await this.unlockModalLocator().isVisible({ timeout }).catch(() => false);
    if (byTestId) return true;
    const byRole = await this.unlockModalByRoleLocator().isVisible({ timeout }).catch(() => false);
    if (byRole) return true;
    const reasonInput = this.page.getByRole('textbox', { name: /why do you want to unlock this session/i }).first();
    return reasonInput.isVisible({ timeout }).catch(() => false);
  }

  lockModalCancelButton(): Locator {
    const byTestId = this.page.locator(tid(sessionLockCancelButton)).first();
    const byRole = this.lockModalAnyLocator().getByRole('button', { name: /cancel/i }).first();
    return byTestId.or(byRole).first();
  }

  lockReasonInputLocator(): Locator {
    const byTestId = this.page.locator(tid(sessionLockReasonInput)).first();
    const byRole = this.lockModalAnyLocator().getByRole('textbox', { name: /why do you want to lock this session/i }).first();
    const byPlaceholder = this.lockModalAnyLocator().getByPlaceholder(/why do you want to lock this session/i).first();
    const byTextarea = this.lockModalAnyLocator().locator('textarea').first();
    return byTestId.or(byRole).or(byPlaceholder).or(byTextarea).first();
  }

  lockSubmitButtonLocator(): Locator {
    const byTestId = this.page.locator(tid(sessionLockSubmitButton)).first();
    const byRole = this.lockModalAnyLocator().getByRole('button', { name: /submit/i }).first();
    return byTestId.or(byRole).first();
  }

  unlockModalLocator(): Locator {
    return this.page.locator(tid(sessionUnlockModal)).first();
  }

  unlockModalCancelButton(): Locator {
    return this.page.locator('[data-testid="session-unlock-cancel-button"]').first();
  }

  unlockReasonInputLocator(): Locator {
    return this.page.locator(tid(sessionUnlockReasonInput)).first();
  }

  unlockSubmitButtonLocator(): Locator {
    return this.page.locator(tid(sessionUnlockSubmitButton)).first();
  }

  async isRowLocked(row: Locator): Promise<boolean> {
    const unlockVisible = await this.unlockButtonForRow(row).isVisible({ timeout: 1000 }).catch(() => false);
    if (unlockVisible) return true;
    const lockVisible = await this.lockButtonForRow(row).isVisible({ timeout: 1000 }).catch(() => false);
    return !lockVisible;
  }

  async isRowUnlocked(row: Locator): Promise<boolean> {
    const lockVisible = await this.lockButtonForRow(row).isVisible({ timeout: 1000 }).catch(() => false);
    const unlockVisible = await this.unlockButtonForRow(row).isVisible({ timeout: 1000 }).catch(() => false);
    return lockVisible && !unlockVisible;
  }

  async isLockIconDisabledForRow(row: Locator): Promise<boolean> {
    const icon = this.lockIconForRow(row);
    if (!(await icon.isVisible({ timeout: 1500 }).catch(() => false))) return false;

    const disabledAttr = await icon.getAttribute('disabled').catch(() => null);
    if (disabledAttr !== null) return true;
    const ariaDisabled = await icon.getAttribute('aria-disabled').catch(() => null);
    if (ariaDisabled === 'true') return true;
    const cls = await icon.getAttribute('class').catch(() => '');
    return /disabled|is-disabled|cursor-not-allowed|opacity-50/i.test(cls || '');
  }

  async lockPermissionTooltipForRow(row: Locator): Promise<string> {
    const icon = this.lockIconForRow(row);
    await icon.hover().catch(() => {});
    const title = await icon.getAttribute('title').catch(() => null);
    if (title) return title;
    const aria = await icon.getAttribute('aria-label').catch(() => null);
    if (aria) return aria;
    const permissionTooltip = this.page.getByText(/permission|required|not authorized|access denied/i).first();
    if (await permissionTooltip.isVisible({ timeout: 1500 }).catch(() => false)) {
      return (await permissionTooltip.textContent())?.trim() || '';
    }
    return '';
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

  async tryOpenLockModalForRow(row: Locator): Promise<boolean> {
    if (await this.isLockModalOpen(400)) return true;
    const actionCell = this.actionCellForRow(row);
    const candidates = [
      this.lockButtonForRow(row),
      actionCell.locator('[data-testid*="lock" i]').first(),
      actionCell.locator('button').filter({ hasText: /^lock$/i }).first(),
      actionCell.locator('img[alt*="lock" i], img[src*="lock" i], svg[aria-label*="lock" i], svg[title*="lock" i]').last(),
      actionCell.locator('img, svg, i').last(),
    ];

    for (const candidate of candidates) {
      if (!(await candidate.isVisible({ timeout: 1200 }).catch(() => false))) continue;
      await candidate.click({ force: true }).catch(() => {});
      if (await this.isLockModalOpen(2000)) return true;
      if (await this.isUnlockModalOpen(800)) {
        await this.unlockModalCancelButton().click().catch(() => {});
        await this.unlockModalLocator().waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
      }
      await this.page.keyboard.press('Escape').catch(() => {});
    }

    return false;
  }

  async tryOpenUnlockModalForRow(row: Locator): Promise<boolean> {
    if (await this.isUnlockModalOpen(400)) return true;
    const actionCell = this.actionCellForRow(row);
    const candidates = [
      this.unlockButtonForRow(row),
      actionCell.locator('[data-testid*="unlock" i]').first(),
      actionCell.locator('button').filter({ hasText: /^unlock$/i }).first(),
      actionCell.locator('img[alt*="unlock" i], img[src*="unlock" i], svg[aria-label*="unlock" i], svg[title*="unlock" i]').last(),
      actionCell.locator('img, svg, i').last(),
    ];

    for (const candidate of candidates) {
      if (!(await candidate.isVisible({ timeout: 1200 }).catch(() => false))) continue;
      await candidate.click({ force: true }).catch(() => {});
      if (await this.isUnlockModalOpen(1800)) return true;
      await this.page.keyboard.press('Escape').catch(() => {});
    }

    return false;
  }

  async openLockModalForRow(row: Locator): Promise<void> {
    const opened = await this.tryOpenLockModalForRow(row);
    if (!opened) {
      throw new Error('Lock modal did not open for selected row.');
    }
    await this.lockModalAnyLocator().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async lockRowWithReason(row: Locator, reason: string): Promise<void> {
    await this.openLockModalForRow(row);
    await this.page.locator(tid(sessionLockReasonInput)).first().fill(reason);
    await this.page.locator(tid(sessionLockSubmitButton)).first().click();
    await this.waitForPageLoad();
  }

  async isReasonValidationVisible(): Promise<boolean> {
    const modal = this.lockModalLocator();
    const reasonInput = modal.locator(tid(sessionLockReasonInput)).first();
    const errorText = modal.getByText(/required|mandatory/i).first();
    if (await errorText.isVisible({ timeout: 1000 }).catch(() => false)) return true;
    const ariaInvalid = await reasonInput.getAttribute('aria-invalid').catch(() => null);
    if (ariaInvalid === 'true') return true;
    const errorClass = await reasonInput.evaluate((el) => el.className).catch(() => '');
    return /error|invalid/i.test(errorClass || '');
  }

  async lockReasonTooltipForRow(row: Locator): Promise<string> {
    const actionCell = row.locator('td').last();
    const hoverTargets = [
      this.lockIconForCompletedRow(row),
      this.lockIconForRow(row),
      actionCell.locator('img, svg, i').last(),
      actionCell,
    ];

    for (const target of hoverTargets) {
      if (!(await target.isVisible({ timeout: 1200 }).catch(() => false))) continue;
      await target.hover().catch(() => {});

      const title = await target.getAttribute('title').catch(() => null);
      if (title) return title.trim();
      const aria = await target.getAttribute('aria-label').catch(() => null);
      if (aria) return aria.trim();

      const tooltipContainers = [
        this.page.locator('.n-tooltip').last(),
        this.page.locator('[role="tooltip"]').last(),
        this.page.getByText(/Session is locked\.?\s*Reason:/i).first(),
      ];

      for (const tip of tooltipContainers) {
        if (await tip.isVisible({ timeout: 1800 }).catch(() => false)) {
          const txt = (await tip.textContent())?.trim() || '';
          if (txt) return txt;
        }
      }
    }

    return '';
  }

  async openUnlockModalIfVisible(): Promise<boolean> {
    const button = this.unlockButtonLocator();
    if (!(await button.isVisible().catch(() => false))) return false;
    await button.click();
    return this.unlockModalLocator().isVisible({ timeout: 5000 }).catch(() => false);
  }

  async openUnlockModalForRow(row: Locator): Promise<void> {
    const opened = await this.tryOpenUnlockModalForRow(row);
    if (!opened) {
      throw new Error('Unlock modal did not open for selected row.');
    }
    await this.unlockModalLocator().or(this.unlockModalByRoleLocator()).first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async unlockRowWithReason(row: Locator, reason: string): Promise<void> {
    await this.openUnlockModalForRow(row);
    await this.page.locator(tid(sessionUnlockReasonInput)).first().fill(reason);
    await this.page.locator(tid(sessionUnlockSubmitButton)).first().click();
    await this.waitForPageLoad();
  }

  async isUnlockReasonValidationVisible(): Promise<boolean> {
    const modal = this.unlockModalLocator();
    const reasonInput = modal.locator(tid(sessionUnlockReasonInput)).first();
    const errorText = modal.getByText(/required|mandatory/i).first();
    if (await errorText.isVisible({ timeout: 1000 }).catch(() => false)) return true;
    const ariaInvalid = await reasonInput.getAttribute('aria-invalid').catch(() => null);
    if (ariaInvalid === 'true') return true;
    const errorClass = await reasonInput.evaluate((el) => el.className).catch(() => '');
    return /error|invalid/i.test(errorClass || '');
  }

  async isAnyLoaderVisible(): Promise<boolean> {
    const loaders = this.page.locator('.n-spin, .n-skeleton, .custom-loading-indicator');
    return loaders.first().isVisible({ timeout: 800 }).catch(() => false);
  }

  async waitForLoaderCycleOrSettled(): Promise<void> {
    const appeared = await this.isAnyLoaderVisible();
    if (appeared) {
      await this.waitForLoadingComplete();
      return;
    }
    await this.waitForPageLoad();
  }

  async getLatestErrorToastText(): Promise<string> {
    const toast = this.page.locator('.n-message--error-type').first();
    if (await toast.isVisible({ timeout: 2000 }).catch(() => false)) {
      return (await toast.textContent())?.trim() || '';
    }
    const deniedText = this.page.getByText(/access denied|not authorized|permission|forbidden|blocked/i).first();
    if (await deniedText.isVisible({ timeout: 1500 }).catch(() => false)) {
      return (await deniedText.textContent())?.trim() || '';
    }
    return '';
  }

  hasSafeAccessDeniedMessage(text: string): boolean {
    const value = (text || '').toLowerCase();
    if (!value) return false;
    const hasAccessDeniedSignal = /(access denied|not authorized|forbidden|permission)/i.test(value);
    const hasSensitiveLeak = /(stack|trace|sql|exception|internal server|sequelize|prisma|error: at )/i.test(value);
    return hasAccessDeniedSignal && !hasSensitiveLeak;
  }

  async isTimeoutOrRetryMessageVisible(): Promise<boolean> {
    const msg = this.page.getByText(/timeout|timed out|retry|try again|request took too long/i).first();
    return msg.isVisible({ timeout: 2500 }).catch(() => false);
  }

  async isLockIndicatorVisibleForRow(row: Locator): Promise<boolean> {
    return this.lockIconForRow(row).isVisible({ timeout: 1500 }).catch(() => false);
  }

  async isLockIndicatorHiddenForRow(row: Locator): Promise<boolean> {
    return this.lockIconForRow(row).isHidden({ timeout: 1500 }).catch(() => true);
  }

  async areLockedAndUnlockedRowsVisuallyDistinct(lockedRow: Locator, unlockedRow: Locator): Promise<boolean> {
    const lockedUnlockVisible = await this.unlockButtonForRow(lockedRow).isVisible({ timeout: 1200 }).catch(() => false);
    const unlockedLockVisible = await this.lockButtonForRow(unlockedRow).isVisible({ timeout: 1200 }).catch(() => false);
    const lockedEdit = await this.isEditAvailableForRow(lockedRow);
    const unlockedEdit = await this.isEditAvailableForRow(unlockedRow);
    return lockedUnlockVisible && unlockedLockVisible && !lockedEdit && unlockedEdit;
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
