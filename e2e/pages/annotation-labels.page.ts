import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { DataLabellingSelectors } from '../selectors';

const {
  'dl-label-menu': dlLabelMenu,
  'dl-label-menu-search-input': dlLabelMenuSearchInput,
  'dl-label-menu-apply-button': dlLabelMenuApplyButton,
  'dl-delete-annotation-modal': dlDeleteAnnotationModal,
  'dl-delete-annotation-yes-button': dlDeleteAnnotationYesButton,
  'dl-delete-annotation-no-button': dlDeleteAnnotationNoButton,
} = DataLabellingSelectors;

export class AnnotationLabelsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSession(): Promise<void> {
    await this.navigate(process.env.DL_SESSION_URL || '/');
  }

  // ── Label Popup ───────────────────────────────────────────────────────────

  async isLabelMenuVisible(): Promise<boolean> {
    return this.isVisible(dlLabelMenu);
  }

  async waitForLabelMenu(): Promise<void> {
    await this.waitForVisible(dlLabelMenu);
  }

  async searchLabel(term: string): Promise<void> {
    await this.waitForVisible(dlLabelMenu);
    await this.fill(dlLabelMenuSearchInput, term);
  }

  async applyLabel(): Promise<void> {
    await this.click(dlLabelMenuApplyButton);
    await this.waitForLoad();
  }

  async isApplyButtonVisible(): Promise<boolean> {
    return this.isVisible(dlLabelMenuApplyButton);
  }

  async isSearchInputVisible(): Promise<boolean> {
    return this.isVisible(dlLabelMenuSearchInput);
  }

  // ── Remove Labels / Delete Confirmation ───────────────────────────────────

  async isDeleteModalVisible(): Promise<boolean> {
    return this.isVisible(dlDeleteAnnotationModal);
  }

  async confirmDeleteAnnotation(): Promise<void> {
    await this.waitForVisible(dlDeleteAnnotationModal);
    await this.click(dlDeleteAnnotationYesButton);
    await this.waitForLoad();
  }

  async cancelDeleteAnnotation(): Promise<void> {
    await this.waitForVisible(dlDeleteAnnotationModal);
    await this.click(dlDeleteAnnotationNoButton);
    await this.waitForHidden(dlDeleteAnnotationModal);
  }

  // ── Config Verification ───────────────────────────────────────────────────

  async isLabelPopupConfigured(): Promise<boolean> {
    return (
      Boolean(dlLabelMenu) &&
      Boolean(dlLabelMenuSearchInput) &&
      Boolean(dlLabelMenuApplyButton)
    );
  }

  async isDeleteConfirmationConfigured(): Promise<boolean> {
    return (
      Boolean(dlDeleteAnnotationModal) &&
      Boolean(dlDeleteAnnotationYesButton) &&
      Boolean(dlDeleteAnnotationNoButton)
    );
  }

  async isSearchInputConfigured(): Promise<boolean> {
    return dlLabelMenuSearchInput.includes('dl-label-menu-search-input');
  }

  async isApplyButtonConfigured(): Promise<boolean> {
    return dlLabelMenuApplyButton.includes('dl-label-menu-apply-button');
  }
}
