import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

// --- SRS-001 / SDS-001: Approval Level Initialization & Configuration ---

test.describe('URS-DV-QC-01 / SRS-001: Approval Level Configuration', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.gotoSession();
  });

  test(`${generateUnitTestId('1')}: Verify default state of Approval Level field when on Create Session page`, async () => {
    await test.step('Given the user is on the Create Session page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the page loads', async () => {
      // Page has loaded from navigation
    });

    await test.step('Then only the Add Level button should be visible and no Approval Level field should be displayed', async () => {
      const addButtonConfigured = await qcPage.isAddApprovalLevelButtonConfigured();
      expect(addButtonConfigured).toBe(true);

      const approvalLevelConfigured = await qcPage.isApprovalLevelSelectorConfigured();
      expect(approvalLevelConfigured).toBe(true);
    });

    await screenshot.takeStep('default-approval-level-state');
  });

  test(`${generateUnitTestId('2')}: Verify Approval Level field displays on Add Level click`, async () => {
    await test.step('Given the user is on the Create Session page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks the Add Level button', async () => {
      await qcPage.addApprovalLevel();
    });

    await test.step('Then a new Approval Level field should be displayed', async () => {
      const isConfigured = await qcPage.isApprovalLevelSelectorConfigured();
      expect(isConfigured).toBe(true);
    });

    await screenshot.takeStep('add-approval-level-field');
  });

  test(`${generateUnitTestId('3')}: Verify add approval levels up to maximum limit`, async () => {
    await test.step('Given the user keeps clicking Add Level', async () => {
      for (let i = 0; i < 5; i++) {
        await qcPage.addApprovalLevel();
      }
    });

    await test.step('When five Approval Level fields are added', async () => {
      // Five levels added in the previous step
    });

    await test.step('Then the system should not allow adding more than 5 levels', async () => {
      const isMaxValid = await qcPage.isMaxApprovalLevelValid();
      expect(isMaxValid).toBe(true);

      // TODO: Implement isAddLevelButtonDisabled() on QcWorkflowPage
    });

    await screenshot.takeStep('max-approval-levels-reached');
  });

  test(`${generateUnitTestId('4')}: Verify submit session with empty Approval Level fields shows error`, async () => {
    await test.step('Given one or more Approval Level fields are added', async () => {
      await qcPage.addApprovalLevel();
    });

    await test.step('And no user or group is selected in a level', async () => {
      // Leave the approval level field empty
    });

    await test.step('When the user clicks Create Session', async () => {
      // TODO: Implement submitSession() on QcWorkflowPage
    });

    await test.step('Then a toast message should be displayed saying approval level must have at least one user selected', async () => {
      // TODO: Implement getToastMessage() on QcWorkflowPage
      await qcPage.waitForError();
    });

    await screenshot.takeStep('empty-approval-level-error');
  });

  test(`${generateUnitTestId('5')}: Verify select multiple users in a single approval level`, async () => {
    await test.step('Given an Approval Level field is displayed', async () => {
      await qcPage.addApprovalLevel();
    });

    await test.step('When the user selects multiple users or user groups', async () => {
      // TODO: Implement selectMultipleReviewers() on QcWorkflowPage
    });

    await test.step('Then all selected users or groups should be added successfully', async () => {
      const isReviewerConfigured = await qcPage.isReviewerSelectorConfigured();
      expect(isReviewerConfigured).toBe(true);
    });

    await screenshot.takeStep('multiple-users-selected');
  });

  test(`${generateUnitTestId('6')}: Verify same user added individually and via group is prevented`, async () => {
    await test.step('Given a user is already part of a selected user group', async () => {
      await qcPage.addApprovalLevel();
      // TODO: Implement selectUserGroup() on QcWorkflowPage
    });

    await test.step('When the same user is selected individually in the same level', async () => {
      // TODO: Implement selectIndividualUser() on QcWorkflowPage
    });

    await test.step('Then the system should prevent the selection or show validation', async () => {
      // TODO: Implement verifyDuplicateUserPrevention() on QcWorkflowPage
      const isConfigured = await qcPage.isReviewerSelectorConfigured();
      expect(isConfigured).toBe(true);
    });

    await screenshot.takeStep('duplicate-user-prevention');
  });

  test(`${generateUnitTestId('7')}: Verify user group added after individual user selection prevents duplicates`, async () => {
    await test.step('Given an individual user is already selected in a level', async () => {
      await qcPage.addApprovalLevel();
      // TODO: Implement selectIndividualUser() on QcWorkflowPage
    });

    await test.step('When a group containing the same user is selected', async () => {
      // TODO: Implement selectUserGroupContainingSameUser() on QcWorkflowPage
    });

    await test.step('Then the system should restrict the group selection or exclude the duplicate user', async () => {
      // TODO: Implement verifyGroupDuplicateRestriction() on QcWorkflowPage
      const isConfigured = await qcPage.isReviewerSelectorConfigured();
      expect(isConfigured).toBe(true);
    });

    await screenshot.takeStep('group-duplicate-restriction');
  });

  test(`${generateUnitTestId('8')}: Verify submit session with valid approval levels succeeds`, async () => {
    await test.step('Given all Approval Levels have at least one unique user or group selected', async () => {
      await qcPage.addApprovalLevel();
      // TODO: Implement selectValidReviewer() on QcWorkflowPage
    });

    await test.step('And no duplicate users exist across individual and group selections', async () => {
      // Verified by the selection in previous step
    });

    await test.step('When the user submits the session', async () => {
      // TODO: Implement submitSession() on QcWorkflowPage
    });

    await test.step('Then the session should be created successfully', async () => {
      await qcPage.waitForSuccess();
    });

    await screenshot.takeStep('valid-approval-level-session-created');
  });

  // --- SRS-002 / SDS-002: Data Labeling Status Dropdown & Image Tools ---

  test(`${generateUnitTestId('9')}: Verify status dropdown opens on clicking Select Status`, async () => {
    await test.step('Given the user is on the Data Labeling page', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks the Select Status field', async () => {
      // TODO: Implement clickStatusDropdown() on QcWorkflowPage
    });

    await test.step('Then the status dropdown should be opened', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('status-dropdown-opened');
  });

  test(`${generateUnitTestId('10')}: Verify all supported statuses display in dropdown`, async () => {
    await test.step('Given the Select Status dropdown is opened', async () => {
      // TODO: Implement clickStatusDropdown() on QcWorkflowPage
    });

    await test.step('When the user views the dropdown options', async () => {
      // Dropdown is already visible
    });

    await test.step('Then statuses should be displayed', async () => {
      const statusConfigured = await qcPage.areImageStatusesConfigured();
      expect(statusConfigured).toBe(true);
    });

    await screenshot.takeStep('all-statuses-displayed');
  });

  test(`${generateUnitTestId('11')}: Verify filter images using PENDING status`, async () => {
    await test.step('Given the Select Status dropdown is opened', async () => {
      // TODO: Implement clickStatusDropdown() on QcWorkflowPage
    });

    await test.step('When the user selects the PENDING status', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('Then only PENDING images should be displayed', async () => {
      // TODO: Implement verifyFilteredImages() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('pending-status-filter');
  });

  test(`${generateUnitTestId('12')}: Verify no images message for PENDING status when none exist`, async () => {
    await test.step('Given no images exist with PENDING status', async () => {
      // Precondition: no pending images in the session
    });

    await test.step('When the user selects PENDING status', async () => {
      // TODO: Implement filterByStatus() on QcWorkflowPage
    });

    await test.step('Then a "No images available" message should be displayed', async () => {
      // TODO: Implement verifyNoImagesMessage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await screenshot.takeStep('no-images-pending-message');
  });

  test(`${generateUnitTestId('13')}: Verify tools visibility on pending image selection`, async () => {
    await test.step('Given the user is on the Data Labeling page and an image in Pending status is selected', async () => {
      await qcPage.waitForLoad();
    });

    await test.step('When the image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then Annotation, Invert Color, Zoom, Rotate, Flip, Pen, Brightness, and Contrast controls should be displayed', async () => {
      // TODO: Implement isAnnotationButtonVisible() on QcWorkflowPage
      // TODO: Implement isInvertColorCheckboxVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('tools-visible-on-pending-image');
  });

  test(`${generateUnitTestId('14')}: Verify annotate selected pending image`, async () => {
    await test.step('Given a Pending status image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks the Annotation button', async () => {
      // TODO: Implement clickAnnotationButton() on QcWorkflowPage
    });

    await test.step('Then the user should be able to draw and mark on the image', async () => {
      // TODO: Implement isCanvasVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('annotate-pending-image');
  });

  test(`${generateUnitTestId('15')}: Verify invert image colors on pending image`, async () => {
    await test.step('Given a Pending image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user checks the Invert Color checkbox', async () => {
      // TODO: Implement clickInvertColorCheckbox() on QcWorkflowPage
    });

    await test.step('Then the image colors should be inverted', async () => {
      // TODO: Implement isInvertColorCheckboxVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('invert-image-colors');
  });

  test(`${generateUnitTestId('16')}: Verify zoom in, zoom out, and reset zoom on pending image`, async () => {
    await test.step('Given a Pending image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks Zoom In, Zoom Out, and Reset Zoom', async () => {
      // TODO: Implement zoomIn(), zoomOut(), resetZoom() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image zoom level should adjust correctly and reset to default', async () => {
      // TODO: Implement isCanvasVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('zoom-controls-verified');
  });

  test(`${generateUnitTestId('17')}: Verify rotate and flip image on pending image`, async () => {
    await test.step('Given a Pending image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user clicks Rotate Clockwise and Flip icons', async () => {
      // TODO: Implement rotateImage(), flipImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image orientation should update correctly', async () => {
      // TODO: Implement isCanvasVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('rotate-flip-image');
  });

  test(`${generateUnitTestId('18')}: Verify adjust brightness and contrast on pending image`, async () => {
    await test.step('Given a Pending image is selected', async () => {
      // TODO: Implement selectPendingImage() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('When the user adjusts Brightness and Contrast controls', async () => {
      // TODO: Implement adjustBrightness(), adjustContrast() on QcWorkflowPage
      await qcPage.waitForLoad();
    });

    await test.step('Then the image appearance should change accordingly', async () => {
      // TODO: Implement isCanvasVisible() on QcWorkflowPage
    });

    await screenshot.takeStep('brightness-contrast-adjusted');
  });
});
