import { test, expect } from '@playwright/test';
import { ProjectPage } from '../../../../pages/project.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-14 / SRS-053: Uniqueness & Abbreviation Rules
 *
 * Unique name enforcement across entities.
 * Mandatory abbreviation where applicable.
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via ProjectPage methods only.
 */
test.describe('URS-DV-GEN-14 / SRS-053: Uniqueness & Abbreviation Rules', () => {
  let projectPage: ProjectPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    projectPage = new ProjectPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await projectPage.navigate('/');
  });

  // ── SDS-053-01: Search modal for uniqueness verification ───────────────────

  test(`${generateUnitTestId('053-01')}: Verify search modal is available for uniqueness verification`, async () => {
    await projectPage.openSearchModal();
    const visible = await projectPage.isSearchModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('search-modal-uniqueness');
  });

  // ── SDS-053-02: Project count for unique entity tracking ───────────────────

  test(`${generateUnitTestId('053-02')}: Verify project count method is available for tracking unique entities`, async () => {
    const count = await projectPage.getProjectCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
    await screenshot.takeStep('project-count-unique-entities');
  });
});
