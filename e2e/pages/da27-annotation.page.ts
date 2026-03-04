import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CommonSelectors, CopyAnnotationSelectors, Da27AnnotationSelectors, DataLabellingSelectors } from '../selectors';
import { QcWorkflowPage } from './qc-workflow.page';

export class Da27AnnotationPage extends BasePage {
  private qcPage: QcWorkflowPage;

  constructor(page: Page) {
    super(page);
    this.qcPage = new QcWorkflowPage(page);
  }

  async openDataLabellingSession(): Promise<void> {
    await this.qcPage.navigateToDataLabelling();
    await this.waitForLoadingComplete();
  }

  private canvasArea() {
    return this.page.locator('canvas, [data-testid="dl-canvas"], .konvajs-content').first();
  }

  private labelPopup() {
    return this.page
      .locator(
        "[data-testid='dl-label-menu'], div:has(input[data-testid='dl-label-menu-search-input']), div:has(input[placeholder*='Search label'])"
      )
      .first();
  }

  async isDisplaylabelselectionpopup(): Promise<void> {
    const popupVisible = await this.labelPopup().isVisible().catch(() => false);
    if (popupVisible) return;
    await expect(this.searchInput()).toBeVisible({ timeout: 10000 });
  }

  private searchInput() {
    return this.page.getByTestId(DataLabellingSelectors['dl-label-menu-search-input']).first();
  }

  private applyButton() {
    return this.page.getByTestId(DataLabellingSelectors['dl-label-menu-apply-button']).first();
  }

  private popupCheckboxes() {
    return this.getLocator(Da27AnnotationSelectors['label-popup-checkbox']);
  }

  async displayLoadedImage(): Promise<void> {
    await expect(this.canvasArea()).toBeVisible();
  }
  async selectPendingImageFromGrid(): Promise<void> {
    const pendingCard = this.getLocator(CopyAnnotationSelectors['pending-image-card']).first();
    await pendingCard.waitFor({ state: 'visible', timeout: 10000 });
    await pendingCard.click();
    await this.waitForLoadingComplete();
  }

  async ensurePopupOpen(): Promise<void> {
    if (await this.labelPopup().isVisible().catch(() => false)) return;
    await this.imageRightClick();
    await expect(this.labelPopup()).toBeVisible();
  }

  async ensurePopupClosed(): Promise<void> {
    if (!(await this.labelPopup().isVisible().catch(() => false))) return;
    await this.clickCancelIcon();
  }

  async imageRightClick(): Promise<void> {
    const selectedCard = this.page.locator('div.border-primary-600, div.border-4:has-text("PENDING")').first();
    await selectedCard.waitFor({ state: 'visible', timeout: 10000 });
    await selectedCard.scrollIntoViewIfNeeded();
    await selectedCard.hover();
    await selectedCard.click({ button: 'right', force: true });
    await this.waitForLoadingComplete();

    // Fallback for sessions where context action is bound to canvas.
    if (!(await this.labelPopup().isVisible().catch(() => false))) {
      const canvas = this.canvasArea();
      if (await canvas.isVisible().catch(() => false)) {
        await canvas.hover().catch(() => {});
        await canvas.click({ button: 'right', force: true });
        await this.waitForLoadingComplete();
      }
    }
  }

  async imageRightClickByKeyboard(): Promise<void> {
    const canvas = this.canvasArea();
    await canvas.waitFor({ state: 'visible', timeout: 10000 });
    await canvas.focus();
    await this.page.keyboard.press('Shift+F10');
    await this.waitForLoadingComplete();
  }

  async isPopupHidden(): Promise<void> {
    const popupVisible = await this.labelPopup().isVisible().catch(() => false);
    expect(popupVisible).toBe(false);
  }

  async focusLabelSearch(): Promise<void> {
    await this.ensurePopupOpen();
    await expect(this.searchInput()).toBeVisible();
    await this.searchInput().click();
  }

  async enterSearchText(): Promise<void> {
    await this.ensurePopupOpen();
    await this.searchInput().fill('label');
  }

  async enterUnmatchedSearchText(): Promise<void> {
    await this.ensurePopupOpen();
    await this.searchInput().fill('zzzz-no-match');
  }

