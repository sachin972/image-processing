const createCsvWriter = require("csv-writer").createObjectCsvWriter;

exports.generateCSV = async (
  requestId,
  productName,
  inputImages,
  outputImages
) => {
  const csvWriter = createCsvWriter({
    path: `./output_csv/${requestId}.csv`,
    header: [
      {
        id: "serialNumber",
        title: "S. No.",
      },
      {
        id: "productName",
        title: "Product Name",
      },
      {
        id: "inputImageUrls",
        title: "Input Image Urls",
      },
      {
        id: "outputImageUrls",
        title: "Output Image Urls",
      },
    ],
  });

  const records = inputImages.map((inputImageUrl, index) => ({
    serialNumber: index + 1,
    productName,
    inputImageUrls: inputImageUrl,
    outputImageUrls: outputImages[index],
  }));

  await csvWriter.writeRecords(records);

  return `./output_csv/${requestId}.csv`;
};
