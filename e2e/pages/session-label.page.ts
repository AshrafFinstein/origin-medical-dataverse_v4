import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SessionSelectors, CommonSelectors } from '../selectors';

const { 'master-tab-session-label': masterTabSessionLabel } = CommonSelectors;

const {
  'session-label-create-button': sessionLabelCreateButton,
  'session-label-table': sessionLabelTable,
  'session-label-create-modal': sessionLabelCreateModal,
  'session-label-create-name-input': sessionLabelCreateNameInput,
  'session-label-create-description-input': sessionLabelCreateDescriptionInput,
  'session-label-create-color-picker': sessionLabelCreateColorPicker,
  'session-label-create-cancel-button': sessionLabelCreateCancelButton,
  'session-label-create-submit-button': sessionLabelCreateSubmitButton,
  'session-label-update-button': sessionLabelUpdateButton,
  'session-session-labels-select': sessionLabelsSelect,
} = SessionSelectors;

export class SessionLabelPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoMasters(): Promise<void> {
    await this.navigate('/master');
    await this.waitForLoad();
  }

  async switchToSessionLabelTab(): Promise<void> {
    await this.click(masterTabSessionLabel);
    await this.waitForLoad();
  }

  async isTableVisible(): Promise<boolean> {
    return this.isVisible(sessionLabelTable);
  }

  // ── Create ────────────────────────────────────────────────────────────────

  async openCreateModal(): Promise<void> {
    await this.click(sessionLabelCreateButton);
    await this.waitForVisible(sessionLabelCreateModal);
  }

  async fillName(name: string): Promise<void> {
    await this.fill(sessionLabelCreateNameInput, name);
  }

  async fillDescription(description: string): Promise<void> {
    await this.fill(sessionLabelCreateDescriptionInput, description);
  }

  async openColorPicker(): Promise<void> {
    await this.click(sessionLabelCreateColorPicker);
  }

  async cancelCreate(): Promise<void> {
    await this.click(sessionLabelCreateCancelButton);
    await this.waitForHidden(sessionLabelCreateModal);
  }

  async submitCreate(): Promise<void> {
    await this.click(sessionLabelCreateSubmitButton);
    await this.waitForSuccess();
    await this.waitForLoad();
  }

  async createSessionLabel(name: string, description?: string): Promise<void> {
    await this.openCreateModal();
    await this.fillName(name);
    if (description) await this.fillDescription(description);
    await this.submitCreate();
  }

  // ── Verification ──────────────────────────────────────────────────────────

  async isCreateModalVisible(): Promise<boolean> {
    return this.isVisible(sessionLabelCreateModal);
  }

  async verifyLabelInTable(name: string): Promise<boolean> {
    const text = await this.getText(sessionLabelTable);
    return text.includes(name);
  }

  async isSessionLabelTabVisible(): Promise<boolean> {
    return this.isVisible(masterTabSessionLabel);
  }

  async isCreateButtonConfigured(): Promise<boolean> {
    return (
      Boolean(sessionLabelCreateButton) &&
      sessionLabelCreateButton.includes('session-label-create-button')
    );
  }

  async isColorPickerConfigured(): Promise<boolean> {
    return Boolean(sessionLabelCreateColorPicker);
  }

  async isUpdateButtonConfigured(): Promise<boolean> {
    return Boolean(sessionLabelUpdateButton);
  }

  async isSessionLabelSelectConfigured(): Promise<boolean> {
    return Boolean(sessionLabelsSelect);
  }

  async areAllCreateFieldsConfigured(): Promise<boolean> {
    return (
      Boolean(sessionLabelCreateNameInput) &&
      Boolean(sessionLabelCreateDescriptionInput) &&
      Boolean(sessionLabelCreateColorPicker) &&
      Boolean(sessionLabelCreateCancelButton) &&
      Boolean(sessionLabelCreateSubmitButton)
    );
  }

  async isMastersPageUrl(): Promise<boolean> {
    const url = await this.getUrl();
    return url.includes('/master');
  }
}
