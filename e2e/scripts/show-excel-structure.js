const ExcelJS = require('exceljs');

async function showStructure() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('requirements-excel-file/dataverse-Testcases-V4.xlsx');
  const ws = wb.worksheets[0];

  const map = new Map();

  ws.eachRow((row, num) => {
    if (num === 1) return;

    const urs = row.getCell(1).text?.trim();
    const srs = row.getCell(2).text?.trim();
    const sds = row.getCell(3).text?.trim();
    const testId = row.getCell(4).text?.trim();
    const summary = row.getCell(5).text?.trim();

    if (urs && srs && sds) {
      const key = `${urs}/${srs}/${sds}`;
      if (!map.has(key)) {
        map.set(key, {
          count: 0,
          tests: [],
          firstSummary: summary
        });
      }
      const entry = map.get(key);
      entry.count++;
      entry.tests.push(testId);
    }
  });

  console.log('URS/SRS/SDS Structure:');
  console.log('======================\n');

  for (const [key, data] of map.entries()) {
    console.log(`${key} (${data.count} tests)`);
    console.log(`  Tests: ${data.tests.slice(0, 5).join(', ')}${data.count > 5 ? '...' : ''}`);
    console.log(`  Example: ${data.firstSummary}`);
    console.log('');
  }
}

showStructure().catch(console.error);
