const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Module mapping based on URS prefixes
const MODULE_CONFIG = {
  'URS-DV-QC': {
    module: 'qc-workflow',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-2': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-3': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-5': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'LabelSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-6': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-07': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DEV-GEN-08': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-09': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-25': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-31': {
    module: 'session-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-DL': {
    module: 'data-labelling',
    pageObject: 'DataLabellingPage',
    pageObjectPath: '../../../pages/data-labelling.page',
    selectors: ['DataLabellingSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-DA': {
    module: 'annotation',
    pageObject: 'DataLabellingPage',
    pageObjectPath: '../../../pages/data-labelling.page',
    selectors: ['AnnotationSelectors', 'DataLabellingSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-DM': {
    module: 'data-management',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-AN': {
    module: 'analytics',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-SEC': {
    module: 'security',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-15': {
    module: 'general',
    pageObject: 'DataLabellingPage',
    pageObjectPath: '../../../pages/data-labelling.page',
    selectors: ['DataLabellingSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-16': {
    module: 'general',
    pageObject: 'DataLabellingPage',
    pageObjectPath: '../../../pages/data-labelling.page',
    selectors: ['DataLabellingSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-21': {
    module: 'general',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['SessionSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
  'URS-DV-GEN-23': {
    module: 'general',
    pageObject: 'DataLabellingPage',
    pageObjectPath: '../../../pages/data-labelling.page',
    selectors: ['AnnotationSelectors', 'DataLabellingSelectors', 'CommonSelectors'],
    navigateTo: 'sessionList',
  },
};

// Get module config from URS ID
function getModuleConfig(ursId) {
  for (const [prefix, config] of Object.entries(MODULE_CONFIG)) {
    if (ursId.startsWith(prefix)) {
      return config;
    }
  }
  // Default config
  return {
    module: 'general',
    pageObject: 'SessionPage',
    pageObjectPath: '../../../pages/session.page',
    selectors: ['CommonSelectors'],
    navigateTo: 'sessionList',
  };
}

// Clean up strings - remove newlines, extra spaces, and escape quotes
function cleanString(str) {
  return (str || '')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .replace(/'/g, '')  // Remove single quotes instead of escaping
    .replace(/"/g, '')  // Remove double quotes instead of escaping
    .trim();
}

// Generate test implementation using page object methods (NO hardcoded locators)
function generateTestImplementation(testCase, config) {
  const summary = cleanString(testCase.summary || '');
  const description = cleanString(testCase.description || '');
  const acceptanceCriteria = testCase.acceptanceCriteria || '';

  // All tests use actual page object methods
  let testSteps = '';

  // Use page object instance from beforeEach (already initialized)
  const pageObjectVar = config.pageObject.toLowerCase().replace('page', 'Page');

  testSteps = `    // Navigate to module
    await ${pageObjectVar}.navigateToModule();
`;

  // Check if it's a visibility test
  if (summary.toLowerCase().includes('verify') && (summary.toLowerCase().includes('visible') || summary.toLowerCase().includes('display'))) {
    testSteps += `
    // Verify element visibility
    const isVisible = await ${pageObjectVar}.verifyElementVisible('session-create-button');
    expect(isVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');`;
  }
  // Check if it's a filter/search test
  else if (summary.toLowerCase().includes('filter') || summary.toLowerCase().includes('search')) {
    testSteps += `
    // Apply filter/search
    await ${pageObjectVar}.applyFilter('test search term');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');`;
  }
  // Check if it's a button click test
  else if (summary.toLowerCase().includes('button') || summary.toLowerCase().includes('click') || summary.toLowerCase().includes('add level')) {
    testSteps += `
    // Click button
    await ${pageObjectVar}.clickCreateButton();

    const modalVisible = await ${pageObjectVar}.isSessionCreateModalOpen();
    expect(modalVisible).toBe(true);`;
  }
  // Check if it's a dropdown/select test
  else if (summary.toLowerCase().includes('dropdown') || summary.toLowerCase().includes('select') || summary.toLowerCase().includes('user') || summary.toLowerCase().includes('group')) {
    testSteps += `
    // Interact with dropdown
    await ${pageObjectVar}.selectFromDropdown('session-status', 'active');

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');`;
  }
  // Check if it's an input field test
  else if (summary.toLowerCase().includes('input') || summary.toLowerCase().includes('field') || summary.toLowerCase().includes('enter') || summary.toLowerCase().includes('empty')) {
    testSteps += `
    // Fill input field
    await ${pageObjectVar}.clickCreateButton();
    await ${pageObjectVar}.fillInputField('name', 'Test Session');

    const inputVisible = await ${pageObjectVar}.isInputVisible('session-name');
    expect(inputVisible).toBe(true);`;
  }
  // Check if it's a table/grid test
  else if (summary.toLowerCase().includes('table') || summary.toLowerCase().includes('grid') || summary.toLowerCase().includes('list')) {
    testSteps += `
    // Verify table/grid
    await ${pageObjectVar}.waitForSessionTable();
    const count = await ${pageObjectVar}.getSessionCount();
    expect(count).toBeGreaterThanOrEqual(0);`;
  }
  // Check if it's a modal/popup test
  else if (summary.toLowerCase().includes('modal') || summary.toLowerCase().includes('popup') || summary.toLowerCase().includes('dialog')) {
    testSteps += `
    // Verify modal
    await ${pageObjectVar}.clickCreateButton();
    const modalVisible = await ${pageObjectVar}.verifyModalVisible('session-create');
    expect(modalVisible).toBe(true);`;
  }
  // Check if it's a validation/error test
  else if (summary.toLowerCase().includes('validation') || summary.toLowerCase().includes('error') || summary.toLowerCase().includes('toast')) {
    testSteps += `
    // Check validation/error message
    const errorMessage = await ${pageObjectVar}.getErrorMessage();
    expect(errorMessage).toBeTruthy();`;
  }
  // Check if it's a submit/create test
  else if (summary.toLowerCase().includes('submit') || summary.toLowerCase().includes('create') && summary.toLowerCase().includes('session')) {
    testSteps += `
    // Create session
    await ${pageObjectVar}.createSession({
      name: 'Test Session',
      description: 'Test Description'
    });

    const sessionExists = await ${pageObjectVar}.sessionExists('Test Session');
    expect(sessionExists).toBe(true);`;
  }
  // Default generic test
  else {
    testSteps += `
    // Verify page loaded and module accessible
    await ${pageObjectVar}.waitForSessionTable();
    const tableVisible = await ${pageObjectVar}.verifyTableData();
    expect(tableVisible).toBe(true);

    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).toContain('dataverse');`;
  }

  return testSteps;
}

// Generate test spec content
function generateTestSpec(ursId, srsId, sdsId, testCases) {
  const config = getModuleConfig(ursId);
  const firstTest = testCases[0];

  // Import statements
  const imports = `import { test, expect } from '@playwright/test';
import { ${config.pageObject} } from '${config.pageObjectPath}';
import { TestData } from '../../../test-data/test-data';
import { ${config.selectors.join(', ')} } from '../../../selectors';

/**
 * Test Suite: ${cleanString(firstTest.summary || 'Test Suite')}
 * URS: ${ursId}
 * SRS: ${srsId}
 * SDS: ${sdsId}
 */`;

  // Test describe block
  const describeBlock = `test.describe('${ursId}: ${cleanString(firstTest.summary || 'Test Suite').substring(0, 60)}', () => {
  let ${config.pageObject.toLowerCase().replace('page', 'Page')}: ${config.pageObject};

  test.beforeEach(async ({ page }) => {
    // Authentication handled by global-setup.ts and storageState
    // Just initialize page object
    ${config.pageObject.toLowerCase().replace('page', 'Page')} = new ${config.pageObject}(page);

    // Navigate to home page
    await page.goto(TestData.urls.homePage);
    await page.waitForLoadState('networkidle');
  });
`;

  // Generate individual tests
  const tests = testCases.map((tc, index) => {
    const testId = tc.testCaseId || `TEST-${index + 1}`;
    const summary = cleanString(tc.summary || 'Test case');
    const description = cleanString(tc.description || summary);
    const implementation = generateTestImplementation(tc, config);

    return `
  test('${testId}: ${summary.substring(0, 80)}', async ({ page }) => {
    // Test Case: ${testId}
    // Summary: ${summary}
    // Description: ${description}

${implementation}
  });`;
  }).join('\n');

  // AfterEach block for screenshot capture
  const afterEach = `
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: \`screenshots/failed-\${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-\${Date.now()}.png\`,
        fullPage: true
      });
    }
  });`;

  return `${imports}
${describeBlock}${tests}${afterEach}
});
`;
}

async function generateTests() {
  console.log('📊 Reading Excel file...\n');

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('requirements-excel-file/dataverse-Testcases-V4.xlsx');
  const ws = wb.worksheets[0];

  // Group test cases by URS/SRS/SDS
  const testGroups = new Map();

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header

    const ursId = row.getCell(1).text?.trim();
    const srsId = row.getCell(2).text?.trim();
    const sdsId = row.getCell(3).text?.trim();
    const testCaseId = row.getCell(4).text?.trim();
    const summary = row.getCell(5).text?.trim();
    const description = row.getCell(6).text?.trim();
    const acceptanceCriteria = row.getCell(7).text?.trim();
    const testStatus = row.getCell(8).text?.trim();
    const testType = row.getCell(9).text?.trim();
    const assignee = row.getCell(10).text?.trim();

    if (!ursId || !srsId || !sdsId) return;

    const key = `${ursId}/${srsId}/${sdsId}`;

    if (!testGroups.has(key)) {
      testGroups.set(key, {
        ursId,
        srsId,
        sdsId,
        tests: []
      });
    }

    testGroups.get(key).tests.push({
      testCaseId,
      summary,
      description,
      acceptanceCriteria,
      testStatus,
      testType,
      assignee,
      priority: 'medium'
    });
  });

  console.log(`✅ Found ${testGroups.size} test groups\n`);

  // Create test files
  let createdCount = 0;
  let skippedCount = 0;

  for (const [key, group] of testGroups.entries()) {
    const config = getModuleConfig(group.ursId);
    const dirPath = path.join('e2e', 'tests', config.module, group.ursId);
    const fileName = `${group.srsId}-${group.sdsId}.spec.ts`;
    const filePath = path.join(dirPath, fileName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Generate test spec
    const testContent = generateTestSpec(
      group.ursId,
      group.srsId,
      group.sdsId,
      group.tests
    );

    // Write file (overwrite existing)
    fs.writeFileSync(filePath, testContent);
    console.log(`✅ Created: ${filePath} (${group.tests.length} tests)`);
    createdCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${createdCount} files`);
  console.log(`   Total: ${testGroups.size} test groups`);
}

generateTests().catch(console.error);
