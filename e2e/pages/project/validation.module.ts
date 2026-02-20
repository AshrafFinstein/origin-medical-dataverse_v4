import { BaseModule } from '../shared/base-module';

export class ProjectValidationModule extends BaseModule {
  async getProjectCount(): Promise<number> {
    const tableSelector = this.selectors.project['project-table'];
    return await this.ctx.getTableRowCount(tableSelector);
  }

  async getProjectName(rowIndex: number): Promise<string> {
    const tableSelector = this.selectors.project['project-table'];
    return await this.ctx.getTableCellText(tableSelector, rowIndex, 1);
  }

  async projectExists(name: string): Promise<boolean> {
    return await this.ctx.isTextVisible(name);
  }

  async waitForProjectTable() {
    await this.waitForSelector(this.selectors.project['project-table']);
    await this.waitForLoadingComplete();
  }

  async isProjectCreateModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.project['project-create-modal']);
  }

  async isProjectDeleteModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.project['project-delete-modal']);
  }

  async isProjectSearchModalOpen(): Promise<boolean> {
    return await this.isVisible(this.selectors.project['project-search-modal']);
  }
}
