import { test, expect } from '@playwright/test';
import { CopyAnnotationPage } from '../../../../pages/copy-annotation.page';

test.describe('SRS-252 - SDS-252', () => {
  let copyPage: CopyAnnotationPage;

  test.beforeEach(async ({ page }) => {
    copyPage = new CopyAnnotationPage(page);
    await copyPage.openDataLabellingSession();
  });

  test('UTC-2634: Verify conflict popup appears when copying to next image with existing annotations when the source image has saved annotations', async () => {
    const pair = await copyPage.findAnnotatedNextPair();
    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
    await copyPage.pressCopyToNextShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);

    const conflictVisible = await copyPage.isConflictModalVisible();
    expect(conflictVisible).toBe(true);

    const titleText = await copyPage.getConflictModalTitleText();
    expect(titleText).toContain('Existing Annotations Found');
  });

  test('UTC-2635: Verify conflict popup appears when copying to previous image with existing annotations when the source image has saved annotations', async () => {
    const pair = await copyPage.findAnnotatedPreviousPair();
    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
    await copyPage.pressCopyToPreviousShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);

    const conflictVisible = await copyPage.isConflictModalVisible();
    expect(conflictVisible).toBe(true);

    const titleText = await copyPage.getConflictModalTitleText();
    expect(titleText).toContain('Existing Annotations Found');
  });

  test('UTC-2636: Verify background is blocked when conflict popup is displayed when the "Existing Annotations Found" popup is open', async () => {
    const pair = await copyPage.findAnnotatedNextPair();
    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
    await copyPage.pressCopyToNextShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);

    const blocked = await copyPage.isBackgroundInteractionBlocked();
    expect(blocked).toBe(true);
  });

  test('UTC-2637: Verify old annotations are fully removed before copy when the target image contains existing annotations', async () => {
    const pair = await copyPage.findAnnotatedNextPair();
    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
    const sourceCount = await copyPage.getAnnotationCount();

    await copyPage.pressCopyToNextShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);
    const conflictVisible = await copyPage.isConflictModalVisible();
    expect(conflictVisible).toBe(true);

    await copyPage.selectImageByIndex(pair.targetIndex);
    const targetCountBefore = await copyPage.getAnnotationCount();

    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.replaceAnnotationsInConflictModal();

    await copyPage.selectImageByIndex(pair.targetIndex);
    const targetCountAfter = await copyPage.getAnnotationCount();

    expect(targetCountAfter).toBe(sourceCount);
    if (targetCountBefore !== sourceCount) {
      expect(targetCountAfter).not.toBe(targetCountBefore);
    }
  });

  test('UTC-2638: Verify partial replacement does not occur when the conflict popup is displayed', async () => {
    const pair = await copyPage.findAnnotatedPreviousPair();
    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
    const sourceCount = await copyPage.getAnnotationCount();

    await copyPage.pressCopyToPreviousShortcut();
    const initiated = await copyPage.waitForCopyActionInitiated();
    expect(initiated).toBe(true);
    const conflictVisible = await copyPage.isConflictModalVisible();
    expect(conflictVisible).toBe(true);

    await copyPage.selectImageByIndex(pair.targetIndex);
    const targetCountBefore = await copyPage.getAnnotationCount();

    await copyPage.selectImageByIndex(pair.sourceIndex);
    await copyPage.replaceAnnotationsInConflictModal();

    await copyPage.selectImageByIndex(pair.targetIndex);
    const targetCountAfter = await copyPage.getAnnotationCount();

    expect(targetCountAfter).toBe(sourceCount);
    if (targetCountBefore !== sourceCount) {
      expect(targetCountAfter).not.toBe(targetCountBefore);
    }
  });
});
