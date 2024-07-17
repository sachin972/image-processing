const axios = require("axios");
const sharp = require("sharp");
const Request = require("../models/Request");
const imageWorker = require("../workers/imageWorker");

exports.processImages = async (requestId, imageUrls) => {
  imageWorker.processImages(requestId, imageUrls);
};
