const XlsxPopulate = require('xlsx-populate');
const cfg = require('./customers2.json')
const formatCell = require('./formatCell')

XlsxPopulate.fromFileAsync(cfg.xlsxFile)
  .then(workbook => {
    var uRange = workbook.sheet(cfg.sheet).usedRange()
    var firstRow = uRange._minRowNumber > cfg.firstRow ? uRange._minRowNumber : cfg.firstRow
    const ws = workbook.sheet(cfg.sheet)
      .range(firstRow, 1, uRange._maxRowNumber, uRange._maxColumnNumber)
      .value()
    var beginRow = '(',
      endRow = ')'
    var SQL = 'insert into ' + cfg.schema + '.' + cfg.table + ' ';
    SQL += beginRow + cfg.cols.map((col) => col.NAME).join(",") + endRow
    SQL += ' values\n'
    SQL += ws.map((row) => {
      return beginRow + cfg.cols.map(function(col, colNum) {
        return formatCell(row[col.COL], col.TYPE, col.LEN, (col.NULLABLE == '1'))
      }).join(',') + endRow
    }).join(',\n')

    var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a')
    var dbconn = new db.dbconn(); // Create a connection object.
    dbconn.conn("*LOCAL", function() {
      dbconn.setConnAttr(db.SQL_ATTR_AUTOCOMMIT, db.SQL_TXN_NOCOMMIT)
    })
    var stmt = new db.dbstmt(dbconn)
    stmt.exec(SQL, function() {
      stmt.close() // Clean up the statement object (PTF SI64401)
      dbconn.disconn() // Disconnect from the database.
      dbconn.close()  // Clean up the connection object (PTF SI64401)
    })
  }).catch((error) => {
    throw new Error('XlsxPopulate.fromFileAsync:' + error)
  });
