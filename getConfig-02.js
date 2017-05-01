// getConfig.js - Create a JSON file with the db2 table name and columns
// to be used with the xlsx2db application
var opts = require('commander')
opts
  .version('1.0.0')
  .description(`Gets the columns from a DB2 database and writes them to
    a JSON file with the same name as the table`)
  .option('--schema <string>', 'database schema name (library)')
  .option('--table <string>','database table name')
  .parse(process.argv)

cfg = {
  schema: opts.schema,
  table: opts.table
}
var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a')


var dbconn = new db.dbconn(); // Create a connection object.
dbconn.conn("*LOCAL")
var stmt = new db.dbstmt(dbconn)
var SQLstmt =
  `select ORDINAL_POSITION -1 as col, COLUMN_NAME as name, TYPE_NAME as type,
   COLUMN_SIZE as len, DECIMAL_DIGITS as Decimal, NULLABLE
   from sysibm.sqlcolumns
   where table_schem = UPPER('${cfg.schema}') and
   table_name = UPPER('${cfg.table}')`

stmt.execSync(SQLstmt, function(cols) {
  if (cols.length  == 0) {
    throw new Error(`No data returned for ${cfg.schema}, table ${cfg.table}`)
  }
  cfg.cols = cols
  var fsOut = require('fs').createWriteStream(cfg.table + '.json')
  fsOut.write(JSON.stringify(cfg,null,'  '), function() {
    fsOut.end
    stmt.close() // Clean up the statement object.
    dbconn.disconn() // Disconnect from the database.
    dbconn.close() // Clean up the connection object.
  })
})
