import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import {
  CopyAnnotationSelectors,
  DataLabellingSelectors,
  QcWorkflowSelectors,
  CommonSelectors,
} from '../selectors';
import { loginToApplication } from '../utils/helpers';
import TestData from '../test-data/test-data';
import { QcWorkflowPage } from './qc-workflow.page';

type Credentials = {
  email: string;
  password: string;
};

export class CopyAnnotationPage extends BasePage {
  private qcPage: QcWorkflowPage;

  constructor(page: Page) {
    super(page);
    this.qcPage = new QcWorkflowPage(page);
  }

  async openDataLabellingSession(credentials: Credentials = TestData.testUsers.admin): Promise<void> {
    await loginToApplication(this.page, credentials);
    await this.qcPage.navigateToDataLabelling();
  }

  async waitForCanvasReady(): Promise<void> {
    await this.waitForSelector(CopyAnnotationSelectors['copy-annotation-canvas'], {
      state: 'visible',
      timeout: 20000,
    });
    await this.waitForLoadingComplete();
  }

  // ── Copy Annotation UI ────────────────────────────────────────────────────

  getCopyAnnotationButton(): Locator {
    return this.getLocator(CopyAnnotationSelectors['copy-annotation-button']);
  }

  async isAnnotationButtonVisible(): Promise<boolean> {
    return this.isVisible(CopyAnnotationSelectors['annotation-button']);
  }

  async isCopyAnnotationButtonEnabled(): Promise<boolean> {
    return this.isEnabled(CopyAnnotationSelectors['copy-annotation-button']);
  }

  async isCopyAnnotationButtonDisabled(): Promise<boolean> {
    return this.isDisabled(CopyAnnotationSelectors['copy-annotation-button']);
  }

  async clickAnnotationButton(): Promise<void> {
    await this.click(CopyAnnotationSelectors['annotation-button']);
  }

  async clickFilterAnnotatedCheckbox(): Promise<void> {
    const checkbox = this.page.getByRole('checkbox', { name: 'Filter Annotated' });
    await checkbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await checkbox.getAttribute('aria-checked');
    if (isChecked !== 'true') {
      await checkbox.click();
    }
  }

  async clickFilterUnannotatedCheckbox(): Promise<void> {
    const checkbox = this.page.getByRole('checkbox', { name: 'Filter Unannotated' });
    await checkbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await checkbox.getAttribute('aria-checked');
    if (isChecked !== 'true') {
      await checkbox.click();
    }
  }

  async listAvailableTaxonomies(): Promise<string[]> {
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    const checkboxes = dialog.getByRole('checkbox');
    const count = await checkboxes.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = (await checkboxes.nth(i).getAttribute('aria-label'))?.trim();
      if (name) names.push(name);
    }

