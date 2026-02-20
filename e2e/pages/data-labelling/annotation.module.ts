import { BaseModule } from '../shared/base-module';
import type { AnnotationData } from './index';

export class DLAnnotationModule extends BaseModule {
  async openAnnotationTools() {
    await this.click(this.selectors.dataLabelling['dl-annotation-button']);
    await this.waitForLoadingComplete();
  }

  async toggleMarkerMode() {
    await this.click(this.selectors.dataLabelling['dl-marker-mode-toggle-button']);
    await this.waitForLoadingComplete();
  }

  async createAnnotation(data: AnnotationData) {
    await this.openAnnotationTools();
    await this.selectLabel(data.label);

    if (data.coordinates) {
      await this.drawAnnotation(data.coordinates);
    }
  }

  async selectLabel(labelName: string) {
    await this.click(this.selectors.dataLabelling['dl-label-menu']);

    await this.fill(
      this.selectors.dataLabelling['dl-label-menu-search-input'],
      labelName
    );

    // Click label text
    await this.ctx.clickByText(labelName);

    // Apply
    await this.click(this.selectors.dataLabelling['dl-label-menu-apply-button']);

    // ✅ important wait
    await this.waitForLoadingComplete();
  }

  async deleteAnnotation(confirmDeletion: boolean = true) {
    await this.waitForSelector(this.selectors.dataLabelling['dl-delete-annotation-modal']);

    if (confirmDeletion) {
      await this.click(this.selectors.dataLabelling['dl-delete-annotation-yes-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-delete-annotation-no-button']);
    }

    await this.waitForModalClose();
  }

  async copyAnnotation(replaceExisting: boolean = false) {
    await this.waitForSelector(this.selectors.dataLabelling['dl-copy-annotation-modal']);

    if (replaceExisting) {
      await this.click(this.selectors.dataLabelling['dl-copy-annotation-replace-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-copy-annotation-cancel-button']);
    }

    await this.waitForModalClose();
  }

  async handleUnsavedChanges(action: 'save' | 'discard') {
    await this.waitForSelector(this.selectors.dataLabelling['dl-unsaved-changes-modal']);

    if (action === 'save') {
      await this.click(this.selectors.dataLabelling['dl-unsaved-save-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-unsaved-discard-button']);
    }

    await this.waitForModalClose();
  }

  async handleUnsavedChangesBeforeQC(action: 'save' | 'dontSave') {
    await this.waitForSelector(this.selectors.dataLabelling['dl-unsaved-before-qc-modal']);

    if (action === 'save') {
      await this.click(this.selectors.dataLabelling['dl-unsaved-before-qc-save-button']);
    } else {
      await this.click(this.selectors.dataLabelling['dl-unsaved-before-qc-dont-save-button']);
    }

    await this.waitForModalClose();
  }

  /**
   * ✅ Draw relative to canvas (stable)
   */
  private async drawAnnotation(coords: { x: number; y: number; width: number; height: number }) {
    const canvas = this.page.locator(this.selectors.dataLabelling['dl-canvas']).first();

    const box = await canvas.boundingBox();
    if (!box) {
      throw new Error('Canvas bounding box not found');
    }

    // Convert relative coords -> absolute coords
    const startX = box.x + coords.x;
    const startY = box.y + coords.y;
    const endX = startX + coords.width;
    const endY = startY + coords.height;

    await canvas.hover();

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();

    await this.waitForLoadingComplete();
  }
}
