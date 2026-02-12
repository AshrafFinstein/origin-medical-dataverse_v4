import { Command } from 'commander';
import { ExcelParser } from '../utils/excel-parser';
import { TestGenerator } from '../utils/test-generator';
import * as path from 'path';

const program = new Command();

program
  .name('generate-tests')
  .description('Generate Playwright tests from Excel test cases')
  .requiredOption('-e, --excel <path>', 'Path to Excel file')
  .option('-p, --priority <priority>', 'Filter by priority (high, medium, low)')
  .option('-m, --module <module>', 'Filter by module (URS prefix)')
  .option('-s, --status <status>', 'Filter by status (active, inactive)', 'active')
  .option('-d, --dry-run', 'Preview test structure without generating files')
  .option('--skeleton', 'Generate skeleton tests only (no implementation)')
  .option('--stats', 'Show test case statistics from Excel file')
  .option('--clean', 'Clean all generated tests before generating new ones')
  .parse();

const options = program.opts();

async function main() {
  const excelPath = path.resolve(options.excel);
  const parser = new ExcelParser();

  // Show statistics if requested
  if (options.stats) {
    console.log('📊 Analyzing Excel file...\n');
    const stats = await parser.getTestCaseStats(excelPath);

    console.log(`Total Test Cases: ${stats.total}\n`);

    console.log('By Priority:');
    for (const [priority, count] of Object.entries(stats.byPriority)) {
      console.log(`  ${priority}: ${count}`);
    }

    console.log('\nBy Status:');
    for (const [status, count] of Object.entries(stats.byStatus)) {
      console.log(`  ${status}: ${count}`);
    }

    console.log('\nBy Module:');
    const sortedModules = Object.entries(stats.byModule).sort((a, b) => b[1] - a[1]);
    for (const [module, count] of sortedModules) {
      console.log(`  ${module}: ${count}`);
    }

    return;
  }

  // Read test cases with filters
  console.log('📊 Reading Excel test cases...');
  console.log(`   File: ${excelPath}`);
  if (options.priority) console.log(`   Filter Priority: ${options.priority}`);
  if (options.module) console.log(`   Filter Module: ${options.module}`);
  console.log(`   Filter Status: ${options.status}\n`);

  const testCases = await parser.readTestCasesBatch(excelPath, {
    filterPriority: options.priority,
    filterStatus: options.status,
    filterModule: options.module,
    onProgress: (processed, total) => {
      process.stdout.write(`\r   Processed: ${processed}/${total}`);
    },
  });

  console.log(`\n✅ Found ${testCases.length} test cases\n`);

  // Dry run - show structure
  if (options.dryRun) {
    console.log('🔍 Dry run - showing test structure:\n');

    // Generate structure from filtered test cases
    const structure = new Map<string, Map<string, Map<string, number>>>();

    testCases.forEach(tc => {
      if (!structure.has(tc.urs)) {
        structure.set(tc.urs, new Map());
      }
      const ursMap = structure.get(tc.urs)!;

      if (!ursMap.has(tc.srs)) {
        ursMap.set(tc.srs, new Map());
      }
      const srsMap = ursMap.get(tc.srs)!;

      if (!srsMap.has(tc.sds)) {
        srsMap.set(tc.sds, 0);
      }
      srsMap.set(tc.sds, srsMap.get(tc.sds)! + 1);
    });

    for (const [urs, srsMap] of structure.entries()) {
      console.log(`📁 ${urs}/`);
      for (const [srs, sdsMap] of srsMap.entries()) {
        console.log(`   📁 ${srs}/`);
        for (const [sds, count] of sdsMap.entries()) {
          console.log(`      📄 ${sds}.spec.ts (${count} tests)`);
        }
      }
    }

    return;
  }

  // Clean existing tests if requested
  if (options.clean) {
    console.log('🧹 Cleaning existing generated tests...');
    const generator = new TestGenerator('./e2e/tests/generated');
    generator.cleanGeneratedTests();
    console.log('✅ Cleaned\n');
  }

  // Generate tests
  console.log('🔨 Generating test files...\n');

  const generator = new TestGenerator('./e2e/tests/generated');

  // For now, use the existing generator
  // In the future, we can add skeleton mode support
  await generator.generateTestsFromExcel(excelPath);

  console.log('\n✅ Test generation complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review generated tests in e2e/tests/generated/');
  console.log('   2. Implement test steps (replace TODO comments)');
  console.log('   3. Run tests: npm run test:parallel');
}

main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
