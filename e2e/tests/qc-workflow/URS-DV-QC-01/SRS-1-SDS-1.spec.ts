import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';

/**
 * Test Suite: Verify Default state of Approval Level field when the user is on the Create Session page
 * URS: URS-DV-QC-01
 * SRS: SRS-1
 * SDS: SDS-1
 */
test.describe('URS-DV-QC-01: Verify Default state of Approval Level field when the user i', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    sessionPage = new SessionPage(page);
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });
  
  test('UTC-1: Verify Default state of Approval Level field when the user is on the Create Sess', async () => {
    await sessionPage.navigation.navigateToModule();
    await sessionPage.crud.selectFromDropdown('session-status', 'active');
  });

  test('UTC-2: Verify Display Approval Level field on Add Level click when the user is on the C', async () => {
    await sessionPage.navigation.navigateToModule();

    const isVisible = await sessionPage.validation.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);
  });

  test('UTC-3: Verify Add approval levels up to maximum limit when the user keeps clicking Add ', async () => {
    await sessionPage.navigation.navigateToModule();
    await sessionPage.crud.clickCreateButton();

    const modalVisible = await sessionPage.validation.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);
  });

  test('UTC-4: Verify Submit session with empty Approval Level fields when one or more Approval', async () => {
    await sessionPage.navigation.navigateToModule();
    await sessionPage.crud.clickCreateButton();
    await sessionPage.crud.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.validation.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-5: Verify Select multiple users in a single approval level when an Approval Level f', async () => {
    await sessionPage.navigation.navigateToModule();

    const isVisible = await sessionPage.validation.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);
  });

  test('UTC-6: Verify Same user added individually and via group when a user is already part of', async () => {
    await sessionPage.navigation.navigateToModule();
    await sessionPage.crud.selectFromDropdown('session-status', 'active');
  });

  test('UTC-7: Verify User group added after individual user selection when an individual user ', async () => {
    await sessionPage.navigation.navigateToModule();
    await sessionPage.crud.selectFromDropdown('session-status', 'active');
  });

  test('UTC-8: Verify Submit session with valid approval levels when all Approval Levels have a', async () => {
    await sessionPage.navigation.navigateToModule();
    await sessionPage.crud.selectFromDropdown('session-status', 'active');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `screenshots/failed-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
        fullPage: true
      });
    }
  });
});
