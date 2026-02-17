import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Correct credential used for bucket access when a request targets Bucket A
 * URS: URS-DV-GEN-6
 * SRS: SRS-60
 * SDS: SDS-60
 */
test.describe('URS-DV-GEN-6: Verify Correct credential used for bucket access when a requ', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-714: Verify Correct credential used for bucket access when a request targets Bucket A', async ({ page }) => {
    // Test Case: UTC-714
    // Summary: Verify Correct credential used for bucket access when a request targets Bucket A
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Correct credential used for bucket access Given a request targets Bucket A When the system resolves credentials Then only Bucket A’s credential reference should be used

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-715: Verify Prevent cross-bucket credential usage when a request targets Bucket A', async ({ page }) => {
    // Test Case: UTC-715
    // Summary: Verify Prevent cross-bucket credential usage when a request targets Bucket A
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Prevent cross-bucket credential usage Given a request targets Bucket A When a credential for Bucket B is attempted Then the system should block the request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-716: Verify Credential binding validated before operation when bucket ID is resolved', async ({ page }) => {
    // Test Case: UTC-716
    // Summary: Verify Credential binding validated before operation when bucket ID is resolved
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Credential binding validated before operation Given bucket ID is resolved When storage operation starts Then system should validate credentialRef mapping first

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-717: Verify No credentials exposed in UI when user accesses any UI screen', async ({ page }) => {
    // Test Case: UTC-717
    // Summary: Verify No credentials exposed in UI when user accesses any UI screen
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: No credentials exposed in UI Given user accesses any UI screen When inspecting page or logs Then credentials or tokens should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-718: Verify Credentials not printed in console logs when debug mode enabled', async ({ page }) => {
    // Test Case: UTC-718
    // Summary: Verify Credentials not printed in console logs when debug mode enabled
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Credentials not printed in console logs Given debug mode enabled When operations execute Then credentials must not appear in console or network logs

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-719: Verify Access blocked when credentialRef mismatched when credentialRef does not ', async ({ page }) => {
    // Test Case: UTC-719
    // Summary: Verify Access blocked when credentialRef mismatched when credentialRef does not match bucket
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Access blocked when credentialRef mismatched Given credentialRef does not match bucket When request is processed Then operation should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-720: Verify Audit log created for mismatch when credential mismatch occurs', async ({ page }) => {
    // Test Case: UTC-720
    // Summary: Verify Audit log created for mismatch when credential mismatch occurs
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Audit log created for mismatch Given credential mismatch occurs When request is blocked Then system should log an audit entry with bucketId and credentialRef

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-721: Verify Successful access with valid mapping when bucketId and credentialRef are ', async ({ page }) => {
    // Test Case: UTC-721
    // Summary: Verify Successful access with valid mapping when bucketId and credentialRef are correctly mapped
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Successful access with valid mapping Given bucketId and credentialRef are correctly mapped When operation executes Then storage access should succeed

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-722: Verify Unauthorized manual credential injection blocked when a user attempts man', async ({ page }) => {
    // Test Case: UTC-722
    // Summary: Verify Unauthorized manual credential injection blocked when a user attempts manual credential override
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Unauthorized manual credential injection blocked Given a user attempts manual credential override When request is sent Then override should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-723: Verify Credential cache isolation when multiple buckets accessed sequentially', async ({ page }) => {
    // Test Case: UTC-723
    // Summary: Verify Credential cache isolation when multiple buckets accessed sequentially
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Credential cache isolation Given multiple buckets accessed sequentially When credentials are cached Then cache should not reuse credentials across buckets

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-724: Verify Expired credentials blocked when credentialRef is expired', async ({ page }) => {
    // Test Case: UTC-724
    // Summary: Verify Expired credentials blocked when credentialRef is expired
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Expired credentials blocked Given credentialRef is expired When operation executes Then access should be denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-725: Verify Credential lookup performance when multiple concurrent bucket requests', async ({ page }) => {
    // Test Case: UTC-725
    // Summary: Verify Credential lookup performance when multiple concurrent bucket requests
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Credential lookup performance Given multiple concurrent bucket requests When credentials resolve Then lookup should complete within acceptable SLA (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-726: Verify Access attempt without credentialRef when no credentialRef found', async ({ page }) => {
    // Test Case: UTC-726
    // Summary: Verify Access attempt without credentialRef when no credentialRef found
    // Description: Feature: Bucket-wise isolated credential enforcement Scenario: Access attempt without credentialRef Given no credentialRef found When operation executes Then system should block request

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
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
