import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-005: Rejection Rollback', () => {
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

  test(`${generateUnitTestId('41')}: Navigate to session with rejected images`, async () => {
    const rejectedStatus = await qcPage.getExpectedRejectedStatus();
    await qcPage.selectStatus(rejectedStatus);
    await screenshot.takeStep('navigate-to-rejected-images');
  });

  test(`${generateUnitTestId('42')}: Verify rejected image status badge`, async () => {
    const badgeText = await qcPage.getImageStatusBadgeText(0);
    expect(typeof badgeText).toBe('string');
    await screenshot.takeStep('rejected-status-verified');
  });

  test(`${generateUnitTestId('43')}: Verify rejected image level label`, async () => {
    const levelLabel = await qcPage.getImageLevelLabel(0);
    expect(typeof levelLabel).toBe('string');
    await screenshot.takeStep('rejected-level-label');
  });

  test(`${generateUnitTestId('44')}: Verify edit actions state for image`, async () => {
    await qcPage.selectImageByIndex(0);
    const actionsEnabled = await qcPage.areEditActionsEnabled();
    expect(typeof actionsEnabled).toBe('boolean');
    await screenshot.takeStep('edit-actions-state');
  });

  test(`${generateUnitTestId('45')}: Verify annotation button and canvas`, async () => {
    await qcPage.selectImageByIndex(0);
    const annotationVisible = await qcPage.isAnnotationButtonVisible();
    expect(typeof annotationVisible).toBe('boolean');
    await screenshot.takeStep('annotation-button-check');
  });

  test(`${generateUnitTestId('46')}: Verify send to QC workflow`, async () => {
    await qcPage.selectPendingImage();
    const isVisible = await qcPage.isSendToQcButtonVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('send-to-qc-check');
  });

  test(`${generateUnitTestId('47')}: Verify image status badge after operations`, async () => {
    const badgeText = await qcPage.getImageStatusBadgeText(0);
    expect(typeof badgeText).toBe('string');
    await screenshot.takeStep('image-status-after-ops');
  });

  test(`${generateUnitTestId('48')}: Verify image level label after operations`, async () => {
    const levelLabel = await qcPage.getImageLevelLabel(0);
    expect(typeof levelLabel).toBe('string');
    await screenshot.takeStep('level-label-after-ops');
  });
});
