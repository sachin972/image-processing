const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const routes = require("./routes");
require("dotenv").config();

const app = express();

// Multer setup
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use("/api", routes);

// Serve static files from the processed_images directory
app.use(
  "/processed_images",
  express.static(path.join(__dirname, "processed_images"))
);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
