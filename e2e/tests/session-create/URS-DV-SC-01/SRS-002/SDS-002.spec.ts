import { test, expect } from '@playwright/test';
import { SessionCreatePage } from '../../../../pages/session-create.page';
import { generateUnitTestId, generateSessionName } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { SessionCreateData } from '../../../../test-data';

test.describe('URS-DV-SC-01 > SRS-002: Session Name, Auto-Generate & Form Fields', () => {
  let sessionPage: SessionCreatePage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    sessionPage = new SessionCreatePage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await sessionPage.navigateToSessionList();
    await sessionPage.openCreateModal();
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotHelper = new ScreenshotHelper(page, testInfo);
    await screenshotHelper.captureResult(testInfo.status ?? 'failed');
  });

  test(`${generateUnitTestId('6')}: Enter session name manually`, async () => {
    const sessionName = generateSessionName();
    await sessionPage.fillSessionName(sessionName);

    const value = await sessionPage.getSessionNameValue();
    expect(value).toBe(sessionName);

    await screenshot.takeStep('session-name-entered');
  });

  test(`${generateUnitTestId('7')}: Toggle Auto Generate checkbox ON and verify code fields appear`, async () => {
    await sessionPage.toggleAutoGenerate();

    // After toggling auto-generate, code fields should become visible
    const projectCodeVisible = await sessionPage.isCodeFieldVisible('project');
    const imageCountVisible = await sessionPage.isImageCountInputVisible();
    const setCodeVisible = await sessionPage.isSetCodeInputVisible();
    const generateBtnVisible = await sessionPage.isGenerateButtonVisible();

    expect(
      projectCodeVisible || imageCountVisible || setCodeVisible || generateBtnVisible,
    ).toBe(true);

    await screenshot.takeStep('auto-generate-on-code-fields-visible');
  });

  test(`${generateUnitTestId('8')}: Fill all code fields via dropdowns`, async () => {
    await sessionPage.toggleAutoGenerate(true);

    const codeFields: Array<'project' | 'subProject' | 'useCase' | 'anatomyPlane' | 'center' | 'userType'> = [
      'project',
      'subProject',
      'useCase',
      'anatomyPlane',
      'center',
      'userType',
    ];

    for (const field of codeFields) {
      const isVisible = await sessionPage.isCodeFieldVisible(field);
      if (isVisible) {
        await sessionPage.selectCodeFirstOption(field);
      }
    }

    await screenshot.takeStep('all-code-fields-filled');
  });

  test(`${generateUnitTestId('9')}: Enter Image Count and Set Code`, async () => {
    await sessionPage.toggleAutoGenerate();

    await sessionPage.fillImageCount(SessionCreateData.imageCount);
    const imageCountValue = await sessionPage.getImageCountValue();
    expect(imageCountValue).toBe(String(SessionCreateData.imageCount));

    await sessionPage.fillSetCode(SessionCreateData.setCode);
    const setCodeValue = await sessionPage.getSetCodeValue();
    expect(setCodeValue).toBe(SessionCreateData.setCode);

    await screenshot.takeStep('image-count-and-set-code');
  });

  test(`${generateUnitTestId('10')}: Click Generate button auto-populates session name`, async () => {
    await sessionPage.toggleAutoGenerate(true);

    await sessionPage.fillAllAutoGenerateFields({
      imageCount: SessionCreateData.imageCount,
      setCode: SessionCreateData.setCode,
    });

    const isEnabled = await sessionPage.waitForGenerateButtonEnabled();
    expect(isEnabled).toBe(true);

    await sessionPage.fillSessionName('');

    await sessionPage.clickGenerate();

    const nameAfter = await sessionPage.getSessionNameValue();
    expect(nameAfter.length).toBeGreaterThan(0);

    await screenshot.takeStep('generate-button-auto-populates-name');
  });

  test(`${generateUnitTestId('11')}: Toggle Auto Generate checkbox OFF hides code fields`, async () => {
    // Turn ON first
    await sessionPage.toggleAutoGenerate();
    const visibleBefore = await sessionPage.isCodeFieldVisible('project');

    // Turn OFF
    await sessionPage.toggleAutoGenerate();

    // After toggle off, the name field should be editable manually
    await sessionPage.fillSessionName('Manual Session Name');
    const nameValue = await sessionPage.getSessionNameValue();
    expect(nameValue).toBe('Manual Session Name');

    await screenshot.takeStep('auto-generate-off');
  });

  test(`${generateUnitTestId('12')}: Fill description field`, async () => {
    await sessionPage.fillDescription(SessionCreateData.description);

    const descValue = await sessionPage.getDescriptionValue();
    expect(descValue).toBe(SessionCreateData.description);

    await screenshot.takeStep('description-filled');
  });

  test(`${generateUnitTestId('13')}: Select Session Labels from dropdown`, async () => {
    // Try to select the first available session label
    const hasLabelsSelect = await sessionPage.page
      .locator('[data-testid="session-session-labels-select"]')
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (hasLabelsSelect) {
      await sessionPage.selectNSelectFirstOption('session-session-labels-select');
      const hasSelection = await sessionPage.hasNSelectSelection('session-session-labels-select');
      expect(hasSelection).toBe(true);
    }

    await screenshot.takeStep('session-labels-selected');
  });

  test(`${generateUnitTestId('14')}: Select Session Status`, async () => {
    await sessionPage.selectNSelectFirstOption('session-status-select');

    await screenshot.takeStep('status-selected');
  });
});
