import { BaseModule } from '../shared/base-module';

import type { EpicData, EpicSearchCriteria } from './index';

export class EpicCrudModule extends BaseModule {
  async createEpic(data: EpicData) {
    await this.click(this.selectors.epic['epic-create'].button);
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.epic['epic-create'].modal);
    await this.fill(this.selectors.epic['epic-create']['name-input'], data.name);

    if (data.description) {
      await this.fill(this.selectors.epic['epic-create']['description-input'], data.description);
    }

    await this.click(this.selectors.epic['epic-create']['submit-button']);
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  async cancelEpicCreation() {
    await this.click(this.selectors.epic['epic-create'].button);
    await this.waitForModalOpen();
    await this.click(this.selectors.epic['epic-create']['cancel-button']);
    await this.waitForModalClose();
  }

  async searchEpic(criteria: EpicSearchCriteria) {
    await this.click(this.selectors.epic['epic-search'].button);
    await this.waitForSelector(this.selectors.epic['epic-search'].modal);
    await this.fill(this.selectors.epic['epic-search'].input, criteria.searchTerm);
    await this.click(this.selectors.epic['epic-search']['submit-button']);
    await this.waitForSelector(this.selectors.epic['epic-search']['results-table']);
  }

  async navigateToEpic(rowIndex: number) {
    const tableSelector = this.selectors.epic['epic-table'].root;
    await this.ctx.clickTableCell(tableSelector, rowIndex, 1);
    await this.waitForPageLoad();
  }

  async navigateToEpicByName(name: string) {
    await this.ctx.clickByText(name);
    await this.waitForPageLoad();
  }

  async deleteEpic() {
    await this.waitForSelector(this.selectors.epic['epic-delete'].modal);
    await this.click(this.selectors.epic['epic-delete']['confirm-button']);
    await this.waitForToast('success');
  }

  async cancelEpicDeletion() {
    await this.click(this.selectors.epic['epic-delete']['cancel-button']);
    await this.waitForModalClose();
  }

  async viewDeleteSessionRequests() {
    await this.click(this.selectors.epic['epic-delete']['session-requests-button']);
    await this.waitForSelector(this.selectors.epic['delete-session']['requests-modal']);
  }

  async rejectDeleteRequest(sessionName: string, reason: string) {
    await this.waitForSelector(this.selectors.epic['reject-delete']['request-modal']);
    await this.fill(this.selectors.epic['reject-request']['session-name-input'], sessionName);
    await this.fill(this.selectors.epic['reject-request']['reason-input'], reason);
    await this.click(this.selectors.epic['reject-request']['confirm-button']);
    await this.waitForToast('success');
  }

  async cancelRejectDeleteRequest() {
    await this.click(this.selectors.epic['reject-request']['cancel-button']);
    await this.waitForModalClose();
  }
}
