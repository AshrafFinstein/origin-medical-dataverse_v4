import ExcelJS from 'exceljs';

async function inspectExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('requirements-excel-file/dataverse-Testcases-V4.xlsx');

  console.log(`\n📊 Excel File Inspection\n`);
  console.log(`Total Worksheets: ${workbook.worksheets.length}\n`);

  workbook.worksheets.forEach((sheet, index) => {
    console.log(`--- Worksheet ${index + 1} ---`);
    console.log(`Name: ${sheet.name}`);
    console.log(`Row Count: ${sheet.rowCount}`);
    console.log(`Column Count: ${sheet.columnCount}`);

    if (sheet.rowCount > 0) {
      console.log(`\nFirst row (headers):`);
      const firstRow = sheet.getRow(1);
      firstRow.eachCell((cell, colNumber) => {
        console.log(`  Column ${colNumber}: ${cell.text}`);
      });

      if (sheet.rowCount > 1) {
        console.log(`\nSample data (row 2):`);
        const dataRow = sheet.getRow(2);
        dataRow.eachCell((cell, colNumber) => {
          const text = cell.text.length > 50 ? cell.text.substring(0, 50) + '...' : cell.text;
          console.log(`  Column ${colNumber}: ${text}`);
        });
      }
    }
    console.log('');
  });
}

inspectExcel().catch(console.error);
