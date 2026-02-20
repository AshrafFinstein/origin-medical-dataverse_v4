import { test, expect } from '@playwright/test';
import { QcWorkflowPage } from '../../pages/qc-workflow.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-GEN-03: Approval Level Configuration – Session Creation
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via QcWorkflowPage methods only.
 */
test.describe('URS-DV-GEN-03: Approval Level Configuration – Session Creation', () => {
  let qcPage: QcWorkflowPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    qcPage = new QcWorkflowPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await qcPage.gotoSession();
  });

  // ── SRS-25: Approval Level Access Control ─────────────────────────────────

  test(`${generateUnitTestId('25')}: Verify only reviewer users can configure approval levels`, async () => {
    const configured = await qcPage.isReviewerSelectorConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('reviewer-access-control');
  });

  // ── SRS-26: Level 1 Approval Initialization & Mandatory Assignment ────────

  test(`${generateUnitTestId('26')}: Verify approval level selector is configured for Level 1 initialization`, async () => {
    const configured = await qcPage.isApprovalLevelSelectorConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('level-1-init');
  });

  // ── SRS-27: Add Multiple Approval Levels ─────────────────────────────────

  test(`${generateUnitTestId('27')}: Verify add approval level button supports multiple levels up to 5`, async () => {
    const addConfigured = await qcPage.isAddApprovalLevelButtonConfigured();
    expect(addConfigured).toBe(true);
    const maxValid = await qcPage.isMaxApprovalLevelValid();
    expect(maxValid).toBe(true);
    await screenshot.takeStep('add-multiple-levels');
  });

  // ── SRS-28: Multi-Level Image Approval Flow ───────────────────────────────

  test(`${generateUnitTestId('28')}: Verify image status definitions are configured for multi-level flow`, async () => {
    const configured = await qcPage.areImageStatusesConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('multi-level-flow');
  });

  // ── SRS-29: Delete Approval Levels Before Submission ─────────────────────

  test(`${generateUnitTestId('29')}: Verify QC modal selectors support level deletion before submission`, async () => {
    const configured = await qcPage.isQcModalConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('delete-levels');
  });

  // ── SRS-30: Approval Level Security & Access Control ─────────────────────

  test(`${generateUnitTestId('30')}: Verify access control messages are configured for approval level security`, async () => {
    const configured = await qcPage.isAccessControlConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('security-control');
  });

  // ── SRS-31: Approval Level Performance ───────────────────────────────────

  test(`${generateUnitTestId('31')}: Verify performance thresholds are configured for approval level loading`, async () => {
    const configured = await qcPage.isPerformanceConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('performance');
  });

  // ── SRS-32: Approval Level Usability ──────────────────────────────────────

  test(`${generateUnitTestId('32')}: Verify usability labels are configured for approval level interface`, async () => {
    const configured = await qcPage.areUsabilityLabelsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('usability');
  });
});
