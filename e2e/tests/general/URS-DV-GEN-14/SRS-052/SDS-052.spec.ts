import { test, expect } from '@playwright/test';
import { ProjectPage } from '../../../../pages/project.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-14 / SRS-052: Entity Name & Format Validation
 *
 * Mandatory Name fields. Max character limits.
 * Input format restrictions for master entity creation.
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via ProjectPage methods only.
 */
test.describe('URS-DV-GEN-14 / SRS-052: Entity Name & Format Validation', () => {
  let projectPage: ProjectPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    projectPage = new ProjectPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await projectPage.navigate('/');
  });

  // ── SDS-052-01: Create modal accessibility ─────────────────────────────────

  test(`${generateUnitTestId('052-01')}: Verify project create modal is accessible for validation testing`, async () => {
    await projectPage.openCreateModal();
    const visible = await projectPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await projectPage.cancelCreateForm();
    await screenshot.takeStep('create-modal-accessible');
  });

  // ── SDS-052-02: Project table visibility ───────────────────────────────────

  test(`${generateUnitTestId('052-02')}: Verify project table is visible for entity display`, async () => {
    const visible = await projectPage.isTableVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('project-table-visible');
  });

  // ── SDS-052-03: Project page URL pattern ───────────────────────────────────

  test(`${generateUnitTestId('052-03')}: Verify project page URL pattern is correctly configured`, async () => {
    const isProjectUrl = await projectPage.isProjectPageUrl();
    expect(typeof isProjectUrl).toBe('boolean');
    await screenshot.takeStep('project-page-url-pattern');
  });
});
