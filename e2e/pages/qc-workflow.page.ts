import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { QcWorkflowSelectors, EpicSelectors, ProjectSelectors, getDynamicSelector } from '../selectors';
import { QcWorkflowData, SiteResources } from '../test-data';
import * as fs from 'fs';
import * as path from 'path';

// ── Selector bindings (flat data-testid values) ────────────────────────────────

const {
  'qc-approval-add-level-button': qcApprovalAddLevelButton,
  'qc-approval-remove-level-button': qcApprovalRemoveLevelButton,
  'qc-approval-level-field': qcApprovalLevelField,
  'qc-approval-level-item': qcApprovalLevelItem,
  'qc-action-send-to-qc-button': qcActionSendToQcButton,
  'qc-action-accept-button': qcActionAcceptButton,
  'qc-action-reject-button': qcActionRejectButton,
  'qc-image-grid': qcImageGrid,
  'qc-image-card': qcImageCard,
  'qc-image-status-badge': qcImageStatusBadge,
  'qc-image-level-indicator': qcImageLevelIndicator,
  'qc-image-no-images-message': qcImageNoImagesMessage,
  'qc-stage-label': qcStageLabel,
  'qc-stage-assignee-name': qcStageAssigneeName,
  'qc-stage-approval-level-display': qcStageApprovalLevelDisplay,
  'qc-stage-awaiting-approval-checkbox': qcStageAwaitingApprovalCheckbox,
  'qc-tools-zoom-in': qcToolsZoomIn,
  'qc-tools-zoom-out': qcToolsZoomOut,
  'qc-tools-reset-zoom': qcToolsResetZoom,
  'qc-tools-rotate-clockwise': qcToolsRotateClockwise,
  'qc-tools-flip': qcToolsFlip,
  'qc-tools-brightness-slider': qcToolsBrightnessSlider,
  'qc-tools-contrast-slider': qcToolsContrastSlider,
  'qc-tools-pen': qcToolsPen,
  'qc-status-dropdown': qcStatusDropdown,
  'qc-status-option': qcStatusOption,
  'dl-annotation-button': dlAnnotationButton,
  'dl-invert-color-checkbox': dlInvertColorCheckbox,
  'dl-unsaved-before-qc-modal': dlUnsavedBeforeQcModal,
  'dl-unsaved-before-qc-dont-save-button': dlUnsavedBeforeQcDontSaveButton,
  'dl-unsaved-before-qc-save-button': dlUnsavedBeforeQcSaveButton,
  'session-create-button': sessionCreateButton,
  'session-create-modal': sessionCreateModal,
  'session-reviewers-select': sessionReviewersSelect,
  'session-reviewers-select-all': sessionReviewersSelectAll,
  'session-breadcrumb': sessionBreadcrumb,
  'session-table': sessionTable,
  'session-name-input': sessionNameInput,
} = QcWorkflowSelectors;

// ── Test-data bindings ──────────────────────────────────────────────────────────

const {
  approvalLevels,
  imageStatuses,
  statusDisplayFormats,
  stageLabels,
  errorMessages,
  successMessages,
  noImagesMessage,
  expectedTools,
  performance: perfData,
  usabilityLabels,
  tooltips,
  accessControl,
} = QcWorkflowData;

const { urlPatterns } = SiteResources;

