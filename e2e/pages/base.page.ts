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
  async click(selector: string) {
    await this.page.click(selector);
  }

  async clickByText(text: string) {
    await this.page.getByText(text, { exact: true }).click();
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
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
    return await this.page.textContent(selector) || '';
  }

  async getValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async getAttribute(selector: string, name: string): Promise<string | null> {
    return await this.page.getAttribute(selector, name);
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isHidden(selector: string): Promise<boolean> {
    return await this.page.isHidden(selector);
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  async isDisabled(selector: string): Promise<boolean> {
    return await this.page.isDisabled(selector);
  }

  async isChecked(selector: string): Promise<boolean> {
    return await this.page.isChecked(selector);
  }

  async isTextVisible(text: string): Promise<boolean> {
    return await this.page.getByText(text, { exact: true }).isVisible();
  }

  async getCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // Locator helpers
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
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
    await this.page.waitForSelector(selector, options ?? {});
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
