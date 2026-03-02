import { test, expect } from '@playwright/test';
import { CopyAnnotationPage } from '../../../../pages/copy-annotation.page';

test.describe('SRS-249 - SDS-249', () => {
  let copyPage: CopyAnnotationPage;

  test.beforeEach(async ({ page }) => {
    copyPage = new CopyAnnotationPage(page);
    await copyPage.openDataLabellingSession();
  });

  test('UTC-2615: Verify Copy Annotation button is disabled when image has no annotations when the user selects an image with no existing annotations', async () => {
    await copyPage.clickFilterUnannotatedCheckbox();
    await copyPage.selectPendingImageFromGrid();
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await copyPage.waitForPageLoad();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    const isDisabled = await copyPage.isCopyAnnotationButtonDisabled();
    expect(isDisabled).toBe(true);
  });

  test('UTC-2616: Verify Copy Annotation button is enabled when image has annotations when the user selects an image with at least one saved annotation', async () => {
    await copyPage.clickFilterAnnotatedCheckbox();
    await copyPage.selectPendingImageFromGrid();
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
  });

  test('UTC-2617: Verify Copy Annotation button becomes enabled after saving an annotation when the user selects an image with no annotations', async () => {
    await copyPage.clickFilterUnannotatedCheckbox();
    await copyPage.selectPendingImageFromGrid();
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    await expect(copyPage.getCopyAnnotationButton()).toBeDisabled();
    await copyPage.waitForPageLoad();
    const taxonomies = await copyPage.listAvailableTaxonomies();
    expect(taxonomies.length).toEqual(0);
    await copyPage.selectFirstTaxonomy();
    await copyPage.createUnsavedAnnotation();
    await copyPage.clickSaveAnnotationButton();
    await copyPage.isCopyAnnotationButtonEnabled();
  });

  test('UTC-2618: Verify button state updates when switching between images when the user switches between images with and without annotations', async () => {
    const assertCopyButtonMatchesPresence = async () => {
      const annotationCount = await copyPage.getAnnotationCount();
      const copyVisible = await copyPage.getCopyAnnotationButton().isVisible().catch(() => false);
      if (!copyVisible) {
        await copyPage.clickAnnotationButton();
      }
      await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
      if (annotationCount > 0) {
        await expect(copyPage.getCopyAnnotationButton()).toBeEnabled();
      } else {
        await expect(copyPage.getCopyAnnotationButton()).toBeDisabled();
      }
    };
    await copyPage.clickFilterUnannotatedCheckbox();
    await copyPage.selectPendingImageFromGrid();
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await assertCopyButtonMatchesPresence();
    await copyPage.clickNextImageButton();
    await assertCopyButtonMatchesPresence();
    await copyPage.waitForCanvasReady();
    await copyPage.clickPreviousImageButton();
    await assertCopyButtonMatchesPresence();
    await copyPage.waitForCanvasReady();
  });

  test('UTC-2619: Verify Copy Annotation action cannot be triggered when disabled when the selected image has no annotations', async () => {
      await copyPage.clickFilterUnannotatedCheckbox();
    await copyPage.selectPendingImageFromGrid();
    await copyPage.waitForCanvasReady();
    const annotationVisible = await copyPage.isAnnotationButtonVisible();
    expect(annotationVisible).toBe(true);
    await copyPage.clickAnnotationButton();
    await expect(copyPage.getCopyAnnotationButton()).toBeVisible();
    const isDisabled = await copyPage.isCopyAnnotationButtonDisabled();
    expect(isDisabled).toBe(true);
  });
});
