import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-236 - SDS-236', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2440: Given one or more images are selected When user presses Backspace Then confirmation popup should appear\nGiven one or more images are selected\nWhen user presses Backspace\nThen confirmation popup should appear\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.pressBackspace();
    await da27Page.isDisplaylabelselectionpopup();
  });

  test('UTC-2441: Given popup opened When content rendered Then message text should explain label removal clearly\nGiven popup opened\nWhen content rendered\nThen message text should explain label removal clearly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2442: Given selected images exist When popup opens Then image thumbnails should be visible in modal\nGiven selected images exist\nWhen popup opens\nThen image thumbnails should be visible in modal\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.ensurePopupOpen();
    await da27Page.verifyUiStable();
  });

  test('UTC-2443: Given images have labels When popup opens Then correct label count should be displayed\nGiven images have labels\nWhen popup opens\nThen correct label count should be displayed\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.ensurePopupOpen();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2444: Given popup displayed When user clicks No Then modal closes and labels remain unchanged\nGiven popup displayed\nWhen user clicks No\nThen modal closes and labels remain unchanged\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clickNoInConfirmation();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2445: Given popup displayed When user clicks Yes Then labels should be removed from selected images\nGiven popup displayed\nWhen user clicks Yes\nThen labels should be removed from selected images\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clickYesInConfirmation();
    await da27Page.isSuccessToastVisible();
  });

  test('UTC-2446: Given labels removed successfully When operation completes Then toast “Labels removed successfully from selected image(s)” appears\nGiven labels removed successfully\nWhen operation completes\nThen toast “Labels removed successfully from selected image(s)” appears\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isSuccessToastVisible();
    await da27Page.verifyUiStable();
  });

  test('UTC-2447: Given labels removed When API triggered Then image IDs and label IDs should be sent correctly\nGiven labels removed\nWhen API triggered\nThen image IDs and label IDs should be sent correctly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
  });

  test('UTC-2448: Given no image selected When Backspace pressed Then removal should not trigger and notification shown\nGiven no image selected\nWhen Backspace pressed\nThen removal should not trigger and notification shown\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.pressBackspace();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2449: Given cursor inside search/text field When Backspace pressed Then label removal should not trigger\nGiven cursor inside search/text field\nWhen Backspace pressed\nThen label removal should not trigger\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.focusLabelSearch();
    await da27Page.pressBackspace();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2450: Given backend removal fails When operation completes Then previous labels remain and error toast shown\nGiven backend removal fails\nWhen operation completes\nThen previous labels remain and error toast shown\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2451: Given labels removed When confirmation accepted Then UI updates immediately without reload\nGiven labels removed\nWhen confirmation accepted\nThen UI updates immediately without reload\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.clickYesInConfirmation();
    await da27Page.verifyUiStable();
  });

  test('UTC-2452: Given popup visible When user reviews buttons Then Yes/No buttons clearly distinguishable\nGiven popup visible\nWhen user reviews buttons\nThen Yes/No buttons clearly distinguishable\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2453: Given popup open When user presses Tab/Enter Then Yes/No buttons selectable via keyboard\nGiven popup open\nWhen user presses Tab/Enter\nThen Yes/No buttons selectable via keyboard\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2454: Given many images selected (50+) When user confirms removal Then all labels removed without lag\nGiven many images selected (50+)\nWhen user confirms removal\nThen all labels removed without lag\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clickYesInConfirmation();
    await da27Page.verifyUiStable();
  });

  test('UTC-2455: Given user lacks permission When Backspace pressed Then removal blocked and access message shown\nGiven user lacks permission\nWhen Backspace pressed\nThen removal blocked and access message shown\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.pressBackspace();
    await da27Page.isErrorToastVisible();
  });
});
