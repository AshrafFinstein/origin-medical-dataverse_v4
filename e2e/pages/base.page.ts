import { Page, Locator } from '@playwright/test';
import { Selectors, CommonSelectors, getDynamicSelector } from '../selectors';

/**
 * BasePage provides common page interaction methods
 * All page objects should extend this class
 */
export abstract class BasePage {
  public page: Page;
  public selectors = Selectors;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto(url: string) {
    await this.page.goto(url, { timeout: 60000 });
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  // Interactions
  private resolveSelector(selector: string): string {
    if (selector.includes('[data-testid')) return selector;
    if (/[\\s>+~,.#:\[\]]/.test(selector)) return selector;
    return `[data-testid="${selector}"]`;
  }

  async click(
    selector: string,
    options?: { timeout?: number; waitForEnabled?: boolean }
  ) {
    const resolved = this.resolveSelector(selector);
    const timeout = options?.timeout ?? 15000;
    const waitForEnabled = options?.waitForEnabled ?? true;
    const base = this.page.locator(resolved).first();
    const inputLike = base.locator('input, textarea, [contenteditable="true"]');
    const target = (await inputLike.count()) > 0 ? inputLike.first() : base;

    await target.waitFor({ state: 'visible', timeout });

    if (waitForEnabled) {
      const deadline = Date.now() + timeout;
      let enabled = await target.isEnabled().catch(() => false);
      while (!enabled && Date.now() < deadline) {
        await this.page.waitForTimeout(100);
        enabled = await target.isEnabled().catch(() => false);
      }
      // if (!enabled) {
      //   throw new Error(`Element remained disabled before click: ${resolved}`);
      // }
    }

    await target.click({ timeout });
  }

  async clickByText(text: string) {
    await this.page.getByText(text, { exact: true }).click();
  }

  async fill(selector: string, value: string) {
    const resolved = this.resolveSelector(selector);
    const base = this.page.locator(resolved);
    const inputLike = base.locator('input, textarea, [contenteditable="true"]');
    if (await inputLike.count() > 0) {
      await inputLike.first().fill(value);
      return;
    }
    await base.fill(value);
  }

  async clear(selector: string) {
    await this.page.fill(selector, '');
  }

  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  async selectMultipleOptions(selector: string, values: string[]) {
    await this.page.selectOption(selector, values);
  }

  async check(selector: string) {
    await this.page.check(selector);
  }

  async uncheck(selector: string) {
    await this.page.uncheck(selector);
  }

  async hover(selector: string) {
    await this.page.hover(selector);
  }

  async press(selector: string, key: string) {
    await this.page.press(selector, key);
  }

  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  async typeByKeyboard(text: string) {
    await this.page.keyboard.type(text);
  }

  // Getters
  async getText(selector: string): Promise<string> {
    const resolved = this.resolveSelector(selector);
    return await this.page.textContent(resolved) || '';
  }

  async getValue(selector: string): Promise<string> {
    const resolved = this.resolveSelector(selector);
    const base = this.page.locator(resolved);
    const inputLike = base.locator('input, textarea');
    if (await inputLike.count() > 0) {
      return await inputLike.first().inputValue();
    }
    return await base.inputValue();
  }

  async getAttribute(selector: string, name: string): Promise<string | null> {
    const resolved = this.resolveSelector(selector);
    return await this.page.getAttribute(resolved, name);
  }

  async isVisible(selector: string): Promise<boolean> {
    const resolved = this.resolveSelector(selector);
    return await this.page.isVisible(resolved);
  }

  async isHidden(selector: string): Promise<boolean> {
    const resolved = this.resolveSelector(selector);
    return await this.page.isHidden(resolved);
  }

  async isEnabled(selector: string): Promise<boolean> {
    const resolved = this.resolveSelector(selector);
    return await this.page.isEnabled(resolved);
  }

  async isDisabled(selector: string): Promise<boolean> {
    const resolved = this.resolveSelector(selector);
    return await this.page.isDisabled(resolved);
  }

  async isChecked(selector: string): Promise<boolean> {
    const resolved = this.resolveSelector(selector);
    return await this.page.isChecked(resolved);
  }

  async isTextVisible(text: string): Promise<boolean> {
    return await this.page.getByText(text, { exact: true }).isVisible();
  }

  async getCount(selector: string): Promise<number> {
    const resolved = this.resolveSelector(selector);
    return await this.page.locator(resolved).count();
  }

  // Locator helpers
  getLocator(selector: string): Locator {
    const resolved = this.resolveSelector(selector);
    return this.page.locator(resolved);
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  async clickByTestId(testId: string) {
    const base = this.page.getByTestId(testId);
    const inputLike = base.locator('input, textarea, [contenteditable="true"]');
    if (await inputLike.count() > 0) {
      await inputLike.first().click();
      return;
    }
    await base.click();
  }

  async fillByTestId(testId: string, value: string) {
    const base = this.page.getByTestId(testId);
    const inputLike = base.locator('input, textarea, [contenteditable="true"]');
    if (await inputLike.count() > 0) {
      await inputLike.first().fill(value);
      return;
    }
    await base.fill(value);
  }

  async getValueByTestId(testId: string): Promise<string> {
    const base = this.page.getByTestId(testId);
    const inputLike = base.locator('input, textarea');
    if (await inputLike.count() > 0) {
      return await inputLike.first().inputValue();
    }
    return await base.inputValue();
  }

  async isVisibleByTestId(testId: string): Promise<boolean> {
    return await this.page.getByTestId(testId).isVisible();
  }

  async isHiddenByTestId(testId: string): Promise<boolean> {
    return await this.page.getByTestId(testId).isHidden();
  }

  async waitForTestId(
    testId: string,
    options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }
  ) {
    await this.page.getByTestId(testId).waitFor(options ?? {});
  }

  getLocatorByText(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  // Dynamic selectors
  public getSelector(
    selector: string,
    replacements?: Record<string, string | number>
  ): string {
    return replacements ? getDynamicSelector(selector, replacements) : selector;
  }

  // Wait helpers
  async waitForSelector(selector: string, options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }) {
    const resolved = this.resolveSelector(selector);
    await this.page.waitForSelector(resolved, options ?? {});
  }

  async waitForText(text: string, options?: { timeout?: number }) {
    await this.page.waitForSelector(`text=${text}`, options);
  }

  async waitForNavigation(options?: { timeout?: number; url?: string | RegExp }) {
    await this.page.waitForURL(options?.url || /.*/, { timeout: options?.timeout });
  }

  async waitForToast(type: 'success' | 'error' = 'success', timeout: number = 5000) {
    const toastSelector = CommonSelectors[`ui-toast-${type}` as keyof typeof CommonSelectors];
    try {
      await this.waitForSelector(toastSelector, { timeout, state: 'visible' });
    } catch {
      // Toasts can be transient or intentionally absent in negative tests.
    }
  }

  async getToastMessage(type: 'success' | 'error', timeout: number = 5000): Promise<string> {
    await this.waitForToast(type, timeout);
    const toastSelector = CommonSelectors[`ui-toast-${type}` as keyof typeof CommonSelectors];
    const message = await this.page.locator(toastSelector).first().textContent();
    return message ?? '';
  }

  async waitForLoadingComplete() {
    // Wait for all loading indicators to disappear
    const loadingSelectors = [
      CommonSelectors['ui-loading-spin'],
      CommonSelectors['ui-loading-skeleton'],
      CommonSelectors['ui-loading-custom-indicator'],
    ];

    for (const selector of loadingSelectors) {
      try {
        // Wait for loading to appear (max 1 second)
        const isVisible = await this.page.locator(selector).isVisible().catch(() => false);

        if (isVisible) {
          // Wait for loading to disappear (max 30 seconds)
          await this.page.waitForSelector(selector, {
            state: 'hidden',
            timeout: 30000,
          });
        }
      } catch {
        // Loading spinner might not be present
      }
    }
  }

  async waitForModalOpen(timeout: number = 5000) {
    await this.waitForSelector(CommonSelectors['ui-modal-container'], { timeout, state: 'visible' });
  }

  async waitForModalClose(timeout: number = 5000) {
    await this.waitForSelector(CommonSelectors['ui-modal-container'], { timeout, state: 'hidden' });
  }

  // Screenshot helpers
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async takeElementScreenshot(selector: string, name: string) {
    await this.page.locator(selector).screenshot({ path: `screenshots/${name}.png` });
  }

  // Utility methods
  async reload() {
    await this.page.reload();
    await this.waitForPageLoad();
  }

  async goBack() {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward() {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  // Table helpers
  async getTableRowCount(tableSelector: string): Promise<number> {
    return await this.getCount(`${tableSelector} tbody tr`);
  }

  async getTableCellText(tableSelector: string, row: number, col: number): Promise<string> {
    return await this.getText(`${tableSelector} tbody tr:nth-child(${row}) td:nth-child(${col})`);
  }

  async clickTableCell(tableSelector: string, row: number, col: number) {
    await this.click(`${tableSelector} tbody tr:nth-child(${row}) td:nth-child(${col})`);
  }

  // Form helpers
  async fillForm(formData: Record<string, string>) {
    for (const [selector, value] of Object.entries(formData)) {
      await this.fill(selector, value);
    }
  }

  async submitForm(formSelector: string) {
    await this.page.locator(formSelector).evaluate((form) => (form as HTMLFormElement).submit());
  }
}
