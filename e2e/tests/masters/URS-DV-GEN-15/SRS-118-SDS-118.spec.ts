import { test, expect } from '@playwright/test';
import { LabelPage } from '../../../pages/masters/label.page';
import { AnnotationPage } from '../../../pages/masters/annotation.page';
import { TaxonomyPage } from '../../../pages/masters/taxonomy.page';
import { generateUnitTestId } from '../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../utils/additionalFunction';

/**
 * URS-DV-GEN-15: Masters Management — Labels, Annotations, Taxonomies
 * SRS-118 / SDS-118 — Masters page tabs, create/search operations
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors resolved inside page objects — no direct locator calls in spec.
 */
test.describe('URS-DV-GEN-15: Masters Management', () => {
  let labelPage: LabelPage;
  let annotationPage: AnnotationPage;
  let taxonomyPage: TaxonomyPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    labelPage = new LabelPage(page);
    annotationPage = new AnnotationPage(page);
    taxonomyPage = new TaxonomyPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);

    await labelPage.gotoMasters();
  });

  test(`${generateUnitTestId('15118')}: Verify master tabs are visible on masters page`, async () => {
    const visible = await labelPage.isTabsVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('master-tabs-visible');
  });

  test(`${generateUnitTestId('15119')}: Verify label tab is present`, async () => {
    const visible = await labelPage.isLabelTabVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('label-tab');
  });

  test(`${generateUnitTestId('15120')}: Verify taxonomy tab is present`, async () => {
    const visible = await taxonomyPage.isTaxonomyTabVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('taxonomy-tab');
  });

  test(`${generateUnitTestId('15121')}: Verify annotation tab is present`, async () => {
    const visible = await annotationPage.isAnnotationTabVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('annotation-tab');
  });

  test(`${generateUnitTestId('15122')}: Verify label table appears after clicking label tab`, async () => {
    await labelPage.switchToLabelTab();
    const visible = await labelPage.isTableVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('label-table-visible');
  });

  test(`${generateUnitTestId('15123')}: Verify create label modal opens`, async () => {
    await labelPage.switchToLabelTab();
    await labelPage.openCreateModal();
    const visible = await labelPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('label-create-modal');
    await labelPage.cancelCreateForm();
  });

  test(`${generateUnitTestId('15124')}: Verify cancel create label closes modal`, async () => {
    await labelPage.switchToLabelTab();
    await labelPage.openCreateModal();
    await labelPage.cancelCreateForm();
    const visible = await labelPage.isCreateModalVisible();
    expect(visible).toBe(false);
    await screenshot.takeStep('label-create-cancelled');
  });

  test(`${generateUnitTestId('15125')}: Verify annotation table appears after clicking annotation tab`, async () => {
    await annotationPage.switchToAnnotationTab();
    const visible = await annotationPage.isTableVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('annotation-table-visible');
  });

  test(`${generateUnitTestId('15126')}: Verify create annotation modal opens`, async () => {
    await annotationPage.switchToAnnotationTab();
    await annotationPage.openCreateModal();
    const visible = await annotationPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('annotation-create-modal');
    await annotationPage.cancelCreateForm();
  });

  test(`${generateUnitTestId('15127')}: Verify taxonomy table appears after clicking taxonomy tab`, async () => {
    await taxonomyPage.switchToTaxonomyTab();
    const visible = await taxonomyPage.isTableVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('taxonomy-table-visible');
  });

  test(`${generateUnitTestId('15128')}: Verify create taxonomy modal opens`, async () => {
    await taxonomyPage.switchToTaxonomyTab();
    await taxonomyPage.openCreateModal();
    const visible = await taxonomyPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('taxonomy-create-modal');
    await taxonomyPage.cancelCreateForm();
  });

  test(`${generateUnitTestId('15129')}: Verify masters page URL contains /master`, async () => {
    const isMastersUrl = await labelPage.isMastersPageUrl();
    expect(isMastersUrl).toBe(true);
    await screenshot.takeStep('masters-url');
  });
});
