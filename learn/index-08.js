const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers2.json')
const formatCell = require('./formatCell')

XlsxPopulate.fromFileAsync(cfg.xlsxFile)
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
    SQL += ws.map((row, rowNum) => {
      return beginRow + cfg.cols.map(function(col, colNum) {
        let opts = {
          value: row[col.COL],
          type: col.TYPE,
          len: col.LEN,
          allowNull: (col.NULLABLE == '1'),
          numberToDate: XlsxPopulate.numberToDate,
          colNum: colNum + 1,
          rowNum: rowNum + startRow
        }
        return formatCell(opts)
      }).join(',') + endRow
    }).join(',\n')

    // The SQL statement is ready to execute!
    var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a')
    var dbconn = new db.dbconn(); // Create a connection object.
    dbconn.conn("*LOCAL", function() {
      dbconn.setConnAttr(db.SQL_ATTR_AUTOCOMMIT, db.SQL_TXN_NOCOMMIT)
    })
    var stmt = new db.dbstmt(dbconn)
    stmt.exec(SQL, function() {
      stmt.close() // Clean up the statement object (PTF SI64401)
      dbconn.disconn() // Disconnect from the database.
      dbconn.close() // Clean up the connection object (PTF SI64401)
    })
  }).catch((error) => {
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
