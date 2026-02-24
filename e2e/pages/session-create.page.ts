import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  SessionSelectors,
  EpicSelectors,
  ProjectSelectors,
  QcWorkflowSelectors,
  getDynamicSelector,
} from '../selectors';
import * as fs from 'fs';
import * as path from 'path';

// ── Selector bindings (flat data-testid values) ────────────────────────────────

const {
  'session-create-button': sessionCreateButton,
  'session-create-modal': sessionCreateModal,
  'session-name-input': sessionNameInput,
  'session-auto-generate-checkbox': sessionAutoGenerateCheckbox,
  'session-description-input': sessionDescriptionInput,
  'session-session-labels-select': sessionSessionLabelsSelect,
  'session-status-select': sessionStatusSelect,
  'session-project-code-select': projectCodeSelect,
  'session-sub-project-code-select': subProjectCodeSelect,
  'session-use-case-code-select': useCaseCodeSelect,
  'session-anatomy-plane-code-select': anatomyPlaneCodeSelect,
  'session-center-code-select': centerCodeSelect,
  'session-user-type-code-select': userTypeCodeSelect,
  'session-image-count-input': imageCountInput,
  'session-set-code-input': setCodeInput,
  'session-generate-name-button': generateNameButton,
  'session-assignees-select-all': assigneesSelectAll,
  'session-assignees-select': assigneesSelect,
  'session-reviewers-select-all': reviewersSelectAll,
  'session-reviewers-select': reviewersSelect,
  'session-approval-level-select': approvalLevelSelect,
  'session-labels-select': labelsSelect,
  'session-import-csv-button': importCsvButton,
  'session-s3-modal': s3Modal,
  'session-s3-key-input': s3KeyInput,
  'session-s3-upload-button': s3UploadButton,
  'session-table': sessionTable,
} = SessionSelectors;

const {
  'qc-approval-add-level-button': qcApprovalAddLevelButton,
  'qc-approval-remove-level-button': qcApprovalRemoveLevelButton,
  'qc-approval-level-field': qcApprovalLevelField,
} = QcWorkflowSelectors;

// ── Code field mapping ──────────────────────────────────────────────────────────

const CODE_FIELD_MAP: Record<string, string> = {
  project: projectCodeSelect,
  subProject: subProjectCodeSelect,
  useCase: useCaseCodeSelect,
  anatomyPlane: anatomyPlaneCodeSelect,
  center: centerCodeSelect,
  userType: userTypeCodeSelect,
};

