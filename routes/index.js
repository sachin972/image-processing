const express = require("express");
const multer = require("multer");
const imageController = require("../controllers/imageController");

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), imageController.uploadCSV);
router.get("/status/:requestId", imageController.checkStatus);
router.get("/download/:requestId", imageController.downloadCSV);
router.get('/', (req, res) => {
  res.send("Hello there");
})

module.exports = router;
