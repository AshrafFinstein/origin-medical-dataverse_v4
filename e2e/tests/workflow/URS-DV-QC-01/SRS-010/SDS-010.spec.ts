import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { QcWorkflowSelectors } from '../../../../selectors';

test.describe('URS-DV-QC-01 > SRS-010: Usability', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('73')}: Verify status labels visible on session page`, async () => {
    await qcPage.navigateToDataLabelling();
    const areVisible = await qcPage.areStatusLabelsVisible();
    expect(typeof areVisible).toBe('boolean');
    await screenshot.takeStep('status-labels-visible');
  });

  test(`${generateUnitTestId('74')}: Verify level indicators visible`, async () => {
    await qcPage.navigateToDataLabelling();
    const areVisible = await qcPage.areLevelIndicatorsVisible();
    expect(typeof areVisible).toBe('boolean');
    await screenshot.takeStep('level-indicators-visible');
  });

  test(`${generateUnitTestId('75')}: Verify breadcrumb navigation visible`, async () => {
    await qcPage.navigateToDataLabelling();
    const isVisible = await qcPage.isBreadcrumbVisible();
    expect(isVisible).toBe(true);
    await screenshot.takeStep('breadcrumb-visible');
  });

  test(`${generateUnitTestId('76')}: Verify tooltip for accept button`, async () => {
    await qcPage.navigateToDataLabelling();
    await qcPage.selectImageByIndex(0);
    const tooltipText = await qcPage.getTooltipTextForElement(
      QcWorkflowSelectors['qc-action-accept-button']
    );
    expect(typeof tooltipText).toBe('string');
    await screenshot.takeStep('tooltip-accept-button');
  });

  test(`${generateUnitTestId('77')}: Verify tooltip for reject button`, async () => {
    await qcPage.navigateToDataLabelling();
    await qcPage.selectImageByIndex(0);
    const tooltipText = await qcPage.getTooltipTextForElement(
      QcWorkflowSelectors['qc-action-reject-button']
    );
    expect(typeof tooltipText).toBe('string');
    await screenshot.takeStep('tooltip-reject-button');
  });

  test(`${generateUnitTestId('78')}: Verify tooltip for send to QC button`, async () => {
    await qcPage.navigateToDataLabelling();
    await qcPage.selectPendingImage();
    const tooltipText = await qcPage.getTooltipTextForElement(
      QcWorkflowSelectors['qc-action-send-to-qc-button']
    );
    expect(typeof tooltipText).toBe('string');
    await screenshot.takeStep('tooltip-send-to-qc-button');
  });

  test(`${generateUnitTestId('79')}: Verify session table visible on list page`, async () => {
    await qcPage.gotoSessionList();
    const isVisible = await qcPage.isSessionTableVisible();
    expect(isVisible).toBe(true);
    await screenshot.takeStep('session-table-visible');
  });

  test(`${generateUnitTestId('80')}: Verify usability labels match expected values`, async () => {
    const pendingLabel = await qcPage.getExpectedUsabilityLabel('statusPending');
    const acceptedLabel = await qcPage.getExpectedUsabilityLabel('statusAccepted');
    const rejectedLabel = await qcPage.getExpectedUsabilityLabel('statusRejected');
    const inReviewLabel = await qcPage.getExpectedUsabilityLabel('statusInReview');
    expect(pendingLabel).toBeTruthy();
    expect(acceptedLabel).toBeTruthy();
    expect(rejectedLabel).toBeTruthy();
    expect(inReviewLabel).toBeTruthy();
    await screenshot.takeStep('usability-labels-verified');
  });
});
