import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { SessionNavigationModule } from './navigation.module';
import { SessionCrudModule } from './crud.module';
import { SessionSearchModule } from './search.module';
import { SessionValidationModule } from './validation.module';

export interface SessionData {
  name: string;
  description?: string;
  autoGenerate?: boolean;
  status?: string;
  labels?: string[];
  assignees?: string[];
  reviewers?: string[];
  approvalLevel?: string;
  sessionCodes?: {
    projectCode?: string;
    subProjectCode?: string;
    useCaseCode?: string;
    anatomyPlaneCode?: string;
    centerCode?: string;
    userTypeCode?: string;
    setCode?: string;
  };
}

export interface SessionSearchCriteria {
  searchTerm: string;
}

export interface ImageSearchCriteria {
  searchTerm: string;
  count?: number;
}

export class SessionPage extends BasePage {
  readonly navigation: SessionNavigationModule;
  readonly crud: SessionCrudModule;
  readonly search: SessionSearchModule;
  readonly validation: SessionValidationModule;

  constructor(page: Page) {
    super(page);
    this.navigation = new SessionNavigationModule(this);
    this.crud = new SessionCrudModule(this);
    this.search = new SessionSearchModule(this);
    this.validation = new SessionValidationModule(this);
  }

  async goto(projectId?: string) {
    if (projectId) {
      await super.goto(`/project/${projectId}`);
    } else {
      await super.goto('/');
    }
  }

  // Backward-compat delegates — navigation
  async navigateBack() { return this.navigation.navigateBack(); }
  async navigateToHome() { return this.navigation.navigateToHome(); }
  async navigateToEpic() { return this.navigation.navigateToEpic(); }
  async navigateToProject() { return this.navigation.navigateToProject(); }
  async navigateToModule() { return this.navigation.navigateToModule(); }

  // Backward-compat delegates — crud
  async createSession(data: SessionData) { return this.crud.createSession(data); }
  async configureSessionCodes(codes: SessionData['sessionCodes']) { return this.crud.configureSessionCodes(codes); }
  async generateSessionName() { return this.crud.generateSessionName(); }
  async clickCreateButton() { return this.crud.clickCreateButton(); }
  async fillInputField(fieldName: string, value: string) { return this.crud.fillInputField(fieldName, value); }
  async selectFromDropdown(dropdownKey: string, value: string) { return this.crud.selectFromDropdown(dropdownKey, value); }
  async performAction(actionKey: string) { return this.crud.performAction(actionKey); }
  async requestSessionDeletion(reason: string) { return this.crud.requestSessionDeletion(reason); }
  async cancelSessionDeletion() { return this.crud.cancelSessionDeletion(); }
  async createSessionLabel(name: string, description: string, color: string) { return this.crud.createSessionLabel(name, description, color); }
  async cancelSessionLabelCreation() { return this.crud.cancelSessionLabelCreation(); }
  async navigateToSessionCodesTab(tab: 'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType') { return this.crud.navigateToSessionCodesTab(tab); }
  async importCSV(filePath: string) { return this.crud.importCSV(filePath); }
  async uploadToS3(s3Key: string) { return this.crud.uploadToS3(s3Key); }

  // Backward-compat delegates — search
  async searchSession(criteria: SessionSearchCriteria) { return this.search.searchSession(criteria); }
  async clearSessionSearch() { return this.search.clearSessionSearch(); }
  async searchImages(criteria: ImageSearchCriteria) { return this.search.searchImages(criteria); }
  async applyFilter(searchTerm: string) { return this.search.applyFilter(searchTerm); }

  // Backward-compat delegates — validation
  async waitForSessionTable(timeout?: number) { return this.validation.waitForSessionTable(timeout); }
  async getSessionCount() { return this.validation.getSessionCount(); }
  async getSessionName(rowIndex: number) { return this.validation.getSessionName(rowIndex); }
  async sessionExists(name: string) { return this.validation.sessionExists(name); }
  async isSessionCreateModalOpen() { return this.validation.isSessionCreateModalOpen(); }
  async isSessionDeleteModalOpen() { return this.validation.isSessionDeleteModalOpen(); }
  async isSessionLabelTableVisible() { return this.validation.isSessionLabelTableVisible(); }
  async isSessionTableVisible() { return this.validation.isSessionTableVisible(); }
  async verifyElementVisible(elementKey: string) { return this.validation.verifyElementVisible(elementKey); }
  async verifyModalVisible(modalKey: string) { return this.validation.verifyModalVisible(modalKey); }
  async verifyTableData() { return this.validation.verifyTableData(); }
  async isButtonVisible(buttonKey: string) { return this.validation.isButtonVisible(buttonKey); }
  async isInputVisible(inputKey: string) { return this.validation.isInputVisible(inputKey); }
  async getErrorMessage() { return this.validation.getErrorMessage(); }
  async getSuccessMessage() { return this.validation.getSuccessMessage(); }
}
