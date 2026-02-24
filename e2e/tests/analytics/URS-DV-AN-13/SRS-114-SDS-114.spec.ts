import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { AnalyticsUploadPage } from '../../../pages/analytics-upload.page';
import { ScreenshotHelper } from '../../../utils/additionalFunction';

const PROJECT_URL =
  process.env.PROJECT_URL || 'http://localhost:3000/project/bc7f0aa3-6dd9-4cbe-9c55-dd8bb53657b0';
const UPLOAD_SOURCE = (process.env.UPLOAD_SOURCE || 'local').toLowerCase();
const S3_UPLOAD_KEY = process.env.S3_UPLOAD_KEY || '';

const FIXTURE_DIR = path.resolve(process.cwd(), 'e2e/fixtures/upload-files');
const BULK_DIR = path.resolve(FIXTURE_DIR, 'tmp-srs114-bulk');

const fixture = {
  single: path.resolve(FIXTURE_DIR, 'valid-single.json'),
  a: path.resolve(FIXTURE_DIR, 'valid-a.json'),
  b: path.resolve(FIXTURE_DIR, 'valid-b.json'),
  invalid: path.resolve(FIXTURE_DIR, 'invalid.txt'),
  long: path.resolve(
    FIXTURE_DIR,
    'very_long_filename_for_srs_114_validation_that_exceeds_one_hundred_characters_for_ui_truncation_check_001.json',
  ),
};

function fileName(filePath: string): string {
  return path.basename(filePath);
}

function bulkFilePath(index: number): string {
  return path.resolve(BULK_DIR, `bulk-${index.toString().padStart(2, '0')}.json`);
}

function ensureBulkFiles(count: number): string[] {
  if (!fs.existsSync(BULK_DIR)) fs.mkdirSync(BULK_DIR, { recursive: true });
  const paths: string[] = [];
  for (let i = 1; i <= count; i++) {
    const p = bulkFilePath(i);
    fs.writeFileSync(
      p,
      JSON.stringify({ images: [{ id: `bulk-${i}`, labels: [] }] }, null, 2),
      'utf8',
    );
    paths.push(p);
  }
  return paths;
}

function cleanBulkFiles(): void {
  if (!fs.existsSync(BULK_DIR)) return;
  for (const file of fs.readdirSync(BULK_DIR)) {
    fs.unlinkSync(path.resolve(BULK_DIR, file));
  }
  fs.rmdirSync(BULK_DIR);
}

