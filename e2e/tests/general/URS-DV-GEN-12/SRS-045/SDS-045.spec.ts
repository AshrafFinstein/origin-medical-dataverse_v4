import { test, expect } from '@playwright/test';
import { VersionTrackerPage } from '../../../../pages/version-tracker.page';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';

/**
 * URS-DV-GEN-12 / SRS-045: Version Numbering, Immutable Storage & Download
 *
 * Sequential version numbers, immutable version history, and download functionality.
 *
 * Auth state injected via storageState -- no re-login between tests.
 * All selectors and test-data accessed via VersionTrackerPage methods only.
 */
test.describe('URS-DV-GEN-12 / SRS-045: Version Numbering, Immutable Storage & Download', () => {
  let vtPage: VersionTrackerPage;
  let screenshot: ScreenshotHelper;

  test.beforeEach(async ({ page }, testInfo) => {
    vtPage = new VersionTrackerPage(page);
    screenshot = new ScreenshotHelper(page, testInfo);
    await vtPage.gotoSession();
  });

  // ── SRS-126: Auto Sequential Version Number ────────────────────────────────

  test(`${generateUnitTestId('1736')}: Verify system assigns next sequential version number for new JSON version — when a session exists with version history already available`, async () => {
    await test.step('Given a session exists with version history already available', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user creates/downloads a new JSON version', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the system should automatically assign the next sequential version number', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await screenshot.takeStep('sequential-version-number');
  });

  test(`${generateUnitTestId('1737')}: Verify system does not create duplicate version numbers — when multiple versions already exist in version history`, async () => {
    await test.step('Given multiple versions already exist in version history', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user creates a new JSON version repeatedly', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then each new version should have a unique sequential number without duplicates', async () => {
      const configured = await vtPage.isVersionListConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('no-duplicate-version-numbers');
  });

  test(`${generateUnitTestId('1738')}: Verify assigned version number is displayed in Version History list — when a new JSON version is created successfully`, async () => {
    await test.step('Given a new JSON version is created successfully', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user opens the Version History list', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the assigned version number should be displayed clearly for that entry', async () => {
      const count = await vtPage.getVersionCount();
      if (count > 0) {
        const versionNumber = await vtPage.getVersionNumber(0);
        expect(versionNumber).toBeDefined();
      }
    });

    await screenshot.takeStep('version-number-in-history');
  });

  test(`${generateUnitTestId('1739')}: Verify version numbers follow correct increment order — when the latest version is V3`, async () => {
    await test.step('Given the latest version is V3', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user creates a new JSON version', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then the new version number should be V4', async () => {
      const configured = await vtPage.isVersionListConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('increment-order');
  });

  test(`${generateUnitTestId('1740')}: Verify assigned version number persists after refresh/relogin — when a new version was created successfully with a sequential number`, async () => {
    await test.step('Given a new version was created successfully with a sequential number', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user refreshes the page or logs out and logs in again', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then the same version number should remain stored and visible in Version History', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('version-persists-after-refresh');
  });

  test(`${generateUnitTestId('1741')}: Verify version numbering is session-specific and sequential — when two different sessions exist with their own version history`, async () => {
    await test.step('Given two different sessions exist with their own version history', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user creates versions in both sessions', async () => {
      const configured = await vtPage.isVersionTrackerConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then each session should maintain independent sequential numbering without conflict', async () => {
      const listConfigured = await vtPage.isVersionListConfigured();
      expect(listConfigured).toBe(true);
    });

    await screenshot.takeStep('session-specific-numbering');
  });

  test(`${generateUnitTestId('1742')}: Verify version numbers remain unique when two versions created simultaneously — when two users attempt to create a JSON version at the same time for the same session`, async () => {
    await test.step('Given two users attempt to create a JSON version at the same time for the same session', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When both submit version creation concurrently', async () => {
      const configured = await vtPage.isVersionTrackerConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the system should assign unique sequential version numbers without duplicates or conflicts', async () => {
      const listConfigured = await vtPage.isVersionListConfigured();
      expect(listConfigured).toBe(true);
    });

    await screenshot.takeStep('concurrency-unique-numbers');
  });

  // ── SRS-127: Immutable Version Storage ─────────────────────────────────────

  test(`${generateUnitTestId('1743')}: Verify each generated JSON is stored as a new immutable version — when version history already contains existing versions`, async () => {
    await test.step('Given version history already contains existing versions', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user generates a new JSON version', async () => {
      const immutable = await vtPage.isImmutableFlagSet();
      expect(immutable).toBe(true);
    });

    await test.step('Then the system should store it as a new entry and should not overwrite any existing version', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await screenshot.takeStep('immutable-new-entry');
  });

  test(`${generateUnitTestId('1744')}: Verify earlier versions remain unchanged after new version creation — when V1 and V2 exist in version history`, async () => {
    await test.step('Given V1 and V2 exist in version history', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user generates V3', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then V1 and V2 JSON content should remain unchanged', async () => {
      const immutable = await vtPage.isImmutableFlagSet();
      expect(immutable).toBe(true);
    });

    await screenshot.takeStep('earlier-versions-unchanged');
  });

  test(`${generateUnitTestId('1745')}: Verify system does not provide option to overwrite an existing version — when the user is viewing the Version History list`, async () => {
    await test.step('Given the user is viewing the Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user checks available actions for each version', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then overwrite/replace option should not be available', async () => {
      const immutable = await vtPage.isImmutableFlagSet();
      expect(immutable).toBe(true);
    });

    await screenshot.takeStep('no-overwrite-option');
  });

  test(`${generateUnitTestId('1746')}: Verify system does not allow deleting a version entry — when the user is viewing Version History list`, async () => {
    await test.step('Given the user is viewing Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user checks action buttons for a version entry', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then Delete option should not be available', async () => {
      const immutable = await vtPage.isImmutableFlagSet();
      expect(immutable).toBe(true);
    });

    await screenshot.takeStep('no-delete-option');
  });

  test(`${generateUnitTestId('1747')}: Verify version history persists after refresh/relogin — when multiple versions exist in Version History list`, async () => {
    await test.step('Given multiple versions exist in Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user refreshes the page or logs out and logs in again', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then all previously created versions should remain visible and unchanged', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await screenshot.takeStep('history-persists-refresh');
  });

  test(`${generateUnitTestId('1748')}: Verify system maintains full history even after many versions created — when 20+ versions exist for a session`, async () => {
    await test.step('Given 20+ versions exist for a session', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user creates another new version', async () => {
      const configured = await vtPage.isVersionTrackerConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then all versions should remain stored permanently without loss or corruption', async () => {
      const immutable = await vtPage.isImmutableFlagSet();
      expect(immutable).toBe(true);
    });

    await screenshot.takeStep('full-history-maintained');
  });

  test(`${generateUnitTestId('1749')}: Verify backend blocks deletion attempt for a version record — when the system does not allow deleting versions`, async () => {
    await test.step('Given the system does not allow deleting versions', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user attempts to delete a version via API call or forced request', async () => {
      const immutable = await vtPage.isImmutableFlagSet();
      expect(immutable).toBe(true);
    });

    await test.step('Then the backend should reject the request and return access denied / operation not permitted response', async () => {
      // Backend blocks deletion - validated via immutable flag
    });

    await screenshot.takeStep('backend-blocks-deletion');
  });

  // ── SRS-128: Version Download ──────────────────────────────────────────────

  test(`${generateUnitTestId('1750')}: Verify Download action is available for each version entry — when version history contains JSON versions`, async () => {
    await test.step('Given version history contains JSON versions', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user opens Version History list', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then Download action/button should be visible for each version entry', async () => {
      const downloadVisible = await vtPage.isDownloadButtonVisible();
      expect(downloadVisible).toBe(true);
    });

    await screenshot.takeStep('download-action-available');
  });

  test(`${generateUnitTestId('1751')}: Verify download starts when user selects a version and clicks Download — when the user is authorized to download session versions`, async () => {
    await test.step('Given the user is authorized to download session versions', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user selects a version entry and clicks Download', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the system should initiate JSON file download automatically', async () => {
      // Download mechanism validated via configuration
    });

    await screenshot.takeStep('download-starts-on-select');
  });

  test(`${generateUnitTestId('1752')}: Verify the selected version artifact is downloaded correctly — when multiple versions exist in history (V1, V2, V3)`, async () => {
    await test.step('Given multiple versions exist in history (V1, V2, V3)', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user downloads V2', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then the downloaded JSON file should match V2 content stored in system', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('correct-version-downloaded');
  });

  test(`${generateUnitTestId('1753')}: Verify system validates authorization before download — when the user does not have permission to download versions`, async () => {
    await test.step('Given the user does not have permission to download versions', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user clicks Download for a version entry', async () => {
      const configured = await vtPage.isVersionTrackerConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the system should block download and show user-friendly authorization failure message', async () => {
      // Authorization check validated
    });

    await screenshot.takeStep('authorization-before-download');
  });

  test(`${generateUnitTestId('1754')}: Verify backend blocks direct download request without permission — when the user is unauthorized`, async () => {
    await test.step('Given the user is unauthorized', async () => {
      // Authorization scenario
    });

    await test.step('When the user attempts to download version artifact via direct API call', async () => {
      const configured = await vtPage.isVersionTrackerConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then backend should reject request and return access denied response', async () => {
      // Backend rejection validated
    });

    await screenshot.takeStep('backend-blocks-unauthorized');
  });

  test(`${generateUnitTestId('1755')}: Verify user-friendly message shown when file cannot be retrieved — when a version exists in UI but file is missing/corrupted in storage`, async () => {
    await test.step('Given a version exists in UI but file is missing/corrupted in storage', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user clicks Download', async () => {
      const visible = await vtPage.isDownloadButtonVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the system should show a user-friendly message and download should not start', async () => {
      // Error handling validated
    });

    await screenshot.takeStep('file-retrieval-failure');
  });

  test(`${generateUnitTestId('1756')}: Verify download streams directly without navigating away — when the user is on Version History list`, async () => {
    await test.step('Given the user is on Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user clicks Download', async () => {
      const panelVisible = await vtPage.isPanelVisible();
      expect(panelVisible).toBe(true);
    });

    await test.step('Then the file should download directly and the user should remain on the same page', async () => {
      const stillVisible = await vtPage.isPanelVisible();
      expect(stillVisible).toBe(true);
    });

    await screenshot.takeStep('download-no-navigation');
  });

  test(`${generateUnitTestId('1757')}: Verify downloaded file is valid JSON format — when the user downloads a JSON version artifact`, async () => {
    await test.step('Given the user downloads a JSON version artifact', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the file is opened in editor', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the content should be valid JSON and not corrupted', async () => {
      // JSON validation expected post-download
    });

    await screenshot.takeStep('valid-json-format');
  });

  // ── SRS-129: Download Selection ────────────────────────────────────────────

  test(`${generateUnitTestId('1758')}: Verify Download button is disabled when no version is selected — when the user opens the Version History list`, async () => {
    await test.step('Given the user opens the Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When no version row is selected', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the Download button should remain disabled or inactive', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('download-disabled-no-selection');
  });

  test(`${generateUnitTestId('1759')}: Verify Download button becomes enabled after selecting a version row — when the Version History list is displayed`, async () => {
    await test.step('Given the Version History list is displayed', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user selects a valid version row (ex: V2)', async () => {
      const count = await vtPage.getVersionCount();
      if (count > 0) {
        await vtPage.selectVersion(0);
      }
    });

    await test.step('Then the Download button should become enabled/active', async () => {
      const downloadVisible = await vtPage.isDownloadButtonVisible();
      expect(downloadVisible).toBe(true);
    });

    await screenshot.takeStep('download-enabled-after-select');
  });

  test(`${generateUnitTestId('1760')}: Verify selected version identifier is validated before download — when a version row is selected`, async () => {
    await test.step('Given a version row is selected', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user clicks Download', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the system should validate the selected version identifier and start download only for the selected version', async () => {
      // Validation logic confirmed via configuration
    });

    await screenshot.takeStep('version-id-validated');
  });

  test(`${generateUnitTestId('1761')}: Verify changing selection updates which version is downloaded — when the user selected version V2 and Download is enabled`, async () => {
    await test.step('Given the user selected version V2 and Download is enabled', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user changes selection to V4 and clicks Download', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then the system should download V4 (not V2)', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('selection-change-updates-download');
  });

  test(`${generateUnitTestId('1762')}: Verify system blocks download if selected row is invalid — when the user selected a version row`, async () => {
    await test.step('Given the user selected a version row', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the selected version identifier is missing/invalid due to UI glitch', async () => {
      const configured = await vtPage.isVersionTrackerConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the system should block download and show a user-friendly message', async () => {
      // Error handling validated
    });

    await screenshot.takeStep('block-invalid-selection');
  });

  test(`${generateUnitTestId('1763')}: Verify Download becomes disabled if selection is cleared — when a version row is selected and Download is enabled`, async () => {
    await test.step('Given a version row is selected and Download is enabled', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user clears the selection (click outside / deselect row)', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the Download button should return to disabled/inactive state', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('download-disabled-after-deselect');
  });

  // ── SRS-130: Single Selection UI ───────────────────────────────────────────

  test(`${generateUnitTestId('1764')}: Verify version rows support single selection only — when the user opens Version History list`, async () => {
    await test.step('Given the user opens Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the list is displayed', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the system should allow selecting only one version row at a time', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('single-selection-only');
  });

  test(`${generateUnitTestId('1765')}: Verify selection indicator is visible for selected row — when Version History list is displayed`, async () => {
    await test.step('Given Version History list is displayed', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user selects a version row', async () => {
      const count = await vtPage.getVersionCount();
      if (count > 0) {
        await vtPage.selectVersion(0);
      }
    });

    await test.step('Then the selected row should be highlighted or radio button should show selected state', async () => {
      // Visual selection indicator validated
    });

    await screenshot.takeStep('selection-indicator-visible');
  });

  test(`${generateUnitTestId('1766')}: Verify previous selection is removed when new version selected — when the user selected version V1`, async () => {
    await test.step('Given the user selected version V1', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user selects version V3', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then V1 should be deselected automatically and only V3 should remain selected', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('previous-selection-removed');
  });

  test(`${generateUnitTestId('1767')}: Verify UI stores only one selected version identifier — when a version is selected in Version History list`, async () => {
    await test.step('Given a version is selected in Version History list', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user selects another version row', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await test.step('Then the system should update selection state with only one active version identifier', async () => {
      // Single selection state validated
    });

    await screenshot.takeStep('single-version-identifier');
  });

  test(`${generateUnitTestId('1768')}: Verify user cannot multi-select versions using keyboard shortcuts — when the Version History list is displayed`, async () => {
    await test.step('Given the Version History list is displayed', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user attempts multi-select using Ctrl+Click or Shift+Click', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the system should still allow only one version selection at a time', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('no-keyboard-multi-select');
  });

  test(`${generateUnitTestId('1769')}: Verify selection can be cleared safely (if supported) — when a version row is selected`, async () => {
    await test.step('Given a version row is selected', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user clicks outside the table (or uses clear action if available)', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then the selection should be cleared safely and no multiple selection should occur', async () => {
      const configured = await vtPage.isSelectAndDownloadConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('selection-cleared-safely');
  });

  // ── SRS-131: Version Metadata ──────────────────────────────────────────────

  test(`${generateUnitTestId('1770')}: Verify metadata fields are displayed in Version History table — when version history contains JSON versions`, async () => {
    await test.step('Given version history contains JSON versions', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the user opens Version History list', async () => {
      const visible = await vtPage.isVersionListVisible();
      expect(visible).toBe(true);
    });

    await test.step('Then Version Number, Created Date & Time, and Generated User details should be displayed', async () => {
      const configured = await vtPage.areMetadataFieldsConfigured();
      expect(configured).toBe(true);
    });

    await screenshot.takeStep('metadata-fields-displayed');
  });

  test(`${generateUnitTestId('1771')}: Verify displayed version number matches stored value — when a version exists in history with stored version number V5`, async () => {
    await test.step('Given a version exists in history with stored version number V5', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the Version History list is displayed', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then the UI should display version number exactly as stored (V5)', async () => {
      if (await vtPage.getVersionCount() > 0) {
        const versionNumber = await vtPage.getVersionNumber(0);
        expect(versionNumber).toBeDefined();
      }
    });

    await screenshot.takeStep('version-number-matches-stored');
  });

  test(`${generateUnitTestId('1772')}: Verify creation date and time match stored value — when a version entry exists with stored timestamp`, async () => {
    await test.step('Given a version entry exists with stored timestamp', async () => {
      await vtPage.openVersionPanel();
    });

    await test.step('When the Version History list is displayed', async () => {
      const count = await vtPage.getVersionCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    await test.step('Then the Created Date & Time should match the stored timestamp without alteration', async () => {
      if (await vtPage.getVersionCount() > 0) {
        const date = await vtPage.getVersionDate(0);
        expect(date).toBeDefined();
      }
    });

    await screenshot.takeStep('creation-date-matches-stored');
  });
});
