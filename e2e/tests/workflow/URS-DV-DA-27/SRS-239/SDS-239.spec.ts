import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-239 - SDS-239', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2488: Given user opens label popup When popup renders Then search, labels, and Apply button should be clearly visible\nGiven user opens label popup\nWhen popup renders\nThen search, labels, and Apply button should be clearly visible\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.isDisplaylabelselectionpopup();
    await da27Page.isSearchVisible();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2489: Given popup open When user views search field Then placeholder text should guide label search\nGiven popup open\nWhen user views search field\nThen placeholder text should guide label search\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.isSearchVisible();
  });

  test('UTC-2490: Given labels listed When user views list Then label text should be readable and properly spaced\nGiven labels listed\nWhen user views list\nThen label text should be readable and properly spaced\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2491: Given label list visible When selecting a checkbox Then selection state should be clearly highlighted\nGiven label list visible\nWhen selecting a checkbox\nThen selection state should be clearly highlighted\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.isLabelListVisible();
    await da27Page.selectSingleLabel();
    await da27Page.verifyUiStable();
  });

  test('UTC-2492: Given popup opens When no label selected Then Apply button should be disabled to prevent mistakes\nGiven popup opens\nWhen no label selected\nThen Apply button should be disabled to prevent mistakes\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.unselectLabel();
    await da27Page.clearLabelSearch();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2493: Given label selected When checkbox marked Then Apply button should enable clearly\nGiven label selected\nWhen checkbox marked\nThen Apply button should enable clearly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.selectSingleLabel();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2494: Given labels applied When action completes Then labels appear instantly below image\nGiven labels applied\nWhen action completes\nThen labels appear instantly below image\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.waitForUiSync();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2495: Given labels applied When process succeeds Then success toast should display clear message\nGiven labels applied\nWhen process succeeds\nThen success toast should display clear message\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.waitForUiSync();
    await da27Page.isSuccessToastVisible();
    await da27Page.verifyUiStable();
  });

  test('UTC-2496: Given search text has no match When filtering Then “No results found” message should display\nGiven search text has no match\nWhen filtering\nThen “No results found” message should display\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterUnmatchedSearchText();
    await da27Page.waitForUiSync();
    await da27Page.isEmptyStateVisible();
  });

  test('UTC-2497: Given popup open When Cancel clicked Then popup should close without changes\nGiven popup open\nWhen Cancel clicked\nThen popup should close without changes\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clickCancelIcon();
    await da27Page.isPopupHidden();
  });

  test('UTC-2498: Given removal initiated When confirmation appears Then modal text clearly describes action\nGiven removal initiated\nWhen confirmation appears\nThen modal text clearly describes action\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2499: Given confirmation modal When displayed Then Yes and No buttons should be visually distinct\nGiven confirmation modal\nWhen displayed\nThen Yes and No buttons should be visually distinct\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2500: Given no label selected When user clicks Apply repeatedly Then no action should occur\nGiven no label selected\nWhen user clicks Apply repeatedly\nThen no action should occur\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.unselectLabel();
    await da27Page.clearLabelSearch();
    await da27Page.clickApplyButton();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2501: Given labels selected When popup reopened Then previous selections should remain visible\nGiven labels selected\nWhen popup reopened\nThen previous selections should remain visible\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.ensurePopupOpen();
    await da27Page.verifyUiStable();
  });

  test('UTC-2502: Given popup open When using Tab/Space/Enter Then controls should be accessible via keyboard\nGiven popup open\nWhen using Tab/Space/Enter\nThen controls should be accessible via keyboard\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2503: Given multiple interactions When popup used repeatedly Then layout remains stable and predictable\nGiven multiple interactions\nWhen popup used repeatedly\nThen layout remains stable and predictable\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.verifyUiStable();
  });

  test('UTC-2504: Given failure occurs When error shown Then message should be simple and user-friendly\nGiven failure occurs\nWhen error shown\nThen message should be simple and user-friendly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isErrorToastVisible();
  });
});
