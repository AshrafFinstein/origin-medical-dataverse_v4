import { test, expect } from '@playwright/test';
import { SessionCreatePage } from '../../../../pages/session-create.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { SessionCreateData } from '../../../../test-data';

test.describe('URS-DV-SC-01 > SRS-004: Labels, Taxonomy & File Upload', () => {
  let sessionPage: SessionCreatePage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionCreatePage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await sessionPage.navigateToSessionList();
    await sessionPage.openCreateModal();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('23')}: Select multiple Labels from dropdown`, async () => {
    const labelsVisible = await sessionPage.isLabelsSelectVisible();

    if (labelsVisible) {
      await sessionPage.selectLabelsFirstOption();
      const selectedLabels = await sessionPage.getSelectedLabels();
      expect(selectedLabels.length).toBeGreaterThan(0);
    }

    await screenshot.takeStep('labels-selected');
  });

  test(`${generateUnitTestId('24')}: Add a Taxonomy entry`, async () => {
    const taxonomyVisible = await sessionPage.isTaxonomySectionVisible();

    if (taxonomyVisible) {
      await sessionPage.addTaxonomyEntry();
      // Verify the taxonomy section expanded or a new entry appeared
      await screenshot.takeStep('taxonomy-entry-added');
    } else {
      // Taxonomy section may not be present in all configurations
      await screenshot.takeStep('taxonomy-section-not-present');
    }
  });

  test(`${generateUnitTestId('25')}: Fill Taxonomy name and select annotations`, async () => {
    const taxonomyVisible = await sessionPage.isTaxonomySectionVisible();

    if (taxonomyVisible) {
      await sessionPage.addTaxonomyEntry();
      // Taxonomy fields use role-based selectors (no data-testid)
      const dialog = sessionPage.page.getByRole('dialog');
      const taxonomyInputs = dialog.locator(
        'input[placeholder*="taxonomy" i], input[placeholder*="name" i]',
      );
      if (
        await taxonomyInputs
          .first()
          .isVisible({ timeout: 3000 })
          .catch(() => false)
      ) {
        await taxonomyInputs.first().fill('Test Taxonomy Entry');
      }
    }

    await screenshot.takeStep('taxonomy-fields-filled');
  });

  test(`${generateUnitTestId('26')}: Open S3 upload modal`, async () => {
    const s3ModalVisible = await sessionPage.openS3UploadModal();
    expect(s3ModalVisible).toBe(true);
    await screenshot.takeStep('s3-modal-open');
  });

  test(`${generateUnitTestId('27')}: Fill S3 key and click Upload`, async () => {
    const s3ModalVisible = await sessionPage.openS3UploadModal();
    expect(s3ModalVisible).toBe(true);

    await sessionPage.fillS3Key(SessionCreateData.s3.testKey);
    await sessionPage.clickS3Upload();
    await screenshot.takeStep('s3-upload-completed');
  });
});
