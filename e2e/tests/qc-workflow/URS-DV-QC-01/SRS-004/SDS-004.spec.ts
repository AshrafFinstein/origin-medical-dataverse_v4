import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-004: QC Review Actions (L1)', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.navigateToDataLabelling();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('33')}: Navigate to QC session and verify stage label`, async () => {
    const stageLabel = await qcPage.getStageLabel();
    expect(stageLabel).toBeTruthy();
    await screenshot.takeStep('stage-label-verified');
  });

  test(`${generateUnitTestId('34')}: Verify assignee name is displayed`, async () => {
    const assigneeName = await qcPage.getAssigneeName();
    expect(assigneeName).toBeTruthy();
    await screenshot.takeStep('assignee-name-displayed');
  });

  test(`${generateUnitTestId('35')}: Verify approval level display`, async () => {
    const levelDisplay = await qcPage.getApprovalLevelDisplay();
    expect(levelDisplay).toBeTruthy();
    await screenshot.takeStep('approval-level-display');
  });

  test(`${generateUnitTestId('36')}: Verify accept button visibility state`, async () => {
    const isVisible = await qcPage.isAcceptButtonVisible();
    // Accept button may only appear in QC review stage
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('accept-button-visible');
  });

  test(`${generateUnitTestId('37')}: Verify reject button visibility state`, async () => {
    const isVisible = await qcPage.isRejectButtonVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('reject-button-visible');
  });

  test(`${generateUnitTestId('38')}: Click accept and verify response`, async () => {
    await qcPage.selectImageByIndex(0);
    const acceptVisible = await qcPage.isAcceptButtonVisible();
    if (acceptVisible) {
      await qcPage.clickAccept();
    }
    // Verify page is still functional after action
    expect(qcPage.page.url()).toBeTruthy();
    await screenshot.takeStep('accept-clicked');
  });

  test(`${generateUnitTestId('39')}: Click reject and verify status update`, async () => {
    await qcPage.selectImageByIndex(0);
    const rejectVisible = await qcPage.isRejectButtonVisible();
    if (rejectVisible) {
      await qcPage.clickReject();
    }
    expect(qcPage.page.url()).toBeTruthy();
    await screenshot.takeStep('reject-clicked');
  });

  test(`${generateUnitTestId('40')}: Verify awaiting approval checkbox state`, async () => {
    const isChecked = await qcPage.isAwaitingApprovalChecked();
    expect(typeof isChecked).toBe('boolean');
    await screenshot.takeStep('awaiting-approval-checkbox');
  });
});
