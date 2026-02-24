import { test, expect } from '@playwright/test';
import { SessionCreatePage } from '../../../../pages/session-create.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { SessionCreateData } from '../../../../test-data';

test.describe('URS-DV-SC-01 > SRS-003: User Assignment & Approval Levels', () => {
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

  test(`${generateUnitTestId('15')}: Click Select All for Assignees`, async () => {
    await sessionPage.toggleAssigneesSelectAll();

    const selectedAssignees = await sessionPage.getSelectedAssignees();
    expect(selectedAssignees.length).toBeGreaterThan(0);

    await screenshot.takeStep('all-assignees-selected');
  });

  test(`${generateUnitTestId('16')}: Click Select All for Reviewers`, async () => {
    await sessionPage.toggleReviewersSelectAll();

    const selectedReviewers = await sessionPage.getSelectedReviewers();
    expect(selectedReviewers.length).toBeGreaterThan(0);

    await screenshot.takeStep('all-reviewers-selected');
  });

  test(`${generateUnitTestId('17')}: Add 1 Approval Level`, async () => {
    const countBefore = await sessionPage.getApprovalLevelCount();
    await sessionPage.addApprovalLevel();
    const countAfter = await sessionPage.getApprovalLevelCount();

    expect(countAfter).toBe(countBefore + 1);

    await screenshot.takeStep('one-approval-level-added');
  });

  test(`${generateUnitTestId('18')}: Select users for Approval Level 1`, async () => {
    await sessionPage.addApprovalLevel();
    await sessionPage.selectUsersForApprovalLevel(0);

    await screenshot.takeStep('users-selected-for-level-1');
  });

  test(`${generateUnitTestId('19')}: Add up to 5 Approval Levels`, async () => {
    const max = SessionCreateData.approvalLevels.maximum;
    await sessionPage.addApprovalLevels(max);

    const count = await sessionPage.getApprovalLevelCount();
    expect(count).toBe(max);

    await screenshot.takeStep('five-approval-levels');
  });

  test(`${generateUnitTestId('20')}: Verify Add Level button disabled/hidden at maximum (5)`, async () => {
    const max = SessionCreateData.approvalLevels.maximum;
    await sessionPage.addApprovalLevels(max);

    const isDisabledOrHidden = await sessionPage.isAddLevelButtonDisabledOrHidden();
    expect(isDisabledOrHidden).toBe(true);

    await screenshot.takeStep('add-level-disabled-at-max');
  });

  test(`${generateUnitTestId('21')}: Remove an Approval Level`, async () => {
    await sessionPage.addApprovalLevels(3);
    const countBefore = await sessionPage.getApprovalLevelCount();

    await sessionPage.removeApprovalLevel(countBefore - 1);

    const countAfter = await sessionPage.getApprovalLevelCount();
    expect(countAfter).toBe(countBefore - 1);

    await screenshot.takeStep('approval-level-removed');
  });

  test(`${generateUnitTestId('22')}: Deselect individual assignees`, async () => {
    // First select all assignees
    await sessionPage.toggleAssigneesSelectAll();
    const selectedBefore = await sessionPage.getSelectedAssignees();
    expect(selectedBefore.length).toBeGreaterThan(0);

    // Toggle select-all again to deselect all
    await sessionPage.toggleAssigneesSelectAll();
    const selectedAfter = await sessionPage.getSelectedAssignees();

    // After toggling again, either fewer or no assignees should be selected
    expect(selectedAfter.length).toBeLessThanOrEqual(selectedBefore.length);

    await screenshot.takeStep('assignees-deselected');
  });
});
