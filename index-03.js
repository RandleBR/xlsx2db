const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers.json')

XlsxPopulate.fromFileAsync("./Customers10.xlsx")
  .then(workbook => {
    const ws = workbook.sheet("Sheet1").usedRange().value()

    var beginRow = '(', endRow = ')'
    var SQL = 'insert into ' + cfg.schema + '.' + cfg.table + ' ';
    SQL += beginRow + cfg.cols.map((col) => col.NAME).join(",") + endRow
    console.log(SQL)

  }).catch( (error) =>{
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
