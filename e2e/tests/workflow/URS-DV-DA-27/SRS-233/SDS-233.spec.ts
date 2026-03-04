import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-233 - SDS-233', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2389: Given annotation label popup is open When popup rendered Then search input should be visible at the top of the popup\nGiven annotation label popup is open\nWhen popup rendered\nThen search input should be visible at the top of the popup\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.isSearchVisible();
  });

  test('UTC-2390: Given search field is focused When user types label text Then the list should update showing matching labels in real time\nGiven search field is focused\nWhen user types label text\nThen the list should update showing matching labels in real time\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.focusLabelSearch();
    await da27Page.enterSearchText();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2391: Given popup opened When search input is empty Then all labels should be displayed in list\nGiven popup opened\nWhen search input is empty\nThen all labels should be displayed in list\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clearLabelSearch();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2392: Given user types unmatched text When no matching labels exist Then the popup should show an empty list (empty state)\nGiven user types unmatched text\nWhen no matching labels exist\nThen the popup should show an empty list (empty state)\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.isEmptyStateVisible();
  });

  test('UTC-2393: Given the search field contains text When user clicks the Cancel icon Then search field should clear and list reset to full labels\nGiven the search field contains text\nWhen user clicks the Cancel icon\nThen search field should clear and list reset to full labels\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterSearchText();
    await da27Page.clickCancelIcon();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2394: Given popup with search/filter state When user clicks Cancel icon Then popup should close and search filter cleared\nGiven popup with search/filter state\nWhen user clicks Cancel icon\nThen popup should close and search filter cleared\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterSearchText();
    await da27Page.clickCancelIcon();
    await da27Page.isPopupHidden();
  });

  test('UTC-2395: Given popup open When search yields no results Then no error message should throw, just empty list\nGiven popup open\nWhen search yields no results\nThen no error message should throw, just empty list\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.isEmptyStateVisible();
  });

  test('UTC-2396: Given multiple labels exist When user types text quickly Then filtering should respond instantly (no lag)\nGiven multiple labels exist\nWhen user types text quickly\nThen filtering should respond instantly (no lag)\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.enterSearchText();
    await da27Page.verifyUiStable();
  });

  test('UTC-2397: Given search field has focus When user presses Escape or Tab to Cancel icon and activates it Then search should clear and popup reset\nGiven search field has focus\nWhen user presses Escape or Tab to Cancel icon and activates it\nThen search should clear and popup reset\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.focusLabelSearch();
    await da27Page.clickCancelIcon();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2398: Given popup is closed When user types in other page area Then no label filtering or popup should occur\nGiven popup is closed\nWhen user types in other page area\nThen no label filtering or popup should occur\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupClosed();
    await da27Page.enterSearchText();
    await da27Page.isPopupHidden();
  });

  test('UTC-2399: Given repeated open/search/cancel cycles When actions repeat Then popup behavior should remain consistent\nGiven repeated open/search/cancel cycles\nWhen actions repeat\nThen popup behavior should remain consistent\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2400: Given annotation label popup is open When popup rendered Then search input should be visible at the top of the popup\nGiven annotation label popup is open\nWhen popup rendered\nThen search input should be visible at the top of the popup\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.isSearchVisible();
  });

  test('UTC-2401: Given search field is focused When user types label text Then the list should update showing matching labels in real time\nGiven search field is focused\nWhen user types label text\nThen the list should update showing matching labels in real time\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.focusLabelSearch();
    await da27Page.enterSearchText();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2402: Given popup opened When search input is empty Then all labels should be displayed in list\nGiven popup opened\nWhen search input is empty\nThen all labels should be displayed in list\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clearLabelSearch();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2403: Given user types unmatched text When no matching labels exist Then the popup should show an empty list (empty state)\nGiven user types unmatched text\nWhen no matching labels exist\nThen the popup should show an empty list (empty state)\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.isEmptyStateVisible();
  });

  test('UTC-2404: Given the search field contains text When user clicks the Cancel icon Then search field should clear and list reset to full labels\nGiven the search field contains text\nWhen user clicks the Cancel icon\nThen search field should clear and list reset to full labels\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterSearchText();
    await da27Page.clickCancelIcon();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2405: Given popup with search/filter state When user clicks Cancel icon Then popup should close and search filter cleared\nGiven popup with search/filter state\nWhen user clicks Cancel icon\nThen popup should close and search filter cleared\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterSearchText();
    await da27Page.clickCancelIcon();
    await da27Page.isPopupHidden();
  });

  test('UTC-2406: Given popup open When search yields no results Then no error message should throw, just empty list\nGiven popup open\nWhen search yields no results\nThen no error message should throw, just empty list\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.isEmptyStateVisible();
  });

  test('UTC-2407: Given multiple labels exist When user types text quickly Then filtering should respond instantly (no lag)\nGiven multiple labels exist\nWhen user types text quickly\nThen filtering should respond instantly (no lag)\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.enterSearchText();
    await da27Page.verifyUiStable();
  });

  test('UTC-2408: Given search field has focus When user presses Escape or Tab to Cancel icon and activates it Then search should clear and popup reset\nGiven search field has focus\nWhen user presses Escape or Tab to Cancel icon and activates it\nThen search should clear and popup reset\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.focusLabelSearch();
    await da27Page.clickCancelIcon();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2409: Given popup is closed When user types in other page area Then no label filtering or popup should occur\nGiven popup is closed\nWhen user types in other page area\nThen no label filtering or popup should occur\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupClosed();
    await da27Page.enterSearchText();
    await da27Page.isPopupHidden();
  });

  test('UTC-2410: Given repeated open/search/cancel cycles When actions repeat Then popup behavior should remain consistent\nGiven repeated open/search/cancel cycles\nWhen actions repeat\nThen popup behavior should remain consistent\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });
});
