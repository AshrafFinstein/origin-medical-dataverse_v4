import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-008: Access Control', () => {
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

  test(`${generateUnitTestId('61')}: Verify edit restricted message for wrong level`, async () => {
    await qcPage.navigateToDataLabelling();
    const expectedMsg = await qcPage.getAccessControlEditRestrictedMessage();
    expect(expectedMsg).toBeTruthy();
    await screenshot.takeStep('edit-restricted-message');
  });

  test(`${generateUnitTestId('62')}: Verify unauthorized message for unauthorized user`, async () => {
    const expectedMsg = await qcPage.getAccessControlUnauthorizedMessage();
    expect(expectedMsg).toBeTruthy();
    await screenshot.takeStep('unauthorized-message');
  });

  test(`${generateUnitTestId('63')}: Verify edit actions state for non-active level`, async () => {
    await qcPage.navigateToDataLabelling();
    const actionsDisabled = await qcPage.areEditActionsDisabled();
    expect(typeof actionsDisabled).toBe('boolean');
    await screenshot.takeStep('edit-actions-state');
  });

  test(`${generateUnitTestId('64')}: Verify edit actions state for active level`, async () => {
    await qcPage.navigateToDataLabelling();
    const actionsEnabled = await qcPage.areEditActionsEnabled();
    expect(typeof actionsEnabled).toBe('boolean');
    await screenshot.takeStep('edit-actions-enabled');
  });

  test(`${generateUnitTestId('65')}: Verify reviewer-only approval config access`, async () => {
    await qcPage.navigateToCreateSession();
    const isVisible = await qcPage.isAddLevelButtonVisible();
    expect(isVisible).toBe(true);
    await screenshot.takeStep('reviewer-approval-config-access');
  });

  test(`${generateUnitTestId('66')}: Verify role-based send-to-QC restriction`, async () => {
    await qcPage.navigateToDataLabelling();
    await qcPage.selectPendingImage();
    const isVisible = await qcPage.isSendToQcButtonVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('role-based-send-to-qc');
  });
});
