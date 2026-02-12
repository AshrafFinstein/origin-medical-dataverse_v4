import ExcelJS from 'exceljs';
import * as path from 'path';

export interface TestCase {
  urs: string;
  srs: string;
  sds: string;
  testCaseId: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
  testStatus: string;
  testType: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'inactive';
}

export class ExcelParser {
  private workbook: ExcelJS.Workbook;

  constructor() {
    this.workbook = new ExcelJS.Workbook();
  }

  /**
   * Read test cases from Excel file
   */
  async readTestCases(filePath: string): Promise<TestCase[]> {
    this.workbook = new ExcelJS.Workbook(); // Create fresh workbook
    await this.workbook.xlsx.readFile(filePath);
    const worksheet = this.workbook.getWorksheet(1);
    const testCases: TestCase[] = [];

    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    worksheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;

      const testStatus = row.getCell(8).text || '';
      const testType = row.getCell(9).text || '';

      const testCase: TestCase = {
        urs: row.getCell(1).text,
        srs: row.getCell(2).text,
        sds: row.getCell(3).text,
        testCaseId: row.getCell(4).text,
        summary: row.getCell(5).text,
        description: row.getCell(6).text,
        acceptanceCriteria: row.getCell(7).text,
        testStatus: testStatus,
        testType: testType,
        assignee: row.getCell(10).text || '',
        priority: testType.toLowerCase().includes('regression') ? 'high' : 'medium',
        status: testStatus.toLowerCase() === 'pass' || testStatus === '' ? 'active' : 'inactive',
      };

      if (testCase.status === 'active') {
        testCases.push(testCase);
      }
    });

    return testCases;
  }

  /**
   * Write test results to Excel file
   */
  async writeTestResults(
    filePath: string,
    results: Array<{
      testCaseId: string;
      status: 'passed' | 'failed' | 'skipped';
      executionTime: number;
      error?: string;
    }>
  ) {
    const worksheet = this.workbook.addWorksheet('Test Results');

    // Add headers
    worksheet.columns = [
      { header: 'Test Case ID', key: 'testCaseId', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Execution Time (ms)', key: 'executionTime', width: 20 },
      { header: 'Error', key: 'error', width: 50 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
    ];

    // Add data
    results.forEach(result => {
      worksheet.addRow({
        ...result,
        timestamp: new Date().toISOString(),
      });
    });

    // Apply styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    await this.workbook.xlsx.writeFile(filePath);
  }

  /**
   * Generate test structure from Excel
   */
  async generateTestStructure(filePath: string): Promise<Map<string, Map<string, TestCase[]>>> {
    const testCases = await this.readTestCases(filePath);
    const structure = new Map<string, Map<string, TestCase[]>>();

    testCases.forEach(testCase => {
      if (!structure.has(testCase.urs)) {
        structure.set(testCase.urs, new Map());
      }

      const ursMap = structure.get(testCase.urs)!;
      if (!ursMap.has(testCase.srs)) {
        ursMap.set(testCase.srs, []);
      }

      ursMap.get(testCase.srs)!.push(testCase);
    });

    return structure;
  }

  /**
   * Read test cases in batches for large Excel files (2000-3000 test cases)
   * Supports filtering and progress tracking
   */
  async readTestCasesBatch(
    filePath: string,
    options: {
      batchSize?: number;
      filterPriority?: 'high' | 'medium' | 'low';
      filterStatus?: 'active' | 'inactive';
      filterModule?: string;
      onProgress?: (processed: number, total: number) => void;
    } = {}
  ): Promise<TestCase[]> {
    this.workbook = new ExcelJS.Workbook(); // Create fresh workbook
    await this.workbook.xlsx.readFile(filePath);
    const worksheet = this.workbook.getWorksheet(1);

    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    const testCases: TestCase[] = [];
    const totalRows = worksheet.rowCount - 1; // Exclude header
    let processedRows = 0;
    const batchSize = options.batchSize || 100;

    worksheet.eachRow((row, rowNumber) => {
      // Skip header
      if (rowNumber === 1) return;

      const testStatus = row.getCell(8).text || '';
      const testType = row.getCell(9).text || '';

      const testCase: TestCase = {
        urs: row.getCell(1).text,
        srs: row.getCell(2).text,
        sds: row.getCell(3).text,
        testCaseId: row.getCell(4).text,
        summary: row.getCell(5).text,
        description: row.getCell(6).text,
        acceptanceCriteria: row.getCell(7).text,
        testStatus: testStatus,
        testType: testType,
        assignee: row.getCell(10).text || '',
        priority: testType.toLowerCase().includes('regression') ? 'high' : 'medium',
        status: testStatus.toLowerCase() === 'pass' || testStatus === '' ? 'active' : 'inactive',
      };

      // Apply filters
      if (options.filterPriority && testCase.priority !== options.filterPriority) {
        return;
      }
      if (options.filterStatus && testCase.status !== options.filterStatus) {
        return;
      }
      if (options.filterModule && !testCase.urs.includes(options.filterModule)) {
        return;
      }

      testCases.push(testCase);
      processedRows++;

      // Report progress
      if (options.onProgress && processedRows % batchSize === 0) {
        options.onProgress(processedRows, totalRows);
      }
    });

    // Final progress update
    if (options.onProgress) {
      options.onProgress(processedRows, totalRows);
    }

    return testCases;
  }

  /**
   * Get statistics about test cases in Excel file
   */
  async getTestCaseStats(filePath: string): Promise<{
    total: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    byModule: Record<string, number>;
  }> {
    const testCases = await this.readTestCasesBatch(filePath);

    const stats = {
      total: testCases.length,
      byPriority: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byModule: {} as Record<string, number>,
    };

    testCases.forEach(tc => {
      // Priority stats
      stats.byPriority[tc.priority] = (stats.byPriority[tc.priority] || 0) + 1;

      // Status stats
      stats.byStatus[tc.status] = (stats.byStatus[tc.status] || 0) + 1;

      // Module stats (extract from URS)
      const module = tc.urs.split('-')[0];
      stats.byModule[module] = (stats.byModule[module] || 0) + 1;
    });

    return stats;
  }
}
