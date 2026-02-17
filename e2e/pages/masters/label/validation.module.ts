import { BaseModule } from '../../shared/base-module';

export class LabelValidationModule extends BaseModule {
  async getLabelCount(): Promise<number> {
    const tableSelector = this.selectors.label['label-table'].root;
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getLabelName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.label['label-table'].root;
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async labelExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async waitForLabelTable() {
    await this.waitForSelector(this.selectors.label['label-table'].root);
    await this.waitForLoadingComplete();
  }

  async isLabelCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.label['label-create'].modal);
  }
}
