import { BasePage } from './base.page';
import { JsonUploadFlowModule } from './shared/json-upload-flow.module';

export class AnalyticsUploadPage extends BasePage {
  private readonly jsonUploadFlow: JsonUploadFlowModule;

  constructor(page: BasePage['page']) {
    super(page);
    this.jsonUploadFlow = new JsonUploadFlowModule(this);
  }

  async openCreateSessionFromProject(projectUrl?: string): Promise<void> {
    await this.jsonUploadFlow.openCreateSessionFromProject(projectUrl);
  }

  async ensureDlSessionTab(): Promise<void> {
    await this.jsonUploadFlow.ensureDlSessionTab();
  }

  async setUploadModeLocal(): Promise<void> {
    await this.jsonUploadFlow.setUploadModeLocal();
  }

  async setUploadModeS3(): Promise<void> {
    await this.jsonUploadFlow.setUploadModeS3();
  }

  async selectLocalFiles(filePaths: string[]): Promise<void> {
    await this.jsonUploadFlow.selectLocalFiles(filePaths);
  }

  async uploadFromS3Key(s3Key: string): Promise<void> {
    await this.jsonUploadFlow.uploadFromS3Key(s3Key);
  }

  async getPendingSelectedFileNames(): Promise<string[]> {
    return this.jsonUploadFlow.getPendingSelectedFileNames();
  }

  async getPendingSelectedFileCount(): Promise<number> {
    return this.jsonUploadFlow.getPendingSelectedFileCount();
  }

  async isRemoveControlVisibleForPendingFile(fileName: string): Promise<boolean> {
    return this.jsonUploadFlow.isRemoveControlVisibleForPendingFile(fileName);
  }

  async removePendingFileByName(fileName: string): Promise<void> {
    await this.jsonUploadFlow.removePendingFileByName(fileName);
  }

  async removePendingFileByKeyboard(fileName: string): Promise<void> {
    await this.jsonUploadFlow.removePendingFileByKeyboard(fileName);
  }

  async interactWithNonUploadFieldsAndReturn(): Promise<void> {
    await this.jsonUploadFlow.interactWithNonUploadFieldsAndReturn();
  }

  async isUploadAreaResponsive(): Promise<boolean> {
    return this.jsonUploadFlow.isUploadAreaResponsive();
  }

  async getFileNameRenderInfo(
    fileName: string,
  ): Promise<{ visible: boolean; truncated: boolean; hasTooltip: boolean }> {
    return this.jsonUploadFlow.getFileNameRenderInfo(fileName);
  }

  async isUploadedListAlignedBelowUploadArea(): Promise<boolean> {
    return this.jsonUploadFlow.isUploadedListAlignedBelowUploadArea();
  }
}
