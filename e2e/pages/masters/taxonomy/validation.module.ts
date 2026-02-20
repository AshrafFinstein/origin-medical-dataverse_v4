import { BaseModule } from '../../shared/base-module';

export class TaxonomyValidationModule extends BaseModule {
  async getTaxonomyCount(): Promise<number> {
    const tableSelector = this.selectors.taxonomy['taxonomy-table'];
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getTaxonomyName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.taxonomy['taxonomy-table'];
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async taxonomyExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async getAnnotationCountInTaxonomy(): Promise<number> {
    return await this.ctx.getCount(this.selectors.taxonomy['taxonomy-annotation-rows']);
  }

  async waitForTaxonomyTable() {
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-table']);
    await this.waitForLoadingComplete();
  }

  async isTaxonomyCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.taxonomy['taxonomy-create-modal']);
  }

  async isTaxonomyUpdateConfirmationModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.taxonomy['taxonomy-update-confirmation-modal']);
  }

  async isTaxonomyDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.taxonomy['taxonomy-delete-modal']);
  }
}
