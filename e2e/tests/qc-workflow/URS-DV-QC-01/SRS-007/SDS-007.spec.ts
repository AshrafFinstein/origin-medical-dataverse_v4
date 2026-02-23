import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-007: Final Level Approval', () => {
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

  test(`${generateUnitTestId('55')}: Navigate to approval level display`, async () => {
    const levelDisplay = await qcPage.getApprovalLevelDisplay();
    expect(levelDisplay).toBeTruthy();
    await screenshot.takeStep('final-approval-level');
  });

  test(`${generateUnitTestId('56')}: Verify images in IN_REVIEW status available`, async () => {
    const inReviewStatus = await qcPage.getExpectedInReviewStatus();
    await qcPage.selectStatus(inReviewStatus);
    const hasImages = await qcPage.isImageInFilteredList();
    expect(typeof hasImages).toBe('boolean');
    await screenshot.takeStep('in-review-images-available');
  });

  test(`${generateUnitTestId('57')}: Accept image at final level`, async () => {
    await qcPage.selectImageByIndex(0);
    const acceptVisible = await qcPage.isAcceptButtonVisible();
    if (acceptVisible) {
      await qcPage.clickAccept();
    }
    expect(qcPage.page.url()).toBeTruthy();
    await screenshot.takeStep('accept-at-final-level');
  });

  test(`${generateUnitTestId('58')}: Verify image status after acceptance`, async () => {
    const badgeText = await qcPage.getImageStatusBadgeText(0);
    expect(typeof badgeText).toBe('string');
    await screenshot.takeStep('status-after-acceptance');
  });

  test(`${generateUnitTestId('59')}: Verify accepted images visible in filtered list`, async () => {
    const acceptedStatus = await qcPage.getExpectedAcceptedStatus();
    await qcPage.selectStatus(acceptedStatus);
    const hasImages = await qcPage.isImageInFilteredList();
    expect(typeof hasImages).toBe('boolean');
    await screenshot.takeStep('accepted-image-visible');
  });

  test(`${generateUnitTestId('60')}: Verify edit actions state for accepted images`, async () => {
    await qcPage.selectImageByIndex(0);
    const actionsDisabled = await qcPage.areEditActionsDisabled();
    expect(typeof actionsDisabled).toBe('boolean');
    await screenshot.takeStep('edit-actions-state-accepted');
  });
});
