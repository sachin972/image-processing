const mongoose = require("mongoose");

const requsetSchema = new mongoose.Schema({
  requestID: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  inputImages: { type: [String], required: true },
  outputImages: { type: [String] },
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
  csvPath: { type: String },
});

module.exports = mongoose.model("Request", requsetSchema);
