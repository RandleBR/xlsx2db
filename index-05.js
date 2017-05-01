const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers.json')

XlsxPopulate.fromFileAsync("./Customers10.xlsx")
  .then(workbook => {
    var usedRange = workbook.sheet("Sheet1").usedRange()
    var startRow = usedRange.startCell().rowNumber()
    startRow = startRow > 2? startRow : 2
    const ws = workbook.sheet("Sheet1")
      .range(startRow,
        usedRange.startCell().columnNumber(),
        usedRange.endCell().rowNumber(),
        usedRange.endCell().columnNumber())
      .value()
    var beginRow = '(',
      endRow = ')'
    var SQL = 'insert into ' + cfg.schema + '.' + cfg.table + ' ';
    SQL += beginRow + cfg.cols.map((col) => col.NAME).join(",") + endRow
    SQL += ' values\n'
    SQL += ws.map((row) => {
      return beginRow + row.join(',') + endRow
    }).join(',\n')
    console.log(SQL)
  }).catch((error) => {
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
