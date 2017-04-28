const _ = require('lodash')

function pad(number) {
  return _.padStart(number, 2, 0)
}
const Q = "'"
var d

module.exports = function(value, type, len, nullable, numberToDate) {
  if ((value == undefined) && nullable) return 'null'
  switch (type) {
    case "DATE":
    case "TIMESTMP":
    case "TIME":
      if (isNaN(value)) throw new Error('error converting cell to a number:' + value)
      try {
        d = numberToDate(value)
      } catch (e) {
        throw new Error('error converting cell to a ' + type + ' error:' + e)
      }
      switch (type) {
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
      if (isNaN(value)) throw new Error('error converting cell to a number:' + value)
      return value
    default:
      try {
        if (value.length > len) {
          value = value.substring(0, len)
        }
        //treat as string - replace any sinqle quote with 2 single quotes
        return Q + value.toString().replace(/'/g, Q + Q) + Q
      } catch (e) {
        return Q + value + Q
      }
  }
}
