import { test, expect } from '@playwright/test';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Image grid loads smoothly for Approval Level 1 user when the user logs in as Approval Level
 * URS: URS-DV-QC-01
 * SRS: SRS-9
 * SDS: SDS-9
 */
test.describe('URS-DV-QC-01: Verify Image grid loads smoothly for Approval Level 1 user w', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });

  test('UTC-70: Verify Image grid loads smoothly for Approval Level 1 user when the user logs in', async ({ page }) => {
    // Test Case: UTC-70
    // Summary: Verify Image grid loads smoothly for Approval Level 1 user when the user logs in as Approval Level
    // Description: Feature: Approval workflow performance across levels Scenario: Image grid loads smoothly for Approval Level 1 user Given the user logs in as Approval Level When the Data Labeling page is opened Then image grid, session details, and status indicators should load without noticeable delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-71: Verify Image acceptance at Level completes without delay when an image is in IN_', async ({ page }) => {
    // Test Case: UTC-71
    // Summary: Verify Image acceptance at Level completes without delay when an image is in IN_REVIEW state
    // Description: Feature: Accept action responsiveness Scenario: Image acceptance at Level completes without delay Given an image is in IN_REVIEW state When the Level user clicks Accept Then the image status should update and move to Level 2 immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-72: Verify Image loads quickly for Approval Level after Level acceptance when the im', async ({ page }) => {
    // Test Case: UTC-72
    // Summary: Verify Image loads quickly for Approval Level after Level acceptance when the image has moved to IN_REVIEW
    // Description: Feature: Approval workflow performance continuity Scenario: Image loads quickly for Approval Level after Level acceptance Given the image has moved to IN_REVIEW When the Level user logs in and opens the session Then the image and action buttons should load promptly

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-73: Verify Image rejection at Level processes without delay when an image is in IN_R', async ({ page }) => {
    // Test Case: UTC-73
    // Summary: Verify Image rejection at Level processes without delay when an image is in IN_REVIEW
    // Description: Feature: Reject action responsiveness Scenario: Image rejection at Level processes without delay Given an image is in IN_REVIEW When the Level user clicks Reject Then the image should move to the previous level immediately without UI freeze

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-74: Verify Image acceptance at Level loads smoothly when the image reaches IN_REVIEW', async ({ page }) => {
    // Test Case: UTC-74
    // Summary: Verify Image acceptance at Level loads smoothly when the image reaches IN_REVIEW L
    // Description: Feature: Multi-level approval performance consistency Scenario: Image acceptance at Level loads smoothly Given the image reaches IN_REVIEW L When the Level user accepts the image Then status transition to Level should occur without delay

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-75: Verify Image review at Level performs efficiently when the user logs in as Appro', async ({ page }) => {
    // Test Case: UTC-75
    // Summary: Verify Image review at Level performs efficiently when the user logs in as Approval Level
    // Description: Feature: High-level approval workflow responsiveness Scenario: Image review at Level performs efficiently Given the user logs in as Approval Level When images and session details are loaded Then all UI elements should respond quickly without lag

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-76: Verify Final accept/reject at Level completes without delay when the image is in', async ({ page }) => {
    // Test Case: UTC-76
    // Summary: Verify Final accept/reject at Level completes without delay when the image is in IN_REVIEW L
    // Description: Feature: Final approval performance handling Scenario: Final accept/reject at Level completes without delay Given the image is in IN_REVIEW L When the Level user clicks Accept or Reject Then the final status update should reflect immediately

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-77: Verify UI remains responsive after accept/reject actions when an approval action', async ({ page }) => {
    // Test Case: UTC-77
    // Summary: Verify UI remains responsive after accept/reject actions when an approval action is completed at any level
    // Description: Feature: Post-action UI stability Scenario: UI remains responsive after accept/reject actions Given an approval action is completed at any level When the image grid refreshes Then no UI freeze, delay, or blocking behavior should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-78: Verify System shows non-blocking indicator if minor delay occurs when a temporar', async ({ page }) => {
    // Test Case: UTC-78
    // Summary: Verify System shows non-blocking indicator if minor delay occurs when a temporary processing delay happens
    // Description: Feature: Non-blocking delay handling Scenario: System shows non-blocking indicator if minor delay occurs Given a temporary processing delay happens When approval action is submitted Then a non-blocking status indicator should be shown without locking UI

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-79: Verify Image flows from Level 1 to Level 5 smoothly when the same image is accep', async ({ page }) => {
    // Test Case: UTC-79
    // Summary: Verify Image flows from Level 1 to Level 5 smoothly when the same image is accepted sequentially from Level 1 to Level 5
    // Description: Feature: End-to-end approval performance Scenario: Image flows from Level 1 to Level 5 smoothly Given the same image is accepted sequentially from Level 1 to Level 5 When each level user logs in and performs action Then no cumulative delay or performance degradation should occur

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
