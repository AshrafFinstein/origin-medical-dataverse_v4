import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { VersionTrackerSelectors, getDynamicSelector } from '../selectors';
import { VersionTrackerData } from '../test-data';

const {
  'version-tracker-button': versionTrackerButton,
  'version-tracker-panel': versionTrackerPanel,
  'version-list': versionList,
  'version-item-${index}': versionItemTemplate,
  'version-number-${index}': versionNumberTemplate,
  'version-date-${index}': versionDateTemplate,
  'version-user-${index}': versionUserTemplate,
  'version-download-button': versionDownloadButton,
  'version-select-radio-${index}': versionSelectRadioTemplate,
} = VersionTrackerSelectors;

const { metadataFields, immutable, errorMessages } = VersionTrackerData;

export class VersionTrackerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSession(): Promise<void> {
    await this.navigate(process.env.DL_SESSION_URL || '/');
  }

  // ── Panel ─────────────────────────────────────────────────────────────────

  async openVersionPanel(): Promise<void> {
    await this.click(versionTrackerButton);
    await this.waitForVisible(versionTrackerPanel);
  }

  async isPanelVisible(): Promise<boolean> {
    return this.isVisible(versionTrackerPanel);
  }

  async isVersionListVisible(): Promise<boolean> {
    return this.isVisible(versionList);
  }

  async getVersionCount(): Promise<number> {
    return this.getCount(versionList);
  }

  // ── Version Selection & Download ──────────────────────────────────────────

  async selectVersion(index: number): Promise<void> {
    await this.click(getDynamicSelector(versionSelectRadioTemplate, { index }));
  }

  async getVersionNumber(index: number): Promise<string> {
    return this.getText(getDynamicSelector(versionNumberTemplate, { index }));
  }

  async getVersionDate(index: number): Promise<string> {
    return this.getText(getDynamicSelector(versionDateTemplate, { index }));
  }

  async getVersionUser(index: number): Promise<string> {
    return this.getText(getDynamicSelector(versionUserTemplate, { index }));
  }

  async downloadSelectedVersion(): Promise<void> {
    await this.click(versionDownloadButton);
  }

  async isDownloadButtonVisible(): Promise<boolean> {
    return this.isVisible(versionDownloadButton);
  }

  async selectAndDownload(index: number): Promise<void> {
    await this.selectVersion(index);
    await this.downloadSelectedVersion();
  }

  // ── Config Verification ───────────────────────────────────────────────────

  async isVersionTrackerConfigured(): Promise<boolean> {
    return (
      Boolean(versionTrackerButton) &&
      Boolean(versionTrackerPanel) &&
      Boolean(versionDownloadButton)
    );
  }

  async areMetadataFieldsConfigured(): Promise<boolean> {
    return metadataFields.length === 3 && metadataFields.includes('Version');
  }

  async isImmutableFlagSet(): Promise<boolean> {
    return immutable === true;
  }

  async isVersionListConfigured(): Promise<boolean> {
    return Boolean(versionList) && Boolean(versionItemTemplate);
  }

  async isSelectAndDownloadConfigured(): Promise<boolean> {
    return Boolean(versionSelectRadioTemplate) && Boolean(versionDownloadButton);
  }

  getNoVersionsMessage(): string {
    return errorMessages.noVersions;
  }

  getMetadataFields(): string[] {
    return metadataFields;
  }
}