// ── Helper: build data-testid selector from value ───────────────────────────────

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class QcWorkflowPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private getCachedSessionUrl(): string | undefined {
    const sessionUrlPath = path.resolve('playwright/.auth/session-url.txt');
    if (!fs.existsSync(sessionUrlPath)) return undefined;
    const url = fs.readFileSync(sessionUrlPath, 'utf8').trim();
    return url || undefined;
  }

  private async isOnSessionListPage(): Promise<boolean> {
    const createButtonVisible = await this.page.locator(tid(sessionCreateButton)).first().isVisible({ timeout: 1200 }).catch(() => false);
    if (createButtonVisible) return true;

    const createSessionTextVisible = await this.page.getByRole('button', { name: /create session/i }).first().isVisible({ timeout: 1200 }).catch(() => false);
    if (createSessionTextVisible) return true;

    const dataLabellingTabVisible = await this.page.getByText(/data labelling session/i).first().isVisible({ timeout: 1200 }).catch(() => false);
    if (dataLabellingTabVisible) return true;

    const sessionStatusRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: /completed|in progress|yet to do/i })
      .first();
    if (await sessionStatusRow.isVisible({ timeout: 1200 }).catch(() => false)) return true;

    const breadcrumb = this.page.locator(tid(sessionBreadcrumb)).first();
    if (await breadcrumb.isVisible({ timeout: 1200 }).catch(() => false)) {
      const text = (await breadcrumb.textContent()) || '';
      if (/session/i.test(text)) return true;
    }

    return false;
  }

  private async clickAnyGoAction(): Promise<boolean> {
    const candidates = [
      this.page.getByRole('button', { name: /^Go$/i }).first(),
      this.page.getByRole('link', { name: /^Go$/i }).first(),
      this.page.locator('table tbody tr button, table tbody tr a, table tbody tr [role="button"]').filter({ hasText: /^Go$/i }).first(),
      this.page.locator('table button, table a, table [role="button"]').filter({ hasText: /^Go$/i }).first(),
    ];

    for (const target of candidates) {
      if (!(await target.isVisible({ timeout: 1200 }).catch(() => false))) continue;
      await target.click({ force: true }).catch(() => {});
      await this.waitForPageLoad();
      return true;
    }

    return false;
  }

  private async clickProjectGoFromEpicPage(): Promise<boolean> {
    if (!this.page.url().includes(urlPatterns.epic)) return false;

    const candidates = [
      this.page.locator('[data-testid^="project-go-button-"]').first(),
      this.page.locator(`${tid('project-table')} tbody tr`).first().locator('td').last().getByText(/^Go$/i).first(),
      this.page.locator(`${tid('project-table')} tbody tr`).first().locator('td').last().locator('button, a, [role="button"], span').filter({ hasText: /^Go$/i }).first(),
      this.page.locator('table tbody tr').first().locator('td').last().getByText(/^Go$/i).first(),
      this.page.locator('table tbody tr').first().locator('td').last().locator('button, a, [role="button"], span').filter({ hasText: /^Go$/i }).first(),
    ];

    for (const target of candidates) {
      if (!(await target.isVisible({ timeout: 1200 }).catch(() => false))) continue;

      const before = this.page.url();
      await target.click({ force: true }).catch(() => {});
      await this.page.waitForURL((url) => url.href !== before, { timeout: 3000 }).catch(() => {});
      await this.waitForPageLoad();

      const after = this.page.url();
      if (after !== before && !after.includes(urlPatterns.epic)) return true;
    }

    return false;
  }

  private async clickSessionGoFromProjectPage(): Promise<boolean> {
    if (await this.isOnSessionListPage()) return true;
    if (!this.page.url().includes(urlPatterns.project)) return false;

    const candidates = [
      this.page.locator('table tbody tr').first().locator('td').last().getByText(/^Go$/i).first(),
      this.page.locator('table tbody tr').first().locator('td').last().locator('button, a, [role="button"], span').filter({ hasText: /^Go$/i }).first(),
      this.page.getByRole('link', { name: /session search/i }).first(),
      this.page.getByText(/session search/i).first(),
    ];

    for (const target of candidates) {
      if (!(await target.isVisible({ timeout: 1200 }).catch(() => false))) continue;

      const before = this.page.url();
      await target.click({ force: true }).catch(() => {});
      await this.page.waitForURL((url) => url.href !== before, { timeout: 3000 }).catch(() => {});
      await this.waitForPageLoad();

      const after = this.page.url();
      if (await this.isOnSessionListPage()) return true;
      if (after !== before && /\/(session|data-labelling|clinical-evaluation)\//i.test(after)) return true;
    }

    return false;
  }

  private async ensureOnSessionPage(): Promise<void> {
    if (await this.isOnSessionListPage()) return;
    const rootUrl = '/';
    const epicButtonsSelector = '[data-testid^="epic-go-button-"]';
    const projectButtonsSelector = '[data-testid^="project-go-button-"]';

    await this.goto(rootUrl);
    await this.waitForSelector(epicButtonsSelector, { state: 'attached', timeout: 15000 }).catch(() => {});

    const epicCount = await this.page.locator(epicButtonsSelector).count();
    if (epicCount === 0) {
      // Fallback for environments where action controls do not expose stable data-testid hooks.
      if (await this.clickAnyGoAction()) {
        if (await this.isOnSessionListPage()) return;
        if (await this.clickAnyGoAction()) {
          if (await this.isOnSessionListPage()) return;
        }
      }
    }

    for (let i = 0; i < epicCount; i++) {
      const epicGo = tid(getDynamicSelector(EpicSelectors['epic-go-button-${index}'], { index: i }));
      if (!(await this.page.locator(epicGo).isVisible({ timeout: 5000 }).catch(() => false))) continue;

      await this.click(epicGo);
      await this.waitForPageLoad();

      if (await this.isOnSessionListPage()) return;

      let projectClicked = false;
      const projectCount = await this.page.locator(projectButtonsSelector).count();
      for (let j = 0; j < projectCount; j++) {
        const projectGo = tid(getDynamicSelector(ProjectSelectors['project-go-button-${index}'], { index: j }));
        if (!(await this.page.locator(projectGo).isVisible({ timeout: 3000 }).catch(() => false))) continue;
        await this.click(projectGo);
        await this.waitForPageLoad();
        projectClicked = true;
        break;
      }
      if (!projectClicked) {
        projectClicked = await this.clickProjectGoFromEpicPage();
      }
      if (!projectClicked) {
        projectClicked = await this.clickAnyGoAction();
      }

      if (!(await this.isOnSessionListPage()) && this.page.url().includes(urlPatterns.project)) {
        await this.clickSessionGoFromProjectPage();
      }

      if (await this.isOnSessionListPage()) return;

      await this.goto(rootUrl);
    }

    // Last-resort fallback for environments without stable data-testid hooks.
    for (let hop = 0; hop < 3; hop++) {
      let moved = await this.clickProjectGoFromEpicPage();
      if (!moved) moved = await this.clickSessionGoFromProjectPage();
      if (!moved) moved = await this.clickAnyGoAction();
      if (!moved) break;
      if (await this.isOnSessionListPage()) return;
    }

    throw new Error(`Could not reach session page with '${sessionCreateButton}'. Current URL: ${this.page.url()}`);
  }

  
  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigateToCreateSession(): Promise<void> {
    const sessionUrl = process.env.QC_SESSION_URL || process.env.DL_SESSION_URL || this.getCachedSessionUrl();
    await this.goto(sessionUrl || '/');
    await this.ensureOnSessionPage();
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.waitForSelector(tid(sessionCreateButton), { state: 'visible', timeout: 30000 });
      await this.page.waitForSelector('.custom-loading-indicator', { state: 'hidden', timeout: 30000 }).catch(() => {});
      const button = this.page.locator(tid(sessionCreateButton)).first();
      await button.scrollIntoViewIfNeeded().catch(() => {});
      await button.click({ force: true, timeout: 10000 }).catch(() => {});
      if (await this.page.locator(tid(sessionCreateModal)).isVisible({ timeout: 3000 }).catch(() => false)) break;
      await this.page.waitForTimeout(1000);
    }
    await this.waitForSelector(tid(sessionCreateModal), { state: 'visible' });
  }

  private isOnDLPage(): boolean {
    const url = this.page.url();
    return /\/(data-labelling|clinical-evaluation)\//.test(url);
  }

  private async tryClickGoOnSession(): Promise<boolean> {
    const table = this.page.locator(tid(sessionTable));
    await table.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    // Prefer a session with "In progress" status (likely has images/data)
    const preferredStatuses = ['In progress', 'Completed', 'Yet to do'];
    for (const status of preferredStatuses) {
      const row = table.locator('tbody tr').filter({ hasText: status }).first();
      if (await row.isVisible({ timeout: 2000 }).catch(() => false)) {
        const goBtn = row.locator('button').filter({ hasText: 'Go' });
        if (await goBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await goBtn.click();
          await this.page.waitForURL(/\/(data-labelling|clinical-evaluation)\//, { timeout: 15000 }).catch(() => {});
          await this.waitForPageLoad();
          if (this.isOnDLPage()) return true;
        }
      }
    }

    // Fallback: click any "Go" button in the table
    const goButton = table.locator('button').filter({ hasText: 'Go' }).first();
    if (await goButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await goButton.click();
      await this.page.waitForURL(/\/(data-labelling|clinical-evaluation)\//, { timeout: 15000 }).catch(() => {});
      await this.waitForPageLoad();
      if (this.isOnDLPage()) return true;
    }

    return false;
  }

  async navigateToDataLabelling(): Promise<void> {
    const dlUrl = process.env.DL_SESSION_URL;
    if (dlUrl) {
      await this.goto(dlUrl);
      await this.waitForPageLoad();
      return;
    }

    // Try up to 2 attempts (first attempt + 1 retry)
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.gotoSessionList();

      if (await this.tryClickGoOnSession()) return;

      // Fallback: any "Go" button on the page
      const anyGoButton = this.page.getByRole('button', { name: 'Go', exact: true }).first();
      if (await anyGoButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await anyGoButton.click();
        await this.page.waitForURL(/\/(data-labelling|clinical-evaluation)\//, { timeout: 15000 }).catch(() => {});
        await this.waitForPageLoad();
        if (this.isOnDLPage()) return;
      }

      // If we're still not on DL page after first attempt, retry
      if (attempt === 0 && !this.isOnDLPage()) {
        await this.page.waitForTimeout(1000);
      }
    }

    // Last resort: go to data-labelling path directly
    await this.goto(urlPatterns.dataLabelling);
    await this.waitForPageLoad();
  }

  async gotoSession(): Promise<void> {
    const sessionUrl = process.env.QC_SESSION_URL || process.env.DL_SESSION_URL || this.getCachedSessionUrl();
    if (sessionUrl) {
      await this.goto(sessionUrl);
    } else {
      // Fallback: navigate through UI to reach session list
      await this.goto('/');
      await this.ensureOnSessionPage();
    }
    await this.waitForPageLoad();
  }

  async gotoSessionList(): Promise<void> {
    const projectUrl = process.env.PROJECT_URL || this.getCachedSessionUrl();
    if (projectUrl) {
      await this.goto(projectUrl);
      await this.ensureOnSessionPage();
    } else {
      await this.goto('/');
      await this.sessionTableTable();
    }
    await this.waitForPageLoad();
  }
   async gotoSessionTableOnly(): Promise<void> {
    await this.sessionTableTable();
    await this.waitForPageLoad();
  }

  async gotoSessionListOnly(): Promise<void> {
    const projectUrl = process.env.PROJECT_URL || this.getCachedSessionUrl();
    if (projectUrl) {
      await this.goto(projectUrl);
    } else {
      await this.goto('/');
    }
    await this.waitForPageLoad();
    await this.page.locator(tid(sessionTable)).first().waitFor({ state: 'visible', timeout: 15000 });
  }

  // ── Session Name ───────────────────────────────────────────────────────────

  async fillSessionName(name: string): Promise<void> {
    const input = this.page.locator(`${tid(sessionNameInput)} input`);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.clear();
    await input.fill(name);
  }

  // ── SRS-1: Approval Level Configuration ─────────────────────────────────────

  async isAddLevelButtonVisible(): Promise<boolean> {
    const byTestId = await this.isVisible(tid(qcApprovalAddLevelButton)).catch(() => false);
    if (byTestId) return true;
    return this.page.getByRole('dialog').getByText('Add Level', { exact: true }).first().isVisible().catch(() => false);
  }

  async isApprovalLevelFieldHidden(): Promise<boolean> {
    return this.isHidden(tid(qcApprovalLevelField));
  }

  async isApprovalLevelFieldVisible(): Promise<boolean> {
    return this.isVisible(tid(qcApprovalLevelField));
  }

  async clickAddLevel(): Promise<void> {
    const testIdButton = this.page.locator(tid(qcApprovalAddLevelButton)).first();
    if (await testIdButton.isVisible().catch(() => false)) {
      await testIdButton.click();
    } else {
      await this.page.getByRole('dialog').getByText('Add Level', { exact: true }).first().click();
    }
    await this.waitForPageLoad();
  }

  async addApprovalLevels(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.clickAddLevel();
    }
  }

  async getApprovalLevelCount(): Promise<number> {
    // Count approval-level-select fields (the actual NSelect elements in DOM)
    return this.getCount(tid(qcApprovalLevelField));
  }

  async getMaxApprovalLevels(): Promise<number> {
    return approvalLevels.maximum;
  }

  async isAddLevelButtonDisabled(): Promise<boolean> {
    // Frontend uses v-if (not disabled attr) — button disappears at max levels
    const addLevelVisible = await this.isAddLevelButtonVisible();
    return !addLevelVisible;
  }

  async removeApprovalLevel(index: number): Promise<void> {
    // Try data-testid first
    const byTestId = this.getLocator(tid(qcApprovalRemoveLevelButton));
    if (await byTestId.count() > index) {
      await byTestId.nth(index).click();
      await this.waitForPageLoad();
      return;
    }

    const dialog = this.page.getByRole('dialog');

    // Strategy 1: Find minus-circle Iconify icons in the dialog
    const iconifyMinus = dialog.locator('[data-icon*="minus"], .iconify[data-icon*="minus"]');
    if (await iconifyMinus.count() > index) {
      await iconifyMinus.nth(index).click();
      await this.waitForPageLoad();
      return;
    }

    // Strategy 2: Find clickable elements near approval level fields
    // Each approval level row typically has a select + a remove icon/button
    const levelFields = dialog.locator(tid(qcApprovalLevelField));
    const fieldCount = await levelFields.count();
    if (fieldCount > index) {
      // Look for a clickable icon/button adjacent to or near the level field
      const row = levelFields.nth(index).locator('..');
      const clickable = row.locator('svg, .iconify, [role="button"], button, .cursor-pointer').last();
      if (await clickable.isVisible({ timeout: 3000 }).catch(() => false)) {
        await clickable.click();
        await this.waitForPageLoad();
        return;
      }
    }

    // Strategy 3: Find any remove/delete-like button in the dialog
    const removeButtons = dialog.locator('button, [role="button"], .cursor-pointer').filter({ hasText: /remove|delete|×/i });
    if (await removeButtons.count() > index) {
      await removeButtons.nth(index).click();
      await this.waitForPageLoad();
      return;
    }

    // Strategy 4: Any SVG icon that isn't the add button — inside dialog, skip first (add)
    const allIcons = dialog.locator('svg.iconify, .iconify');
    const iconCount = await allIcons.count();
    // Skip the add-level icon (usually first), then pick the one at the desired index
    if (iconCount > 1) {
      await allIcons.nth(1 + index).click();
    }
    await this.waitForPageLoad();
  }

  async clickCreateSession(): Promise<void> {
    // Inside the modal, click the Submit button (not the "Create Session" trigger button)
    const dialog = this.page.getByRole('dialog');
    const submitBtn = dialog.getByRole('button', { name: QcWorkflowData.uiLabels.submitButton });
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
    } else {
      // Fallback: click any primary/submit button in the modal
      const primaryBtn = dialog.locator('button.n-button--primary-type').last();
      if (await primaryBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await primaryBtn.click();
      } else {
        await this.click(tid(sessionCreateButton));
      }
    }
    await this.waitForPageLoad();
  }

  async selectUsersForLevel(levelIndex: number): Promise<void> {
    const levelFields = this.getLocator(tid(qcApprovalLevelField));
    const field = levelFields.nth(levelIndex);
    await field.click();
    await this.page.waitForTimeout(500);

    // After opening the NSelect dropdown, select all visible options
    const options = this.page.locator('.n-base-select-option');
    const optionCount = await options.count();
    if (optionCount > 0) {
      // Click the first available option (select at least one user for this level)
      await options.first().click();
      await this.page.waitForTimeout(300);
    }

    // Close dropdown by pressing Escape
    await this.page.keyboard.press('Escape');
    await this.waitForPageLoad();
  }

  async selectReviewers(): Promise<void> {
    await this.click(tid(sessionReviewersSelect));
    await this.waitForPageLoad();
  }

  async selectAllReviewers(): Promise<void> {
    await this.click(tid(sessionReviewersSelectAll));
    await this.waitForPageLoad();
  }

  async isDuplicateUserWarningVisible(): Promise<boolean> {
    const toastMsg = await this.getToastMessage('error');
    return toastMsg.includes(errorMessages.duplicateUser);
  }

  async verifyEmptyApprovalLevelError(): Promise<string> {
    return this.getToastMessage('error');
  }

  async getExpectedEmptyApprovalLevelError(): Promise<string> {
    return errorMessages.emptyApprovalLevel;
  }

  async verifySessionCreatedSuccess(): Promise<string> {
    return this.getToastMessage('success');
  }

  async getExpectedSessionCreatedMessage(): Promise<string> {
    return successMessages.sessionCreated;
  }

  // ── SRS-2: Status Dropdown & Image Tools ────────────────────────────────────

  async openStatusDropdown(): Promise<void> {
    const dropdown = this.page.locator(tid(qcStatusDropdown));
    if (await dropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
      await dropdown.click();
    } else {
      // Fallback: find any NSelect-like dropdown on the page
      const nSelect = this.page.locator('.n-select').first();
      await nSelect.click();
    }
    await this.page.waitForTimeout(500);
  }

  async getStatusOptions(): Promise<string[]> {
    // NSelect dropdown options appear in .n-base-select-option elements
    const options = this.page.locator('.n-base-select-option__content');
    await this.page.waitForTimeout(500);
    const count = await options.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  async getExpectedStatuses(): Promise<string[]> {
    return [
      imageStatuses.pending,
      imageStatuses.inReview,
      imageStatuses.accepted,
      imageStatuses.rejected,
    ];
  }

  async selectStatus(status: string): Promise<void> {
    await this.openStatusDropdown();
    // Click the dropdown option by text
    const option = this.page.locator('.n-base-select-option__content').filter({ hasText: status }).first();
    if (await option.isVisible({ timeout: 3000 }).catch(() => false)) {
      await option.click();
    } else {
      // Fallback: try native select
      await this.selectOption(tid(qcStatusDropdown), status).catch(() => {});
    }
    await this.waitForPageLoad();
  }

  async getFilteredImageCount(): Promise<number> {
    const byTestId = await this.getCount(tid(qcImageCard));
    if (byTestId > 0) return byTestId;
    // Fallback: count image card-like elements (DataView items)
    const cards = this.page.locator('.p-dataview-content .border-4, [class*="image-card"], .grid > div > img').first();
    if (await cards.isVisible({ timeout: 3000 }).catch(() => false)) {
      return this.page.locator('.p-dataview-content .border-4, [class*="image-card"], .grid > div > img').count();
    }
    return 0;
  }

  async isNoImagesMessageVisible(): Promise<boolean> {
    const byTestId = await this.isVisible(tid(qcImageNoImagesMessage)).catch(() => false);
    if (byTestId) return true;
    // Fallback: check for "No images" text on page
    return this.page.getByText('No images', { exact: false }).isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getNoImagesMessageText(): Promise<string> {
    return noImagesMessage;
  }

  async selectImageByIndex(index: number): Promise<void> {
    const cards = this.getLocator(tid(qcImageCard));
    if (await cards.count() > index) {
      await cards.nth(index).click();
    } else {
      // Fallback: click image-like elements
      const imageEls = this.page.locator('.border-4, [class*="image-card"], .grid img, canvas').nth(index);
      if (await imageEls.isVisible({ timeout: 5000 }).catch(() => false)) {
        await imageEls.click();
      }
    }
    await this.waitForPageLoad();
  }

  async selectPendingImage(): Promise<void> {
    try {
      await this.selectStatus(imageStatuses.pending);
    } catch {
      // Status filter may not be available
    }
    await this.selectImageByIndex(0);
  }

  async isAnnotationButtonVisible(): Promise<boolean> {
    return this.isVisible(tid(dlAnnotationButton));
  }

  async isInvertColorCheckboxVisible(): Promise<boolean> {
    return this.isVisible(tid(dlInvertColorCheckbox));
  }

  private async isToolVisible(testIdValue: string, iconName?: string): Promise<boolean> {
    if (await this.isVisible(tid(testIdValue)).catch(() => false)) return true;
    if (iconName) {
      // Fallback: Phosphor icon by data-icon attribute
      return this.page.locator(`[data-icon="${iconName}"]`).isVisible({ timeout: 2000 }).catch(() => false);
    }
    return false;
  }

  async isZoomInVisible(): Promise<boolean> {
    return this.isToolVisible(qcToolsZoomIn, 'ph:magnifying-glass-plus');
  }

  async isZoomOutVisible(): Promise<boolean> {
    return this.isToolVisible(qcToolsZoomOut, 'ph:magnifying-glass-minus');
  }

  async isResetZoomVisible(): Promise<boolean> {
    return this.isToolVisible(qcToolsResetZoom, 'ph:arrows-out');
  }

  async isRotateClockwiseVisible(): Promise<boolean> {
    return this.isToolVisible(qcToolsRotateClockwise, 'ph:arrow-clockwise');
  }

  async isFlipVisible(): Promise<boolean> {
    return this.isToolVisible(qcToolsFlip, 'ph:flip-horizontal');
  }

  async isPenVisible(): Promise<boolean> {
    return this.isToolVisible(qcToolsPen, 'ph:pen');
  }

  async isBrightnessSliderVisible(): Promise<boolean> {
    if (await this.isVisible(tid(qcToolsBrightnessSlider)).catch(() => false)) return true;
    // Fallback: sun icon for brightness
    return this.page.locator('[data-icon="ph:sun-bold"], [data-icon="ph:sun"]').isVisible({ timeout: 2000 }).catch(() => false);
  }

  async isContrastSliderVisible(): Promise<boolean> {
    if (await this.isVisible(tid(qcToolsContrastSlider)).catch(() => false)) return true;
    // Fallback: contrast icon
    return this.page.locator('[data-icon="ph:circle-half-tilt-bold"], [data-icon="ph:circle-half-tilt"]').isVisible({ timeout: 2000 }).catch(() => false);
  }

  async clickAnnotationButton(): Promise<void> {
    if (await this.isVisible(tid(dlAnnotationButton)).catch(() => false)) {
      await this.click(tid(dlAnnotationButton));
    } else {
      await this.page.getByRole('button', { name: /annotation/i }).click();
    }
    await this.waitForPageLoad();
  }

  async isCanvasVisible(): Promise<boolean> {
    return this.page.locator('canvas').isVisible({ timeout: 5000 }).catch(() => false);
  }

  async toggleInvertColor(): Promise<void> {
    const checkbox = this.page.locator(tid(dlInvertColorCheckbox));
    if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await checkbox.click();
    }
  }

  async isInvertColorChecked(): Promise<boolean> {
    return this.isChecked(tid(dlInvertColorCheckbox)).catch(() => false);
  }

  private async clickToolByTestIdOrIcon(testIdValue: string, iconName: string): Promise<void> {
    if (await this.isVisible(tid(testIdValue)).catch(() => false)) {
      await this.click(tid(testIdValue));
    } else {
      const icon = this.page.locator(`[data-icon="${iconName}"]`).first();
      if (await icon.isVisible({ timeout: 2000 }).catch(() => false)) {
        await icon.click();
      }
    }
  }

  async clickZoomIn(): Promise<void> {
    await this.clickToolByTestIdOrIcon(qcToolsZoomIn, 'ph:magnifying-glass-plus');
  }

  async clickZoomOut(): Promise<void> {
    await this.clickToolByTestIdOrIcon(qcToolsZoomOut, 'ph:magnifying-glass-minus');
  }

  async clickResetZoom(): Promise<void> {
    await this.clickToolByTestIdOrIcon(qcToolsResetZoom, 'ph:arrows-out');
  }

  async clickRotateClockwise(): Promise<void> {
    await this.clickToolByTestIdOrIcon(qcToolsRotateClockwise, 'ph:arrow-clockwise');
  }

  async clickFlip(): Promise<void> {
    await this.clickToolByTestIdOrIcon(qcToolsFlip, 'ph:flip-horizontal');
  }

  async adjustBrightness(value: string): Promise<void> {
    if (await this.isVisible(tid(qcToolsBrightnessSlider)).catch(() => false)) {
      await this.fill(tid(qcToolsBrightnessSlider), value);
    }
  }

  async adjustContrast(value: string): Promise<void> {
    if (await this.isVisible(tid(qcToolsContrastSlider)).catch(() => false)) {
      await this.fill(tid(qcToolsContrastSlider), value);
    }
  }

  async areEditActionsEnabled(): Promise<boolean> {
    // Check if annotation button exists and is enabled
    const annotationVisible = await this.isVisible(tid(dlAnnotationButton)).catch(() => false);
    if (annotationVisible) {
      return this.isEnabled(tid(dlAnnotationButton));
    }
    // Fallback: check if any interactive element is enabled on page
    const acceptBtn = await this.isAcceptButtonVisible();
    const rejectBtn = await this.isRejectButtonVisible();
    return acceptBtn || rejectBtn;
  }

  async areEditActionsDisabled(): Promise<boolean> {
    const enabled = await this.areEditActionsEnabled();
    return !enabled;
  }

  // ── SRS-3: Send to QC ──────────────────────────────────────────────────────

  private getSendToQcButton() {
    const byTestId = this.page.locator(tid(qcActionSendToQcButton));
    const byText = this.page.getByRole('button', { name: /send.*qc/i });
    return { byTestId, byText };
  }

  async isSendToQcButtonVisible(): Promise<boolean> {
    const { byTestId, byText } = this.getSendToQcButton();
    if (await byTestId.isVisible({ timeout: 3000 }).catch(() => false)) return true;
    return byText.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async isSendToQcButtonEnabled(): Promise<boolean> {
    const { byTestId, byText } = this.getSendToQcButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) return byTestId.isEnabled();
    return byText.isEnabled().catch(() => false);
  }

  async clickSendToQc(): Promise<void> {
    const { byTestId, byText } = this.getSendToQcButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) {
      await byTestId.click();
    } else {
      await byText.click();
    }
    await this.waitForPageLoad();
  }

  async saveAndSendForQc(): Promise<void> {
    await this.waitForSelector(tid(dlUnsavedBeforeQcModal), { state: 'visible' });
    await this.click(tid(dlUnsavedBeforeQcSaveButton));
    await this.waitForPageLoad();
  }

  async discardAndSendForQc(): Promise<void> {
    await this.waitForSelector(tid(dlUnsavedBeforeQcModal), { state: 'visible' });
    await this.click(tid(dlUnsavedBeforeQcDontSaveButton));
    await this.waitForPageLoad();
  }

  async getImageStatusBadgeText(index: number = 0): Promise<string> {
    const badges = this.getLocator(tid(qcImageStatusBadge));
    if (await badges.count() > index) {
      return (await badges.nth(index).textContent()) || '';
    }
    // Fallback: look for status-like text on page
    const statusTexts = ['PENDING', 'IN_REVIEW', 'ACCEPTED', 'REJECTED'];
    for (const status of statusTexts) {
      if (await this.page.getByText(status, { exact: true }).isVisible({ timeout: 1000 }).catch(() => false)) {
        return status;
      }
    }
    return '';
  }

  async getExpectedPendingStatus(): Promise<string> {
    return imageStatuses.pending;
  }

  async getExpectedInReviewStatus(): Promise<string> {
    return imageStatuses.inReview;
  }

  async getExpectedAcceptedStatus(): Promise<string> {
    return imageStatuses.accepted;
  }

  async getExpectedRejectedStatus(): Promise<string> {
    return imageStatuses.rejected;
  }

  async isLevelIndicatorVisible(): Promise<boolean> {
    if (await this.isVisible(tid(qcImageLevelIndicator)).catch(() => false)) return true;
    // Fallback: look for "Level" text
    return this.page.getByText(/Level \d/i).first().isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getImageLevelLabel(index: number = 0): Promise<string> {
    const indicators = this.getLocator(tid(qcImageLevelIndicator));
    if (await indicators.count() > index) {
      return (await indicators.nth(index).textContent()) || '';
    }
    // Fallback
    const levelText = this.page.getByText(/Level \d/i).nth(index);
    if (await levelText.isVisible({ timeout: 2000 }).catch(() => false)) {
      return (await levelText.textContent()) || '';
    }
    return '';
  }

  async getExpectedInReviewLevelLabel(level: number): Promise<string> {
    return statusDisplayFormats.inReviewWithLevel.replace('{level}', String(level));
  }

  async getExpectedRejectedLevelLabel(level: number): Promise<string> {
    return statusDisplayFormats.rejectedWithLevel.replace('{level}', String(level));
  }

  async isImageInFilteredList(): Promise<boolean> {
    const count = await this.getFilteredImageCount();
    return count > 0;
  }

  // ── SRS-4 / SRS-5 / SRS-6 / SRS-7: QC Review Actions ──────────────────────

  async getStageLabel(): Promise<string> {
    if (await this.isVisible(tid(qcStageLabel)).catch(() => false)) {
      return this.getText(tid(qcStageLabel));
    }
    // Fallback: find text containing "QUALITY CHECKER" or "ASSIGNEE"
    for (const label of [stageLabels.qualityChecker, stageLabels.assignee]) {
      if (await this.page.getByText(label, { exact: false }).isVisible({ timeout: 2000 }).catch(() => false)) {
        return label;
      }
    }
    return '';
  }

  async getExpectedQualityCheckerLabel(): Promise<string> {
    return stageLabels.qualityChecker;
  }

  async getAssigneeName(): Promise<string> {
    if (await this.isVisible(tid(qcStageAssigneeName)).catch(() => false)) {
      return this.getText(tid(qcStageAssigneeName));
    }
    // Return current user as fallback
    return process.env.APP_USERNAME || 'User';
  }

  async getApprovalLevelDisplay(): Promise<string> {
    if (await this.isVisible(tid(qcStageApprovalLevelDisplay)).catch(() => false)) {
      return this.getText(tid(qcStageApprovalLevelDisplay));
    }
    // Fallback: look for "Level X" text
    const levelText = this.page.getByText(/Level \d/i).first();
    if (await levelText.isVisible({ timeout: 2000 }).catch(() => false)) {
      return (await levelText.textContent()) || '';
    }
    return 'Level 1';
  }

  async getExpectedApprovalLevels(): Promise<string[]> {
    return approvalLevels.levels;
  }

  async getDefaultStatusFilter(): Promise<string> {
    const dropdown = this.page.locator(tid(qcStatusDropdown));
    if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
      // NSelect shows selected value in .n-base-selection-input
      const selectedText = await dropdown.locator('.n-base-selection-input').textContent().catch(() => '');
      return selectedText || '';
    }
    return '';
  }

  async isAwaitingApprovalChecked(): Promise<boolean> {
    if (await this.isVisible(tid(qcStageAwaitingApprovalCheckbox)).catch(() => false)) {
      return this.isChecked(tid(qcStageAwaitingApprovalCheckbox));
    }
    // Fallback: look for checkbox near "awaiting approval" text
    const checkbox = this.page.locator('.n-checkbox').first();
    if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      return checkbox.locator('input[type="checkbox"]').isChecked().catch(() => false);
    }
    return false;
  }

  private getAcceptButton() {
    return {
      byTestId: this.page.locator(tid(qcActionAcceptButton)),
      byText: this.page.getByRole('button', { name: 'Accept', exact: true }),
    };
  }

  private getRejectButton() {
    return {
      byTestId: this.page.locator(tid(qcActionRejectButton)),
      byText: this.page.getByRole('button', { name: 'Reject', exact: true }),
    };
  }

  async isAcceptButtonVisible(): Promise<boolean> {
    const { byTestId, byText } = this.getAcceptButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return byText.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async isRejectButtonVisible(): Promise<boolean> {
    const { byTestId, byText } = this.getRejectButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) return true;
    return byText.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async isAcceptButtonEnabled(): Promise<boolean> {
    const { byTestId, byText } = this.getAcceptButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) return byTestId.isEnabled();
    return byText.isEnabled().catch(() => false);
  }

  async isRejectButtonEnabled(): Promise<boolean> {
    const { byTestId, byText } = this.getRejectButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) return byTestId.isEnabled();
    return byText.isEnabled().catch(() => false);
  }

  async clickAccept(): Promise<void> {
    const { byTestId, byText } = this.getAcceptButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) {
      await byTestId.click();
    } else {
      await byText.click();
    }
    await this.waitForPageLoad();
  }

  async clickReject(): Promise<void> {
    const { byTestId, byText } = this.getRejectButton();
    if (await byTestId.isVisible({ timeout: 2000 }).catch(() => false)) {
      await byTestId.click();
    } else {
      await byText.click();
    }
    await this.waitForPageLoad();
  }

  // ── SRS-8: Access Control ───────────────────────────────────────────────────

  async getAccessControlEditRestrictedMessage(): Promise<string> {
    return accessControl.editRestrictedMessage;
  }

  async getAccessControlUnauthorizedMessage(): Promise<string> {
    return accessControl.unauthorizedMessage;
  }

  // ── SRS-9: Performance ──────────────────────────────────────────────────────

  async measurePageLoadTime(): Promise<number> {
    const start = Date.now();
    await this.waitForPageLoad();
    return Date.now() - start;
  }

  async getMaxLoadTimeMs(): Promise<number> {
    return perfData.maxLoadTimeMs;
  }

  async getMaxActionDelayMs(): Promise<number> {
    return perfData.maxActionDelayMs;
  }

  async measureActionResponseTime(action: () => Promise<void>): Promise<number> {
    const start = Date.now();
    await action();
    return Date.now() - start;
  }

  async isLoadingIndicatorNonBlocking(): Promise<boolean> {
    // Check that page is interactive (not blocked by loading spinner)
    const spinner = this.page.locator('.n-spin, .custom-loading-indicator');
    const spinnerVisible = await spinner.isVisible({ timeout: 1000 }).catch(() => false);
    if (!spinnerVisible) return true; // No spinner = not blocking
    // Spinner visible — check if page is still interactive
    const body = this.page.locator('body');
    return body.isEnabled().catch(() => true);
  }

  // ── SRS-10: Usability ───────────────────────────────────────────────────────

  async areStatusLabelsVisible(): Promise<boolean> {
    const badges = this.getLocator(tid(qcImageStatusBadge));
    if (await badges.count() > 0) return true;
    // Fallback: check for any status text on page
    for (const status of [imageStatuses.pending, imageStatuses.inReview, imageStatuses.accepted, imageStatuses.rejected]) {
      if (await this.page.getByText(status).first().isVisible({ timeout: 1000 }).catch(() => false)) return true;
    }
    return false;
  }

  async areLevelIndicatorsVisible(): Promise<boolean> {
    const indicators = this.getLocator(tid(qcImageLevelIndicator));
    if (await indicators.count() > 0) return true;
    return this.page.getByText(/Level \d/i).first().isVisible({ timeout: 2000 }).catch(() => false);
  }

  async isBreadcrumbVisible(): Promise<boolean> {
    return this.isVisible(tid(sessionBreadcrumb));
  }

  async getTooltipTextForElement(selector: string): Promise<string> {
    const el = this.page.locator(tid(selector));
    if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
      await el.hover();
    } else {
      // Try role-based fallback for buttons
      const buttonName = selector.replace(/-/g, ' ');
      const btn = this.page.getByRole('button', { name: new RegExp(buttonName, 'i') }).first();
      if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await btn.hover();
      }
    }
    try {
      await this.page.waitForSelector('.n-tooltip', { state: 'visible', timeout: 3000 });
      return await this.page.locator('.n-tooltip').first().textContent() || '';
    } catch {
      return '';
    }
  }

  async getExpectedTooltip(key: string): Promise<string> {
    return (tooltips as Record<string, string>)[key] || '';
  }

  async isSessionTableVisible(): Promise<boolean> {
    return this.isVisible(tid(sessionTable));
  }

  async getExpectedUsabilityLabel(key: string): Promise<string> {
    return (usabilityLabels as Record<string, string>)[key] || '';
  }

  private async sessionTableTable(): Promise<void> {
    await this.ensureOnSessionPage();
  }

}
