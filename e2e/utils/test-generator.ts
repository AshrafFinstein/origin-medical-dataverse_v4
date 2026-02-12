import * as fs from 'fs';
import * as path from 'path';
import { ExcelParser, TestCase } from './excel-parser';

export class TestGenerator {
  private parser: ExcelParser;
  private baseTestPath: string;

  constructor(baseTestPath: string = './e2e/tests') {
    this.parser = new ExcelParser();
    this.baseTestPath = baseTestPath;
  }

  /**
   * Generate test files from Excel
   */
  async generateTestsFromExcel(excelFilePath: string) {
    const structure = await this.parser.generateTestStructure(excelFilePath);

    for (const [urs, srsMap] of structure.entries()) {
      const ursPath = path.join(this.baseTestPath, urs);
      this.ensureDirectoryExists(ursPath);

      for (const [srs, testCases] of srsMap.entries()) {
        const srsPath = path.join(ursPath, srs);
        this.ensureDirectoryExists(srsPath);

        // Group test cases by SDS
        const sdsCases = this.groupBySDS(testCases);

        for (const [sds, cases] of sdsCases.entries()) {
          const testFilePath = path.join(srsPath, `${sds}.spec.ts`);
          const testContent = this.generateTestContent(urs, srs, sds, cases);
          fs.writeFileSync(testFilePath, testContent);
          console.log(`Generated: ${testFilePath}`);
        }
      }
    }
  }

  /**
   * Group test cases by SDS
   */
  private groupBySDS(testCases: TestCase[]): Map<string, TestCase[]> {
    const grouped = new Map<string, TestCase[]>();

    testCases.forEach(testCase => {
      if (!grouped.has(testCase.sds)) {
        grouped.set(testCase.sds, []);
      }
      grouped.get(testCase.sds)!.push(testCase);
    });

    return grouped;
  }

  /**
   * Generate test file content
   */
  private generateTestContent(
    urs: string,
    srs: string,
    sds: string,
    testCases: TestCase[]
  ): string {
    const imports = `import { test, expect } from '../../../fixtures/auth.fixture';
// Import page objects as needed
// import { EpicPage } from '../../../pages/epic.page';
// import { ProjectPage } from '../../../pages/project.page';

`;

    const describe = `test.describe('${urs} > ${srs} > ${sds}', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Page is already authenticated via fixture
    // No need for manual login
  });

`;

    const tests = testCases.map(tc => this.generateSingleTest(tc)).join('\n\n');

    const closing = '});';

    return imports + describe + tests + '\n' + closing;
  }

  /**
   * Generate a single test case
   */
  private generateSingleTest(testCase: TestCase): string {
    // Parse description to extract steps
    const descriptionLines = testCase.description.split('\n').filter(line => line.trim());
    const steps = descriptionLines.slice(1); // Skip first line (usually "Feature: ...")

    const stepsComment = steps.length > 0
      ? steps.map((step, index) => `    // Step ${index + 1}: ${step}`).join('\n')
      : '    // See description and acceptance criteria for test steps';

    // Clean up summary and acceptance criteria for display
    const summary = testCase.summary.replace(/\n/g, ' ').trim();
    const acceptanceCriteria = testCase.acceptanceCriteria.replace(/\n/g, ' ').trim();

    return `  test('${testCase.testCaseId}: ${summary}', async ({ authenticatedPage }) => {
    // Test Case ID: ${testCase.testCaseId}
    // Priority: ${testCase.priority}
    // Test Type: ${testCase.testType}
    // Assignee: ${testCase.assignee}
    //
    // Description:
    // ${testCase.description.split('\n').map(line => `// ${line}`).join('\n    ')}
    //
    // Acceptance Criteria:
    // ${acceptanceCriteria}

${stepsComment}

    // TODO: Implement test steps
    // Example implementation:
    // const page = new PageObject(authenticatedPage);
    // await page.goto();
    // await page.performAction();
    // await page.verifyResult();

    expect(true).toBe(true);
  });`;
  }

  /**
   * Ensure directory exists
   */
  private ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Clean all generated tests
   */
  cleanGeneratedTests() {
    if (fs.existsSync(this.baseTestPath)) {
      fs.rmSync(this.baseTestPath, { recursive: true, force: true });
      console.log('Cleaned all generated tests');
    }
  }
}

// CLI usage
if (require.main === module) {
  const generator = new TestGenerator();
  const excelPath = process.argv[2];

  if (!excelPath) {
    console.error('Usage: ts-node test-generator.ts <excel-file-path>');
    process.exit(1);
  }

  generator.generateTestsFromExcel(excelPath)
    .then(() => console.log('Test generation complete'))
    .catch(err => console.error('Error:', err));
}
