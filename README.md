# xlsx2db
Transform xlsx spreadsheet to a DB2 for i database.  

Intended to be executed at a command line as either node index or npm start.

```
  Usage: index [options]

  Write XLSX spreadsheet rows to a DB2 database.
     The config contains the path and name of the xlsxFile,
     the name of the Sheet to extract,
     the name of the db2 schema and table.

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    --config <path>       JSON configuration path and file name
    --xlsx [path]         Spreadsheet path and name
    --schema [name]       database name (library.name)
    --table [name]        database table name
    --sheet [name]        Sheet name in xlsxFile. Defaults to first sheet
    --startRow [integer]  Row number to start export. Defaults to first row
```

getConfig.js will build the JSON needed for the xlsx2db --config required.  The
arguments for getConfig.js are:

```
  Usage: getConfig [options]

  Create a JSON file of a DB2 table and column configuration.
     Intended for use with the xls2db project.

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    --schema <name>       DB2 schema
    --table <name>        DB2 table name
    --xlsx [name]         Optional name and path of xlsx file
    --sheet [name]        Optional sheet name in xlsxFile. Defaults to first sheet
    --startRow [integer]  Optional Row number to start export. Defaults to first row
```
