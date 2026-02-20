import { BaseModule } from '../shared/base-module';

export class EpicValidationModule extends BaseModule {
  async getEpicCount(): Promise<number> {
    const tableSelector = this.selectors.epic['epic-table'];
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getEpicName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.epic['epic-table'];
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async epicExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async waitForEpicTable() {
    await this.waitForSelector(this.selectors.epic['epic-table']);
    await this.waitForLoadingComplete();
  }

  async isEpicCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-create-modal']);
  }

  async isEpicDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.epic['epic-delete-modal']);
  }
}