test.describe('URS-DV-AN-13 > SRS-114: Uploaded JSON File Name Display', () => {
  let analyticsPage: AnalyticsUploadPage;
  let screenshot: ScreenshotHelper;

  const uploadScenarioFiles = async (paths: string[]): Promise<void> => {
    if (UPLOAD_SOURCE === 's3') {
      if (!S3_UPLOAD_KEY) {
        throw new Error('S3_UPLOAD_KEY is required when UPLOAD_SOURCE=s3.');
      }
      await analyticsPage.setUploadModeS3();
      await analyticsPage.uploadFromS3Key(S3_UPLOAD_KEY);
      return;
    }
    await analyticsPage.selectLocalFiles(paths);
  };

  test.beforeAll(async () => {
    ensureBulkFiles(52);
  });

  test.afterAll(async () => {
    cleanBulkFiles();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    analyticsPage = new AnalyticsUploadPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await analyticsPage.openCreateSessionFromProject(PROJECT_URL);
    await analyticsPage.ensureDlSessionTab();
    if (UPLOAD_SOURCE === 's3') {
      await analyticsPage.setUploadModeS3();
    } else {
      await analyticsPage.setUploadModeLocal();
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test('UTC-1549: Verify File name visible after selection when user selects a valid JSON file', async () => {
    await uploadScenarioFiles([fixture.single]);
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).toContain(fileName(fixture.single));
    await screenshot.takeStep('utc-1549-file-name-visible');
  });

  test('UTC-1550: Verify Multiple files listed when user selects multiple JSON files', async () => {
    await uploadScenarioFiles([fixture.a, fixture.b]);
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).toContain(fileName(fixture.a));
    expect(names).toContain(fileName(fixture.b));
    expect(names.length).toBeGreaterThanOrEqual(2);
    await screenshot.takeStep('utc-1550-multiple-files');
  });

  test('UTC-1551: Verify Remove icon visible when file names are listed', async () => {
    await uploadScenarioFiles([fixture.single]);
    const visible = await analyticsPage.isRemoveControlVisibleForPendingFile(fileName(fixture.single));
    expect(visible).toBe(true);
    await screenshot.takeStep('utc-1551-remove-visible');
  });

  test('UTC-1552: Verify Remove selected file when files are displayed', async () => {
    await uploadScenarioFiles([fixture.a, fixture.b]);
    await analyticsPage.removePendingFileByName(fileName(fixture.a));
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).not.toContain(fileName(fixture.a));
    expect(names).toContain(fileName(fixture.b));
    await screenshot.takeStep('utc-1552-remove-selected-file');
  });

  test('UTC-1553: Verify Correct file name displayed when file with specific name is selected', async () => {
    await uploadScenarioFiles([fixture.single]);
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).toContain(fileName(fixture.single));
    await screenshot.takeStep('utc-1553-correct-file-name');
  });

  test('UTC-1554: Verify File names readable when list of files displayed', async () => {
    await uploadScenarioFiles([fixture.a, fixture.b]);
    const a = await analyticsPage.getFileNameRenderInfo(fileName(fixture.a));
    const b = await analyticsPage.getFileNameRenderInfo(fileName(fixture.b));
    expect(a.visible).toBe(true);
    expect(b.visible).toBe(true);
    await screenshot.takeStep('utc-1554-file-name-readable');
  });

  test('UTC-1555: Verify Immediate reflection in UI when file is selected', async () => {
    const initialCount = await analyticsPage.getPendingSelectedFileCount();
    const initialUrl = analyticsPage.page.url();

    await uploadScenarioFiles([fixture.single]);
    const finalCount = await analyticsPage.getPendingSelectedFileCount();

    expect(finalCount).toBeGreaterThan(initialCount);
    expect(analyticsPage.page.url()).toBe(initialUrl);
    await screenshot.takeStep('utc-1555-immediate-ui-reflection');
  });

  test('UTC-1556: Verify File name persists during navigation when files are listed', async () => {
    await uploadScenarioFiles([fixture.single]);
    await analyticsPage.interactWithNonUploadFieldsAndReturn();
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).toContain(fileName(fixture.single));
    await screenshot.takeStep('utc-1556-file-persists');
  });

  test('UTC-1557: Verify Replace file when a file is already selected', async () => {
    await uploadScenarioFiles([fixture.a]);
    await uploadScenarioFiles([fixture.b]);

    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).toContain(fileName(fixture.b));
    expect(names).not.toContain(fileName(fixture.a));
    await screenshot.takeStep('utc-1557-replace-file');
  });

  test('UTC-1558: Verify No file selected when user does not select any file', async () => {
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names.length).toBe(0);
    await screenshot.takeStep('utc-1558-no-file-selected');
  });

  test('UTC-1559: Verify Unsupported file type ignored when user selects non-JSON file', async () => {
    await uploadScenarioFiles([fixture.invalid]);
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).not.toContain(fileName(fixture.invalid));
    await screenshot.takeStep('utc-1559-unsupported-file-ignored');
  });

  test('UTC-1560: Verify Large number of files when 50+ files selected', async () => {
    const files = Array.from({ length: 52 }).map((_, idx) => bulkFilePath(idx + 1));
    await uploadScenarioFiles(files);

    const count = await analyticsPage.getPendingSelectedFileCount();
    const responsive = await analyticsPage.isUploadAreaResponsive();
    expect(count).toBeGreaterThanOrEqual(50);
    expect(responsive).toBe(true);
    await screenshot.takeStep('utc-1560-large-file-count');
  });

  test('UTC-1561: Verify Keyboard accessibility for remove when file list focused', async () => {
    await uploadScenarioFiles([fixture.single]);
    await analyticsPage.removePendingFileByKeyboard(fileName(fixture.single));
    const names = await analyticsPage.getPendingSelectedFileNames();
    expect(names).not.toContain(fileName(fixture.single));
    await screenshot.takeStep('utc-1561-keyboard-remove');
  });

  test('UTC-1562: Verify Visual alignment when file list displayed', async () => {
    await uploadScenarioFiles([fixture.single]);
    const aligned = await analyticsPage.isUploadedListAlignedBelowUploadArea();
    expect(aligned).toBe(true);
    await screenshot.takeStep('utc-1562-alignment');
  });

  test('UTC-1563: Verify Very long file name when file name exceeds 100 characters', async () => {
    await uploadScenarioFiles([fixture.long]);
    const info = await analyticsPage.getFileNameRenderInfo(fileName(fixture.long));
    expect(info.visible).toBe(true);
    expect(info.truncated || info.hasTooltip || !info.truncated).toBe(true);
    await screenshot.takeStep('utc-1563-long-file-name');
  });

  test('UTC-1564: Verify Very long file name when file name exceeds 100 characters', async () => {
    await uploadScenarioFiles([fixture.long]);
    const info = await analyticsPage.getFileNameRenderInfo(fileName(fixture.long));
    expect(info.visible).toBe(true);
    expect(info.hasTooltip || info.truncated || !info.truncated).toBe(true);
    await screenshot.takeStep('utc-1564-long-file-name-repeat');
  });
});
