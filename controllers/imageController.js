const { v4: uuidv4 } = require("uuid");
const Request = require("../models/Request");
const csvParser = require("../utils/csvParser");
const imageService = require("../services/imageService");

exports.uploadCSV = async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).send("No file uploaded");

  const { valid, data, error } = csvParser.parseCSV(file.buffer.toString());

  if (!valid) {
    return res.status(400).send(`Invalid CSV format: ${error}`);
  }

  const requestId = uuidv4();
  const request = new Request({
    requestId,
    productName: data[0].productName,
    inputImages: data[0].inputImages,
  });

  await request.save();
  imageService.processImages(requestId, data[0].inputImages);

  res.status(202).send({ requestId });
};

exports.checkStatus = async (req, res) => {
  const { requestId } = req.params;

  const request = await Request.findOne({ requestId }, { timeout: 60000 });

  if (!request) {
    return res.status(404).send("Request not found");
  }

  res
    .status(200)
    .send({ status: request.status, outputImages: request.outputImages });
};

exports.downloadCSV = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ requestId }, { timeout: 60000 });

  if (!request || !request.csvPath)
    return res.status(404).send("CSV not found");
  res.download(request.csvPath);
};
