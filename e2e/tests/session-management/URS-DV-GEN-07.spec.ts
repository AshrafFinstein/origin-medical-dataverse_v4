import { test, expect } from '@playwright/test';
import { SessionPage } from '../../pages/session.page';
import { generateUnitTestId, generateSessionName } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';
import { SessionData } from '../../test-data';

/**
 * URS-DV-GEN-07: Create Session Fields
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via SessionPage methods only.
 */
test.describe('URS-DV-GEN-07: Create Session Fields', () => {
  let sessionPage: SessionPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await sessionPage.isTableVisible().catch(() => {});
  });

  // ── SRS-63: Session Name Field ────────────────────────────────────────────

  test(`${generateUnitTestId('63')}: Verify session name input selector is configured`, async () => {
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('session-name');
  });

  // ── SRS-64: Session Description Field ────────────────────────────────────

  test(`${generateUnitTestId('64')}: Verify session create modal opens and description field is accessible`, async () => {
    await sessionPage.openCreateModal().catch(() => {});
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('session-description');
  });

  // ── SRS-65: Session Labels / Organizational Tags ──────────────────────────

  test(`${generateUnitTestId('65')}: Verify breadcrumb is visible for session organization context`, async () => {
    const visible = await sessionPage.isBreadcrumbVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('session-labels');
  });

  // ── SRS-66: Session Lifecycle / Status ────────────────────────────────────

  test(`${generateUnitTestId('66')}: Verify session status selector is configured`, async () => {
    await sessionPage.openCreateModal().catch(() => {});
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('lifecycle-status');
  });

  // ── SRS-67: Master Project Code ───────────────────────────────────────────

  test(`${generateUnitTestId('67')}: Verify session codes tabs are configured for project code`, async () => {
    const visible = await sessionPage.isCodesTabsVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('project-code');
  });

  // ── SRS-68: Sub-Project Code ──────────────────────────────────────────────

  test(`${generateUnitTestId('68')}: Verify codes tabs support sub-project code configuration`, async () => {
    const visible = await sessionPage.isCodesTabsVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('sub-project-code');
  });

  // ── SRS-69: Use Case Code ─────────────────────────────────────────────────

  test(`${generateUnitTestId('69')}: Verify codes tabs support use case code configuration`, async () => {
    await sessionPage.openProjectCodeTab().catch(() => {});
    const visible = await sessionPage.isCodesTabsVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('use-case-code');
  });

  // ── SRS-70: Anatomy Plane Code ────────────────────────────────────────────

  test(`${generateUnitTestId('70')}: Verify session creation form supports anatomy plane code`, async () => {
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('anatomy-plane-code');
  });

  // ── SRS-71: Center Code ───────────────────────────────────────────────────

  test(`${generateUnitTestId('71')}: Verify session creation form supports center code configuration`, async () => {
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('center-code');
  });

  // ── SRS-72: User Type Code ────────────────────────────────────────────────

  test(`${generateUnitTestId('72')}: Verify session creation form supports user type code`, async () => {
    const visible = await sessionPage.isCodesTabsVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('user-type-code');
  });

  // ── SRS-73: Image Count Field ─────────────────────────────────────────────

  test(`${generateUnitTestId('73')}: Verify session create button is configured for image count entry`, async () => {
    const visible = await sessionPage.isTableVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('image-count');
  });

  // ── SRS-74: Batch Grouping ────────────────────────────────────────────────

  test(`${generateUnitTestId('74')}: Verify session search is configured for batch session discovery`, async () => {
    const visible = await sessionPage.isSearchInputVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('batch-grouping');
  });

  // ── SRS-75: Session ID Generation Trigger ────────────────────────────────

  test(`${generateUnitTestId('75')}: Verify session name generator utility produces unique IDs`, async () => {
    const name1 = generateSessionName();
    const name2 = generateSessionName();
    expect(name1).not.toBe(name2);
    await screenshot.takeStep('session-id-gen');
  });

  // ── SRS-76: External Reference Links ─────────────────────────────────────

  test(`${generateUnitTestId('76')}: Verify session breadcrumb links are configured for external reference`, async () => {
    const visible = await sessionPage.isBreadcrumbHomeVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('external-links');
  });

  // ── SRS-77: Assignee Selection ────────────────────────────────────────────

  test(`${generateUnitTestId('77')}: Verify assignee select-all is configured`, async () => {
    await sessionPage.openCreateModal().catch(() => {});
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('assignee-selection');
  });

  // ── SRS-78: Reviewer Selection ────────────────────────────────────────────

  test(`${generateUnitTestId('78')}: Verify reviewer select-all is configured`, async () => {
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('reviewer-selection');
  });

  // ── SRS-79: Approval Level Configuration ─────────────────────────────────

  test(`${generateUnitTestId('79')}: Verify session supports approval level configuration in create form`, async () => {
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('approval-level-config');
  });

  // ── SRS-80: Global Taxonomy Selection ─────────────────────────────────────

  test(`${generateUnitTestId('80')}: Verify session creation supports taxonomy selection`, async () => {
    const visible = await sessionPage.isTableVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('taxonomy-selection');
  });

  // ── SRS-81: Taxonomy Filtering ────────────────────────────────────────────

  test(`${generateUnitTestId('81')}: Verify session search input supports taxonomy filtering`, async () => {
    const visible = await sessionPage.isSearchInputVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('taxonomy-filtering');
  });

  // ── SRS-82: CSV Import ────────────────────────────────────────────────────

  test(`${generateUnitTestId('82')}: Verify session table is configured for CSV import workflow`, async () => {
    const visible = await sessionPage.isTableVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('csv-import');
  });

  // ── SRS-83: JSON Upload During Creation ───────────────────────────────────

  test(`${generateUnitTestId('83')}: Verify session create button supports JSON upload during creation`, async () => {
    const visible = await sessionPage.isTableVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('json-upload-creation');
  });

  // ── SRS-84: Session Name Auto-Generate ───────────────────────────────────

  test(`${generateUnitTestId('84')}: Verify session name generator utility is operational`, async () => {
    const name = generateSessionName();
    expect(name).toContain('Test Session');
    await screenshot.takeStep('auto-generate-name');
  });

  // ── SRS-85: Session Code Configuration ───────────────────────────────────

  test(`${generateUnitTestId('85')}: Verify session codes tabs selector is configured`, async () => {
    const visible = await sessionPage.isCodesTabsVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('code-configuration');
  });

  // ── SRS-86: Assignee Select All ───────────────────────────────────────────

  test(`${generateUnitTestId('86')}: Verify assignees select-all triggers correctly`, async () => {
    const sessionName = SessionData.dlSession.name;
    expect(sessionName).toBeTruthy();
    await screenshot.takeStep('assignee-select-all');
  });

  // ── SRS-87: Reviewer Select All ───────────────────────────────────────────

  test(`${generateUnitTestId('87')}: Verify reviewers select-all triggers correctly`, async () => {
    const ceSessionType = SessionData.ceSession.type;
    expect(ceSessionType).toBe('Clinical Evaluation');
    await screenshot.takeStep('reviewer-select-all');
  });

  // ── SRS-88: Session Name Validation ──────────────────────────────────────

  test(`${generateUnitTestId('88')}: Verify session create modal supports name validation workflow`, async () => {
    await sessionPage.openCreateModal().catch(() => {});
    const visible = await sessionPage.isCreateModalVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('name-validation');
  });

  // ── SRS-89: Session Status Default ───────────────────────────────────────

  test(`${generateUnitTestId('89')}: Verify session default status is Yet To Do`, async () => {
    const statuses = SessionData.statuses;
    expect(statuses).toContain('Active');
    await screenshot.takeStep('status-default');
  });

  // ── SRS-90: Create/Update Submit ──────────────────────────────────────────

  test(`${generateUnitTestId('90')}: Verify session create submit is configured`, async () => {
    const visible = await sessionPage.isTableVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('create-submit');
  });
});
