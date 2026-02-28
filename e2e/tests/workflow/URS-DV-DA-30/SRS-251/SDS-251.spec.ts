import { test, expect } from '@playwright/test';
import { CopyAnnotationPage } from '../../../../pages/copy-annotation.page';

test.describe('SRS-251 - SDS-251', () => {
  let copyPage: CopyAnnotationPage;

  test.beforeEach(async ({ page }) => {
    copyPage = new CopyAnnotationPage(page);
    await copyPage.openDataLabellingSession();
  });

  test('UTC-2627: Verify keyboard shortcut is supported for copying annotations to previous image when the user is viewing an image with saved annotations', async () => {
    await copyPage.findAnnotatedImageWithPrevious();
    await copyPage.pressCopyToPreviousShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);

    if (await copyPage.isCopyAnnotationModalVisible()) {
      await copyPage.cancelCopyInModal();
    }
  });

  test('UTC-2628: Verify annotations are copied to the previous image using shortcut when the current image has one or more saved annotations', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithPreviousUnannotated();
    const sourceCount = await copyPage.getAnnotationCount();

    await copyPage.pressCopyToPreviousShortcut();
    await copyPage.waitForCopyActionInitiated();

    await copyPage.selectImageByIndex(sourceIndex - 1);
    const targetCount = await copyPage.getAnnotationCount();
    expect(targetCount).toBeGreaterThanOrEqual(sourceCount);
    expect(targetCount).toBeGreaterThan(0);
  });

  test('UTC-2629: Verify manual copy flow allows selecting a previous image when the Copy Annotation button is enabled', async () => {
    await copyPage.selectImageWithAnnotations();
    const isEnabled = await copyPage.isCopyAnnotationButtonEnabled();
    expect(isEnabled).toBe(true);

    await copyPage.clickCopyAnnotationButton();
    const modalVisible = await copyPage.isCopyAnnotationModalVisible();
    expect(modalVisible).toBe(true);
  });

  test('UTC-2630: Verify annotations are copied to selected previous image via manual option when the image selection popup is displayed', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithPreviousUnannotated();
    const sourceCount = await copyPage.getAnnotationCount();
    const targetIndex = sourceIndex - 1;

    await copyPage.clickCopyAnnotationButton();
    await copyPage.selectCopyTargetOption(targetIndex);
    await copyPage.confirmCopyInModal();

    await copyPage.selectImageByIndex(targetIndex);
    const targetCount = await copyPage.getAnnotationCount();
    expect(targetCount).toBeGreaterThanOrEqual(sourceCount);
    expect(targetCount).toBeGreaterThan(0);
  });

  test('UTC-2631: Verify confirmation message after successful copy to previous image when annotations are copied successfully to a previous image', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithPreviousUnannotated();
    const targetIndex = sourceIndex - 1;

    await copyPage.clickCopyAnnotationButton();
    await copyPage.selectCopyTargetOption(targetIndex);
    await copyPage.confirmCopyInModal();

    const toastMessage = await copyPage.getSuccessToastText();
    expect(toastMessage).toContain('Annotations copied to image');
  });

  test('UTC-2632: Verify copy is blocked when unsaved annotations exist when the current image has unsaved annotations', async () => {
    await copyPage.selectImageWithAnnotations();
    await copyPage.createUnsavedAnnotation();
    await copyPage.pressCopyToPreviousShortcut();

    const errorMessage = await copyPage.getErrorToastText();
    expect(errorMessage).toContain('Cannot copy annotations');
  });

  test('UTC-2633: Verify previous image view refreshes after copy when annotations are copied to a previous image', async () => {
    const sourceIndex = await copyPage.findAnnotatedImageWithPreviousUnannotated();
    const sourceCount = await copyPage.getAnnotationCount();
    const targetIndex = sourceIndex - 1;

    await copyPage.clickCopyAnnotationButton();
    await copyPage.selectCopyTargetOption(targetIndex);
    await copyPage.confirmCopyInModal();

    await copyPage.selectImageByIndex(targetIndex);
    const targetCount = await copyPage.getAnnotationCount();
    expect(targetCount).toBeGreaterThanOrEqual(sourceCount);
    expect(targetCount).toBeGreaterThan(0);
  });
});
