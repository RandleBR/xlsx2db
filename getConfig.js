// getConfig.js - Create a JSON file with the db2 table name and columns
// to be used with the xlsx2db application
const opts = require('commander')

opts
  .version('1.0.0')
  .description(`Create a JSON file of a DB2 table and column configuration.
     Intended for use with the xls2db project.`)
  .option('--schema <name>', 'DB2 schema')
  .option('--table <name>', 'DB2 table name')
  .option('--xlsx [name]', 'Optional name and path of xlsx file')
  .option('--sheet [name]', 'Optional sheet name in xlsxFile. Defaults to first sheet')
  .option('--startRow [integer]', 'Optional Row number to start export. Defaults to first row', parseInt)
  .parse(process.argv)

var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a')
var cfg = {
  schema : opts.schema.toUpperCase(),
  table : opts.table.toUpperCase()
}
if (opts.xlsx) cfg.xlsx = opts.xlsx
if (opts.sheet) cfg.sheet = opts.sheet
if (opts.startRow) cfg.startRow = opts.startRow

var dbconn = new db.dbconn('db2i/lib/db2a'); // Create a connection object.
dbconn.conn("*LOCAL")
var stmt = new db.dbstmt(dbconn)
var SQLstmt =
  `select ORDINAL_POSITION -1 as col, COLUMN_NAME as name, TYPE_NAME as type,
   COLUMN_SIZE as len, DECIMAL_DIGITS as Decimal, NULLABLE
   from sysibm.sqlcolumns
   where table_schem = '${cfg.schema}' and table_name = '${cfg.table}'`

stmt.exec(SQLstmt, function(cols) {
  cfg.cols = cols
  var fsOut = require('fs').createWriteStream(cfg.table + '.json')
  fsOut.write(JSON.stringify(cfg), function() {
    fsOut.end
    stmt.close()      // Clean up the statement object.
    dbconn.disconn()  // Disconnect from the database.
    dbconn.close()    // Clean up the connection object.
  })
})
