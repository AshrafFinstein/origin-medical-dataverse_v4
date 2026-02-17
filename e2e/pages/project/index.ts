import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { ProjectCrudModule } from './crud.module';
import { ProjectValidationModule } from './validation.module';

export interface ProjectData {
  name: string;
  description?: string;
  assignees?: string[];
}

export interface ProjectSearchCriteria {
  searchTerm: string;
}

export class ProjectPage extends BasePage {
  readonly crud: ProjectCrudModule;
  readonly validation: ProjectValidationModule;

  constructor(page: Page) {
    super(page);
    this.crud = new ProjectCrudModule(this);
    this.validation = new ProjectValidationModule(this);
  }

  async goto(epicId?: string) {
    if (epicId) {
      await super.goto(`/epic/${epicId}`);
    } else {
      await super.goto('/');
    }
  }

  // Backward-compat delegates — crud
  async navigateBack() { return this.crud.navigateBack(); }
  async navigateToHome() { return this.crud.navigateToHome(); }
  async navigateToProject(rowIndex: number) { return this.crud.navigateToProject(rowIndex); }
  async createProject(data: ProjectData) { return this.crud.createProject(data); }
  async cancelProjectCreation() { return this.crud.cancelProjectCreation(); }
  async searchProject(criteria: ProjectSearchCriteria) { return this.crud.searchProject(criteria); }
  async deleteProject(confirmName: string) { return this.crud.deleteProject(confirmName); }
  async cancelProjectDeletion() { return this.crud.cancelProjectDeletion(); }
  async removeUserFromProject() { return this.crud.removeUserFromProject(); }
  async cancelUserRemoval() { return this.crud.cancelUserRemoval(); }

  // Backward-compat delegates — validation
  async getProjectCount() { return this.validation.getProjectCount(); }
  async getProjectName(rowIndex: number) { return this.validation.getProjectName(rowIndex); }
  async projectExists(name: string) { return this.validation.projectExists(name); }
  async waitForProjectTable() { return this.validation.waitForProjectTable(); }
  async isProjectCreateModalOpen() { return this.validation.isProjectCreateModalOpen(); }
  async isProjectDeleteModalOpen() { return this.validation.isProjectDeleteModalOpen(); }
  async isProjectSearchModalOpen() { return this.validation.isProjectSearchModalOpen(); }
}
