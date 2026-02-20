import { BaseModule } from '../shared/base-module';

import type { ProjectData, ProjectSearchCriteria } from './index';

export class ProjectCrudModule extends BaseModule {
  async navigateBack() {
    await this.click(this.selectors.project['project-back-button']);
    await this.waitForPageLoad();
  }

  async navigateToHome() {
    await this.click(this.selectors.project['project-breadcrumb-home']);
    await this.waitForPageLoad();
  }

  async navigateToProject(rowIndex: number) {
    const tableSelector = this.selectors.project['project-table'];
    await this.ctx.clickTableCell(tableSelector, rowIndex, 1);
    await this.waitForPageLoad();
  }

  async createProject(data: ProjectData) {
    await this.click(this.selectors.project['project-create-button']);
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.project['project-create-modal']);
    await this.fill(this.selectors.project['project-create-name-input'], data.name);

    if (data.description) {
      await this.fill(
        this.selectors.project['project-create-description-input'],
        data.description
      );
    }

    if (data.assignees && data.assignees.length > 0) {
      if (data.assignees.includes('all')) {
        await this.click(this.selectors.project['project-create-select-all-assignees']);
      } else {
        for (const assignee of data.assignees) {
          await this.selectOption(this.selectors.project['project-create-assignees-select'], assignee);
        }
      }
    }

    await this.click(this.selectors.project['project-create-submit-button']);
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  async cancelProjectCreation() {
    await this.click(this.selectors.project['project-create-button']);
    await this.waitForModalOpen();
    await this.click(this.selectors.project['project-create-cancel-button']);
    await this.waitForModalClose();
  }

  async searchProject(criteria: ProjectSearchCriteria) {
    await this.click(this.selectors.project['project-search-button']);
    await this.waitForSelector(this.selectors.project['project-search-modal']);
    await this.fill(this.selectors.project['project-search-input'], criteria.searchTerm);
    await this.click(this.selectors.project['project-search-submit-button']);
    await this.waitForSelector(this.selectors.project['project-search-results-table']);
  }

  async deleteProject(_confirmName: string) {
    await this.waitForSelector(this.selectors.project['project-delete-modal']);
    await this.click(this.selectors.project['project-delete-confirm-button']);
    await this.waitForToast('success');
  }

  async cancelProjectDeletion() {
    await this.click(this.selectors.project['project-delete-cancel-button']);
    await this.waitForModalClose();
  }

  async removeUserFromProject() {
    await this.waitForSelector(this.selectors.project['project-user-removal-modal']);
    await this.click(this.selectors.project['project-user-removal-confirm-button']);
    await this.waitForToast('success');
  }

  async cancelUserRemoval() {
    await this.click(this.selectors.project['project-user-removal-cancel-button']);
    await this.waitForModalClose();
  }
}
