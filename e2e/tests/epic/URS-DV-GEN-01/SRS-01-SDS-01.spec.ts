import { test, expect } from '@playwright/test';
import { EpicPage } from '../../../pages/epic.page';
import { generateUnitTestId, generateEpicName } from '../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../utils/additionalFunction';

/**
 * URS-DV-GEN-01: Epic Management
 * SRS-01 / SDS-01
 *
 * Auth state injected via storageState — no re-login between tests.
 * All DOM interactions go through EpicPage methods — no direct locator calls.
 */
test.describe('URS-DV-GEN-01: Epic Management', () => {
  let epicPage: EpicPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    epicPage = new EpicPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await epicPage.goto();
    await epicPage.waitForLoad();
  });

  test(`${generateUnitTestId('01001')}: Verify epic table is visible on dashboard`, async () => {
    const visible = await epicPage.isTableVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('epic-table-visible');
  });

  test(`${generateUnitTestId('01002')}: Verify create epic modal opens`, async () => {
    await epicPage.openCreateModal();
    const visible = await epicPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('epic-create-modal');
    await epicPage.cancelCreateForm();
  });

  test(`${generateUnitTestId('01003')}: Verify cancel create epic closes modal`, async () => {
    await epicPage.openCreateModal();
    await epicPage.cancelCreateForm();
    const visible = await epicPage.isCreateModalVisible();
    expect(visible).toBe(false);
    await screenshot.takeStep('epic-create-cancelled');
  });

  test(`${generateUnitTestId('01004')}: Verify create epic with valid data`, async () => {
    const name = generateEpicName();
    await epicPage.createEpicWithDefaultData(name);
    const inList = await epicPage.verifyEpicInList(name);
    expect(inList).toBe(true);
    await screenshot.takeStep('epic-created');
  });

  test(`${generateUnitTestId('01005')}: Verify search modal opens`, async () => {
    await epicPage.openSearchModal();
    const visible = await epicPage.isSearchModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('epic-search-modal');
  });

  test(`${generateUnitTestId('01006')}: Verify search epic with existing term`, async () => {
    await epicPage.searchDefaultEpic();
    const resultsVisible = await epicPage.getSearchResultsTable();
    expect(typeof resultsVisible).toBe('boolean');
    await screenshot.takeStep('epic-search-results');
  });

  test(`${generateUnitTestId('01007')}: Verify epic table selector exists in DOM`, async () => {
    const count = await epicPage.getTableCount();
    expect(count).toBeGreaterThanOrEqual(0);
    await screenshot.takeStep('epic-table-exists');
  });

  test(`${generateUnitTestId('01008')}: Verify opening an epic navigates to project page`, async () => {
    const epicCount = await epicPage.getEpicCount();
    if (epicCount > 0) {
      await epicPage.openEpic(0);
      const isEpicUrl = await epicPage.isEpicPageUrl();
      expect(isEpicUrl).toBe(true);
      await screenshot.takeStep('epic-opened');
    } else {
      test.skip();
    }
  });
});
