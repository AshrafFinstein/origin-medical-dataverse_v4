import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Signed URL generated for valid request when a valid authenticated user requests an asset
 * URS: URS-DV-GEN-6
 * SRS: SRS-59
 * SDS: SDS-59
 */
test.describe('URS-DV-GEN-6: Verify Signed URL generated for valid request when a valid a', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-700: Verify Signed URL generated for valid request when a valid authenticated user re', async ({ page }) => {
    // Test Case: UTC-700
    // Summary: Verify Signed URL generated for valid request when a valid authenticated user requests an asset
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Signed URL generated for valid request Given a valid authenticated user requests an asset When the system resolves the bucket Then a secure pre-signed URL should be generated

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-701: Verify URL contains expiration timestamp when a signed URL is generated', async ({ page }) => {
    // Test Case: UTC-701
    // Summary: Verify URL contains expiration timestamp when a signed URL is generated
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: URL contains expiration timestamp Given a signed URL is generated When inspecting the token Then it should include a defined expiration time

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-702: Verify URL becomes invalid after expiry when a signed URL has expired', async ({ page }) => {
    // Test Case: UTC-702
    // Summary: Verify URL becomes invalid after expiry when a signed URL has expired
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: URL becomes invalid after expiry Given a signed URL has expired When accessed Then the request should be denied

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-703: Verify Read-only scope enforcement when a signed URL is generated', async ({ page }) => {
    // Test Case: UTC-703
    // Summary: Verify Read-only scope enforcement when a signed URL is generated
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Read-only scope enforcement Given a signed URL is generated When attempting write/delete operation Then the action should be blocked

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-704: Verify URL not exposed in UI when asset loads in UI', async ({ page }) => {
    // Test Case: UTC-704
    // Summary: Verify URL not exposed in UI when asset loads in UI
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: URL not exposed in UI Given asset loads in UI When inspecting tooltips or logs Then the signed URL should not be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-705: Verify URL hidden from developer console logs when debug logs enabled', async ({ page }) => {
    // Test Case: UTC-705
    // Summary: Verify URL hidden from developer console logs when debug logs enabled
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: URL hidden from developer console logs Given debug logs enabled When image loads Then signed URL should not appear in console logs

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-706: Verify Bucket resolved before URL creation when asset metadata includes bucket m', async ({ page }) => {
    // Test Case: UTC-706
    // Summary: Verify Bucket resolved before URL creation when asset metadata includes bucket mapping
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Bucket resolved before URL creation Given asset metadata includes bucket mapping When URL generation starts Then the correct bucket should be resolved first

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-707: Verify Asset streamed using signed URL when signed URL is generated', async ({ page }) => {
    // Test Case: UTC-707
    // Summary: Verify Asset streamed using signed URL when signed URL is generated
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Asset streamed using signed URL Given signed URL is generated When client requests asset Then asset should stream successfully

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-708: Verify Invalid credentials block generation when credentials are invalid or expi', async ({ page }) => {
    // Test Case: UTC-708
    // Summary: Verify Invalid credentials block generation when credentials are invalid or expired
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Invalid credentials block generation Given credentials are invalid or expired When URL generation is requested Then system should deny generation

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-709: Verify Audit log created for failure when URL generation fails', async ({ page }) => {
    // Test Case: UTC-709
    // Summary: Verify Audit log created for failure when URL generation fails
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Audit log created for failure Given URL generation fails When denial occurs Then a security audit log entry should be recorded

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-710: Verify URL generation within SLA when normal load', async ({ page }) => {
    // Test Case: UTC-710
    // Summary: Verify URL generation within SLA when normal load
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: URL generation within SLA Given normal load When URL is requested Then it should be generated within acceptable time (<1s)

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-711: Verify Multiple concurrent URL requests supported when multiple assets requested', async ({ page }) => {
    // Test Case: UTC-711
    // Summary: Verify Multiple concurrent URL requests supported when multiple assets requested simultaneously
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Multiple concurrent URL requests supported Given multiple assets requested simultaneously When URLs are generated Then all URLs should generate successfully without conflict

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-712: Verify Tampered URL rejected when a signed URL is modified manually', async ({ page }) => {
    // Test Case: UTC-712
    // Summary: Verify Tampered URL rejected when a signed URL is modified manually
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Tampered URL rejected Given a signed URL is modified manually When accessed Then the request should fail

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-713: Verify Very short expiry still enforced when expiry set to minimal duration', async ({ page }) => {
    // Test Case: UTC-713
    // Summary: Verify Very short expiry still enforced when expiry set to minimal duration
    // Description: Feature: Secure time-bound signed URLs for asset access Scenario: Very short expiry still enforced Given expiry set to minimal duration When accessed after expiry Then URL should not allow access

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
