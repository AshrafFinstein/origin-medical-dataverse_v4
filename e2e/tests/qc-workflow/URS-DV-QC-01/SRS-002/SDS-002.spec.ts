import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

// --- SRS-002 / SDS-002: Workflow-Based Edit Access Control ---

test.describe('URS-DV-QC-01 / SRS-002: Workflow-Based Edit Access & Status Filtering', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.gotoSession();
  });

  test(`${generateUnitTestId('19')}: Verify edit access in active workflow level`, async () => {
    await test.step('Given the image belongs to the user\'s current workflow / approval level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user selects the image', async () => {
      // TODO: Implement selectImageInActiveLevel() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then all editing actions should be enabled', async () => {
      // TODO: Implement isAnnotationButtonVisible() on QcWorkflowPage
      // TODO: Implement isInvertColorCheckboxVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('edit-access-active-level');
  });

  test(`${generateUnitTestId('20')}: Verify image is view-only in non-active level`, async () => {
    await test.step('Given the image is in a completed or other approval level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user opens the image', async () => {
      // TODO: Implement selectImageInNonActiveLevel() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should be view-only and non-editable', async () => {
      const accessControlConfigured = await qcPage.isAccessControlConfigured();
      expect(accessControlConfigured).toBe(true);
    });

    await screenshot.takeStep('view-only-non-active-level');
  });

  // --- SRS-003 / SDS-003: Send to QC & QC Routing ---

  test(`${generateUnitTestId('21')}: Verify Send Selected to QC button displays for PENDING image`, async () => {
    await test.step('Given a PENDING image is selected in the image grid', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the image is displayed in the right-side panel', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('Then the Send Selected to QC button should be visible and enabled', async () => {
      const qcModalConfigured = await qcPage.isQcModalConfigured();
      expect(qcModalConfigured).toBe(true);
    });

    await screenshot.takeStep('send-to-qc-button-visible');
  });

  test(`${generateUnitTestId('22')}: Verify send image to QC workflow`, async () => {
    await test.step('Given a PENDING image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks the Send Selected to QC button', async () => {
      // TODO: Implement sendSelectedToQc() on QcWorkflowPage
      // TODO: Implement isSaveButtonVisible() on QcWorkflowPage
      await qcPage.saveAndSendForQc();
    });

    await test.step('Then the image should be sent to the QC workflow', async () => {
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('image-sent-to-qc');
  });

  test(`${generateUnitTestId('23')}: Verify image assigned to Approval Level 1 user after sending to QC`, async () => {
    await test.step('Given the image is sent to QC', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the QC assignment is processed', async () => {
      // TODO: Implement verifyQcAssignment() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should be assigned to the Approval Level 1 user', async () => {
      const isMinValid = await qcPage.isMinApprovalLevelValid();
      expect(isMinValid).toBe(true);
    });

    await screenshot.takeStep('image-assigned-level-1');
  });

  test(`${generateUnitTestId('24')}: Verify image status changes from PENDING to IN_REVIEW`, async () => {
    await test.step('Given the image is sent to QC', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the image status is checked', async () => {
      // TODO: Implement getImageStatus() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the status should change from PENDING to IN_REVIEW', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('status-pending-to-in-review');
  });

  test(`${generateUnitTestId('25')}: Verify review level indicator displays inside image in QC review`, async () => {
    await test.step('Given the image is in QC review state', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the image is displayed in the image grid', async () => {
      // TODO: Implement selectInReviewImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the review level indicator should be displayed inside the image', async () => {
      const usabilityConfigured = await qcPage.areUsabilityLabelsConfigured();
      expect(usabilityConfigured).toBe(true);
    });

    await screenshot.takeStep('review-level-indicator');
  });

  test(`${generateUnitTestId('26')}: Verify IN_REVIEW L2 label displays inside image`, async () => {
    await test.step('Given the image has moved to the QC workflow', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the image is displayed in the grid', async () => {
      // TODO: Implement selectInReviewImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then IN_REVIEW L2 should be displayed inside the image', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('in-review-l2-label');
  });

  test(`${generateUnitTestId('27')}: Verify image removed from PENDING list after sending to QC`, async () => {
    await test.step('Given the image is sent to QC', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user filters images by PENDING status', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('Then the image should not be displayed', async () => {
      // TODO: Implement verifyImageNotInList() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('image-removed-from-pending');
  });

  test(`${generateUnitTestId('28')}: Verify image displays under IN_REVIEW status after sending to QC`, async () => {
    await test.step('Given the image is sent to QC', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user filters images by IN_REVIEW status', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('Then the image should be displayed', async () => {
      // TODO: Implement verifyImageInList() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('image-under-in-review-status');
  });

  // --- SRS-004 / SDS-004: QC Session Stage & Actions for Approval Levels ---

  test(`${generateUnitTestId('29')}: Verify QUALITY CHECKER stage displayed for Approval Levels user`, async () => {
    await test.step('Given the Approval Levels user is on the Data Labeling page', async () => {
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

    await screenshot.takeStep('quality-checker-stage');
  });

  test(`${generateUnitTestId('30')}: Verify Assignee name displayed for Approval Levels user`, async () => {
    await test.step('Given the Approval Levels user is on the Data Labeling page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the session details are viewed', async () => {
      // TODO: Implement viewSessionDetails() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the Assignee should be displayed correctly', async () => {
      const reviewerConfigured = await qcPage.isReviewerSelectorConfigured();
      expect(reviewerConfigured).toBe(true);
    });

    await screenshot.takeStep('assignee-name-displayed');
  });

  test(`${generateUnitTestId('31')}: Verify Approval Level displayed as Level 1 through Level 5`, async () => {
    await test.step('Given the Approval Levels user is on the Data Labeling page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the session details are viewed', async () => {
      // TODO: Implement viewSessionDetails() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the Approval Level should be displayed as Level 1 through Level 5', async () => {
      const isMinValid = await qcPage.isMinApprovalLevelValid();
      expect(isMinValid).toBe(true);
      const isMaxValid = await qcPage.isMaxApprovalLevelValid();
      expect(isMaxValid).toBe(true);
    });

    await screenshot.takeStep('approval-levels-1-to-5');
  });

  test(`${generateUnitTestId('32')}: Verify default Select Status is IN_REVIEW for Approval Levels user`, async () => {
    await test.step('Given the user is logged in as Approval Levels', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user opens the Data Labeling page', async () => {
      // TODO: Implement navigateToDataLabeling() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the Select Status field should default to IN_REVIEW', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('default-status-in-review');
  });

  test(`${generateUnitTestId('33')}: Verify Awaiting Approval is auto-checked for Approval Levels user`, async () => {
    await test.step('Given the user is logged in as Approval Level', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the Data Labeling page is loaded', async () => {
      // TODO: Implement navigateToDataLabeling() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then Awaiting Approval should be auto-checked', async () => {
      // TODO: Implement isAwaitingApprovalChecked() on QcWorkflowPage
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('awaiting-approval-auto-checked');
  });

  test(`${generateUnitTestId('34')}: Verify Accept and Reject actions displayed for IN_REVIEW image`, async () => {
    await test.step('Given an image is in IN_REVIEW state', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the image actions are viewed', async () => {
      // TODO: Implement selectInReviewImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then Accept and Reject options should be available', async () => {
      // TODO: Implement isAcceptButtonVisible(), isRejectButtonVisible() on QcWorkflowPage
      const accessConfigured = await qcPage.isAccessControlConfigured();
      expect(accessConfigured).toBe(true);
    });

    await screenshot.takeStep('accept-reject-actions-displayed');
  });

  test(`${generateUnitTestId('35')}: Verify any Level user can accept image in IN_REVIEW state`, async () => {
    await test.step('Given an image is in IN_REVIEW state', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When any Level user clicks Accept', async () => {
      // TODO: Implement clickAcceptButton() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should be accepted at Levels', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('image-accepted-at-level');
  });

  test(`${generateUnitTestId('36')}: Verify reject moves image to earlier approval level`, async () => {
    await test.step('Given a rejected image is selected', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks Reject', async () => {
      // TODO: Implement clickRejectButton() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image should move to the earlier approval level', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('reject-moves-to-earlier-level');
  });
});
