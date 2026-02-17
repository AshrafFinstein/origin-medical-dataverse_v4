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

  protected fill(selector: string, value: string) {
    return this.ctx.fill(selector, value);
  }

  protected selectOption(selector: string, value: string) {
    return this.ctx.selectOption(selector, value);
  }

  protected isVisible(selector: string) {
    return this.ctx.isVisible(selector);
  }

  protected waitForSelector(
    selector: string,
    options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }
  ) {
    return this.ctx.waitForSelector(selector, options);
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
