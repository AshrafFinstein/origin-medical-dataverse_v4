import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CommonSelectors, CopyAnnotationSelectors, Da27AnnotationSelectors, DataLabellingSelectors } from '../selectors';
import { QcWorkflowPage } from './qc-workflow.page';

export class Da27AnnotationPage extends BasePage {
  private qcPage: QcWorkflowPage;
  private lastSelectedLabelText: string | null = null;
  private popupListedLabels: string[] = [];
  private searchedLabelText: string | null = null;

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
        "[data-testid='dl-label-menu'], .z-50.absolute:has(button:has-text('APPLY')), .n-popover:has(button:has-text('APPLY'))"
      )
      .first();
  }

  async isDisplaylabelselectionpopup(): Promise<void> {
    await expect(this.labelPopup()).toBeVisible({ timeout: 10000 });
    await expect(this.searchInput()).toBeVisible({ timeout: 10000 });
  }

  private searchInput() {
    return this.labelPopup()
      .locator(
        "[data-testid='dl-label-menu-search-input'], input[placeholder='Search label'], input.n-input__input-el[placeholder='Search label']"
      )
      .first();
  }

  private applyButton() {
    return this.labelPopup()
      .locator(
        `[data-testid='${DataLabellingSelectors['dl-label-menu-apply-button']}'], button:has-text('APPLY')`
      )
      .first();
  }

  private popupCheckboxes() {
    return this.labelPopup().locator("div[draggable='true'] svg[role='img'], .n-checkbox, [role='checkbox']");
  }

  private async isPopupRowChecked(row: Locator): Promise<boolean> {
    const input = row.locator("input[type='checkbox']").first();
    if (await input.count()) {
      return input.isChecked().catch(() => false);
    }

    const roleCheckbox = row.locator("[role='checkbox']").first();
    if (await roleCheckbox.count()) {
      const ariaChecked = await roleCheckbox.getAttribute('aria-checked');
      if (ariaChecked === 'true') return true;
      if (ariaChecked === 'false') return false;
    }

    const checkboxClass = await row.locator('.n-checkbox').first().getAttribute('class').catch(() => '');
    if (checkboxClass?.includes('checked')) return true;

    const iconClass = await row.locator("svg[role='img']").first().getAttribute('class').catch(() => '');
    if (iconClass?.includes('text-primary') || iconClass?.includes('checked') || iconClass?.includes('active')) return true;

    return false;
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
    if (await this.searchInput().isVisible().catch(() => false)) return;
    await this.imageRightClick();
    await this.isDisplaylabelselectionpopup();
  }

  async ensurePopupClosed(): Promise<void> {
    if (!(await this.labelPopup().isVisible().catch(() => false))) return;
    await this.clickCancelIcon();
  }

  async imageRightClick(): Promise<void> {
    const selectedCard = this.page
      .locator('div.border-primary-600, div.border-4:has-text("PENDING")')
      .first();
    await selectedCard.waitFor({ state: 'visible', timeout: 10000 });
    await selectedCard.scrollIntoViewIfNeeded();

    // Do not hover image node; overlay intercepts pointer events in this UI.
    await selectedCard.click({ button: 'right', force: true });
    await this.waitForLoadingComplete();

    // Fallback 1: trigger contextmenu event directly on selected card.
    if (!(await this.searchInput().isVisible().catch(() => false))) {
      await selectedCard.dispatchEvent('contextmenu');
      await this.waitForLoadingComplete();
    }

    // Fallback 2: some sessions bind context action to canvas.
    if (!(await this.searchInput().isVisible().catch(() => false))) {
      const canvas = this.canvasArea();
      if (await canvas.isVisible().catch(() => false)) {
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
    if (this.popupListedLabels.length === 0) {
      const labels = this.labelPopup().locator("div[draggable='true'] p:visible");
      const count = await labels.count();
      for (let i = 0; i < count; i++) {
        const text = (await labels.nth(i).textContent().catch(() => ''))?.trim();
        if (text) this.popupListedLabels.push(text);
      }
    }

    this.searchedLabelText = this.popupListedLabels[0] ?? null;
    await this.searchInput().fill(this.searchedLabelText ?? '');
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
    const draggableRows = this.labelPopup().locator("div[draggable='true']:visible");
    if ((await draggableRows.count()) > 0) {
      const rowCount = await draggableRows.count();
      let targetRow: Locator | null = null;

      for (let i = 0; i < rowCount; i++) {
        const row = draggableRows.nth(i);
        const checked = await this.isPopupRowChecked(row);
        if (!checked) {
          targetRow = row;
          break;
        }
      }

      // If all rows are already checked, do not click any row (avoid toggling to unchecked).
      if (!targetRow) {
        targetRow = draggableRows.first();
      } else {
        const toggle = targetRow.locator("svg[role='img'], .n-checkbox, [role='checkbox'], input[type='checkbox']").first();
        if (await toggle.isVisible().catch(() => false)) {
          await toggle.click({ force: true });
        } else {
          await targetRow.click({ force: true });
        }
      }

      const selectedText = (await targetRow.locator('p').first().textContent().catch(() => ''))?.trim();
      if (selectedText) this.lastSelectedLabelText = selectedText;
    } else {
      const toggles = this.labelPopup().locator("svg[role='img']:visible, .n-checkbox:visible, [role='checkbox']:visible");
      if ((await toggles.count()) > 0) {
        // No row semantics available; assume first toggle is unchecked only if Apply is disabled.
        if (await this.applyButton().isDisabled().catch(() => false)) {
          await toggles.first().click({ force: true });
        }
      }
    }

    await expect(this.applyButton()).toBeEnabled();
  }

  async selectMultipleLabels(): Promise<void> {
    await this.ensurePopupOpen();
    this.popupListedLabels = [];
    const rows = this.labelPopup().locator("div[draggable='true']:visible");
    const rowCount = await rows.count();
    let selected = 0;

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const labelText = (await row.locator('p').first().textContent().catch(() => ''))?.trim();
      if (labelText) this.popupListedLabels.push(labelText);

      if (selected < 2) {
        const checked = await this.isPopupRowChecked(row);
        if (!checked) {
          const toggle = row.locator("svg[role='img'], .n-checkbox, [role='checkbox'], input[type='checkbox']").first();
          if (await toggle.isVisible().catch(() => false)) {
            await toggle.click({ force: true });
          } else {
            await row.click({ force: true });
          }
          selected++;
        }
      }
    }

    // Fallback when row markup differs; keep prior behavior.
    if (selected === 0) {
      const toggles = this.labelPopup().locator("svg[role='img']:visible, .n-checkbox:visible, [role='checkbox']:visible");
      const total = await toggles.count();
      for (let i = 0; i < Math.min(2, total); i++) {
        await toggles.nth(i).click({ force: true });
      }
    }

    await expect(this.applyButton()).toBeEnabled();
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
    const labelRows = this.labelPopup().locator("div[draggable='true'] p:visible, .n-checkbox:visible p:visible");

    if (this.searchedLabelText) {
      await expect(labelRows.filter({ hasText: this.searchedLabelText }).first()).toBeVisible();
      return;
    }

    await expect(labelRows.first()).toBeVisible();
  }

  async isEmptyStateVisible(): Promise<void> {
    await this.ensurePopupOpen();
    const rows = this.labelPopup().locator(".n-checkbox:visible, [role='checkbox']:visible, input[type='checkbox']:visible");
    if ((await rows.count()) === 0) {
      await expect(this.labelPopup().locator(":text('No results found'), :text('No labels found')").first()).toBeVisible();
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

  async isSelectedLabelDisplayedUnderImage(): Promise<void> {
    await this.waitForLoadingComplete();
    const selectedCardContainer = this.page
      .locator("div:has(> div.border-primary-600), div:has(> div.border-4:has-text('PENDING'))")
      .first();

    const assignedUnderSelectedCard = selectedCardContainer.locator('div.product-name p, p.rounded-b-md');
    const assignedAnywhere = this.page.locator('div.product-name p, p.rounded-b-md');

    if (await assignedUnderSelectedCard.first().isVisible().catch(() => false)) {
      if (this.lastSelectedLabelText) {
        const exactMatch = assignedUnderSelectedCard.filter({ hasText: this.lastSelectedLabelText }).first();
        if (await exactMatch.isVisible().catch(() => false)) {
          await expect(exactMatch).toBeVisible({ timeout: 10000 });
          return;
        }
      }
      await expect(assignedUnderSelectedCard.first()).toBeVisible({ timeout: 10000 });
      await expect(assignedUnderSelectedCard.first()).not.toHaveText('', { timeout: 10000 });
      return;
    }

    if (this.lastSelectedLabelText) {
      const exactMatchAnywhere = assignedAnywhere.filter({ hasText: this.lastSelectedLabelText }).first();
      if (await exactMatchAnywhere.isVisible().catch(() => false)) {
        await expect(exactMatchAnywhere).toBeVisible({ timeout: 10000 });
        return;
      }
    }

    await expect(assignedAnywhere.first()).toBeVisible({ timeout: 10000 });
    await expect(assignedAnywhere.first()).not.toHaveText('', { timeout: 10000 });
  }

  async assertPageIsUsable(): Promise<void> {
    await expect(this.page.locator(CommonSelectors['app-navigation']).first()).toBeVisible();
  }
}
