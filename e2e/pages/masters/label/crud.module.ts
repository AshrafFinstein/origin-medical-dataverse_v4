import { BaseModule } from '../../shared/base-module';

import type { LabelData } from './index';

export class LabelCrudModule extends BaseModule {
  async navigateToLabelTab() {
    await this.click(this.selectors.common['master-tab-label']);
    await this.waitForLoadingComplete();
  }

  async createLabel(data: LabelData) {
    await this.click(this.selectors.label['label-create-button']);
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.label['label-create-modal']);
    await this.fill(this.selectors.label['label-create-name-input'], data.name);
    await this.fill(this.selectors.label['label-create-abbreviation-input'], data.abbreviation);
    await this.click(this.selectors.label['label-create-submit-button']);
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  async cancelLabelCreation() {
    await this.click(this.selectors.label['label-create-button']);
    await this.waitForModalOpen();
    await this.click(this.selectors.label['label-create-cancel-button']);
    await this.waitForModalClose();
  }

  async exportLabels() {
    await this.click(this.selectors.label['label-export-button']);
    await this.waitForLoadingComplete();
  }

  async searchLabel(searchTerm: string) {
    await this.fill(this.selectors.label['label-search-input'], searchTerm);
    await this.waitForLoadingComplete();
  }
}
