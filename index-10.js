const XlsxPopulate = require('xlsx-populate');
const formatCell = require('./formatCell')
const opts = require('commander')

opts
  .version('1.0.0')
  .description(`Write XLSX spreadsheet rows to a DB2 database.
     The config contains the path and name of the xlsxFile,
     the name of the Sheet to extract,
     the name of the db2 schema and table.`)
  .option('--config <path>', 'JSON configuration path and file name')
  .option('--xlsx [path]', 'Spreadsheet path and name')
  .option('--schema [name]', 'database name (library.name)')
  .option('--table [name]', 'database table name')
  .option('--sheet [name]', 'Sheet name in xlsxFile. Defaults to first sheet')
  .option('--startRow [integer]', 'Row number to start export. Defaults to first row', parseInt)
  .parse(process.argv)

const cfg = require(opts.config)
if (opts.xlsx) cfg.xlsx = opts.xlsx
if (opts.schema) cfg.schema = opts.schema
if (opts.table) cfg.table = opts.table
if (opts.sheet) cfg.sheet = opts.sheet
if (opts.startRow) cfg.startRow = opts.startRow

if (!cfg.sheet) cfg.sheet = 0 // a number can be used- 0 is the first sheet

XlsxPopulate.fromFileAsync(cfg.xlsx)
  .then(workbook => {
    var usedRange = workbook.sheet(cfg.sheet).usedRange()
    var startRow = usedRange.startCell().rowNumber()
    startRow = startRow > cfg.startRow ? startRow : cfg.startRow
    const ws = workbook.sheet(cfg.sheet)
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
