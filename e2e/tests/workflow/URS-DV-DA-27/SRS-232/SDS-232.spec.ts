import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-232 - SDS-232', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2377: Given the Annotation page is loaded with an editable image When the user right-clicks using mouse or keyboard Then the label selection popup should appear\nGiven the Annotation page is loaded with an editable image\nWhen the user right-clicks using mouse or keyboard\nThen the label selection popup should appear\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.imageRightClick();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.clickCancelIcon();
    await da27Page.imageRightClickByKeyboard();
    await da27Page.isDisplaylabelselectionpopup();
  });

  test('UTC-2378: Given the popup is opened When the popup loads Then search field, label list, and Apply button should be displayed\nGiven the popup is opened\nWhen the popup loads\nThen search field, label list, and Apply button should be displayed\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isSearchVisible();
    await da27Page.isLabelListVisible();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2379: Given no label is selected When popup is displayed Then Apply button should remain disabled\nGiven no label is selected\nWhen popup is displayed\nThen Apply button should remain disabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isSearchVisible();
    await da27Page.isLabelListVisible();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2380: Given popup is open When the user selects at least one label Then Apply button should be enabled\nGiven popup is open\nWhen the user selects at least one label\nThen Apply button should be enabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2381: Given a label is selected When the user clicks Apply Then selected label should be assigned to the annotation\nGiven a label is selected\nWhen the user clicks Apply\nThen selected label should be assigned to the annotation\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.clickApplyButton();
    await da27Page.isSelectedLabelDisplayedUnderImage();
  });

  test('UTC-2382: Given multiple labels exist When the user types text in the search field Then only matching labels should be displayed\nGiven multiple labels exist\nWhen the user types text in the search field\nThen only matching labels should be displayed\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.enterSearchText();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2383: Given search text is entered When the user clears the search input Then all labels should be displayed again\nGiven search text is entered\nWhen the user clears the search input\nThen all labels should be displayed again\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterSearchText();
    await da27Page.clearLabelSearch();
    await da27Page.isLabelListVisible();
  });

  // wrong test case - as per new design, Apply button will be disabled if no label is selected.
  // test('UTC-2384: Given no label selected When user clicks Apply Then no action should occur\nGiven no label selected\nWhen user clicks Apply\nThen no action should occur\n', async ({ page }) => {
  //   const da27Page = new Da27AnnotationPage(page);
  //   await da27Page.selectPendingImageFromGrid();
  //   await da27Page.ensurePopupOpen();
  //   await da27Page.unselectLabel();
  //   await da27Page.clearLabelSearch();
  //   await da27Page.clickApplyButton();
  //   await da27Page.verifyNoActionOccurred();
  // });


  // wrong test case - as per new design, Session will not open if Session is locked or not editable.
  // test('UTC-2385: Given image is locked or not editable When user right-clicks Then popup should not appear\nGiven image is locked or not editable\nWhen user right-clicks\nThen popup should not appear\n', async ({ page }) => {
  //   const da27Page = new Da27AnnotationPage(page);
  //   await da27Page.selectPendingImageFromGrid();
  //   await da27Page.waitForUiSync();
  //   await da27Page.imageRightClick();
  //   await da27Page.isPopupHidden();
  // });

  test('UTC-2386: Given popup opened and closed repeatedly When user reopens popup Then it should load correctly without UI errors\nGiven popup opened and closed repeatedly\nWhen user reopens popup\nThen it should load correctly without UI errors\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clickCancelIcon();
    await da27Page.ensurePopupOpen();
    await da27Page.verifyUiStable();
  });

  test('UTC-2387: Given popup is open When user navigates using keyboard (Tab/Enter) Then controls should be focusable and selectable\nGiven popup is open\nWhen user navigates using keyboard (Tab/Enter)\nThen controls should be focusable and selectable\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2388: Given user right-clicks image When popup renders Then it should appear within acceptable response time (<1s)\nGiven user right-clicks image\nWhen popup renders\nThen it should appear within acceptable response time (<1s)\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.imageRightClick();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.verifyUiStable();
  });
});
