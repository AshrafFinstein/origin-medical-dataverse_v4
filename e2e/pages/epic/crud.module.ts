import { BaseModule } from '../shared/base-module';

import type { EpicData, EpicSearchCriteria } from './index';

export class EpicCrudModule extends BaseModule {
  private async getCreateEpicModalLocator() {
    const testId = this.selectors.epic['epic-create'].modal;
    const byTestId = this.ctx.getLocator(testId);
    if (await byTestId.count() > 0) return byTestId;
    return this.page.getByRole('dialog', { name: 'Create Epic' });
  }

  private getCreateEpicNameInput() {
    return this.page.getByPlaceholder('Give the new epic a name');
  }

  private getCreateEpicDescriptionInput() {
    return this.page.getByPlaceholder('Provide a description');
  }

  private getCreateEpicCancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  private getCreateEpicSubmitButton() {
    return this.page.getByRole('button', { name: 'Submit' });
  }

  async openCreateEpicModal() {
    const buttonTestId = this.selectors.epic['epic-create'].button;
    const buttonByTestId = this.ctx.getLocator(buttonTestId);
    if (await buttonByTestId.count() > 0) {
      await this.click(buttonTestId);
    } else {
      await this.page.getByRole('button', { name: 'Create Epic' }).click();
    }

    const modal = await this.getCreateEpicModalLocator();
    await modal.waitFor({ state: 'visible' });
  }

  async closeCreateEpicModalWithCloseIcon() {
    const modalTestId = this.selectors.epic['epic-create-modal']['close-button'];
    const modalByTestId = this.ctx.getLocator(modalTestId);
    if (await modalByTestId.count() > 0) {
      await modalByTestId.locator('.n-card-header__close').click();
    } else {
      const modal = await this.getCreateEpicModalLocator();
      await modal.locator('.n-card-header__close').click();
    }
    const modal = await this.getCreateEpicModalLocator();
    await modal.waitFor({ state: 'hidden' }).catch(() => undefined);
  }

  async closeCreateEpicModalWithCancelButton() {
    const cancelTestId = this.selectors.epic['epic-create']['cancel-button'];
    const cancelByTestId = this.ctx.getLocator(cancelTestId);
    if (await cancelByTestId.count() > 0) {
      await this.click(cancelTestId);
    } else {
      await this.getCreateEpicCancelButton().click();
    }
    const modal = await this.getCreateEpicModalLocator();
    await modal.waitFor({ state: 'hidden' }).catch(() => undefined);
  }

  async submitCreateEpic() {
    const submitTestId = this.selectors.epic['epic-create']['submit-button'];
    const submitByTestId = this.ctx.getLocator(submitTestId);
    if (await submitByTestId.count() > 0) {
      await this.click(submitTestId);
    } else {
      await this.getCreateEpicSubmitButton().click();
    }
  }

  async fillEpicName(name: string) {
    const nameTestId = this.selectors.epic['epic-create']['name-input'];
    const nameByTestId = this.ctx.getLocator(nameTestId);
    if (await nameByTestId.count() > 0) {
      await this.fill(nameTestId, name);
    } else {
      await this.getCreateEpicNameInput().fill(name);
    }
  }

  async fillEpicDescription(description: string) {
    const descriptionTestId = this.selectors.epic['epic-create']['description-input'];
    const descriptionByTestId = this.ctx.getLocator(descriptionTestId);
    if (await descriptionByTestId.count() > 0) {
      await this.fill(descriptionTestId, description);
    } else {
      await this.getCreateEpicDescriptionInput().fill(description);
    }
  }

  async focusEpicDescription() {
    const descriptionTestId = this.selectors.epic['epic-create']['description-input'];
    const descriptionByTestId = this.ctx.getLocator(descriptionTestId);
    if (await descriptionByTestId.count() > 0) {
      await this.click(descriptionTestId);
    } else {
      await this.getCreateEpicDescriptionInput().click();
    }
  }

  async focusEpicName() {
    const nameTestId = this.selectors.epic['epic-create']['name-input'];
    const nameByTestId = this.ctx.getLocator(nameTestId);
    if (await nameByTestId.count() > 0) {
      await this.click(nameTestId);
    } else {
      await this.getCreateEpicNameInput().click();
    }
  }

  async createEpic(data: EpicData) {
    await this.openCreateEpicModal();
    await this.fillEpicName(data.name);

    if (data.description) {
      await this.fillEpicDescription(data.description);
    }

    await this.submitCreateEpic();
    await this.waitForToast('success');
    const modal = await this.getCreateEpicModalLocator();
    await modal.waitFor({ state: 'hidden' }).catch(() => undefined);
  }

  async cancelEpicCreation() {
    await this.openCreateEpicModal();
    await this.closeCreateEpicModalWithCancelButton();
  }

  async searchEpic(criteria: EpicSearchCriteria) {
    await this.click(this.selectors.epic['epic-search'].button);
    await this.waitForSelector(this.selectors.epic['epic-search'].modal);
    await this.fill(this.selectors.epic['epic-search'].input, criteria.searchTerm);
    await this.click(this.selectors.epic['epic-search']['submit-button']);
    await this.waitForSelector(this.selectors.epic['epic-search']['results-table']);
  }

  async navigateToEpic(rowIndex: number) {
    const tableTestId = this.selectors.epic['epic-table'].root;
    await this.ctx.getLocator(tableTestId)
      .locator(`tbody tr:nth-child(${rowIndex}) td:nth-child(1)`)
      .click();
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
    await this.waitForSelector(this.selectors.epic['epic-delete'].modal, { state: 'hidden' });
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
    await this.waitForSelector(this.selectors.epic['reject-delete']['request-modal'], { state: 'hidden' });
  }
}
