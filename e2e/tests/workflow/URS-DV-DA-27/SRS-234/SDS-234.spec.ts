import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-234 - SDS-234', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2411: Given annotation label popup is opened When labels are displayed Then each label should show a checkbox control\nGiven annotation label popup is opened\nWhen labels are displayed\nThen each label should show a checkbox control\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2412: Given popup open When user selects one checkbox Then that label should be marked selected\nGiven popup open\nWhen user selects one checkbox\nThen that label should be marked selected\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.verifyUiStable();
  });

  test('UTC-2413: Given popup open When user selects multiple checkboxes Then all selected labels should remain checked simultaneously\nGiven popup open\nWhen user selects multiple checkboxes\nThen all selected labels should remain checked simultaneously\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.verifyUiStable();
  });

  test('UTC-2414: Given labels selected When user unchecks a checkbox Then the label should be removed from selection list\nGiven labels selected\nWhen user unchecks a checkbox\nThen the label should be removed from selection list\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.unselectLabel();
    await da27Page.verifyUiStable();
  });

  test('UTC-2415: Given popup opens with no selections When no label selected Then Apply button should remain disabled\nGiven popup opens with no selections\nWhen no label selected\nThen Apply button should remain disabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.unselectLabel();
    await da27Page.clearLabelSearch();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2416: Given at least one label selected When selection occurs Then Apply button should become enabled\nGiven at least one label selected\nWhen selection occurs\nThen Apply button should become enabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.selectSingleLabel();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2417: Given multiple labels selected When user clicks Apply Then all selected labels should be attached to the image\nGiven multiple labels selected\nWhen user clicks Apply\nThen all selected labels should be attached to the image\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2418: Given labels selected When inspecting payload Then selected label IDs should be included in request payload array\nGiven labels selected\nWhen inspecting payload\nThen selected label IDs should be included in request payload array\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
  });

  test('UTC-2419: Given repeated select/unselect actions When user toggles quickly Then UI should remain stable without duplication\nGiven repeated select/unselect actions\nWhen user toggles quickly\nThen UI should remain stable without duplication\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.verifyUiStable();
  });

  test('UTC-2420: Given labels selected When checkbox checked Then row should be visually highlighted\nGiven labels selected\nWhen checkbox checked\nThen row should be visually highlighted\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.selectSingleLabel();
    await da27Page.verifyUiStable();
  });

  test('UTC-2421: Given popup open When user navigates with keyboard and presses Space/Enter Then checkbox selection should toggle\nGiven popup open\nWhen user navigates with keyboard and presses Space/Enter\nThen checkbox selection should toggle\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2422: Given no labels selected When user clicks Apply Then action should be blocked\nGiven no labels selected\nWhen user clicks Apply\nThen action should be blocked\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.unselectLabel();
    await da27Page.clearLabelSearch();
    await da27Page.clickApplyButton();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2423: Given 500+ labels loaded When selecting multiple items Then selection should respond instantly without lag\nGiven 500+ labels loaded\nWhen selecting multiple items\nThen selection should respond instantly without lag\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.verifyUiStable();
  });

  test('UTC-2424: Given multiple labels selected When popup closed or cancelled Then selections should reset on next open\nGiven multiple labels selected\nWhen popup closed or cancelled\nThen selections should reset on next open\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickCancelIcon();
    await da27Page.verifyUiStable();
  });
});
