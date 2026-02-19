import { BaseModule } from '../shared/base-module';

export class EpicValidationModule extends BaseModule {
  async getEpicRowCount(): Promise<number> {
    const tableSelector = this.selectors.epic['epic-table'].root;
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getEpicCount(): Promise<number> {
    const tableSelector = this.selectors.epic['epic-table'].root;
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getEpicName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.epic['epic-table'].root;
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async epicExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async waitForEpicTable() {
    await this.waitForSelector(this.selectors.epic['epic-table'].root);
    await this.waitForLoadingComplete();
  }

  async isEpicCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-create'].modal);
  }

  async isEpicCreateModalHidden(): Promise<boolean> {
    return await this.ctx.isHidden(this.selectors.epic['epic-create'].modal);
  }

  async areCreateEpicFieldsVisible(): Promise<boolean> {
    const modal = this.selectors.epic['epic-create'].modal;
    const nameInput = this.selectors.epic['epic-create']['name-input'];
    const descriptionInput = this.selectors.epic['epic-create']['description-input'];
    const cancelButton = this.selectors.epic['epic-create']['cancel-button'];
    const submitButton = this.selectors.epic['epic-create']['submit-button'];

    const visibleChecks = await Promise.all([
      this.isVisible(modal),
      this.isVisible(nameInput),
      this.isVisible(descriptionInput),
      this.isVisible(cancelButton),
      this.isVisible(submitButton),
    ]);

    return visibleChecks.every(Boolean);
  }

  async isCreateEpicSubmitEnabled(): Promise<boolean> {
    return await this.ctx.isEnabled(this.selectors.epic['epic-create']['submit-button']);
  }

  async getCreateEpicNameValue(): Promise<string> {
    return await this.ctx.getValue(this.selectors.epic['epic-create']['name-input']);
  }

  async getCreateEpicDescriptionValue(): Promise<string> {
    return await this.ctx.getValue(this.selectors.epic['epic-create']['description-input']);
  }

  async getEpicNameValidationMessage(): Promise<string> {
    const selector = this.selectors.epic['epic-create-validation']['name-error'];
    return await this.ctx.getText(selector);
  }

  async getCreateEpicValidationMessages(): Promise<string[]> {
    const selector = this.selectors.epic['epic-create-validation']['name-error'];
    const locator = this.ctx.page.locator(selector);
    const texts = await locator.allTextContents();
    return texts.map(text => text.trim()).filter(Boolean);
  }

  async isEpicDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-delete'].modal);
  }

