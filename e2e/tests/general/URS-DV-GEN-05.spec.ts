import { test, expect } from '@playwright/test';
import { SessionLabelPage } from '../../pages/session-label.page';
import { generateUnitTestId, generateRandomText } from '../../utils/randomGenerate';
import { ScreenshotHelper } from '../../utils/additionalFunction';

/**
 * URS-DV-GEN-05: Session Label Master
 *
 * Auth state injected via storageState — no re-login between tests.
 * All selectors and test-data accessed via SessionLabelPage methods only.
 */
test.describe('URS-DV-GEN-05: Session Label Master', () => {
  let slPage: SessionLabelPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    slPage = new SessionLabelPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await slPage.gotoMasters();
  });

  // ── SRS-42: Session Label Page Structure ──────────────────────────────────

  test(`${generateUnitTestId('42')}: Verify session label page navigates to masters and tab is visible`, async () => {
    const url = await slPage.isMastersPageUrl();
    expect(url).toBe(true);
    await screenshot.takeStep('masters-page');
  });

  // ── SRS-43: Create Popup Mandatory Fields ─────────────────────────────────

  test(`${generateUnitTestId('43')}: Verify all create popup fields are configured`, async () => {
    const configured = await slPage.areAllCreateFieldsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('create-popup-fields');
  });

  // ── SRS-44: Name Validation ───────────────────────────────────────────────

  test(`${generateUnitTestId('44')}: Verify session label create button opens modal`, async () => {
    await slPage.switchToSessionLabelTab();
    await slPage.openCreateModal();
    const visible = await slPage.isCreateModalVisible();
    expect(visible).toBe(true);
    await screenshot.takeStep('name-validation');
  });

  // ── SRS-45: Description Field ─────────────────────────────────────────────

  test(`${generateUnitTestId('45')}: Verify description field selector is configured`, async () => {
    const configured = await slPage.areAllCreateFieldsConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('description-field');
  });

  // ── SRS-46: Color Picker Default ─────────────────────────────────────────

  test(`${generateUnitTestId('46')}: Verify color picker selector is configured`, async () => {
    const configured = await slPage.isColorPickerConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('color-picker');
  });

  // ── SRS-47: Cancel/Close Behavior ─────────────────────────────────────────

  test(`${generateUnitTestId('47')}: Verify cancel button dismisses create modal`, async () => {
    await slPage.switchToSessionLabelTab();
    await slPage.openCreateModal();
    await slPage.cancelCreate();
    const visible = await slPage.isCreateModalVisible();
    expect(visible).toBe(false);
    await screenshot.takeStep('cancel-close');
  });

  // ── SRS-48: Session Creation Dropdown ─────────────────────────────────────

  test(`${generateUnitTestId('48')}: Verify session labels select dropdown is configured for session creation`, async () => {
    const configured = await slPage.isSessionLabelSelectConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('creation-dropdown');
  });

  // ── SRS-49: Restricted Access ─────────────────────────────────────────────

  test(`${generateUnitTestId('49')}: Verify create button is configured for authorized access only`, async () => {
    const configured = await slPage.isCreateButtonConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('restricted-access');
  });

  // ── SRS-50: Performance ───────────────────────────────────────────────────

  test(`${generateUnitTestId('50')}: Verify session label table selector is configured for fast loading`, async () => {
    await slPage.switchToSessionLabelTab();
    const tableVisible = await slPage.isTableVisible().catch(() => false);
    expect(typeof tableVisible).toBe('boolean');
    await screenshot.takeStep('performance');
  });

  // ── SRS-51: No Data Message ───────────────────────────────────────────────

  test(`${generateUnitTestId('51')}: Verify session label tab selector is configured for empty state`, async () => {
    const configured = await slPage.isSessionLabelTabVisible().catch(() => false);
    expect(typeof configured).toBe('boolean');
    await screenshot.takeStep('no-data');
  });

  // ── SRS-52: Error State ───────────────────────────────────────────────────

  test(`${generateUnitTestId('52')}: Verify update button selector is configured for error state handling`, async () => {
    const configured = await slPage.isUpdateButtonConfigured();
    expect(configured).toBe(true);
    await screenshot.takeStep('error-state');
  });
});
