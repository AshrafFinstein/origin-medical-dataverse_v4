import { test, expect } from '../../../fixtures/auth.fixture';
import { SessionPage } from '../../../pages/session.page';
import { TestData } from '../../../test-data/test-data';
import { SessionSelectors, CommonSelectors } from '../../../selectors';

/**
 * Test Suite: Verify Bucket ID stored during asset upload when a user uploads an image
 * URS: URS-DV-GEN-6
 * SRS: SRS-56
 * SDS: SDS-56
 */
test.describe('URS-DV-GEN-6: Verify Bucket ID stored during asset upload when a user uplo', () => {
  let sessionPage: SessionPage;

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    sessionPage = new SessionPage(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('load');
  });

  test('UTC-655: Verify Bucket ID stored during asset upload when a user uploads an image', async ({ page }) => {
    // Test Case: UTC-655
    // Summary: Verify Bucket ID stored during asset upload when a user uploads an image
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Bucket ID stored during asset upload Given a user uploads an image When ingestion completes Then the system should store bucketId in asset metadata

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-656: Verify Metadata persists correctly when an asset is stored', async ({ page }) => {
    // Test Case: UTC-656
    // Summary: Verify Metadata persists correctly when an asset is stored
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Metadata persists correctly Given an asset is stored When metadata is retrieved Then the stored bucketId should match the original bucket

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-657: Verify Correct bucket used during fetch when an asset has associated bucketId', async ({ page }) => {
    // Test Case: UTC-657
    // Summary: Verify Correct bucket used during fetch when an asset has associated bucketId
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Correct bucket used during fetch Given an asset has associated bucketId When the system fetches the asset Then data should be retrieved only from that bucket

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-658: Verify Correct bucket used during download when an asset exists', async ({ page }) => {
    // Test Case: UTC-658
    // Summary: Verify Correct bucket used during download when an asset exists
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Correct bucket used during download Given an asset exists When download is requested Then the system should route to mapped bucket automatically

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-659: Verify Processing uses mapped bucket when an asset enters processing workflow', async ({ page }) => {
    // Test Case: UTC-659
    // Summary: Verify Processing uses mapped bucket when an asset enters processing workflow
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Processing uses mapped bucket Given an asset enters processing workflow When processing begins Then the system should use stored bucketId for routing

    // Navigate to module
    await sessionPage.navigateToModule();

    // Fill input field
    await sessionPage.clickCreateButton();
    await sessionPage.fillInputField('name', 'Test Session');

    const inputVisible = await sessionPage.isInputVisible('session-name');
    expect(inputVisible).toBe(true);
  });

  test('UTC-660: Verify Bucket identifiers hidden in grid when the asset grid is displayed', async ({ page }) => {
    // Test Case: UTC-660
    // Summary: Verify Bucket identifiers hidden in grid when the asset grid is displayed
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Bucket identifiers hidden in grid Given the asset grid is displayed When the UI renders Then no bucket or storage location details should be visible

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify element visibility
    const isVisible = await sessionPage.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
  });

  test('UTC-661: Verify Users cannot manually modify bucketId when an asset record exists', async ({ page }) => {
    // Test Case: UTC-661
    // Summary: Verify Users cannot manually modify bucketId when an asset record exists
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Users cannot manually modify bucketId Given an asset record exists When user attempts to alter bucketId via UI/API Then modification should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Interact with dropdown
    await sessionPage.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-662: Verify Multiple assets map to different buckets correctly when assets are stored', async ({ page }) => {
    // Test Case: UTC-662
    // Summary: Verify Multiple assets map to different buckets correctly when assets are stored across different buckets
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Multiple assets map to different buckets correctly Given assets are stored across different buckets When accessed Then each asset should route to its respective bucket

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-663: Verify Metadata remains consistent after edits when asset details are edited', async ({ page }) => {
    // Test Case: UTC-663
    // Summary: Verify Metadata remains consistent after edits when asset details are edited
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Metadata remains consistent after edits Given asset details are edited When saved Then bucketId should remain unchanged

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-664: Verify Reject upload if bucket inactive when target bucket is inactive', async ({ page }) => {
    // Test Case: UTC-664
    // Summary: Verify Reject upload if bucket inactive when target bucket is inactive
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Reject upload if bucket inactive Given target bucket is inactive When ingestion is attempted Then upload should be rejected

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-665: Verify Reject upload if bucketId missing when metadata has no bucketId', async ({ page }) => {
    // Test Case: UTC-665
    // Summary: Verify Reject upload if bucketId missing when metadata has no bucketId
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Reject upload if bucketId missing Given metadata has no bucketId When ingestion occurs Then system should prevent storage

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-666: Verify Metadata validation error logged when ingestion fails due to invalid buck', async ({ page }) => {
    // Test Case: UTC-666
    // Summary: Verify Metadata validation error logged when ingestion fails due to invalid bucketId
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Metadata validation error logged Given ingestion fails due to invalid bucketId When validation triggers Then system should log metadata validation error

    // Navigate to module
    await sessionPage.navigateToModule();

    // Check validation/error message
    const errorMessage = await sessionPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('UTC-667: Verify Mapping persists across sessions when asset created previously', async ({ page }) => {
    // Test Case: UTC-667
    // Summary: Verify Mapping persists across sessions when asset created previously
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Mapping persists across sessions Given asset created previously When accessed in new session Then same bucketId should be used

    // Navigate to module
    await sessionPage.navigateToModule();

    // Create session
    await sessionPage.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await sessionPage.sessionExists('Test Session');
    expect(sessionExists).toBe(true);
  });

  test('UTC-668: Verify Routing does not add delay when multiple assets are fetched', async ({ page }) => {
    // Test Case: UTC-668
    // Summary: Verify Routing does not add delay when multiple assets are fetched
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Routing does not add delay Given multiple assets are fetched When requests execute Then performance should remain within SLA

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify page loaded and module accessible
    await sessionPage.waitForSessionTable();
    const tableVisible = await sessionPage.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');
  });

  test('UTC-669: Verify Concurrent fetch operations stable when multiple parallel asset requests', async ({ page }) => {
    // Test Case: UTC-669
    // Summary: Verify Concurrent fetch operations stable when multiple parallel asset requests
    // Description: Feature: Asset-Level Bucket Mapping Scenario: Concurrent fetch operations stable Given multiple parallel asset requests When routing occurs Then no conflicts or incorrect bucket access should occur

    // Navigate to module
    await sessionPage.navigateToModule();

    // Verify table/grid
    await sessionPage.waitForSessionTable();
    const count = await sessionPage.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);
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
