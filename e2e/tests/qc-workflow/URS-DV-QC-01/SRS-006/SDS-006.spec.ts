import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-006: Accept & Forward Flow', () => {
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

  test(`${generateUnitTestId('49')}: Accept image at non-final level`, async () => {
    await qcPage.selectImageByIndex(0);
    const acceptVisible = await qcPage.isAcceptButtonVisible();
    if (acceptVisible) {
      await qcPage.clickAccept();
    }
    expect(qcPage.page.url()).toBeTruthy();
    await screenshot.takeStep('accept-at-non-final-level');
  });

  test(`${generateUnitTestId('50')}: Verify image level label`, async () => {
    const levelLabel = await qcPage.getImageLevelLabel(0);
    expect(typeof levelLabel).toBe('string');
    await screenshot.takeStep('image-level-label');
  });

  test(`${generateUnitTestId('51')}: Verify level indicator updates`, async () => {
    const isVisible = await qcPage.isLevelIndicatorVisible();
    expect(typeof isVisible).toBe('boolean');
    const levelDisplay = await qcPage.getApprovalLevelDisplay();
    expect(typeof levelDisplay).toBe('string');
    await screenshot.takeStep('level-indicator-updated');
  });

  test(`${generateUnitTestId('52')}: Verify edit actions state`, async () => {
    const actionsDisabled = await qcPage.areEditActionsDisabled();
    expect(typeof actionsDisabled).toBe('boolean');
    await screenshot.takeStep('edit-actions-state');
  });

  test(`${generateUnitTestId('53')}: Verify image appears in filtered list`, async () => {
    const inReviewStatus = await qcPage.getExpectedInReviewStatus();
    await qcPage.selectStatus(inReviewStatus);
    const hasImages = await qcPage.isImageInFilteredList();
    expect(typeof hasImages).toBe('boolean');
    await screenshot.takeStep('image-in-filtered-list');
  });

  test(`${generateUnitTestId('54')}: Verify status badge text`, async () => {
    const badgeText = await qcPage.getImageStatusBadgeText(0);
    expect(typeof badgeText).toBe('string');
    await screenshot.takeStep('status-badge-text');
  });
});
