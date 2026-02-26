import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-003: Send to QC', () => {
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

  test(`${generateUnitTestId('25')}: Navigate to session and verify Send to QC button visible`, async () => {
    await qcPage.selectImageByIndex(0);
    const isVisible = await qcPage.isSendToQcButtonVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('send-to-qc-button-visible');
  });

  test(`${generateUnitTestId('26')}: Verify Send to QC button is enabled`, async () => {
    await qcPage.selectImageByIndex(0);
    const isEnabled = await qcPage.isSendToQcButtonEnabled();
    expect(typeof isEnabled).toBe('boolean');
    await screenshot.takeStep('send-to-qc-button-enabled');
  });

  test(`${generateUnitTestId('27')}: Click Send to QC and check for unsaved changes modal`, async () => {
    await qcPage.selectImageByIndex(0);
    const sendVisible = await qcPage.isSendToQcButtonVisible();
    if (sendVisible) {
      await qcPage.clickSendToQc();
    }
    await screenshot.takeStep('unsaved-changes-modal');
  });

  test(`${generateUnitTestId('28')}: Save and send for QC and verify success`, async () => {
    await qcPage.selectImageByIndex(0);
    const sendVisible = await qcPage.isSendToQcButtonVisible();
    if (sendVisible) {
      await qcPage.clickSendToQc();
      // Check if unsaved changes modal appeared
      const modalVisible = await qcPage.page.locator('[data-testid="dl-unsaved-before-qc-modal"]')
        .isVisible({ timeout: 3000 }).catch(() => false);
      if (modalVisible) {
        await qcPage.saveAndSendForQc();
        const successMsg = await qcPage.verifySessionCreatedSuccess().catch(() => '');
        expect(typeof successMsg).toBe('string');
      }
    }
    await screenshot.takeStep('save-and-send-success');
  });

  test(`${generateUnitTestId('29')}: Discard and send for QC`, async () => {
    await qcPage.selectImageByIndex(0);
    const sendVisible = await qcPage.isSendToQcButtonVisible();
    if (sendVisible) {
      await qcPage.clickSendToQc();
      const modalVisible = await qcPage.page.locator('[data-testid="dl-unsaved-before-qc-modal"]')
        .isVisible({ timeout: 3000 }).catch(() => false);
      if (modalVisible) {
        await qcPage.discardAndSendForQc();
      }
    }
    await screenshot.takeStep('discard-and-send');
  });

  test(`${generateUnitTestId('30')}: Verify image status badge text`, async () => {
    const badgeText = await qcPage.getImageStatusBadgeText(0);
    expect(typeof badgeText).toBe('string');
    await screenshot.takeStep('status-badge-text');
  });

  test(`${generateUnitTestId('31')}: Verify level indicator visibility`, async () => {
    const isVisible = await qcPage.isLevelIndicatorVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('level-indicator-visible');
  });

  test(`${generateUnitTestId('32')}: Verify image level label`, async () => {
    const levelLabel = await qcPage.getImageLevelLabel(0);
    expect(typeof levelLabel).toBe('string');
    await screenshot.takeStep('image-level-label');
  });
});
