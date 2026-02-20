import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SessionSelectors } from '../selectors';

const {
  'session-s3-modal': sessionS3Modal,
  'session-s3-key-input': sessionS3KeyInput,
  'session-s3-upload-button': sessionS3UploadButton,
  'session-import-csv-button': sessionImportCsvButton,
  'session-create-button': sessionCreateButton,
  'session-create-modal': sessionCreateModal,
} = SessionSelectors;

export class S3StoragePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSession(): Promise<void> {
    await this.navigate(process.env.SESSION_URL || '/');
  }

  // ── S3 Upload ─────────────────────────────────────────────────────────────

  async openSessionCreate(): Promise<void> {
    await this.click(sessionCreateButton);
    await this.waitForVisible(sessionCreateModal);
  }

  async isS3ModalVisible(): Promise<boolean> {
    return this.isVisible(sessionS3Modal);
  }

  async fillS3Key(key: string): Promise<void> {
    await this.fill(sessionS3KeyInput, key);
  }

  async clearS3Key(): Promise<void> {
    await this.clearAndFill(sessionS3KeyInput, '');
  }

  async clickS3Upload(): Promise<void> {
    await this.click(sessionS3UploadButton);
    await this.waitForLoad();
  }

  async uploadFromS3(key: string): Promise<void> {
    await this.waitForVisible(sessionS3Modal);
    await this.fillS3Key(key);
    await this.clickS3Upload();
  }

  async waitForS3Success(): Promise<void> {
    await this.waitForSuccess();
  }

  // ── Verification ──────────────────────────────────────────────────────────

  async isS3UploadConfigured(): Promise<boolean> {
    return (
      Boolean(sessionS3Modal) &&
      Boolean(sessionS3KeyInput) &&
      Boolean(sessionS3UploadButton)
    );
  }

  async isCsvImportConfigured(): Promise<boolean> {
    return Boolean(sessionImportCsvButton);
  }

  async isS3KeyInputConfigured(): Promise<boolean> {
    return sessionS3KeyInput.includes('session-s3-key-input');
  }

  async isS3UploadButtonConfigured(): Promise<boolean> {
    return sessionS3UploadButton.includes('session-s3-upload-button');
  }

  async isS3ModalConfigured(): Promise<boolean> {
    return sessionS3Modal.includes('session-s3-modal');
  }
}
