const axios = require("axios");
const sharp = require("sharp");
const Request = require("../models/Request");
const fs = require("fs");
const path = require("path");
const csvGenerator = require("../utils/csvGenerator");

const saveImage = async (buffer, fileName) => {
  const outputPath = path.resolve(__dirname, "../processed_images", fileName);
  fs.writeFileSync(outputPath, buffer);

  return `http://localhost:3000/processed_images/${fileName}`;
};

exports.processImages = async (requestId, imageUrls) => {
  const request = await Request.findOne({ requestId });
  if (!request) {
    return;
  }

  request.status = "processing";
  await request.save();

  const outputImages = [];

  for (const [index, url] of imageUrls.entries()) {
    const response = await axios({ url, responseType: "arraybuffer" });
    const buffer = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();
    const fileName = `${requestId}_${index}.jpg`;
    const outputUrl = await saveImage(buffer, fileName);
    outputImages.push(outputUrl);
  }

  request.status = "completed";
  request.outputImages = outputImages;
  await request.save();

  const csvPath = await csvGenerator.generateCSV(
    requestId,
    request.productName,
    imageUrls,
    outputImages
  );
  request.csvPath = csvPath;
  await request.save();

  if (process.env.WEBHOOK_URL) {
    axios.post(process.env.WEBHOOK_URL, {
      requestId,
      status: request.status,
      outputImages,
    });
  }
};
