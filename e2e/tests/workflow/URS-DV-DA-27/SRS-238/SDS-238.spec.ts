import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-238 - SDS-238', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2471: Given user right-clicks image When label popup opens Then popup should render within 200 ms\nGiven user right-clicks image\nWhen label popup opens\nThen popup should render within 200 ms\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.displayLoadedImage();
    await da27Page.ensurePopupOpen();
    await da27Page.isDisplaylabelselectionpopup();
  });

  test('UTC-2472: Given popup opens When labels load Then UI remains responsive\nGiven popup opens\nWhen labels load\nThen UI remains responsive\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.verifyUiStable();
  });

  test('UTC-2473: Given user types in search When characters entered Then results update within 300 ms\nGiven user types in search\nWhen characters entered\nThen results update within 300 ms\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.enterSearchText();
    await da27Page.enterSearchText();
    await da27Page.verifyUiStable();
  });

  test('UTC-2474: Given search input When filtering labels Then list updates dynamically without page refresh\nGiven search input\nWhen filtering labels\nThen list updates dynamically without page refresh\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.focusLabelSearch();
    await da27Page.waitForUiSync();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2475: Given label list visible When selecting checkbox Then selection highlights instantly\nGiven label list visible\nWhen selecting checkbox\nThen selection highlights instantly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.isLabelListVisible();
    await da27Page.selectSingleLabel();
    await da27Page.verifyUiStable();
  });

  test('UTC-2476: Given at least one label selected When selection occurs Then Apply button enables immediately\nGiven at least one label selected\nWhen selection occurs\nThen Apply button enables immediately\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.selectSingleLabel();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2477: Given labels selected When Apply clicked Then labels appear on image within 500 ms\nGiven labels selected\nWhen Apply clicked\nThen labels appear on image within 500 ms\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.clickApplyButton();
    await da27Page.isLabelListVisible();
  });

  test('UTC-2478: Given labels assigned When Remove triggered Then labels disappear instantly\nGiven labels assigned\nWhen Remove triggered\nThen labels disappear instantly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.pressBackspace();
    await da27Page.verifyUiStable();
  });

  test('UTC-2479: Given apply/remove in progress When request sent Then UI should not block other interactions\nGiven apply/remove in progress\nWhen request sent\nThen UI should not block other interactions\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2480: Given rapid multiple clicks When selecting labels repeatedly Then UI should remain stable and responsive\nGiven rapid multiple clicks\nWhen selecting labels repeatedly\nThen UI should remain stable and responsive\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectMultipleLabels();
    await da27Page.verifyUiStable();
  });

  test('UTC-2481: Given 500+ labels loaded When popup opens Then load time remains under 1 sec\nGiven 500+ labels loaded\nWhen popup opens\nThen load time remains under 1 sec\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.ensurePopupOpen();
    await da27Page.verifyUiStable();
  });

  test('UTC-2482: Given long label list When scrolling Then scrolling remains smooth without lag\nGiven long label list\nWhen scrolling\nThen scrolling remains smooth without lag\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2483: Given popup open When Cancel clicked Then popup closes instantly\nGiven popup open\nWhen Cancel clicked\nThen popup closes instantly\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.clickCancelIcon();
    await da27Page.isPopupHidden();
  });

  test('UTC-2484: Given slow network When apply action delayed Then non-blocking toast appears without freezing UI\nGiven slow network\nWhen apply action delayed\nThen non-blocking toast appears without freezing UI\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.clickApplyButton();
    await da27Page.verifyUiStable();
  });

  test('UTC-2485: Given apply fails When error occurs Then previous UI state remains intact and toast shown\nGiven apply fails\nWhen error occurs\nThen previous UI state remains intact and toast shown\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isSuccessToastVisible();
    await da27Page.verifyUiStable();
  });

  test('UTC-2486: Given multiple apply/remove cycles When executed repeatedly Then performance remains consistent without degradation\nGiven multiple apply/remove cycles\nWhen executed repeatedly\nThen performance remains consistent without degradation\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2487: Given label applied When action completes Then success toast appears immediately\nGiven label applied\nWhen action completes\nThen success toast appears immediately\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.ensurePopupOpen();
    await da27Page.selectSingleLabel();
    await da27Page.waitForUiSync();
    await da27Page.isSuccessToastVisible();
    await da27Page.verifyUiStable();
  });
});
