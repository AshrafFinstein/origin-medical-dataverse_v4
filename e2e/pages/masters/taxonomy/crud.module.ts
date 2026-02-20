import { BaseModule } from '../../shared/base-module';
import { getDynamicSelector } from '../../../selectors';

import type { TaxonomyData } from './index';

export class TaxonomyCrudModule extends BaseModule {
  async navigateToTaxonomyTab() {
    await this.click(this.selectors.common['master-tab-taxonomy']);
    await this.waitForLoadingComplete();
  }

  async createTaxonomy(data: TaxonomyData) {
    await this.click(this.selectors.taxonomy['taxonomy-create-button']);
    await this.waitForModalOpen();
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-create-modal']);
    await this.fill(this.selectors.taxonomy['taxonomy-create-name-input'], data.name);

    if (data.annotations && data.annotations.length > 0) {
      for (let i = 0; i < data.annotations.length; i++) {
        await this.addAnnotationToTaxonomy(i, data.annotations[i]);
      }
    }

    await this.click(this.selectors.taxonomy['taxonomy-create-submit-button']);
    await this.waitForToast('success');
    await this.waitForModalClose();
  }

  async cancelTaxonomyCreation() {
    await this.click(this.selectors.taxonomy['taxonomy-create-button']);
    await this.waitForModalOpen();
    await this.click(this.selectors.taxonomy['taxonomy-create-cancel-button']);
    await this.waitForModalClose();
  }

  async addAnnotationToTaxonomy(index: number, annotation: { annotation: string; color?: string }) {
    await this.click(this.selectors.taxonomy['taxonomy-add-annotation-button']);
    await this.waitForLoadingComplete();

    const selectSelector = getDynamicSelector(
      this.selectors.taxonomy['taxonomy-annotation-select-${index}'],
      { index }
    );

    await this.selectOption(selectSelector, annotation.annotation);

    if (annotation.color) {
      const colorPickerSelector = getDynamicSelector(
        this.selectors.taxonomy['taxonomy-color-picker-${index}'],
        { index }
      );

      await this.click(colorPickerSelector);
      await this.waitForLoadingComplete();
    }
  }

  async duplicateAnnotation(index: number) {
    const duplicateButton = getDynamicSelector(
      this.selectors.taxonomy['taxonomy-duplicate-button-${index}'],
      { index }
    );

    await this.click(duplicateButton);
    await this.waitForLoadingComplete();
  }

  async deleteAnnotationFromTaxonomy(index: number) {
    const deleteButton = getDynamicSelector(
      this.selectors.taxonomy['taxonomy-delete-annotation-button-${index}'],
      { index }
    );

    await this.click(deleteButton);
    await this.waitForLoadingComplete();
  }

  async updateTaxonomy() {
    await this.click(this.selectors.taxonomy['taxonomy-update-button']);
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-update-confirmation-modal']);
    await this.click(this.selectors.taxonomy['taxonomy-update-confirmation-proceed-button']);
    await this.waitForToast('success');
  }

  async cancelTaxonomyUpdate() {
    await this.click(this.selectors.taxonomy['taxonomy-update-confirmation-cancel-button']);
    await this.waitForModalClose();
  }

  async deleteTaxonomy() {
    await this.waitForSelector(this.selectors.taxonomy['taxonomy-delete-modal']);
    await this.click(this.selectors.taxonomy['taxonomy-delete-confirm-button']);
    await this.waitForToast('success');
  }

  async cancelTaxonomyDeletion() {
    await this.click(this.selectors.taxonomy['taxonomy-delete-cancel-button']);
    await this.waitForModalClose();
  }
}
