import { test, expect } from '@playwright/test';
import { CopyAnnotationPage } from '../../../../pages/copy-annotation.page';

test.describe('SRS-250 - SDS-250', () => {
  let copyPage: CopyAnnotationPage;

  test.beforeEach(async ({ page }) => {
    copyPage = new CopyAnnotationPage(page);
    await copyPage.openDataLabellingSession();
  });

  test('UTC-2620: Verify keyboard shortcut is supported for copying annotations when the user is viewing an image with saved annotations', async () => {
    await copyPage.findAnnotatedImageWithNext();
    await copyPage.pressCopyToNextShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);

    if (await copyPage.isCopyAnnotationModalVisible()) {
      await copyPage.cancelCopyInModal();
    }
  });

  test('UTC-2621: Verify annotations are copied to the next image using shortcut when the current image has one or more saved annotations', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithNextUnannotated();
    const sourceCount = await copyPage.getAnnotationCount();

    await copyPage.pressCopyToNextShortcut();
    await copyPage.waitForCopyActionInitiated();

    await copyPage.selectImageByIndex(sourceIndex + 1);
    const targetCount = await copyPage.getAnnotationCount();
    expect(targetCount).toBeGreaterThanOrEqual(sourceCount);
    expect(targetCount).toBeGreaterThan(0);
  });

  test('UTC-2622: Verify Copy Annotation button triggers manual copy flow when the Copy Annotation button is enabled', async () => {
    await copyPage.selectImageWithAnnotations();
    const isEnabled = await copyPage.isCopyAnnotationButtonEnabled();
    expect(isEnabled).toBe(true);

    await copyPage.clickCopyAnnotationButton();
    const modalVisible = await copyPage.isCopyAnnotationModalVisible();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2623: Verify annotations are copied to selected image via manual option when the image selection popup is displayed', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithNextUnannotated();
    const sourceCount = await copyPage.getAnnotationCount();
    const targetIndex = sourceIndex + 1;

    await copyPage.clickCopyAnnotationButton();
    await copyPage.selectCopyTargetOption(targetIndex);
    await copyPage.confirmCopyInModal();

    await copyPage.selectImageByIndex(targetIndex);
    const targetCount = await copyPage.getAnnotationCount();
    expect(targetCount).toBeGreaterThanOrEqual(sourceCount);
    expect(targetCount).toBeGreaterThan(0);
  });

  test('UTC-2624: Verify confirmation message after successful copy when annotations are copied successfully', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithNextUnannotated();
    const targetIndex = sourceIndex + 1;

    await copyPage.clickCopyAnnotationButton();
    await copyPage.selectCopyTargetOption(targetIndex);
    await copyPage.confirmCopyInModal();

    const toastMessage = await copyPage.getSuccessToastText();
    expect(toastMessage).toContain('Annotations copied to image');
  });

  test('UTC-2625: Verify copy is blocked when unsaved annotations exist when the current image has unsaved annotations', async () => {
    await copyPage.selectImageWithAnnotations();
    await copyPage.createUnsavedAnnotation();
    await copyPage.pressCopyToNextShortcut();

    const errorMessage = await copyPage.getErrorToastText();
    expect(errorMessage).toContain('Cannot copy annotations');
  });

  test('UTC-2626: Verify target image view updates after copy when annotations are copied to a target image', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithNextUnannotated();
    const sourceCount = await copyPage.getAnnotationCount();
    const targetIndex = sourceIndex + 1;

    await copyPage.clickCopyAnnotationButton();
    await copyPage.selectCopyTargetOption(targetIndex);
    await copyPage.confirmCopyInModal();

    await copyPage.selectImageByIndex(targetIndex);
    const targetCount = await copyPage.getAnnotationCount();
    expect(targetCount).toBeGreaterThanOrEqual(sourceCount);
    expect(targetCount).toBeGreaterThan(0);
  });
});
