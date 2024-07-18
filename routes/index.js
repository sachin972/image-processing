const express = require("express");
const {
  handleCSVUpload,
  checkProcessingStatus,
  downloadCSV,
} = require("../controllers/imageController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/upload", upload.single("file"), handleCSVUpload);
router.get("/status/:requestId", checkProcessingStatus);
router.get("/download/:requestId", downloadCSV);

module.exports = router;
