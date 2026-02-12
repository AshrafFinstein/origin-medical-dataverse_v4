
const fs = require('fs');
const path = require('path');

/**
 * Organize Playwright screenshots into Passed/Failed folders
 *
 * Reads the test results JSON and organizes screenshots accordingly
 */

const TEST_RESULTS_PATH = 'test-results/test-results.json';
const SCREENSHOTS_OUTPUT = {
  passed: 'test-results/Passed Tests',
  failed: 'test-results/Failed Tests',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    const destDir = path.dirname(dest);
    ensureDir(destDir);
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

async function organizeScreenshots() {
  console.log('📸 Organizing screenshots...\n');

  // Create output directories
  ensureDir(SCREENSHOTS_OUTPUT.passed);
  ensureDir(SCREENSHOTS_OUTPUT.failed);

  // Read test results
  if (!fs.existsSync(TEST_RESULTS_PATH)) {
    console.error('❌ Test results file not found:', TEST_RESULTS_PATH);
    console.log('   Run tests first with: npx playwright test');
    return;
  }

  const results = JSON.parse(fs.readFileSync(TEST_RESULTS_PATH, 'utf8'));
  const suites = results.suites || [];

  let passedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  function processTests(suite, parentPath = '') {
    if (suite.specs) {
      // This is a test suite with specs
      for (const spec of suite.specs) {
        for (const test of spec.tests || []) {
          for (const result of test.results || []) {
            const status = result.status;
            const testTitle = test.title || 'Untitled Test';
            const safeTitle = testTitle
              .replace(/[^a-z0-9]+/gi, '-')
              .replace(/^-+|-+$/g, '')
              .substring(0, 100);

            // Get screenshots from attachments
            const screenshots = (result.attachments || [])
              .filter(att => att.contentType === 'image/png' && att.path)
              .map(att => att.path);

            if (screenshots.length > 0) {
              const targetDir = status === 'passed' ? SCREENSHOTS_OUTPUT.passed : SCREENSHOTS_OUTPUT.failed;

              screenshots.forEach((screenshot, index) => {
                const ext = path.extname(screenshot);
                const filename = `${safeTitle}-${index + 1}${ext}`;
                const destPath = path.join(targetDir, filename);

                if (copyFile(screenshot, destPath)) {
                  if (status === 'passed') {
                    passedCount++;
                  } else {
                    failedCount++;
                  }
                }
              });
            } else {
              if (status === 'passed') {
                skippedCount++;
              } else if (status === 'failed') {
                failedCount++;
              }
            }
          }
        }
      }
    }

    // Recursively process nested suites
    if (suite.suites) {
      for (const childSuite of suite.suites) {
        processTests(childSuite, parentPath ? `${parentPath}/${suite.title}` : suite.title);
      }
    }
  }

  // Process all suites
  for (const suite of suites) {
    processTests(suite);
  }

  console.log('✅ Screenshot organization complete!\n');
  console.log(`   📁 Passed Tests: ${passedCount} screenshots → ${SCREENSHOTS_OUTPUT.passed}`);
  console.log(`   📁 Failed Tests: ${failedCount} screenshots → ${SCREENSHOTS_OUTPUT.failed}`);
  console.log(`   ⏭️  Skipped: ${skippedCount} tests (no screenshots)`);
}

organizeScreenshots().catch(console.error);
