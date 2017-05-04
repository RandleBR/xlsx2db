const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers2.json')
const formatCell = require('./formatCell')

var formatSQL = function(rows) {
  let beginRow = '(',
    endRow = ')'
  let mapRows = function(row, rowNum) {
    let mapCols = function(col, colNum) {
      let opts = {
        value: row[col.COL],
        type: col.TYPE,
        len: col.LEN,
        allowNull: (col.NULLABLE == '1'),
        numberToDate: XlsxPopulate.numberToDate,
        colNum: colNum + 1,
        rowNum: rowNum + rows.startRow
      }
      return formatCell(opts)
    }
    return beginRow + cfg.cols.map(mapCols).join(',') + endRow
  }

  var SQL = 'insert into ' + cfg.schema + '.' + cfg.table + ' ' +
    beginRow + cfg.cols.map((col) => col.NAME).join(",") + endRow +
    ' values\n' +
    rows.ws.map(mapRows).join(',\n')
  console.log(SQL)
}

XlsxPopulate.fromFileAsync("./Customers10.xlsx")
  .then(workbook => {
    var usedRange = workbook.sheet("Sheet1").usedRange()
    var rows = {}
    rows.startRow = usedRange.startCell().rowNumber()
    rows.startRow = rows.startRow > 2 ? rows.startRow : 2
    rows.ws = workbook.sheet("Sheet1")
      .range(rows.startRow,
        usedRange.startCell().columnNumber(),
        usedRange.endCell().rowNumber(),
        usedRange.endCell().columnNumber())
      .value()
    return rows
  }).then(formatSQL)
  .catch((error) => {
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
