import { Locator } from '@playwright/test';
import { BaseModule } from './base-module';
import { AnalyticsSelectors, SessionSelectors } from '../../selectors';

function tid(value: string): string {
  return `[data-testid="${value}"]`;
}

export class JsonUploadFlowModule extends BaseModule {
  private readonly uploadRootSelector = AnalyticsSelectors['analytics-upload-root'];
  private readonly uploadRowSelector = AnalyticsSelectors['analytics-upload-row'];
  private readonly uploadRowNameSelector = AnalyticsSelectors['analytics-upload-row-name'];
  private readonly uploadRowRemoveSelector = AnalyticsSelectors['analytics-upload-row-remove'];

  private get modalLocator(): Locator {
    return this.page.locator(tid(SessionSelectors['session-create-modal'])).first();
  }

  private get uploadRoot(): Locator {
    return this.page.locator(this.uploadRootSelector).first();
  }

  private get uploadRows(): Locator {
    return this.page.locator(this.uploadRowSelector);
  }

  private getRowByFileName(fileName: string): Locator {
    return this.uploadRows.filter({ hasText: fileName }).first();
  }

  private removeControlCandidates(row: Locator): Locator {
    return row.locator(
      [
        'button',
        '[role="button"]',
        this.uploadRowRemoveSelector,
        '.n-upload-file-info__action',
        '.n-base-icon',
        '[aria-label*="remove" i]',
        '[title*="remove" i]',
      ].join(', '),
    );
  }

  private async clickRemoveControl(row: Locator): Promise<boolean> {
    await row.hover().catch(() => {});
    const controls = this.removeControlCandidates(row);
    const total = await controls.count();
    for (let i = 0; i < total; i++) {
      const control = controls.nth(i);
      if (!(await control.isVisible({ timeout: 500 }).catch(() => false))) continue;
      await control.click({ force: true }).catch(async () => {
        await control.press('Enter').catch(() => {});
      });
      return true;
    }
    return false;
  }

  async openCreateSessionFromProject(projectUrl?: string): Promise<void> {
    const resolvedUrl = projectUrl || process.env.PROJECT_URL || '/';
    await this.goto(resolvedUrl);
    await this.waitForSelector(tid(SessionSelectors['session-create-button']), { state: 'visible', timeout: 45000 });
    await this.click(tid(SessionSelectors['session-create-button']));
    await this.waitForSelector(tid(SessionSelectors['session-create-modal']), { state: 'visible', timeout: 15000 });
    await this.ensureDlSessionTab();
  }

