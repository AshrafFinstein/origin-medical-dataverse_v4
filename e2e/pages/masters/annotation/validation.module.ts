import { BaseModule } from '../../shared/base-module';

export class AnnotationValidationModule extends BaseModule {
  async getAnnotationCount(): Promise<number> {
    const tableSelector = this.selectors.annotation['annotation-table'];
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getAnnotationName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.annotation['annotation-table'];
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async annotationExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async waitForAnnotationTable() {
    await this.waitForSelector(this.selectors.annotation['annotation-table']);
    await this.waitForLoadingComplete();
  }

  async isAnnotationCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.annotation['annotation-create-modal']);
  }
}
