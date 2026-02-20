import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { EpicCrudModule } from './crud.module';
import { EpicValidationModule } from './validation.module';

export interface EpicData {
  name: string;
  description?: string;
}

export interface EpicSearchCriteria {
  searchTerm: string;
}

export class EpicPage extends BasePage {
  readonly crud: EpicCrudModule;
  readonly validation: EpicValidationModule;

  constructor(page: Page) {
    super(page);
    this.crud = new EpicCrudModule(this);
    this.validation = new EpicValidationModule(this);
  }

  async goto() {
    await super.goto(' ');
  }

  // Backward-compat delegates — crud
  async openCreateEpicModal() { return this.crud.openCreateEpicModal(); }
  async closeCreateEpicModalWithCloseIcon() { return this.crud.closeCreateEpicModalWithCloseIcon(); }
  async closeCreateEpicModalWithCancelButton() { return this.crud.closeCreateEpicModalWithCancelButton(); }
  async submitCreateEpic() { return this.crud.submitCreateEpic(); }
  async fillEpicName(name: string) { return this.crud.fillEpicName(name); }
  async fillEpicDescription(description: string) { return this.crud.fillEpicDescription(description); }
  async focusEpicDescription() { return this.crud.focusEpicDescription(); }
  async focusEpicName() { return this.crud.focusEpicName(); }
  async createEpic(data: EpicData) { return this.crud.createEpic(data); }
  async cancelEpicCreation() { return this.crud.cancelEpicCreation(); }
  async searchEpic(criteria: EpicSearchCriteria) { return this.crud.searchEpic(criteria); }
  async navigateToEpic(rowIndex: number) { return this.crud.navigateToEpic(rowIndex); }
  async navigateToEpicByName(name: string) { return this.crud.navigateToEpicByName(name); }
  async deleteEpic() { return this.crud.deleteEpic(); }
  async cancelEpicDeletion() { return this.crud.cancelEpicDeletion(); }
  async viewDeleteSessionRequests() { return this.crud.viewDeleteSessionRequests(); }
  async rejectDeleteRequest(sessionName: string, reason: string) { return this.crud.rejectDeleteRequest(sessionName, reason); }
  async cancelRejectDeleteRequest() { return this.crud.cancelRejectDeleteRequest(); }

  // Backward-compat delegates — validation
  async getEpicRowCount() { return this.validation.getEpicRowCount(); }
  async getEpicCount() { return this.validation.getEpicCount(); }
  async getEpicName(rowIndex: number) { return this.validation.getEpicName(rowIndex); }
  async epicExists(name: string) { return this.validation.epicExists(name); }
  async waitForEpicTable() { return this.validation.waitForEpicTable(); }
  async isEpicCreateModalOpen() { return this.validation.isEpicCreateModalOpen(); }
  async isEpicCreateModalHidden() { return this.validation.isEpicCreateModalHidden(); }
  async areCreateEpicFieldsVisible() { return this.validation.areCreateEpicFieldsVisible(); }
  async isCreateEpicSubmitEnabled() { return this.validation.isCreateEpicSubmitEnabled(); }
  async getCreateEpicNameValue() { return this.validation.getCreateEpicNameValue(); }
  async getCreateEpicDescriptionValue() { return this.validation.getCreateEpicDescriptionValue(); }
  async getEpicNameValidationMessage() { return this.validation.getEpicNameValidationMessage(); }
  async getCreateEpicValidationMessages() { return this.validation.getCreateEpicValidationMessages(); }
  async getEpicDescriptionValidationMessage() { return this.validation.getEpicDescriptionValidationMessage(); }
  async isEpicDeleteModalOpen() { return this.validation.isEpicDeleteModalOpen(); }
  async isEpicTableHeaderVisible(headerKey: 'name' | 'updated-at' | 'created-at' | 'description' | 'actions') { return this.validation.isEpicTableHeaderVisible(headerKey); }
  async isEpicActionsRowVisible(index: number) { return this.validation.isEpicActionsRowVisible(index); }
  async clickEpicTableHeader(headerKey: 'name' | 'updated-at' | 'created-at') { return this.validation.clickEpicTableHeader(headerKey); }
  async getHeaderAriaSort(headerKey: 'name' | 'updated-at' | 'created-at' | 'description' | 'actions') { return this.validation.getHeaderAriaSort(headerKey); }
  async isPaginationVisible() { return this.validation.isPaginationVisible(); }
  async isPaginationPrevVisible() { return this.validation.isPaginationPrevVisible(); }
  async isPaginationNextVisible() { return this.validation.isPaginationNextVisible(); }
  async scrollToPagination() { return this.validation.scrollToPagination(); }
  async isPaginationPrevDisabled() { return this.validation.isPaginationPrevDisabled(); }
  async isPaginationNextDisabled() { return this.validation.isPaginationNextDisabled(); }
  async getActivePageNumber() { return this.validation.getActivePageNumber(); }
  async isActivePageVisible() { return this.validation.isActivePageVisible(); }
  async getPaginationPageItemCount() { return this.validation.getPaginationPageItemCount(); }
  async isPaginationPageItemVisible(index: number) { return this.validation.isPaginationPageItemVisible(index); }
  async clickPaginationPageItem(index: number) { return this.validation.clickPaginationPageItem(index); }
  async selectPageSize(size: number) { return this.validation.selectPageSize(size); }
  async openPageSizePicker() { return this.validation.openPageSizePicker(); }
  async isPageSizeOptionVisible(size: number) { return this.validation.isPageSizeOptionVisible(size); }
  async closePageSizePicker() { return this.validation.closePageSizePicker(); }
}