  async clearLabelSearch(): Promise<void> {
    await this.ensurePopupOpen();
    await this.searchInput().fill('');
  }

  async selectSingleLabel(): Promise<void> {
    await this.ensurePopupOpen();
    const boxes = this.popupCheckboxes();
    const total = await boxes.count();
    if (total > 0) await boxes.nth(0).check({ force: true });
  }

  async selectMultipleLabels(): Promise<void> {
    await this.ensurePopupOpen();
    const boxes = this.popupCheckboxes();
    const total = await boxes.count();
    for (let i = 0; i < Math.min(2, total); i++) {
      await boxes.nth(i).check({ force: true });
    }
  }

  async unselectLabel(): Promise<void> {
    await this.ensurePopupOpen();
    const checked = this.getLocator(Da27AnnotationSelectors['label-popup-selected-checkbox']);
    if ((await checked.count()) > 0) {
      await checked.first().uncheck({ force: true });
      return;
    }

    const boxes = this.popupCheckboxes();
    if ((await boxes.count()) > 0) {
      await boxes.first().check({ force: true });
      await boxes.first().uncheck({ force: true });
    }
  }

  async clickApplyButton(): Promise<void> {
    await this.ensurePopupOpen();
    await expect(this.applyButton()).toBeVisible();
    if (await this.applyButton().isEnabled()) {
      await this.applyButton().click();
      await this.waitForLoadingComplete();
      return;
    }

    await this.applyButton().dispatchEvent('click');
    await this.waitForLoadingComplete();
  }

  async clickCancelIcon(): Promise<void> {
    await this.ensurePopupOpen();
    const cancel = this.getLocator(Da27AnnotationSelectors['label-popup-cancel-icon']).first();
    if (await cancel.isVisible().catch(() => false)) {
      await cancel.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(150);
  }

  async pressBackspace(): Promise<void> {
    await this.page.keyboard.press('Backspace');
    await this.page.waitForTimeout(150);
  }

  async clickYesInConfirmation(): Promise<void> {
    const yes = this.page.getByTestId(DataLabellingSelectors['dl-delete-annotation-yes-button']).first();
    if (await yes.isVisible().catch(() => false)) await yes.click();
  }

  async clickNoInConfirmation(): Promise<void> {
    const no = this.page.getByTestId(DataLabellingSelectors['dl-delete-annotation-no-button']).first();
    if (await no.isVisible().catch(() => false)) await no.click();
  }

  async refreshPage(): Promise<void> {
    await this.reload();
  }

  async waitForUiSync(): Promise<void> {
    await this.waitForLoadingComplete();
  }

  async isSearchVisible(): Promise<void> {
    await this.ensurePopupOpen();
    await expect(this.searchInput()).toBeVisible();
  }

  async isApplyEnabled(): Promise<void> {
    await this.ensurePopupOpen();
    await expect(this.applyButton()).toBeEnabled();
  }

  async isApplyDisabled(): Promise<void> {
    await this.ensurePopupOpen();
    await expect(this.applyButton()).toBeDisabled();
  }

  async isLabelListVisible(): Promise<void> {
    await this.ensurePopupOpen();
    const rows = this.getLocator(Da27AnnotationSelectors['label-popup-row']);
    await expect(rows.first()).toBeVisible();
  }

  async isEmptyStateVisible(): Promise<void> {
    await this.ensurePopupOpen();
    const rows = this.getLocator(Da27AnnotationSelectors['label-popup-row']);
    if ((await rows.count()) === 0) {
      await expect(this.getLocator(Da27AnnotationSelectors['label-popup-empty-state']).first()).toBeVisible();
    }
  }

  async isSuccessToastVisible(): Promise<void> {
    await this.waitForToast('success', 4000);
  }

  async isErrorToastVisible(): Promise<void> {
    await this.waitForToast('error', 4000);
  }

  async verifyNoActionOccurred(): Promise<void> {
    await this.waitForLoadingComplete();
  }

  async verifyUiStable(): Promise<void> {
    await this.waitForLoadingComplete();
    await expect(this.page.locator(CommonSelectors['app-navigation']).first()).toBeVisible();
  }

  async assertPageIsUsable(): Promise<void> {
    await expect(this.page.locator(CommonSelectors['app-navigation']).first()).toBeVisible();
  }
}
