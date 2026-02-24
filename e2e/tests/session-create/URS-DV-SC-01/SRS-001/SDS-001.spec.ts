import { test, expect } from '@playwright/test';
import { SessionCreatePage } from '../../../../pages/session-create.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

test.describe('URS-DV-SC-01 > SRS-001: Navigation & Create Session Modal', () => {
  let sessionPage: SessionCreatePage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionCreatePage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await sessionPage.navigateToSessionList();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('1')}: Navigate from Epic list to Session list`, async () => {
    const tableVisible = await sessionPage.isSessionTableVisible();
    expect(tableVisible).toBe(true);

    const createBtnVisible = await sessionPage.isCreateButtonVisible();
    expect(createBtnVisible).toBe(true);

    await screenshot.takeStep('session-list-visible');
  });

  test(`${generateUnitTestId('2')}: Click Create Session button opens modal`, async () => {
    await sessionPage.openCreateModal();

    const modalVisible = await sessionPage.isModalVisible();
    expect(modalVisible).toBe(true);

    await screenshot.takeStep('create-session-modal-open');
  });

  test(`${generateUnitTestId('3')}: Verify all core form fields visible in modal`, async () => {
    await sessionPage.openCreateModal();

    const nameVisible = await sessionPage.isNameInputVisible();
    expect(nameVisible).toBe(true);

    const descVisible = await sessionPage.isDescriptionInputVisible();
    expect(descVisible).toBe(true);

    const statusVisible = await sessionPage.isStatusSelectVisible();
    expect(statusVisible).toBe(true);

    const assigneesVisible = await sessionPage.isAssigneesSelectVisible();
    expect(assigneesVisible).toBe(true);

    const reviewersVisible = await sessionPage.isReviewersSelectVisible();
    expect(reviewersVisible).toBe(true);

    const autoGenVisible = await sessionPage.isAutoGenerateCheckboxVisible();
    expect(autoGenVisible).toBe(true);

    await screenshot.takeStep('all-form-fields-visible');
  });

  test(`${generateUnitTestId('4')}: Click Cancel button closes modal`, async () => {
    await sessionPage.openCreateModal();
    const modalBefore = await sessionPage.isModalVisible();
    expect(modalBefore).toBe(true);

    await sessionPage.clickCancel();

    const modalAfter = await sessionPage.isModalVisible();
    expect(modalAfter).toBe(false);

    const tableVisible = await sessionPage.isSessionTableVisible();
    expect(tableVisible).toBe(true);

    await screenshot.takeStep('modal-closed-after-cancel');
  });

  test(`${generateUnitTestId('5')}: Re-open modal and verify it is fresh (no stale data)`, async () => {
    // First open — fill some data then cancel
    await sessionPage.openCreateModal();
    await sessionPage.fillSessionName('Stale Test Name');
    await sessionPage.clickCancel();
    await sessionPage.waitForModalClose();

    // Re-open — fields should be empty/default
    await sessionPage.openCreateModal();
    const nameValue = await sessionPage.getSessionNameValue();
    expect(nameValue === '' || nameValue !== 'Stale Test Name').toBe(true);

    await screenshot.takeStep('fresh-modal-no-stale-data');
  });
});
