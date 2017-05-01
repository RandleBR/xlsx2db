const _ = require('lodash')

function pad(number) {
  return _.padStart(number, 2, 0)
}
const Q = "'"
var d

module.exports = function(opts) {
  if ((opts.value == undefined) && opts.allowNull) return 'null'
  switch (opts.type) {
    case "DATE":
    case "TIMESTMP":
    case "TIME":
      if (isNaN(opts.value)) {
        throw new Error(`error converting row ${opts.rowNum}, column ${opts.colNum} to a ${opts.type}`)
      }
      try {
        d = opts.numberToDate(opts.value)
      } catch (e) {
        throw new Error(`error ${e} converting row ${opts.rowNum}, column ${opts.colNum} to a ${opts.type}`)
      }
      switch (opts.type) {
        case "DATE":
          return Q + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + Q
        case "TIMESTMP":
          return Q + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
            ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + Q
        case "TIME":
          return Q + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + Q
      }
    case "NUMERIC":
    case "INTEGER":
    case "DECIMAL":
    case "FLOAT":
    case "DECFLOAT":
    case "BINARY":
    case "BIGINT":
    case "SMALLINT":
      if (isNaN(opts.value)) {
        throw new Error(`error converting row ${opts.rowNum}, column ${opts.colNum} to a ${opts.type}`)
      }
      return opts.value
    default:
      try {
        if (opts.value.length > opts.len) {
          opts.value = opts.value.substring(0, opts.len)
        }
        //treat as string - replace any sinqle quote with 2 single quotes
        return Q + opts.value.toString().replace(/'/g, Q + Q) + Q
      } catch (e) {
        throw new Error(`Hey,error converting row ${opts.rowNum}, column ${opts.colNum} to a ${opts.type}`)
      }
  }
}
