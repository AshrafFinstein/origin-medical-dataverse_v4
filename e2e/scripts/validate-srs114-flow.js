const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL =
  process.argv[2] ||
  'http://localhost:3000/data-labelling/add8d4de-23df-434a-ba18-9d0da4390a5b';

const STORAGE_STATE_PATH = path.resolve('playwright/.auth/state.json');
const OUTPUT_PATH = path.resolve('e2e/test-results/srs-114-flow-validation.json');

const cases = [
  { id: 'UTC-1549', expected: 'The file name should appear below the upload section.' },
  { id: 'UTC-1550', expected: 'All selected file names should be shown in a list.' },
  { id: 'UTC-1551', expected: 'Each file should show a remove (X) icon.' },
  { id: 'UTC-1552', expected: 'That specific file name should disappear from list.' },
  { id: 'UTC-1553', expected: 'Displayed name should exactly match uploaded file name.' },
  { id: 'UTC-1554', expected: 'Names should be clearly readable without truncation.' },
  { id: 'UTC-1555', expected: 'Filename should appear instantly without page reload.' },
  { id: 'UTC-1556', expected: 'Filenames should remain visible.' },
  { id: 'UTC-1557', expected: 'Old filename should be replaced with new one.' },
  { id: 'UTC-1558', expected: 'No filenames should be displayed.' },
  { id: 'UTC-1559', expected: 'Filename should not appear in list.' },
  { id: 'UTC-1560', expected: 'UI should remain responsive without lag.' },
  { id: 'UTC-1561', expected: 'File should be removed.' },
  { id: 'UTC-1562', expected: 'List should align properly below upload area.' },
  { id: 'UTC-1563', expected: 'UI should truncate gracefully with tooltip/full view.' },
  { id: 'UTC-1564', expected: 'UI should truncate gracefully with tooltip/full view.' },
];

function makeFailResult(testCase, reason) {
  return {
    testId: testCase.id,
    status: 'Failed',
    expected: testCase.expected,
    actual: reason,
  };
}

function makePassResult(testCase, actual) {
  return {
    testId: testCase.id,
    status: 'Passed',
    expected: testCase.expected,
    actual,
  };
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(
    fs.existsSync(STORAGE_STATE_PATH) ? { storageState: STORAGE_STATE_PATH } : {},
  );
  const page = await context.newPage();

  let results = [];

  try {
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const url = page.url();
    const title = await page.title();
    const bodyText = await page.locator('body').innerText().catch(() => '');

    const fileInputCount = await page.locator('input[type="file"]').count();
    const uploadKeywordFound = /upload/i.test(bodyText);
    const jsonFileListCount = await page.locator('[data-testid="json-upload-file-list"]').count();
    const jsonFileNameCount = await page.locator('[data-testid^="json-upload-file-name-"]').count();

    const uploadFeaturePresent =
      fileInputCount > 0 || uploadKeywordFound || jsonFileListCount > 0 || jsonFileNameCount > 0;

    if (!uploadFeaturePresent) {
      const reason =
        `JSON upload UI is not available on the provided page (${url}). ` +
        `Detected file inputs: ${fileInputCount}, json list nodes: ${jsonFileListCount}, ` +
        `json file-name nodes: ${jsonFileNameCount}.`;

      results = cases.map((testCase) => makeFailResult(testCase, reason));
    } else {
      // This branch is intentionally conservative because the provided page currently
      // does not expose upload controls. If upload controls become available, cases
      // can be implemented with direct file-selection interactions here.
      results = cases.map((testCase) =>
        makeFailResult(
          testCase,
          'Upload controls detected partially, but deterministic scenario actions are not wired for this page state.',
        ),
      );
    }

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(
        {
          meta: {
            url,
            title,
            generatedAt: new Date().toISOString(),
            uploadFeaturePresent,
            detected: {
              fileInputCount,
              uploadKeywordFound,
              jsonFileListCount,
              jsonFileNameCount,
            },
          },
          results,
        },
        null,
        2,
      ),
      'utf8',
    );

    for (const row of results) {
      console.log(`${row.testId} | ${row.status} | ${row.actual}`);
    }
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('Validation run failed:', error?.message || error);
  process.exitCode = 1;
});
