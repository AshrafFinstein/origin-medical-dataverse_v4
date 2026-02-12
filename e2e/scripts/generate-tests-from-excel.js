const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Module mapping based on URS prefixes
const MODULE_MAP = {
  'URS-DV-QC': 'qc-workflow',
  'URS-DV-GEN': 'session-management',
  'URS-DV-DL': 'data-labelling',
  'URS-DV-DA': 'annotation',
  'URS-DV-DM': 'data-management',
  'URS-DV-AN': 'analytics',
  'URS-DEV-GEN': 'session-management',
  'URS-DV-SEC': 'security',
};

// Get module from URS ID
function getModule(ursId) {
  for (const [prefix, module] of Object.entries(MODULE_MAP)) {
    if (ursId.startsWith(prefix)) {
      return module;
    }
  }
  return 'general';
}

// Get module code from URS
function getModuleCode(ursId) {
  if (ursId.includes('-QC-')) return 'QC';
  if (ursId.includes('-GEN-')) return 'SM';
  if (ursId.includes('-DL-')) return 'DL';
  if (ursId.includes('-DA-')) return 'ANN';
  if (ursId.includes('-DM-')) return 'DM';
  if (ursId.includes('-AN-')) return 'AN';
  if (ursId.includes('-SEC-')) return 'SEC';
  return 'GEN';
}

// Generate test spec content
function generateTestSpec(ursId, srsId, sdsId, testCases) {
  const module = getModule(ursId);
  const moduleCode = getModuleCode(ursId);
  const firstTest = testCases[0];

  // Import statements
  const imports = `import { test, expect } from '../../../fixtures/auth.fixture';
// TODO: Import appropriate page objects based on module
// import { PageObject } from '../../../pages/page-object.page';

/**
 * Test Suite: ${firstTest.summary || 'Test Suite'}
 * URS: ${ursId}
 * SRS: ${srsId}
 * SDS: ${sdsId}
 */`;

  // Test describe block
  const describeBlock = `test.describe('${ursId} - ${srsId} - ${sdsId}', () => {
  // TODO: Initialize page objects
  // let pageObject: PageObject;

  test.beforeEach(async ({ authenticatedPage }) => {
    // TODO: Setup before each test
    // pageObject = new PageObject(authenticatedPage);
    // await pageObject.goto();
  });
`;

  // Generate individual tests
  const tests = testCases.map((tc, index) => {
    const testId = tc.testCaseId || `${moduleCode}-${index + 1}`;
    const priority = tc.priority || 'medium';
    const testType = tc.testType || 'Functional Testing';

    // Clean up strings - remove newlines, extra spaces, and escape quotes
    const cleanString = (str) => {
      return (str || '')
        .replace(/\n/g, ' ')           // Replace newlines with spaces
        .replace(/\r/g, '')            // Remove carriage returns
        .replace(/\s+/g, ' ')          // Collapse multiple spaces
        .replace(/'/g, "\\'")          // Escape single quotes
        .replace(/"/g, '\\"')          // Escape double quotes
        .trim();
    };

    const summary = cleanString(tc.summary || 'Test case');
    const description = cleanString(tc.description || summary);
    const acceptanceCriteria = (tc.acceptanceCriteria || 'Test passes when functionality works as expected')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => cleanString(line))
      .join('\n');

    return `
  test('${testId}: ${summary}', async ({ authenticatedPage }) => {
    // Test Case ID: ${testId}
    // Priority: ${priority}
    // Test Type: ${testType}
    //
    // Summary: ${summary}
    //
    // Description: ${description}
    //
    // Acceptance Criteria:
${acceptanceCriteria.split('\n').map(line => `    // - ${line.trim()}`).join('\n')}

    // TODO: Implement test steps
    console.log('⚠️  Test implementation pending: ${testId}');
    expect(true).toBe(true);
  });`;
  }).join('\n');

  return `${imports}
${describeBlock}${tests}
});
`;
}

async function generateTests() {
  console.log('📊 Reading Excel file...');

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
      priority: 'medium' // Default, can be enhanced
    });
  });

  console.log(`\n✅ Found ${testGroups.size} test groups\n`);

  // Create test files
  let createdCount = 0;
  let skippedCount = 0;

  for (const [key, group] of testGroups.entries()) {
    const module = getModule(group.ursId);
    const dirPath = path.join('e2e', 'tests', module, group.ursId);
    const fileName = `${group.srsId}-${group.sdsId}.spec.ts`;
    const filePath = path.join(dirPath, fileName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipped (exists): ${key}`);
      skippedCount++;
      continue;
    }

    // Generate test spec
    const testContent = generateTestSpec(
      group.ursId,
      group.srsId,
      group.sdsId,
      group.tests
    );

    // Write file
    fs.writeFileSync(filePath, testContent);
    console.log(`✅ Created: ${filePath} (${group.tests.length} tests)`);
    createdCount++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${createdCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`   Total: ${testGroups.size} test groups`);
}

generateTests().catch(console.error);
