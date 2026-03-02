import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import {
  CopyAnnotationSelectors,
  DataLabellingSelectors,
  QcWorkflowSelectors,
  CommonSelectors,
} from '../selectors';
import { QcWorkflowPage } from './qc-workflow.page';

export class CopyAnnotationPage extends BasePage {
  private qcPage: QcWorkflowPage;

  constructor(page: Page) {
    super(page);
    this.qcPage = new QcWorkflowPage(page);
  }

  async openDataLabellingSession(): Promise<void> {
    await this.qcPage.navigateToDataLabelling();
  }

  async waitForCanvasReady(): Promise<void> {
    const stage = await this.findVisibleCanvasStage(20000);
    const box = await stage.boundingBox();
    if (!box || box.width < 50 || box.height < 50) {
      throw new Error('Canvas stage is not ready for drawing.');
    }
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
    // Annotation panel can already be open; avoid re-clicking through modal overlays.
    const copyButtonVisible = await this.getCopyAnnotationButton().isVisible().catch(() => false);
    if (copyButtonVisible) return;
    await this.waitForLoadingComplete();
    await this.click(CopyAnnotationSelectors['annotation-button']);
  }

  async clickPreviousImageButton(): Promise<void> {
    const button = this.page.getByRole('button', { name: 'Previous Image' }).first();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.waitForCanvasReady();
  }

  async clickNextImageButton(): Promise<void> {
    const button = this.page.getByRole('button', { name: 'Next Image' }).first();
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await this.waitForCanvasReady();
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

    // Prefer drawable taxonomy types supported by our canvas helpers.
    const preferred = dialog
      .getByRole('checkbox')
      .filter({ hasText: /ellipse|bounding box|landmark|crossbar/i })
      .first();
    if (await preferred.count()) {
      await preferred.waitFor({ state: 'visible', timeout: 10000 });
      await preferred.click();
      return;
    }

    const fallback = dialog.getByRole('checkbox').first();
    await fallback.waitFor({ state: 'visible', timeout: 10000 });
    await fallback.click();
  }

