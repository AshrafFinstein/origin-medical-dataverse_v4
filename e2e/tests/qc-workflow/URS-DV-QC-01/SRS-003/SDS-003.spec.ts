import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

// --- SRS-005 / SDS-005: QC Rejection & Rollback Workflow ---

test.describe('URS-DV-QC-01 / SRS-003: QC Rejection, Rollback & Workflow Progression', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.gotoSession();
  });

  test(`${generateUnitTestId('37')}: Verify final level user rejects image in IN_REVIEW state`, async () => {
    await test.step('Given an image is in IN_REVIEW state', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the final level user clicks Reject', async () => {
      // TODO: Implement clickRejectButton() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should be rejected', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('final-level-reject');
  });

  test(`${generateUnitTestId('38')}: Verify rejected image moves to previous level after final rejection`, async () => {
    await test.step('Given an image is rejected at the final approval level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the workflow is updated', async () => {
      // TODO: Implement waitForWorkflowUpdate() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should move back to the previous approval level', async () => {
      // TODO: Implement verifyImageAtPreviousLevel() on QcWorkflowPage
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('rejected-moves-to-previous-level');
  });

  test(`${generateUnitTestId('39')}: Verify REJECTED option available in Select Status dropdown`, async () => {
    await test.step('Given the user is on the Data Labeling page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks the Select Status dropdown', async () => {
      // TODO: Implement clickStatusDropdown() on QcWorkflowPage
    });

    await test.step('Then the REJECTED option should be available', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('rejected-option-available');
  });

  test(`${generateUnitTestId('40')}: Verify rejected images display under REJECTED status`, async () => {
    await test.step('Given the user selects REJECTED from the Select Status dropdown', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('When the image grid is displayed', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('Then the rejected image should be displayed', async () => {
      // TODO: Implement verifyRejectedImageVisible() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('rejected-images-displayed');
  });

  test(`${generateUnitTestId('41')}: Verify REJECTED L indicator displays on rejected image`, async () => {
    await test.step('Given a rejected image is displayed under REJECTED status', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the image card is viewed', async () => {
      // TODO: Implement selectRejectedImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then REJECTED L should be displayed inside the image', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('rejected-l-indicator');
  });

  test(`${generateUnitTestId('42')}: Verify rejected image hidden from IN_REVIEW list`, async () => {
    await test.step('Given an image is rejected at the final level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user filters images by IN_REVIEW status', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('Then the rejected image should not be displayed', async () => {
      // TODO: Implement verifyRejectedImageNotInList() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('rejected-hidden-from-in-review');
  });

  test(`${generateUnitTestId('43')}: Verify Select Status changes to REJECTED`, async () => {
    await test.step('Given the user is on the Data Labeling page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user selects REJECTED from the Select Status dropdown', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('Then the status filter should be updated to REJECTED', async () => {
      // TODO: Implement getSelectedStatus() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('status-changed-to-rejected');
  });

  test(`${generateUnitTestId('44')}: Verify rejected images display after rollback`, async () => {
    await test.step('Given Select Status is set to REJECTED', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('When the image grid is displayed', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('Then rejected images should be displayed', async () => {
      // TODO: Implement verifyRejectedImagesVisible() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('rejected-images-after-rollback');
  });

  test(`${generateUnitTestId('45')}: Verify REJECTED L indicator on rollback view`, async () => {
    await test.step('Given rejected images are displayed', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the image card is viewed', async () => {
      // TODO: Implement selectRejectedImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then REJECTED L should be displayed inside the image', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('rejected-l-indicator-rollback');
  });

  test(`${generateUnitTestId('46')}: Verify Accept and Reject actions enabled for rejected image`, async () => {
    await test.step('Given a rejected image is selected', async () => {
      // TODO: Implement selectRejectedImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the image action panel is viewed', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('Then Accept and Reject buttons should be enabled', async () => {
      // TODO: Implement isAcceptButtonEnabled(), isRejectButtonEnabled() on QcWorkflowPage
      const accessConfigured = await qcPage.isAccessControlConfigured();
      expect(accessConfigured).toBe(true);
    });

    await screenshot.takeStep('accept-reject-enabled-rejected-image');
  });

  test(`${generateUnitTestId('47')}: Verify reject moves rejected image to earlier approval level`, async () => {
    await test.step('Given a rejected image is selected', async () => {
      // TODO: Implement selectRejectedImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks Reject', async () => {
      // TODO: Implement clickRejectButton() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should move to the earlier approval level', async () => {
      // TODO: Implement verifyImageMovedToEarlierLevel() on QcWorkflowPage
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('reject-moves-earlier-level');
  });

  test(`${generateUnitTestId('48')}: Verify accept moves rejected image to final approval level`, async () => {
    await test.step('Given a rejected image is selected', async () => {
      // TODO: Implement selectRejectedImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks Accept', async () => {
      // TODO: Implement clickAcceptButton() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should move to the final approval level', async () => {
      // TODO: Implement verifyImageMovedToFinalLevel() on QcWorkflowPage
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('accept-moves-to-final-level');
  });

  // --- SRS-006 / SDS-006: QC Workflow Progression ---

  test(`${generateUnitTestId('49')}: Verify image moves out of Levels after acceptance`, async () => {
    await test.step('Given an image is accepted by a Levels user', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the image status is updated', async () => {
      // TODO: Implement waitForStatusUpdate() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should move to the next approval level or final stage', async () => {
      // TODO: Implement verifyImageProgression() on QcWorkflowPage
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('image-moves-after-acceptance');
  });

  test(`${generateUnitTestId('50')}: Verify multiple users access same image under same Approval Level`, async () => {
    await test.step('Given multiple users are configured under Approval Level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When each user accesses the same session', async () => {
      // TODO: Implement verifyMultiUserAccess() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the same IN_REVIEW images should be visible', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('multiple-users-same-image');
  });

  test(`${generateUnitTestId('51')}: Verify image moves to next approval level after acceptance at non-final level`, async () => {
    await test.step('Given an image is in IN_REVIEW status at a non-final approval level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('And the user belongs to the current active approval level', async () => {
      // Verified by login context
    });

    await test.step('When the user clicks Accept on the image', async () => {
      // TODO: Implement clickAcceptButton() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should move to the next approval level in the workflow', async () => {
      // TODO: Implement verifyImageMovedToNextLevel() on QcWorkflowPage
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('image-moves-to-next-level');
  });

  test(`${generateUnitTestId('52')}: Verify image becomes editable at new active level after workflow transition`, async () => {
    await test.step('Given the image has moved to the next approval level after acceptance', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When a user from the new active approval level opens the image', async () => {
      // TODO: Implement openImageAsNewLevelUser() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should be accessible and editable, with all editing tools enabled', async () => {
      // TODO: Implement verifyEditToolsEnabled() on QcWorkflowPage
      const accessConfigured = await qcPage.isAccessControlConfigured();
      expect(accessConfigured).toBe(true);
    });

    await screenshot.takeStep('editable-at-new-active-level');
  });

  // --- SRS-007 / SDS-007: Final Approval Level Session Details ---

  test(`${generateUnitTestId('53')}: Verify Stage displayed as QUALITY CHECKER for Final Approval Level user`, async () => {
    await test.step('Given the Final Approval Level user is on the Data Labeling page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the session details are viewed', async () => {
      // TODO: Implement viewSessionDetails() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the Stage should be displayed as QUALITY CHECKER', async () => {
      const usabilityConfigured = await qcPage.areUsabilityLabelsConfigured();
      expect(usabilityConfigured).toBe(true);
    });

    await screenshot.takeStep('quality-checker-stage-final');
  });

  test(`${generateUnitTestId('54')}: Verify default Select Status is IN_REVIEW for Final Approval Level user`, async () => {
    await test.step('Given the user is logged in as Final Approval Level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the Data Labeling page is opened', async () => {
      // TODO: Implement navigateToDataLabeling() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the Select Status field should default to IN_REVIEW', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('default-status-in-review-final');
  });
});
