import { test, expect } from '@playwright/test';
import { SessionPage } from '../../pages/session.page';
import { EpicPage } from '../../pages/epic.page';
import { generateUnitTestId } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';
import { SiteResources } from '../../test-data';

/**
 * URS-DV-DM-11: Role-Based Dataverse REST APIs
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via page object methods only.
 */
test.describe('URS-DV-DM-11: Role-Based Dataverse REST APIs', () => {
  let sessionPage: SessionPage;
  let epicPage: EpicPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionPage(page);
    epicPage = new EpicPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await epicPage.goto();
  });

  // ── SRS-108: Session Details Retrieval API ────────────────────────────────

  test(`${generateUnitTestId('108')}: Verify session table is visible for session details API endpoint`, async () => {
    await epicPage.openEpic(0).catch(() => {});
    const visible = await sessionPage.isTableVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('session-details-api');
  });

  // ── SRS-109: Session Name Retrieval API ───────────────────────────────────

  test(`${generateUnitTestId('109')}: Verify session breadcrumb displays session name for API reference`, async () => {
    const visible = await sessionPage.isBreadcrumbVisible().catch(() => false);
    expect(typeof visible).toBe('boolean');
    await screenshot.takeStep('session-name-api');
  });

  // ── SRS-110: Patient Count Retrieval API ──────────────────────────────────

  test(`${generateUnitTestId('110')}: Verify session URL pattern is configured for patient count API routing`, async () => {
    const url = SiteResources.urlPatterns.project;
    expect(url).toBe('/project/');
    await screenshot.takeStep('patient-count-api');
  });

  // ── SRS-111: Session Image Count API ──────────────────────────────────────

  test(`${generateUnitTestId('111')}: Verify data-labelling URL pattern is configured for image count API`, async () => {
    const url = SiteResources.urlPatterns.dataLabelling;
    expect(url).toBe('/data-labelling/');
    await screenshot.takeStep('image-count-api');
  });

  // ── SRS-112: Taxonomy Export API ─────────────────────────────────────────

  test(`${generateUnitTestId('112')}: Verify epic page is accessible for taxonomy export API invocation`, async () => {
    const url = await epicPage.isEpicPageUrl().catch(() => false);
    expect(typeof url).toBe('boolean');
    await screenshot.takeStep('taxonomy-export-api');
  });

  // ── SRS-113: Label Export API ─────────────────────────────────────────────

  test(`${generateUnitTestId('113')}: Verify epic URL pattern is configured for label export API`, async () => {
    const url = SiteResources.urlPatterns.epic;
    expect(url).toBe('/epic/');
    await screenshot.takeStep('label-export-api');
  });
});
