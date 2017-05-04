const XlsxPopulate = require('xlsx-populate');

// Load an existing workbook
XlsxPopulate.fromFileAsync("./Customers10.xlsx")
    .then(workbook => {
      const worksheet = workbook.sheet("Sheet1").usedRange().value();
      console.log(worksheet);
    });
