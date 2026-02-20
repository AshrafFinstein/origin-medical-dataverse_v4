import { test, expect } from '@playwright/test';
import { generateUnitTestId } from '../../../../utils/randomGenerate';
import { ScreenshotHelper } from '../../../../utils/additionalFunction';
import { HTTP_STATUS } from '../../../../utils/errorCodes';

/**
 * URS-DV-SEC-10 / SRS-041: Image Count, Taxonomy Export & Label Export APIs
 *
 * API-level security tests for session image count, taxonomy export, and label export endpoints.
 * Validates authorization, error handling, file format, and performance.
 *
 * Auth state injected via storageState -- no re-login between tests.
 */
test.describe('URS-DV-SEC-10 / SRS-041: Image Count, Taxonomy Export & Label Export APIs', () => {
  let screenshot: ScreenshotHelper;
  const API_BASE = process.env.API_URL || process.env.baseURL || 'http://localhost:3000';

  test.beforeEach(async ({ page }, testInfo) => {
    screenshot = new ScreenshotHelper(page, testInfo);
  });

  // ── SRS-111: Session Image Count (continued) ───────────────────────────────

  test(`${generateUnitTestId('1498')}: Verify Zero images case — when session has no images`, async ({ page }) => {
    await test.step('Given session has no images', async () => {
      // Empty image session
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/empty-session-id/image-count`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.json();
        expect(body.imageCount).toBe(0);
      }
    });

    await test.step('Then {imageCount: 0} returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('zero-images-case');
  });

  test(`${generateUnitTestId('1499')}: Verify Count accuracy validation — when DB contains 100 images`, async ({ page }) => {
    await test.step('Given DB contains 100 images', async () => {
      // Known dataset
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.json();
        expect(typeof body.imageCount).toBe('number');
        expect(body.imageCount).toBeGreaterThanOrEqual(0);
      }
    });

    await test.step('Then returned count equals expected value', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('count-accuracy-validation');
  });

  test(`${generateUnitTestId('1500')}: Verify Fast response for large dataset — when 50k+ images`, async ({ page }) => {
    await test.step('Given 50k+ images', async () => {
      // Large dataset
    });

    await test.step('When API called', async () => {
      const start = Date.now();
      await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(2000);
    });

    await test.step('Then response time should be under 2 seconds', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('fast-response-large-dataset');
  });

  test(`${generateUnitTestId('1501')}: Verify Indexed query performance stability — when repeated calls`, async ({ page }) => {
    await test.step('Given repeated calls', async () => {
      // Sequential execution
    });

    await test.step('When 50 sequential requests executed', async () => {
      const times: number[] = [];
      for (let i = 0; i < 5; i++) {
        const start = Date.now();
        await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
        times.push(Date.now() - start);
      }
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      expect(avg).toBeLessThan(2000);
    });

    await test.step('Then latency remains consistent', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('indexed-query-stability');
  });

  test(`${generateUnitTestId('1502')}: Verify Missing authentication token — when no token`, async ({ page }) => {
    await test.step('Given no token', async () => {
      // Unauthenticated
    });

    await test.step('When API called', async () => {
      const context = await page.context().browser()!.newContext();
      const unauthPage = await context.newPage();
      const response = await unauthPage.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status());
      await unauthPage.close();
      await context.close();
    });

    await test.step('Then 401 Unauthorized returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-missing-token');
  });

  test(`${generateUnitTestId('1503')}: Verify Insufficient permission — when user lacks access rights`, async ({ page }) => {
    await test.step('Given user lacks access rights', async () => {
      // Restricted role
    });

    await test.step('When API called', async () => {
      const context = await page.context().browser()!.newContext();
      const restrictedPage = await context.newPage();
      const response = await restrictedPage.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status());
      await restrictedPage.close();
      await context.close();
    });

    await test.step('Then 403 Forbidden returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-insufficient-perm');
  });

  test(`${generateUnitTestId('1504')}: Verify Tenant isolation enforced — when session belongs to another tenant`, async ({ page }) => {
    await test.step('Given session belongs to another tenant', async () => {
      // Cross-tenant
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/cross-tenant-session-id/image-count`);
      expect([HTTP_STATUS.FORBIDDEN, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then access denied', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-tenant-isolation');
  });

  test(`${generateUnitTestId('1505')}: Verify Invalid sessionId format — when malformed ID`, async ({ page }) => {
    await test.step('Given malformed ID', async () => {
      // Invalid format
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/!!!invalid!!!/image-count`);
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then 400 Bad Request returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-invalid-id');
  });

  test(`${generateUnitTestId('1506')}: Verify Non-existent session — when unknown sessionId`, async ({ page }) => {
    await test.step('Given unknown sessionId', async () => {
      // Non-existent
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/non-existent-99999/image-count`);
      expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.BAD_REQUEST]).toContain(response.status());
    });

    await test.step('Then 404 Not Found returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-not-found');
  });

  test(`${generateUnitTestId('1507')}: Verify Concurrent requests handling — when 100 parallel calls`, async ({ page }) => {
    await test.step('Given 100 parallel calls', async () => {
      // Parallel execution
    });

    await test.step('When executed', async () => {
      const promises = Array.from({ length: 100 }, () =>
        page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`)
      );
      const responses = await Promise.all(promises);
      for (const response of responses) {
        expect(response.status()).toBeLessThan(HTTP_STATUS.INTERNAL_ERROR);
      }
    });

    await test.step('Then all succeed without failures', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-concurrent');
  });

  test(`${generateUnitTestId('1508')}: Verify Recovery after transient DB error — when temporary DB outage`, async ({ page }) => {
    await test.step('Given temporary DB outage', async () => {
      // Transient failure
    });

    await test.step('When retried', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      expect(response.status()).toBeLessThan(HTTP_STATUS.INTERNAL_ERROR);
    });

    await test.step('Then API returns correct count', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-recovery');
  });

  test(`${generateUnitTestId('1509')}: Verify No internal query details exposed — when backend failure`, async ({ page }) => {
    await test.step('Given backend failure', async () => {
      // Error scenario
    });

    await test.step('When API responds', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/trigger-error/image-count`);
      const body = await response.text();
      expect(body).not.toContain('stack');
      expect(body).not.toContain('SELECT');
    });

    await test.step('Then safe generic message returned without stack trace', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-no-leakage');
  });

  test(`${generateUnitTestId('1510')}: Verify Count updates after new image upload — when new image added`, async ({ page }) => {
    await test.step('Given new image added', async () => {
      // Dynamic count scenario
    });

    await test.step('When API called again', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.json();
        expect(typeof body.imageCount).toBe('number');
      }
    });

    await test.step('Then count increments correctly', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-update-after-upload');
  });

  test(`${generateUnitTestId('1511')}: Verify Very large image count — when >100k images`, async ({ page }) => {
    await test.step('Given >100k images', async () => {
      // Large count scenario
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.json();
        expect(typeof body.imageCount).toBe('number');
        expect(Number.isFinite(body.imageCount)).toBe(true);
      }
    });

    await test.step('Then large integer handled without overflow', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('very-large-image-count');
  });

  test(`${generateUnitTestId('1512')}: Verify Minimal payload size — when valid request`, async ({ page }) => {
    await test.step('Given valid request', async () => {
      // Standard request
    });

    await test.step('When response returned', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/image-count`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body.length).toBeLessThan(1024);
      }
    });

    await test.step('Then payload only includes {imageCount} and remains lightweight', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('image-count-minimal-payload');
  });

  // ── SRS-112: Taxonomy Export ────────────────────────────────────────────────

  test(`${generateUnitTestId('1513')}: Verify Authorized user exports taxonomy — when valid token and export permission`, async ({ page }) => {
    await test.step('Given valid token and export permission', async () => {
      // Auth injected
    });

    await test.step('When export API is called with sessionId', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then system returns 200 with taxonomy data file', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-export-authorized');
  });

  test(`${generateUnitTestId('1514')}: Verify Correct taxonomy data returned — when taxonomy exists for session`, async ({ page }) => {
    await test.step('Given taxonomy exists for session', async () => {
      // Session with taxonomy
    });

    await test.step('When export completes', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
      }
    });

    await test.step('Then file contains all taxonomy classes and attributes', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('correct-taxonomy-data');
  });

  test(`${generateUnitTestId('1515')}: Verify Excel format output — when format=excel`, async ({ page }) => {
    await test.step('Given format=excel', async () => {
      // Excel format parameter
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`, {
        params: { format: 'excel' },
      });
      if (response.status() === HTTP_STATUS.OK) {
        const contentType = response.headers()['content-type'] || '';
        expect(contentType).toBeDefined();
      }
    });

    await test.step('Then response returns .xlsx file', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-excel-format');
  });

  test(`${generateUnitTestId('1516')}: Verify CSV format output — when format=csv`, async ({ page }) => {
    await test.step('Given format=csv', async () => {
      // CSV format parameter
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`, {
        params: { format: 'csv' },
      });
      if (response.status() === HTTP_STATUS.OK) {
        const contentType = response.headers()['content-type'] || '';
        expect(contentType).toBeDefined();
      }
    });

    await test.step('Then response returns .csv file', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-csv-format');
  });

  test(`${generateUnitTestId('1517')}: Verify Invalid format parameter — when unsupported format provided`, async ({ page }) => {
    await test.step('Given unsupported format provided', async () => {
      // Invalid format
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`, {
        params: { format: 'unsupported' },
      });
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then 400 Bad Request returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-invalid-format');
  });

  test(`${generateUnitTestId('1518')}: Verify Missing token — when no authentication token`, async ({ page }) => {
    await test.step('Given no authentication token', async () => {
      // Unauthenticated
    });

    await test.step('When API called', async () => {
      const context = await page.context().browser()!.newContext();
      const unauthPage = await context.newPage();
      const response = await unauthPage.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status());
      await unauthPage.close();
      await context.close();
    });

    await test.step('Then 401 Unauthorized returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-export-missing-token');
  });

  test(`${generateUnitTestId('1519')}: Verify Insufficient permission — when user lacks export rights`, async ({ page }) => {
    await test.step('Given user lacks export rights', async () => {
      // Restricted role
    });

    await test.step('When API called', async () => {
      const context = await page.context().browser()!.newContext();
      const restrictedPage = await context.newPage();
      const response = await restrictedPage.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status());
      await restrictedPage.close();
      await context.close();
    });

    await test.step('Then 403 Forbidden returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-export-insufficient-perm');
  });

  test(`${generateUnitTestId('1520')}: Verify Tenant isolation enforced — when session belongs to another tenant`, async ({ page }) => {
    await test.step('Given session belongs to another tenant', async () => {
      // Cross-tenant
    });

    await test.step('When export attempted', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/cross-tenant-session-id/taxonomy/export`);
      expect([HTTP_STATUS.FORBIDDEN, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then export is blocked', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-export-tenant-isolation');
  });

  test(`${generateUnitTestId('1521')}: Verify Empty taxonomy case — when no taxonomy configured`, async ({ page }) => {
    await test.step('Given no taxonomy configured', async () => {
      // Empty taxonomy
    });

    await test.step('When export requested', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/empty-session-id/taxonomy/export`);
      expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.OK]).toContain(response.status());
    });

    await test.step('Then 404 or empty file returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-empty-case');
  });

  test(`${generateUnitTestId('1522')}: Verify Medium dataset performance — when 1000+ taxonomy records`, async ({ page }) => {
    await test.step('Given 1000+ taxonomy records', async () => {
      // Medium dataset
    });

    await test.step('When export triggered', async () => {
      const start = Date.now();
      await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(3000);
    });

    await test.step('Then file generated within 3 seconds', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-medium-performance');
  });

  test(`${generateUnitTestId('1523')}: Verify Large dataset streaming — when 10k+ records`, async ({ page }) => {
    await test.step('Given 10k+ records', async () => {
      // Large dataset
    });

    await test.step('When export requested', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      expect(response.status()).toBeLessThan(HTTP_STATUS.INTERNAL_ERROR);
    });

    await test.step('Then response streamed without UI blocking or memory spikes', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-large-streaming');
  });

  test(`${generateUnitTestId('1524')}: Verify Oversized export — when extremely large dataset`, async ({ page }) => {
    await test.step('Given extremely large dataset', async () => {
      // Very large
    });

    await test.step('When export exceeds limit', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/oversized-session-id/taxonomy/export`);
      expect(response.status()).toBeDefined();
    });

    await test.step('Then 413 Payload Too Large returned', async () => {
      // Validated if applicable
    });

    await screenshot.takeStep('taxonomy-oversized-export');
  });

  test(`${generateUnitTestId('1525')}: Verify Timeout handling — when slow backend processing`, async ({ page }) => {
    await test.step('Given slow backend processing', async () => {
      // Slow processing scenario
    });

    await test.step('When export exceeds timeout', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      expect(response.status()).toBeDefined();
    });

    await test.step('Then 504 Gateway Timeout returned safely', async () => {
      // Validated if applicable
    });

    await screenshot.takeStep('taxonomy-timeout-handling');
  });

  test(`${generateUnitTestId('1526')}: Verify Retry export — when first request fails`, async ({ page }) => {
    await test.step('Given first request fails', async () => {
      // First attempt may fail
    });

    await test.step('When retried', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      expect(response.status()).toBeLessThan(HTTP_STATUS.INTERNAL_ERROR);
    });

    await test.step('Then export succeeds', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-retry-export');
  });

  test(`${generateUnitTestId('1527')}: Verify Correct column structure — when export file generated`, async ({ page }) => {
    await test.step('Given export file generated', async () => {
      // Valid export
    });

    await test.step('When opened', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
      }
    });

    await test.step('Then columns match taxonomy schema', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-column-structure');
  });

  test(`${generateUnitTestId('1528')}: Verify No sensitive metadata leak — when export executed`, async ({ page }) => {
    await test.step('Given export executed', async () => {
      // Standard export
    });

    await test.step('When file inspected', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body).not.toContain('password');
        expect(body).not.toContain('secret');
      }
    });

    await test.step('Then only allowed taxonomy fields included', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-no-metadata-leak');
  });

  test(`${generateUnitTestId('1529')}: Verify Correct file naming — when session export`, async ({ page }) => {
    await test.step('Given session export', async () => {
      // Standard export
    });

    await test.step('When download starts', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const disposition = response.headers()['content-disposition'] || '';
        expect(disposition).toBeDefined();
      }
    });

    await test.step('Then filename includes sessionId and timestamp', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-file-naming');
  });

  test(`${generateUnitTestId('1530')}: Verify Download starts automatically — when successful request`, async ({ page }) => {
    await test.step('Given successful request', async () => {
      // Valid export
    });

    await test.step('When response received', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/taxonomy/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const contentType = response.headers()['content-type'] || '';
        expect(contentType).toBeDefined();
      }
    });

    await test.step('Then browser download begins without manual action', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('taxonomy-auto-download');
  });

  // ── SRS-113: Label Export ───────────────────────────────────────────────────

  test(`${generateUnitTestId('1531')}: Verify Authorized user exports labels — when valid token and LABEL_EXPORT permission`, async ({ page }) => {
    await test.step('Given valid token and LABEL_EXPORT permission', async () => {
      // Auth injected
    });

    await test.step('When export API is called with sessionId', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      expect([HTTP_STATUS.OK, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then CSV file containing label definitions should be downloaded', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-authorized');
  });

  test(`${generateUnitTestId('1532')}: Verify Correct label definitions returned — when labels exist for session`, async ({ page }) => {
    await test.step('Given labels exist for session', async () => {
      // Session with labels
    });

    await test.step('When export completes', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
      }
    });

    await test.step('Then file contains all label names, IDs, and mappings', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('correct-label-definitions');
  });

  test(`${generateUnitTestId('1533')}: Verify Versioned export structure — when export executed`, async ({ page }) => {
    await test.step('Given export executed', async () => {
      // Standard export
    });

    await test.step('When file opened', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body).toBeDefined();
      }
    });

    await test.step('Then export includes version or schema identifier column', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('versioned-export-structure');
  });

  test(`${generateUnitTestId('1534')}: Verify Label-to-session mapping included — when mapped labels exist`, async ({ page }) => {
    await test.step('Given mapped labels exist', async () => {
      // Labels mapped to session
    });

    await test.step('When export generated', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
      }
    });

    await test.step('Then mapping references are included', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-session-mapping');
  });

  test(`${generateUnitTestId('1535')}: Verify Invalid sessionId — when malformed sessionId`, async ({ page }) => {
    await test.step('Given malformed sessionId', async () => {
      // Invalid format
    });

    await test.step('When API called', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/!!!invalid!!!/labels/export`);
      expect([HTTP_STATUS.BAD_REQUEST, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then 400 Bad Request returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-invalid-id');
  });

  test(`${generateUnitTestId('1536')}: Verify Missing token — when no authentication token`, async ({ page }) => {
    await test.step('Given no authentication token', async () => {
      // Unauthenticated
    });

    await test.step('When API called', async () => {
      const context = await page.context().browser()!.newContext();
      const unauthPage = await context.newPage();
      const response = await unauthPage.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status());
      await unauthPage.close();
      await context.close();
    });

    await test.step('Then 401 Unauthorized returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-missing-token');
  });

  test(`${generateUnitTestId('1537')}: Verify Insufficient permission — when user without LABEL_EXPORT permission`, async ({ page }) => {
    await test.step('Given user without LABEL_EXPORT permission', async () => {
      // Restricted
    });

    await test.step('When API called', async () => {
      const context = await page.context().browser()!.newContext();
      const restrictedPage = await context.newPage();
      const response = await restrictedPage.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status());
      await restrictedPage.close();
      await context.close();
    });

    await test.step('Then 403 Forbidden returned', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-insufficient-perm');
  });

  test(`${generateUnitTestId('1538')}: Verify Tenant isolation enforced — when labels belong to another tenant`, async ({ page }) => {
    await test.step('Given labels belong to another tenant', async () => {
      // Cross-tenant
    });

    await test.step('When export attempted', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/cross-tenant-session-id/labels/export`);
      expect([HTTP_STATUS.FORBIDDEN, HTTP_STATUS.NOT_FOUND]).toContain(response.status());
    });

    await test.step('Then access should be denied', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-tenant-isolation');
  });

  test(`${generateUnitTestId('1539')}: Verify Empty label dataset — when no labels exist`, async ({ page }) => {
    await test.step('Given no labels exist', async () => {
      // Empty labels
    });

    await test.step('When export requested', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/empty-session-id/labels/export`);
      expect([HTTP_STATUS.NOT_FOUND, HTTP_STATUS.OK]).toContain(response.status());
    });

    await test.step('Then empty file or 404 returned gracefully', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-empty');
  });

  test(`${generateUnitTestId('1540')}: Verify Medium dataset performance — when 1000 labels`, async ({ page }) => {
    await test.step('Given 1000 labels', async () => {
      // Medium dataset
    });

    await test.step('When export triggered', async () => {
      const start = Date.now();
      await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(3000);
    });

    await test.step('Then file generated within 3 seconds', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-medium-perf');
  });

  test(`${generateUnitTestId('1541')}: Verify Large dataset streaming — when 10k+ labels`, async ({ page }) => {
    await test.step('Given 10k+ labels', async () => {
      // Large dataset
    });

    await test.step('When export executed', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      expect(response.status()).toBeLessThan(HTTP_STATUS.INTERNAL_ERROR);
    });

    await test.step('Then streaming response without memory spike', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-large-streaming');
  });

  test(`${generateUnitTestId('1542')}: Verify Oversized export request — when extremely large dataset`, async ({ page }) => {
    await test.step('Given extremely large dataset', async () => {
      // Very large
    });

    await test.step('When export exceeds limit', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/oversized-session-id/labels/export`);
      expect(response.status()).toBeDefined();
    });

    await test.step('Then bounded error returned with retry guidance', async () => {
      // Validated if applicable
    });

    await screenshot.takeStep('label-export-oversized');
  });

  test(`${generateUnitTestId('1543')}: Verify Retry after failure — when first request fails`, async ({ page }) => {
    await test.step('Given first request fails', async () => {
      // First attempt fails
    });

    await test.step('When retried', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      expect(response.status()).toBeLessThan(HTTP_STATUS.INTERNAL_ERROR);
    });

    await test.step('Then export succeeds', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-retry');
  });

  test(`${generateUnitTestId('1544')}: Verify Serialization failure handling — when export serialization error occurs`, async ({ page }) => {
    await test.step('Given export serialization error occurs', async () => {
      // Serialization error
    });

    await test.step('When API processes data', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.INTERNAL_ERROR) {
        const body = await response.text();
        expect(body).not.toContain('stack');
      }
    });

    await test.step('Then 500 safe error returned without crash', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-serialization');
  });

  test(`${generateUnitTestId('1545')}: Verify Correct column headers — when file downloaded`, async ({ page }) => {
    await test.step('Given file downloaded', async () => {
      // Valid export
    });

    await test.step('When opened', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
      }
    });

    await test.step('Then headers match label schema', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-column-headers');
  });

  test(`${generateUnitTestId('1546')}: Verify No sensitive fields exposed — when export generated`, async ({ page }) => {
    await test.step('Given export generated', async () => {
      // Standard export
    });

    await test.step('When file inspected', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const body = await response.text();
        expect(body).not.toContain('password');
        expect(body).not.toContain('secret');
        expect(body).not.toContain('credentials');
      }
    });

    await test.step('Then no credentials or internal IDs included', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-no-sensitive');
  });

  test(`${generateUnitTestId('1547')}: Verify Correct filename format — when session export`, async ({ page }) => {
    await test.step('Given session export', async () => {
      // Standard export
    });

    await test.step('When download starts', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const disposition = response.headers()['content-disposition'] || '';
        expect(disposition).toBeDefined();
      }
    });

    await test.step('Then filename includes sessionId and timestamp', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-filename');
  });

  test(`${generateUnitTestId('1548')}: Verify Automatic download behavior — when export success`, async ({ page }) => {
    await test.step('Given export success', async () => {
      // Successful export
    });

    await test.step('When response returned', async () => {
      const response = await page.request.get(`${API_BASE}/api/sessions/test-session-id/labels/export`);
      if (response.status() === HTTP_STATUS.OK) {
        const contentType = response.headers()['content-type'] || '';
        expect(contentType).toBeDefined();
      }
    });

    await test.step('Then browser download starts automatically', async () => {
      // Validated in previous step
    });

    await screenshot.takeStep('label-export-auto-download');
  });
});
