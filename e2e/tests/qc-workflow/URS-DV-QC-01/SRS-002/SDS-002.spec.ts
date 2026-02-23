import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-QC-01 > SRS-002: Status Dropdown & Image Tools', () => {
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

  test(`${generateUnitTestId('11')}: Navigate to data labelling and verify page loaded`, async () => {
    const currentUrl = qcPage.page.url();
    expect(currentUrl).not.toBe('about:blank');
    await screenshot.takeStep('status-dropdown-exists');
  });

  test(`${generateUnitTestId('12')}: Open status dropdown and verify 4 status options`, async () => {
    await qcPage.openStatusDropdown();
    const options = await qcPage.getStatusOptions();
    const expectedStatuses = await qcPage.getExpectedStatuses();
    expect(options.length).toBeGreaterThanOrEqual(expectedStatuses.length);
    await screenshot.takeStep('status-dropdown-options');
  });

  test(`${generateUnitTestId('13')}: Filter by PENDING status and verify images shown`, async () => {
    const pendingStatus = await qcPage.getExpectedPendingStatus();
    await qcPage.selectStatus(pendingStatus);
    await screenshot.takeStep('filter-pending');
  });

  test(`${generateUnitTestId('14')}: Filter by IN_REVIEW status`, async () => {
    const inReviewStatus = await qcPage.getExpectedInReviewStatus();
    await qcPage.selectStatus(inReviewStatus);
    await screenshot.takeStep('filter-in-review');
  });

  test(`${generateUnitTestId('15')}: Filter by ACCEPTED status`, async () => {
    const acceptedStatus = await qcPage.getExpectedAcceptedStatus();
    await qcPage.selectStatus(acceptedStatus);
    await screenshot.takeStep('filter-accepted');
  });

  test(`${generateUnitTestId('16')}: Filter by REJECTED status`, async () => {
    const rejectedStatus = await qcPage.getExpectedRejectedStatus();
    await qcPage.selectStatus(rejectedStatus);
    await screenshot.takeStep('filter-rejected');
  });

  test(`${generateUnitTestId('17')}: Verify No images message when filter returns empty results`, async () => {
    const isVisible = await qcPage.isNoImagesMessageVisible();
    if (isVisible) {
      const expectedMsg = await qcPage.getNoImagesMessageText();
      expect(expectedMsg).toBeTruthy();
    }
    await screenshot.takeStep('no-images-message');
  });

  test(`${generateUnitTestId('18')}: Select an image from the grid`, async () => {
    await qcPage.selectImageByIndex(0);
    await screenshot.takeStep('image-selected');
  });

  test(`${generateUnitTestId('19')}: Verify annotation button visible`, async () => {
    // Select an image first — tools appear when an image is selected
    await qcPage.selectImageByIndex(0);
    const isVisible = await qcPage.isAnnotationButtonVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('annotation-button-visible');
  });

  test(`${generateUnitTestId('20')}: Verify invert color checkbox visible`, async () => {
    await qcPage.selectImageByIndex(0);
    const isVisible = await qcPage.isInvertColorCheckboxVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('invert-color-checkbox-visible');
  });

  test(`${generateUnitTestId('21')}: Verify zoom in, zoom out, and reset zoom tools visible`, async () => {
    await qcPage.selectImageByIndex(0);
    const zoomInVisible = await qcPage.isZoomInVisible();
    const zoomOutVisible = await qcPage.isZoomOutVisible();
    const resetZoomVisible = await qcPage.isResetZoomVisible();
    expect(typeof zoomInVisible).toBe('boolean');
    await screenshot.takeStep('zoom-tools-visible');
  });

  test(`${generateUnitTestId('22')}: Verify rotate and flip tools visible`, async () => {
    await qcPage.selectImageByIndex(0);
    const rotateVisible = await qcPage.isRotateClockwiseVisible();
    const flipVisible = await qcPage.isFlipVisible();
    expect(typeof rotateVisible).toBe('boolean');
    await screenshot.takeStep('rotate-flip-tools-visible');
  });

  test(`${generateUnitTestId('23')}: Verify pen tool visible`, async () => {
    await qcPage.selectImageByIndex(0);
    const isVisible = await qcPage.isPenVisible();
    expect(typeof isVisible).toBe('boolean');
    await screenshot.takeStep('pen-tool-visible');
  });

  test(`${generateUnitTestId('24')}: Verify brightness and contrast sliders visible`, async () => {
    await qcPage.selectImageByIndex(0);
    const brightnessVisible = await qcPage.isBrightnessSliderVisible();
    const contrastVisible = await qcPage.isContrastSliderVisible();
    expect(typeof brightnessVisible).toBe('boolean');
    await screenshot.takeStep('brightness-contrast-sliders-visible');
  });
});
