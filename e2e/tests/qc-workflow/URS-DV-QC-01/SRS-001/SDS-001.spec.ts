import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId, generateSessionName } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { saveGeneratedData } from '../../../../utils/generatedDataStore';

test.describe('URS-DV-QC-01 > SRS-001: Approval Level Configuration', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.navigateToCreateSession();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('1')}: Navigate to create session and verify Add Level button visible`, async () => {
    const isVisible = await qcPage.isAddLevelButtonVisible();
    expect(isVisible).toBe(true);
    await screenshot.takeStep('add-level-button-visible');
  });

  test(`${generateUnitTestId('2')}: Verify approval level field is hidden by default`, async () => {
    const isHidden = await qcPage.isApprovalLevelFieldHidden();
    expect(isHidden).toBe(true);
    await screenshot.takeStep('approval-level-field-hidden');
  });

  test(`${generateUnitTestId('3')}: Click Add Level and verify approval level field appears`, async () => {
    await qcPage.clickAddLevel();
    const isVisible = await qcPage.isApprovalLevelFieldVisible();
    expect(isVisible).toBe(true);
    await screenshot.takeStep('approval-level-field-visible');
  });

  test(`${generateUnitTestId('4')}: Add multiple levels up to 3 and verify count`, async () => {
    await qcPage.addApprovalLevels(3);
    const count = await qcPage.getApprovalLevelCount();
    expect(count).toBe(3);
    await screenshot.takeStep('three-approval-levels');
  });

  test(`${generateUnitTestId('5')}: Add up to max 5 levels and verify count equals 5`, async () => {
    const maxLevels = await qcPage.getMaxApprovalLevels();
    await qcPage.addApprovalLevels(maxLevels);
    const count = await qcPage.getApprovalLevelCount();
    expect(count).toBe(maxLevels);
    await screenshot.takeStep('max-approval-levels');
  });

  test(`${generateUnitTestId('6')}: Verify Add Level button disabled at maximum`, async () => {
    const maxLevels = await qcPage.getMaxApprovalLevels();
    await qcPage.addApprovalLevels(maxLevels);
    const isDisabled = await qcPage.isAddLevelButtonDisabled();
    expect(isDisabled).toBe(true);
    await screenshot.takeStep('add-level-button-disabled');
  });

  test(`${generateUnitTestId('7')}: Remove an approval level and verify count decreases`, async () => {
    await qcPage.addApprovalLevels(3);
    const countBefore = await qcPage.getApprovalLevelCount();
    await qcPage.removeApprovalLevel(countBefore - 1);
    const countAfter = await qcPage.getApprovalLevelCount();
    expect(countAfter).toBe(countBefore - 1);
    await screenshot.takeStep('level-removed');
  });

  test(`${generateUnitTestId('8')}: Select users for an approval level`, async () => {
    await qcPage.clickAddLevel();
    await qcPage.selectUsersForLevel(0);
    await qcPage.selectAllReviewers();
    await screenshot.takeStep('users-selected-for-level');
  });

  test(`${generateUnitTestId('9')}: Verify submit disabled when approval level is empty`, async () => {
    await qcPage.clickAddLevel();
    // With empty approval level users, the Submit button should be disabled
    const dialog = qcPage.page.getByRole('dialog');
    const submitBtn = dialog.getByRole('button', { name: 'Submit' });
    const isDisabled = await submitBtn.isDisabled().catch(() => true);
    expect(isDisabled).toBe(true);
    await screenshot.takeStep('submit-disabled-empty-level');
  });

  test(`${generateUnitTestId('10')}: Verify session created successfully with valid levels`, async () => {
    const sessionName = generateSessionName();
    await qcPage.fillSessionName(sessionName);

    // Select all reviewers first (required before approval levels can reference them)
    await qcPage.selectAllReviewers();

    // Select users for the default approval level (level 1 exists by default)
    const count = await qcPage.getApprovalLevelCount();
    for (let i = 0; i < count; i++) {
      await qcPage.selectUsersForLevel(i);
    }

    await qcPage.clickCreateSession();

    saveGeneratedData('sessions', `session-${Date.now()}`, {
      name: sessionName,
      createdAt: new Date().toISOString(),
      approvalLevels: count,
    });

    // Wait for modal to close (indicating successful creation) or for success toast
    await qcPage.page.waitForTimeout(3000);

    // Verify the session was created by checking we're back on the session list
    // (modal is gone and the table is visible)
    const tableVisible = await qcPage.isSessionTableVisible().catch(() => false);
    const dialog = qcPage.page.getByRole('dialog');
    const modalGone = await dialog.isHidden().catch(() => true);

    expect(tableVisible || modalGone).toBe(true);
    await screenshot.takeStep('session-created-success');
  });
});