    return names;
  }

  async selectFirstTaxonomy(): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    const checkbox = dialog.getByRole('checkbox').first();
    await checkbox.waitFor({ state: 'visible', timeout: 10000 });
    await checkbox.click();
  }

  async clickSaveAnnotationButton(): Promise<void> {
    await this.click(CopyAnnotationSelectors['annotation-save-button']);
    await this.waitForSelector(DataLabellingSelectors['dl-status-saved-indicator'], {
      state: 'visible',
      timeout: 10000,
    });
  }

  async clickCopyAnnotationButton(): Promise<void> {
    await this.click(CopyAnnotationSelectors['copy-annotation-button']);
  }

  async attemptClickCopyAnnotationButton(): Promise<void> {
    const button = this.getCopyAnnotationButton();
    await button.dispatchEvent('click');
  }

  async isAnnotationPopupVisible(): Promise<boolean> {
    return this.isVisible(CopyAnnotationSelectors['annotation-popup']);
  }

  async isCopyAnnotationModalVisible(): Promise<boolean> {
    return this.isVisible(CopyAnnotationSelectors['copy-annotation-modal']);
  }

  async isConflictModalVisible(): Promise<boolean> {
    return this.isVisible(CopyAnnotationSelectors['copy-annotation-conflict-modal']);
  }

  async getConflictModalTitleText(): Promise<string> {
    return this.getText(CopyAnnotationSelectors['copy-annotation-conflict-title']);
  }

  async selectCopyTargetOption(index: number): Promise<void> {
    const selector = this.getSelector(
      CopyAnnotationSelectors['copy-annotation-target-option-${index}'],
      { index }
    );
    await this.click(selector);
  }

  async confirmCopyInModal(): Promise<void> {
    await this.click(CopyAnnotationSelectors['copy-annotation-confirm-button']);
  }

  async cancelCopyInModal(): Promise<void> {
    await this.click(CopyAnnotationSelectors['copy-annotation-cancel-button']);
  }

  async replaceAnnotationsInConflictModal(): Promise<void> {
    await this.click(CopyAnnotationSelectors['copy-annotation-replace-button']);
  }

  async pressCopyToNextShortcut(): Promise<void> {
    await this.page.keyboard.press('Control+Shift+ArrowRight');
  }

  async pressCopyToPreviousShortcut(): Promise<void> {
    await this.page.keyboard.press('Control+Shift+ArrowLeft');
  }

  async waitForCopyActionInitiated(timeoutMs: number = 5000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const modalVisible = await this.isCopyAnnotationModalVisible().catch(() => false);
      const conflictVisible = await this.isConflictModalVisible().catch(() => false);
      if (modalVisible || conflictVisible) return true;
      const toastVisible = await this.getLocator(CommonSelectors['ui-toast-success']).isVisible().catch(() => false);
      if (toastVisible) return true;
      await this.page.waitForTimeout(250);
    }
    return false;
  }

  async getSuccessToastText(): Promise<string> {
    return this.getToastMessage('success', 5000);
  }

  async getErrorToastText(): Promise<string> {
    return this.getToastMessage('error', 5000);
  }

  // ── Image Navigation / Annotation State ───────────────────────────────────

  async getImageCount(): Promise<number> {
    return this.getCount(QcWorkflowSelectors['qc-image-card']);
  }

  async selectPendingImageFromGrid(): Promise<void> {
    const pendingCard = this.getLocator(CopyAnnotationSelectors['pending-image-card']).first();
    await pendingCard.click();
    await this.waitForCanvasReady();
  }

  async selectImageByIndex(index: number): Promise<void> {
    const cards = this.getLocator(QcWorkflowSelectors['qc-image-card']);
    await cards.nth(index).click();
    await this.waitForCanvasReady();
  }

  async getAnnotationCount(): Promise<number> {
    return this.getCount(DataLabellingSelectors['dl-annotation-items']);
  }

  async selectImageWithAnnotations(): Promise<number> {
    const total = await this.getImageCount();
    for (let i = 0; i < total; i++) {
      await this.selectImageByIndex(i);
      const count = await this.getAnnotationCount();
      if (count > 0) return i;
    }
    throw new Error('No image with annotations found.');
  }

  async selectImageWithoutAnnotations(): Promise<number> {
    const total = await this.getImageCount();
    for (let i = 0; i < total; i++) {
      await this.selectImageByIndex(i);
      const count = await this.getAnnotationCount();
      if (count === 0) return i;
    }
    throw new Error('No image without annotations found.');
  }

  async findAnnotatedImageWithNext(): Promise<number> {
    const total = await this.getImageCount();
    for (let i = 0; i < total - 1; i++) {
      await this.selectImageByIndex(i);
      const count = await this.getAnnotationCount();
      if (count > 0) return i;
    }
    throw new Error('No annotated image with a next image found.');
  }

  async findAnnotatedImageWithNextUnannotated(): Promise<number> {
    const total = await this.getImageCount();
    for (let i = 0; i < total - 1; i++) {
      await this.selectImageByIndex(i);
      const sourceCount = await this.getAnnotationCount();
      if (sourceCount === 0) continue;
      await this.selectImageByIndex(i + 1);
      const targetCount = await this.getAnnotationCount();
      if (targetCount === 0) {
        await this.selectImageByIndex(i);
        return i;
      }
    }
    throw new Error('No annotated image with an unannotated next image found.');
  }

  async findAnnotatedImageWithPrevious(): Promise<number> {
    const total = await this.getImageCount();
    for (let i = 1; i < total; i++) {
      await this.selectImageByIndex(i);
      const count = await this.getAnnotationCount();
      if (count > 0) return i;
    }
    throw new Error('No annotated image with a previous image found.');
  }

  async findAnnotatedImageWithPreviousUnannotated(): Promise<number> {
    const total = await this.getImageCount();
    for (let i = 1; i < total; i++) {
      await this.selectImageByIndex(i);
      const sourceCount = await this.getAnnotationCount();
      if (sourceCount === 0) continue;
      await this.selectImageByIndex(i - 1);
      const targetCount = await this.getAnnotationCount();
      if (targetCount === 0) {
        await this.selectImageByIndex(i);
        return i;
      }
    }
    throw new Error('No annotated image with an unannotated previous image found.');
  }

  async findAnnotatedNextPair(): Promise<{ sourceIndex: number; targetIndex: number }> {
    const total = await this.getImageCount();
    for (let i = 0; i < total - 1; i++) {
      await this.selectImageByIndex(i);
      const sourceCount = await this.getAnnotationCount();
      if (sourceCount === 0) continue;
      await this.selectImageByIndex(i + 1);
      const targetCount = await this.getAnnotationCount();
      if (targetCount > 0) {
        await this.selectImageByIndex(i);
        return { sourceIndex: i, targetIndex: i + 1 };
      }
    }
    throw new Error('No adjacent annotated next-image pair found.');
  }

  async findAnnotatedPreviousPair(): Promise<{ sourceIndex: number; targetIndex: number }> {
    const total = await this.getImageCount();
    for (let i = 1; i < total; i++) {
      await this.selectImageByIndex(i);
      const sourceCount = await this.getAnnotationCount();
      if (sourceCount === 0) continue;
      await this.selectImageByIndex(i - 1);
      const targetCount = await this.getAnnotationCount();
      if (targetCount > 0) {
        await this.selectImageByIndex(i);
        return { sourceIndex: i, targetIndex: i - 1 };
      }
    }
    throw new Error('No adjacent annotated previous-image pair found.');
  }

  // ── Annotation Creation Helpers ───────────────────────────────────────────

  private async drawOnCanvas(): Promise<void> {
    const canvas = this.getLocator(CopyAnnotationSelectors['copy-annotation-canvas']).first();
    const box = await canvas.boundingBox();
    if (!box) return;
    const startX = box.x + Math.max(5, box.width * 0.2);
    const startY = box.y + Math.max(5, box.height * 0.2);
    const endX = startX + Math.max(10, box.width * 0.1);
    const endY = startY + Math.max(10, box.height * 0.1);
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
  }

  async createAndSaveAnnotation(): Promise<void> {
    await this.click(DataLabellingSelectors['dl-marker-mode-toggle-button']);
    await this.drawOnCanvas();
    const labelMenuVisible = await this.isVisible(DataLabellingSelectors['dl-label-menu']).catch(() => false);
    if (labelMenuVisible) {
      await this.click(DataLabellingSelectors['dl-label-menu']);
      await this.click(DataLabellingSelectors['dl-label-menu-apply-button']);
    }
    await this.waitForSelector(DataLabellingSelectors['dl-status-saved-indicator'], {
      state: 'visible',
      timeout: 10000,
    });
  }

  async createUnsavedAnnotation(): Promise<void> {
    await this.click(DataLabellingSelectors['dl-marker-mode-toggle-button']);
    await this.waitForCanvasReady();
    await this.drawOnCanvas();
  }

  async isBackgroundInteractionBlocked(): Promise<boolean> {
    const modalVisible = await this.isConflictModalVisible().catch(() => false);
    if (!modalVisible) return false;
    await this.drawOnCanvas();
    return this.isConflictModalVisible().catch(() => false);
  }
}
