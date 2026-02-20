import { BaseModule } from '../shared/base-module';

export class EpicValidationModule extends BaseModule {
  private async getCreateEpicModalLocator() {
    const testId = this.selectors.epic['epic-create'].modal;
    const byTestId = this.ctx.getLocator(testId);
    if (await byTestId.count() > 0) return byTestId;
    return this.page.getByRole('dialog', { name: 'Create Epic' });
  }

  private getCreateEpicNameInput() {
    return this.page.getByPlaceholder('Give the new epic a name');
  }

  private getCreateEpicDescriptionInput() {
    return this.page.getByPlaceholder('Provide a description');
  }

  private getCreateEpicCancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  private getCreateEpicSubmitButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  private getPaginationRoot() {
    const tableTestId = this.selectors.epic['epic-pagination'].root;
    return this.ctx.getLocator(tableTestId).locator('.n-pagination, .n-data-table__pagination');
  }

  private getPaginationNavItems() {
    return this.getPaginationRoot().locator('.n-pagination-item:has(img)');
  }

  private getPaginationPageNumberItems() {
    return this.getPaginationRoot().locator('.n-pagination-item:not(.n-pagination-item--prev):not(.n-pagination-item--next)');
  }

  private getPaginationActiveItem() {
    return this.getPaginationRoot().locator('.n-pagination-item--active');
  }

  private getPaginationSizePicker() {
    return this.getPaginationRoot().locator('.n-pagination-size-picker, [class*=\"size-picker\"]');
  }

  private getPaginationSizeOption() {
    return this.ctx.page.locator('.n-base-select-option');
  }
  async getEpicRowCount(): Promise<number> {
    const tableTestId = this.selectors.epic['epic-table'].root;
    return await this.ctx.getLocator(tableTestId).locator('tbody tr').count();
  }

  async getEpicCount(): Promise<number> {
    const tableTestId = this.selectors.epic['epic-table'].root;
    return await this.ctx.getLocator(tableTestId).locator('tbody tr').count();
  }

  async getEpicName(rowIndex: number): Promise<string> {
    const tableTestId = this.selectors.epic['epic-table'].root;
    const locator = this.ctx.getLocator(tableTestId).locator(`tbody tr:nth-child(${rowIndex}) td:nth-child(1)`);
    return (await locator.textContent()) || '';
  }

  async epicExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async waitForEpicTable() {
    await this.waitForSelector(this.selectors.epic['epic-table'].root);
    await this.waitForLoadingComplete();
  }

  async isEpicCreateModalOpen(): Promise<boolean> {
    const modal = await this.getCreateEpicModalLocator();
    return await modal.isVisible();
  }

  async isEpicCreateModalHidden(): Promise<boolean> {
    const modal = await this.getCreateEpicModalLocator();
    return await modal.isHidden();
  }

