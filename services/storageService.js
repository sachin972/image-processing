const { Client, Storage } = require("appwrite");
const { Blob } = require("blob-polyfill"); // Import Blob polyfill
const fileType = require("file-type");
const { InputFile } = require("node-appwrite/file");

// Initialize the Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("6699238e000c10852958"); // Your project ID
// .setKey(process.env.APPWRITE_API_KEY); // Your secret API key

const storage = new Storage(client);

// const bufferToFile = async (buffer, filename) => {
//   const type = await fileType.fromBuffer(buffer);
//   if (!type) throw new Error("Unsupported file type");
//   const blob = new Blob([buffer], { type: type.mime });
//   return new File([blob], filename, { type: type.mime });
// };

// Upload a file
async function uploadFile(file, fileName) {
  try {
    const fileData = await InputFile.fromBuffer(file, fileName);
    const response = await storage.createFile(
      "669923ef0015148ea080",
      "unique()",
      fileData
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Get a file
async function getFile(fileId) {
  try {
    const response = await storage.getFile(
      process.env.APPWRITE_PROJECT_ID,
      fileId
    );
    return response;
  } catch (error) {
    console.error("Error getting file:", error);
    throw error;
  }
}

// Update a file
async function updateFile(fileId, file) {
  try {
    await deleteFile(process.env.APPWRITE_PROJECT_ID, fileId);
    const response = await uploadFile(process.env.APPWRITE_PROJECT_ID, file);
    return response;
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}

// Delete a file
async function deleteFile(fileId) {
  try {
    const response = await storage.deleteFile(
      process.env.APPWRITE_PROJECT_ID,
      fileId
    );
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  getFile,
  updateFile,
  deleteFile,
};
