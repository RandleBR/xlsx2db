const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers.json')

XlsxPopulate.fromFileAsync("./Customers10.xlsx")
  .then(workbook => {
    const ws = workbook.sheet("Sheet1").usedRange().value()

    var beginRow = '(', endRow = ')'
    var SQL = 'insert into ' + cfg.schema + '.' + cfg.table + ' ';
    // ES6 version
    // SQL += beginRow + cfg.cols.map((col) => col.NAME).join(",") + endRow
    var columnNames =[]  // new array of the column Names
    for (colNumber in cfg.cols) {
      columnNames.push(cfg.cols[colNumber].NAME)  // push adds to end of columnNames
    }
    // var columnNamesWithCommas = ''
    // columnNamesWithCommas = columnNames.join(',');  // joins the array with commas
    // SQL += beginRow + columnNamesWithCommas + endRow
    SQL += beginRow + columnNames.join(',') + endRow
    SQL += ' values '
    console.log(SQL)

  }).catch( (error) =>{
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