  async areCreateEpicFieldsVisible(): Promise<boolean> {
    const modalByTestId = this.ctx.getLocator(this.selectors.epic['epic-create'].modal);
    const nameByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['name-input']);
    const descriptionByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['description-input']);
    const cancelByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['cancel-button']);
    const submitByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['submit-button']);

    const modal = (await modalByTestId.count() > 0) ? modalByTestId : this.page.getByRole('dialog', { name: 'Create Epic' });
    const nameInput = (await nameByTestId.count() > 0) ? nameByTestId : this.getCreateEpicNameInput();
    const descriptionInput = (await descriptionByTestId.count() > 0) ? descriptionByTestId : this.getCreateEpicDescriptionInput();
    const cancelButton = (await cancelByTestId.count() > 0) ? cancelByTestId : this.getCreateEpicCancelButton();
    const submitButton = (await submitByTestId.count() > 0) ? submitByTestId : this.getCreateEpicSubmitButton();

    const visibleChecks = await Promise.all([
      modal.isVisible(),
      nameInput.isVisible(),
      descriptionInput.isVisible(),
      cancelButton.isVisible(),
      submitButton.isVisible(),
    ]);

    return visibleChecks.every(Boolean);
  }

  async isCreateEpicSubmitEnabled(): Promise<boolean> {
    const submitByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['submit-button']);
    if (await submitByTestId.count() > 0) {
      return await this.ctx.isEnabled(this.selectors.epic['epic-create']['submit-button']);
    }
    return await this.getCreateEpicSubmitButton().isEnabled();
  }

  async getCreateEpicNameValue(): Promise<string> {
    const nameByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['name-input']);
    if (await nameByTestId.count() > 0) {
      return await this.ctx.getValue(this.selectors.epic['epic-create']['name-input']);
    }
    return await this.getCreateEpicNameInput().inputValue();
  }

  async getCreateEpicDescriptionValue(): Promise<string> {
    const descriptionByTestId = this.ctx.getLocator(this.selectors.epic['epic-create']['description-input']);
    if (await descriptionByTestId.count() > 0) {
      return await this.ctx.getValue(this.selectors.epic['epic-create']['description-input']);
    }
    return await this.getCreateEpicDescriptionInput().inputValue();
  }

  async getEpicNameValidationMessage(): Promise<string> {
    const modalTestId = this.selectors.epic['epic-create-validation']['name-error'];
    const modalByTestId = this.ctx.getLocator(modalTestId);
    const modal = (await modalByTestId.count() > 0) ? modalByTestId : await this.getCreateEpicModalLocator();
    const locator = modal.locator('.text-red-500').first();
    if (await locator.count() === 0) return '';
    const text = await locator.textContent();
    return text?.trim() ?? '';
  }

  async getCreateEpicValidationMessages(): Promise<string[]> {
    const modalTestId = this.selectors.epic['epic-create-validation']['name-error'];
    const modalByTestId = this.ctx.getLocator(modalTestId);
    const modal = (await modalByTestId.count() > 0) ? modalByTestId : await this.getCreateEpicModalLocator();
    const locator = modal.locator('.text-red-500');
    if (await locator.count() === 0) return [];
    const texts = await locator.allTextContents();
    return texts.map(text => text.trim()).filter(Boolean);
  }

  async getEpicDescriptionValidationMessage(): Promise<string> {
    const modalTestId = this.selectors.epic['epic-create-validation']['name-error'];
    const modalByTestId = this.ctx.getLocator(modalTestId);
    const modal = (await modalByTestId.count() > 0) ? modalByTestId : await this.getCreateEpicModalLocator();
    const formItem = modal.locator('.n-form-item').filter({
      has: modal.locator('.n-form-item-label:has-text("Description")'),
    });
    const error = formItem.locator('.text-red-500').first();
    if (await error.count() === 0) return '';
    const text = await error.textContent();
    return text?.trim() ?? '';
  }

  async isEpicDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-delete'].modal);
  }

  async isEpicTableHeaderVisible(
    headerKey: 'name' | 'updated-at' | 'created-at' | 'description' | 'actions'
  ): Promise<boolean> {
    const tableTestId = this.selectors.epic['epic-table-header'][headerKey];
    const headerText = {
      name: 'Name',
      'updated-at': 'Updated at',
      'created-at': 'Created at',
      description: 'Description',
      actions: 'Actions',
    }[headerKey];
    return await this.ctx.getLocator(tableTestId).locator(`th:has-text("${headerText}")`).isVisible();
  }

  async isEpicActionsRowVisible(index: number): Promise<boolean> {
    const testId = this.ctx.getSelector(this.selectors.epic['epic-actions-row'].root, { index });
    const byTestId = this.ctx.getLocator(testId);
    if (await byTestId.count() > 0) {
      return await byTestId.isVisible();
    }
    const tableTestId = this.selectors.epic['epic-table'].root;
    const row = this.ctx.getLocator(tableTestId).locator(`tbody tr:nth-child(${index + 1})`);
    const actionCell = row.locator('td').last();
    return await actionCell.isVisible();
  }

  async clickEpicTableHeader(
    headerKey: 'name' | 'updated-at' | 'created-at'
  ) {
    const tableTestId = this.selectors.epic['epic-table-sort'][headerKey];
    const headerText = {
      name: 'Name',
      'updated-at': 'Updated at',
      'created-at': 'Created at',
    }[headerKey];
    await this.ctx.getLocator(tableTestId).locator(`th:has-text("${headerText}")`).click();
    await this.waitForLoadingComplete();
  }

  async getHeaderAriaSort(
    headerKey: 'name' | 'updated-at' | 'created-at' | 'description' | 'actions'
  ): Promise<string> {
    const tableTestId = headerKey === 'name' || headerKey === 'updated-at' || headerKey === 'created-at'
      ? this.selectors.epic['epic-table-sort'][headerKey]
      : this.selectors.epic['epic-table-header'][headerKey];
    const headerText = {
      name: 'Name',
      'updated-at': 'Updated at',
      'created-at': 'Created at',
      description: 'Description',
      actions: 'Actions',
    }[headerKey];
    const locator = this.ctx.getLocator(tableTestId).locator(`th:has-text("${headerText}")`);
    const aria = await locator.getAttribute('aria-sort');
    return aria || '';
  }

  async isPaginationVisible(): Promise<boolean> {
    return await this.getPaginationRoot().first().isVisible();
  }

  async isPaginationPrevVisible(): Promise<boolean> {
    const navItems = this.getPaginationNavItems();
    const locator = (await navItems.count() > 0)
      ? navItems.first()
      : this.getPaginationRoot().locator('.n-pagination-item:first-child').first();
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);
    await locator.waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
    return await locator.isVisible();
  }

  async isPaginationNextVisible(): Promise<boolean> {
    const navItems = this.getPaginationNavItems();
    const locator = (await navItems.count() > 0)
      ? navItems.last()
      : this.getPaginationRoot().locator('.n-pagination-item:last-child').first();
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);
    await locator.waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
    return await locator.isVisible();
  }

  async scrollToPagination(): Promise<void> {
    const locator = this.getPaginationRoot().first();
    await locator.scrollIntoViewIfNeeded().catch(() => undefined);
  }

  async isPaginationPrevDisabled(): Promise<boolean> {
    const navItems = this.getPaginationNavItems();
    const locator = (await navItems.count() > 0)
      ? navItems.first()
      : this.getPaginationRoot().locator('.n-pagination-item:first-child').first();
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
    const navItems = this.getPaginationNavItems();
    const locator = (await navItems.count() > 0)
      ? navItems.last()
      : this.getPaginationRoot().locator('.n-pagination-item:last-child').first();
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
    const text = await this.getPaginationActiveItem().first().textContent();
    return text?.trim() ?? '';
  }

  async isActivePageVisible(): Promise<boolean> {
    return await this.getPaginationActiveItem().first().isVisible();
  }

  async getPaginationPageItemCount(): Promise<number> {
    const locator = this.getPaginationPageNumberItems().filter({ hasText: /^[0-9]+$/ });
    return await locator.count();
  }

  async isPaginationPageItemVisible(index: number): Promise<boolean> {
    const locator = this.getPaginationPageNumberItems().filter({ hasText: /^[0-9]+$/ }).nth(index);
    return await locator.isVisible();
  }

  async clickPaginationPageItem(index: number) {
    await this.getPaginationPageNumberItems().filter({ hasText: /^[0-9]+$/ }).nth(index).click();
    await this.waitForLoadingComplete();
  }

  async selectPageSize(size: number) {
    await this.openPageSizePicker();
    const option = this.getPaginationSizeOption().filter({ hasText: String(size) }).first();
    await option.waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
    await option.click();
    await this.waitForLoadingComplete();
  }

  async openPageSizePicker() {
    const picker = this.getPaginationSizePicker().first();
    if (await picker.count() > 0) {
      await picker.click();
      return;
    }
    const root = this.getPaginationRoot().first();
    const textPicker = root.locator('text=/\\s*\\/\\s*page/i').first();
    await textPicker.click();
  }

  async isPageSizeOptionVisible(size: number): Promise<boolean> {
    return await this.getPaginationSizeOption().filter({ hasText: String(size) }).first().isVisible();
  }

  async closePageSizePicker() {
    await this.ctx.page.keyboard.press('Escape');
  }
}