// ── Helper: build data-testid selector from value ───────────────────────────────

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class SessionCreatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Cached session URL ────────────────────────────────────────────────────────

  private getCachedSessionUrl(): string | undefined {
    const sessionUrlPath = path.resolve('playwright/.auth/session-url.txt');
    if (!fs.existsSync(sessionUrlPath)) return undefined;
    const url = fs.readFileSync(sessionUrlPath, 'utf8').trim();
    return url || undefined;
  }

  // ── Navigation ────────────────────────────────────────────────────────────────

  /**
   * Navigate from root through Epic → Project until we land on the session list.
   * Reuses the same multi-strategy approach from qc-workflow.page.ts.
   */
  async navigateToSessionList(): Promise<void> {
    const sessionUrl =
      process.env.QC_SESSION_URL ||
      process.env.DL_SESSION_URL ||
      this.getCachedSessionUrl();

    if (sessionUrl) {
      await this.goto(sessionUrl);
      await this.waitForPageLoad();
      if (await this.isCreateButtonVisible()) return;
    }

    await this.goto('/');
    await this.ensureOnSessionPage();
  }

  private async ensureOnSessionPage(): Promise<void> {
    const createButtonSelector = tid(sessionCreateButton);

    if (
      await this.page
        .locator(createButtonSelector)
        .isVisible({ timeout: 2000 })
        .catch(() => false)
    ) {
      return;
    }

    const epicButtonsSelector = '[data-testid^="epic-go-button-"]';
    const projectButtonsSelector = '[data-testid^="project-go-button-"]';

    await this.waitForSelector(epicButtonsSelector, {
      state: 'attached',
      timeout: 15000,
    }).catch(() => {});

    const epicCount = await this.page.locator(epicButtonsSelector).count();

    if (epicCount === 0) {
      const goButtons = this.page.getByRole('button', {
        name: 'Go',
        exact: true,
      });
      const goCount = await goButtons.count();
      if (goCount > 0) {
        await goButtons.first().click();
        await this.waitForPageLoad();
        if (
          await this.page
            .locator(createButtonSelector)
            .isVisible({ timeout: 10000 })
            .catch(() => false)
        )
          return;

        const nestedGoButtons = this.page.getByRole('button', {
          name: 'Go',
          exact: true,
        });
        if (await nestedGoButtons.count()) {
          await nestedGoButtons.first().click();
          await this.waitForPageLoad();
          if (
            await this.page
              .locator(createButtonSelector)
              .isVisible({ timeout: 3000 })
              .catch(() => false)
          )
            return;
        }
      }
    }

    for (let i = 0; i < epicCount; i++) {
      const epicGo = tid(
        getDynamicSelector(EpicSelectors['epic-go-button-${index}'], {
          index: i,
        }),
      );
      if (
        !(await this.page
          .locator(epicGo)
          .isVisible({ timeout: 5000 })
          .catch(() => false))
      )
        continue;

      await this.click(epicGo);
      await this.waitForPageLoad();

      if (
        await this.page
          .locator(createButtonSelector)
          .isVisible({ timeout: 10000 })
          .catch(() => false)
      )
        return;

      const projectCount = await this.page
        .locator(projectButtonsSelector)
        .count();
      for (let j = 0; j < projectCount; j++) {
        const projectGo = tid(
          getDynamicSelector(
            ProjectSelectors['project-go-button-${index}'],
            { index: j },
          ),
        );
        if (
          !(await this.page
            .locator(projectGo)
            .isVisible({ timeout: 3000 })
            .catch(() => false))
        )
          continue;
        await this.click(projectGo);
        await this.waitForPageLoad();
        break;
      }

      if (
        await this.page
          .locator(createButtonSelector)
          .isVisible({ timeout: 10000 })
          .catch(() => false)
      )
        return;

      await this.goto('/');
    }

    // Last-resort fallback
    for (let hop = 0; hop < 3; hop++) {
      const goButtons = this.page.getByRole('button', {
        name: 'Go',
        exact: true,
      });
      if (!(await goButtons.count())) break;
      await goButtons.first().click();
      await this.waitForPageLoad();
      if (
        await this.page
          .locator(createButtonSelector)
          .isVisible({ timeout: 10000 })
          .catch(() => false)
      )
        return;
    }

    throw new Error(
      `Could not reach session page with '${sessionCreateButton}'. Current URL: ${this.page.url()}`,
    );
  }

  // ── Create Session Modal ──────────────────────────────────────────────────────

  async isCreateButtonVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionCreateButton))
      .isVisible({ timeout: 5000 })
      .catch(() => false);
  }

  async openCreateModal(): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.waitForSelector(tid(sessionCreateButton), {
        state: 'visible',
        timeout: 30000,
      });
      await this.page
        .waitForSelector('.custom-loading-indicator', {
          state: 'hidden',
          timeout: 30000,
        })
        .catch(() => {});

      const button = this.page.locator(tid(sessionCreateButton)).first();
      await button.scrollIntoViewIfNeeded().catch(() => {});
      await button.click({ force: true, timeout: 10000 }).catch(() => {});

      if (
        await this.page
          .locator(tid(sessionCreateModal))
          .isVisible({ timeout: 3000 })
          .catch(() => false)
      )
        break;
      await this.page.waitForTimeout(1000);
    }
    await this.waitForSelector(tid(sessionCreateModal), { state: 'visible' });
  }

  async isModalVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionCreateModal))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async closeCreateModal(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    const cancelBtn = dialog.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelBtn.click();
    }
    await this.page
      .locator(tid(sessionCreateModal))
      .waitFor({ state: 'hidden', timeout: 5000 })
      .catch(() => {});
  }

  async waitForModalClose(): Promise<void> {
    await this.page
      .locator(tid(sessionCreateModal))
      .waitFor({ state: 'hidden', timeout: 10000 })
      .catch(() => {});
  }

  // ── NSelect Helper (Naive UI dropdowns) ───────────────────────────────────────

  private isPageAlive(): boolean {
    return !this.page.isClosed();
  }

  private async safePressEscape(): Promise<void> {
    if (!this.isPageAlive()) return;
    await this.page.keyboard.press('Escape').catch(() => {});
  }

  private async waitForDropdownOptions(timeout = 6000): Promise<Locator | null> {
    if (!this.isPageAlive()) return null;
    const options = this.page.locator('.n-base-select-option:visible');
    const visible = await options
      .first()
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
    return visible ? options : null;
  }

  private async openNSelectWithRetry(testIdValue: string, attempts = 2): Promise<boolean> {
    const select = this.page.locator(tid(testIdValue)).first();
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (!this.isPageAlive()) return false;
      await select.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await select.scrollIntoViewIfNeeded().catch(() => {});
      await select.click({ force: true }).catch(() => {});
      const options = await this.waitForDropdownOptions(5000);
      if (options) return true;
      await this.safePressEscape();
      await this.page.waitForTimeout(200).catch(() => {});
    }
    return false;
  }

  private async hasCodeFieldSelection(
    field: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType',
  ): Promise<boolean> {
    const testId = CODE_FIELD_MAP[field];
    const select = this.page.locator(tid(testId)).first();
    const renderedText = ((await select
      .locator('.n-base-selection-label, .n-base-selection-input__content')
      .first()
      .textContent()
      .catch(() => '')) || '').trim();
    return renderedText.length > 0 && !/select/i.test(renderedText);
  }

  /**
   * Select an option from an NSelect dropdown by its data-testid value and option text.
   */
  async selectNSelectOption(
    testIdValue: string,
    optionText: string,
  ): Promise<void> {
    const opened = await this.openNSelectWithRetry(testIdValue);
    if (!opened || !this.isPageAlive()) return;

    const option = this.page
      .locator('.n-base-select-option__content')
      .filter({ hasText: optionText })
      .first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    await this.safePressEscape();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select the first available option from an NSelect dropdown.
   */
  async selectNSelectFirstOption(testIdValue: string): Promise<void> {
    const opened = await this.openNSelectWithRetry(testIdValue);
    if (!opened || !this.isPageAlive()) return;
    const option = this.page.locator('.n-base-select-option:visible').first();
    const optionVisible = await option.isVisible({ timeout: 2000 }).catch(() => false);

    if (optionVisible) {
      await option.click();
    }

    await this.safePressEscape();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select all visible options from an NSelect dropdown.
   */
  async selectAllNSelectOptions(testIdValue: string): Promise<void> {
    const opened = await this.openNSelectWithRetry(testIdValue);
    if (!opened || !this.isPageAlive()) return;

    const options = this.page.locator('.n-base-select-option:visible');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      if (!this.isPageAlive()) return;
      await options.nth(i).click();
      await this.page.waitForTimeout(200);
    }
    await this.safePressEscape();
    await this.page.waitForTimeout(300);
  }

  /**
   * Read selected tag values from an NSelect.
   */
  async getNSelectSelectedValues(testIdValue: string): Promise<string[]> {
    const select = this.page.locator(tid(testIdValue));
    const tags = select.locator('.n-tag__content, .n-base-selection-tag-wrapper');
    const count = await tags.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await tags.nth(i).textContent();
      if (text?.trim()) values.push(text.trim());
    }
    return values;
  }

  /**
   * Check whether an NSelect has any selected values.
   */
  async hasNSelectSelection(testIdValue: string): Promise<boolean> {
    const values = await this.getNSelectSelectedValues(testIdValue);
    return values.length > 0;
  }

  // ── Basic Form Fields ─────────────────────────────────────────────────────────

  async fillSessionName(name: string): Promise<void> {
    const input = this.page.locator(`${tid(sessionNameInput)} input`);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.clear();
    await input.fill(name);
  }

  async getSessionNameValue(): Promise<string> {
    const input = this.page.locator(`${tid(sessionNameInput)} input`);
    return (await input.inputValue()) || '';
  }

  async isSessionNameEmpty(): Promise<boolean> {
    const value = await this.getSessionNameValue();
    return value.trim() === '';
  }

  async toggleAutoGenerate(waitForCodes: boolean = false): Promise<void> {
    const checkbox = this.page.locator(tid(sessionAutoGenerateCheckbox));
    if (!this.isPageAlive()) return;

    if (waitForCodes) {
      const responsePromise = this.page
        .waitForResponse(
          (resp) => resp.url().includes('autoSessionCodesList') && resp.status() === 200,
          { timeout: 15000 },
        )
        .catch(() => null);

      await checkbox.click();
      await responsePromise;
    } else {
      await checkbox.click();
    }

    if (!this.isPageAlive()) return;
    await this.page.waitForTimeout(500);
  }

  async isAutoGenerateChecked(): Promise<boolean> {
    const checkbox = this.page.locator(tid(sessionAutoGenerateCheckbox));
    // NCheckbox stores checked state in .n-checkbox--checked class
    const isChecked = await checkbox
      .locator('.n-checkbox--checked, input[type="checkbox"]:checked')
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    if (isChecked) return true;
    // Fallback: check the checkbox class
    const classList = await checkbox.getAttribute('class');
    return classList?.includes('n-checkbox--checked') ?? false;
  }

  async fillDescription(text: string): Promise<void> {
    const textarea = this.page.locator(
      `${tid(sessionDescriptionInput)} textarea, ${tid(sessionDescriptionInput)} input`,
    );
    await textarea.first().waitFor({ state: 'visible', timeout: 5000 });
    await textarea.first().clear();
    await textarea.first().fill(text);
  }

  async getDescriptionValue(): Promise<string> {
    const textarea = this.page.locator(
      `${tid(sessionDescriptionInput)} textarea, ${tid(sessionDescriptionInput)} input`,
    );
    return (await textarea.first().inputValue()) || '';
  }

  async selectSessionLabels(labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.selectNSelectOption(sessionSessionLabelsSelect, label);
    }
  }

  async selectStatus(status: string): Promise<void> {
    await this.selectNSelectOption(sessionStatusSelect, status);
  }

  async getSelectedStatus(): Promise<string> {
    const select = this.page.locator(tid(sessionStatusSelect));
    const selectedText = await select
      .locator(
        '.n-base-selection-input__content, .n-base-selection-label__render-label',
      )
      .first()
      .textContent()
      .catch(() => '');
    return selectedText?.trim() || '';
  }

  // ── Code Fields ───────────────────────────────────────────────────────────────

  async selectCode(
    field: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType',
    value: string,
  ): Promise<void> {
    const testId = CODE_FIELD_MAP[field];
    if (!testId) throw new Error(`Unknown code field: ${field}`);
    await this.selectNSelectOption(testId, value);
  }

  async selectCodeFirstOption(
    field: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType',
  ): Promise<void> {
    const testId = CODE_FIELD_MAP[field];
    if (!testId) throw new Error(`Unknown code field: ${field}`);
    await this.selectNSelectFirstOption(testId);
  }

  async isCodeFieldVisible(
    field: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType',
  ): Promise<boolean> {
    const testId = CODE_FIELD_MAP[field];
    if (!testId) return false;
    return this.page
      .locator(tid(testId))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async selectCodeFirstOptionWithFallback(
    field: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType',
    fallbackValue?: string,
  ): Promise<boolean> {
    const testId = CODE_FIELD_MAP[field];
    if (!testId) throw new Error(`Unknown code field: ${field}`);

    const opened = await this.openNSelectWithRetry(testId);
    if (!this.isPageAlive()) return false;
    const options = this.page.locator('.n-base-select-option:visible');
    const optionCount = opened ? await options.count() : 0;

    if (optionCount > 0) {
      const index = Math.floor(Math.random() * optionCount);
      await options.nth(index).click().catch(async () => {
        await options.first().click().catch(() => {});
      });
    } else {
      const defaults: Record<string, string> = {
        project: 'PRJ', subProject: 'SUB', useCase: 'UC',
        anatomyPlane: 'AP', center: 'CTR', userType: 'UT',
      };
      const select = this.page.locator(tid(testId)).first();
      const input = select.locator('input').first();
      if (!(await input.isVisible({ timeout: 1000 }).catch(() => false))) {
        await this.safePressEscape();
        return false;
      }
      await input.fill(fallbackValue || defaults[field] || 'CODE').catch(() => {});
      await this.page.waitForTimeout(300);
      if (this.isPageAlive()) await this.page.keyboard.press('Enter').catch(() => {});
    }

    await this.safePressEscape();
    await this.page.waitForTimeout(300);
    return this.hasCodeFieldSelection(field);
  }

  async fillAllAutoGenerateFields(options?: {
    imageCount?: number;
    setCode?: string;
  }): Promise<void> {
    const codeFields: Array<'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType'> =
      ['project', 'subProject', 'useCase', 'anatomyPlane', 'center', 'userType'];

    for (const field of codeFields) {
      if (await this.isCodeFieldVisible(field)) {
        let selected = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          if (!this.isPageAlive()) return;
          selected = await this.selectCodeFirstOptionWithFallback(field);
          if (selected) break;
          await this.page.waitForTimeout(250).catch(() => {});
        }
      }
    }

    await this.fillImageCount(options?.imageCount ?? 10);
    await this.fillSetCode(options?.setCode ?? 'SET01');
  }

  async waitForGenerateButtonEnabled(timeout: number = 10000): Promise<boolean> {
    const button = this.page.locator(tid(generateNameButton));
    try {
      await button.waitFor({ state: 'visible', timeout: 5000 });
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
        if (this.page.isClosed()) return false;
        const enabled = !(await button.isDisabled());
        if (enabled) {
          await this.page.waitForTimeout(300);
          if (!(await button.isDisabled())) return true;
        }
        await this.page.waitForTimeout(500);
      }
      return false;
    } catch {
      return false;
    }
  }

  async fillImageCount(count: number): Promise<void> {
    const input = this.page.locator(
      `${tid(imageCountInput)} input`,
    );
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.clear();
    await input.fill(String(count));
  }

  async getImageCountValue(): Promise<string> {
    const input = this.page.locator(`${tid(imageCountInput)} input`);
    return (await input.inputValue()) || '';
  }

  async fillSetCode(code: string): Promise<void> {
    const input = this.page.locator(`${tid(setCodeInput)} input`);
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.clear();
    await input.fill(code);
  }

  async getSetCodeValue(): Promise<string> {
    const input = this.page.locator(`${tid(setCodeInput)} input`);
    return (await input.inputValue()) || '';
  }

  async clickGenerate(): Promise<void> {
    const button = this.page.locator(tid(generateNameButton));
    await button.waitFor({ state: 'visible', timeout: 5000 });
    const enabled = await this.waitForGenerateButtonEnabled(12000);
    if (!enabled) {
      throw new Error('Generate button is still disabled after filling auto-generate fields.');
    }
    await button.click();
    await this.page.waitForTimeout(1000);
  }

  // ── User Assignment ───────────────────────────────────────────────────────────

  async toggleAssigneesSelectAll(): Promise<void> {
    const checkbox = this.page.locator(tid(assigneesSelectAll));
    await checkbox.click();
    await this.page.waitForTimeout(500);
  }

  async selectAssignees(users: string[]): Promise<void> {
    for (const user of users) {
      await this.selectNSelectOption(assigneesSelect, user);
    }
  }

  async selectAssigneesFirstOption(): Promise<void> {
    await this.selectNSelectFirstOption(assigneesSelect);
  }

  async getSelectedAssignees(): Promise<string[]> {
    return this.getNSelectSelectedValues(assigneesSelect);
  }

  async toggleReviewersSelectAll(): Promise<void> {
    const checkbox = this.page.locator(tid(reviewersSelectAll));
    await checkbox.click();
    await this.page.waitForTimeout(500);
  }

  async selectReviewers(users: string[]): Promise<void> {
    for (const user of users) {
      await this.selectNSelectOption(reviewersSelect, user);
    }
  }

  async selectReviewersFirstOption(): Promise<void> {
    await this.selectNSelectFirstOption(reviewersSelect);
  }

  async getSelectedReviewers(): Promise<string[]> {
    return this.getNSelectSelectedValues(reviewersSelect);
  }

  // ── Approval Levels ───────────────────────────────────────────────────────────

  async addApprovalLevel(): Promise<void> {
    const testIdButton = this.page.locator(tid(qcApprovalAddLevelButton)).first();
    if (await testIdButton.isVisible().catch(() => false)) {
      await testIdButton.click();
    } else {
      await this.page
        .getByRole('dialog')
        .getByText('Add Level', { exact: true })
        .first()
        .click();
    }
    await this.page.waitForTimeout(500);
  }

  async addApprovalLevels(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addApprovalLevel();
    }
  }

  async getApprovalLevelCount(): Promise<number> {
    return this.getCount(tid(qcApprovalLevelField));
  }

  async isAddLevelButtonVisible(): Promise<boolean> {
    const byTestId = await this.isVisible(tid(qcApprovalAddLevelButton)).catch(
      () => false,
    );
    if (byTestId) return true;
    return this.page
      .getByRole('dialog')
      .getByText('Add Level', { exact: true })
      .first()
      .isVisible()
      .catch(() => false);
  }

  async isAddLevelButtonDisabledOrHidden(): Promise<boolean> {
    return !(await this.isAddLevelButtonVisible());
  }

  async removeApprovalLevel(index: number): Promise<void> {
    const byTestId = this.getLocator(tid(qcApprovalRemoveLevelButton));
    if ((await byTestId.count()) > index) {
      await byTestId.nth(index).click();
      await this.page.waitForTimeout(500);
      return;
    }

    const dialog = this.page.getByRole('dialog');
    const iconifyMinus = dialog.locator(
      '[data-icon*="minus"], .iconify[data-icon*="minus"]',
    );
    if ((await iconifyMinus.count()) > index) {
      await iconifyMinus.nth(index).click();
      await this.page.waitForTimeout(500);
      return;
    }

    const allIcons = dialog.locator('svg.iconify, .iconify');
    const iconCount = await allIcons.count();
    if (iconCount > 1) {
      await allIcons.nth(1 + index).click();
    }
    await this.page.waitForTimeout(500);
  }

  async selectUsersForApprovalLevel(levelIndex: number): Promise<void> {
    const levelFields = this.getLocator(tid(qcApprovalLevelField));
    const field = levelFields.nth(levelIndex);
    await field.click();
    await this.page.waitForTimeout(500);

    const options = this.page.locator('.n-base-select-option');
    const optionCount = await options.count();
    if (optionCount > 0) {
      await options.first().click();
      await this.page.waitForTimeout(300);
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  // ── Labels ────────────────────────────────────────────────────────────────────

  async selectLabels(labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.selectNSelectOption(labelsSelect, label);
    }
  }

  async selectLabelsFirstOption(): Promise<void> {
    await this.selectNSelectFirstOption(labelsSelect);
  }

  async getSelectedLabels(): Promise<string[]> {
    return this.getNSelectSelectedValues(labelsSelect);
  }

  // ── Taxonomy (no data-testid — role-based selectors) ──────────────────────────

  async addTaxonomyEntry(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    // Taxonomy section has ph:plus-circle icon
    const addIcon = dialog
      .locator('[data-icon="ph:plus-circle"], [data-icon*="plus-circle"]')
      .last();
    if (await addIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addIcon.click();
      await this.page.waitForTimeout(500);
    }
  }

  async isTaxonomySectionVisible(): Promise<boolean> {
    const dialog = this.page.getByRole('dialog');
    // Look for taxonomy-related text or icons
    return dialog
      .getByText('Taxonomy', { exact: false })
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  // ── File Upload (S3) ──────────────────────────────────────────────────────────

  async clickImportCsv(): Promise<void> {
    const byTestId = this.page.locator(tid(importCsvButton)).first();
    if (await byTestId.isVisible({ timeout: 3000 }).catch(() => false)) {
      await byTestId.click();
      await this.page.waitForTimeout(500);
      return;
    }

    const byText = this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Import CSV' })
      .first();
    if (await byText.isVisible({ timeout: 3000 }).catch(() => false)) {
      await byText.click();
      await this.page.waitForTimeout(500);
    }
  }

  async clickUploadFromS3(): Promise<void> {
    const byText = this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Upload from S3' })
      .first();
    if (await byText.isVisible({ timeout: 5000 }).catch(() => false)) {
      await byText.scrollIntoViewIfNeeded().catch(() => {});
      await byText.click({ force: true });
      await this.page.waitForTimeout(700);
    }
  }

  async openS3UploadModal(): Promise<boolean> {
    await this.clickImportCsv();
    if (await this.isS3ModalVisible()) return true;

    await this.clickUploadFromS3();
    return this.isS3ModalVisible();
  }

  async isS3ModalVisible(): Promise<boolean> {
    const modalByTestId = await this.page
      .locator(tid(s3Modal))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (modalByTestId) return true;

    // Fallback: only treat as S3 flow when actual S3 controls are visible.
    const s3KeyVisible = await this.page
      .locator(`${tid(s3KeyInput)} input, ${tid(s3KeyInput)} textarea`)
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (s3KeyVisible) return true;

    return this.page
      .locator(tid(s3UploadButton))
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async fillS3Key(key: string): Promise<void> {
    const byTestId = this.page.locator(`${tid(s3KeyInput)} input`).first();
    if (await byTestId.isVisible({ timeout: 3000 }).catch(() => false)) {
      await byTestId.clear();
      await byTestId.fill(key);
      return;
    }

    const dialog = this.page.getByRole('dialog');
    const fallback = dialog.locator(
      'input[placeholder*="s3" i], input[placeholder*="key" i]',
    ).first();
    await fallback.waitFor({ state: 'visible', timeout: 5000 });
    await fallback.clear();
    await fallback.fill(key);
  }

  async clickS3Upload(): Promise<void> {
    const byTestId = this.page.locator(tid(s3UploadButton)).first();
    if (await byTestId.isVisible({ timeout: 3000 }).catch(() => false)) {
      await byTestId.click();
      await this.page.waitForTimeout(1000);
      return;
    }

    const dialog = this.page.getByRole('dialog');
    const byText = dialog.getByRole('button', { name: 'Upload' }).first();
    if (await byText.isVisible({ timeout: 3000 }).catch(() => false)) {
      await byText.click();
    }
    await this.page.waitForTimeout(1000);
  }

  // ── Submit / Cancel ───────────────────────────────────────────────────────────

  async clickSubmit(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    const submitBtn = dialog.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
    } else {
      // Fallback: primary button in modal
      const primaryBtn = dialog
        .locator('button.n-button--primary-type')
        .last();
      if (await primaryBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await primaryBtn.click();
      }
    }
    await this.waitForPageLoad();
  }

  async clickCancel(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    const cancelBtn = dialog.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cancelBtn.click();
    }
    await this.page.waitForTimeout(500);
  }

  async isSubmitButtonVisible(): Promise<boolean> {
    const dialog = this.page.getByRole('dialog');
    return dialog
      .getByRole('button', { name: 'Submit' })
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isSubmitButtonDisabled(): Promise<boolean> {
    const dialog = this.page.getByRole('dialog');
    const submitBtn = dialog.getByRole('button', { name: 'Submit' });
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      return submitBtn.isDisabled();
    }
    // Fallback: primary button
    const primaryBtn = dialog.locator('button.n-button--primary-type').last();
    if (await primaryBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      return primaryBtn.isDisabled();
    }
    return true;
  }

  async isCancelButtonVisible(): Promise<boolean> {
    const dialog = this.page.getByRole('dialog');
    return dialog
      .getByRole('button', { name: 'Cancel' })
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  // ── Verification ──────────────────────────────────────────────────────────────

  async isSessionTableVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionTable))
      .isVisible({ timeout: 10000 })
      .catch(() => false);
  }

  async isSessionInTable(sessionName: string): Promise<boolean> {
    const table = this.page.locator(tid(sessionTable));
    await table.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    const row = table.locator('tbody tr').filter({ hasText: sessionName });
    return row.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async clickGoOnSession(sessionName: string): Promise<void> {
    const table = this.page.locator(tid(sessionTable));
    const row = table.locator('tbody tr').filter({ hasText: sessionName });
    const goBtn = row.locator('button').filter({ hasText: 'Go' });
    await goBtn.click();
    await this.waitForPageLoad();
  }

  async getSuccessToast(): Promise<string> {
    return this.getToastMessage('success');
  }

  async getErrorToast(): Promise<string> {
    return this.getToastMessage('error');
  }

  // ── Visibility checks for form fields ─────────────────────────────────────────

  async isNameInputVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionNameInput))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isDescriptionInputVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionDescriptionInput))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isStatusSelectVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionStatusSelect))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isAssigneesSelectVisible(): Promise<boolean> {
    return this.page
      .locator(tid(assigneesSelect))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isReviewersSelectVisible(): Promise<boolean> {
    return this.page
      .locator(tid(reviewersSelect))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isAutoGenerateCheckboxVisible(): Promise<boolean> {
    return this.page
      .locator(tid(sessionAutoGenerateCheckbox))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isLabelsSelectVisible(): Promise<boolean> {
    return this.page
      .locator(tid(labelsSelect))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isGenerateButtonVisible(): Promise<boolean> {
    return this.page
      .locator(tid(generateNameButton))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isImageCountInputVisible(): Promise<boolean> {
    return this.page
      .locator(tid(imageCountInput))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }

  async isSetCodeInputVisible(): Promise<boolean> {
    return this.page
      .locator(tid(setCodeInput))
      .isVisible({ timeout: 3000 })
      .catch(() => false);
  }
}
