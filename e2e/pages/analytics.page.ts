import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AnalyticsSelectors, getDynamicSelector } from '../selectors';
import { AnalyticsData } from '../test-data';

const {
  'session-total-time-display': sessionTotalTimeDisplay,
  'image-active-timer': imageActiveTimer,
  'json-upload-file-name-${index}': jsonUploadFileNameTemplate,
  'json-upload-file-list': jsonUploadFileList,
  'json-upload-success-message': jsonUploadSuccessMessage,
} = AnalyticsSelectors;

const { timing, jsonFile, timeOnTask } = AnalyticsData;

export class AnalyticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSession(): Promise<void> {
    await this.navigate(process.env.DL_SESSION_URL || '/');
  }

  // ── Time on Task ──────────────────────────────────────────────────────────

  async isSessionTimerVisible(): Promise<boolean> {
    return this.isVisible(sessionTotalTimeDisplay);
  }

  async isImageTimerVisible(): Promise<boolean> {
    return this.isVisible(imageActiveTimer);
  }

  async getSessionTimeDisplay(): Promise<string> {
    return this.getText(sessionTotalTimeDisplay);
  }

  // ── JSON Filename Display ─────────────────────────────────────────────────

  async isFileListVisible(): Promise<boolean> {
    return this.isVisible(jsonUploadFileList);
  }

  async getUploadedFileName(index: number): Promise<string> {
    return this.getText(getDynamicSelector(jsonUploadFileNameTemplate, { index }));
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return this.isVisible(jsonUploadSuccessMessage);
  }

  async getFileCount(): Promise<number> {
    return this.getCount(jsonUploadFileList);
  }

  // ── Config Verification ───────────────────────────────────────────────────

  async isTimerConfigured(): Promise<boolean> {
    return Boolean(sessionTotalTimeDisplay) && Boolean(imageActiveTimer);
  }

  async isJsonFilenameConfigured(): Promise<boolean> {
    return Boolean(jsonUploadFileList) && Boolean(jsonUploadSuccessMessage);
  }

  getMaxGridRenderTime(): number {
    return timing.gridRenderMaxMs;
  }

  getMaxUploadProcessTime(): number {
    return timing.uploadProcessMaxMs;
  }

  getAllowedFileExtension(): string {
    return jsonFile.allowedExtension;
  }

  getTimeUnit(): string {
    return timeOnTask.unit;
  }

  getTimeDisplayFormat(): string {
    return timeOnTask.displayFormat;
  }

  getAccuracyMarginMs(): number {
    return timeOnTask.accuracyMarginMs;
  }
}