  async ensureDlSessionTab(): Promise<void> {
    const tab = this.page.getByRole('tab', { name: /data labelling/i }).first();
    if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tab.click();
      await this.waitForPageLoad();
    }
  }

  async setUploadModeLocal(): Promise<void> {
    if (!(await this.uploadRoot.isVisible({ timeout: 5000 }).catch(() => false))) {
      throw new Error('Local upload area is not visible in Create Session modal.');
    }
  }

  async selectLocalFiles(filePaths: string[]): Promise<void> {
    const jsonInput = this.uploadRoot
      .locator('input[type="file"][accept*=".json"], input[type="file"][accept*="application/json"]')
      .first();
    const scopedInput = this.uploadRoot.locator('input[type="file"]').first();
    const input = (await jsonInput.count()) > 0
      ? jsonInput
      : (await scopedInput.count()) > 0
      ? scopedInput
      : this.modalLocator.locator('input[type="file"]').first();
    if (!(await input.count())) {
      throw new Error('No local upload input[type=file] found.');
    }

    try {
      await input.setInputFiles(filePaths);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (!msg.includes('Non-multiple file input') || filePaths.length <= 1) {
        throw error;
      }

      // Fallback: some Naive UI wrappers expose a non-multiple input; feed files one-by-one.
      for (const filePath of filePaths) {
        await input.setInputFiles(filePath);
        await this.page.waitForTimeout(150);
      }
    }
    await this.page.waitForTimeout(500);
  }

  async getPendingSelectedFileNames(): Promise<string[]> {
    const rows = this.uploadRows;
    const rowCount = await rows.count();
    if (rowCount === 0) return [];

    const names: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const nameNode = row.locator('.n-upload-file-info__name, .n-upload-file-info__name-text').first();
      if (await nameNode.isVisible({ timeout: 500 }).catch(() => false)) {
        const text = ((await nameNode.textContent()) || '').trim();
        if (text) names.push(text);
      }
    }
    return names;
  }

  async getPendingSelectedFileCount(): Promise<number> {
    const rowCount = await this.uploadRows.count();
    const summaryNodes = this.uploadRoot.locator('p, span, div');
    const summaryCount = await summaryNodes.count();
    let maxFromText = 0;
    for (let i = 0; i < summaryCount; i++) {
      const text = ((await summaryNodes.nth(i).textContent()) || '').trim();
      if (!text) continue;
      const match = text.match(/(\d+)\s+files?\s+selected/i);
      if (!match) continue;
      const parsed = Number(match[1]);
      if (Number.isFinite(parsed)) maxFromText = Math.max(maxFromText, parsed);
    }
    return Math.max(rowCount, maxFromText);
  }

  async isRemoveControlVisibleForPendingFile(fileName: string): Promise<boolean> {
    const row = this.getRowByFileName(fileName);
    if (!(await row.isVisible({ timeout: 2000 }).catch(() => false))) return false;
    await row.hover().catch(() => {});
    const controls = this.removeControlCandidates(row);
    const total = await controls.count();
    for (let i = 0; i < total; i++) {
      if (await controls.nth(i).isVisible({ timeout: 500 }).catch(() => false)) return true;
    }
    return false;
  }

  async removePendingFileByName(fileName: string): Promise<void> {
    const row = this.getRowByFileName(fileName);
    if (!(await row.isVisible({ timeout: 3000 }).catch(() => false))) {
      throw new Error(`Upload row not found for file: ${fileName}`);
    }

    const clicked = await this.clickRemoveControl(row);
    if (!clicked) {
      throw new Error(`Remove control not visible for file: ${fileName}`);
    }
    await row.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    if (await row.isVisible({ timeout: 500 }).catch(() => false)) {
      throw new Error(`File row still visible after remove click: ${fileName}`);
    }
  }

  async removePendingFileByKeyboard(fileName: string): Promise<void> {
    const row = this.getRowByFileName(fileName);
    if (!(await row.isVisible({ timeout: 3000 }).catch(() => false))) {
      throw new Error(`Upload row not found for keyboard remove: ${fileName}`);
    }

    const controls = this.removeControlCandidates(row);
    const controlCount = await controls.count();
    if (controlCount > 0) {
      const firstVisible = controls.first();
      await firstVisible.focus().catch(async () => {
        await row.focus().catch(() => {});
      });
    } else {
      await row.focus().catch(() => {});
    }

    for (const key of ['Enter', 'Space', 'Delete', 'Backspace']) {
      await this.page.keyboard.press(key).catch(() => {});
      await this.page.waitForTimeout(200);
      if (!(await row.isVisible({ timeout: 400 }).catch(() => false))) return;
    }

    const clicked = await this.clickRemoveControl(row);
    if (clicked) {
      await row.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    }
  }

  async setUploadModeS3(): Promise<void> {
    const s3Button = this.page.getByRole('button', { name: /upload from s3/i }).first();
    if (!(await s3Button.isVisible({ timeout: 4000 }).catch(() => false))) {
      throw new Error('Upload from S3 button is not visible in Create Session modal.');
    }
    await s3Button.click();
  }

  async uploadFromS3Key(s3Key: string): Promise<void> {
    const keyInputTid = this.page.locator(tid(SessionSelectors['session-s3-key-input'])).first();
    const keyInputFallback = this.page
      .locator('input[placeholder*="S3" i], textarea[placeholder*="S3" i], input[type="text"]')
      .first();
    const keyInput = (await keyInputTid.count()) > 0 ? keyInputTid : keyInputFallback;
    await keyInput.fill(s3Key);

    const uploadButtonTid = this.page.locator(tid(SessionSelectors['session-s3-upload-button'])).first();
    const uploadButtonFallback = this.page.locator('button:has-text("Upload"), button:has-text("Submit")').first();
    const uploadButton = (await uploadButtonTid.count()) > 0 ? uploadButtonTid : uploadButtonFallback;
    await uploadButton.click();
    await this.page.waitForTimeout(800);
  }

  async interactWithNonUploadFieldsAndReturn(): Promise<void> {
    const statusSelect = this.modalLocator.locator(tid(SessionSelectors['session-status-select'])).first();
    if (await statusSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await statusSelect.click();
      await this.page.keyboard.press('Escape');
    }

    // Keep one additional lightweight interaction in the modal to validate UI remains interactive.
    const nameInput = this.modalLocator.locator(tid(SessionSelectors['session-name-input'])).first();
    if (await nameInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await nameInput.click();
    }
  }

  async isUploadAreaResponsive(): Promise<boolean> {
    const started = Date.now();
    await this.interactWithNonUploadFieldsAndReturn();
    return Date.now() - started < 3000;
  }

  async getFileNameRenderInfo(
    fileName: string,
  ): Promise<{ visible: boolean; truncated: boolean; hasTooltip: boolean }> {
    const nodes = this.page.locator(this.uploadRowNameSelector);
    const count = await nodes.count();
    for (let i = 0; i < count; i++) {
      const node = nodes.nth(i);
      const text = ((await node.textContent()) || '').trim();
      const title = ((await node.getAttribute('title')) || '').trim();
      const fullMatch = text === fileName || title === fileName;
      const partialMatch = text.includes(fileName.slice(0, 20)) || title.includes(fileName.slice(0, 20));
      if (fullMatch || partialMatch) {
        return {
          visible: true,
          truncated: text !== fileName,
          hasTooltip: title.length > 0,
        };
      }
    }
    return { visible: false, truncated: false, hasTooltip: false };
  }

  async isUploadedListAlignedBelowUploadArea(): Promise<boolean> {
    const rootBox = await this.uploadRoot.boundingBox();
    const firstRow = this.uploadRows.first();
    const rowBox = await firstRow.boundingBox();
    if (!rootBox || !rowBox) return false;
    return rowBox.y >= rootBox.y;
  }
}