  async clickSaveAnnotationButton(): Promise<void> {
    await this.click(CopyAnnotationSelectors['annotation-save-button']);
    await this.waitForLoadingComplete();
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

  private getDialogCanvasStage(): Locator {
    return this.page
      .getByRole('dialog')
      .last()
      .locator('[data-testid="dl-canvas"], div.konvajs-content, canvas')
      .first();
  }

  private getPageCanvasStage(): Locator {
    return this.page.locator('[data-testid="dl-canvas"], div.konvajs-content, canvas').first();
  }

  private async findVisibleCanvasStage(timeoutMs: number, preferDialog: boolean = false): Promise<Locator> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const dialogStage = this.getDialogCanvasStage();
      const dialogVisible = await dialogStage.isVisible().catch(() => false);
      if (dialogVisible) return dialogStage;

      if (preferDialog) {
        await this.page.waitForTimeout(100);
        continue;
      }

      const pageStage = this.getPageCanvasStage();
      if (await pageStage.isVisible().catch(() => false)) return pageStage;

      await this.page.waitForTimeout(100);
    }
    throw new Error('No visible canvas stage found.');
  }

  private async getCanvasStage(): Promise<Locator> {
    return this.findVisibleCanvasStage(5000);
  }

  private async getDrawingCanvasStage(): Promise<Locator> {
    return this.findVisibleCanvasStage(5000, true);
  }

  private async waitForCanvasUnblocked(timeoutMs: number = 5000): Promise<void> {
    const blockers = this.page.locator('.custom-loading-indicator');
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const count = await blockers.count().catch(() => 0);
      let visible = false;
      for (let i = 0; i < count; i++) {
        if (await blockers.nth(i).isVisible().catch(() => false)) {
          visible = true;
          break;
        }
      }
      if (!visible) return;
      await this.page.waitForTimeout(100);
    }
  }

  private getInnerPoint(
    box: { x: number; y: number; width: number; height: number },
    px: number,
    py: number
  ): { x: number; y: number } {
    const margin = 10;
    const minX = box.x + margin;
    const maxX = box.x + box.width - margin;
    const minY = box.y + margin;
    const maxY = box.y + box.height - margin;
    return {
      x: Math.max(minX, Math.min(maxX, box.x + box.width * px)),
      y: Math.max(minY, Math.min(maxY, box.y + box.height * py)),
    };
  }

  private async drawDragShape(): Promise<void> {
    const stage = await this.getDrawingCanvasStage();
    const box = await stage.boundingBox();
    if (!box) throw new Error('Canvas stage bounding box not available for drag draw.');
    const start = this.getInnerPoint(box, 0.3, 0.35);
    const end = this.getInnerPoint(box, 0.55, 0.6);
    await this.waitForCanvasUnblocked();
    await this.page.mouse.move(start.x, start.y);
    await this.page.mouse.down();
    await this.page.mouse.move(end.x, end.y, { steps: 20 });
    await this.page.mouse.up();
  }

  private async drawSinglePoint(): Promise<void> {
    const stage = await this.getDrawingCanvasStage();
    const box = await stage.boundingBox();
    if (!box) throw new Error('Canvas stage bounding box not available for point draw.');
    const point = this.getInnerPoint(box, 0.5, 0.5);
    await this.waitForCanvasUnblocked();
    await this.page.mouse.click(point.x, point.y);
  }

  private async drawTwoPointLine(): Promise<void> {
    const stage = await this.getDrawingCanvasStage();
    const box = await stage.boundingBox();
    if (!box) throw new Error('Canvas stage bounding box not available for line draw.');
    const p1 = this.getInnerPoint(box, 0.35, 0.5);
    const p2 = this.getInnerPoint(box, 0.65, 0.5);
    await this.waitForCanvasUnblocked();
    await this.page.mouse.click(p1.x, p1.y);
    await this.page.mouse.click(p2.x, p2.y);
  }

  private async getSelectedTaxonomyAnnotationType(): Promise<string> {
    const selectedItem = this.getLocator(CopyAnnotationSelectors['taxonomy-selected-item']).first();
    const exists = (await selectedItem.count()) > 0;
    if (!exists) return '';
    const text = (await selectedItem.textContent())?.trim() ?? '';
    const parts = text.split('-');
    return (parts[parts.length - 1] ?? '').trim().toLowerCase();
  }

  private async activateSelectedParentTool(): Promise<void> {
    const selectedItem = this.getLocator(CopyAnnotationSelectors['taxonomy-selected-item']).first();
    if (!(await selectedItem.count())) return;
    const label = selectedItem.locator('.button__label, span').first();
    if (await label.isVisible().catch(() => false)) {
      await label.click();
    } else {
      const box = await selectedItem.boundingBox();
      if (box) {
        const targetX = box.x + (box.width * 0.65);
        const targetY = box.y + (box.height * 0.5);
        await this.page.mouse.click(targetX, targetY);
      } else {
        await selectedItem.click();
      }
    }
    await this.waitForCanvasUnblocked().catch(() => {});
  }

  private async ensureDrawModeReady(): Promise<void> {
    const markerToggle = this.page.getByTestId(DataLabellingSelectors['dl-marker-mode-toggle-button']);
    if (await markerToggle.isVisible().catch(() => false)) {
      const ariaPressed = await markerToggle.getAttribute('aria-pressed');
      const isEnabled = ariaPressed === 'true' || /active|selected|checked/.test((await markerToggle.getAttribute('class')) ?? '');
      if (!isEnabled) {
        await markerToggle.click();
      }
      await this.page.waitForTimeout(120);
      return;
    }

    const annotationButton = this.page.getByRole('button', { name: 'Annotation' });
    if (await annotationButton.isVisible().catch(() => false)) {
      await annotationButton.click();
      await this.page.waitForTimeout(120);
    }
  }

  private async waitForSaveEnabled(timeoutMs: number = 4000): Promise<void> {
    const saveButton = this.page.locator(CopyAnnotationSelectors['annotation-save-button']).first();
    await saveButton.waitFor({ state: 'visible', timeout: timeoutMs });
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const enabled = await saveButton.isEnabled().catch(() => false);
      if (enabled) return;
      await this.page.waitForTimeout(100);
    }
    throw new Error('Save button did not become enabled after drawing annotation.');
  }

  private async drawBySelectedType(selectedType: string): Promise<void> {
    if (selectedType.includes('landmark')) {
      await this.drawSinglePoint();
      return;
    }
    if (selectedType.includes('crossbar')) {
      await this.drawTwoPointLine();
      return;
    }
    await this.drawDragShape();
  }

  private async captureDrawDebug(selectedType: string): Promise<void> {
    const saveEnabled = await this.page.locator(CopyAnnotationSelectors['annotation-save-button']).first().isEnabled().catch(() => false);
    const annotationCount = await this.getAnnotationCount().catch(() => -1);
    const stage = await this.getCanvasStage().catch(() => null);
    const stageBox = stage ? await stage.boundingBox().catch(() => null) : null;
    console.log(
      `[CopyAnnotationDebug] type=${selectedType} saveEnabled=${String(saveEnabled)} annotationCount=${annotationCount} stageBox=${JSON.stringify(stageBox)}`
    );
    await this.page.screenshot({
      path: `test-results/copy-annotation-draw-failure-${Date.now()}.png`,
      fullPage: true,
    }).catch(() => {});
  }

  async createAndSaveAnnotation(): Promise<void> {
    await this.createUnsavedAnnotation();
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
    await this.ensureDrawModeReady();
    await this.waitForCanvasReady();
    const selectedType = await this.getSelectedTaxonomyAnnotationType();
    await this.activateSelectedParentTool();
    await this.drawBySelectedType(selectedType);

    try {
      await this.waitForSaveEnabled();
      return;
    } catch {
      await this.ensureDrawModeReady();
      await this.activateSelectedParentTool();
      await this.drawBySelectedType(selectedType);
      try {
        await this.waitForSaveEnabled();
        return;
      } catch (error) {
        await this.captureDrawDebug(selectedType);
        throw error;
      }
    }
  }

  async isBackgroundInteractionBlocked(): Promise<boolean> {
    const modalVisible = await this.isConflictModalVisible().catch(() => false);
    if (!modalVisible) return false;
    await this.drawDragShape();
    return this.isConflictModalVisible().catch(() => false);
  }
}
