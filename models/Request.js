const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requestID: mongoose.Schema.Types.ObjectId,
  status: { type: String, required: true },
  data: { type: Array, required: true },
  processedData: { type: Array, default: [] },
});

module.exports = mongoose.model("Request", requestSchema);
