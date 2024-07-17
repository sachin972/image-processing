const parse = require("csv-parse");

exports.parseCSV = (csvData) => {
  try {
    // const records = [];
    // parse(csvData, { columns: true, trim: true }, (err, rows) => {
    //   if (err) throw err;

    //   rows.forEach((row) => {
    //     const inputImages = row["Input Image Urls"]
    //       .split(",")
    //       .map((url) => url.trim());
    //     records.push({ productName: row["Product Name"], inputImages });
    //   });
    // });

    // return { valid: true, data: records };
    const records = parse(csvData, { columns: true, trim: true });
    const data = records.map((record, index) => ({
      serialNumber: index + 1,
      productName: record["Product Name"],
      inputImages: record["Input Image Urls"].split(","),
    }));
    return { valid: true, data };
  } catch (error) {
    return { valid: false, error };
  }
};
