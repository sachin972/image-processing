const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadFile } = require("./storageService");
// const storageService = require("./storageService.ts");

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

    // await addFile(imageBuffer);
    // storageService.addFile(imageBuffer);
    const fileData = await uploadFile(imageBuffer, outputFilename);

    return `https://cloud.appwrite.io/v1/storage/buckets/${fileData.bucketId}/files/${fileData.$id}/preview?project=6699238e000c10852958`;
  } catch (error) {
    console.error("Error processing image:", error.message);
    throw error;
  }
};

module.exports = { saveImage };