  async isEpicTableHeaderVisible(
    headerKey: 'name' | 'updated-at' | 'created-at' | 'description' | 'actions'
  ): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-table-header'][headerKey]);
  }

  async isEpicActionsRowVisible(index: number): Promise<boolean> {
    const selector = this.ctx.getSelector(this.selectors.epic['epic-actions-row'].root, { index });
    return await this.isVisible(selector);
  }

  async clickEpicTableHeader(
    headerKey: 'name' | 'updated-at' | 'created-at'
  ) {
    await this.ctx.click(this.selectors.epic['epic-table-sort'][headerKey]);
    await this.waitForLoadingComplete();
  }

  async getHeaderAriaSort(
    headerKey: 'name' | 'updated-at' | 'created-at' | 'description' | 'actions'
  ): Promise<string> {
    const selector = headerKey === 'name' || headerKey === 'updated-at' || headerKey === 'created-at'
      ? this.selectors.epic['epic-table-sort'][headerKey]
      : this.selectors.epic['epic-table-header'][headerKey];
    const aria = await this.ctx.getAttribute(selector, 'aria-sort');
    return aria || '';
  }

  async isPaginationVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-pagination'].root);
  }

  async isPaginationPrevVisible(): Promise<boolean> {
    const navItems = this.ctx.page.locator('.n-pagination .n-pagination-item:has(img)');
    const locator = (await navItems.count() > 0) ? navItems.first() : this.ctx.page.locator(this.selectors.epic['epic-pagination'].prev).first();
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);
    await locator.waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
    return await locator.isVisible();
  }

  async isPaginationNextVisible(): Promise<boolean> {
    const navItems = this.ctx.page.locator('.n-pagination .n-pagination-item:has(img)');
    const locator = (await navItems.count() > 0) ? navItems.last() : this.ctx.page.locator(this.selectors.epic['epic-pagination'].next).first();
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);
    await locator.waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
    return await locator.isVisible();
  }

  async scrollToPagination(): Promise<void> {
    const locator = this.ctx.page.locator(this.selectors.epic['epic-pagination'].root).first();
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);
  }

  async isPaginationPrevDisabled(): Promise<boolean> {
    const navItems = this.ctx.page.locator('.n-pagination .n-pagination-item:has(img)');
    const locator = (await navItems.count() > 0) ? navItems.first() : this.ctx.page.locator(this.selectors.epic['epic-pagination'].prev).first();
    if (await locator.count() === 0) return false;
    const attr = await locator.getAttribute('aria-disabled');
    if (attr === 'true') return true;
    const classAttr = (await locator.getAttribute('class')) || '';
    if (classAttr.includes('disabled') || classAttr.includes('inactive') || classAttr.includes('is-disabled')) {
      return true;
    }
    const dataDisabled = await locator.getAttribute('data-disabled');
    return dataDisabled === 'true';
  }

  async isPaginationNextDisabled(): Promise<boolean> {
    const navItems = this.ctx.page.locator('.n-pagination .n-pagination-item:has(img)');
    const locator = (await navItems.count() > 0) ? navItems.last() : this.ctx.page.locator(this.selectors.epic['epic-pagination'].next).first();
    if (await locator.count() === 0) return false;
    const attr = await locator.getAttribute('aria-disabled');
    if (attr === 'true') return true;
    const classAttr = (await locator.getAttribute('class')) || '';
    if (classAttr.includes('disabled') || classAttr.includes('inactive') || classAttr.includes('is-disabled')) {
      return true;
    }
    const dataDisabled = await locator.getAttribute('data-disabled');
    return dataDisabled === 'true';
  }

  async getActivePageNumber(): Promise<string> {
    const selector = this.selectors.epic['epic-pagination']['page-active'];
    return await this.ctx.getText(selector);
  }

  async isActivePageVisible(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-pagination']['page-active']);
  }

  async getPaginationPageItemCount(): Promise<number> {
    const selector = this.selectors.epic['epic-pagination']['page-number-items'];
    const locator = this.ctx.page.locator(selector).filter({ hasText: /^[0-9]+$/ });
    return await locator.count();
  }

  async isPaginationPageItemVisible(index: number): Promise<boolean> {
    const selector = this.selectors.epic['epic-pagination']['page-number-items'];
    const locator = this.ctx.page.locator(selector).filter({ hasText: /^[0-9]+$/ }).nth(index);
    return await locator.isVisible();
  }

  async clickPaginationPageItem(index: number) {
    const selector = this.selectors.epic['epic-pagination']['page-number-items'];
    await this.ctx.page.locator(selector).filter({ hasText: /^[0-9]+$/ }).nth(index).click();
    await this.waitForLoadingComplete();
  }

  async selectPageSize(size: number) {
    await this.openPageSizePicker();
    const optionSelector = this.selectors.epic['epic-pagination']['size-option'];
    await this.ctx.page.locator(optionSelector, { hasText: String(size) }).first().click();
    await this.waitForLoadingComplete();
  }

  async openPageSizePicker() {
    const labelSelector = this.selectors.epic['epic-pagination']['size-label'];
    await this.ctx.page.locator(labelSelector).first().click();
  }

  async isPageSizeOptionVisible(size: number): Promise<boolean> {
    const optionSelector = this.selectors.epic['epic-pagination']['size-option'];
    return await this.ctx.page.locator(optionSelector, { hasText: String(size) }).first().isVisible();
  }

  async closePageSizePicker() {
    await this.ctx.page.keyboard.press('Escape');
  }
}
