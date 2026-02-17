import { Page } from '@playwright/test';
import { BasePage } from '../../base.page';
import { LabelCrudModule } from './crud.module';
import { LabelValidationModule } from './validation.module';

export interface LabelData {
  name: string;
  abbreviation: string;
}

export class LabelPage extends BasePage {
  readonly crud: LabelCrudModule;
  readonly validation: LabelValidationModule;

  constructor(page: Page) {
    super(page);
    this.crud = new LabelCrudModule(this);
    this.validation = new LabelValidationModule(this);
  }

  async goto() {
    await super.goto('/masters');
    await this.navigateToLabelTab();
  }

  // Backward-compat delegates — crud
  async navigateToLabelTab() { return this.crud.navigateToLabelTab(); }
  async createLabel(data: LabelData) { return this.crud.createLabel(data); }
  async cancelLabelCreation() { return this.crud.cancelLabelCreation(); }
  async exportLabels() { return this.crud.exportLabels(); }
  async searchLabel(searchTerm: string) { return this.crud.searchLabel(searchTerm); }

  // Backward-compat delegates — validation
  async getLabelCount() { return this.validation.getLabelCount(); }
  async getLabelName(rowIndex: number) { return this.validation.getLabelName(rowIndex); }
  async labelExists(name: string) { return this.validation.labelExists(name); }
  async waitForLabelTable() { return this.validation.waitForLabelTable(); }
  async isLabelCreateModalOpen() { return this.validation.isLabelCreateModalOpen(); }
}
