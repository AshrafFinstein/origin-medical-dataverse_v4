const fs = require('fs');
const path = require('path');

/**
 * Simple screenshot organizer based on Playwright's directory naming
 *
 * Playwright puts failed tests in directories ending with "-failed" or "-unexpected"
 * and passed tests in directories ending with "-finished" or "chromium"
 */

const TEST_RESULTS_DIR = 'test-results.json';
const OUTPUT_DIRS = {
  passed: 'test-results/Passed Tests',
  failed: 'test-results/Failed Tests',
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.png')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function organizeScreenshots() {
  console.log('📸 Organizing screenshots...\n');

  // Create output directories
  ensureDir(OUTPUT_DIRS.passed);
  ensureDir(OUTPUT_DIRS.failed);

  // Get all screenshots
  const screenshots = getAllFiles(TEST_RESULTS_DIR);
  console.log(`   Found ${screenshots.length} screenshots\n`);

  let passedCount = 0;
  let failedCount = 0;

  screenshots.forEach(screenshotPath => {
    const dir = path.dirname(screenshotPath);
    const filename = path.basename(screenshotPath);
    const dirName = path.basename(dir);

    // Determine if passed or failed based on directory name
    const isFailed = dirName.includes('-failed') ||
                     dirName.includes('-unexpected') ||
                     filename.includes('test-failed');

    const isFlaky = dirName.includes('-flaky');

    let targetDir;
    if (isFailed || isFlaky) {
      targetDir = OUTPUT_DIRS.failed;
      failedCount++;
    } else {
      targetDir = OUTPUT_DIRS.passed;
      passedCount++;
    }

    // Create a meaningful filename
    const testName = dirName
      .replace(/-chromium$/, '')
      .replace(/-failed-\d+$/, '')
      .replace(/-unexpected-\d+$/, '')
      .replace(/-finished-\d+$/, '')
      .replace(/^.+-URS-DV-/, 'URS-DV-');

    const newFilename = `${testName}-${filename}`;
    const destPath = path.join(targetDir, newFilename);

    // Copy file
    fs.copyFileSync(screenshotPath, destPath);
  });

  console.log('✅ Screenshot organization complete!\n');
  console.log(`   📁 Passed Tests: ${passedCount} screenshots → ${OUTPUT_DIRS.passed}`);
  console.log(`   📁 Failed Tests: ${failedCount} screenshots → ${OUTPUT_DIRS.failed}`);
}

organizeScreenshots();
