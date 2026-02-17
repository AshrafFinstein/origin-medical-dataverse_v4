import { Page } from '@playwright/test';
import { BasePage } from '../../base.page';
import { TaxonomyCrudModule } from './crud.module';
import { TaxonomyValidationModule } from './validation.module';

export interface TaxonomyData {
  name: string;
  annotations?: Array<{
    annotation: string;
    color?: string;
  }>;
}

export class TaxonomyPage extends BasePage {
  readonly crud: TaxonomyCrudModule;
  readonly validation: TaxonomyValidationModule;

  constructor(page: Page) {
    super(page);
    this.crud = new TaxonomyCrudModule(this);
    this.validation = new TaxonomyValidationModule(this);
  }

  async goto() {
    await super.goto('/masters');
    await this.navigateToTaxonomyTab();
  }

  // Backward-compat delegates — crud
  async navigateToTaxonomyTab() { return this.crud.navigateToTaxonomyTab(); }
  async createTaxonomy(data: TaxonomyData) { return this.crud.createTaxonomy(data); }
  async cancelTaxonomyCreation() { return this.crud.cancelTaxonomyCreation(); }
  async duplicateAnnotation(index: number) { return this.crud.duplicateAnnotation(index); }
  async deleteAnnotationFromTaxonomy(index: number) { return this.crud.deleteAnnotationFromTaxonomy(index); }
  async updateTaxonomy() { return this.crud.updateTaxonomy(); }
  async cancelTaxonomyUpdate() { return this.crud.cancelTaxonomyUpdate(); }
  async deleteTaxonomy() { return this.crud.deleteTaxonomy(); }
  async cancelTaxonomyDeletion() { return this.crud.cancelTaxonomyDeletion(); }

  // Backward-compat delegates — validation
  async getTaxonomyCount() { return this.validation.getTaxonomyCount(); }
  async getTaxonomyName(rowIndex: number) { return this.validation.getTaxonomyName(rowIndex); }
  async taxonomyExists(name: string) { return this.validation.taxonomyExists(name); }
  async getAnnotationCountInTaxonomy() { return this.validation.getAnnotationCountInTaxonomy(); }
  async waitForTaxonomyTable() { return this.validation.waitForTaxonomyTable(); }
  async isTaxonomyCreateModalOpen() { return this.validation.isTaxonomyCreateModalOpen(); }
  async isTaxonomyUpdateConfirmationModalOpen() { return this.validation.isTaxonomyUpdateConfirmationModalOpen(); }
  async isTaxonomyDeleteModalOpen() { return this.validation.isTaxonomyDeleteModalOpen(); }
}
