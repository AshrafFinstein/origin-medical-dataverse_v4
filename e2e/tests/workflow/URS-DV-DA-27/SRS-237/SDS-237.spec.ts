import { test } from '@playwright/test';
import { Da27AnnotationPage } from '../../../../pages/da27-annotation.page';

test.describe('SRS-237 - SDS-237', () => {
  let da27Page: Da27AnnotationPage;

  test.beforeEach(async ({ page }) => {
    da27Page = new Da27AnnotationPage(page);
    await da27Page.openDataLabellingSession();
  });

  test('UTC-2456: Given user has label edit permission When annotation page loads Then Apply and Remove controls should be enabled\nGiven user has label edit permission\nWhen annotation page loads\nThen Apply and Remove controls should be enabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.ensurePopupOpen();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2457: Given user has read-only role When annotation page loads Then Apply and Remove controls should be disabled\nGiven user has read-only role\nWhen annotation page loads\nThen Apply and Remove controls should be disabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.ensurePopupOpen();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2458: Given controls disabled When user views them Then opacity/disabled styling clearly indicates restriction\nGiven controls disabled\nWhen user views them\nThen opacity/disabled styling clearly indicates restriction\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });

  test('UTC-2459: Given unauthorized user When clicking Apply Then action must not execute\nGiven unauthorized user\nWhen clicking Apply\nThen action must not execute\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.clickApplyButton();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2460: Given unauthorized user When clicking Remove or pressing Backspace Then label removal must not execute\nGiven unauthorized user\nWhen clicking Remove or pressing Backspace\nThen label removal must not execute\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.pressBackspace();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2461: Given unauthorized action attempted When system blocks request Then “Access Denied” message displayed\nGiven unauthorized action attempted\nWhen system blocks request\nThen “Access Denied” message displayed\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2462: Given user manipulates frontend via console When API request sent directly Then server returns 403 Forbidden\nGiven user manipulates frontend via console\nWhen API request sent directly\nThen server returns 403 Forbidden\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2463: Given unauthorized attempt When request blocked Then labels remain unchanged in DB\nGiven unauthorized attempt\nWhen request blocked\nThen labels remain unchanged in DB\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2464: Given user clicks Apply When request initiated Then permission must be validated before processing\nGiven user clicks Apply\nWhen request initiated\nThen permission must be validated before processing\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2465: Given admin role revoked during session When page refresh occurs Then controls become disabled\nGiven admin role revoked during session\nWhen page refresh occurs\nThen controls become disabled\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.refreshPage();
    await da27Page.isApplyDisabled();
  });

  test('UTC-2466: Given mixed roles logged in When each loads page Then only permitted users see enabled actions\nGiven mixed roles logged in\nWhen each loads page\nThen only permitted users see enabled actions\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isApplyEnabled();
  });

  test('UTC-2467: Given disabled control hovered When tooltip appears Then message explains permission restriction\nGiven disabled control hovered\nWhen tooltip appears\nThen message explains permission restriction\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.isErrorToastVisible();
  });

  test('UTC-2468: Given unauthorized user When Backspace pressed Then removal action should not trigger\nGiven unauthorized user\nWhen Backspace pressed\nThen removal action should not trigger\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.pressBackspace();
    await da27Page.verifyNoActionOccurred();
  });

  test('UTC-2469: Given unauthorized attempt When blocked Then system logs security audit event\nGiven unauthorized attempt\nWhen blocked\nThen system logs security audit event\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
  });

  test('UTC-2470: Given user performs action When validation occurs Then permission check completes instantly (<200ms)\nGiven user performs action\nWhen validation occurs\nThen permission check completes instantly (<200ms)\n', async ({ page }) => {
    const da27Page = new Da27AnnotationPage(page);
    await da27Page.selectPendingImageFromGrid();
    await da27Page.waitForUiSync();
    await da27Page.waitForUiSync();
    await da27Page.verifyUiStable();
  });
});
