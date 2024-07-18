const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const saveImage = async (imageUrl) => {
  try {
    const response = await axios({
      url: imageUrl,
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(response.data, "binary");
    const outputDir = path.join(__dirname, "processed_images");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputFilename = `${uuidv4()}.jpg`;
    const outputPath = path.join(outputDir, outputFilename);
    // const outputPath = path.join(outputDir, path.basename(imageUrl));

    // Determine the format of the image
    const metadata = await sharp(imageBuffer).metadata();
    if (
      !["jpeg", "png", "webp", "tiff", "gif", "svg"].includes(metadata.format)
    ) {
      throw new Error(`Unsupported image format: ${metadata.format}`);
    }

    await sharp(imageBuffer).jpeg({ quality: 50 }).toFile(outputPath);

    return `${process.env.URL}/processed_images/${path.basename(imageUrl)}`;
  } catch (error) {
    console.error("Error processing image:", error.message);
    throw error;
  }
};

module.exports = { saveImage };
