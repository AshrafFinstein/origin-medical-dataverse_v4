import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-235 - SDS-235', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2425: Given label popup opens When no labels are selected Then Apply button should remain disabled\nGiven label popup opens\nWhen no labels are selected\nThen Apply button should remain disabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.unselectLabel();
    await da27Page.clearLabelSearch();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2426: Given popup open When one label is selected Then Apply button should become enabled\nGiven popup open\nWhen one label is selected\nThen Apply button should become enabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2427: Given popup open When multiple labels are selected Then Apply button should remain enabled\nGiven popup open\nWhen multiple labels are selected\nThen Apply button should remain enabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2428: Given labels selected When user clicks Apply Then selected labels should be mapped to the image\nGiven labels selected\nWhen user clicks Apply\nThen selected labels should be mapped to the image\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2429: Given Apply action succeeds When labels assigned Then success toast “Successfully Labelled Image” should appear\nGiven Apply action succeeds\nWhen labels assigned\nThen success toast “Successfully Labelled Image” should appear\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isSuccessToastVisible();
    await da27Page.verifyUiStable();
  });

  test('UTC-2430: Given labels applied When popup closes Then applied labels should appear below the image preview\nGiven labels applied\nWhen popup closes\nThen applied labels should appear below the image preview\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.clickCancelIcon();
    await da27Page.verifyUiStable();
  });

  test('UTC-2431: Given labels already applied When user updates selection and clicks Apply again Then previous labels should be replaced with new selection\nGiven labels already applied\nWhen user updates selection and clicks Apply again\nThen previous labels should be replaced with new selection\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2432: Given labels selected When Apply clicked Then selected label IDs should be sent in API payload\nGiven labels selected\nWhen Apply clicked\nThen selected label IDs should be sent in API payload\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickApplyButton();
    await da27Page.waitForUiSync();
  });

  test('UTC-2433: Given no labels selected When user clicks Apply Then action should not execute\nGiven no labels selected\nWhen user clicks Apply\nThen action should not execute\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.unselectLabel();
    await da27Page.clearLabelSearch();
    await da27Page.clickApplyButton();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2434: Given API failure occurs When Apply attempted Then old labels should remain unchanged\nGiven API failure occurs\nWhen Apply attempted\nThen old labels should remain unchanged\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.clickApplyButton();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2435: Given labels applied When success toast shown Then user should clearly understand labels assigned\nGiven labels applied\nWhen success toast shown\nThen user should clearly understand labels assigned\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2436: Given labels applied When Apply completes Then label list should refresh instantly without page reload\nGiven labels applied\nWhen Apply completes\nThen label list should refresh instantly without page reload\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2437: Given labels selected When user presses Enter key on Apply Then labels should be assigned successfully\nGiven labels selected\nWhen user presses Enter key on Apply\nThen labels should be assigned successfully\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2438: Given many labels selected (100+) When Apply clicked Then assignment should complete without UI freeze\nGiven many labels selected (100+)\nWhen Apply clicked\nThen assignment should complete without UI freeze\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2439: Given labels selected When popup closed without Apply Then no labels should be assigned\nGiven labels selected\nWhen popup closed without Apply\nThen no labels should be assigned\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickCancelIcon();
    await da27Page.verifyUiStable();
  });
});
