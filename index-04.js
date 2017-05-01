const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers.json')

XlsxPopulate.fromFileAsync("./Customers10.xlsx")
  .then(workbook => {
    const ws = workbook.sheet("Sheet1").usedRange().value()

    var beginRow = '(', endRow = ')'
    var SQL = 'insert into ' + cfg.schema + '.' + cfg.table + ' ';
    SQL += beginRow + cfg.cols.map((col) => col.NAME).join(",") + endRow
    SQL += ' values '
    SQL +=  ws.map((row) => {
        return beginRow + row.join(',') + endRow
      }).join(',\n')
    console.log(SQL)
  }).catch( (error) =>{
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
