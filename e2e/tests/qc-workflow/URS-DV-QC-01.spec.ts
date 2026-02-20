import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-QC-01: QC Workflow — Multi-Level Image Approval
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via QcWorkflowPage methods only.
 */
test.describe('URS-DV-QC-01: QC Workflow - Multi-Level Image Approval', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.gotoSession();
  });

  // ── SRS-1 / SDS-1: Approval Level Image Movement ─────────────────────────

  test(`${generateUnitTestId('1')}: Verify approval level selector is configured for multi-level image flow`, async () => {
    const configured = await qcPage.isApprovalLevelSelectorConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('approval-level-selector');
  });

  // ── SRS-2 / SDS-2: Image Edit Access Restriction ─────────────────────────

  test(`${generateUnitTestId('2')}: Verify QC modal selectors are configured for image edit access control`, async () => {
    const configured = await qcPage.isQcModalConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('qc-modal-config');
  });

  // ── SRS-3 / SDS-3: Assignee-Level Image Editing and Submission ───────────

  test(`${generateUnitTestId('3')}: Verify add approval level button is configured for assignee submission flow`, async () => {
    const configured = await qcPage.isAddApprovalLevelButtonConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('add-approval-level');
  });

  // ── SRS-4 / SDS-4: Quality Check Review Flow Across Levels ───────────────

  test(`${generateUnitTestId('4')}: Verify reviewer selectors are configured for multi-level QC review access`, async () => {
    const configured = await qcPage.isReviewerSelectorConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('reviewer-selectors');
  });

  // ── SRS-5 / SDS-5: Rejection Rollback Handling ───────────────────────────

  test(`${generateUnitTestId('5')}: Verify image status definitions include REJECTED status for rollback handling`, async () => {
    const configured = await qcPage.areImageStatusesConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('image-status-rejected');
  });

  // ── SRS-6 / SDS-6: Acceptance Forward Flow Control ───────────────────────

  test(`${generateUnitTestId('6')}: Verify image status definitions include ACCEPTED status for forward movement flow`, async () => {
    const configured = await qcPage.areImageStatusesConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('image-status-accepted');
  });

  // ── SRS-7 / SDS-7: Final Level Approval Completion ───────────────────────

  test(`${generateUnitTestId('7')}: Verify max approval level is set to 5 for final approval completion`, async () => {
    const valid = await qcPage.isMaxApprovalLevelValid();
    expect(valid).toBe(true);
    await screenshot.takeStep('max-approval-level');
  });

  // ── SRS-8 / SDS-8: Role & Level Based Access Control ─────────────────────

  test(`${generateUnitTestId('8')}: Verify access control messages are configured for role and level based security`, async () => {
    const configured = await qcPage.isAccessControlConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('access-control');
  });

  // ── SRS-9 / SDS-9: Approval Workflow Performance Handling ────────────────

  test(`${generateUnitTestId('9')}: Verify performance thresholds are configured for approval workflow responsiveness`, async () => {
    const configured = await qcPage.isPerformanceConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('performance-config');
  });

  // ── SRS-10 / SDS-10: User-Friendly Review Experience ─────────────────────

  test(`${generateUnitTestId('10')}: Verify usability labels are configured for user-friendly review experience`, async () => {
    const configured = await qcPage.areUsabilityLabelsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('usability-labels');
  });
});
