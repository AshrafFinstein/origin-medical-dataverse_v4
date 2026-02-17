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
  async getEpicCount() { return this.validation.getEpicCount(); }
  async getEpicName(rowIndex: number) { return this.validation.getEpicName(rowIndex); }
  async epicExists(name: string) { return this.validation.epicExists(name); }
  async waitForEpicTable() { return this.validation.waitForEpicTable(); }
  async isEpicCreateModalOpen() { return this.validation.isEpicCreateModalOpen(); }
  async isEpicDeleteModalOpen() { return this.validation.isEpicDeleteModalOpen(); }
}
