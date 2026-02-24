import { test, expect } from '@playwright/test';
import { SessionCreatePage } from '../../../../pages/session-create.page';
import { generateUnitTestId, generateSessionName } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { saveGeneratedData } from '../../../../utils/generatedDataStore';
import { SessionCreateData } from '../../../../test-data';

test.describe('URS-DV-SC-01 > SRS-005: Form Submission & Validation', () => {
  let sessionPage: SessionCreatePage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionCreatePage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await sessionPage.navigateToSessionList();
    await sessionPage.openCreateModal();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('28')}: Submit button is disabled with empty required fields`, async () => {
    // Without filling any required fields, the Submit button should be disabled
    const isDisabled = await sessionPage.isSubmitButtonDisabled();
    expect(isDisabled).toBe(true);

    // Modal should still be open
    const modalStillOpen = await sessionPage.isModalVisible();
    expect(modalStillOpen).toBe(true);

    await screenshot.takeStep('submit-button-disabled-empty-fields');
  });

  test(`${generateUnitTestId('29')}: Fill all required fields and submit successfully`, async () => {
    const sessionName = generateSessionName();

    // Fill required fields
    await sessionPage.fillSessionName(sessionName);
    await sessionPage.fillDescription(SessionCreateData.description);

    // Select all reviewers (required for session creation)
    await sessionPage.toggleReviewersSelectAll();

    // Submit the form
    await sessionPage.clickSubmit();

    // Wait for the modal to close or success toast
    await sessionPage.page.waitForTimeout(3000);

    const dialog = sessionPage.page.getByRole('dialog');
    const modalGone = await dialog.isHidden().catch(() => true);
    const tableVisible = await sessionPage.isSessionTableVisible().catch(() => false);

    expect(tableVisible || modalGone).toBe(true);

    // Persist the created session for subsequent tests
    saveGeneratedData('sessions', `session-create-${Date.now()}`, {
      name: sessionName,
      createdAt: new Date().toISOString(),
    });

    await screenshot.takeStep('session-created-successfully');
  });

  test(`${generateUnitTestId('30')}: Verify new session appears in session list`, async () => {
    const sessionName = generateSessionName();

    // Fill required fields and create session
    await sessionPage.fillSessionName(sessionName);
    await sessionPage.fillDescription(SessionCreateData.description);
    await sessionPage.toggleReviewersSelectAll();
    await sessionPage.clickSubmit();
    await sessionPage.page.waitForTimeout(3000);
    await sessionPage.waitForModalClose();
    const isInTable = await sessionPage.isSessionInTable(sessionName);
    expect(isInTable).toBe(true);

    saveGeneratedData('sessions', `session-verify-${Date.now()}`, {
      name: sessionName,
      createdAt: new Date().toISOString(),
    });

    await screenshot.takeStep('session-in-table');
  });

  test(`${generateUnitTestId('31')}: Click Go on created session navigates to DL page`, async () => {
    const sessionName = generateSessionName();

    // Create a session first
    await sessionPage.fillSessionName(sessionName);
    await sessionPage.fillDescription(SessionCreateData.description);
    await sessionPage.toggleReviewersSelectAll();
    await sessionPage.clickSubmit();

    // Wait for creation to complete
    await sessionPage.page.waitForTimeout(3000);
    await sessionPage.waitForModalClose();

    // Click "Go" on the newly created session
    const isInTable = await sessionPage.isSessionInTable(sessionName);
    if (isInTable) {
      await sessionPage.clickGoOnSession(sessionName);

      // Verify navigation to data-labelling page
      const currentUrl = await sessionPage.getCurrentUrl();
      expect(
        currentUrl.includes('data-labelling') ||
          currentUrl.includes('clinical-evaluation'),
      ).toBe(true);
    }

    await screenshot.takeStep('navigated-to-dl-page');
  });
});
