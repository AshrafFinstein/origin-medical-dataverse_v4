import { BaseModule } from '../../shared/base-module';

import type { AnnotationData } from './index';

export class AnnotationCrudModule extends BaseModule {
  async navigateToAnnotationTab() {
    await this.click(this.selectors.common['master-tab-annotation']);
    await this.waitForLoadingComplete();
  }

  async createAnnotation(data: AnnotationData) {
    await this.click(this.selectors.annotation['annotation-create-button']);
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.annotation['annotation-create-modal']);
    await this.fill(this.selectors.annotation['annotation-create-name-input'], data.name);
    await this.fill(this.selectors.annotation['annotation-create-abbreviation-input'], data.abbreviation);

    await this.selectOption(
      this.selectors.annotation['annotation-create-taxonomy-type-select'],
      data.taxonomyType
    );

    if (data.color) {
      await this.click(this.selectors.annotation['annotation-create-color-picker']);
      await this.waitForLoadingComplete();
    }

    await this.click(this.selectors.annotation['annotation-create-submit-button']);
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  async cancelAnnotationCreation() {
    await this.click(this.selectors.annotation['annotation-create-button']);
    await this.waitForModalOpen();
    await this.click(this.selectors.annotation['annotation-create-cancel-button']);
    await this.waitForModalClose();
  }

  async updateAnnotation(rowIndex: number, data: Partial<AnnotationData>) {
    const updateButton = `${this.selectors.annotation['annotation-table']} tbody tr:nth-child(${rowIndex}) ${this.selectors.annotation['annotation-update-button']}`;

    await this.click(updateButton);
    await this.waitForModalOpen();

    if (data.name) {
      await this.fill(this.selectors.annotation['annotation-create-name-input'], data.name);
    }

    if (data.abbreviation) {
      await this.fill(this.selectors.annotation['annotation-create-abbreviation-input'], data.abbreviation);
    }

    if (data.taxonomyType) {
      await this.selectOption(
        this.selectors.annotation['annotation-create-taxonomy-type-select'],
        data.taxonomyType
      );
    }

    await this.click(this.selectors.annotation['annotation-create-submit-button']);
    await this.waitForToast('success');
  }

  async exportAnnotations() {
    await this.click(this.selectors.annotation['annotation-export-button']);
    await this.waitForLoadingComplete();
  }
}
