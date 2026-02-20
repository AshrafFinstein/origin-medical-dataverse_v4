import type { BasePage } from '../base.page';

export abstract class BaseModule {
  protected ctx: BasePage;

  constructor(ctx: BasePage) {
    this.ctx = ctx;
  }

  protected get page() {
    return this.ctx.page;
  }

  protected get selectors() {
    return this.ctx.selectors;
  }

  // Navigation helper (optional but useful)
  protected goto(url: string) {
    return this.ctx.goto(url);
  }

  protected click(selector: string) {
    return this.ctx.click(selector);
  }

  protected clickByTestId(testId: string) {
    return this.ctx.clickByTestId(testId);
  }

  protected fill(selector: string, value: string) {
    return this.ctx.fill(selector, value);
  }

  protected fillByTestId(testId: string, value: string) {
    return this.ctx.fillByTestId(testId, value);
  }

  protected selectOption(selector: string, value: string) {
    return this.ctx.selectOption(selector, value);
  }

  protected isVisible(selector: string) {
    return this.ctx.isVisible(selector);
  }

  protected isVisibleByTestId(testId: string) {
    return this.ctx.isVisibleByTestId(testId);
  }

  protected isHiddenByTestId(testId: string) {
    return this.ctx.isHiddenByTestId(testId);
  }

  protected getByTestId(testId: string) {
    return this.ctx.getByTestId(testId);
  }

  protected getValueByTestId(testId: string) {
    return this.ctx.getValueByTestId(testId);
  }

  protected waitForSelector(
    selector: string,
    options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }
  ) {
    return this.ctx.waitForSelector(selector, options);
  }

  protected waitForTestId(
    testId: string,
    options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }
  ) {
    return this.ctx.waitForTestId(testId, options);
  }

  protected waitForLoadingComplete() {
    return this.ctx.waitForLoadingComplete();
  }

  protected waitForPageLoad() {
    return this.ctx.waitForPageLoad();
  }

  protected waitForModalOpen(timeout?: number) {
    return this.ctx.waitForModalOpen(timeout);
  }

  protected waitForModalClose(timeout?: number) {
    return this.ctx.waitForModalClose(timeout);
  }

  protected waitForToast(type?: 'success' | 'error', timeout?: number) {
    return this.ctx.waitForToast(type, timeout);
  }
}
