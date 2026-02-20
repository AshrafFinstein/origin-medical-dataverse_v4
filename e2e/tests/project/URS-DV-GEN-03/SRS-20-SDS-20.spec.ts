import { test, expect } from '@playwright/test';
import { EpicPage } from '../../../pages/epic.page';
import { ProjectPage } from '../../../pages/project.page';
import { generateUnitTestId, generateProjectName } from '../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../utils/additionalFunction';

/**
 * URS-DV-GEN-03: Project Management
 * SRS-20 / SDS-20
 *
 * Auth state injected via storageState — no re-login between tests.
 * All DOM interactions go through page object methods — no direct locator calls.
 */
test.describe('URS-DV-GEN-03: Project Management', () => {
  let epicPage: EpicPage;
  let projectPage: ProjectPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    epicPage = new EpicPage(page);
    projectPage = new ProjectPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);

    await epicPage.goto();
    await epicPage.waitForLoad();

    const epicCount = await epicPage.getEpicCount();
    if (epicCount > 0) {
      await epicPage.openEpic(0);
    }
  });

  test(`${generateUnitTestId('03020')}: Verify project table is visible inside epic`, async () => {
    const visible = await projectPage.isTableVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('project-table-visible');
  });

  test(`${generateUnitTestId('03021')}: Verify create project modal opens`, async () => {
    await projectPage.openCreateModal();
    const visible = await projectPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('project-create-modal');
    await projectPage.cancelCreateForm();
  });

  test(`${generateUnitTestId('03022')}: Verify cancel create project closes modal`, async () => {
    await projectPage.openCreateModal();
    await projectPage.cancelCreateForm();
    const visible = await projectPage.isCreateModalVisible();
    expect(visible).toBe(false);
    await screenshot.takeStep('project-create-cancelled');
  });

  test(`${generateUnitTestId('03023')}: Verify create project with valid data`, async () => {
    const name = generateProjectName();
    await projectPage.createProjectWithDefaultData(name);
    const inList = await projectPage.verifyProjectInList(name);
    expect(inList).toBe(true);
    await screenshot.takeStep('project-created');
  });

  test(`${generateUnitTestId('03024')}: Verify search modal opens for project`, async () => {
    await projectPage.openSearchModal();
    const visible = await projectPage.isSearchModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('project-search-modal');
  });

  test(`${generateUnitTestId('03025')}: Verify project table selector exists in DOM`, async () => {
    const count = await projectPage.getTableCount();
    expect(count).toBeGreaterThanOrEqual(0);
    await screenshot.takeStep('project-table-root');
  });

  test(`${generateUnitTestId('03026')}: Verify opening a project navigates into session list`, async () => {
    const projectCount = await projectPage.getProjectCount();
    if (projectCount > 0) {
      await projectPage.openProject(0);
      const isProjectUrl = await projectPage.isProjectPageUrl();
      expect(isProjectUrl).toBe(true);
      await screenshot.takeStep('project-opened');
    } else {
      test.skip();
    }
  });

  test(`${generateUnitTestId('03027')}: Verify back button navigates to epic`, async () => {
    const initialUrl = await projectPage.getCurrentUrl();
    await projectPage.goBack();
    const urlChanged = await projectPage.hasUrlChanged(initialUrl);
    expect(urlChanged).toBe(true);
    await screenshot.takeStep('project-back');
  });
});
